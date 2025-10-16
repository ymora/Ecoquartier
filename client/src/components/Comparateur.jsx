import { useState, useEffect } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaEye, FaEyeSlash, FaSearchPlus } from 'react-icons/fa';
import { reglementationData } from '../data/reglementationData';
import { informationsComplementaires } from '../data/informationsComplementaires';
import FiabiliteBadge from './FiabiliteBadge';
import './Comparateur.css';

function Comparateur({ plantes }) {
  const [selectedPlantes, setSelectedPlantes] = useState([]);
  const [imageIndices, setImageIndices] = useState({});
  const [visibleCriteres, setVisibleCriteres] = useState({});
  const [zoomedImage, setZoomedImage] = useState(null);
  const [selectedImageType, setSelectedImageType] = useState('tous'); // Type d'image à afficher

  const togglePlante = (plante) => {
    if (selectedPlantes.find(p => p.id === plante.id)) {
      // Retirer si déjà sélectionné
      setSelectedPlantes(selectedPlantes.filter(p => p.id !== plante.id));
    } else {
      // Ajouter sans limite
      setSelectedPlantes([...selectedPlantes, plante]);
      setImageIndices({ ...imageIndices, [plante.id]: 0 });
    }
  };

  const changeImage = (planteId, direction) => {
    const plante = selectedPlantes.find(p => p.id === planteId);
    if (!plante) return;

    const images = getPlantImages(plante);
    const currentIndex = imageIndices[planteId] || 0;
    const newIndex = (currentIndex + direction + images.length) % images.length;
    setImageIndices({ ...imageIndices, [planteId]: newIndex });
    
    // Mettre à jour l'image zoomée si le zoom est actif pour cette plante
    if (zoomedImage && zoomedImage.planteId === planteId) {
      setZoomedImage({
        planteId,
        src: images[newIndex].src,
        alt: images[newIndex].alt,
        legend: images[newIndex].legend,
        currentIndex: newIndex,
        totalImages: images.length
      });
    }
  };

  const openZoom = (planteId, imageSrc, imageAlt, imageLegend, currentIndex, totalImages) => {
    setZoomedImage({
      planteId,
      src: imageSrc,
      alt: imageAlt,
      legend: imageLegend,
      currentIndex,
      totalImages
    });
  };

  const closeZoom = () => {
    setZoomedImage(null);
  };

  const navigateZoom = (direction) => {
    if (zoomedImage) {
      changeImage(zoomedImage.planteId, direction);
    }
  };

  // Navigation au clavier en mode zoom
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (zoomedImage) {
        if (e.key === 'ArrowLeft') navigateZoom(-1);
        if (e.key === 'ArrowRight') navigateZoom(1);
        if (e.key === 'Escape') closeZoom();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [zoomedImage]);

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
    // SYSTÈME OPTIMISÉ : Chargement depuis JSON (1 requête au lieu de 320)
    try {
      // Charger l'inventaire JSON
      const response = await fetch('/images.json');
      const imagesInventory = await response.json();
      
      // Récupérer les images pour cette espèce
      const plantImages = imagesInventory[plante.id] || [];
      
      // Mapper les types d'images avec leurs légendes
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
      
      // Transformer en format gallery
      const validImages = plantImages.map(filename => {
        // Extraire le type depuis le nom de fichier
        const match = filename.match(/_([a-z_]+)_(\d+)\./i);
        const type = match ? match[1] : 'vue_generale';
        const number = match ? parseInt(match[2]) : 1;
        
        return {
          src: `/images/${plante.id}/${filename}`,
          legend: `${typeLegends[type] || type} ${number > 1 ? `(${number})` : ''}`,
          alt: `${plante.name} - ${typeLegends[type] || type} ${number}`
        };
      });
      
      return validImages;
    } catch (error) {
      console.error('Erreur chargement images:', error);
      return [];
    }
  };

  const getPlantImages = (plante) => {
    const allImages = plantImages[plante.id] || [];
    
    // Filtrer par type si un type spécifique est sélectionné
    if (selectedImageType === 'tous') {
      return allImages;
    }
    
    // Filtrer les images par type
    return allImages.filter(img => {
      const match = img.src.match(/_([a-z_]+)_\d+\./i);
      const imageType = match ? match[1] : '';
      return imageType === selectedImageType;
    });
  };

  const criteres = [
    { id: 'taille', key: 'tailleMaturite', label: 'Hauteur', icon: '📏', fiabilite: 'moyenne', defaultVisible: true },
    { id: 'envergure', key: 'envergure', label: 'Largeur (envergure)', icon: '↔️', fiabilite: 'moyenne', defaultVisible: true },
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
    { id: 'interdiction', label: 'Réglementation Taille', icon: '🔴', defaultVisible: true },
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
      <div className="comparateur-selector">
        <div className="selector-categories">
          {/* Arbres */}
          <div className="selector-category">
            <h3 className="category-label">🌳 Arbres</h3>
            <div className="selector-grid">
              {plantes.filter(p => p.type === 'arbre').map(plante => (
                <button
                  key={plante.id}
                  className={`selector-item ${selectedPlantes.find(p => p.id === plante.id) ? 'selected' : ''}`}
                  onClick={() => togglePlante(plante)}
                >
                  <span className="selector-name">{plante.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Arbustes */}
          <div className="selector-category">
            <h3 className="category-label">🌿 Arbustes</h3>
            <div className="selector-grid">
              {plantes.filter(p => p.type === 'arbuste').map(plante => (
                <button
                  key={plante.id}
                  className={`selector-item ${selectedPlantes.find(p => p.id === plante.id) ? 'selected' : ''}`}
                  onClick={() => togglePlante(plante)}
                >
                  <span className="selector-name">{plante.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedPlantes.length > 0 && (
        <div className="comparateur-content">
          <div className="comparateur-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr className="comparison-header-row">
                  <th className="comparison-label-cell header-spacer">
                    <button onClick={() => toggleAll(true)} className="btn-show-all-table">
                      <FaEye /> Tout afficher
                    </button>
                  </th>
                  {selectedPlantes.map(plante => (
                    <th key={plante.id} className="comparison-header-cell">
                      <button 
                        className="remove-plante"
                        onClick={() => togglePlante(plante)}
                        aria-label="Retirer"
                      >
                        <FaTimes />
                      </button>
                      <h3>{plante.name}</h3>
                      <p className="scientific">{plante.nomScientifique}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>

            {/* Images comparatives */}
            {visibleCriteres['images'] && (
            <tr className="comparison-row image-row">
              <td className="comparison-label-cell image-label-cell">
                <div className="label-content">
                  <div className="label-row">
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
                  <select 
                    className="type-image-filter"
                    value={selectedImageType}
                    onChange={(e) => {
                      setSelectedImageType(e.target.value);
                      // Réinitialiser les indices d'images
                      const newIndices = {};
                      selectedPlantes.forEach(p => newIndices[p.id] = 0);
                      setImageIndices(newIndices);
                    }}
                    title="Filtrer par type d'image"
                  >
                    <option value="tous">Tous types</option>
                    <option value="vue_generale">Vue générale</option>
                    <option value="bourgeons">Bourgeons</option>
                    <option value="fleurs">Fleurs</option>
                    <option value="feuilles">Feuilles</option>
                    <option value="fruits">Fruits</option>
                    <option value="tronc">Tronc/Écorce</option>
                    <option value="automne">Automne</option>
                    <option value="hiver">Hiver</option>
                  </select>
                </div>
              </td>
              {selectedPlantes.map(plante => {
                const images = getPlantImages(plante);
                const currentIndex = imageIndices[plante.id] || 0;
                return (
                  <td key={plante.id} className="comparison-cell image-cell">
                    <div className="comparison-image-container">
                      {images.length > 0 && (
                        <button 
                          className="image-nav prev"
                          onClick={() => changeImage(plante.id, -1)}
                          aria-label="Image précédente"
                        >
                          <FaChevronLeft />
                        </button>
                      )}
                      {images.length > 0 ? (
                        <>
                          <img 
                            src={images[currentIndex].src}
                            alt={images[currentIndex].alt}
                            className="comparison-image"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <button 
                            className="zoom-button"
                            onClick={() => openZoom(
                              plante.id,
                              images[currentIndex].src,
                              images[currentIndex].alt,
                              images[currentIndex].legend,
                              currentIndex,
                              images.length
                            )}
                            aria-label="Agrandir l'image"
                            title="Agrandir"
                          >
                            <FaSearchPlus />
                          </button>
                          <div className="image-counter">
                            {currentIndex + 1} / {images.length}
                          </div>
                        </>
                      ) : (
                        <div className="image-placeholder">
                          📷<br/>Aucune image
                        </div>
                      )}
                      {images.length > 0 && (
                        <button 
                          className="image-nav next"
                          onClick={() => changeImage(plante.id, 1)}
                          aria-label="Image suivante"
                        >
                          <FaChevronRight />
                        </button>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
            )}

            {/* Lignes de critères */}
            {criteres.map(critere => (
              visibleCriteres[critere.id] && (
                <tr key={critere.key} className="comparison-row">
                  <td className="comparison-label-cell">
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
                    {critere.fiabilite && <FiabiliteBadge niveau={critere.fiabilite} compact />}
                  </td>
                  {selectedPlantes.map(plante => (
                    <td key={plante.id} className="comparison-cell">
                      {getValue(plante, critere.key)}
                    </td>
                  ))}
                </tr>
              )
            ))}

            {/* Toxicité */}
            {visibleCriteres['toxicite'] && (
            <tr className="comparison-row alert-row">
              <td className="comparison-label-cell">
                <button 
                  className="toggle-critere-btn"
                  onClick={() => toggleCritere('toxicite')}
                  aria-label="Masquer toxicité"
                  title="Masquer"
                >
                  <FaEyeSlash />
                </button>
                <span className="critere-icon">⚠️</span>
                <strong>Toxicité</strong>
              </td>
              {selectedPlantes.map(plante => (
                <td 
                  key={plante.id} 
                  className={`comparison-cell ${plante.toxicite?.niveau?.includes('TOXIQUE') ? 'danger' : 'safe'}`}
                >
                  <strong>{plante.toxicite?.niveau || 'Non toxique'}</strong>
                  {plante.toxicite?.danger && (
                    <p className="small-text">{plante.toxicite.danger}</p>
                  )}
                </td>
              ))}
            </tr>
            )}

            {/* Biodiversité */}
            {visibleCriteres['biodiversite'] && (
            <tr className="comparison-row">
              <td className="comparison-label-cell">
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
              </td>
              {selectedPlantes.map(plante => (
                <td key={plante.id} className="comparison-cell">
                  <p className="small-text">{plante.biodiveriste?.faune}</p>
                </td>
              ))}
            </tr>
            )}

            {/* Utilisations */}
            {visibleCriteres['utilisations'] && (
            <tr className="comparison-row">
              <td className="comparison-label-cell">
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
              </td>
              {selectedPlantes.map(plante => (
                <td key={plante.id} className="comparison-cell">
                  <ul className="compact-list">
                    {plante.utilisations?.slice(0, 3).map((util, idx) => (
                      <li key={idx}>{util}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
            )}

            {/* NOUVEAU : Pollinisation */}
            {visibleCriteres['pollinisation'] && (
            <tr className="comparison-row">
              <td className="comparison-label-cell">
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
              </td>
              {selectedPlantes.map(plante => (
                <td key={plante.id} className="comparison-cell">
                  {informationsComplementaires[plante.id] ? (
                    <>
                      <p className="small-text"><strong>Mode :</strong> {informationsComplementaires[plante.id].pollinisation.type}</p>
                      <p className="small-text highlight-compact">{informationsComplementaires[plante.id].pollinisation.besoin}</p>
                    </>
                  ) : 'N/A'}
                </td>
              ))}
            </tr>
            )}

            {/* NOUVEAU : Allergies */}
            {visibleCriteres['allergies'] && (
            <tr className="comparison-row">
              <td className="comparison-label-cell">
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
              </td>
              {selectedPlantes.map(plante => (
                <td key={plante.id} className="comparison-cell">
                  {informationsComplementaires[plante.id] ? (
                    <p className="small-text">{informationsComplementaires[plante.id].allergies.pollen}</p>
                  ) : 'N/A'}
                </td>
              ))}
            </tr>
            )}

            {/* NOUVEAU : Animaux Domestiques */}
            {visibleCriteres['animaux'] && (
            <tr className="comparison-row alert-row">
              <td className="comparison-label-cell">
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
              </td>
              {selectedPlantes.map(plante => (
                <td key={plante.id} className="comparison-cell">
                  {informationsComplementaires[plante.id] ? (
                    <>
                      <p className="small-text"><strong>Chiens :</strong> {informationsComplementaires[plante.id].animaux.chiens}</p>
                      <p className="small-text"><strong>Chats :</strong> {informationsComplementaires[plante.id].animaux.chats}</p>
                    </>
                  ) : 'N/A'}
                </td>
              ))}
            </tr>
            )}

            {/* NOUVEAU : Système Racinaire */}
            {visibleCriteres['racines'] && (
            <tr className="comparison-row">
              <td className="comparison-label-cell">
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
                <FiabiliteBadge niveau="moyenne" compact />
              </td>
              {selectedPlantes.map(plante => (
                <td key={plante.id} className="comparison-cell">
                  {reglementationData[plante.id] ? (
                    <>
                      <p className="small-text"><strong>Structure :</strong> {reglementationData[plante.id].systemeRacinaire.type}</p>
                      <p className="small-text"><strong>Profondeur :</strong> {reglementationData[plante.id].systemeRacinaire.profondeur}</p>
                      <p className="small-text"><strong>Agressivité :</strong> {reglementationData[plante.id].systemeRacinaire.agressivite}</p>
                    </>
                  ) : 'N/A'}
                </td>
              ))}
            </tr>
            )}

            {/* NOUVEAU : Distance Voisinage */}
            {visibleCriteres['distanceVoisin'] && (
            <tr className="comparison-row alert-row">
              <td className="comparison-label-cell">
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
                <FiabiliteBadge niveau="haute" compact />
              </td>
              {selectedPlantes.map(plante => (
                <td key={plante.id} className="comparison-cell warning">
                  {reglementationData[plante.id] ? (
                    <>
                      <p className="small-text warning-text"><strong>{reglementationData[plante.id].distancesLegales.voisinage.distance}</strong></p>
                      <p className="small-text">{reglementationData[plante.id].distancesLegales.voisinage.justification}</p>
                    </>
                  ) : 'N/A'}
                </td>
              ))}
            </tr>
            )}

            {/* NOUVEAU : Interdiction Taille */}
            {visibleCriteres['interdiction'] && (
            <tr className="comparison-row alert-row">
              <td className="comparison-label-cell">
                <button 
                  className="toggle-critere-btn"
                  onClick={() => toggleCritere('interdiction')}
                  aria-label="Masquer interdiction taille"
                  title="Masquer"
                >
                  <FaEyeSlash />
                </button>
                <span className="critere-icon">🔴</span>
                <strong>Réglementation Taille</strong>
                <FiabiliteBadge niveau="haute" compact />
              </td>
              {selectedPlantes.map(plante => (
                <td key={plante.id} className="comparison-cell danger">
                  {informationsComplementaires[plante.id] ? (
                    <>
                      <p className="small-text"><strong>Agriculteurs</strong> : Interdiction 16 mars - 15 août (arrêté préfectoral)</p>
                      <p className="small-text"><strong>Particuliers</strong> : Recommandation LPO (printemps - août)</p>
                    </>
                  ) : 'N/A'}
                </td>
              ))}
            </tr>
            )}

            {/* NOUVEAU : Dangers Taille */}
            {visibleCriteres['dangersTaille'] && (
            <tr className="comparison-row">
              <td className="comparison-label-cell">
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
              </td>
              {selectedPlantes.map(plante => (
                <td key={plante.id} className="comparison-cell">
                  {informationsComplementaires[plante.id] ? (
                    <>
                      <p className="small-text"><strong>{informationsComplementaires[plante.id].dangersEtPrecautions.taille.danger}</strong></p>
                      <p className="small-text success-compact">✅ {informationsComplementaires[plante.id].dangersEtPrecautions.taille.periodeSecuritaire}</p>
                    </>
                  ) : 'N/A'}
                </td>
              ))}
            </tr>
            )}

            {/* NOUVEAU : Distance Fondations */}
            {visibleCriteres['fondations'] && (
            <tr className="comparison-row">
              <td className="comparison-label-cell">
                <button 
                  className="toggle-critere-btn"
                  onClick={() => toggleCritere('fondations')}
                  aria-label="Masquer distance fondations"
                  title="Masquer"
                >
                  <FaEyeSlash />
                </button>
                <span className="critere-icon">🏗️</span>
                <strong>Distance Fondations</strong>
                <FiabiliteBadge niveau="moyenne" compact />
              </td>
              {selectedPlantes.map(plante => (
                <td key={plante.id} className="comparison-cell">
                  {reglementationData[plante.id] ? (
                    <p className="small-text warning-text"><strong>{reglementationData[plante.id].distancesLegales.infrastructures.fondations}</strong></p>
                  ) : 'N/A'}
                </td>
              ))}
            </tr>
            )}

            {/* NOUVEAU : Distance Canalisations */}
            {visibleCriteres['canalisations'] && (
            <tr className="comparison-row">
              <td className="comparison-label-cell">
                <button 
                  className="toggle-critere-btn"
                  onClick={() => toggleCritere('canalisations')}
                  aria-label="Masquer distance canalisations"
                  title="Masquer"
                >
                  <FaEyeSlash />
                </button>
                <span className="critere-icon">🚰</span>
                <strong>Distance Canalisations</strong>
                <FiabiliteBadge niveau="moyenne" compact />
              </td>
              {selectedPlantes.map(plante => (
                <td key={plante.id} className="comparison-cell">
                  {reglementationData[plante.id] ? (
                    <p className="small-text warning-text"><strong>{reglementationData[plante.id].distancesLegales.infrastructures.canalisations}</strong></p>
                  ) : 'N/A'}
                </td>
              ))}
            </tr>
            )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedPlantes.length === 0 && (
        <div className="comparateur-content">
          <div className="comparateur-empty">
            <p>👆 Sélectionnez au moins 2 plantes pour commencer la comparaison</p>
          </div>
        </div>
      )}

      {/* Modal Zoom */}
      {zoomedImage && (
        <div className="zoom-modal" onClick={closeZoom}>
          <button className="zoom-close" onClick={closeZoom} aria-label="Fermer">
            <FaTimes />
          </button>
          
          <button 
            className="zoom-nav prev"
            onClick={(e) => { e.stopPropagation(); navigateZoom(-1); }}
            aria-label="Image précédente"
          >
            <FaChevronLeft />
          </button>
          
          <img 
            src={zoomedImage.src} 
            alt={zoomedImage.alt}
            className="zoomed-image"
            loading="eager"
            onClick={(e) => e.stopPropagation()}
          />
          
          <button 
            className="zoom-nav next"
            onClick={(e) => { e.stopPropagation(); navigateZoom(1); }}
            aria-label="Image suivante"
          >
            <FaChevronRight />
          </button>
          
          <div className="zoom-legend" onClick={(e) => e.stopPropagation()}>
            {zoomedImage.legend}
            <span className="zoom-counter">{zoomedImage.currentIndex + 1} / {zoomedImage.totalImages}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Comparateur;

