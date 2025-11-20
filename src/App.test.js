import { render, screen } from '@testing-library/react';
import App from './App';

test('renders NewsMonkey navigation brand', () => {
  render(<App />);
  const brandLink = screen.getByRole('link', { name: /newsmonkey/i });
  expect(brandLink).toBeInTheDocument();
});
