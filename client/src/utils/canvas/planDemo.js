/**
 * planDemo.js
 * Plan personnalisé par défaut avec LABELS COMPLETS
 * Plan généré le 22/10/2025 10:12:12
 * Dimensions: 30m × 30m, Orientation: nord-haut
 */

import * as fabric from 'fabric';
import logger from '../logger';

/**
 * Charger le plan personnalisé par défaut
 */
export const chargerPlanDemo = (canvas, echelle, ajouterGrille) => {
  if (!canvas) return;
  
  logger.info('Plan', 'Chargement du plan personnalisé');
  
  // Nettoyer le canvas (sauf grille, boussole, etc.)
  const objets = canvas.getObjects().filter(obj => 
    !obj.isGridLine && 
    !obj.measureLabel && 
    !obj.isBoussole && 
    !obj.isSolIndicator &&
    !obj.alignmentGuide &&
    !obj.isDimensionBox &&
    !obj.isAideButton &&
    !obj.isImageFond
  );
  objets.forEach(obj => canvas.remove(obj));
  
  // ========== MAISON avec LABELS ==========
  const largeurMaison = 10.15; // 406/40
  const hauteurMaison = 10.64; // 425.6/40
  
  const maisonRect = new fabric.Rect({
    left: 0,
    top: 0,
    width: largeurMaison * echelle,
    height: hauteurMaison * echelle,
    fill: '#bdbdbd',
    stroke: '#757575',
    strokeWidth: 3,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  const maisonNom = new fabric.Text('🏠 Maison', {
    left: 0,
    top: 0,
    fontSize: 12,
    fontWeight: 'bold',
    fill: '#333',
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 3
  });
  
  const maisonDim = new fabric.Text(`${largeurMaison.toFixed(1)}×${hauteurMaison.toFixed(1)}m`, {
    left: 0,
    top: -(hauteurMaison * echelle / 2) - 15,
    fontSize: 10,
    fontWeight: '600',
    fill: '#757575',
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 2
  });
  
  const maisonGroup = new fabric.Group([maisonRect, maisonNom, maisonDim], {
    left: 82.0,
    top: -187.0,
    customType: 'maison',
    profondeurFondations: 1.2,
    hauteurBatiment: 7
  });
  canvas.add(maisonGroup);
  
  // ========== CAISSON D'EAU avec LABELS ==========
  const largeurCaisson = 5;
  const profondeurCaisson = 3;
  const hauteurCaisson = 1;
  const volumeCaisson = (largeurCaisson * profondeurCaisson * hauteurCaisson).toFixed(1);
  
  const caissonRect = new fabric.Rect({
    left: 0,
    top: 0,
    width: largeurCaisson * echelle,
    height: profondeurCaisson * echelle,
    fill: 'rgba(33, 150, 243, 0.25)',
    stroke: '#1565c0',
    strokeWidth: 3,
    strokeDashArray: [5, 3],
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  const caissonNom = new fabric.Text('🟦 Caisson', {
    left: 0,
    top: 0,
    fontSize: 12,
    fontWeight: 'bold',
    fill: '#333',
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 3
  });
  
  const caissonDim = new fabric.Text(`${largeurCaisson}×${profondeurCaisson}×${hauteurCaisson}m · ${volumeCaisson}m³`, {
    left: 0,
    top: -(profondeurCaisson * echelle / 2) - 15,
    fontSize: 9,
    fontWeight: '600',
    fill: '#1565c0',
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 2
  });
  
  const caissonGroup = new fabric.Group([caissonRect, caissonNom, caissonDim], {
    left: 454.1,
    top: 264.4,
    customType: 'caisson-eau',
    profondeurEnterree: 1.0,
    largeurCaisson: largeurCaisson,
    profondeurCaisson: profondeurCaisson,
    hauteurCaisson: hauteurCaisson
  });
  canvas.add(caissonGroup);
  
  // ========== TERRASSE 1 avec LABELS ==========
  const largeurTerrasse1 = 6.47; // 258.9/40
  const hauteurTerrasse1 = 4.56; // 182.2/40
  
  const terrasse1Rect = new fabric.Rect({
    left: 0,
    top: 0,
    width: largeurTerrasse1 * echelle,
    height: hauteurTerrasse1 * echelle,
    fill: 'rgba(158, 158, 158, 0.4)',
    stroke: '#757575',
    strokeWidth: 2,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  const terrasse1Nom = new fabric.Text('🏡 Terrasse', {
    left: 0,
    top: 0,
    fontSize: 12,
    fontWeight: 'bold',
    fill: '#333',
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 3
  });
  
  const terrasse1Dim = new fabric.Text(`${largeurTerrasse1.toFixed(1)}×${hauteurTerrasse1.toFixed(1)}m`, {
    left: 0,
    top: -(hauteurTerrasse1 * echelle / 2) - 15,
    fontSize: 10,
    fontWeight: '600',
    fill: '#757575',
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 2
  });
  
  const terrasse1Group = new fabric.Group([terrasse1Rect, terrasse1Nom, terrasse1Dim], {
    left: 668.4,
    top: -227.8,
    customType: 'terrasse',
    hauteurDalle: 0.15,
    profondeurFondation: 0.3
  });
  canvas.add(terrasse1Group);
  
  // ========== TERRASSE 2 avec LABELS ==========
  const largeurTerrasse2 = 1.91; // 76.3/40
  const hauteurTerrasse2 = 1.72; // 68.8/40
  
  const terrasse2Rect = new fabric.Rect({
    left: 0,
    top: 0,
    width: largeurTerrasse2 * echelle,
    height: hauteurTerrasse2 * echelle,
    fill: 'rgba(158, 158, 158, 0.4)',
    stroke: '#757575',
    strokeWidth: 2,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  const terrasse2Nom = new fabric.Text('🏡 Terrasse', {
    left: 0,
    top: 0,
    fontSize: 12,
    fontWeight: 'bold',
    fill: '#333',
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 3
  });
  
  const terrasse2Dim = new fabric.Text(`${largeurTerrasse2.toFixed(1)}×${hauteurTerrasse2.toFixed(1)}m`, {
    left: 0,
    top: -(hauteurTerrasse2 * echelle / 2) - 15,
    fontSize: 10,
    fontWeight: '600',
    fill: '#757575',
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 2
  });
  
  const terrasse2Group = new fabric.Group([terrasse2Rect, terrasse2Nom, terrasse2Dim], {
    left: 411.8,
    top: -235.0,
    customType: 'terrasse',
    hauteurDalle: 0.15,
    profondeurFondation: 0.3
  });
  canvas.add(terrasse2Group);
  
  // ========== TERRASSE 3 avec LABELS ==========
  const largeurTerrasse3 = 7.22; // 288.9/40
  const hauteurTerrasse3 = 4.56; // 182.2/40
  
  const terrasse3Rect = new fabric.Rect({
    left: 0,
    top: 0,
    width: largeurTerrasse3 * echelle,
    height: hauteurTerrasse3 * echelle,
    fill: 'rgba(158, 158, 158, 0.4)',
    stroke: '#757575',
    strokeWidth: 2,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  const terrasse3Nom = new fabric.Text('🏡 Terrasse', {
    left: 0,
    top: 0,
    fontSize: 12,
    fontWeight: 'bold',
    fill: '#333',
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 3
  });
  
  const terrasse3Dim = new fabric.Text(`${largeurTerrasse3.toFixed(1)}×${hauteurTerrasse3.toFixed(1)}m`, {
    left: 0,
    top: -(hauteurTerrasse3 * echelle / 2) - 15,
    fontSize: 10,
    fontWeight: '600',
    fill: '#757575',
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 2
  });
  
  const terrasse3Group = new fabric.Group([terrasse3Rect, terrasse3Nom, terrasse3Dim], {
    left: 123.4,
    top: -347.8,
    customType: 'terrasse',
    hauteurDalle: 0.15,
    profondeurFondation: 0.3
  });
  canvas.add(terrasse3Group);
  
  // ========== PAVÉ ENHERBÉ 1 avec LABELS ==========
  const largeurPaves = 6.08; // 243.3/40
  const hauteurPaves = 7.54; // 301.5/40
  
  const pavesRect = new fabric.Rect({
    left: 0,
    top: 0,
    width: largeurPaves * echelle,
    height: hauteurPaves * echelle,
    fill: 'rgba(139, 195, 74, 0.3)',
    stroke: '#7cb342',
    strokeWidth: 2,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  const pavesNom = new fabric.Text('🟩 Pavés', {
    left: 0,
    top: 0,
    fontSize: 12,
    fontWeight: 'bold',
    fill: '#333',
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 3
  });
  
  const pavesDim = new fabric.Text(`${largeurPaves.toFixed(1)}×${hauteurPaves.toFixed(1)}m`, {
    left: 0,
    top: -(hauteurPaves * echelle / 2) - 15,
    fontSize: 10,
    fontWeight: '600',
    fill: '#7cb342',
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 2
  });
  
  const pavesGroup = new fabric.Group([pavesRect, pavesNom, pavesDim], {
    left: 82.0,
    top: 210.0,
    customType: 'paves',
    hauteurPaves: 0.08,
    profondeurGravier: 0.15
  });
  canvas.add(pavesGroup);
  
  // NOTE: Les arbres seront ajoutés via la sélection d'arbres
  // Cerisier du Japon Kanzan (prunus-kanzan) - Position: 387.6,362.0 px | 9.69,9.05 m
  // Cerisier Accolade (prunus-accolade) - Position: 784.0,110.0 px | 19.60,2.75 m
  // Cerisier Sunset Boulevard (prunus-sunset-boulevard) - Position: 624.0,-349.0 px | 15.60,-8.72 m
  
  // Re-ajouter la grille
  if (ajouterGrille) ajouterGrille(canvas);
  
  canvas.renderAll();
  
  logger.info('Planificateur', '✅ Plan personnalisé chargé avec labels (maison, caisson, 3 terrasses, pavé enherbé)');
};
