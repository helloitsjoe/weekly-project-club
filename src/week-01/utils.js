import PropTypes from 'prop-types';
import { isLastDayOfMonth, subDays } from 'date-fns';

export const BASIC_PRICE = 5;
export const DELUXE_PRICE = 6;

export const titleCase = str => str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();

// Creates arrays for weekly, monthly, yearly revenue.
// Most recent revenue is at the beginning of the array.
export const getRevenue = (rawCupcakeData, price = 1, today = new Date()) => {
  let dayOfWeek = 0;
  let currDay = today;

  return rawCupcakeData.reduceRight(
    (acc, dailyCupcakes) => {
      // Week totals (rolling full week starting with today)
      if (dayOfWeek > 6) {
        acc.week.push(0);
        dayOfWeek = 0;
      }

      // Month and year totals, starts at current day of the month
      if (isLastDayOfMonth(currDay)) {
        acc.month.push(0);
        if (currDay.getMonth() === 11) {
          acc.year.push(0);
        }
      }
      acc.week[acc.week.length - 1] += dailyCupcakes * price;
      acc.month[acc.month.length - 1] += dailyCupcakes * price;
      acc.year[acc.year.length - 1] += dailyCupcakes * price;

      dayOfWeek++;
      currDay = subDays(currDay, 1);
      return acc;
    },
    {
      week: [0],
      month: [0],
      year: [0],
    }
  );
};

export const dataShape = {
  basic: PropTypes.arrayOf(PropTypes.number).isRequired,
  deluxe: PropTypes.arrayOf(PropTypes.number).isRequired,
  total: PropTypes.arrayOf(PropTypes.number).isRequired,
};
