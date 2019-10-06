/* eslint-disable react/forbid-prop-types */
import React, { useState, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import './App.css';
import { createData, getGroups, getIsEligible, getEligibleYears, getEligibleHours } from './utils';

const columns = [
  {
    Header: 'Name',
    accessor: 'name',
    width: 250,
  },
  {
    Header: 'Member Since',
    accessor: 'memberSince',
    width: 150,
    Cell: row => (
      <div className={getEligibleYears(row.value) ? 'eligible' : 'ineligible'}>
        {new Date(row.value).toLocaleDateString()}
      </div>
    ),
  },
  {
    Header: 'Hours',
    accessor: 'communityHours',
    Cell: row => (
      <div className={getEligibleHours(row.value) ? 'eligible' : 'ineligible'}>{row.value}</div>
    ),
  },
  {
    Header: 'Nominated',
    accessor: 'nominated',
    Cell: row => (
      <div className={row.value ? 'eligible' : 'ineligible'}>{row.value ? 'Yes' : 'No'}</div>
    ),
  },
  {
    id: 'group',
    Header: 'Group',
    accessor: d => d.group.toUpperCase(),
  },
];

export function Table({ data }) {
  return (
    <div data-testid="table" className="Honor-container">
      <ReactTable data={data} columns={columns} showPagination={false} />
    </div>
  );
}

Table.propTypes = {
  data: PropTypes.array.isRequired,
};

export function Voting({ data, initialIsOpen, onSubmit }) {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [currentGroup, setCurrentGroup] = useState();
  const [selected, setSelected] = useState([]);
  const [votes, setVotes] = useState({});
  const [numVoters, setNumVoters] = useState(0);

  useEffect(() => {
    const closeModal = e => {
      if (e.key === 'Esc') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', closeModal);
    return () => {
      window.removeEventListener('keydown', closeModal);
    };
  }, []);

  const toggleOpen = () => setIsOpen(o => !o);

  const handleSubmit = e => {
    e.preventDefault();
    const newMembers = Object.entries(votes).reduce((acc, [member, memberVotes]) => {
      if (memberVotes >= numVoters / 2) {
        acc.push(member);
      }
      return acc;
    }, []);
    console.log(`newMembers:`, newMembers);
    onSubmit(newMembers);
  };

  const handleTotalChange = e => {
    setNumVoters(Number(e.target.value));
  };

  const handleVote = e => {
    const { name, value } = e.target;
    setVotes(p => ({ ...p, [name]: value }));
  };

  const groups = getGroups(data);
  const groupMembers = data.filter(member => member.group === currentGroup);

  return (
    <>
      <button className="Honor-button--vote" type="button" onClick={toggleOpen}>
        Vote now
      </button>
      {isOpen && (
        // eslint-disable-next-line
        <>
          <div className="Honor-modal">
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
              <input placeholder="Number of voters" type="number" onChange={handleTotalChange} />
              {groupMembers && (
                <div>
                  <ul>
                    {groupMembers.filter(getIsEligible).map(({ name }) => (
                      <li key={name}>
                        <input id={name} onChange={handleVote} name={name} type="number" />
                        <label htmlFor={name}>{name}</label>
                      </li>
                    ))}
                  </ul>
                  <button type="submit">Submit</button>
                </div>
              )}
            </form>
          </div>
          <div className="Honor-veil" onClick={toggleOpen} />
        </>
      )}
    </>
  );
}

Voting.propTypes = {
  data: PropTypes.array.isRequired,
};

function App() {
  const [data, setData] = useState(createData());

  const handleVote = newMembers => {
    console.log(`members:`, newMembers);
  };

  return (
    <div className="Honor">
      <h1 className="Honor-head">Ann-Marie's Dishonor Society</h1>
      <h2 className="Honor-subhead">Celebrating 50 Years of Excellence in Supervillainy</h2>
      <Voting data={data} onSubmit={handleVote} />
      <Table data={data} />
    </div>
  );
}

export default App;
