import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DisplayNameProvider } from './DisplayName';
import NameWordmark from './NameWordmark';
import AboutMe from '../pages/aboutMe';
import ContactMe from '../pages/contactMe';

jest.mock('./FutureCompany', () => () => <span>[future company]</span>);
jest.mock('./AircraftViewer', () => () => null);

afterEach(() => jest.useRealTimers());

test('switching names updates the wordmark, biography, contact labels and page title', () => {
  render(<DisplayNameProvider><NameWordmark /><AboutMe /><ContactMe /></DisplayNameProvider>);
  expect(document.title).toBe('Stephen Luong');
  expect(screen.getByText(/Hi there, I am Stephen and almost/)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'send to Stephen' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Switch name to Cuong' }));
  expect(document.title).toBe('Cuong Luong');
  expect(screen.getByText(/Hi there, I am Cuong and almost/)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'send to Cuong' })).toBeInTheDocument();
  expect(screen.getByRole('form', { name: 'Send Cuong a message' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Switch name to Stephen' }));
  expect(document.title).toBe('Stephen Luong');
  expect(screen.getByText(/Hi there, I am Stephen and almost/)).toBeInTheDocument();
});

test('the small switch hint disappears after ten seconds and does not restart on a switch', () => {
  jest.useFakeTimers();
  render(<DisplayNameProvider><NameWordmark /></DisplayNameProvider>);
  act(() => jest.advanceTimersByTime(9999));
  expect(screen.getByText('Click to switch name')).toBeInTheDocument();
  act(() => jest.advanceTimersByTime(1));
  expect(screen.queryByText('Click to switch name')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Switch name to Cuong' }));
  expect(screen.queryByText('Click to switch name')).not.toBeInTheDocument();
});
