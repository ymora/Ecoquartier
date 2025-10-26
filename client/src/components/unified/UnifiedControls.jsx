import { memo, useState, useCallback, useMemo } from 'react';
import { useUnifiedPlan } from '../../hooks/unified/useUnifiedPlan';

/**
 * Contrôles unifiés pour la plage plan 2D/3D
 * Centralise tous les contrôles communs
 */

function UnifiedControls({ 
  planData, 
  onPlanDataChange,
  anneeProjection = 0,
  saison = 'ete',
  solTransparent = true,
  className = '',
  style = {}
}) {
  
  const { data3D, selectedObject, handleObjectSelect, handleObjectModify, handleObjectDelete } = useUnifiedPlan(planData, {
    anneeProjection,
    saison,
    solTransparent
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Gestionnaires d'événements optimisés
  const handleAnneeChange = useCallback((event) => {
    const newAnnee = parseInt(event.target.value);
    if (onPlanDataChange) {
      onPlanDataChange({ ...planData, anneeProjection: newAnnee });
    }
  }, [planData, onPlanDataChange]);

  const handleSaisonChange = useCallback((event) => {
    const newSaison = event.target.value;
    if (onPlanDataChange) {
      onPlanDataChange({ ...planData, saison: newSaison });
    }
  }, [planData, onPlanDataChange]);

  const handleSolTransparentChange = useCallback((event) => {
    const newSolTransparent = event.target.checked;
    if (onPlanDataChange) {
      onPlanDataChange({ ...planData, solTransparent: newSolTransparent });
    }
  }, [planData, onPlanDataChange]);

  const handleObjectPropertyChange = useCallback((property, value) => {
    if (selectedObject && onPlanDataChange) {
      const updatedObject = { ...selectedObject, [property]: value };
      handleObjectModify(selectedObject, updatedObject);
      
      // Mettre à jour planData
      const updatedPlanData = { ...planData };
      if (selectedObject.type === 'maison') {
        updatedPlanData.maisons = updatedPlanData.maisons.map((maison, index) => 
          index === selectedObject.index ? updatedObject : maison
        );
      } else if (selectedObject.type === 'arbre') {
        updatedPlanData.arbres = updatedPlanData.arbres.map((arbre, index) => 
          index === selectedObject.index ? updatedObject : arbre
        );
      }
      
      onPlanDataChange(updatedPlanData);
    }
  }, [selectedObject, planData, onPlanDataChange, handleObjectModify]);

  const handleDeleteObject = useCallback(() => {
    if (selectedObject && onPlanDataChange) {
      handleObjectDelete(selectedObject);
      
      // Supprimer de planData
      const updatedPlanData = { ...planData };
      if (selectedObject.type === 'maison') {
        updatedPlanData.maisons = updatedPlanData.maisons.filter((_, index) => index !== selectedObject.index);
      } else if (selectedObject.type === 'arbre') {
        updatedPlanData.arbres = updatedPlanData.arbres.filter((_, index) => index !== selectedObject.index);
      }
      
      onPlanDataChange(updatedPlanData);
    }
  }, [selectedObject, planData, onPlanDataChange, handleObjectDelete]);

  // Options de saison mémorisées
  const saisonOptions = useMemo(() => [
    { value: 'printemps', label: 'Printemps' },
    { value: 'ete', label: 'Été' },
    { value: 'automne', label: 'Automne' },
    { value: 'hiver', label: 'Hiver' }
  ], []);

  // Propriétés de l'objet sélectionné mémorisées
  const objectProperties = useMemo(() => {
    if (!selectedObject) return null;

    const commonProps = {
      position: {
        x: selectedObject.position?.[0] || 0,
        y: selectedObject.position?.[1] || 0,
        z: selectedObject.position?.[2] || 0
      }
    };

    if (selectedObject.type === 'maison') {
      return {
        ...commonProps,
        largeur: selectedObject.largeur || 10,
        profondeur: selectedObject.profondeur || 8,
        hauteur: selectedObject.hauteur || 7,
        angle: selectedObject.angle || 0,
        typeToit: selectedObject.typeToit || '2pans',
        penteToit: selectedObject.penteToit || 30,
        orientationToit: selectedObject.orientationToit || 0
      };
    } else if (selectedObject.type === 'arbre') {
      return {
        ...commonProps,
        hauteur: selectedObject.hauteur || 6,
        envergure: selectedObject.envergure || 4,
        elevationSol: selectedObject.elevationSol || 0
      };
    }

    return commonProps;
  }, [selectedObject]);

  // Rendu des contrôles de propriétés mémorisé
  const propertyControls = useMemo(() => {
    if (!objectProperties) return null;

    return (
      <div className="property-controls">
        <h4>Propriétés de l'objet sélectionné</h4>
        
        {/* Position */}
        <div className="control-group">
          <label>Position X:</label>
          <input
            type="number"
            value={objectProperties.position.x}
            onChange={(e) => handleObjectPropertyChange('position', [
              parseFloat(e.target.value) || 0,
              objectProperties.position.y,
              objectProperties.position.z
            ])}
            step="0.1"
          />
        </div>
        
        <div className="control-group">
          <label>Position Z:</label>
          <input
            type="number"
            value={objectProperties.position.z}
            onChange={(e) => handleObjectPropertyChange('position', [
              objectProperties.position.x,
              objectProperties.position.y,
              parseFloat(e.target.value) || 0
            ])}
            step="0.1"
          />
        </div>

        {/* Propriétés spécifiques à la maison */}
        {selectedObject?.type === 'maison' && (
          <>
            <div className="control-group">
              <label>Largeur:</label>
              <input
                type="number"
                value={objectProperties.largeur}
                onChange={(e) => handleObjectPropertyChange('largeur', parseFloat(e.target.value) || 10)}
                step="0.1"
                min="1"
                max="50"
              />
            </div>
            
            <div className="control-group">
              <label>Profondeur:</label>
              <input
                type="number"
                value={objectProperties.profondeur}
                onChange={(e) => handleObjectPropertyChange('profondeur', parseFloat(e.target.value) || 8)}
                step="0.1"
                min="1"
                max="50"
              />
            </div>
            
            <div className="control-group">
              <label>Hauteur:</label>
              <input
                type="number"
                value={objectProperties.hauteur}
                onChange={(e) => handleObjectPropertyChange('hauteur', parseFloat(e.target.value) || 7)}
                step="0.1"
                min="1"
                max="20"
              />
            </div>
            
            <div className="control-group">
              <label>Angle:</label>
              <input
                type="number"
                value={objectProperties.angle}
                onChange={(e) => handleObjectPropertyChange('angle', parseFloat(e.target.value) || 0)}
                step="1"
                min="-180"
                max="180"
              />
            </div>
            
            <div className="control-group">
              <label>Type de toit:</label>
              <select
                value={objectProperties.typeToit}
                onChange={(e) => handleObjectPropertyChange('typeToit', e.target.value)}
              >
                <option value="2pans">2 pans</option>
                <option value="plat">Plat</option>
                <option value="monopente">Monopente</option>
              </select>
            </div>
            
            <div className="control-group">
              <label>Pente du toit:</label>
              <input
                type="number"
                value={objectProperties.penteToit}
                onChange={(e) => handleObjectPropertyChange('penteToit', parseFloat(e.target.value) || 30)}
                step="1"
                min="0"
                max="60"
              />
            </div>
            
            <div className="control-group">
              <label>Orientation du toit:</label>
              <input
                type="number"
                value={objectProperties.orientationToit}
                onChange={(e) => handleObjectPropertyChange('orientationToit', parseFloat(e.target.value) || 0)}
                step="1"
                min="0"
                max="360"
              />
            </div>
          </>
        )}

        {/* Propriétés spécifiques à l'arbre */}
        {selectedObject?.type === 'arbre' && (
          <>
            <div className="control-group">
              <label>Hauteur:</label>
              <input
                type="number"
                value={objectProperties.hauteur}
                onChange={(e) => handleObjectPropertyChange('hauteur', parseFloat(e.target.value) || 6)}
                step="0.1"
                min="1"
                max="30"
              />
            </div>
            
            <div className="control-group">
              <label>Envergure:</label>
              <input
                type="number"
                value={objectProperties.envergure}
                onChange={(e) => handleObjectPropertyChange('envergure', parseFloat(e.target.value) || 4)}
                step="0.1"
                min="1"
                max="20"
              />
            </div>
            
            <div className="control-group">
              <label>Élévation du sol:</label>
              <input
                type="number"
                value={objectProperties.elevationSol}
                onChange={(e) => handleObjectPropertyChange('elevationSol', parseFloat(e.target.value) || 0)}
                step="0.1"
                min="-5"
                max="5"
              />
            </div>
          </>
        )}

        {/* Bouton de suppression */}
        <button 
          className="delete-button"
          onClick={handleDeleteObject}
          style={{ 
            backgroundColor: '#f44336', 
            color: 'white', 
            border: 'none', 
            padding: '8px 16px', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Supprimer l'objet
        </button>
      </div>
    );
  }, [objectProperties, selectedObject, handleObjectPropertyChange, handleDeleteObject]);

  return (
    <div className={`unified-controls ${className}`} style={style}>
      {/* Bouton de basculement */}
      <button 
        className="toggle-button"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '10px'
        }}
      >
        {isExpanded ? 'Masquer les contrôles' : 'Afficher les contrôles'}
      </button>

      {isExpanded && (
        <div className="controls-content">
          {/* Contrôles globaux */}
          <div className="global-controls">
            <h3>Contrôles globaux</h3>
            
            <div className="control-group">
              <label>Année de projection:</label>
              <input
                type="number"
                value={anneeProjection}
                onChange={handleAnneeChange}
                min="0"
                max="50"
                step="1"
              />
            </div>
            
            <div className="control-group">
              <label>Saison:</label>
              <select value={saison} onChange={handleSaisonChange}>
                {saisonOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="control-group">
              <label>
                <input
                  type="checkbox"
                  checked={solTransparent}
                  onChange={handleSolTransparentChange}
                />
                Sol transparent
              </label>
            </div>
          </div>

          {/* Contrôles de l'objet sélectionné */}
          {propertyControls}
        </div>
      )}
    </div>
  );
}

export default memo(UnifiedControls);
