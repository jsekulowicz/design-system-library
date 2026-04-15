import { html } from 'lit';
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import '@ds/components/button/define';
import '@ds/components/page-shell/define';

export async function renderPage(baseCss: string): Promise<string> {
  const body = html`
    <ds-page-shell brand="Forma · SSR">
      <article style="max-width:64ch;display:grid;gap:var(--ds-space-4)">
        <h1
          style="font-family:var(--ds-font-display);font-size:var(--ds-font-size-3xl);margin:0"
        >
          Rendered on the server
        </h1>
        <p>
          This page is server-rendered via @lit-labs/ssr using Declarative
          Shadow DOM. Try reloading with JavaScript disabled — the button
          still renders from HTML alone; once JS boots, it hydrates in place.
        </p>
        <ds-button variant="primary">Primary (hydrates)</ds-button>
      </article>
      <span slot="footer">&copy; Forma · SSR prototype</span>
    </ds-page-shell>
  `;
  const ssrHtml = await collectResult(render(body));
  return wrapDocument(ssrHtml, baseCss);
}

function wrapDocument(inner: string, baseCss: string): string {
  return `<!doctype html>
<html lang="en" data-ds-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>DS · SSR prototype</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..900&display=swap" />
    <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=general-sans@200,300,400,500,600,700&display=swap" />
    <style>${baseCss}</style>
  </head>
  <body>
    ${inner}
    <script type="module" src="/client.js"></script>
  </body>
</html>`;
}
