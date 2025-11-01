import { useEffect } from 'react';
import logger from '../utils/logger';
import { forcerTriObjets } from '../utils/canvas/depthSorting';
import { afficherGuideTemporaire } from '../utils/canvas/affichage';
import { 
  deplacerClotureAvecConnexions,
  resetClotureLastPos,
  afficherIndicateursConnexion
} from '../utils/canvas/cloturesHelpers';
import { createProtectedEventHandler } from '../utils/canvas/eventManager';
import { dupliquerObjet } from '../utils/canvas/duplicationUtils';
import { agrandirTerrainSiNecessaire } from '../utils/canvas/terrainUtils';
import { forcerTerrainEnArrierePlan } from '../utils/canvas/depthSorting';
import { canvasOperations } from '../utils/canvas/canvasOperations';
import { afficherGrilleMaillage, masquerGrilleMaillage, modifierElevationCellule } from '../utils/canvas/terrainMaillage';

/**
 * Hook pour gérer tous les event listeners du canvas
 * Guides, object:modified, clavier, etc.
 */
export const useCanvasEvents = ({
  fabricCanvasRef,
  echelle,
  afficherMenuContextuel,
  cacherMenuContextuel,
  validerPositionArbre,
  revaliderTous, // Nouvelle fonction pour re-valider tous les arbres
  cacherCercleTronc,
  exporterPlan,
  ajouterMesuresLive,
  ajouterPointIntermediaire,
  onDimensionsChange
}) => {
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // SNAP TO GRID
    const handleMoving = (e) => {
      const obj = e.target;
      const snapSize = echelle * 0.05;
      
      const newLeft = Math.round(obj.left / snapSize) * snapSize;
      const newTop = Math.round(obj.top / snapSize) * snapSize;
      
      obj.set({ left: newLeft, top: newTop });
      
      // ✅ Forcer le terrain en arrière-plan pendant le déplacement
      forcerTerrainEnArrierePlan(canvas);
    };

    // Guides d'alignement
    const handleMovingGuides = (e) => {
      const obj = e.target;
      const center = obj.getCenterPoint();
      
      canvas.getObjects().forEach(other => {
        if (other === obj || other.isGridLine || other.measureLabel || other.alignmentGuide) return;
        
        const otherCenter = other.getCenterPoint();
        
        if (Math.abs(center.y - otherCenter.y) < 10) {
          obj.set({ top: other.top });
          afficherGuideTemporaire(canvas, 'horizontal', otherCenter.y);
        }
        
        if (Math.abs(center.x - otherCenter.x) < 10) {
          obj.set({ left: other.left });
          afficherGuideTemporaire(canvas, 'vertical', otherCenter.x);
        }
      });
    };

    // object:modified
    const handleModified = (e) => {
      canvas.getObjects().forEach(obj => {
        if (obj.alignmentGuide) canvasOperations.supprimer(canvas, obj);
      });
      
      exporterPlan(canvas);
      ajouterMesuresLive(canvas);
      cacherCercleTronc(canvas);
      
      // afficherTooltipValidation supprimé - infos maintenant dans Config
      
      // RE-VALIDER TOUS LES ARBRES après TOUT déplacement
      // Cela permet de détecter tous les conflits (arbres, maison, canalisations, etc.)
      if (revaliderTous) {
        revaliderTous(canvas);
      }
      
      // Réinitialiser la position de référence des clôtures
      if (e.target && e.target.customType === 'cloture') {
        resetClotureLastPos(e.target, canvas);
      }
      
      // AGRANDIR LE TERRAIN si un objet sort de ses limites
      if (e.target && e.target.customType !== 'sol' && onDimensionsChange) {
        agrandirTerrainSiNecessaire(canvas, e.target, echelle, onDimensionsChange);
      }
      
      // Forcer le tri par profondeur après modification
      forcerTriObjets(canvas);
      
      // renderAll() est appelé UNE SEULE FOIS à la fin
      canvasOperations.rendre(canvas);
      // Debug désactivé pour performance (événement fréquent)
      // logger.debug('ObjectModified', 'Objet modifié, validation et tri OK');
    };

    // Raccourcis clavier
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeObjects = canvas.getActiveObjects();
        const locked = activeObjects.filter(obj => obj.locked);
        
        if (locked.length > 0) {
          logger.warn('Canvas', 'Objet(s) verrouillé(s) - impossible à supprimer');
          return;
        }
        
        if (activeObjects.length > 0) {
          activeObjects.forEach(obj => {
            if (!obj.isGridLine && !obj.isImageFond) canvasOperations.supprimer(canvas, obj);
          });
          canvas.discardActiveObject();
          canvasOperations.rendre(canvas);
          exporterPlan(canvas);
        }
      }
      
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        console.log('🔧 DEBUG: Ctrl+D détecté');
        const actifs = canvas.getActiveObjects();
        console.log('🔧 DEBUG: Objets actifs:', actifs.length);
        
        if (actifs.length > 0) {
          actifs.forEach((obj, index) => {
            console.log(`🔧 DEBUG: Objet ${index}:`, {
              customType: obj.customType,
              left: obj.left,
              top: obj.top,
              width: obj.width,
              height: obj.height
            });
            
            // ✅ CONDITION PLUS LARGE : Dupliquer tous les objets sauf les éléments d'interface et le terrain
            if (!obj.isGridLine && 
                !obj.measureLabel && 
                !obj.isBoussole && 
                !obj.isImageFond &&
                !obj.alignmentGuide &&
                !obj.isDimensionBox &&
                !obj.isAideButton &&
                !obj.isCenterMark &&
                obj.customType !== 'sol') {
              console.log('🔧 DEBUG: Début clonage via fonction unifiée...');
              
              // ✅ UTILISER LA FONCTION UNIFIÉE
              dupliquerObjet(obj, canvas, echelle, exporterPlan, revaliderTous)
                .then(() => {
                  console.log('🔧 DEBUG: Duplication Ctrl+D terminée!');
                })
                .catch((error) => {
                  console.error('🔧 DEBUG: Erreur lors de la duplication Ctrl+D:', error);
                });
            } else {
              console.log('🔧 DEBUG: Objet ignoré (élément d\'interface)');
            }
          });
        } else {
          console.log('🔧 DEBUG: Aucun objet actif');
        }
      }
      
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        const actifs = canvas.getActiveObjects();
        if (actifs.length > 0) {
          e.preventDefault();
          const delta = e.shiftKey ? echelle : echelle / 10;
          
          actifs.forEach(obj => {
            if (obj.locked) return;
            
            switch(e.key) {
              case 'ArrowUp': obj.set({ top: obj.top - delta }); break;
              case 'ArrowDown': obj.set({ top: obj.top + delta }); break;
              case 'ArrowLeft': obj.set({ left: obj.left - delta }); break;
              case 'ArrowRight': obj.set({ left: obj.left + delta }); break;
            }
          });
          
          canvasOperations.rendre(canvas);
          ajouterMesuresLive(canvas);
        }
      }
    };

    // ✅ Handle added/removed avec gestionnaire protégé (évite boucles infinies)
    const handleAddedOrRemovedBase = (e) => {
      exporterPlan(canvas);
      ajouterMesuresLive(canvas);
      
      // Maintenir les clôtures au premier plan pour encadrer tous les éléments
      const clotures = canvas.getObjects().filter(obj => obj.customType === 'cloture');
      clotures.forEach(cloture => {
        canvas.bringObjectToFront(cloture);
      });
      
      // Maintenir le repère de centre au premier plan pour qu'il soit toujours visible
      // maintenirCentreAuPremierPlan(canvas); // Fonction supprimée
      
      // Afficher les indicateurs de connexion
      afficherIndicateursConnexion(canvas);
    };
    
    const handleAddedOrRemoved = createProtectedEventHandler(handleAddedOrRemovedBase, 50);

    const handleScaling = (e) => {
      if (e.target && !e.target.measureLabel && !e.target.alignmentGuide && !e.target.isGridLine) {
        ajouterMesuresLive(canvas);
        if (!e.target.isBoussole) afficherMenuContextuel(e.target, canvas);

        // ✅ Agrandir le terrain EN DIRECT pendant le redimensionnement
        if (e.target.customType !== 'sol' && onDimensionsChange) {
          agrandirTerrainSiNecessaire(canvas, e.target, echelle, onDimensionsChange);
        }
      }
    };

    const handleMovingWithValidation = (e) => {
      if (e.target && !e.target.measureLabel && !e.target.alignmentGuide && !e.target.isGridLine) {
        // ✅ FORCER LE TERRAIN EN ARRIÈRE-PLAN lors du déplacement
        forcerTerrainEnArrierePlan(canvas);
        
        ajouterMesuresLive(canvas);
        if (!e.target.isBoussole) afficherMenuContextuel(e.target, canvas);
        
        if (e.target.customType === 'arbre-a-planter') {
          validerPositionArbre(canvas, e.target);
          // afficherTooltipValidation supprimé - infos maintenant dans Config
        }
        
        // Gérer les clôtures connectées
        if (e.target.customType === 'cloture') {
          deplacerClotureAvecConnexions(e.target, canvas, e);
        }

        // ✅ Agrandir le terrain EN DIRECT pendant le déplacement
        if (e.target.customType !== 'sol' && onDimensionsChange) {
          agrandirTerrainSiNecessaire(canvas, e.target, echelle, onDimensionsChange);
        }
      }
    };

    const handleSelectionCreated = (e) => {
      const obj = e.selected[0];
      if (obj && !obj.isAideButton && !obj.isBoussole && !obj.isDimensionBox) {
        // ✅ FORCER LE TERRAIN EN ARRIÈRE-PLAN lors de la sélection
        forcerTerrainEnArrierePlan(canvas);
        
        // ✅ Si c'est le terrain qui est sélectionné, afficher la grille de maillage
        if (obj.customType === 'sol') {
          // Forcer le terrain au fond même quand sélectionné
          setTimeout(() => {
            canvas.sendObjectToBack(obj);
            // ✅ Afficher la grille de maillage pour éditer la planéité
            afficherGrilleMaillage(canvas, obj, echelle);
            canvasOperations.rendre(canvas);
          }, 10);
        } else {
          // ✅ Masquer la grille si on sélectionne un autre objet
          masquerGrilleMaillage(canvas);
        }
        
        afficherMenuContextuel(obj, canvas);
        if (obj.customType === 'arbre-a-planter') {
          validerPositionArbre(canvas, obj);
          // afficherTooltipValidation supprimé - infos maintenant dans Config
        }
      }
    };

    const handleSelectionUpdated = (e) => {
      const obj = e.selected[0];
      if (obj && !obj.isAideButton && !obj.isBoussole && !obj.isDimensionBox) {
        // ✅ FORCER LE TERRAIN EN ARRIÈRE-PLAN lors de la mise à jour de sélection
        forcerTerrainEnArrierePlan(canvas);
        
        // ✅ Si c'est le terrain qui est sélectionné, s'assurer qu'il reste au fond
        if (obj.customType === 'sol') {
          // Forcer le terrain au fond même quand sélectionné
          setTimeout(() => {
            canvas.sendObjectToBack(obj);
            canvasOperations.rendre(canvas);
          }, 0);
        }
        
        afficherMenuContextuel(obj, canvas);
        if (obj.customType === 'arbre-a-planter') {
          validerPositionArbre(canvas, obj);
          // afficherTooltipValidation supprimé - infos maintenant dans Config
        }
      }
    };

    const handleSelectionCleared = () => {
      // cacherTooltipValidation supprimé - infos maintenant dans Config
      cacherMenuContextuel();
      // ✅ Masquer la grille de maillage quand aucun objet n'est sélectionné
      masquerGrilleMaillage(canvas);
    };

    const handleDblClick = (e) => {
      if (e.target && (e.target.customType === 'cloture' || e.target.customType === 'canalisation')) {
        ajouterPointIntermediaire(canvas, e.target, e.pointer);
      }
    };

    // ✅ Clic sur le fond/sol/image de fond → désélectionner (permet la rotation en 3D côté sync)
    const handleBackgroundDown = (e) => {
      const t = e.target;
      if (!t || t.isImageFond || t.customType === 'sol') {
        canvas.discardActiveObject();
        canvasOperations.rendre(canvas);
        // On laisse le tri forcer le terrain en arrière-plan
        forcerTerrainEnArrierePlan(canvas);
      }
    };

    // Attacher tous les event listeners
    canvas.on('object:moving', handleMovingGuides);
    canvas.on('object:moving', handleMovingWithValidation);
    canvas.on('object:modified', handleModified);
    canvas.on('object:added', handleAddedOrRemoved);
    canvas.on('object:removed', handleAddedOrRemoved);
    canvas.on('object:scaling', handleScaling);
    canvas.on('selection:created', handleSelectionCreated);
    canvas.on('selection:updated', handleSelectionUpdated);
    canvas.on('selection:cleared', handleSelectionCleared);
    canvas.on('mouse:dblclick', handleDblClick);
    canvas.on('mouse:down', handleBackgroundDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      // Nettoyer tous les event listeners du canvas
      canvas.off('object:moving', handleMoving);
      canvas.off('object:moving', handleMovingGuides);
      canvas.off('object:scaling', handleScaling);
      canvas.off('object:modified', handleModified);
      canvas.off('object:added', handleAddedOrRemoved);
      canvas.off('object:removed', handleAddedOrRemoved);
      canvas.off('selection:created', handleSelectionCreated);
      canvas.off('selection:updated', handleSelectionUpdated);
      canvas.off('selection:cleared', handleSelectionCleared);
      canvas.off('mouse:dblclick', handleDblClick);
      
      // Nettoyer l'event listener global
      window.removeEventListener('keydown', handleKeyDown);
      canvas.off('mouse:down', handleBackgroundDown);
    };
  }, [
    fabricCanvasRef,
    echelle,
    afficherMenuContextuel,
    cacherMenuContextuel,
    validerPositionArbre,
    revaliderTous,
    cacherCercleTronc,
    exporterPlan,
    ajouterMesuresLive,
    ajouterPointIntermediaire
  ]);
};

