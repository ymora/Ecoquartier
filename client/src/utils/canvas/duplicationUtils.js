/**
 * duplicationUtils.js
 * ✅ Fonctions unifiées pour la duplication d'objets
 * Évite la duplication de code entre Ctrl+D et bouton modal
 */

import { canvasOperations } from './canvasOperations';

/**
 * Dupliquer un objet avec toutes ses propriétés
 * @param {fabric.Object} obj - Objet à dupliquer
 * @param {fabric.Canvas} canvas - Canvas Fabric.js
 * @param {number} echelle - Échelle du plan
 * @param {Function} exporterPlan - Fonction d'export du plan
 * @param {Function} revaliderTous - Fonction de revalidation
 * @returns {Promise} - Promise résolue quand la duplication est terminée
 */
export const dupliquerObjet = async (obj, canvas, echelle, exporterPlan, revaliderTous) => {
  if (!obj || !canvas) return;
  
  console.log('🔧 DEBUG: Début duplication unifiée...');
  console.log('🔧 DEBUG: Type d\'objet à dupliquer:', obj.customType);
  
  try {
    // ✅ SOLUTION : Créer un NOUVEL objet au lieu de cloner
    let nouvelObjet = null;
    
    // Importer les fonctions de création d'objets
    const { 
      creerMaisonObjet,
      creerCiterneObjet,
      creerCaissonEauObjet,
      creerTerrasseObjet,
      creerPavesObjet
    } = await import('./creerObjets');
    
    // Créer un nouvel objet selon le type
    switch (obj.customType) {
      case 'maison':
        nouvelObjet = creerMaisonObjet(echelle);
        break;
      case 'citerne':
        nouvelObjet = creerCiterneObjet(echelle);
        break;
      case 'caisson-eau':
        nouvelObjet = creerCaissonEauObjet(echelle);
        break;
      case 'terrasse':
        nouvelObjet = creerTerrasseObjet(echelle);
        break;
      case 'paves':
        nouvelObjet = creerPavesObjet(echelle);
        break;
      case 'canalisation':
      case 'cloture':
        // ✅ Canalisations et clôtures = lignes complexes, utiliser clone()
        console.log('🔧 DEBUG: Duplication canalisation/clôture via clone()');
        nouvelObjet = await obj.clone();
        break;
      case 'arbre-a-planter':
      case 'arbre-existant':
      case 'arbre':
        // ✅ Pour les arbres, utiliser clone() car structure complexe (ellipse + label + propriétés)
        console.log('🔧 DEBUG: Duplication arbre via clone()');
        nouvelObjet = await obj.clone();
        break;
      default:
        console.log('🔧 DEBUG: Type non supporté pour duplication, fallback sur clone');
        nouvelObjet = await obj.clone();
    }
    
    console.log('🔧 DEBUG: Nouvel objet créé:', nouvelObjet);
    
    // ✅ Copier les propriétés importantes de l'original vers le nouveau
    const proprietes = {
      left: obj.left + echelle,
      top: obj.top + echelle,
      width: obj.width,
      height: obj.height,
      scaleX: obj.scaleX,
      scaleY: obj.scaleY,
      angle: obj.angle,
      largeur: obj.largeur,
      profondeur: obj.profondeur,
      hauteur: obj.hauteur,
      elevationSol: obj.elevationSol,
      typeToit: obj.typeToit,
      diametre: obj.diametre,
      longueur: obj.longueur,
      tailles: obj.tailles,
      iconeType: obj.iconeType
    };
    
    // ✅ PROPRIÉTÉS SPÉCIFIQUES AUX ARBRES
    if (obj.customType === 'arbre-a-planter' || obj.customType === 'arbre-existant' || obj.customType === 'arbre') {
      if (obj.arbreData) proprietes.arbreData = { ...obj.arbreData };
      if (obj.planteId) proprietes.planteId = obj.planteId;
      if (obj.nomPlante) proprietes.nomPlante = obj.nomPlante;
      if (obj.validationStatus) proprietes.validationStatus = { ...obj.validationStatus };
      if (obj.couleur) proprietes.couleur = obj.couleur;
      if (obj.remarques) proprietes.remarques = obj.remarques;
      if (obj.tailles) proprietes.tailles = { ...obj.tailles };
      if (obj.iconeType) proprietes.iconeType = obj.iconeType;
      if (obj.elevationSol !== undefined) proprietes.elevationSol = obj.elevationSol; // ✅ Conserver l'élévation
    }
    
    // ✅ PROPRIÉTÉS SPÉCIFIQUES AUX CANALISATIONS ET CLÔTURES (lignes)
    if (obj.customType === 'canalisation' || obj.customType === 'cloture') {
      if (obj.x1 !== undefined) proprietes.x1 = obj.x1 + echelle;
      if (obj.y1 !== undefined) proprietes.y1 = obj.y1 + echelle;
      if (obj.x2 !== undefined) proprietes.x2 = obj.x2 + echelle;
      if (obj.y2 !== undefined) proprietes.y2 = obj.y2 + echelle;
      if (obj.diametre !== undefined) proprietes.diametre = obj.diametre;
      if (obj.hauteur !== undefined) proprietes.hauteur = obj.hauteur;
      if (obj.epaisseur !== undefined) proprietes.epaisseur = obj.epaisseur;
    }
    
    console.log('🔧 DEBUG: Propriétés à appliquer:', proprietes);
    nouvelObjet.set(proprietes);
    
    // ✅ Pour les objets rectangulaires, mettre à jour aussi le rectangle interne
    if ((nouvelObjet.customType === 'maison' || 
         nouvelObjet.customType === 'terrasse' || 
         nouvelObjet.customType === 'paves' || 
         nouvelObjet.customType === 'caisson-eau') &&
        (nouvelObjet._objects || (nouvelObjet.getObjects && nouvelObjet.getObjects()))) {
      const rect = nouvelObjet._objects?.find(o => o.type === 'rect') || 
                   (nouvelObjet.getObjects ? nouvelObjet.getObjects().find(o => o.type === 'rect') : null);
      if (rect && nouvelObjet.largeur && nouvelObjet.profondeur) {
        rect.set({
          width: nouvelObjet.largeur * echelle,
          height: nouvelObjet.profondeur * echelle,
          originX: 'center',
          originY: 'center'
        });
        if (nouvelObjet._calcBounds) nouvelObjet._calcBounds();
        nouvelObjet.setCoords();
      }
    }
    
    // Ajouter au canvas avec canvasOperations
    console.log('🔧 DEBUG: Ajout au canvas...');
    canvasOperations.ajouter(canvas, nouvelObjet, false);
    
    // ✅ SÉQUENCE LOGIQUE : Désélectionner → Dupliquer → Sélectionner le nouveau
    console.log('🔧 DEBUG: 1. Désélection de l\'original...');
    canvasOperations.deselectionner(canvas, false);
    
    console.log('🔧 DEBUG: 2. Nouvel objet ajouté');
    
    // ✅ 3. Sélectionner le nouvel objet après un délai
    setTimeout(() => {
      console.log('🔧 DEBUG: 3. Sélection du nouvel objet...');
      canvasOperations.selectionner(canvas, nouvelObjet, true);
      
      // ✅ Déclencher l'événement de sélection pour mettre à jour l'UI
      canvas.fire('selection:created', { selected: [nouvelObjet] });
    }, 100);
    
    // Utiliser setTimeout pour éviter les conflits
    setTimeout(() => {
      if (exporterPlan) exporterPlan(canvas);
      if (revaliderTous) revaliderTous(canvas);
    }, 50);
    
    console.log('🔧 DEBUG: Duplication unifiée terminée!');
    return nouvelObjet;
    
  } catch (error) {
    console.error('🔧 DEBUG: Erreur lors de la duplication unifiée:', error);
    throw error;
  }
};
