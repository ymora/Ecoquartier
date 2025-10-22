/**
 * creerObjets.js
 * Fonctions de création des objets du canvas
 * Extrait de CanvasTerrain.jsx pour modularité
 */

import * as fabric from 'fabric';
import logger from '../logger';

/**
 * Créer un objet maison (retourne l'objet sans l'ajouter au canvas)
 */
export const creerMaisonObjet = (echelle) => {
  const largeur = 10;
  const hauteur = 10;
  
  const maisonRect = new fabric.Rect({
    left: 0,
    top: 0,
    width: largeur * echelle,
    height: hauteur * echelle,
    fill: '#bdbdbd',
    stroke: '#757575',
    strokeWidth: 3,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });

  const tailleIcone = Math.min(largeur * echelle, hauteur * echelle) * 0.4;
  const labelIcone = new fabric.Text('🏠', {
    left: 0,
    top: 0,
    fontSize: Math.max(tailleIcone, 24),
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });

  const group = new fabric.Group([maisonRect, labelIcone], {
    customType: 'maison',
    profondeurFondations: 1.2,
    hauteurBatiment: 7
  });

  return group;
};

/**
 * Créer une maison (ancienne méthode - pour compatibilité)
 */
export const creerMaison = (canvas, echelle) => {
  if (!canvas) return;
  const group = creerMaisonObjet(echelle);
  group.set({ left: 300, top: 200 });
  canvas.add(group);
  canvas.setActiveObject(group);
  canvas.renderAll();
  logger.info('Objets', 'Maison ajoutée');
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
    profondeur: 0.6,
    diametreCanalisation: 0.1 // 10cm
  });

  canvas.add(canalisation);
  canvas.setActiveObject(canalisation);
  canvas.renderAll();
  
  // Debug désactivé pour performance
  // logger.debug('Objets', 'Canalisation ajoutée', { profondeur: 0.6 });
};

/**
 * Créer un objet citerne (retourne l'objet sans l'ajouter au canvas)
 */
export const creerCiterneObjet = (echelle) => {
  const diametre = 1.5;
  const profondeur = 2.5;
  const rayon = (diametre * echelle) / 2;
  
  const citerne = new fabric.Circle({
    left: 0,
    top: 0,
    radius: rayon,
    fill: 'rgba(33, 150, 243, 0.3)',
    stroke: '#1976d2',
    strokeWidth: 3,
    strokeDashArray: [5, 3],
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });

  const tailleIcone = rayon * 0.8;
  const labelIcone = new fabric.Text('💧', {
    left: 0,
    top: 0,
    fontSize: Math.max(tailleIcone, 24),
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });

  const group = new fabric.Group([citerne, labelIcone], {
    customType: 'citerne',
    diametre: diametre,
    profondeur: profondeur
  });

  return group;
};

/**
 * Créer une citerne/fosse septique (ancienne méthode - pour compatibilité)
 */
export const creerCiterne = (canvas, echelle) => {
  if (!canvas) return;
  const group = creerCiterneObjet(echelle);
  group.set({ left: 400, top: 400 });
  canvas.add(group);
  canvas.setActiveObject(group);
  canvas.renderAll();
  logger.info('Objets', 'Citerne ajoutée');
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
 * Créer un objet terrasse (retourne l'objet sans l'ajouter au canvas)
 */
export const creerTerrasseObjet = (echelle) => {
  const largeur = 5;
  const hauteur = 4;
  
  const terrasseRect = new fabric.Rect({
    left: 0,
    top: 0,
    width: largeur * echelle,
    height: hauteur * echelle,
    fill: 'rgba(158, 158, 158, 0.4)',
    stroke: '#757575',
    strokeWidth: 2,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  const tailleIcone = Math.min(largeur * echelle, hauteur * echelle) * 0.4;
  const labelIcone = new fabric.Text('🪵', {
    left: 0,
    top: 0,
    fontSize: Math.max(tailleIcone, 24),
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });

  const group = new fabric.Group([terrasseRect, labelIcone], {
    customType: 'terrasse',
    hauteurDalle: 0.15,
    profondeurFondation: 0.3
  });

  return group;
};

/**
 * Créer une terrasse (ancienne méthode - pour compatibilité)
 */
export const creerTerrasse = (canvas, echelle) => {
  if (!canvas) return;
  const group = creerTerrasseObjet(echelle);
  group.set({ left: 150, top: 150 });
  canvas.add(group);
  canvas.setActiveObject(group);
  canvas.renderAll();
  logger.info('Objets', 'Terrasse ajoutée');
};

/**
 * Créer un objet pavés (retourne l'objet sans l'ajouter au canvas)
 */
export const creerPavesObjet = (echelle) => {
  const largeur = 5;
  const hauteur = 5;
  
  const pavesRect = new fabric.Rect({
    left: 0,
    top: 0,
    width: largeur * echelle,
    height: hauteur * echelle,
    fill: 'rgba(139, 195, 74, 0.3)',
    stroke: '#7cb342',
    strokeWidth: 2,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  const tailleIcone = Math.min(largeur * echelle, hauteur * echelle) * 0.4;
  const labelIcone = new fabric.Text('🌿', {
    left: 0,
    top: 0,
    fontSize: Math.max(tailleIcone, 24),
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });

  const group = new fabric.Group([pavesRect, labelIcone], {
    customType: 'paves',
    hauteurPaves: 0.08,
    profondeurGravier: 0.15
  });

  return group;
};

/**
 * Créer des pavés enherbés (ancienne méthode - pour compatibilité)
 */
export const creerPaves = (canvas, echelle) => {
  if (!canvas) return;
  const group = creerPavesObjet(echelle);
  group.set({ left: 500, top: 500 });
  canvas.add(group);
  canvas.setActiveObject(group);
  canvas.renderAll();
  logger.info('Objets', 'Pavés enherbés ajoutés');
};

/**
 * Créer un objet caisson d'eau (retourne l'objet sans l'ajouter au canvas)
 */
export const creerCaissonEauObjet = (echelle) => {
  const largeurMetres = 5;
  const profondeurMetres = 3;
  const hauteurMetres = 1;
  
  const largeur = largeurMetres * echelle;
  const profondeur = profondeurMetres * echelle;
  
  const caissonRect = new fabric.Rect({
    left: 0,
    top: 0,
    width: largeur,
    height: profondeur,
    fill: 'rgba(33, 150, 243, 0.25)',
    stroke: '#1565c0',
    strokeWidth: 3,
    strokeDashArray: [5, 3],
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  const tailleIcone = Math.min(largeur, profondeur) * 0.4;
  const labelIcone = new fabric.Text('💦', {
    left: 0,
    top: 0,
    fontSize: Math.max(tailleIcone, 24),
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });

  const group = new fabric.Group([caissonRect, labelIcone], {
    customType: 'caisson-eau',
    profondeurEnterree: 1.0,
    largeurCaisson: largeurMetres,
    profondeurCaisson: profondeurMetres,
    hauteurCaisson: hauteurMetres
  });

  return group;
};

/**
 * Créer un caisson rectangulaire de rétention d'eau (ancienne méthode - pour compatibilité)
 */
export const creerCaissonEau = (canvas, echelle) => {
  if (!canvas) return;
  const group = creerCaissonEauObjet(echelle);
  group.set({ left: 300, top: 300 });
  canvas.add(group);
  canvas.setActiveObject(group);
  canvas.renderAll();
  logger.info('Objets', 'Caisson rétention ajouté');
};

/**
 * Créer un arbre existant
 */
export const creerArbreExistant = (canvas, echelle) => {
  if (!canvas) return;
  
  const diametre = 5.0; // Diamètre par défaut (5m)
  const hauteur = 8.0; // Hauteur par défaut (8m)
  const profondeurRacines = 2.5; // Profondeur racines (2.5m)
  const rayon = (diametre * echelle) / 2;
  
  const cercle = new fabric.Circle({
    left: 0,
    top: 0,
    radius: rayon,
    fill: 'rgba(76, 175, 80, 0.3)',
    stroke: '#388e3c',
    strokeWidth: 3,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });

  // Icône au centre (taille adaptative)
  const tailleIcone = rayon * 0.8;
  const labelIcone = new fabric.Text('🌳', {
    left: 0,
    top: 0,
    fontSize: Math.max(tailleIcone, 24),
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });

  // Label dimensions à l'extérieur (en haut)
  const labelDimensions = new fabric.Text(`↕️${hauteur}m · ↔️${diametre}m`, {
    left: 0,
    top: -rayon - 18,
    fontSize: 10,
    fontWeight: '600',
    fill: '#388e3c',
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 2
  });

  const group = new fabric.Group([cercle, labelIcone, labelDimensions], {
    left: 250,
    top: 250,
    customType: 'arbre-existant',
    // ✅ Dimensions éditables (3 dimensions)
    diametreArbre: diametre, // Largeur de la couronne
    hauteurArbre: hauteur, // Hauteur de l'arbre
    profondeurRacines: profondeurRacines // Profondeur des racines
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
  gridLines.forEach(line => {
    canvas.sendObjectToBack(line);
  });
  
  // Si une image de fond existe, la placer encore plus en arrière que la grille
  const imageFond = canvas.getObjects().find(obj => obj.isImageFond);
  if (imageFond) {
    canvas.sendObjectToBack(imageFond);
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

