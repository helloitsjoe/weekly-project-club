import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import './App.css';
import { makeExerciseList, getTotalReps, removeBoring } from './utils';

const APP = 'app';
const PRINT = 'print';

function App() {
  const [version, setVersion] = useState(PRINT);
  const [exercises, setExercises] = useState(makeExerciseList());

  return (
    <div className="Workout">
      <div className="Workout-container">
        <div className="Workout-links">
          <button type="button" className="text" onClick={() => setVersion(PRINT)}>
            Print Version
          </button>
          <button type="button" className="text" onClick={() => setVersion(APP)}>
            Do it Live
          </button>
        </div>
        <h1 className="Workout-head">Sweatin&apos; with Seth</h1>
        {version === APP ? (
          <div>Coming soon...</div>
        ) : (
          <>
            <ol>
              {exercises.map((ex, i) => (
                <li key={ex.name}>
                  <span>
                    {ex.name}: {ex.reps} Reps
                  </span>
                  <button
                    onClick={() => setExercises(removeBoring(exercises, i))}
                    className="text"
                    type="button"
                  >
                    Too boring
                  </button>
                </li>
              ))}
            </ol>
            <div>Total Reps: {getTotalReps(exercises)}</div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
