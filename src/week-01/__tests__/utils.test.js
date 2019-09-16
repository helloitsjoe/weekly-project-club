import { getRevenue } from '../utils';

const today = new Date('2019-09-16T03:23:08.066Z');

describe('getRevenue', () => {
  it('calculates weekly total', () => {
    const data = [1, 3, 5, 6, 4, 2, 8, 7, 11, 4, 3, 3, 1, 4, 5];
    const price = 5;
    const expectedWeek = [31 * price, 35 * price, 1 * price];
    const expectedMonthYear = [67 * price];
    const { week, month, year } = getRevenue(data, price, today);
    expect(week).toEqual(expectedWeek);
    expect(month).toEqual(expectedMonthYear);
    expect(year).toEqual(expectedMonthYear);
  });

  it('calculates monthly total', () => {
    const data = [...Array(65).keys()].map(k => k + 1);
    const price = 5;
    const expectedMonth = [4350, 5425, 950];
    const expectedYear = [expectedMonth.reduce((a, c) => a + c, 0)];
    const { month, year } = getRevenue(data, price, today);
    expect(month).toEqual(expectedMonth);
    expect(year).toEqual(expectedYear);
  });

  it('calculates yearly total', () => {
    const data = [...Array(1000).keys()].map(k => k + 1);
    const price = 6;
    const expected = [1349082, 1226400, 427050, 468];
    expect(getRevenue(data, price, today).year).toEqual(expected);
  });
});
