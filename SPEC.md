# Cupom no carrinho: critérios de aceitação

- QUANDO o carrinho tiver um cupom percentual válido, o sistema DEVE calcular o desconto como subtotal × percentual / 100, arredondado para o centavo mais próximo, com meio centavo arredondado para cima.
- ENQUANTO o carrinho tiver um cupom válido, o sistema DEVE aplicar o desconto somente sobre o subtotal, nunca sobre o frete.
- SE o desconto calculado, fixo ou percentual, for maior que o subtotal, ENTÃO o sistema DEVE limitar o desconto ao valor do subtotal, de modo que o total nunca fique abaixo do frete.
- QUANDO verificar o frete grátis a partir de R$ 250, o sistema DEVE usar o subtotal antes do desconto.
- QUANDO o cupom tiver `minSubtotalCentavos`, o sistema DEVE compará-lo com o subtotal antes do desconto.
- QUANDO o subtotal for igual ao `minSubtotalCentavos` do cupom, o sistema DEVE aplicar o cupom.
