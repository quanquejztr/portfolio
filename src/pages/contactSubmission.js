export async function submitContact(form, { hostname = window.location.hostname, fetcher = window.fetch } = {}) {
  if (['localhost', '127.0.0.1', '[::1]'].includes(hostname)) return { preview: true };
  const response = await fetcher('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(new FormData(form)).toString(),
  });
  if (!response.ok) throw new Error('Contact submission was not accepted.');
  return { preview: false };
}
