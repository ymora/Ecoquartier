import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Sky } from '@react-three/drei';
import * as THREE from 'three'; // ✅ Import pour les constantes MOUSE
import Arbre3D from './3d/Arbre3D';
import Arbre3DModel from './3d/Arbre3DModel';
import { getModelPourArbre } from '../config/modeles3D';
import Maison3D from './3d/Maison3D';
import Sol3D from './3d/Sol3D';
import ImageFond3D from './3d/ImageFond3D';
import Canalisation3D from './3d/Canalisation3D';
import Citerne3D from './3d/Citerne3D';
import Caisson3D from './3d/Caisson3D';
import Cloture3D from './3d/Cloture3D';
import ObjetDraggable3D from './3d/ObjetDraggable3D';
import PaveEnherbe3D from './3d/PaveEnherbe3D';
// PanneauEdition3D supprimé - pas nécessaire
import Soleil3D from './3d/Soleil3D';
import LumiereDirectionnelle from './3d/LumiereDirectionnelle';
// GrilleReference, SelecteurHeure et CubeNavigation3D ne sont plus nécessaires
import { ECHELLE_PIXELS_PAR_METRE } from '../config/constants';
// import { validerArbres3D } from '../utils/validation3D'; // ✅ Plus utilisé - validation faite en 2D
import logger from '../utils/logger';
// ✅ Imports diagnostics supprimés - Code diagnostic inutilisé
import './CanvasTerrain3D.css';

// Fonction utilitaire pour parser la taille à maturité depuis arbustesData
// Ex: "6-10 m" → 8 (moyenne), "4 m" → 4
function parseHauteur(tailleMaturite) {
  if (!tailleMaturite) return 7; // Valeur par défaut

  const match = tailleMaturite.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/);
  if (match) {
    // Format "6-10 m" → prendre la moyenne
    const min = parseFloat(match[1]);
    const max = parseFloat(match[2]);
    return (min + max) / 2;
  }

  // Format "4 m" → prendre la valeur
  const singleMatch = tailleMaturite.match(/(\d+(?:\.\d+)?)/);
  if (singleMatch) {
    return parseFloat(singleMatch[1]);
  }

  return 7; // Défaut
}

function CanvasTerrain3D({
  dimensions = { largeur: 30, hauteur: 30 },
  planData = null,
  anneeProjection = 0,
  saison = 'ete', // Saison pour le soleil ET le feuillage des arbres
  heureJournee = 90, // Angle de la journée pour les ombres (0° = matin, 180° = soir)
  orientation = 'nord-haut', // Orientation du terrain pour les ombres
  couchesSol = [
    { nom: 'Terre végétale', profondeur: 30, couleur: '#795548', type: 'terre' },
    { nom: 'Marne calcaire', profondeur: 70, couleur: '#bdbdbd', type: 'marne' }
  ],
  syncKey = 0, // ✅ Clé pour forcer la synchronisation
  onObjetPositionChange = null,
  onObjetSelectionChange = null, // ✅ Callback pour sélectionner un objet 3D
  onPlantSelect = null, // ✅ Callback pour afficher les détails d'une plante
  canvas2D = null, // ✅ Référence au canvas 2D pour les actions
  contextMenuRef2D = null, // ✅ Référence au modal 2D existant
  imageFondUrl = null, // ✅ URL de l'image de fond 2D
  opaciteImageFond = 0.8 // ✅ Opacité de l'image de fond
}) {
  // Passer l'angle directement au soleil pour un mouvement fluide
  // heureJournee est maintenant un angle de 0° (matin) à 180° (soir)
  const [vueMode, setVueMode] = useState('perspective'); // perspective, dessus, cote (coupe supprimée)
  const [objetSelectionne3D, setObjetSelectionne3D] = useState(null); // ✅ Objet sélectionné en 3D pour highlight
  const solTransparent = true; // ✅ Sol transparent TOUJOURS ACTIF
  const orbitControlsRef = useRef();

  // ✅ Gérer l'état de l'objet sélectionné (log uniquement)
  useEffect(() => {
    if (objetSelectionne3D) {
      logger.info('3D', `Sélection: ${objetSelectionne3D.type}`);
    }
  }, [objetSelectionne3D]);

  // ✅ Configuration des boutons de la souris pour OrbitControls
  useEffect(() => {
    // Délai pour s'assurer que OrbitControls est bien monté
    const timer = setTimeout(() => {
      if (orbitControlsRef.current) {
        const controls = orbitControlsRef.current;

        // Configuration des boutons de la souris
        if (controls.mouseButtons) {
          controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE;    // Bouton gauche = rotation
          controls.mouseButtons.MIDDLE = THREE.MOUSE.DOLLY;   // Molette = zoom
          controls.mouseButtons.RIGHT = THREE.MOUSE.PAN;      // Bouton droit = déplacement linéaire (panning)
        }

        // S'assurer que le zoom avec la molette fonctionne
        controls.enableZoom = true;
        controls.enablePan = true;
        controls.enableRotate = true;


        logger.info('OrbitControls', '✅ Configuration des boutons de souris: gauche=rotation, droit=pan, molette=zoom');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Convertir les données 2D en 3D
  // Recalculer quand planData OU anneeProjection change
  const convertir2DTo3D = () => {
    const echelle = ECHELLE_PIXELS_PAR_METRE; // Utilisation de la constante globale : 30 pixels = 1 mètre

    // Debug désactivé pour performance (produit des logs volumineux)

    const data3D = {
      maison: null,
      arbres: [],
      canalisations: [],
      citernes: [],
      clotures: [],
      terrasses: [],
      bounds: { minX: 0, maxX: 0, minZ: 0, maxZ: 0 } // Limites des objets
    };

    if (!planData) return data3D;

    // Tracker les limites de tous les objets
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;

    const updateBounds = (centreX, centreZ, largeur = 0, profondeur = 0) => {
      // ✅ CORRECTION : Calculer les limites depuis le CENTRE de l'objet
      const demiLargeur = largeur / 2;
      const demiProfondeur = profondeur / 2;

      minX = Math.min(minX, centreX - demiLargeur);
      maxX = Math.max(maxX, centreX + demiLargeur);
      minZ = Math.min(minZ, centreZ - demiProfondeur);
      maxZ = Math.max(maxZ, centreZ + demiProfondeur);
    };

    // Maisons (tableau)
    if (planData.maisons && planData.maisons.length > 0) {
      data3D.maisons = planData.maisons.map((maison) => {
        // ✅ TOUJOURS utiliser les dimensions VISUELLES (width/height en pixels)
        // Cela garantit que 2D et 3D affichent la même chose
        const maisonWidth = maison.getScaledWidth ? maison.getScaledWidth() : maison.width;
        const maisonHeight = maison.getScaledHeight ? maison.getScaledHeight() : maison.height;

        const largeur = maisonWidth / echelle;
        const profondeur = maisonHeight / echelle;

        // Les objets 2D avec originX/Y: 'center' sont déjà centrés
        // Donc on utilise directement left/top pour la position 3D
        const posX = maison.left / echelle;
        const posZ = maison.top / echelle;

        // Debug désactivé pour performance

        // ✅ CORRECTION : Les bounds doivent être calculés depuis le CENTRE de l'objet
        // car la position 3D est le centre, pas le coin
        updateBounds(posX, posZ, largeur, profondeur);

        return {
          position: [posX, 0, posZ],
          largeur: largeur, // ✅ TOUJOURS utiliser les dimensions visuelles calculées
          profondeur: profondeur, // ✅ Pas de fallback sur maison.largeur/profondeur
          hauteur: maison.hauteur || 7,
          elevationSol: maison.elevationSol || 0,
          angle: maison.angle || 0,
          typeToit: maison.typeToit || '2pans',
          penteToit: maison.penteToit || 3,
          orientationToit: maison.orientationToit || 0,
          locked: maison.locked || false,
          customType: 'maison'
        };
      });
    }

    // Citernes (objets circulaires - Groups)
    if (planData.citernes && planData.citernes.length > 0) {
      data3D.citernes = planData.citernes.map(c => {
        const diametre = c.diametre || 1.5;
        // Position centrée (les cercles utilisent origin: 'center')
        const posX = c.left / echelle;
        const posZ = c.top / echelle;

        // Debug désactivé pour performance

        // ✅ CORRECTION : Les bounds doivent être calculés depuis le CENTRE de l'objet
        updateBounds(posX, posZ, diametre, diametre);

        return {
          position: [posX, 0, posZ],
          diametre: diametre,
          longueur: c.longueur || 2.5,
          hauteur: diametre,
          volume: c.volume || 3000,
          elevationSol: c.elevationSol || -2.5,
          locked: c.locked || false,
          customType: 'citerne'
        };
      });
    }

    // Caissons d'eau rectangulaires
    if (planData.caissonsEau && planData.caissonsEau.length > 0) {
      planData.caissonsEau.forEach(c => {
        // ✅ TOUJOURS utiliser les dimensions VISUELLES (width/height en pixels)
        const caissonWidth = c.getScaledWidth ? c.getScaledWidth() : c.width;
        const caissonHeight = c.getScaledHeight ? c.getScaledHeight() : c.height;
        const largeur = caissonWidth / echelle;
        const profondeur = caissonHeight / echelle;
        const hauteur = c.hauteur || 1;

        // Position centrée
        const posX = c.left / echelle;
        const posZ = c.top / echelle;

        if (!data3D.citernes) data3D.citernes = [];
        data3D.citernes.push({
          position: [posX, 0, posZ],
          largeur, // ✅ Dimensions visuelles calculées
          profondeur,
          hauteur,
          volume: largeur * profondeur * hauteur,
          angle: c.angle || 0,
          elevationSol: c.elevationSol || -1.0,
          locked: c.locked || false,
          type: 'caisson',
          customType: 'caisson-eau'
        });

        // ✅ CORRECTION : posX/posZ sont déjà le CENTRE (originX/Y: 'center')
        updateBounds(posX, posZ, largeur, profondeur);
      });
    }

    // Canalisations (Groups avec x1, y1, x2, y2)
    if (planData.canalisations && planData.canalisations.length > 0) {
      data3D.canalisations = planData.canalisations.map(c => {
        // Si c'est un Group, utiliser x1, y1, x2, y2 directement
        const x1 = c.x1 !== undefined ? c.x1 : c.left;
        const y1 = c.y1 !== undefined ? c.y1 : c.top;
        const x2 = c.x2 !== undefined ? c.x2 : c.left + 100;
        const y2 = c.y2 !== undefined ? c.y2 : c.top;

        return {
          x1: x1 / echelle,
          y1: y1 / echelle,
          x2: x2 / echelle,
          y2: y2 / echelle,
          diametre: c.diametre || 0.1,
          elevationSol: c.elevationSol || -0.6,
          customType: 'canalisation'
        };
      });
    }

    // Clôtures (Groups avec x1, y1, x2, y2)
    if (planData.clotures && planData.clotures.length > 0) {
      data3D.clotures = planData.clotures.map(c => {
        // Utiliser directement x1, y1, x2, y2 du Group
        const x1 = c.x1 !== undefined ? c.x1 : c.left;
        const y1 = c.y1 !== undefined ? c.y1 : c.top;
        const x2 = c.x2 !== undefined ? c.x2 : c.left + 100;
        const y2 = c.y2 !== undefined ? c.y2 : c.top;

        return {
          x1: x1 / echelle,
          y1: y1 / echelle,
          x2: x2 / echelle,
          y2: y2 / echelle,
          hauteur: c.hauteur || 1.5,
          epaisseur: c.epaisseur || 0.05,
          elevationSol: c.elevationSol !== undefined ? c.elevationSol : 0.05, // ✅ 5 cm au-dessus du sol (structure aérienne)
          customType: 'cloture' // ✅ Ajout pour synchronisation avec le canvas 2D
        };
      });
    }

    // Terrasses/Pavés - ✅ Support des DEUX types
    data3D.terrasses = [];

    // Terrasses classiques
    if (planData.terrasses && planData.terrasses.length > 0) {
      planData.terrasses.forEach(t => {
        const terrasseWidth = t.getScaledWidth ? t.getScaledWidth() : t.width;
        const terrasseHeight = t.getScaledHeight ? t.getScaledHeight() : t.height;
        const largeur = terrasseWidth / echelle;
        const profondeur = terrasseHeight / echelle;

        // Position centrée (les groupes 2D utilisent originX/Y: 'center')
        const posX = t.left / echelle;
        const posZ = t.top / echelle;

        data3D.terrasses.push({
          position: [posX, 0, posZ],
          largeur: largeur, // ✅ Dimensions visuelles calculées
          profondeur: profondeur,
          hauteur: t.hauteur || 0.15,
          angle: t.angle || 0,
          elevationSol: t.elevationSol || 0,
          locked: t.locked || false,
          type: 'terrasse',
          customType: 'terrasse'
        });

        // ✅ CORRECTION : Les bounds doivent être calculés depuis le CENTRE de l'objet
        updateBounds(posX, posZ, largeur, profondeur);
      });
    }

    // Pavés enherbés (customType='paves' en 2D)
    if (planData.paves && planData.paves.length > 0) {
      planData.paves.forEach(p => {
        const paveWidth = p.getScaledWidth ? p.getScaledWidth() : p.width;
        const paveHeight = p.getScaledHeight ? p.getScaledHeight() : p.height;
        const largeur = paveWidth / echelle;
        const profondeur = paveHeight / echelle;

        // Position centrée
        const posX = p.left / echelle;
        const posZ = p.top / echelle;

        data3D.terrasses.push({
          position: [posX, 0, posZ],
          largeur: largeur, // ✅ Dimensions visuelles calculées
          profondeur: profondeur,
          hauteur: p.hauteur || 0.08,
          angle: p.angle || 0,
          locked: p.locked || false,
          type: 'pave-enherbe',
          customType: 'paves'
        });

        // ✅ CORRECTION : posX/posZ sont déjà le CENTRE (originX/Y: 'center')
        updateBounds(posX, posZ, largeur, profondeur);
      });
    }

    // Arbres à planter
    // ✅ Les arbres viennent directement comme objets Fabric.js depuis syncCanvasTo3D
    if (planData.arbres && planData.arbres.length > 0) {
      data3D.arbres = planData.arbres.map(a => {
        // ✅ Objet Fabric.js : utiliser directement les propriétés
        const arbreData = a.arbreData || {};
        const hauteurStr = arbreData.tailleMaturite || '6m';
        const hauteurMax = parseFloat(hauteurStr.split('-').pop().replace('m', '').trim());
        const envergureStr = arbreData.envergure || '4';
        const envergureMax = parseFloat(envergureStr.split('-').pop());

        // Profondeur des racines
        let profondeurRacines = 1.5;
        if (arbreData.reglementation?.systemeRacinaire?.profondeur) {
          const profStr = arbreData.reglementation.systemeRacinaire.profondeur;
          profondeurRacines = parseFloat(profStr.split('-')[0]);
        }

        // ✅ Position depuis l'objet Fabric.js (déjà en pixels)
        const posX = (a.left || 0) / echelle;
        const posZ = (a.top || 0) / echelle;

        // Mettre à jour les bounds avec l'envergure de l'arbre
        updateBounds(posX - envergureMax / 2, posZ - envergureMax / 2, envergureMax, envergureMax);

        // IMPORTANT : La croissance temporelle est gérée dans Arbre3D.jsx
        // On passe les tailles max, Arbre3D calcule la taille actuelle selon anneeProjection

        return {
          position: [posX, 0, posZ],
          arbreData: arbreData,
          hauteur: hauteurMax,
          envergure: envergureMax,
          profondeurRacines: profondeurRacines,
          validationStatus: a.validationStatus || 'ok',
          elevationSol: a.elevationSol !== undefined ? a.elevationSol : 0, // ✅ Élévation du sol (0 = niveau terrain, > 0 = colline, < 0 = fosse)
          locked: a.locked || false,
          customType: 'arbre-a-planter' // ✅ Ajout pour synchronisation avec le canvas 2D
        };
      });
    }


    // ✅ Calculer les dimensions du terrain avec marge de 5m
    const marge = 5;
    if (minX !== Infinity) {
      data3D.bounds = {
        minX: Math.floor(minX) - marge,
        maxX: Math.ceil(maxX) + marge,
        minZ: Math.floor(minZ) - marge,
        maxZ: Math.ceil(maxZ) + marge
      };
    } else {
      // Pas d'objets : terrain minimal 20×20m
      data3D.bounds = {
        minX: -10,
        maxX: 10,
        minZ: -10,
        maxZ: 10
      };
    }

    return data3D;
  };

  // Optimisation : Mémoriser la conversion 2D→3D (calcul coûteux)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const data3D = useMemo(() => {
    const result = convertir2DTo3D();

    // ✅ DIAGNOSTIC : Activer en développement pour vérifier la synchronisation
    if (window.location.hostname === 'localhost' && planData && !window.__syncDiagnosticDone3D) {
      setTimeout(() => {
        logger.info('Diagnostic', '🔍 Lancement diagnostic synchronisation depuis 3D');
        // Note: Le diagnostic nécessite d'accéder au canvas 2D depuis un autre composant
        // On va logger les données 3D pour comparaison manuelle
        logger.info('Diagnostic', 'Données 3D:', {
          maisons: result.maisons?.length || 0,
          arbres: result.arbres?.length || 0,
          terrasses: result.terrasses?.length || 0,
          terrain: result.terrain?.length || 0
        });
      }, 3000);
      window.__syncDiagnosticDone3D = true;
    }

    return result;
  }, [planData, anneeProjection, dimensions.largeur, dimensions.hauteur, syncKey]);

  // ✅ Plus besoin de validerArbres3D - la validation est faite en 2D
  // Le validationStatus vient directement des objets 2D synchronisés

  // Calculer les dimensions du terrain adaptatif (mémorisé)
  const terrainDimensions = useMemo(() => {
    // Si un terrain 2D existe, utiliser ses dimensions
    const terrain2D = data3D?.terrain?.[0];
    if (terrain2D) {
      const dimensions = {
        largeur: terrain2D.width / ECHELLE_PIXELS_PAR_METRE, // Convertir pixels en mètres
        hauteur: terrain2D.height / ECHELLE_PIXELS_PAR_METRE,
        centreX: 0,
        centreZ: 0
      };

      // ✅ DEBUG : Log des dimensions du terrain
      console.log('🌍 Dimensions terrain 2D→3D:', {
        'Terrain 2D (pixels)': { width: terrain2D.width, height: terrain2D.height },
        'Échelle': ECHELLE_PIXELS_PAR_METRE,
        'Terrain 3D (mètres)': dimensions
      });

      return dimensions;
    }

    // Sinon, calculer à partir des objets
    const largeur = data3D.bounds.maxX - data3D.bounds.minX;
    const hauteur = data3D.bounds.maxZ - data3D.bounds.minZ;
    return {
      largeur: Math.max(largeur, 20), // Minimum 20m
      hauteur: Math.max(hauteur, 20), // Minimum 20m
      centreX: 0,
      centreZ: 0
    };
  }, [data3D]);

  const { largeur: terrainLargeur, hauteur: terrainHauteur, centreX: terrainCentreX, centreZ: terrainCentreZ } = terrainDimensions;

  // Calculer les bounds des maisons pour validation collision (mémorisé)
  // ✅ Les positions 3D sont centrées, donc on doit soustraire/ajouter la demi-dimension
  const maisonsBounds = useMemo(() => (data3D?.maisons || []).map(maison => ({
    minX: maison.position[0] - maison.largeur / 2,
    maxX: maison.position[0] + maison.largeur / 2,
    minZ: maison.position[2] - maison.profondeur / 2,
    maxZ: maison.position[2] + maison.profondeur / 2
  })), [data3D]);

  // Positions de caméra selon mode (mémorisées)
  const cameraPositions = useMemo(() => {
    const centreX = terrainCentreX;
    const centreZ = terrainCentreZ;
    const maxDim = Math.max(terrainLargeur, terrainHauteur);

    return {
      perspective: [centreX + maxDim * 0.6, maxDim * 0.5, centreZ + maxDim * 0.6],
      dessus: [centreX, maxDim * 1.2, centreZ],
      cote: [centreX + maxDim, maxDim * 0.3, centreZ],
      coupe: [centreX, maxDim * 0.3, centreZ + maxDim * 0.8]
    };
  }, [terrainLargeur, terrainHauteur, terrainCentreX, terrainCentreZ]);

  const handleObjetClick = useCallback((objet) => {
    setObjetSelectionne3D(objet);

    // ✅ Trouver l'objet 2D correspondant
    if (canvas2D && contextMenuRef2D) {
      const objets2D = canvas2D.getObjects();

      // ✅ GESTION SPÉCIALE POUR LE TERRAIN (complet ou nœud individuel)
      if (objet.customType === 'sol' || objet.customType === 'sol-noeud') {
        const terrain2D = objets2D.find(obj => obj.customType === 'sol');
        if (terrain2D) {
          // ✅ Pour un nœud, on le sélectionne dans le terrain 2D
          if (objet.customType === 'sol-noeud') {
            // Initialiser noeudsSelectionnes si nécessaire
            if (!terrain2D.noeudsSelectionnes) {
              terrain2D.noeudsSelectionnes = [];
            }

            // Trouver le nœud 2D correspondant dans les objets du groupe terrain
            const items = terrain2D.getObjects();
            const noeudKey = `${objet.noeudI},${objet.noeudJ}`;
            const noeud2D = items.find(item =>
              item.customType === 'noeud-elevation' &&
              item.i === objet.noeudI &&
              item.j === objet.noeudJ
            );

            if (noeud2D) {
              // Désélectionner tous les autres nœuds d'abord
              terrain2D.noeudsSelectionnes.forEach(({ noeud }) => {
                noeud.isSelected = false;
                noeud.set({
                  stroke: '#ffffff',
                  strokeWidth: 2,
                  radius: 6
                });
              });

              // Sélectionner le nouveau nœud
              noeud2D.isSelected = true;
              noeud2D.set({
                stroke: '#ffc107',
                strokeWidth: 3,
                radius: 8
              });

              // Mettre à jour la liste des nœuds sélectionnés
              terrain2D.noeudsSelectionnes = [{ i: objet.noeudI, j: objet.noeudJ, key: noeudKey, noeud: noeud2D }];

              logger.info('3D', `✅ Nœud [${objet.noeudI},${objet.noeudJ}] sélectionné depuis la vue 3D`);
            }
          } else {
            // Si on clique sur le terrain complet, désélectionner tous les nœuds
            if (terrain2D.noeudsSelectionnes) {
              terrain2D.noeudsSelectionnes.forEach(({ noeud }) => {
                noeud.isSelected = false;
                noeud.set({
                  stroke: '#ffffff',
                  strokeWidth: 2,
                  radius: 6
                });
              });
              terrain2D.noeudsSelectionnes = [];
            }
          }

          // ✅ Sélectionner le terrain 2D
          canvas2D.setActiveObject(terrain2D);
          canvas2D.renderAll();
          canvas2D.fire('selection:updated', { selected: [terrain2D] });
          logger.info('3D', '✅ Terrain sélectionné en 2D depuis la vue 3D');
        }
      } else {
        // Pour les autres objets, rechercher par position
        const objet2D = objets2D.find(obj =>
          obj.customType === objet.customType &&
          Math.abs(obj.left - objet.position[0] * ECHELLE_PIXELS_PAR_METRE) < 50 &&
          Math.abs(obj.top - objet.position[2] * ECHELLE_PIXELS_PAR_METRE) < 50
        );

        if (objet2D) {
          // ✅ Sélectionner l'objet 2D
          canvas2D.setActiveObject(objet2D);
          canvas2D.renderAll();

          // ✅ Afficher le menu contextuel 2D (maintenant aussi pour la 3D)
          if (contextMenuRef2D && contextMenuRef2D.current) {
            const canvasRect = canvas2D.lowerCanvasEl.getBoundingClientRect();
            const menu = contextMenuRef2D.current;
            const objCenter = objet2D.getCenterPoint();
            const objHeight = objet2D.getScaledHeight ? objet2D.getScaledHeight() : objet2D.height || 50;

            const menuWidth = 220; // Largeur réelle du menu (4 boutons)
            const menuHeight = 45;

            // ✅ POSITIONNEMENT SIMPLE : CENTRÉ AU-DESSUS DE L'OBJET (vue 3D)
            // Position horizontale : centrée sur l'objet
            let menuLeft = canvasRect.left + objCenter.x - (menuWidth / 2);

            // Position verticale : AU-DESSUS de l'objet (pour la 3D)
            let menuTop = canvasRect.top + objCenter.y - (objHeight / 2) - menuHeight - 10;

            // Contraintes pour rester visible à l'écran
            if (menuLeft < canvasRect.left + 10) {
              menuLeft = canvasRect.left + 10;
            }
            if (menuLeft + menuWidth > canvasRect.right - 10) {
              menuLeft = canvasRect.right - menuWidth - 10;
            }
            if (menuTop < canvasRect.top + 10) {
              menuTop = canvasRect.top + 10;
            }
            if (menuTop + menuHeight > canvasRect.bottom - 10) {
              menuTop = canvasRect.bottom - menuHeight - 10;
            }

            menu.style.left = `${menuLeft}px`;
            menu.style.top = `${menuTop}px`;
            menu.style.display = 'flex';

            // Mettre à jour l'état verrouillé
            const btnLock = menu.querySelector('.context-lock');
            if (btnLock) {
              if (objet2D.locked) {
                btnLock.textContent = '🔓';
                btnLock.title = 'Déverrouiller';
              } else {
                btnLock.textContent = '🔒';
                btnLock.title = 'Verrouiller';
              }
            }
          }
        }
      }
    }

    if (onObjetSelectionChange) {
      onObjetSelectionChange(objet);
    }

    // ✅ Déclencher la sélection de la plante pour le modal d'inspection
    if (onPlantSelect && (objet.type === 'arbre' || objet.customType === 'arbre-a-planter') && objet.arbreData) {
      onPlantSelect(objet.arbreData);
    }
  }, [onObjetSelectionChange, onPlantSelect, canvas2D, contextMenuRef2D]);

  // ✅ Synchroniser la sélection 3D -> 2D (utilisé pour drag/select)
  const syncSelection2D = useCallback((data) => {
    if (!canvas2D || !data) return;
    const { isSelected, type, position } = data;

    if (isSelected) {
      if (type === 'sol') {
        const terrain2D = canvas2D.getObjects().find(obj => obj.customType === 'sol');
        if (terrain2D) {
          canvas2D.setActiveObject(terrain2D);
          canvas2D.renderAll();
        }
        return;
      }
      // Sélection par proximité (tolérance 50px)
      const match = canvas2D.getObjects().find(obj =>
        obj.customType === type &&
        Math.abs(obj.left - position[0] * ECHELLE_PIXELS_PAR_METRE) < 50 &&
        Math.abs(obj.top - position[2] * ECHELLE_PIXELS_PAR_METRE) < 50
      );
      if (match) {
        canvas2D.setActiveObject(match);
        canvas2D.renderAll();
      }
    } else {
      // Désélection
      canvas2D.discardActiveObject();
      canvas2D.renderAll();
    }
  }, [canvas2D]);

  // handleProprieteChange supprimé - modal d'édition non nécessaire

  // Callback pour le drag end d'un objet (mémorisé)
  // ✅ FIXE : Ajouter un délai pour éviter le figement dû au re-render
  const handleObjetDragEnd = useCallback((dragData) => {
    if (onObjetPositionChange) {
      // ✅ Appel asynchrone pour éviter le figement du drag
      setTimeout(() => {
        onObjetPositionChange(dragData);
      }, 100); // 100ms de délai pour laisser l'animation se terminer
    }
  }, [onObjetPositionChange]);

  // ========== CENTRAGE AUTOMATIQUE 3D AU DÉMARRAGE ==========
  useEffect(() => {
    if (orbitControlsRef.current) {
      // Petit délai pour s'assurer que tout est initialisé
      const timer = setTimeout(() => {
        if (orbitControlsRef.current) {
          // Centrer sur le terrain
          orbitControlsRef.current.target.set(terrainCentreX, 0, terrainCentreZ);
          orbitControlsRef.current.update();
          logger.info('3D', `🎯 Caméra centrée sur le terrain (${terrainCentreX}, 0, ${terrainCentreZ})`);
        }
      }, 100); // Rapide

      return () => clearTimeout(timer);
    }
  }, []); // Seulement au montage

  // Écouter l'événement de réinitialisation de la caméra 3D
  useEffect(() => {
    const handleResetCamera = () => {
      if (orbitControlsRef.current) {
        // S'assurer que la caméra regarde le centre du terrain
        orbitControlsRef.current.target.set(terrainCentreX, 0, terrainCentreZ);
        orbitControlsRef.current.update();

        // Revenir en vue perspective si on est dans une autre vue
        setVueMode('perspective');

        logger.info('3D', '🔄 Caméra réinitialisée');
      }
    };

    window.addEventListener('reset3DCamera', handleResetCamera);

    return () => {
      window.removeEventListener('reset3DCamera', handleResetCamera);
    };
  }, [terrainCentreX, terrainCentreZ]);

  // ✅ Le modal 2D gère déjà le clic extérieur


  return (
    <div className="canvas-terrain-3d">
      {/* ✅ Vue sous terre TOUJOURS ACTIVE - racines, fondations, citernes et canalisations toujours visibles */}

      {/* Canvas 3D */}
      <Canvas
        shadows
        dpr={[1, 2]}
        className="canvas-3d"
        onCreated={({ gl }) => {
          // ✅ Gestion du contexte WebGL perdu
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            console.warn('⚠️ Contexte WebGL perdu, tentative de récupération...');
            e.preventDefault();
          });

          gl.domElement.addEventListener('webglcontextrestored', () => {
            console.log('✅ Contexte WebGL restauré');
            // Recharger la page pour réinitialiser
            window.location.reload();
          });
        }}
        onPointerMissed={() => {
          // ✅ Désélection globale quand on clique dans le vide → réactive la rotation
          setObjetSelectionne3D(null);
          if (canvas2D) {
            canvas2D.discardActiveObject();
            canvas2D.renderAll();
          }
        }}
      >
        {/* Ciel */}
        <Sky sunPosition={[100, 20, 100]} />

        {/* Soleil 3D visuel selon la saison et l'angle fluide */}
        <Soleil3D
          saison={saison}
          angleJournee={heureJournee}
          distance={60}
          terrainCentreX={terrainCentreX}
          terrainCentreZ={terrainCentreZ}
        />

        {/* Croix rouge au centre du terrain (comme en 2D) - Version compacte */}
        {/* Barre horizontale (axe X) */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[1.5, 0.08, 0.15]} />
          <meshBasicMaterial color="#ff0000" />
        </mesh>
        {/* Barre verticale (axe Z) */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.15, 0.08, 1.5]} />
          <meshBasicMaterial color="#ff0000" />
        </mesh>
        {/* Petit cercle au centre pour marquer l'intersection */}
        <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.2, 16]} />
          <meshBasicMaterial color="#ff0000" />
        </mesh>

        {/* Lumière ambiante (éclairage global) */}
        <ambientLight intensity={0.5} />

        {/* Lumière directionnelle synchronisée avec le soleil (génère les ombres) */}
        <LumiereDirectionnelle
          saison={saison}
          angleJournee={heureJournee}
          orientation={orientation}
          distance={50}
          intensity={1.2}
          shadowMapSize={2048}
        />

        {/* Image de fond 3D - En arrière-plan du sol */}
        {imageFondUrl && (
          <ImageFond3D
            imageUrl={imageFondUrl}
            largeur={terrainLargeur}
            hauteur={terrainHauteur}
            offsetX={data3D.bounds.minX}
            offsetZ={data3D.bounds.minZ}
            opacite={opaciteImageFond}
          />
        )}

        {/* Sol avec couches - Taille adaptative */}
        <Sol3D
          largeur={terrainLargeur}
          hauteur={terrainHauteur}
          offsetX={data3D.bounds.minX}
          offsetZ={data3D.bounds.minZ}
          couchesSol={couchesSol}
          transparent={solTransparent}
          maillageElevation={planData.terrainMaillage}
          tailleMailleM={planData.terrainTailleMaille || 5}
          onTerrainClick={handleObjetClick}
        />

        {/* Maisons */}
        {data3D?.maisons?.map((maison, idx) => {
          // ✅ Position Y selon l'élévation : au-dessus du terrain si élévation > 0
          const elevationY = maison.elevationSol || 0;
          const positionY = elevationY > 0 ? elevationY : 0.1; // Au-dessus du terrain

          return (
            <ObjetDraggable3D
              key={`maison-${idx}`}
              position={[maison.position[0], positionY, maison.position[2]]}
              type="maison"
              enabled={true}
              locked={maison.locked || false}
              selectionHeight={(() => {
                // ✅ Calculer le point le plus haut : hauteur murs + hauteur toit + 0.05m
                const hauteurMurs = maison.hauteur || 7;
                const typeToit = maison.typeToit || 'deux-pentes';
                const penteToit = maison.penteToit || 3; // Pente par défaut 3°
                const largeur = maison.largeur || 10;
                const profondeur = maison.profondeur || 8;
                const orientationToit = maison.orientationToit || 0;

                let hauteurToit = 0;
                if (typeToit === 'plan' || typeToit === 'plat') {
                  hauteurToit = 0; // Toit plat
                } else if (typeToit === 'monopente') {
                  const dimensionPente = (orientationToit === 90 || orientationToit === 270) ? profondeur : largeur;
                  hauteurToit = Math.tan((penteToit * Math.PI) / 180) * dimensionPente;
                } else {
                  // deux-pentes (par défaut)
                  const dimensionPente = (orientationToit === 90 || orientationToit === 270) ? profondeur : largeur;
                  hauteurToit = Math.tan((penteToit * Math.PI) / 180) * (dimensionPente / 2);
                }

                return hauteurMurs + hauteurToit + 0.05; // Point le plus haut + 5 cm
              })()}
              onDragEnd={handleObjetDragEnd}
              onSelectionChange={(data) => { setObjetSelectionne3D(data.isSelected ? data : null); syncSelection2D(data); }}
              maisonBounds={maisonsBounds}
            >
              <Maison3D
                position={[0, 0, 0]}
                largeur={maison.largeur}
                profondeur={maison.profondeur}
                hauteur={maison.hauteur}
                angle={maison.angle}
                typeToit={maison.typeToit || 'deux-pentes'}
                penteToit={maison.penteToit}
                orientationToit={maison.orientationToit}
                onClick={() => handleObjetClick({ type: 'maison', ...maison, index: idx })}
              />
            </ObjetDraggable3D>
          );
        })}

        {/* Citernes cylindriques */}
        {data3D?.citernes?.filter(c => c.type !== 'caisson').map((citerne, idx) => {
          // ✅ Position Y selon l'élévation : au-dessus du terrain si élévation > 0
          const elevationY = citerne.elevationSol || 0;
          const positionY = elevationY > 0 ? elevationY : 0.1; // Au-dessus du terrain

          return (
            <ObjetDraggable3D
              key={`citerne-${idx}`}
              position={[citerne.position[0], positionY, citerne.position[2]]}
              type="citerne"
              enabled={true}
              locked={citerne.locked || false}
              selectionHeight={(() => {
                // ✅ Calculer le point le plus haut : elevationSol + hauteur + 0.05m
                const elevationSol = citerne.elevationSol || -2.5;
                const hauteur = citerne.hauteur || citerne.diametre || 1.5;
                const pointHaut = elevationSol + hauteur;
                return pointHaut > 0 ? pointHaut + 0.05 : 0.05; // Au moins 5 cm au-dessus du sol
              })()}
              onDragEnd={handleObjetDragEnd}
              onSelectionChange={(data) => { setObjetSelectionne3D(data.isSelected ? data : null); syncSelection2D(data); }}
              maisonBounds={maisonsBounds}
            >
              <Citerne3D
                position={[0, 0, 0]}
                diametre={citerne.diametre}
                longueur={citerne.longueur}
                volume={citerne.volume}
                elevationSol={citerne.elevationSol}
                onClick={() => handleObjetClick({
                  type: 'citerne',
                  ...citerne,
                  index: idx,
                  position: [citerne.position[0], elevationY, citerne.position[2]]
                })}
              />
            </ObjetDraggable3D>
          );
        })}

        {/* Caissons d'eau rectangulaires */}
        {data3D?.citernes?.filter(c => c.type === 'caisson').map((caisson, idx) => {
          // ✅ Position Y selon l'élévation : au-dessus du terrain si élévation > 0
          const elevationY = caisson.elevationSol || 0;
          const positionY = elevationY > 0 ? elevationY : 0.1; // Au-dessus du terrain

          return (
            <ObjetDraggable3D
              key={`caisson-${idx}`}
              position={[caisson.position[0], positionY, caisson.position[2]]}
              type="caisson-eau"
              enabled={true}
              selectionHeight={(() => {
                // ✅ Calculer le point le plus haut : elevationSol + hauteur + 0.05m
                const elevationSol = caisson.elevationSol || -1.0;
                const hauteur = caisson.hauteur || 1;
                const pointHaut = elevationSol + hauteur;
                return pointHaut > 0 ? pointHaut + 0.05 : 0.05; // Au moins 5 cm au-dessus du sol
              })()}
              onDragEnd={handleObjetDragEnd}
              onSelectionChange={(data) => { setObjetSelectionne3D(data.isSelected ? data : null); syncSelection2D(data); }}
              maisonBounds={maisonsBounds}
            >
              <Caisson3D
                position={[0, 0, 0]}
                largeur={caisson.largeur}
                profondeur={caisson.profondeur}
                hauteur={caisson.hauteur}
                volume={caisson.volume}
                angle={caisson.angle}
                elevationSol={caisson.elevationSol}
                onClick={() => handleObjetClick({
                  type: 'caisson-eau',
                  ...caisson,
                  index: idx,
                  position: [caisson.position[0], elevationY, caisson.position[2]]
                })}
              />
            </ObjetDraggable3D>
          );
        })}

        {/* Canalisations - Visibles uniquement si sol transparent */}
        {solTransparent && data3D?.canalisations?.map((canal, idx) => {
          const centerX = (canal.x1 + canal.x2) / 2;
          const centerY = (canal.y1 + canal.y2) / 2;
          return (
            <Canalisation3D
              key={`canal-${idx}`}
              {...canal}
              onClick={() => handleObjetClick({
                type: 'canalisation',
                ...canal,
                index: idx,
                position: [centerX, canal.elevationSol, centerY]
              })}
            />
          );
        })}

        {/* Clôtures */}
        {data3D?.clotures?.map((cloture, idx) => {
          const centerX = (cloture.x1 + cloture.x2) / 2;
          const centerY = (cloture.y1 + cloture.y2) / 2;
          return (
            <Cloture3D
              key={`cloture-${idx}`}
              {...cloture}
              onClick={() => handleObjetClick({
                type: 'cloture',
                ...cloture,
                index: idx,
                position: [centerX, cloture.hauteur / 2, centerY] // ✅ Position réelle rendue
              })}
            />
          );
        })}

        {/* Terrasses/Pavés enherbés ultra-réalistes */}
        {data3D?.terrasses?.map((terrasse, idx) => (
          terrasse.type === 'pave-enherbe' ? (
            // ✅ Pavés enherbés ultra-réalistes avec herbe qui bouge au vent
            <ObjetDraggable3D
              key={`pave-${idx}`}
              position={[terrasse.position[0], 0, terrasse.position[2]]}
              type="paves"
              enabled={true}
              selectionHeight={(terrasse.hauteur || 0.08) + 0.05} // Hauteur des pavés + 5 cm
              onDragEnd={handleObjetDragEnd}
              onSelectionChange={(data) => { setObjetSelectionne3D(data.isSelected ? data : null); syncSelection2D(data); }}
              maisonBounds={maisonsBounds}
            >
              <PaveEnherbe3D
                position={[0, 0, 0]} // Position relative dans le groupe
                largeur={terrasse.largeur}
                profondeur={terrasse.profondeur}
                onClick={() => handleObjetClick({
                  ...terrasse,
                  type: 'paves',
                  customType: 'paves',
                  index: idx,
                  position: [terrasse.position[0], 0, terrasse.position[2]]
                })}
              />
            </ObjetDraggable3D>
          ) : (
            // Terrasse classique (béton gris)
            <ObjetDraggable3D
              key={`terrasse-${idx}`}
              position={[terrasse.position[0], terrasse.elevationSol || 0, terrasse.position[2]]}
              type="terrasse"
              enabled={true}
              selectionHeight={(terrasse.hauteur || 0.15) + 0.05} // Hauteur de la terrasse + 5 cm
              onDragEnd={handleObjetDragEnd}
              onSelectionChange={(data) => { setObjetSelectionne3D(data.isSelected ? data : null); syncSelection2D(data); }}
              maisonBounds={maisonsBounds}
            >
              <mesh
                position={[0, 0, 0]} // Position relative dans le groupe
                rotation={[0, terrasse.angle ? -(terrasse.angle * Math.PI / 180) : 0, 0]}
                receiveShadow
                castShadow
                onClick={() => handleObjetClick({
                  ...terrasse,
                  type: 'terrasse',
                  customType: 'terrasse',
                  index: idx,
                  position: [terrasse.position[0], terrasse.elevationSol || 0, terrasse.position[2]]
                })}
              >
                <boxGeometry args={[terrasse.largeur, terrasse.hauteur, terrasse.profondeur]} />
                <meshStandardMaterial
                  color="#8d6e63"
                  roughness={0.9}
                  metalness={0.1}
                />
              </mesh>
            </ObjetDraggable3D>
          )
        ))}

        {/* Arbres à planter (draggable si mode activé) */}
        {data3D?.arbres?.map((arbre, idx) => {
          // Vérifier si un modèle 3D réel existe
          const model3D = arbre.arbreData?.id ? getModelPourArbre(arbre.arbreData.id) : null;

          // ✅ Utiliser le validationStatus de la 2D (pas de recalcul 3D)
          // Le validationStatus vient de la 2D qui fait la validation officielle
          const validationStatus = arbre.validationStatus || 'ok';

          // ✅ Position Y selon l'élévation : au-dessus du terrain si élévation > 0
          // Si elevationSol > 0 : arbre sur une colline/butte
          // Si elevationSol < 0 : arbre dans une fosse/dépression
          // Si elevationSol = 0 : arbre au niveau du terrain
          const elevationY = arbre.elevationSol || 0;
          const positionY = elevationY !== 0 ? elevationY : 0.1; // Au-dessus du terrain si niveau 0

          return (
            <ObjetDraggable3D
              key={arbre.arbreData?.id ? `arbre-${arbre.arbreData.id}-${idx}` : `arbre-plante-${idx}`}
              position={[arbre.position[0], positionY, arbre.position[2]]}
              type="arbre-a-planter"
              enabled={true}
              locked={arbre.locked || false}
              selectionHeight={(() => {
                // ✅ Calculer le point le plus haut : hauteur actuelle de l'arbre + 0.05m
                const hauteurPlantation = 2;
                const progression = Math.min(anneeProjection / 20, 1);
                const hauteurActuelle = hauteurPlantation + (arbre.hauteur - hauteurPlantation) * progression;
                return hauteurActuelle + 0.05; // Cime de l'arbre + 5 cm
              })()}
              onDragEnd={handleObjetDragEnd}
              onSelectionChange={(data) => { setObjetSelectionne3D(data.isSelected ? data : null); syncSelection2D(data); }}
              maisonBounds={maisonsBounds}
            >
              {model3D ? (
                /* Modèle 3D réel (GLB) avec fallback automatique */
                <Arbre3DModel
                  position={[0, 0, 0]}
                  modelPath={model3D.path}
                  hauteurMaturite={parseHauteur(arbre.arbreData?.tailleMaturite)}
                  envergure={arbre.envergure}
                  validationStatus={validationStatus}
                  rotation={model3D.rotation}
                  anneeProjection={anneeProjection}
                  saison={saison}
                  arbreData={arbre.arbreData}
                  onClick={() => handleObjetClick({ type: 'arbre', ...arbre, customType: 'arbre-a-planter' })}
                  fallbackProps={{
                    arbreData: arbre.arbreData,
                    hauteur: arbre.hauteur,
                    envergure: arbre.envergure,
                    profondeurRacines: solTransparent ? arbre.profondeurRacines : 0,
                    validationStatus: arbre.validationStatus || 'ok',
                    anneeProjection: anneeProjection,
                    saison: saison,
                    onClick: () => handleObjetClick({ type: 'arbre', ...arbre, customType: 'arbre-a-planter' })
                  }}
                />
              ) : (
                /* Arbre procédural (pas de modèle GLB) */
                <Arbre3D
                  position={[0, 0, 0]}
                  arbreData={arbre.arbreData}
                  hauteur={arbre.hauteur}
                  envergure={arbre.envergure}
                  profondeurRacines={solTransparent ? arbre.profondeurRacines : 0}
                  validationStatus={validationStatus}
                  anneeProjection={anneeProjection}
                  saison={saison}
                  elevationSol={arbre.elevationSol || 0} // ✅ Ajout de l'élévation du sol
                  onClick={() => handleObjetClick({ type: 'arbre', ...arbre, customType: 'arbre-a-planter' })}
                />
              )}
            </ObjetDraggable3D>
          );
        })}


        {/* Caméra contrôlable */}
        <OrbitControls
          ref={orbitControlsRef}
          enablePan={true} // ✅ Panning activé (bouton droit)
          enableZoom={true} // ✅ Zoom activé (molette)
          enableRotate={true} // ✅ Rotation activée (bouton gauche)
          enabled={true} // ✅ Activé (désactivé temporairement pendant drag via ObjetDraggable3D)
          screenSpacePanning={true}
          minPolarAngle={0}
          maxPolarAngle={Math.PI} // ✅ Permet de voir par dessous (fondations, racines)
          target={[terrainCentreX, 0, terrainCentreZ]}
          minDistance={5} // Distance minimale (5m)
          maxDistance={200} // Distance maximale (200m)
        />

        <PerspectiveCamera
          makeDefault
          position={cameraPositions[vueMode]}
          fov={60}
          near={0.1}
          far={1000}
        />

        {/* Lumière hémisphérique pour éclairage naturel */}
        <hemisphereLight
          skyColor="#87CEEB"
          groundColor="#8B4513"
          intensity={0.6}
        />
      </Canvas>

      {/* ✅ Pas de modal 3D - on utilise le modal 2D existant */}

      {/* Panneau d'édition supprimé - pas nécessaire */}
    </div>
  );
}

export default CanvasTerrain3D;

