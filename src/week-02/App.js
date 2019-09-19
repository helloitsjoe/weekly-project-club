import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Table from 'react-table';
import {
  makeWeeklyCal,
  TYPES,
  getOpenSlots,
  CLEANING,
  FILLING,
  ROOT_CANAL,
  validateBooking,
} from './utils';
import 'react-table/react-table.css';
import './App.css';

const typesShape = PropTypes.oneOf([0, 1, 2, 3]);
const slotShape = { text: PropTypes.string, type: typesShape, open: PropTypes.bool };

const getRandomSlotType = () => Math.floor(Math.random() * 4);
const sparsify = type => (Math.round(Math.random()) ? 0 : type);

const cal = makeWeeklyCal({ fillWith: { text: 'a', type: 1 } });

for (let key in cal) {
  cal[key] = cal[key].map(ea => {
    const type = sparsify(getRandomSlotType());
    return { text: TYPES[type] || '', type };
  });
}

const processCalendarData = (newData, oldData = []) => {
  return Object.entries(newData).reduce((acc, [day, slots]) => {
    return slots.map((slot, i) => ({
      ...acc[i],
      [day]: slot,
    }));
  }, oldData);
};

const Cell = ({ row, currentType }) => {
  // console.log(`props.row:`, row);
  const [status, setStatus] = useState('');

  const validate = ({ column, index }) => {
    // const { type } = value;
    const message = validateBooking({ currentType, day: column.id, cal, timeSlot: index });
    console.log(message || 'Your appointment is BOOKED!');
  };

  const typeClasses = ['', 'cleaning', 'filling', 'root-canal'];
  const open = row.value.open ? typeClasses[currentType] : '';

  return (
    // eslint-disable-next-line
    <div
      className={['Table-cell', status, open].join(' ')}
      onMouseLeave={() => setStatus('')}
      onMouseEnter={() => setStatus(row.value.text ? 'full' : 'empty')}
      onClick={() => validate(row)}
    >
      {row.value.text}
    </div>
  );
};

Cell.propTypes = {
  row: PropTypes.shape({
    value: PropTypes.shape(slotShape),
  }).isRequired,
  currentType: typesShape.isRequired,
};

function App() {
  const [data, setData] = useState(processCalendarData(cal));
  const [currentType, setCurrentType] = useState(0);
  // console.log(`data:`, data);

  const handleClick = type => {
    const openSlots = getOpenSlots({ type, cal });
    const calWithOpen = {};
    // TODO: Make this better
    for (let key in cal) {
      calWithOpen[key] = cal[key].map((ea, i) => {
        return { ...ea, open: openSlots[key][i] };
      });
    }
    setCurrentType(type);
    setData(processCalendarData(calWithOpen, cal));
  };

  const columns = Object.keys(data[0]).map(key => ({
    Header: key.toUpperCase(),
    accessor: key,
    Cell: row => <Cell currentType={currentType} row={row} />,
  }));

  return (
    <div className="Dentist">
      <div className="Dentist-container">
        <div>
          <button type="button" className="cleaning" onClick={() => handleClick(CLEANING)}>
            Cleaning Slots
          </button>
          <button type="button" className="filling" onClick={() => handleClick(FILLING)}>
            Filling Slots
          </button>
          <button type="button" className="root-canal" onClick={() => handleClick(ROOT_CANAL)}>
            Root canal Slots
          </button>
        </div>
        {/* <h1>Next Week: Martha&apos;s Dentapalooza</h1> */}
        <Table data={data} columns={columns} showPagination={false} rows pageSize={data.length} />
      </div>
    </div>
  );
}

export default App;
