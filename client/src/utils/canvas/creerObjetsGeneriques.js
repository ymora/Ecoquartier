/**
 * Fonction générique pour créer des objets rectangulaires avec icône
 * Évite la duplication de code entre maisons, terrasses, pavés, etc.
 */

import * as fabric from 'fabric';
import { appliquerProprietesSelection } from './proprietesSelection';

/**
 * Générer un ID unique pour un objet
 */
export const genererIdUnique = (type) => {
  return `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Créer un objet rectangulaire générique avec icône
 * @param {Object} config - Configuration de l'objet
 * @param {string} config.type - Type d'objet (maison, terrasse, etc.)
 * @param {number} config.largeur - Largeur en mètres
 * @param {number} config.profondeur - Profondeur en mètres
 * @param {string} config.icone - Icône emoji
 * @param {string} config.couleurFond - Couleur de fond
 * @param {string} config.couleurBordure - Couleur de bordure
 * @param {Object} config.proprietes - Propriétés spécifiques à l'objet
 * @param {number} echelle - Échelle du plan
 * @returns {fabric.Group} - Objet Fabric.js créé
 */
export const creerObjetRectangulaire = (config, echelle) => {
  const {
    type,
    largeur,
    profondeur,
    icone,
    couleurFond,
    couleurBordure,
    proprietes = {}
  } = config;

  // Créer le rectangle de base
  const rect = new fabric.Rect({
    left: 0,
    top: 0,
    width: largeur * echelle,
    height: profondeur * echelle,
    fill: couleurFond,
    stroke: couleurBordure,
    strokeWidth: 2,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });

  // Créer l'icône
  const tailleIcone = Math.min(largeur * echelle, profondeur * echelle) * 0.4;
  const labelIcone = new fabric.Text(icone, {
    left: 0,
    top: 0,
    fontSize: Math.max(tailleIcone, 24),
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });

  // Créer le groupe
  const group = new fabric.Group([rect, labelIcone], {
    customType: type,
    customId: genererIdUnique(type),
    largeur: largeur,
    profondeur: profondeur,
    originX: 'center',
    originY: 'center',
    ...proprietes
  });

  // Appliquer les propriétés de sélection standardisées
  appliquerProprietesSelection(group, type);

  return group;
};

/**
 * Créer un objet circulaire générique avec icône
 * @param {Object} config - Configuration de l'objet
 * @param {string} config.type - Type d'objet (citerne, etc.)
 * @param {number} config.diametre - Diamètre en mètres
 * @param {string} config.icone - Icône emoji
 * @param {string} config.couleurFond - Couleur de fond
 * @param {string} config.couleurBordure - Couleur de bordure
 * @param {Object} config.proprietes - Propriétés spécifiques à l'objet
 * @param {number} echelle - Échelle du plan
 * @returns {fabric.Group} - Objet Fabric.js créé
 */
export const creerObjetCirculaire = (config, echelle) => {
  const {
    type,
    diametre,
    icone,
    couleurFond,
    couleurBordure,
    proprietes = {}
  } = config;

  const rayon = (diametre * echelle) / 2;

  // Créer le cercle de base
  const cercle = new fabric.Circle({
    left: 0,
    top: 0,
    radius: rayon,
    fill: couleurFond,
    stroke: couleurBordure,
    strokeWidth: 3,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });

  // Créer l'icône
  const tailleIcone = rayon * 0.8;
  const labelIcone = new fabric.Text(icone, {
    left: 0,
    top: 0,
    fontSize: Math.max(tailleIcone, 24),
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });

  // Créer le groupe
  const group = new fabric.Group([cercle, labelIcone], {
    customType: type,
    customId: genererIdUnique(type),
    diametre: diametre,
    originX: 'center',
    originY: 'center',
    ...proprietes
  });

  // Appliquer les propriétés de sélection standardisées
  appliquerProprietesSelection(group, type);

  return group;
};
