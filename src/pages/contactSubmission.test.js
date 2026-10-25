import { readFileSync } from 'fs';
import { resolve } from 'path';
import { submitContact } from './contactSubmission';

function form() {
  const element = document.createElement('form');
  element.innerHTML = '<input name="form-name" value="contact"><input name="name" value="Alex &amp; Sam"><input name="email" value="alex@example.com"><textarea name="message">Hello &amp; thank you</textarea><input name="bot-field" value="">';
  return element;
}

test('Netlify receives the form name and URL-encoded visitor fields', async () => {
  const fetcher = jest.fn().mockResolvedValue({ ok: true });
  await expect(submitContact(form(), { hostname: 'portfolio.netlify.app', fetcher })).resolves.toEqual({ preview: false });
  const [url, request] = fetcher.mock.calls[0];
  expect(url).toBe('/');
  expect(request.method).toBe('POST');
  expect(request.headers['Content-Type']).toBe('application/x-www-form-urlencoded');
  const body = new URLSearchParams(request.body);
  expect(body.get('form-name')).toBe('contact');
  expect(body.get('name')).toBe('Alex & Sam');
  expect(body.get('email')).toBe('alex@example.com');
  expect(body.get('message')).toBe('Hello & thank you');
  expect(body.get('bot-field')).toBe('');
});

test('a rejected server response is an error, and a local preview makes no request', async () => {
  const fetcher = jest.fn().mockResolvedValue({ ok: false });
  await expect(submitContact(form(), { hostname: 'portfolio.netlify.app', fetcher })).rejects.toThrow('not accepted');
  fetcher.mockClear();
  await expect(submitContact(form(), { hostname: 'localhost', fetcher })).resolves.toEqual({ preview: true });
  expect(fetcher).not.toHaveBeenCalled();
});

test('the static deploy form declares the same fields needed by the React submission', () => {
  const html = readFileSync(resolve(__dirname, '../../public/index.html'), 'utf8');
  const document = new DOMParser().parseFromString(html, 'text/html');
  const declaration = document.querySelector('form[name="contact"][data-netlify="true"]');
  expect(declaration).not.toBeNull();
  expect(declaration.getAttribute('netlify-honeypot')).toBe('bot-field');
  expect([...declaration.querySelectorAll('[name]')].map(field => field.name).sort()).toEqual(['bot-field', 'email', 'message', 'name']);
});
