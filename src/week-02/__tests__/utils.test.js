import {
  validateBooking,
  makeWeeklyCal,
  CLEANING,
  ROOT_CANAL,
  FILLING,
  makeSlot,
  markOpenSlots,
  SLOTS_IN_NINE_HOUR_DAY,
  mapSlots,
} from '../utils';

let cal;
let testOptions;

describe('makeSlot', () => {
  it('makes proper slot types', () => {
    expect(makeSlot(CLEANING)).toEqual({ type: CLEANING, text: 'CLEANING' });
    expect(makeSlot(FILLING)).toEqual({ type: FILLING, text: 'FILLING' });
    expect(makeSlot(ROOT_CANAL)).toEqual({ type: ROOT_CANAL, text: 'ROOT CANAL' });
    expect(makeSlot()).toEqual({});
  });
});

describe('mapSlots', () => {
  it('calls mapping function over slots in calendar object', () => {
    const calData = { mon: [1, 2, 3], tues: [4, 5] };
    // Should include all arguments to mapping function
    const squareFn = (ea, i, arr) => ea * ea + i + arr.length;
    expect(mapSlots(calData, squareFn)).toEqual({
      mon: [4, 8, 14],
      tues: [18, 28],
    });
  });
});

describe('makeWeeklyCal', () => {
  it('creates M-F 8-5 cal by default', () => {
    const oneDay = new Array(SLOTS_IN_NINE_HOUR_DAY).fill(expect.any(Object));
    expect(makeWeeklyCal()).toEqual({
      mon: oneDay,
      tues: oneDay,
      wed: oneDay,
      thurs: oneDay,
      fri: oneDay,
    });
  });

  it('accepts start/end hours', () => {
    const threeHourDay = new Array(6).fill(expect.any(Object));
    expect(makeWeeklyCal({ startHour: 12, endHour: 15 })).toEqual({
      mon: threeHourDay,
      tues: threeHourDay,
      wed: threeHourDay,
      thurs: threeHourDay,
      fri: threeHourDay,
    });
  });

  it('throws if start time is before end time', () => {
    expect(() => makeWeeklyCal({ startHour: 1, endHour: 0 })).toThrow();
  });
});

describe('markOpenSlots', () => {
  const getOpenBools = calData => mapSlots(calData, slot => slot.open);

  beforeEach(() => {
    cal = makeWeeklyCal({ startHour: 12, endHour: 14 });
    cal.mon[0] = makeSlot(CLEANING);
    cal.tues[1] = makeSlot(CLEANING);
    cal.tues[2] = makeSlot(CLEANING);
    cal.wed[1] = makeSlot(CLEANING);
    cal.thurs[2] = makeSlot(CLEANING);
    // TODO: Come up with more complex test cases
    // m: [1, 0, 0, 0]
    // t: [0, 2, 2, 0]
    // w: [0, 1, 0, 0]
    // t: [0, 0, 1, 0]
    // f: [0, 0, 0, 0]
  });

  afterEach(() => {
    cal = null;
  });

  it('gets open slots for cleaning', () => {
    expect(getOpenBools(markOpenSlots({ type: CLEANING, cal }))).toEqual({
      mon: [false, true, true, true],
      tues: [true, false, false, true],
      wed: [true, false, true, true],
      thurs: [true, true, false, true],
      fri: new Array(4).fill(true),
    });
  });

  it('gets open slots for filling', () => {
    expect(getOpenBools(markOpenSlots({ type: FILLING, cal }))).toEqual({
      mon: [false, true, true, true],
      tues: [false, false, false, false],
      wed: [false, false, true, true],
      thurs: [true, true, false, false],
      fri: [...new Array(4).fill(true)],
    });
  });

  it('gets open slots for root canal', () => {
    expect(getOpenBools(markOpenSlots({ type: ROOT_CANAL, cal }))).toEqual({
      mon: [false, true, true, true],
      tues: [false, false, false, false],
      wed: [false, false, false, false],
      thurs: [false, false, false, false],
      fri: [...new Array(4).fill(true)],
    });
  });

  it('six blocks for root canal', () => {
    cal = makeWeeklyCal({ startHour: 11, endHour: 14 });
    cal.mon[0] = makeSlot(CLEANING);
    cal.mon[1] = makeSlot(CLEANING);
    cal.mon[4] = makeSlot(CLEANING);
    cal.mon[5] = makeSlot(CLEANING);
    cal.tues[0] = makeSlot(CLEANING);
    cal.tues[4] = makeSlot(CLEANING);
    cal.tues[5] = makeSlot(CLEANING);
    cal.wed[0] = makeSlot(CLEANING);
    cal.wed[3] = makeSlot(CLEANING);
    cal.thurs[2] = makeSlot(CLEANING);
    cal.thurs[3] = makeSlot(CLEANING);
    expect(getOpenBools(markOpenSlots({ type: ROOT_CANAL, cal }))).toEqual({
      mon: [false, false, false, false, false, false],
      tues: [false, true, true, true, false, false],
      wed: [false, false, false, false, false, false],
      thurs: [false, false, false, false, false, false],
      fri: [...new Array(6).fill(true)],
    });
  });
});

describe('validateBooking', () => {
  beforeEach(() => {
    cal = makeWeeklyCal();
    testOptions = { day: 'mon', timeSlot: 0, currentType: CLEANING, cal };
  });

  afterEach(() => {
    cal = null;
  });

  it('returns empty string if booking is valid', () => {
    cal.mon[1] = makeSlot(CLEANING);
    expect(validateBooking(testOptions)).toBe('');
  });

  it('forbids booking if no type is selected', () => {
    expect(validateBooking({ ...testOptions, currentType: 0 })).toBe(
      'Please select a type to book an appointment'
    );
  });

  it('forbids booking if selected block is booked', () => {
    cal.mon[0] = makeSlot(CLEANING);
    expect(validateBooking(testOptions)).toBe('You must pick an empty time slot!');
  });

  it('forbids booking if multi-block overlaps with booked slot', () => {
    cal.mon[2] = makeSlot(CLEANING);
    expect(validateBooking({ ...testOptions, currentType: ROOT_CANAL })).toBe(
      'You must pick an empty time slot!'
    );
  });

  it('forbids booking if multi-block goes after end time', () => {
    const timeSlot = cal.mon.length - 1;
    expect(validateBooking({ ...testOptions, timeSlot, currentType: CLEANING })).toBe('');
    expect(validateBooking({ ...testOptions, timeSlot, currentType: FILLING })).toBe(
      'Your entire appointment must be within work hours!'
    );
  });

  it('throws if no options provided', () => {
    expect(validateBooking).toThrow();
  });
});
