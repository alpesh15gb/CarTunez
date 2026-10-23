import { useMemo } from 'react';

// Keep a single accessible sentence; visual word wrappers are hidden from AT.
export function useSplitText(text: string, accent = false) {
  return useMemo(() => text.split(' ').map((word, i) => (
    <span className={`split-word ${accent ? 'accent-word' : ''}`} aria-hidden="true" key={`${word}-${i}`}>{word}{' '}</span>
  )), [text, accent]);
}
