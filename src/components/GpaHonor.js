import { useState } from 'react';

export default function GpaHonor({ gpa, honor }) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pinned, setPinned] = useState(false);
  const active = hovered || focused || pinned;
  return <span className={`gpa-reveal${active ? ' is-open' : ''}`}
    onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true); }}
    onPointerLeave={() => setHovered(false)}>
    <button type="button" className="gpa-trigger" aria-expanded={active} aria-controls="gpa-graduation-honor"
      onClick={() => setPinned(value => !value)}
      onFocus={event => { if (event.target.matches(':focus-visible')) setFocused(true); }}
      onBlur={() => setFocused(false)}
      onKeyDown={event => { if (event.key === 'Escape') { setHovered(false); setFocused(false); setPinned(false); } }}>
      {gpa}
    </button>
    <span id="gpa-graduation-honor" className="gpa-honor" aria-hidden={!active}><span>{honor}</span></span>
  </span>;
}
