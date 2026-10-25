import { createEvent, fireEvent, render, screen, within } from '@testing-library/react';
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
  for (const outside of [screen.getByRole('heading', { name: 'EDUCATION & EXPERIENCES' }), screen.getByRole('button', { name: 'Scroll timeline right' })]) {
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


test('company entries open their details, switch companies, and close with focus restored', () => {
  HTMLElement.prototype.scrollTo = jest.fn();
  render(<Timeline />);
  const fpt = screen.getByRole('button', { name: /June 2025.*FPT Software/ });
  const opswat = screen.getByRole('button', { name: /September 2025.*OPSWAT Inc/ });
  const apple = screen.getByRole('button', { name: /May 2026.*Apple Inc/ });
  expect(screen.queryByRole('article')).not.toBeInTheDocument();
  expect(screen.queryByText('2004 — 2026')).not.toBeInTheDocument();
  fireEvent.click(fpt);
  let panel = screen.getByRole('article', { name: 'FPT Software' });
  expect(fpt).toHaveAttribute('aria-expanded', 'true');
  expect(screen.queryByRole('region', { name: 'Horizontal life timeline' })).not.toBeInTheDocument();
  expect(within(panel).getByRole('img', { name: 'FPT Software logo' })).toBeInTheDocument();
  expect(panel).toHaveTextContent('Patient Insights Analysis');
  expect(panel).toHaveTextContent('NRC Health');
  fireEvent.click(opswat);
  const opswatPanel = screen.getByRole('article', { name: 'OPSWAT Inc' });
  expect(opswatPanel).toHaveTextContent('normalizes fragmented threat feeds');
  expect(opswatPanel).not.toHaveTextContent('70%');
  expect(opswatPanel).toHaveTextContent('Tech Stack: Next.js, TypeScript');
  expect(opswatPanel).toHaveTextContent('Java (WatchService)');
  expect(fpt).toHaveAttribute('aria-expanded', 'false');
  fireEvent.click(apple);
  panel = screen.getByRole('article', { name: 'Apple Inc' });
  expect(within(panel).getByText('Streaming Media Ecosystem Tech')).toBeInTheDocument();
  expect(panel).toHaveTextContent('agentic root-cause analysis');
  expect(panel).toHaveTextContent('dual PKCE flows');
  expect(within(panel).getByRole('button', { name: 'FastMCP' })).toBeInTheDocument();
  fireEvent.keyDown(panel, { key: 'Escape' });
  expect(screen.queryByRole('article')).not.toBeInTheDocument();
  expect(apple).toHaveFocus();
  fireEvent.click(fpt);
  fireEvent.click(screen.getByRole('button', { name: 'Back to timeline' }));
  expect(fpt).toHaveFocus();
  expect(screen.queryByRole('article')).not.toBeInTheDocument();
  delete HTMLElement.prototype.scrollTo;
});


test.each([
  ['Thủ Đức High School', '2019–2022', 'N/A'],
  ['University of South Florida', '2022–2026', 'Computer Science'],
])('opens education details for %s and returns to the timeline', (name, date, description) => {
  HTMLElement.prototype.scrollTo = jest.fn();
  render(<Timeline />);
  const entry = screen.getByRole('button', { name: new RegExp(`${date}: ${name}`) });
  fireEvent.click(entry);
  const panel = screen.getByRole('article', { name });
  expect(within(panel).getByRole('heading', { name: 'Description' })).toBeInTheDocument();
  expect(panel).toHaveTextContent(description);
  if (name === 'University of South Florida') {
    expect(panel).toHaveTextContent('GPA: 3.7');
    const gpa = within(panel).getByRole('button', { name: '3.7' });
    expect(gpa).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(gpa);
    expect(gpa).toHaveAttribute('aria-expanded', 'true');
    expect(panel).toHaveTextContent('Magna Cum Laude');
    expect(panel).toHaveTextContent('Operating Systems');
    expect(panel).toHaveTextContent('Computer Networks');
  }
  expect(within(panel).getByRole('img', { name: `${name} logo` })).toBeInTheDocument();
  expect(screen.queryByRole('region', { name: 'Horizontal life timeline' })).not.toBeInTheDocument();
  fireEvent.click(within(panel).getByRole('button', { name: 'Back to timeline' }));
  expect(screen.getByRole('region', { name: 'Horizontal life timeline' })).toBeInTheDocument();
  expect(entry).toHaveFocus();
  delete HTMLElement.prototype.scrollTo;
});
