# checkout-workshop

Checkout mínimo, sem nenhuma dependência. Subtotal, cupom, frete e total funcionam.

Requer **Node 20 ou superior**. Não existe `npm install` — não há pacotes.

## Comandos

```
npm test     # suite de testes (node:test nativo)
npm start    # sobe a API e a tela em http://localhost:3000
```

Os demais scripts do `package.json` (`reset`, `checkpoint:*`, `voltar`, `revisao`)
estão explicados no guia que o instrutor compartilha. Todos funcionam em macOS,
Linux e Windows.

## A tela

`npm start` e abra <http://localhost:3000>. Escolha um carrinho, confira o CEP
e clique em **Calcular**. A tela só exibe o que a API devolve — toda conta
acontece em `src/pricing.js`.

Pela linha de comando:

```
curl http://localhost:3000/cart/c1/total
# {"subtotal":18997,"desconto":1900,"frete":1990,"total":19087}
```

## O que existe

| Arquivo | O que faz |
| --- | --- |
| `src/data.js` | Carrinhos e cupons em memória |
| `src/pricing.js` | `calcularSubtotal`, `calcularFrete`, `cupomValido`, `calcularDesconto`, `calcularTotal` |
| `src/server.js` | `GET /carts`, `GET /cart/:id/total` e a página em `/` |
| `public/index.html` | A tela. Formata centavos em reais; não faz conta |
| `test/` | 21 testes, todos verdes |

Dinheiro sempre em **centavos inteiros**. Nunca float.

## Cupom

O `couponCode` do carrinho é aplicado em `calcularTotal`:

- `percentual` e `fixo` descontam do subtotal (percentual arredonda o centavo;
  o desconto nunca passa do subtotal). O frete não tem desconto.
- `frete_gratis` zera o frete.
- O frete grátis acima de R$ 250 olha o subtotal **antes** do desconto.
- O cupom vale até o fim do dia de `validoAte`, e só se o subtotal atingir
  `minSubtotalCentavos`, quando houver.
- Cupom vencido, abaixo do mínimo ou inexistente é ignorado: `desconto: 0`, sem erro.
