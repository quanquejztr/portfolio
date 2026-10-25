import { act, fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import BoardingPasses from './BoardingPasses';
import flights from './flightPasses.json';
import mapData from './flightMapData.json';

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
});

test('choosing a Turkish pass highlights its actual route on the map', () => {
  render(<BoardingPasses />);
  const list = screen.getByRole('region', { name: 'Boarding passes, scroll vertically' });
  expect(within(within(list).getByRole('list', { name: 'Stack of boarding passes' })).getAllByRole('article')).toHaveLength(flights.length);
  const pass = within(list).getByRole('button', { name: /Show TK78, MIA to IST/ });
  fireEvent.click(pass);
  expect(pass).toHaveAttribute('aria-pressed', 'true');
  expect(pass).toHaveAttribute('aria-expanded', 'true');
  expect(within(list).getByRole('button', { name: /Show TK162, IST to SGN/ })).toHaveAttribute('aria-expanded', 'false');
  expect(within(list).queryByRole('button', { name: 'Enlarge TK162 boarding pass' })).not.toBeInTheDocument();
  expect(within(list).getByRole('button', { name: 'Enlarge TK78 boarding pass' })).toBeVisible();
  expect(screen.getByRole('img', { name: 'World map highlighting MIA to IST' })).toBeInTheDocument();
  expect(screen.getByTestId('selected-flight-route')).toHaveAttribute('data-origin', 'MIA');
  expect(screen.getByTestId('selected-flight-route')).toHaveAttribute('data-destination', 'IST');
  const rightColumn = screen.getByRole('heading', { name: 'Future trips' }).closest('.flight-right-column');
  expect(rightColumn.children).toHaveLength(2);
  expect(rightColumn.firstElementChild).toHaveClass('flight-map-panel');
  expect(rightColumn.lastElementChild).toHaveAccessibleName('Future trips');
  const futureTrips = rightColumn.lastElementChild;
  expect(within(futureTrips).getAllByRole('listitem')).toHaveLength(5);
  expect(within(futureTrips).getByText('Washington DC')).toBeVisible();
  expect(within(futureTrips).getByText('New York')).toBeVisible();
  expect(within(futureTrips).getByText('San Francisco')).toBeVisible();
  expect(within(futureTrips).getByText('Chicago')).toBeVisible();
  expect(within(futureTrips).getByText('Los Angeles')).toBeVisible();
  expect(within(futureTrips).getAllByText('ticket purchasing...')).toHaveLength(5);
  const mapPanel = rightColumn.firstElementChild;
  expect(mapPanel.querySelector('.flight-map-selection')).toBeNull();
  const details = mapPanel.querySelector('.flight-map-summary');
  expect(details).toHaveTextContent('MIA → IST');
  expect(details).toHaveTextContent('TK78');
  expect(details).toHaveTextContent(/Distance[\d,]+ km/);
  expect(within(mapPanel).queryByText('Selected flight')).not.toBeInTheDocument();
  expect(within(mapPanel).queryByText('Turkish Airlines')).not.toBeInTheDocument();
});

test('a pass opens with zoom controls and restores focus and page scrolling on close', () => {
  render(<BoardingPasses />);
  fireEvent.click(screen.getByRole('button', { name: /Show TK163, SGN to IST/ }));
  const trigger = screen.getByRole('button', { name: 'Enlarge TK163 boarding pass' });
  trigger.focus();
  fireEvent.click(trigger);
  const dialog = screen.getByRole('dialog', { name: 'Turkish Airlines · TK163' });
  expect(dialog).toBeVisible();
  expect(document.body.style.overflow).toBe('hidden');
  expect(within(dialog).getByRole('button', { name: 'Zoom out' })).toBeDisabled();
  fireEvent.click(within(dialog).getByRole('button', { name: 'Zoom in' }));
  expect(within(dialog).getByRole('button', { name: 'Reset zoom' })).toHaveTextContent('150%');
  fireEvent.click(within(dialog).getByRole('button', { name: 'Reset zoom' }));
  expect(within(dialog).getByRole('button', { name: 'Reset zoom' })).toHaveTextContent('100%');
  fireEvent.click(within(dialog).getByRole('button', { name: 'Close enlarged boarding pass' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(document.body.style.overflow).not.toBe('hidden');
  expect(trigger).toHaveFocus();
});

test('the renamed section shows all passes without the search bar or map subtitle', () => {
  render(<BoardingPasses />);
  expect(screen.getByRole('heading', { name: 'PLACES I HAVE BEEN' })).toBeInTheDocument();
  expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
  expect(screen.queryByText('A few places along the way')).not.toBeInTheDocument();
  expect(within(screen.getByRole('list', { name: 'Stack of boarding passes' })).getAllByRole('article')).toHaveLength(flights.length);
});

test('originals are linked to every flight and every route has airport coordinates', () => {
  expect(flights.filter(f => f.source === 'wallet')).toHaveLength(52);
  expect(flights.filter(f => f.airlineCode === 'TK')).toHaveLength(3);
  const allowed = new Set(['paperImage', 'originalWallet', 'id', 'airline', 'airlineCode', 'logo', 'color', 'textColor', 'origin', 'destination', 'flight', 'date', 'sortDate', 'boarding', 'departure', 'arrival', 'seat', 'gate', 'group', 'source']);
  for (const flight of flights) {
    expect(Object.keys(flight).every(key => allowed.has(key))).toBe(true);
    expect(Boolean(flight.paperImage || flight.originalWallet)).toBe(true);
    expect(mapData.airports[flight.origin]).toBeDefined();
    expect(mapData.airports[flight.destination]).toBeDefined();
    if (flight.logo) expect(flight.logo).toMatch(/^\/photos\/flight-airlines\/[a-z0-9]+\.webp$/);
  }
  expect(flights.find(f => f.flight === 'TK78').date).toBe('13 Dec');
  expect(flights.filter(f => f.paperImage)).toHaveLength(39);
  expect(flights.filter(f => f.originalWallet)).toHaveLength(26);
  expect(JSON.stringify(flights)).not.toMatch(/authenticationToken|webServiceURL|serialNumber|passTypeIdentifier/);
});


test('scrolling changes the single centered pass and its highlighted route', () => {
  jest.useFakeTimers();
  const { container } = render(<BoardingPasses />);
  const scroller = screen.getByRole('region', { name: 'Boarding passes, scroll vertically' });
  fireEvent.scroll(scroller, { target: { scrollTop: 64 } });
  act(() => { jest.advanceTimersByTime(20); });
  expect(container.querySelectorAll('.wallet-pass-focused')).toHaveLength(1);
  expect(screen.getByRole('article', { name: `${flights[1].flight} focused boarding pass` })).toBeInTheDocument();
  expect(screen.getByTestId('selected-flight-route')).toHaveAttribute('data-origin', flights[1].origin);
  expect(screen.getByTestId('selected-flight-route')).toHaveAttribute('data-destination', flights[1].destination);
  fireEvent.keyDown(scroller, { key: 'End' });
  expect(screen.getByRole('article', { name: `${flights[flights.length - 1].flight} focused boarding pass` })).toBeInTheDocument();
  jest.useRealTimers();
});


test('paper images remain visible and digital barcodes are disabled in both views', () => {
  render(<BoardingPasses />);
  const paper = flights.find(f => f.paperImage);
  const choosePaper = screen.queryByRole('button', { name: new RegExp(`^Show ${paper.flight},`) });
  if (choosePaper) fireEvent.click(choosePaper);
  expect(screen.getByRole('img', { name: `Original ${paper.airline} paper boarding pass, ${paper.flight}, ${paper.origin} to ${paper.destination}` })).toHaveAttribute('src', paper.paperImage.src);
  const wallet = flights.find(f => f.originalWallet);
  fireEvent.click(screen.getByRole('button', { name: new RegExp(`^Show ${wallet.flight},`) }));
  expect(screen.queryByRole('img', { name: `Original barcode for ${wallet.flight}` })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: `Enlarge ${wallet.flight} boarding pass` }));
  expect(screen.getByText('Pass details')).toBeInTheDocument();
  expect(screen.queryByRole('img', { name: `Original barcode for ${wallet.flight}` })).not.toBeInTheDocument();
  expect(wallet.originalWallet).not.toHaveProperty('barcode');
});


test('paper boarding passes appear before digital Wallet passes', () => {
  const firstDigital = flights.findIndex(flight => !flight.paperImage);
  expect(firstDigital).toBe(39);
  expect(flights.slice(0, firstDigital).every(flight => flight.paperImage)).toBe(true);
  expect(flights.slice(firstDigital).every(flight => flight.originalWallet)).toBe(true);
});


test('paper passes use their actual ticket images throughout the stack', () => {
  render(<BoardingPasses />);
  const stack = screen.getByRole('list', { name: 'Stack of boarding passes' });
  const paper = flights.find(flight => flight.paperImage);
  const paperTrigger = within(stack).queryByRole('button', { name: new RegExp(`^Show ${paper.flight},`) }) || within(stack).getByRole('button', { name: `Enlarge ${paper.flight} boarding pass` });
  expect(paperTrigger.querySelector('img')).toHaveAttribute('src', paper.paperImage.src);
  expect(paperTrigger.querySelector('.wallet-pass-header')).toBeNull();
  expect(stack.querySelectorAll('li[data-cycle="1"] .original-paper-pass img')).toHaveLength(39);
  const digital = flights.find(flight => flight.originalWallet);
  expect(within(stack).getByRole('button', { name: new RegExp(`^Show ${digital.flight},`) }).querySelector('.original-wallet-pass')).not.toBeNull();
});


test('the stack uses full digital pass content and no View pass bar', () => {
  const { container } = render(<BoardingPasses />);
  expect(screen.queryByText('View pass')).not.toBeInTheDocument();
  expect(container.querySelectorAll('li[data-cycle="1"] .digital-pass-stack-trigger .original-wallet-pass')).toHaveLength(26);
  expect(container.querySelector('#focused-flight-pass .wallet-pass-footer')).toBeNull();
  const trigger = screen.getByRole('button', { name: `Enlarge ${flights[0].flight} boarding pass` });
  expect(trigger).toHaveClass('original-pass-open');
  fireEvent.click(trigger);
  expect(screen.getByRole('dialog')).toBeVisible();
  expect(container.ownerDocument.querySelector('.wallet-pass-enlarged .wallet-pass-footer')).toBeNull();
});


test('passes stay in one ordered overlapping stack without a duplicate focused layer', () => {
  const { container } = render(<BoardingPasses />);
  const stack = screen.getByRole('list', { name: 'Stack of boarding passes' });
  const focused = within(stack).getByRole('article', { name: `${flights[0].flight} focused boarding pass` });
  expect(focused.parentElement).toHaveClass('is-focused');
  expect(Number(focused.parentElement.nextElementSibling.style.getPropertyValue('--pass-layer'))).toBeGreaterThan(Number(focused.parentElement.style.getPropertyValue('--pass-layer')));
  expect(container.querySelector('.wallet-pass-focus-anchor')).toBeNull();
  expect(focused.querySelectorAll(`img[src="${flights[0].paperImage.src}"]`)).toHaveLength(1);
  expect(container.querySelectorAll('.wallet-pass-focused')).toHaveLength(1);
  expect(within(stack).getAllByRole('article')).toHaveLength(flights.length);
});


test('scrolling wraps from the first pass to the last and back without changing the route link', () => {
  jest.useFakeTimers();
  render(<BoardingPasses />);
  const scroller = screen.getByRole('region', { name: 'Boarding passes, scroll vertically' });
  expect(scroller.scrollTop).toBe(flights.length * 64);
  fireEvent.scroll(scroller, { target: { scrollTop: (flights.length - 1) * 64 } });
  act(() => { jest.advanceTimersByTime(20); });
  const last = flights[flights.length - 1];
  expect(screen.getByRole('article', { name: `${last.flight} focused boarding pass` })).toBeInTheDocument();
  expect(scroller.scrollTop).toBe((flights.length * 2 - 1) * 64);
  expect(screen.getByTestId('selected-flight-route')).toHaveAttribute('data-origin', last.origin);
  fireEvent.scroll(scroller, { target: { scrollTop: flights.length * 2 * 64 } });
  act(() => { jest.advanceTimersByTime(20); });
  expect(screen.getByRole('article', { name: `${flights[0].flight} focused boarding pass` })).toBeInTheDocument();
  expect(scroller.scrollTop).toBe(flights.length * 64);
  expect(screen.getByTestId('selected-flight-route')).toHaveAttribute('data-origin', flights[0].origin);
  jest.useRealTimers();
});

test('historical flights without boarding passes appear on the map but never in the pass stack', () => {
  const { container } = render(<BoardingPasses />);
  expect(container.querySelector('[data-route="SGN-CAN"], [data-route="CAN-SGN"]')).not.toBeNull();
  expect(container.querySelector('[data-route="CAN-PEK"]')).not.toBeNull();
  expect(container.querySelector('[data-route="BKK-HKT"]')).not.toBeNull();
  expect(screen.queryByRole('button', { name: /CZ368/ })).not.toBeInTheDocument();
  const stack = screen.getByRole('list', { name: 'Stack of boarding passes' });
  expect(stack.querySelectorAll('li[data-cycle="1"]')).toHaveLength(flights.length);
  expect(container.querySelector('.flight-pass-toolbar')).toHaveTextContent('92 flights');
});
