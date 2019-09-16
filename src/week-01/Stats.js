import React from 'react';
import PropTypes from 'prop-types';
import { BASIC_PRICE, DELUXE_PRICE, titleCase, dataShape } from './utils';
import './App.css';

// Most recent revenue is at the beginning of the array.
const getCurrent = arr => arr[0];
const getLast = arr => arr[1];

// Current week/month/year will drag avg down, so exclude it.
const getAvg = arr =>
  Math.round(arr.slice(1).reduce((sum, curr) => sum + curr, 0) / (arr.length - 1));

function Stats({ data, unit }) {
  const [showAvg, setShowAvg] = React.useState(true);
  const { basic, deluxe, total } = data;

  const label = titleCase(unit);

  const comparisonFunc = showAvg ? getAvg : getLast;

  return (
    <>
      <div className="App-stats">
        <section>
          <h3>{showAvg ? `${label}ly Average` : `Last ${label}`}</h3>
          <StatsBlock num={comparisonFunc(basic)} price={BASIC_PRICE} label="Basic cupcakes" />
          <StatsBlock num={comparisonFunc(deluxe)} price={DELUXE_PRICE} label="Deluxe cupcakes" />
          <StatsBlock num={comparisonFunc(total)} label="Total revenue" />
        </section>
        <section>
          <h3>This {label}</h3>
          <StatsBlock num={getCurrent(basic)} price={BASIC_PRICE} label="Basic cupcakes" />
          <StatsBlock num={getCurrent(deluxe)} price={DELUXE_PRICE} label="Deluxe cupcakes" />
          <StatsBlock num={getCurrent(total)} label="Total revenue" />
        </section>
      </div>
      <button type="button" className="text" onClick={() => setShowAvg(p => !p)}>
        Compare to {showAvg ? `last ${unit}` : `${unit}ly average`}
      </button>
    </>
  );
}

Stats.propTypes = {
  data: PropTypes.shape(dataShape).isRequired,
  unit: PropTypes.string.isRequired,
};

function StatsBlock({ num, price, label }) {
  return (
    <div className="App-stats--block">
      <p>{label}:</p>
      <div className="App-stats--container">
        {price ? (
          <div>
            <h2>{Math.round(num / price)}</h2> <h4 className="App-stats--revenue">$({num})</h4>
          </div>
        ) : (
          <h2>${num}</h2>
        )}
      </div>
    </div>
  );
}

StatsBlock.propTypes = {
  num: PropTypes.number.isRequired,
  price: PropTypes.number,
  label: PropTypes.string.isRequired,
};

StatsBlock.defaultProps = {
  price: null,
};

export default Stats;
