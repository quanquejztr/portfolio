import { fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import AboutMe from './aboutMe';

jest.mock('../components/AircraftViewer', () => function AircraftStub({ aircraft }) { return <div>{aircraft.name} model</div>; });
jest.mock('../components/FutureCompany', () => function CompanyStub() { return <span>[future company]</span>; });

test('the Apple team link opens all five photos and returns focus when closed', () => {
  render(<AboutMe />);
  const trigger = screen.getByRole('button', { name: 'Streaming Media Ecosystem Tech' });
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  fireEvent.click(trigger);
  const gallery = screen.getByRole('complementary', { name: 'Apple team photo gallery' });
  expect(trigger).toHaveAttribute('aria-expanded', 'true');
  expect(within(gallery).getByAltText('A group photo with fellow Apple interns and colleagues outdoors')).toHaveAttribute('src', '/photos/apple-team/01.jpg');
  expect(within(gallery).getAllByRole('button', { name: /^Show team photo/ })).toHaveLength(5);
  fireEvent.click(within(gallery).getByRole('button', { name: 'Next team photo' }));
  expect(within(gallery).getByAltText('A group of friends on a coastal hike overlooking the ocean')).toHaveAttribute('src', '/photos/apple-team/02.jpg');
  fireEvent.click(within(gallery).getByRole('button', { name: /Show team photo 5/ }));
  expect(within(gallery).getByAltText('The team sharing a meal together at a restaurant')).toBeVisible();
  fireEvent.click(within(gallery).getByRole('button', { name: 'Close team photo preview' }));
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(trigger).toHaveFocus();
});

test('aircraft and team photos share one preview panel and Escape closes it', () => {
  render(<AboutMe />);
  fireEvent.click(screen.getByRole('button', { name: 'Streaming Media Ecosystem Tech' }));
  const aircraftTrigger = screen.getByRole('button', { name: '787-9' });
  fireEvent.click(aircraftTrigger);
  expect(screen.getByRole('complementary', { name: 'Favorite aircraft gallery' })).toBeInTheDocument();
  expect(screen.queryByRole('complementary', { name: 'Apple team photo gallery' })).not.toBeInTheDocument();
  expect(aircraftTrigger).toHaveAttribute('aria-expanded', 'true');
  fireEvent.keyDown(aircraftTrigger, { key: 'Escape' });
  expect(aircraftTrigger).toHaveAttribute('aria-expanded', 'false');
  expect(aircraftTrigger).toHaveFocus();
});
