import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import WishAltar from './WishAltar';
import Apple from '../img/company-logos/apple.svg';
import Bloomberg from '../img/company-logos/bloomberg.svg';
import Databricks from '../img/company-logos/databricks.svg';
import Google from '../img/company-logos/google.svg';
import Uber from '../img/company-logos/uber.svg';
import PayPal from '../img/company-logos/paypal.svg';

const companies = [
  { name: 'Apple', image: Apple, className: 'apple' },
  { name: 'Bloomberg', image: Bloomberg, className: 'bloomberg' },
  { name: 'Databricks', image: Databricks, className: 'databricks' },
  { name: 'Google', image: Google, className: 'google' },
  { name: 'Uber', image: Uber, className: 'uber' },
  { name: 'PayPal', image: PayPal, className: 'paypal' },
];

export default function FutureCompany() {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [wish, setWish] = useState(null);
  const [drag, setDrag] = useState(null);
  const active = hovered || focused || pinned || Boolean(wish);
  const dragging = Boolean(drag);
  const slotRef = useRef(null);
  const labelRef = useRef(null);
  const dragRef = useRef(null);
  const dropRef = useRef(null);
  const sourceRef = useRef(null);
  const aboutSection = slotRef.current?.closest('.about-section');
  const altarHost = aboutSection?.querySelector('.wish-altar-slot') || aboutSection || document.body;

  useLayoutEffect(() => {
    const label = labelRef.current;
    const measure = () => slotRef.current?.style.setProperty('--company-text-width', `${label.getBoundingClientRect().width}px`);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(label);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (wish?.phase !== 'selected' && wish?.phase !== 'dragging') return;
    if (wish.phase === 'selected') dropRef.current?.focus({ preventScroll: true });
    const rect = dropRef.current?.getBoundingClientRect();
    if (rect && (rect.top < 24 || rect.bottom > window.innerHeight - 24)) {
      dropRef.current?.scrollIntoView?.({
        block: 'center',
        behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      });
    }
  }, [wish]);

  useEffect(() => {
    if (!dragging) return undefined;
    // A drag must not get stuck if the window loses focus or the app is switched.
    const cancel = () => { dragRef.current = null; setDrag(null); setWish(null); };
    window.addEventListener('blur', cancel);
    return () => window.removeEventListener('blur', cancel);
  }, [dragging]);

  useEffect(() => {
    if (wish?.phase !== 'submitted' && wish?.phase !== 'leaving') return undefined;
    const leaving = wish.phase === 'leaving';
    const timeout = setTimeout(() => {
      if (leaving && document.activeElement === dropRef.current) sourceRef.current?.focus({ preventScroll: true });
      setWish(current => current === wish ? (leaving ? null : { ...wish, phase: 'leaving' }) : current);
    }, leaving ? 450 : 4000);
    return () => clearTimeout(timeout);
  }, [wish]);

  const isOverAltar = (x, y) => {
    const rect = dropRef.current?.getBoundingClientRect();
    return Boolean(rect && x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom);
  };

  const releasePointer = () => {
    const session = dragRef.current;
    dragRef.current = null;
    if (session?.source.hasPointerCapture?.(session.pointerId)) session.source.releasePointerCapture(session.pointerId);
  };

  const closeWish = () => {
    releasePointer();
    setDrag(null);
    setWish(null);
    sourceRef.current?.focus({ preventScroll: true });
  };

  const submitWish = company => {
    releasePointer();
    setDrag(null);
    setWish({ company, phase: 'submitted' });
  };

  const beginDrag = (event, company) => {
    if (event.button !== 0) return;
    event.preventDefault();
    sourceRef.current = event.currentTarget;
    event.currentTarget.focus({ preventScroll: true });
    dragRef.current = {
      company, pointerId: event.pointerId, source: event.currentTarget,
      startX: event.clientX, startY: event.clientY, moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setWish({ company, phase: 'dragging' });
    setDrag({ company, x: event.clientX, y: event.clientY, over: false });
  };

  const moveDrag = event => {
    const session = dragRef.current;
    if (!session || session.pointerId !== event.pointerId) return;
    session.moved ||= Math.hypot(event.clientX - session.startX, event.clientY - session.startY) > 6;
    setDrag({ company: session.company, x: event.clientX, y: event.clientY, over: isOverAltar(event.clientX, event.clientY) });
  };

  const finishDrag = event => {
    const session = dragRef.current;
    if (!session || session.pointerId !== event.pointerId) return;
    const over = isOverAltar(event.clientX, event.clientY);
    releasePointer();
    setDrag(null);
    if (over) submitWish(session.company);
    else if (!session.moved) setWish({ company: session.company, phase: 'selected' });
    else setWish(null);
  };

  const cancelDrag = () => {
    if (!dragRef.current) return;
    releasePointer();
    setDrag(null);
    setWish(null);
  };

  // A browser may release element pointer capture when the source scrolls out of view.
  // Keep following this gesture at window level until release, cancellation, or blur.
  useEffect(() => {
    if (!dragging) return undefined;
    window.addEventListener('pointermove', moveDrag);
    window.addEventListener('pointerup', finishDrag);
    window.addEventListener('pointercancel', cancelDrag);
    return () => {
      window.removeEventListener('pointermove', moveDrag);
      window.removeEventListener('pointerup', finishDrag);
      window.removeEventListener('pointercancel', cancelDrag);
    };
  });

  return (
    <>
      <span className={`future-company ${active ? 'is-active' : ''} ${drag ? 'is-dragging' : ''}`}
        onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true); }}
        onPointerLeave={() => setHovered(false)}
        onFocus={event => { if (event.target.matches(':focus-visible')) setFocused(true); }}
        onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
        onKeyDown={event => {
          if (event.key === 'Escape') {
            closeWish(); setHovered(false); setFocused(false); setPinned(false);
          }
        }}>
        <span aria-hidden="true">[</span>
        <span ref={slotRef} className="company-slot">
          <button ref={labelRef} type="button" className="company-placeholder"
            aria-label="Future company: reveal company logos" aria-expanded={active}
            onClick={() => setPinned(value => !value)}>
            future company
          </button>
          <span className="company-logos" aria-label="Choose a company to wish for" aria-hidden={!active} inert={!active}>
            {companies.map((company, index) => (
              <button type="button" className={`company-logo company-logo--${company.className} ${wish?.company.name === company.name ? 'is-offered' : ''}`}
                key={company.name} style={{ '--entrance-index': index }} title={`Drag ${company.name} to make a wish`}
                aria-label={`Make a wish for ${company.name}`} aria-describedby="company-wish-instructions"
                tabIndex={active ? 0 : -1}
                onPointerDown={event => beginDrag(event, company)}
                onClick={event => {
                  // Pointer gestures are handled above; this path is for keyboard/assistive activation.
                  if (event.detail === 0) {
                    sourceRef.current = event.currentTarget;
                    setWish({ company, phase: 'selected' });
                  }
                }}>
                <img src={company.image} alt="" draggable="false" />
              </button>
            ))}
          </span>
        </span>
        <span aria-hidden="true">]</span>
        <span id="company-wish-instructions" className="sr-only">Drag a company logo onto the altar, or press Enter to choose it and then place it on the altar. Press Escape to cancel.</span>
      </span>
      {wish && createPortal(
        <WishAltar wish={wish} drag={drag} dropRef={dropRef} onClose={closeWish}
          onSubmit={() => submitWish(wish.company)} />,
        altarHost
      )}
    </>
  );
}
