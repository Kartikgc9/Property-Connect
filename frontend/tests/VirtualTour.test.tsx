import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VirtualTour from '../src/components/property/VirtualTour';

// Mock window.open
const mockOpen = vi.fn();
Object.defineProperty(window, 'open', {
  writable: true,
  value: mockOpen,
});

describe('VirtualTour Component', () => {
  beforeEach(() => {
    mockOpen.mockClear();
  });

  it('renders no tour message when tourUrl is empty', () => {
    render(<VirtualTour tourUrl="" />);
    
    expect(screen.getByText('No virtual tour available for this property')).toBeInTheDocument();
  });

  it('renders virtual tour iframe with provided URL', () => {
    const tourUrl = 'https://example.com/tour';
    render(<VirtualTour tourUrl={tourUrl} />);
    
    const iframe = screen.getByTitle('Virtual Tour');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', tourUrl);
  });

  it('renders custom title when provided', () => {
    const customTitle = 'Custom Property Tour';
    render(<VirtualTour tourUrl="https://example.com/tour" title={customTitle} />);
    
    expect(screen.getByText(customTitle)).toBeInTheDocument();
    const iframe = screen.getByTitle(customTitle);
    expect(iframe).toBeInTheDocument();
  });

  it('sets custom height when provided', () => {
    render(<VirtualTour tourUrl="https://example.com/tour" height={400} />);
    
    const container = screen.getByTitle('Virtual Tour').parentElement;
    expect(container).toHaveStyle({ height: '400px' });
  });

  it('shows loading state initially', () => {
    render(<VirtualTour tourUrl="https://example.com/tour" />);
    
    expect(screen.getByText('Loading virtual tour...')).toBeInTheDocument();
  });

  it('opens tour in new tab when button is clicked', () => {
    const tourUrl = 'https://example.com/tour';
    render(<VirtualTour tourUrl={tourUrl} />);
    
    const openButton = screen.getByRole('button', { name: /open in new tab/i });
    fireEvent.click(openButton);
    
    expect(mockOpen).toHaveBeenCalledWith(tourUrl, '_blank', 'noopener,noreferrer');
  });

  it('hides loading state when iframe loads', async () => {
    render(<VirtualTour tourUrl="https://example.com/tour" />);
    
    const iframe = screen.getByTitle('Virtual Tour');
    fireEvent.load(iframe);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading virtual tour...')).not.toBeInTheDocument();
    });
  });

  it('shows error state when iframe fails to load', async () => {
    render(<VirtualTour tourUrl="https://example.com/tour" />);
    
    const iframe = screen.getByTitle('Virtual Tour');
    fireEvent.error(iframe);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load virtual tour')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });

  it('retries loading when retry button is clicked', async () => {
    render(<VirtualTour tourUrl="https://example.com/tour" />);
    
    const iframe = screen.getByTitle('Virtual Tour');
    fireEvent.error(iframe);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load virtual tour')).toBeInTheDocument();
    });
    
    const retryButton = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryButton);
    
    await waitFor(() => {
      expect(screen.getByText('Loading virtual tour...')).toBeInTheDocument();
      expect(screen.queryByText('Failed to load virtual tour')).not.toBeInTheDocument();
    });
  });

  it('shows navigation instructions', () => {
    render(<VirtualTour tourUrl="https://example.com/tour" />);
    
    expect(screen.getByText(/Use mouse to navigate/)).toBeInTheDocument();
  });
});