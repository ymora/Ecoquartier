/**
 * planLoader.js
 * Chargeur de plan JSON qui RÉUTILISE les fonctions existantes
 * ✅ Pas de duplication - utilise creerObjets.js
 * ✅ Réutilisable pour tout le projet
 */

import * as fabric from 'fabric';
import { 
  creerMaisonObjet,
  creerCaissonEauObjet, 
  creerTerrasseObjet,
  creerPavesObjet
} from './creerObjets';
import logger from '../logger';

/**
 * Charger un plan depuis un fichier JSON
 * ✅ RÉUTILISE les fonctions existantes - pas de duplication
 */
export const chargerPlanFromJSON = async (canvas, echelle, ajouterGrille) => {
  if (!canvas) return;
  
  try {
    // Charger le JSON du plan par défaut
    const response = await fetch('/src/utils/canvas/planDefault.json');
    const planData = await response.json();
    
    logger.info('PlanLoader', 'Chargement du plan depuis JSON');
    
    // Nettoyer le canvas
    const objets = canvas.getObjects().filter(obj => 
      !obj.isGridLine && 
      !obj.measureLabel && 
      !obj.isBoussole && 
      !obj.isSolIndicator &&
      !obj.alignmentGuide &&
      !obj.isDimensionBox &&
      !obj.isAideButton &&
      !obj.isImageFond &&
      !obj.isCenterMark
    );
    objets.forEach(obj => canvas.remove(obj));
    
    // Charger chaque objet en utilisant les fonctions existantes
    for (const objet of planData.objets) {
      await chargerObjet(canvas, objet, echelle);
    }
    
    // Re-ajouter la grille
    if (ajouterGrille) ajouterGrille(canvas);
    
    canvas.renderAll();
    
    logger.info('PlanLoader', `✅ Plan JSON chargé (${planData.objets.length} objets)`);
    
  } catch (error) {
    logger.error('PlanLoader', 'Erreur lors du chargement du plan JSON:', error);
  }
};

/**
 * Charger un objet spécifique en réutilisant les fonctions existantes
 * ✅ RÉUTILISE creerMaisonObjet, creerTerrasseObjet, etc.
 */
const chargerObjet = async (canvas, objetData, echelle) => {
  const { type, position, dimensions, proprietes } = objetData;
  
  let objet;
  
  switch (type) {
    case 'maison':
      // ✅ RÉUTILISE creerMaisonObjet existant
      objet = creerMaisonObjet(echelle);
      // Appliquer les dimensions personnalisées
      objet.set({
        largeur: dimensions.largeur,
        profondeur: dimensions.profondeur,
        hauteur: proprietes.hauteur,
        elevationSol: proprietes.elevationSol,
        typeToit: proprietes.typeToit,
        angle: proprietes.angle || 0
      });
      break;
      
    case 'caisson-eau':
      // ✅ RÉUTILISE creerCaissonEauObjet existant
      objet = creerCaissonEauObjet(echelle);
      objet.set({
        largeur: dimensions.largeur,
        profondeur: dimensions.profondeur,
        hauteur: proprietes.hauteur,
        elevationSol: proprietes.elevationSol,
        angle: proprietes.angle || 0
      });
      break;
      
    case 'terrasse':
      // ✅ RÉUTILISE creerTerrasseObjet existant
      objet = creerTerrasseObjet(echelle);
      objet.set({
        largeur: dimensions.largeur,
        profondeur: dimensions.profondeur,
        hauteur: proprietes.hauteur,
        elevationSol: proprietes.elevationSol,
        angle: proprietes.angle || 0
      });
      break;
      
    case 'paves':
      // ✅ RÉUTILISE creerPavesObjet existant
      objet = creerPavesObjet(echelle);
      objet.set({
        largeur: dimensions.largeur,
        profondeur: dimensions.profondeur,
        hauteur: proprietes.hauteur,
        elevationSol: proprietes.elevationSol,
        angle: proprietes.angle || 0
      });
      break;
      
    case 'canalisation':
      // Créer une canalisation (pas de fonction existante)
      objet = creerCanalisation(objetData, echelle);
      break;
      
    default:
      logger.warn('PlanLoader', `Type d'objet non reconnu: ${type}`);
      return;
  }
  
  if (objet) {
    // Positionner l'objet
    objet.set({
      left: position.x,
      top: position.y
    });
    
    canvas.add(objet);
  }
};

/**
 * Créer une canalisation (fonction simple, pas de duplication)
 */
const creerCanalisation = (objetData, echelle) => {
  const { points, proprietes } = objetData;
  
  return new fabric.Line([
    points[0].x, points[0].y,
    points[1].x, points[1].y
  ], {
    stroke: '#2196f3',
    strokeWidth: 4,
    strokeDashArray: [10, 5],
    strokeLineCap: 'round',
    customType: 'canalisation',
    diametre: proprietes.diametre,
    elevationSol: proprietes.elevationSol,
    selectable: true,
    hasBorders: true,
    hasControls: true,
    strokeUniform: true
  });
};