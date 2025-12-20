import { INestApplication } from '@nestjs/common';

declare const module: any;

export function setupHMR(app: INestApplication): void {
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
