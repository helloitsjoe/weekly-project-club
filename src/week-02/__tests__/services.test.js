/* eslint-disable indent */
import { ROOT_CANAL, FILLING, CLEANING, SLOTS_IN_NINE_HOUR_DAY } from '../utils';
import { resetCal, updateCal } from '../services';

describe('updateCal', () => {
  afterEach(() => {
    // updateCal is a fake POST request, mutating the calendar. Reset after each test.
    return resetCal();
  });

  it.each`
    count | type          | typeName
    ${3}  | ${ROOT_CANAL} | ${'root canal'}
    ${2}  | ${FILLING}    | ${'filling'}
    ${1}  | ${CLEANING}   | ${'cleaning'}
  `('returns updated cal with $count slots booked if $typeName', ({ count, type }) => {
    resetCal();
    return updateCal({ name: 'JB', day: 'mon', type, timeSlot: 0 }).then(newCal => {
      const updatedSlots = new Array(count).fill(expect.objectContaining({ type }));
      const restOfDay = new Array(SLOTS_IN_NINE_HOUR_DAY)
        .fill(expect.not.objectContaining({ type }))
        .slice(count);
      expect(newCal.mon).toEqual(updatedSlots.concat(restOfDay));
    });
  });

  it.each`
    day      | timeSlot | name    | type        | missing
    ${null}  | ${0}     | ${'JB'} | ${CLEANING} | ${'day'}
    ${'mon'} | ${null}  | ${'JB'} | ${CLEANING} | ${'timeSlot'}
    ${'mon'} | ${0}     | ${'JB'} | ${null}     | ${'type'}
  `('Missing $missing throws error', ({ day, timeSlot, name, type }) => {
    expect(() => updateCal({ day, timeSlot, name, type })).toThrow(
      'Update requires day, timeSlot, and type.'
    );
  });
});
