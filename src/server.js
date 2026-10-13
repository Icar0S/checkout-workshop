import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { buscarCarrinho, carrinhos } from './data.js';
import { calcularTotal } from './pricing.js';

const PORT = Number(process.env.PORT ?? 3000);
const PAGINA = new URL('../public/index.html', import.meta.url);

function json(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(payload)
  });
  res.end(payload);
}

function html(res, status, body) {
  res.writeHead(status, {
    'content-type': 'text/html; charset=utf-8',
    'content-length': Buffer.byteLength(body)
  });
  res.end(body);
}

export const app = createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);

  if (req.method !== 'GET') {
    return json(res, 404, { erro: 'rota nao encontrada' });
  }

  if (url.pathname === '/') {
    // Lido a cada pedido para a tela mudar sem reiniciar o servidor.
    return html(res, 200, readFileSync(PAGINA, 'utf8'));
  }

  if (url.pathname === '/carts') {
    return json(res, 200, Object.values(carrinhos));
  }

  const match = url.pathname.match(/^\/cart\/([^/]+)\/total$/);
  if (!match) {
    return json(res, 404, { erro: 'rota nao encontrada' });
  }

  const carrinho = buscarCarrinho(match[1]);
  if (!carrinho) {
    return json(res, 404, { erro: 'carrinho nao encontrado' });
  }

  const cep = url.searchParams.get('cep') || carrinho.cep;
  return json(res, 200, calcularTotal(carrinho, cep));
});

if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(PORT, () => {
    console.log(`checkout-workshop ouvindo em http://localhost:${PORT}`);
    console.log(`abra no navegador, ou: curl http://localhost:${PORT}/cart/c1/total`);
  });
}
