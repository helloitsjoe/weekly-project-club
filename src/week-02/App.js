import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Table from 'react-table';
import { TYPES, getOpenSlots, CLEANING, FILLING, ROOT_CANAL, validateBooking } from './utils';
import 'react-table/react-table.css';
import './App.css';
import { fetchCal } from './services';

const typesShape = PropTypes.oneOf([0, 1, 2, 3]);
const slotShape = { text: PropTypes.string, type: typesShape, open: PropTypes.bool };

const formatCalData = (newData, oldData = []) => {
  return Object.entries(newData).reduce((acc, [day, slots]) => {
    return slots.map((slot, i) => ({
      ...acc[i],
      [day]: slot,
    }));
  }, oldData);
};

const RawCell = ({ cal, row, currentType, onMouseEnter, status }) => {
  // TODO: remove this
  if (!row.value) return 'loading';

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
  // TODO: do I need both of these?
  const [calData, setCalData] = useState();
  const [formattedCal, setFormattedCal] = useState();
  const [currentType, setCurrentType] = useState(0);
  const [currentColId, setCurrentColId] = useState(0);
  const [actives, setActives] = useState([]);

  useEffect(() => {
    fetchCal().then(initialCal => {
      console.log(`initialCal:`, initialCal);
      setCalData(initialCal);
      setFormattedCal(formatCalData(initialCal));
    });
  }, []);

  const handleClick = (type, cal) => {
    const openSlots = getOpenSlots({ type, cal });

    const calWithOpen = Object.entries(cal).reduce((acc, [key, slots]) => {
      acc[key] = slots.map((slot, i) => {
        return { ...slot, open: openSlots[key][i] };
      });
      return acc;
    }, {});

    setCurrentType(type);
    // TODO: Just add open slots to caldata instead of merging?
    setFormattedCal(formatCalData(calWithOpen, cal));
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

  if (!calData || !formattedCal) return 'Loading...';

  const columns = Object.keys(calData).map(key => ({
    Header: key.toUpperCase(),
    accessor: key,
    Cell: row => (
      <RawCell
        status={getActive(row)}
        onMouseEnter={handleMouseEnter}
        currentType={currentType}
        row={row}
        // ?
        cal={calData}
      />
    ),
  }));

  return (
    <div className="Dentist">
      <div className="Dentist-container">
        <div>
          <button type="button" className="cleaning" onClick={() => handleClick(CLEANING, calData)}>
            Cleaning Slots
          </button>
          <button type="button" className="filling" onClick={() => handleClick(FILLING, calData)}>
            Filling Slots
          </button>
          <button
            type="button"
            className="root-canal"
            onClick={() => handleClick(ROOT_CANAL, calData)}
          >
            Root canal Slots
          </button>
        </div>
        {/* <h1>Next Week: Martha&apos;s Dentapalooza</h1> */}
        <Table
          data={formattedCal}
          columns={columns}
          showPagination={false}
          rows
          pageSize={formattedCal.length}
        />
      </div>
    </div>
  );
}

export default App;
