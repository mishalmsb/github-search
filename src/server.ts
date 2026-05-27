import { AngularAppEngine, createRequestHandler } from '@angular/ssr';

const angularApp = new AngularAppEngine({ trustProxyHeaders: true });

export default {
  fetch: createRequestHandler((req) => angularApp.handle(req)),
};
