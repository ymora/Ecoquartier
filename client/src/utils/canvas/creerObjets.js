/**
 * creerObjets.js
 * Fonctions de création des objets du canvas
 * Extrait de CanvasTerrain.jsx pour modularité
 */

import * as fabric from 'fabric';
import logger from '../logger';

/**
 * Créer une maison
 */
export const creerMaison = (canvas, echelle) => {
  if (!canvas) return;
  
  const maisonRect = new fabric.Rect({
    left: 0,
    top: 0,
    width: 10 * echelle,
    height: 10 * echelle,
    fill: '#bdbdbd',
    stroke: '#757575',
    strokeWidth: 3,
    originX: 'center',
    originY: 'center'
  });

  // ✅ Label central comme en 3D
  const label = new fabric.Text('🏠 Maison\n10.0×10.0m', {
    left: 0,
    top: 0,
    fontSize: 10,
    fontWeight: '600',
    fill: '#333',
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 4,
    stroke: '#757575',
    strokeWidth: 1.5
  });

  const group = new fabric.Group([maisonRect, label], {
    left: 300,
    top: 200,
    customType: 'maison',
    profondeurFondations: 1.2,
    hauteurBatiment: 7
  });

  canvas.add(group);
  canvas.setActiveObject(group);
  canvas.renderAll();
  
  logger.debug('Objets', 'Maison ajoutée avec label');
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
    profondeur: 0.6
  });

  canvas.add(canalisation);
  canvas.setActiveObject(canalisation);
  canvas.renderAll();
  
  // Debug désactivé pour performance
  // logger.debug('Objets', 'Canalisation ajoutée', { profondeur: 0.6 });
};

/**
 * Créer une citerne/fosse septique
 */
export const creerCiterne = (canvas, echelle) => {
  if (!canvas) return;
  
  const citerne = new fabric.Rect({
    left: 400,
    top: 400,
    width: 2 * echelle,
    height: 3 * echelle,
    fill: '#b3e5fc',
    stroke: '#0288d1',
    strokeWidth: 3,
    strokeDashArray: [10, 5],
    customType: 'citerne',
    profondeur: 2.5
  });

  const label = new fabric.Text('💧 Citerne\n2m × 3m\nProf: 2.5m', {
    left: 400 + echelle,
    top: 400 + (1.5 * echelle),
    fontSize: 10,
    fontWeight: 'bold',
    fill: '#01579b',
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });

  const group = new fabric.Group([citerne, label], {
    customType: 'citerne',
    profondeur: 2.5
  });

  canvas.add(group);
  canvas.setActiveObject(group);
  canvas.renderAll();
  
  // Debug désactivé pour performance
  // logger.debug('Objets', 'Citerne ajoutée', { profondeur: 2.5 });
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
      hauteurCloture: 1.5, // Hauteur par défaut 1.5m
      epaisseur: 0.05, // 5cm
      strokeUniform: true,
      hasBorders: true,
      hasControls: true,
      cornerSize: 12
    });
    
    canvas.add(ligne);
    // Amener la clôture au premier plan pour encadrer les éléments
    canvas.bringObjectToFront(ligne);
    canvas.renderAll();
    
    // Debug désactivé pour performance
    // logger.debug('Cloture', `Segment ${dernierIndex} ajouté`);
  }
};

/**
 * Créer une terrasse
 */
export const creerTerrasse = (canvas, echelle) => {
  if (!canvas) return;
  
  const terrasseRect = new fabric.Rect({
    left: 0,
    top: 0,
    width: 5 * echelle,
    height: 4 * echelle,
    fill: 'rgba(158, 158, 158, 0.4)',
    stroke: '#757575',
    strokeWidth: 2,
    originX: 'center',
    originY: 'center'
  });
  
  // ✅ Label central
  const label = new fabric.Text('🏡 Terrasse\n5.0×4.0m', {
    left: 0,
    top: 0,
    fontSize: 10,
    fontWeight: '600',
    fill: '#333',
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 4,
    stroke: '#757575',
    strokeWidth: 1.5
  });

  const group = new fabric.Group([terrasseRect, label], {
    left: 150,
    top: 150,
    customType: 'terrasse'
  });

  canvas.add(group);
  canvas.setActiveObject(group);
  canvas.renderAll();
  
  logger.debug('Objets', 'Terrasse ajoutée avec label');
};

/**
 * Créer des pavés enherbés
 */
export const creerPaves = (canvas, echelle) => {
  if (!canvas) return;
  
  const pavesRect = new fabric.Rect({
    left: 0,
    top: 0,
    width: 5 * echelle,
    height: 5 * echelle,
    fill: 'rgba(139, 195, 74, 0.3)',
    stroke: '#7cb342',
    strokeWidth: 2,
    originX: 'center',
    originY: 'center'
  });
  
  // ✅ Label central
  const label = new fabric.Text('🟩 Pavés\n5.0×5.0m', {
    left: 0,
    top: 0,
    fontSize: 10,
    fontWeight: '600',
    fill: '#333',
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 4,
    stroke: '#7cb342',
    strokeWidth: 1.5
  });

  const group = new fabric.Group([pavesRect, label], {
    left: 500,
    top: 500,
    customType: 'paves'
  });

  canvas.add(group);
  canvas.setActiveObject(group);
  canvas.renderAll();
  
  logger.debug('Objets', 'Pavés enherbés ajoutés avec label');
};

/**
 * Créer un caisson rectangulaire d'eau de pluie
 */
export const creerCaissonEau = (canvas, echelle) => {
  if (!canvas) return;

  const largeur = 3 * echelle; // 3m par défaut
  const longueur = 5 * echelle; // 5m par défaut
  
  const caisson = new fabric.Rect({
    left: 300,
    top: 300,
    width: largeur,
    height: longueur,
    fill: 'rgba(33, 150, 243, 0.3)',
    stroke: '#1565c0',
    strokeWidth: 3,
    strokeDashArray: [5, 3],
    customType: 'caisson-eau',
    profondeur: 2.5, // Profondeur sous terre
    largeurCaisson: 3, // En mètres
    longueurCaisson: 5, // En mètres
    hasControls: true,
    lockRotation: true
  });

  canvas.add(caisson);
  canvas.setActiveObject(caisson);
  canvas.renderAll();
  
  logger.debug('Objets', 'Caisson eau ajouté (3m × 5m)');
};

/**
 * Créer un arbre existant
 */
export const creerArbreExistant = (canvas, echelle) => {
  if (!canvas) return;
  
  const rayon = 2.5 * echelle;
  const diametre = 5.0; // ✅ FIX: Définir le diamètre (5m par défaut)
  
  const cercle = new fabric.Circle({
    left: 0,
    top: 0,
    radius: rayon,
    fill: 'rgba(76, 175, 80, 0.3)',
    stroke: '#388e3c',
    strokeWidth: 3,
    originX: 'center',
    originY: 'center'
  });

  const emoji = new fabric.Text('🌳', {
    left: 0,
    top: 0,
    fontSize: rayon * 0.6,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });

  // Label supprimé : toutes les infos sont dans le tooltip au survol

  const group = new fabric.Group([cercle, emoji], {
    left: 250,
    top: 250,
    customType: 'arbre-existant',
    // ✅ Dimensions éditables (3 dimensions)
    diametreArbre: diametre, // Largeur de la couronne
    hauteurArbre: 8, // Hauteur de l'arbre
    profondeurRacines: 2.5 // Profondeur des racines
  });
  
  // Stocker les informations pour le tooltip
  group.arbreData = {
    name: 'Arbre existant',
    description: 'Arbre déjà présent sur le terrain'
  };
  group.tailles = {
    envergureActuelle: diametre,
    hauteurActuelle: 8, // Estimation pour un arbre mature
    diametreTroncActuel: 0.4 // 40cm estimation
  };
  group.iconeType = '(mature)';

  canvas.add(group);
  canvas.setActiveObject(group);
  canvas.renderAll();
  
  // Debug désactivé pour performance
  // logger.debug('Objets', 'Arbre existant ajouté');
};

/**
 * Créer une grille fixe (ne bouge jamais)
 */
export const creerGrille = (canvas, echelle) => {
  // Supprimer les anciennes lignes de grille
  const oldGridLines = canvas.getObjects().filter(obj => obj.isGridLine);
  oldGridLines.forEach(line => canvas.remove(line));
  
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

  // Ajouter toutes les lignes de grille
  gridLines.forEach(line => canvas.add(line));
  
  // Envoyer toutes les lignes de grille en arrière-plan
  // (juste au-dessus de l'image de fond si elle existe)
  const imageFond = canvas.getObjects().find(obj => obj.isImageFond);
  
  if (imageFond) {
    // Image de fond existe : envoyer au fond d'abord l'image, puis la grille
    canvas.sendObjectToBack(imageFond);
    gridLines.forEach(line => {
      canvas.sendObjectToBack(line);
    });
  } else {
    // Pas d'image : envoyer juste la grille au fond
    gridLines.forEach(line => {
      canvas.sendObjectToBack(line);
    });
  }
  
  canvas.renderAll();
  // Debug désactivé pour performance
  // logger.debug('Grille', `${gridLines.length} lignes ajoutées`);
};

/**
 * Créer l'indicateur Sud
 */
export const creerIndicateurSud = (canvas, orientation, onOrientationChange) => {
  // Supprimer les anciens indicateurs SUD s'ils existent
  const anciensIndicateurs = canvas.getObjects().filter(obj => obj.isBoussole);
  anciensIndicateurs.forEach(obj => canvas.remove(obj));
  
  // Position initiale du soleil selon l'orientation
  let soleilX, soleilY;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  if (orientation === 'nord-haut') {
    soleilX = centerX;
    soleilY = canvas.height - 60;
  } else if (orientation === 'nord-droite') {
    soleilX = 60;
    soleilY = centerY;
  } else if (orientation === 'nord-bas') {
    soleilX = centerX;
    soleilY = 60;
  } else {
    soleilX = canvas.width - 60;
    soleilY = centerY;
  }

  // Soleil "SUD" (midi)
  const soleil = new fabric.Circle({
    left: soleilX,
    top: soleilY,
    radius: 20,
    fill: new fabric.Gradient({
      type: 'radial',
      coords: { x1: 0, y1: 0, x2: 0, y2: 0, r1: 0, r2: 20 },
      colorStops: [
        { offset: 0, color: '#ffeb3b' },
        { offset: 0.7, color: '#ffa726' },
        { offset: 1, color: '#ff6f00' }
      ]
    }),
    stroke: '#ff6f00',
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

  const label = new fabric.Text('SUD', {
    left: soleilX,
    top: soleilY + 30,
    fontSize: 12,
    fontWeight: 'bold',
    fill: '#ff6f00',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false,
    isBoussole: true,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 3
  });

  // Fonction pour calculer et mettre à jour l'orientation
  const updateOrientation = () => {
    label.set({
      left: soleil.left,
      top: soleil.top + 30
    });

    const dx = soleil.left - centerX;
    const dy = soleil.top - centerY;
    
    let angle = Math.atan2(dy, dx) * 180 / Math.PI;
    angle = ((angle % 360) + 360) % 360;
    
    let newOrientation;
    if (angle >= 315 || angle < 45) {
      newOrientation = 'nord-gauche';
    } else if (angle >= 45 && angle < 135) {
      newOrientation = 'nord-haut';
    } else if (angle >= 135 && angle < 225) {
      newOrientation = 'nord-droite';
    } else {
      newOrientation = 'nord-bas';
    }
    
    if (newOrientation !== orientation) {
      onOrientationChange(newOrientation);
    }
    
    canvas.renderAll();
  };
  
  // Variable pour tracker si le soleil est en train d'être déplacé
  let isMovingSoleil = false;
  
  soleil.on('moving', () => {
    isMovingSoleil = true;
    updateOrientation();
  });
  
  soleil.on('modified', () => {
    updateOrientation();
    isMovingSoleil = false;
  });
  
  soleil.on('mousedown', () => {
    isMovingSoleil = false;
  });
  
  soleil.on('mouseup', () => {
    if (isMovingSoleil) {
      setTimeout(() => {
        canvas.discardActiveObject();
        canvas.renderAll();
        // Debug désactivé pour performance
        // logger.debug('Boussole', 'Soleil déposé après drag');
      }, 50);
    }
  });

  canvas.add(soleil);
  canvas.add(label);
  
  // Debug désactivé pour performance
  // logger.debug('Boussole', 'Indicateur Sud ajouté', { orientation });
};

