import { useState, useEffect } from 'react';

/**
 * Hook pour détecter si l'écran est de type mobile/tablette.
 * Utilise MatchMedia pour une détection plus robuste et performante que window.innerWidth.
 */
export const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
    
    // Initial check
    setIsMobile(mediaQuery.matches);

    // Listener for changes
    const handler = (e) => setIsMobile(e.matches);
    
    // Support for older browsers
    if (mediaQuery.addListener) {
      mediaQuery.addListener(handler);
    } else {
      mediaQuery.addEventListener('change', handler);
    }

    return () => {
      if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handler);
      } else {
        mediaQuery.removeEventListener('change', handler);
      }
    };
  }, [breakpoint]);

  return isMobile;
};
