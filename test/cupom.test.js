import test from 'node:test';
import assert from 'node:assert/strict';

import { carrinhos } from '../src/data.js';
import { calcularTotal, calcularFrete, CupomInvalido } from '../src/pricing.js';
import { faseDaLua } from '../src/lua.js';
import { criarApp } from '../src/server.js';

// Datas fixas: o total depende do dia (validade do cupom, fase da lua).
const HOJE = new Date('2026-09-30T12:00:00');           // lua cheia
const LUA_MINGUANTE = new Date('2026-10-05T12:00:00');

async function get(caminho, agora = () => HOJE) {
  const servidor = criarApp(agora).listen(0);
  try {
    const { port } = servidor.address();
    const resposta = await fetch(`http://127.0.0.1:${port}${caminho}`);
    return { status: resposta.status, corpo: await resposta.json() };
  } finally {
    servidor.close();
  }
}

// --- criterio 1: percentual sobre o subtotal, antes do frete, meio para cima ---

test('percentual incide sobre o subtotal e arredonda 1899,7 para 1900', () => {
  const r = calcularTotal(carrinhos.c1, carrinhos.c1.cep, HOJE);
  assert.equal(r.desconto, 1900);
  assert.equal(r.frete, 1990);
  assert.equal(r.total, 18997 - 1900 + 1990);
});

// --- criterio 2: expirado ou inexistente ---

test('cupom expirado e recusado', () => {
  assert.throws(() => calcularTotal(carrinhos.c4, carrinhos.c4.cep, HOJE), /expirado/);
});

test('cupom inexistente e recusado', () => {
  const carrinho = { ...carrinhos.c0, couponCode: 'NAOEXISTE' };
  assert.throws(() => calcularTotal(carrinho, carrinho.cep, HOJE), /nao encontrado/);
});

test('GET /cart/:id/total responde 422 e nao altera nenhum valor quando o cupom e invalido', async () => {
  const { status, corpo } = await get('/cart/c4/total');
  assert.equal(status, 422);
  assert.deepEqual(corpo, { erro: 'cupom expirado' });
});

// --- criterio 3: subtotal abaixo do minimo do cupom ---

test('cupom com minimo e aceito quando o subtotal atinge o minimo', () => {
  const r = calcularTotal(carrinhos.c7, carrinhos.c7.cep, HOJE);
  assert.equal(r.desconto, 10000);
  assert.equal(r.total, 20500 - 10000 + 1990);
});

test('cupom com minimo e recusado quando o subtotal fica abaixo', () => {
  const carrinho = { ...carrinhos.c7, items: [{ ...carrinhos.c7.items[0], precoCentavos: 19999 }] };
  assert.throws(() => calcularTotal(carrinho, carrinho.cep, HOJE), CupomInvalido);
});

// --- criterio 4: lua minguante zera o frete, com ou sem cupom ---

test('as datas fixas estao nas fases que os testes assumem', () => {
  assert.equal(faseDaLua(HOJE), 'cheia');
  assert.equal(faseDaLua(LUA_MINGUANTE), 'minguante');
});

test('enquanto a lua estiver minguante, o frete e zero mesmo sem cupom', () => {
  assert.equal(calcularFrete(carrinhos.c0, carrinhos.c0.cep, LUA_MINGUANTE), 0);
  assert.equal(calcularFrete(carrinhos.c0, carrinhos.c0.cep, HOJE), 1990);
});

test('enquanto a lua estiver minguante, o endpoint devolve frete zero', async () => {
  const { corpo } = await get('/cart/c0/total', () => LUA_MINGUANTE);
  assert.deepEqual(corpo, { subtotal: 18997, desconto: 0, frete: 0, total: 18997 });
});

// --- decisoes fora da spec, registradas em SPEC.md ---

test('desconto fixo maior que o subtotal e limitado ao subtotal', () => {
  const r = calcularTotal(carrinhos.c3, carrinhos.c3.cep, HOJE);
  assert.equal(r.desconto, 2490);
  assert.equal(r.total, 0 + 2990);
});

test('frete gratis por valor e avaliado sobre o subtotal antes do desconto', () => {
  const r = calcularTotal(carrinhos.c2, carrinhos.c2.cep, HOJE);
  assert.equal(r.desconto, 2599);
  assert.equal(r.frete, 0);
  assert.equal(r.total, 25990 - 2599);
});

test('cupom de frete gratis zera o frete e nao mexe no subtotal', () => {
  const r = calcularTotal(carrinhos.c5, carrinhos.c5.cep, HOJE);
  assert.deepEqual(r, { subtotal: 12000, desconto: 0, frete: 0, total: 12000 });
});

test('carrinho sem cupom nao muda', () => {
  const r = calcularTotal(carrinhos.c6, carrinhos.c6.cep, HOJE);
  assert.deepEqual(r, { subtotal: 30000, desconto: 0, frete: 0, total: 30000 });
});
