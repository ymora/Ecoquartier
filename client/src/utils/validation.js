/**
 * Logique de validation centralisée
 * Séparation des règles métier pour faciliter maintenance
 */

import { MESSAGES_LEGAUX, TRONC } from '../config/planificateurConfig';

/**
 * Extrait les distances minimales des données de réglementation
 */
export const extraireDistances = (arbre) => {
  const reglementation = arbre.reglementation || {};
  const distancesLegales = reglementation.distancesLegales || {};
  const infrastructures = distancesLegales.infrastructures || {};
  const voisinage = distancesLegales.voisinage || {};
  
  return {
    fondations: parseFloat(infrastructures.fondations?.split('m')[0] || '5'),
    canalisations: parseFloat(infrastructures.canalisations?.split('m')[0] || '4'),
    cloture: parseFloat(voisinage.distance?.split('m')[0] || '2'),
    fossesSeptiques: parseFloat(infrastructures.fossesSeptiques?.split('m')[0] || '6'),
    piscine: parseFloat(infrastructures.piscine?.split('m')[0] || '4'),
    terrasse: parseFloat(infrastructures.terrasse?.split('m')[0] || '3'),
    entreArbres: parseFloat(distancesLegales.entreArbres?.distance?.split('m')[0] || '5')
  };
};

/**
 * Extrait les informations de profondeur
 */
export const extraireProfondeurs = (arbre) => {
  const profondeurStr = arbre.reglementation?.systemeRacinaire?.profondeur || '1-1.5 m';
  const values = profondeurStr.match(/(\d+(?:\.\d+)?)/g) || ['1', '1.5'];
  const profondeurMin = parseFloat(values[0]);
  const profondeurMax = values.length > 1 ? parseFloat(values[1]) : profondeurMin;
  
  return {
    min: profondeurMin,
    max: profondeurMax,
    moyenne: (profondeurMin + profondeurMax) / 2
  };
};

/**
 * Valide la distance par rapport aux fondations (3D)
 */
export const validerFondations = (arbre, distanceActuelle, profondeurRacines, profondeurFondations, echelle) => {
  const distances = extraireDistances(arbre);
  const distanceMetres = distanceActuelle / echelle;
  
  const problemes = [];
  const avertissements = [];
  
  // Validation 3D : profondeur
  if (profondeurRacines > profondeurFondations && distanceMetres < distances.fondations) {
    problemes.push(
      `🏠 CRITIQUE: Racines (${profondeurRacines}m) dépassent fondations (${profondeurFondations}m) à ${distanceMetres.toFixed(1)}m`
    );
  }
  
  // Validation horizontale
  if (distanceMetres < distances.fondations) {
    problemes.push(
      `🏠 Trop près des fondations (${distanceMetres.toFixed(1)}m < ${distances.fondations}m minimum)`
    );
  } else if (distanceMetres < distances.fondations + 0.5) {
    avertissements.push(
      `🏠 Proche fondations (${distanceMetres.toFixed(1)}m)`
    );
  }
  
  return { problemes, avertissements };
};

/**
 * Valide la distance par rapport aux canalisations (3D)
 */
export const validerCanalisations = (arbre, distanceActuelle, profondeurRacines, profondeurCanalisation, echelle) => {
  const distances = extraireDistances(arbre);
  const distanceMetres = distanceActuelle / echelle;
  
  const problemes = [];
  const avertissements = [];
  
  // Validation 3D
  if (profondeurRacines > profondeurCanalisation && distanceMetres < distances.canalisations) {
    problemes.push(
      `🚰 CRITIQUE: Racines (${profondeurRacines}m) dépassent canalisation (${profondeurCanalisation}m) - Risque colmatage`
    );
  }
  
  // Validation horizontale
  if (distanceMetres < distances.canalisations) {
    problemes.push(
      `🚰 Trop près canalisation (${distanceMetres.toFixed(1)}m < ${distances.canalisations}m)`
    );
  } else if (distanceMetres < distances.canalisations + 0.5) {
    avertissements.push(
      `🚰 Proche canalisation (${distanceMetres.toFixed(1)}m)`
    );
  }
  
  return { problemes, avertissements };
};

/**
 * Valide la distance légale voisinage (clôtures)
 */
export const validerVoisinage = (arbre, distanceActuelle, echelle) => {
  const distances = extraireDistances(arbre);
  const distanceMetres = distanceActuelle / echelle;
  const rayonTronc = TRONC.diametreDefaut / 2;
  
  const problemes = [];
  const avertissements = [];
  
  // Le tronc ne doit pas dépasser la limite
  if (distanceMetres < rayonTronc) {
    problemes.push(MESSAGES_LEGAUX.troncDepasse(distanceMetres, rayonTronc));
  }
  // Distance légale non respectée
  else if (distanceMetres < distances.cloture) {
    const articleLoi = arbre.reglementation?.distancesLegales?.voisinage?.regle || 'Code Civil Art. 671';
    const sanction = arbre.reglementation?.distancesLegales?.voisinage?.sanction || 'Voisin peut exiger arrachage';
    problemes.push(MESSAGES_LEGAUX.distanceVoisinage(distanceMetres, distances.cloture, articleLoi, sanction));
  }
  // Proche de la limite
  else if (distanceMetres < distances.cloture + 0.5) {
    avertissements.push(MESSAGES_LEGAUX.procheVoisinage(distanceMetres, distances.cloture));
  }
  
  return { problemes, avertissements };
};

/**
 * Valide la distance par rapport aux citernes/fosses (3D)
 */
export const validerCiterne = (arbre, distanceActuelle, profondeurRacines, profondeurCiterne, echelle) => {
  const distances = extraireDistances(arbre);
  const distanceMetres = distanceActuelle / echelle;
  
  const problemes = [];
  const avertissements = [];
  
  // Validation 3D critique
  if (profondeurRacines > profondeurCiterne && distanceMetres < distances.fossesSeptiques) {
    problemes.push(
      `💧 DANGER: Racines (${profondeurRacines}m) atteignent citerne (${profondeurCiterne}m) - Risque contamination`
    );
  }
  
  // Validation horizontale
  if (distanceMetres < distances.fossesSeptiques) {
    problemes.push(
      `💧 Trop près citerne/fosse (${distanceMetres.toFixed(1)}m < ${distances.fossesSeptiques}m)`
    );
  } else if (distanceMetres < distances.fossesSeptiques + 1) {
    avertissements.push(
      `💧 Proche fosse septique (${distanceMetres.toFixed(1)}m)`
    );
  }
  
  return { problemes, avertissements };
};

/**
 * Valide la compatibilité avec la composition du sol
 */
export const validerSol = (arbre, couchesSol) => {
  const problemes = [];
  const avertissements = [];
  
  if (!couchesSol || couchesSol.length === 0) return { problemes, avertissements };
  
  const profondeurRacines = extraireProfondeurs(arbre);
  const profondeurTotale = couchesSol.reduce((sum, c) => sum + c.profondeur, 0);
  
  // Vérifier profondeur suffisante
  if (profondeurRacines.max * 100 > profondeurTotale) {
    avertissements.push(
      `📊 Sol peu profond (${profondeurTotale}cm) pour racines (${(profondeurRacines.max * 100).toFixed(0)}cm)`
    );
  }
  
  // Vérifier type de sol
  const solPrincipal = couchesSol[0]?.type;
  const phArbre = arbre.sol?.ph;
  
  if (solPrincipal === 'calcaire' && phArbre?.includes('acide')) {
    avertissements.push(
      `📊 Incompatibilité pH : arbre préfère sol acide, terrain calcaire`
    );
  }
  
  if (solPrincipal === 'rocheux') {
    problemes.push(
      `📊 Sol rocheux inadapté aux racines pivotantes`
    );
  }
  
  return { problemes, avertissements };
};

/**
 * Détermine le statut de validation global
 */
export const determinerStatut = (problemes, avertissements) => {
  if (problemes.length > 0) return 'error';
  if (avertissements.length > 0) return 'warning';
  return 'ok';
};

/**
 * Génère un message résumé de validation
 */
export const genererResume = (problemes, avertissements) => {
  if (problemes.length === 0 && avertissements.length === 0) {
    return '✅ Emplacement conforme';
  }
  
  if (problemes.length > 0) {
    return `❌ ${problemes.length} problème${problemes.length > 1 ? 's' : ''}`;
  }
  
  return `⚠️ ${avertissements.length} avertissement${avertissements.length > 1 ? 's' : ''}`;
};

