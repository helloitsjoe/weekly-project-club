import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import { makeExerciseList, getTotalReps, removeBoring, format } from './utils';

const APP = 'app';
const PRINT = 'print';

const exerciseShape = { name: PropTypes.string, reps: PropTypes.number };

function Clock({ currentExercise, secondsLeft, exercises, startNext, remove }) {
  console.log(`currentExercise:`, currentExercise);
  return (
    <>
      <div>
        <button type="button" onClick={startNext}>
          {!currentExercise ? 'Start' : 'Next'}
        </button>
        {currentExercise ? currentExercise.name : 'Click to start'}
        {format(secondsLeft)}
      </div>
      <ol>
        {exercises &&
          exercises.map(ex => (
            <li key={ex.name}>
              <span>
                {ex.name}: {ex.reps} Reps
              </span>
              <button onClick={() => remove(ex.name)} className="text" type="button">
                Boring
              </button>
            </li>
          ))}
      </ol>
      <div>Total Reps: {getTotalReps(exercises)}</div>
    </>
  );
}

Clock.propTypes = {
  currentExercise: PropTypes.shape(exerciseShape),
  exercises: PropTypes.arrayOf(PropTypes.shape(exerciseShape)).isRequired,
  secondsLeft: PropTypes.number.isRequired,
  startNext: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
};

Clock.defaultProps = {
  currentExercise: null,
};

function Print({ remove, exercises }) {
  return (
    <>
      <ol>
        {exercises.map(ex => (
          <li key={ex.name}>
            <span>
              {ex.name}: {ex.reps} Reps
            </span>
            <button onClick={remove} className="text" type="button">
              Boring
            </button>
          </li>
        ))}
      </ol>
      <div>Total Reps: {getTotalReps(exercises)}</div>
    </>
  );
}

Print.propTypes = {
  exercises: PropTypes.arrayOf(PropTypes.shape(exerciseShape)).isRequired,
  remove: PropTypes.func.isRequired,
};

function App() {
  const [state, dispatch] = useReducer(
    (s, a) => {
      switch (a.type) {
        case 'TICK':
          return { ...s, secondsLeft: s.secondsLeft - 1 };
        case 'VIEW_APP':
          return { ...s, version: APP };
        case 'VIEW_PRINT':
          return { ...s, version: PRINT };
        case 'REMOVE':
          return { ...s, exercises: removeBoring(s.exercises, a.payload) };
        case 'NEXT': {
          const [currentExercise, ...rest] = s.exercises;
          return { ...s, currentExercise, exercises: rest, secondsLeft: currentExercise.reps * 2 };
        }
        default:
          return s;
      }
    },
    {
      version: APP,
      exercises: makeExerciseList(),
      currentExercise: null,
      secondsLeft: 0,
    }
  );

  const { version, exercises, currentExercise, secondsLeft } = state;

  const startNext = () => dispatch({ type: 'NEXT' });
  const remove = name => dispatch({ type: 'REMOVE', payload: name });

  useEffect(
    () => {
      const interval = setInterval(() => {
        dispatch({ type: secondsLeft ? 'TICK' : 'NEXT' });
      }, 1000);

      return () => clearInterval(interval);
    },
    [secondsLeft]
  );

  return (
    <div className="Workout">
      <div className="Workout-container">
        <div className="Workout-links">
          <button type="button" className="text" onClick={() => dispatch({ type: 'VIEW_PRINT' })}>
            Print Version
          </button>
          <button type="button" className="text" onClick={() => dispatch({ type: 'VIEW_APP' })}>
            Do it Live
          </button>
        </div>
        <h1 className="Workout-head">Sweatin&apos; with Seth</h1>
        {version === APP ? (
          <Clock
            currentExercise={currentExercise}
            secondsLeft={secondsLeft}
            exercises={exercises}
            startNext={startNext}
            remove={remove}
          />
        ) : (
          <Print remove={remove} exercises={exercises} />
        )}
      </div>
    </div>
  );
}

export default App;
