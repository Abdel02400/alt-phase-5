import { groupByProperty } from './groupByProperty';

describe('groupByProperty', () => {
  it('groupe des étudiants par niveau (cas de l\'énoncé)', () => {
    const students = [
      { name: 'Alice', level: 'Débutant' },
      { name: 'Bob', level: 'Intermédiaire' },
      { name: 'Charlie', level: 'Débutant' },
      { name: 'David', level: 'Avancé' },
    ];
    expect(groupByProperty(students, 'level')).toEqual({
      Débutant: [
        { name: 'Alice', level: 'Débutant' },
        { name: 'Charlie', level: 'Débutant' },
      ],
      Intermédiaire: [{ name: 'Bob', level: 'Intermédiaire' }],
      Avancé: [{ name: 'David', level: 'Avancé' }],
    });
  });

  it('groupe par propriété numérique (clé coercée en string)', () => {
    const items = [
      { id: 1, type: 'a' },
      { id: 2, type: 'b' },
      { id: 1, type: 'c' },
    ];
    expect(groupByProperty(items, 'id')).toEqual({
      '1': [
        { id: 1, type: 'a' },
        { id: 1, type: 'c' },
      ],
      '2': [{ id: 2, type: 'b' }],
    });
  });

  it('retourne un objet vide pour un tableau vide', () => {
    const items: Array<{ level: string }> = [];
    expect(groupByProperty(items, 'level')).toEqual({});
  });
});
