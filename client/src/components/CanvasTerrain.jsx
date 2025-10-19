import { useEffect, useRef, useState, useCallback, lazy, Suspense } from 'react';
import { FaMap, FaCube } from 'react-icons/fa';
import PanneauLateral from './PanneauLateral';
import logger from '../utils/logger';
import { ECHELLE_PIXELS_PAR_METRE, COUCHES_SOL_DEFAUT } from '../config/constants';

// Dynamic import pour Three.js (évite bundle 3x trop gros)
const CanvasTerrain3D = lazy(() => import('./CanvasTerrain3D'));

// ========== IMPORTS UTILS CANVAS ==========
import {
  creerMaison,
  creerCanalisation,
  creerCiterne,
  creerCloture,
  creerTerrasse,
  creerPaves,
  creerArbreExistant,
  creerGrille,
  creerIndicateurSud
} from '../utils/canvas/creerObjets';

import {
  afficherOmbreMaison as afficherOmbreUtils,
  afficherCercleTronc as afficherCercleTroncUtils,
  cacherCercleTronc as cacherCercleTroncUtils
} from '../utils/canvas/affichage';

import { calculerTailleSelonAnnee as calculerTailleUtils } from '../utils/canvas/croissance';

import {
  validerPositionArbre as validerPositionUtils,
  afficherLignesMesure as afficherLignesMesureUtils
} from '../utils/canvas/canvasValidation';

import {
  afficherMenuContextuel as afficherMenuUtils,
  cacherMenuContextuel as cacherMenuUtils,
  toggleVerrouObjetActif as toggleVerrouUtils,
  supprimerObjetActif as supprimerObjetUtils
} from '../utils/canvas/menuContextuel';

import {
  afficherTooltipValidation as afficherTooltipUtils,
  cacherTooltipValidation as cacherTooltipUtils
} from '../utils/canvas/tooltipValidation';

import {
  exporterPlan as exporterPlanUtils,
  chargerImageFond as chargerImageUtils,
  ajusterOpaciteImage as ajusterOpaciteUtils,
  supprimerImageFond as supprimerImageUtils,
  ajouterMesuresLive as ajouterMesuresUtils
} from '../utils/canvas/exportImport';
import { chargerPlanDemo as chargerPlanDemoUtils } from '../utils/canvas/planDemo';

import {
  supprimerSelection as supprimerSelectionUtils,
  verrouillerSelection as verrouillerSelectionUtils,
  effacerTout as effacerToutUtils,
  ajouterPointIntermediaire as ajouterPointUtils,
  trouverPositionValide as trouverPositionUtils
} from '../utils/canvas/actionsCanvas';

// ========== IMPORTS HOOKS ==========
import { useCanvasInit } from '../hooks/useCanvasInit';
import { useCanvasEvents } from '../hooks/useCanvasEvents';
import { useTimelineSync } from '../hooks/useTimelineSync';
import { useArbresPlacement } from '../hooks/useArbresPlacement';

import './CanvasTerrain.css';

function CanvasTerrain({ dimensions, orientation, onDimensionsChange, onOrientationChange, onPlanComplete, arbresAPlanter = [] }) {
  // ========== REFS ==========
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const validationTooltipRef = useRef(null);
  const pointsClotureRef = useRef([]);
  const contextMenuRef = useRef(null);
  const imageFondRef = useRef(null);
  
  // ========== CONSTANTES ==========
  const echelle = ECHELLE_PIXELS_PAR_METRE;
  
  // ========== STATES ==========
  const [couchesSol, setCouchesSol] = useState(COUCHES_SOL_DEFAUT);
  const [imageFondChargee, setImageFondChargee] = useState(false);
  const [opaciteImage, setOpaciteImage] = useState(0.5);
  const [anneeProjection, setAnneeProjection] = useState(0);
  const [ombreVisible, setOmbreVisible] = useState(false);
  const [timelineVisible, setTimelineVisible] = useState(true);
  const [saison, setSaison] = useState('ete');
  const [snapMagnetiqueActif, setSnapMagnetiqueActif] = useState(true);
  const [mode3D, setMode3D] = useState(false);
  const [planDataSync, setPlanDataSync] = useState(null); // État partagé 2D↔3D
  const syncTimerRef = useRef(null); // Timer pour throttle de la sync

  // ========== WRAPPERS POUR ADAPTER LES SIGNATURES ==========
  
  // Validation
  const validerPositionArbre = (canvas, arbreGroup) => {
    return validerPositionUtils(canvas, arbreGroup, echelle, couchesSol, orientation);
  };
  
  // Croissance
  const calculerTailleSelonAnnee = (arbre, annee) => {
    return calculerTailleUtils(arbre, annee, echelle);
  };
  
  // Affichage
  const afficherOmbreMaison = (canvas) => {
    afficherOmbreUtils(canvas, echelle, ombreVisible, saison, orientation);
  };
  
  const afficherCercleTronc = (canvas, arbreGroup) => {
    afficherCercleTroncUtils(canvas, arbreGroup, echelle, anneeProjection, calculerTailleSelonAnnee);
  };
  
  const cacherCercleTronc = (canvas) => {
    cacherCercleTroncUtils(canvas);
    canvas.getObjects().filter(obj => obj.isLigneMesure).forEach(obj => canvas.remove(obj));
      canvas.renderAll();
  };
  
  const afficherLignesMesure = (canvas, arbreGroup) => {
    return afficherLignesMesureUtils(canvas, arbreGroup, echelle);
  };
  
  // Menu contextuel
  const afficherMenuContextuel = (obj, canvas) => {
    afficherMenuUtils(obj, canvas, canvasRef, contextMenuRef);
  };
  
  const cacherMenuContextuel = () => {
    cacherMenuUtils(contextMenuRef);
  };
  
  const toggleVerrouObjetActif = () => {
    toggleVerrouUtils(fabricCanvasRef.current, contextMenuRef, canvasRef);
  };
  
  const supprimerObjetActif = () => {
    supprimerObjetUtils(fabricCanvasRef.current);
  };
  
  // Tooltip validation
  const afficherTooltipValidation = (arbreGroup, canvas) => {
    afficherTooltipUtils(
      arbreGroup, 
      canvas, 
      validationTooltipRef, 
      anneeProjection, 
      calculerTailleSelonAnnee,
      afficherCercleTronc,
      afficherLignesMesure
    );
  };
  
  const cacherTooltipValidation = () => {
    cacherTooltipUtils(validationTooltipRef);
  };
  
  // Export/Import
  const exporterPlan = (canvas) => {
    exporterPlanUtils(canvas, dimensions, orientation, echelle, onPlanComplete);
  };
  
  const ajouterMesuresLive = (canvas) => {
    ajouterMesuresUtils(canvas, echelle, exporterPlan);
  };
  
  const chargerPlanDemo = () => {
    chargerPlanDemoUtils(fabricCanvasRef.current, echelle, ajouterGrille);
  };
  
  const chargerImageFond = () => {
    chargerImageUtils(fabricCanvasRef, imageFondRef, opaciteImage, setImageFondChargee, ajouterGrille);
  };
  
  const ajusterOpaciteImage = (nouvelleOpacite) => {
    ajusterOpaciteUtils(nouvelleOpacite, fabricCanvasRef, imageFondRef, setOpaciteImage);
  };
  
  const supprimerImageFond = () => {
    supprimerImageUtils(fabricCanvasRef, imageFondRef, setImageFondChargee);
  };
  
  // Navigation canvas
  const resetZoom = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Réinitialiser zoom et position
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    canvas.requestRenderAll();
    logger.info('Canvas', 'Zoom réinitialisé (100%)');
  };
  
  // Actions canvas
  const supprimerSelection = () => {
    supprimerSelectionUtils(fabricCanvasRef.current, exporterPlan);
  };
  
  const verrouillerSelection = () => {
    verrouillerSelectionUtils(fabricCanvasRef.current);
  };
  
  
  const effacerTout = () => {
    effacerToutUtils(fabricCanvasRef.current, exporterPlan);
  };
  
  const ajouterPointIntermediaire = (canvas, ligne, pointer) => {
    ajouterPointUtils(canvas, ligne, pointer);
  };
  
  const trouverPositionValide = (canvas, arbre, largeur, hauteur, index) => {
    return trouverPositionUtils(canvas, arbre, largeur, hauteur, index, echelle);
  };
  
  
  // Création d'objets
  const ajouterMaison = () => creerMaison(fabricCanvasRef.current, echelle);
  const ajouterCanalisation = () => creerCanalisation(fabricCanvasRef.current);
  const ajouterCiterne = () => creerCiterne(fabricCanvasRef.current, echelle);
  const ajouterCloture = () => creerCloture(fabricCanvasRef.current, pointsClotureRef);
  const ajouterTerrasse = () => creerTerrasse(fabricCanvasRef.current, echelle);
  const ajouterPaves = () => creerPaves(fabricCanvasRef.current, echelle);
  const ajouterArbreExistant = () => creerArbreExistant(fabricCanvasRef.current, echelle);
  const ajouterGrille = (canvas) => creerGrille(canvas, echelle);
  const ajouterIndicateurSud = (canvas) => creerIndicateurSud(canvas, orientation, onOrientationChange, echelle);

  // ========== HOOKS PERSONNALISÉS ==========
  
  // Initialisation du canvas
  useCanvasInit({
    canvasRef,
    fabricCanvasRef,
    echelle,
    ajouterGrille,
    ajouterIndicateurSud,
    chargerPlanDemo
  });

  // Event listeners du canvas
  useCanvasEvents({
    fabricCanvasRef,
    echelle,
    snapMagnetiqueActif,
    afficherMenuContextuel,
    cacherMenuContextuel,
    cacherTooltipValidation,
    validerPositionArbre,
    afficherTooltipValidation,
    cacherCercleTronc,
    exporterPlan,
    ajouterMesuresLive,
    afficherOmbreMaison,
    ajouterPointIntermediaire
  });

  // Synchronisation timeline
  useTimelineSync({
    fabricCanvasRef,
    anneeProjection,
    calculerTailleSelonAnnee,
    validerPositionArbre
  });

  // Placement automatique des arbres
  useArbresPlacement({
    fabricCanvasRef,
    arbresAPlanter,
    echelle,
    anneeProjection,
    calculerTailleSelonAnnee,
    trouverPositionValide,
    validerPositionArbre
  });

  // ========== EFFECTS SIMPLES ==========
  
  // Ombre maison
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (canvas) afficherOmbreMaison(canvas);
  }, [ombreVisible, saison, orientation]); // eslint-disable-line react-hooks/exhaustive-deps

  // Rendre les panneaux déplaçables
  useEffect(() => {
    const menu = contextMenuRef.current;
    if (!menu) return;

    let isDragging = false;
    let currentX, currentY, initialX, initialY;

    const dragStart = (e) => {
      if (menu.style.display === 'none') return;
      initialX = e.clientX - menu.offsetLeft;
      initialY = e.clientY - menu.offsetTop;
      isDragging = true;
      menu.style.cursor = 'grabbing';
    };

    const drag = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      menu.style.left = currentX + 'px';
      menu.style.top = currentY + 'px';
    };

    const dragEnd = () => {
      isDragging = false;
      menu.style.cursor = 'move';
    };

    menu.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    return () => {
      menu.removeEventListener('mousedown', dragStart);
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', dragEnd);
    };
  }, []);

  useEffect(() => {
    const panel = validationTooltipRef.current;
    if (!panel) return;

    let isDragging = false;
    let currentX, currentY, initialX, initialY;

    const dragStart = (e) => {
      if (panel.style.display === 'none') return;
      if (!e.target.classList.contains('panel-validation-header') && 
          !e.target.closest('.panel-validation-header')) return;
      
      initialX = e.clientX - panel.offsetLeft;
      initialY = e.clientY - panel.offsetTop;
      isDragging = true;
      panel.style.cursor = 'grabbing';
    };

    const drag = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      panel.style.left = currentX + 'px';
      panel.style.top = currentY + 'px';
    };

    const dragEnd = () => {
      isDragging = false;
      panel.style.cursor = 'move';
    };

    panel.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    return () => {
      panel.removeEventListener('mousedown', dragStart);
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', dragEnd);
    };
  }, []);

  // ========== SYNCHRONISATION 2D ↔ 3D ==========
  
  // Extraire les données du canvas 2D pour la vue 3D (throttled)
  const syncCanvasTo3D = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const echelle3D = ECHELLE_PIXELS_PAR_METRE;
    
    const extractedData = {
      maison: canvas.getObjects().find(o => o.customType === 'maison'),
      citernes: canvas.getObjects().filter(o => o.customType === 'citerne'),
      canalisations: canvas.getObjects().filter(o => o.customType === 'canalisation'),
      clotures: canvas.getObjects().filter(o => o.customType === 'cloture'),
      terrasses: canvas.getObjects().filter(o => o.customType === 'paves'),
      arbres: canvas.getObjects().filter(o => o.customType === 'arbre-a-planter'),
      arbresExistants: canvas.getObjects().filter(o => o.customType === 'arbre-existant'),
      echelle: echelle3D
    };
    
    setPlanDataSync(extractedData);
  }, []);
  
  // Throttle la synchronisation pour éviter trop d'updates
  const throttledSync = useCallback(() => {
    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current);
    }
    syncTimerRef.current = setTimeout(() => {
      syncCanvasTo3D();
    }, 100); // Update max toutes les 100ms
  }, [syncCanvasTo3D]);
  
  // Synchroniser au montage et quand les arbres changent
  useEffect(() => {
    syncCanvasTo3D();
  }, [arbresAPlanter, syncCanvasTo3D]);
  
  // Écouter les modifications du canvas pour resynchroniser
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    const handleModified = () => throttledSync();
    const handleAdded = () => throttledSync();
    const handleRemoved = () => throttledSync();
    
    canvas.on('object:modified', handleModified);
    canvas.on('object:added', handleAdded);
    canvas.on('object:removed', handleRemoved);
    
    return () => {
      canvas.off('object:modified', handleModified);
      canvas.off('object:added', handleAdded);
      canvas.off('object:removed', handleRemoved);
    };
  }, [throttledSync]);
  
  
  // Callback pour mettre à jour la position d'un objet depuis la 3D
  const handleObjetPositionChange3D = useCallback((objetData) => {
    if (!fabricCanvasRef.current) return;
    
          const canvas = fabricCanvasRef.current;
    const echelle = ECHELLE_PIXELS_PAR_METRE;
    
    // Trouver l'objet dans le canvas
    const objet = canvas.getObjects().find(o => {
      if (o.customType !== objetData.type) return false;
      // Comparer position approximative (tolérance 1 pixel)
      const match = Math.abs(o.left - objetData.oldPosition.x * echelle) < 1 && 
                    Math.abs(o.top - objetData.oldPosition.z * echelle) < 1;
      return match;
    });
    
    if (!objet) {
      console.warn('Objet non trouvé pour sync 3D→2D', objetData);
      return;
    }
    
    // Convertir position 3D → 2D
    const newLeft = objetData.newPosition.x * echelle;
    const newTop = objetData.newPosition.z * echelle;
    
    // VALIDATION : Vérifier collision avec la maison
    const maison = canvas.getObjects().find(o => o.customType === 'maison');
    if (maison && objetData.type !== 'maison') {
      const maisonWidth = maison.getScaledWidth ? maison.getScaledWidth() : maison.width;
      const maisonHeight = maison.getScaledHeight ? maison.getScaledHeight() : maison.height;
      
      const maisonBounds = {
        left: maison.left,
        right: maison.left + maisonWidth,
        top: maison.top,
        bottom: maison.top + maisonHeight
      };
      
      // Taille de l'objet
      let objetSize = 50; // Default
      if (objet.radius) {
        objetSize = objet.radius * 2 * (objet.scaleX || 1);
      } else if (objet.getScaledWidth) {
        objetSize = Math.max(objet.getScaledWidth(), objet.getScaledHeight());
      }
      
      // Vérifier si l'objet serait à l'intérieur de la maison
      const isInsideMaison = 
        newLeft + objetSize / 2 > maisonBounds.left &&
        newLeft - objetSize / 2 < maisonBounds.right &&
        newTop + objetSize / 2 > maisonBounds.top &&
        newTop - objetSize / 2 < maisonBounds.bottom;
      
      if (isInsideMaison) {
        console.warn('❌ Impossible: objet à l\'intérieur de la maison');
        // Resynchroniser pour annuler le déplacement en 3D
        throttledSync();
        return; // Bloquer le déplacement
      }
    }
    
    // Mettre à jour la position
    objet.set({
      left: newLeft,
      top: newTop
    });
    
    objet.setCoords();
    canvas.requestRenderAll();
    
    // Resynchroniser vers la 3D après un court délai
    setTimeout(() => throttledSync(), 150);
  }, [throttledSync]);

  // ========== JSX ==========

  return (
    <div className="canvas-terrain-container">
      {/* Boutons 2D/3D */}
      <div className="toggle-dimension-canvas">
          <button 
          className={!mode3D ? 'active' : ''}
          onClick={() => setMode3D(false)}
          title="Vue 2D (plan)"
          >
          <FaMap /> 2D
          </button>
          <button 
          className={mode3D ? 'active' : ''}
          onClick={() => setMode3D(true)}
          title="Vue 3D (perspective)"
          >
          <FaCube /> 3D
          </button>
        </div>

      {/* Vue 3D (montée en lazy load, cachée si mode 2D) */}
      {mode3D && (
        <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '1.5rem' }}>🔄 Chargement 3D...</div>}>
          <div style={{ display: mode3D ? 'block' : 'none', width: '100%', height: '100%' }}>
            <CanvasTerrain3D
              dimensions={dimensions}
              planData={planDataSync}
              arbresAPlanter={arbresAPlanter}
              anneeProjection={anneeProjection}
              saison={saison}
              couchesSol={couchesSol}
              onObjetPositionChange={handleObjetPositionChange3D}
            />
          </div>
        </Suspense>
      )}
      
      {/* Vue 2D (toujours montée, cachée si mode 3D) */}
      <div style={{ display: mode3D ? 'none' : 'flex', width: '100%', height: 'calc(100% - 160px)' }}>
        {/* Panneau latéral avec outils et stats */}
        <PanneauLateral
            canvas={fabricCanvasRef.current} 
        arbresAPlanter={arbresAPlanter}
            couchesSol={couchesSol}
            onCouchesSolChange={setCouchesSol}
        dimensions={dimensions}
        onDimensionsChange={onDimensionsChange}
        ombreVisible={ombreVisible}
        onToggleOmbre={() => setOmbreVisible(!ombreVisible)}
        timelineVisible={timelineVisible}
        onToggleTimeline={() => setTimelineVisible(!timelineVisible)}
        snapMagnetiqueActif={snapMagnetiqueActif}
        onToggleSnapMagnetique={() => setSnapMagnetiqueActif(!snapMagnetiqueActif)}
        imageFondChargee={imageFondChargee}
        opaciteImage={opaciteImage}
        onAjouterMaison={ajouterMaison}
        onAjouterTerrasse={ajouterTerrasse}
        onAjouterPaves={ajouterPaves}
        onAjouterCanalisation={ajouterCanalisation}
        onAjouterCiterne={ajouterCiterne}
        onAjouterCloture={ajouterCloture}
        onAjouterArbreExistant={ajouterArbreExistant}
        onVerrouillerSelection={verrouillerSelection}
        onSupprimerSelection={supprimerSelection}
        onEffacerTout={effacerTout}
        onChargerImageFond={chargerImageFond}
        onAjusterOpaciteImage={ajusterOpaciteImage}
        onSupprimerImageFond={supprimerImageFond}
        onResetZoom={resetZoom}
      />

      {/* Panneau de validation latéral fixe */}
      <div className="panel-validation" ref={validationTooltipRef} style={{ display: 'none' }}>
            </div>
            
      {/* Canvas plein écran */}
      <div className="canvas-wrapper">
        <canvas id="canvas-terrain" ref={canvasRef}></canvas>

        {/* Menu contextuel en bulle */}
        <div className="context-menu" ref={contextMenuRef}>
          <button 
            className="context-btn context-lock"
            onClick={toggleVerrouObjetActif}
            title="Verrouiller/Déverrouiller"
          >
            🔒
          </button>
          <button 
            className="context-btn context-delete"
            onClick={supprimerObjetActif}
            title="Supprimer"
          >
            🗑️
          </button>
            </div>
      </div>
      </div>

      {/* Timeline de croissance (slider temporel) - EN DEHORS DES CONTENEURS 2D/3D */}
      {timelineVisible && (
      <div className="timeline-croissance">
        <div className="timeline-row">
          <div className="timeline-section">
            <label>
              <span className="timeline-icon">📅</span>
              <strong>Projection temporelle {mode3D ? '(3D)' : '(2D)'}</strong>
            </label>
            <div className="timeline-slider-container">
              <span className="timeline-label">Aujourd'hui</span>
              <input 
                type="range" 
                min="0" 
                max="20" 
                step="1"
                value={anneeProjection}
                onChange={(e) => setAnneeProjection(parseInt(e.target.value))}
                className="timeline-slider"
              />
              <span className="timeline-label">Maturité</span>
            </div>
            <div className="timeline-value">
              {anneeProjection === 0 && (
                <span>🌱 <strong>Plantation</strong> - Jeunes plants (tailles variables selon espèces)</span>
              )}
              {anneeProjection > 0 && anneeProjection < 20 && (
                <span>🌿 <strong>{anneeProjection} an{anneeProjection > 1 ? 's' : ''}</strong> - Croissance en cours (~{Math.round(anneeProjection / 20 * 100)}% maturité)</span>
              )}
              {anneeProjection >= 20 && (
                <span>🌳 <strong>Maturité atteinte</strong> (20+ ans) - Tailles adultes maximales</span>
              )}
            </div>
          </div>
          
          <div className="timeline-section saison-section">
            <label>
              <span className="timeline-icon">☀️</span>
              <strong>Saison {mode3D ? '(soleil 3D + feuillage)' : '(ombre 2D)'}</strong>
            </label>
              <div className="saison-buttons">
                <button 
                  className={`btn-saison ${saison === 'hiver' ? 'active' : ''}`}
                  onClick={() => setSaison('hiver')}
                  title="Hiver (21 déc) - Soleil bas 18°"
                >
                  ❄️
                </button>
                <button 
                  className={`btn-saison ${saison === 'printemps' ? 'active' : ''}`}
                  onClick={() => setSaison('printemps')}
                  title="Printemps (21 mars) - Équinoxe 45°"
                >
                  🌸
                </button>
                <button 
                  className={`btn-saison ${saison === 'ete' ? 'active' : ''}`}
                  onClick={() => setSaison('ete')}
                  title="Été (21 juin) - Soleil haut 65°"
                >
                  ☀️
                </button>
                <button 
                  className={`btn-saison ${saison === 'automne' ? 'active' : ''}`}
                  onClick={() => setSaison('automne')}
                  title="Automne (21 sept) - Équinoxe 45°"
                >
                  🍂
                </button>
              </div>
              <div className="saison-info">
                {saison === 'hiver' && '❄️ Hiver : ombre longue (18°)'}
                {saison === 'printemps' && '🌸 Printemps : ombre moyenne (45°)'}
                {saison === 'ete' && '☀️ Été : ombre courte (65°)'}
                {saison === 'automne' && '🍂 Automne : ombre moyenne (45°)'}
              </div>
            </div>
        </div>
      </div>
      )}
      
    </div>
  );
}

export default CanvasTerrain;
