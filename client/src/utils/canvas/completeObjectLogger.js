/**
 * Logger simplifié pour les objets canvas
 * Version réduite : garde seulement les fonctions utilisées en production
 */

import logger from '../logger';

/**
 * Logger tous les objets du canvas avec leurs propriétés principales
 * @param {fabric.Canvas} canvas - Canvas Fabric.js
 * @param {number} echelle - Échelle du plan
 */
export const logAllCanvasObjects = (canvas, echelle) => {
  if (!canvas) {
    logger.error('CompleteLogger', 'Canvas non disponible');
    return;
  }

  const objects = canvas.getObjects();
  const data = {
    timestamp: new Date().toISOString(),
    echelle,
    canvasSize: {
      width: canvas.width,
      height: canvas.height
    },
    objects: objects.map(obj => {
      // Extraire les propriétés principales
      const basicProps = {
        id: obj.id,
        type: obj.type,
        customType: obj.customType,
        left: obj.left,
        top: obj.top,
        width: obj.width,
        height: obj.height,
        scaleX: obj.scaleX,
        scaleY: obj.scaleY,
        angle: obj.angle,
        opacity: obj.opacity,
        visible: obj.visible,
        selectable: obj.selectable,
        fill: obj.fill,
        stroke: obj.stroke,
        strokeWidth: obj.strokeWidth
      };

      // Propriétés spécifiques selon le type
      if (obj.customType === 'maison') {
        basicProps.largeur = obj.largeur;
        basicProps.profondeur = obj.profondeur;
        basicProps.hauteur = obj.hauteur;
        basicProps.typeToit = obj.typeToit;
        basicProps.penteToit = obj.penteToit;
        basicProps.orientationToit = obj.orientationToit;
        basicProps.elevationSol = obj.elevationSol;
      } else if (obj.customType === 'terrasse' || obj.customType === 'paves') {
        basicProps.largeur = obj.largeur;
        basicProps.profondeur = obj.profondeur;
        basicProps.hauteur = obj.hauteur;
        basicProps.elevationSol = obj.elevationSol;
      } else if (obj.customType === 'citerne' || obj.customType === 'caisson-eau') {
        basicProps.diametre = obj.diametre;
        basicProps.longueur = obj.longueur;
        basicProps.elevationSol = obj.elevationSol;
      } else if (obj.customType === 'arbre-a-planter' || obj.customType === 'arbre-existant') {
        basicProps.arbreData = obj.arbreData;
        basicProps.tailles = obj.tailles;
        basicProps.hauteur = obj.hauteur;
        basicProps.envergure = obj.envergure;
      }

      // Supprimer les propriétés undefined/null
      Object.keys(basicProps).forEach(key => {
        if (basicProps[key] === undefined || basicProps[key] === null) {
          delete basicProps[key];
        }
      });

      return basicProps;
    })
  };

  logger.info('CompleteLogger', `✅ ${objects.length} objets loggés`);
  console.log('📋 Données complètes du canvas:', data);
  
  return data;
};

/**
 * Exporter toutes les données du canvas en JSON
 * @param {fabric.Canvas} canvas - Canvas Fabric.js
 * @param {number} echelle - Échelle du plan
 */
export const exportCompleteData = (canvas, echelle) => {
  const data = logAllCanvasObjects(canvas, echelle);
  
  if (!data) return;
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `plan-complet-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  logger.info('CompleteLogger', '✅ Export complet téléchargé');
};
