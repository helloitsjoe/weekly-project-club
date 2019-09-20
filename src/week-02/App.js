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

const weeklyCal = makeWeeklyCal({ fillWith: { text: 'a', type: 1 } });

const cal = Object.entries(weeklyCal).reduce((acc, [key, slots]) => {
  acc[key] = slots.map(() => {
    const type = sparsify(getRandomSlotType());
    return { text: TYPES[type] || '', type };
  });
  return acc;
}, {});

const processCalendarData = (newData, oldData = []) => {
  return Object.entries(newData).reduce((acc, [day, slots]) => {
    return slots.map((slot, i) => ({
      ...acc[i],
      [day]: slot,
    }));
  }, oldData);
};

const RawCell = ({ row, currentType, onMouseEnter, status }) => {
  const validate = ({ column, index }) => {
    const message = validateBooking({ currentType, day: column.id, cal, timeSlot: index });
    console.log(message || 'Your appointment is BOOKED!');
  };

  const open = row.value.open ? TYPES[currentType].toLowerCase().replace(' ', '-') : '';

  return (
    // eslint-disable-next-line
    <div
      className={['Table-cell', status, open].join(' ')}
      onMouseEnter={() => onMouseEnter(row)}
      onClick={() => validate(row)}
    >
      {row.value.text}
    </div>
  );
};

RawCell.propTypes = {
  row: PropTypes.shape({
    value: PropTypes.shape(slotShape),
  }).isRequired,
  status: PropTypes.string.isRequired,
  currentType: typesShape.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
};

function App() {
  const [data, setData] = useState(processCalendarData(cal));
  const [currentType, setCurrentType] = useState(0);
  const [currentColId, setCurrentColId] = useState(0);
  const [actives, setActives] = useState([]);

  const handleClick = type => {
    const openSlots = getOpenSlots({ type, cal });

    const calWithOpen = Object.entries(cal).reduce((acc, [key, slots]) => {
      acc[key] = slots.map((slot, i) => {
        return { ...slot, open: openSlots[key][i] };
      });
      return acc;
    }, {});

    setCurrentType(type);
    setData(processCalendarData(calWithOpen, cal));
  };

  const handleMouseEnter = row => {
    const activesByType = [];
    for (let i = 0; i < currentType; i++) {
      activesByType.push(row.index + i);
    }
    setActives(activesByType);
    setCurrentColId(row.column.id);
  };

  const getActive = row => {
    if (actives.includes(row.index) && currentColId === row.column.id) {
      return row.value.text ? 'full' : 'empty';
    }
    return '';
  };

  const columns = Object.keys(cal).map(key => ({
    Header: key.toUpperCase(),
    accessor: key,
    Cell: row => (
      <RawCell
        status={getActive(row)}
        onMouseEnter={handleMouseEnter}
        currentType={currentType}
        row={row}
      />
    ),
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
