import { useState } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { reglementationData } from '../data/reglementationData';
import { informationsComplementaires } from '../data/informationsComplementaires';
import FiabiliteBadge from './FiabiliteBadge';
import './Comparateur.css';

function Comparateur({ plantes }) {
  const [selectedPlantes, setSelectedPlantes] = useState([]);
  const [imageIndices, setImageIndices] = useState({});

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

  const getPlantImages = (plante) => {
    const types = ['vue_generale', 'fleurs', 'bourgeons', 'fruits', 'automne', 'hiver'];
    return types.map(type => ({
      src: `/images/${plante.id}/${plante.id}_${type}.jpg`,
      legend: type.replace('_', ' ')
    }));
  };

  const criteres = [
    { key: 'type', label: 'Type', icon: '🌳', fiabilite: 'haute' },
    { key: 'tailleMaturite', label: 'Taille à maturité', icon: '📏', fiabilite: 'moyenne' },
    { key: 'floraison.periode', label: 'Floraison', icon: '🌸', fiabilite: 'moyenne' },
    { key: 'floraison.couleur', label: 'Couleur fleurs', icon: '🎨', fiabilite: 'haute' },
    { key: 'floraison.parfum', label: 'Parfum', icon: '👃', fiabilite: 'haute' },
    { key: 'fructification.periode', label: 'Fruits', icon: '🍇', fiabilite: 'moyenne' },
    { key: 'feuillage.type', label: 'Feuillage', icon: '🍃', fiabilite: 'haute' },
    { key: 'feuillage.couleurAutomne', label: 'Couleur automne', icon: '🍂', fiabilite: 'moyenne' },
    { key: 'exposition', label: 'Exposition', icon: '☀️', fiabilite: 'haute' },
    { key: 'rusticite', label: 'Rusticité', icon: '❄️', fiabilite: 'moyenne' },
    { key: 'sol.type', label: 'Type de sol', icon: '🌍', fiabilite: 'haute' },
    { key: 'sol.ph', label: 'pH du sol', icon: '🧪', fiabilite: 'haute' },
    { key: 'croissance', label: 'Croissance', icon: '📈', fiabilite: 'moyenne' },
    { key: 'arrosage', label: 'Arrosage', icon: '💧', fiabilite: 'haute' },
    { key: 'taille.periode', label: 'Période de taille', icon: '✂️', fiabilite: 'haute' },
    { key: 'taille.frequence', label: 'Fréquence taille', icon: '🔄', fiabilite: 'haute' }
  ];

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
                  <div className="plante-type-badge">
                    {plante.type === 'arbre' ? '🌳 Arbre' : '🌿 Arbuste'}
                  </div>
                  <h3>{plante.name}</h3>
                  <p className="scientific">{plante.nomScientifique}</p>
                </div>
              ))}
            </div>

            {/* Images comparatives */}
            <div className="comparison-row image-row">
              <div className="comparison-label-cell">
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
                      <img 
                        src={images[currentIndex].src}
                        alt={`${plante.name} - ${images[currentIndex].legend}`}
                        onError={(e) => {
                          if (e.target.src !== '/images/placeholder.jpg') {
                            e.target.onerror = null;
                            e.target.src = '/images/placeholder.jpg';
                          }
                        }}
                      />
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

            {/* Lignes de critères */}
            {criteres.map(critere => (
              <div key={critere.key} className="comparison-row">
                <div className="comparison-label-cell">
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

            {/* Biodiversité */}
            <div className="comparison-row">
              <div className="comparison-label-cell">
                <span className="critere-icon">🦋</span>
                <strong>Biodiversité</strong>
              </div>
              {selectedPlantes.map(plante => (
                <div key={plante.id} className="comparison-cell">
                  <p className="small-text">{plante.biodiveriste?.faune}</p>
                </div>
              ))}
            </div>

            {/* Utilisations */}
            <div className="comparison-row">
              <div className="comparison-label-cell">
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

            {/* NOUVEAU : Pollinisation */}
            <div className="comparison-row">
              <div className="comparison-label-cell">
                <span className="critere-icon">🐝</span>
                <strong>Pollinisation</strong>
              </div>
              {selectedPlantes.map(plante => (
                <div key={plante.id} className="comparison-cell">
                  {informationsComplementaires[plante.id] ? (
                    <>
                      <p className="small-text"><strong>Type :</strong> {informationsComplementaires[plante.id].pollinisation.type}</p>
                      <p className="small-text highlight-compact">{informationsComplementaires[plante.id].pollinisation.besoin}</p>
                    </>
                  ) : 'N/A'}
                </div>
              ))}
            </div>

            {/* NOUVEAU : Allergies */}
            <div className="comparison-row">
              <div className="comparison-label-cell">
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

            {/* NOUVEAU : Animaux Domestiques */}
            <div className="comparison-row alert-row">
              <div className="comparison-label-cell">
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

            {/* NOUVEAU : Système Racinaire */}
            <div className="comparison-row">
              <div className="comparison-label-cell">
                <span className="critere-icon">🌱</span>
                <strong>Racines</strong>
                <FiabiliteBadge niveau="moyenne" />
              </div>
              {selectedPlantes.map(plante => (
                <div key={plante.id} className="comparison-cell">
                  {reglementationData[plante.id] ? (
                    <>
                      <p className="small-text"><strong>Type :</strong> {reglementationData[plante.id].systemeRacinaire.type}</p>
                      <p className="small-text"><strong>Profondeur :</strong> {reglementationData[plante.id].systemeRacinaire.profondeur}</p>
                      <p className="small-text"><strong>Agressivité :</strong> {reglementationData[plante.id].systemeRacinaire.agressivite}</p>
                    </>
                  ) : 'N/A'}
                </div>
              ))}
            </div>

            {/* NOUVEAU : Distance Voisinage */}
            <div className="comparison-row alert-row">
              <div className="comparison-label-cell">
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

            {/* NOUVEAU : Dangers Taille */}
            <div className="comparison-row">
              <div className="comparison-label-cell">
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

