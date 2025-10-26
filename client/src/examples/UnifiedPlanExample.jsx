import React, { useState, useCallback } from 'react';
import { UnifiedPlanViewer } from '../components/unified';

/**
 * Exemple d'utilisation du système unifié de plage plan 2D/3D
 * Montre comment utiliser tous les composants de manière optimisée
 */

function UnifiedPlanExample() {
  const [planData, setPlanData] = useState({
    maisons: [
      {
        left: 100,
        top: 100,
        width: 100,
        height: 80,
        angle: 0,
        hauteurBatiment: 7,
        profondeurFondations: 1.2,
        typeToit: '2pans',
        penteToit: 30,
        orientationToit: 0
      }
    ],
    arbres: [
      {
        left: 200,
        top: 150,
        width: 40,
        height: 40,
        arbreData: {
          nom: 'Chêne',
          tailleMaturite: '15m',
          feuillage: { type: 'Caduc' }
        },
        elevationSol: 0
      },
      {
        left: 300,
        top: 200,
        width: 30,
        height: 30,
        arbreData: {
          nom: 'Pin',
          tailleMaturite: '12m',
          feuillage: { type: 'Persistant' }
        },
        elevationSol: 0
      }
    ],
    citernes: [
      {
        left: 150,
        top: 250,
        width: 20,
        height: 20,
        profondeur: 2.5,
        elevationSol: 0
      }
    ]
  });

  const [anneeProjection, setAnneeProjection] = useState(0);
  const [saison, setSaison] = useState('ete');
  const [solTransparent, setSolTransparent] = useState(true);

  // Gestionnaire de changement de plan
  const handlePlanDataChange = useCallback((newPlanData) => {
    setPlanData(newPlanData);
  }, []);

  // Gestionnaire de sélection d'objet
  const handleObjectSelect = useCallback((object) => {
    console.log('Objet sélectionné:', object);
  }, []);

  // Gestionnaire de modification d'objet
  const handleObjectModify = useCallback((object, newProperties) => {
    console.log('Objet modifié:', object, newProperties);
  }, []);

  // Gestionnaire de suppression d'objet
  const handleObjectDelete = useCallback((object) => {
    console.log('Objet supprimé:', object);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* En-tête avec contrôles globaux */}
      <div style={{ 
        padding: '10px', 
        backgroundColor: '#f5f5f5', 
        borderBottom: '1px solid #ddd',
        display: 'flex',
        gap: '20px',
        alignItems: 'center'
      }}>
        <h1>Système Unifié de Plage Plan 2D/3D</h1>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label>
            Année de projection:
            <input
              type="number"
              value={anneeProjection}
              onChange={(e) => setAnneeProjection(parseInt(e.target.value) || 0)}
              min="0"
              max="50"
              style={{ marginLeft: '5px', width: '60px' }}
            />
          </label>
          
          <label>
            Saison:
            <select
              value={saison}
              onChange={(e) => setSaison(e.target.value)}
              style={{ marginLeft: '5px' }}
            >
              <option value="printemps">Printemps</option>
              <option value="ete">Été</option>
              <option value="automne">Automne</option>
              <option value="hiver">Hiver</option>
            </select>
          </label>
          
          <label>
            <input
              type="checkbox"
              checked={solTransparent}
              onChange={(e) => setSolTransparent(e.target.checked)}
            />
            Sol transparent
          </label>
        </div>
      </div>

      {/* Zone de rendu 3D */}
      <div style={{ flex: 1, position: 'relative' }}>
        <UnifiedPlanViewer
          planData={planData}
          initialAnneeProjection={anneeProjection}
          initialSaison={saison}
          initialSolTransparent={solTransparent}
          onPlanDataChange={handlePlanDataChange}
          onObjectSelect={handleObjectSelect}
          onObjectModify={handleObjectModify}
          onObjectDelete={handleObjectDelete}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Pied de page avec informations */}
      <div style={{ 
        padding: '10px', 
        backgroundColor: '#f9f9f9', 
        borderTop: '1px solid #ddd',
        fontSize: '12px',
        color: '#666'
      }}>
        <p>
          <strong>Système unifié optimisé:</strong> 
          Géométries mémorisées, matériaux en cache, calculs optimisés, 
          LOD adaptatif, validation automatique, contrôles unifiés.
        </p>
        <p>
          <strong>Objets dans le plan:</strong> 
          {planData.maisons?.length || 0} maisons, 
          {planData.arbres?.length || 0} arbres, 
          {planData.citernes?.length || 0} citernes
        </p>
      </div>
    </div>
  );
}

export default UnifiedPlanExample;
