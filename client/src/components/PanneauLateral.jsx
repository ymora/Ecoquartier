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
  onAjouterArbreExistant,
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
  
  // Gérer la sélection d'objets
  useEffect(() => {
    if (!canvas) return;
    
    const handleSelection = (e) => {
      const obj = e.selected?.[0];
      if (obj && (obj.customType === 'maison' || obj.customType === 'citerne' || 
                  obj.customType === 'caisson-eau' || obj.customType === 'canalisation' || 
                  obj.customType === 'cloture' || obj.customType === 'arbre-existant')) {
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
                  {objetSelectionne.customType === 'arbre-existant' && '🌳 Arbre existant'}
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
          {/* STRUCTURES */}
          <div className="section-title">🏗️ Structures</div>
          <div className="outils-stack">
            <button className="btn-outil-full" onClick={onAjouterMaison} title="Maison 10×10m, Hauteur 7m">
              🏠 Maison
            </button>
            <button className="btn-outil-full" onClick={onAjouterTerrasse} title="Terrasse 4×3m">
              🏡 Terrasse
            </button>
            <button className="btn-outil-full" onClick={onAjouterPaves} title="Pavés 5×5m">
              🟩 Pavés
            </button>
          </div>
          
          {/* RÉSEAUX */}
          <div className="section-title">🔧 Réseaux enterrés</div>
          <div className="outils-stack">
            <button className="btn-outil-full" onClick={onAjouterCanalisation} title="Canalisation (prof. 0.6m)">
              🚰 Canalisation
            </button>
            <button className="btn-outil-full" onClick={onAjouterCiterne} title="Citerne Ø1.5m (prof. 2.5m)">
              💧 Citerne
            </button>
            <button className="btn-outil-full" onClick={onAjouterCaissonEau} title="Caisson rétention 5×3×1m (15m³)">
              🟦 Caisson eau
            </button>
            <button className="btn-outil-full" onClick={onAjouterCloture} title="Clôture limite propriété">
              🚧 Clôture
            </button>
          </div>
          
          {/* VÉGÉTATION */}
          <div className="section-title">🌳 Végétation</div>
          <div className="outils-stack">
            <button className="btn-outil-full" onClick={onAjouterArbreExistant} title="Arbre déjà présent">
              🌳 Arbre existant
            </button>
          </div>
          
          {/* ARBRES À PLANTER */}
          <div className="section-title">🌸 Arbres à planter ({arbresAPlanter.length})</div>
          <div style={{ padding: '0.5rem', background: '#f5f5f5', borderRadius: '6px', marginBottom: '0.5rem' }}>
            <div style={{ 
              maxHeight: '300px', 
              overflowY: 'auto',
              marginBottom: '0.5rem',
              background: 'white',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}>
              {plantesData.map(plante => (
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
            
            {/* Liste des arbres ajoutés */}
            {arbresAPlanter.length > 0 && (
              <div style={{ 
                maxHeight: '200px', 
                overflowY: 'auto', 
                background: 'white', 
                padding: '0.3rem',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}>
                {arbresAPlanter.map((arbre, index) => (
                  <div 
                    key={`arbre-${arbre.id}-${index}`}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.3rem',
                      marginBottom: '0.2rem',
                      background: '#e8f5e9',
                      borderRadius: '4px',
                      fontSize: '0.75rem'
                    }}
                  >
                    <span style={{ flex: 1, fontWeight: '500' }}>
                      {arbre.name}
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
                        fontSize: '0.7rem'
                      }}
                      title="Retirer cet arbre"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* AFFICHAGE */}
          <div className="section-title">👁️ Affichage</div>
          <div className="outils-stack">
            <button 
              className="btn-outil-full" 
              onClick={onResetZoom} 
              title="Réinitialiser zoom et caméra (2D/3D)"
            >
              📷 Réinitialiser caméra
            </button>
          </div>
          
          {/* ACTIONS */}
          <div className="section-title">⚡ Actions</div>
          <div className="outils-stack">
            <button className="btn-outil-full" onClick={onVerrouillerSelection} title="Verrouiller">
              🔒 Verrouiller sélection
            </button>
            <button className="btn-outil-full btn-danger-full" onClick={onSupprimerSelection} title="Supprimer">
              🗑️ Supprimer sélection
            </button>
            <button className="btn-outil-full btn-danger-full" onClick={onEffacerTout} title="Effacer tout">
              ⚠️ Effacer tout
            </button>
            <button className="btn-outil-full btn-warning-full" onClick={onChargerPlanParDefaut} title="Charger plan par défaut personnalisé">
              🔄 Plan défaut
            </button>
            <button className="btn-outil-full btn-purple-full" onClick={onGenererLogCopiable} title="Générer log dans console (F12) pour créer config par défaut">
              📋 Log console
            </button>
          </div>
          
          {/* IMAGE DE FOND */}
          <div className="section-title">📷 Plan de fond</div>
          <div className="outils-stack">
            <button 
              className="btn-outil-full" 
              onClick={onChargerImageFond} 
              title="Charger plan cadastral, photo aérienne..."
            >
              📷 Charger image
            </button>
            {imageFondChargee && (
              <>
                <div style={{ padding: '0.5rem', background: '#e3f2fd', borderRadius: '6px' }}>
                  <label style={{ fontSize: '0.75rem', color: '#1976d2', fontWeight: 'bold' }}>
                    Opacité : {Math.round(opaciteImage * 100)}%
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
                  className="btn-outil-full btn-danger-full" 
                  onClick={onSupprimerImageFond} 
                  title="Retirer image"
                >
                  🗑️ Retirer image
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

// Optimisation : Éviter re-renders inutiles
export default memo(PanneauLateral);

