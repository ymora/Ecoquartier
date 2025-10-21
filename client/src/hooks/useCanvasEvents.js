import { useEffect } from 'react';
import logger from '../utils/logger';
import { forcerTriObjets } from '../utils/canvas/depthSorting';
import { afficherGuideTemporaire } from '../utils/canvas/affichage';
import { 
  deplacerClotureAvecConnexions,
  resetClotureLastPos,
  afficherIndicateursConnexion
} from '../utils/canvas/cloturesHelpers';

/**
 * Hook pour gérer tous les event listeners du canvas
 * Snap magnétique, guides, object:modified, clavier, etc.
 */
export const useCanvasEvents = ({
  fabricCanvasRef,
  echelle,
  afficherMenuContextuel,
  cacherMenuContextuel,
  cacherTooltipValidation,
  validerPositionArbre,
  revaliderTous, // Nouvelle fonction pour re-valider tous les arbres
  afficherTooltipValidation,
  cacherCercleTronc,
  exporterPlan,
  ajouterMesuresLive,
  afficherOmbreMaison,
  ajouterPointIntermediaire
}) => {
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // SNAP TO GRID
    const handleMoving = (e) => {
      const obj = e.target;
      const snapSize = echelle * 0.05;
      
      let newLeft = Math.round(obj.left / snapSize) * snapSize;
      let newTop = Math.round(obj.top / snapSize) * snapSize;
      
      if (snapMagnetiqueActif && !obj.isGridLine && !obj.isBoussole) {
        const snapDistance = echelle * 0.1;
        
        canvas.getObjects().forEach(target => {
          if (target === obj || target.isGridLine || target.isBoussole || 
              target.measureLabel || target.isZoneContrainte || target.isOmbre ||
              target.isLigneMesure || target.isTroncIndicator) return;
          
          const targetLeft = target.left;
          const targetRight = target.left + (target.getScaledWidth ? target.getScaledWidth() : 0);
          const objWidth = obj.getScaledWidth ? obj.getScaledWidth() : 0;
          
          if (Math.abs(newLeft - targetLeft) < snapDistance) newLeft = targetLeft;
          if (Math.abs(newLeft - targetRight) < snapDistance) newLeft = targetRight;
          if (Math.abs((newLeft + objWidth) - targetLeft) < snapDistance) newLeft = targetLeft - objWidth;
          
          const targetTop = target.top;
          const targetBottom = target.top + (target.getScaledHeight ? target.getScaledHeight() : 0);
          const objHeight = obj.getScaledHeight ? obj.getScaledHeight() : 0;
          
          if (Math.abs(newTop - targetTop) < snapDistance) newTop = targetTop;
          if (Math.abs(newTop - targetBottom) < snapDistance) newTop = targetBottom;
          if (Math.abs((newTop + objHeight) - targetTop) < snapDistance) newTop = targetTop - objHeight;
        });
      }
      
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
      
      if (e.target && e.target.customType === 'arbre-a-planter') {
        afficherTooltipValidation(e.target, canvas);
      }
      
      // RE-VALIDER TOUS LES ARBRES après TOUT déplacement
      // Cela permet de détecter tous les conflits (arbres, maison, canalisations, etc.)
      if (revaliderTous) {
        revaliderTous(canvas);
      }
      
      // Réinitialiser la position de référence des clôtures
      if (e.target && e.target.customType === 'cloture') {
        resetClotureLastPos(e.target, canvas);
      }
      
      afficherOmbreMaison(canvas);
      
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
          alert('⚠️ Objet(s) verrouillé(s)');
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
        const actifs = canvas.getActiveObjects();
        if (actifs.length > 0) {
          actifs.forEach(obj => {
            if (!obj.isGridLine && !obj.measureLabel) {
              obj.clone((cloned) => {
                cloned.set({
                  left: obj.left + echelle,
                  top: obj.top + echelle
                });
                canvas.add(cloned);
                canvas.setActiveObject(cloned);
                canvas.renderAll();
              });
            }
          });
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

    const handleAddedOrRemoved = (e) => {
      if (e && e.target && (e.target.measureLabel || e.target.alignmentGuide || e.target.isGridLine || 
                            e.target.isConnectionIndicator || e.target.isSnapIndicator)) return;
      exporterPlan(canvas);
      ajouterMesuresLive(canvas);
      
      // Maintenir les clôtures au premier plan pour encadrer tous les éléments
      const clotures = canvas.getObjects().filter(obj => obj.customType === 'cloture');
      clotures.forEach(cloture => {
        canvas.bringObjectToFront(cloture);
      });
      
      // Afficher les indicateurs de connexion
      afficherIndicateursConnexion(canvas);
    };

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
          afficherTooltipValidation(e.target, canvas);
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
          afficherTooltipValidation(obj, canvas);
        }
      }
    };

    const handleSelectionUpdated = (e) => {
      const obj = e.selected[0];
      if (obj && !obj.isAideButton && !obj.isBoussole && !obj.isDimensionBox) {
        afficherMenuContextuel(obj, canvas);
        if (obj.customType === 'arbre-a-planter') {
          validerPositionArbre(canvas, obj);
          afficherTooltipValidation(obj, canvas);
        }
      }
    };

    const handleSelectionCleared = () => {
      cacherTooltipValidation();
      cacherMenuContextuel();
    };

    const handleDblClick = (e) => {
      if (e.target && (e.target.customType === 'cloture' || e.target.customType === 'canalisation')) {
        ajouterPointIntermediaire(canvas, e.target, e.pointer);
      }
    };

    // Attacher tous les event listeners
    canvas.on('object:moving', handleMoving);
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
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [snapMagnetiqueActif]); // eslint-disable-line react-hooks/exhaustive-deps
};

