import { memo, useState, useCallback, useMemo } from 'react';
import UnifiedRenderer3D from './UnifiedRenderer3D';
import UnifiedControls from './UnifiedControls';
import { unifiedCache } from '../../utils/unified/UnifiedPlanSystem';

/**
 * Composant principal unifié pour la plage plan 2D/3D
 * Centralise toute la logique et les composants
 */

function UnifiedPlanViewer({ 
  planData,
  initialAnneeProjection = 0,
  initialSaison = 'ete',
  initialSolTransparent = true,
  className = '',
  style = {}
}) {
  
  const [anneeProjection, setAnneeProjection] = useState(initialAnneeProjection);
  const [saison, setSaison] = useState(initialSaison);
  const [solTransparent, setSolTransparent] = useState(initialSolTransparent);
  const [selectedObject, setSelectedObject] = useState(null);

  // Gestionnaire de changement de plan mémorisé
  const handlePlanDataChange = useCallback((newPlanData) => {
    // Ici on pourrait dispatcher une action Redux ou mettre à jour un contexte
    // Pour l'instant, on simule la mise à jour
    console.log('Plan data changed:', newPlanData);
  }, []);

  // Gestionnaire de sélection d'objet mémorisé
  const handleObjectSelect = useCallback((object) => {
    setSelectedObject(object);
  }, []);

  // Gestionnaire de modification d'objet mémorisé
  const handleObjectModify = useCallback((object, newProperties) => {
    console.log('Object modified:', object, newProperties);
    // Ici on pourrait mettre à jour le planData
  }, []);

  // Gestionnaire de suppression d'objet mémorisé
  const handleObjectDelete = useCallback((object) => {
    console.log('Object deleted:', object);
    setSelectedObject(null);
    // Ici on pourrait supprimer l'objet du planData
  }, []);

  // Configuration du rendu mémorisée
  const renderConfig = useMemo(() => ({
    anneeProjection,
    saison,
    solTransparent,
    onObjectSelect: handleObjectSelect,
    onObjectModify: handleObjectModify,
    onObjectDelete: handleObjectDelete
  }), [anneeProjection, saison, solTransparent, handleObjectSelect, handleObjectModify, handleObjectDelete]);

  // Configuration des contrôles mémorisée
  const controlsConfig = useMemo(() => ({
    anneeProjection,
    saison,
    solTransparent,
    onPlanDataChange: handlePlanDataChange
  }), [anneeProjection, saison, solTransparent, handlePlanDataChange]);

  // Nettoyage du cache à la destruction
  const handleCleanup = useCallback(() => {
    unifiedCache.clear();
  }, []);

  // Effet de nettoyage
  React.useEffect(() => {
    return handleCleanup;
  }, [handleCleanup]);

  if (!planData) {
    return (
      <div className={`unified-plan-viewer ${className}`} style={style}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          color: '#666'
        }}>
          Aucun plan chargé
        </div>
      </div>
    );
  }

  return (
    <div className={`unified-plan-viewer ${className}`} style={style}>
      {/* Rendu 3D */}
      <div className="renderer-container" style={{ flex: 1, position: 'relative' }}>
        <UnifiedRenderer3D
          planData={planData}
          {...renderConfig}
          className="main-renderer"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Contrôles */}
      <div className="controls-container" style={{ 
        position: 'absolute', 
        top: '10px', 
        right: '10px', 
        zIndex: 1000,
        maxWidth: '300px'
      }}>
        <UnifiedControls
          planData={planData}
          {...controlsConfig}
          className="main-controls"
        />
      </div>

      {/* Informations sur l'objet sélectionné */}
      {selectedObject && (
        <div className="object-info" style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '4px',
          maxWidth: '300px',
          zIndex: 1000
        }}>
          <h4>Objet sélectionné</h4>
          <p><strong>Type:</strong> {selectedObject.type}</p>
          <p><strong>Position:</strong> ({selectedObject.position?.[0]?.toFixed(2)}, {selectedObject.position?.[2]?.toFixed(2)})</p>
          {selectedObject.type === 'maison' && (
            <>
              <p><strong>Dimensions:</strong> {selectedObject.largeur?.toFixed(2)}m × {selectedObject.profondeur?.toFixed(2)}m</p>
              <p><strong>Hauteur:</strong> {selectedObject.hauteur?.toFixed(2)}m</p>
              <p><strong>Type de toit:</strong> {selectedObject.typeToit}</p>
            </>
          )}
          {selectedObject.type === 'arbre' && (
            <>
              <p><strong>Hauteur:</strong> {selectedObject.hauteur?.toFixed(2)}m</p>
              <p><strong>Envergure:</strong> {selectedObject.envergure?.toFixed(2)}m</p>
              <p><strong>Nom:</strong> {selectedObject.arbreData?.nom || 'Non spécifié'}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(UnifiedPlanViewer);
