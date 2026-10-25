import { act, fireEvent, render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import FutureCompany from './FutureCompany';

const pointer = { pointerId: 1, pointerType: 'mouse', button: 0 };
let rectSpy;
beforeAll(() => {
  window.PointerEvent = class PointerEvent extends MouseEvent {
    constructor(type, init = {}) {
      super(type, init);
      this.pointerId = init.pointerId || 1;
      this.pointerType = init.pointerType || 'mouse';
    }
  };
  global.ResizeObserver = class { observe() {} disconnect() {} };
  HTMLElement.prototype.setPointerCapture = jest.fn();
});
beforeEach(() => {
  rectSpy = jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
    return this.classList.contains('wish-drop-target')
      ? { left: 500, right: 740, top: 300, bottom: 540, width: 240, height: 240 }
      : { left: 0, right: 150, top: 0, bottom: 30, width: 150, height: 30 };
  });
});
afterEach(() => { cleanup(); rectSpy.mockRestore(); jest.useRealTimers(); });

function chooseApple() {
  render(<FutureCompany />);
  const trigger = screen.getByRole('button', { name: 'Future company: reveal company logos' });
  fireEvent.pointerOver(trigger, pointer);
  return screen.getByRole('button', { name: 'Make a wish for Apple' });
}

test('grabbing reveals the altar and a drop inside submits an offering', () => {
  const apple = chooseApple();
  expect(screen.queryByRole('region', { name: 'Company wish altar' })).not.toBeInTheDocument();
  fireEvent.pointerDown(apple, { ...pointer, clientX: 100, clientY: 100 });
  expect(screen.getByRole('region', { name: 'Company wish altar' })).toBeInTheDocument();
  expect(screen.queryByText('Your wish has been submitted')).not.toBeInTheDocument();
  fireEvent.pointerMove(apple, { ...pointer, clientX: 620, clientY: 410 });
  fireEvent.pointerUp(apple, { ...pointer, clientX: 620, clientY: 410 });
  expect(screen.getByRole('status')).toHaveTextContent('Your wish has been submitted');
  expect(screen.getByRole('img', { name: 'Apple offering' })).toBeInTheDocument();
});

test('dropping outside the altar does not submit a wish', () => {
  const apple = chooseApple();
  fireEvent.pointerDown(apple, { ...pointer, clientX: 100, clientY: 100 });
  fireEvent.pointerMove(apple, { ...pointer, clientX: 30, clientY: 30 });
  fireEvent.pointerUp(apple, { ...pointer, clientX: 30, clientY: 30 });
  expect(screen.queryByRole('region', { name: 'Company wish altar' })).not.toBeInTheDocument();
  expect(screen.queryByText('Your wish has been submitted')).not.toBeInTheDocument();
});

test('a cancelled pointer gesture cannot accidentally submit later', () => {
  const apple = chooseApple();
  fireEvent.pointerDown(apple, { ...pointer, clientX: 100, clientY: 100 });
  fireEvent.pointerCancel(apple, pointer);
  fireEvent.pointerUp(apple, { ...pointer, clientX: 620, clientY: 410 });
  expect(screen.queryByRole('region', { name: 'Company wish altar' })).not.toBeInTheDocument();
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});

test('keyboard users can choose, place, and dismiss an offering', () => {
  const apple = chooseApple();
  fireEvent.click(apple, { detail: 0 });
  const place = screen.getByRole('button', { name: 'Place Apple on the altar' });
  expect(place).toHaveFocus();
  fireEvent.click(place);
  expect(screen.getByRole('status')).toHaveTextContent('Your wish has been submitted');
  fireEvent.click(screen.getByRole('button', { name: 'Close wish altar' }));
  expect(screen.queryByRole('region', { name: 'Company wish altar' })).not.toBeInTheDocument();
  expect(apple).toHaveFocus();
});

test('altar uses the slot below About Me and fades four seconds after submission', () => {
  jest.useFakeTimers();
  render(<section className="about-section"><FutureCompany /><div className="wish-altar-slot" /></section>);
  fireEvent.pointerOver(screen.getByRole('button', { name: 'Future company: reveal company logos' }), pointer);
  fireEvent.click(screen.getByRole('button', { name: 'Make a wish for Apple' }), { detail: 0 });
  const altar = screen.getByRole('region', { name: 'Company wish altar' });
  expect(altar.parentElement).toHaveClass('wish-altar-slot');
  fireEvent.click(screen.getByRole('button', { name: 'Place Apple on the altar' }));
  act(() => jest.advanceTimersByTime(3999));
  expect(altar).not.toHaveClass('is-leaving');
  act(() => jest.advanceTimersByTime(1));
  expect(altar).toHaveClass('is-leaving');
  act(() => jest.advanceTimersByTime(450));
  expect(screen.queryByRole('region', { name: 'Company wish altar' })).not.toBeInTheDocument();
});

test('a new company wish gets its own full four-second confirmation', () => {
  jest.useFakeTimers();
  const apple = chooseApple();
  fireEvent.click(apple, { detail: 0 });
  fireEvent.click(screen.getByRole('button', { name: 'Place Apple on the altar' }));
  act(() => jest.advanceTimersByTime(3000));
  fireEvent.click(screen.getByRole('button', { name: 'Make a wish for Google' }), { detail: 0 });
  fireEvent.click(screen.getByRole('button', { name: 'Place Google on the altar' }));
  act(() => jest.advanceTimersByTime(1000));
  expect(screen.getByRole('region', { name: 'Company wish altar' })).not.toHaveClass('is-leaving');
  act(() => jest.advanceTimersByTime(3000));
  expect(screen.getByRole('region', { name: 'Company wish altar' })).toHaveClass('is-leaving');
});
