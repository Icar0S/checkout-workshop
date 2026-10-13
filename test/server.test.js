import test from 'node:test';
import assert from 'node:assert/strict';

import { criarApp } from '../src/server.js';

// Data fixa: o total depende do dia (validade do cupom, fase da lua).
const HOJE = new Date('2026-09-30T12:00:00');
const app = criarApp(() => HOJE);

async function get(caminho) {
  const servidor = app.listen(0);
  try {
    const { port } = servidor.address();
    const resposta = await fetch(`http://127.0.0.1:${port}${caminho}`);
    const tipo = resposta.headers.get('content-type');
    const corpo = tipo.startsWith('application/json') ? await resposta.json() : await resposta.text();
    return { status: resposta.status, tipo, corpo };
  } finally {
    servidor.close();
  }
}

test('GET / devolve a tela', async () => {
  const { status, tipo, corpo } = await get('/');
  assert.equal(status, 200);
  assert.match(tipo, /^text\/html/);
  assert.match(corpo, /<title>Checkout<\/title>/);
});

test('GET /carts lista os carrinhos com itens e cupom', async () => {
  const { status, corpo } = await get('/carts');
  assert.equal(status, 200);
  assert.equal(corpo.length, 8);
  assert.deepEqual(Object.keys(corpo[1]), ['id', 'cep', 'couponCode', 'items']);
  assert.equal(corpo[1].couponCode, 'DEZOFF');
});

test('GET /cart/:id/total devolve subtotal, frete e total', async () => {
  const { status, corpo } = await get('/cart/c0/total');
  assert.equal(status, 200);
  assert.deepEqual(corpo, { subtotal: 18997, desconto: 0, frete: 1990, total: 20987 });
});

test('GET /cart/:id/total responde 404 para carrinho inexistente', async () => {
  const { status } = await get('/cart/nao-existe/total');
  assert.equal(status, 404);
});
