import { useEffect, useRef, useState, useCallback, lazy, Suspense } from 'react';
import { FaMap, FaCube } from 'react-icons/fa';
import PanneauLateral from './PanneauLateral';
import GaugeHeure from './GaugeHeure';
import TimelineSection from './TimelineSection';
import logger from '../utils/logger';
import { ECHELLE_PIXELS_PAR_METRE, COUCHES_SOL_DEFAUT } from '../config/constants';

// Dynamic import pour Three.js (évite bundle 3x trop gros)
const CanvasTerrain3D = lazy(() => import('./CanvasTerrain3D'));

// ========== IMPORTS UTILS CANVAS ==========
import {
  creerMaison,
  creerCanalisation,
  creerCiterne,
  creerCaissonEau,
  creerCloture,
  creerTerrasse,
  creerPaves,
  creerGrille,
  creerIndicateurSud,
  creerMaisonObjet,
  creerTerrasseObjet,
  creerPavesObjet,
  creerCiterneObjet,
  creerCaissonEauObjet
} from '../utils/canvas/creerObjets';

import {
  afficherCercleTronc as afficherCercleTroncUtils,
  cacherCercleTronc as cacherCercleTroncUtils
} from '../utils/canvas/affichage';

import { calculerTailleSelonAnnee as calculerTailleUtils } from '../utils/canvas/croissance';

import {
  validerPositionArbre as validerPositionUtils,
  afficherLignesMesure as afficherLignesMesureUtils,
  revaliderTousLesArbres
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
  loggerPositionsPlanCopiable,
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

function CanvasTerrain({ dimensions, orientation, onDimensionsChange, onOrientationChange, onPlanComplete, arbresAPlanter: arbresAPlanterExterne = [] }) {
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
  const [timelineVisible, setTimelineVisible] = useState(true);
  const [saison, setSaison] = useState('ete');
  const [ongletActif, setOngletActif] = useState(null); // ✅ Pour forcer l'ouverture de l'onglet Config depuis 3D
  const [heureJournee, setHeureJournee] = useState(90); // Angle de 0° (matin) à 180° (soir), 90° = midi
  const [mode3D, setMode3D] = useState(false);
  const [planDataSync, setPlanDataSync] = useState(null); // État partagé 2D↔3D
  const syncTimerRef = useRef(null); // Timer pour throttle de la sync
  const [arbresAPlanter, setArbresAPlanter] = useState(arbresAPlanterExterne); // Gestion interne des arbres
  const [objetEnPlacement, setObjetEnPlacement] = useState(null); // Objet en cours de placement

  // ========== WRAPPERS POUR ADAPTER LES SIGNATURES ==========
  
  // Validation - useCallback pour éviter boucles infinies
  const validerPositionArbre = useCallback((canvas, arbreGroup) => {
    validerPositionUtils(canvas, arbreGroup, echelle, couchesSol, orientation);
  }, [echelle, couchesSol, orientation]);
  
  // Re-validation globale (à appeler après tout déplacement)
  const revaliderTous = useCallback((canvas) => {
    revaliderTousLesArbres(canvas, echelle, couchesSol, orientation);
  }, [echelle, couchesSol, orientation]);
  
  // Croissance - useCallback pour éviter boucles infinies
  const calculerTailleSelonAnnee = useCallback((arbre, annee) => {
    return calculerTailleUtils(arbre, annee, echelle);
  }, [echelle]);
  
  // ❌ Ombres désactivées en mode 2D (uniquement en 3D)
  
  const afficherCercleTronc = useCallback((canvas, arbreGroup) => {
    afficherCercleTroncUtils(canvas, arbreGroup, echelle, anneeProjection, calculerTailleSelonAnnee);
  }, [echelle, anneeProjection, calculerTailleSelonAnnee]);
  
  const cacherCercleTronc = useCallback((canvas) => {
    cacherCercleTroncUtils(canvas);
    canvas.getObjects().filter(obj => obj.isLigneMesure).forEach(obj => canvas.remove(obj));
    canvas.renderAll();
  }, []);
  
  const afficherLignesMesure = useCallback((canvas, arbreGroup) => {
    return afficherLignesMesureUtils(canvas, arbreGroup, echelle);
  }, [echelle]);
  
  // Menu contextuel - useCallback
  const afficherMenuContextuel = useCallback((obj, canvas) => {
    afficherMenuUtils(obj, canvas, canvasRef, contextMenuRef);
  }, []);
  
  const cacherMenuContextuel = useCallback(() => {
    cacherMenuUtils(contextMenuRef);
  }, []);
  
  const toggleVerrouObjetActif = useCallback(() => {
    toggleVerrouUtils(fabricCanvasRef.current, contextMenuRef, canvasRef);
  }, []);
  
  const supprimerObjetActif = useCallback(() => {
    supprimerObjetUtils(fabricCanvasRef.current);
  }, []);
  
  // Tooltip validation - useCallback
  const afficherTooltipValidation = useCallback((arbreGroup, canvas) => {
    afficherTooltipUtils(
      arbreGroup, 
      canvas, 
      validationTooltipRef, 
      anneeProjection, 
      calculerTailleSelonAnnee,
      afficherCercleTronc,
      afficherLignesMesure
    );
  }, [anneeProjection, calculerTailleSelonAnnee, afficherCercleTronc, afficherLignesMesure]);
  
  const cacherTooltipValidation = useCallback(() => {
    cacherTooltipUtils(validationTooltipRef);
  }, []);
  
  // Export/Import - useCallback simple (le throttle est dans loggerPositionsPlanCopiable)
  const exporterPlan = useCallback((canvas) => {
    exporterPlanUtils(canvas, dimensions, orientation, echelle, onPlanComplete);
  }, [dimensions, orientation, echelle, onPlanComplete]);
  
  const ajouterMesuresLive = useCallback((canvas) => {
    ajouterMesuresUtils(canvas, echelle, exporterPlan);
  }, [echelle, exporterPlan]);
  
  const chargerPlanDemo = () => {
    chargerPlanDemoUtils(fabricCanvasRef.current, echelle, ajouterGrille);
  };
  
  const chargerPlanParDefaut = () => {
    if (!fabricCanvasRef.current) return;
    
    // Nettoyer complètement le canvas (sauf grille, boussole, etc.)
    const canvas = fabricCanvasRef.current;
    const objets = canvas.getObjects().filter(obj => 
      !obj.isGridLine && 
      !obj.isBoussole && 
      !obj.isSolIndicator &&
      !obj.alignmentGuide &&
      !obj.isDimensionBox &&
      !obj.isAideButton &&
      !obj.isImageFond &&
      !obj.isCenterMark &&
      !obj.measureLabel
    );
    objets.forEach(obj => canvas.remove(obj));
    
    // Effacer le localStorage pour forcer le plan par défaut
    localStorage.removeItem('planTerrain');
    
    // Réinitialiser la liste des arbres
    setArbresAPlanter([]);
    
    // Charger le plan par défaut
    chargerPlanDemoUtils(canvas, echelle, ajouterGrille);
    
    // Notification
    const notification = document.createElement('div');
    notification.textContent = '🔄 Plan par défaut chargé';
    notification.style.cssText = 'position: fixed; top: 80px; right: 20px; background: #ff9800; color: white; padding: 12px 24px; border-radius: 8px; font-weight: 600; z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.3);';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
    
    logger.info('Plan', '✅ Plan par défaut rechargé (canvas nettoyé, arbres réinitialisés)');
  };
  
  const genererLogCopiable = () => {
    if (!fabricCanvasRef.current) return;
    
    // Récupérer les données du plan actuel depuis localStorage
    const planDataString = localStorage.getItem('planTerrain');
    
    if (!planDataString) {
      logger.warn('LogCopiable', 'Aucun plan sauvegardé');
      return;
    }
    
    const planData = JSON.parse(planDataString);
    
    // Générer le log dans la console
    loggerPositionsPlanCopiable(planData, echelle);
    
    // Notification
    const notification = document.createElement('div');
    notification.textContent = '📋 Log généré ! Ouvrez la console (F12)';
    notification.style.cssText = 'position: fixed; top: 80px; right: 20px; background: #9c27b0; color: white; padding: 12px 24px; border-radius: 8px; font-weight: 600; z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.3);';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
    
    logger.info('Plan', '✅ Log copiable généré dans console');
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
  
  // Navigation canvas 2D et 3D
  const resetZoom = () => {
    if (mode3D) {
      // ✅ Réinitialiser caméra 3D
      // La caméra 3D se réinitialise via le bouton dans CanvasTerrain3D
      window.dispatchEvent(new CustomEvent('reset3DCamera'));
      logger.info('3D', 'Caméra 3D réinitialisée');
    } else {
      // Réinitialiser zoom 2D
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      canvas.requestRenderAll();
      logger.info('Canvas', 'Zoom 2D réinitialisé (100%)');
    }
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
  
  const ajouterPointIntermediaire = useCallback((canvas, ligne, pointer) => {
    ajouterPointUtils(canvas, ligne, pointer);
  }, []);
  
  const trouverPositionValide = useCallback((canvas, arbre, largeur, hauteur, index) => {
    return trouverPositionUtils(canvas, arbre, largeur, hauteur, index, echelle);
  }, [echelle]);
  
  
  // Création d'objets en mode placement
  const preparerPlacement = useCallback((typeObjet) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Créer l'objet selon le type
    let nouvelObjet = null;
    
    if (typeObjet === 'maison') {
      nouvelObjet = creerMaisonObjet(echelle);
    } else if (typeObjet === 'terrasse') {
      nouvelObjet = creerTerrasseObjet(echelle);
    } else if (typeObjet === 'paves') {
      nouvelObjet = creerPavesObjet(echelle);
    } else if (typeObjet === 'citerne') {
      nouvelObjet = creerCiterneObjet(echelle);
    } else if (typeObjet === 'caisson-eau') {
      nouvelObjet = creerCaissonEauObjet(echelle);
    }
    
    if (nouvelObjet) {
      // Positionner au centre de la vue
      const vpt = canvas.viewportTransform;
      const centerX = (canvas.width / 2 - vpt[4]) / vpt[0];
      const centerY = (canvas.height / 2 - vpt[5]) / vpt[3];
      
      nouvelObjet.set({
        left: centerX,
        top: centerY,
        opacity: 0.7 // Semi-transparent pendant le placement
      });
      
      canvas.add(nouvelObjet);
      canvas.setActiveObject(nouvelObjet);
      setObjetEnPlacement(nouvelObjet);
      canvas.renderAll();
      
      logger.info('Placement', `${typeObjet} en cours de placement - cliquez pour déposer`);
    }
  }, [echelle]);
  
  // Fonctions d'ajout simplifiées
  const ajouterMaison = () => preparerPlacement('maison');
  const ajouterCanalisation = () => {
    creerCanalisation(fabricCanvasRef.current);
    revaliderTous(fabricCanvasRef.current);
  };
  const ajouterCiterne = () => preparerPlacement('citerne');
  const ajouterCaissonEau = () => preparerPlacement('caisson-eau');
  const ajouterCloture = () => {
    creerCloture(fabricCanvasRef.current, pointsClotureRef);
    revaliderTous(fabricCanvasRef.current);
  };
  const ajouterTerrasse = () => preparerPlacement('terrasse');
  const ajouterPaves = () => preparerPlacement('paves');
  
  const ajouterArbrePlante = (plante) => {
    // Ajouter l'arbre à la liste
    setArbresAPlanter(prev => [...prev, plante]);
    logger.info('Arbres', `${plante.name} ajouté à la liste`);
  };
  
  const retirerArbrePlante = (index) => {
    const arbreARetirer = arbresAPlanter[index];
    setArbresAPlanter(prev => prev.filter((_, i) => i !== index));
    
    // Supprimer aussi l'arbre du canvas
    if (fabricCanvasRef.current && arbreARetirer) {
      const canvas = fabricCanvasRef.current;
      const arbresCanvas = canvas.getObjects().filter(obj => obj.customType === 'arbre-a-planter');
      
      // Trouver l'arbre correspondant sur le canvas
      const arbreCanvas = arbresCanvas.find(a => a.arbreData?.id === arbreARetirer.id);
      if (arbreCanvas) {
        canvas.remove(arbreCanvas);
        canvas.renderAll();
        exporterPlan(canvas);
        logger.info('Arbres', `${arbreARetirer.name} retiré du plan et de la liste`);
      }
    }
  };
  
  // Plus de synchronisation automatique - l'utilisateur gère la liste manuellement
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
    afficherMenuContextuel,
    cacherMenuContextuel,
    cacherTooltipValidation,
    validerPositionArbre,
    revaliderTous,
    afficherTooltipValidation,
    cacherCercleTronc,
    exporterPlan,
    ajouterMesuresLive,
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
  
  // Ombres désactivées en mode 2D

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
    
    // Filtrer uniquement les objets visibles et valides
    const objetValide = (obj) => {
      return obj && 
             obj.visible !== false && 
             obj.left !== undefined && 
             obj.top !== undefined &&
             !isNaN(obj.left) && 
             !isNaN(obj.top);
    };
    
    const extractedData = {
      maisons: canvas.getObjects().filter(o => o.customType === 'maison' && objetValide(o)),
      citernes: canvas.getObjects().filter(o => o.customType === 'citerne' && objetValide(o)),
      canalisations: canvas.getObjects().filter(o => o.customType === 'canalisation' && objetValide(o)),
      clotures: canvas.getObjects().filter(o => o.customType === 'cloture' && objetValide(o)),
      terrasses: canvas.getObjects().filter(o => (o.customType === 'paves' || o.customType === 'terrasse') && objetValide(o)),
      caissonsEau: canvas.getObjects().filter(o => o.customType === 'caisson-eau' && objetValide(o)),
      arbres: canvas.getObjects().filter(o => o.customType === 'arbre-a-planter' && objetValide(o)),
      echelle: echelle3D
    };
    
    // Synchronisation 2D→3D
    logger.debug('Sync', 'Sync 2D→3D', {
      terrasses: extractedData.terrasses.length,
      arbres: extractedData.arbres.length,
      citernes: extractedData.citernes.length
    });
    
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
      logger.warn('Sync', 'Objet non trouvé pour sync 3D→2D', objetData);
      return;
    }
    
    // Convertir position 3D → 2D
    const newLeft = objetData.newPosition.x * echelle;
    const newTop = objetData.newPosition.z * echelle;
    
    // VALIDATION : Vérifier collision avec les maisons
    const maisons = canvas.getObjects().filter(o => o.customType === 'maison');
    if (maisons.length > 0 && objetData.type !== 'maison') {
      // Taille de l'objet
      let objetSize = 50; // Default
      if (objet.radius) {
        objetSize = objet.radius * 2 * (objet.scaleX || 1);
      } else if (objet.getScaledWidth) {
        objetSize = Math.max(objet.getScaledWidth(), objet.getScaledHeight());
      }
      
      // Vérifier collision avec chaque maison
      for (const maison of maisons) {
        const maisonWidth = maison.getScaledWidth ? maison.getScaledWidth() : maison.width;
        const maisonHeight = maison.getScaledHeight ? maison.getScaledHeight() : maison.height;
        
        const maisonBounds = {
          left: maison.left,
          right: maison.left + maisonWidth,
          top: maison.top,
          bottom: maison.top + maisonHeight
        };
        
        // Vérifier si l'objet serait à l'intérieur de la maison
        const isInsideMaison = 
          newLeft + objetSize / 2 > maisonBounds.left &&
          newLeft - objetSize / 2 < maisonBounds.right &&
          newTop + objetSize / 2 > maisonBounds.top &&
          newTop - objetSize / 2 < maisonBounds.bottom;
        
        if (isInsideMaison) {
          logger.warn('Canvas', 'Impossible: objet à l\'intérieur d\'une maison');
          // Resynchroniser pour annuler le déplacement en 3D
          throttledSync();
          return; // Bloquer le déplacement
        }
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
  
  // ✅ Callback pour sélectionner un objet depuis la 3D
  const handleObjetSelection3D = useCallback((objetData) => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const echelle = ECHELLE_PIXELS_PAR_METRE;
    
    // Les positions dans objetData.position sont déjà en mètres
    const pos3DX_m = objetData.position[0];
    const pos3DZ_m = objetData.position[2];
    
    // Convertir en pixels pour la comparaison
    const posX_px = pos3DX_m * echelle;
    const posZ_px = pos3DZ_m * echelle;
    
    // ✅ Log détaillé pour debug
    const typeRecherche = objetData.customType || objetData.type; // Utiliser customType si disponible
    
    // ✅ Lister tous les objets du même type sur le canvas
    const objetsDuMemeTypeList = canvas.getObjects()
      .filter(o => o.customType === typeRecherche)
      .map(o => ({
        customType: o.customType,
        left: o.left?.toFixed(1),
        top: o.top?.toFixed(1),
        angle: o.angle,
        originX: o.originX,
        originY: o.originY
      }));
    
    logger.info('Selection3D', `🔍 Recherche objet depuis 3D:`, {
      typeRecherche,
      position3D_m: `(${pos3DX_m.toFixed(2)}, ${pos3DZ_m.toFixed(2)})`,
      position2D_attendue_px: `(${posX_px.toFixed(1)}, ${posZ_px.toFixed(1)})`,
      echelle,
      totalObjetsCanvas: canvas.getObjects().length,
      objetsDeCeType: objetsDuMemeTypeList.length,
      objetsDuMemeTypeList
    });
    
    // Trouver l'objet dans le canvas 2D
    const objet = canvas.getObjects().find(o => {
      if (o.customType !== typeRecherche) return false;
      
      // Comparer position approximative (tolérance très large pour les objets)
      const tolerance = 200; // ✅ Augmenté à 200 pixels
      const diffX = Math.abs(o.left - posX_px);
      const diffY = Math.abs(o.top - posZ_px);
      
      // Logger pour chaque objet du bon type
      logger.info('Selection3D', `📋 Objet 2D trouvé de type "${o.customType}":`, {
        pos2D: `(${o.left.toFixed(1)}px, ${o.top.toFixed(1)}px)`,
        diff: `(${diffX.toFixed(1)}px, ${diffY.toFixed(1)}px)`,
        tolerance,
        match: diffX < tolerance && diffY < tolerance
      });
      
      return diffX < tolerance && diffY < tolerance;
    });
    
    if (objet) {
      // Sélectionner l'objet dans le canvas 2D
      canvas.setActiveObject(objet);
      canvas.renderAll();
      
      // ✅ Ouvrir automatiquement l'onglet Config
      setOngletActif('config');
      
      // Logger pour debug
      logger.info('Selection3D', `✅ Objet ${objetData.type} sélectionné depuis la 3D`);
    } else {
      // Filtrer uniquement les objets du même type pour le debug
      const objetsDuMemeType = canvas.getObjects()
        .filter(o => o.customType === typeRecherche)
        .map(o => ({
          type: o.customType,
          left: o.left,
          top: o.top,
          diffX: Math.abs(o.left - posX_px).toFixed(1),
          diffY: Math.abs(o.top - posZ_px).toFixed(1)
        }));
      
      logger.warn('Selection3D', '❌ Objet non trouvé dans le canvas 2D', {
        typeRequested: typeRecherche,
        typeOriginal: objetData.type,
        customType: objetData.customType,
        position3D: objetData.position,
        position2Dattendue: `(${posX_px.toFixed(1)}px, ${posZ_px.toFixed(1)}px)`,
        tolerance: 200, // ✅ Corrigé : tolérance réelle utilisée
        objetsDuMemeType: objetsDuMemeType.length > 0 ? objetsDuMemeType : 'Aucun objet de ce type'
      });
    }
  }, []);
  
  // Gérer le placement interactif d'objets
  useEffect(() => {
    if (!fabricCanvasRef.current || !objetEnPlacement) return;
    
    const canvas = fabricCanvasRef.current;
    let firstClick = true; // Ignorer le premier clic (celui qui a créé l'objet)
    
    // Suivre la souris
    const handleMouseMove = (e) => {
      const pointer = canvas.getPointer(e.e);
      objetEnPlacement.set({
        left: pointer.x,
        top: pointer.y
      });
      canvas.renderAll();
    };
    
    // Déposer l'objet au clic
    const handleMouseDown = (e) => {
      if (firstClick) {
        firstClick = false;
        return;
      }
      
      // Finaliser le placement
      objetEnPlacement.set({ opacity: 1 });
      setObjetEnPlacement(null);
      exporterPlan(canvas);
      revaliderTous(canvas);
      logger.info('Placement', 'Objet déposé avec succès');
    };
    
    // Annuler avec Escape
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        canvas.remove(objetEnPlacement);
        setObjetEnPlacement(null);
        canvas.renderAll();
        logger.info('Placement', 'Placement annulé (Echap)');
      }
    };
    
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:down', handleMouseDown);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:down', handleMouseDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [objetEnPlacement, exporterPlan, revaliderTous]);

  // ========== JSX ==========

  return (
    <div className="canvas-terrain-container">
      {/* Bouton toggle timeline */}
      <button 
        className="timeline-toggle-btn"
        onClick={() => setTimelineVisible(!timelineVisible)}
        title={timelineVisible ? 'Masquer la projection temporelle' : 'Afficher la projection temporelle'}
      >
        {timelineVisible ? '📅 Masquer' : '📅 Projection'}
      </button>

      {/* Timeline de croissance (slider temporel) - EN BAS, DÉPLAÇABLE */}
      {timelineVisible && (
      <div className="timeline-croissance">
        {/* Handle de déplacement */}
        <div 
          className="timeline-drag-handle"
          onMouseDown={(e) => {
            const timeline = e.currentTarget.parentElement;
            const rect = timeline.getBoundingClientRect();
            const startX = e.clientX - rect.left;
            const startY = e.clientY - rect.top;
            
            const handleMouseMove = (moveEvent) => {
              timeline.style.left = `${moveEvent.clientX - startX}px`;
              timeline.style.top = `${moveEvent.clientY - startY}px`;
              timeline.style.transform = 'none';
            };
            
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            e.preventDefault();
          }}
        >
          ⋮⋮ Projection temporelle - Déplacer ⋮⋮
        </div>
        
        <div className="timeline-row">
          {/* Section 1: Projection temporelle */}
          <TimelineSection 
            width={180}
            bottomText={
              anneeProjection === 0 ? '🌱 Plantation - Jeunes plants' :
              anneeProjection > 0 && anneeProjection < 20 ? `🌿 ${anneeProjection} an${anneeProjection > 1 ? 's' : ''} - Croissance (~${Math.round(anneeProjection / 20 * 100)}%)` :
              '🌳 Maturité (20+ ans)'
            }
          >
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
          </TimelineSection>
          
          {/* Section 2: Heure du jour */}
          <GaugeHeure 
            heureActuelle={heureJournee}
            saison={saison}
            onHeureChange={setHeureJournee}
          />
          
          {/* Section 3: Saison */}
          <TimelineSection 
            width={200}
            hasBorder={true}
            bottomText={
              saison === 'hiver' ? '❄️ Hiver (18)' :
              saison === 'printemps' ? '🌸 Printemps (45)' :
              saison === 'ete' ? '☀️ Été (65)' :
              '🍂 Automne (45)'
            }
          >
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
          </TimelineSection>
        </div>
      </div>
      )}

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
          <button 
          onClick={resetZoom}
          title="Réinitialiser la caméra (2D/3D)"
          >
          📷
          </button>
        </div>

      {/* Layout avec panneau latéral + vue principale */}
      <div style={{ display: 'flex', width: '100%', height: 'calc(100% - 40px)', marginTop: '40px' }}>
        {/* Panneau latéral avec outils et stats - TOUJOURS VISIBLE */}
        <PanneauLateral
            canvas={fabricCanvasRef.current} 
        arbresAPlanter={arbresAPlanter}
            couchesSol={couchesSol}
            onCouchesSolChange={setCouchesSol}
        dimensions={dimensions}
        echelle={echelle}
        onDimensionsChange={onDimensionsChange}
        imageFondChargee={imageFondChargee}
        opaciteImage={opaciteImage}
        onAjouterMaison={ajouterMaison}
        onAjouterTerrasse={ajouterTerrasse}
        onAjouterPaves={ajouterPaves}
        onAjouterCanalisation={ajouterCanalisation}
        onAjouterCiterne={ajouterCiterne}
        onAjouterCaissonEau={ajouterCaissonEau}
        onAjouterCloture={ajouterCloture}
        onVerrouillerSelection={verrouillerSelection}
        onSupprimerSelection={supprimerSelection}
        onEffacerTout={effacerTout}
        onChargerPlanParDefaut={chargerPlanParDefaut}
        onChargerImageFond={chargerImageFond}
        onAjusterOpaciteImage={ajusterOpaciteImage}
        onSupprimerImageFond={supprimerImageFond}
        onResetZoom={resetZoom}
        onExporterPlan={exporterPlan}
        onGenererLogCopiable={genererLogCopiable}
        onAjouterArbrePlante={ajouterArbrePlante}
        onRetirerArbrePlante={retirerArbrePlante}
        ongletActifExterne={ongletActif}
        />

        {/* Vue 3D Suspense */}
        {mode3D && (
          <Suspense fallback={<div className="loading-3d">🌳 Chargement 3D...</div>}>
            <div style={{ flex: 1, position: 'relative' }}>
              <CanvasTerrain3D 
                dimensions={dimensions}
                planData={planDataSync}
                arbresAPlanter={arbresAPlanter}
                anneeProjection={anneeProjection}
                saison={saison}
                heureJournee={heureJournee}
                couchesSol={couchesSol}
                onObjetPositionChange={handleObjetPositionChange3D}
                onObjetSelectionChange={handleObjetSelection3D}
              />
            </div>
          </Suspense>
        )}
        
        {/* Vue 2D (cachée si mode 3D, mais toujours montée pour Fabric.js) */}
        <div style={{ flex: 1, position: 'relative', display: mode3D ? 'none' : 'block' }}>
          {/* Panneau de validation latéral fixe */}
          <div className="panel-validation" ref={validationTooltipRef} style={{ display: 'none' }}>
          </div>
          
          {/* Canvas plein écran */}
          <div className="canvas-wrapper" style={{ width: '100%', height: '100%', position: 'relative' }}>
            <canvas id="canvas-terrain" ref={canvasRef}></canvas>

            {/* Menu contextuel en bulle */}
            <div className="context-menu" ref={contextMenuRef}>
              <button 
                className="context-btn context-rotate"
                onClick={() => {
                  const actif = fabricCanvasRef.current?.getActiveObject();
                  if (actif && !actif.isGridLine && !actif.isBoussole && !actif.isImageFond && !actif.customType?.includes('cloture') && !actif.customType?.includes('canalisation')) {
                    const newAngle = ((actif.angle || 0) + 90) % 360;
                    actif.set({ angle: newAngle });
                    actif.setCoords();
                    fabricCanvasRef.current.renderAll();
                    setTimeout(() => exporterPlan(fabricCanvasRef.current), 50);
                  }
                }}
                title="Rotation +90°"
              >
                ↻
              </button>
              <button 
                className="context-btn context-rotate"
                onClick={() => {
                  const actif = fabricCanvasRef.current?.getActiveObject();
                  if (actif && !actif.isGridLine && !actif.isBoussole && !actif.isImageFond && !actif.customType?.includes('cloture') && !actif.customType?.includes('canalisation')) {
                    const newAngle = ((actif.angle || 0) - 90 + 360) % 360;
                    actif.set({ angle: newAngle });
                    actif.setCoords();
                    fabricCanvasRef.current.renderAll();
                    setTimeout(() => exporterPlan(fabricCanvasRef.current), 50);
                  }
                }}
                title="Rotation -90°"
              >
                ↺
              </button>
              <button 
                className="context-btn context-duplicate"
                onClick={() => {
                  const actif = fabricCanvasRef.current?.getActiveObject();
                  if (actif && !actif.isGridLine && !actif.isBoussole && !actif.isImageFond) {
                    actif.clone().then((cloned) => {
                      // Copier les propriétés custom manuellement
                      if (actif.arbreData) {
                        cloned.arbreData = { ...actif.arbreData };
                      }
                      if (actif.tailles) {
                        cloned.tailles = { ...actif.tailles };
                      }
                      if (actif.iconeType) {
                        cloned.iconeType = actif.iconeType;
                      }
                      if (actif.validationStatus) {
                        cloned.validationStatus = actif.validationStatus;
                      }
                      
                      cloned.set({
                        left: actif.left + echelle,
                        top: actif.top + echelle
                      });
                      fabricCanvasRef.current.add(cloned);
                      fabricCanvasRef.current.setActiveObject(cloned);
                      fabricCanvasRef.current.renderAll();
                      
                      // Utiliser setTimeout pour éviter les conflits
                      setTimeout(() => {
                        exporterPlan(fabricCanvasRef.current);
                        revaliderTous(fabricCanvasRef.current);
                      }, 50);
                    });
                  }
                }}
                title="Dupliquer"
              >
                📋
              </button>
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
      </div>

      
    </div>
  );
}

export default CanvasTerrain;
