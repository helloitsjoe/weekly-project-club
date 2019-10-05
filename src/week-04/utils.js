import supervillains from 'supervillains';
import lastNames from 'common-last-names';
import { subWeeks, subYears, isBefore } from 'date-fns';

const groups = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Omega'];

const getFullName = () => `${supervillains.random()} ${lastNames.random()}`;

const getMemberSince = () => {
  const date = new Date();
  const weeksWithinTenYears = Math.floor(Math.random() * 520);
  return subWeeks(date, weeksWithinTenYears);
};

const getCommunityHours = () => Math.floor(Math.random() * 400);

const getIsNominated = () => !!Math.round(Math.random());

const getGroup = () => groups[Math.floor(Math.random() * groups.length)];

export const getIsEligible = ({ memberSince, communityHours, nominated, today = new Date() }) => {
  const atLeastTwoYears = isBefore(new Date(memberSince), subYears(today, 2));
  return atLeastTwoYears && communityHours >= 100 && nominated;
};

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

export const getGroups = data =>
  data.reduce((finalGroups, person) => {
    const { group } = person;
    const groupValue = (finalGroups[group] || []).concat(person.name);
    return { ...finalGroups, [group]: groupValue };
  }, {});

// TODO: getIsEligible
