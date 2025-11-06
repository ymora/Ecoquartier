/**
 * Composant Toggle pour basculer entre thème clair et sombre
 */
import { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import useLocalStorage from '../hooks/useLocalStorage';

function ThemeToggle() {
  const [isDark, setIsDark] = useLocalStorage('darkTheme', false);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <button
      className="theme-toggle-btn"
      onClick={toggleTheme}
      title={isDark ? 'Mode clair' : 'Mode sombre'}
      aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
    >
      {isDark ? <FaSun /> : <FaMoon />}
    </button>
  );
}

export default ThemeToggle;


