const bodyParts = [
  'Arm',
  'Side',
  'Hip',
  'Knee',
  'Air',
  'Leg',
  'Neck',
  'Bun',
  'Elbow',
  'Lip',
  'Nose',
  'Foot',
  'Jumping',
  'Mouth',
  'Ab',
  'Ear',
];

const exercises = [
  'Reach',
  'Rotations',
  'Lifts',
  'Lunge',
  'Squats',
  'Raises',
  'Swingers',
  'Blasters',
  'Burners',
  'Push-Ups',
  'Jacks',
  'Lasers',
  'Twisters',
  'Crunches',
  'Whizzers',
];

// 2 sec each rep
// 105 reps = 3:30
const MAX_REPS = 105;
// 75 reps = 2:30
const MIN_REPS = 95;

const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const getReps = (min = 10, max = 20) => Math.floor(Math.random() * (max - min + 1) + min);
const getNext = arr => {
  const name = `${pick(bodyParts)} ${pick(exercises)}`;
  if (arr.includes(name)) {
    return getNext(arr);
  }
  return { name, reps: getReps() };
};
export const getTotalReps = arr => arr.reduce((acc, curr) => acc + curr.reps, 0);
export const format = seconds => {
  const clamped = seconds < 0 ? 0 : seconds;
  return clamped >= 10 ? `0:${clamped}` : `0:0${clamped}`;
};

export const makeExerciseList = () => {
  let totalReps = 0;
  const exercisesWithReps = [];
  while (totalReps < MAX_REPS - 20) {
    const nextExercise = getNext(exercisesWithReps);
    exercisesWithReps.push(nextExercise);
    totalReps += nextExercise.reps;
  }
  return exercisesWithReps;
};

export const removeBoring = (arr, nameToRemove) => {
  const nonBoring = arr.filter(ea => ea.name !== nameToRemove);
  if (getTotalReps(arr) < MIN_REPS) {
    const nextExercise = getNext(arr);
    return nonBoring.concat(nextExercise);
  }
  return nonBoring;
};
