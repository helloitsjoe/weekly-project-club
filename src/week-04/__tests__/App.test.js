import React from 'react';
import { render, fireEvent, waitForElement, wait } from '@testing-library/react';
import App, { Table, Voting } from '../App';
import data from './mock-data';
import { getGroups } from '../utils';

describe('Table', () => {
  it.each`
    row            | column | text
    ${'tableHead'} | ${0}   | ${'Name'}
    ${'tableHead'} | ${1}   | ${'Member Since'}
    ${'tableHead'} | ${2}   | ${'Hours'}
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
    ${'secondRow'} | ${3}   | ${'No'}
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
  it('only displays voting when button is clicked', () => {
    const { getByText, container } = render(<App data={data} />);
    expect(container.textContent).not.toMatch(/select your group/i);
    fireEvent.click(getByText(/vote now/i));
    expect(container.textContent).toMatch(/select your group/i);
  });

  it('displays only eligible members when an option is selected', () => {
    const { getByText, queryByLabelText } = render(<Voting data={data} />);
    expect(queryByLabelText(/Joe/)).not.toBeTruthy();
    expect(queryByLabelText(/Missy/)).not.toBeTruthy();
    fireEvent.change(getByText('Select your group').parentElement, { target: { value: 'alpha' } });
    expect(queryByLabelText(/Joe/)).toBeTruthy();
    expect(queryByLabelText(/Missy/)).not.toBeTruthy();
  });

  it('onSubmit and onRequestClose are called when submit is fired', () => {
    const onSubmit = jest.fn();
    const { getByText } = render(<Voting data={data} onSubmit={onSubmit} />);
    expect(onSubmit).not.toBeCalled();
    fireEvent.submit(getByText(/submit/i));
    expect(onSubmit).toBeCalledWith([]);
  });

  it('onRequestClose is called when veil is clicked', () => {
    const onRequestClose = jest.fn();
    const { getByTestId } = render(<Voting data={data} onRequestClose={onRequestClose} />);
    expect(onRequestClose).not.toBeCalled();
    fireEvent.click(getByTestId(/veil/i));
    expect(onRequestClose).toBeCalled();
  });
});

describe('App', () => {
  it('changes member to exceptional if they are voted in', () => {
    const { getByText, getByLabelText, getByPlaceholderText } = render(<App initialData={data} />);
    expect(getByText(/joe/i).classList).not.toContain('exceptional');
    fireEvent.click(getByText(/vote/i));
    fireEvent.change(getByText('Select your group').parentElement, { target: { value: 'alpha' } });
    fireEvent.change(getByLabelText(/joe/i), { target: { value: 1 } });
    fireEvent.change(getByPlaceholderText(/number of voters/i), { target: { value: 1 } });
    fireEvent.submit(getByText(/submit/i));
    expect(getByText(/joe/i).classList).toContain('exceptional');
  });
});
