/**
 * diagnosticSync.js
 * Outil de diagnostic pour vérifier la synchronisation 2D↔3D
 */

import { ECHELLE_PIXELS_PAR_METRE } from '../../config/constants';
import logger from '../logger';

/**
 * Diagnostiquer la synchronisation des positions
 */
export const diagnostiquerSynchronisation = (canvas, data3D) => {
  if (!canvas || !data3D) return;
  
  const echelle = ECHELLE_PIXELS_PAR_METRE;
  const resultats = {
    echelle,
    objets: [],
    problemes: []
  };
  
  // Vérifier les maisons
  const maisons2D = canvas.getObjects().filter(o => o.customType === 'maison');
  const maisons3D = data3D.maisons || [];
  
  logger.info('Diagnostic', `📊 Comparaison 2D↔3D`, {
    maisons2D: maisons2D.length,
    maisons3D: maisons3D.length
  });
  
  // Comparer chaque maison 2D avec son équivalent 3D
  maisons2D.forEach((maison2D, idx) => {
    if (!maisons3D[idx]) {
      resultats.problemes.push(`Maison 2D #${idx} n'a pas d'équivalent en 3D`);
      return;
    }
    
    const maison3D = maisons3D[idx];
    
    // Position 2D (pixels)
    const left2D = maison2D.left;
    const top2D = maison2D.top;
    
    // Position 3D (mètres)
    const posX_3D = maison3D.position[0];
    const posZ_3D = maison3D.position[2];
    
    // Conversion 2D→3D
    const posX_converti = left2D / echelle;
    const posZ_converti = top2D / echelle;
    
    // Conversion 3D→2D
    const left_converti = posX_3D * echelle;
    const top_converti = posZ_3D * echelle;
    
    // Différences
    const diffX_m = Math.abs(posX_converti - posX_3D);
    const diffZ_m = Math.abs(posZ_converti - posZ_3D);
    const diffLeft_px = Math.abs(left2D - left_converti);
    const diffTop_px = Math.abs(top2D - top_converti);
    
    const objet = {
      type: 'maison',
      index: idx,
      '2D_pixels': { left: left2D, top: top2D },
      '3D_metres': { x: posX_3D, z: posZ_3D },
      '2D→3D_converti': { x: posX_converti, z: posZ_converti },
      '3D→2D_converti': { left: left_converti, top: top_converti },
      differences: {
        metres: { x: diffX_m.toFixed(3), z: diffZ_m.toFixed(3) },
        pixels: { left: diffLeft_px.toFixed(1), top: diffTop_px.toFixed(1) }
      }
    };
    
    resultats.objets.push(objet);
    
    // Détecter problèmes (tolérance : 0.1m = 3px)
    if (diffX_m > 0.1 || diffZ_m > 0.1) {
      resultats.problemes.push(
        `⚠️ Maison #${idx}: Écart ${diffX_m.toFixed(2)}m X, ${diffZ_m.toFixed(2)}m Z`
      );
    }
    
    logger.info('Diagnostic', `Maison #${idx}`, objet);
  });
  
  // Vérifier les arbres
  const arbres2D = canvas.getObjects().filter(o => o.customType === 'arbre-a-planter');
  const arbres3D = data3D.arbres || [];
  
  logger.info('Diagnostic', `🌳 Arbres`, {
    arbres2D: arbres2D.length,
    arbres3D: arbres3D.length
  });
  
  arbres2D.forEach((arbre2D, idx) => {
    if (!arbres3D[idx]) {
      resultats.problemes.push(`Arbre 2D #${idx} n'a pas d'équivalent en 3D`);
      return;
    }
    
    const arbre3D = arbres3D[idx];
    
    const left2D = arbre2D.left;
    const top2D = arbre2D.top;
    const posX_3D = arbre3D.position[0];
    const posZ_3D = arbre3D.position[2];
    
    const posX_converti = left2D / echelle;
    const posZ_converti = top2D / echelle;
    
    const diffX_m = Math.abs(posX_converti - posX_3D);
    const diffZ_m = Math.abs(posZ_converti - posZ_3D);
    
    if (diffX_m > 0.1 || diffZ_m > 0.1) {
      resultats.problemes.push(
        `⚠️ Arbre #${idx}: Écart ${diffX_m.toFixed(2)}m X, ${diffZ_m.toFixed(2)}m Z`
      );
    }
    
    logger.info('Diagnostic', `Arbre #${idx}`, {
      '2D': { left: left2D, top: top2D },
      '3D': { x: posX_3D, z: posZ_3D },
      diff: { x: diffX_m.toFixed(3), z: diffZ_m.toFixed(3) }
    });
  });
  
  // Résumé
  if (resultats.problemes.length === 0) {
    logger.info('Diagnostic', '✅ Synchronisation 2D↔3D parfaite !');
  } else {
    logger.warn('Diagnostic', `⚠️ ${resultats.problemes.length} problème(s) détecté(s):`);
    resultats.problemes.forEach(p => logger.warn('Diagnostic', p));
  }
  
  return resultats;
};

