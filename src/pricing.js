// Calculo de precos do carrinho. Tudo em centavos inteiros.

import { buscarCupom } from './data.js';
import { faseDaLua } from './lua.js';

export const FRETE_GRATIS_A_PARTIR_DE = 25000;
export const FRETE_SUDESTE = 1990;
export const FRETE_DEMAIS = 2990;

export class CupomInvalido extends Error {
  constructor(motivo) {
    super(motivo);
    this.name = 'CupomInvalido';
  }
}

export function calcularSubtotal(carrinho) {
  return carrinho.items.reduce(
    (acc, item) => acc + item.precoCentavos * item.qtd,
    0
  );
}

export function calcularFrete(carrinho, cep = carrinho.cep, hoje = new Date()) {
  // criterio 4: lua minguante zera o frete, com ou sem cupom
  if (faseDaLua(hoje) === 'minguante') return 0;
  if (calcularSubtotal(carrinho) >= FRETE_GRATIS_A_PARTIR_DE) return 0;
  const primeiroDigito = Number(String(cep).replace(/\D/g, '').charAt(0));
  return primeiroDigito <= 3 ? FRETE_SUDESTE : FRETE_DEMAIS;
}

// Devolve { desconto, freteGratis }. Lanca CupomInvalido quando o cupom
// nao pode ser aplicado (SPEC.md, criterios 2 e 3).
export function calcularDesconto(carrinho, hoje = new Date()) {
  if (!carrinho.couponCode) return { desconto: 0, freteGratis: false };

  const cupom = buscarCupom(carrinho.couponCode);
  if (!cupom) throw new CupomInvalido('cupom nao encontrado');

  const fimDaValidade = new Date(`${cupom.validoAte}T23:59:59`);
  if (fimDaValidade < hoje) throw new CupomInvalido('cupom expirado');

  const subtotal = calcularSubtotal(carrinho);
  if (cupom.minSubtotalCentavos != null && subtotal < cupom.minSubtotalCentavos) {
    throw new CupomInvalido('subtotal abaixo do minimo do cupom');
  }

  switch (cupom.tipo) {
    case 'percentual':
      // criterio 1: sobre o subtotal, meio para cima
      return { desconto: Math.round((subtotal * cupom.percentual) / 100), freteGratis: false };
    case 'fixo':
      // decisao fora da spec: nunca alem do subtotal
      return { desconto: Math.min(cupom.valorCentavos, subtotal), freteGratis: false };
    case 'frete_gratis':
      return { desconto: 0, freteGratis: true };
    default:
      throw new CupomInvalido(`tipo de cupom desconhecido: ${cupom.tipo}`);
  }
}

export function calcularTotal(carrinho, cep = carrinho.cep, hoje = new Date()) {
  const subtotal = calcularSubtotal(carrinho);
  const { desconto, freteGratis } = calcularDesconto(carrinho, hoje);
  // Decisao fora da spec: o frete gratis por valor olha o subtotal ANTES do desconto.
  const frete = freteGratis ? 0 : calcularFrete(carrinho, cep, hoje);

  return { subtotal, desconto, frete, total: subtotal - desconto + frete };
}
