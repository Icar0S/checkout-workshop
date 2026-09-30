# checkout-workshop

Checkout minimo, sem nenhuma dependencia. Usado no workshop de specs.

Requer **Node 20 ou superior**. Nao existe `npm install` — nao ha pacotes.

## Comece aqui

- [`docs/PARTICIPANTE.md`](./docs/PARTICIPANTE.md) — o passo a passo do workshop, do setup ao fim
- [`docs/CLINE.md`](./docs/CLINE.md) — configurar e usar o Cline

## Comandos

```
npm test               # suite de testes (node:test nativo)
npm start              # sobe a API em http://localhost:3000
npm run reset          # desfaz src/ e test/ (entre as rodadas)
npm run checkpoint:1   # travou? avanca para o resultado esperado do passo (1, 2 ou 3)
npm run voltar         # de volta ao main
npm run revisao        # so quando o instrutor mandar
```

Todos funcionam em macOS, Linux e Windows.

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
