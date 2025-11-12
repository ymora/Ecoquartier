/**
 * FULLSCREEN GALLERY - Composant réutilisable pour affichage plein écran
 * ✅ Unifié entre PlantDetailWithImages et ComparisonTable
 * ✅ Pas de duplication de code
 */
import './FullscreenGallery.css';

/**
 * Galerie d'images en plein écran avec navigation
 * @param {Object} props
 * @param {boolean} props.isOpen - Si la galerie est ouverte
 * @param {Function} props.onClose - Callback pour fermer
 * @param {string} props.currentImage - Chemin de l'image actuelle
 * @param {number} props.currentIndex - Index de l'image actuelle (0-based)
 * @param {number} props.totalImages - Nombre total d'images
 * @param {Function} props.onPrevious - Callback pour image précédente
 * @param {Function} props.onNext - Callback pour image suivante
 * @param {string} props.altText - Texte alternatif pour l'image
 */
export default function FullscreenGallery({ 
  isOpen,
  onClose,
  currentImage,
  currentIndex,
  totalImages,
  onPrevious,
  onNext,
  altText = 'Image'
}) {
  if (!isOpen) return null;
  
  const hasMultipleImages = totalImages > 1;
  
  return (
    <div className="fullscreen-modal" onClick={onClose}>
      <button className="fullscreen-close" onClick={onClose}>✕</button>
      <img
        src={currentImage}
        alt={altText}
        onClick={(e) => e.stopPropagation()}
      />
      
      {/* ✅ Navigation si plusieurs images */}
      {hasMultipleImages && (
        <div className="fullscreen-nav">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onPrevious();
            }}
          >
            ◀ Précédent
          </button>
          <span>{currentIndex + 1} / {totalImages}</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
          >
            Suivant ▶
          </button>
        </div>
      )}
    </div>
  );
}

