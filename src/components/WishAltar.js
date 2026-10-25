import Altar from '../img/wish-altar.png';

export default function WishAltar({ wish, drag, dropRef, onClose, onSubmit }) {
  const submitted = wish.phase === 'submitted' || wish.phase === 'leaving';
  return (
    <>
      <aside className={`wish-scene ${drag?.over ? 'is-over-altar' : ''} ${submitted ? 'is-submitted' : ''} ${wish.phase === 'leaving' ? 'is-leaving' : ''}`}
        role="region" aria-label="Company wish altar"
        onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); onClose(); } }}>
        <button type="button" className="wish-close" aria-label="Close wish altar" onClick={onClose}>×</button>
        {submitted && <div className="wish-message">
          <p className="wish-confirmation" role="status">Your wish has been submitted</p>
        </div>}
        <button ref={dropRef} type="button" className="wish-drop-target"
          aria-label={`Place ${wish.company.name} on the altar`}
          aria-disabled={submitted || wish.phase === 'dragging'}
          onClick={() => { if (!submitted && wish.phase !== 'dragging') onSubmit(); }}>
          <img src={Altar} className="wish-altar-image" alt="Cartoon Vietnamese altar with flowers, fruit, candles, and incense" draggable="false" />
          {submitted && <span className={`wish-offering company-logo--${wish.company.className}`}>
            <img src={wish.company.image} alt={`${wish.company.name} offering`} draggable="false" />
          </span>}
        </button>
      </aside>
      {drag && <span className={`wish-drag-icon company-logo--${drag.company.className}`}
        style={{ left: drag.x, top: drag.y }} aria-hidden="true">
        <img src={drag.company.image} alt="" draggable="false" />
      </span>}
    </>
  );
}
