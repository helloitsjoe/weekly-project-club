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
  'Eyeball',
  'Nose',
  'Foot',
  'Jumping',
  'Mouth',
  'Ab',
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
];

// 2 sec each rep
// 105 reps = 3:30
const MAX_REPS = 105;
// 75 reps = 2:30
const MIN_REPS = 75;

const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const getReps = (min = 10, max = 20) => Math.floor(Math.random() * (max - min + 1) + min);
export const getTotalReps = arr => arr.reduce((acc, curr) => acc + curr.reps, 0);

export const makeExerciseList = () => {
  let totalReps = 0;
  const exercisesWithReps = [];
  while (totalReps < MAX_REPS - 20) {
    const reps = getReps();
    exercisesWithReps.push({ name: `${pick(bodyParts)} ${pick(exercises)}`, reps });
    totalReps += reps;
  }
  return exercisesWithReps;
};

export const removeBoring = (arr, indexToRemove) => {
  const nonBoring = arr.filter((ea, i) => i !== indexToRemove);
  if (getTotalReps(arr) < MIN_REPS) {
    return nonBoring.concat({ name: `${pick(bodyParts)} ${pick(exercises)}`, reps: getReps() });
  }
  return nonBoring;
};
