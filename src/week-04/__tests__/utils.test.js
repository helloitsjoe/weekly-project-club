import { getGroups, getIsEligible } from '../utils';
import mockData from './mock-data';

describe('getGroups', () => {
  it('formats members into groups', () => {
    const groups = getGroups(mockData);
    expect(groups).toEqual({
      alpha: ['Joe Boyle', 'Missy Boyle'],
      gamma: ['Olive Boyle'],
      delta: ['Rowan Boyle'],
    });
  });
});

describe('getIsEligible', () => {
  it('returns true if membership is >= 2 years, communityHours > 100, and nominated', () => {
    const yep = {
      name: 'Yep',
      group: 'alpha',
      communityHours: 105,
      memberSince: 'October 3, 1978',
      nominated: true,
    };
    const tooRecent = {
      name: 'Nope',
      group: 'gamma',
      communityHours: 105,
      memberSince: new Date(),
      nominated: true,
    };
    const tooFewHours = {
      name: 'Nope',
      group: 'gamma',
      communityHours: 99,
      memberSince: 'October 3, 1978',
      nominated: true,
    };
    const notNominated = {
      name: 'Nope',
      group: 'gamma',
      communityHours: 105,
      memberSince: 'October 3, 1978',
      nominated: false,
    };
    expect(getIsEligible(yep)).toBe(true);
    expect(getIsEligible(tooRecent)).toBe(false);
    expect(getIsEligible(tooFewHours)).toBe(false);
    expect(getIsEligible(notNominated)).toBe(false);
  });
});
