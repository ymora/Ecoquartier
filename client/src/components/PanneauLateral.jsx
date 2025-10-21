import { useState, useEffect, memo } from 'react';
import DashboardTerrain from './DashboardTerrain';
import SolInteractif from './SolInteractif';
import './PanneauLateral.css';

/**
 * Panneau latéral avec onglets pour outils et statistiques
 */
function PanneauLateral({ 
  canvas,
  arbresAPlanter,
  couchesSol,
  onCouchesSolChange,
  dimensions,
  onDimensionsChange,
  ombreVisible,
  onToggleOmbre,
  timelineVisible,
  onToggleTimeline,
  snapMagnetiqueActif,
  onToggleSnapMagnetique,
  imageFondChargee,
  opaciteImage,
  onAjouterMaison,
  onAjouterTerrasse,
  onAjouterPaves,
  onAjouterCanalisation,
  onAjouterCiterne,
  onAjouterCloture,
  onAjouterArbreExistant,
  onVerrouillerSelection,
  onSupprimerSelection,
  onEffacerTout,
  onChargerImageFond,
  onAjusterOpaciteImage,
  onSupprimerImageFond,
  onResetZoom,
  onExporterPlan // ✅ Ajout pour sauvegarder après modification
}) {
  const [ongletActif, setOngletActif] = useState('config');
  const [objetSelectionne, setObjetSelectionne] = useState(null);
  
  // Gérer la sélection d'objets
  useEffect(() => {
    if (!canvas) return;
    
    const handleSelection = (e) => {
      const obj = e.selected?.[0];
      if (obj && (obj.customType === 'maison' || obj.customType === 'citerne' || 
                  obj.customType === 'canalisation' || obj.customType === 'cloture' ||
                  obj.customType === 'arbre-existant')) {
        setObjetSelectionne(obj);
      } else {
        setObjetSelectionne(null);
      }
    };
    
    const handleDeselection = () => {
      setObjetSelectionne(null);
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
  
  // ✅ FIXE : Mise à jour avec sauvegarde du plan
  const updateObjetProp = (prop, value) => {
    if (objetSelectionne && canvas) {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return;
      
      objetSelectionne.set({ [prop]: numValue });
      objetSelectionne.setCoords();
      canvas.requestRenderAll();
      
      // ✅ Déclencher la sauvegarde du plan
      if (onExporterPlan) {
        setTimeout(() => onExporterPlan(canvas), 100);
      }
    }
  };

  return (
    <div className="panneau-lateral">
      {/* En-tête avec onglets */}
      <div className="panneau-tabs">
        <button 
          className={`tab-btn ${ongletActif === 'config' ? 'active' : ''}`}
          onClick={() => setOngletActif('config')}
        >
          ⚙️ Config
        </button>
        <button 
          className={`tab-btn ${ongletActif === 'outils' ? 'active' : ''}`}
          onClick={() => setOngletActif('outils')}
        >
          🛠️ Outils
        </button>
        <button 
          className={`tab-btn ${ongletActif === 'stats' ? 'active' : ''}`}
          onClick={() => setOngletActif('stats')}
        >
          📊 Stats
        </button>
      </div>

      {/* Contenu selon onglet actif */}
      {ongletActif === 'stats' ? (
        <DashboardTerrain 
          canvas={canvas} 
          arbres={arbresAPlanter}
          couchesSol={couchesSol}
          onCouchesSolChange={null}
          ongletActif="stats"
        />
      ) : ongletActif === 'config' ? (
        <div className="panneau-outils-content">
          {/* DIMENSIONS DU TERRAIN */}
          <div className="section-title">📐 Terrain</div>
          <div className="dimensions-grid">
            <div className="dimension-control">
              <label>Largeur (m)</label>
              <input 
                type="number" 
                min="10" 
                max="100" 
                value={dimensions?.largeur || 30}
                onChange={(e) => onDimensionsChange?.({ ...dimensions, largeur: parseInt(e.target.value) })}
              />
            </div>
            <div className="dimension-control">
              <label>Profondeur (m)</label>
              <input 
                type="number" 
                min="10" 
                max="100" 
                value={dimensions?.hauteur || 30}
                onChange={(e) => onDimensionsChange?.({ ...dimensions, hauteur: parseInt(e.target.value) })}
              />
            </div>
          </div>
          
          <div className="terrain-info">
            📊 Surface : {((dimensions?.largeur || 30) * (dimensions?.hauteur || 30)).toFixed(0)} m²
          </div>
          
          {/* MAISON (Hauteur et Fondations) */}
          <div className="section-title">🏠 Maison</div>
          <div className="maison-controls">
            <div className="dimension-control">
              <label>Hauteur (m)</label>
              <input 
                type="number" 
                min="3" 
                max="15" 
                step="0.5"
                value={7}
                onChange={(e) => {
                  const maison = canvas?.getObjects().find(obj => obj.customType === 'maison');
                  if (maison) {
                    maison.set({ hauteurBatiment: parseFloat(e.target.value) });
                    canvas.requestRenderAll();
                  }
                }}
              />
            </div>
            <div className="dimension-control">
              <label>Fondations (m)</label>
              <input 
                type="number" 
                min="0.5" 
                max="3" 
                step="0.1"
                value={1.2}
                onChange={(e) => {
                  const maison = canvas?.getObjects().find(obj => obj.customType === 'maison');
                  if (maison) {
                    maison.set({ profondeurFondations: parseFloat(e.target.value) });
                    canvas.requestRenderAll();
                  }
                }}
              />
            </div>
          </div>
          
          {/* COMPOSITION DU SOL */}
          <div className="section-title">🌍 Sol</div>
          <SolInteractif 
            couchesSol={couchesSol} 
            onCouchesSolChange={onCouchesSolChange} 
          />
          
          <div className="sol-info">
            📏 Total : {couchesSol ? (couchesSol.reduce((sum, c) => sum + c.profondeur, 0) / 100).toFixed(2) : 0} m
          </div>
          
          {/* OBJET SÉLECTIONNÉ */}
          {objetSelectionne && (
            <>
              <div className="section-title">
                🎯 Objet sélectionné
              </div>
              <div className="objet-selectionne-header">
                {objetSelectionne.customType === 'maison' && '🏠 Maison'}
                {objetSelectionne.customType === 'citerne' && '💧 Citerne'}
                {objetSelectionne.customType === 'canalisation' && '🚰 Canalisation'}
                {objetSelectionne.customType === 'cloture' && '🚧 Clôture'}
                {objetSelectionne.customType === 'arbre-existant' && '🌳 Arbre existant'}
              </div>
              
              {objetSelectionne.customType === 'maison' && (
                <div className="objet-controls">
                  <div className="dimension-control">
                    <label>Hauteur (m)</label>
                    <input 
                      type="number" 
                      min="3" 
                      max="15" 
                      step="0.5"
                      value={objetSelectionne.hauteurBatiment || 7}
                      onChange={(e) => updateObjetProp('hauteurBatiment', e.target.value)}
                    />
                  </div>
                  <div className="dimension-control">
                    <label>Fondations (m)</label>
                    <input 
                      type="number" 
                      min="0.5" 
                      max="3" 
                      step="0.1"
                      value={objetSelectionne.profondeurFondations || 1.2}
                      onChange={(e) => updateObjetProp('profondeurFondations', e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              {objetSelectionne.customType === 'citerne' && (
                <div className="objet-controls">
                  <div className="dimension-control">
                    <label>Ø (m)</label>
                    <input 
                      type="number" 
                      min="0.5" 
                      max="3" 
                      step="0.1"
                      value={objetSelectionne.diametre || 1.5}
                      onChange={(e) => updateObjetProp('diametre', e.target.value)}
                    />
                  </div>
                  <div className="dimension-control">
                    <label>Profondeur (m)</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="5" 
                      step="0.5"
                      value={objetSelectionne.profondeur || 2.5}
                      onChange={(e) => updateObjetProp('profondeur', e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              {objetSelectionne.customType === 'canalisation' && (
                <div className="objet-controls">
                  <div className="dimension-control">
                    <label>Profondeur (m)</label>
                    <input 
                      type="number" 
                      min="0.3" 
                      max="2" 
                      step="0.1"
                      value={objetSelectionne.profondeur || 0.6}
                      onChange={(e) => updateObjetProp('profondeur', e.target.value)}
                    />
                  </div>
                  <div className="dimension-control">
                    <label>Type</label>
                    <select 
                      value={objetSelectionne.typeEvacuation || 'eaux-usees'}
                      onChange={(e) => {
                        objetSelectionne.set({ typeEvacuation: e.target.value });
                        canvas.requestRenderAll();
                      }}
                    >
                      <option value="eaux-usees">Eaux usées</option>
                      <option value="eaux-pluviales">Eaux pluviales</option>
                      <option value="drain">Drain</option>
                    </select>
                  </div>
                </div>
              )}
              
              {objetSelectionne.customType === 'cloture' && (
                <div className="objet-controls">
                  <div className="dimension-control">
                    <label>Hauteur (m)</label>
                    <input 
                      type="number" 
                      min="0.5" 
                      max="3" 
                      step="0.1"
                      value={objetSelectionne.hauteurCloture || 1.5}
                      onChange={(e) => updateObjetProp('hauteurCloture', e.target.value)}
                    />
                  </div>
                  <div className="objet-controls">
                    <div className="dimension-control">
                      <label>Épaisseur (cm)</label>
                      <input 
                        type="number" 
                        value={5}
                        disabled
                        style={{ background: '#f5f5f5', cursor: 'not-allowed' }}
                        title="Épaisseur fixe non modifiable"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* ✅ Arbre existant : 3 dimensions éditables */}
              {objetSelectionne.customType === 'arbre-existant' && (
                <div className="objet-controls">
                  <div className="dimension-control">
                    <label>Ø Couronne (m)</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="15" 
                      step="0.5"
                      value={objetSelectionne.diametreArbre || 5}
                      onChange={(e) => {
                        const newDiam = parseFloat(e.target.value);
                        const newRadius = (newDiam / 2) * canvas.getZoom() * 20; // Approximation échelle
                        objetSelectionne.set({ diametreArbre: newDiam });
                        // Redimensionner le cercle
                        if (objetSelectionne._objects && objetSelectionne._objects[0]) {
                          objetSelectionne._objects[0].set({ radius: newRadius });
                        }
                        objetSelectionne.setCoords();
                        canvas.requestRenderAll();
                        if (onExporterPlan) {
                          setTimeout(() => onExporterPlan(canvas), 100);
                        }
                      }}
                    />
                  </div>
                  <div className="dimension-control">
                    <label>Hauteur (m)</label>
                    <input 
                      type="number" 
                      min="2" 
                      max="30" 
                      step="0.5"
                      value={objetSelectionne.hauteurArbre || 8}
                      onChange={(e) => updateObjetProp('hauteurArbre', e.target.value)}
                    />
                  </div>
                  <div className="dimension-control">
                    <label>Prof. racines (m)</label>
                    <input 
                      type="number" 
                      min="0.5" 
                      max="5" 
                      step="0.5"
                      value={objetSelectionne.profondeurRacines || 2.5}
                      onChange={(e) => updateObjetProp('profondeurRacines', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ) : ongletActif === 'outils' ? (
        <div className="panneau-outils-content">
          {/* STRUCTURES */}
          <div className="section-title">🏗️ Structures</div>
          <div className="outils-grid">
            <button className="btn-outil-label" onClick={onAjouterMaison} title="Maison 10×10m, Hauteur 7m">
              🏠 Maison
            </button>
            <button className="btn-outil-label" onClick={onAjouterTerrasse} title="Terrasse 4×3m">
              🏡 Terrasse
            </button>
            <button className="btn-outil-label" onClick={onAjouterPaves} title="Pavés 5×5m">
              🟩 Pavés
            </button>
          </div>
          
          {/* RÉSEAUX */}
          <div className="section-title">🔧 Réseaux enterrés</div>
          <div className="outils-grid">
            <button className="btn-outil-label" onClick={onAjouterCanalisation} title="Canalisation (prof. 0.6m)">
              🚰 Canalisation
            </button>
            <button className="btn-outil-label" onClick={onAjouterCiterne} title="Citerne Ø1.5m (prof. 2.5m)">
              💧 Citerne
            </button>
            <button className="btn-outil-label" onClick={onAjouterCloture} title="Clôture limite propriété">
              🚧 Clôture
            </button>
          </div>
          
          {/* VÉGÉTATION */}
          <div className="section-title">🌳 Végétation</div>
          <div className="outils-grid">
            <button className="btn-outil-label" onClick={onAjouterArbreExistant} title="Arbre déjà présent">
              🌳 Arbre existant
            </button>
          </div>
          
          {/* AFFICHAGE */}
          <div className="section-title">👁️ Affichage</div>
          <div className="outils-grid">
            <button 
              className={`btn-outil ${ombreVisible ? 'btn-active' : ''}`} 
              onClick={onToggleOmbre} 
              title="Ombre maison selon saison"
            >
              🌗
            </button>
            <button 
              className={`btn-outil ${timelineVisible ? 'btn-active' : ''}`} 
              onClick={onToggleTimeline} 
              title={timelineVisible ? "Masquer la timeline" : "Afficher la timeline"}
            >
              {timelineVisible ? '📅' : '📅'}
            </button>
            <button 
              className={`btn-outil ${snapMagnetiqueActif ? 'btn-active' : ''}`} 
              onClick={onToggleSnapMagnetique} 
              title="Alignement magnétique"
            >
              🧲
            </button>
          </div>
          
          {/* NAVIGATION */}
          <div className="section-title">🔍 Navigation</div>
          <div className="navigation-aide">
            <div className="aide-ligne">🖱️ <strong>Molette</strong> : Zoom</div>
            <div className="aide-ligne">🖱️ <strong>Clic maintenu</strong> : Déplacer vue</div>
            <div className="aide-ligne">🔄 <strong>Sélectionner objet</strong> : Faire pivoter</div>
          </div>
          <div className="outils-grid">
            <button 
              className="btn-outil" 
              onClick={onResetZoom} 
              title="Réinitialiser zoom et position"
              style={{ gridColumn: 'span 3' }}
            >
              🔍 Réinitialiser vue
            </button>
          </div>
          
          {/* ACTIONS */}
          <div className="section-title">⚡ Actions</div>
          <div className="outils-grid">
            <button className="btn-outil btn-lock" onClick={onVerrouillerSelection} title="Verrouiller">🔒</button>
            <button className="btn-outil btn-danger" onClick={onSupprimerSelection} title="Supprimer">🗑️</button>
            <button className="btn-outil btn-danger" onClick={onEffacerTout} title="Effacer tout">⚠️</button>
          </div>
          
          {/* IMAGE DE FOND */}
          <div className="section-title">📷 Plan de fond</div>
          <button 
            className="btn-outil" 
            onClick={onChargerImageFond} 
            title="Charger plan cadastral, photo aérienne..." 
            style={{ gridColumn: 'span 3' }}
          >
            📷 Charger image
          </button>
          {imageFondChargee && (
            <>
              <div style={{ gridColumn: 'span 3', padding: '0.5rem', background: '#e3f2fd', borderRadius: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: '#1976d2', fontWeight: 'bold' }}>
                  Opacité image fond : {Math.round(opaciteImage * 100)}%
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05"
                  value={opaciteImage}
                  onChange={(e) => onAjusterOpaciteImage(parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
              <button 
                className="btn-outil btn-danger" 
                onClick={onSupprimerImageFond} 
                title="Retirer image" 
                style={{ gridColumn: 'span 3' }}
              >
                🗑️ Retirer
              </button>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

// Optimisation : Éviter re-renders inutiles
export default memo(PanneauLateral);

