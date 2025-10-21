/**
 * canvasValidation.js
 * Validation 2D avec le système centralisé
 * SIMPLIFIÉ : Utilise le système unifié depuis utils/validation
 */

import * as fabric from 'fabric';
import logger from '../logger';
import { calculerDistanceRectangle, trouverPointPlusProcheMaison, trouverPointPlusProcheLigne } from './canvasHelpers';
import { validerArbre2D, getCouleursPourStatut } from '../validation';

/**
 * Re-valider TOUS les arbres pour la validation globale
 * Appelé après TOUT déplacement (arbre, maison, canalisation, clôture, etc.)
 * SYSTÈME OPTIMISÉ : détecte tous les conflits d'un coup
 */
export const revaliderTousLesArbres = (canvas, echelle, couchesSol, orientation) => {
  const arbres = canvas.getObjects().filter(obj => 
    obj.customType === 'arbre-a-planter' || obj.customType === 'arbre-existant'
  );
  
  // PHASE 1 : Réinitialiser tous les arbres à 'ok' (vert)
  arbres.forEach(arbre => {
    const ellipse = arbre._objects ? arbre._objects[0] : null;
    if (ellipse) {
      const couleurs = getCouleursPourStatut('ok');
      ellipse.set({
        fill: couleurs.fill,
        stroke: couleurs.stroke
      });
      arbre.validationStatus = 'ok';
      arbre.validationMessages = [];
      arbre.validationConseils = [];
      arbre.pourcentageCritique = 100;
    }
  });
  
  // PHASE 2 : Valider chaque arbre et marquer les problèmes
  arbres.forEach(arbre => {
    validerPositionArbre(canvas, arbre, echelle, couchesSol, orientation);
  });
  
  canvas.renderAll();
};

/**
 * Valider la position d'un arbre et changer sa couleur
 * SIMPLIFIÉ : Utilise le système centralisé
 */
export const validerPositionArbre = (canvas, arbreGroup, echelle, couchesSol, orientation) => {
  try {
    const arbre = arbreGroup.arbreData;
    if (!arbre) {
      logger.warn('Validation', 'Arbre sans arbreData, validation ignorée');
      return;
    }
    
    // Utiliser le système centralisé de validation
    const resultat = validerArbre2D(arbreGroup, canvas, echelle, {
      couchesSol,
      orientation
    });
    
    // Appliquer les couleurs selon le statut
    const ellipse = arbreGroup._objects ? arbreGroup._objects[0] : null;
    if (!ellipse) {
      logger.error('Validation', `Impossible d'accéder à l'ellipse de ${arbre.name}`);
      return;
    }
    
    const couleurs = getCouleursPourStatut(resultat.status);
    ellipse.set({
      fill: couleurs.fill,
      stroke: couleurs.stroke
    });
    
    // Stocker les résultats sur l'arbre
    arbreGroup.validationStatus = resultat.status;
    arbreGroup.validationMessages = resultat.messages;
    arbreGroup.validationConseils = resultat.conseils;
    arbreGroup.pourcentageCritique = resultat.pourcentageMin;
    
    // Forcer le rendu du groupe
    arbreGroup.dirty = true;
    arbreGroup.setCoords();
    // Ne PAS appeler renderAll() ici - sera fait par revaliderTousLesArbres()
  } catch (error) {
    logger.error('Validation', 'Erreur lors de la validation:', error);
    // En cas d'erreur, mettre l'arbre en vert par défaut pour ne pas bloquer
    const ellipse = arbreGroup._objects ? arbreGroup._objects[0] : null;
    if (ellipse) {
      const couleurs = getCouleursPourStatut('ok');
      ellipse.set({
        fill: couleurs.fill,
        stroke: couleurs.stroke
      });
    }
  }
};

/**
 * Afficher les lignes de mesure pour les distances problématiques
 * INCHANGÉ : Logique d'affichage des lignes
 */
export const afficherLignesMesure = (canvas, arbreGroup, echelle) => {
  // Supprimer les anciennes lignes de mesure
  canvas.getObjects().filter(obj => obj.isLigneMesure).forEach(obj => canvas.remove(obj));
  
  const arbre = arbreGroup.arbreData;
  if (!arbre) return;
  
  const x = arbreGroup.left;
  const y = arbreGroup.top;
  
  // Extraire les distances minimales
  const distanceFondations = parseFloat(arbre.reglementation?.distancesLegales?.infrastructures?.fondations?.split('m')[0] || '5');
  const distanceCanalisations = parseFloat(arbre.reglementation?.distancesLegales?.infrastructures?.canalisations?.split('m')[0] || '4');
  const distanceCloture = parseFloat(arbre.reglementation?.distancesLegales?.voisinage?.distance?.split('m')[0] || '2');
  const distanceFosseSeptique = parseFloat(arbre.reglementation?.distancesLegales?.infrastructures?.fossesSeptiques?.split('m')[0] || '6');
  const distanceTerrasse = parseFloat(arbre.reglementation?.distancesLegales?.infrastructures?.terrasse?.split('m')[0] || '3');
  const distanceEntreArbres = parseFloat(arbre.reglementation?.distancesLegales?.entreArbres?.distance?.split('m')[0] || '5');
  const systemeRacinaire = arbre.reglementation?.systemeRacinaire?.agressivite || 'Modérée';
  
  // Vérifier maison
  const maison = canvas.getObjects().find(obj => obj.customType === 'maison');
  if (maison) {
    const distMaison = calculerDistanceRectangle(x, y, maison) / echelle;
    if (distMaison < distanceFondations) {
      const pointProche = trouverPointPlusProcheMaison(x, y, maison);
      ajouterLigneMesureProbleme(canvas, x, y, pointProche.x, pointProche.y, distMaison, distanceFondations, '🏠');
    }
  }
  
  // Vérifier canalisations
  const canalisations = canvas.getObjects().filter(obj => obj.customType === 'canalisation');
  for (const canal of canalisations) {
    const distCanal = calculerDistanceLigne(x, y, canal) / echelle;
    if (distCanal < distanceCanalisations) {
      const pointProche = trouverPointPlusProcheLigne(x, y, canal);
      ajouterLigneMesureProbleme(canvas, x, y, pointProche.x, pointProche.y, distCanal, distanceCanalisations, '🚰');
    }
  }
  
  // Vérifier clôtures
  const clotures = canvas.getObjects().filter(obj => obj.customType === 'cloture');
  for (const cloture of clotures) {
    const distCloture = calculerDistanceLigne(x, y, cloture) / echelle;
    if (distCloture < distanceCloture || distCloture < 0.15) {
      const pointProche = trouverPointPlusProcheLigne(x, y, cloture);
      const iconeLegal = distCloture < distanceCloture ? '⚖️' : '🚧';
      ajouterLigneMesureProbleme(canvas, x, y, pointProche.x, pointProche.y, distCloture, distanceCloture, iconeLegal);
    }
  }
  
  // Vérifier citernes
  const citernes = canvas.getObjects().filter(obj => obj.customType === 'citerne');
  for (const citerne of citernes) {
    const distCiterne = calculerDistanceRectangle(x, y, citerne) / echelle;
    if (distCiterne < distanceFosseSeptique) {
      const pointProche = trouverPointPlusProcheMaison(x, y, citerne);
      ajouterLigneMesureProbleme(canvas, x, y, pointProche.x, pointProche.y, distCiterne, distanceFosseSeptique, '💧');
    }
  }
  
  // Vérifier terrasses
  const terrasses = canvas.getObjects().filter(obj => obj.customType === 'paves' || obj.customType === 'terrasse');
  const distMinTerrasse = (systemeRacinaire === 'Élevée' || systemeRacinaire === 'Forte') 
    ? distanceTerrasse + 1 
    : distanceTerrasse;
  
  for (const terrasse of terrasses) {
    const distTer = calculerDistanceRectangle(x, y, terrasse) / echelle;
    if (distTer < distMinTerrasse) {
      const pointProche = trouverPointPlusProcheMaison(x, y, terrasse);
      ajouterLigneMesureProbleme(canvas, x, y, pointProche.x, pointProche.y, distTer, distMinTerrasse, '🟩');
    }
  }
  
  // Vérifier autres arbres
  const autresArbres = canvas.getObjects().filter(obj => 
    (obj.customType === 'arbre-a-planter' || obj.customType === 'arbre-existant') && obj !== arbreGroup
  );
  
  for (const autreArbre of autresArbres) {
    const dx = (x - autreArbre.left) / echelle;
    const dy = (y - autreArbre.top) / echelle;
    const distArbre = Math.sqrt(dx * dx + dy * dy);
    
    // Distance min applicable (contrainte bidirectionnelle)
    const autreArbreData = autreArbre.arbreData;
    const distanceAutreArbre = autreArbreData?.reglementation?.distancesLegales?.entreArbres?.distance 
      ? parseFloat(autreArbreData.reglementation.distancesLegales.entreArbres.distance.split('m')[0])
      : 5;
    const distanceMinApplicable = Math.max(distanceEntreArbres, distanceAutreArbre);
    
    if (distArbre < distanceMinApplicable) {
      ajouterLigneMesureProbleme(
        canvas, 
        x, y, 
        autreArbre.left, autreArbre.top, 
        distArbre, 
        distanceMinApplicable, 
        '🌳'
      );
    }
  }
  
  canvas.renderAll();
};

/**
 * Ajouter une ligne de mesure problématique
 */
const ajouterLigneMesureProbleme = (canvas, x1, y1, x2, y2, distActuelle, distMin, icone) => {
  // Ligne pointillée rouge
  const ligne = new fabric.Line([x1, y1, x2, y2], {
    stroke: '#d32f2f',
    strokeWidth: 2,
    strokeDashArray: [8, 4],
    selectable: false,
    evented: false,
    isLigneMesure: true
  });
  canvas.add(ligne);
  
  // Label de distance au milieu
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  
  const label = new fabric.Text(`${icone} ${distActuelle.toFixed(1)}m < ${distMin}m`, {
    left: midX,
    top: midY - 15,
    fontSize: 11,
    fontWeight: 'bold',
    fill: '#d32f2f',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 4,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false,
    isLigneMesure: true
  });
  canvas.add(label);
};

/**
 * Wrapper pour compatibilité avec l'ancien code
 */
function calculerDistanceLigne(x, y, ligne) {
  const pointProche = trouverPointPlusProcheLigne(x, y, ligne);
  const dx = x - pointProche.x;
  const dy = y - pointProche.y;
  return Math.sqrt(dx * dx + dy * dy);
}
