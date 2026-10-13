# checkout-workshop

Checkout mínimo, sem nenhuma dependência. Subtotal, frete e total funcionam.

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
# {"subtotal":18997,"frete":1990,"total":20987}
```

## O que existe

| Arquivo | O que faz |
| --- | --- |
| `src/data.js` | Carrinhos e cupons em memória |
| `src/pricing.js` | `calcularSubtotal`, `calcularFrete`, `calcularTotal` |
| `src/server.js` | `GET /carts`, `GET /cart/:id/total` e a página em `/` |
| `public/index.html` | A tela. Formata centavos em reais; não faz conta |
| `test/` | 13 testes, todos verdes |

Dinheiro sempre em **centavos inteiros**. Nunca float.

## O que não existe

O carrinho tem um campo `couponCode`, e os cupons estão em `src/data.js`.
Nada disso é usado no cálculo.
