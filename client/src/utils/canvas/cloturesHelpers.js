/**
 * Helpers pour gérer les clôtures connectées
 */

import * as fabric from 'fabric';

// Tolérance pour la détection de connexion (en pixels)
const SNAP_TOLERANCE = 15;
const CONNECTION_INDICATOR_RADIUS = 6;

/**
 * Trouver les points de connexion d'une clôture
 */
export const getCloturePoints = (cloture) => {
  // Si c'est un Group (clôtures du plan démo)
  if (cloture._objects) {
    return {
      x1: cloture.x1,
      y1: cloture.y1,
      x2: cloture.x2,
      y2: cloture.y2
    };
  }
  
  // Si c'est une Line (clôtures manuelles)
  return {
    x1: cloture.left + cloture.x1,
    y1: cloture.top + cloture.y1,
    x2: cloture.left + cloture.x2,
    y2: cloture.top + cloture.y2
  };
};

/**
 * Vérifier si deux points sont proches
 */
const pointsProches = (x1, y1, x2, y2, tolerance = SNAP_TOLERANCE) => {
  const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  return distance < tolerance;
};

/**
 * Afficher les indicateurs de connexion
 */
export const afficherIndicateursConnexion = (canvas) => {
  // Supprimer les anciens indicateurs
  canvas.getObjects().forEach(obj => {
    if (obj.isConnectionIndicator) {
      canvas.remove(obj);
    }
  });
  
  const clotures = canvas.getObjects().filter(obj => obj.customType === 'cloture');
  const pointsConnexion = new Map(); // key: "x,y", value: nombre de clôtures connectées
  
  // Identifier tous les points de connexion
  clotures.forEach(cloture => {
    const points = getCloturePoints(cloture);
    
    const key1 = `${Math.round(points.x1)},${Math.round(points.y1)}`;
    const key2 = `${Math.round(points.x2)},${Math.round(points.y2)}`;
    
    pointsConnexion.set(key1, (pointsConnexion.get(key1) || 0) + 1);
    pointsConnexion.set(key2, (pointsConnexion.get(key2) || 0) + 1);
  });
  
  // Afficher les indicateurs pour les points connectés (2+ clôtures)
  pointsConnexion.forEach((count, key) => {
    if (count >= 2) {
      const [x, y] = key.split(',').map(Number);
      
      const circle = new fabric.Circle({
        left: x,
        top: y,
        radius: CONNECTION_INDICATOR_RADIUS,
        fill: '#4caf50',
        stroke: 'white',
        strokeWidth: 2,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
        isConnectionIndicator: true
      });
      
      canvas.add(circle);
      canvas.bringObjectToFront(circle);
    }
  });
  
  canvas.renderAll();
};

/**
 * Trouver le point de connexion le plus proche pour le snap
 */
export const trouverPointSnapProche = (x, y, cloture, canvas) => {
  const clotures = canvas.getObjects().filter(obj => 
    obj.customType === 'cloture' && obj !== cloture
  );
  
  let pointPlusProche = null;
  let distanceMin = SNAP_TOLERANCE;
  
  clotures.forEach(autre => {
    const points = getCloturePoints(autre);
    
    // Vérifier les 4 points (2 par clôture)
    [[points.x1, points.y1], [points.x2, points.y2]].forEach(([px, py]) => {
      const dist = Math.sqrt(Math.pow(x - px, 2) + Math.pow(y - py, 2));
      if (dist < distanceMin) {
        distanceMin = dist;
        pointPlusProche = { x: px, y: py, distance: dist };
      }
    });
  });
  
  return pointPlusProche;
};

/**
 * Afficher l'indicateur de snap temporaire
 */
export const afficherSnapIndicateur = (canvas, x, y) => {
  // Supprimer l'ancien indicateur
  canvas.getObjects().forEach(obj => {
    if (obj.isSnapIndicator) {
      canvas.remove(obj);
    }
  });
  
  // Créer le nouvel indicateur (cercle pulsant)
  const circle = new fabric.Circle({
    left: x,
    top: y,
    radius: CONNECTION_INDICATOR_RADIUS + 4,
    fill: 'transparent',
    stroke: '#2196f3',
    strokeWidth: 3,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false,
    isSnapIndicator: true
  });
  
  canvas.add(circle);
  canvas.bringObjectToFront(circle);
  canvas.renderAll();
};

/**
 * Masquer l'indicateur de snap
 */
export const masquerSnapIndicateur = (canvas) => {
  canvas.getObjects().forEach(obj => {
    if (obj.isSnapIndicator) {
      canvas.remove(obj);
    }
  });
  canvas.renderAll();
};

/**
 * Trouver toutes les clôtures connectées à une clôture donnée
 */
export const trouverCloturesConnectees = (cloture, canvas) => {
  const clotures = canvas.getObjects().filter(obj => 
    obj.customType === 'cloture' && obj !== cloture
  );
  
  const pointsCloture = getCloturePoints(cloture);
  const connectees = [];
  
  clotures.forEach(autre => {
    const pointsAutre = getCloturePoints(autre);
    
    // Vérifier chaque combinaison de points
    const connexions = [];
    
    // Point 1 de la clôture actuelle
    if (pointsProches(pointsCloture.x1, pointsCloture.y1, pointsAutre.x1, pointsAutre.y1)) {
      connexions.push({ point: 'x1y1', autrePoint: 'x1y1' });
    }
    if (pointsProches(pointsCloture.x1, pointsCloture.y1, pointsAutre.x2, pointsAutre.y2)) {
      connexions.push({ point: 'x1y1', autrePoint: 'x2y2' });
    }
    
    // Point 2 de la clôture actuelle
    if (pointsProches(pointsCloture.x2, pointsCloture.y2, pointsAutre.x1, pointsAutre.y1)) {
      connexions.push({ point: 'x2y2', autrePoint: 'x1y1' });
    }
    if (pointsProches(pointsCloture.x2, pointsCloture.y2, pointsAutre.x2, pointsAutre.y2)) {
      connexions.push({ point: 'x2y2', autrePoint: 'x2y2' });
    }
    
    if (connexions.length > 0) {
      connectees.push({ cloture: autre, connexions });
    }
  });
  
  return connectees;
};

/**
 * Mettre à jour une clôture avec de nouvelles coordonnées
 * ✅ FIXE : Gestion correcte des coordonnées absolues
 */
export const updateClotureCoords = (cloture, x1, y1, x2, y2) => {
  // Si c'est un Group
  if (cloture._objects) {
    const ligne = cloture._objects[0]; // Première ligne du group
    const label = cloture._objects[1]; // Label
    
    // ✅ FIXE : Stocker d'abord les coordonnées absolues
    cloture.x1 = x1;
    cloture.y1 = y1;
    cloture.x2 = x2;
    cloture.y2 = y2;
    
    // Calculer le nouveau centre du groupe
    const newLeft = Math.min(x1, x2);
    const newTop = Math.min(y1, y2);
    
    // Mettre à jour le groupe
    cloture.set({
      left: newLeft,
      top: newTop
    });
    
    // Mettre à jour la ligne avec coordonnées RELATIVES au groupe
    ligne.set({
      x1: x1 - newLeft,
      y1: y1 - newTop,
      x2: x2 - newLeft,
      y2: y2 - newTop
    });
    
    // Mettre à jour le label au centre
    if (label) {
      label.set({
        left: (x1 + x2) / 2 - newLeft,
        top: (y1 + y2) / 2 - newTop - 10
      });
    }
    
    cloture.dirty = true;
    cloture.setCoords();
  } else {
    // Si c'est une Line simple
    cloture.set({
      x1: x1 - cloture.left,
      y1: y1 - cloture.top,
      x2: x2 - cloture.left,
      y2: y2 - cloture.top
    });
    cloture.setCoords();
  }
};

/**
 * Ajuster les clôtures connectées lors d'un déplacement
 * Gère l'étirement intelligent des clôtures
 */
export const ajusterCloturesConnectees = (cloture, canvas) => {
  const connectees = trouverCloturesConnectees(cloture, canvas);
  const pointsActuels = getCloturePoints(cloture);
  
  connectees.forEach(({ cloture: autre, connexions }) => {
    const pointsAutre = getCloturePoints(autre);
    
    connexions.forEach(({ point, autrePoint }) => {
      let newX1 = pointsAutre.x1;
      let newY1 = pointsAutre.y1;
      let newX2 = pointsAutre.x2;
      let newY2 = pointsAutre.y2;
      
      // Déterminer quel point de l'autre clôture doit suivre et s'étirer
      if (autrePoint === 'x1y1') {
        // Le point 1 de l'autre clôture doit suivre
        if (point === 'x1y1') {
          newX1 = pointsActuels.x1;
          newY1 = pointsActuels.y1;
        } else if (point === 'x2y2') {
          newX1 = pointsActuels.x2;
          newY1 = pointsActuels.y2;
        }
      } else if (autrePoint === 'x2y2') {
        // Le point 2 de l'autre clôture doit suivre
        if (point === 'x1y1') {
          newX2 = pointsActuels.x1;
          newY2 = pointsActuels.y1;
        } else if (point === 'x2y2') {
          newX2 = pointsActuels.x2;
          newY2 = pointsActuels.y2;
        }
      }
      
      // Mettre à jour la clôture (elle s'étire automatiquement)
      updateClotureCoords(autre, newX1, newY1, newX2, newY2);
    });
  });
};

/**
 * Gérer le déplacement d'une clôture avec ses connexions et snap
 * ✅ FIXE : Simplification du calcul de delta
 */
export const deplacerClotureAvecConnexions = (cloture, canvas) => {
  const points = getCloturePoints(cloture);
  
  // ✅ FIXE : Pas besoin de delta, on utilise directement les points actuels
  // Les points x1, y1, x2, y2 sont déjà à jour grâce à Fabric.js
  
  // Vérifier le snap pour chaque extrémité
  const snap1 = trouverPointSnapProche(points.x1, points.y1, cloture, canvas);
  const snap2 = trouverPointSnapProche(points.x2, points.y2, cloture, canvas);
  
  let newX1 = points.x1;
  let newY1 = points.y1;
  let newX2 = points.x2;
  let newY2 = points.y2;
  
  // Appliquer le snap si proche
  if (snap1 && snap1.distance < SNAP_TOLERANCE) {
    newX1 = snap1.x;
    newY1 = snap1.y;
    afficherSnapIndicateur(canvas, snap1.x, snap1.y);
  }
  
  if (snap2 && snap2.distance < SNAP_TOLERANCE) {
    newX2 = snap2.x;
    newY2 = snap2.y;
    afficherSnapIndicateur(canvas, snap2.x, snap2.y);
  }
  
  // Si aucun snap, masquer l'indicateur
  if ((!snap1 || snap1.distance >= SNAP_TOLERANCE) && 
      (!snap2 || snap2.distance >= SNAP_TOLERANCE)) {
    masquerSnapIndicateur(canvas);
  }
  
  // ✅ Mettre à jour les coordonnées seulement si changement
  if (newX1 !== points.x1 || newY1 !== points.y1 || newX2 !== points.x2 || newY2 !== points.y2) {
    updateClotureCoords(cloture, newX1, newY1, newX2, newY2);
    
    // Ajuster les clôtures connectées (elles s'étirent automatiquement)
    ajusterCloturesConnectees(cloture, canvas);
  }
};

/**
 * Réinitialiser la position de référence et masquer le snap
 */
export const resetClotureLastPos = (cloture, canvas) => {
  if (cloture) {
    delete cloture._lastPos;
  }
  if (canvas) {
    masquerSnapIndicateur(canvas);
    afficherIndicateursConnexion(canvas);
  }
};

