/* eslint-disable react/forbid-prop-types */
import React, { useState, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import './App.css';
import { createData } from './utils';

const columns = [
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Member since',
    accessor: 'memberSince',
    Cell: row => <span>{row.value.toLocaleDateString()}</span>,
  },
  {
    Header: 'Community Hours',
    accessor: 'communityHours',
    Cell: row => <span>{row.value}</span>,
  },
  {
    Header: 'Nominated',
    accessor: 'nominated',
    Cell: row => <span>{row.value ? 'Yes' : 'No'}</span>,
  },
  {
    Header: 'Group',
    accessor: 'group',
  },
];

function Table({ data }) {
  console.log(`data:`, data);
  return (
    <div className="Honor-table--main">
      <ReactTable data={data} columns={columns} showPagination={false} />
    </div>
  );
}

Table.propTypes = {
  data: PropTypes.array,
};

Table.defaultProps = {
  data: createData(),
};

function App() {
  return (
    <div className="Honor">
      <h1 className="Honor-head">Ann-Marie's Dishonor Society</h1>
      <h2 className="Honor-subhead">Celebrating 50 Years of Excellence in SuperVillainy</h2>
      <Table />
    </div>
  );
}

export default App;
