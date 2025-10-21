/**
 * validationAdapter.js
 * 🔌 Adaptateurs pour collecter les critères de validation depuis 2D ou 3D
 * Garantit que les mêmes critères sont collectés dans les deux modes
 */

import { calculerDistanceRectangle, calculerDistanceLigne, calculerDistanceCercle } from '../canvas/canvasHelpers';
import { extraireDistancesMin, calculerDistanceMinEntreArbres } from './validationCore';

/**
 * Collecter tous les critères de validation pour un arbre en 2D (Fabric.js)
 * @param {Object} arbreGroup - Groupe Fabric.js de l'arbre
 * @param {Object} canvas - Canvas Fabric.js
 * @param {number} echelle - Échelle pixels par mètre
 * @returns {Array<CritereValidation>} Liste des critères à valider
 */
export function collecterCriteres2D(arbreGroup, canvas, echelle) {
  const arbre = arbreGroup.arbreData;
  if (!arbre) return [];
  
  const distances = extraireDistancesMin(arbre);
  const criteres = [];
  
  const x = arbreGroup.left;
  const y = arbreGroup.top;
  
  // 1. 🏠 Vérifier maison/fondations
  const maison = canvas.getObjects().find(obj => obj.customType === 'maison');
  if (maison) {
    const distMaison = calculerDistanceRectangle(x, y, maison) / echelle;
    const profondeurFondations = maison.profondeurFondations || 1.2;
    
    criteres.push({
      type: 'maison',
      distance: distMaison,
      distanceMin: distances.fondations,
      icone: '🏠',
      label: 'fondations',
      metadata: {
        profondeurRacines: distances.profondeurRacines,
        profondeurObjet: profondeurFondations
      }
    });
  }
  
  // 2. 🚰 Vérifier canalisations
  const canalisations = canvas.getObjects().filter(obj => obj.customType === 'canalisation');
  for (const canal of canalisations) {
    const distCanal = calculerDistanceLigne(x, y, canal) / echelle;
    const profondeurCanal = canal.profondeur || 0.6;
    
    criteres.push({
      type: 'canalisation',
      distance: distCanal,
      distanceMin: distances.canalisations,
      icone: '🚰',
      label: 'canalisation',
      metadata: {
        profondeurRacines: distances.profondeurRacines,
        profondeurObjet: profondeurCanal
      }
    });
  }
  
  // 3. ⚖️ Vérifier clôtures/limites (distance légale voisinage)
  const clotures = canvas.getObjects().filter(obj => obj.customType === 'cloture');
  const diametreTronc = 0.15; // 15cm estimation
  const rayonTronc = diametreTronc / 2;
  
  for (const cloture of clotures) {
    const distCloture = calculerDistanceLigne(x, y, cloture) / echelle;
    
    criteres.push({
      type: 'cloture',
      distance: distCloture,
      distanceMin: distances.cloture,
      icone: '⚖️',
      label: 'légal (CC Art.671)',
      metadata: {
        rayonTronc
      }
    });
  }
  
  // 4. 💧 Vérifier citernes/fosses septiques
  const citernes = canvas.getObjects().filter(obj => obj.customType === 'citerne');
  for (const citerne of citernes) {
    const distCiterne = calculerDistanceCercle(x, y, citerne) / echelle;
    const profondeurCiterne = citerne.profondeur || 2.5;
    
    criteres.push({
      type: 'citerne',
      distance: distCiterne,
      distanceMin: distances.fossesSeptiques,
      icone: '💧',
      label: 'citerne/fosse',
      metadata: {
        profondeurRacines: distances.profondeurRacines,
        profondeurObjet: profondeurCiterne
      }
    });
  }
  
  // 5. 🟩 Vérifier terrasses/pavés
  // Ajustement : +1m si racines agressives
  const terrasses = canvas.getObjects().filter(obj => obj.customType === 'paves' || obj.customType === 'terrasse');
  const distMinTerrasse = (distances.systemeRacinaire === 'Élevée' || distances.systemeRacinaire === 'Forte') 
    ? distances.terrasse + 1 
    : distances.terrasse;
  
  for (const terrasse of terrasses) {
    const distTerrasse = calculerDistanceRectangle(x, y, terrasse) / echelle;
    
    criteres.push({
      type: 'terrasse',
      distance: distTerrasse,
      distanceMin: distMinTerrasse,
      icone: '🟩',
      label: 'pavés/terrasse',
      metadata: {}
    });
  }
  
  // 6. 🌳 Vérifier autres arbres (CONTRAINTE BIDIRECTIONNELLE)
  const autresArbres = canvas.getObjects().filter(obj => 
    (obj.customType === 'arbre-a-planter' || obj.customType === 'arbre-existant') && obj !== arbreGroup
  );
  
  for (const autreArbre of autresArbres) {
    const dx = (x - autreArbre.left) / echelle;
    const dy = (y - autreArbre.top) / echelle;
    const distArbre = Math.sqrt(dx * dx + dy * dy);
    
    // Prendre la distance LA PLUS GRANDE des deux arbres (contrainte la plus stricte)
    const autreArbreData = autreArbre.arbreData || { reglementation: {} };
    const distanceMinApplicable = calculerDistanceMinEntreArbres(arbre, autreArbreData);
    
    criteres.push({
      type: 'arbre',
      distance: distArbre,
      distanceMin: distanceMinApplicable,
      icone: '🌳',
      label: 'autre arbre',
      metadata: {
        autreArbreNom: autreArbreData.name || 'Arbre existant'
      }
    });
  }
  
  return criteres;
}

/**
 * Collecter tous les critères de validation pour un arbre en 3D (Three.js)
 * IDENTIQUE à 2D mais avec des données 3D
 * 
 * @param {Object} arbreData - Données de l'arbre
 * @param {Array} position - Position [x, y, z] de l'arbre
 * @param {number} arbreIndex - Index de l'arbre dans le tableau
 * @param {Array} tousLesArbres - Liste de tous les arbres avec {position, arbreData}
 * @param {Object} maison - Objet maison {position, largeur, profondeur, profondeurFondations}
 * @param {Array} canalisations - Liste des canalisations {x1, y1, x2, y2, profondeur}
 * @param {Array} citernes - Liste des citernes {position, largeur, profondeur}
 * @param {Array} clotures - Liste des clôtures {x1, y1, x2, y2}
 * @param {Array} terrasses - Liste des terrasses (non utilisé en 3D pour l'instant)
 * @returns {Array<CritereValidation>} Liste des critères à valider
 */
export function collecterCriteres3D(arbreData, position, arbreIndex, tousLesArbres, maison, canalisations, citernes, clotures, terrasses) {
  if (!arbreData) return [];
  
  const distances = extraireDistancesMin(arbreData);
  const criteres = [];
  
  const x = position[0];
  const z = position[2];
  
  // 1. 🏠 Vérifier maison
  if (maison) {
    const distMaison = Math.sqrt(
      Math.pow(x - (maison.position[0] + maison.largeur / 2), 2) +
      Math.pow(z - (maison.position[2] + maison.profondeur / 2), 2)
    );
    const distMaisonBord = distMaison - Math.max(maison.largeur, maison.profondeur) / 2;
    const profondeurFondations = maison.profondeurFondations || 1.2;
    
    criteres.push({
      type: 'maison',
      distance: Math.max(0, distMaisonBord), // Éviter les valeurs négatives
      distanceMin: distances.fondations,
      icone: '🏠',
      label: 'fondations',
      metadata: {
        profondeurRacines: distances.profondeurRacines,
        profondeurObjet: profondeurFondations
      }
    });
  }
  
  // 2. 🚰 Vérifier canalisations
  (canalisations || []).forEach(canal => {
    const distCanal = distancePointLigne3D(x, z, canal.x1, canal.y1, canal.x2, canal.y2);
    const profondeurCanal = canal.profondeur || 0.6;
    
    criteres.push({
      type: 'canalisation',
      distance: distCanal,
      distanceMin: distances.canalisations,
      icone: '🚰',
      label: 'canalisation',
      metadata: {
        profondeurRacines: distances.profondeurRacines,
        profondeurObjet: profondeurCanal
      }
    });
  });
  
  // 3. 💧 Vérifier citernes
  (citernes || []).forEach(citerne => {
    const distCiterne = Math.sqrt(
      Math.pow(x - citerne.position[0], 2) +
      Math.pow(z - citerne.position[2], 2)
    ) - (citerne.largeur / 2);
    const profondeurCiterne = citerne.profondeur || 2.5;
    
    criteres.push({
      type: 'citerne',
      distance: Math.max(0, distCiterne), // Éviter les valeurs négatives
      distanceMin: distances.fossesSeptiques,
      icone: '💧',
      label: 'citerne/fosse',
      metadata: {
        profondeurRacines: distances.profondeurRacines,
        profondeurObjet: profondeurCiterne
      }
    });
  });
  
  // 4. ⚖️ Vérifier clôtures
  (clotures || []).forEach(cloture => {
    const distCloture = distancePointLigne3D(x, z, cloture.x1, cloture.y1, cloture.x2, cloture.y2);
    const rayonTronc = 0.075; // 7.5cm
    
    criteres.push({
      type: 'cloture',
      distance: distCloture,
      distanceMin: distances.cloture,
      icone: '⚖️',
      label: 'légal',
      metadata: {
        rayonTronc
      }
    });
  });
  
  // 5. 🌳 Vérifier autres arbres (CONTRAINTE BIDIRECTIONNELLE)
  tousLesArbres.forEach((autreArbre, idx) => {
    if (idx === arbreIndex) return; // Ignorer soi-même
    
    const distArbre = Math.sqrt(
      Math.pow(x - autreArbre.position[0], 2) +
      Math.pow(z - autreArbre.position[2], 2)
    );
    
    // Prendre la distance LA PLUS GRANDE des deux arbres (contrainte la plus stricte)
    const autreArbreData = autreArbre.arbreData || { reglementation: {} };
    const distanceMinApplicable = calculerDistanceMinEntreArbres(arbreData, autreArbreData);
    
    criteres.push({
      type: 'arbre',
      distance: distArbre,
      distanceMin: distanceMinApplicable,
      icone: '🌳',
      label: 'autre arbre',
      metadata: {
        autreArbreNom: autreArbreData.name || 'Arbre existant'
      }
    });
  });
  
  return criteres;
}

/**
 * Calculer la distance d'un point à une ligne en 3D (plan XZ)
 * @param {number} px - Position X du point
 * @param {number} pz - Position Z du point
 * @param {number} x1 - Position X du point 1 de la ligne
 * @param {number} z1 - Position Z du point 1 de la ligne
 * @param {number} x2 - Position X du point 2 de la ligne
 * @param {number} z2 - Position Z du point 2 de la ligne
 * @returns {number} Distance en mètres
 */
function distancePointLigne3D(px, pz, x1, z1, x2, z2) {
  const A = px - x1;
  const B = pz - z1;
  const C = x2 - x1;
  const D = z2 - z1;
  
  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  
  if (lenSq !== 0) param = dot / lenSq;
  
  let xx, zz;
  
  if (param < 0) {
    xx = x1;
    zz = z1;
  } else if (param > 1) {
    xx = x2;
    zz = z2;
  } else {
    xx = x1 + param * C;
    zz = z1 + param * D;
  }
  
  const dx = px - xx;
  const dz = pz - zz;
  
  return Math.sqrt(dx * dx + dz * dz);
}
