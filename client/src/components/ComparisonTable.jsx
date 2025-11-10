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

  const changeImage = (plantId, delta) => {
    const plant = plants.find(p => p.id === plantId);
    const images = plant?.images || [];
    if (images.length === 0) return;

    setCurrentImages(prev => ({
      ...prev,
      [plantId]: (prev[plantId] + delta + images.length) % images.length
    }));
  };

  const rows = [
    {
      label: '📸 Photos',
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
            <img
              src={`/images/${images[currentIdx]}`}
              alt={plant.name}
              onClick={() => setFullscreenImage({ plant, index: currentIdx })}
              className="comparison-image"
            />
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
    { label: '🌿 Nom commun', key: 'name' },
    { label: '🔬 Nom scientifique', key: 'nomScientifique' },
    { label: '👨‍👩‍👧‍👦 Famille', key: 'famille' },
    { label: '🏷️ Type', render: (p) => p.type === 'arbre' ? '🌳 Arbre' : '🌿 Arbuste' },
    { label: '📏 Hauteur', key: 'tailleMaturite' },
    { label: '↔️ Envergure', key: 'envergure' },
    { label: '📈 Croissance', key: 'croissance' },
    { label: '🌸 Floraison période', path: 'floraison.periode' },
    { label: '🎨 Floraison couleur', path: 'floraison.couleur' },
    { label: '👃 Parfum', path: 'floraison.parfum' },
    { label: '🍂 Feuillage type', path: 'feuillage.type' },
    { label: '🍁 Couleur automne', path: 'feuillage.couleurAutomne' },
    { label: '🌍 Sol type', path: 'sol.type' },
    { label: '⚗️ Sol pH', path: 'sol.ph' },
    { label: '💧 Sol humidité', path: 'sol.humidite' },
    { label: '☀️ Exposition', key: 'exposition' },
    { label: '💧 Arrosage', key: 'arrosage' },
    { label: '❄️ Rusticité', key: 'rusticite' },
    { label: '✂️ Taille période', path: 'taille.periode' },
    { label: '✂️ Taille fréquence', path: 'taille.frequence' },
    { label: '🌱 Plantation période', path: 'plantation.periode' },
    { label: '📏 Distance voisinage', path: 'reglementation.distancesLegales.voisinage.distance' },
    { label: '🏠 Distance fondations', path: 'reglementation.distancesLegales.infrastructures.fondations' },
    { label: '🌳 Distance entre arbres', path: 'reglementation.distancesLegales.entreArbres.distance' },
    { label: '☠️ Toxicité', path: 'toxicite.niveau' },
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

