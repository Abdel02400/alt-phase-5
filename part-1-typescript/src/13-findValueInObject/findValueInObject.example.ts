import { findValueInObject } from './findValueInObject';

/**
 * Cas d'usage : Recherche dans une structure de données de configuration
 */
export function run(): void {
  const config = {
    app: {
      name: 'MonApp',
      settings: {
        theme: 'dark',
        notifications: {
          email: true,
          push: false,
        },
      },
    },
  };

  console.log(findValueInObject(config, 'dark'));
  // ["app", "settings", "theme"]
}
