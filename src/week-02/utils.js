export const SLOTS_IN_NINE_HOUR_DAY = 18;

export const CLEANING = 1;
export const FILLING = 2;
export const ROOT_CANAL = 3;

export const TYPES = {
  [CLEANING]: 'CLEANING',
  [FILLING]: 'FILLING',
  [ROOT_CANAL]: 'ROOT CANAL',
};

export const createWeeklyCal = ({ startHour = 8, endHour = 17, fillWith = null } = {}) => {
  // TODO: Add date headers, based on today
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

export const getOpenSlots = ({ type, cal }) => {
  if (type === CLEANING) {
    return Object.keys(cal).reduce((acc, key) => {
      acc[key] = cal[key].map(slot => !slot);
      return acc;
    }, {});
  }
  if (type === FILLING) {
    return Object.keys(cal).reduce((acc, key) => {
      acc[key] = cal[key].map((slot, i, arr) => {
        const blocked =
          arr[i] ||
          ((arr[i - 1] || i - 1 < 0) && arr[i + 1]) ||
          (arr[i - 1] && i + type > arr.length);
        return !blocked;
      });
      return acc;
    }, {});
  }
  if (type === ROOT_CANAL) {
    return Object.keys(cal).reduce((acc, key) => {
      acc[key] = cal[key].map((slot, i, arr) => {
        // TODO: Yikes.
        const curr = arr[i];
        const prevAndNext =
          (arr[i - 1] || arr[i - 2] || (i - 1 < 0 || i - 2 < 0)) && (arr[i + 1] || arr[i + 2]);
        const last =
          (arr[i - 1] && i + type > arr.length) || (arr[i - 2] && i + type - 1 > arr.length);

        const blocked = curr || prevAndNext || last;
        return !blocked;
      });
      return acc;
    }, {});
  }
  return null;
};

export const validateBooking = ({ day, timeSlot, type, cal }) => {
  if ([day, timeSlot, type, cal].some(option => option == null)) {
    return 'Invalid booking';
  }

  if (timeSlot + type - 1 > SLOTS_IN_NINE_HOUR_DAY) {
    return 'Your entire appointment must be within work hours!';
  }

  for (let i = 0; i < type; i++) {
    if (cal[day][timeSlot + i] != null) {
      return 'You must pick an empty time slot!';
    }
  }

  return '';
};
