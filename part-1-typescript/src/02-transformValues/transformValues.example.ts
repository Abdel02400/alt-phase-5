import { transformValues } from './transformValues';

/**
 * Cas d'usage : Conversion de prix en euros vers dollars
 */
export function run(): void {
  const pricesInEuros = {
    book: 20,
    pen: 5,
    notebook: 10,
  };

  const toDollars = (euros: number): number => euros * 1.1;

  console.log(transformValues(pricesInEuros, toDollars));
  // { book: 22, pen: 5.5, notebook: 11 }
}
