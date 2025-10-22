import { useState, useEffect, memo } from 'react';
import SolInteractif from './SolInteractif';
import plantesData from '../data/arbustesData';
import './PanneauLateral.css';

/**
 * Panneau latéral avec onglets pour outils et configuration
 */
function PanneauLateral({ 
  canvas,
  arbresAPlanter,
  couchesSol,
  onCouchesSolChange,
  dimensions,
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
  onChargerPlanParDefaut,
  onChargerImageFond,
  onAjusterOpaciteImage,
  onSupprimerImageFond,
  onResetZoom,
  onExporterPlan, // ✅ Ajout pour sauvegarder après modification
  onGenererLogCopiable, // ✅ Génération manuelle du log console
  onAjouterArbrePlante, // ✅ Ajouter un arbre à planter
  onRetirerArbrePlante // ✅ Retirer un arbre de la liste
}) {
  const [ongletActif, setOngletActif] = useState('outils');
  const [objetSelectionne, setObjetSelectionne] = useState(null);
  const [arbreSelectionne, setArbreSelectionne] = useState(plantesData[0].id);
  const [arbresOuvert, setArbresOuvert] = useState(false);
  const [arbustesOuvert, setArbustesOuvert] = useState(false);
  const [batimentsOuvert, setBatimentsOuvert] = useState(false);
  const [reseauxOuvert, setReseauxOuvert] = useState(false);
  const [actionsOuvert, setActionsOuvert] = useState(false);
  const [surPlanOuvert, setSurPlanOuvert] = useState(true); // Ouvert par défaut
  
  // Séparer arbres et arbustes
  const arbres = plantesData.filter(p => p.type === 'arbre');
  const arbustes = plantesData.filter(p => !p.type || p.type === 'arbuste');
  
  // Gérer la sélection d'objets
  useEffect(() => {
    if (!canvas) return;
    
    const handleSelection = (e) => {
      const obj = e.selected?.[0];
      if (obj && (obj.customType === 'maison' || obj.customType === 'citerne' || 
                  obj.customType === 'caisson-eau' || obj.customType === 'canalisation' || 
                  obj.customType === 'cloture')) {
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
          className={`tab-btn ${ongletActif === 'outils' ? 'active' : ''}`}
          onClick={() => setOngletActif('outils')}
        >
          🛠️ Outils
        </button>
        <button 
          className={`tab-btn ${ongletActif === 'config' ? 'active' : ''}`}
          onClick={() => setOngletActif('config')}
        >
          ⚙️ Config
        </button>
      </div>

      {/* Contenu selon onglet actif */}
      {ongletActif === 'config' ? (
        <div className="panneau-outils-content">
          {/* ✅ TERRAIN AUTO-CALCULÉ */}
          <div className="info-box">
            <div className="info-title">📐 Terrain auto-adaptatif</div>
            <div className="info-subtitle">
              Taille = objets les plus éloignés +5m
            </div>
          </div>
          
          {/* MAISON GLOBALE */}
          <div className="section-title">🏠 Maison (configuration globale)</div>
          <div className="config-stack">
            <div className="config-row">
              <label>Hauteur bâtiment</label>
              <input 
                type="number" 
                min="3" 
                max="15" 
                step="0.5"
                value={canvas?.getObjects().find(obj => obj.customType === 'maison')?.hauteurBatiment || 7}
                onChange={(e) => {
                  const maison = canvas?.getObjects().find(obj => obj.customType === 'maison');
                  if (maison) {
                    maison.set({ hauteurBatiment: parseFloat(e.target.value) });
                    canvas.requestRenderAll();
                    if (onExporterPlan) {
                      setTimeout(() => onExporterPlan(canvas), 100);
                    }
                  }
                }}
              />
              <span className="unit">m</span>
            </div>
            <div className="config-row">
              <label>Profondeur fondations</label>
              <input 
                type="number" 
                min="0.5" 
                max="3" 
                step="0.1"
                value={canvas?.getObjects().find(obj => obj.customType === 'maison')?.profondeurFondations || 1.2}
                onChange={(e) => {
                  const maison = canvas?.getObjects().find(obj => obj.customType === 'maison');
                  if (maison) {
                    maison.set({ profondeurFondations: parseFloat(e.target.value) });
                    canvas.requestRenderAll();
                    if (onExporterPlan) {
                      setTimeout(() => onExporterPlan(canvas), 100);
                    }
                  }
                }}
              />
              <span className="unit">m</span>
            </div>
          </div>
          
          {/* COMPOSITION DU SOL */}
          <div className="section-title">🌍 Composition du sol</div>
          <SolInteractif 
            couchesSol={couchesSol} 
            onCouchesSolChange={onCouchesSolChange} 
          />
          
          <div className="info-box" style={{ marginTop: '0.5rem' }}>
            📏 Profondeur totale : {couchesSol ? (couchesSol.reduce((sum, c) => sum + c.profondeur, 0) / 100).toFixed(2) : 0} m
          </div>
          
          {/* OBJET SÉLECTIONNÉ */}
          {objetSelectionne && (
            <>
              <div className="section-title">🎯 Objet sélectionné</div>
              <div className="info-box" style={{ background: '#fff3e0', borderColor: '#ff9800' }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                {objetSelectionne.customType === 'maison' && '🏠 Maison'}
                {objetSelectionne.customType === 'citerne' && '💧 Citerne'}
                  {objetSelectionne.customType === 'caisson-eau' && '🟦 Caisson eau'}
                {objetSelectionne.customType === 'canalisation' && '🚰 Canalisation'}
                {objetSelectionne.customType === 'cloture' && '🚧 Clôture'}
                  {objetSelectionne.customType === 'terrasse' && '🏡 Terrasse'}
                  {objetSelectionne.customType === 'paves' && '🟩 Pavés'}
                </div>
              </div>
              
              {objetSelectionne.customType === 'maison' && (
                <div className="config-stack">
                  <div className="config-row">
                    <label>Rotation</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="360" 
                      step="5"
                      value={Math.round(objetSelectionne.angle || 0)}
                      onChange={(e) => updateObjetProp('angle', e.target.value)}
                    />
                    <span className="unit">°</span>
                  </div>
                  <div className="config-row">
                    <label>Hauteur bâtiment</label>
                    <input 
                      type="number" 
                      min="3" 
                      max="15" 
                      step="0.5"
                      value={objetSelectionne.hauteurBatiment || 7}
                      onChange={(e) => updateObjetProp('hauteurBatiment', e.target.value)}
                    />
                    <span className="unit">m</span>
                  </div>
                  <div className="config-row">
                    <label>Prof. fondations</label>
                    <input 
                      type="number" 
                      min="0.5" 
                      max="3" 
                      step="0.1"
                      value={objetSelectionne.profondeurFondations || 1.2}
                      onChange={(e) => updateObjetProp('profondeurFondations', e.target.value)}
                    />
                    <span className="unit">m</span>
                  </div>
                </div>
              )}
              
              {objetSelectionne.customType === 'citerne' && (
                <div className="config-stack">
                  <div className="config-row">
                    <label>Diamètre</label>
                    <input 
                      type="number" 
                      min="0.5" 
                      max="3" 
                      step="0.1"
                      value={objetSelectionne.diametre || 1.5}
                      onChange={(e) => updateObjetProp('diametre', e.target.value)}
                    />
                    <span className="unit">m</span>
                  </div>
                  <div className="config-row">
                    <label>Profondeur</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="5" 
                      step="0.5"
                      value={objetSelectionne.profondeur || 2.5}
                      onChange={(e) => updateObjetProp('profondeur', e.target.value)}
                    />
                    <span className="unit">m</span>
                  </div>
                  <div className="info-box">
                    💧 Volume : {(Math.PI * Math.pow((objetSelectionne.diametre || 1.5) / 2, 2) * (objetSelectionne.profondeur || 2.5)).toFixed(1)}m³
                  </div>
                </div>
              )}
              
              {objetSelectionne.customType === 'caisson-eau' && (
                <div className="config-stack">
                  <div className="config-row">
                    <label>Rotation</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="360" 
                      step="5"
                      value={Math.round(objetSelectionne.angle || 0)}
                      onChange={(e) => updateObjetProp('angle', e.target.value)}
                    />
                    <span className="unit">°</span>
                  </div>
                  <div className="config-row">
                    <label>Largeur</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="10" 
                      step="0.5"
                      value={objetSelectionne.largeurCaisson || 5}
                      onChange={(e) => updateObjetProp('largeurCaisson', e.target.value)}
                    />
                    <span className="unit">m</span>
                  </div>
                  <div className="config-row">
                    <label>Profondeur</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="10" 
                      step="0.5"
                      value={objetSelectionne.profondeurCaisson || 3}
                      onChange={(e) => updateObjetProp('profondeurCaisson', e.target.value)}
                    />
                    <span className="unit">m</span>
                  </div>
                  <div className="config-row">
                    <label>Hauteur</label>
                    <input 
                      type="number" 
                      min="0.5" 
                      max="3" 
                      step="0.1"
                      value={objetSelectionne.hauteurCaisson || 1}
                      onChange={(e) => updateObjetProp('hauteurCaisson', e.target.value)}
                    />
                    <span className="unit">m</span>
                  </div>
                  <div className="config-row">
                    <label>Prof. enterrée</label>
                    <input 
                      type="number" 
                      min="0.5" 
                      max="3" 
                      step="0.1"
                      value={objetSelectionne.profondeurEnterree || 1}
                      onChange={(e) => updateObjetProp('profondeurEnterree', e.target.value)}
                    />
                    <span className="unit">m</span>
                  </div>
                  <div className="info-box">
                    💧 Volume : {((objetSelectionne.largeurCaisson || 5) * (objetSelectionne.profondeurCaisson || 3) * (objetSelectionne.hauteurCaisson || 1)).toFixed(1)}m³
                  </div>
                </div>
              )}
              
              {objetSelectionne.customType === 'terrasse' && (
                <div className="objet-controls">
                  <div className="dimension-control">
                    <label>Rotation (°)</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="360" 
                      step="5"
                      value={Math.round(objetSelectionne.angle || 0)}
                      onChange={(e) => updateObjetProp('angle', e.target.value)}
                    />
                  </div>
                  <div className="dimension-control">
                    <label>Hauteur dalle (m)</label>
                    <input 
                      type="number" 
                      min="0.1" 
                      max="1" 
                      step="0.05"
                      value={objetSelectionne.hauteurDalle || 0.15}
                      onChange={(e) => updateObjetProp('hauteurDalle', e.target.value)}
                    />
                  </div>
                  <div className="dimension-control">
                    <label>Prof. fondation (m)</label>
                    <input 
                      type="number" 
                      min="0.2" 
                      max="1" 
                      step="0.1"
                      value={objetSelectionne.profondeurFondation || 0.3}
                      onChange={(e) => updateObjetProp('profondeurFondation', e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              {objetSelectionne.customType === 'paves' && (
                <div className="objet-controls">
                  <div className="dimension-control">
                    <label>Rotation (°)</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="360" 
                      step="5"
                      value={Math.round(objetSelectionne.angle || 0)}
                      onChange={(e) => updateObjetProp('angle', e.target.value)}
                    />
                  </div>
                  <div className="dimension-control">
                    <label>Hauteur pavés (m)</label>
                    <input 
                      type="number" 
                      min="0.05" 
                      max="0.5" 
                      step="0.05"
                      value={objetSelectionne.hauteurPaves || 0.08}
                      onChange={(e) => updateObjetProp('hauteurPaves', e.target.value)}
                    />
                  </div>
                  <div className="dimension-control">
                    <label>Prof. gravier (m)</label>
                    <input 
                      type="number" 
                      min="0.1" 
                      max="0.5" 
                      step="0.05"
                      value={objetSelectionne.profondeurGravier || 0.15}
                      onChange={(e) => updateObjetProp('profondeurGravier', e.target.value)}
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
                    <label>Diamètre (m)</label>
                    <input 
                      type="number" 
                      min="0.05" 
                      max="0.5" 
                      step="0.05"
                      value={objetSelectionne.diametreCanalisation || 0.1}
                      onChange={(e) => updateObjetProp('diametreCanalisation', e.target.value)}
                    />
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
          {/* IMAGE DE FOND */}
          <div style={{ marginBottom: '0.5rem' }}>
            <button
              className="btn-outil-full"
              onClick={onChargerImageFond}
              title="Charger plan cadastral, photo aérienne..."
              style={{
                background: imageFondChargee ? '#4caf50' : '#2196f3',
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              📷 {imageFondChargee ? 'Image chargée' : 'Charger plan de fond'}
            </button>
            {imageFondChargee && (
              <div style={{ 
                marginTop: '0.3rem',
                background: 'white',
                borderRadius: '4px',
                border: '1px solid #ddd',
                padding: '0.5rem'
              }}>
                <label style={{ fontSize: '0.75rem', color: '#1976d2', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>
                  Opacité: {Math.round(opaciteImage * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={opaciteImage}
                  onChange={(e) => onAjusterOpaciteImage(parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
                <button
                  onClick={onSupprimerImageFond}
                  style={{
                    width: '100%',
                    marginTop: '0.3rem',
                    padding: '0.4rem',
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}
                >
                  🗑️ Supprimer image
                </button>
              </div>
            )}
          </div>
          
          {/* STRUCTURES */}
          <div style={{ marginBottom: '0.5rem' }}>
            <button
              onClick={() => setBatimentsOuvert(!batimentsOuvert)}
              style={{
                width: '100%',
                padding: '0.6rem',
                background: batimentsOuvert ? '#ff9800' : 'white',
                color: batimentsOuvert ? 'white' : '#333',
                border: '1px solid #ff9800',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s'
              }}
            >
              <span>🏗️ Structures (3)</span>
              <span style={{ fontSize: '1rem' }}>{batimentsOuvert ? '▼' : '▶'}</span>
            </button>
            {batimentsOuvert && (
              <div style={{ 
                marginTop: '0.3rem',
                background: 'white',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}>
                <button 
                  onClick={onAjouterMaison} 
                  title="Maison 10×10m, Hauteur 7m"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'white',
                    color: '#333',
                    border: 'none',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    textAlign: 'left',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f8e9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
              🏠 Maison
            </button>
                <button 
                  onClick={onAjouterTerrasse} 
                  title="Terrasse 4×3m"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'white',
                    color: '#333',
                    border: 'none',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    textAlign: 'left',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f8e9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
              🏡 Terrasse
            </button>
                <button 
                  onClick={onAjouterPaves} 
                  title="Pavés 5×5m"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'white',
                    color: '#333',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    textAlign: 'left',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f8e9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
              🟩 Pavés
            </button>
              </div>
            )}
          </div>
          
          {/* RÉSEAUX */}
          <div style={{ marginBottom: '0.5rem' }}>
            <button
              onClick={() => setReseauxOuvert(!reseauxOuvert)}
              style={{
                width: '100%',
                padding: '0.6rem',
                background: reseauxOuvert ? '#2196f3' : 'white',
                color: reseauxOuvert ? 'white' : '#333',
                border: '1px solid #2196f3',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s'
              }}
            >
              <span>🔧 Réseaux enterrés (4)</span>
              <span style={{ fontSize: '1rem' }}>{reseauxOuvert ? '▼' : '▶'}</span>
            </button>
            {reseauxOuvert && (
              <div style={{ 
                marginTop: '0.3rem',
                background: 'white',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}>
                <button 
                  onClick={onAjouterCanalisation} 
                  title="Canalisation (prof. 0.6m)"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'white',
                    color: '#333',
                    border: 'none',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    textAlign: 'left',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f8e9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
              🚰 Canalisation
            </button>
                <button 
                  onClick={onAjouterCiterne} 
                  title="Citerne Ø1.5m (prof. 2.5m)"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'white',
                    color: '#333',
                    border: 'none',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    textAlign: 'left',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f8e9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
              💧 Citerne
            </button>
                <button 
                  onClick={onAjouterCaissonEau} 
                  title="Caisson rétention 5×3×1m (15m³)"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'white',
                    color: '#333',
                    border: 'none',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    textAlign: 'left',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f8e9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  🟦 Caisson eau
                </button>
                <button 
                  onClick={onAjouterCloture} 
                  title="Clôture limite propriété"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'white',
                    color: '#333',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    textAlign: 'left',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f8e9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
              🚧 Clôture
            </button>
          </div>
            )}
          </div>
          
          {/* ARBRES ET ARBUSTES À PLANTER */}
          <div style={{ marginBottom: '0.5rem' }}>
            
            {/* ARBRES */}
            <div style={{ marginBottom: '0.5rem' }}>
            <button 
                onClick={() => setArbresOuvert(!arbresOuvert)}
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  background: arbresOuvert ? '#4caf50' : 'white',
                  color: arbresOuvert ? 'white' : '#333',
                  border: '1px solid #4caf50',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s'
                }}
              >
                <span>🌳 Arbres ({arbres.length})</span>
                <span style={{ fontSize: '1rem' }}>{arbresOuvert ? '▼' : '▶'}</span>
            </button>
              {arbresOuvert && (
                <div style={{ 
                  maxHeight: '250px', 
                  overflowY: 'auto',
                  marginTop: '0.3rem',
                  background: 'white',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}>
                  {arbres.map(plante => (
                    <div 
                      key={plante.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.4rem',
                        borderBottom: '1px solid #f0f0f0',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f1f8e9'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                      <span style={{ flex: 1, fontSize: '0.8rem', fontWeight: '500' }}>
                        {plante.name}
                      </span>
            <button 
                        onClick={() => onAjouterArbrePlante && onAjouterArbrePlante(plante)}
                        style={{
                          background: '#4caf50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        title={`Ajouter ${plante.name}`}
                      >
                        ➕
            </button>
                    </div>
                  ))}
                </div>
              )}
          </div>
          
            {/* ARBUSTES */}
            <div style={{ marginBottom: '0.5rem' }}>
            <button 
                onClick={() => setArbustesOuvert(!arbustesOuvert)}
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  background: arbustesOuvert ? '#8bc34a' : 'white',
                  color: arbustesOuvert ? 'white' : '#333',
                  border: '1px solid #8bc34a',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s'
                }}
              >
                <span>🌿 Arbustes ({arbustes.length})</span>
                <span style={{ fontSize: '1rem' }}>{arbustesOuvert ? '▼' : '▶'}</span>
            </button>
              {arbustesOuvert && (
                <div style={{ 
                  maxHeight: '250px', 
                  overflowY: 'auto',
                  marginTop: '0.3rem',
                  background: 'white',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}>
                  {arbustes.map(plante => (
                    <div 
                      key={plante.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.4rem',
                        borderBottom: '1px solid #f0f0f0',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f1f8e9'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                      <span style={{ flex: 1, fontSize: '0.8rem', fontWeight: '500' }}>
                        {plante.name}
                      </span>
            <button 
                        onClick={() => onAjouterArbrePlante && onAjouterArbrePlante(plante)}
                        style={{
                          background: '#8bc34a',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        title={`Ajouter ${plante.name}`}
                      >
                        ➕
            </button>
                    </div>
                  ))}
                </div>
              )}
          </div>
          
          </div>
          
          {/* Liste des éléments sur le plan - ACCORDÉON */}
          {(canvas && canvas.getObjects) && (() => {
            const objetsCanvas = canvas.getObjects().filter(obj => 
              obj.customType && 
              obj.customType !== 'arbre-a-planter' && // Les arbres à planter sont gérés séparément
              obj.customType !== 'arbre-existant' && // Arbres existants supprimés
              !obj.isGridLine && 
              !obj.isBoussole && 
              !obj.isImageFond &&
              !obj.measureLabel &&
              !obj.isLigneMesure
            );
            
            const nbObjets = objetsCanvas.length + arbresAPlanter.length;
            
            if (nbObjets === 0) return null;
            
            return (
              <div style={{ marginBottom: '0.5rem' }}>
                <button
                  onClick={() => setSurPlanOuvert(!surPlanOuvert)}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    background: surPlanOuvert ? '#4caf50' : 'white',
                    color: surPlanOuvert ? 'white' : '#333',
                    border: '1px solid #4caf50',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s'
                  }}
                >
                  <span>📦 Sur le plan ({nbObjets})</span>
                  <span style={{ fontSize: '1rem' }}>{surPlanOuvert ? '▼' : '▶'}</span>
                </button>
                {surPlanOuvert && (
                  <div style={{ 
                    marginTop: '0.3rem',
                    background: 'white',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}>
                    <div style={{ 
                      maxHeight: '200px', 
                      overflowY: 'auto'
                    }}>
                    {/* Arbres à planter */}
                    {arbresAPlanter.map((arbre, index) => (
                      <div 
                        key={`arbre-${arbre.id}-${index}`}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.3rem',
                          marginBottom: '0.2rem',
                          background: 'white',
                          borderRadius: '3px',
                          fontSize: '0.75rem',
                          border: '1px solid #c8e6c9'
                        }}
                      >
                        <span style={{ flex: 1, fontWeight: '500', color: '#333' }}>
                          🌸 {arbre.name}
                        </span>
                        <button 
                          onClick={() => onRetirerArbrePlante && onRetirerArbrePlante(index)}
                          style={{
                            background: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            padding: '0.2rem 0.4rem',
                            cursor: 'pointer',
                            fontSize: '0.7rem',
                            transition: 'transform 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          title="Retirer cet arbre"
                        >
                          🗑️
                        </button>
          </div>
                    ))}
                    
                    {/* Autres objets du canvas */}
                    {objetsCanvas.map((obj, index) => {
                      const icone = 
                        obj.customType === 'maison' ? '🏠' :
                        obj.customType === 'terrasse' ? '🪵' :
                        obj.customType === 'paves' ? '🌿' :
                        obj.customType === 'citerne' ? '💧' :
                        obj.customType === 'caisson-eau' ? '💦' :
                        obj.customType === 'canalisation' ? '🚰' :
                        obj.customType === 'cloture' ? '🚧' : '📦';
                      
                      const nom = 
                        obj.customType === 'maison' ? 'Maison' :
                        obj.customType === 'terrasse' ? 'Terrasse' :
                        obj.customType === 'paves' ? 'Pavés enherbés' :
                        obj.customType === 'citerne' ? 'Citerne' :
                        obj.customType === 'caisson-eau' ? 'Caisson eau' :
                        obj.customType === 'canalisation' ? 'Canalisation' :
                        obj.customType === 'cloture' ? 'Clôture' : `Type: ${obj.customType || 'inconnu'}`;
                      
                      return (
                        <div 
                          key={`objet-${obj.customType}-${index}`}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.3rem',
                            marginBottom: '0.2rem',
                            background: 'white',
                            borderRadius: '3px',
                            fontSize: '0.75rem',
                            border: '1px solid #e0e0e0'
                          }}
                        >
                          <span style={{ flex: 1, fontWeight: '500', color: '#333' }}>
                            {icone} {nom}
                          </span>
          <button 
                            onClick={() => {
                              canvas.remove(obj);
                              canvas.renderAll();
                              onExporterPlan && onExporterPlan(canvas);
                            }}
                            style={{
                              background: '#f44336',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              padding: '0.2rem 0.4rem',
                              cursor: 'pointer',
                              fontSize: '0.7rem',
                              transition: 'transform 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            title={`Supprimer ${nom}`}
                          >
                            🗑️
          </button>
              </div>
                      );
                    })}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
          
          {/* ACTIONS */}
          <div style={{ marginBottom: '0.5rem' }}>
              <button 
              onClick={() => setActionsOuvert(!actionsOuvert)}
              style={{
                width: '100%',
                padding: '0.6rem',
                background: actionsOuvert ? '#9c27b0' : 'white',
                color: actionsOuvert ? 'white' : '#333',
                border: '1px solid #9c27b0',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s'
              }}
            >
              <span>⚡ Actions & Plan (5)</span>
              <span style={{ fontSize: '1rem' }}>{actionsOuvert ? '▼' : '▶'}</span>
              </button>
            {actionsOuvert && (
              <div style={{ 
                marginTop: '0.3rem',
                background: 'white',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}>
                <button 
                  onClick={onVerrouillerSelection} 
                  title="Verrouiller"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'white',
                    color: '#333',
                    border: 'none',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    textAlign: 'left',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f8e9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  🔒 Verrouiller sélection
                </button>
                <button 
                  onClick={onSupprimerSelection} 
                  title="Supprimer"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'white',
                    color: '#f44336',
                    border: 'none',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    textAlign: 'left',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#ffebee'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  🗑️ Supprimer sélection
                </button>
                <button 
                  onClick={onEffacerTout} 
                  title="Effacer tout"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'white',
                    color: '#f44336',
                    border: 'none',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    textAlign: 'left',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#ffebee'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  ⚠️ Effacer tout
                </button>
                <button 
                  onClick={onChargerPlanParDefaut} 
                  title="Charger plan par défaut personnalisé"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'white',
                    color: '#ff9800',
                    border: 'none',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    textAlign: 'left',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fff3e0'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  🔄 Plan défaut
                </button>
                <button 
                  onClick={onGenererLogCopiable} 
                  title="Générer log dans console (F12) pour créer config par défaut"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'white',
                    color: '#9c27b0',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    textAlign: 'left',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f3e5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  📋 Log console
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

// Optimisation : Éviter re-renders inutiles
export default memo(PanneauLateral);

