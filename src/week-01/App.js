import React from 'react';
import Chart from './Chart';
import Stats from './Stats';
import { BASIC_PRICE, DELUXE_PRICE, getRevenue } from './utils';
import './App.css';

import basicRaw from './resources/basic.json';
import deluxeRaw from './resources/deluxe.json';
import totalRaw from './resources/total.json';

const WEEK = 'week';
const MONTH = 'month';
const YEAR = 'year';

function App() {
  const [unit, setUnit] = React.useState(WEEK);
  const [showChart, setShowChart] = React.useState(false);

  const basic = getRevenue(basicRaw, BASIC_PRICE)[unit];
  const deluxe = getRevenue(deluxeRaw, DELUXE_PRICE)[unit];
  const total = getRevenue(totalRaw)[unit];

  const data = { basic, deluxe, total };

  const getClass = type => (type === unit ? 'active' : '');

  return (
    <div className="App">
      <div className="App-container">
        <h1 className="App-head">Matilda&apos;s Cupcakes</h1>
        <div className="App-buttons">
          <button type="button" className={getClass(WEEK)} onClick={() => setUnit(WEEK)}>
            Weekly
          </button>
          <button type="button" className={getClass(MONTH)} onClick={() => setUnit(MONTH)}>
            Monthly
          </button>
          <button type="button" className={getClass(YEAR)} onClick={() => setUnit(YEAR)}>
            Yearly
          </button>
        </div>
        <button type="button" className="text" onClick={() => setShowChart(p => !p)}>
          {showChart ? 'See stats' : 'See chart'}
        </button>
        <div className="App-chart">
          {showChart ? <Chart data={data} unit={unit} /> : <Stats data={data} unit={unit} />}
        </div>
      </div>
    </div>
  );
}

export default App;
