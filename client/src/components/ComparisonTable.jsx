/**
 * COMPARISON TABLE - Tableau de Comparaison Moderne
 * Toutes les infos alignées côte à côte
 */
import { useState } from 'react';
import './ComparisonTable.css';

export default function ComparisonTable({ plants }) {
  const [currentImages, setCurrentImages] = useState(
    plants.reduce((acc, plant) => ({ ...acc, [plant.id]: 0 }), {})
  );
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [filtresActifs, setFiltresActifs] = useState(['general', 'floraison', 'feuillage', 'sol', 'entretien', 'reglementation']);

  const changeImage = (plantId, delta) => {
    const plant = plants.find(p => p.id === plantId);
    const images = plant?.images || [];
    if (images.length === 0) return;

    setCurrentImages(prev => ({
      ...prev,
      [plantId]: (prev[plantId] + delta + images.length) % images.length
    }));
  };
  
  const toggleFiltre = (filtre) => {
    setFiltresActifs(prev => 
      prev.includes(filtre) 
        ? prev.filter(f => f !== filtre)
        : [...prev, filtre]
    );
  };

  // ✅ Organisation des critères par catégorie
  const toutesLesLignes = [
    {
      label: '📸 Photos',
      categorie: 'general',
      render: (plant) => {
        const images = plant.images || [];
        const currentIdx = currentImages[plant.id] || 0;
        
        if (images.length === 0) {
          return (
            <div className="comparison-no-image">
              <div className="no-image-placeholder">📷</div>
              <p>Photos à venir</p>
            </div>
          );
        }

        return (
          <div className="comparison-image-container">
            <div className="image-frame">
              <img
                src={`/images/${images[currentIdx]}`}
                alt={plant.name}
                onClick={() => setFullscreenImage({ plant, index: currentIdx })}
                className="comparison-image"
              />
            </div>
            {images.length > 1 && (
              <>
                <button
                  className="img-nav img-prev"
                  onClick={() => changeImage(plant.id, -1)}
                >
                  ◀
                </button>
                <button
                  className="img-nav img-next"
                  onClick={() => changeImage(plant.id, 1)}
                >
                  ▶
                </button>
                <div className="img-counter">{currentIdx + 1}/{images.length}</div>
              </>
            )}
          </div>
        );
      }
    },
    { label: '🌿 Nom commun', key: 'name', categorie: 'general' },
    { label: '🔬 Nom scientifique', key: 'nomScientifique', categorie: 'general' },
    { label: '👨‍👩‍👧‍👦 Famille', key: 'famille', categorie: 'general' },
    { label: '🏷️ Type', render: (p) => p.type === 'arbre' ? '🌳 Arbre' : '🌿 Arbuste', categorie: 'general' },
    { label: '📏 Hauteur', key: 'tailleMaturite', categorie: 'general' },
    { label: '↔️ Envergure', key: 'envergure', categorie: 'general' },
    { label: '📈 Croissance', key: 'croissance', categorie: 'general' },
    { label: '🌸 Floraison période', path: 'floraison.periode', categorie: 'floraison' },
    { label: '🎨 Floraison couleur', path: 'floraison.couleur', categorie: 'floraison' },
    { label: '👃 Parfum', path: 'floraison.parfum', categorie: 'floraison' },
    { label: '🍂 Feuillage type', path: 'feuillage.type', categorie: 'feuillage' },
    { label: '🍁 Couleur automne', path: 'feuillage.couleurAutomne', categorie: 'feuillage' },
    { label: '🌍 Sol type', path: 'sol.type', categorie: 'sol' },
    { label: '⚗️ Sol pH', path: 'sol.ph', categorie: 'sol' },
    { label: '💧 Sol humidité', path: 'sol.humidite', categorie: 'sol' },
    { label: '☀️ Exposition', key: 'exposition', categorie: 'sol' },
    { label: '💧 Arrosage', key: 'arrosage', categorie: 'entretien' },
    { label: '❄️ Rusticité', key: 'rusticite', categorie: 'entretien' },
    { label: '✂️ Taille période', path: 'taille.periode', categorie: 'entretien' },
    { label: '✂️ Taille fréquence', path: 'taille.frequence', categorie: 'entretien' },
    { label: '🌱 Plantation période', path: 'plantation.periode', categorie: 'entretien' },
    { label: '📏 Distance voisinage', path: 'reglementation.distancesLegales.voisinage.distance', categorie: 'reglementation' },
    { label: '🏠 Distance fondations', path: 'reglementation.distancesLegales.infrastructures.fondations', categorie: 'reglementation' },
    { label: '🌳 Distance entre arbres', path: 'reglementation.distancesLegales.entreArbres.distance', categorie: 'reglementation' },
    { label: '☠️ Toxicité', path: 'toxicite.niveau', categorie: 'reglementation' },
  ];
  
  // ✅ Filtrer les lignes selon les filtres actifs
  const rows = toutesLesLignes.filter(row => filtresActifs.includes(row.categorie));
  
  // ✅ Catégories de filtres
  const categories = [
    { id: 'general', label: '📋 Général', icon: '📋' },
    { id: 'floraison', label: '🌸 Floraison', icon: '🌸' },
    { id: 'feuillage', label: '🍂 Feuillage', icon: '🍂' },
    { id: 'sol', label: '🌍 Sol', icon: '🌍' },
    { id: 'entretien', label: '✂️ Entretien', icon: '✂️' },
    { id: 'reglementation', label: '📏 Réglementation', icon: '📏' }
  ];

  const getValue = (plant, row) => {
    if (row.render) return row.render(plant);
    if (row.key) return plant[row.key];
    if (row.path) {
      const parts = row.path.split('.');
      let value = plant;
      for (const part of parts) {
        value = value?.[part];
      }
      return value || '-';
    }
    return '-';
  };

  return (
    <div className="comparison-table-wrapper">
      <div className="comparison-header">
        <h2>Comparaison de {plants.length} plantes</h2>
        <p>Toutes les caractéristiques côte à côte</p>
        
        {/* ✅ Filtres par catégorie */}
        <div className="comparison-filters">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => toggleFiltre(cat.id)}
              className={`filter-btn ${filtresActifs.includes(cat.id) ? 'active' : ''}`}
              title={filtresActifs.includes(cat.id) ? 'Cliquer pour masquer' : 'Cliquer pour afficher'}
            >
              <span className="filter-icon">{cat.icon}</span>
              <span className="filter-label">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="comparison-scroll">
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="row-label-header">Critère</th>
              {plants.map(plant => (
                <th key={plant.id} className="plant-header">
                  <div className="plant-header-content">
                    <span className="plant-type-badge">
                      {plant.type === 'arbre' ? '🌳' : '🌿'}
                    </span>
                    <h3>{plant.name}</h3>
                    <p>{plant.nomScientifique}</p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td className="row-label">{row.label}</td>
                {plants.map(plant => (
                  <td key={plant.id} className="comparison-cell">
                    {getValue(plant, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal plein écran */}
      {fullscreenImage && (
        <div className="fullscreen-modal" onClick={() => setFullscreenImage(null)}>
          <button className="fullscreen-close" onClick={() => setFullscreenImage(null)}>✕</button>
          <img
            src={`/images/${fullscreenImage.plant.images[fullscreenImage.index]}`}
            alt={fullscreenImage.plant.name}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

