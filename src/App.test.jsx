import { render, screen } from '@testing-library/react';
import App from './App';
import { test, expect } from 'vitest';

test('renders administrator login option', () => {
  render(<App />);
  const adminElement = screen.getByText(/Administrator/i);
  expect(adminElement).toBeInTheDocument();
});
