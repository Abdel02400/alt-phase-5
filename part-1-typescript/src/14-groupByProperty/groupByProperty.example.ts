import { groupByProperty } from './groupByProperty';

/**
 * Cas d'usage : Groupement d'étudiants par niveau
 */
export function run(): void {
  const students = [
    { name: 'Alice', level: 'Débutant' },
    { name: 'Bob', level: 'Intermédiaire' },
    { name: 'Charlie', level: 'Débutant' },
    { name: 'David', level: 'Avancé' },
  ];

  console.log(groupByProperty(students, 'level'));
  // {
  //   "Débutant": [{ name: "Alice", level: "Débutant" }, { name: "Charlie", ... }],
  //   "Intermédiaire": [{ name: "Bob", level: "Intermédiaire" }],
  //   "Avancé": [{ name: "David", level: "Avancé" }]
  // }
}
