import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import MatildasCupcakes from './week-01/App';
import MarthaDentist from './week-02/App';
import SweatySeth from './week-03/App';
import HonorableAnnMarie from './week-04/App';

import './index.css';

const getReadme = week =>
  `https://github.com/helloitsjoe/weekly-project-club/blob/master/src/week-${week}/README.md`;

const weeks = [
  { readme: getReadme('01'), app: MatildasCupcakes },
  { readme: getReadme('02'), app: MarthaDentist },
  { readme: getReadme('03'), app: SweatySeth },
  { readme: getReadme('04'), app: HonorableAnnMarie },
];

// This assumes that the last query param will be the initialIndex
const q = window ? window.location.search : '';
const page = q.substring(q.lastIndexOf('=') + 1) || weeks.length - 1;

function App() {
  const [currentWeek, setCurrentWeek] = useState(page);
  const Main = weeks[currentWeek].app;
  return (
    <>
      <Main />
      <div className="menu">
        <select value={currentWeek} onChange={e => setCurrentWeek(e.target.value)} name="weeks">
          <option value={0}>Week 1: Matilda&apos;s Cupcakes</option>
          <option value={1}>Week 2: Martha&apos;s Dentapalooza</option>
          <option value={2}>Week 3: Sweatin&apos; with Seth</option>
          <option value={3}>Week 4: Ann-Marie&apos;s Dishonor Society</option>
        </select>
        <a href={weeks[currentWeek].readme}>Project Brief</a>
      </div>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
