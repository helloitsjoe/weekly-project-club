import React, { Fragment } from 'react';
import './App.css';
import { VictoryChart, VictoryLine, VictoryAxis } from 'victory';
import { convert, getWeeklyRev, getRevenueInTime } from './utils';

import basicRaw from './resources/basic.json';
import deluxeRaw from './resources/deluxe.json';
import totalRaw from './resources/total.json';

const WEEK = 7;
const MONTH = 30;
const YEAR = 365;

const unitMap = {
  [WEEK]: 'Week',
  [MONTH]: 'Month',
  [YEAR]: 'Year',
};

const Chart = ({ data, days }) => {
  const { basic, deluxe, total } = data;
  const maxDomain = Math.max(...total) * 1.1;

  const makeChartProps = color => ({
    x: 'day',
    y: 'total',
    interpolation: 'natural',
    style: { data: { stroke: color } },
  });

  return (
    <VictoryChart
      domain={{ y: [0, maxDomain] }}
      padding={{ left: 60, right: 50, bottom: 50, top: 20 }}
    >
      <VictoryAxis invertAxis label={`${unitMap[days]}s in the past`} />
      <VictoryAxis
        dependentAxis
        tickFormat={ea => (ea > 1000 ? `${ea / 1000}k` : ea)}
        style={{ axisLabel: { padding: 40 } }}
        label="Total Cupcakes"
      />
      <VictoryLine {...makeChartProps('lightgreen')} data={basic} />
      <VictoryLine {...makeChartProps('lightseagreen')} data={deluxe} />
      <VictoryLine {...makeChartProps('darkmagenta')} data={total} />
    </VictoryChart>
  );
};

const StatsBlock = ({ num, cost, label }) => {
  return (
    <div className="App-stats--block">
      <p>{label}:</p>
      <div className="App-stats--container">
        {cost ? (
          <div>
            <h2>{num}</h2> <h4 className="App-stats--cost">$({num * cost})</h4>
          </div>
        ) : (
          <h2>${num}</h2>
        )}
      </div>
    </div>
  );
};

const Stats = ({ data, days }) => {
  const [seeAvg, setSeeAvg] = React.useState(true);
  const { basic, deluxe, total } = data;
  const getCurrent = arr => arr[arr.length - 1];
  const getLast = arr => arr[arr.length - 2];
  const getAvg = arr =>
    Math.round(
      arr.slice(0, arr.length - 1).reduce((sum, curr) => sum + curr, 0) / (arr.length - 1)
    );
  const unit = unitMap[days];

  const getComparison = seeAvg ? getAvg : getLast;

  return (
    <div>
      <div className="App-stats">
        <section>
          <h3>{seeAvg ? `${unit}ly Average` : `Last ${unit}`}</h3>
          <StatsBlock
            num={Math.round(getComparison(basic) / 5)}
            cost={5}
            label={'Basic cupcakes'}
          />
          <StatsBlock
            num={Math.round(getComparison(deluxe) / 6)}
            cost={6}
            label={'Deluxe cupcakes'}
          />
          <StatsBlock num={getComparison(total)} label={'Total revenue'} />
        </section>
        <section>
          <h3>This {unitMap[days]}</h3>
          <StatsBlock num={Math.round(getCurrent(basic)) / 5} cost={5} label={'Basic cupcakes'} />
          <StatsBlock num={Math.round(getCurrent(deluxe)) / 6} cost={6} label={'Deluxe cupcakes'} />
          <StatsBlock num={getCurrent(total)} label={'Total revenue'} />
        </section>
      </div>
      <button className="text" onClick={() => setSeeAvg(p => !p)}>
        Compare to{' '}
        {seeAvg
          ? `last ${unitMap[days].toLowerCase()}`
          : `${unitMap[days].toLowerCase()}ly average`}
      </button>
    </div>
  );
};

function App() {
  const [days, setDays] = React.useState(WEEK);
  const [showChart, setShowChart] = React.useState(false);

  const basic = getRevenueInTime(basicRaw, 5, days);
  const deluxe = getRevenueInTime(deluxeRaw, 6, days);
  const total = getRevenueInTime(totalRaw, 1, days);

  const data = { basic, deluxe, total };

  const getClass = type => (type === days ? 'active' : '');

  return (
    <div className="App">
      <div className="App-header">
        <h1>Matilda's Cupcakes</h1>
        <div className="App-buttons">
          <button className={getClass(WEEK)} onClick={() => setDays(WEEK)}>
            Weekly
          </button>
          <button className={getClass(MONTH)} onClick={() => setDays(MONTH)}>
            Monthly
          </button>
          <button className={getClass(YEAR)} onClick={() => setDays(YEAR)}>
            Yearly
          </button>
        </div>
        <button className="text" onClick={() => setShowChart(p => !p)}>
          {showChart ? 'See stats' : 'See chart'}
        </button>
        <div className="App-chart">
          {showChart ? <Chart data={data} days={days} /> : <Stats data={data} days={days} />}
        </div>
      </div>
    </div>
  );
}

export default App;
