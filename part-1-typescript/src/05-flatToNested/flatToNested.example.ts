import { flatToNested } from './flatToNested';

/**
 * Cas d'usage : Configuration d'une application
 */
export function run(): void {
  const flatConfig = {
    'app.name': 'MyApp',
    'app.version': '1.0.0',
    'database.host': 'localhost',
    'database.port': 5432,
  };

  console.log(flatToNested(flatConfig));
  // {
  //   app: { name: 'MyApp', version: '1.0.0' },
  //   database: { host: 'localhost', port: 5432 }
  // }
}
