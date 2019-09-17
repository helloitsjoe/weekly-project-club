import {
  validateBooking,
  createWeeklyCal,
  CLEANING,
  ROOT_CANAL,
  FILLING,
  getOpenSlots,
  SLOTS_IN_NINE_HOUR_DAY,
} from '../utils';

// const today = new Date('2019-09-16T03:23:08.066Z');
let cal;
let testOptions;

describe('createWeeklyCal', () => {
  it('creates M-F 8-5 cal by default', () => {
    const oneDay = new Array(18);
    expect(createWeeklyCal()).toEqual({
      mon: oneDay,
      tues: oneDay,
      wed: oneDay,
      thurs: oneDay,
      fri: oneDay,
    });
  });
});

describe('validateBooking', () => {
  beforeEach(() => {
    cal = createWeeklyCal();
    testOptions = { day: 'mon', timeSlot: 0, type: CLEANING, cal };
  });

  afterEach(() => {
    cal = null;
  });

  it('returns empty string if booking is valid', () => {
    cal.mon[1] = 1;
    expect(validateBooking(testOptions)).toBe('');
  });

  it('forbids booking if selected block is booked', () => {
    cal.mon[0] = 1;
    expect(validateBooking(testOptions)).toBe('You must pick an empty time slot!');
  });

  it('forbids booking if multi-block overlaps with booked slot', () => {
    cal.mon[2] = 1;
    expect(validateBooking({ ...testOptions, type: ROOT_CANAL })).toBe(
      'You must pick an empty time slot!'
    );
  });

  it('forbids booking if multi-block goes after end time', () => {
    const timeSlot = cal.mon.length;
    expect(validateBooking({ ...testOptions, timeSlot, type: CLEANING })).toBe('');
    expect(validateBooking({ ...testOptions, timeSlot, type: FILLING })).toBe(
      'Your entire appointment must be within work hours!'
    );
  });

  it('throws if no options provided', () => {
    expect(validateBooking).toThrow();
  });
});
