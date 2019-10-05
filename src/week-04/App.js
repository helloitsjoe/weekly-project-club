/* eslint-disable react/forbid-prop-types */
import React, { useState, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import './App.css';
import { createData, getGroups, getIsEligible } from './utils';

const columns = [
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Member Since',
    accessor: 'memberSince',
    Cell: row => <span>{new Date(row.value).toLocaleDateString()}</span>,
  },
  {
    Header: 'Community Hours',
    accessor: 'communityHours',
    Cell: row => <span>{row.value}</span>,
  },
  {
    Header: 'Nominated',
    accessor: 'nominated',
    Cell: row => <span>{row.value && 'Yes'}</span>,
  },
  {
    id: 'group',
    Header: 'Group',
    accessor: d => d.group.toUpperCase(),
  },
];

export function Table({ data }) {
  return (
    <div data-testid="table" className="Honor-table--main">
      <ReactTable data={data} columns={columns} showPagination={false} />
    </div>
  );
}

Table.propTypes = {
  data: PropTypes.array.isRequired,
};

export function Voting({ data }) {
  const [currentGroup, setCurrentGroup] = useState();
  const [selected, setSelected] = useState([]);

  const handleSubmit = e => {
    e.preventDefault();
    console.log(selected);
  };

  const toggleSelected = e => {
    const { value, checked } = e.target;
    setSelected(prev => {
      return checked ? prev.concat(value) : prev.filter(mem => mem !== value);
    });
  };

  const groups = getGroups(data);
  const groupMembers = data.filter(member => member.group === currentGroup);

  return (
    <form onSubmit={handleSubmit}>
      <select value={currentGroup} onChange={e => setCurrentGroup(e.target.value)}>
        <option>Select your group</option>
        {Object.keys(groups).map(group => {
          return (
            <option key={group} name={group}>
              {group}
            </option>
          );
        })}
      </select>
      {groupMembers && (
        <div>
          <ul>
            {groupMembers.filter(getIsEligible).map(({ name }) => (
              <li key={name}>
                <input id={name} onChange={toggleSelected} value={name} type="checkbox" />
                <label htmlFor={name}>{name}</label>
              </li>
            ))}
          </ul>
          <button type="submit">Submit</button>
        </div>
      )}
    </form>
  );
}

Voting.propTypes = {
  data: PropTypes.array.isRequired,
};

function App() {
  const data = createData();

  return (
    <div className="Honor">
      <h1 className="Honor-head">Ann-Marie's Dishonor Society</h1>
      <h2 className="Honor-subhead">Celebrating 50 Years of Excellence in SuperVillainy</h2>
      <Voting data={data} />
      <Table data={data} />
    </div>
  );
}

export default App;
