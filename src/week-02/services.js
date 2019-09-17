import { createWeeklyCal } from './utils';

let cal = createWeeklyCal();

const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchCal = () => sleep(500).then(() => Promise.resolve(cal));

export const updateCal = ({ day, timeSlot, type }) => {
  if ([day, timeSlot, type].some(option => option == null)) {
    throw new Error('Update requires day, timeSlot, and type.');
  }

  return sleep(500).then(() => {
    cal[day] = [
      ...cal[day].slice(0, timeSlot),
      ...new Array(type).fill(type),
      ...cal[day].slice(timeSlot + type),
    ];
    return cal;
  });
};

export const resetCal = () => {
  cal = createWeeklyCal();
};
