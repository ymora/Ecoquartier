/**
 * COMPARISON TABLE - Version 2026 Premium (Synchronized Grid)
 * This version ensures perfect horizontal alignment between all plants.
 */
import { useState, useMemo } from 'react';
import FullscreenGallery from './FullscreenGallery';
import MaintenanceGuide from './MaintenanceGuide';
import { motion, AnimatePresence } from 'framer-motion';
import './ComparisonTable.css';

export default function ComparisonTable({ plants }) {
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [typeImageActif, setTypeImageActif] = useState('toutes');
  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});

  const getImagesParType = (plant) => {
    const images = plant.images || [];
    if (images.length === 0) return [];
    if (typeImageActif === 'toutes') return images;

    const motsClefs = {
      'vue_generale': ['vue_generale', 'general', 'port', 'silhouette', 'ensemble', 'entier'],
      'bourgeons': ['bourgeon', 'bud', 'printemps_debut'],
      'fleurs': ['fleur', 'floraison', 'blossom', 'flower', 'inflorescence'],
      'feuilles': ['feuille', 'feuillage', 'foliage', 'leaf'],
      'fruits': ['fruit', 'baie', 'drupe', 'berry', 'fructification'],
      'tronc': ['tronc', 'ecorce', 'bark', 'trunk', 'tige', 'rameau'],
      'automne': ['automne', 'fall', 'autumn'],
      'hiver': ['hiver', 'winter', 'neige']
    };

    const motsRecherche = motsClefs[typeImageActif] || [];
    return images.filter(img =>
      motsRecherche.some(mot => img.toLowerCase().includes(mot))
    );
  };

  const getCurrentIndex = (plantId) => currentImageIndexes[plantId] || 0;

  const changeImage = (plantId, delta, maxIndex) => {
    setCurrentImageIndexes(prev => {
      const currentIndex = prev[plantId] || 0;
      const newIndex = (currentIndex + delta + maxIndex + 1) % (maxIndex + 1);
      return { ...prev, [plantId]: newIndex };
    });
  };

  // Définition des métriques (rows)
  const sections = [
    {
      title: 'Caractéristiques Générales',
      rows: [
        { label: '🌿 Nom commun', key: 'name' },
        { label: '🔬 Scientifique', key: 'nomScientifique', italic: true },
        { label: '👨‍👩‍👧‍👦 Famille', key: 'famille' },
        { label: '📏 Hauteur/Largeur', render: (p) => `${p.tailleMaturite} / ${p.envergure}` },
        { label: '📈 Croissance', key: 'croissance' },
      ]
    },
    {
      title: 'Aspect Visuel',
      rows: [
        { label: '🍂 Feuillage', path: 'feuillage.type' },
        { label: '🍁 Couleur Automne', path: 'feuillage.couleurAutomne' },
        { label: '🌸 Floraison', render: (p) => `${p.floraison?.periode} (${p.floraison?.couleur})` },
      ]
    },
    {
      title: 'Besoins & Culture',
      rows: [
        { label: '☀️ Exposition', key: 'exposition' },
        { label: '🌍 Sol', render: (p) => `${p.sol?.type} (pH: ${p.sol?.ph})` },
        { label: '💧 Arrosage', key: 'arrosage' },
        { label: '❄️ Rusticité', key: 'rusticite' },
      ]
    }
  ];

  const typesVues = [
    { id: 'toutes', label: 'Toutes', icon: '🖼️' },
    { id: 'vue_generale', label: 'Générale', icon: '🌳' },
    { id: 'fleurs', label: 'Fleurs', icon: '🌸' },
    { id: 'feuilles', label: 'Feuilles', icon: '🍃' },
    { id: 'fruits', label: 'Fruits', icon: '🫐' }
  ];

  const getValue = (plant, row) => {
    if (row.render) return row.render(plant);
    if (row.key) return plant[row.key];
    if (row.path) {
      const parts = row.path.split('.');
      let value = plant;
      for (const part of parts) { value = value?.[part]; }
      return value || '-';
    }
    return '-';
  };

  const isDifferent = (row, plants) => {
    if (!highlightDifferences) return false;
    const values = plants.map(p => getValue(p, row));
    return new Set(values).size > 1;
  };

  return (
    <div className="comparison-v2">
      <header className="comparison-header-v2">
        <div className="header-text">
          <h2>Comparaison Premium</h2>
          <p>{plants.length} espèces sélectionnées</p>
        </div>
        
        <div className="header-controls">
          <div className="filter-group">
            {typesVues.map(type => (
              <button
                key={type.id}
                onClick={() => setTypeImageActif(type.id)}
                className={`filter-pill ${typeImageActif === type.id ? 'active' : ''}`}
              >
                <span className="pill-icon">{type.icon}</span>
                <span className="pill-label">{type.label}</span>
              </button>
            ))}
          </div>

          <label className="toggle-diff">
            <input 
              type="checkbox" 
              checked={highlightDifferences} 
              onChange={() => setHighlightDifferences(!highlightDifferences)} 
            />
            <span className="toggle-label">🔍 Différences</span>
          </label>
        </div>
      </header>

      <div 
        className="sync-comparison-grid"
        style={{ '--col-count': plants.length }}
      >
        {/* BACKGROUNDS POUR L'EFFET COLONNE/CARTE */}
        {plants.map((_, idx) => (
          <div key={`bg-${idx}`} className="grid-column-bg" style={{ gridColumn: idx + 2 }} />
        ))}

        {/* LABELS (Colonne 1) */}
        <div className="grid-label header-label" style={{ gridRow: 1 }}>Images</div>
        <div className="grid-label header-label" style={{ gridRow: 2 }}>Type & Nom</div>
        
        {/* Données des Plantes (Images & Titres) */}
        {plants.map((plant, idx) => (
          <div key={`head-${plant.id}`} className="grid-cell plant-header-cell" style={{ gridColumn: idx + 2 }}>
             <div className="card-image-wrapper">
              {(() => {
                const imgs = getImagesParType(plant);
                const i = getCurrentIndex(plant.id);
                if (imgs.length === 0) return <div className="no-img">🚫 Photo indisponible</div>;
                return (
                  <>
                    <motion.img 
                      key={imgs[i]}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      src={`/images/${imgs[i]}`} 
                      alt={plant.name} 
                      onClick={() => setFullscreenImage({ plant, imagePath: imgs[i] })}
                    />
                    {imgs.length > 1 && (
                      <div className="card-img-nav">
                        <button onClick={(e) => { e.stopPropagation(); changeImage(plant.id, -1, imgs.length - 1); }}>‹</button>
                        <span>{i + 1}/{imgs.length}</span>
                        <button onClick={(e) => { e.stopPropagation(); changeImage(plant.id, 1, imgs.length - 1); }}>›</button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
            <div className="card-main-info">
              <span className="type-badge">{plant.type === 'arbre' ? '🌳 Arbre' : '🌿 Arbuste'}</span>
              <h3>{plant.name}</h3>
            </div>
          </div>
        ))}

        {/* SECTIONS DYMANIQUES */}
        {(() => {
          let currentRow = 3;
          return sections.map((section, sIdx) => {
            const sectionStartRow = currentRow;
            currentRow += 1 + section.rows.length;
            
            return (
              <React.Fragment key={section.title}>
                {/* Titre de Section */}
                <div className="grid-label section-title-row" style={{ gridRow: sectionStartRow }}>
                  {section.title}
                </div>
                {plants.map((_, pIdx) => (
                   <div key={`section-bg-${sIdx}-${pIdx}`} className="grid-cell section-title-cell" style={{ gridRow: sectionStartRow, gridColumn: pIdx + 2 }} />
                ))}

                {/* Lignes de données */}
                {section.rows.map((row, rIdx) => {
                  const rowPos = sectionStartRow + 1 + rIdx;
                  return (
                    <React.Fragment key={row.label}>
                      <div className="grid-label data-label-row" style={{ gridRow: rowPos }}>
                        {row.label}
                      </div>
                      {plants.map((plant, pIdx) => {
                        const diff = isDifferent(row, plants);
                        return (
                          <div 
                            key={`cell-${plant.id}-${row.label}`} 
                            className={`grid-cell data-value-cell ${diff ? 'highlight' : ''}`}
                            style={{ gridRow: rowPos, gridColumn: pIdx + 2 }}
                          >
                            <span className={row.italic ? 'italic' : ''}>
                              {getValue(plant, row)}
                            </span>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            );
          });
        })()}

        {/* FOOTER ACTIONS */}
        <div className="grid-label footer-label" style={{ gridRow: 100 }}>Actions</div>
        {plants.map((plant, idx) => (
          <div key={`foot-${plant.id}`} className="grid-cell footer-cell" style={{ gridRow: 100, gridColumn: idx + 2 }}>
             <MaintenanceGuide plant={plant} compact />
          </div>
        ))}

      </div>

      <AnimatePresence>
        {fullscreenImage && (
          <FullscreenGallery
            isOpen={true}
            onClose={() => setFullscreenImage(null)}
            currentImage={`/images/${fullscreenImage.imagePath}`}
            currentIndex={0}
            totalImages={1}
            altText={fullscreenImage.plant.name}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
