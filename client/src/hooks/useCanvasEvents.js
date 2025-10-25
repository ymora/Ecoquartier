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
import { 
  maintenirCentreAuPremierPlan,
  creerMaisonObjet, 
  creerCiterneObjet, 
  creerCaissonEauObjet,
  creerTerrasseObjet,
  creerPavesObjet
} from '../utils/canvas/creerObjets';
import { dupliquerObjet } from '../utils/canvas/duplicationUtils';

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
  ajouterPointIntermediaire
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
        if (obj.alignmentGuide) canvas.remove(obj);
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
      
      // Forcer le tri par profondeur après modification
      forcerTriObjets(canvas);
      
      // renderAll() est appelé UNE SEULE FOIS à la fin
      canvas.renderAll();
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
            if (!obj.isGridLine && !obj.isImageFond) canvas.remove(obj);
          });
          canvas.discardActiveObject();
          canvas.renderAll();
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
            
            // ✅ CONDITION PLUS LARGE : Dupliquer tous les objets sauf les éléments d'interface
            if (!obj.isGridLine && 
                !obj.measureLabel && 
                !obj.isBoussole && 
                !obj.isImageFond &&
                !obj.alignmentGuide &&
                !obj.isDimensionBox &&
                !obj.isAideButton &&
                !obj.isCenterMark) {
              console.log('🔧 DEBUG: Début clonage via fonction unifiée...');
              
              // ✅ UTILISER LA FONCTION UNIFIÉE
              dupliquerObjet(obj, canvas, echelle, exporterPlan, revaliderTous)
                .then((cloned) => {
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
          
          canvas.renderAll();
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
      maintenirCentreAuPremierPlan(canvas);
      
      // Afficher les indicateurs de connexion
      afficherIndicateursConnexion(canvas);
    };
    
    const handleAddedOrRemoved = createProtectedEventHandler(handleAddedOrRemovedBase, 50);

    const handleScaling = (e) => {
      if (e.target && !e.target.measureLabel && !e.target.alignmentGuide && !e.target.isGridLine) {
        ajouterMesuresLive(canvas);
        if (!e.target.isBoussole) afficherMenuContextuel(e.target, canvas);
      }
    };

    const handleMovingWithValidation = (e) => {
      if (e.target && !e.target.measureLabel && !e.target.alignmentGuide && !e.target.isGridLine) {
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
      }
    };

    const handleSelectionCreated = (e) => {
      const obj = e.selected[0];
      if (obj && !obj.isAideButton && !obj.isBoussole && !obj.isDimensionBox) {
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
    };

    const handleDblClick = (e) => {
      if (e.target && (e.target.customType === 'cloture' || e.target.customType === 'canalisation')) {
        ajouterPointIntermediaire(canvas, e.target, e.pointer);
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
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      // Nettoyer tous les event listeners du canvas
      canvas.off('object:moving', handleMoving);
      canvas.off('object:moving', handleMovingGuides);
      canvas.off('object:scaling', handleScaling);
      canvas.off('object:modified', handleMovingWithValidation);
      canvas.off('object:added', handleAddedOrRemoved);
      canvas.off('object:removed', handleAddedOrRemoved);
      canvas.off('selection:created', handleSelectionCreated);
      canvas.off('selection:updated', handleSelectionUpdated);
      canvas.off('selection:cleared', handleSelectionCleared);
      canvas.off('mouse:dblclick', handleDblClick);
      
      // Nettoyer l'event listener global
      window.removeEventListener('keydown', handleKeyDown);
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

