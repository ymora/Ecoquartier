import { useState, useEffect } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import './SelecteurArbres.css';

function SelecteurArbres({ plantes, onArbresSelectionnes }) {
  const [arbresListe, setArbresListe] = useState([plantes[0]]); // Liste des arbres à planter

  // Initialiser avec 1 arbre par défaut et notifier les changements
  useEffect(() => {
    if (onArbresSelectionnes) {
      onArbresSelectionnes(arbresListe);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arbresListe]); // Volontairement pas onArbresSelectionnes pour éviter la boucle

  const ajouterArbre = () => {
    if (arbresListe.length >= 10) {
      logger.warn('SelecteurArbres', 'Maximum 10 arbres atteint');
      return;
    }
    setArbresListe([...arbresListe, plantes[0]]);
  };

  const supprimerArbre = (index) => {
    if (arbresListe.length <= 1) {
      logger.warn('SelecteurArbres', 'Il faut au moins 1 arbre');
      return;
    }
    const newListe = arbresListe.filter((_, i) => i !== index);
    setArbresListe(newListe);
  };

  const changerArbre = (index, planteId) => {
    const plante = plantes.find(p => p.id === planteId);
    const newListe = [...arbresListe];
    newListe[index] = plante;
    setArbresListe(newListe);
  };

  // Extraire les infos pour l'affichage
  const getDistanceInfo = (arbre) => {
    const regl = arbre.reglementation;
    if (!regl) return {};

    return {
      voisin: regl.distancesLegales?.voisinage?.distance || 'N/A',
      fondations: regl.distancesLegales?.infrastructures?.fondations || 'N/A',
      canalisations: regl.distancesLegales?.infrastructures?.canalisations || 'N/A',
      entreArbres: regl.distancesLegales?.entreArbres?.distance || 'N/A'
    };
  };

  return (
    <div className="selecteur-arbres-container">
      <h3>🌳 Étape 2 : Choisissez vos arbres</h3>
      
      <div className="arbres-liste-header">
        <p className="info-principale">
          {arbresListe.length} arbre{arbresListe.length > 1 ? 's' : ''} à planter
        </p>
        <button className="btn-ajouter-arbre" onClick={ajouterArbre}>
          <FaPlus /> Ajouter un arbre
        </button>
      </div>

      <div className="arbres-liste">
        {arbresListe.map((arbre, index) => {
          const distances = getDistanceInfo(arbre);
          
          return (
            <div key={index} className="arbre-item">
              <div className="arbre-item-header">
                <span className="arbre-numero">Arbre #{index + 1}</span>
                {arbresListe.length > 1 && (
                  <button 
                    className="btn-supprimer-arbre"
                    onClick={() => supprimerArbre(index)}
                    aria-label="Supprimer cet arbre"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>

              <div className="arbre-selection">
                <select 
                  value={arbre.id} 
                  onChange={(e) => changerArbre(index, e.target.value)}
                  className="arbre-dropdown-compact"
                >
                  {plantes.map(plante => (
                    <option key={plante.id} value={plante.id}>
                      {plante.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="arbre-details">
                <div className="detail-row">
                  <span className="detail-icon">📏</span>
                  <span className="detail-label">Hauteur :</span>
                  <span className="detail-value">{arbre.tailleMaturite}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-icon">↔️</span>
                  <span className="detail-label">Envergure :</span>
                  <span className="detail-value">{arbre.envergure}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-icon">🌸</span>
                  <span className="detail-label">Floraison :</span>
                  <span className="detail-value">
                    {typeof arbre.floraison === 'object' ? arbre.floraison.periode : arbre.floraison}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-icon">⚖️</span>
                  <span className="detail-label">Distance voisin :</span>
                  <span className="detail-value important">{distances.voisin}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-icon">🌳</span>
                  <span className="detail-label">Entre arbres :</span>
                  <span className="detail-value important">{distances.entreArbres}</span>
                </div>
              </div>

              {arbre.toxicite && (
                <div className="toxicite-compact">
                  ⚠️ {typeof arbre.toxicite === 'object' ? arbre.toxicite.niveau : arbre.toxicite}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="note-info">
        <p>
          💡 <strong>Note :</strong> L'algorithme va calculer les meilleurs emplacements pour chaque arbre 
          en respectant les distances réglementaires entre eux et avec les infrastructures.
        </p>
      </div>
    </div>
  );
}

export default SelecteurArbres;
