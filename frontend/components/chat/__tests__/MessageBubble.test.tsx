import { render, screen } from '@testing-library/react';
import MessageBubble, { Role } from '../MessageBubble';
import { describe, it, expect } from 'vitest';

describe('MessageBubble', () => {
  it('renders user message with correct style', () => {
    render(<MessageBubble role="user" content="Hello SwMaster" />);
    const bubble = screen.getByText('Hello SwMaster');
    expect(bubble).toBeInTheDocument();
    // Use .group as the selector for the message container
    expect(bubble.closest('.group')).toHaveClass('self-end');
  });

  it('renders agent message with verified icon', () => {
    // Note: useThread maps "assistant" to "agent" in our domain
    render(<MessageBubble role="agent" content="Hello Human" />);
    expect(screen.getByText('Hello Human')).toBeInTheDocument();
    // The icon has been updated to verified_user for SwMaster/SWEBOK compliance
    expect(screen.getByText('verified_user')).toBeInTheDocument();
  });

  it('renders markdown correctly', () => {
    render(<MessageBubble role="user" content="**bold text**" />);
    const boldElement = screen.getByText('bold text');
    expect(boldElement.tagName).toBe('STRONG');
  });
});
