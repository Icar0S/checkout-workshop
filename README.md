# checkout-workshop

Checkout minimo, sem nenhuma dependencia. Usado no workshop de specs.

Requer **Node 20 ou superior**. Nao existe `npm install` — nao ha pacotes.

## Rodar

```
npm test          # suite de testes (node:test nativo)
npm start         # sobe a API em http://localhost:3000
npm run reset     # desfaz alteracoes em src/ e test/ (entre as rodadas)
```

```
curl http://localhost:3000/cart/c1/total
# {"subtotal":18997,"frete":1990,"total":20987}
```

## O que existe

| Arquivo | O que faz |
| --- | --- |
| `src/data.js` | Carrinhos e cupons em memoria |
| `src/pricing.js` | `calcularSubtotal`, `calcularFrete`, `calcularTotal` |
| `src/server.js` | `GET /cart/:id/total` |
| `test/` | 11 testes, todos verdes |

Dinheiro sempre em **centavos inteiros**. Nunca float.

## O que nao existe

O carrinho tem um campo `couponCode`, e os cupons estao em `src/data.js`.
Nada disso e usado no calculo.

## Preparacao (antes do workshop)

1. Clone o repo.
2. Rode `npm test`. Os 11 testes precisam passar.
3. Abra seu agente nesta pasta e peca algo trivial, tipo
   *"adicione um comentario no topo de src/pricing.js"*.
   Confirme que ele de fato editou o arquivo.
4. Responda com uma palavra: **funcionou** ou **quebrou**.

Nao precisa ler o codigo nem estudar nada antes.
