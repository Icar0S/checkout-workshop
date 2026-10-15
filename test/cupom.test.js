// Um teste por criterio de SPEC.md, na mesma ordem.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { carrinhos, cupons } from '../src/data.js';
import * as pricing from '../src/pricing.js';
import { calcularTotal, calcularDesconto, cupomValido, FRETE_SUDESTE, FRETE_DEMAIS } from '../src/pricing.js';
import { app } from '../src/server.js';

const HOJE = new Date(2026, 9, 14);

function carrinho(couponCode, precoCentavos, cep = '01310100') {
  return { id: 'x', cep, couponCode, items: [{ id: 'p', nome: 'Item', precoCentavos, qtd: 1 }] };
}

async function get(caminho) {
  const servidor = app.listen(0);
  try {
    const { port } = servidor.address();
    const resposta = await fetch(`http://127.0.0.1:${port}${caminho}`);
    const tipo = resposta.headers.get('content-type');
    const corpo = tipo.startsWith('application/json') ? await resposta.json() : await resposta.text();
    return { status: resposta.status, corpo };
  } finally {
    servidor.close();
  }
}

// Cadastra um cupom so durante o teste, para passar por buscarCupom de verdade.
function comCupom(cupom, fn) {
  cupons[cupom.codigo] = cupom;
  try {
    return fn();
  } finally {
    delete cupons[cupom.codigo];
  }
}

test('1. percentual: subtotal x percentual / 100, centavo mais proximo, meio centavo para cima', () => {
  assert.equal(calcularTotal(carrinhos.c1, undefined, HOJE).desconto, 1900); // 1899,7
  assert.equal(calcularTotal(carrinho('DEZOFF', 1004), undefined, HOJE).desconto, 100); // 100,4
  assert.equal(calcularTotal(carrinho('DEZOFF', 1005), undefined, HOJE).desconto, 101); // 100,5
});

test('2. desconto incide so sobre o subtotal, nunca sobre o frete', () => {
  const r = calcularTotal(carrinhos.c1, undefined, HOJE);
  assert.equal(r.frete, FRETE_SUDESTE);
  assert.equal(r.desconto, Math.round(r.subtotal * 0.1));
  assert.notEqual(r.desconto, Math.round((r.subtotal + r.frete) * 0.1));
});

test('3. desconto fixo ou percentual maior que o subtotal fica limitado ao subtotal', () => {
  const fixo = calcularTotal(carrinhos.c3, undefined, HOJE);
  assert.equal(fixo.desconto, fixo.subtotal);
  assert.equal(fixo.total, FRETE_DEMAIS);

  const percentual = comCupom(
    { codigo: 'TESTE150', tipo: 'percentual', percentual: 150, validoAte: '2027-12-31' },
    () => calcularTotal(carrinho('TESTE150', 1000), undefined, HOJE)
  );
  assert.equal(percentual.desconto, 1000);
  assert.equal(percentual.total, percentual.frete);
});

test('4. frete gratis a partir de R$ 250 olha o subtotal antes do desconto', () => {
  const r = calcularTotal(carrinhos.c2, undefined, HOJE);
  assert.ok(r.subtotal - r.desconto < 25000);
  assert.deepEqual(r, { subtotal: 25990, desconto: 2599, frete: 0, total: 23391 });
});

test('5. minSubtotalCentavos e comparado com o subtotal antes do desconto', () => {
  const r = calcularTotal(carrinhos.c7, undefined, HOJE);
  assert.ok(r.subtotal - 10000 < 20000);
  assert.deepEqual(r, { subtotal: 20500, desconto: 10000, frete: FRETE_SUDESTE, total: 12490 });
});

test('6. subtotal igual ao minSubtotalCentavos aplica o cupom', () => {
  assert.equal(calcularTotal(carrinho('LEVA100', 20000), undefined, HOJE).desconto, 10000);
});

test('7. cupom vale ate o fim do dia de validoAte', () => {
  const ultimoInstante = new Date(2027, 11, 31, 23, 59, 59, 999);
  const diaSeguinte = new Date(2028, 0, 1, 0, 0, 0, 0);
  assert.equal(calcularTotal(carrinhos.c1, undefined, ultimoInstante).desconto, 1900);
  assert.equal(calcularTotal(carrinhos.c1, undefined, diaSeguinte).desconto, 0);
});

test('8. validade usa a data local do servidor, nao UTC', () => {
  const tzAnterior = process.env.TZ;
  try {
    // 31/12 as 23h em Sao Paulo ja e 01/01 em UTC: ainda vale.
    process.env.TZ = 'America/Sao_Paulo';
    assert.equal(calcularTotal(carrinhos.c1, undefined, new Date(2027, 11, 31, 23)).desconto, 1900);
    // 01/01 as 8h em Toquio ainda e 31/12 em UTC: ja venceu.
    process.env.TZ = 'Asia/Tokyo';
    assert.equal(calcularTotal(carrinhos.c1, undefined, new Date(2028, 0, 1, 8)).desconto, 0);
  } finally {
    if (tzAnterior === undefined) delete process.env.TZ;
    else process.env.TZ = tzAnterior;
  }
});

test('9. cupom vencido e ignorado: desconto 0, sem erro', async () => {
  assert.deepEqual(calcularTotal(carrinhos.c4, undefined, HOJE), {
    subtotal: 15000, desconto: 0, frete: FRETE_SUDESTE, total: 16990
  });
  const { status, corpo } = await get('/cart/c4/total');
  assert.equal(status, 200);
  assert.equal(corpo.desconto, 0);
});

test('10. subtotal abaixo do minimo ignora o cupom: desconto 0, sem erro', () => {
  assert.deepEqual(calcularTotal(carrinho('LEVA100', 19999), undefined, HOJE), {
    subtotal: 19999, desconto: 0, frete: FRETE_SUDESTE, total: 21989
  });
});

test('11. couponCode inexistente e ignorado: desconto 0, sem erro', () => {
  assert.deepEqual(calcularTotal(carrinho('NAOEXISTE', 10000), undefined, HOJE), {
    subtotal: 10000, desconto: 0, frete: FRETE_SUDESTE, total: 11990
  });
});

test('12. cupom recusado nao informa o motivo', async () => {
  const semCupom = await get('/cart/c0/total');
  const vencido = await get('/cart/c4/total');
  assert.equal(vencido.status, 200);
  assert.deepEqual(Object.keys(vencido.corpo), Object.keys(semCupom.corpo));
  assert.doesNotMatch(JSON.stringify(vencido.corpo), /venc|expir|inval|motivo|cupom|VERAO24/i);
});

test('13. tipo de cupom desconhecido da desconto 0', () => {
  const r = comCupom(
    { codigo: 'BRINDE', tipo: 'brinde', valorCentavos: 500, validoAte: '2027-12-31' },
    () => calcularTotal(carrinho('BRINDE', 10000), undefined, HOJE)
  );
  assert.deepEqual(r, { subtotal: 10000, desconto: 0, frete: FRETE_SUDESTE, total: 11990 });
});

test('14. codigo do cupom diferencia maiusculas de minusculas', () => {
  assert.equal(calcularTotal(carrinho('DEZOFF', 10000), undefined, HOJE).desconto, 1000);
  assert.equal(calcularTotal(carrinho('dezoff', 10000), undefined, HOJE).desconto, 0);
  assert.equal(calcularTotal(carrinho('DezOff', 10000), undefined, HOJE).desconto, 0);
});

test('15. no maximo um cupom por carrinho', () => {
  const doisCodigos = carrinho(['DEZOFF', 'MENOS30'], 10000);
  const { desconto } = calcularTotal(doisCodigos, undefined, HOJE);
  assert.ok([0, 1000, 3000].includes(desconto), `desconto ${desconto} soma mais de um cupom`);
});

test('16. GET /cart/:id/total so usa o couponCode do carrinho', async () => {
  const query = await get('/cart/c0/total?couponCode=DEZOFF&cupom=DEZOFF&coupon=DEZOFF');
  assert.equal(query.corpo.desconto, 0);
  const outraRota = await get('/cart/c0/coupon/DEZOFF');
  assert.equal(outraRota.status, 404);
  const depois = await get('/cart/c0/total');
  assert.equal(depois.corpo.desconto, 0);
});

test('17. FRETEGRATIS valido zera o frete para qualquer CEP', () => {
  for (const cep of ['01310100', '39999999', '69900000', '90000000']) {
    assert.equal(calcularTotal(carrinhos.c5, cep, HOJE).frete, 0, `cep ${cep}`);
  }
});

test('18. FRETEGRATIS valido responde desconto 0, sem contar o frete economizado', () => {
  assert.deepEqual(calcularTotal(carrinhos.c5, undefined, HOJE), {
    subtotal: 12000, desconto: 0, frete: 0, total: 12000
  });
});

test('19. total = subtotal - desconto + frete', () => {
  for (const c of Object.values(carrinhos)) {
    const r = calcularTotal(c, undefined, HOJE);
    assert.equal(r.total, r.subtotal - r.desconto + r.frete, c.id);
  }
});

test('20. resposta sempre traz desconto, 0 sem cupom', async () => {
  const { corpo } = await get('/cart/c0/total');
  assert.ok(Object.hasOwn(corpo, 'desconto'));
  assert.equal(corpo.desconto, 0);
});

test('21. campos na ordem subtotal, desconto, frete, total', async () => {
  for (const id of Object.keys(carrinhos)) {
    const { corpo } = await get(`/cart/${id}/total`);
    assert.deepEqual(Object.keys(corpo), ['subtotal', 'desconto', 'frete', 'total'], id);
  }
});

test('22. desconto e devolvido como numero positivo', async () => {
  for (const c of Object.values(carrinhos)) {
    assert.ok(calcularTotal(c, undefined, HOJE).desconto >= 0, c.id);
  }
  const { corpo } = await get('/cart/c1/total');
  assert.ok(corpo.desconto > 0);
});

test('23. regras de cupom ficam em src/pricing.js e buscam o cupom com buscarCupom', () => {
  const fonte = readFileSync(new URL('../src/pricing.js', import.meta.url), 'utf8');
  assert.match(fonte, /import\s*\{[^}]*\bbuscarCupom\b[^}]*\}\s*from\s*'\.\/data\.js'/);
  // Cupom cadastrado em data.js passa a valer sem mexer em pricing.js.
  const r = comCupom(
    { codigo: 'NOVO5', tipo: 'fixo', valorCentavos: 500, validoAte: '2027-12-31' },
    () => calcularTotal(carrinho('NOVO5', 10000), undefined, HOJE)
  );
  assert.equal(r.desconto, 500);
});

test('24. src/pricing.js exporta cupomValido e calcularDesconto', () => {
  assert.equal(typeof pricing.cupomValido, 'function');
  assert.equal(typeof pricing.calcularDesconto, 'function');
  assert.equal(cupomValido(cupons.DEZOFF, 10000, HOJE), true);
  assert.equal(calcularDesconto(cupons.DEZOFF, 10000), 1000);
});

test('25. calcularTotal usa o terceiro argumento hoje; a API nao aceita a data', async () => {
  // VERAO24 venceu em 2024-12-31.
  assert.equal(calcularTotal(carrinhos.c4, undefined, new Date(2024, 5, 1)).desconto, 3750);
  assert.equal(calcularTotal(carrinhos.c4).desconto, 0);
  for (const q of ['hoje', 'data', 'date', 'today']) {
    const { corpo } = await get(`/cart/c4/total?${q}=2024-06-01`);
    assert.equal(corpo.desconto, 0, q);
  }
});

test('26. a tela exibe o campo desconto com o rotulo "Desconto"', async () => {
  const { corpo } = await get('/');
  assert.match(corpo, /desconto:\s*'Desconto'/);
});
