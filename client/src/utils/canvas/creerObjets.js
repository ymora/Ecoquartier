/**
 * creerObjets.js
 * Fonctions de création des objets du canvas
 * Extrait de CanvasTerrain.jsx pour modularité
 */

import * as fabric from 'fabric';
import logger from '../logger';
import { calculerSoleilSimple, soleil2D } from '../soleilSimple';
import { creerObjetRectangulaire, creerObjetCirculaire, genererIdUnique } from './creerObjetsGeneriques';
import { canvasOperations } from './canvasOperations';
import { appliquerProprietesSelection } from './proprietesSelection';

/**
 * Recentrer la vue sur le contenu du canvas
 * Calcule les limites de tous les objets et centre la vue avec un zoom approprié
 */
export const recentrerVueSurContenu = (canvas) => {
  if (!canvas) return;
  
  // Calculer les limites de tous les objets (exclure les éléments d'interface)
  const objects = canvas.getObjects().filter(obj => 
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
  
  if (objects.length > 0) {
    // Calculer les limites du contenu
    const bounds = objects.reduce((acc, obj) => {
      const objBounds = obj.getBoundingRect();
      return {
        minX: Math.min(acc.minX, objBounds.left),
        minY: Math.min(acc.minY, objBounds.top),
        maxX: Math.max(acc.maxX, objBounds.left + objBounds.width),
        maxY: Math.max(acc.maxY, objBounds.top + objBounds.height)
      };
    }, { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });
    
    // Calculer le centre du contenu
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;
    
    // Calculer la taille du contenu
    const contentWidth = bounds.maxX - bounds.minX;
    const contentHeight = bounds.maxY - bounds.minY;
    
    // Calculer le zoom pour que le contenu rentre dans la vue
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const scaleX = canvasWidth / (contentWidth + 100); // +100 pour la marge
    const scaleY = canvasHeight / (contentHeight + 100);
    const scale = Math.min(scaleX, scaleY, 1); // Ne pas zoomer plus que 100%
    
    // Centrer la vue
    const offsetX = (canvasWidth / 2) - (centerX * scale);
    const offsetY = (canvasHeight / 2) - (centerY * scale);
    
    canvas.setViewportTransform([scale, 0, 0, scale, offsetX, offsetY]);
    canvasOperations.rendre(canvas);
    
    logger.info('Canvas', `✅ Vue recentrée sur le contenu (zoom: ${(scale * 100).toFixed(1)}%)`);
  } else {
    // Si pas d'objets, reset simple
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    canvasOperations.rendre(canvas);
    logger.info('Canvas', '✅ Vue réinitialisée (aucun objet)');
  }
};

/**
 * Créer un objet maison (retourne l'objet sans l'ajouter au canvas)
 */
export const creerMaisonObjet = (echelle) => {
  return creerObjetRectangulaire({
    type: 'maison',
    largeur: 10,
    profondeur: 10,
    icone: '🏠',
    couleurFond: '#bdbdbd',
    couleurBordure: '#757575',
    proprietes: {
      hauteur: 7,
      elevationSol: 0,
      typeToit: 'deux-pentes',
      penteToit: 15,
      orientationToit: 0
    }
  }, echelle);
};

/**
 * Fonction unifiée pour ajouter un objet au canvas
 * @param {fabric.Canvas} canvas - Canvas Fabric.js
 * @param {Function} creerObjetFn - Fonction qui crée l'objet
 * @param {string} type - Type d'objet pour le logging
 * @param {Object} position - Position {left, top}
 */
const ajouterObjetAuCanvas = (canvas, creerObjetFn, type, position = { left: 300, top: 200 }) => {
  if (!canvas) return;
  const objet = creerObjetFn();
  objet.set(position);
  canvasOperations.ajouter(canvas, objet);
  canvasOperations.selectionner(canvas, objet);
  
  // Compter les objets existants pour ajouter un numéro
  const objetsExistants = canvas.getObjects().filter(o => o.customType === type);
  const numero = objetsExistants.length > 1 ? ` #${objetsExistants.length}` : '';
  logger.info('Objets', `${type.charAt(0).toUpperCase() + type.slice(1)}${numero} ajouté`);
};

/**
 * Créer une maison (ancienne méthode - pour compatibilité)
 */
export const creerMaison = (canvas, echelle) => {
  ajouterObjetAuCanvas(canvas, () => creerMaisonObjet(echelle), 'maison');
};

/**
 * Créer une canalisation
 */
export const creerCanalisation = (canvas) => {
  if (!canvas) return;
  
  const canalisation = new fabric.Line([50, 50, 200, 50], {
    stroke: '#757575',
    strokeWidth: 3,
    strokeDashArray: null,
    strokeLineCap: 'round',
    customType: 'canalisation',
    selectable: true,
    hasBorders: true,
    hasControls: true,
    lockScalingY: false,
    lockScalingX: false,
    lockRotation: false,
    strokeUniform: true,
    diametre: 0.1,
    elevationSol: -0.6
  });

  // ✅ Utiliser canvasOperations pour ajouter et sélectionner
  canvasOperations.ajouter(canvas, canalisation, false);
  canvasOperations.selectionner(canvas, canalisation, true);
  
  // Debug désactivé pour performance
  // logger.debug('Objets', 'Canalisation ajoutée', { profondeur: 0.6 });
};

/**
 * Créer un objet citerne (retourne l'objet sans l'ajouter au canvas)
 */
export const creerCiterneObjet = (echelle) => {
  return creerObjetCirculaire({
    type: 'citerne',
    diametre: 1.5,
    icone: '💧',
    couleurFond: 'rgba(33, 150, 243, 0.3)',
    couleurBordure: '#1976d2',
    proprietes: {
      longueur: 2.5,
      hauteur: 1.5,
      volume: 3000,
      elevationSol: -2.5
    }
  }, echelle);
};

/**
 * Créer une citerne/fosse septique (ancienne méthode - pour compatibilité)
 */
export const creerCiterne = (canvas, echelle) => {
  ajouterObjetAuCanvas(canvas, () => creerCiterneObjet(echelle), 'citerne', { left: 400, top: 400 });
};

/**
 * Créer une clôture
 */
export const creerCloture = (canvas, pointsClotureRef) => {
  if (!canvas) return;
  
  if (pointsClotureRef.current.length === 0) {
    logger.info('Cloture', 'Début tracé clôture - Cliquez pour ajouter points');
  }
  
  const pointer = canvas.getPointer(event);
  const point = { x: pointer.x, y: pointer.y };
  pointsClotureRef.current.push(point);
  
  if (pointsClotureRef.current.length >= 2) {
    const dernierIndex = pointsClotureRef.current.length - 1;
    const p1 = pointsClotureRef.current[dernierIndex - 1];
    const p2 = pointsClotureRef.current[dernierIndex];
    
    const ligne = new fabric.Line([p1.x, p1.y, p2.x, p2.y], {
      stroke: '#ffd54f',
      strokeWidth: 2, // Épaisseur fixe 5cm
      strokeDashArray: [10, 5],
      strokeLineCap: 'round',
      lockRotation: false,
      lockScalingX: true,
      lockScalingY: true,
      customType: 'cloture',
      hauteur: 1.5, // Hauteur par défaut 1.5m
      epaisseur: 0.05, // 5cm
      strokeUniform: true,
      hasBorders: true,
      hasControls: true,
      cornerSize: 12
    });
    
    // ✅ Utiliser canvasOperations pour ajouter
    canvasOperations.ajouter(canvas, ligne, false);
    // Amener la clôture au premier plan pour encadrer les éléments
    canvas.bringObjectToFront(ligne);
    canvasOperations.rendre(canvas);
    
    // Debug désactivé pour performance
    // logger.debug('Cloture', `Segment ${dernierIndex} ajouté`);
  }
};

/**
 * Créer un objet terrasse (retourne l'objet sans l'ajouter au canvas)
 */
export const creerTerrasseObjet = (echelle) => {
  return creerObjetRectangulaire({
    type: 'terrasse',
    largeur: 5,
    profondeur: 4,
    icone: '🪴',
    couleurFond: 'rgba(158, 158, 158, 0.4)',
    couleurBordure: '#757575',
    proprietes: {
      hauteur: 0.15,
      elevationSol: 0
    }
  }, echelle);
};

/**
 * Créer une terrasse (ancienne méthode - pour compatibilité)
 */
export const creerTerrasse = (canvas, echelle) => {
  ajouterObjetAuCanvas(canvas, () => creerTerrasseObjet(echelle), 'terrasse', { left: 150, top: 150 });
};

/**
 * Créer un objet pavés (retourne l'objet sans l'ajouter au canvas)
 */
export const creerPavesObjet = (echelle) => {
  return creerObjetRectangulaire({
    type: 'paves',
    largeur: 5,
    profondeur: 5,
    icone: '🌿',
    couleurFond: 'rgba(139, 195, 74, 0.3)',
    couleurBordure: '#7cb342',
    proprietes: {
      hauteur: 0.08,
      elevationSol: 0
    }
  }, echelle);
};

/**
 * Créer des pavés enherbés (ancienne méthode - pour compatibilité)
 */
export const creerPaves = (canvas, echelle) => {
  ajouterObjetAuCanvas(canvas, () => creerPavesObjet(echelle), 'paves', { left: 500, top: 500 });
};

/**
 * Créer un objet caisson d'eau (retourne l'objet sans l'ajouter au canvas)
 */
export const creerCaissonEauObjet = (echelle) => {
  return creerObjetRectangulaire({
    type: 'caisson-eau',
    largeur: 5,
    profondeur: 3,
    icone: '💦',
    couleurFond: 'rgba(33, 150, 243, 0.25)',
    couleurBordure: '#1565c0',
    proprietes: {
      hauteur: 1,
      elevationSol: -1.0
    }
  }, echelle);
};

/**
 * Créer un caisson rectangulaire de rétention d'eau (ancienne méthode - pour compatibilité)
 */
export const creerCaissonEau = (canvas, echelle) => {
  ajouterObjetAuCanvas(canvas, () => creerCaissonEauObjet(echelle), 'caisson-eau', { left: 300, top: 300 });
};


/**
 * Créer une grille fixe (ne bouge jamais)
 */
export const creerGrille = (canvas, echelle) => {
  // Supprimer les anciennes lignes de grille
  // ✅ Utiliser canvasOperations pour supprimer
  const oldGridLines = canvas.getObjects().filter(obj => obj.isGridLine);
  canvasOperations.supprimerMultiples(canvas, oldGridLines, false);
  
  // Grille fixe qui couvre largement (3x la taille du canvas)
  const width = canvas.width * 3;
  const height = canvas.height * 3;
  const offsetX = -canvas.width;
  const offsetY = -canvas.height;
  
  const gridLines = [];

  // Lignes verticales
  for (let i = offsetX; i <= width + offsetX; i += echelle) {
    const line = new fabric.Line([i, offsetY, i, height + offsetY], {
      stroke: '#c8e6c9',
      strokeWidth: i % (echelle * 5) === 0 ? 1.5 : 0.5,
      selectable: false,
      evented: false,
      isGridLine: true
    });
    gridLines.push(line);
  }

  // Lignes horizontales
  for (let i = offsetY; i <= height + offsetY; i += echelle) {
    const line = new fabric.Line([offsetX, i, width + offsetX, i], {
      stroke: '#c8e6c9',
      strokeWidth: i % (echelle * 5) === 0 ? 1.5 : 0.5,
      selectable: false,
      evented: false,
      isGridLine: true
    });
    gridLines.push(line);
  }

  // ✅ Utiliser canvasOperations pour ajouter toutes les lignes de grille
  gridLines.forEach(line => canvasOperations.ajouter(canvas, line, false));
  
  // Envoyer toutes les lignes de grille en arrière-plan
  // (juste au-dessus de l'image de fond si elle existe)
  gridLines.forEach(line => {
    canvas.sendObjectToBack(line);
  });
  
  // Marque du centre du terrain (centre fixe à 0,0)
  const centreX = 0;
  const centreY = 0;
  const tailleMarque = 20; // pixels
  
  // Supprimer l'ancienne marque du centre si elle existe
  // ✅ Utiliser canvasOperations pour supprimer
  const oldCenterMark = canvas.getObjects().find(obj => obj.isCenterMark);
  if (oldCenterMark) canvasOperations.supprimer(canvas, oldCenterMark, false);
  
  // Créer une croix au centre
  const markGroup = new fabric.Group([
    // Ligne horizontale
    new fabric.Line([centreX - tailleMarque, centreY, centreX + tailleMarque, centreY], {
      stroke: '#ff5722',
      strokeWidth: 2,
      selectable: false,
      evented: false
    }),
    // Ligne verticale
    new fabric.Line([centreX, centreY - tailleMarque, centreX, centreY + tailleMarque], {
      stroke: '#ff5722',
      strokeWidth: 2,
      selectable: false,
      evented: false
    }),
    // Cercle au centre
    new fabric.Circle({
      left: centreX,
      top: centreY,
      radius: 3,
      fill: '#ff5722',
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false
    })
  ], {
    left: centreX,
    top: centreY,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false,
    isCenterMark: true
  });
  
  // ✅ Utiliser canvasOperations pour ajouter
  canvasOperations.ajouter(canvas, markGroup, false);
  // Placer le repère de centre au premier plan pour qu'il soit toujours visible
  canvas.bringObjectToFront(markGroup);
  
  // Si une image de fond existe, la placer encore plus en arrière que la grille
  const imageFond = canvas.getObjects().find(obj => obj.isImageFond);
  if (imageFond) {
    canvas.sendObjectToBack(imageFond);
  }
  
  canvasOperations.rendre(canvas);
  // Debug désactivé pour performance
  // logger.debug('Grille', `${gridLines.length} lignes ajoutées`);
};

/**
 * Maintenir le repère de centre au premier plan
 */
export const maintenirCentreAuPremierPlan = (canvas) => {
  const centreMark = canvas.getObjects().find(obj => obj.isCenterMark);
  if (centreMark) {
    canvas.bringObjectToFront(centreMark);
  }
  
  // Maintenir aussi la boussole au premier plan
  const boussole = canvas.getObjects().find(obj => obj.isBoussole);
  if (boussole) {
    canvas.bringObjectToFront(boussole);
  }
};

/**
 * Créer la boussole pour orienter le terrain
 */
export const creerBoussole = (canvas, orientation, onOrientationChange, echelle) => {
  // Supprimer l'ancienne boussole si elle existe
  // ✅ Utiliser canvasOperations pour supprimer
  const ancienneBoussole = canvas.getObjects().find(obj => obj.isBoussole);
  if (ancienneBoussole) canvasOperations.supprimer(canvas, ancienneBoussole, false);
  
  // Position de la boussole au centre du canvas (temporaire pour debug)
  const boussoleX = canvas.width / 2; // Centre horizontal
  const boussoleY = canvas.height / 2; // Centre vertical
  const rayon = 60; // Plus grande pour être plus visible
  
  // Créer le cercle de la boussole (toujours visible)
  const cercleBoussole = new fabric.Circle({
    left: boussoleX,
    top: boussoleY,
    radius: rayon,
    fill: '#ffffff',
    stroke: '#ff0000',
    strokeWidth: 4,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false,
    alwaysOnTop: true, // Toujours au premier plan
    visible: true,
    opacity: 1
  });
  
  // Créer les points cardinaux
  const pointsCardinaux = [
    { angle: 0, label: 'N', color: '#ff0000' },
    { angle: 90, label: 'E', color: '#000' },
    { angle: 180, label: 'S', color: '#000' },
    { angle: 270, label: 'O', color: '#000' }
  ];
  
  const elementsBoussole = [cercleBoussole];
  
  pointsCardinaux.forEach(point => {
    const angleRad = (point.angle - 90) * Math.PI / 180; // -90° pour commencer en haut
    const x = boussoleX + Math.cos(angleRad) * (rayon - 10);
    const y = boussoleY + Math.sin(angleRad) * (rayon - 10);
    
    const texte = new fabric.Text(point.label, {
      left: x,
      top: y,
      fontSize: 16,
      fontWeight: 'bold',
      fill: point.color,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
      alwaysOnTop: true // Toujours au premier plan
    });
    
    elementsBoussole.push(texte);
  });
  
  // Créer l'aiguille de la boussole (pointe vers le SUD)
  const aiguille = new fabric.Line([0, 0, 0, -rayon + 5], {
    left: boussoleX,
    top: boussoleY,
    stroke: '#ff0000',
    strokeWidth: 3,
    originX: 'center',
    originY: 'center',
    angle: 0, // Toujours vers le haut (Nord), l'orientation indique où est le Sud
    selectable: false,
    evented: false,
    alwaysOnTop: true // Toujours au premier plan
  });
  
  // Créer l'indicateur SUD (flèche rouge)
  const indicateurSud = new fabric.Triangle({
    left: boussoleX,
    top: boussoleY + rayon - 15,
    width: 8,
    height: 12,
    fill: '#ff0000',
    originX: 'center',
    originY: 'center',
    angle: 0, // Pointe vers le bas (Sud)
    selectable: false,
    evented: false,
    alwaysOnTop: true // Toujours au premier plan
  });
  
  elementsBoussole.push(aiguille);
  elementsBoussole.push(indicateurSud);
  
  // Ajouter un label "BOUSSOLE" pour la rendre plus visible
  const labelBoussole = new fabric.Text('BOUSSOLE', {
    left: boussoleX,
    top: boussoleY + rayon + 20,
    fontSize: 14,
    fontWeight: 'bold',
    fill: '#ff0000',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 4,
    alwaysOnTop: true // Toujours au premier plan
  });
  
  elementsBoussole.push(labelBoussole);
  
  // Créer le groupe de la boussole
  const boussoleGroup = new fabric.Group(elementsBoussole, {
    left: boussoleX,
    top: boussoleY,
    originX: 'center',
    originY: 'center',
    selectable: true,
    evented: true,
    isBoussole: true,
    onOrientationChange: onOrientationChange,
    visible: true,
    opacity: 1
  });
  
  // Gérer la rotation de la boussole
  boussoleGroup.on('rotating', (e) => {
    const newOrientation = e.target.angle;
    if (onOrientationChange) {
      onOrientationChange(newOrientation);
    }
  });
  
  // ✅ Utiliser canvasOperations pour ajouter
  canvasOperations.ajouter(canvas, boussoleGroup, false);
  canvas.bringObjectToFront(boussoleGroup);
  
  // Marquer la boussole pour qu'elle soit toujours au premier plan
  boussoleGroup.alwaysOnTop = true;
  
  // Debug temporaire pour vérifier la boussole
  console.log('🧭 Boussole créée:', {
    position: { x: boussoleX, y: boussoleY },
    rayon: rayon,
    canvasSize: { width: canvas.width, height: canvas.height },
    elements: elementsBoussole.length
  });
  
  // Forcer le rendu
  canvas.renderAll();
  
  return boussoleGroup;
};

/**
 * Créer l'indicateur Sud
 */
export const creerIndicateurSud = (canvas, orientation, onOrientationChange, echelle, saison = 'ete', heureJournee = 90) => {
  // Supprimer les anciens indicateurs SUD s'ils existent
  // ✅ Utiliser canvasOperations pour supprimer
  const anciensIndicateurs = canvas.getObjects().filter(obj => obj.isBoussole);
  canvasOperations.supprimerMultiples(canvas, anciensIndicateurs, false);
  
  // Calcul simplifié pour les ombres réalistes
  const heure = (heureJournee / 180) * 12 + 6; // Convertir 0-180° en 6h-18h
  const positionSoleil = calculerSoleilSimple(heure, saison);
  
  // Centre fixe du terrain
  const centerX = 0; // Centre fixe du terrain
  const centerY = 0; // Centre fixe du terrain
  
  // Distance du soleil (en pixels)
  const distance = 200;
  
  // Position 2D du soleil (seule l'azimut affecte la position en 2D)
  // Le soleil ne dépend QUE de l'heure et de la saison, PAS de l'orientation
  const position2D = soleil2D(positionSoleil.azimuth, distance);
  const soleilX = centerX + position2D.x;
  const soleilY = centerY + position2D.y;

  // Couleur du soleil selon la saison
  const couleursSoleil = {
    hiver: { center: '#FFD700', middle: '#FFA726', edge: '#FF6F00' },
    printemps: { center: '#FFA500', middle: '#FF8C00', edge: '#FF6F00' },
    automne: { center: '#FF8C00', middle: '#FF6F00', edge: '#E65100' },
    ete: { center: '#FFD700', middle: '#FFA726', edge: '#FF6F00' }
  };
  
  const couleur = couleursSoleil[saison] || couleursSoleil.ete;
  
  // Soleil synchronisé avec le soleil 3D
  const soleil = new fabric.Circle({
    left: soleilX,
    top: soleilY,
    radius: 20,
    fill: new fabric.Gradient({
      type: 'radial',
      coords: { x1: 0, y1: 0, x2: 0, y2: 0, r1: 0, r2: 20 },
      colorStops: [
        { offset: 0, color: couleur.center },
        { offset: 0.7, color: couleur.middle },
        { offset: 1, color: couleur.edge }
      ]
    }),
    stroke: couleur.edge,
    strokeWidth: 2,
    originX: 'center',
    originY: 'center',
    selectable: true,
    hasControls: false,
    hasBorders: false,
    lockScalingX: true,
    lockScalingY: true,
    lockRotation: true,
    hoverCursor: 'move',
    isBoussole: true,
    shadow: new fabric.Shadow({
      color: 'rgba(255, 165, 0, 0.6)',
      blur: 15,
      offsetX: 0,
      offsetY: 0
    })
  });

  // Label SUD supprimé - la boussole indique maintenant le SUD

  // Le soleil ne dépend que de l'heure et de la saison
  // Plus de logique d'orientation automatique
  
  // ✅ Utiliser canvasOperations pour ajouter
  canvasOperations.ajouter(canvas, soleil, true);
};

