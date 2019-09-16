import React from 'react';
import PropTypes from 'prop-types';
import { VictoryChart, VictoryLine, VictoryAxis } from 'victory';
import { titleCase, dataShape } from './utils';

function Chart({ data, unit }) {
  const { basic, deluxe, total } = data;
  const maxDomain = Math.max(...total) * 1.1;

  const makeChartProps = color => ({
    interpolation: 'natural',
    style: { data: { stroke: color } },
  });

  return (
    <VictoryChart
      domain={{ y: [0, maxDomain] }}
      padding={{ left: 60, right: 50, bottom: 50, top: 20 }}
    >
      <VictoryAxis invertAxis label={`${titleCase(unit)}s in the past`} />
      <VictoryAxis
        dependentAxis
        tickFormat={ea => (ea > 1000 ? `${ea / 1000}k` : ea)}
        style={{ axisLabel: { padding: 40 } }}
        label="Total Cupcakes"
      />
      <VictoryLine {...makeChartProps('lightblue')} data={basic} />
      <VictoryLine {...makeChartProps('cornflowerblue')} data={deluxe} />
      <VictoryLine {...makeChartProps('darkmagenta')} data={total} />
    </VictoryChart>
  );
}

Chart.propTypes = {
  data: PropTypes.shape(dataShape).isRequired,
  unit: PropTypes.string.isRequired,
};

export default Chart;
