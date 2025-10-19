/**
 * tooltipValidation.js
 * Gestion du panneau de validation affiché pour les arbres
 */

import * as fabric from 'fabric';
import { calculerDistanceRectangle, calculerDistanceLigne, trouverPointPlusProcheMaison, trouverPointPlusProcheLigne } from './canvasHelpers';

/**
 * Afficher le tooltip de validation pour un arbre
 */
export const afficherTooltipValidation = (arbreGroup, canvas, validationTooltipRef, anneeProjection, calculerTailleSelonAnnee, afficherCercleTronc, afficherLignesMesure) => {
  const panel = validationTooltipRef.current;
  if (!panel) return;
  
  const messages = arbreGroup.validationMessages || [];
  const status = arbreGroup.validationStatus || 'ok';
  const arbre = arbreGroup.arbreData;
  
  let classe = 'validation-ok';
  let icone = '✅';
  if (status === 'error') {
    classe = 'validation-error';
    icone = '❌';
  } else if (status === 'warning') {
    classe = 'validation-warning';
    icone = '⚠️';
  }
  
  // Tooltip simplifié : SEULEMENT les problèmes
  let html = `<div class="panel-validation-header ${classe}">`;
  html += `<strong>${icone} ${arbre?.name || 'Arbre'}</strong>`;
  html += `</div>`;
  
  // Afficher SEULEMENT les messages de problème (pas les OK)
  if (messages.length > 0 && status !== 'ok') {
    html += `<div class="panel-validation-messages">`;
    messages.forEach(msg => {
      const isError = msg.includes('CRITIQUE') || msg.includes('ILLÉGAL') || msg.includes('DANGER');
      const msgClass = isError ? 'panel-msg-error' : 'panel-msg-warning';
      html += `<div class="panel-msg ${msgClass}">${msg}</div>`;
    });
    html += `</div>`;
  } else if (messages.length === 0 || status === 'ok') {
    html += `<div class="panel-validation-messages">`;
    html += `<div class="panel-msg panel-msg-success">✅ Position conforme</div>`;
    html += `</div>`;
  }
  
  panel.innerHTML = html;
  panel.className = `panel-validation ${classe}`;
  panel.style.display = 'block';
  
  afficherCercleTronc(canvas, arbreGroup);
  afficherLignesMesure(canvas, arbreGroup);
};

/**
 * Cacher le tooltip de validation
 */
export const cacherTooltipValidation = (validationTooltipRef) => {
  const panel = validationTooltipRef.current;
  if (panel) {
    panel.style.display = 'none';
  }
};

/**
 * Ajouter une ligne de mesure pour un problème de distance
 */
export const ajouterLigneMesureProbleme = (canvas, x1, y1, x2, y2, distActuelle, distMin, icone) => {
  const ligne = new fabric.Line([x1, y1, x2, y2], {
    stroke: '#d32f2f',
    strokeWidth: 2,
    strokeDashArray: [8, 4],
    selectable: false,
    evented: false,
    isLigneMesure: true
  });
  canvas.add(ligne);
  
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  
  const label = new fabric.Text(`${icone} ${distActuelle.toFixed(1)}m < ${distMin}m`, {
    left: midX,
    top: midY - 15,
    fontSize: 11,
    fontWeight: 'bold',
    fill: 'white',
    backgroundColor: '#d32f2f',
    padding: 4,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false,
    isLigneMesure: true
  });
  canvas.add(label);
};

/**
 * Wrapper pour afficher les lignes de mesure (utilise canvasValidation.js)
 */
export const creerAfficherLignesMesure = (afficherLignesMesureUtil, echelle) => {
  return (canvas, arbreGroup) => {
    return afficherLignesMesureUtil(canvas, arbreGroup, echelle);
  };
};

