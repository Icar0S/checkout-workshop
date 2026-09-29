// Calculo de precos do carrinho. Tudo em centavos inteiros.

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

export function calcularTotal(carrinho, cep = carrinho.cep) {
  const subtotal = calcularSubtotal(carrinho);
  const frete = calcularFrete(carrinho, cep);

  // carrinho.couponCode ainda nao e considerado no calculo.

  return { subtotal, frete, total: subtotal + frete };
}
