/**
 * validationCore.js
 * 🎯 SYSTÈME DE VALIDATION UNIFIÉ 2D/3D
 * 
 * Logique pure sans dépendances - Garantit la cohérence totale
 * Basé sur 4 paliers de couleurs selon le pourcentage le plus critique
 */

/**
 * Critère de validation individuel
 * @typedef {Object} CritereValidation
 * @property {string} type - Type ('maison', 'canalisation', 'cloture', 'citerne', 'terrasse', 'arbre')
 * @property {number} distance - Distance réelle mesurée (mètres)
 * @property {number} distanceMin - Distance minimale requise (mètres)
 * @property {string} icone - Icône pour le message (🏠, 🚰, ⚖️, 💧, 🟩, 🌳)
 * @property {string} label - Label descriptif
 * @property {Object} [metadata] - Métadonnées additionnelles
 */

/**
 * Valider un arbre contre tous les critères
 * Retourne le pourcentage le plus critique et les messages
 * 
 * @param {Object} arbreData - Données de l'arbre depuis arbustesData.js
 * @param {Array<CritereValidation>} criteres - Liste des critères à vérifier
 * @param {Object} [options] - Options additionnelles (couchesSol, orientation)
 * @returns {Object} { pourcentageMin, status, messages, conseils, pourcentageCritique }
 */
export function validerArbre(arbreData, criteres, options = {}) {
  let pourcentageMinGlobal = 100; // 100% = conforme
  const tousLesMessages = [];
  const conseils = [];
  
  // Vérifier chaque critère
  for (const critere of criteres) {
    const resultat = validerCritere(critere, arbreData);
    
    // Mettre à jour le pire pourcentage
    if (resultat.pourcentage !== null && resultat.pourcentage < pourcentageMinGlobal) {
      pourcentageMinGlobal = resultat.pourcentage;
      console.log(`🔍 Validation ${arbreData.name}: ${critere.type} → ${resultat.pourcentage.toFixed(0)}% (${critere.distance.toFixed(2)}m / ${critere.distanceMin}m requis)`);
    }
    
    // Ajouter le message si présent
    if (resultat.message) {
      tousLesMessages.push(resultat.message);
    }
  }
  
  // Ajouter des conseils basés sur les caractéristiques de l'arbre
  ajouterConseils(arbreData, conseils, options);
  
  // Déterminer le statut selon le pourcentage le plus critique
  const status = getStatusFromPourcentage(pourcentageMinGlobal);
  
  console.log(`🎨 ${arbreData.name}: Pourcentage global = ${pourcentageMinGlobal.toFixed(0)}% → Statut = ${status}`);
  
  // Message par défaut si tout est conforme
  const messages = tousLesMessages.length > 0 
    ? tousLesMessages 
    : ['✅ Position conforme à toutes les règles'];
  
  return {
    pourcentageMin: pourcentageMinGlobal,
    status,
    messages,
    conseils,
    pourcentageCritique: pourcentageMinGlobal // Pour traçabilité
  };
}

/**
 * Valider un critère individuel
 * @param {CritereValidation} critere
 * @param {Object} arbreData
 * @returns {Object} { pourcentage, message }
 */
function validerCritere(critere, arbreData) {
  const { type, distance, distanceMin, icone, label, metadata = {} } = critere;
  
  // Calculer le pourcentage de conformité
  const pourcentage = (distance / distanceMin) * 100;
  
  // CAS SPÉCIAL 1 : Racines atteignent l'objet (fondations, canalisations, citerne)
  if (metadata.profondeurRacines && metadata.profondeurObjet) {
    if (metadata.profondeurRacines > metadata.profondeurObjet && distance < distanceMin) {
      return {
        pourcentage: 0, // Critique absolu
        message: `${icone} Racines ${metadata.profondeurRacines.toFixed(1)}m > ${label} ${metadata.profondeurObjet.toFixed(1)}m (${distance.toFixed(1)}m)`
      };
    }
  }
  
  // CAS SPÉCIAL 2 : Tronc dépasse limite de propriété (illégal)
  if (type === 'cloture' && metadata.rayonTronc && distance < metadata.rayonTronc) {
    return {
      pourcentage: 0, // Critique absolu (illégal)
      message: `${icone} Tronc dépasse limite (${distance.toFixed(1)}m) ILLÉGAL`
    };
  }
  
  // Messages standards selon les 4 paliers
  if (pourcentage < 50) {
    // ROUGE FONCÉ : < 50% (critique)
    return {
      pourcentage,
      message: `${icone} ${distance.toFixed(1)}m CRITIQUE < ${distanceMin}m ${label}`
    };
  } else if (pourcentage < 75) {
    // ORANGE-ROUGE : 50-75% (erreur)
    return {
      pourcentage,
      message: `${icone} ${distance.toFixed(1)}m (${pourcentage.toFixed(0)}% de ${distanceMin}m ${label})`
    };
  } else if (pourcentage < 100) {
    // ORANGE-JAUNE : 75-100% (avertissement)
    return {
      pourcentage,
      message: `${icone} ${distance.toFixed(1)}m (${pourcentage.toFixed(0)}% de ${distanceMin}m ${label})`
    };
  } else {
    // VERT : ≥ 100% (conforme)
    return {
      pourcentage: 100,
      message: null // Pas de message si conforme
    };
  }
}

/**
 * Déterminer le statut selon le pourcentage
 * @param {number} pourcentage
 * @returns {string} 'critical' | 'error' | 'warning' | 'ok'
 */
function getStatusFromPourcentage(pourcentage) {
  if (pourcentage < 50) return 'critical';
  if (pourcentage < 75) return 'error';
  if (pourcentage < 100) return 'warning';
  return 'ok';
}

/**
 * Ajouter des conseils basés sur les caractéristiques de l'arbre
 * @param {Object} arbreData
 * @param {Array<string>} conseils
 * @param {Object} options
 */
function ajouterConseils(arbreData, conseils, options = {}) {
  const systemeRacinaire = arbreData.reglementation?.systemeRacinaire?.agressivite || 'Modérée';
  const exposition = arbreData.exposition || '';
  const arrosage = arbreData.arrosage || '';
  const solHumidite = arbreData.sol?.humidite || '';
  const orientation = options.orientation || 'nord-bas';
  
  // Conseil sur système racinaire agressif
  if (systemeRacinaire === 'Élevée' || systemeRacinaire === 'Forte') {
    conseils.push(`⚠️ Système racinaire ${systemeRacinaire.toLowerCase()} : privilégier éloignement maximal des infrastructures`);
  }
  
  // Conseil sur exposition soleil
  if (exposition.includes('Soleil') && orientation === 'nord-bas') {
    conseils.push(`☀️ Cet arbre aime le soleil : le placer au sud du terrain pour exposition maximale`);
  }
  
  // Conseil sur arrosage
  if (arrosage.includes('Régulier') || arrosage.includes('Abondant')) {
    conseils.push(`💧 Arrosage ${arrosage.split('.')[0].toLowerCase()} : éviter trop loin du point d'eau`);
  }
  
  // Conseil sur humidité du sol
  if (solHumidite.includes('Frais') || solHumidite.includes('Humide')) {
    conseils.push(`💧 Préfère sol frais : éviter zones sèches ou en hauteur`);
  }
  
  // Conseil sur compatibilité avec le sol (si fourni)
  if (options.couchesSol) {
    const profondeurRacines = parseFloat(arbreData.reglementation?.systemeRacinaire?.profondeur?.split('-')[0] || '1');
    const profondeurTerreVegetale = options.couchesSol[0].profondeur / 100; // cm → m
    const typeSolProfondeur = options.couchesSol[1].type;
    
    if (profondeurRacines > profondeurTerreVegetale) {
      if (typeSolProfondeur === 'calcaire' && arbreData.sol?.ph?.includes('acide')) {
        conseils.push(`🌍 Sol calcaire en profondeur (${options.couchesSol[1].profondeur}cm) : cet arbre préfère sol acide (pH ${arbreData.sol.ph})`);
      } else if (typeSolProfondeur === 'rocheux' && profondeurRacines > 1) {
        conseils.push(`⛰️ Sol rocheux à ${profondeurTerreVegetale}m : racines atteignent ${profondeurRacines}m (croissance limitée)`);
      } else if (typeSolProfondeur === 'argileux' && arbreData.sol?.type?.includes('drainé')) {
        conseils.push(`🌍 Sol argileux en profondeur : drainage peut être insuffisant pour cet arbre`);
      }
    }
    
    conseils.push(`🌍 Sol actuel : ${profondeurTerreVegetale}m de terre végétale, puis ${options.couchesSol[1].nom.toLowerCase()}`);
  }
}

/**
 * Extraire les distances minimales depuis les données d'un arbre
 * @param {Object} arbreData - Données de l'arbre
 * @returns {Object} Distances minimales et métadonnées
 */
export function extraireDistancesMin(arbreData) {
  const reglementation = arbreData?.reglementation || {};
  const distancesLegales = reglementation.distancesLegales || {};
  
  return {
    fondations: parseFloat(distancesLegales.infrastructures?.fondations?.split('m')[0] || '5'),
    canalisations: parseFloat(distancesLegales.infrastructures?.canalisations?.split('m')[0] || '4'),
    cloture: parseFloat(distancesLegales.voisinage?.distance?.split('m')[0] || '2'),
    entreArbres: parseFloat(distancesLegales.entreArbres?.distance?.split('m')[0] || '5'),
    terrasse: parseFloat(distancesLegales.infrastructures?.terrasse?.split('m')[0] || '3'),
    fossesSeptiques: parseFloat(distancesLegales.infrastructures?.fossesSeptiques?.split('m')[0] || '6'),
    profondeurRacines: parseFloat(reglementation.systemeRacinaire?.profondeur?.split('-')[0] || '1'),
    systemeRacinaire: reglementation.systemeRacinaire?.agressivite || 'Modérée'
  };
}

/**
 * Calculer la distance minimale applicable entre deux arbres
 * CONTRAINTE BIDIRECTIONNELLE : prend la distance la plus grande (plus stricte)
 * 
 * @param {Object} arbre1Data
 * @param {Object} arbre2Data
 * @returns {number} Distance minimale applicable
 */
export function calculerDistanceMinEntreArbres(arbre1Data, arbre2Data) {
  const dist1 = extraireDistancesMin(arbre1Data).entreArbres;
  const dist2 = extraireDistancesMin(arbre2Data).entreArbres;
  return Math.max(dist1, dist2); // Contrainte la plus stricte
}

/**
 * Déterminer les couleurs selon le statut
 * @param {string} status - 'critical', 'error', 'warning', 'ok'
 * @returns {Object} { fill, stroke, haloColor, haloColor2 }
 */
export function getCouleursPourStatut(status) {
  switch (status) {
    case 'critical':
      // ROUGE FONCÉ : < 50%
      return {
        fill: 'rgba(198, 40, 40, 0.5)',
        stroke: '#b71c1c',
        haloColor: '#b71c1c',
        haloColor2: '#c62828'
      };
    case 'error':
      // ORANGE-ROUGE : 50-75%
      return {
        fill: 'rgba(255, 87, 34, 0.45)',
        stroke: '#d84315',
        haloColor: '#ff5722',
        haloColor2: '#ff6f00'
      };
    case 'warning':
      // ORANGE-JAUNE : 75-100%
      return {
        fill: 'rgba(255, 193, 7, 0.4)',
        stroke: '#f57c00',
        haloColor: '#ffc107',
        haloColor2: '#ffb74d'
      };
    case 'ok':
    default:
      // VERT : ≥ 100%
      return {
        fill: 'rgba(129, 199, 132, 0.4)',
        stroke: '#2e7d32',
        haloColor: '#2e7d32',
        haloColor2: '#4caf50'
      };
  }
}

/**
 * Obtenir l'icône selon le statut
 * @param {string} status
 * @returns {string} Icône emoji
 */
export function getIconePourStatut(status) {
  switch (status) {
    case 'critical': return '🚫';
    case 'error': return '❌';
    case 'warning': return '⚠️';
    case 'ok': return '✅';
    default: return '✅';
  }
}
