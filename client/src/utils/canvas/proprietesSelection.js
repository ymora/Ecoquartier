/**
 * Propriétés de sélection standardisées pour tous les objets Fabric.js
 * Évite la duplication de code dans la création d'objets
 */

export const PROPRIETES_SELECTION_STANDARD = {
  // Propriétés de base
  selectable: true,
  evented: true,
  hasBorders: true,
  hasControls: true,
  
  // Propriétés de transformation
  lockScalingX: false,
  lockScalingY: false,
  lockRotation: false,
  
  // Propriétés visuelles des contrôles
  cornerSize: 12,
  cornerStyle: 'circle',
  transparentCorners: false
};

/**
 * Propriétés de sélection par type d'objet avec couleurs spécifiques
 */
export const PROPRIETES_SELECTION_PAR_TYPE = {
  maison: {
    ...PROPRIETES_SELECTION_STANDARD,
    cornerColor: '#4caf50'
  },
  terrasse: {
    ...PROPRIETES_SELECTION_STANDARD,
    cornerColor: '#9e9e9e'
  },
  paves: {
    ...PROPRIETES_SELECTION_STANDARD,
    cornerColor: '#8bc34a'
  },
  'caisson-eau': {
    ...PROPRIETES_SELECTION_STANDARD,
    cornerColor: '#1565c0'
  },
  citerne: {
    ...PROPRIETES_SELECTION_STANDARD,
    cornerColor: '#2196f3'
  },
  'arbre-a-planter': {
    ...PROPRIETES_SELECTION_STANDARD,
    cornerColor: '#4caf50'
  },
  canalisation: {
    ...PROPRIETES_SELECTION_STANDARD,
    cornerColor: '#757575'
  },
  cloture: {
    ...PROPRIETES_SELECTION_STANDARD,
    cornerColor: '#ffd54f'
  }
};

/**
 * Appliquer les propriétés de sélection à un objet selon son type
 * @param {fabric.Object} objet - Objet Fabric.js
 * @param {string} type - Type d'objet (maison, terrasse, etc.)
 */
export const appliquerProprietesSelection = (objet, type) => {
  const proprietes = PROPRIETES_SELECTION_PAR_TYPE[type] || PROPRIETES_SELECTION_STANDARD;
  objet.set(proprietes);
  return objet;
};
