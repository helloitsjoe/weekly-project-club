import { convert, getMonthlyRev, getWeeklyRev, getYearlyRev } from '../utils';

describe('Helpers', () => {
  it('converts data to the right shape', () => {
    const data = [15, 10, 40];
    const price = 5;
    const expected = [
      { day: 0, total: 15 * price },
      { day: 1, total: 10 * price },
      { day: 2, total: 40 * price },
    ];
    expect(convert(data, price)).toEqual(expected);
  });

  it('calculates weekly total', () => {
    const data = [1, 3, 5, 6, 4, 2, 8, 7, 11, 4, 3, 3, 1, 4, 5];
    const price = 5;
    const expected = [1 * price, 35 * price, 31 * price];
    expect(getWeeklyRev(data, price)).toEqual(expected);
  });

  it('calculates monthly total', () => {
    const data = [...Array(65).keys()].map(k => k + 1);
    const price = 5;
    const expected = [75, 3075, 7575];
    expect(getMonthlyRev(data, price)).toEqual(expected);
  });

  it('calculates yearly total', () => {
    const data = [...Array(1000).keys()].map(k => k + 1);
    const price = 6;
    const expected = [219510, 992070, 1791420];
    expect(getYearlyRev(data, price)).toEqual(expected);
  });
});
