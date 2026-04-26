import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * Floating "scroll to top" button that appears after scrolling
 * past 400px. Only visible when needed.
 */
export default function BackToTop({ threshold = 400 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={styles.btn}
      aria-label="Back to top"
      title="Back to top"
    >
      <ArrowUp size={18} strokeWidth={2.5} />
    </button>
  );
}

const styles = {
  btn: {
    position: 'fixed',
    right: 20,
    bottom: 20,
    width: 44,
    height: 44,
    borderRadius: '50%',
    background: '#141414',
    color: '#ece7da',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    transition: 'transform 0.15s ease, background 0.15s ease',
  },
};