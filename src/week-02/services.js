import { range, makeRandomWeeklyCal, makeWeeklyCal, makeSlot } from './utils';

const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

let cal = makeRandomWeeklyCal({ startHour: 9, endHour: 17 });

// Fake GET
export const fetchCal = () => sleep(500).then(() => Promise.resolve(cal));

// Fake POST
export const updateCal = ({ day, timeSlot, type }) => {
  if ([day, timeSlot, type].some(option => option == null)) {
    throw new Error('Update requires day, timeSlot, and type.');
  }

  return sleep(500).then(() => {
    cal[day] = cal[day].map((slot, i) => {
      if (range(timeSlot, timeSlot + type).includes(i)) {
        return { ...slot, ...makeSlot(type) };
      }
      return slot;
    });
    return cal;
  });
};

// Reset helper for tests
export const resetCal = () => {
  cal = makeWeeklyCal();
};
