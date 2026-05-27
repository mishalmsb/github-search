import { AngularAppEngine } from '@angular/ssr';

// allowedHosts: '*' — Cloudflare validates Host/X-Forwarded-Host at the edge
const angularApp = new AngularAppEngine({ trustProxyHeaders: true, allowedHosts: ['*'] });

export default {
  async fetch(req: Request, env: Record<string, unknown>): Promise<Response> {
    const url = new URL(req.url);

    if (url.pathname === '/api/search') {
      const githubUrl = new URL('https://api.github.com/search/repositories');
      githubUrl.search = url.search;

      const headers: Record<string, string> = { 'Accept': 'application/vnd.github+json', 'User-Agent': 'github-search-worker' };
      const token = env['GITHUB_TOKEN'] as string | undefined;
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const githubRes = await fetch(githubUrl.toString(), { headers });
      return new Response(githubRes.body, {
        status: githubRes.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const response = await angularApp.handle(req, env);
    return response ?? new Response('Not Found', { status: 404 });
  },
};
