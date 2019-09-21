import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Table from 'react-table';
import {
  TYPES,
  formatCalData,
  markOpenSlots,
  CLEANING,
  FILLING,
  ROOT_CANAL,
  validateBooking,
} from './utils';
import 'react-table/react-table.css';
import './App.css';
import { fetchCal, updateCal } from './services';

const typesShape = PropTypes.oneOf([0, 1, 2, 3]);
const slotShape = { text: PropTypes.string, type: typesShape, open: PropTypes.bool };

const RawCell = ({ cal, row, currentType, onMouseEnter, onSubmit, status }) => {
  const handleCellClick = ({ column, index }) => {
    const message = validateBooking({ currentType, day: column.id, cal, timeSlot: index });
    if (message) {
      // TODO: Pop snackbar with message
      return console.log(message || 'Your appointment is BOOKED!');
    }
    onSubmit({ day: column.id, timeSlot: index, type: currentType });
  };

  const open = row.value.open ? TYPES[currentType].toLowerCase().replace(' ', '-') : 'unavailable';

  return (
    // eslint-disable-next-line
    <div
      className={['Table-cell', status, open].join(' ')}
      onMouseEnter={() => onMouseEnter(row)}
      onClick={() => handleCellClick(row)}
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
  cal: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.shape(slotShape))).isRequired,
};

function App() {
  const [submitting, setSubmitting] = useState(false);
  const [calData, setCalData] = useState({});
  const [currentType, setCurrentType] = useState(0);
  const [currentColId, setCurrentColId] = useState(0);
  const [actives, setActives] = useState([]);

  useEffect(() => {
    fetchCal().then(initialCal => {
      setCalData(initialCal);
    });
  }, []);

  const selectType = (type, cal) => {
    const calWithOpen = markOpenSlots({ type, cal });
    setActives([]);
    setCurrentType(type);
    setCalData(calWithOpen);
  };

  const handleMouseEnter = row => {
    const activeSlots = [...Array(currentType)].map((_, i) => row.index + i);
    setActives(activeSlots);
    setCurrentColId(row.column.id);
  };

  const handleSubmit = ({ day, timeSlot, type }) => {
    setSubmitting(true);
    return updateCal({ day, timeSlot, type }).then(newCal => {
      setCalData(markOpenSlots({ type, cal: newCal }));
      setSubmitting(false);
    });
  };

  const getActive = row => {
    // TODO: If any in actives are full, all should be red
    if (actives.includes(row.index) && currentColId === row.column.id) {
      return row.value.text ? 'full' : 'empty';
    }
    return '';
  };
  console.log(`currentType:`, currentType);
  const columns = Object.keys(calData).map(key => ({
    Header: key.toUpperCase(),
    accessor: key,
    Cell: row => (
      <RawCell
        status={getActive(row)}
        onMouseEnter={handleMouseEnter}
        onSubmit={handleSubmit}
        currentType={currentType}
        row={row}
        cal={calData}
      />
    ),
  }));

  const formattedCal = Object.keys(calData).length ? formatCalData(calData) : [];

  return (
    <div className="Dentist">
      <div className="Dentist-container">
        <h1>Martha&apos;s Dentapalooza</h1>
        <h2>Schedule for Next Week</h2>
        <div>
          <button type="button" className="cleaning" onClick={() => selectType(CLEANING, calData)}>
            Cleaning Slots
          </button>
          <button type="button" className="filling" onClick={() => selectType(FILLING, calData)}>
            Filling Slots
          </button>
          <button
            type="button"
            className="root-canal"
            onClick={() => selectType(ROOT_CANAL, calData)}
          >
            Root canal Slots
          </button>
        </div>
        <Table
          data={formattedCal}
          columns={columns}
          showPagination={false}
          pageSize={formattedCal.length}
          rows
        />
      </div>
      {submitting && <Submitting />}
    </div>
  );
}

const Submitting = () => <div className="submitting">Submitting...</div>;

export default App;
