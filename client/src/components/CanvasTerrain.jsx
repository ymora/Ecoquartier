import { useEffect, useRef, useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { FaMap, FaCube } from 'react-icons/fa';
import * as fabric from 'fabric';
import PanneauLateral from './PanneauLateral';
import logger from '../utils/logger';
import { ECHELLE_PIXELS_PAR_METRE, COUCHES_SOL_DEFAUT } from '../config/constants';
import { notifications } from '../utils/notifications';
import { ajouterTerrainAuCanvas, agrandirTerrainSiNecessaire } from '../utils/canvas/terrainUtils';
// import { diagnostiquerSynchronisation } from '../utils/canvas/diagnosticSync'; // Désactivé temporairement

// Dynamic import pour Three.js (évite bundle 3x trop gros)
const CanvasTerrain3D = lazy(() => import('./CanvasTerrain3D'));

// ========== IMPORTS UTILS CANVAS ==========
import {
  creerCanalisation,
  creerCloture,
  recentrerVueSurContenu,
  centrerVueSurCentre,
  creerGrille,
  creerBoussole,
  creerIndicateurSud,
  creerMaisonObjet,
  creerTerrasseObjet,
  creerPavesObjet,
  creerCiterneObjet,
  creerCaissonEauObjet
} from '../utils/canvas/creerObjets';

import {
  cacherCercleTronc as cacherCercleTroncUtils
} from '../utils/canvas/affichage';

import { calculerTailleSelonAnnee as calculerTailleUtils } from '../utils/canvas/croissance';

import {
  validerPositionArbre as validerPositionUtils,
  revaliderTousLesArbres
} from '../utils/canvas/canvasValidation';

import {
  afficherMenuContextuel as afficherMenuUtils,
  cacherMenuContextuel as cacherMenuUtils,
  toggleVerrouObjetActif as toggleVerrouUtils,
  supprimerObjetActif as supprimerObjetUtils
} from '../utils/canvas/menuContextuel';
// Import supprimé - on revient au système original

// import {
//   afficherTooltipValidation as afficherTooltipUtils,
//   cacherTooltipValidation as cacherTooltipUtils
// } from '../utils/canvas/tooltipValidation'; // SUPPRIMÉ - infos maintenant dans Config

import {
  exporterPlan as exporterPlanUtils,
  telechargerPlanJSON as telechargerPlanJSONUtils,
  chargerImageFond as chargerImageUtils,
  ajusterOpaciteImage as ajusterOpaciteUtils,
  supprimerImageFond as supprimerImageUtils,
  ajouterMesuresLive as ajouterMesuresUtils
} from '../utils/canvas/exportImport';
import { logAllCanvasObjects, exportCompleteData } from '../utils/canvas/completeObjectLogger';

import {
  supprimerSelection as supprimerSelectionUtils,
  verrouillerSelection as verrouillerSelectionUtils,
  effacerTout as effacerToutUtils,
  ajouterPointIntermediaire as ajouterPointUtils
} from '../utils/canvas/actionsCanvas';

// ========== IMPORTS HOOKS ==========
import { useCanvasInit } from '../hooks/useCanvasInit';
import { useCanvasEvents } from '../hooks/useCanvasEvents';
import { useTimelineSync } from '../hooks/useTimelineSync';

import './CanvasTerrain.css';
import { canvasOperations } from '../utils/canvas/canvasOperations';

function CanvasTerrain({ dimensions, orientation, onDimensionsChange, onOrientationChange, onPlanComplete }) {
  // ========== REFS ==========
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  // const validationTooltipRef = useRef(null); // SUPPRIMÉ - plus de tooltip
  const pointsClotureRef = useRef([]);
  const contextMenuRef = useRef(null);
  const imageFondRef = useRef(null);
  
  // ========== CONSTANTES ==========
  const echelle = ECHELLE_PIXELS_PAR_METRE;
  
  // ========== STATES ==========
  const [couchesSol, setCouchesSol] = useState(COUCHES_SOL_DEFAUT);
  const [imageFondChargee, setImageFondChargee] = useState(false);
  const [opaciteImage, setOpaciteImage] = useState(0.8);
  const [solTransparent, setSolTransparent] = useState(false);
  const [anneeProjection, setAnneeProjection] = useState(0);
  const [saison, setSaison] = useState('ete');
  const [ongletActif, setOngletActif] = useState(null); // ✅ Pour forcer l'ouverture de l'onglet Config depuis 3D
  const [heureJournee, setHeureJournee] = useState(90); // Angle de 0° (matin) à 180° (soir), 90° = midi
  const [mode3D, setMode3D] = useState(false);
  const [planDataSync, setPlanDataSync] = useState(null); // État partagé 2D↔3D
  const syncTimerRef = useRef(null); // Timer pour throttle de la sync
  const [objetEnPlacement, setObjetEnPlacement] = useState(null); // Objet en cours de placement
  const [syncKey, setSyncKey] = useState(0); // Clé pour forcer la synchronisation 3D

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

  // ✅ Afficher la timeline uniquement s'il y a des arbres sur le plan
  // ⚠️ Dépend de planDataSync pour se mettre à jour quand on ajoute/retire des arbres
  const hasArbres = useMemo(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return false;
    const objs = canvas.getObjects();
    return objs.some(o => o.customType === 'arbre-a-planter' || o.customType === 'arbre-existant');
  }, [planDataSync]); // ✅ Se mettre à jour quand le plan change
  
  const cacherCercleTronc = useCallback((canvas) => {
    cacherCercleTroncUtils(canvas);
    canvas.getObjects().filter(obj => obj.isLigneMesure).forEach(obj => canvasOperations.supprimer(canvas, obj));
    canvasOperations.rendre(canvas);
  }, []);
  
  // Menu contextuel - useCallback (SYSTÈME ORIGINAL)
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
  
  // Tooltip validation SUPPRIMÉ - infos maintenant dans Config
  
  // Export/Import - useCallback simple (le throttle est dans loggerPositionsPlanCopiable)
  const exporterPlan = useCallback((canvas) => {
    if (!canvas) return;
    exporterPlanUtils(canvas, dimensions, orientation, echelle, onPlanComplete);
  }, [dimensions, orientation, echelle, onPlanComplete]);
  
  const telechargerPlanJSON = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    telechargerPlanJSONUtils(fabricCanvasRef.current, dimensions, orientation, echelle);
  }, [dimensions, orientation, echelle]);
  
  const ajouterMesuresLive = useCallback((canvas) => {
    ajouterMesuresUtils(canvas, echelle, exporterPlan);
  }, [echelle, exporterPlan]);
  
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
    objets.forEach(obj => canvasOperations.supprimer(canvas, obj));
    
    // Effacer le localStorage
    localStorage.removeItem('planTerrain');
    
    // Ajouter un terrain vide sélectionnable
    ajouterTerrainAuCanvas(canvas, echelle, dimensions);
    
    // Recentrer la vue sur le terrain
    setTimeout(() => {
      recentrerVueSurContenu(canvas);
    }, 200);
    
    // Notification
    notifications.show('🌱 Terrain vide créé - Créez votre plan !', 'success');
    
    logger.info('Plan', '✅ Terrain vide créé - Prêt pour votre plan personnalisé');
  };
  
  // Log complet de tous les objets
  const loggerComplet = useCallback(() => {
    logAllCanvasObjects(fabricCanvasRef.current, echelle);
  }, [echelle]);

  // Export complet des données
  const exporterComplet = useCallback(() => {
    exportCompleteData(fabricCanvasRef.current, echelle);
  }, [echelle]);
  
  const chargerImageFond = () => {
    chargerImageUtils(fabricCanvasRef, imageFondRef, opaciteImage, setImageFondChargee, ajouterGrille);
  };
  
  const ajusterOpaciteImage = (nouvelleOpacite) => {
    ajusterOpaciteUtils(nouvelleOpacite, fabricCanvasRef, imageFondRef, setOpaciteImage);
  };
  
  const supprimerImageFond = () => {
    supprimerImageUtils(fabricCanvasRef, imageFondRef, setImageFondChargee);
  };
  
  // ✅ Obtenir l'URL de l'image de fond pour la vue 3D
  const getImageFondUrl = useCallback(() => {
    if (!imageFondRef.current || !imageFondChargee) return null;
    
    const img = imageFondRef.current;
    // Fabric.js Image : essayer différentes méthodes pour obtenir l'URL
    try {
      // Méthode 1 : getSrc() (Fabric.js v5+)
      if (typeof img.getSrc === 'function') {
        const src = img.getSrc();
        if (src) return src;
      }
      
      // Méthode 2 : Accéder directement à _element si disponible
      if (img._element && img._element.src) {
        return img._element.src;
      }
      
      // Méthode 3 : getElement() pour obtenir l'élément HTML
      if (typeof img.getElement === 'function') {
        const imgElement = img.getElement();
        if (imgElement && imgElement.src) {
          return imgElement.src;
        }
      }
      
      // Méthode 4 : toDataURL() comme fallback
      if (typeof img.toDataURL === 'function') {
        return img.toDataURL();
      }
    } catch (error) {
      logger.warn('ImageFond', 'Erreur extraction URL image:', error);
    }
    return null;
  }, [imageFondChargee]);
  
  // Navigation canvas 2D et 3D
  const resetZoom = () => {
    if (mode3D) {
      // ✅ Réinitialiser caméra 3D vers le centre (0,0,0)
      window.dispatchEvent(new CustomEvent('reset3DCamera'));
      logger.info('3D', 'Caméra 3D réinitialisée vers le centre (0,0,0)');
    } else {
      // Réinitialiser zoom 2D et centrer sur le centre (0,0)
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      
      // Centrer la vue sur le centre du canvas (0,0)
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Calculer le décalage pour centrer sur (0,0)
      const offsetX = centerX;
      const offsetY = centerY;
      
      canvas.setViewportTransform([1, 0, 0, 1, offsetX, offsetY]);
      canvas.requestRenderAll();
      logger.info('Canvas', 'Vue 2D centrée sur le centre (0,0)');
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
      
      // ✅ Recentrer la vue sur le nouvel objet
      setTimeout(() => {
        recentrerVueSurContenu(canvas);
      }, 100);
      
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
    // Ajouter l'arbre directement au canvas (sans liste interne)
    if (fabricCanvasRef.current) {
      const canvas = fabricCanvasRef.current;
      
      // Créer un cercle pour représenter l'arbre
      const cercleArbre = new fabric.Circle({
        left: 200,
        top: 200,
        radius: 20,
        fill: '#4caf50',
        stroke: '#2e7d32',
        strokeWidth: 2,
        originX: 'center',
        originY: 'center',
        selectable: true,
        evented: true
      });
      
      // Créer un label pour l'arbre
      const labelArbre = new fabric.Text(plante.name, {
        left: 200,
        top: 200,
        fontSize: 12,
        fill: '#2e7d32',
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false
      });
      
      // Calculer les tailles initiales (année 0)
      const taillesInitiales = calculerTailleSelonAnnee(plante, 0);
      
      // Grouper l'arbre
      const arbreGroup = new fabric.Group([cercleArbre, labelArbre], {
        customType: 'arbre-a-planter',
        arbreData: plante,
        originX: 'center',
        originY: 'center',
        // Propriétés de validation
        validationStatus: 'ok',
        validationMessages: [],
        tailles: taillesInitiales, // Tailles calculées
        iconeType: '🌱', // Icône par défaut pour les jeunes arbres
        elevationSol: 0 // ✅ Par défaut, arbre au niveau du sol (peut être modifié dans Config)
      });
      
      canvas.add(arbreGroup);
      canvas.setActiveObject(arbreGroup);
        canvas.renderAll();
      // Compter les arbres existants pour ajouter un numéro
      const arbresExistants = canvas.getObjects().filter(o => o.customType === 'arbre-a-planter');
      const numeroArbre = arbresExistants.length > 1 ? ` #${arbresExistants.length}` : '';
      logger.info('Arbres', `${plante.name}${numeroArbre} ajouté au canvas`);
    }
  };
  
  
  const ajouterGrille = useCallback((canvas) => creerGrille(canvas, echelle), [echelle]);
  const ajouterBoussole = useCallback((canvas) => creerBoussole(canvas, orientation, onOrientationChange, echelle), [orientation, onOrientationChange, echelle]);
  const ajouterIndicateurSud = useCallback((canvas) => creerIndicateurSud(canvas, orientation, onOrientationChange, echelle, saison, heureJournee), [orientation, onOrientationChange, echelle, saison, heureJournee]);

  // ========== HOOKS PERSONNALISÉS ==========
  
  // Initialisation du canvas
  useCanvasInit({
    canvasRef,
    fabricCanvasRef,
    ajouterGrille,
    ajouterBoussole,
    ajouterIndicateurSud
  });

  // ========== CENTRAGE AUTOMATIQUE AU DÉMARRAGE ==========
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      // Centrer la vue rapidement après l'initialisation
      const timer = setTimeout(() => {
        // Centrer sur le centre du canvas (0, 0) au démarrage
        centrerVueSurCentre(canvas);
        logger.info('Canvas', '🎯 Vue centrée automatiquement sur le centre');
      }, 100); // Juste le temps que le canvas soit prêt
      
      return () => clearTimeout(timer);
    }
  }, []); // Seulement au montage du composant

  // Event listeners du canvas
  useCanvasEvents({
    fabricCanvasRef,
    echelle,
    afficherMenuContextuel,
    cacherMenuContextuel,
    // cacherTooltipValidation, // SUPPRIMÉ
    validerPositionArbre,
    revaliderTous,
    // afficherTooltipValidation, // SUPPRIMÉ
    cacherCercleTronc,
    exporterPlan,
    ajouterMesuresLive,
    ajouterPointIntermediaire,
    onDimensionsChange
  });

  // Mettre à jour le soleil 2D quand la saison ou l'heure change
  useEffect(() => {
    if (fabricCanvasRef.current) {
      ajouterIndicateurSud(fabricCanvasRef.current);
    }
  }, [saison, heureJournee]);

  // Synchronisation timeline
  useTimelineSync({
    fabricCanvasRef,
    anneeProjection,
    calculerTailleSelonAnnee,
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

  // useEffect pour tooltip SUPPRIMÉ - plus de tooltip

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
    
    // ✅ Extraire le terrain avec son maillage d'élévation
    const terrain2D = canvas.getObjects().find(o => o.customType === 'sol');
    
    const extractedData = {
      maisons: canvas.getObjects().filter(o => o.customType === 'maison' && objetValide(o)),
      citernes: canvas.getObjects().filter(o => o.customType === 'citerne' && objetValide(o)),
      canalisations: canvas.getObjects().filter(o => o.customType === 'canalisation' && objetValide(o)),
      clotures: canvas.getObjects().filter(o => o.customType === 'cloture' && objetValide(o)),
      terrasses: canvas.getObjects().filter(o => o.customType === 'terrasse' && objetValide(o)),
      paves: canvas.getObjects().filter(o => o.customType === 'paves' && objetValide(o)),
      caissonsEau: canvas.getObjects().filter(o => o.customType === 'caisson-eau' && objetValide(o)),
      arbres: canvas.getObjects().filter(o => o.customType === 'arbre-a-planter' && objetValide(o)),
      terrain: canvas.getObjects().filter(o => o.customType === 'sol' && objetValide(o)),
      // ✅ Ajouter le maillage d'élévation pour le terrain 3D
      terrainMaillage: terrain2D?.maillageElevation || null,
      terrainTailleMaille: terrain2D?.tailleMailleM || 5,
      echelle: echelle3D
    };
    
    // 🔍 DEBUG : Vérifier si le maillage est transmis
    if (terrain2D?.maillageElevation) {
      const elevMax = Math.max(...terrain2D.maillageElevation.flat());
      const elevMin = Math.min(...terrain2D.maillageElevation.flat());
      if (elevMax !== 0 || elevMin !== 0) {
        console.log('📊 Sync 2D→3D: Maillage terrain avec déformations', {
          elevMax: elevMax.toFixed(2) + 'm',
          elevMin: elevMin.toFixed(2) + 'm',
          noeuds: `${terrain2D.maillageElevation.length}×${terrain2D.maillageElevation[0]?.length || 0}`
        });
      }
    }
    
    // Synchronisation 2D→3D
    logger.debug('Sync', 'Sync 2D→3D', {
      terrasses: extractedData.terrasses.length,
      paves: extractedData.paves.length,
      arbres: extractedData.arbres.length,
      citernes: extractedData.citernes.length
    });
    
    setPlanDataSync(extractedData);
    
    // ✅ DIAGNOSTIC : Activer en développement pour vérifier la synchronisation
    if (window.location.hostname === 'localhost') {
      // Diagnostic une seule fois au montage
      if (!canvas.__syncDiagnosticDone) {
        setTimeout(() => {
          // Le setTimeout permet d'attendre que data3D soit calculé
          logger.info('Diagnostic', '🔍 Diagnostic de synchronisation 2D↔3D activé');
        }, 2000);
        canvas.__syncDiagnosticDone = true;
      }
    }
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
  }, [syncCanvasTo3D]);
  
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
    
    // ✅ AGRANDIR LE TERRAIN si nécessaire lors du déplacement 3D→2D
    if (onDimensionsChange) {
      agrandirTerrainSiNecessaire(canvas, objet, echelle, onDimensionsChange);
    }
    
    // ✅ Resynchroniser vers la 3D après un court délai
    setTimeout(() => {
      throttledSync();
      logger.debug('Sync', '✅ Sync 3D→2D→3D complétée');
    }, 150);
  }, [throttledSync, onDimensionsChange, echelle]);
  
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
    
    const typeRecherche = objetData.customType || objetData.type;
    
    // Trouver l'objet dans le canvas 2D
    const objet = canvas.getObjects().find(o => {
      if (o.customType !== typeRecherche) return false;
      
      const tolerance = 200;
      const diffX = Math.abs(o.left - posX_px);
      const diffY = Math.abs(o.top - posZ_px);
      
      return diffX < tolerance && diffY < tolerance;
    });
    
    if (objet) {
      // Sélectionner l'objet dans le canvas 2D
      canvas.setActiveObject(objet);
      canvas.renderAll();
      
      // ✅ Ne PAS basculer automatiquement sur Config - l'utilisateur y va en cliquant sur l'objet
      
      // Logger pour debug avec détails spécifiques selon le type
      let detailObjet = '';
      switch(objetData.type) {
        case 'arbre': {
          const nomArbre = objetData.arbreData?.name || objetData.arbreData?.id || 'inconnu';
          detailObjet = ` "${nomArbre}"`;
          break;
        }
        case 'maison':
          detailObjet = ` #${(objetData.index || 0) + 1}`;
          break;
        case 'terrasse':
          detailObjet = ` (${objetData.largeur?.toFixed(1)}m × ${objetData.profondeur?.toFixed(1)}m)`;
          break;
        case 'paves':
          detailObjet = ` enherbé (${objetData.largeur?.toFixed(1)}m × ${objetData.profondeur?.toFixed(1)}m)`;
          break;
        case 'citerne':
          detailObjet = ` (${objetData.volume || 'N/A'}L)`;
          break;
        case 'caisson-eau':
          detailObjet = ` (${objetData.volume?.toFixed(1) || 'N/A'}m³)`;
          break;
        case 'canalisation':
          detailObjet = ` (${objetData.x1?.toFixed(1)},${objetData.y1?.toFixed(1)} → ${objetData.x2?.toFixed(1)},${objetData.y2?.toFixed(1)})`;
          break;
        case 'cloture':
          detailObjet = ` (${objetData.hauteur?.toFixed(1)}m hauteur)`;
          break;
      }
      // Compter les objets du même type pour ajouter un numéro
      const objetsDuMemeType = canvas.getObjects().filter(o => o.customType === objetData.type);
      const numeroObjet = objetsDuMemeType.length > 1 ? ` #${objetsDuMemeType.indexOf(objet) + 1}` : '';
      
      logger.info('Selection3D', `✅ ${objetData.type}${detailObjet}${numeroObjet} sélectionné depuis la 3D`);
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
    const handleMouseDown = () => {
      if (firstClick) {
        firstClick = false;
        return;
      }
      
      // Finaliser le placement
      objetEnPlacement.set({ opacity: 1 });
      setObjetEnPlacement(null);
      
      // ✅ AGRANDIR LE TERRAIN si nécessaire lors du placement
      if (onDimensionsChange) {
        agrandirTerrainSiNecessaire(canvas, objetEnPlacement, ECHELLE_PIXELS_PAR_METRE, onDimensionsChange);
      }
      
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
  }, [objetEnPlacement, exporterPlan, revaliderTous, onDimensionsChange]);

  // ========== JSX ==========

  return (
    <div className="canvas-terrain-container">
      {/* Bouton toggle timeline */}
      <button 
        className="timeline-toggle-btn"
        onClick={() => {
          setTimelineVisible(!timelineVisible);
          logger.info('Timeline', `Timeline ${!timelineVisible ? 'affichée' : 'masquée'}`);
        }}
        title={timelineVisible ? 'Masquer la projection temporelle' : 'Afficher la projection temporelle'}
      >
        {timelineVisible ? '📅 Masquer' : '📅 Projection'}
      </button>

      {/* Timeline gérée par NeoApp - pas d'affichage ici */}

      {/* Layout avec panneau latéral + vue principale */}
      <div style={{ display: 'flex', width: '100%', height: 'calc(100% - 40px)', marginTop: '40px' }}>
        {/* Panneau latéral avec outils et stats - TOUJOURS VISIBLE */}
        <PanneauLateral
            canvas={fabricCanvasRef.current} 
            couchesSol={couchesSol}
            onCouchesSolChange={setCouchesSol}
        dimensions={dimensions}
        echelle={echelle}
        onDimensionsChange={onDimensionsChange}
        imageFondChargee={imageFondChargee}
        opaciteImage={opaciteImage}
        solTransparent={solTransparent}
        onSolTransparentChange={setSolTransparent}
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
        onChargerImageFond={chargerImageFond}
        onAjusterOpaciteImage={ajusterOpaciteImage}
        onSupprimerImageFond={supprimerImageFond}
        onResetZoom={resetZoom}
        onExporterPlan={telechargerPlanJSON}
        onLoggerComplet={loggerComplet}
        onExporterComplet={exporterComplet}
        onAjouterArbrePlante={ajouterArbrePlante}
        onSyncKeyChange={setSyncKey}
        ongletActifExterne={ongletActif}
        />

        {/* Vue 3D Suspense */}
        {mode3D && (
          <Suspense fallback={<div className="loading-3d">🌳 Chargement 3D...</div>}>
            <div style={{ flex: 1, position: 'relative' }}>
        <CanvasTerrain3D 
          dimensions={dimensions}
          planData={planDataSync}
          anneeProjection={anneeProjection}
          saison={saison}
          heureJournee={heureJournee}
          syncKey={syncKey}
          couchesSol={couchesSol}
          solTransparent={solTransparent}
          onObjetPositionChange={handleObjetPositionChange3D}
          onObjetSelectionChange={handleObjetSelection3D}
          canvas2D={fabricCanvasRef.current}
          exporterPlan={exporterPlan}
          revaliderTous={revaliderTous}
          contextMenuRef2D={contextMenuRef}
          imageFondUrl={getImageFondUrl()}
          opaciteImageFond={opaciteImage}
        />
            </div>
          </Suspense>
        )}
        
        {/* Vue 2D (cachée si mode 3D, mais toujours montée pour Fabric.js) */}
        <div style={{ flex: 1, position: 'relative', display: mode3D ? 'none' : 'block' }}>
          {/* Panneau de validation SUPPRIMÉ - infos maintenant dans Config */}
          
          {/* Canvas plein écran */}
          <div className="canvas-wrapper" style={{ width: '100%', height: '100%', position: 'relative' }}>
            <canvas id="canvas-terrain" ref={canvasRef}></canvas>
          </div>
        </div>

        {/* ✅ Menu contextuel TOUJOURS VISIBLE (2D et 3D) */}
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
                    setTimeout(() => exporterPlan(fabricCanvasRef.current), 100);
                    logger.info('Rotation', `✅ ${actif.customType} rotation +90° → ${newAngle}°`);
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
                    setTimeout(() => exporterPlan(fabricCanvasRef.current), 100);
                    logger.info('Rotation', `✅ ${actif.customType} rotation -90° → ${newAngle}°`);
                  }
                }}
                title="Rotation -90°"
              >
                ↺
              </button>
              <button 
                className="context-btn context-duplicate"
                onClick={async () => {
                  const actif = fabricCanvasRef.current?.getActiveObject();
                  if (actif && 
                      !actif.isGridLine && 
                      !actif.measureLabel && 
                      !actif.isBoussole && 
                      !actif.isImageFond &&
                      !actif.alignmentGuide &&
                      !actif.isDimensionBox &&
                      !actif.isAideButton &&
                      !actif.isCenterMark &&
                      actif.customType !== 'sol') {
                    console.log('🔧 DEBUG: Duplication via bouton modal');
                    
                    // ✅ UTILISER LA FONCTION UNIFIÉE
                    try {
                      const { dupliquerObjet } = await import('../utils/canvas/duplicationUtils');
                      await dupliquerObjet(
                        actif, 
                        fabricCanvasRef.current, 
                        echelle, 
                        exporterPlan, 
                        revaliderTous
                      );
                      console.log('🔧 DEBUG: Duplication bouton modal terminée!');
                    } catch (error) {
                      console.error('🔧 DEBUG: Erreur lors de la duplication bouton modal:', error);
                    }
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
  );
}

export default CanvasTerrain;
