/**
 * Hook personnalisé pour charger les images d'une plante
 * Optimisé avec cache et gestion d'erreur
 */
import { useState, useEffect, useRef } from 'react';

// Cache global des images chargées
const imageCache = new Map();

/**
 * Charge les images pour une plante depuis le fichier JSON
 * @param {Object} plante - Données de la plante
 * @returns {Object} { images, loading, error }
 */
export function useImageLoader(plante) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (!plante?.id) {
      setImages([]);
      setLoading(false);
      return;
    }

    // Vérifier le cache
    if (imageCache.has(plante.id)) {
      setImages(imageCache.get(plante.id));
      setLoading(false);
      return;
    }

    // Annuler la requête précédente si elle existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    const loadImages = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/images.json', {
          signal: abortControllerRef.current.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const imagesInventory = await response.json();
        const plantImages = imagesInventory[plante.id] || [];

        const typeLegends = {
          'vue_generale': 'Vue générale',
          'bourgeons': 'Bourgeons',
          'fleurs': 'Fleurs',
          'feuilles': 'Feuilles',
          'fruits': 'Fruits',
          'tronc': 'Tronc/Écorce',
          'automne': 'Automne',
          'hiver': 'Hiver'
        };

        const validImages = plantImages.map(filename => {
          const match = filename.match(/_([a-z_]+)_(\d+)\./i);
          const type = match ? match[1] : 'vue_generale';
          const number = match ? parseInt(match[2]) : 1;

          return {
            src: `/images/${plante.id}/${filename}`,
            legend: `${typeLegends[type] || type} ${number > 1 ? `(${number})` : ''}`,
            alt: `${plante.name} - ${typeLegends[type] || type} ${number}`,
            type
          };
        });

        // Mettre en cache
        imageCache.set(plante.id, validImages);
        setImages(validImages);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Erreur chargement images:', err);
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadImages();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [plante?.id]);

  return { images, loading, error };
}

/**
 * Filtre les images par type
 * @param {Array} images - Tableau d'images
 * @param {string} type - Type à filtrer ('tous' pour tous)
 * @returns {Array} Images filtrées
 */
export function filterImagesByType(images, type) {
  if (!type || type === 'tous') {
    return images;
  }

  return images.filter(img => img.type === type);
}

/**
 * Précharge une liste d'images pour améliorer les performances
 * @param {Array} imageSrcs - URLs des images à précharger
 */
export function preloadImages(imageSrcs) {
  imageSrcs.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

export default useImageLoader;

