import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import MatildasCupcakes from './week-01/App';
import MarthaDentist from './week-02/App';
import SweatySeth from './week-03/App';

import './index.css';

const weeks = [MatildasCupcakes, MarthaDentist, SweatySeth];

// This assumes that the last query param will be the initialIndex
const q = window ? window.location.search : '';
const initialIndex = q.substring(q.lastIndexOf('=') + 1) || weeks[weeks.length - 1];

function App() {
  const [currentWeek, setCurrentWeek] = useState(initialIndex);
  const Main = weeks[currentWeek];
  return (
    <div>
      <Main />
      <select
        className="menu"
        value={currentWeek}
        onChange={e => setCurrentWeek(e.target.value)}
        name="weeks"
      >
        <option value={0}>Week 1: Matilda&apos;s Cupcakes</option>
        <option value={1}>Week 2: Martha&apos;s Dentapalooza</option>
        <option value={2}>Week 3: Sweatin&apos; with Seth</option>
      </select>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
