/**
 * Configuration centralisée du planificateur de terrain
 * Modifiable facilement pour maintenance et évolutions
 */

// ========== ÉCHELLES ET MESURES ==========
export const ECHELLE = 30; // 30 pixels = 1 mètre (modifiable pour zoom)
export const GRILLE_TAILLE = 1; // 1 mètre par carreau

// ========== ANGLES SOLAIRES (France métropolitaine ~48°N) ==========
export const ANGLES_SOLAIRES = {
  hiver: 18,      // 21 décembre : soleil bas
  printemps: 45,  // 21 mars : équinoxe
  ete: 65,        // 21 juin : soleil haut
  automne: 45     // 21 septembre : équinoxe
};

export const LABELS_SAISONS = {
  hiver: '❄️ Hiver',
  printemps: '🌸 Printemps',
  ete: '☀️ Été',
  automne: '🍂 Automne'
};

// ========== VALEURS PAR DÉFAUT DES OBJETS ==========
export const DEFAULTS = {
  maison: {
    largeur: 10,              // mètres
    hauteur: 10,              // mètres
    hauteurBatiment: 7,       // hauteur en élévation (R+1)
    profondeurFondations: 1.2, // mètres
    typeFondations: 'semelles',
    fill: '#bdbdbd',
    stroke: '#424242'
  },
  
  canalisation: {
    longueur: 5,              // mètres
    profondeur: 0.6,          // mètres
    diametre: 0.1,            // mètres (10cm)
    stroke: '#9e9e9e',
    strokeWidth: 4
  },
  
  cloture: {
    longueur: 5,              // mètres
    stroke: '#ffd54f',
    strokeWidth: 2,
    strokeDashArray: [10, 5]
  },
  
  citerne: {
    largeur: 2,               // mètres
    hauteur: 3,               // mètres
    profondeur: 2.5,          // mètres sous terre
    volume: 3000,             // litres
    fill: 'rgba(33, 150, 243, 0.2)',
    stroke: '#1976d2'
  },
  
  paves: {
    largeur: 5,               // mètres
    hauteur: 5,               // mètres
    fill: 'rgba(139, 195, 74, 0.3)',
    stroke: '#689f38'
  },
  
  terrasse: {
    largeur: 4,               // mètres
    hauteur: 3,               // mètres
    fill: 'rgba(255, 224, 178, 0.4)',
    stroke: '#ff9800'
  },
  
  arbreExistant: {
    rayon: 2.5,               // mètres
    fill: 'rgba(76, 175, 80, 0.3)',
    stroke: '#388e3c'
  }
};

// ========== COMPOSITION DU SOL PAR DÉFAUT ==========
export const SOL_DEFAUT = [
  { 
    nom: 'Terre végétale', 
    profondeur: 30,        // cm
    couleur: '#8d6e63', 
    type: 'fertile' 
  },
  { 
    nom: 'Marne', 
    profondeur: 70,        // cm
    couleur: '#a1887f', 
    type: 'argileux' 
  }
];

export const TYPES_SOL = [
  'fertile',
  'argileux',
  'sableux',
  'calcaire',
  'rocheux'
];

// ========== ZONES DE CONTRAINTES ==========
export const ZONES_CONTRAINTES = {
  maison: {
    interdite: {
      fill: 'rgba(244, 67, 54, 0.08)',
      stroke: '#c62828',
      strokeDashArray: [8, 4]
    },
    attention: {
      fill: 'rgba(255, 152, 0, 0.05)',
      stroke: '#e65100',
      strokeDashArray: [5, 5],
      offset: 1 // mètre supplémentaire
    }
  },
  
  citerne: {
    fill: 'rgba(33, 150, 243, 0.08)',
    stroke: '#1976d2',
    strokeDashArray: [8, 4]
  },
  
  cloture: {
    fill: 'rgba(255, 193, 7, 0.08)',
    stroke: '#ffa726',
    strokeDashArray: [5, 5],
    offset: 2 // mètres de chaque côté
  }
};

// ========== OMBRE PORTÉE ==========
export const OMBRE_CONFIG = {
  fill: 'rgba(0, 0, 0, 0.25)',
  stroke: 'rgba(0, 0, 0, 0.4)',
  strokeWidth: 1,
  strokeDashArray: [5, 5]
};

// ========== VALIDATION DISTANCES ==========
export const DISTANCES_SECURITE = {
  // Marges de sécurité (en plus des distances légales)
  fondations: 0.5,          // mètres
  canalisations: 0.5,
  fossesSeptiques: 1,
  clotures: 0.5,
  entreArbres: 1
};

// ========== DIMENSIONS TRONC ==========
export const TRONC = {
  diametreDefaut: 0.3,      // mètres (30cm)
  fill: 'rgba(139, 69, 19, 0.2)',
  stroke: '#8b4513',
  strokeWidth: 2,
  strokeDashArray: [5, 5]
};

// ========== TIMELINE ==========
export const TIMELINE = {
  anneeMin: 0,
  anneeMax: 20,
  anneeMaturite: 20,        // À partir de quand on considère la maturité
  anneeDefaut: 20           // Projection par défaut
};

// ========== DASHBOARD STATISTIQUES ==========
export const DASHBOARD = {
  refreshInterval: 2000,    // ms (rafraîchissement)
  scores: {
    biodiversite: {
      mellifere: 30,
      fructification: 25,
      diversite: 20,
      plantes_locales: 15
    }
  },
  entretien: {
    tempsParArbre: 0.5      // heures/mois
  },
  arrosage: {
    regulier: 50,           // L/semaine
    abondant: 100,
    modere: 30,
    minimum: 20
  }
};

// ========== COULEURS DE VALIDATION ==========
export const VALIDATION_COLORS = {
  ok: {
    fill: 'rgba(129, 199, 132, 0.6)',
    stroke: '#2e7d32'
  },
  warning: {
    fill: 'rgba(255, 152, 0, 0.6)',
    stroke: '#e65100'
  },
  error: {
    fill: 'rgba(244, 67, 54, 0.6)',
    stroke: '#c62828'
  }
};

// ========== RACCOURCIS CLAVIER ==========
export const KEYBOARD_SHORTCUTS = {
  delete: ['Delete', 'Suppr'],
  duplicate: ['Control+d', 'Meta+d'],
  arrowUp: 'ArrowUp',
  arrowDown: 'ArrowDown',
  arrowLeft: 'ArrowLeft',
  arrowRight: 'ArrowRight',
  escape: 'Escape'
};

// ========== SAUVEGARDE ==========
export const STORAGE = {
  key: 'planTerrain',
  autoSave: true,
  autoSaveInterval: 5000    // ms
};

// ========== CANVAS ==========
export const CANVAS_CONFIG = {
  backgroundColor: '#f0f4f0',
  selection: true,
  preserveObjectStacking: true
};

// ========== Z-INDEX LAYERS ==========
export const Z_INDEX = {
  grid: 0,
  imageFond: 1,
  ombre: 2,
  zonesContraintes: 3,
  objetsUtilisateur: 100,
  lignesMesure: 200,
  labels: 300,
  ui: 400
};

// ========== MESSAGES LÉGAUX ==========
export const MESSAGES_LEGAUX = {
  troncDepasse: (dist, min) => 
    `⚖️ ILLÉGAL: Tronc dépasse votre limite de propriété (${dist.toFixed(1)}m < ${min.toFixed(1)}m) - Voisin peut exiger arrachage`,
  
  distanceVoisinage: (dist, requis, article, sanction) =>
    `⚖️ DISTANCE LÉGALE NON RESPECTÉE: ${dist.toFixed(1)}m < ${requis}m requis (${article}) - ${sanction}`,
  
  procheVoisinage: (dist, minimum) =>
    `⚠️ Proche limite voisinage (${dist.toFixed(1)}m, ${minimum}m légal minimum)`
};

// ========== EXPORT FONCTIONS UTILITAIRES ==========
export const getEchellePx = (metres) => metres * ECHELLE;
export const getMetres = (pixels) => pixels / ECHELLE;
export const getAngleSolaire = (saison) => ANGLES_SOLAIRES[saison] || ANGLES_SOLAIRES.ete;
export const getLongueurOmbre = (hauteurBatiment, angleSoleil) => {
  const angleRad = (angleSoleil * Math.PI) / 180;
  return hauteurBatiment / Math.tan(angleRad);
};

