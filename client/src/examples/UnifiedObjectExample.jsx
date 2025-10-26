import React, { useState, useCallback } from 'react';
import { useUnifiedObjectManager } from '../hooks/useUnifiedObjectManager';
import { ObjectFactory } from '../models/UnifiedObject';
import UnifiedObjectControls from '../components/UnifiedObjectControls';

/**
 * Exemple d'utilisation du système unifié
 * Démontre comment un seul objet gère les deux représentations
 */
const UnifiedObjectExample = () => {
  const [mode, setMode] = useState('2d'); // '2d' ou '3d'
  
  // ✅ Gestionnaire d'objets unifié
  const objectManager = useUnifiedObjectManager({
    echelle: 40,
    onSync: (timestamp) => console.log('Sync déclenchée:', timestamp),
    onExport: (data) => console.log('Export:', data)
  });

  /**
   * Ajouter une maison
   */
  const addMaison = useCallback(() => {
    const maison = ObjectFactory.createMaison({
      position: { x: 0, y: 0, z: 0 },
      dimensions: {
        largeur: 10,
        profondeur: 8,
        hauteur: 7
      },
      material: {
        typeToit: 'deux-pentes',
        couleur: '#f5e6d3'
      }
    });
    
    objectManager.addObject(maison);
  }, [objectManager]);

  /**
   * Ajouter une citerne
   */
  const addCiterne = useCallback(() => {
    const citerne = ObjectFactory.createCiterne({
      position: { x: 5, y: -2.5, z: 5 },
      dimensions: {
        diametre: 1.5,
        longueur: 2.5
      }
    });
    
    objectManager.addObject(citerne);
  }, [objectManager]);

  /**
   * Ajouter un arbre
   */
  const addArbre = useCallback(() => {
    const arbre = ObjectFactory.createArbre({
      position: { x: -5, y: 0, z: -5 },
      dimensions: {
        hauteur: 8,
        envergure: 5,
        profondeurRacines: 2.5
      },
      metadata: {
        arbreData: {
          name: 'Chêne',
          type: 'arbre'
        }
      }
    });
    
    objectManager.addObject(arbre);
  }, [objectManager]);

  /**
   * Mettre à jour l'objet sélectionné
   */
  const updateSelectedObject = useCallback((property, value) => {
    if (objectManager.selectedObject) {
      objectManager.updateObject(objectManager.selectedObject.id, {
        [property]: value
      });
    }
  }, [objectManager]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Système d'objets unifié 2D/3D</h1>
      
      {/* Contrôles de mode */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setMode('2d')}
          style={{ 
            background: mode === '2d' ? '#4caf50' : '#ccc',
            color: 'white',
            padding: '10px 20px',
            marginRight: '10px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Vue 2D
        </button>
        <button 
          onClick={() => setMode('3d')}
          style={{ 
            background: mode === '3d' ? '#4caf50' : '#ccc',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Vue 3D
        </button>
      </div>

      {/* Boutons d'ajout d'objets */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={addMaison} style={buttonStyle}>
          🏠 Ajouter Maison
        </button>
        <button onClick={addCiterne} style={buttonStyle}>
          💧 Ajouter Citerne
        </button>
        <button onClick={addArbre} style={buttonStyle}>
          🌳 Ajouter Arbre
        </button>
      </div>

      {/* Informations sur les objets */}
      <div style={{ marginBottom: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
        <h3>Objets ({objectManager.objectCount})</h3>
        {objectManager.objects.map(obj => (
          <div key={obj.id} style={{ marginBottom: '5px' }}>
            <strong>{obj.type}</strong> - Position: ({obj.position.x.toFixed(1)}, {obj.position.z.toFixed(1)})
            {obj.dimensions.largeur && ` - Largeur: ${obj.dimensions.largeur}m`}
            {obj.dimensions.diametre && ` - Diamètre: ${obj.dimensions.diametre}m`}
            <button 
              onClick={() => objectManager.selectObject(obj.id)}
              style={{ marginLeft: '10px', padding: '2px 8px', fontSize: '12px' }}
            >
              Sélectionner
            </button>
            <button 
              onClick={() => objectManager.removeObject(obj.id)}
              style={{ marginLeft: '5px', padding: '2px 8px', fontSize: '12px', background: '#f44336', color: 'white' }}
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>

      {/* Contrôles de l'objet sélectionné */}
      {objectManager.selectedObject && (
        <div style={{ padding: '10px', background: '#e3f2fd', borderRadius: '4px' }}>
          <h3>Objet sélectionné: {objectManager.selectedObject.type}</h3>
          <UnifiedObjectControls 
            objet={objectManager.selectedObject}
            canvas={null}
            echelle={40}
            onSync={() => {}}
            onExport={() => {}}
          />
        </div>
      )}

      {/* Zone de rendu (simulée) */}
      <div style={{ 
        marginTop: '20px', 
        padding: '20px', 
        background: '#fff', 
        border: '2px dashed #ccc',
        borderRadius: '4px',
        textAlign: 'center'
      }}>
        <h3>Zone de rendu {mode.toUpperCase()}</h3>
        <p>Ici serait rendu le canvas 2D ou la scène 3D</p>
        <p>Mode actuel: <strong>{mode}</strong></p>
        <p>Objets à rendre: <strong>{objectManager.objectCount}</strong></p>
      </div>
    </div>
  );
};

const buttonStyle = {
  background: '#2196f3',
  color: 'white',
  padding: '10px 15px',
  marginRight: '10px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default UnifiedObjectExample;
