# Especificação — Aplicação de cupom no carrinho

*Gerado automaticamente a partir do pedido do usuário. Status: pronto para revisão.*

## 1. Contexto

O carrinho já calcula subtotal, frete e total. O campo `couponCode` existe no modelo, mas hoje é ignorado durante o cálculo. Esta mudança passa a aplicar o cupom informado ao valor do pedido, mantendo o contrato atual do endpoint.

## 2. Critérios de aceitação

**CA-01** — QUANDO o carrinho possuir um `couponCode` válido do tipo percentual, o sistema DEVE aplicar o percentual correspondente sobre o valor do pedido.

**CA-02** — QUANDO o cupom for do tipo valor fixo, o sistema DEVE subtrair o valor correspondente, nunca resultando em total negativo.

**CA-03** — SE o cupom estiver expirado, ENTÃO o sistema DEVE retornar erro 422 e manter o carrinho inalterado.

**CA-04** — ENQUANTO o subtotal for inferior ao valor mínimo exigido pela campanha, o sistema DEVE recusar a aplicação do cupom.

**CA-05** — O sistema DEVE garantir que o valor final refletido ao cliente seja coerente com a expectativa gerada pela comunicação da campanha.

**CA-06** — QUANDO o cupom for do tipo frete grátis, o sistema DEVE zerar o valor do frete na resposta.

**CA-07** — Cupons expirados DEVEM ser ignorados silenciosamente, mantendo o carrinho em estado válido e registrando o aviso no campo `warnings`.

## 3. Exemplo de cálculo

Carrinho com subtotal de **R$ 249,90**, frete grátis por valor, cupom `DEZOFF` (10%).
Desconto aplicado: **R$ 24,99**. Total final: **R$ 224,91**.

## 4. Fora de escopo

Acúmulo de múltiplos cupons, cupom por item, cashback, campanhas segmentadas por cliente.
