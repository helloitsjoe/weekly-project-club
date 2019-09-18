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
    const oneDay = new Array(SLOTS_IN_NINE_HOUR_DAY).fill(null);
    expect(createWeeklyCal()).toEqual({
      mon: oneDay,
      tues: oneDay,
      wed: oneDay,
      thurs: oneDay,
      fri: oneDay,
    });
  });

  it('accepts start/end hours', () => {
    const threeHourDay = new Array(6).fill(null);
    expect(createWeeklyCal({ startHour: 12, endHour: 15 })).toEqual({
      mon: threeHourDay,
      tues: threeHourDay,
      wed: threeHourDay,
      thurs: threeHourDay,
      fri: threeHourDay,
    });
  });

  it('throws if start time is before end time', () => {
    expect(() => createWeeklyCal({ startHour: 1, endHour: 0 })).toThrow();
  });
});

describe('getOpenSlots', () => {
  beforeEach(() => {
    cal = createWeeklyCal({ startHour: 12, endHour: 14 });
    cal.mon[0] = 1;
    cal.tues[1] = 2;
    cal.tues[2] = 2;
    cal.wed[1] = 1;
    cal.thurs[2] = 1;
    // TODO: Come up with more complex test cases
    // m: [1, 0, 0, 0]
    // t: [0, 2, 2, 0]
    // w: [0, 1, 0, 0]
    // t: [0, 0, 1, 0]
    // t: [0, 0, 0, 0]
  });

  afterEach(() => {
    cal = null;
  });

  it('gets open slots for cleaning', () => {
    expect(getOpenSlots({ type: CLEANING, cal })).toEqual({
      mon: [false, true, true, true],
      tues: [true, false, false, true],
      wed: [true, false, true, true],
      thurs: [true, true, false, true],
      fri: new Array(4).fill(true),
    });
  });

  it('gets open slots for filling', () => {
    expect(getOpenSlots({ type: FILLING, cal })).toEqual({
      mon: [false, true, true, true],
      tues: [false, false, false, false],
      wed: [false, false, true, true],
      thurs: [true, true, false, false],
      fri: [...new Array(4).fill(true)],
    });
  });

  it('gets open slots for root canal', () => {
    expect(getOpenSlots({ type: ROOT_CANAL, cal })).toEqual({
      mon: [false, true, true, true],
      tues: [false, false, false, false],
      wed: [false, false, false, false],
      thurs: [false, false, false, false],
      fri: [...new Array(4).fill(true)],
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
