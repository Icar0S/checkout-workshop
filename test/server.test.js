import test from 'node:test';
import assert from 'node:assert/strict';

import { app } from '../src/server.js';

async function get(caminho) {
  const servidor = app.listen(0);
  try {
    const { port } = servidor.address();
    const resposta = await fetch(`http://127.0.0.1:${port}${caminho}`);
    return { status: resposta.status, corpo: await resposta.json() };
  } finally {
    servidor.close();
  }
}

test('GET /cart/:id/total devolve subtotal, frete e total', async () => {
  const { status, corpo } = await get('/cart/c1/total');
  assert.equal(status, 200);
  assert.deepEqual(corpo, { subtotal: 18997, frete: 1990, total: 20987 });
});

test('GET /cart/:id/total responde 404 para carrinho inexistente', async () => {
  const { status } = await get('/cart/nao-existe/total');
  assert.equal(status, 404);
});
