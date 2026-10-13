# Aplicação de cupom no carrinho — critérios de aceitação

Exemplo de quatro critérios, no molde do workshop. Os três primeiros saíram da
lista de decisões do agente (`NOTAS.md`), reescritos no molde e com pelo menos
uma decisão invertida. O quarto não está em lugar nenhum: nem no código, nem na
lista. Só o negócio sabe dele.

1. **QUANDO** um cupom do tipo percentual é aplicado, o sistema **DEVE** calcular o desconto sobre o subtotal dos itens, antes do frete, arredondando para o centavo mais próximo (meio para cima).

2. **SE** o cupom estiver expirado ou não existir, **ENTÃO** o sistema **DEVE** responder HTTP 422 e não alterar nenhum valor da resposta.

3. **ENQUANTO** o subtotal for menor que o `minSubtotalCentavos` do cupom, o sistema **DEVE** recusar o cupom com HTTP 422 e não alterar nenhum valor da resposta.

4. **ENQUANTO** a lua estiver minguante, o sistema **DEVE** zerar o frete, com ou sem cupom.
