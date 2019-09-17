import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import MatildasCupcakes from './week-01/App';
import MarthaDentist from './week-02/App';

import './index.css';

const weeks = [MatildasCupcakes, MarthaDentist];

function App() {
  const [currentWeek, setCurrentWeek] = useState(0);
  const Main = weeks[currentWeek];
  return (
    <div>
      <select className="menu" onChange={e => setCurrentWeek(e.target.value)} name="weeks">
        <option value={0}>Week 1</option>
        <option value={1}>Week 2</option>
      </select>
      <Main />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
