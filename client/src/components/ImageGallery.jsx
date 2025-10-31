import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaSearchPlus, FaTimes } from 'react-icons/fa';
import './ImageGallery.css';

function ImageGallery({ arbusteId, arbusteName }) {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // SYSTÈME OPTIMISÉ : Chargement depuis JSON (1 requête au lieu de 320)
    const loadImages = async () => {
      setLoading(true);
      try {
        // Charger l'inventaire JSON
        const response = await fetch('/images.json');
        const imagesInventory = await response.json();
        
        // Récupérer les images pour cette espèce
        const plantImages = imagesInventory[arbusteId] || [];
        
        // Mapper les types d'images avec leurs légendes
        const typeLegends = {
          'vue_generale': 'Vue générale',
          'bourgeons': 'Bourgeons au printemps',
          'fleurs': 'Floraison',
          'feuilles': 'Feuillage',
          'fruits': 'Fruits / Fructification',
          'tronc': 'Tronc / Écorce',
          'automne': 'Couleurs automnales',
          'hiver': 'Aspect hivernal'
        };
        
        // Transformer en format gallery
        const validImages = plantImages.map(filename => {
          // Extraire le type depuis le nom de fichier
          // Format: espece_type_numero.ext
          const match = filename.match(/_([a-z_]+)_(\d+)\./i);
          const type = match ? match[1] : 'vue_generale';
          const number = match ? parseInt(match[2]) : 1;
          
          return {
            src: `/images/${arbusteId}/${filename}`,
            legend: `${typeLegends[type] || type} ${number > 1 ? `(${number})` : ''}`,
            alt: `${arbusteName} - ${typeLegends[type] || type} ${number}`
          };
        });
        
        setImages(validImages);
        setCurrentIndex(0);
      } catch {
        // Erreur chargement images - images par défaut utilisées
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
              // En cas d'erreur, cacher l'image
              e.target.style.display = 'none';
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
          <button className="zoom-close" onClick={toggleZoom} aria-label="Fermer">
            <FaTimes />
          </button>
          
          <button 
            className="zoom-nav prev"
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            aria-label="Image précédente"
          >
            <FaChevronLeft />
          </button>
          
          <img 
            src={images[currentIndex].src} 
            alt={images[currentIndex].alt}
            className="zoomed-image"
            loading="eager"
            onClick={(e) => e.stopPropagation()}
          />
          
          <button 
            className="zoom-nav next"
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            aria-label="Image suivante"
          >
            <FaChevronRight />
          </button>
          
          <div className="zoom-legend" onClick={(e) => e.stopPropagation()}>
            {images[currentIndex].legend}
            <span className="zoom-counter">{currentIndex + 1} / {images.length}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageGallery;
