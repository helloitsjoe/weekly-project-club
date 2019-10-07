/* eslint-disable react/forbid-prop-types */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import './App.css';
import { createData, getGroups, getIsEligible, getEligibleYears, getEligibleHours } from './utils';

const columns = [
  {
    Header: 'Name',
    accessor: 'name',
    width: 280,
    Cell: row => (
      <div className={row.original.exceptional ? 'exceptional' : 'ineligible'}>{row.value}</div>
    ),
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

export function Voting({ data, onSubmit, onRequestClose }) {
  const [currentGroup, setCurrentGroup] = useState();
  const [votes, setVotes] = useState({});
  const [numVoters, setNumVoters] = useState(0);

  const handleSelect = e => setCurrentGroup(e.target.value);

  const handleSubmit = e => {
    e.preventDefault();
    const newMembers = Object.entries(votes).reduce((acc, [member, memberVotes]) => {
      if (memberVotes >= numVoters / 2) {
        acc.push(member);
      }
      return acc;
    }, []);

    onSubmit(newMembers);
  };

  const handleTotalChange = e => {
    setNumVoters(Number(e.target.value));
  };

  const handleVote = e => {
    const { name, value } = e.target;
    setVotes(p => ({ ...p, [name]: value }));
  };

  const groupMembers = data.filter(member => member.group === currentGroup);

  return (
    <>
      <div className="Honor-modal">
        <form onSubmit={handleSubmit}>
          <select value={currentGroup} onChange={handleSelect}>
            <option>Select your group</option>
            {Object.keys(getGroups(data)).map(group => {
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
                  <li key={name} className="member-list">
                    <label htmlFor={name}>{name}</label>
                    <input
                      id={name}
                      name={name}
                      onChange={handleVote}
                      placeholder="Votes"
                      className="member-votes"
                      type="number"
                    />
                  </li>
                ))}
              </ul>
              <input type="number" placeholder="Number of voters" onChange={handleTotalChange} />
              <button className="submit" type="submit">
                Submit
              </button>
            </div>
          )}
        </form>
      </div>
      {/* eslint-disable-next-line */}
      <div data-testid="veil" className="Honor-veil" onClick={onRequestClose} />
    </>
  );
}

Voting.propTypes = {
  data: PropTypes.array.isRequired,
  onSubmit: PropTypes.func,
  onRequestClose: PropTypes.func,
};

Voting.defaultProps = {
  onSubmit() {},
  onRequestClose() {},
};

export function Table({ data }) {
  return (
    <div data-testid="table" className="Honor-container">
      <ReactTable data={data} columns={columns} showPagination={false} />
    </div>
  );
}

Table.propTypes = { data: PropTypes.array.isRequired };

function App({ initialData }) {
  const [data, setData] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const closeModal = e => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', closeModal);
    return () => {
      window.removeEventListener('keydown', closeModal);
    };
  }, []);

  const toggleModalOpen = () => setIsModalOpen(o => !o);

  const handleSubmit = newMembers => {
    setData(d => {
      return d.map(member => {
        if (newMembers.includes(member.name)) return { ...member, exceptional: true };
        return member;
      });
    });
    toggleModalOpen();
  };

  return (
    <div className="Honor">
      <h1 className="Honor-head">Ann-Marie&apos;s Dishonor Society</h1>
      <h2 className="Honor-subhead">Celebrating 50 Years of Excellence in Supervillainy</h2>
      <button className="Honor-button--vote" type="button" onClick={toggleModalOpen}>
        Vote now
      </button>
      {isModalOpen && (
        <Voting
          data={data}
          isOpen={isModalOpen}
          onSubmit={handleSubmit}
          onRequestClose={toggleModalOpen}
        />
      )}
      <Table data={data} />
    </div>
  );
}

App.propTypes = {
  initialData: PropTypes.array,
};

App.defaultProps = {
  initialData: createData(),
};

export default App;
