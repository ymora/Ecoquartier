/**
 * Hook personnalisé pour gérer les media queries
 */
import { useState, useEffect } from 'react';

/**
 * Hook pour détecter si une media query correspond
 * @param {string} query - Media query CSS (ex: '(max-width: 768px)')
 * @returns {boolean} true si la media query correspond
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = (e) => {
      setMatches(e.matches);
    };

    // Utiliser addEventListener si disponible, sinon fallback sur addListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [query]);

  return matches;
}

/**
 * Hook pour détecter les breakpoints communs
 * @returns {Object} Objet avec les breakpoints (isMobile, isTablet, isDesktop, etc.)
 */
export function useBreakpoint() {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  const isLargeDesktop = useMediaQuery('(min-width: 1440px)');
  
  const isSmall = useMediaQuery('(max-width: 640px)');
  const isMedium = useMediaQuery('(min-width: 641px) and (max-width: 768px)');
  const isLarge = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isXLarge = useMediaQuery('(min-width: 1025px)');

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isSmall,
    isMedium,
    isLarge,
    isXLarge,
    // Helper
    isTouchDevice: isMobile || isTablet
  };
}

/**
 * Hook pour détecter l'orientation de l'appareil
 * @returns {string} 'portrait' ou 'landscape'
 */
export function useOrientation() {
  const isPortrait = useMediaQuery('(orientation: portrait)');
  return isPortrait ? 'portrait' : 'landscape';
}

/**
 * Hook pour détecter le mode sombre
 * @returns {boolean} true si le mode sombre est préféré
 */
export function usePrefersDarkMode() {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

/**
 * Hook pour détecter la réduction de mouvement
 * @returns {boolean} true si l'utilisateur préfère moins d'animations
 */
export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

export default useMediaQuery;

