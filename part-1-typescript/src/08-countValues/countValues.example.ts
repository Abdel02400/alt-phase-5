import { countValues } from './countValues';

/**
 * Cas d'usage : Analyse des statuts de commandes
 */
export function run(): void {
  const orderStatuses = {
    order1: 'pending',
    order2: 'delivered',
    order3: 'pending',
    order4: 'cancelled',
    order5: 'pending',
  };

  console.log(countValues(orderStatuses));
  // { pending: 3, delivered: 1, cancelled: 1 }
}
