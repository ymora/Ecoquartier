/**
 * constants.js
 * Constantes globales du projet
 * Centralise les valeurs utilisées dans toute l'application
 */

// ========== ÉCHELLE ET DIMENSIONS ==========

/**
 * Échelle de conversion pixels/mètres
 * IMPORTANT : Utilisé à la fois en 2D et 3D pour la cohérence
 * 30 pixels = 1 mètre (unifié avec le code 3D)
 */
export const ECHELLE_PIXELS_PAR_METRE = 30;

/**
 * Dimensions par défaut du terrain (en mètres)
 */
export const DIMENSIONS_TERRAIN_DEFAUT = {
  largeur: 30,
  hauteur: 30
};

// ========== MAISON ==========

/**
 * Profondeur des fondations par défaut (en mètres)
 */
export const PROFONDEUR_FONDATIONS_DEFAUT = 1.2;

/**
 * Hauteur de bâtiment par défaut (en mètres)
 */
export const HAUTEUR_MAISON_DEFAUT = 7;

// ========== CANALISATIONS ==========

/**
 * Profondeur de canalisation par défaut (en mètres)
 */
export const PROFONDEUR_CANALISATION_DEFAUT = 0.6;

/**
 * Diamètre de canalisation par défaut (en mètres)
 */
export const DIAMETRE_CANALISATION_DEFAUT = 0.1;

// ========== CITERNES ==========

/**
 * Profondeur de citerne par défaut (en mètres)
 */
export const PROFONDEUR_CITERNE_DEFAUT = 2.5;

/**
 * Volume de citerne par défaut (en litres)
 */
export const VOLUME_CITERNE_DEFAUT = 3000;

/**
 * Diamètre de citerne par défaut (en mètres)
 */
export const DIAMETRE_CITERNE_DEFAUT = 1.5;

// ========== CLÔTURES ==========

/**
 * Hauteur de clôture par défaut (en mètres)
 */
export const HAUTEUR_CLOTURE_DEFAUT = 1.5;

/**
 * Épaisseur de clôture par défaut (en mètres)
 */
export const EPAISSEUR_CLOTURE_DEFAUT = 0.05;

// ========== ARBRES ==========

/**
 * Taille arbre à la plantation (en mètres)
 */
export const TAILLE_PLANTATION = {
  hauteur: 2,
  envergure: 0.8,
  diametreTronc: 0.05
};

/**
 * Vitesses de croissance (cm/an)
 */
export const VITESSES_CROISSANCE = {
  rapide: 50,
  moyenne: 30,
  lente: 15
};

/**
 * Années pour atteindre maturité selon vitesse
 */
export const ANNEES_MATURITE = {
  rapide: 12,
  moyenne: 17,
  lente: 25
};

// ========== SOLS ==========

/**
 * Couches de sol par défaut (total 3m)
 */
export const COUCHES_SOL_DEFAUT = [
  { nom: 'Terre végétale', profondeur: 30, couleur: '#795548', type: 'terre' },
  { nom: 'Marne calcaire', profondeur: 270, couleur: '#bdbdbd', type: 'marne' }
];

// ========== ORIENTATION ==========

/**
 * Orientations possibles du terrain
 */
export const ORIENTATIONS = {
  NORD_HAUT: 'nord-haut',
  SUD_HAUT: 'sud-haut',
  EST_HAUT: 'est-haut',
  OUEST_HAUT: 'ouest-haut'
};

// ========== VALIDATION ==========

/**
 * Distances minimales légales (en mètres)
 * Basées sur le Code Civil Art. 671
 */
export const DISTANCES_MINIMALES = {
  voisinage: 2, // Distance minimale par rapport à la limite de propriété
  fondations: {
    racinaire_agressive: 5,
    racinaire_moderee: 3
  },
  canalisations: {
    racinaire_agressive: 4,
    racinaire_moderee: 3
  },
  fossesSeptiques: 6,
  entreArbres: 5
};

// ========== ZOOM ET PAN ==========

/**
 * Limites de zoom
 */
export const ZOOM_LIMITES = {
  min: 0.5, // 50%
  max: 3 // 300%
};

/**
 * Vitesse du zoom avec molette
 */
export const ZOOM_VITESSE = 0.999;

// ========== SNAP ==========

/**
 * Taille de snap à la grille (en pixels)
 */
export const SNAP_SIZE_FACTEUR = 0.05; // 5% de l'échelle

// ========== TIMELINE ==========

/**
 * Années de projection min/max
 */
export const ANNEES_PROJECTION = {
  min: 0,
  max: 20
};

// ========== MESSAGES ==========

/**
 * Messages de validation
 */
export const MESSAGES_VALIDATION = {
  tropProcheMaison: 'Trop proche de la maison',
  tropProcheCanalisation: 'Trop proche de la canalisation',
  tropProcheCloture: 'Trop proche de la clôture',
  tropProcheCiterne: 'Trop proche de la citerne/fosse',
  tropProcheArbre: 'Trop proche d\'un autre arbre',
  racinesTouchentFondations: 'Racines touchent les fondations',
  racinesTouchentCanalisation: 'Racines touchent la canalisation'
};

