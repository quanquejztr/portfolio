import { useRef, useState } from 'react';
import { submitContact } from './contactSubmission';
import { useDisplayName } from '../components/DisplayName';

export default function ContactMe() {
  const { firstName } = useDisplayName();
  const [status, setStatus] = useState('idle');
  const pending = useRef(false);
  const email = 'stephenluong24@gmail.com';
  const handleSubmit = async event => {
    event.preventDefault();
    if (pending.current) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    pending.current = true;
    setStatus('sending');
    try {
      const result = await submitContact(form);
      if (result.preview) setStatus('preview');
      else { setStatus('success'); form.reset(); }
    } catch {
      setStatus('error');
    } finally {
      pending.current = false;
    }
  };

  return <section id="contact" className="contact-composition contact-original" aria-labelledby="contact-heading">
    <div className="contact-original-main">
      <h2 id="contact-heading" className="font-archivo">CONNECT WITH ME</h2>
      <form id="original-message-box" className="original-message-box" name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={handleSubmit} aria-label={`Send ${firstName} a message`} aria-busy={status === 'sending'}>
        <input type="hidden" name="form-name" value="contact" />
        <p className="contact-honeypot" aria-hidden="true"><label>Leave this field empty<input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
        <p className="original-message-prompt">Have something on your mind? Write it down and send to me, I'll read it and reply asap</p>
        <textarea id="contact-message" name="message" aria-label="Your message" rows="5" required maxLength={10000} placeholder="Write your thoughts here and send it to me. I would love to hear your thoughts!" />
        <div className="original-message-sender">
          <button type="submit" className="contact-send-button" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : `send to ${firstName}`}</button>
          <input id="contact-sender" name="name" aria-label="Your name" autoComplete="name" required maxLength={120} placeholder="your name" />
          <input id="contact-email" name="email" aria-label="Your email" type="email" autoComplete="email" required maxLength={254} placeholder="your email" />
        </div>
        {status === 'success' && <p className="contact-form-status" role="status">Thanks—your message has been submitted.</p>}
        {status === 'preview' && <p className="contact-form-status" role="status">Please use the published site to send this message, or email me directly.</p>}
        {status === 'error' && <p className="contact-form-status" role="alert">Your message couldn’t be sent. Please try again or email me directly.</p>}
      </form>
    </div>
    <div className="contact-links">
      <a href={`mailto:${email}`} aria-label={`Email ${firstName} at ${email}`}>{email}</a>
      <a href="tel:+18135530268">(+1) 813-553-0268</a>
      <div className="contact-socials">
        <a href="https://www.linkedin.com/in/stephenluong04/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://www.instagram.com/ltcunnn/" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="https://www.facebook.com/ltcunnn/" target="_blank" rel="noopener noreferrer">Facebook</a>
      </div>
    </div>
  </section>;
}
