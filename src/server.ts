import { AngularAppEngine, createRequestHandler } from '@angular/ssr';

const angularApp = new AngularAppEngine();

export default {
  fetch: createRequestHandler((req) => angularApp.handle(req)),
};
