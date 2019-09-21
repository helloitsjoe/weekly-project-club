import { makeRandomWeeklyCal, makeWeeklyCal, makeSlot } from './utils';

let cal = makeRandomWeeklyCal();

const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchCal = () => {
  // Fake GET
  // return sleep(500).then(() => Promise.resolve(cal));
  return Promise.resolve(cal);
};

export const updateCal = ({ day, timeSlot, type }) => {
  if ([day, timeSlot, type].some(option => option == null)) {
    throw new Error('Update requires day, timeSlot, and type.');
  }

  // Fake POST
  return sleep(500).then(() => {
    cal[day] = [
      ...cal[day].slice(0, timeSlot),
      ...new Array(type).fill(makeSlot(type)),
      ...cal[day].slice(timeSlot + type),
    ];
    return cal;
  });
};

// Reset helper for tests
export const resetCal = () => {
  cal = makeWeeklyCal();
};
