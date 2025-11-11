/**
 * COMPARISON TABLE - Tableau de Comparaison Moderne
 * Toutes les infos alignées côte à côte
 */
import { useState } from 'react';
import './ComparisonTable.css';

export default function ComparisonTable({ plants }) {
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [typeImageActif, setTypeImageActif] = useState('toutes'); // 'toutes', 'loin', 'fleur', 'feuillage', 'fruit'

  // ✅ Déterminer quelle image afficher pour chaque plante selon le filtre
  const getImageParType = (plant) => {
    const images = plant.images || [];
    if (images.length === 0) return null;
    
    if (typeImageActif === 'toutes') {
      return images[0]; // Première image par défaut
    }
    
    // ✅ Chercher une image contenant le mot-clé du type (TOUS les types du mode admin)
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
    const imageCorrespondante = images.find(img => 
      motsRecherche.some(mot => img.toLowerCase().includes(mot))
    );
    
    return imageCorrespondante || images[0]; // Fallback sur première image
  };

  const rows = [
    {
      label: '📸 Photos',
      render: (plant) => {
        const imagePath = getImageParType(plant);
        
        if (!imagePath) {
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
                src={`/images/${imagePath}`}
                alt={plant.name}
                onClick={() => setFullscreenImage({ plant, imagePath })}
                className="comparison-image"
              />
            </div>
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
  
  // ✅ Types de vues d'images (TOUS les types du mode admin)
  const typesVues = [
    { id: 'toutes', label: 'Toutes', icon: '🖼️' },
    { id: 'vue_generale', label: 'Vue générale', icon: '🌳' },
    { id: 'bourgeons', label: 'Bourgeons', icon: '🌱' },
    { id: 'fleurs', label: 'Fleurs', icon: '🌸' },
    { id: 'feuilles', label: 'Feuilles', icon: '🍃' },
    { id: 'fruits', label: 'Fruits', icon: '🫐' },
    { id: 'tronc', label: 'Tronc/Écorce', icon: '🪵' },
    { id: 'automne', label: 'Automne', icon: '🍁' },
    { id: 'hiver', label: 'Hiver', icon: '❄️' }
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
        
        {/* ✅ Filtres par TYPE d'image */}
        <div className="comparison-filters">
          <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            🖼️ Type de vue :
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {typesVues.map(type => (
              <button
                key={type.id}
                onClick={() => setTypeImageActif(type.id)}
                className={`filter-btn ${typeImageActif === type.id ? 'active' : ''}`}
                title={`Afficher les images : ${type.label}`}
              >
                {type.icon} {type.label}
              </button>
            ))}
          </div>
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
            src={`/images/${fullscreenImage.imagePath}`}
            alt={fullscreenImage.plant.name}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

