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

// Data fixa: o frete depende da fase da lua (SPEC.md, criterio 4).
const HOJE = new Date('2026-09-30T12:00:00');

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
  assert.equal(calcularFrete(carrinhos.c1, carrinhos.c1.cep, HOJE), FRETE_SUDESTE);
});

test('frete fora do sudeste usa a faixa mais cara', () => {
  assert.equal(calcularFrete(carrinhos.c3, carrinhos.c3.cep, HOJE), FRETE_DEMAIS);
});

test('frete e gratuito a partir de R$ 250 de subtotal', () => {
  assert.equal(calcularFrete(carrinhos.c2, carrinhos.c2.cep, HOJE), 0);
  assert.equal(calcularFrete(carrinhos.c6, carrinhos.c6.cep, HOJE), 0);
});

test('cep informado sobrescreve o cep do carrinho', () => {
  assert.equal(calcularFrete(carrinhos.c1, '70040010', HOJE), FRETE_DEMAIS);
});

test('total e a soma de subtotal e frete', () => {
  assert.deepEqual(calcularTotal(carrinhos.c0, carrinhos.c0.cep, HOJE), {
    subtotal: 18997,
    desconto: 0,
    frete: FRETE_SUDESTE,
    total: 20987
  });
});

test('total de carrinho com frete gratuito nao cobra entrega', () => {
  assert.deepEqual(calcularTotal(carrinhos.c6, carrinhos.c6.cep, HOJE), {
    subtotal: 30000,
    desconto: 0,
    frete: 0,
    total: 30000
  });
});
