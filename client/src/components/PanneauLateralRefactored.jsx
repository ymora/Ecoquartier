import React, { useState, useCallback } from 'react';
import SectionOutils from './panneau/SectionOutils';
import SectionConfig from './panneau/SectionConfig';

/**
 * Panneau latéral refactorisé - Version professionnelle
 * Découpé en composants plus petits et maintenables
 */
const PanneauLateralRefactored = ({
  // Props pour les outils
  imageFondChargee,
  onChargerImageFond,
  onSupprimerImageFond,
  opaciteImageFond,
  onOpaciteImageFondChange,
  onChargerPlanParDefaut,
  
  // Props pour les objets
  onAjouterMaison,
  onAjouterCiterne,
  onAjouterCaissonEau,
  onAjouterCanalisation,
  onAjouterCloture,
  onAjouterTerrasse,
  onAjouterPaves,
  onAjouterArbre,
  onAjouterArbuste,
  
  // Props pour la configuration
  couchesSol,
  onCouchesSolChange,
  objetSelectionne,
  onSupprimerObjet,
  onUpdateObjetProp,
  
  // Props pour les statistiques
  nbObjets,
  nbMaisons,
  nbArbres,
  nbCiterne,
  nbCaissonEau,
  nbCanalisation,
  nbCloture,
  nbTerrasse,
  nbPaves
}) => {
  // États locaux
  const [ongletActif, setOngletActif] = useState('config');
  const [batimentsOuvert, setBatimentsOuvert] = useState(false);
  const [vegetationOuvert, setVegetationOuvert] = useState(false);
  const [toitOuvert, setToitOuvert] = useState(false);

  // Handlers optimisés avec useCallback
  const handleOngletChange = useCallback((onglet) => {
    setOngletActif(onglet);
  }, []);

  const handleBatimentsToggle = useCallback(() => {
    setBatimentsOuvert(prev => !prev);
  }, []);

  const handleVegetationToggle = useCallback(() => {
    setVegetationOuvert(prev => !prev);
  }, []);

  const handleToitToggle = useCallback(() => {
    setToitOuvert(prev => !prev);
  }, []);

  return (
    <div className="panneau-lateral">
      {/* En-tête avec onglets */}
      <div className="tabs">
        <button 
          className={`tab ${ongletActif === 'outils' ? 'active' : ''}`}
          onClick={() => handleOngletChange('outils')}
        >
          ⚙️ Outils
        </button>
        <button 
          className={`tab ${ongletActif === 'config' ? 'active' : ''}`}
          onClick={() => handleOngletChange('config')}
        >
          📋 Config
        </button>
      </div>

      {/* Contenu selon onglet actif */}
      {ongletActif === 'config' ? (
        <SectionConfig
          couchesSol={couchesSol}
          onCouchesSolChange={onCouchesSolChange}
          objetSelectionne={objetSelectionne}
          onSupprimerObjet={onSupprimerObjet}
          onUpdateObjetProp={onUpdateObjetProp}
          toitOuvert={toitOuvert}
          setToitOuvert={setToitOuvert}
        />
      ) : (
        <SectionOutils
          imageFondChargee={imageFondChargee}
          onChargerImageFond={onChargerImageFond}
          onSupprimerImageFond={onSupprimerImageFond}
          opaciteImageFond={opaciteImageFond}
          onOpaciteImageFondChange={onOpaciteImageFondChange}
          onChargerPlanParDefaut={onChargerPlanParDefaut}
          batimentsOuvert={batimentsOuvert}
          setBatimentsOuvert={setBatimentsOuvert}
          onAjouterMaison={onAjouterMaison}
          onAjouterCiterne={onAjouterCiterne}
          onAjouterCaissonEau={onAjouterCaissonEau}
          onAjouterCanalisation={onAjouterCanalisation}
          onAjouterCloture={onAjouterCloture}
          onAjouterTerrasse={onAjouterTerrasse}
          onAjouterPaves={onAjouterPaves}
          vegetationOuvert={vegetationOuvert}
          setVegetationOuvert={setVegetationOuvert}
          onAjouterArbre={onAjouterArbre}
          onAjouterArbuste={onAjouterArbuste}
        />
      )}

      {/* Statistiques en bas */}
      <div className="section-header" style={{ marginTop: 'auto', borderTop: '1px solid #e0e0e0', paddingTop: '0.5rem' }}>
        <h3 className="section-title">📊 Statistiques</h3>
      </div>
      <div className="info-box info-box-info" style={{ fontSize: '0.8rem' }}>
        <div><strong>Total objets :</strong> {nbObjets}</div>
        <div><strong>Maisons :</strong> {nbMaisons}</div>
        <div><strong>Arbres :</strong> {nbArbres}</div>
        <div><strong>Structures :</strong> {nbCiterne + nbCaissonEau + nbCanalisation + nbCloture + nbTerrasse + nbPaves}</div>
      </div>
    </div>
  );
};

export default PanneauLateralRefactored;
