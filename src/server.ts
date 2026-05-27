import { AngularAppEngine, createRequestHandler } from '@angular/ssr';

// allowedHosts: '*' — Cloudflare validates Host/X-Forwarded-Host at the edge
const angularApp = new AngularAppEngine({ trustProxyHeaders: true, allowedHosts: ['*'] });

export default {
  fetch: createRequestHandler((req) => angularApp.handle(req)),
};
