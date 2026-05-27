import { AngularAppEngine } from '@angular/ssr';

// allowedHosts: '*' — Cloudflare validates Host/X-Forwarded-Host at the edge
const angularApp = new AngularAppEngine({ trustProxyHeaders: true, allowedHosts: ['*'] });

export default {
  async fetch(req: Request, env: Record<string, unknown>): Promise<Response> {
    const response = await angularApp.handle(req, env);
    return response ?? new Response('Not Found', { status: 404 });
  },
};
