/**
 * menuContextuel.js
 * Gestion du menu contextuel (verrouiller/supprimer) affiché au-dessus des objets sélectionnés
 */

/**
 * Afficher le menu contextuel au-dessus d'un objet sélectionné
 */
export const afficherMenuContextuel = (obj, canvas, canvasRef, contextMenuRef) => {
  if (!obj || obj.isGridLine || obj.isBoussole || obj.measureLabel || obj.isImageFond) {
    cacherMenuContextuel(contextMenuRef);
    return;
  }

  const menu = contextMenuRef.current;
  if (!menu) return;

  const canvasRect = canvasRef.current.getBoundingClientRect();
  const objCenter = obj.getCenterPoint();
  const objHeight = obj.getScaledHeight ? obj.getScaledHeight() : 50;
  const objWidth = obj.getScaledWidth ? obj.getScaledWidth() : 50;
  
  // POSITIONNEMENT INTELLIGENT pour éviter masquage
  let menuLeft = canvasRect.left + objCenter.x;
  let menuTop = canvasRect.top + objCenter.y - objHeight / 2 - 50;
  
  const menuWidth = 100;
  const menuHeight = 40;
  
  // Si trop en haut → Placer en dessous
  if (menuTop < canvasRect.top + 10) {
    menuTop = canvasRect.top + objCenter.y + objHeight / 2 + 10;
  }
  
  // Si trop à droite → Décaler à gauche
  if (menuLeft + menuWidth > canvasRect.right) {
    menuLeft = canvasRect.right - menuWidth - 10;
  }
  
  // Si trop à gauche → Décaler à droite
  if (menuLeft < canvasRect.left) {
    menuLeft = canvasRect.left + 10;
  }
  
  // Si trop en bas → Remonter
  if (menuTop + menuHeight > canvasRect.bottom) {
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
    alert('⚠️ Objet verrouillé - Déverrouillez d\'abord');
    return;
  }
  
  if (!actif.isGridLine && !actif.isImageFond) {
    canvas.remove(actif);
    canvas.renderAll();
  }
};

