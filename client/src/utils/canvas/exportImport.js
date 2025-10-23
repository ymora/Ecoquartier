/**
 * exportImport.js  
 * Export/import du plan et gestion image de fond
 */

import * as fabric from 'fabric';
import logger from '../logger';


// Timer pour throttle du logger
let loggerTimeout = null;

/**
 * Logger les positions du plan en format COPIABLE
 * ✅ Permet de copier-coller pour créer un plan par défaut
 * ⚠️ Throttlé à 1 fois par seconde pour éviter les boucles infinies
 */
export const loggerPositionsPlanCopiable = (planData, echelle) => {
  // Throttle : Ne logger qu'une fois par seconde
  if (loggerTimeout) {
    clearTimeout(loggerTimeout);
  }
  
  loggerTimeout = setTimeout(() => {
  console.clear();
  
  console.log('%c═══════════════════════════════════════════════════════', 'color: #4caf50; font-weight: bold');
  console.log('%c📋 POSITIONS DU PLAN - FORMAT COPIABLE', 'color: #4caf50; font-weight: bold; font-size: 16px');
  console.log('%c═══════════════════════════════════════════════════════', 'color: #4caf50; font-weight: bold');
  console.log('');
  
  // Calculer la position du sud
  const positionSud = 
    planData.orientation === 'nord-haut' ? 'bas ⬇️' : 
    planData.orientation === 'nord-bas' ? 'haut ⬆️' : 
    planData.orientation === 'nord-gauche' ? 'droite ➡️' : 
    'gauche ⬅️';
  
  console.log(`%c🧭 Orientation du plan: ${planData.orientation}`, 'color: #2196f3; font-weight: bold; font-size: 14px');
  console.log(`%c☀️ Position du SUD: ${positionSud}`, 'color: #ff9800; font-weight: bold; font-size: 14px; background: #fff3e0; padding: 4px 8px; border-radius: 4px');
  console.log(`%c📐 Dimensions terrain: ${planData.largeur}m × ${planData.hauteur}m`, 'color: #4caf50; font-weight: bold');
  console.log('');
  console.log('%c💡 Copiez le code bleu ci-dessous pour planDemo.js', 'color: #ff9800; font-weight: bold');
  console.log('');
  
  let code = `// Plan généré le ${new Date().toLocaleString('fr-FR')}\n`;
  code += `// Dimensions: ${planData.largeur}m × ${planData.hauteur}m, Orientation: ${planData.orientation}\n`;
  code += `// Position sud (boussole): ${positionSud}\n\n`;
  
  // MAISONS (tableau)
  planData.maisons.forEach((m, i) => {
    const angleStr = m.angle ? `, angle: ${m.angle}` : '';
    code += `  // Maison ${i+1}\n  const maison${i+1} = new fabric.Rect({left: ${(m.left * echelle).toFixed(1)}, top: ${(m.top * echelle).toFixed(1)}, width: ${(m.width * echelle).toFixed(1)}, height: ${(m.height * echelle).toFixed(1)}, fill: '#bdbdbd', stroke: '#757575', strokeWidth: 3, customType: 'maison', profondeurFondations: ${m.profondeurFondations || 1.2}, hauteurBatiment: ${m.hauteurBatiment || 7}${angleStr}});\n  canvas.add(maison${i+1});\n\n`;
  });
  
  // CITERNES
  planData.citernes.forEach((c, i) => {
    code += `  // Citerne ${i+1}\n  canvas.add(new fabric.Circle({left: ${(c.left * echelle).toFixed(1)}, top: ${(c.top * echelle).toFixed(1)}, radius: ${((c.diametre || 1.5) * echelle / 2).toFixed(1)}, fill: 'rgba(33,150,243,0.3)', stroke: '#1976d2', strokeWidth: 3, customType: 'citerne', profondeur: ${c.profondeur || 2.5}, diametre: ${c.diametre || 1.5}, originX: 'center', originY: 'center'}));\n\n`;
  });
  
  // CAISSONS D'EAU
  planData.caissonsEau.forEach((c, i) => {
    const angleStr = c.angle ? `, angle: ${c.angle}` : '';
    code += `  // Caisson d'eau ${i+1}\n  canvas.add(new fabric.Rect({left: ${(c.left * echelle).toFixed(1)}, top: ${(c.top * echelle).toFixed(1)}, width: ${(c.largeurCaisson * echelle).toFixed(1)}, height: ${(c.profondeurCaisson * echelle).toFixed(1)}, fill: 'rgba(33,150,243,0.25)', stroke: '#1565c0', strokeWidth: 3, strokeDashArray: [5,3], customType: 'caisson-eau', largeurCaisson: ${c.largeurCaisson}, profondeurCaisson: ${c.profondeurCaisson}, hauteurCaisson: ${c.hauteurCaisson}, profondeurEnterree: ${c.profondeurEnterree || 1.0}, originX: 'center', originY: 'center'${angleStr}}));\n\n`;
  });
  
  // TERRASSES
  planData.terrasses.forEach((t, i) => {
    const angleStr = t.angle ? `, angle: ${t.angle}` : '';
    code += `  // Terrasse ${i+1}\n  canvas.add(new fabric.Rect({left: ${(t.left * echelle).toFixed(1)}, top: ${(t.top * echelle).toFixed(1)}, width: ${(t.width * echelle).toFixed(1)}, height: ${(t.height * echelle).toFixed(1)}, fill: 'rgba(158,158,158,0.4)', stroke: '#757575', strokeWidth: 2, customType: 'terrasse', hauteurDalle: ${t.hauteurDalle || 0.15}, profondeurFondation: ${t.profondeurFondation || 0.3}${angleStr}}));\n\n`;
  });
  
  // PAVÉS ENHERBÉS
  planData.paves.forEach((p, i) => {
    const angleStr = p.angle ? `, angle: ${p.angle}` : '';
    code += `  // Pavé enherbé ${i+1}\n  canvas.add(new fabric.Rect({left: ${(p.left * echelle).toFixed(1)}, top: ${(p.top * echelle).toFixed(1)}, width: ${(p.width * echelle).toFixed(1)}, height: ${(p.height * echelle).toFixed(1)}, fill: 'rgba(139,195,74,0.3)', stroke: '#7cb342', strokeWidth: 2, customType: 'paves', hauteurPaves: ${p.hauteurPaves || 0.08}, profondeurGravier: ${p.profondeurGravier || 0.15}${angleStr}}));\n\n`;
  });
  
  // CLÔTURES
  planData.clotures.forEach((c, i) => {
    code += `  // Clôture ${i+1}\n  // const cloture${i} = creerClotureGroup(${c.x1.toFixed(1)}, ${c.y1.toFixed(1)}, ${c.x2.toFixed(1)}, ${c.y2.toFixed(1)}, ${c.hauteurCloture || 1.5}, ${c.epaisseur || 0.05});\n  // canvas.add(cloture${i});\n\n`;
  });
  
  // CANALISATIONS
  planData.canalisations.forEach((c, i) => {
    code += `  // Canalisation ${i+1}\n  // const canal${i} = creerCanalisationGroup(${c.x1.toFixed(1)}, ${c.y1.toFixed(1)}, ${c.x2.toFixed(1)}, ${c.y2.toFixed(1)}, ${c.profondeur || 0.6}, ${c.diametreCanalisation || 0.1});\n  // canvas.add(canal${i});\n\n`;
  });
  
  
  // ARBRES À PLANTER (commentaires)
  planData.arbresAPlanter.forEach((a, i) => {
    code += `  // ${a.arbreData?.name || 'Arbre'} (${a.arbreData?.id}) - Position: ${(a.left * echelle).toFixed(1)},${(a.top * echelle).toFixed(1)} px | ${a.left.toFixed(2)},${a.top.toFixed(2)} m\n`;
  });
  
  console.log('%c' + code, 'color: #2196f3; font-family: monospace; font-size: 11px');
  console.log('');
  console.log('%c✅ Résumé:', 'font-weight: bold; font-size: 12px');
  console.log(`  🏠 Maisons: ${planData.maisons.length}`);
  console.log(`  💧 Citernes: ${planData.citernes.length}`);
  console.log(`  🟦 Caissons d'eau: ${planData.caissonsEau.length}`);
  console.log(`  🏡 Terrasses: ${planData.terrasses.length}`);
  console.log(`  🟩 Pavés enherbés: ${planData.paves.length}`);
  console.log(`  🚧 Clôtures: ${planData.clotures.length}`);
  console.log(`  🚰 Canalisations: ${planData.canalisations.length}`);
  console.log(`  🌳 Arbres à planter: ${planData.arbresAPlanter.length}`);
  }, 1000); // Attendre 1 seconde après la dernière modification
};

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
    maisons: [],
    canalisations: [],
    arbresAPlanter: [],
    terrasses: [],
    paves: [],
    citernes: [],
    caissonsEau: [],
    clotures: []
  };

  objets.forEach(obj => {
    if (obj.isGridLine || obj.measureLabel || obj.labelCentral || obj.isBoussole || obj.isSolIndicator || 
        obj.alignmentGuide || obj.isDimensionBox || obj.isAideButton || obj.isImageFond) return;

    if (obj.customType === 'maison') {
      planData.maisons.push({
        left: obj.left / echelle,
        top: obj.top / echelle,
        width: obj.getScaledWidth() / echelle,
        height: obj.getScaledHeight() / echelle,
        angle: obj.angle || 0,
        profondeurFondations: obj.profondeurFondations,
        hauteurBatiment: obj.hauteurBatiment
      });
    } else if (obj.customType === 'canalisation') {
      planData.canalisations.push({
        x1: obj.x1,
        y1: obj.y1,
        x2: obj.x2,
        y2: obj.y2,
        profondeur: obj.profondeur || 0.6,
        diametreCanalisation: obj.diametreCanalisation || 0.1
      });
    } else if (obj.customType === 'cloture') {
      planData.clotures.push({
        x1: obj.x1,
        y1: obj.y1,
        x2: obj.x2,
        y2: obj.y2,
        hauteurCloture: obj.hauteurCloture || 1.5,
        epaisseur: obj.epaisseur || 0.05
      });
    } else if (obj.customType === 'arbre-a-planter') {
      planData.arbresAPlanter.push({
        left: obj.left / echelle,
        top: obj.top / echelle,
        arbreData: obj.arbreData
      });
    } else if (obj.customType === 'caisson-eau') {
      planData.caissonsEau.push({
        left: obj.left / echelle,
        top: obj.top / echelle,
        angle: obj.angle || 0,
        largeurCaisson: obj.largeurCaisson || 5,
        profondeurCaisson: obj.profondeurCaisson || 3,
        hauteurCaisson: obj.hauteurCaisson || 1,
        profondeurEnterree: obj.profondeurEnterree || 1.0,
        elevationSol: obj.elevationSol || 0
      });
    } else if (obj.customType === 'terrasse') {
      planData.terrasses.push({
        left: obj.left / echelle,
        top: obj.top / echelle,
        width: obj.getScaledWidth() / echelle,
        height: obj.getScaledHeight() / echelle,
        angle: obj.angle || 0,
        hauteurDalle: obj.hauteurDalle || 0.15,
        profondeurFondation: obj.profondeurFondation || 0.3,
        elevationSol: obj.elevationSol || 0
      });
    } else if (obj.customType === 'paves') {
      planData.paves.push({
        left: obj.left / echelle,
        top: obj.top / echelle,
        width: obj.getScaledWidth() / echelle,
        height: obj.getScaledHeight() / echelle,
        angle: obj.angle || 0,
        hauteurPaves: obj.hauteurPaves || 0.08,
        profondeurGravier: obj.profondeurGravier || 0.15,
        elevationSol: obj.elevationSol || 0
      });
    } else if (obj.customType === 'citerne') {
      planData.citernes.push({
        left: obj.left / echelle,
        top: obj.top / echelle,
        width: obj.getScaledWidth() / echelle,
        height: obj.getScaledHeight() / echelle,
        angle: obj.angle || 0,
        profondeur: obj.profondeur,
        diametre: obj.diametre,
        elevationSol: obj.elevationSol || 0
      });
    }
  });

  localStorage.setItem('planTerrain', JSON.stringify(planData));
  onPlanComplete(planData);
  
  // ✅ LOG COPIABLE automatique avec throttle de 1 seconde
  loggerPositionsPlanCopiable(planData, echelle);
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
          isImageFond: true,
          evented: true
        });
        
        canvas.add(img);
        
        // Ordre de profondeur: grille (tout derrière) -> image fond -> objets
        const allObjects = canvas.getObjects();
        const gridLines = allObjects.filter(o => o.isGridLine);
        
        // Envoyer l'image tout au fond
        canvas.sendObjectToBack(img);
        
        // Envoyer les lignes de grille encore plus au fond
        gridLines.forEach(line => canvas.sendObjectToBack(line));
        
        imageFondRef.current = img;
        setImageFondChargee(true);
        
        canvas.renderAll();
        
        logger.info('ImageFond', `✅ Image chargée (${img.width}x${img.height}px, échelle: ${scale.toFixed(2)})`);
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
    logger.warn('ImageFond', 'Aucune image de fond à supprimer');
    return;
  }
  
  // Suppression directe sans confirmation
    canvas.remove(imageFondRef.current);
    imageFondRef.current = null;
    setImageFondChargee(false);
    canvas.renderAll();
  logger.info('ImageFond', 'Image de fond supprimée');
};

/**
 * Ajouter les mesures live sur les objets
 */
export const ajouterMesuresLive = (canvas, echelle, exporterPlanCallback) => {
  // Supprimer les anciens labels de mesures
  canvas.getObjects().forEach(obj => {
    if (obj.measureLabel) canvas.remove(obj);
  });

  canvas.getObjects().forEach(obj => {
    if (obj.isGridLine || obj.measureLabel || obj.isBoussole || obj.isSolIndicator || 
        obj.alignmentGuide || obj.isDimensionBox || obj.isAideButton || obj.isImageFond) return;

    // Ajouter les mesures sur les bords pour tous les objets rectangulaires
    if (obj.customType === 'maison' || obj.customType === 'terrasse' || obj.customType === 'paves' || obj.customType === 'caisson-eau') {
      const w = obj.getScaledWidth() / echelle;
      const h = obj.getScaledHeight() / echelle;
      
      const wText = w.toFixed(1);
      const hText = h.toFixed(1);
      
      // Label LARGEUR (en haut, centré le long de la ligne supérieure)
      const labelW = new fabric.Text(`${wText}m`, {
        left: obj.left,
        top: obj.top - obj.getScaledHeight() / 2 - 20, // Plus éloigné de la ligne
        fontSize: 11,
        fill: '#1976d2',
        fontWeight: 'bold',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        originX: 'center',
        originY: 'bottom', // Aligné par le bas pour être au-dessus de la ligne
        selectable: false,
        hasControls: false,
        hasBorders: false,
        lockMovementX: true,
        lockMovementY: true,
        measureLabel: true,
        measureType: 'width',
        targetObject: obj
      });

      canvas.add(labelW);

      // Label HAUTEUR (à droite, centré le long de la ligne droite)
      const labelH = new fabric.Text(`${hText}m`, {
        left: obj.left + obj.getScaledWidth() / 2 + 15, // Plus éloigné de la ligne
        top: obj.top,
        fontSize: 11,
        fill: '#1976d2',
        fontWeight: 'bold',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        originX: 'left', // Aligné par la gauche pour être à droite de la ligne
        originY: 'center',
        selectable: false,
        hasControls: false,
        hasBorders: false,
        lockMovementX: true,
        lockMovementY: true,
        measureLabel: true,
        measureType: 'height',
        targetObject: obj
      });

      canvas.add(labelH);
    } else if (obj.customType === 'citerne') {
      // Pour les citernes circulaires
      const d = (obj.diametre || 1.5).toFixed(1);
      const p = (obj.profondeur || 2.5).toFixed(1);
      const volume = (Math.PI * Math.pow(d / 2, 2) * p).toFixed(1);
      
      const rayon = obj._objects[0].radius * (obj.scaleX || 1);
      
      const labelCiterne = new fabric.Text(`Ø${d}m · ${volume}m³\nProf: ${p}m`, {
        left: obj.left,
        top: obj.top - rayon - 25, // Plus éloigné du cercle
        fontSize: 9,
        fill: '#1976d2',
        fontWeight: 'bold',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        originX: 'center',
        originY: 'bottom', // Aligné par le bas
        textAlign: 'center',
        selectable: false,
        hasControls: false,
        hasBorders: false,
        measureLabel: true,
        targetObject: obj
      });

      canvas.add(labelCiterne);
    }
  });
  
  canvas.renderAll();
};

