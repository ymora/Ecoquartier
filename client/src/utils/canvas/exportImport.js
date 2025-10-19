/**
 * exportImport.js  
 * Export/import du plan et gestion image de fond
 */

import * as fabric from 'fabric';
import logger from '../logger';

/**
 * Exporter le plan actuel vers localStorage
 */
export const exporterPlan = (canvas, dimensions, orientation, echelle, onPlanComplete) => {
  const objets = canvas.getObjects();
  
  const planData = {
    largeur: dimensions.largeur,
    hauteur: dimensions.hauteur,
    orientation,
    timestamp: Date.now(),
    maison: null,
    canalisations: [],
    arbresExistants: [],
    arbresAPlanter: [],
    terrasses: [],
    paves: [],
    citernes: [],
    clotures: []
  };

  objets.forEach(obj => {
    if (obj.isGridLine || obj.measureLabel || obj.isBoussole || obj.isSolIndicator || 
        obj.alignmentGuide || obj.isDimensionBox || obj.isAideButton || obj.isImageFond) return;

    if (obj.customType === 'maison') {
      planData.maison = {
        left: obj.left / echelle,
        top: obj.top / echelle,
        width: obj.getScaledWidth() / echelle,
        height: obj.getScaledHeight() / echelle,
        profondeurFondations: obj.profondeurFondations,
        hauteurBatiment: obj.hauteurBatiment
      };
    } else if (obj.customType === 'canalisation') {
      planData.canalisations.push({
        x1: obj.x1,
        y1: obj.y1,
        x2: obj.x2,
        y2: obj.y2,
        profondeur: obj.profondeur
      });
    } else if (obj.customType === 'cloture') {
      planData.clotures.push({
        x1: obj.x1,
        y1: obj.y1,
        x2: obj.x2,
        y2: obj.y2
      });
    } else if (obj.customType === 'arbre-existant') {
      planData.arbresExistants.push({
        left: obj.left / echelle,
        top: obj.top / echelle,
        radius: (obj.radius * obj.scaleX) / echelle
      });
    } else if (obj.customType === 'arbre-a-planter') {
      planData.arbresAPlanter.push({
        left: obj.left / echelle,
        top: obj.top / echelle,
        arbreData: obj.arbreData
      });
    } else if (obj.customType === 'terrasse') {
      planData.terrasses.push({
        left: obj.left / echelle,
        top: obj.top / echelle,
        width: obj.getScaledWidth() / echelle,
        height: obj.getScaledHeight() / echelle
      });
    } else if (obj.customType === 'paves') {
      planData.paves.push({
        left: obj.left / echelle,
        top: obj.top / echelle,
        width: obj.getScaledWidth() / echelle,
        height: obj.getScaledHeight() / echelle
      });
    } else if (obj.customType === 'citerne') {
      planData.citernes.push({
        left: obj.left / echelle,
        top: obj.top / echelle,
        width: obj.getScaledWidth() / echelle,
        height: obj.getScaledHeight() / echelle,
        profondeur: obj.profondeur,
        diametre: obj.diametre
      });
    }
  });

  localStorage.setItem('planTerrain', JSON.stringify(planData));
  onPlanComplete(planData);
};

/**
 * Charger un plan depuis localStorage
 */
export const chargerPlanSauvegarde = (canvas, echelle, ajouterMesuresLive) => {
  if (!canvas) return;

  const saved = localStorage.getItem('planTerrain');
  if (!saved) {
    alert('Aucun plan sauvegardé');
    return;
  }

  try {
    const planData = JSON.parse(saved);
    
    const objets = canvas.getObjects().filter(obj => 
      !obj.isGridLine && !obj.isBoussole && !obj.isDimensionBox && !obj.isAideButton && 
      !obj.measureLabel && !obj.alignmentGuide && !obj.isImageFond
    );
    objets.forEach(obj => canvas.remove(obj));
    
    // Maison
    if (planData.maison) {
      const maison = new fabric.Rect({
        left: planData.maison.left * echelle,
        top: planData.maison.top * echelle,
        width: planData.maison.width * echelle,
        height: planData.maison.height * echelle,
        fill: '#bdbdbd',
        stroke: '#424242',
        strokeWidth: 2,
        customType: 'maison',
        profondeurFondations: planData.maison.profondeurFondations || 1.2,
        hauteurBatiment: planData.maison.hauteurBatiment || 7
      });
      const label = new fabric.Text('🏠', {
        left: (planData.maison.left + planData.maison.width / 2) * echelle,
        top: (planData.maison.top + planData.maison.height / 2) * echelle,
        fontSize: 32,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false
      });
      const group = new fabric.Group([maison, label], { 
        customType: 'maison',
        profondeurFondations: planData.maison.profondeurFondations || 1.2,
        hauteurBatiment: planData.maison.hauteurBatiment || 7
      });
      canvas.add(group);
    }
    
    // Canalisations
    if (planData.canalisations) {
      planData.canalisations.forEach(canal => {
        const line = new fabric.Line([
          canal.x1 || 50, canal.y1 || 50,
          canal.x2 || 200, canal.y2 || 50
        ], {
          stroke: '#757575',
          strokeWidth: 3,
          strokeLineCap: 'round',
          customType: 'canalisation',
          profondeur: canal.profondeur || 0.6
        });
        canvas.add(line);
      });
    }
    
    // Clôtures
    if (planData.clotures) {
      planData.clotures.forEach(cloture => {
        const line = new fabric.Line([cloture.x1, cloture.y1, cloture.x2, cloture.y2], {
          stroke: '#ffd54f',
          strokeWidth: 3,
          strokeDashArray: [10, 5],
          strokeLineCap: 'round',
          customType: 'cloture'
        });
        canvas.add(line);
      });
    }
    
    // Arbres existants
    if (planData.arbresExistants) {
      planData.arbresExistants.forEach(arbre => {
        const circle = new fabric.Circle({
          left: arbre.left * echelle,
          top: arbre.top * echelle,
          radius: arbre.radius * echelle,
          fill: 'rgba(76, 175, 80, 0.3)',
          stroke: '#2e7d32',
          strokeWidth: 2,
          customType: 'arbre-existant'
        });
        const label = new fabric.Text('🌳', {
          left: arbre.left * echelle,
          top: arbre.top * echelle,
          fontSize: 24,
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false
        });
        const group = new fabric.Group([circle, label], { customType: 'arbre-existant' });
        canvas.add(group);
      });
    }
    
    // Terrasses et pavés
    if (planData.terrasses) {
      planData.terrasses.forEach(terrasse => {
        const rect = new fabric.Rect({
          left: terrasse.left * echelle,
          top: terrasse.top * echelle,
          width: terrasse.width * echelle,
          height: terrasse.height * echelle,
          fill: '#ffecb3',
          stroke: '#f57c00',
          strokeWidth: 2,
          strokeDashArray: [5, 5],
          customType: 'terrasse'
        });
        canvas.add(rect);
      });
    }
    
    if (planData.paves) {
      planData.paves.forEach(pave => {
        const rect = new fabric.Rect({
          left: pave.left * echelle,
          top: pave.top * echelle,
          width: pave.width * echelle,
          height: pave.height * echelle,
          fill: '#c5e1a5',
          stroke: '#7cb342',
          strokeWidth: 2,
          customType: 'paves'
        });
        canvas.add(rect);
      });
    }
    
    canvas.renderAll();
    ajouterMesuresLive(canvas);
    alert('Plan chargé ✅');
    
  } catch (error) {
    console.error('Erreur chargement:', error);
    alert('Erreur chargement plan');
  }
};

/**
 * Charger une image de fond
 */
export const chargerImageFond = (fabricCanvasRef, imageFondRef, opaciteImage, setImageFondChargee, ajouterGrille) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/png,image/jpeg,image/jpg';
  
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const imgUrl = event.target.result;
      
      fabric.Image.fromURL(imgUrl, (img) => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        
        if (imageFondRef.current) {
          canvas.remove(imageFondRef.current);
        }
        
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );
        
        img.set({
          left: 0,
          top: 0,
          scaleX: scale,
          scaleY: scale,
          opacity: opaciteImage,
          selectable: true,
          hasControls: true,
          hasBorders: true,
          isImageFond: true
        });
        
        canvas.add(img);
        canvas.sendObjectToBack(img);
        
        imageFondRef.current = img;
        setImageFondChargee(true);
        
        canvas.renderAll();
        ajouterGrille(canvas);
        canvas.requestRenderAll();
        
        logger.info('ImageFond', '✅ Image chargée');
      });
    };
    reader.readAsDataURL(file);
  };
  
  input.click();
};

/**
 * Ajuster l'opacité de l'image de fond
 */
export const ajusterOpaciteImage = (nouvelleOpacite, fabricCanvasRef, imageFondRef, setOpaciteImage) => {
  setOpaciteImage(nouvelleOpacite);
  if (imageFondRef.current) {
    imageFondRef.current.set({ opacity: nouvelleOpacite });
    fabricCanvasRef.current.renderAll();
  }
};

/**
 * Supprimer l'image de fond
 */
export const supprimerImageFond = (fabricCanvasRef, imageFondRef, setImageFondChargee) => {
  const canvas = fabricCanvasRef.current;
  if (!canvas || !imageFondRef.current) {
    alert('Aucune image de fond');
    return;
  }
  
  if (confirm('Supprimer l\'image de fond ?')) {
    canvas.remove(imageFondRef.current);
    imageFondRef.current = null;
    setImageFondChargee(false);
    canvas.renderAll();
    logger.info('ImageFond', '✅ Image supprimée');
  }
};

/**
 * Ajouter les mesures live sur les objets
 */
export const ajouterMesuresLive = (canvas, echelle, exporterPlanCallback) => {
  canvas.getObjects().forEach(obj => {
    if (obj.measureLabel) canvas.remove(obj);
  });

  canvas.getObjects().forEach(obj => {
    if (obj.isGridLine || obj.measureLabel || obj.isBoussole || obj.isSolIndicator || 
        obj.alignmentGuide || obj.isDimensionBox || obj.isAideButton || obj.isImageFond) return;

    if (obj.customType === 'maison' || obj.customType === 'terrasse' || obj.customType === 'paves') {
      const w = obj.getScaledWidth() / echelle;
      const h = obj.getScaledHeight() / echelle;
      
      const wText = w % 1 === 0 ? w : w.toFixed(1);
      const hText = h % 1 === 0 ? h : h.toFixed(1);
      
      const labelW = new fabric.Text(`${wText}m`, {
        left: obj.left + obj.getScaledWidth() / 2,
        top: obj.top - 15,
        fontSize: 12,
        fill: '#1976d2',
        fontWeight: 'bold',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        originX: 'center',
        selectable: true,
        hasControls: false,
        hasBorders: false,
        lockMovementX: true,
        lockMovementY: true,
        hoverCursor: 'pointer',
        measureLabel: true,
        measureType: 'width',
        targetObject: obj
      });

      labelW.on('mousedown', () => {
        const newValue = prompt('Nouvelle largeur (en m) :', w);
        if (newValue && !isNaN(newValue)) {
          const newWidth = parseFloat(newValue) * echelle;
          obj.set({ width: newWidth, scaleX: 1 });
          canvas.renderAll();
          ajouterMesuresLive(canvas, echelle, exporterPlanCallback);
          exporterPlanCallback(canvas);
        }
      });

      canvas.add(labelW);

      const labelH = new fabric.Text(`${hText}m`, {
        left: obj.left + obj.getScaledWidth() + 10,
        top: obj.top + obj.getScaledHeight() / 2,
        fontSize: 12,
        fill: '#1976d2',
        fontWeight: 'bold',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        originY: 'center',
        selectable: true,
        hasControls: false,
        hasBorders: false,
        lockMovementX: true,
        lockMovementY: true,
        hoverCursor: 'pointer',
        measureLabel: true,
        measureType: 'height',
        targetObject: obj
      });

      labelH.on('mousedown', () => {
        const newValue = prompt('Nouvelle hauteur (en m) :', h);
        if (newValue && !isNaN(newValue)) {
          const newHeight = parseFloat(newValue) * echelle;
          obj.set({ height: newHeight, scaleY: 1 });
          canvas.renderAll();
          ajouterMesuresLive(canvas, echelle, exporterPlanCallback);
          exporterPlanCallback(canvas);
        }
      });

      canvas.add(labelH);
    }
  });
  
  canvas.renderAll();
};

