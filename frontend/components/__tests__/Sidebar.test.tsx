import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../Sidebar';
import { describe, it, expect, vi } from 'vitest';

describe('Sidebar', () => {
  it('renders logo and nav items', () => {
    render(<Sidebar />);
    expect(screen.getByText('SwMaster')).toBeInTheDocument();
    expect(screen.getByText('Agents')).toBeInTheDocument();
    expect(screen.getByText('Workflows')).toBeInTheDocument();
  });

  it('changes active state on click', () => {
    render(<Sidebar />);
    const workflowsBtn = screen.getByText('Workflows').closest('button');
    if (workflowsBtn) {
      fireEvent.click(workflowsBtn);
      expect(workflowsBtn).toHaveClass('bg-[var(--primary)]');
    } else {
      throw new Error('Workflows button not found');
    }
  });

  it('renders user profile section', () => {
    render(<Sidebar />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Solutions Architect')).toBeInTheDocument();
  });
});
