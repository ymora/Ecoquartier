import { useState, useEffect, useRef, memo } from 'react';
import plantesData from '../data/arbustesData';
import './PanneauLateral.css';
import {
  unhighlightSelection,
  highlightSelection
} from '../utils/canvas/highlightUtils';
import { ajouterCoucheSol, obtenirCouchesSol } from '../utils/canvas/couchesSolUtils';
import logger from '../utils/logger';

// Import des sous-composants
import Toolbar from './panneau-lateral/Toolbar';
import ObjectInspector from './panneau-lateral/ObjectInspector';
import TerrainManager from './panneau-lateral/TerrainManager';
import ObjectList from './panneau-lateral/ObjectList';
import PlanActions from './panneau-lateral/PlanActions';

/**
 * Panneau latéral refactorisé - Orchestrateur des sous-composants
 */
function PanneauLateral({
  canvas,
  couchesSol,
  onCouchesSolChange,
  echelle = 30,
  onDimensionsChange,
  imageFondChargee,
  opaciteImage,
  onAjouterMaison,
  onAjouterTerrasse,
  onAjouterPaves,
  onAjouterCanalisation,
  onAjouterCiterne,
  onAjouterCaissonEau,
  onAjouterCloture,
  onVerrouillerSelection,
  onSupprimerSelection,
  onEffacerTout,
  onChargerImageFond,
  onAjusterOpaciteImage,
  onSupprimerImageFond,
  onChoisirImageFondURL,
  onExporterPlan,
  onAjouterArbrePlante,
  onSyncKeyChange,
  ongletActifExterne = null
}) {
  const [ongletActif, setOngletActif] = useState('outils');
  const [objetSelectionne, setObjetSelectionne] = useState(null);
  const objetSelectionnePrecedentRef = useRef(null);

  useEffect(() => {
    if (ongletActifExterne) {
      setOngletActif(ongletActifExterne);
    }
  }, [ongletActifExterne]);

  const arbres = plantesData.filter(p => p.type === 'arbre');
  const arbustes = plantesData.filter(p => !p.type || p.type === 'arbuste');

  const handleAjouterCouche = (type, nom, profondeur, couleur) => {
    if (!canvas) return;
    const couche = ajouterCoucheSol(canvas, type, { nom, profondeur, couleur });
    if (couche) {
      onCouchesSolChange(obtenirCouchesSol(canvas));
      setOngletActif('config');
      logger.info('Couche', `✅ Couche ajoutée: ${nom}`);
    }
  };

  useEffect(() => {
    if (!canvas) return;

    const handleSelection = (e) => {
      const obj = e.selected?.[0];
      const validTypes = [
        'maison', 'citerne', 'caisson-eau', 'canalisation',
        'cloture', 'terrasse', 'paves', 'arbre-a-planter',
        'arbre-existant', 'maillage-relief'
      ];

      if (obj && validTypes.includes(obj.customType)) {
        if (objetSelectionnePrecedentRef.current) {
          unhighlightSelection(objetSelectionnePrecedentRef.current, canvas);
        }
        setObjetSelectionne(obj);
        objetSelectionnePrecedentRef.current = obj;
        highlightSelection(obj, canvas);
      } else {
        if (objetSelectionnePrecedentRef.current) {
          unhighlightSelection(objetSelectionnePrecedentRef.current, canvas);
        }
        setObjetSelectionne(null);
        objetSelectionnePrecedentRef.current = null;
      }
    };

    const handleDeselection = () => {
      if (objetSelectionnePrecedentRef.current) {
        unhighlightSelection(objetSelectionnePrecedentRef.current, canvas);
      }
      setObjetSelectionne(null);
      objetSelectionnePrecedentRef.current = null;
    };

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', handleDeselection);

    return () => {
      canvas.off('selection:created', handleSelection);
      canvas.off('selection:updated', handleSelection);
      canvas.off('selection:cleared', handleDeselection);
    };
  }, [canvas]);

  return (
    <div className="panneau-lateral">
      {/* Navigation Onglets */}
      <div className="tabs-unified" style={{ display: 'flex', background: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
        <button
          className={`tab-unified ${ongletActif === 'outils' ? 'active' : ''}`}
          onClick={() => setOngletActif('outils')}
          style={{
            flex: 1,
            padding: '0.8rem',
            background: ongletActif === 'outils' ? 'white' : 'transparent',
            border: 'none',
            borderBottom: ongletActif === 'outils' ? '2px solid #4caf50' : '2px solid transparent',
            fontWeight: 'bold',
            cursor: 'pointer',
            color: ongletActif === 'outils' ? '#2e7d32' : '#666'
          }}
        >
          ➕ Ajouter
        </button>
        <button
          className={`tab-unified ${ongletActif === 'config' ? 'active' : ''}`}
          onClick={() => setOngletActif('config')}
          style={{
            flex: 1,
            padding: '0.8rem',
            background: ongletActif === 'config' ? 'white' : 'transparent',
            border: 'none',
            borderBottom: ongletActif === 'config' ? '2px solid #2196f3' : '2px solid transparent',
            fontWeight: 'bold',
            cursor: 'pointer',
            color: ongletActif === 'config' ? '#1565c0' : '#666'
          }}
        >
          ⚙️ Réglages & Plan
        </button>
      </div>

      {/* Contenu Onglets */}
      <div className="panneau-outils-content">
        {ongletActif === 'outils' ? (
          <Toolbar
            arbres={arbres}
            arbustes={arbustes}
            onAjouterMaison={onAjouterMaison}
            onAjouterTerrasse={onAjouterTerrasse}
            onAjouterPaves={onAjouterPaves}
            onAjouterCloture={onAjouterCloture}
            onAjouterCanalisation={onAjouterCanalisation}
            onAjouterCiterne={onAjouterCiterne}
            onAjouterCaissonEau={onAjouterCaissonEau}
            onAjouterArbrePlante={onAjouterArbrePlante}
            handleAjouterCouche={handleAjouterCouche}
            onVerrouillerSelection={onVerrouillerSelection}
            onSupprimerSelection={onSupprimerSelection}
            onEffacerTout={onEffacerTout}
          />
        ) : (
          <>
            <ObjectList canvas={canvas} onExporterPlan={onExporterPlan} />

            {objetSelectionne && (
              <ObjectInspector
                objetSelectionne={objetSelectionne}
                canvas={canvas}
                echelle={echelle}
                onDimensionsChange={onDimensionsChange}
                onExporterPlan={onExporterPlan}
                onSyncKeyChange={onSyncKeyChange}
              />
            )}

            <TerrainManager
              canvas={canvas}
              couchesSol={couchesSol}
              onCouchesSolChange={onCouchesSolChange}
            />

            <PlanActions
              imageFondChargee={imageFondChargee}
              opaciteImage={opaciteImage}
              onChargerImageFond={onChargerImageFond}
              onAjusterOpaciteImage={onAjusterOpaciteImage}
              onSupprimerImageFond={onSupprimerImageFond}
              onChoisirImageFondURL={onChoisirImageFondURL}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default memo(PanneauLateral);
