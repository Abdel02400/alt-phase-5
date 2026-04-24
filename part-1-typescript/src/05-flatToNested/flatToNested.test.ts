import { flatToNested } from './flatToNested';

describe('flatToNested', () => {
  it('convertit les clés pointées en objet imbriqué (cas de l\'énoncé)', () => {
    const flat = {
      'app.name': 'MyApp',
      'app.version': '1.0.0',
      'database.host': 'localhost',
      'database.port': 5432,
    };
    expect(flatToNested(flat)).toEqual({
      app: { name: 'MyApp', version: '1.0.0' },
      database: { host: 'localhost', port: 5432 },
    });
  });

  it('supporte plusieurs niveaux d\'imbrication', () => {
    expect(flatToNested({ 'a.b.c.d': 1 })).toEqual({
      a: { b: { c: { d: 1 } } },
    });
  });

  it('ne crée pas de niveau pour une clé sans point', () => {
    expect(flatToNested({ simple: 'value' })).toEqual({ simple: 'value' });
  });

  it('retourne un objet vide pour une entrée vide', () => {
    expect(flatToNested({})).toEqual({});
  });

  it('fusionne les chemins partageant un préfixe commun', () => {
    expect(flatToNested({ 'x.a': 1, 'x.b': 2, 'y.a': 3 })).toEqual({
      x: { a: 1, b: 2 },
      y: { a: 3 },
    });
  });
});
