import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactMe from './contactMe';
import { submitContact } from './contactSubmission';

jest.mock('./contactSubmission', () => ({ submitContact: jest.fn() }));
beforeEach(() => submitContact.mockReset());
function fillForm() {
  fireEvent.change(screen.getByLabelText('Your name'), { target: { value: 'Alex & Sam' } });
  fireEvent.change(screen.getByLabelText('Your email'), { target: { value: 'alex@example.com' } });
  fireEvent.change(screen.getByLabelText('Your message'), { target: { value: 'Hello Cuong' } });
  return screen.getByRole('form', { name: 'Send Cuong a message' });
}

test('direct submission disables repeated sends and clears fields only after acceptance', async () => {
  let finish;
  submitContact.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  render(<ContactMe />);
  const form = fillForm();
  fireEvent.submit(form);
  expect(screen.getByRole('button', { name: 'Sending…' })).toBeDisabled();
  fireEvent.submit(form);
  expect(submitContact).toHaveBeenCalledTimes(1);
  expect(screen.getByLabelText('Your message')).toHaveValue('Hello Cuong');
  await act(async () => finish({ preview: false }));
  expect(screen.getByRole('status')).toHaveTextContent('your message has been submitted');
  expect(screen.getByLabelText('Your message')).toHaveValue('');
  expect(screen.getByRole('button', { name: 'send to Cuong' })).toBeEnabled();
});

test('failed submissions keep the message and offer a retry', async () => {
  submitContact.mockRejectedValue(new Error('Unavailable'));
  render(<ContactMe />);
  fireEvent.submit(fillForm());
  await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('couldn’t be sent'));
  expect(screen.getByLabelText('Your message')).toHaveValue('Hello Cuong');
  expect(screen.getByRole('button', { name: 'send to Cuong' })).toBeEnabled();
  expect(screen.getByRole('link', { name: /Email Cuong/ })).toHaveAttribute('href', 'mailto:stephenluong24@gmail.com');
});

test('local previews never claim the message was submitted', async () => {
  submitContact.mockResolvedValue({ preview: true });
  render(<ContactMe />);
  fireEvent.submit(fillForm());
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('use the published site'));
  expect(screen.getByRole('status')).not.toHaveTextContent('has been submitted');
  expect(screen.getByLabelText('Your message')).toHaveValue('Hello Cuong');
});
