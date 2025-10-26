/**
 * Système unifié pour la gestion des plans 2D/3D
 * Centralise toutes les fonctions communes et les rend réutilisables
 */

import * as THREE from 'three';
import { 
  ECHELLE_PIXELS_PAR_METRE,
  DEFAULTS_OBJETS,
  LOD_DISTANCES,
  COULEURS,
  MATERIAUX,
  LUMIERES,
  OMBRES,
  CONTROLES,
  CAMERA,
  PERFORMANCE
} from '../../config/unifiedConstants';

// ========== CONSTANTES UNIFIÉES ==========
export const PLAN_CONSTANTS = {
  ECHELLE: ECHELLE_PIXELS_PAR_METRE,
  DEFAULTS: DEFAULTS_OBJETS,
  LOD_DISTANCES,
  COULEURS,
  MATERIAUX,
  LUMIERES,
  OMBRES,
  CONTROLES,
  CAMERA,
  PERFORMANCE
};

// ========== CONVERSION 2D → 3D ==========
export class PlanConverter {
  static convert2DTo3D(planData, options = {}) {
    const {
      echelle = PLAN_CONSTANTS.ECHELLE,
      anneeProjection = 0,
      solTransparent = true,
      dimensions = { largeur: 30, hauteur: 30 }
    } = options;

    const data3D = {
      maisons: [],
      citernes: [],
      canalisations: [],
      clotures: [],
      terrasses: [],
      paves: [],
      arbres: []
    };

    // Convertir les maisons
    if (planData.maisons?.length > 0) {
      data3D.maisons = planData.maisons.map(maison => 
        this.convertMaison(maison, echelle)
      );
    }

    // Convertir les arbres
    if (planData.arbres?.length > 0) {
      data3D.arbres = planData.arbres.map(arbre => 
        this.convertArbre(arbre, echelle, anneeProjection, solTransparent)
      );
    }

    // Convertir les citernes
    if (planData.citernes?.length > 0) {
      data3D.citernes = planData.citernes.map(citerne => 
        this.convertCiterne(citerne, echelle)
      );
    }

    return data3D;
  }

  static convertMaison(maison, echelle) {
    const largeur = (maison.getScaledWidth ? maison.getScaledWidth() : maison.width) / echelle;
    const profondeur = (maison.getScaledHeight ? maison.getScaledHeight() : maison.height) / echelle;
    const posX = maison.left / echelle;
    const posZ = maison.top / echelle;

    return {
      position: [posX, 0, posZ],
      largeur,
      profondeur,
      hauteur: maison.hauteurBatiment || PLAN_CONSTANTS.DEFAULTS.MAISON.hauteur,
      profondeurFondations: maison.profondeurFondations || PLAN_CONSTANTS.DEFAULTS.MAISON.profondeurFondations,
      angle: maison.angle || 0,
      typeToit: maison.typeToit || PLAN_CONSTANTS.DEFAULTS.MAISON.typeToit,
      penteToit: maison.penteToit || PLAN_CONSTANTS.DEFAULTS.MAISON.penteToit,
      orientationToit: maison.orientationToit || PLAN_CONSTANTS.DEFAULTS.MAISON.orientationToit,
      customType: 'maison'
    };
  }

  static convertArbre(arbre, echelle, anneeProjection = 0, solTransparent = true) {
    const arbreWidth = arbre.getScaledWidth ? arbre.getScaledWidth() : arbre.width;
    const arbreHeight = arbre.getScaledHeight ? arbre.getScaledHeight() : arbre.height;
    const envergureMax = Math.max(arbreWidth, arbreHeight) / echelle;
    const posX = arbre.left / echelle;
    const posZ = arbre.top / echelle;

    return {
      position: [posX, 0, posZ],
      arbreData: arbre.arbreData,
      hauteur: this.parseHauteur(arbre.arbreData?.tailleMaturite) || PLAN_CONSTANTS.DEFAULTS.ARBRE.hauteur,
      envergure: envergureMax,
      profondeurRacines: solTransparent ? (envergureMax * 0.3) : 0,
      validationStatus: 'ok',
      anneeProjection,
      elevationSol: arbre.elevationSol || PLAN_CONSTANTS.DEFAULTS.ARBRE.elevationSol,
      customType: 'arbre-a-planter'
    };
  }

  static convertCiterne(citerne, echelle) {
    const diametre = (citerne.getScaledWidth ? citerne.getScaledWidth() : citerne.width) / echelle;
    const posX = citerne.left / echelle;
    const posZ = citerne.top / echelle;

    return {
      position: [posX, 0, posZ],
      diametre,
      profondeur: citerne.profondeur || PLAN_CONSTANTS.DEFAULTS.CITERNE.profondeur,
      elevationSol: citerne.elevationSol || PLAN_CONSTANTS.DEFAULTS.CITERNE.elevationSol,
      customType: 'citerne'
    };
  }

  static parseHauteur(tailleMaturite) {
    if (!tailleMaturite) return PLAN_CONSTANTS.DEFAULTS.ARBRE.hauteur;
    
    const match = tailleMaturite.match(/(\d+(?:\.\d+)?)\s*m/);
    if (match) {
      return parseFloat(match[1]);
    }
    
    return PLAN_CONSTANTS.DEFAULTS.ARBRE.hauteur;
  }
}

// ========== GÉOMÉTRIES UNIFIÉES ==========
export class GeometryFactory {
  static createToitGeometry(typeToit, largeur, profondeur, hauteurToit, orientationToit = 0) {
    switch (typeToit) {
      case 'plat':
        return new THREE.BoxGeometry(largeur, 0.2, profondeur);
        
      case 'monopente':
        return this.createToitMonopente(largeur, profondeur, hauteurToit, orientationToit);
        
      case '2pans':
      default:
        return this.createToit2Pans(largeur, profondeur, hauteurToit);
    }
  }

  static createToitMonopente(largeur, profondeur, hauteurToit, orientationToit) {
    const shape = new THREE.Shape();
    
    if (orientationToit === 0 || orientationToit === 180) {
      const dimensionPente = Math.max(largeur, profondeur);
      shape.moveTo(-dimensionPente / 2, 0);
      shape.lineTo(dimensionPente / 2, 0);
      shape.lineTo(dimensionPente / 2, hauteurToit);
      shape.lineTo(-dimensionPente / 2, 0);
    } else {
      const dimensionPente = Math.min(largeur, profondeur);
      shape.moveTo(-dimensionPente / 2, 0);
      shape.lineTo(dimensionPente / 2, 0);
      shape.lineTo(dimensionPente / 2, hauteurToit);
      shape.lineTo(-dimensionPente / 2, 0);
    }
    
    const extrudeSettings = {
      steps: 1,
      depth: orientationToit === 0 || orientationToit === 180 ? 
             Math.min(largeur, profondeur) : 
             Math.max(largeur, profondeur),
      bevelEnabled: false
    };
    
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }

  static createToit2Pans(largeur, profondeur, hauteurToit) {
    const shape = new THREE.Shape();
    shape.moveTo(-largeur / 2, 0);
    shape.lineTo(0, hauteurToit);
    shape.lineTo(largeur / 2, 0);
    shape.lineTo(-largeur / 2, 0);
    
    const extrudeSettings = {
      steps: 1,
      depth: profondeur,
      bevelEnabled: false
    };
    
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }

  static createArbreGeometry(hauteur, envergure, lod = 'high') {
    const segments = lod === 'high' ? 16 : lod === 'medium' ? 8 : 6;
    const sphereSegments = lod === 'high' ? 24 : lod === 'medium' ? 16 : 8;
    
    return {
      tronc: new THREE.CylinderGeometry(0.1, 0.15, hauteur, segments),
      feuillage: new THREE.SphereGeometry(envergure / 2, sphereSegments, Math.floor(sphereSegments * 0.75))
    };
  }
}

// ========== MATÉRIAUX UNIFIÉS ==========
export class MaterialFactory {
  static createToitMaterial(typeToit) {
    const colors = {
      plat: '#666666',
      monopente: '#8B0000',
      '2pans': '#b71c1c'
    };

    return new THREE.MeshStandardMaterial({
      color: colors[typeToit] || colors['2pans'],
      roughness: 0.7,
      metalness: 0.1,
      side: THREE.DoubleSide
    });
  }

  static createArbreMaterial(saison, arbreData) {
    const couleurs = {
      hiver: arbreData?.feuillage?.type === 'Caduc' ? '#8B4513' : '#1b5e20',
      printemps: '#7cb342',
      ete: '#2e7d32',
      automne: '#d84315'
    };

    return new THREE.MeshStandardMaterial({
      color: couleurs[saison] || '#2e7d32',
      transparent: true,
      opacity: 0.8,
      roughness: 0.85
    });
  }

  static createMaisonMaterial() {
    return new THREE.MeshStandardMaterial({
      color: '#f5e6d3',
      roughness: 0.8,
      metalness: 0.05
    });
  }
}

// ========== CALCULS UNIFIÉS ==========
export class CalculationUtils {
  static calculateToitHeight(penteToit, largeur) {
    return Math.tan((penteToit * Math.PI) / 180) * (largeur / 2);
  }

  static calculateArbreGrowth(anneeProjection, hauteurMax, envergureMax) {
    const progression = Math.min(anneeProjection / 20, 1);
    return {
      hauteur: 2 + (hauteurMax - 2) * progression,
      envergure: 0.8 + (envergureMax - 0.8) * progression
    };
  }

  static getLODLevel(distance, maxDistance = 100) {
    if (distance < maxDistance * PLAN_CONSTANTS.LOD_DISTANCES.HIGH) return 'high';
    if (distance < maxDistance * PLAN_CONSTANTS.LOD_DISTANCES.MEDIUM) return 'medium';
    return 'low';
  }
}

// ========== VALIDATION UNIFIÉE ==========
export class ValidationUtils {
  static validateArbre(arbre, maisonsBounds) {
    // Logique de validation des arbres
    return {
      status: 'ok',
      message: 'Arbre valide'
    };
  }

  static validateMaison(maison, autresMaisons) {
    // Logique de validation des maisons
    return {
      status: 'ok',
      message: 'Maison valide'
    };
  }
}

// ========== CACHE UNIFIÉ ==========
export class UnifiedCache {
  constructor() {
    this.geometries = new Map();
    this.materials = new Map();
    this.maxSize = 100;
  }

  getGeometry(key, creator) {
    if (this.geometries.has(key)) {
      return this.geometries.get(key);
    }
    
    const geometry = creator();
    this.geometries.set(key, geometry);
    return geometry;
  }

  getMaterial(key, creator) {
    if (this.materials.has(key)) {
      return this.materials.get(key);
    }
    
    const material = creator();
    this.materials.set(key, material);
    return material;
  }

  clear() {
    this.geometries.forEach(geometry => geometry.dispose());
    this.materials.forEach(material => material.dispose());
    this.geometries.clear();
    this.materials.clear();
  }
}

// Instance globale du cache
export const unifiedCache = new UnifiedCache();

export default {
  PlanConverter,
  GeometryFactory,
  MaterialFactory,
  CalculationUtils,
  ValidationUtils,
  UnifiedCache,
  unifiedCache,
  PLAN_CONSTANTS
};
