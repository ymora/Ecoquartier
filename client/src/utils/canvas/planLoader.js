/**
 * planLoader.js
 * Chargeur de plan JSON qui RÉUTILISE les fonctions existantes
 * ✅ Pas de duplication - utilise creerObjets.js
 * ✅ Réutilisable pour tout le projet
 */

import * as fabric from 'fabric';
import { canvasOperations } from './canvasOperations';
import { 
  creerMaisonObjet,
  creerCaissonEauObjet, 
  creerTerrasseObjet,
  creerPavesObjet
} from './creerObjets';
import { creerObjetTerrain } from './terrainUtils';
import logger from '../logger';

/**
 * Charger un plan depuis un fichier JSON
 * ✅ RÉUTILISE les fonctions existantes - pas de duplication
 */
export const chargerPlanFromJSON = async (canvas, echelle, ajouterGrille, planFile = '/src/utils/canvas/planPersonnalise.json') => {
  if (!canvas) return;
  
  try {
    // Charger le JSON du plan spécifié
    const response = await fetch(planFile);
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
  objets.forEach(obj => canvasOperations.supprimer(canvas, obj));
    
    // Charger chaque objet en utilisant les fonctions existantes
    for (const objet of planData.objets) {
      await chargerObjet(canvas, objet, echelle);
    }
    
    // Re-ajouter la grille
    if (ajouterGrille) ajouterGrille(canvas);
    
  canvasOperations.rendre(canvas);
    
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
  const { type, pos, dim, props } = objetData;
  
  let objet;
  
  switch (type) {
    case 'maison':
      // ✅ RÉUTILISE creerMaisonObjet existant
      objet = creerMaisonObjet(echelle);
      // Appliquer les dimensions personnalisées
      objet.set({
        largeur: dim[0],
        profondeur: dim[1],
        hauteur: props.hauteur,
        elevationSol: props.elevationSol || 0,
        typeToit: props.typeToit || 'deux-pentes',
        angle: props.angle || 0
      });
      break;
      
    case 'caisson-eau':
      // ✅ RÉUTILISE creerCaissonEauObjet existant
      objet = creerCaissonEauObjet(echelle);
      objet.set({
        largeur: dim[0],
        profondeur: dim[1],
        hauteur: props.hauteur,
        elevationSol: props.elevationSol || -1.0,
        angle: props.angle || 0
      });
      break;
      
    case 'terrasse':
      // ✅ RÉUTILISE creerTerrasseObjet existant
      objet = creerTerrasseObjet(echelle);
      objet.set({
        largeur: dim[0],
        profondeur: dim[1],
        hauteur: props.hauteur,
        elevationSol: props.elevationSol || 0,
        angle: props.angle || 0
      });
      break;
      
    case 'paves':
      // ✅ RÉUTILISE creerPavesObjet existant
      objet = creerPavesObjet(echelle);
      objet.set({
        largeur: dim[0],
        profondeur: dim[1],
        hauteur: props.hauteur,
        elevationSol: props.elevationSol || 0,
        angle: props.angle || 0
      });
      break;
      
    case 'sol': {
      // ✅ RÉUTILISE creerObjetTerrain existant
      const dimensions = { largeur: dim[0], hauteur: dim[1] };
      objet = creerObjetTerrain(echelle, dimensions);
      // Appliquer les propriétés personnalisées
      if (props.couchesSol) {
        objet.set('couchesSol', props.couchesSol);
      }
      // ✅ Restaurer le maillage d'élévation si disponible (rétrocompatibilité)
      if (props.maillageElevation && Array.isArray(props.maillageElevation)) {
        // Vérifier que le maillage a les bonnes dimensions
        const nbNoeudsZ = props.maillageElevation.length;
        const nbNoeudsX = props.maillageElevation[0]?.length || 0;
        
        // Si les dimensions correspondent, copier le maillage
        if (objet.maillageElevation && 
            nbNoeudsZ === objet.nbNoeudsZ && 
            nbNoeudsX === objet.nbNoeudsX) {
          for (let i = 0; i < nbNoeudsZ; i++) {
            for (let j = 0; j < nbNoeudsX; j++) {
              objet.maillageElevation[i][j] = props.maillageElevation[i][j];
            }
          }
          logger.info('PlanLoader', `✅ Maillage d'élévation restauré (${nbNoeudsX}×${nbNoeudsZ} nœuds)`);
        }
      }
      // ✅ Si pas de maillage dans le JSON → terrain plat par défaut (rétrocompatibilité)
      // ✅ TERRAIN : Ne pas repositionner car il est déjà centré
      // Le terrain est créé centré à (0,0) dans creerObjetTerrain
      canvasOperations.ajouter(canvas, objet);
      return; // Sortir sans repositionner
    }
      
    case 'canalisation':
      // Créer une canalisation (pas de fonction existante)
      objet = creerCanalisation(objetData, echelle);
      break;
      
    case 'cloture':
      // Créer une clôture
      objet = creerClotureFromJSON(objetData);
      break;
      
    default:
      logger.warn('PlanLoader', `Type d'objet non reconnu: ${type}`);
      return;
  }
  
  if (objet) {
    // Positionner l'objet
    objet.set({
      left: pos[0],
      top: pos[1]
    });
    
    canvasOperations.ajouter(canvas, objet);
  }
};

/**
 * Charger un plan depuis un fichier JSON externe
 * Permet de charger n'importe quel plan depuis un fichier JSON
 */
export const chargerPlanDepuisFichier = async (canvas, echelle, ajouterGrille, fichierJson) => {
  if (!canvas || !fichierJson) return;
  
  try {
    const response = await fetch(fichierJson);
    const planData = await response.json();
    
    logger.info('PlanLoader', `Chargement du plan depuis ${fichierJson}`);
    
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
  objets.forEach(obj => canvasOperations.supprimer(canvas, obj));
    
    // Charger chaque objet
    for (const objet of planData.objets) {
      await chargerObjet(canvas, objet, echelle);
    }
    
    // Re-ajouter la grille
    if (ajouterGrille) ajouterGrille(canvas);
    
  canvasOperations.rendre(canvas);
    
    logger.info('PlanLoader', `✅ Plan chargé depuis fichier (${planData.objets.length} objets)`);
    
  } catch (error) {
    logger.error('PlanLoader', 'Erreur lors du chargement du plan depuis fichier:', error);
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
    diametre: proprietes.diametre || 0.1,
    elevationSol: proprietes.elevationSol !== undefined ? proprietes.elevationSol : -0.6, // ✅ Réseau enterré par défaut
    selectable: true,
    hasBorders: true,
    hasControls: true,
    strokeUniform: true
  });
};

/**
 * Créer une clôture (fonction simple, pas de duplication)
 */
const creerClotureFromJSON = (objetData) => {
  const { points, proprietes } = objetData;
  
  return new fabric.Line([
    points[0].x, points[0].y,
    points[1].x, points[1].y
  ], {
    stroke: '#ffd54f',
    strokeWidth: 2,
    strokeDashArray: [10, 5],
    strokeLineCap: 'round',
    customType: 'cloture',
    hauteur: proprietes.hauteur || 1.5,
    epaisseur: proprietes.epaisseur || 0.05,
    elevationSol: proprietes.elevationSol !== undefined ? proprietes.elevationSol : 0.05, // ✅ 5 cm au-dessus du sol
    selectable: true,
    hasBorders: true,
    hasControls: true,
    strokeUniform: true
  });
};