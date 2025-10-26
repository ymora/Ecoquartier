/**
 * Système de logging complet pour tous les objets
 * Capture ABSOLUMENT TOUS les paramètres possibles de tous les objets
 */

import logger from '../logger';

/**
 * Extrait TOUS les paramètres d'un objet Fabric.js
 */
const extractAllObjectProperties = (obj) => {
  if (!obj) return null;

  const properties = {
    // === PROPRIÉTÉS DE BASE FABRIC ===
    id: obj.id,
    type: obj.type,
    left: obj.left,
    top: obj.top,
    width: obj.width,
    height: obj.height,
    scaleX: obj.scaleX,
    scaleY: obj.scaleY,
    angle: obj.angle,
    opacity: obj.opacity,
    visible: obj.visible,
    selectable: obj.selectable,
    evented: obj.evented,
    hasControls: obj.hasControls,
    hasBorders: obj.hasBorders,
    hasRotatingPoint: obj.hasRotatingPoint,
    hasMovingCursor: obj.hasMovingCursor,
    lockMovementX: obj.lockMovementX,
    lockMovementY: obj.lockMovementY,
    lockRotation: obj.lockRotation,
    lockScalingX: obj.lockScalingX,
    lockScalingY: obj.lockScalingY,
    lockSkewingX: obj.lockSkewingX,
    lockSkewingY: obj.lockSkewingY,
    lockUniScaling: obj.lockUniScaling,
    excludeFromExport: obj.excludeFromExport,
    
    // === PROPRIÉTÉS DE TRANSFORMATION ===
    originX: obj.originX,
    originY: obj.originY,
    centeredScaling: obj.centeredScaling,
    centeredRotation: obj.centeredRotation,
    flipX: obj.flipX,
    flipY: obj.flipY,
    skewX: obj.skewX,
    skewY: obj.skewY,
    
    // === PROPRIÉTÉS DE STYLE ===
    fill: obj.fill,
    stroke: obj.stroke,
    strokeWidth: obj.strokeWidth,
    strokeDashArray: obj.strokeDashArray,
    strokeLineCap: obj.strokeLineCap,
    strokeLineJoin: obj.strokeLineJoin,
    strokeMiterLimit: obj.strokeMiterLimit,
    shadow: obj.shadow,
    
    // === PROPRIÉTÉS DE POSITION ===
    absolutePositioned: obj.absolutePositioned,
    centeredRotation: obj.centeredRotation,
    centeredScaling: obj.centeredScaling,
    
    // === PROPRIÉTÉS CUSTOM (MÉTIER) ===
    customType: obj.customType,
    customId: obj.customId,
    
    // === PROPRIÉTÉS SPÉCIFIQUES PAR TYPE ===
    ...extractTypeSpecificProperties(obj)
  };

  // Supprimer les propriétés undefined/null
  Object.keys(properties).forEach(key => {
    if (properties[key] === undefined || properties[key] === null) {
      delete properties[key];
    }
  });

  return properties;
};

/**
 * Extrait les propriétés spécifiques selon le type d'objet
 */
const extractTypeSpecificProperties = (obj) => {
  const specific = {};

  // === MAISONS ===
  if (obj.customType === 'maison') {
    specific.profondeurFondations = obj.profondeurFondations;
    specific.hauteurBatiment = obj.hauteurBatiment;
    specific.typeToit = obj.typeToit;
    specific.penteToit = obj.penteToit;
    specific.orientationToit = obj.orientationToit;
    specific.materiauToit = obj.materiauToit;
    specific.couleurToit = obj.couleurToit;
    specific.nbEtages = obj.nbEtages;
    specific.surfaceHabitable = obj.surfaceHabitable;
    specific.orientation = obj.orientation;
    specific.anneeConstruction = obj.anneeConstruction;
    specific.isolation = obj.isolation;
    specific.chauffage = obj.chauffage;
    specific.energieRenouvelable = obj.energieRenouvelable;
  }

  // === ARBRES ===
  if (obj.customType === 'arbre-a-planter') {
    specific.arbreData = obj.arbreData;
    specific.espece = obj.espece;
    specific.variete = obj.variete;
    specific.hauteurMaturite = obj.hauteurMaturite;
    specific.envergureMaturite = obj.envergureMaturite;
    specific.hauteurActuelle = obj.hauteurActuelle;
    specific.envergureActuelle = obj.envergureActuelle;
    specific.anneePlantation = obj.anneePlantation;
    specific.anneeProjection = obj.anneeProjection;
    specific.elevationSol = obj.elevationSol;
    specific.profondeurRacines = obj.profondeurRacines;
    specific.distanceVoisin = obj.distanceVoisin;
    specific.distanceFondations = obj.distanceFondations;
    specific.distanceCanalisations = obj.distanceCanalisations;
    specific.validationStatus = obj.validationStatus;
    specific.validationMessage = obj.validationMessage;
    specific.reglementation = obj.reglementation;
    specific.entretien = obj.entretien;
    specific.periodiciteTaille = obj.periodiciteTaille;
    specific.derniereTaille = obj.derniereTaille;
    specific.prochaineTaille = obj.prochaineTaille;
    specific.coutPlantation = obj.coutPlantation;
    specific.coutEntretien = obj.coutEntretien;
    specific.beneficesEcologiques = obj.beneficesEcologiques;
    specific.impactVisuel = obj.impactVisuel;
    specific.impactSonore = obj.impactSonore;
    specific.impactLuminosite = obj.impactLuminosite;
    specific.resistanceSecheresse = obj.resistanceSecheresse;
    specific.resistanceGel = obj.resistanceGel;
    specific.typeSol = obj.typeSol;
    specific.phSol = obj.phSol;
    specific.drainage = obj.drainage;
    specific.exposition = obj.exposition;
    specific.vent = obj.vent;
    specific.pollution = obj.pollution;
    specific.parasites = obj.parasites;
    specific.maladies = obj.maladies;
    specific.traitements = obj.traitements;
    specific.observations = obj.observations;
    specific.photos = obj.photos;
    specific.documents = obj.documents;
  }

  // === CITERNES ===
  if (obj.customType === 'citerne') {
    specific.diametre = obj.diametre;
    specific.profondeur = obj.profondeur;
    specific.capacite = obj.capacite;
    specific.materiau = obj.materiau;
    specific.couleur = obj.couleur;
    specific.elevationSol = obj.elevationSol;
    specific.profondeurEnterree = obj.profondeurEnterree;
    specific.systemeRecuperation = obj.systemeRecuperation;
    specific.filtrage = obj.filtrage;
    specific.pompe = obj.pompe;
    specific.regulateur = obj.regulateur;
    specific.anneeInstallation = obj.anneeInstallation;
    specific.entretien = obj.entretien;
    specific.derniereMaintenance = obj.derniereMaintenance;
    specific.prochaineMaintenance = obj.prochaineMaintenance;
    specific.coutInstallation = obj.coutInstallation;
    specific.coutEntretien = obj.coutEntretien;
    specific.economiesEau = obj.economiesEau;
    specific.impactEnvironnemental = obj.impactEnvironnemental;
    specific.reglementation = obj.reglementation;
    specific.permis = obj.permis;
    specific.assurance = obj.assurance;
    specific.garantie = obj.garantie;
    specific.observations = obj.observations;
  }

  // === CAISSONS D'EAU ===
  if (obj.customType === 'caisson-eau') {
    specific.largeurCaisson = obj.largeurCaisson;
    specific.profondeurCaisson = obj.profondeurCaisson;
    specific.hauteurCaisson = obj.hauteurCaisson;
    specific.profondeurEnterree = obj.profondeurEnterree;
    specific.elevationSol = obj.elevationSol;
    specific.materiau = obj.materiau;
    specific.couleur = obj.couleur;
    specific.capacite = obj.capacite;
    specific.systemePompage = obj.systemePompage;
    specific.filtrage = obj.filtrage;
    specific.traitement = obj.traitement;
    specific.regulateur = obj.regulateur;
    specific.anneeInstallation = obj.anneeInstallation;
    specific.entretien = obj.entretien;
    specific.derniereMaintenance = obj.derniereMaintenance;
    specific.prochaineMaintenance = obj.prochaineMaintenance;
    specific.coutInstallation = obj.coutInstallation;
    specific.coutEntretien = obj.coutEntretien;
    specific.reglementation = obj.reglementation;
    specific.permis = obj.permis;
    specific.assurance = obj.assurance;
    specific.garantie = obj.garantie;
    specific.observations = obj.observations;
  }

  // === TERRASSES ===
  if (obj.customType === 'terrasse') {
    specific.hauteurDalle = obj.hauteurDalle;
    specific.materiauDalle = obj.materiauDalle;
    specific.couleurDalle = obj.couleurDalle;
    specific.finition = obj.finition;
    specific.elevationSol = obj.elevationSol;
    specific.pente = obj.pente;
    specific.drainage = obj.drainage;
    specific.isolation = obj.isolation;
    specific.chauffage = obj.chauffage;
    specific.eclairage = obj.eclairage;
    specific.amenagement = obj.amenagement;
    specific.mobilier = obj.mobilier;
    specific.vegetation = obj.vegetation;
    specific.anneeConstruction = obj.anneeConstruction;
    specific.entretien = obj.entretien;
    specific.derniereMaintenance = obj.derniereMaintenance;
    specific.prochaineMaintenance = obj.prochaineMaintenance;
    specific.coutConstruction = obj.coutConstruction;
    specific.coutEntretien = obj.coutEntretien;
    specific.reglementation = obj.reglementation;
    specific.permis = obj.permis;
    specific.observations = obj.observations;
  }

  // === PAVÉS ENHERBÉS ===
  if (obj.customType === 'paves') {
    specific.hauteurPaves = obj.hauteurPaves;
    specific.profondeurGravier = obj.profondeurGravier;
    specific.materiauPaves = obj.materiauPaves;
    specific.couleurPaves = obj.couleurPaves;
    specific.typeGravier = obj.typeGravier;
    specific.couleurGravier = obj.couleurGravier;
    specific.elevationSol = obj.elevationSol;
    specific.drainage = obj.drainage;
    specific.vegetation = obj.vegetation;
    specific.entretien = obj.entretien;
    specific.derniereMaintenance = obj.derniereMaintenance;
    specific.prochaineMaintenance = obj.prochaineMaintenance;
    specific.coutInstallation = obj.coutInstallation;
    specific.coutEntretien = obj.coutEntretien;
    specific.reglementation = obj.reglementation;
    specific.observations = obj.observations;
  }

  // === CLÔTURES ===
  if (obj.customType === 'cloture') {
    specific.x1 = obj.x1;
    specific.y1 = obj.y1;
    specific.x2 = obj.x2;
    specific.y2 = obj.y2;
    specific.hauteurCloture = obj.hauteurCloture;
    specific.epaisseur = obj.epaisseur;
    specific.materiau = obj.materiau;
    specific.couleur = obj.couleur;
    specific.finition = obj.finition;
    specific.portail = obj.portail;
    specific.portillon = obj.portillon;
    specific.serrure = obj.serrure;
    specific.eclairage = obj.eclairage;
    specific.anneeInstallation = obj.anneeInstallation;
    specific.entretien = obj.entretien;
    specific.derniereMaintenance = obj.derniereMaintenance;
    specific.prochaineMaintenance = obj.prochaineMaintenance;
    specific.coutInstallation = obj.coutInstallation;
    specific.coutEntretien = obj.coutEntretien;
    specific.reglementation = obj.reglementation;
    specific.permis = obj.permis;
    specific.observations = obj.observations;
  }

  // === CANALISATIONS ===
  if (obj.customType === 'canalisation') {
    specific.x1 = obj.x1;
    specific.y1 = obj.y1;
    specific.x2 = obj.x2;
    specific.y2 = obj.y2;
    specific.profondeur = obj.profondeur;
    specific.diametreCanalisation = obj.diametreCanalisation;
    specific.materiau = obj.materiau;
    specific.couleur = obj.couleur;
    specific.type = obj.type;
    specific.fonction = obj.fonction;
    specific.pression = obj.pression;
    specific.debit = obj.debit;
    specific.isolation = obj.isolation;
    specific.protection = obj.protection;
    specific.anneeInstallation = obj.anneeInstallation;
    specific.entretien = obj.entretien;
    specific.derniereMaintenance = obj.derniereMaintenance;
    specific.prochaineMaintenance = obj.prochaineMaintenance;
    specific.coutInstallation = obj.coutInstallation;
    specific.coutEntretien = obj.coutEntretien;
    specific.reglementation = obj.reglementation;
    specific.permis = obj.permis;
    specific.observations = obj.observations;
  }

  // === IMAGES DE FOND ===
  if (obj.isImageFond) {
    specific.imageUrl = obj.src;
    specific.imageWidth = obj.width;
    specific.imageHeight = obj.height;
    specific.imageScale = obj.scaleX;
    specific.imageOpacity = obj.opacity;
    specific.imagePosition = { left: obj.left, top: obj.top };
    specific.imageRotation = obj.angle;
    specific.imageFlipped = { x: obj.flipX, y: obj.flipY };
    specific.imageSkewed = { x: obj.skewX, y: obj.skewY };
    specific.imageShadow = obj.shadow;
    specific.imageFilters = obj.filters;
    specific.imageCrop = obj.cropX || obj.cropY;
    specific.imageBrightness = obj.brightness;
    specific.imageContrast = obj.contrast;
    specific.imageSaturation = obj.saturation;
    specific.imageHue = obj.hue;
    specific.imageBlur = obj.blur;
    specific.imageGrayscale = obj.grayscale;
    specific.imageSepia = obj.sepia;
    specific.imageInvert = obj.invert;
    specific.imagePixelate = obj.pixelate;
    specific.imageVintage = obj.vintage;
    specific.imageKodachrome = obj.kodachrome;
    specific.imagePolaroid = obj.polaroid;
    specific.imageTechnicolor = obj.technicolor;
    specific.imageBrownie = obj.brownie;
    specific.imageVintage = obj.vintage;
    specific.imageLomo = obj.lomo;
    specific.imageDuotone = obj.duotone;
    specific.imageTint = obj.tint;
    specific.imageBlendColor = obj.blendColor;
    specific.imageBlendMode = obj.blendMode;
    specific.imageBlendAlpha = obj.blendAlpha;
    specific.imageBlendRed = obj.blendRed;
    specific.imageBlendGreen = obj.blendGreen;
    specific.imageBlendBlue = obj.blendBlue;
    specific.imageBlendAlpha = obj.blendAlpha;
  }

  // === LIGNES DE MESURE ===
  if (obj.isLigneMesure) {
    specific.x1 = obj.x1;
    specific.y1 = obj.y1;
    specific.x2 = obj.x2;
    specific.y2 = obj.y2;
    specific.distance = obj.distance;
    specific.unite = obj.unite;
    specific.precision = obj.precision;
    specific.couleur = obj.stroke;
    specific.epaisseur = obj.strokeWidth;
    specific.style = obj.strokeDashArray;
    specific.texte = obj.text;
    specific.tailleTexte = obj.fontSize;
    specific.couleurTexte = obj.fill;
    specific.positionTexte = obj.textPosition;
    specific.angleTexte = obj.textAngle;
    specific.offsetTexte = obj.textOffset;
    specific.backgroundTexte = obj.textBackground;
    specific.borderTexte = obj.textBorder;
    specific.paddingTexte = obj.textPadding;
    specific.radiusTexte = obj.textRadius;
    specific.shadowTexte = obj.textShadow;
    specific.fontTexte = obj.fontFamily;
    specific.weightTexte = obj.fontWeight;
    specific.styleTexte = obj.fontStyle;
    specific.decorationTexte = obj.textDecoration;
    specific.alignTexte = obj.textAlign;
    specific.baselineTexte = obj.textBaseline;
    specific.directionTexte = obj.textDirection;
    specific.overflowTexte = obj.textOverflow;
    specific.whiteSpaceTexte = obj.whiteSpace;
    specific.wordBreakTexte = obj.wordBreak;
    specific.wordWrapTexte = obj.wordWrap;
    specific.lineHeightTexte = obj.lineHeight;
    specific.letterSpacingTexte = obj.letterSpacing;
    specific.textIndentTexte = obj.textIndent;
    specific.textShadowTexte = obj.textShadow;
    specific.textStrokeTexte = obj.textStroke;
    specific.textStrokeWidthTexte = obj.textStrokeWidth;
    specific.textStrokeColorTexte = obj.textStrokeColor;
    specific.textFillTexte = obj.textFill;
    specific.textFillColorTexte = obj.textFillColor;
    specific.textFillOpacityTexte = obj.textFillOpacity;
    specific.textStrokeOpacityTexte = obj.textStrokeOpacity;
    specific.textShadowBlurTexte = obj.textShadowBlur;
    specific.textShadowColorTexte = obj.textShadowColor;
    specific.textShadowOffsetXTexte = obj.textShadowOffsetX;
    specific.textShadowOffsetYTexte = obj.textShadowOffsetY;
    specific.textShadowSpreadTexte = obj.textShadowSpread;
    specific.textShadowInsetTexte = obj.textShadowInset;
    specific.textShadowOutsetTexte = obj.textShadowOutset;
    specific.textShadowMultipleTexte = obj.textShadowMultiple;
    specific.textShadowColorMultipleTexte = obj.textShadowColorMultiple;
    specific.textShadowBlurMultipleTexte = obj.textShadowBlurMultiple;
    specific.textShadowOffsetXMultipleTexte = obj.textShadowOffsetXMultiple;
    specific.textShadowOffsetYMultipleTexte = obj.textShadowOffsetYMultiple;
    specific.textShadowSpreadMultipleTexte = obj.textShadowSpreadMultiple;
    specific.textShadowInsetMultipleTexte = obj.textShadowInsetMultiple;
    specific.textShadowOutsetMultipleTexte = obj.textShadowOutsetMultiple;
  }

  // === MARQUES DE CENTRE ===
  if (obj.isCenterMark) {
    specific.x = obj.left;
    specific.y = obj.top;
    specific.taille = obj.radius;
    specific.couleur = obj.stroke;
    specific.epaisseur = obj.strokeWidth;
    specific.style = obj.strokeDashArray;
    specific.texte = obj.text;
    specific.tailleTexte = obj.fontSize;
    specific.couleurTexte = obj.fill;
    specific.positionTexte = obj.textPosition;
    specific.angleTexte = obj.textAngle;
    specific.offsetTexte = obj.textOffset;
    specific.backgroundTexte = obj.textBackground;
    specific.borderTexte = obj.textBorder;
    specific.paddingTexte = obj.textPadding;
    specific.radiusTexte = obj.textRadius;
    specific.shadowTexte = obj.textShadow;
    specific.fontTexte = obj.fontFamily;
    specific.weightTexte = obj.fontWeight;
    specific.styleTexte = obj.fontStyle;
    specific.decorationTexte = obj.textDecoration;
    specific.alignTexte = obj.textAlign;
    specific.baselineTexte = obj.textBaseline;
    specific.directionTexte = obj.textDirection;
    specific.overflowTexte = obj.textOverflow;
    specific.whiteSpaceTexte = obj.whiteSpace;
    specific.wordBreakTexte = obj.wordBreak;
    specific.wordWrapTexte = obj.wordWrap;
    specific.lineHeightTexte = obj.lineHeight;
    specific.letterSpacingTexte = obj.letterSpacing;
    specific.textIndentTexte = obj.textIndent;
    specific.textShadowTexte = obj.textShadow;
    specific.textStrokeTexte = obj.textStroke;
    specific.textStrokeWidthTexte = obj.textStrokeWidth;
    specific.textStrokeColorTexte = obj.textStrokeColor;
    specific.textFillTexte = obj.textFill;
    specific.textFillColorTexte = obj.textFillColor;
    specific.textFillOpacityTexte = obj.textFillOpacity;
    specific.textStrokeOpacityTexte = obj.textStrokeOpacity;
    specific.textShadowBlurTexte = obj.textShadowBlur;
    specific.textShadowColorTexte = obj.textShadowColor;
    specific.textShadowOffsetXTexte = obj.textShadowOffsetX;
    specific.textShadowOffsetYTexte = obj.textShadowOffsetY;
    specific.textShadowSpreadTexte = obj.textShadowSpread;
    specific.textShadowInsetTexte = obj.textShadowInset;
    specific.textShadowOutsetTexte = obj.textShadowOutset;
    specific.textShadowMultipleTexte = obj.textShadowMultiple;
    specific.textShadowColorMultipleTexte = obj.textShadowColorMultiple;
    specific.textShadowBlurMultipleTexte = obj.textShadowBlurMultiple;
    specific.textShadowOffsetXMultipleTexte = obj.textShadowOffsetXMultiple;
    specific.textShadowOffsetYMultipleTexte = obj.textShadowOffsetYMultiple;
    specific.textShadowSpreadMultipleTexte = obj.textShadowSpreadMultiple;
    specific.textShadowInsetMultipleTexte = obj.textShadowInsetMultiple;
    specific.textShadowOutsetMultipleTexte = obj.textShadowOutsetMultiple;
  }

  // === LABELS DE MESURE ===
  if (obj.measureLabel) {
    specific.x = obj.left;
    specific.y = obj.top;
    specific.texte = obj.text;
    specific.tailleTexte = obj.fontSize;
    specific.couleurTexte = obj.fill;
    specific.positionTexte = obj.textPosition;
    specific.angleTexte = obj.textAngle;
    specific.offsetTexte = obj.textOffset;
    specific.backgroundTexte = obj.textBackground;
    specific.borderTexte = obj.textBorder;
    specific.paddingTexte = obj.textPadding;
    specific.radiusTexte = obj.textRadius;
    specific.shadowTexte = obj.textShadow;
    specific.fontTexte = obj.fontFamily;
    specific.weightTexte = obj.fontWeight;
    specific.styleTexte = obj.fontStyle;
    specific.decorationTexte = obj.textDecoration;
    specific.alignTexte = obj.textAlign;
    specific.baselineTexte = obj.textBaseline;
    specific.directionTexte = obj.textDirection;
    specific.overflowTexte = obj.textOverflow;
    specific.whiteSpaceTexte = obj.whiteSpace;
    specific.wordBreakTexte = obj.wordBreak;
    specific.wordWrapTexte = obj.wordWrap;
    specific.lineHeightTexte = obj.lineHeight;
    specific.letterSpacingTexte = obj.letterSpacing;
    specific.textIndentTexte = obj.textIndent;
    specific.textShadowTexte = obj.textShadow;
    specific.textStrokeTexte = obj.textStroke;
    specific.textStrokeWidthTexte = obj.textStrokeWidth;
    specific.textStrokeColorTexte = obj.textStrokeColor;
    specific.textFillTexte = obj.textFill;
    specific.textFillColorTexte = obj.textFillColor;
    specific.textFillOpacityTexte = obj.textFillOpacity;
    specific.textStrokeOpacityTexte = obj.textStrokeOpacity;
    specific.textShadowBlurTexte = obj.textShadowBlur;
    specific.textShadowColorTexte = obj.textShadowColor;
    specific.textShadowOffsetXTexte = obj.textShadowOffsetX;
    specific.textShadowOffsetYTexte = obj.textShadowOffsetY;
    specific.textShadowSpreadTexte = obj.textShadowSpread;
    specific.textShadowInsetTexte = obj.textShadowInset;
    specific.textShadowOutsetTexte = obj.textShadowOutset;
    specific.textShadowMultipleTexte = obj.textShadowMultiple;
    specific.textShadowColorMultipleTexte = obj.textShadowColorMultiple;
    specific.textShadowBlurMultipleTexte = obj.textShadowBlurMultiple;
    specific.textShadowOffsetXMultipleTexte = obj.textShadowOffsetXMultiple;
    specific.textShadowOffsetYMultipleTexte = obj.textShadowOffsetYMultiple;
    specific.textShadowSpreadMultipleTexte = obj.textShadowSpreadMultiple;
    specific.textShadowInsetMultipleTexte = obj.textShadowInsetMultiple;
    specific.textShadowOutsetMultipleTexte = obj.textShadowOutsetMultiple;
  }

  // === LIGNES DE GRILLE ===
  if (obj.isGridLine) {
    specific.x1 = obj.x1;
    specific.y1 = obj.y1;
    specific.x2 = obj.x2;
    specific.y2 = obj.y2;
    specific.couleur = obj.stroke;
    specific.epaisseur = obj.strokeWidth;
    specific.style = obj.strokeDashArray;
    specific.opacite = obj.opacity;
    specific.visible = obj.visible;
    specific.selectable = obj.selectable;
    specific.evented = obj.evented;
    specific.hasControls = obj.hasControls;
    specific.hasBorders = obj.hasBorders;
    specific.lockMovementX = obj.lockMovementX;
    specific.lockMovementY = obj.lockMovementY;
    specific.lockRotation = obj.lockRotation;
    specific.lockScalingX = obj.lockScalingX;
    specific.lockScalingY = obj.lockScalingY;
    specific.lockSkewingX = obj.lockSkewingX;
    specific.lockSkewingY = obj.lockSkewingY;
    specific.lockUniScaling = obj.lockUniScaling;
    specific.excludeFromExport = obj.excludeFromExport;
    specific.originX = obj.originX;
    specific.originY = obj.originY;
    specific.centeredScaling = obj.centeredScaling;
    specific.centeredRotation = obj.centeredRotation;
    specific.flipX = obj.flipX;
    specific.flipY = obj.flipY;
    specific.skewX = obj.skewX;
    specific.skewY = obj.skewY;
    specific.shadow = obj.shadow;
    specific.absolutePositioned = obj.absolutePositioned;
  }

  return specific;
};

/**
 * Log complet de tous les objets du canvas
 */
export const logAllCanvasObjects = (canvas, echelle) => {
  if (!canvas) {
    logger.error('CompleteLogger', 'Canvas non disponible');
    return;
  }

  const objects = canvas.getObjects();
  const planData = {
    metadata: {
      timestamp: new Date().toISOString(),
      echelle: echelle,
      nombreObjets: objects.length,
      dimensions: {
        largeur: canvas.width,
        hauteur: canvas.height
      }
    },
    objets: []
  };

  objects.forEach((obj, index) => {
    const objectData = {
      index: index,
      type: obj.type,
      customType: obj.customType,
      id: obj.id,
      customId: obj.customId,
      proprietes: extractAllObjectProperties(obj),
      position: {
        left: obj.left,
        top: obj.top,
        width: obj.width,
        height: obj.height,
        scaleX: obj.scaleX,
        scaleY: obj.scaleY,
        angle: obj.angle
      },
      style: {
        fill: obj.fill,
        stroke: obj.stroke,
        strokeWidth: obj.strokeWidth,
        opacity: obj.opacity,
        visible: obj.visible
      },
      comportement: {
        selectable: obj.selectable,
        evented: obj.evented,
        hasControls: obj.hasControls,
        hasBorders: obj.hasBorders,
        lockMovementX: obj.lockMovementX,
        lockMovementY: obj.lockMovementY,
        lockRotation: obj.lockRotation,
        lockScalingX: obj.lockScalingX,
        lockScalingY: obj.lockScalingY
      }
    };

    planData.objets.push(objectData);
  });

  // Log dans la console
  console.clear();
  console.log('%c═══════════════════════════════════════════════════════', 'color: #4caf50; font-weight: bold');
  console.log('%c📋 LOG COMPLET DE TOUS LES OBJETS', 'color: #4caf50; font-weight: bold; font-size: 16px');
  console.log('%c═══════════════════════════════════════════════════════', 'color: #4caf50; font-weight: bold');
  console.log('');
  console.log(`%c📊 Nombre d'objets: ${objects.length}`, 'color: #2196f3; font-weight: bold');
  console.log(`%c📐 Échelle: ${echelle} pixels/mètre`, 'color: #2196f3; font-weight: bold');
  console.log(`%c📏 Dimensions canvas: ${canvas.width} × ${canvas.height}px`, 'color: #2196f3; font-weight: bold');
  console.log('');
  console.log('%c💡 Données complètes exportées en JSON ci-dessous:', 'color: #ff9800; font-weight: bold');
  console.log('');
  console.log('%c📋 DONNÉES COMPLÈTES:', 'color: #4caf50; font-weight: bold; font-size: 14px');
  console.log(planData);
  console.log('');
  console.log('%c✅ Export terminé - Tous les paramètres capturés', 'color: #4caf50; font-weight: bold');

  // Log via le système de logging
  logger.info('CompleteLogger', `Export complet de ${objects.length} objets`, planData);

  return planData;
};

/**
 * Export des données en JSON
 */
export const exportCompleteData = (canvas, echelle) => {
  const data = logAllCanvasObjects(canvas, echelle);
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `plan-complet-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  logger.info('CompleteLogger', 'Données complètes exportées en JSON');
};

export default {
  logAllCanvasObjects,
  exportCompleteData,
  extractAllObjectProperties
};
