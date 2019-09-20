export const SLOTS_IN_NINE_HOUR_DAY = 18;

export const CLEANING = 1;
export const FILLING = 2;
export const ROOT_CANAL = 3;

export const TYPES = {
  [CLEANING]: 'CLEANING',
  [FILLING]: 'FILLING',
  [ROOT_CANAL]: 'ROOT CANAL',
};

const open = obj => !!obj && !obj.type; // coerce undefined to false

export const makeWeeklyCal = ({ startHour = 8, endHour = 17, fillWith = {} } = {}) => {
  // TODO: Option to include Sat/Sun
  if (startHour > endHour) {
    throw new Error('Start time must be before end time!');
  }

  const halfHourSlots = (endHour - startHour) * 2;

  return {
    mon: new Array(halfHourSlots).fill(fillWith),
    tues: new Array(halfHourSlots).fill(fillWith),
    wed: new Array(halfHourSlots).fill(fillWith),
    thurs: new Array(halfHourSlots).fill(fillWith),
    fri: new Array(halfHourSlots).fill(fillWith),
  };
};

export const makeSlot = type => (type ? { type, text: TYPES[type] } : {});

export const getOpenSlots = ({ type, cal }) => {
  if (type === CLEANING) {
    return Object.keys(cal).reduce((acc, key) => {
      acc[key] = cal[key].map(slot => !slot.type);
      return acc;
    }, {});
  }
  if (type === FILLING) {
    return Object.keys(cal).reduce((acc, key) => {
      acc[key] = cal[key].map((slot, i, arr) => {
        const curr = arr[i];
        const next = arr[i + 1];
        const prev = arr[i - 1];
        return !curr.type && (open(next) || open(prev));
      });
      return acc;
    }, {});
  }
  if (type === ROOT_CANAL) {
    return Object.keys(cal).reduce((acc, key) => {
      acc[key] = cal[key].map((slot, i, arr) => {
        const curr = arr[i];
        const next = arr[i + 1];
        const prev = arr[i - 1];
        const twoNext = arr[i + 2];
        const twoPrev = arr[i - 2];
        const threeOpen =
          (open(next) && open(prev)) ||
          (!open(next) && open(prev) && open(twoPrev)) ||
          (!open(prev) && open(next) && open(twoNext));

        return !curr.type && threeOpen;
      });
      return acc;
    }, {});
  }
  return null;
};

export const validateBooking = ({ day, timeSlot, currentType, cal }) => {
  if ([day, timeSlot, currentType, cal].some(option => option == null)) {
    return 'Invalid booking';
  }

  if (!currentType) {
    return 'Please select a type to book an appointment';
  }

  if (timeSlot + currentType > cal[day].length) {
    return 'Your entire appointment must be within work hours!';
  }

  for (let i = 0; i < currentType; i++) {
    const slot = cal[day][timeSlot + i];
    if (slot && slot.type > 0) {
      return 'You must pick an empty time slot!';
    }
  }

  return '';
};
