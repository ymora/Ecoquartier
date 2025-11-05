/**
 * menuContextuel.js
 * Gestion du menu contextuel (verrouiller/supprimer) affiché au-dessus des objets sélectionnés
 */

import logger from '../logger';

/**
 * Afficher le menu contextuel au-dessus d'un objet sélectionné
 */
export const afficherMenuContextuel = (obj, canvas, canvasRef, contextMenuRef) => {
  if (!obj || 
      obj.isGridLine || 
      obj.isBoussole || 
      obj.measureLabel || 
      obj.isImageFond ||
      obj.alignmentGuide ||
      obj.isDimensionBox ||
      obj.isAideButton ||
      obj.isCenterMark) {
    cacherMenuContextuel(contextMenuRef);
    return;
  }

  const menu = contextMenuRef.current;
  if (!menu) return;

  const canvasRect = canvasRef.current.getBoundingClientRect();
  const objCenter = obj.getCenterPoint();
  const objHeight = obj.getScaledHeight ? obj.getScaledHeight() : obj.height || 50;
  
  const menuWidth = 220; // Largeur réelle du menu (4 boutons)
  const menuHeight = 45; // Hauteur du menu
  
  // ✅ POSITIONNEMENT SIMPLE : CENTRÉ EN HAUT DE L'OBJET (DANS l'objet)
  // Position horizontale : centrée sur l'objet
  let menuLeft = canvasRect.left + objCenter.x - (menuWidth / 2);
  
  // Position verticale : en haut de l'objet, DANS l'objet (pas au-dessus)
  let menuTop = canvasRect.top + objCenter.y - (objHeight / 2) + 10; // 10px de marge depuis le haut
  
  // Contraintes pour rester visible à l'écran
  if (menuLeft < canvasRect.left + 10) {
    menuLeft = canvasRect.left + 10;
  }
  if (menuLeft + menuWidth > canvasRect.right - 10) {
    menuLeft = canvasRect.right - menuWidth - 10;
  }
  if (menuTop < canvasRect.top + 10) {
    menuTop = canvasRect.top + 10;
  }
  if (menuTop + menuHeight > canvasRect.bottom - 10) {
    menuTop = canvasRect.bottom - menuHeight - 10;
  }
  
  menu.style.left = `${menuLeft}px`;
  menu.style.top = `${menuTop}px`;
  menu.style.display = 'flex';
  menu.style.cursor = 'move';
  
  // Mettre à jour l'état verrouillé
  const btnLock = menu.querySelector('.context-lock');
  if (btnLock) {
    if (obj.locked) {
      btnLock.textContent = '🔓';
      btnLock.title = 'Déverrouiller';
    } else {
      btnLock.textContent = '🔒';
      btnLock.title = 'Verrouiller';
    }
  }
};

/**
 * Cacher le menu contextuel
 */
export const cacherMenuContextuel = (contextMenuRef) => {
  const menu = contextMenuRef.current;
  if (menu) {
    menu.style.display = 'none';
  }
};

/**
 * Verrouiller/Déverrouiller l'objet actif via le menu contextuel
 */
export const toggleVerrouObjetActif = (canvas, contextMenuRef, canvasRef) => {
  if (!canvas) return;
  
  const actif = canvas.getActiveObject();
  if (!actif) return;
  
  if (actif.locked) {
    // Déverrouiller
    actif.locked = false;
    actif.lockMovementX = false;
    actif.lockMovementY = false;
    actif.lockScalingX = false;
    actif.lockScalingY = false;
    actif.lockRotation = false;
    actif.hasControls = true;
    
    // Restaurer l'apparence originale
    if (actif.originalStroke) {
      actif.stroke = actif.originalStroke;
      actif.strokeWidth = (actif.strokeWidth || 3) - 1;
      delete actif.originalStroke;
    }
    if (actif.originalFill) {
      actif.fill = actif.originalFill;
      delete actif.originalFill;
    }
  } else {
    // Verrouiller
    actif.locked = true;
    actif.selectable = true; // Garder selectable pour pouvoir le déverrouiller
    actif.evented = true;
    actif.lockMovementX = true;
    actif.lockMovementY = true;
    actif.lockScalingX = true;
    actif.lockScalingY = true;
    actif.lockRotation = true;
    actif.hasControls = false;
    
    // Indicateur visuel
    if (actif.stroke) {
      actif.originalStroke = actif.stroke;
      actif.stroke = '#ff9800';
      actif.strokeWidth = (actif.strokeWidth || 2) + 1;
    } else {
      actif.originalFill = actif.fill;
      actif.fill = actif.fill ? actif.fill.replace('0.3', '0.2').replace('0.4', '0.3') : actif.fill;
    }
  }
  
  canvas.renderAll();
  
  // Mettre à jour le menu
  afficherMenuContextuel(actif, canvas, canvasRef, contextMenuRef);
};

/**
 * Supprimer l'objet actif via le menu contextuel
 */
export const supprimerObjetActif = (canvas) => {
  if (!canvas) return;
  
  const actif = canvas.getActiveObject();
  if (!actif) return;
  
  if (actif.locked) {
    logger.warn('MenuContextuel', 'Objet verrouillé - déverrouillez d\'abord');
    return;
  }
  
  if (!actif.isGridLine && !actif.isImageFond) {
    canvas.remove(actif);
    canvas.renderAll();
  }
};

