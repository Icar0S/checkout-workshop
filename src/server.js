import { createServer } from 'node:http';
import { buscarCarrinho } from './data.js';
import { calcularTotal } from './pricing.js';

const PORT = Number(process.env.PORT ?? 3000);

function json(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(payload)
  });
  res.end(payload);
}

export const app = createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);
  const match = url.pathname.match(/^\/cart\/([^/]+)\/total$/);

  if (req.method !== 'GET' || !match) {
    return json(res, 404, { erro: 'rota nao encontrada' });
  }

  const carrinho = buscarCarrinho(match[1]);
  if (!carrinho) {
    return json(res, 404, { erro: 'carrinho nao encontrado' });
  }

  const cep = url.searchParams.get('cep') ?? carrinho.cep;
  return json(res, 200, calcularTotal(carrinho, cep));
});

if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(PORT, () => {
    console.log(`checkout-workshop ouvindo em http://localhost:${PORT}`);
    console.log(`experimente: curl http://localhost:${PORT}/cart/c1/total`);
  });
}
