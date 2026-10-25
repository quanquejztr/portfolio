import './OriginalBoardingPass.css';

// Pass fields are displayed as text. Issuer HTML never executes in the portfolio.
function text(value) {
  return String(value ?? '').replace(/<br\s*\/?\s*>/gi, '\n').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}
export function originalFieldValue(field) {
  const value = text(field.value);
  if ((!field.dateStyle && !field.timeStyle) || !/^\d{4}-\d{2}-\d{2}T/.test(value)) return value;
  // Airlines often encode wall-clock display values with ignoresTimeZone enabled.
  const wallClock = new Date(value.replace(/(?:Z|[+-]\d\d:\d\d)$/, '') + 'Z');
  if (Number.isNaN(wallClock.getTime())) return value;
  const options = { timeZone: 'UTC' };
  if (field.dateStyle && field.dateStyle !== 'PKDateStyleNone') Object.assign(options, { month: 'short', day: 'numeric' }, field.dateStyle === 'PKDateStyleFull' || field.dateStyle === 'PKDateStyleLong' ? { year: 'numeric' } : {});
  if (field.timeStyle && field.timeStyle !== 'PKDateStyleNone') Object.assign(options, { hour: 'numeric', minute: '2-digit' });
  if (Object.keys(options).length === 1) return value;
  return new Intl.DateTimeFormat('en-US', options).format(wallClock);
}
function Field({ field }) {
  return <div className="original-wallet-field" style={{ textAlign: field.textAlignment === 'PKTextAlignmentRight' ? 'right' : field.textAlignment === 'PKTextAlignmentCenter' ? 'center' : undefined }}>
    {field.label && <span>{text(field.label)}</span>}<strong>{originalFieldValue(field)}</strong>
  </div>;
}
function FieldRow({ fields, className = '' }) {
  if (!fields?.length) return null;
  return <div className={`original-wallet-fields ${className}`}>{fields.map((field, index) => <Field field={field} key={`${field.key || 'field'}-${index}`} />)}</div>;
}
export default function OriginalBoardingPass({ flight, showBack = false, decorative = false }) {
  if (flight.paperImage) return <div className="original-paper-pass" aria-hidden={decorative || undefined}>
    <img src={flight.paperImage.src} width={flight.paperImage.width} height={flight.paperImage.height}
      alt={`Original ${flight.airline} paper boarding pass, ${flight.flight}, ${flight.origin} to ${flight.destination}`}
      decoding="async" draggable="false" />
  </div>;
  const pass = flight.originalWallet;
  if (!pass) return null;
  return <div data-ui="boarding-pass" className="original-wallet-pass" aria-hidden={decorative || undefined} style={{ '--original-background': pass.backgroundColor, '--original-text': pass.foregroundColor, '--original-label': pass.labelColor }}>
    <div className="original-wallet-heading">
      <div className="original-wallet-logo">{pass.logo && <img src={pass.logo} alt={flight.airline} />}{pass.logoText && <span>{pass.logoText}</span>}</div>
      <FieldRow fields={pass.headerFields} className="original-wallet-header-fields" />
    </div>
    <div className="original-wallet-route"><FieldRow fields={pass.primaryFields} className="original-wallet-primary" /><span aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path fill="currentColor" d="M22 15v-2l-8-5V3a2 2 0 0 0-4 0v5l-8 5v2l8-2v6l-3 2v1l5-1 5 1v-1l-3-2v-6z" /></svg></span></div>
    <FieldRow fields={pass.secondaryFields} />
    <FieldRow fields={pass.auxiliaryFields} />
    {pass.footer && <img src={pass.footer} alt="" className="original-wallet-footer-art" />}
    {showBack && pass.backFields?.length > 0 && <details className="original-wallet-back"><summary>Pass details</summary>
      <dl>{pass.backFields.map((field, index) => <div key={`${field.key || 'back'}-${index}`}><dt>{text(field.label)}</dt><dd>{originalFieldValue(field)}</dd></div>)}</dl>
    </details>}
  </div>;
}
