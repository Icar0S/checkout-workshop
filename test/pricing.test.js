import test from 'node:test';
import assert from 'node:assert/strict';

import { carrinhos } from '../src/data.js';
import {
  calcularSubtotal,
  calcularFrete,
  calcularTotal,
  FRETE_SUDESTE,
  FRETE_DEMAIS
} from '../src/pricing.js';

test('subtotal soma preco vezes quantidade de cada item', () => {
  assert.equal(calcularSubtotal(carrinhos.c4), 15000);
});

test('subtotal de carrinho sem itens e zero', () => {
  assert.equal(calcularSubtotal({ items: [] }), 0);
});

test('subtotal preserva centavos que nao arredondam', () => {
  assert.equal(calcularSubtotal(carrinhos.c1), 18997);
});

test('frete do sudeste usa a faixa mais barata', () => {
  assert.equal(calcularFrete(carrinhos.c1), FRETE_SUDESTE);
});

test('frete fora do sudeste usa a faixa mais cara', () => {
  assert.equal(calcularFrete(carrinhos.c3), FRETE_DEMAIS);
});

test('frete e gratuito a partir de R$ 250 de subtotal', () => {
  assert.equal(calcularFrete(carrinhos.c2), 0);
  assert.equal(calcularFrete(carrinhos.c6), 0);
});

test('cep informado sobrescreve o cep do carrinho', () => {
  assert.equal(calcularFrete(carrinhos.c1, '70040010'), FRETE_DEMAIS);
});

test('total e a soma de subtotal e frete', () => {
  assert.deepEqual(calcularTotal(carrinhos.c0), {
    subtotal: 18997,
    frete: FRETE_SUDESTE,
    total: 20987
  });
});

test('total de carrinho com frete gratuito nao cobra entrega', () => {
  assert.deepEqual(calcularTotal(carrinhos.c6), {
    subtotal: 30000,
    frete: 0,
    total: 30000
  });
});
