import { getObjectStats } from './getObjectStats';

describe('getObjectStats', () => {
  const revenues = {
    january: 1000,
    february: 1200,
    march: 900,
    april: 1500,
  };

  it('calcule min, max, moyenne, total (cas de l\'énoncé)', () => {
    const stats = getObjectStats(revenues);
    expect(stats.basic).toEqual({
      min: 900,
      max: 1500,
      average: 1150,
      total: 4600,
    });
  });

  it('calcule médiane, variance, écart-type (cas de l\'énoncé)', () => {
    const stats = getObjectStats(revenues);
    expect(stats.advanced.median).toBe(1100);
    expect(stats.advanced.variance).toBe(52500);
    expect(stats.advanced.standardDeviation).toBeCloseTo(229.13, 2);
  });

  it('gère une médiane sur nombre impair de valeurs', () => {
    const stats = getObjectStats({ a: 1, b: 2, c: 3 });
    expect(stats.advanced.median).toBe(2);
  });

  it('gère un seul élément (variance et écart-type = 0)', () => {
    const stats = getObjectStats({ a: 42 });
    expect(stats.basic).toEqual({ min: 42, max: 42, average: 42, total: 42 });
    expect(stats.advanced.variance).toBe(0);
    expect(stats.advanced.standardDeviation).toBe(0);
  });

  it('propage NaN / Infinity sur un objet vide (comportement JS natif)', () => {
    const stats = getObjectStats({});
    expect(stats.basic.total).toBe(0);
    expect(stats.basic.min).toBe(Infinity);
    expect(stats.basic.max).toBe(-Infinity);
    expect(stats.basic.average).toBeNaN();
    expect(stats.advanced.median).toBeNaN();
    expect(stats.advanced.variance).toBeNaN();
    expect(stats.advanced.standardDeviation).toBeNaN();
  });
});
