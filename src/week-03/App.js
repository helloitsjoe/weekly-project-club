import React, { useState, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import { makeExerciseList, getTotalReps, removeBoring, format } from './utils';

const exerciseShape = { name: PropTypes.string, reps: PropTypes.number };

function Clock({ exercises, remove }) {
  const [state, dispatch] = useReducer(
    (s, a) => {
      switch (a.type) {
        case 'TICK':
          return { ...s, secondsLeft: s.secondsLeft - 1 };
        case 'NEXT': {
          const currentIndex = s.currentIndex + 1;
          return { ...s, currentIndex, secondsLeft: exercises[currentIndex].reps * 2 };
        }
        default:
          return s;
      }
    },
    {
      currentIndex: -1,
      secondsLeft: 0,
    }
  );

  const { currentIndex, secondsLeft } = state;

  const startNext = () => dispatch({ type: 'NEXT' });
  const currentExercise = exercises[currentIndex];

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
    <>
      <div className="Workout-current">
        <button className="Workout-btn--next" type="button" onClick={startNext}>
          {!currentExercise ? 'Start' : 'Next'}
        </button>
        <h2>{currentExercise ? currentExercise.name : 'Click to start'}</h2>
        <h2>{format(secondsLeft)}</h2>
      </div>
      <ol start={currentIndex + 2}>
        {exercises &&
          exercises.map(
            (ex, i) =>
              i > currentIndex && (
                <li key={ex.name}>
                  <span>
                    {ex.name}: {ex.reps} Reps
                  </span>
                  <button
                    onClick={() => remove(ex.name)}
                    className="Workout-btn--text boring"
                    type="button"
                  >
                    Boring
                  </button>
                </li>
              )
          )}
      </ol>
      <div>Total Reps: {getTotalReps(exercises)}</div>
    </>
  );
}

Clock.propTypes = {
  exercises: PropTypes.arrayOf(PropTypes.shape(exerciseShape)).isRequired,
  remove: PropTypes.func.isRequired,
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
            <button onClick={remove} className="Workout-btn--text" type="button">
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
  const [mainComponent, setMainComponent] = useState('clock');
  const [exercises, setExercises] = useState(makeExerciseList());

  const remove = name => setExercises(prev => removeBoring(prev, name));

  const Main = mainComponent === 'clock' ? Clock : Print;

  return (
    <div className="Workout">
      <div className="Workout-container">
        <div className="Workout-links">
          <button
            type="button"
            className="Workout-btn--text"
            onClick={() => setMainComponent(Print)}
          >
            Print Version
          </button>
          <button
            type="button"
            className="Workout-btn--text"
            onClick={() => setMainComponent(Clock)}
          >
            Do it Live
          </button>
        </div>
        <h1 className="Workout-head">Sweatin&apos; with Seth</h1>
        <Main remove={remove} exercises={exercises} />
      </div>
    </div>
  );
}

export default App;
