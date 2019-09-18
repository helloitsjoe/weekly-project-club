import React, { useState } from 'react';
import Table from 'react-table';
import {
  createWeeklyCal,
  TYPES,
  getOpenSlots,
  CLEANING,
  FILLING,
  ROOT_CANAL,
  validateBooking,
} from './utils';
import 'react-table/react-table.css';
import './App.css';

const getRandomSlotType = () => {
  return Math.floor(Math.random() * 4);
  // return TYPES[random];
};

const cal = createWeeklyCal({ fillWith: { text: 'a', type: 1 } });
// for (let key in cal) {
//   cal[key] = cal[key].map(ea => {
//     const type = getRandomSlotType();
//     return { text: TYPES[type], type };
//   });
// }

const data = Object.entries(cal).reduce((acc, [day, slots]) => {
  return slots.map((slot, i) => ({
    ...acc[i],
    [day]: slot,
  }));
}, []);

const columns = Object.keys(data[0]).map(key => ({
  Header: key.toUpperCase(),
  accessor: key,
  Cell: row => <Cell row={row} />,
}));

const Cell = ({ row }) => {
  // console.log(`props.row:`, row);
  const [status, setStatus] = useState('');

  const validate = ({ value, column, index }) => {
    const { type } = value;
    const message = validateBooking({ type, day: column.id, cal, timeSlot: index });
    console.log(message);
  };

  return (
    <div
      className={['Table-cell', status].join(' ')}
      onMouseLeave={() => setStatus('')}
      onMouseEnter={() => setStatus(row.value.text ? 'full' : 'empty')}
      onClick={() => validate(row)}
    >
      {row.value.text}
    </div>
  );
};

function App() {
  const [slots, setSlots] = useState();

  const handleClick = type => {
    setSlots(getOpenSlots({ type, cal }));
    console.log(slots);
  };

  return (
    <div className="Dentist">
      <div className="Dentist-container">
        <div>
          <button type="button" onClick={() => handleClick(CLEANING)}>
            Cleaning Slots
          </button>
          <button type="button" onClick={() => handleClick(FILLING)}>
            Filling Slots
          </button>
          <button type="button" onClick={() => handleClick(ROOT_CANAL)}>
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
