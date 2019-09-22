import {
  range,
  makeRandomWeeklyCal,
  makeWeeklyCal,
  makeSlot,
  FILLING,
  ROOT_CANAL,
  CLEANING,
} from './utils';

const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

const startHour = 9;
const endHour = 17;

let cal = makeRandomWeeklyCal({ startHour, endHour });

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

const seedCalendar = () => {
  return Promise.all([
    updateCal({ day: 'mon', timeSlot: 0, type: FILLING }),
    updateCal({ day: 'mon', timeSlot: 4, type: CLEANING }),
    updateCal({ day: 'tues', timeSlot: endHour - 5, type: ROOT_CANAL }),
    updateCal({ day: 'wed', timeSlot: 3, type: CLEANING }),
    updateCal({ day: 'wed', timeSlot: 5, type: CLEANING }),
    updateCal({ day: 'wed', timeSlot: 7, type: CLEANING }),
    updateCal({ day: 'fri', timeSlot: 3, type: ROOT_CANAL }),
    updateCal({ day: 'fri', timeSlot: endHour - 6, type: FILLING }),
  ]);
};

seedCalendar();
