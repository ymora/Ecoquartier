import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaSearchPlus, FaTimes } from 'react-icons/fa';
import './ImageGallery.css';

function ImageGallery({ arbusteId, arbusteName }) {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger les images depuis le dossier images
    const loadImages = async () => {
      setLoading(true);
      try {
        // Types d'images avec leurs légendes
        const imageTypes = [
          { type: 'vue_generale', legend: 'Vue générale', extensions: ['.jpg', '.jpeg', '.png', '.webp'] },
          { type: 'bourgeons', legend: 'Bourgeons au printemps', extensions: ['.jpg', '.jpeg', '.png', '.webp'] },
          { type: 'fleurs', legend: 'Floraison', extensions: ['.jpg', '.jpeg', '.png', '.webp'] },
          { type: 'feuilles', legend: 'Feuillage', extensions: ['.jpg', '.jpeg', '.png', '.webp'] },
          { type: 'fruits', legend: 'Fruits / Fructification', extensions: ['.jpg', '.jpeg', '.png', '.webp'] },
          { type: 'tronc', legend: 'Tronc / Écorce', extensions: ['.jpg', '.jpeg', '.png', '.webp'] },
          { type: 'automne', legend: 'Couleurs automnales', extensions: ['.jpg', '.jpeg', '.png', '.webp'] },
          { type: 'hiver', legend: 'Aspect hivernal', extensions: ['.jpg', '.jpeg', '.png', '.webp'] }
        ];
        
        const validImages = [];
        
        // Pour chaque type, chercher toutes les images numérotées (_01, _02, etc.)
        for (const imageType of imageTypes) {
          let imageNumber = 1;
          let consecutiveNotFound = 0;
          
          // Chercher jusqu'à 10 images par type (limite raisonnable)
          while (imageNumber <= 10 && consecutiveNotFound < 2) {
            const paddedNumber = String(imageNumber).padStart(2, '0');
            let foundWithExtension = false;
            
            // Essayer toutes les extensions possibles
            for (const ext of imageType.extensions) {
              const imagePath = `/images/${arbusteId}/${arbusteId}_${imageType.type}_${paddedNumber}${ext}`;
              
              try {
                const response = await fetch(imagePath, { method: 'HEAD' });
                // Vérifier que c'est vraiment une image (pas un HTML 404)
                const contentType = response.headers.get('content-type');
                if (response.ok && contentType && contentType.startsWith('image/')) {
                  validImages.push({
                    src: imagePath,
                    legend: `${imageType.legend} ${imageNumber > 1 ? `(${imageNumber})` : ''}`,
                    alt: `${arbusteName} - ${imageType.legend} ${imageNumber}`
                  });
                  foundWithExtension = true;
                  consecutiveNotFound = 0; // Reset le compteur
                  break; // On a trouvé avec cette extension, passer au numéro suivant
                }
              } catch (err) {
                // Image n'existe pas avec cette extension, essayer la suivante
              }
            }
            
            // Si aucune extension n'a fonctionné pour ce numéro
            if (!foundWithExtension) {
              consecutiveNotFound++;
              // Si 2 numéros consécutifs manquent, arrêter pour ce type
              if (consecutiveNotFound >= 2) {
                break;
              }
            }
            
            imageNumber++;
          }
        }
        
        setImages(validImages);
        setCurrentIndex(0);
      } catch (error) {
        console.error('Erreur lors du chargement des images:', error);
        setImages([]);
      }
      setLoading(false);
    };

    loadImages();
  }, [arbusteId, arbusteName]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  // Navigation au clavier
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'Escape' && isZoomed) setIsZoomed(false);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [images.length, isZoomed]);

  if (loading) {
    return <div className="image-gallery loading">Chargement des images...</div>;
  }

  if (!loading && images.length === 0) {
    return (
      <div className="image-gallery no-images">
        <p>📷 Images à venir prochainement</p>
        <p className="info-text">Les photos de cette plante seront ajoutées ultérieurement</p>
      </div>
    );
  }

  return (
    <div className="image-gallery">
      <div className="gallery-main">
        <button 
          className="gallery-nav prev" 
          onClick={prevImage}
          aria-label="Image précédente"
        >
          <FaChevronLeft />
        </button>

        <div className="gallery-image-container">
          <img 
            src={images[currentIndex].src} 
            alt={images[currentIndex].alt}
            className="gallery-image"
            loading="lazy"
            onError={(e) => {
              // Éviter la boucle infinie
              if (e.target.src !== '/images/placeholder.jpg') {
                e.target.onerror = null; // Désactiver la gestion d'erreur
                e.target.src = '/images/placeholder.jpg';
                e.target.alt = 'Image non disponible';
              }
            }}
          />
          <button 
            className="zoom-button"
            onClick={toggleZoom}
            aria-label="Zoomer sur l'image"
          >
            <FaSearchPlus />
          </button>
          <div className="image-legend">
            {images[currentIndex].legend}
          </div>
        </div>

        <button 
          className="gallery-nav next" 
          onClick={nextImage}
          aria-label="Image suivante"
        >
          <FaChevronRight />
        </button>
      </div>

      <div className="gallery-indicators">
        <span className="indicator-text">
          {currentIndex + 1} / {images.length}
        </span>
        <div className="indicator-dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={`indicator-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Aller à l'image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Modal de zoom */}
      {isZoomed && (
        <div className="zoom-modal" onClick={toggleZoom}>
          <button className="zoom-close" aria-label="Fermer">
            <FaTimes />
          </button>
          <img 
            src={images[currentIndex].src} 
            alt={images[currentIndex].alt}
            className="zoomed-image"
            loading="eager"
          />
        </div>
      )}
    </div>
  );
}

export default ImageGallery;

