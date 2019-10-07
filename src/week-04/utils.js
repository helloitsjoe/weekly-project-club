import supervillains from 'supervillains';
import lastNames from 'common-last-names';
import { subWeeks, subYears, isBefore } from 'date-fns';

const groups = ['Alpha', 'Beta', 'Omega'];

const getFullName = () => `${supervillains.random()} ${lastNames.random()}`;

const getMemberSince = () => {
  const date = new Date();
  const weeksWithinTenYears = Math.floor(Math.random() * 520);
  return subWeeks(date, weeksWithinTenYears);
};

const getCommunityHours = () => Math.floor(Math.random() * 400);

const getIsNominated = () => !!Math.round(Math.random());

const getGroup = () => groups[Math.floor(Math.random() * groups.length)];

export const getEligibleYears = (dateOrString, today = new Date()) =>
  isBefore(new Date(dateOrString), subYears(today, 2));

export const getEligibleHours = hours => hours > 100;

export const getIsEligible = ({ memberSince, communityHours, nominated }) => {
  return getEligibleYears(memberSince) && getEligibleHours(communityHours) && nominated;
};

export const createPerson = () => {
  return {
    name: getFullName(),
    memberSince: getMemberSince(),
    communityHours: getCommunityHours(),
    nominated: getIsNominated(),
    group: getGroup(),
    exceptional: false,
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
