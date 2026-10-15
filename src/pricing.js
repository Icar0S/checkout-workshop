// Calculo de precos do carrinho. Tudo em centavos inteiros.

import { buscarCupom } from './data.js';

export const FRETE_GRATIS_A_PARTIR_DE = 25000;
export const FRETE_SUDESTE = 1990;
export const FRETE_DEMAIS = 2990;

export function calcularSubtotal(carrinho) {
  return carrinho.items.reduce(
    (acc, item) => acc + item.precoCentavos * item.qtd,
    0
  );
}

export function calcularFrete(carrinho, cep = carrinho.cep) {
  if (calcularSubtotal(carrinho) >= FRETE_GRATIS_A_PARTIR_DE) return 0;
  const primeiroDigito = Number(String(cep).replace(/\D/g, '').charAt(0));
  return primeiroDigito <= 3 ? FRETE_SUDESTE : FRETE_DEMAIS;
}

// Data local do servidor no formato de validoAte (AAAA-MM-DD), nao UTC.
function dataLocal(data) {
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${data.getFullYear()}-${mes}-${dia}`;
}

// Vale ate o fim do dia de validoAte; o minimo olha o subtotal antes do desconto.
export function cupomValido(cupom, subtotal, hoje = new Date()) {
  if (!cupom) return false;
  if (!(dataLocal(hoje) <= cupom.validoAte)) return false;
  return subtotal >= (cupom.minSubtotalCentavos ?? 0);
}

// Desconto positivo sobre o subtotal, nunca maior que ele. Frete gratis nao conta.
export function calcularDesconto(cupom, subtotal) {
  let desconto = 0;
  if (cupom.tipo === 'percentual') desconto = Math.round((subtotal * cupom.percentual) / 100);
  if (cupom.tipo === 'fixo') desconto = cupom.valorCentavos;
  return Math.min(desconto, subtotal);
}

export function calcularTotal(carrinho, cep = carrinho.cep, hoje = new Date()) {
  const subtotal = calcularSubtotal(carrinho);
  const cupom = buscarCupom(carrinho.couponCode);
  const valido = cupomValido(cupom, subtotal, hoje);

  const desconto = valido ? calcularDesconto(cupom, subtotal) : 0;
  const frete = valido && cupom.tipo === 'frete_gratis' ? 0 : calcularFrete(carrinho, cep);

  return { subtotal, desconto, frete, total: subtotal - desconto + frete };
}
