import { objectToUrlParams } from './objectToUrlParams';

describe('objectToUrlParams', () => {
  it('encode un objet en query string (cas de l\'énoncé)', () => {
    const params = {
      query: 'ordinateur portable',
      maxPrice: 1000,
      brand: 'Dell',
      inStock: true,
    };
    expect(objectToUrlParams(params)).toBe(
      'query=ordinateur%20portable&maxPrice=1000&brand=Dell&inStock=true',
    );
  });

  it('retourne une chaîne vide pour un objet vide', () => {
    expect(objectToUrlParams({})).toBe('');
  });

  it('encode les caractères spéciaux des clés et valeurs', () => {
    expect(objectToUrlParams({ 'a key': 'a&b' })).toBe('a%20key=a%26b');
  });

  it('sérialise les booléens et nombres en chaîne', () => {
    expect(objectToUrlParams({ n: 42, b: false })).toBe('n=42&b=false');
  });
});
