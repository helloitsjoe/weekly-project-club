export const SLOTS_IN_NINE_HOUR_DAY = 18;

export const CLEANING = 1;
export const FILLING = 2;
export const ROOT_CANAL = 3;

export const createWeeklyCal = () => {
  // TODO: Customizable start/end times
  // TODO: Add date headers, based on today
  // TODO: Option to include Sat/Sun
  return {
    mon: new Array(SLOTS_IN_NINE_HOUR_DAY),
    tues: new Array(SLOTS_IN_NINE_HOUR_DAY),
    wed: new Array(SLOTS_IN_NINE_HOUR_DAY),
    thurs: new Array(SLOTS_IN_NINE_HOUR_DAY),
    fri: new Array(SLOTS_IN_NINE_HOUR_DAY),
  };
};

export const getOpenSlots = (type, cal) => {
  // Return slots based on type
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
