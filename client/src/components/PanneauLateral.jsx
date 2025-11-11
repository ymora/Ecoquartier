import { useState, useEffect, useRef, memo } from 'react';
import SolInteractif from './SolInteractif';
import plantesData from '../data/arbustesData';
import './PanneauLateral.css';
import { 
  highlightHover, 
  unhighlightHover, 
  highlightSelection, 
  unhighlightSelection 
} from '../utils/canvas/highlightUtils';
import { mettreAJourCouchesSol, modifierElevationNoeudsSelectionnes, deselectionnerTousLesNoeuds, modifierToutLeMaillage } from '../utils/canvas/terrainUtils';
import { chargerPlanJSONAvecExplorateur } from '../utils/fileLoader';
import { canvasOperations } from '../utils/canvas/canvasOperations';
import { getInfoOmbreArbre } from '../utils/canvas/ombreArbre';
import logger from '../utils/logger';

/**
 * Panneau latéral avec onglets pour outils et configuration
 */
function PanneauLateral({ 
  canvas,
  couchesSol,
  onCouchesSolChange,
  echelle = 30, // Échelle par défaut (30 pixels = 1 mètre)
  onDimensionsChange,
  imageFondChargee,
  opaciteImage,
  onAjouterTerrain,
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
  onExporterPlan,
  onAjouterArbrePlante,
  onSyncKeyChange,
  ongletActifExterne = null
}) {
  const [ongletActif, setOngletActif] = useState('outils');
  const [objetSelectionne, setObjetSelectionne] = useState(null);
  const [revisionMaillage, setRevisionMaillage] = useState(0); // ✅ Force mise à jour quand nœuds changent
  const [arbresOuvert, setArbresOuvert] = useState(false);
  const [arbustesOuvert, setArbustesOuvert] = useState(false);
  const [batimentsOuvert, setBatimentsOuvert] = useState(false);
  const [solOuvert, setSolOuvert] = useState(false);
  const [reseauxOuvert, setReseauxOuvert] = useState(false);
  const [actionsOuvert, setActionsOuvert] = useState(false);
  const [surPlanOuvert, setSurPlanOuvert] = useState(true); // Ouvert par défaut
  
  // États pour sections repliables dans Config
  const [dimensionsOuvert, setDimensionsOuvert] = useState(true);
  const [positionOuvert, setPositionOuvert] = useState(true);
  const [toitOuvert, setToitOuvert] = useState(true);
  
  // Ref pour stocker l'objet précédemment sélectionné (évite boucle infinie)
  const objetSelectionnePrecedentRef = useRef(null);
  
  useEffect(() => {
    if (ongletActifExterne) {
      setOngletActif(ongletActifExterne);
    }
  }, [ongletActifExterne]);
  
  // Séparer arbres et arbustes
  const arbres = plantesData.filter(p => p.type === 'arbre');
  const arbustes = plantesData.filter(p => !p.type || p.type === 'arbuste');
  
  const styles = {
    boutonSection: (ouvert, couleur) => ({
      width: '100%',
      padding: '0.6rem',
      background: ouvert ? couleur : 'white',
      color: ouvert ? 'white' : '#333',
      border: `1px solid ${couleur}`,
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '0.85rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'all 0.2s'
    }),
    conteneurListe: {
      marginTop: '0.3rem',
      background: 'white',
      borderRadius: '4px',
      border: '1px solid #ddd'
    },
    boutonListe: {
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
    },
    boutonListeDernier: {
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
    },
    boutonSupprimer: {
      background: '#f44336',
      color: 'white',
      border: 'none',
      borderRadius: '3px',
      padding: '0.2rem 0.4rem',
      cursor: 'pointer',
      fontSize: '0.7rem',
      transition: 'transform 0.2s'
    },
    ligneObjet: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.3rem',
      marginBottom: '0.2rem',
      background: 'white',
      borderRadius: '3px',
      fontSize: '0.75rem',
      cursor: 'pointer'
    }
  };
  
  // Gérer la sélection d'objets
  useEffect(() => {
    if (!canvas) return;
    
    const handleSelection = (e) => {
      const obj = e.selected?.[0];
      if (obj && (obj.customType === 'maison' || obj.customType === 'citerne' || 
                  obj.customType === 'caisson-eau' || obj.customType === 'canalisation' || 
                  obj.customType === 'cloture' || obj.customType === 'terrasse' || 
                  obj.customType === 'paves' || obj.customType === 'arbre-a-planter' ||
                  obj.customType === 'arbre-existant' || obj.customType === 'sol')) {
        // Retirer la mise en évidence de l'objet précédent s'il y en a un
        if (objetSelectionnePrecedentRef.current) {
          unhighlightSelection(objetSelectionnePrecedentRef.current, canvas);
        }
        setObjetSelectionne(obj);
        objetSelectionnePrecedentRef.current = obj;
        // Mettre en évidence visuellement l'objet sélectionné (vert)
        highlightSelection(obj, canvas);
        // ✅ Ne PAS basculer automatiquement sur Config
      } else {
        // Retirer la mise en évidence de l'objet précédent
        if (objetSelectionnePrecedentRef.current) {
          unhighlightSelection(objetSelectionnePrecedentRef.current, canvas);
        }
        setObjetSelectionne(null);
        objetSelectionnePrecedentRef.current = null;
      }
    };
    
    const handleDeselection = () => {
      // Retirer la mise en évidence de l'objet précédent
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
  
  const updateObjetProp = (prop, value) => {
    if (objetSelectionne && canvas) {
      if (prop === 'typeToit') {
        objetSelectionne.set({ [prop]: value });
        // Définir la pente par défaut selon le type de toit
        const penteDefaut = value === 'monopente' ? 2 : value === 'deux-pentes' ? 15 : 3;
        objetSelectionne.set({ penteToit: penteDefaut });
      } else {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return;
        objetSelectionne.set({ [prop]: numValue });
        
        // ✅ Mettre à jour les dimensions visuelles pour les objets rectangulaires
        if ((prop === 'largeur' || prop === 'profondeur') && 
            (objetSelectionne.customType === 'maison' || 
             objetSelectionne.customType === 'terrasse' || 
             objetSelectionne.customType === 'paves' || 
             objetSelectionne.customType === 'caisson-eau')) {
          
          // Objets rectangulaires = Groups avec un rect interne
          // Essayer plusieurs méthodes pour trouver le rect
          let rect = null;
          if (objetSelectionne._objects) {
            rect = objetSelectionne._objects.find(o => o.type === 'rect');
          }
          if (!rect && objetSelectionne.getObjects) {
            rect = objetSelectionne.getObjects().find(o => o.type === 'rect');
          }
          
          if (rect) {
            // Récupérer les dimensions depuis l'objet (déjà mises à jour par set() plus haut)
            const largeur = objetSelectionne.largeur || 5;
            const profondeur = objetSelectionne.profondeur || 3;
            
            // Mettre à jour les dimensions du rectangle interne en pixels
            rect.set({
              width: largeur * echelle,
              height: profondeur * echelle,
              originX: 'center',
              originY: 'center'
            });
            
            // Mettre à jour aussi l'icône si nécessaire (pour qu'elle reste proportionnelle)
            const texte = objetSelectionne._objects?.find(o => o.type === 'text') || 
                          (objetSelectionne.getObjects ? objetSelectionne.getObjects().find(o => o.type === 'text') : null);
            if (texte) {
              const tailleIcone = Math.min(largeur * echelle, profondeur * echelle) * 0.4;
              texte.set({
                fontSize: Math.max(tailleIcone, 24),
                originX: 'center',
                originY: 'center'
              });
            }
            
            // Forcer le recalcul des bounds du Group
            if (objetSelectionne._calcBounds) {
              objetSelectionne._calcBounds();
            }
            objetSelectionne.setCoords();
          }
        }
      }
      
      objetSelectionne.setCoords();
      canvas.requestRenderAll();
      
      if (onSyncKeyChange) {
        onSyncKeyChange(Date.now());
      }
      
      canvas.fire('object:modified', { target: objetSelectionne });
      
      if (onExporterPlan) {
        setTimeout(() => onExporterPlan(canvas), 100);
      }
    }
  };

  const renderNumberInput = (label, value, onChange, min, max, step, unit = 'm', disabled = false) => {
    const isDisabled = disabled || (min === max && value === min.toString());
    
    return (
      <div className="config-row">
        <label>{label}</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <button
            type="button"
            onClick={() => {
              if (isDisabled) return;
              const normalizedValue = typeof value === 'string' ? parseFloat(value) : value;
              const currentValue = isNaN(normalizedValue) ? min : normalizedValue;
              const newValue = Math.max(min, currentValue - step);
              console.log(`🔽 Bouton "-" : ${label} : ${currentValue} - ${step} = ${newValue}`);
              onChange({ target: { value: newValue.toString() } });
            }}
            disabled={isDisabled}
            style={{
              background: isDisabled ? '#e0e0e0' : '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              width: '33px',
              height: '33px',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              opacity: isDisabled ? 0.5 : 1
            }}
          >
            −
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <input 
              type="text" 
              value={value}
              onChange={onChange}
              disabled={isDisabled}
              style={{ 
                width: '60px', 
                minWidth: '50px', 
                flexShrink: 1,
                background: isDisabled ? '#f5f5f5' : 'white',
                cursor: isDisabled ? 'not-allowed' : 'text'
              }}
            />
            <span style={{ fontSize: '0.75rem', color: '#888', fontWeight: '600', flexShrink: 0 }}>{unit}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (isDisabled) return;
              const normalizedValue = typeof value === 'string' ? parseFloat(value) : value;
              const currentValue = isNaN(normalizedValue) ? min : normalizedValue;
              const newValue = Math.min(max, currentValue + step);
              console.log(`🔼 Bouton "+" : ${label} : ${currentValue} + ${step} = ${newValue}`);
              onChange({ target: { value: newValue.toString() } });
            }}
            disabled={isDisabled}
            style={{
              background: isDisabled ? '#e0e0e0' : '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              width: '33px',
              height: '33px',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              opacity: isDisabled ? 0.5 : 1
            }}
          >
            +
          </button>
        </div>
      </div>
    );
  };

  const renderDimensionInput = (label, prop, min, max, step) => {
    const getValue = () => {
      if (prop === 'width') {
        return ((objetSelectionne.getScaledWidth ? objetSelectionne.getScaledWidth() : objetSelectionne.width) / echelle).toFixed(2);
      } else {
        return ((objetSelectionne.getScaledHeight ? objetSelectionne.getScaledHeight() : objetSelectionne.height) / echelle).toFixed(2);
      }
    };
    
    const handleChange = (e) => {
      const value = parseFloat(e.target.value);
      
      if (objetSelectionne.type === 'group') {
        // Pour les groupes (pavés, terrasses, etc.), mettre à jour les éléments internes
        const objects = objetSelectionne.getObjects();
        objects.forEach(obj => {
          if (obj.type === 'rect') {
            if (prop === 'width') {
              obj.set({ width: value * echelle });
            } else {
              obj.set({ height: value * echelle });
            }
          } else if (obj.type === 'text') {
            // Ajuster la taille de l'icône proportionnellement
            const newSize = Math.min(value * echelle * 0.4, value * echelle * 0.4);
            obj.set({ fontSize: Math.max(newSize, 24) });
          }
        });
        
        // Mettre à jour les propriétés personnalisées du groupe
        if (prop === 'width') {
          objetSelectionne.set({ 
            width: value * echelle,
            largeur: value  // Propriété personnalisée pour les pavés/terrasses
          });
        } else {
          objetSelectionne.set({ 
            height: value * echelle,
            profondeur: value  // Propriété personnalisée pour les pavés/terrasses
          });
        }
      } else {
        // Pour les objets simples
        if (prop === 'width') {
          objetSelectionne.set({ width: value * echelle });
        } else {
          objetSelectionne.set({ height: value * echelle });
        }
      }
      
      objetSelectionne.setCoords();
      canvas.requestRenderAll();
      canvas.fire('object:modified', { target: objetSelectionne });
      
      // ✅ Mettre à jour les dimensions du terrain si nécessaire
      if (onDimensionsChange) {
        // Calculer les nouvelles dimensions basées sur tous les objets
        const objets = canvas.getObjects().filter(obj => 
          obj.customType && 
          obj.customType !== 'grille' && 
          obj.customType !== 'boussole' && 
          obj.customType !== 'indicateur-sud' &&
          obj.customType !== 'aide-button' &&
          obj.customType !== 'dimension-box' &&
          obj.customType !== 'center-mark'
        );
        
        if (objets.length > 0) {
          let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
          
          objets.forEach(obj => {
            const left = obj.left - (obj.getScaledWidth ? obj.getScaledWidth() : obj.width) / 2;
            const right = obj.left + (obj.getScaledWidth ? obj.getScaledWidth() : obj.width) / 2;
            const top = obj.top - (obj.getScaledHeight ? obj.getScaledHeight() : obj.height) / 2;
            const bottom = obj.top + (obj.getScaledHeight ? obj.getScaledHeight() : obj.height) / 2;
            
            minX = Math.min(minX, left);
            maxX = Math.max(maxX, right);
            minY = Math.min(minY, top);
            maxY = Math.max(maxY, bottom);
          });
          
          // Convertir en mètres
          const largeur = Math.max((maxX - minX) / echelle, 10); // Minimum 10m
          const hauteur = Math.max((maxY - minY) / echelle, 10); // Minimum 10m
          
          onDimensionsChange({ largeur, hauteur });
        }
      }
      
      // Force la mise à jour visuelle des dimensions
    };
    
    return renderNumberInput(label, getValue(), handleChange, min, max, step, 'm');
  };

  return (
    <div className="panneau-lateral">
      {/* Boutons de chargement - TOUJOURS VISIBLES - Thème unifié */}
        
      {/* En-tête avec onglets */}
      <div className="tabs-unified">
        <button
          className={`tab-unified ${ongletActif === 'outils' ? 'active' : ''}`}
          onClick={() => setOngletActif('outils')}
        >
          ⚙️ Outils
        </button>
        <button
          className={`tab-unified ${ongletActif === 'config' ? 'active' : ''}`}
          onClick={() => setOngletActif('config')}
        >
          📋 Config
        </button>
      </div>

      {/* Contenu selon onglet actif */}
      {ongletActif === 'config' ? (
        <div className="panneau-outils-content">
          {/* ✅ LISTE DES OBJETS SUR LE PLAN */}
          {(canvas && canvas.getObjects) && (() => {
            const objetsCanvas = canvas.getObjects().filter(obj => 
              obj.customType && 
              obj.customType !== 'arbre-a-planter' && 
              obj.customType !== 'arbre-existant' &&
              !obj.isGridLine && 
              !obj.isBoussole && 
              !obj.isImageFond &&
              !obj.measureLabel &&
              !obj.isLigneMesure
            );
            
            const nbObjets = objetsCanvas.length;
            
            if (nbObjets === 0) return null;
            
            return (
              <div style={{ marginBottom: '1rem' }}>
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
                      {objetsCanvas.map((obj, index) => {
                        const icone = 
                          obj.customType === 'maison' ? '🏠' :
                          obj.customType === 'terrasse' ? '🪵' :
                          obj.customType === 'paves' ? '🌿' :
                          obj.customType === 'citerne' ? '💧' :
                          obj.customType === 'caisson-eau' ? '💦' :
                          obj.customType === 'canalisation' ? '🚰' :
                          obj.customType === 'cloture' ? '🚧' :
                          obj.customType === 'sol' ? '🌍' : '📦';
                        
                        const nom = 
                          obj.customType === 'maison' ? 'Maison' :
                          obj.customType === 'terrasse' ? 'Terrasse' :
                          obj.customType === 'paves' ? 'Pavés enherbés' :
                          obj.customType === 'citerne' ? 'Citerne' :
                          obj.customType === 'caisson-eau' ? 'Caisson eau' :
                          obj.customType === 'canalisation' ? 'Canalisation' :
                          obj.customType === 'cloture' ? 'Clôture' :
                          obj.customType === 'sol' ? 'Terrain' : `Type: ${obj.customType || 'inconnu'}`;
                        
                        return (
                          <div 
                            key={`objet-${obj.customType}-${index}`}
                            onClick={() => {
                              canvas.setActiveObject(obj);
                              canvas.renderAll();
          }}
          onMouseEnter={(e) => {
                              highlightHover(obj, canvas);
                              e.currentTarget.style.borderColor = '#4caf50';
                              e.currentTarget.style.background = '#f1f8e9';
          }}
          onMouseLeave={(e) => {
                              unhighlightHover(obj, canvas);
                              e.currentTarget.style.borderColor = '#e0e0e0';
                              e.currentTarget.style.background = 'white';
          }}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '0.5rem',
                              marginBottom: '0.2rem',
            background: 'white',
                              borderRadius: '3px',
                              fontSize: '0.75rem',
                              border: '1px solid #e0e0e0',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            <span style={{ flex: 1, fontWeight: '500', color: '#333' }}>
                              {icone} {nom}
                            </span>
            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                canvasOperations.supprimer(canvas, obj);
                                canvasOperations.rendre(canvas);
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
          
          {/* OBJET SÉLECTIONNÉ */}
          {objetSelectionne && (
            <>
              <div className="section-title">🎯 Objet sélectionné</div>
              <div className="info-box" style={{ background: '#fff3e0', borderColor: '#ff9800' }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                {objetSelectionne.customType === 'maison' && `🏠 Maison${objetSelectionne.numero ? ` #${objetSelectionne.numero}` : ''}`}
                {objetSelectionne.customType === 'citerne' && `💧 Citerne${objetSelectionne.numero ? ` #${objetSelectionne.numero}` : ''}`}
                  {objetSelectionne.customType === 'caisson-eau' && `🟦 Caisson eau${objetSelectionne.numero ? ` #${objetSelectionne.numero}` : ''}`}
                {objetSelectionne.customType === 'canalisation' && `🚰 Canalisation${objetSelectionne.numero ? ` #${objetSelectionne.numero}` : ''}`}
                {objetSelectionne.customType === 'cloture' && `🚧 Clôture${objetSelectionne.numero ? ` #${objetSelectionne.numero}` : ''}`}
                  {objetSelectionne.customType === 'terrasse' && `🏡 Terrasse${objetSelectionne.numero ? ` #${objetSelectionne.numero}` : ''}`}
                  {objetSelectionne.customType === 'paves' && `🟩 Pavés${objetSelectionne.numero ? ` #${objetSelectionne.numero}` : ''}`}
                  {objetSelectionne.customType === 'arbre-a-planter' && `🌳 ${objetSelectionne.arbreData?.name || 'Arbre'}${objetSelectionne.numero ? ` #${objetSelectionne.numero}` : ''}`}
                  {objetSelectionne.customType === 'arbre-existant' && `🌳 Arbre existant${objetSelectionne.numero ? ` #${objetSelectionne.numero}` : ''}`}
                  {objetSelectionne.customType === 'sol' && '🌍 Sol'}
                </div>
              </div>
              
              {objetSelectionne.customType === 'maison' && (
                <>
                  {/* POSITION */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => setPositionOuvert(!positionOuvert)}
                      style={styles.boutonSection(positionOuvert, '#2196f3')}
                    >
                      <span>📍 Position</span>
                      <span style={{ fontSize: '1rem' }}>{positionOuvert ? '▼' : '▶'}</span>
                    </button>
                    {positionOuvert && (
                      <div style={styles.conteneurListe}>
                        {renderNumberInput(
                          'Rotation',
                          Math.round(objetSelectionne.angle || 0).toString(),
                          (e) => updateObjetProp('angle', e.target.value),
                          0, 360, 5, '°'
                        )}
                        {renderNumberInput(
                          'Élévation rel. sol',
                          (objetSelectionne.elevationSol || 0).toString(),
                          (e) => updateObjetProp('elevationSol', e.target.value),
                          -5, 10, 0.1, 'm'
                        )}
                      </div>
                    )}
                  </div>

                  {/* DIMENSIONS */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => setDimensionsOuvert(!dimensionsOuvert)}
                      style={styles.boutonSection(dimensionsOuvert, '#4caf50')}
                    >
                      <span>📏 Dimensions</span>
                      <span style={{ fontSize: '1rem' }}>{dimensionsOuvert ? '▼' : '▶'}</span>
                    </button>
                    {dimensionsOuvert && (
                      <div style={styles.conteneurListe}>
                        {renderDimensionInput('Largeur', 'width', 2, 30, 0.1)}
                        {renderDimensionInput('Profondeur', 'height', 2, 30, 0.1)}
                        {renderNumberInput(
                          'Hauteur',
                          (objetSelectionne.hauteur || 7).toString(),
                          (e) => updateObjetProp('hauteur', e.target.value),
                          3, 15, 0.5, 'm'
                        )}
                      </div>
                    )}
                  </div>

                  {/* TYPE DE TOIT */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => setToitOuvert(!toitOuvert)}
                      style={styles.boutonSection(toitOuvert, '#ff9800')}
                    >
                      <span>🏠 Type de toit</span>
                      <span style={{ fontSize: '1rem' }}>{toitOuvert ? '▼' : '▶'}</span>
                    </button>
                    {toitOuvert && (
                      <div style={styles.conteneurListe}>
                        <div style={{ padding: '0.5rem', fontSize: '0.85rem' }}>
                          <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>
                            Sélectionner le type de toit :
                          </label>
                          {['plan', 'monopente', 'deux-pentes'].map((type) => (
                            <label key={type} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.2rem', cursor: 'pointer' }}>
                              <input
                                type="radio"
                                name="typeToit"
                                value={type}
                                checked={(objetSelectionne.typeToit || 'deux-pentes') === type}
                                onChange={(e) => updateObjetProp('typeToit', e.target.value)}
                                style={{ marginRight: '0.5rem' }}
                              />
                              <span style={{ textTransform: 'capitalize' }}>
                                {type === 'deux-pentes' ? 'Deux pentes traditionnelles' : 
                                 type === 'monopente' ? 'Monopente' : 
                                 'Plan'}
                              </span>
                            </label>
                          ))}
                        </div>
                        
                        {/* Contrôles de pente pour toits inclinés */}
                        {(objetSelectionne.typeToit === 'monopente' || objetSelectionne.typeToit === 'deux-pentes') && (
                          <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#f9f9f9', borderRadius: '4px' }}>
                            {renderNumberInput(
                              'Pente du toit',
                              Math.round(objetSelectionne.penteToit || (objetSelectionne.typeToit === 'monopente' ? 2 : 15)).toString(),
                              (e) => updateObjetProp('penteToit', e.target.value),
                              1, 60, 1, '°'
                            )}
                            
                            {/* Orientation pour monopente */}
                            {objetSelectionne.typeToit === 'monopente' && (
                              <div style={{ marginTop: '0.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                  Orientation de la pente
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <button
                                    onClick={() => {
                                      const currentOrientation = (objetSelectionne.orientationToit || 0);
                                      const newOrientation = (currentOrientation - 90 + 360) % 360;
                                      updateObjetProp('orientationToit', newOrientation.toString());
                                    }}
                                    style={{
                                      padding: '0.5rem 0.8rem',
                                      background: '#2196f3',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '1rem',
                                      fontWeight: 'bold',
                                      minWidth: '40px'
                                    }}
                                    title="Diminuer de 90°"
                                  >
                                    -
                                  </button>
                                  <div style={{
                                    padding: '0.5rem 1rem',
                                    background: '#f5f5f5',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    minWidth: '120px',
                                    textAlign: 'center',
                                    fontWeight: 'bold'
                                  }}>
                                    {(() => {
                                      const deg = parseInt(objetSelectionne.orientationToit || 0);
                                    if (deg === 0) return 'Nord (0°)';
                                    if (deg === 90) return 'Est (90°)';
                                    if (deg === 180) return 'Sud (180°)';
                                    if (deg === 270) return 'Ouest (270°)';
                                    return `${deg}°`;
                                    })()}
                                  </div>
                                  <button
                                    onClick={() => {
                                      const currentOrientation = (objetSelectionne.orientationToit || 0);
                                      const newOrientation = (currentOrientation + 90) % 360;
                                      updateObjetProp('orientationToit', newOrientation.toString());
                                    }}
                                    style={{
                                      padding: '0.5rem 0.8rem',
                                      background: '#2196f3',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '1rem',
                                      fontWeight: 'bold',
                                      minWidth: '40px'
                                    }}
                                    title="Augmenter de 90°"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                </>
              )}
              
              {objetSelectionne.customType === 'citerne' && (
                <>
                  {/* DIMENSIONS */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => setDimensionsOuvert(!dimensionsOuvert)}
                      style={styles.boutonSection(dimensionsOuvert, '#4caf50')}
                    >
                      <span>📏 Dimensions</span>
                      <span style={{ fontSize: '1rem' }}>{dimensionsOuvert ? '▼' : '▶'}</span>
                    </button>
                    {dimensionsOuvert && (
                      <div style={styles.conteneurListe}>
                        {renderNumberInput(
                          'Diamètre',
                          (objetSelectionne.diametre || 1.5).toString(),
                          (e) => updateObjetProp('diametre', e.target.value),
                          0.5, 3, 0.1, 'm'
                        )}
                        {renderNumberInput(
                          'Longueur',
                          (objetSelectionne.longueur || 2.5).toString(),
                          (e) => updateObjetProp('longueur', e.target.value),
                          1, 5, 0.5, 'm'
                        )}
                        <div className="info-box">
                          💧 Volume : {(Math.PI * Math.pow((objetSelectionne.diametre || 1.5) / 2, 2) * (objetSelectionne.longueur || 2.5)).toFixed(2)}m³
                        </div>
                      </div>
                    )}
                  </div>

                  {/* POSITION */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => setPositionOuvert(!positionOuvert)}
                      style={styles.boutonSection(positionOuvert, '#2196f3')}
                    >
                      <span>📍 Position</span>
                      <span style={{ fontSize: '1rem' }}>{positionOuvert ? '▼' : '▶'}</span>
                    </button>
                    {positionOuvert && (
                      <div style={styles.conteneurListe}>
                        {renderNumberInput(
                          'Élévation sol (m)',
                          (objetSelectionne.elevationSol || 0).toString(),
                          (e) => updateObjetProp('elevationSol', e.target.value),
                          -5, 5, 0.1, 'm'
                        )}
                        <div className="info-box" style={{ background: '#fff3e0', padding: '0.5rem', marginTop: '0.5rem' }}>
                          💡 Négatif = enterré (ex: -2.5m sous terre)
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {objetSelectionne.customType === 'caisson-eau' && (
                <>
                  {/* POSITION */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => setPositionOuvert(!positionOuvert)}
                      style={styles.boutonSection(positionOuvert, '#2196f3')}
                    >
                      <span>📍 Position</span>
                      <span style={{ fontSize: '1rem' }}>{positionOuvert ? '▼' : '▶'}</span>
                    </button>
                    {positionOuvert && (
                      <div style={styles.conteneurListe}>
                        {renderNumberInput(
                          'Rotation',
                          Math.round(objetSelectionne.angle || 0).toString(),
                          (e) => updateObjetProp('angle', e.target.value),
                          0, 360, 5, '°'
                        )}
                        {renderNumberInput(
                          'Élévation sol (m)',
                          (objetSelectionne.elevationSol || 0).toString(),
                          (e) => updateObjetProp('elevationSol', e.target.value),
                          -3, 5, 0.1, 'm'
                        )}
                        <div className="info-box" style={{ background: '#fff3e0', padding: '0.5rem', marginTop: '0.5rem' }}>
                          💡 Négatif = enterré (ex: -1m sous terre)
                        </div>
                      </div>
                    )}
                  </div>

                  {/* DIMENSIONS */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => setDimensionsOuvert(!dimensionsOuvert)}
                      style={styles.boutonSection(dimensionsOuvert, '#4caf50')}
                    >
                      <span>📏 Dimensions</span>
                      <span style={{ fontSize: '1rem' }}>{dimensionsOuvert ? '▼' : '▶'}</span>
                    </button>
                    {dimensionsOuvert && (
                      <div style={styles.conteneurListe}>
                        {renderNumberInput(
                          'Largeur',
                          (objetSelectionne.largeur || 5).toString(),
                          (e) => updateObjetProp('largeur', e.target.value),
                          1, 10, 0.5, 'm'
                        )}
                        {renderNumberInput(
                          'Profondeur',
                          (objetSelectionne.profondeur || 3).toString(),
                          (e) => updateObjetProp('profondeur', e.target.value),
                          1, 10, 0.5, 'm'
                        )}
                        {renderNumberInput(
                          'Hauteur',
                          (objetSelectionne.hauteur || 1).toString(),
                          (e) => updateObjetProp('hauteur', e.target.value),
                          0.5, 3, 0.1, 'm'
                        )}
                  <div className="info-box">
                    💧 Volume : {((objetSelectionne.largeur || 5) * (objetSelectionne.profondeur || 3) * (objetSelectionne.hauteur || 1)).toFixed(2)}m³
                  </div>
                </div>
                    )}
                  </div>

                </>
              )}
              
              {objetSelectionne.customType === 'terrasse' && (
                <>
                  {/* POSITION */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => setPositionOuvert(!positionOuvert)}
                      style={styles.boutonSection(positionOuvert, '#2196f3')}
                    >
                      <span>📍 Position</span>
                      <span style={{ fontSize: '1rem' }}>{positionOuvert ? '▼' : '▶'}</span>
                    </button>
                    {positionOuvert && (
                      <div style={styles.conteneurListe}>
                        {renderNumberInput(
                          'Rotation',
                          Math.round(objetSelectionne.angle || 0).toString(),
                          (e) => updateObjetProp('angle', e.target.value),
                          0, 360, 5, '°'
                        )}
                        {renderNumberInput(
                          '⚠️ Élévation sol (m)',
                          (objetSelectionne.elevationSol || 0).toString(),
                          (e) => updateObjetProp('elevationSol', e.target.value),
                          -2, 2, 0.1, 'm'
                        )}
                      </div>
                    )}
                  </div>

                  {/* DIMENSIONS */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => setDimensionsOuvert(!dimensionsOuvert)}
                      style={styles.boutonSection(dimensionsOuvert, '#4caf50')}
                    >
                      <span>📏 Dimensions</span>
                      <span style={{ fontSize: '1rem' }}>{dimensionsOuvert ? '▼' : '▶'}</span>
                    </button>
                    {dimensionsOuvert && (
                      <div style={styles.conteneurListe}>
                        {renderDimensionInput('Largeur', 'width', 1, 20, 0.1)}
                        {renderDimensionInput('Profondeur', 'height', 1, 20, 0.1)}
                        {renderNumberInput(
                          'Hauteur dalle',
                          (objetSelectionne.hauteurDalle || 0.15).toString(),
                          (e) => updateObjetProp('hauteurDalle', e.target.value),
                          -1, 1, 0.05, 'm'
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {objetSelectionne.customType === 'paves' && (
                <>
                  {/* POSITION */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => setPositionOuvert(!positionOuvert)}
                      style={styles.boutonSection(positionOuvert, '#2196f3')}
                    >
                      <span>📍 Position</span>
                      <span style={{ fontSize: '1rem' }}>{positionOuvert ? '▼' : '▶'}</span>
                    </button>
                    {positionOuvert && (
                      <div style={styles.conteneurListe}>
                        {renderNumberInput(
                          'Rotation',
                          Math.round(objetSelectionne.angle || 0).toString(),
                          (e) => updateObjetProp('angle', e.target.value),
                          0, 360, 5, '°'
                        )}
                        {renderNumberInput(
                          '⚠️ Élévation sol (m)',
                          (objetSelectionne.elevationSol || 0).toString(),
                          (e) => updateObjetProp('elevationSol', e.target.value),
                          -2, 2, 0.1, 'm'
                        )}
                      </div>
                    )}
                  </div>

                  {/* DIMENSIONS */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => setDimensionsOuvert(!dimensionsOuvert)}
                      style={styles.boutonSection(dimensionsOuvert, '#4caf50')}
                    >
                      <span>📏 Dimensions</span>
                      <span style={{ fontSize: '1rem' }}>{dimensionsOuvert ? '▼' : '▶'}</span>
                    </button>
                    {dimensionsOuvert && (
                      <div style={styles.conteneurListe}>
                        {renderDimensionInput('Largeur', 'width', 1, 20, 0.1)}
                        {renderDimensionInput('Profondeur', 'height', 1, 20, 0.1)}
                        {renderNumberInput(
                          'Hauteur',
                          (objetSelectionne.hauteur || 0.08).toString(),
                          (e) => updateObjetProp('hauteur', e.target.value),
                          0.05, 0.2, 0.01, 'm'
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {objetSelectionne.customType === 'canalisation' && (
                <>
                  {/* POSITION */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => setPositionOuvert(!positionOuvert)}
                      style={styles.boutonSection(positionOuvert, '#2196f3')}
                    >
                      <span>📍 Position</span>
                      <span style={{ fontSize: '1rem' }}>{positionOuvert ? '▼' : '▶'}</span>
                    </button>
                    {positionOuvert && (
                      <div style={styles.conteneurListe}>
                        {renderNumberInput(
                          'Élévation sol (m)',
                          (objetSelectionne.elevationSol || 0).toString(),
                          (e) => updateObjetProp('elevationSol', e.target.value),
                          -2, 5, 0.1, 'm'
                        )}
                        <div className="info-box" style={{ background: '#fff3e0', padding: '0.5rem', marginTop: '0.5rem' }}>
                          💡 Négatif = enterré (ex: -0.6m sous terre)
                        </div>
                      </div>
                    )}
                  </div>

                  {/* DIMENSIONS */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => setDimensionsOuvert(!dimensionsOuvert)}
                      style={styles.boutonSection(dimensionsOuvert, '#4caf50')}
                    >
                      <span>📏 Dimensions</span>
                      <span style={{ fontSize: '1rem' }}>{dimensionsOuvert ? '▼' : '▶'}</span>
                    </button>
                    {dimensionsOuvert && (
                      <div style={styles.conteneurListe}>
                        {renderNumberInput(
                          'Diamètre',
                          (objetSelectionne.diametre || 0.1).toString(),
                          (e) => updateObjetProp('diametre', e.target.value),
                          0.05, 0.5, 0.05, 'm'
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {objetSelectionne.customType === 'cloture' && (
                <div className="objet-controls">
                  {renderNumberInput(
                    'Hauteur',
                    (objetSelectionne.hauteur || 1.5).toString(),
                    (e) => updateObjetProp('hauteur', e.target.value),
                    0.5, 3, 0.1, 'm'
                  )}
                  <div className="objet-controls">
                    {renderNumberInput(
                      'Épaisseur',
                      '5',
                      () => {}, // Désactivé - aucune action
                      5, 5, 1, 'cm'
                    )}
                  </div>
                </div>
              )}
              
              {/* ✅ Arbre existant : 3 dimensions éditables */}
              {objetSelectionne.customType === 'arbre-existant' && (
                <div className="objet-controls">
                  {renderNumberInput(
                    'Ø Couronne (m)',
                    (objetSelectionne.diametreArbre || 5).toString(),
                    (e) => {
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
                    },
                    1, 15, 0.5, 'm'
                  )}
                  {renderNumberInput(
                    'Hauteur (m)',
                    (objetSelectionne.hauteurArbre || 8).toString(),
                    (e) => updateObjetProp('hauteurArbre', e.target.value),
                    2, 30, 0.5, 'm'
                  )}
                  {renderNumberInput(
                    'Prof. racines (m)',
                    (objetSelectionne.profondeurRacines || 2.5).toString(),
                    (e) => updateObjetProp('profondeurRacines', e.target.value),
                    0.5, 5, 0.5, 'm'
                  )}
                </div>
              )}
              
              {/* ✅ Arbre à planter : Informations de validation et placement */}
              {objetSelectionne.customType === 'arbre-a-planter' && (
                <div className="objet-controls">
                  {/* Dimensions actuelles */}
                  <div className="info-box info-box-success">
                    {objetSelectionne.tailles ? (
                      <div style={{ fontSize: '0.8rem', color: '#495057' }}>
                        <div>📏 <strong>Plantation:</strong> {objetSelectionne.tailles.envergureActuelle?.toFixed(2) || 'N/A'}m × {objetSelectionne.tailles.hauteurActuelle?.toFixed(2) || 'N/A'}m</div>
                        <div>🌳 <strong>Tronc:</strong> ⌀{((objetSelectionne.tailles.diametreTroncActuel || 0) * 100).toFixed(2)}cm {objetSelectionne.iconeType || ''}</div>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.8rem', color: '#6c757d', fontStyle: 'italic' }}>
                        📏 Dimensions en cours de calcul...
                      </div>
                    )}
                  </div>
                  
                  {/* Statut de validation */}
                  <div className="info-box" style={{ 
                    background: objetSelectionne.validationStatus === 'ok' ? '#d4edda' : 
                              objetSelectionne.validationStatus === 'warning' ? '#fff3cd' : '#f8d7da',
                    borderColor: objetSelectionne.validationStatus === 'ok' ? '#c3e6cb' : 
                                objetSelectionne.validationStatus === 'warning' ? '#ffeaa7' : '#f5c6cb'
                  }}>
                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      {objetSelectionne.validationStatus === 'ok' ? '✅ Position conforme' : 
                       objetSelectionne.validationStatus === 'warning' ? '⚠️ Avertissement' : 
                       '❌ Problème de placement'}
                    </div>
                    
                    {/* Messages de validation */}
                    {objetSelectionne.validationMessages && objetSelectionne.validationMessages.length > 0 && (
                      <div style={{ fontSize: '0.8rem' }}>
                        {objetSelectionne.validationMessages
                          .filter(msg => {
                            // Filtrer le message "Position conforme" si déjà affiché dans le titre
                            if (objetSelectionne.validationStatus === 'ok' && 
                                (msg.includes('Position conforme') || msg.includes('conforme à toutes les règles'))) {
                              return false;
                            }
                            return true;
                          })
                          .map((msg, index) => {
                          // Identifier les types de problèmes
                          const isRacines = msg.includes('Racines') || msg.includes('racines');
                          const isFondations = msg.includes('🏠') || msg.includes('fondations');
                          const isCanalisations = msg.includes('🚰') || msg.includes('canalisations');
                          const isCritique = msg.includes('CRITIQUE') || msg.includes('ILLÉGAL');
                          
                          return (
                            <div key={index} className={`info-box ${isCritique ? 'info-box-error' : 'info-box-warning'}`} style={{ 
                              marginBottom: '0.3rem',
                              padding: '0.3rem',
                              fontSize: '0.8rem'
                            }}>
                              {isRacines && <span style={{ fontWeight: 'bold' }}>🌱 RACINES: </span>}
                              {isFondations && <span style={{ fontWeight: 'bold' }}>🏠 FONDATIONS: </span>}
                              {isCanalisations && <span style={{ fontWeight: 'bold' }}>🚰 CANALISATIONS: </span>}
                              {msg}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  
                  {/* Conseils de racines */}
                  {objetSelectionne.validationConseils && objetSelectionne.validationConseils.length > 0 && (
                    <div className="info-box" style={{ background: '#e3f2fd', borderColor: '#2196f3' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#1976d2' }}>
                        💡 Conseils de plantation
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#1565c0' }}>
                        {objetSelectionne.validationConseils.map((conseil, index) => (
                          <div key={index} style={{ marginBottom: '0.3rem' }}>
                            • {conseil}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* ✅ Informations d'ombre */}
                  {objetSelectionne.arbreData && (() => {
                    const infoOmbre = getInfoOmbreArbre(objetSelectionne.arbreData, 'ete', 0.5);
                    if (!infoOmbre) return null;
                    
                    return (
                      <div style={{
                        background: '#ffffff',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginTop: '0.75rem',
                        border: '1px solid #e0e0e0',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}>
                        <div style={{
                          fontSize: '0.95rem',
                          fontWeight: '700',
                          color: '#ff9800',
                          marginBottom: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <span>☀️ Ombre projetée</span>
                        </div>
                        
                        <div style={{
                          fontSize: '0.85rem',
                          color: '#333',
                          lineHeight: '1.6'
                        }}>
                          <div style={{ marginBottom: '0.5rem' }}>
                            <strong style={{ color: '#555' }}>Densité:</strong> {infoOmbre.densiteFeuillage} ({infoOmbre.opacite})
                          </div>
                          <div style={{ marginBottom: '0.5rem' }}>
                            <strong style={{ color: '#555' }}>Longueur (midi été):</strong> {infoOmbre.longueurOmbre}
                          </div>
                          <div style={{ marginBottom: '0.5rem' }}>
                            <strong style={{ color: '#555' }}>Surface:</strong> {infoOmbre.surfaceOmbre}
                          </div>
                          <div style={{
                            marginTop: '0.75rem',
                            padding: '0.5rem',
                            background: '#fff3e0',
                            borderLeft: '3px solid #ff9800',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            color: '#e65100'
                          }}>
                            {infoOmbre.noteHiver}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                  
                  {/* Actions */}
                  <div style={{ marginTop: '0.5rem' }}>
                    <button
                      className="btn-outil"
                      onClick={() => {
                        // Supprimer l'arbre du canvas
                        if (canvas) {
                          canvasOperations.supprimer(canvas, objetSelectionne);
                          canvasOperations.rendre(canvas);
                          if (onExporterPlan) {
                            setTimeout(() => onExporterPlan(canvas), 100);
                          }
                        }
                      }}
                      style={{
                        background: '#dc3545',
                        color: 'white',
                        width: '100%'
                      }}
                    >
                      🗑️ Supprimer cet arbre
                    </button>
                  </div>
                </div>
              )}
              
              {/* ✅ Sol : Composition du sol */}
              {objetSelectionne.customType === 'sol' && (
                <div className="objet-controls">
                  <div className="section-header">
                    <h3 className="section-title">🌍 Configuration du terrain</h3>
                  </div>
                  
                  {/* SECTION : Maillage d'élévation - ✅ SIMPLIFIÉ */}
                  <div style={{
                    background: '#e3f2fd',
                    border: '1px solid #2196f3',
                    borderRadius: '6px',
                    padding: '0.8rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1976d2' }}>
                      🌍 Relief du terrain
                    </div>
                    
                    {/* ✅ Modifier nœuds sélectionnés - POSITION FIXE */}
                    {(() => {
                      const nbNoeuds = objetSelectionne?.noeudsSelectionnes?.length || 0;
                      return (
                        <div className="config-row" style={{ marginBottom: '0.8rem' }}>
                          <label>{nbNoeuds > 0 ? `${nbNoeuds} nœud${nbNoeuds > 1 ? 's' : ''} sélectionné${nbNoeuds > 1 ? 's' : ''}` : 'Hauteur nœuds'}</label>
                          <div>
                            <button
                              onClick={() => modifierElevationNoeudsSelectionnes(objetSelectionne, -0.1)}
                              disabled={nbNoeuds === 0}
                              style={{
                                padding: '0.3rem 0.6rem',
                                background: nbNoeuds === 0 ? '#ccc' : '#f44336',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: nbNoeuds === 0 ? 'not-allowed' : 'pointer',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                transition: 'transform 0.2s',
                                opacity: nbNoeuds === 0 ? 0.5 : 1
                              }}
                              onMouseEnter={(e) => nbNoeuds > 0 && (e.currentTarget.style.transform = 'scale(1.1)')}
                              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                              title="Abaisser de 10cm"
                            >
                              −
                            </button>
                            <span style={{ fontSize: '0.75rem', color: '#888', fontWeight: '600', margin: '0 0.3rem' }}>10cm</span>
                            <button
                              onClick={() => modifierElevationNoeudsSelectionnes(objetSelectionne, 0.1)}
                              disabled={nbNoeuds === 0}
                              style={{
                                padding: '0.3rem 0.6rem',
                                background: nbNoeuds === 0 ? '#ccc' : '#4caf50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: nbNoeuds === 0 ? 'not-allowed' : 'pointer',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                transition: 'transform 0.2s',
                                opacity: nbNoeuds === 0 ? 0.5 : 1
                              }}
                              onMouseEnter={(e) => nbNoeuds > 0 && (e.currentTarget.style.transform = 'scale(1.1)')}
                              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                              title="Élever de 10cm"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                    
                    {/* ✅ Résumé du relief EN DESSOUS - Position dynamique, ne fait pas bouger les boutons */}
                    {objetSelectionne.maillageElevation && (() => {
                      const noeudsModifies = [];
                      for (let i = 0; i < objetSelectionne.maillageElevation.length; i++) {
                        for (let j = 0; j < objetSelectionne.maillageElevation[i].length; j++) {
                          const elev = objetSelectionne.maillageElevation[i][j];
                          if (elev !== 0) {
                            noeudsModifies.push({ i, j, elev });
                          }
                        }
                      }
                      
                      if (noeudsModifies.length === 0) return null;
                      
                      return (
                        <div style={{ 
                          fontSize: '0.7rem', 
                          color: '#555', 
                          marginBottom: '0.8rem',
                          background: '#f5f5f5',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid #ddd'
                        }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '0.4rem', color: '#666', fontSize: '0.75rem' }}>
                            📊 {noeudsModifies.length} point{noeudsModifies.length > 1 ? 's' : ''} modifié{noeudsModifies.length > 1 ? 's' : ''}
                          </div>
                          {noeudsModifies.slice(0, 5).map((n, idx) => (
                            <div key={idx} style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              padding: '0.15rem 0'
                            }}>
                              <span style={{ fontSize: '0.7rem', color: '#777' }}>[{n.i},{n.j}]</span>
                              <span style={{ 
                                fontWeight: 'bold',
                                fontSize: '0.75rem',
                                color: n.elev > 0 ? '#2e7d32' : '#c62828'
                              }}>
                                {n.elev > 0 ? '+' : ''}{n.elev.toFixed(2)}m
                              </span>
                            </div>
                          ))}
                          {noeudsModifies.length > 5 && (
                            <div style={{ fontSize: '0.65rem', color: '#999', marginTop: '0.2rem', fontStyle: 'italic' }}>
                              ... et {noeudsModifies.length - 5} autres
                            </div>
                          )}
                        </div>
                      );
                    })()}
                    
                    {/* ✅ Liste des nœuds modifiés EN DESSOUS - Ne fait pas bouger les boutons */}
                    {objetSelectionne.maillageElevation && (() => {
                      const noeudsModifies = [];
                      for (let i = 0; i < objetSelectionne.maillageElevation.length; i++) {
                        for (let j = 0; j < objetSelectionne.maillageElevation[i].length; j++) {
                          const elev = objetSelectionne.maillageElevation[i][j];
                          if (elev !== 0) {
                            noeudsModifies.push({ i, j, elev });
                          }
                        }
                      }
                      
                      if (noeudsModifies.length === 0) return null;
                      
                      return (
                        <div className="relief-actuel-box" style={{ 
                          fontSize: '0.7rem', 
                          marginBottom: '0.8rem',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          maxHeight: '100px',
                          overflowY: 'auto'
                        }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '0.3rem', color: '#1976d2', fontSize: '0.75rem' }}>
                            📊 Relief actuel :
                          </div>
                          {noeudsModifies.slice(0, 10).map((n, idx) => (
                            <div key={idx} style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '0.2rem 0',
                              borderBottom: idx < Math.min(noeudsModifies.length, 10) - 1 ? '1px solid #f0f0f0' : 'none'
                            }}>
                              <span style={{ fontSize: '0.7rem' }}>Nœud [{n.i}][{n.j}]</span>
                              <span style={{ 
                                fontWeight: 'bold',
                                fontSize: '0.75rem',
                                color: n.elev > 0 ? '#2e7d32' : '#c62828'
                              }}>
                                {n.elev > 0 ? '+' : ''}{n.elev.toFixed(2)}m
                              </span>
                            </div>
                          ))}
                          {noeudsModifies.length > 10 && (
                            <div style={{ fontSize: '0.65rem', color: '#888', marginTop: '0.3rem', fontStyle: 'italic' }}>
                              ... et {noeudsModifies.length - 10} autres
                            </div>
                          )}
                        </div>
                      );
                    })()}
                    
                    {/* Actions globales - ✅ SIMPLIFIÉ */}
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => modifierToutLeMaillage(objetSelectionne, () => 0, '✅ Terrain aplati')}
                        style={{
                          flex: 1,
                          padding: '0.4rem',
                          background: '#2196f3',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}
                        title="Aplatir tout le terrain"
                      >
                        ↕️ Plat
                      </button>
                      <button
                        onClick={() => modifierToutLeMaillage(objetSelectionne, (v) => Math.min(5, v + 0.5), '✅ +50cm')}
                        style={{
                          flex: 1,
                          padding: '0.4rem',
                          background: '#4caf50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}
                        title="Élever tout de +50cm"
                      >
                        ⬆️ +50cm
                      </button>
                      <button
                        onClick={() => modifierToutLeMaillage(objetSelectionne, (v) => Math.max(-5, v - 0.5), '✅ -50cm')}
                        style={{
                          flex: 1,
                          padding: '0.4rem',
                          background: '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}
                        title="Abaisser tout de -50cm"
                      >
                        ⬇️ -50cm
                      </button>
                    </div>
                  </div>
                  
                  {/* Composition du sol - Gestion */}
                  <div className="section-header" style={{ marginTop: '1rem' }}>
                    <h3 className="section-title">🪨 Composition du sol ({couchesSol?.length || 0} couches)</h3>
                  </div>
                  
                  {/* ✅ Info : Ajout depuis Outils */}
                  {(!couchesSol || couchesSol.length === 0) && (
                    <div style={{
                      background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                      border: '2px solid #ff9800',
                      borderRadius: '8px',
                      padding: '1rem',
                      marginBottom: '1rem',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🪨</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#e65100', marginBottom: '0.3rem' }}>
                        Aucune couche de sol ajoutée
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#f57c00' }}>
                        Ajoutez des couches depuis l'onglet <strong>⚙️ Outils</strong> → <strong>🪨 Couches de sol</strong>
                      </div>
                    </div>
                  )}
                  
                  {/* ✅ Liste des couches avec drag & drop et contrôles */}
                  {couchesSol && couchesSol.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      {couchesSol.map((couche, index) => (
                        <div
                          key={index}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.effectAllowed = 'move';
                            e.dataTransfer.setData('text/plain', index);
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = 'move';
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                            if (fromIndex !== index) {
                              const nouvellesCouches = [...couchesSol];
                              const [deplacee] = nouvellesCouches.splice(fromIndex, 1);
                              nouvellesCouches.splice(index, 0, deplacee);
                      mettreAJourCouchesSol(objetSelectionne, nouvellesCouches);
                      onCouchesSolChange(nouvellesCouches);
                            }
                          }}
                          style={{
                            background: 'white',
                            border: '2px solid #ddd',
                            borderRadius: '6px',
                            padding: '0.6rem',
                            marginBottom: '0.5rem',
                            cursor: 'grab',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#4caf50';
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(76, 175, 80, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#ddd';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          {/* Header avec drag handle */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <div style={{ fontSize: '1.2rem', cursor: 'grab' }} title="Glisser pour réorganiser">
                              ⋮⋮
                            </div>
                            <div
                              style={{
                                width: '20px',
                                height: '20px',
                                background: couche.couleur,
                                borderRadius: '3px',
                                border: '1px solid #666',
                                flexShrink: 0
                              }}
                            />
                            <div style={{ flex: 1, fontWeight: 'bold', fontSize: '0.85rem', color: '#333' }}>
                              {couche.nom}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#888', fontWeight: '600' }}>
                              Niveau {index + 1}
                            </div>
                            <button
                              onClick={() => {
                                const nouvellesCouches = couchesSol.filter((_, i) => i !== index);
                                mettreAJourCouchesSol(objetSelectionne, nouvellesCouches);
                                onCouchesSolChange(nouvellesCouches);
                              }}
                              style={{
                                background: '#f44336',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                width: '28px',
                                height: '28px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              title="Supprimer cette couche"
                            >
                              🗑️
                            </button>
                          </div>
                          
                          {/* Contrôles de hauteur */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', color: '#666', minWidth: '60px' }}>Épaisseur:</label>
                            <button
                              onClick={() => {
                                const nouvellesCouches = [...couchesSol];
                                nouvellesCouches[index].profondeur = Math.max(5, couche.profondeur - 5);
                                mettreAJourCouchesSol(objetSelectionne, nouvellesCouches);
                                onCouchesSolChange(nouvellesCouches);
                              }}
                              style={{
                                background: '#f44336',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                width: '30px',
                                height: '30px',
                                cursor: 'pointer',
                                fontSize: '1.1rem',
                                fontWeight: 'bold'
                              }}
                            >
                              −
                            </button>
                            <input
                              type="number"
                              value={couche.profondeur}
                              onChange={(e) => {
                                const nouvellesCouches = [...couchesSol];
                                nouvellesCouches[index].profondeur = Math.max(5, Math.min(300, parseInt(e.target.value) || 5));
                                mettreAJourCouchesSol(objetSelectionne, nouvellesCouches);
                                onCouchesSolChange(nouvellesCouches);
                              }}
                              style={{
                                width: '60px',
                                padding: '0.3rem',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                textAlign: 'center',
                                fontSize: '0.85rem',
                                fontWeight: 'bold'
                              }}
                            />
                            <span style={{ fontSize: '0.75rem', color: '#888', minWidth: '30px' }}>cm</span>
                            <button
                              onClick={() => {
                                const nouvellesCouches = [...couchesSol];
                                const profondeurTotaleSansActuelle = nouvellesCouches.reduce((sum, c, i) => 
                                  i === index ? sum : sum + c.profondeur, 0);
                                if (profondeurTotaleSansActuelle + couche.profondeur + 5 <= 300) {
                                  nouvellesCouches[index].profondeur = couche.profondeur + 5;
                                  mettreAJourCouchesSol(objetSelectionne, nouvellesCouches);
                                  onCouchesSolChange(nouvellesCouches);
                                }
                              }}
                              style={{
                                background: '#4caf50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                width: '30px',
                                height: '30px',
                                cursor: 'pointer',
                                fontSize: '1.1rem',
                                fontWeight: 'bold'
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="info-box info-box-info" style={{ marginTop: '0.5rem' }}>
                    📏 Profondeur totale : {couchesSol ? (couchesSol.reduce((sum, c) => sum + c.profondeur, 0) / 100).toFixed(2) : 0} m / 3.00 m max
                    {couchesSol && couchesSol.reduce((sum, c) => sum + c.profondeur, 0) > 300 && (
                      <div style={{ color: '#f44336', fontWeight: 'bold', marginTop: '0.3rem' }}>
                        ⚠️ Limite dépassée ! Réduisez l'épaisseur des couches.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ) : ongletActif === 'outils' ? (
        <div className="panneau-outils-content">
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
              <span>🏗️ Structures (5)</span>
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
                  onClick={onAjouterTerrain} 
                  title="Terrain sélectionnable avec maillage 5×5m pour gérer le relief et les couches de sol"
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
                  🌍 Terrain
                </button>
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
              🟩 Pavés
            </button>
                <button 
                  onClick={onAjouterCloture} 
                  title="Clôture limite propriété (structure aérienne à 5cm du sol)"
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
          
          {/* SOL / COMPOSITION */}
          <div style={{ marginBottom: '0.5rem' }}>
            <button
              onClick={() => setSolOuvert(!solOuvert)}
              style={{
                width: '100%',
                padding: '0.6rem',
                background: solOuvert ? '#8d6e63' : 'white',
                color: solOuvert ? 'white' : '#333',
                border: '1px solid #8d6e63',
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
              <span>🪨 Couches de sol (6)</span>
              <span style={{ fontSize: '1rem' }}>{solOuvert ? '▼' : '▶'}</span>
            </button>
            {solOuvert && (
              <div style={{ 
                marginTop: '0.3rem',
                background: 'white',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}>
                <div 
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
                    🌱 Terre végétale
                  </span>
                  <button 
                    onClick={() => {
                      const typeCouche = { nom: 'Terre végétale', profondeur: 30, couleur: '#8d6e63', type: 'terre' };
                      const terrain = canvas?.getObjects().find(obj => obj.customType === 'sol');
                      if (terrain) {
                        const nouvellesCouches = [...(couchesSol || []), typeCouche];
                        mettreAJourCouchesSol(terrain, nouvellesCouches);
                        onCouchesSolChange(nouvellesCouches);
                      }
                    }}
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
                    title="Ajouter Terre végétale"
                  >
                    ➕
                  </button>
                </div>
                <div 
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
                    🪨 Marne calcaire
                  </span>
                  <button 
                    onClick={() => {
                      const typeCouche = { nom: 'Marne calcaire', profondeur: 70, couleur: '#bdbdbd', type: 'marne' };
                      const terrain = canvas?.getObjects().find(obj => obj.customType === 'sol');
                      if (terrain) {
                        const nouvellesCouches = [...(couchesSol || []), typeCouche];
                        mettreAJourCouchesSol(terrain, nouvellesCouches);
                        onCouchesSolChange(nouvellesCouches);
                      }
                    }}
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
                    title="Ajouter Marne calcaire"
                  >
                    ➕
                  </button>
                </div>
                <div 
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
                    ⏳ Sable
                  </span>
                  <button 
                    onClick={() => {
                      const typeCouche = { nom: 'Sable', profondeur: 50, couleur: '#fdd835', type: 'sable' };
                      const terrain = canvas?.getObjects().find(obj => obj.customType === 'sol');
                      if (terrain) {
                        const nouvellesCouches = [...(couchesSol || []), typeCouche];
                        mettreAJourCouchesSol(terrain, nouvellesCouches);
                        onCouchesSolChange(nouvellesCouches);
                      }
                    }}
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
                    title="Ajouter Sable"
                  >
                    ➕
                  </button>
                </div>
                <div 
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
                    🧱 Argile
                  </span>
                  <button 
                    onClick={() => {
                      const typeCouche = { nom: 'Argile', profondeur: 60, couleur: '#d32f2f', type: 'argile' };
                      const terrain = canvas?.getObjects().find(obj => obj.customType === 'sol');
                      if (terrain) {
                        const nouvellesCouches = [...(couchesSol || []), typeCouche];
                        mettreAJourCouchesSol(terrain, nouvellesCouches);
                        onCouchesSolChange(nouvellesCouches);
                      }
                    }}
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
                    title="Ajouter Argile"
                  >
                    ➕
                  </button>
                </div>
                <div 
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
                    🪨 Gravier
                  </span>
                  <button 
                    onClick={() => {
                      const typeCouche = { nom: 'Gravier', profondeur: 40, couleur: '#9e9e9e', type: 'gravier' };
                      const terrain = canvas?.getObjects().find(obj => obj.customType === 'sol');
                      if (terrain) {
                        const nouvellesCouches = [...(couchesSol || []), typeCouche];
                        mettreAJourCouchesSol(terrain, nouvellesCouches);
                        onCouchesSolChange(nouvellesCouches);
                      }
                    }}
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
                    title="Ajouter Gravier"
                  >
                    ➕
                  </button>
                </div>
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.4rem',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f8e9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <span style={{ flex: 1, fontSize: '0.8rem', fontWeight: '500' }}>
                    ⛰️ Roche mère
                  </span>
                  <button 
                    onClick={() => {
                      const typeCouche = { nom: 'Roche mère', profondeur: 100, couleur: '#5d4037', type: 'roche' };
                      const terrain = canvas?.getObjects().find(obj => obj.customType === 'sol');
                      if (terrain) {
                        const nouvellesCouches = [...(couchesSol || []), typeCouche];
                        mettreAJourCouchesSol(terrain, nouvellesCouches);
                        onCouchesSolChange(nouvellesCouches);
                      }
                    }}
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
                    title="Ajouter Roche mère"
                  >
                    ➕
                  </button>
                </div>
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
              <span>🔧 Réseaux enterrés (3)</span>
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
          </div>
            )}
          </div>
            
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

