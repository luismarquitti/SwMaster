import { render, screen, fireEvent } from '@testing-library/react';
import ChatInput from '../ChatInput';
import { describe, it, expect, vi } from 'vitest';

describe('ChatInput', () => {
  it('calls onSend when Shift+Enter is pressed', () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} isStreaming={false} />);
    
    const textarea = screen.getByPlaceholderText(/Ask SwMaster/i);
    fireEvent.change(textarea, { target: { value: 'Test message' } });
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });
    
    expect(onSend).toHaveBeenCalledWith('Test message');
  });

  it('disables input when isStreaming is true', () => {
    render(<ChatInput onSend={() => {}} isStreaming={true} />);
    const textarea = screen.getByPlaceholderText(/Thinking/i);
    expect(textarea).toBeDisabled();
  });

  it('does not call onSend for empty input', () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} isStreaming={false} />);
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);
    expect(onSend).not.toHaveBeenCalled();
  });
});
