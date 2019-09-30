import React, { useState, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import { makeExerciseList, getTotalReps, removeBoring, format } from './utils';

const exerciseShape = { name: PropTypes.string, reps: PropTypes.number };

export function Clock({ exercises = [], remove }) {
  const [state, dispatch] = useReducer(
    (s, a) => {
      switch (a.type) {
        case 'TICK':
          return { ...s, secondsLeft: s.secondsLeft - 1 };
        case 'NEXT': {
          const currentIndex = s.currentIndex + 1;
          const currentExercise = exercises[currentIndex];
          if (!currentExercise) {
            return { buttonLabel: 'Next', exerciseName: 'Done!', seconds: null };
          }
          return {
            ...s,
            currentIndex,
            buttonLabel: 'Next',
            exerciseName: currentExercise.name,
            secondsLeft: currentExercise.reps * 2,
          };
        }
        default:
          return s;
      }
    },
    {
      currentIndex: -1,
      secondsLeft: null,
      buttonLabel: 'Start',
      exerciseName: '',
    }
  );

  const { currentIndex, secondsLeft, buttonLabel, exerciseName } = state;

  const startNext = () => dispatch({ type: 'NEXT' });

  useEffect(
    () => {
      if (currentIndex < 0) return;

      const interval = setInterval(() => {
        dispatch({ type: secondsLeft ? 'TICK' : 'NEXT' });
      }, 1000);
      // eslint-disable-next-line consistent-return
      return () => clearInterval(interval);
    },
    [secondsLeft, currentIndex]
  );

  return (
    <>
      <div className="Workout-current">
        <button
          type="button"
          onClick={startNext}
          data-testid="action-button"
          className="Workout-btn--action"
        >
          {buttonLabel}
        </button>
        <h2 data-testid="current-exercise">
          {currentIndex >= 0 && `${currentIndex + 1}. `}
          {exerciseName}
        </h2>
        <h2 data-testid="time-left">{secondsLeft != null ? format(secondsLeft) : ''}</h2>
      </div>
      <div className={secondsLeft === 0 ? 'Workout-list--next' : ''}>
        <ol start={(currentIndex || 0) + 2}>
          {exercises.map(
            (ex, i) =>
              i > currentIndex && (
                <li
                  key={ex.id}
                  className={
                    secondsLeft === 0 && i === currentIndex + 1 ? 'Workout-item--next' : ''
                  }
                >
                  <span>
                    {ex.name}: {ex.reps} Reps
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(ex.name)}
                    className="Workout-btn--text boring"
                  >
                    Too Boring
                  </button>
                </li>
              )
          )}
        </ol>
        <div>Total Reps: {getTotalReps(exercises)}</div>
      </div>
    </>
  );
}

Clock.propTypes = {
  exercises: PropTypes.arrayOf(PropTypes.shape(exerciseShape)).isRequired,
  remove: PropTypes.func.isRequired,
};

function App() {
  const [exercises, setExercises] = useState(makeExerciseList());

  const remove = name => setExercises(prev => removeBoring(prev, name));

  return (
    <div className="Workout">
      <div>
        <h1 className="Workout-head">Sweatin&apos; with Seth</h1>
        <Clock remove={remove} exercises={exercises} />
      </div>
    </div>
  );
}

export default App;
