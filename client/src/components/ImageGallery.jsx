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
        // Liste potentielle d'images
        const potentialImages = [
          { 
            src: `/images/${arbusteId}/${arbusteId}_vue_generale.jpg`, 
            legend: 'Vue générale',
            alt: `${arbusteName} - Vue générale`
          },
          { 
            src: `/images/${arbusteId}/${arbusteId}_bourgeons.jpg`, 
            legend: 'Bourgeons au printemps',
            alt: `${arbusteName} - Bourgeons`
          },
          { 
            src: `/images/${arbusteId}/${arbusteId}_fleurs.jpg`, 
            legend: 'Floraison',
            alt: `${arbusteName} - Fleurs`
          },
          { 
            src: `/images/${arbusteId}/${arbusteId}_fruits.jpg`, 
            legend: 'Fruits / Fructification',
            alt: `${arbusteName} - Fruits`
          },
          { 
            src: `/images/${arbusteId}/${arbusteId}_automne.jpg`, 
            legend: 'Couleurs automnales',
            alt: `${arbusteName} - Automne`
          },
          { 
            src: `/images/${arbusteId}/${arbusteId}_hiver.jpg`, 
            legend: 'Aspect hivernal',
            alt: `${arbusteName} - Hiver`
          }
        ];
        
        // Vérifier quelles images existent réellement
        const validImages = [];
        for (const img of potentialImages) {
          try {
            const response = await fetch(img.src, { method: 'HEAD' });
            if (response.ok) {
              validImages.push(img);
            }
          } catch (err) {
            // Image n'existe pas, on l'ignore
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

