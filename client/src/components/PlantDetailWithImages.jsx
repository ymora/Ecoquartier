/**
 * PLANT DETAIL WITH IMAGES - Fiche avec galerie d'images
 */
import { useState } from 'react';
import './PlantDetailWithImages.css';

export default function PlantDetailWithImages({ plant }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  
  // Récupérer toutes les images de la plante
  const images = plant.images || [];
  const hasImages = images.length > 0;

  return (
    <div className="plant-detail-clean">
      {/* Galerie d'images - Toujours afficher pour garder l'alignement */}
      <div className="image-gallery">
        {hasImages ? (
          <>
            <div className="main-image" onClick={() => setFullscreenOpen(true)} title="Cliquer pour agrandir">
              <img 
                src={`/images/${images[currentImageIndex]}`} 
                alt={`${plant.name} - ${currentImageIndex + 1}`}
                onError={(e) => {
                  e.target.src = '/images/placeholder.jpg';
                }}
              />
              <div className="fullscreen-hint">🔍 Cliquer pour agrandir</div>
              
              {/* Navigation overlay */}
              {images.length > 1 && (
                <>
                  <button 
                    className="gallery-nav gallery-nav-prev"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length);
                    }}
                    title="Photo précédente"
                  >
                    ◀
                  </button>
                  
                  <button 
                    className="gallery-nav gallery-nav-next"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex((currentImageIndex + 1) % images.length);
                    }}
                    title="Photo suivante"
                  >
                    ▶
                  </button>
                  
                  <div className="gallery-counter">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="thumbnail-strip">
                {images.map((img, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img 
                      src={`/images/${img}`} 
                      alt={`${plant.name} miniature ${index + 1}`}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Placeholder pour plantes sans photos */
          <>
            <div className="main-image no-image">
              <div className="no-image-content">
                <div className="no-image-icon">📷</div>
                <p>Photos à venir</p>
              </div>
            </div>
            {/* Placeholder pour la frise de miniatures pour garder l'alignement */}
            <div className="thumbnail-strip thumbnail-strip-placeholder">
              <div className="thumbnail-placeholder"></div>
            </div>
          </>
        )}
      </div>

      <div className="plant-header">
        <h2>{plant.name}</h2>
        <p className="scientific">{plant.nomScientifique}</p>
        <div className="plant-meta">
          <span className="badge">{plant.type === 'arbre' ? '🌳 Arbre' : '🌿 Arbuste'}</span>
          <span className="badge">{plant.famille}</span>
        </div>
      </div>

      <div className="info-card">
        <h3>🌸 Floraison</h3>
        <p><strong>Période :</strong> {plant.floraison?.periode}</p>
        <p><strong>Couleur :</strong> {plant.floraison?.couleur}</p>
        <p>{plant.floraison?.description}</p>
      </div>

      <div className="info-card">
        <h3>🍂 Feuillage</h3>
        <p><strong>Type :</strong> {plant.feuillage?.type}</p>
        <p><strong>Couleur automne :</strong> {plant.feuillage?.couleurAutomne}</p>
      </div>

      <div className="info-card">
        <h3>📏 Dimensions</h3>
        <p><strong>Hauteur :</strong> {plant.tailleMaturite}</p>
        <p><strong>Envergure :</strong> {plant.envergure}</p>
        <p><strong>Croissance :</strong> {plant.croissance}</p>
      </div>

      <div className="info-card">
        <h3>🌍 Sol</h3>
        <p><strong>Type :</strong> {plant.sol?.type}</p>
        <p><strong>pH :</strong> {plant.sol?.ph}</p>
        <p><strong>Humidité :</strong> {plant.sol?.humidite}</p>
      </div>

      <div className="info-card">
        <h3>☀️ Exposition</h3>
        <p>{plant.exposition}</p>
      </div>

      <div className="info-card">
        <h3>✂️ Taille</h3>
        <p><strong>Période :</strong> {plant.taille?.periode}</p>
        <p><strong>Fréquence :</strong> {plant.taille?.frequence}</p>
        <p>{plant.taille?.methode}</p>
      </div>

      <div className="info-card">
        <h3>💧 Arrosage</h3>
        <p>{plant.arrosage}</p>
      </div>

      <div className="info-card">
        <h3>🌡️ Rusticité</h3>
        <p>{plant.rusticite}</p>
      </div>

      {plant.reglementation && (
        <div className="info-card warning">
          <h3>📏 Réglementation</h3>
          <p><strong>Distance voisinage :</strong> {plant.reglementation.distancesLegales?.voisinage?.distance}</p>
          {plant.reglementation.risques && (
            <>
              <p><strong>Risques :</strong></p>
              <ul>
                {plant.reglementation.risques.slice(0, 3).map((risque, i) => (
                  <li key={i}>{risque}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {plant.toxicite && (
        <div className="info-card danger">
          <h3>☠️ Toxicité</h3>
          <p><strong>{plant.toxicite.niveau}</strong></p>
          <p>{plant.toxicite.danger}</p>
        </div>
      )}

      {/* Modal Plein Écran */}
      {fullscreenOpen && (
        <div className="fullscreen-modal" onClick={() => setFullscreenOpen(false)}>
          <button className="fullscreen-close" onClick={() => setFullscreenOpen(false)}>✕</button>
          <img 
            src={`/images/${images[currentImageIndex]}`} 
            alt={`${plant.name} - ${currentImageIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="fullscreen-nav">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length);
              }}
              disabled={images.length <= 1}
            >
              ◀ Précédent
            </button>
            <span>{currentImageIndex + 1} / {images.length}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex((currentImageIndex + 1) % images.length);
              }}
              disabled={images.length <= 1}
            >
              Suivant ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

