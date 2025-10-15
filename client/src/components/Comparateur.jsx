import { useState, useEffect } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaEye, FaEyeSlash } from 'react-icons/fa';
import { reglementationData } from '../data/reglementationData';
import { informationsComplementaires } from '../data/informationsComplementaires';
import FiabiliteBadge from './FiabiliteBadge';
import './Comparateur.css';

function Comparateur({ plantes }) {
  const [selectedPlantes, setSelectedPlantes] = useState([]);
  const [imageIndices, setImageIndices] = useState({});
  const [visibleCriteres, setVisibleCriteres] = useState({});

  const togglePlante = (plante) => {
    if (selectedPlantes.find(p => p.id === plante.id)) {
      // Retirer si déjà sélectionné
      setSelectedPlantes(selectedPlantes.filter(p => p.id !== plante.id));
    } else {
      // Ajouter si moins de 3
      if (selectedPlantes.length < 3) {
        setSelectedPlantes([...selectedPlantes, plante]);
        setImageIndices({ ...imageIndices, [plante.id]: 0 });
      }
    }
  };

  const changeImage = (planteId, direction) => {
    const plante = selectedPlantes.find(p => p.id === planteId);
    if (!plante) return;

    const images = getPlantImages(plante);
    const currentIndex = imageIndices[planteId] || 0;
    const newIndex = (currentIndex + direction + images.length) % images.length;
    setImageIndices({ ...imageIndices, [planteId]: newIndex });
  };

  // Charger les images disponibles pour une plante (logique unifiée avec ImageGallery)
  const [plantImages, setPlantImages] = useState({});

  useEffect(() => {
    const loadImagesForPlants = async () => {
      for (const plante of selectedPlantes) {
        // Charger seulement si pas déjà chargé
        if (!plantImages[plante.id]) {
          const images = await loadPlantImages(plante);
          setPlantImages(prev => ({
            ...prev,
            [plante.id]: images
          }));
        }
      }
    };
    
    if (selectedPlantes.length > 0) {
      loadImagesForPlants();
    }
  }, [selectedPlantes.map(p => p.id).join(',')]);

  const loadPlantImages = async (plante) => {
    const imageTypes = [
      { type: 'vue_generale', legend: 'Vue générale', extensions: ['.jpg', '.jpeg', '.png', '.webp'] },
      { type: 'bourgeons', legend: 'Bourgeons', extensions: ['.jpg', '.jpeg', '.png', '.webp'] },
      { type: 'fleurs', legend: 'Fleurs', extensions: ['.jpg', '.jpeg', '.png', '.webp'] },
      { type: 'feuilles', legend: 'Feuilles', extensions: ['.jpg', '.jpeg', '.png', '.webp'] },
      { type: 'fruits', legend: 'Fruits', extensions: ['.jpg', '.jpeg', '.png', '.webp'] },
      { type: 'tronc', legend: 'Tronc/Écorce', extensions: ['.jpg', '.jpeg', '.png', '.webp'] },
      { type: 'automne', legend: 'Automne', extensions: ['.jpg', '.jpeg', '.png', '.webp'] },
      { type: 'hiver', legend: 'Hiver', extensions: ['.jpg', '.jpeg', '.png', '.webp'] }
    ];
    
    const validImages = [];
    
    // Pour chaque type, chercher TOUTES les images numérotées (_01, _02, _03...)
    for (const imageType of imageTypes) {
      let imageNumber = 1;
      let consecutiveNotFound = 0;
      
      // Chercher jusqu'à 10 images par type
      while (imageNumber <= 10 && consecutiveNotFound < 2) {
        const paddedNumber = String(imageNumber).padStart(2, '0');
        let foundWithExtension = false;
        
        // Essayer toutes les extensions possibles
        for (const ext of imageType.extensions) {
          const imagePath = `/images/${plante.id}/${plante.id}_${imageType.type}_${paddedNumber}${ext}`;
          
          try {
            const response = await fetch(imagePath, { method: 'HEAD' });
            const contentType = response.headers.get('content-type');
            if (response.ok && contentType && contentType.startsWith('image/')) {
              validImages.push({
                src: imagePath,
                legend: `${imageType.legend} ${imageNumber > 1 ? `(${imageNumber})` : ''}`,
                alt: `${plante.name} - ${imageType.legend} ${imageNumber}`
              });
              foundWithExtension = true;
              consecutiveNotFound = 0;
              break; // Image trouvée avec cette extension
            }
          } catch (err) {
            // Image n'existe pas avec cette extension, essayer la suivante
          }
        }
        
        // Si aucune extension n'a fonctionné pour ce numéro
        if (!foundWithExtension) {
          consecutiveNotFound++;
          if (consecutiveNotFound >= 2) {
            break; // Arrêter pour ce type
          }
        }
        
        imageNumber++;
      }
    }
    
    return validImages.length > 0 ? validImages : [{ 
      src: '/images/placeholder.jpg', 
      legend: 'Aucune image', 
      alt: 'Aucune image disponible' 
    }];
  };

  const getPlantImages = (plante) => {
    return plantImages[plante.id] || [];
  };

  const criteres = [
    { id: 'taille', key: 'tailleMaturite', label: 'Taille à maturité', icon: '📏', fiabilite: 'moyenne', defaultVisible: true },
    { id: 'floraison', key: 'floraison.periode', label: 'Floraison', icon: '🌸', fiabilite: 'moyenne', defaultVisible: true },
    { id: 'couleurFleurs', key: 'floraison.couleur', label: 'Couleur fleurs', icon: '🎨', fiabilite: 'haute', defaultVisible: true },
    { id: 'parfum', key: 'floraison.parfum', label: 'Parfum', icon: '👃', fiabilite: 'haute', defaultVisible: false },
    { id: 'fruits', key: 'fructification.periode', label: 'Fruits', icon: '🍇', fiabilite: 'moyenne', defaultVisible: false },
    { id: 'feuillage', key: 'feuillage.type', label: 'Feuillage', icon: '🍃', fiabilite: 'haute', defaultVisible: true },
    { id: 'automne', key: 'feuillage.couleurAutomne', label: 'Couleur automne', icon: '🍂', fiabilite: 'moyenne', defaultVisible: true },
    { id: 'exposition', key: 'exposition', label: 'Exposition', icon: '☀️', fiabilite: 'haute', defaultVisible: true },
    { id: 'rusticite', key: 'rusticite', label: 'Rusticité', icon: '❄️', fiabilite: 'moyenne', defaultVisible: false },
    { id: 'solType', key: 'sol.type', label: 'Type de sol', icon: '🌍', fiabilite: 'haute', defaultVisible: false },
    { id: 'solPh', key: 'sol.ph', label: 'pH du sol', icon: '🧪', fiabilite: 'haute', defaultVisible: false },
    { id: 'croissance', key: 'croissance', label: 'Croissance', icon: '📈', fiabilite: 'moyenne', defaultVisible: false },
    { id: 'arrosage', key: 'arrosage', label: 'Arrosage', icon: '💧', fiabilite: 'haute', defaultVisible: false },
    { id: 'taillePeriode', key: 'taille.periode', label: 'Période de taille', icon: '✂️', fiabilite: 'haute', defaultVisible: true },
    { id: 'tailleFreq', key: 'taille.frequence', label: 'Fréquence taille', icon: '🔄', fiabilite: 'haute', defaultVisible: false }
  ];
  
  const sectionsSpeciales = [
    { id: 'images', label: 'Photos', icon: '📷', defaultVisible: true },
    { id: 'toxicite', label: 'Toxicité', icon: '⚠️', defaultVisible: true },
    { id: 'biodiversite', label: 'Biodiversité', icon: '🦋', defaultVisible: false },
    { id: 'utilisations', label: 'Utilisations', icon: '💡', defaultVisible: false },
    { id: 'pollinisation', label: 'Pollinisation', icon: '🐝', defaultVisible: false },
    { id: 'allergies', label: 'Allergies', icon: '🤧', defaultVisible: true },
    { id: 'animaux', label: 'Animaux', icon: '🐾', defaultVisible: true },
    { id: 'racines', label: 'Racines', icon: '🌱', defaultVisible: true },
    { id: 'distanceVoisin', label: 'Distance Voisinage', icon: '⚖️', defaultVisible: true },
    { id: 'interdiction', label: 'Interdiction Taille', icon: '🔴', defaultVisible: true },
    { id: 'dangersTaille', label: 'Dangers Taille', icon: '⚠️', defaultVisible: false },
    { id: 'fondations', label: 'Distance Fondations', icon: '🏗️', defaultVisible: false },
    { id: 'canalisations', label: 'Distance Canalisations', icon: '🚰', defaultVisible: false }
  ];

  // Initialiser la visibilité par défaut
  useEffect(() => {
    const initial = {};
    criteres.forEach(c => initial[c.id] = c.defaultVisible);
    sectionsSpeciales.forEach(s => initial[s.id] = s.defaultVisible);
    setVisibleCriteres(initial);
  }, []);

  const toggleCritere = (id) => {
    setVisibleCriteres(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleAll = (visible) => {
    const newState = {};
    criteres.forEach(c => newState[c.id] = visible);
    sectionsSpeciales.forEach(s => newState[s.id] = visible);
    setVisibleCriteres(newState);
  };

  const getValue = (plante, key) => {
    const keys = key.split('.');
    let value = plante;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || 'N/A';
  };

  return (
    <div className="comparateur">
      <div className="comparateur-header">
        <h1>🔍 Mode Comparaison</h1>
        <div className="visibility-controls">
          <button onClick={() => toggleAll(true)} className="btn-show-all">
            <FaEye /> Tout afficher
          </button>
          <button onClick={() => toggleAll(false)} className="btn-hide-all">
            <FaEyeSlash /> Tout masquer
          </button>
        </div>
      </div>

      {selectedPlantes.length === 0 && (
        <div className="comparateur-intro">
          <h2>Sélectionnez 2 ou 3 plantes à comparer</h2>
          <p>Cliquez sur les plantes ci-dessous pour les ajouter à la comparaison</p>
        </div>
      )}

      <div className="comparateur-selector">
        <h3>Plantes disponibles ({selectedPlantes.length}/3 sélectionnées)</h3>
        <div className="selector-grid">
          {plantes.map(plante => (
            <button
              key={plante.id}
              className={`selector-item ${selectedPlantes.find(p => p.id === plante.id) ? 'selected' : ''}`}
              onClick={() => togglePlante(plante)}
              disabled={selectedPlantes.length >= 3 && !selectedPlantes.find(p => p.id === plante.id)}
            >
              <span className="selector-type">{plante.type === 'arbre' ? '🌳' : '🌿'}</span>
              <span className="selector-name">{plante.name}</span>
            </button>
          ))}
        </div>
      </div>

      {selectedPlantes.length > 0 && (
        <div className="comparateur-table">
          <div className="comparison-grid">
            {/* En-tête avec noms */}
            <div className="comparison-header-row">
              <div className="comparison-label-cell header-spacer">Critères</div>
              {selectedPlantes.map(plante => (
                <div key={plante.id} className="comparison-header-cell">
                  <button 
                    className="remove-plante"
                    onClick={() => togglePlante(plante)}
                    aria-label="Retirer"
                  >
                    <FaTimes />
                  </button>
                  <h3>{plante.name}</h3>
                  <p className="scientific">{plante.nomScientifique}</p>
                </div>
              ))}
            </div>

            {/* Images comparatives */}
            {visibleCriteres['images'] && (
            <div className="comparison-row image-row">
              <div className="comparison-label-cell">
                <button 
                  className="toggle-critere-btn"
                  onClick={() => toggleCritere('images')}
                  aria-label="Masquer les photos"
                  title="Masquer"
                >
                  <FaEyeSlash />
                </button>
                <span className="critere-icon">📷</span>
                <strong>Photos</strong>
              </div>
              {selectedPlantes.map(plante => {
                const images = getPlantImages(plante);
                const currentIndex = imageIndices[plante.id] || 0;
                return (
                  <div key={plante.id} className="comparison-cell image-cell">
                    <div className="comparison-image-container">
                      <button 
                        className="image-nav prev"
                        onClick={() => changeImage(plante.id, -1)}
                        aria-label="Image précédente"
                      >
                        <FaChevronLeft />
                      </button>
                      {images.length > 0 ? (
                        <img 
                          src={images[currentIndex].src}
                          alt={images[currentIndex].alt}
                          className="comparison-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="image-placeholder">
                          📷<br/>Chargement...
                        </div>
                      )}
                      <button 
                        className="image-nav next"
                        onClick={() => changeImage(plante.id, 1)}
                        aria-label="Image suivante"
                      >
                        <FaChevronRight />
                      </button>
                      <div className="image-counter">
                        {currentIndex + 1} / {images.length}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            )}

            {/* Lignes de critères */}
            {criteres.map(critere => (
              visibleCriteres[critere.id] && (
                <div key={critere.key} className="comparison-row">
                  <div className="comparison-label-cell">
                    <button 
                      className="toggle-critere-btn"
                      onClick={() => toggleCritere(critere.id)}
                      aria-label="Masquer ce critère"
                      title="Masquer"
                    >
                      <FaEyeSlash />
                    </button>
                    <span className="critere-icon">{critere.icon}</span>
                    <strong>{critere.label}</strong>
                    {critere.fiabilite && <FiabiliteBadge niveau={critere.fiabilite} />}
                  </div>
                  {selectedPlantes.map(plante => (
                    <div key={plante.id} className="comparison-cell">
                      {getValue(plante, critere.key)}
                    </div>
                  ))}
                </div>
              )
            ))}

            {/* Toxicité */}
            <div className="comparison-row alert-row">
              <div className="comparison-label-cell">
                <span className="critere-icon">⚠️</span>
                <strong>Toxicité</strong>
              </div>
              {selectedPlantes.map(plante => (
                <div 
                  key={plante.id} 
                  className={`comparison-cell ${plante.toxicite?.niveau?.includes('TOXIQUE') ? 'danger' : 'safe'}`}
                >
                  <strong>{plante.toxicite?.niveau || 'Non toxique'}</strong>
                  {plante.toxicite?.danger && (
                    <p className="small-text">{plante.toxicite.danger}</p>
                  )}
                </div>
              ))}
            </div>
            )}

            {/* Biodiversité */}
            {visibleCriteres['biodiversite'] && (
            <div className="comparison-row">
              <div className="comparison-label-cell">
                <button 
                  className="toggle-critere-btn"
                  onClick={() => toggleCritere('biodiversite')}
                  aria-label="Masquer biodiversité"
                  title="Masquer"
                >
                  <FaEyeSlash />
                </button>
                <span className="critere-icon">🦋</span>
                <strong>Biodiversité</strong>
              </div>
              {selectedPlantes.map(plante => (
                <div key={plante.id} className="comparison-cell">
                  <p className="small-text">{plante.biodiveriste?.faune}</p>
                </div>
              ))}
            </div>
            )}

            {/* Utilisations */}
            {visibleCriteres['utilisations'] && (
            <div className="comparison-row">
              <div className="comparison-label-cell">
                <button 
                  className="toggle-critere-btn"
                  onClick={() => toggleCritere('utilisations')}
                  aria-label="Masquer utilisations"
                  title="Masquer"
                >
                  <FaEyeSlash />
                </button>
                <span className="critere-icon">💡</span>
                <strong>Utilisations</strong>
              </div>
              {selectedPlantes.map(plante => (
                <div key={plante.id} className="comparison-cell">
                  <ul className="compact-list">
                    {plante.utilisations?.slice(0, 3).map((util, idx) => (
                      <li key={idx}>{util}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            )}

            {/* NOUVEAU : Pollinisation */}
            {visibleCriteres['pollinisation'] && (
            <div className="comparison-row">
              <div className="comparison-label-cell">
                <button 
                  className="toggle-critere-btn"
                  onClick={() => toggleCritere('pollinisation')}
                  aria-label="Masquer pollinisation"
                  title="Masquer"
                >
                  <FaEyeSlash />
                </button>
                <span className="critere-icon">🐝</span>
                <strong>Pollinisation</strong>
              </div>
              {selectedPlantes.map(plante => (
                <div key={plante.id} className="comparison-cell">
                  {informationsComplementaires[plante.id] ? (
                    <>
                      <p className="small-text"><strong>Mode :</strong> {informationsComplementaires[plante.id].pollinisation.type}</p>
                      <p className="small-text highlight-compact">{informationsComplementaires[plante.id].pollinisation.besoin}</p>
                    </>
                  ) : 'N/A'}
                </div>
              ))}
            </div>
            )}

            {/* NOUVEAU : Allergies */}
            {visibleCriteres['allergies'] && (
            <div className="comparison-row">
              <div className="comparison-label-cell">
                <button 
                  className="toggle-critere-btn"
                  onClick={() => toggleCritere('allergies')}
                  aria-label="Masquer allergies"
                  title="Masquer"
                >
                  <FaEyeSlash />
                </button>
                <span className="critere-icon">🤧</span>
                <strong>Allergies</strong>
              </div>
              {selectedPlantes.map(plante => (
                <div key={plante.id} className="comparison-cell">
                  {informationsComplementaires[plante.id] ? (
                    <p className="small-text">{informationsComplementaires[plante.id].allergies.pollen}</p>
                  ) : 'N/A'}
                </div>
              ))}
            </div>
            )}

            {/* NOUVEAU : Animaux Domestiques */}
            {visibleCriteres['animaux'] && (
            <div className="comparison-row alert-row">
              <div className="comparison-label-cell">
                <button 
                  className="toggle-critere-btn"
                  onClick={() => toggleCritere('animaux')}
                  aria-label="Masquer animaux"
                  title="Masquer"
                >
                  <FaEyeSlash />
                </button>
                <span className="critere-icon">🐾</span>
                <strong>Animaux</strong>
              </div>
              {selectedPlantes.map(plante => (
                <div key={plante.id} className={`comparison-cell ${
                  informationsComplementaires[plante.id]?.animauxDomestiques.chiens?.includes('🔴') ? 'danger' : 
                  informationsComplementaires[plante.id]?.animauxDomestiques.chiens?.includes('⚠️') ? 'warning' : 'safe'
                }`}>
                  {informationsComplementaires[plante.id] ? (
                    <>
                      <p className="small-text"><strong>🐕</strong> {informationsComplementaires[plante.id].animauxDomestiques.chiens}</p>
                      <p className="small-text"><strong>🐈</strong> {informationsComplementaires[plante.id].animauxDomestiques.chats}</p>
                      {informationsComplementaires[plante.id].animauxDomestiques.chevaux && (
                        <p className="small-text"><strong>🐴</strong> {informationsComplementaires[plante.id].animauxDomestiques.chevaux}</p>
                      )}
                    </>
                  ) : 'N/A'}
                </div>
              ))}
            </div>
            )}

            {/* NOUVEAU : Système Racinaire */}
            {visibleCriteres['racines'] && (
            <div className="comparison-row">
              <div className="comparison-label-cell">
                <button 
                  className="toggle-critere-btn"
                  onClick={() => toggleCritere('racines')}
                  aria-label="Masquer racines"
                  title="Masquer"
                >
                  <FaEyeSlash />
                </button>
                <span className="critere-icon">🌱</span>
                <strong>Racines</strong>
                <FiabiliteBadge niveau="moyenne" />
              </div>
              {selectedPlantes.map(plante => (
                <div key={plante.id} className="comparison-cell">
                  {reglementationData[plante.id] ? (
                    <>
                      <p className="small-text"><strong>Structure :</strong> {reglementationData[plante.id].systemeRacinaire.type}</p>
                      <p className="small-text"><strong>Profondeur :</strong> {reglementationData[plante.id].systemeRacinaire.profondeur}</p>
                      <p className="small-text"><strong>Agressivité :</strong> {reglementationData[plante.id].systemeRacinaire.agressivite}</p>
                    </>
                  ) : 'N/A'}
                </div>
              ))}
            </div>
            )}

            {/* NOUVEAU : Distance Voisinage */}
            {visibleCriteres['distanceVoisin'] && (
            <div className="comparison-row alert-row">
              <div className="comparison-label-cell">
                <button 
                  className="toggle-critere-btn"
                  onClick={() => toggleCritere('distanceVoisin')}
                  aria-label="Masquer distance voisinage"
                  title="Masquer"
                >
                  <FaEyeSlash />
                </button>
                <span className="critere-icon">⚖️</span>
                <strong>Distance Légale Voisinage</strong>
                <FiabiliteBadge niveau="haute" />
              </div>
              {selectedPlantes.map(plante => (
                <div key={plante.id} className="comparison-cell warning">
                  {reglementationData[plante.id] ? (
                    <>
                      <p className="small-text warning-text"><strong>{reglementationData[plante.id].distancesLegales.voisinage.distance}</strong></p>
                      <p className="small-text">{reglementationData[plante.id].distancesLegales.voisinage.justification}</p>
                    </>
                  ) : 'N/A'}
                </div>
              ))}
            </div>

            {/* NOUVEAU : Interdiction Taille */}
            <div className="comparison-row alert-row">
              <div className="comparison-label-cell">
                <span className="critere-icon">🔴</span>
                <strong>Interdiction Taille</strong>
                <FiabiliteBadge niveau="haute" />
              </div>
              {selectedPlantes.map(plante => (
                <div key={plante.id} className="comparison-cell danger">
                  {informationsComplementaires[plante.id] ? (
                    <>
                      <p className="small-text"><strong>16 mars - 15 août</strong></p>
                      <p className="small-text">Amende : 3 750€</p>
                    </>
                  ) : 'N/A'}
                </div>
              ))}
            </div>
            )}

            {/* NOUVEAU : Dangers Taille */}
            {visibleCriteres['dangersTaille'] && (
            <div className="comparison-row">
              <div className="comparison-label-cell">
                <button 
                  className="toggle-critere-btn"
                  onClick={() => toggleCritere('dangersTaille')}
                  aria-label="Masquer dangers taille"
                  title="Masquer"
                >
                  <FaEyeSlash />
                </button>
                <span className="critere-icon">⚠️</span>
                <strong>Dangers Taille</strong>
              </div>
              {selectedPlantes.map(plante => (
                <div key={plante.id} className="comparison-cell">
                  {informationsComplementaires[plante.id] ? (
                    <>
                      <p className="small-text"><strong>{informationsComplementaires[plante.id].dangersEtPrecautions.taille.danger}</strong></p>
                      <p className="small-text success-compact">✅ {informationsComplementaires[plante.id].dangersEtPrecautions.taille.periodeSecuritaire}</p>
                    </>
                  ) : 'N/A'}
                </div>
              ))}
            </div>

            {/* NOUVEAU : Distance Fondations */}
            <div className="comparison-row">
              <div className="comparison-label-cell">
                <span className="critere-icon">🏗️</span>
                <strong>Distance Fondations</strong>
                <FiabiliteBadge niveau="moyenne" />
              </div>
              {selectedPlantes.map(plante => (
                <div key={plante.id} className="comparison-cell">
                  {reglementationData[plante.id] ? (
                    <p className="small-text warning-text"><strong>{reglementationData[plante.id].distancesLegales.infrastructures.fondations}</strong></p>
                  ) : 'N/A'}
                </div>
              ))}
            </div>

            {/* NOUVEAU : Distance Canalisations */}
            <div className="comparison-row">
              <div className="comparison-label-cell">
                <span className="critere-icon">🚰</span>
                <strong>Distance Canalisations</strong>
                <FiabiliteBadge niveau="moyenne" />
              </div>
              {selectedPlantes.map(plante => (
                <div key={plante.id} className="comparison-cell">
                  {reglementationData[plante.id] ? (
                    <p className="small-text warning-text"><strong>{reglementationData[plante.id].distancesLegales.infrastructures.canalisations}</strong></p>
                  ) : 'N/A'}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedPlantes.length === 0 && (
        <div className="comparateur-empty">
          <p>👆 Sélectionnez au moins 2 plantes pour commencer la comparaison</p>
        </div>
      )}
    </div>
  );
}

export default Comparateur;

