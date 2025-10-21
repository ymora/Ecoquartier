/**
 * tooltipValidation.js
 * Gestion du panneau de validation affiché pour les arbres
 */

import * as fabric from 'fabric';
import { getIconePourStatut } from '../validation';

/**
 * Afficher le tooltip de validation pour un arbre
 */
export const afficherTooltipValidation = (arbreGroup, canvas, validationTooltipRef, anneeProjection, calculerTailleSelonAnnee, afficherCercleTronc, afficherLignesMesure) => {
  const panel = validationTooltipRef.current;
  if (!panel) return;
  
  const messages = arbreGroup.validationMessages || [];
  const status = arbreGroup.validationStatus || 'ok';
  const arbre = arbreGroup.arbreData;
  const tailles = arbreGroup.tailles;
  const iconeType = arbreGroup.iconeType || '';
  
  // 4 paliers de validation (utilise le système centralisé)
  const icone = getIconePourStatut(status);
  const classe = `validation-${status}`;
  
  // Tooltip complet : nom + dimensions + validation
  let html = `<div class="panel-validation-header ${classe}">`;
  html += `<strong>${icone} ${arbre?.name || 'Arbre'}</strong>`;
  html += `</div>`;
  
  // Informations de dimensions (si disponibles)
  if (tailles) {
    html += `<div class="panel-validation-dimensions">`;
    html += `<div style="font-size: 11px; color: #424242; padding: 6px 8px; background: rgba(255,255,255,0.5); border-radius: 4px; margin-bottom: 6px;">`;
    html += `📏 <strong>Plantation:</strong> ${tailles.envergureActuelle.toFixed(1)}m × ${tailles.hauteurActuelle.toFixed(1)}m<br>`;
    html += `🌳 <strong>Tronc:</strong> ⌀${(tailles.diametreTroncActuel * 100).toFixed(0)}cm ${iconeType}`;
    html += `</div>`;
    html += `</div>`;
  }
  
  // Afficher les messages de validation
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

