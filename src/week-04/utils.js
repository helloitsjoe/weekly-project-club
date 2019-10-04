import supervillains from 'supervillains';
import lastNames from 'common-last-names';
import { subWeeks } from 'date-fns';

const groups = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Omega'];

const getFullName = () => `${supervillains.random()} ${lastNames.random()}`;

const getMemberSince = () => {
  const date = new Date();
  const weeksWithinFourYears = Math.floor(Math.random() * 208);
  return subWeeks(date, weeksWithinFourYears);
};

const getCommunityHours = () => Math.floor(Math.random() * 200);

const getIsNominated = () => !!Math.round(Math.random());

const getGroup = () => groups[Math.floor(Math.random() * groups.length)];

export const createPerson = () => {
  return {
    name: getFullName(),
    memberSince: getMemberSince(),
    communityHours: getCommunityHours(),
    nominated: getIsNominated(),
    group: getGroup(),
  };
};

export const createData = (num = 20) =>
  Array(num)
    .fill({})
    .map(() => createPerson());

// TODO: normalizeData
// TODO: getIsEligible
