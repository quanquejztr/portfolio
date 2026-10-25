import { createEvent, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Timeline from './Timeline';

let geometry;
let width;
let contentWidth;
beforeEach(() => {
  window.matchMedia = jest.fn(() => ({ matches: true }));
  global.ResizeObserver = class { observe() {} disconnect() {} };
  width = jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(600);
  contentWidth = jest.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(2400);
  geometry = jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
    if (this.classList.contains('timeline-stop')) {
      const buttons = [...this.closest('ol').querySelectorAll('button')];
      const left = buttons.indexOf(this) * 260 - this.closest('.timeline-scroll').scrollLeft;
      return { left, right: left + 260, width: 260 };
    }
    return { left: 0, right: 600, width: 600 };
  });
});
afterEach(() => { geometry.mockRestore(); width.mockRestore(); contentWidth.mockRestore(); });

test('opens at USF and maps a vertical wheel to the horizontal timeline', () => {
  render(<Timeline />);
  const gallery = screen.getByRole('region', { name: 'Horizontal life timeline' });
  expect(screen.getByRole('button', { name: /2022–2026: University of South Florida/ })).toHaveAttribute('aria-pressed', 'true');
  expect(gallery.scrollLeft).toBe(1300);
  const wheel = createEvent.wheel(gallery, { deltaY: 120, cancelable: true });
  fireEvent(gallery, wheel);
  expect(wheel.defaultPrevented).toBe(true);
  expect(gallery.scrollLeft).toBe(1420);
});

test('releases the page at both ends and preserves browser pinch zoom', () => {
  render(<Timeline />);
  const gallery = screen.getByRole('region', { name: 'Horizontal life timeline' });
  gallery.scrollLeft = 0;
  const left = createEvent.wheel(gallery, { deltaY: -120, cancelable: true });
  fireEvent(gallery, left);
  expect(left.defaultPrevented).toBe(false);
  gallery.scrollLeft = 1800;
  const right = createEvent.wheel(gallery, { deltaY: 120, cancelable: true });
  fireEvent(gallery, right);
  expect(right.defaultPrevented).toBe(false);
  gallery.scrollLeft = 1000;
  const zoom = createEvent.wheel(gallery, { deltaY: 120, ctrlKey: true, cancelable: true });
  fireEvent(gallery, zoom);
  expect(zoom.defaultPrevented).toBe(false);
  expect(gallery.scrollLeft).toBe(1000);
});


test('only captures the area below the heading and above the gallery footer', () => {
  render(<Timeline />);
  const gallery = screen.getByRole('region', { name: 'Horizontal life timeline' });
  for (const outside of [screen.getByRole('heading', { name: 'TIMELINE' }), screen.getByRole('button', { name: 'Scroll timeline right' })]) {
    const wheel = createEvent.wheel(outside, { deltaY: 120, cancelable: true });
    fireEvent(outside, wheel);
    expect(wheel.defaultPrevented).toBe(false);
    expect(gallery.scrollLeft).toBe(1300);
  }
  const gap = gallery.parentElement;
  const wheel = createEvent.wheel(gap, { deltaY: 120, cancelable: true });
  fireEvent(gap, wheel);
  expect(wheel.defaultPrevented).toBe(true);
  expect(gallery.scrollLeft).toBe(1420);
});
