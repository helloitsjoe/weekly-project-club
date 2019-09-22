import React, { useReducer, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Table from 'react-table';
import {
  range,
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

const RawCell = ({ cal, row, currentType, onMouseEnter, onSubmit, onError, status }) => {
  const handleCellClick = ({ column, index }) => {
    const message = validateBooking({ currentType, day: column.id, cal, timeSlot: index });
    if (message) {
      console.log(message || 'Your appointment is BOOKED!');
      onError(message);
      return;
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
  currentType: typesShape.isRequired,
  status: PropTypes.string.isRequired,
  onError: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  row: PropTypes.shape({ value: PropTypes.shape(slotShape) }).isRequired,
  cal: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.shape(slotShape))).isRequired,
};

function App() {
  const [state, dispatch] = useReducer(
    (s, action) => {
      const { payload } = action;
      switch (action.type) {
        case 'FETCH':
          return { ...s, calData: payload };
        case 'TYPE_SELECTED': {
          return {
            ...s,
            actives: [],
            errorMessage: '',
            currentType: payload,
            calData: markOpenSlots({ type: payload, cal: s.calData }),
          };
        }
        case 'HOVER': {
          const activeSlots = range(s.currentType).map(ea => payload.rowIndex + ea);
          return { ...s, actives: activeSlots, currentColId: payload.columnId };
        }
        case 'ERROR':
          return { ...s, errorMessage: payload };
        case 'SUBMIT':
          return { ...s, submitting: true, errorMessage: '' };
        case 'SUBMIT_SUCCESS':
          return {
            ...s,
            submitting: false,
            calData: markOpenSlots({ type: s.currentType, cal: payload.newCal }),
          };
        default:
          return s;
      }
    },
    {
      actives: [],
      calData: {},
      currentType: 0,
      currentColId: 0,
      errorMessage: '',
      submitting: false,
    }
  );

  useEffect(() => {
    fetchCal().then(initialCal => {
      dispatch({ type: 'FETCH', payload: initialCal });
    });
  }, []);

  const { submitting, calData, currentType, currentColId, actives, errorMessage } = state;

  const selectType = type => {
    dispatch({ type: 'TYPE_SELECTED', payload: type });
  };

  const handleMouseEnter = row => {
    dispatch({ type: 'HOVER', payload: { columnId: row.column.id, rowIndex: row.index } });
  };

  const handleSubmit = ({ day, timeSlot, type }) => {
    dispatch({ type: 'SUBMIT' });
    return updateCal({ day, timeSlot, type }).then(newCal => {
      dispatch({ type: 'SUBMIT_SUCCESS', payload: { type, newCal } });
    });
  };

  const handleError = message => {
    dispatch({ type: 'ERROR', payload: message });
  };

  const getActive = row => {
    if (actives.includes(row.index) && currentColId === row.column.id) {
      const activesAreEmpty = actives.every(active => {
        const activeSlot = calData[currentColId][active];
        return activeSlot && !activeSlot.text;
      });
      return activesAreEmpty ? 'empty' : 'full';
    }
    return '';
  };

  const columns = [{ accessor: 'mon.time' }].concat(
    Object.keys(calData).map(key => ({
      Header: key.toUpperCase(),
      accessor: key,
      Cell: row => (
        <RawCell
          status={getActive(row)}
          onError={handleError}
          onSubmit={handleSubmit}
          currentType={currentType}
          onMouseEnter={handleMouseEnter}
          row={row}
          cal={calData}
        />
      ),
    }))
  );

  const formattedCal = useMemo(() => (Object.keys(calData).length ? formatCalData(calData) : []), [
    calData,
  ]);

  return (
    <div className="Dentist">
      <h1 className="Dentist-head">Martha&apos;s Dentapalooza</h1>
      <h2 className="Dentist-subhead">Schedule for Next Week</h2>
      <div className="Dentist-container">
        <div className="Dentist-buttons">
          <span>Appointment Types:</span>
          <button
            type="button"
            className="Dentist-btn cleaning"
            onClick={() => selectType(CLEANING)}
          >
            Cleaning Slots
          </button>
          <button type="button" className="Dentist-btn filling" onClick={() => selectType(FILLING)}>
            Filling Slots
          </button>
          <button
            type="button"
            className="Dentist-btn root-canal"
            onClick={() => selectType(ROOT_CANAL)}
          >
            Root canal Slots
          </button>
        </div>
        <div className="Dentist-table">
          {errorMessage && <Error message={errorMessage} />}
          <Table
            data={formattedCal}
            columns={columns}
            showPagination={false}
            pageSize={formattedCal.length}
          />
        </div>
      </div>
      {submitting && <Submitting />}
    </div>
  );
}

const Submitting = () => <div className="submitting">Submitting...</div>;

const Error = ({ message }) => <div className="error">{message}</div>;

export default App;
