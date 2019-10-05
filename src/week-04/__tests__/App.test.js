import React from 'react';
import { render, fireEvent, waitForElement } from '@testing-library/react';
import { Table, Voting } from '../App';
import data from './mock-data';
import { getGroups } from '../utils';

describe('Table', () => {
  it.each`
    row            | column | text
    ${'tableHead'} | ${0}   | ${'Name'}
    ${'tableHead'} | ${1}   | ${'Member Since'}
    ${'tableHead'} | ${2}   | ${'Community Hours'}
    ${'tableHead'} | ${3}   | ${'Nominated'}
    ${'tableHead'} | ${4}   | ${'Group'}
    ${'firstRow'}  | ${0}   | ${'Joe Boyle'}
    ${'firstRow'}  | ${1}   | ${'10/9/2010'}
    ${'firstRow'}  | ${2}   | ${'205'}
    ${'firstRow'}  | ${3}   | ${'Yes'}
    ${'firstRow'}  | ${4}   | ${'ALPHA'}
    ${'secondRow'} | ${0}   | ${'Missy Boyle'}
    ${'secondRow'} | ${1}   | ${'10/9/2009'}
    ${'secondRow'} | ${2}   | ${'120'}
    ${'secondRow'} | ${3}   | ${''}
    ${'secondRow'} | ${4}   | ${'ALPHA'}
  `('Row $row column $column sez $text', ({ row, column, text }) => {
    const { getByTestId } = render(<Table data={data} />);
    const table = getByTestId('table').firstChild.firstChild;
    const map = {
      tableHead: table.firstChild.firstChild,
      firstRow: table.children[1].firstChild.firstChild,
      secondRow: table.children[1].children[1].firstChild,
    };
    expect(map[row].children[column].textContent).toBe(text);
  });
});

describe('Voting', () => {
  it('displays only eligible members when an option is selected', () => {
    const { getByText, queryByLabelText } = render(<Voting data={data} />);
    expect(queryByLabelText(/Joe/)).not.toBeTruthy();
    expect(queryByLabelText(/Missy/)).not.toBeTruthy();
    fireEvent.change(getByText('Select your group').parentElement, { target: { value: 'alpha' } });
    expect(queryByLabelText(/Joe/)).toBeTruthy();
    expect(queryByLabelText(/Missy/)).not.toBeTruthy();
  });
});
