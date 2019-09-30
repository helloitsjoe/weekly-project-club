import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Clock } from '../App';

const mockExercises = [{ name: 'Ab Blasters', reps: 10, id: 1 }];

describe('Clock', () => {
  it('Displays `Start`, `Click to start`, and no timer before timer starts', () => {
    const { getByTestId } = render(<Clock remove={() => {}} exercises={mockExercises} />);
    const startOrNextButton = getByTestId('action-button');
    expect(startOrNextButton.textContent).toBe('Start');
    expect(getByTestId('current-exercise').textContent).toBe('');
    expect(getByTestId('time-left').textContent).toBe('');
  });

  it('Displays `Next`, exercise name, and timer during exercise', () => {
    const { getByTestId } = render(<Clock remove={() => {}} exercises={mockExercises} />);
    const startOrNextButton = getByTestId('action-button');
    fireEvent.click(startOrNextButton);
    expect(startOrNextButton.textContent).toBe('Next');
    expect(getByTestId('current-exercise').textContent).toBe('1. Ab Blasters');
    expect(getByTestId('time-left').textContent).toBe('0:20');
  });

  it('Displays `Next`, `Done!`, and no timer during exercise', () => {
    const { getByTestId } = render(<Clock remove={() => {}} exercises={mockExercises} />);
    const startOrNextButton = getByTestId('action-button');
    fireEvent.click(startOrNextButton);
    fireEvent.click(startOrNextButton);
    expect(startOrNextButton.textContent).toBe('Next');
    expect(getByTestId('current-exercise').textContent).toBe('Done!');
    expect(getByTestId('time-left').textContent).toBe('');
  });
});
