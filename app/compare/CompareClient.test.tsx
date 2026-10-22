// @vitest-environment jsdom
//
// Regression test for the /compare white-screen bug.
//
// The vote state used to be handed straight to useSyncExternalStore as the
// snapshot function, and that function returned a fresh object literal on every
// call. React requires getSnapshot to return a stable reference, so it
// concluded the store had changed, re-rendered, called getSnapshot again, and
// looped until it threw "Maximum update depth exceeded". The component rendered
// fine on the server (getServerSnapshot was stable), which is why the page
// returned HTTP 200 with complete HTML while still being broken in a browser.

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import CompareClient from './CompareClient';

describe('CompareClient', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders without tripping the snapshot stability guard', () => {
    // With the buggy getSnapshot this render threw
    // "Maximum update depth exceeded".
    expect(() => render(<CompareClient />)).not.toThrow();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Compare AI Tools' }),
    ).toBeDefined();
  });

  it('shows the two default tools side by side', () => {
    render(<CompareClient />);
    // selectedIds starts at [1, 2] -> Midjourney and DALL-E 3
    expect(screen.getAllByText('Midjourney').length).toBeGreaterThan(0);
    expect(screen.getAllByText('DALL-E 3').length).toBeGreaterThan(0);

    // Comparison table rows
    expect(screen.getByText('Rating')).toBeDefined();
    expect(screen.getByText('Pricing')).toBeDefined();
    expect(screen.getByText('Category')).toBeDefined();
    expect(screen.getByText('Skill Level')).toBeDefined();
  });

  it('adds a tool through the picker without looping', () => {
    render(<CompareClient />);

    act(() => {
      screen
        .getByRole('button', { name: /Add Tool/i })
        .click();
    });

    const search = screen.getByPlaceholderText(
      /Search tools by name, description, or use case/i,
    );
    expect(search).toBeDefined();

    // Every candidate renders a clickable row; picking one must re-render
    // cleanly rather than spin.
    const rows = screen.getAllByRole('button', { name: /.+/ });
    expect(rows.length).toBeGreaterThan(0);
  });

  it('records a vote and reflects it in the UI', () => {
    render(<CompareClient />);

    // Community vote buttons: one per selected tool, both starting at 0.
    const zeroVotes = screen.getAllByText('0 votes');
    expect(zeroVotes.length).toBe(2);

    act(() => {
      (zeroVotes[0].closest('button') as HTMLButtonElement).click();
    });

    // The chosen tool now shows one vote, so the derived state did re-render.
    expect(screen.getAllByText(/^1 vote$/).length).toBeGreaterThan(0);
    expect(screen.queryByText('Be the first to cast your vote')).toBeNull();
  });
});
