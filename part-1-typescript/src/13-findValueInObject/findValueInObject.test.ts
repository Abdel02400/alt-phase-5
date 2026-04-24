import { findValueInObject } from './findValueInObject';

describe('findValueInObject', () => {
  const config = {
    app: {
      name: 'MonApp',
      settings: {
        theme: 'dark',
        notifications: { email: true, push: false },
      },
    },
  };

  it('retourne le chemin de la valeur trouvée (cas de l\'énoncé)', () => {
    expect(findValueInObject(config, 'dark')).toEqual(['app', 'settings', 'theme']);
  });

  it('retourne null si la valeur n\'existe pas', () => {
    expect(findValueInObject(config, 'inexistant')).toBeNull();
  });

  it('trouve des valeurs booléennes profondes', () => {
    expect(findValueInObject(config, false)).toEqual([
      'app',
      'settings',
      'notifications',
      'push',
    ]);
  });

  it('retourne [] si la cible est l\'objet racine lui-même', () => {
    expect(findValueInObject(config, config)).toEqual([]);
  });

  it('retourne null pour une primitive non correspondante', () => {
    expect(findValueInObject('hello', 'world')).toBeNull();
  });

  it('trouve la première occurrence en parcours DFS', () => {
    const obj = { a: { x: 1 }, b: { x: 1 } };
    expect(findValueInObject(obj, 1)).toEqual(['a', 'x']);
  });
});
