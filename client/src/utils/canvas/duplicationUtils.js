/**
 * duplicationUtils.js
 * ✅ Fonctions unifiées pour la duplication d'objets
 * Évite la duplication de code entre Ctrl+D et bouton modal
 */

// Import supprimé - on revient au système simple

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
      creerPavesObjet,
      creerCanalisationObjet,
      creerClotureObjet
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
        nouvelObjet = creerCanalisationObjet(echelle);
        break;
      case 'cloture':
        nouvelObjet = creerClotureObjet(echelle);
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
    if (obj.customType === 'arbre-a-planter' || obj.customType === 'arbre') {
      if (obj.arbreData) proprietes.arbreData = { ...obj.arbreData };
      if (obj.planteId) proprietes.planteId = obj.planteId;
      if (obj.nomPlante) proprietes.nomPlante = obj.nomPlante;
      if (obj.validationStatus) proprietes.validationStatus = { ...obj.validationStatus };
      if (obj.couleur) proprietes.couleur = obj.couleur;
      if (obj.remarques) proprietes.remarques = obj.remarques;
    }
    
    console.log('🔧 DEBUG: Propriétés à appliquer:', proprietes);
    nouvelObjet.set(proprietes);
    
    // Ajouter au canvas
    console.log('🔧 DEBUG: Ajout au canvas...');
    canvas.add(nouvelObjet);
    
    // ✅ SÉQUENCE LOGIQUE : Désélectionner → Dupliquer → Sélectionner le nouveau
    console.log('🔧 DEBUG: 1. Désélection de l\'original...');
    canvas.discardActiveObject();
    canvas.renderAll();
    
    console.log('🔧 DEBUG: 2. Nouvel objet ajouté');
    
    // ✅ 3. Sélectionner le nouvel objet après un délai
    setTimeout(() => {
      console.log('🔧 DEBUG: 3. Sélection du nouvel objet...');
      canvas.setActiveObject(nouvelObjet);
      nouvelObjet.setCoords();
      canvas.requestRenderAll();
      
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
