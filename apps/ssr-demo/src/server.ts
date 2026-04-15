import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { renderPage } from './render.js';

const port = Number(process.env.PORT ?? 3100);
const baseCss = readFileSync(
  new URL('../../../packages/tokens/dist/theme-default.css', import.meta.url),
  'utf8'
);

const server = createServer(async (request, response) => {
  if (request.url === '/client.js') {
    response.writeHead(200, { 'content-type': 'text/javascript' });
    response.end(clientBootstrap());
    return;
  }
  const html = await renderPage(baseCss);
  response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  response.end(html);
});

function clientBootstrap(): string {
  return `
    import '@lit-labs/ssr-client/lit-element-hydrate-support.js';
    import '@ds/components/button/define';
    import '@ds/components/page-shell/define';
    console.info('[ssr-demo] hydrated');
  `;
}

server.listen(port, () => {
  console.log(`ssr-demo listening on http://localhost:${port}`);
});
