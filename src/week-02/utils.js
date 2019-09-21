export const SLOTS_IN_NINE_HOUR_DAY = 18;

export const CLEANING = 1;
export const FILLING = 2;
export const ROOT_CANAL = 3;

export const TYPES = {
  [CLEANING]: 'CLEANING',
  [FILLING]: 'FILLING',
  [ROOT_CANAL]: 'ROOT CANAL',
};

const isOpen = obj => !!obj && !obj.type; // coerce undefined to false

export const mapSlots = (cal, fn) =>
  Object.entries(cal).reduce((acc, [key, slots]) => {
    acc[key] = slots.map(fn);
    return acc;
  }, {});

export const formatCalData = newData => {
  return Object.entries(newData).reduce((acc, [day, slots]) => {
    return slots.map((slot, i) => ({
      ...acc[i],
      [day]: slot,
    }));
  }, {});
};

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

export const makeRandomWeeklyCal = () => {
  const getRandomSlotType = () => Math.floor(Math.random() * 4);
  const sparsify = type => (Math.round(Math.random()) ? 0 : type);

  const weeklyCal = makeWeeklyCal({ fillWith: {} });
  return mapSlots(weeklyCal, () => {
    const type = sparsify(getRandomSlotType());
    return { text: TYPES[type] || '', type, open: false };
  });
};

export const makeSlot = type => (type ? { type, text: TYPES[type] } : {});

export const markOpenSlots = ({ type, cal }) => {
  if (type === CLEANING) {
    return mapSlots(cal, slot => ({ ...slot, open: !slot.type }));
  }
  if (type === FILLING) {
    return mapSlots(cal, (slot, i, arr) => {
      const curr = arr[i];
      const next = arr[i + 1];
      const prev = arr[i - 1];
      const open = !curr.type && (isOpen(next) || isOpen(prev));
      return { ...slot, open };
    });
  }
  if (type === ROOT_CANAL) {
    return mapSlots(cal, (slot, i, arr) => {
      const curr = arr[i];
      const next = arr[i + 1];
      const prev = arr[i - 1];
      const twoNext = arr[i + 2];
      const twoPrev = arr[i - 2];
      const threeOpen =
        (isOpen(next) && isOpen(prev)) ||
        (!isOpen(next) && isOpen(prev) && isOpen(twoPrev)) ||
        (!isOpen(prev) && isOpen(next) && isOpen(twoNext));

      const open = !curr.type && threeOpen;
      return { ...slot, open };
    });
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
