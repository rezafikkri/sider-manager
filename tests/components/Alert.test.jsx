// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers'
import { afterEach, describe, expect, it, vi } from 'vitest';
import Alert from '../../src/renderer/src/components/Alert';
import userEvent from '@testing-library/user-event';

expect.extend(matchers);

describe('Alert component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should message present in document', () => {
    render(<Alert message={() => "This is message"} onClose={() => {}} />);
    const alertMessageDiv = screen.getByText('This is message');

    expect(alertMessageDiv).toBeInTheDocument();
  });

  it('should call onClose function when close button clicked', async () => {
    const mockOnClose = vi.fn();
    render(<Alert message={() => "This is message"} onClose={mockOnClose} />);

    const closeButton = screen.getByRole('button');
    await userEvent.click(closeButton);

    expect(mockOnClose).toBeCalled();
  });

  it('should show danger alert when alert type not inserted', () => {
    render(<Alert message={() => "This is message"} onClose={() => {}} />);
    const alertMessageDiv = screen.getByText('This is message');
    const closeButton = alertMessageDiv.nextElementSibling;
    const alertDiv = alertMessageDiv.parentElement;

    expect(closeButton).toHaveClass('text-red-400', 'focus:ring-red-400');
    expect(alertDiv).toHaveClass('text-red-400');
  });

  it('should show success alert when alert type is success', () => {
    render(<Alert message={() => "This is message"} onClose={() => {}} type="success" />);
    const alertMessageDiv = screen.getByText('This is message');
    const closeButton = alertMessageDiv.nextElementSibling;
    const alertDiv = alertMessageDiv.parentElement;

    expect(closeButton).toHaveClass('text-green-400', 'focus:ring-green-400');
    expect(alertDiv).toHaveClass('text-green-400');
  });

  it('should show warning alert when alert type is warning', () => {
    render(<Alert message={() => "This is warning"} onClose={() => {}} type="warning" />);
    const alertMessageDiv = screen.getByText('This is warning');
    const closeButton = alertMessageDiv.nextElementSibling;
    const alertDiv = alertMessageDiv.parentElement;

    expect(closeButton).toHaveClass('text-yellow-300', 'focus:ring-yellow-400');
    expect(alertDiv).toHaveClass('text-yellow-300');
  });
});
