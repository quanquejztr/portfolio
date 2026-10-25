import { useEffect, useState } from 'react';
import { useDisplayName } from './DisplayName';

export default function NameWordmark() {
  const { firstName, fullName, toggleName } = useDisplayName();
  const [showHint, setShowHint] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 10000);
    return () => clearTimeout(timer);
  }, []);
  return <div className="name-brand">
    <button type="button" className="name-wordmark" aria-label={`Switch name to ${firstName === 'Stephen' ? 'Cuong' : 'Stephen'}`}
      aria-pressed={firstName === 'Cuong'} aria-describedby={showHint ? 'name-switch-hint' : undefined}
      onClick={() => { toggleName(); setShowHint(false); }}>
      {firstName.toUpperCase()}
    </button>
    {showHint && <span id="name-switch-hint" className="name-switch-hint">
      <svg viewBox="0 0 24 40" focusable="false" aria-hidden="true"><path d="M3 2q9 2 18-1l-3 26H7z" /><circle cx="12" cy="35" r="4.5" /></svg>
      <span>Click to switch name</span>
    </span>}
    <span className="sr-only" role="status" aria-live="polite">{fullName}</span>
  </div>;
}
