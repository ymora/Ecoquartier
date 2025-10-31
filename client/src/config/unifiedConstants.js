/**
 * Constantes unifiées pour la plage plan 2D/3D
 * Centralise toutes les constantes communes
 */

// ========== ÉCHELLES ET DIMENSIONS ==========
export const ECHELLE_PIXELS_PAR_METRE = 10;
export const DIMENSIONS_PLAN = {
  LARGEUR: 30,
  HAUTEUR: 30,
  PROFONDEUR: 20
};

// ========== DÉFAUTS D'OBJETS ==========
export const DEFAULTS_OBJETS = {
  MAISON: {
    hauteur: 7,
    profondeurFondations: 1.2,
    typeToit: '2pans',
    penteToit: 30,
    orientationToit: 0,
    angle: 0
  },
  ARBRE: {
    hauteur: 6,
    envergure: 4,
    profondeurRacines: 1.5,
    elevationSol: 0
  },
  CITERNE: {
    diametre: 1.5,
    profondeur: 2.5,
    elevationSol: 0
  }
};

// ========== NIVEAUX DE DÉTAIL (LOD) ==========
export const LOD_DISTANCES = {
  HIGH: 0.3,
  MEDIUM: 0.6,
  LOW: 1.0
};

export const LOD_SEGMENTS = {
  HIGH: {
    cylinder: 16,
    sphere: 24,
    box: 1
  },
  MEDIUM: {
    cylinder: 8,
    sphere: 16,
    box: 1
  },
  LOW: {
    cylinder: 6,
    sphere: 8,
    box: 1
  }
};

// ========== COULEURS ==========
export const COULEURS = {
  MAISON: {
    murs: '#f5e6d3',
    fondations: '#666666',
    sousSol: '#999999',
    toit: {
      plat: '#666666',
      monopente: '#8B0000',
      '2pans': '#b71c1c'
    },
    fenetre: '#4a90e2',
    porte: '#8b4513',
    cheminee: '#8b4513'
  },
  ARBRE: {
    tronc: '#8B4513',
    racines: '#654321',
    feuillage: {
      printemps: '#7cb342',
      ete: '#2e7d32',
      automne: '#d84315',
      hiver: '#8B4513'
    }
  },
  CITERNE: {
    principal: '#4a90e2',
    bordure: '#2c5aa0'
  },
  SOL: {
    principal: '#90EE90',
    grille: '#888888',
    grilleSecondaire: '#cccccc'
  },
  VALIDATION: {
    ok: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336'
  }
};

// ========== MATÉRIAUX ==========
export const MATERIAUX = {
  ROUGHNESS: {
    MAISON: 0.8,
    ARBRE: 0.85,
    CITERNE: 0.3,
    SOL: 0.8
  },
  METALNESS: {
    MAISON: 0.05,
    ARBRE: 0.1,
    CITERNE: 0.7,
    SOL: 0.0
  },
  OPACITY: {
    FONDATIONS: 0.4,
    SOUS_SOL: 0.6,
    RACINES: 0.7,
    SOL_TRANSPARENT: 0.3
  }
};

// ========== LUMIÈRES ==========
export const LUMIERES = {
  AMBIENTE: {
    intensity: 0.4
  },
  DIRECTIONNELLE: {
    position: [10, 10, 5],
    intensity: 1,
    castShadow: true,
    shadowMapSize: 2048
  },
  ENVIRONNEMENT: {
    preset: 'sunset',
    background: false,
    intensity: 0.5
  }
};

// ========== OMBRES ==========
export const OMBRES = {
  CONTACT: {
    position: [0, -0.1, 0],
    opacity: 0.25,
    width: 20,
    height: 20,
    blur: 1,
    far: 50
  }
};

// ========== CONTRÔLES ==========
export const CONTROLES = {
  ORBIT: {
    enablePan: true,
    enableZoom: true,
    enableRotate: true,
    minDistance: 5,
    maxDistance: 50,
    maxPolarAngle: Math.PI / 2
  }
};

// ========== CAMÉRA ==========
export const CAMERA = {
  position: [15, 15, 15],
  fov: 50,
  near: 0.1,
  far: 1000
};

// ========== PERFORMANCE ==========
export const PERFORMANCE = {
  LOW_END_DEVICE: {
    memoryThreshold: 4, // GB
    coresThreshold: 4,
    antialias: false,
    powerPreference: 'low-power'
  },
  HIGH_END_DEVICE: {
    antialias: true,
    powerPreference: 'high-performance'
  }
};

// ========== SAISONS ==========
export const SAISONS = [
  { value: 'printemps', label: 'Printemps' },
  { value: 'ete', label: 'Été' },
  { value: 'automne', label: 'Automne' },
  { value: 'hiver', label: 'Hiver' }
];

// ========== TYPES DE TOIT ==========
export const TYPES_TOIT = [
  { value: '2pans', label: '2 pans' },
  { value: 'plan', label: 'Plan' },
  { value: 'monopente', label: 'Monopente' }
];

// ========== LIMITES DE VALIDATION ==========
export const LIMITES_VALIDATION = {
  MAISON: {
    largeur: { min: 1, max: 50 },
    profondeur: { min: 1, max: 50 },
    hauteur: { min: 1, max: 20 },
    angle: { min: -180, max: 180 },
    penteToit: { min: 0, max: 60 },
    orientationToit: { min: 0, max: 360 }
  },
  ARBRE: {
    hauteur: { min: 1, max: 30 },
    envergure: { min: 1, max: 20 },
    elevationSol: { min: -5, max: 5 }
  }
};

// ========== CONFIGURATION RENDU ==========
export const CONFIG_RENDU = {
  SHADOWS: {
    enabled: true,
    type: 2, // PCFSoftShadowMap
    willChange: 'transform'
  },
  RENDERER: {
    alpha: true,
    antialias: true
  }
};

// ========== MESSAGES ==========
export const MESSAGES = {
  CHARGEMENT: 'Chargement du plan 3D...',
  AUCUN_PLAN: 'Aucun plan chargé',
  OBJET_SELECTIONNE: 'Objet sélectionné',
  TYPE: 'Type',
  POSITION: 'Position',
  DIMENSIONS: 'Dimensions',
  HAUTEUR: 'Hauteur',
  ENVERGURE: 'Envergure',
  NOM: 'Nom',
  TYPE_TOIT: 'Type de toit',
  NON_SPECIFIE: 'Non spécifié'
};

// ========== EXPORT PAR DÉFAUT ==========
export default {
  ECHELLE_PIXELS_PAR_METRE,
  DIMENSIONS_PLAN,
  DEFAULTS_OBJETS,
  LOD_DISTANCES,
  LOD_SEGMENTS,
  COULEURS,
  MATERIAUX,
  LUMIERES,
  OMBRES,
  CONTROLES,
  CAMERA,
  PERFORMANCE,
  SAISONS,
  TYPES_TOIT,
  LIMITES_VALIDATION,
  CONFIG_RENDU,
  MESSAGES
};
