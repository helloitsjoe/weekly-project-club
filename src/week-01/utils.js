export const convert = (data, price = 1) => data.map((ea, i) => ({ day: i, total: ea * price }));
export const getRevenueInTime = (dailyCookies, price = 1, daysInTimeUnit = 7) => {
  let currentTimeUnit = 0;
  return dailyCookies
    .reduceRight(
      (weeklyRev, dailyCookies) => {
        if (currentTimeUnit > daysInTimeUnit - 1) {
          weeklyRev.push(0);
          currentTimeUnit = 0;
        }
        weeklyRev[weeklyRev.length - 1] += dailyCookies * price;
        currentTimeUnit++;

        return weeklyRev;
      },
      [0]
    )
    .reverse();
};

export const getWeeklyRev = (dailyCookies, price) => getRevenueInTime(dailyCookies, price, 7);
export const getMonthlyRev = (dailyCookies, price) => getRevenueInTime(dailyCookies, price, 30);
export const getYearlyRev = (dailyCookies, price) => getRevenueInTime(dailyCookies, price, 365);
