/**
 * Hook personnalisé pour gérer le localStorage avec React
 * Synchronise automatiquement avec le state
 */
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook pour gérer une valeur dans localStorage
 * @param {string} key - Clé du localStorage
 * @param {*} initialValue - Valeur initiale si la clé n'existe pas
 * @returns {[*, Function]} [value, setValue]
 */
export function useLocalStorage(key, initialValue) {
  // State pour stocker la valeur
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erreur lecture localStorage [${key}]:`, error);
      return initialValue;
    }
  });

  // Fonction pour mettre à jour la valeur
  const setValue = useCallback((value) => {
    try {
      // Accepter une fonction comme dans useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        
        // Dispatch un événement personnalisé pour synchroniser entre onglets
        window.dispatchEvent(new CustomEvent('localStorageChange', {
          detail: { key, value: valueToStore }
        }));
      }
    } catch (error) {
      console.error(`Erreur écriture localStorage [${key}]:`, error);
    }
  }, [key, storedValue]);

  // Synchroniser avec les changements d'autres onglets
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Erreur sync localStorage [${key}]:`, error);
        }
      }
    };

    const handleCustomStorageChange = (e) => {
      if (e.detail.key === key) {
        setStoredValue(e.detail.value);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageChange', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleCustomStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}

/**
 * Hook pour gérer plusieurs valeurs dans localStorage
 * @param {Object} initialValues - Objet avec les clés et valeurs initiales
 * @returns {[Object, Function]} [values, setValues]
 */
export function useLocalStorageMultiple(initialValues) {
  const [values, setValues] = useState(() => {
    const stored = {};
    Object.keys(initialValues).forEach(key => {
      try {
        const item = window.localStorage.getItem(key);
        stored[key] = item ? JSON.parse(item) : initialValues[key];
      } catch (error) {
        stored[key] = initialValues[key];
      }
    });
    return stored;
  });

  const setMultipleValues = useCallback((updates) => {
    setValues(prev => {
      const newValues = { ...prev, ...updates };
      
      // Sauvegarder dans localStorage
      Object.entries(updates).forEach(([key, value]) => {
        try {
          window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.error(`Erreur écriture localStorage [${key}]:`, error);
        }
      });

      return newValues;
    });
  }, []);

  return [values, setMultipleValues];
}

/**
 * Hook pour supprimer une clé du localStorage
 * @param {string} key - Clé à supprimer
 * @returns {Function} Fonction pour supprimer la clé
 */
export function useLocalStorageRemove() {
  return useCallback((key) => {
    try {
      window.localStorage.removeItem(key);
      window.dispatchEvent(new CustomEvent('localStorageChange', {
        detail: { key, value: null }
      }));
    } catch (error) {
      console.error(`Erreur suppression localStorage [${key}]:`, error);
    }
  }, []);
}

export default useLocalStorage;

