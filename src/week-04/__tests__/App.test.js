import React from 'react';
import { within, render, fireEvent, waitForElement, wait } from '@testing-library/react';
import App, { Table, Voting } from '../App';
import data from './mock-data';
import { getGroups } from '../utils';

fdescribe('Table (it.each tests)', () => {
  it.each`
    column | text
    ${0}   | ${'Name'}
    ${1}   | ${'Member Since'}
    ${2}   | ${'Hours'}
    ${3}   | ${'Nominated'}
    ${4}   | ${'Group'}
  `('Header for column $column sez $text', ({ column, text }) => {
    const { getAllByRole } = render(<Table data={data} />);
    const headers = getAllByRole('columnheader');
    expect(headers[column].textContent).toBe(text);
  });

  it.each`
    row  | column | text
    ${1} | ${0}   | ${'Joe Boyle'}
    ${1} | ${1}   | ${'10/9/2010'}
    ${1} | ${2}   | ${'205'}
    ${1} | ${3}   | ${'Yes'}
    ${1} | ${4}   | ${'ALPHA'}
    ${2} | ${0}   | ${'Missy Boyle'}
    ${2} | ${1}   | ${'10/9/2009'}
    ${2} | ${2}   | ${'120'}
    ${2} | ${3}   | ${'No'}
    ${2} | ${4}   | ${'ALPHA'}
  `('Row $row column $column sez $text', ({ row, column, text }) => {
    const { getAllByRole } = render(<Table data={data} />);
    const rows = getAllByRole('row');
    expect(rows[row].children[column].textContent).toBe(text);
  });
});

xdescribe('Table (single tests)', () => {
  it('Headers have the right text', () => {
    const { getAllByRole } = render(<Table data={data} />);
    const headers = getAllByRole('columnheader');
    expect(headers[0].textContent).toBe('Name');
    expect(headers[1].textContent).toBe('Member Since');
    expect(headers[2].textContent).toBe('Hours');
    expect(headers[3].textContent).toBe('Nominated');
    expect(headers[4].textContent).toBe('Group');
  });

  it('Cells have the right text', () => {
    const { getAllByRole } = render(<Table data={data} />);
    const [, firstRow, secondRow] = getAllByRole('row');
    expect(firstRow.children[0].textContent).toBe('Joe Boyle');
    expect(firstRow.children[1].textContent).toBe('10/9/2010');
    expect(firstRow.children[2].textContent).toBe('205');
    expect(firstRow.children[3].textContent).toBe('Yes');
    expect(firstRow.children[4].textContent).toBe('ALPHA');
    expect(secondRow.children[0].textContent).toBe('Missy Boyle');
    expect(secondRow.children[1].textContent).toBe('10/9/2009');
    expect(secondRow.children[2].textContent).toBe('120');
    expect(secondRow.children[3].textContent).toBe('No');
    expect(secondRow.children[4].textContent).toBe('ALPHA');
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
