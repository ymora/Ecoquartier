/**
 * couchesSolUtils.js
 * ✅ NOUVEAU SYSTÈME : Couches de sol indépendantes sans "terrain" parent
 * Chaque couche suit automatiquement le maillage de relief
 */

import * as fabric from 'fabric';
import logger from '../logger';

/**
 * Créer le maillage de relief automatiquement au démarrage
 * Ce maillage est invisible/très discret en 2D, manipulable en 3D
 * @param {number} echelle - Échelle du plan (pixels par mètre)
 * @param {Object} dimensions - Dimensions du terrain {largeur, hauteur}
 * @returns {Object} - Objet maillage avec nœuds
 */
export const creerMaillageRelief = (echelle, dimensions) => {
  const largeur = dimensions.largeur * echelle;
  const hauteur = dimensions.hauteur * echelle;
  
  // ✅ Maillage tous les 5 mètres
  const tailleMailleM = 5;
  
  const nbCellulesX = Math.ceil(dimensions.largeur / tailleMailleM);
  const nbCellulesZ = Math.ceil(dimensions.hauteur / tailleMailleM);
  
  const nbNoeudsX = nbCellulesX + 1;
  const nbNoeudsZ = nbCellulesZ + 1;
  
  // Initialiser le maillage avec élévation 0 (terrain plat)
  const maillageElevation = [];
  for (let i = 0; i < nbNoeudsZ; i++) {
    maillageElevation[i] = [];
    for (let j = 0; j < nbNoeudsX; j++) {
      maillageElevation[i][j] = 0; // Élévation en mètres
    }
  }
  
  // ✅ Rectangle INVISIBLE pour la zone de sélection du maillage
  const zoneSelection = new fabric.Rect({
    left: -largeur / 2,
    top: -hauteur / 2,
    width: largeur,
    height: hauteur,
    fill: 'transparent',
    stroke: 'transparent',
    strokeWidth: 0,
    selectable: true,
    evented: true,
    hasBorders: false,
    hasControls: false,
    lockScalingX: true,
    lockScalingY: true,
    lockRotation: true,
    customType: 'maillage-relief',
    name: 'Maillage relief',
    maillageElevation: maillageElevation,
    tailleMailleM: tailleMailleM,
    nbNoeudsX: nbNoeudsX,
    nbNoeudsZ: nbNoeudsZ
  });
  
  // ✅ Créer les nœuds cliquables (discrets)
  const elementsMaillage = [];
  
  for (let i = 0; i < nbNoeudsZ; i++) {
    for (let j = 0; j < nbNoeudsX; j++) {
      const x = -largeur / 2 + j * tailleMailleM * echelle;
      const y = -hauteur / 2 + i * tailleMailleM * echelle;
      const elevation = maillageElevation[i][j];
      
      // Nœud très discret en 2D
      const noeud = new fabric.Circle({
        left: x,
        top: y,
        radius: 4, // Plus petit que l'ancien système
        fill: elevation === 0 ? 'rgba(33, 150, 243, 0.3)' : (elevation > 0 ? 'rgba(76, 175, 80, 0.5)' : 'rgba(244, 67, 54, 0.5)'),
        stroke: 'rgba(255, 255, 255, 0.6)',
        strokeWidth: 1,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: true,
        hoverCursor: 'pointer',
        noeudI: i,
        noeudJ: j,
        customType: 'noeud-relief',
        elevation: elevation
      });
      
      elementsMaillage.push(noeud);
    }
  }
  
  // ✅ Créer un groupe avec la zone de sélection + les nœuds
  const groupeMaillage = new fabric.Group([zoneSelection, ...elementsMaillage], {
    left: 0,
    top: 0,
    selectable: true,
    evented: true,
    hasBorders: false,
    hasControls: false,
    lockMovementX: true,
    lockMovementY: true,
    lockScalingX: true,
    lockScalingY: true,
    lockRotation: true,
    customType: 'maillage-relief',
    name: 'Maillage relief',
    maillageElevation: maillageElevation,
    tailleMailleM: tailleMailleM,
    nbNoeudsX: nbNoeudsX,
    nbNoeudsZ: nbNoeudsZ
  });
  
  logger.info('Maillage', `✅ Maillage relief créé (${nbNoeudsX}×${nbNoeudsZ} nœuds, tous les ${tailleMailleM}m)`);
  
  return groupeMaillage;
};

/**
 * Ajouter le maillage de relief au canvas (automatique au démarrage)
 * @param {fabric.Canvas} canvas - Canvas Fabric.js
 * @param {number} echelle - Échelle du plan
 * @param {Object} dimensions - Dimensions du terrain
 */
export const ajouterMaillageReliefAuCanvas = (canvas, echelle, dimensions) => {
  if (!canvas) {
    logger.error('Maillage', '❌ Canvas non disponible');
    return;
  }
  
  // Vérifier s'il existe déjà un maillage
  const maillageExistant = canvas.getObjects().find(obj => obj.customType === 'maillage-relief');
  if (maillageExistant) {
    logger.warn('Maillage', '⚠️ Un maillage existe déjà');
    return;
  }
  
  const maillage = creerMaillageRelief(echelle, dimensions);
  canvas.add(maillage);
  
  // ✅ Forcer le maillage en arrière-plan (derrière tout)
  canvas.sendObjectToBack(maillage);
  canvas.renderAll();
  
  logger.info('Maillage', '✅ Maillage relief ajouté au canvas');
};

/**
 * Créer une couche de sol indépendante
 * @param {string} type - Type de couche ('terre', 'marne', 'sable', 'argile', 'gravier', 'roche')
 * @param {Object} maillage - Référence au maillage de relief
 * @param {Object} config - Configuration {nom, profondeur, couleur}
 * @returns {Object} - Objet couche de sol
 */
export const creerCoucheSol = (type, maillage, config) => {
  // Configuration par défaut selon le type
  const configurations = {
    terre: { nom: 'Terre végétale', profondeur: 30, couleur: '#8d6e63' },
    marne: { nom: 'Marne calcaire', profondeur: 70, couleur: '#bdbdbd' },
    sable: { nom: 'Sable', profondeur: 50, couleur: '#fdd835' },
    argile: { nom: 'Argile', profondeur: 60, couleur: '#d32f2f' },
    gravier: { nom: 'Gravier', profondeur: 40, couleur: '#9e9e9e' },
    roche: { nom: 'Roche mère', profondeur: 100, couleur: '#5d4037' }
  };
  
  const configDefaut = configurations[type] || configurations.terre;
  const configFinale = { ...configDefaut, ...config };
  
  // Créer un objet data pour la couche (pas visible en 2D, seulement en 3D)
  const coucheSol = {
    customType: 'couche-sol',
    type: type,
    nom: configFinale.nom,
    profondeur: configFinale.profondeur, // en cm
    couleur: configFinale.couleur,
    maillageRef: maillage, // Référence au maillage pour suivre le relief
    ordre: 0, // Ordre d'empilement (0 = en haut)
    visible: true,
    id: `couche-${type}-${Date.now()}`
  };
  
  logger.info('Couche', `✅ Couche créée: ${configFinale.nom} (${configFinale.profondeur}cm)`);
  
  return coucheSol;
};

/**
 * Ajouter une couche de sol au canvas
 * @param {fabric.Canvas} canvas - Canvas Fabric.js
 * @param {string} type - Type de couche
 * @param {Object} config - Configuration optionnelle
 */
export const ajouterCoucheSol = (canvas, type, config = {}) => {
  if (!canvas) {
    logger.error('Couche', '❌ Canvas non disponible');
    return null;
  }
  
  // Trouver le maillage de relief
  const maillage = canvas.getObjects().find(obj => obj.customType === 'maillage-relief');
  if (!maillage) {
    logger.error('Couche', '❌ Maillage de relief non trouvé');
    return null;
  }
  
  // Créer la couche
  const couche = creerCoucheSol(type, maillage, config);
  
  // Stocker les couches dans les données du canvas (custom property)
  if (!canvas.couchesSol) {
    canvas.couchesSol = [];
  }
  
  canvas.couchesSol.push(couche);
  
  // Réorganiser l'ordre des couches (la plus récente en haut)
  canvas.couchesSol.forEach((c, index) => {
    c.ordre = canvas.couchesSol.length - 1 - index;
  });
  
  canvas.renderAll();
  canvas.fire('couches:updated', { couches: canvas.couchesSol });
  
  logger.info('Couche', `✅ Couche ajoutée: ${couche.nom} (${canvas.couchesSol.length} couche(s) total)`);
  
  return couche;
};

/**
 * Supprimer une couche de sol
 * @param {fabric.Canvas} canvas - Canvas Fabric.js
 * @param {string} coucheId - ID de la couche à supprimer
 */
export const supprimerCoucheSol = (canvas, coucheId) => {
  if (!canvas || !canvas.couchesSol) return;
  
  const index = canvas.couchesSol.findIndex(c => c.id === coucheId);
  if (index === -1) {
    logger.warn('Couche', `⚠️ Couche non trouvée: ${coucheId}`);
    return;
  }
  
  const couche = canvas.couchesSol[index];
  canvas.couchesSol.splice(index, 1);
  
  // Réorganiser l'ordre
  canvas.couchesSol.forEach((c, idx) => {
    c.ordre = canvas.couchesSol.length - 1 - idx;
  });
  
  canvas.renderAll();
  canvas.fire('couches:updated', { couches: canvas.couchesSol });
  
  logger.info('Couche', `✅ Couche supprimée: ${couche.nom}`);
};

/**
 * Obtenir toutes les couches de sol
 * @param {fabric.Canvas} canvas - Canvas Fabric.js
 * @returns {Array} - Liste des couches
 */
export const obtenirCouchesSol = (canvas) => {
  return canvas?.couchesSol || [];
};

/**
 * Modifier l'élévation d'un nœud du maillage
 * @param {fabric.Canvas} canvas - Canvas Fabric.js
 * @param {number} i - Index ligne
 * @param {number} j - Index colonne
 * @param {number} elevation - Nouvelle élévation en mètres
 */
export const modifierElevationNoeud = (canvas, i, j, elevation) => {
  const maillage = canvas.getObjects().find(obj => obj.customType === 'maillage-relief');
  if (!maillage) return;
  
  if (maillage.maillageElevation && maillage.maillageElevation[i] && maillage.maillageElevation[i][j] !== undefined) {
    maillage.maillageElevation[i][j] = elevation;
    
    // Mettre à jour la couleur du nœud
    const noeud = maillage.getObjects().find(obj => obj.noeudI === i && obj.noeudJ === j);
    if (noeud) {
      noeud.set({
        fill: elevation === 0 ? 'rgba(33, 150, 243, 0.3)' : (elevation > 0 ? 'rgba(76, 175, 80, 0.5)' : 'rgba(244, 67, 54, 0.5)'),
        elevation: elevation
      });
    }
    
    canvas.renderAll();
    canvas.fire('relief:updated', { maillage: maillage });
    
    logger.debug('Relief', `Noeud [${i},${j}] → ${elevation}m`);
  }
};

