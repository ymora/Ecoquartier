/**
 * planDemo.js
 * Plan de démonstration avec maison, pavés, citerne, etc.
 */

import * as fabric from 'fabric';
import logger from '../logger';
import { afficherIndicateursConnexion } from './cloturesHelpers';

/**
 * Charger un plan de démonstration
 */
export const chargerPlanDemo = (canvas, echelle, ajouterGrille) => {
  if (!canvas) return;
  
  // Nettoyer le canvas (sauf grille)
  const objets = canvas.getObjects().filter(obj => 
    !obj.isGridLine && 
    !obj.measureLabel && 
    !obj.isBoussole && 
    !obj.isSolIndicator &&
    !obj.alignmentGuide &&
    !obj.isDimensionBox &&
    !obj.isAideButton &&
    !obj.isImageFond
  );
  objets.forEach(obj => canvas.remove(obj));
  
  // Dimensions canvas
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  
  // Marges pour les clôtures (2m du bord)
  const margeCloture = 2 * echelle;
  
  // Zone intérieure disponible
  const zoneInterieureLeft = margeCloture;
  const zoneInterieureTop = margeCloture;
  const zoneInterieureWidth = canvasWidth - (2 * margeCloture);
  const zoneInterieureHeight = canvasHeight - (2 * margeCloture);
  
  // Maison 10×10m au centre de la zone intérieure
  const maisonRect = new fabric.Rect({
    left: zoneInterieureLeft + (zoneInterieureWidth / 2) - (5 * echelle),
    top: zoneInterieureTop + (zoneInterieureHeight / 2) - (5 * echelle),
    width: 10 * echelle,
    height: 10 * echelle,
    fill: '#ffb74d',
    stroke: '#f57c00',
    strokeWidth: 3,
    customType: 'maison',
    profondeurFondations: 1.2,
    hauteurBatiment: 7
  });

  const maisonLabel = new fabric.Text('🏠 Maison\n10m × 10m\nH: 7m\nFond: 1.2m', {
    left: zoneInterieureLeft + (zoneInterieureWidth / 2),
    top: zoneInterieureTop + (zoneInterieureHeight / 2),
    fontSize: 11,
    fontWeight: 'bold',
    fill: '#fff',
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });

  const maison = new fabric.Group([maisonRect, maisonLabel], {
    customType: 'maison',
    profondeurFondations: 1.2,
    hauteurBatiment: 7
  });
  canvas.add(maison);
  
  // Terrasse 4×3m devant la maison
  const terrasseRect = new fabric.Rect({
    left: 15 * echelle,
    top: 26 * echelle,
    width: 4 * echelle,
    height: 3 * echelle,
    fill: '#d4a373',
    stroke: '#8d6e63',
    strokeWidth: 2,
    customType: 'paves'
  });

  const terrasseLabel = new fabric.Text('🏡 Terrasse\n4m × 3m', {
    left: 15 * echelle + (2 * echelle),
    top: 26 * echelle + (1.5 * echelle),
    fontSize: 9,
    fontWeight: 'bold',
    fill: '#fff',
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });

  const terrasse = new fabric.Group([terrasseRect, terrasseLabel], {
    customType: 'paves'
  });
  canvas.add(terrasse);
  
  // Pavés 5×5m à gauche de la maison
  const pavesRect = new fabric.Rect({
    left: zoneInterieureLeft + 5 * echelle,
    top: zoneInterieureTop + (zoneInterieureHeight / 2) - (2.5 * echelle),
    width: 5 * echelle,
    height: 5 * echelle,
    fill: '#bdbdbd',
    stroke: '#757575',
    strokeWidth: 2,
    customType: 'paves'
  });

  const pavesLabel = new fabric.Text('🟩 Pavés\n5m × 5m', {
    left: zoneInterieureLeft + 5 * echelle + (2.5 * echelle),
    top: zoneInterieureTop + (zoneInterieureHeight / 2),
    fontSize: 9,
    fontWeight: 'bold',
    fill: '#fff',
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });

  const paves = new fabric.Group([pavesRect, pavesLabel], {
    customType: 'paves'
  });
  canvas.add(paves);
  
  // Citerne 1.5m de diamètre (à droite de la maison)
  const citerneX = zoneInterieureLeft + (zoneInterieureWidth / 2) + (7 * echelle);
  const citerneY = zoneInterieureTop + (zoneInterieureHeight / 2);
  
  const citerneCircle = new fabric.Circle({
    left: citerneX,
    top: citerneY,
    radius: (1.5 / 2) * echelle,
    fill: '#2196f3',
    stroke: '#1976d2',
    strokeWidth: 2,
    originX: 'center',
    originY: 'center',
    customType: 'citerne',
    diametre: 1.5,
    profondeur: 2.5
  });

  const citerneLabel = new fabric.Text('💧\n1.5m\n2.5m', {
    left: citerneX,
    top: citerneY,
    fontSize: 8,
    fontWeight: 'bold',
    fill: '#fff',
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });

  const citerne = new fabric.Group([citerneCircle, citerneLabel], {
    left: citerneX,
    top: citerneY,
    originX: 'center',
    originY: 'center',
    customType: 'citerne',
    diametre: 1.5,
    profondeur: 2.5
  });
  canvas.add(citerne);
  
  // Canalisation du bord droit de la maison vers la citerne
  const maisonDroitX = zoneInterieureLeft + (zoneInterieureWidth / 2) + (5 * echelle);
  const maisonCentreY = zoneInterieureTop + (zoneInterieureHeight / 2);
  const x1 = maisonDroitX;
  const y1 = maisonCentreY;
  const x2 = citerneX - (1.5 / 2) * echelle;
  const y2 = citerneY;
  
  const canalisationLine = new fabric.Line([x1, y1, x2, y2], {
    stroke: '#1976d2',
    strokeWidth: 3,
    strokeDashArray: [8, 4],
    selectable: true,
    customType: 'canalisation',
    profondeur: 1.2
  });

  const canalisationLabel = new fabric.Text('🚰 1.2m', {
    left: (x1 + x2) / 2,
    top: (y1 + y2) / 2 - 15,
    fontSize: 9,
    fontWeight: 'bold',
    fill: '#1976d2',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 2,
    textAlign: 'center',
    originX: 'center',
    selectable: false,
    evented: false
  });

  const canalisation = new fabric.Group([canalisationLine, canalisationLabel], {
    customType: 'canalisation',
    profondeur: 1.2,
    x1, y1, x2, y2
  });
  canvas.add(canalisation);
  
  // Clôtures formant un rectangle (limites du terrain)
  // Utiliser les mêmes marges que définies au début
  const margeX = margeCloture;
  const margeY = margeCloture;
  
  // 4 côtés de la clôture
  const clotureCotes = [
    { x1: margeX, y1: margeY, x2: canvasWidth - margeX, y2: margeY, nom: 'Nord' },           // Haut
    { x1: canvasWidth - margeX, y1: margeY, x2: canvasWidth - margeX, y2: canvasHeight - margeY, nom: 'Est' },   // Droit
    { x1: canvasWidth - margeX, y1: canvasHeight - margeY, x2: margeX, y2: canvasHeight - margeY, nom: 'Sud' }, // Bas
    { x1: margeX, y1: canvasHeight - margeY, x2: margeX, y2: margeY, nom: 'Ouest' }          // Gauche
  ];
  
  clotureCotes.forEach(cote => {
    const ligne = new fabric.Line([cote.x1, cote.y1, cote.x2, cote.y2], {
      stroke: '#ffd54f',
      strokeWidth: 2, // Épaisseur fixe 5cm (2px à l'échelle)
      strokeDashArray: [10, 5],
      selectable: true,
      lockRotation: false,
      lockScalingX: true,
      lockScalingY: true,
      hasRotatingPoint: true,
      customType: 'cloture',
      hauteurCloture: 1.5, // Hauteur par défaut 1.5m
      epaisseur: 0.05, // 5cm
      x1: cote.x1,
      y1: cote.y1,
      x2: cote.x2,
      y2: cote.y2
    });
    
    const label = new fabric.Text(`🚧 Clôture ${cote.nom}`, {
      left: (cote.x1 + cote.x2) / 2,
      top: (cote.y1 + cote.y2) / 2 - 10,
      fontSize: 9,
      fontWeight: 'bold',
      fill: '#f57c00',
      backgroundColor: 'rgba(255,255,255,0.9)',
      padding: 2,
      originX: 'center',
      selectable: false,
      evented: false
    });
    
    const cloture = new fabric.Group([ligne, label], {
      customType: 'cloture',
      x1: cote.x1,
      y1: cote.y1,
      x2: cote.x2,
      y2: cote.y2
    });
    
    canvas.add(cloture);
    // Amener la clôture au premier plan pour encadrer tous les éléments
    canvas.bringObjectToFront(cloture);
  });
  
  // Re-ajouter la grille par-dessus tout (sauf l'indicateur sud)
  if (ajouterGrille) ajouterGrille(canvas);
  
  // S'assurer que toutes les clôtures restent au premier plan (après la grille)
  const clotures = canvas.getObjects().filter(obj => obj.customType === 'cloture');
  clotures.forEach(cloture => {
    canvas.bringObjectToFront(cloture);
  });
  
  // Afficher les indicateurs de connexion
  afficherIndicateursConnexion(canvas);
  
  canvas.renderAll();
  
  logger.info('Planificateur', '✅ Plan démo chargé (maison, pavés, citerne, canalisation, 4 clôtures + connexions)');
};

