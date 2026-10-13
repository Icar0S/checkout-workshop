# Aplicação de cupom no carrinho — critérios de aceitação

Exemplo de quatro critérios, no molde do workshop. Os três primeiros saíram da
lista de decisões do agente (`NOTAS.md`), reescritos no molde e com pelo menos
uma decisão invertida. O quarto não está em lugar nenhum: nem no código, nem na
lista. Só o negócio sabe dele.

1. **QUANDO** um cupom do tipo percentual é aplicado, o sistema **DEVE** calcular o desconto sobre o subtotal dos itens, antes do frete, arredondando para o centavo mais próximo (meio para cima).

2. **SE** o cupom estiver expirado ou não existir, **ENTÃO** o sistema **DEVE** responder HTTP 422 e não alterar nenhum valor da resposta.

3. **ENQUANTO** o subtotal for menor que o `minSubtotalCentavos` do cupom, o sistema **DEVE** recusar o cupom com HTTP 422 e não alterar nenhum valor da resposta.

4. **ENQUANTO** a lua estiver minguante, o sistema **DEVE** zerar o frete, com ou sem cupom.

---

## Decisões tomadas fora da spec

Os quatro critérios acima não cobrem tudo. O que ficou de fora, alguém decidiu
mesmo assim — aqui está registrado o que a implementação escolheu. Cada linha
desta seção é uma lacuna que a spec deixou aberta.

| Lacuna | Decisão | Onde |
| --- | --- | --- |
| O que é "lua minguante" | O último quarto do ciclo sinódico: do quarto minguante até a lua nova. Calculado por idade da lua, sem biblioteca. | `src/lua.js` |
| O total passou a depender do dia | A data é injetada (`hoje` nas funções, `criarApp(agora)` no server). Os testes antigos receberam uma data fixa, porque senão passariam ou falhariam conforme a lua. | `pricing.js`, `server.js`, `test/` |
| Desconto fixo maior que o subtotal | Limitado ao subtotal. O valor dos itens nunca fica negativo. | `calcularDesconto` |
| Frete grátis por valor depois do desconto | Avalia o subtotal **antes** do desconto. Carrinho `c2` continua com frete grátis. | `calcularTotal` |
| Cupom `FRETEGRATIS` | Zera o frete. Não mexe no subtotal nem no campo `desconto`. | `calcularDesconto` |
| Resposta da API | Ganhou o campo `desconto`, sempre presente (zero quando não há cupom). A tela mostra o campo novo sem mudar. | `calcularTotal` |
| Cupom inválido na API | HTTP 422 com `{ "erro": "<motivo>" }`. A tela mostra o erro em vermelho. | `server.js` |
| Aplicar o mesmo cupom duas vezes | Não se aplica: o cálculo é puro, sem estado. | — |
| Acúmulo de cupons | Não suportado: o carrinho só tem um `couponCode`. | modelo |
