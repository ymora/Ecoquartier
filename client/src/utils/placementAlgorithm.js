/**
 * Algorithme de placement automatique d'arbres
 * Calculs mathématiques purs - AUCUNE IA
 */

/**
 * Calcule la distance euclidienne entre deux points
 */
export function calculerDistance(point1, point2) {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calcule la distance minimale d'un point à une ligne
 */
export function calculerDistanceLigne(point, ligne) {
  const { x1, y1, x2, y2 } = ligne;
  const A = point.x - x1;
  const B = point.y - y1;
  const C = x2 - x1;
  const D = y2 - y1;
  
  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  
  if (lenSq !== 0) {
    param = dot / lenSq;
  }
  
  let xx, yy;
  
  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }
  
  const dx = point.x - xx;
  const dy = point.y - yy;
  
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calcule la distance minimale d'un point à un rectangle
 */
export function calculerDistanceRectangle(point, rectangle) {
  const { left, top, width, height } = rectangle;
  const right = left + width;
  const bottom = top + height;
  
  const dx = Math.max(left - point.x, 0, point.x - right);
  const dy = Math.max(top - point.y, 0, point.y - bottom);
  
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calcule l'exposition solaire d'un point (simplifié)
 */
export function calculerExposition(point, plan, orientation = 'nord-haut') {
  // Vérifier si le point est à l'ombre de la maison
  if (!plan.maison) return 'plein-soleil';
  
  const maison = plan.maison;
  const estAuSud = point.y > maison.top + maison.height;
  const estAuNord = point.y < maison.top;
  const estAEst = point.x > maison.left + maison.width;
  const estAOuest = point.x < maison.left;
  
  // Selon orientation (simplifié)
  if (orientation === 'nord-haut') {
    if (estAuSud) return 'plein-soleil'; // Sud = plein soleil
    if (estAEst || estAOuest) return 'mi-ombre';
    if (estAuNord) return 'ombre';
  }
  
  return 'mi-ombre';
}

/**
 * Extrait la valeur numérique minimale d'une chaîne (ex: "5-6 m" → 5)
 */
export function extraireDistanceMin(str) {
  if (!str) return 0;
  const match = str.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

/**
 * Évalue un point pour le placement d'un arbre
 * Retourne un score de 0 à 100
 */
export function evaluerPoint(point, plan, arbre) {
  let score = 100;
  const raisons = [];
  const alertes = [];
  
  // 1. Distance aux limites du terrain (voisinage)
  const distanceVoisinMin = extraireDistanceMin(arbre.reglementation?.distancesLegales?.voisinage?.distance);
  
  const distNord = point.y;
  const distSud = plan.hauteur - point.y;
  const distOuest = point.x;
  const distEst = plan.largeur - point.x;
  
  const distMinLimite = Math.min(distNord, distSud, distOuest, distEst);
  
  if (distMinLimite < distanceVoisinMin) {
    return { score: 0, raisons: ['❌ Trop proche de la limite de propriété'], alertes, eliminatoire: true };
  } else if (distMinLimite < distanceVoisinMin + 1) {
    score -= 20;
    alertes.push(`⚠️ Proche de la limite (${distMinLimite.toFixed(1)}m, min ${distanceVoisinMin}m)`);
  } else {
    raisons.push(`✅ Distance limite: ${distMinLimite.toFixed(1)}m (min ${distanceVoisinMin}m)`);
  }
  
  // 2. Distance à la maison (fondations)
  if (plan.maison) {
    const distFondations = calculerDistanceRectangle(point, plan.maison);
    const distFondationsMin = extraireDistanceMin(arbre.reglementation?.distancesLegales?.infrastructures?.fondations);
    
    if (distFondations < distFondationsMin) {
      return { score: 0, raisons: ['❌ Trop proche des fondations'], alertes, eliminatoire: true };
    } else if (distFondations < distFondationsMin + 2) {
      score -= 15;
      alertes.push(`⚠️ Proche de la maison (${distFondations.toFixed(1)}m, min ${distFondationsMin}m)`);
    } else {
      raisons.push(`✅ Distance fondations: ${distFondations.toFixed(1)}m (min ${distFondationsMin}m)`);
    }
  }
  
  // 3. Distance aux canalisations
  if (plan.canalisations && plan.canalisations.length > 0) {
    const distCanalisationsMin = extraireDistanceMin(arbre.reglementation?.distancesLegales?.infrastructures?.canalisations);
    
    for (const canal of plan.canalisations) {
      const distCanal = calculerDistanceLigne(point, canal);
      
      if (distCanal < distCanalisationsMin) {
        return { score: 0, raisons: ['❌ Trop proche d\'une canalisation'], alertes, eliminatoire: true };
      } else if (distCanal < distCanalisationsMin + 1) {
        score -= 25;
        alertes.push(`⚠️ Proche canalisation (${distCanal.toFixed(1)}m, min ${distCanalisationsMin}m)`);
      }
    }
    
    raisons.push(`✅ Distance canalisations respectée`);
  }
  
  // 4. Distance aux autres arbres existants
  if (plan.arbresExistants && plan.arbresExistants.length > 0) {
    const distEntreArbresMin = extraireDistanceMin(arbre.reglementation?.distancesLegales?.entreArbres?.distance) || 5;
    
    for (const autreArbre of plan.arbresExistants) {
      const distArbre = calculerDistance(point, { x: autreArbre.left, y: autreArbre.top });
      
      if (distArbre < distEntreArbresMin) {
        score -= 30;
        alertes.push(`⚠️ Proche d'un arbre existant (${distArbre.toFixed(1)}m, min ${distEntreArbresMin}m)`);
      }
    }
  }
  
  // 5. Exposition solaire
  const exposition = calculerExposition(point, plan, plan.orientation);
  const expositionRequise = arbre.exposition || '';
  
  if (expositionRequise.toLowerCase().includes('soleil')) {
    if (exposition === 'plein-soleil') {
      score += 15;
      raisons.push('☀️ Exposition plein soleil (optimal)');
    } else if (exposition === 'mi-ombre') {
      score -= 5;
      alertes.push('⚠️ Exposition mi-ombre (acceptable)');
    } else {
      score -= 20;
      alertes.push('⚠️ Zone ombragée (non optimal)');
    }
  }
  
  // 6. Espace disponible pour l'envergure
  const envergureMax = extraireDistanceMin(arbre.envergure?.split('-')[1] || arbre.envergure) || 5;
  const rayonNecessaire = envergureMax / 2;
  
  // Vérifier si l'envergure ne déborde pas du terrain
  if (point.x - rayonNecessaire < 0 || point.x + rayonNecessaire > plan.largeur ||
      point.y - rayonNecessaire < 0 || point.y + rayonNecessaire > plan.hauteur) {
    score -= 15;
    alertes.push('⚠️ Envergure déborde du terrain');
  } else {
    raisons.push(`✅ Espace suffisant pour envergure (${envergureMax}m)`);
  }
  
  return { score: Math.max(0, score), raisons, alertes, eliminatoire: false };
}

/**
 * Trouve les meilleurs emplacements pour un ou plusieurs arbres
 */
export function trouverEmplacementsOptimaux(plan, arbres, options = {}) {
  const {
    pasGrille = 0.5, // Précision de la grille en mètres
    nombreSuggestions = 5
  } = options;
  
  const suggestions = [];
  
  // Créer une grille et évaluer chaque point
  for (let x = 0; x <= plan.largeur; x += pasGrille) {
    for (let y = 0; y <= plan.hauteur; y += pasGrille) {
      const point = { x, y };
      
      // Pour l'instant, on ne gère qu'un seul arbre
      const arbre = arbres[0];
      const evaluation = evaluerPoint(point, plan, arbre);
      
      if (evaluation.score > 0 && !evaluation.eliminatoire) {
        suggestions.push({
          x,
          y,
          score: evaluation.score,
          raisons: evaluation.raisons,
          alertes: evaluation.alertes
        });
      }
    }
  }
  
  // Trier par score décroissant
  suggestions.sort((a, b) => b.score - a.score);
  
  // Éviter les suggestions trop proches les unes des autres
  const suggestionsFiltrees = [];
  const distanceMinEntreSuggestions = 3; // 3 mètres minimum
  
  for (const suggestion of suggestions) {
    const tropProche = suggestionsFiltrees.some(s => 
      calculerDistance(suggestion, s) < distanceMinEntreSuggestions
    );
    
    if (!tropProche) {
      suggestionsFiltrees.push(suggestion);
    }
    
    if (suggestionsFiltrees.length >= nombreSuggestions) {
      break;
    }
  }
  
  return suggestionsFiltrees;
}

