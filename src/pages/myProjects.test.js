import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyProjects from './myProjects';

test('Projects features only Airside Machine with a summary and its repository', () => {
  render(<MyProjects />);
  expect(screen.getByRole('heading', { name: 'Airside Machine' })).toBeVisible();
  expect(screen.getByText(/A real-time airline management simulation/)).toHaveTextContent('Python, JavaScript, and SQLite');
  expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/quanquejztr/airside_machine');
  expect(screen.queryByText('NextLeg')).not.toBeInTheDocument();
  expect(screen.queryByText('JobTracker')).not.toBeInTheDocument();
  expect(screen.queryByText('DevShield')).not.toBeInTheDocument();
  expect(screen.queryByText('Diminished JavaCompiler')).not.toBeInTheDocument();
});
