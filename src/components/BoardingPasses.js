import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import flights from './flightPasses.json';
import FlightMap from './FlightMap';
import { mapFlights } from './flightHistory';
import OriginalBoardingPass from './OriginalBoardingPass';
import './BoardingPasses.css';

const STACK_STEP = 64;
const PASS_COUNT = flights.length;
const loopedPasses = Array.from({ length: PASS_COUNT * 3 }, (_, slot) => ({ flight: flights[slot % PASS_COUNT], slot }));
const cardStyle = flight => ({ '--pass-color': flight.color, '--pass-text': flight.textColor });

export default function BoardingPasses() {
  const [focusedSlot, setFocusedSlot] = useState(PASS_COUNT);
  const [enlarged, setEnlarged] = useState(null);
  const [zoom, setZoom] = useState(1);
  const dialog = useRef(null);
  const zoomViewport = useRef(null);
  const passScroller = useRef(null);
  const focusFrame = useRef(null);
  const focusedCard = useRef(null);
  const isOpen = enlarged !== null;
  const selected = flights[((focusedSlot % PASS_COUNT) + PASS_COUNT) % PASS_COUNT];
  const visibleCycle = Math.floor(focusedSlot / PASS_COUNT);
  useLayoutEffect(() => {
    if (passScroller.current) passScroller.current.scrollTop = PASS_COUNT * STACK_STEP;
  }, []);
  useLayoutEffect(() => {
    const scroller = passScroller.current;
    if (!scroller) return undefined;
    const resize = () => {
      if (scroller.clientHeight) scroller.style.setProperty('--stack-viewport-height', `${scroller.clientHeight}px`);
    };
    resize();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    observer?.observe(scroller);
    window.addEventListener('resize', resize);
    return () => { observer?.disconnect(); window.removeEventListener('resize', resize); };
  }, []);
  useLayoutEffect(() => {
    const card = focusedCard.current;
    const scroller = passScroller.current;
    if (!card || !scroller) return undefined;
    const measure = () => {
      const height = card.getBoundingClientRect().height;
      if (height) scroller.style.setProperty('--focused-pass-height', `${height}px`);
    };
    measure();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    observer?.observe(card);
    return () => observer?.disconnect();
  }, [focusedSlot]);
  useEffect(() => () => {
    if (focusFrame.current !== null) window.cancelAnimationFrame(focusFrame.current);
  }, []);
  const focusPass = slot => {
    const index = ((slot % PASS_COUNT) + PASS_COUNT) % PASS_COUNT;
    const middleSlot = PASS_COUNT + index;
    setFocusedSlot(middleSlot);
    passScroller.current?.scrollTo?.({
      top: middleSlot * STACK_STEP,
      behavior: slot !== middleSlot || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };
  const followScroll = () => {
    if (focusFrame.current !== null || isOpen || !PASS_COUNT) return;
    focusFrame.current = window.requestAnimationFrame(() => {
      focusFrame.current = null;
      const scroller = passScroller.current;
      if (!scroller) return;
      const rawSlot = Math.round(scroller.scrollTop / STACK_STEP);
      const middleSlot = PASS_COUNT + ((rawSlot % PASS_COUNT) + PASS_COUNT) % PASS_COUNT;
      // Rebase to the identical middle cycle while preserving the partial-card offset.
      // The adjacent cycles keep the first and last passes connected in both directions.
      if (middleSlot !== rawSlot) scroller.scrollTop += (middleSlot - rawSlot) * STACK_STEP;
      setFocusedSlot(middleSlot);
    });
  };
  const close = () => setEnlarged(null);
  const changeZoom = amount => setZoom(value => Math.max(1, Math.min(3, value + amount)));
  useEffect(() => {
    if (!isOpen) return undefined;
    const modal = dialog.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    modal.showModal();
    return () => {
      modal.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [isOpen]);
  useLayoutEffect(() => {
    if (!isOpen || !zoomViewport.current) return;
    const stage = zoomViewport.current;
    stage.scrollLeft = Math.max(0, (stage.scrollWidth - stage.clientWidth) / 2);
    stage.scrollTop = Math.max(0, (stage.scrollHeight - stage.clientHeight) / 2);
  }, [zoom, isOpen]);

  return <section id="boarding-passes" className="flight-archive-section" aria-labelledby="boarding-passes-title">
    <div className="flight-archive-title"><h2 id="boarding-passes-title" className="font-archivo">PLACES I HAVE BEEN</h2><span className="flight-archive-hint" aria-hidden="true">(real boarding passes included)</span></div>
    <div className="flight-archive-split">
      <div className="flight-pass-panel">
        <div className="flight-pass-toolbar">
          <div><h3>My boarding passes</h3><span>{mapFlights.length} flights · {new Set(mapFlights.map(flight => flight.airlineCode)).size} airlines</span></div>
        </div>
        <div ref={passScroller} className="flight-pass-scroll" style={{ '--stack-step': `${STACK_STEP}px` }} onScroll={followScroll} onKeyDown={event => {
          if (event.target !== event.currentTarget || !flights.length) return;
          const next = event.key === 'ArrowDown' ? focusedSlot + 1
            : event.key === 'ArrowUp' ? focusedSlot - 1
            : event.key === 'Home' ? PASS_COUNT : event.key === 'End' ? PASS_COUNT * 2 - 1 : null;
          if (next !== null) { event.preventDefault(); focusPass(next); }
        }} role="region" aria-label="Boarding passes, scroll vertically" tabIndex={0}>
          <ul className="flight-pass-list" aria-label="Stack of boarding passes">
            {loopedPasses.map(({ flight, slot }) => {
              const active = slot === focusedSlot;
              const cycle = Math.floor(slot / PASS_COUNT);
              return <li key={`${slot}-${flight.id}`} className={active ? 'is-focused' : ''} style={{ '--pass-layer': slot }} data-cycle={cycle} aria-hidden={cycle !== visibleCycle || undefined}>
                <article data-ui="boarding-pass" ref={active ? focusedCard : undefined} id={active ? 'focused-flight-pass' : undefined}
                  className={`wallet-flight-card${active ? ' wallet-pass-focused is-selected' : ' is-stacked'}${flight.paperImage ? ' has-paper paper-pass-in-stack' : ''}`}
                  style={cardStyle(flight)} aria-label={active ? `${flight.flight} focused boarding pass` : undefined}>
                  <button type="button" className={active ? 'original-pass-open' : flight.paperImage ? 'paper-pass-stack-trigger' : 'digital-pass-stack-trigger'} tabIndex={active ? 0 : -1}
                    aria-pressed={active} aria-expanded={active} aria-haspopup={active ? 'dialog' : undefined}
                    aria-label={active ? `Enlarge ${flight.flight} boarding pass` : `Show ${flight.flight}, ${flight.origin} to ${flight.destination}, ${flight.date || 'date unavailable'} on map`}
                    onClick={() => {
                      if (active) { setZoom(1); setEnlarged(flight); }
                      else focusPass(slot);
                    }}><OriginalBoardingPass flight={flight} decorative={!active} /></button>
                </article>
              </li>;
            })}
          </ul>
        </div>
      </div>
      <div className="flight-right-column">
        <FlightMap flights={mapFlights} selected={selected} />
        <section className="future-flights-panel" aria-labelledby="future-trips-heading">
          <h3 id="future-trips-heading" className="pending-passes-heading">Boarding passes pending...</h3>
          <ul className="future-trip-list">
            {['Washington DC', 'New York', 'San Francisco', 'Chicago', 'Los Angeles'].map(city => (
              <li key={city}><span>{city}</span><span className="future-trip-status">ticket purchasing...</span></li>
            ))}
          </ul>
        </section>
      </div>
    </div>
    {createPortal(<dialog ref={dialog} className="boarding-pass-dialog" aria-labelledby="boarding-pass-dialog-title"
      onCancel={event => { event.preventDefault(); close(); }}
      onClick={event => { if (event.target === event.currentTarget) close(); }}
      onKeyDown={event => {
        if (event.key === '+' || event.key === '=') { event.preventDefault(); changeZoom(.5); }
        if (event.key === '-') { event.preventDefault(); changeZoom(-.5); }
        if (event.key === '0') { event.preventDefault(); setZoom(1); }
      }}>
      {enlarged && <>
        <div className="boarding-pass-dialog-header"><h3 id="boarding-pass-dialog-title">{enlarged.airline} · {enlarged.flight}</h3>
          <div className="boarding-pass-zoom-controls">
            <button type="button" aria-label="Zoom out" disabled={zoom === 1} onClick={() => changeZoom(-.5)}>−</button>
            <button type="button" aria-label="Reset zoom" className="boarding-pass-zoom-level" onClick={() => setZoom(1)}>{Math.round(zoom * 100)}%</button>
            <button type="button" aria-label="Zoom in" disabled={zoom === 3} onClick={() => changeZoom(.5)}>+</button>
            <button type="button" aria-label="Close enlarged boarding pass" onClick={close}>×</button>
          </div>
        </div>
        <div ref={zoomViewport} className="boarding-pass-zoom-viewport">
          <div className="wallet-pass-zoom-sizer" style={{ '--zoom': zoom }}>
            <article data-ui="boarding-pass" className={`wallet-flight-card wallet-pass-enlarged${enlarged.paperImage ? ' has-paper' : ''}`} style={cardStyle(enlarged)}><OriginalBoardingPass flight={enlarged} showBack /></article>
          </div>
        </div>
      </>}
    </dialog>, document.body)}
  </section>;
}
