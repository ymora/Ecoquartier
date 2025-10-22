/**
 * exportImport.js  
 * Export/import du plan et gestion image de fond
 */

import * as fabric from 'fabric';
import logger from '../logger';
import { forcerTriObjets } from './depthSorting';

/**
 * Mettre à jour les labels des Groups après redimensionnement
 * ✅ Modifie le texte existant ou crée les labels s'ils n'existent pas
 */
export const mettreAJourLabelsGroups = (canvas, echelle) => {
  if (!canvas) return;
  
  canvas.getObjects().forEach(obj => {
    // Uniquement les Groups avec labels
    if (!obj._objects || obj._objects.length < 2) return;
    if (obj.isGridLine || obj.isBoussole || obj.isImageFond) return;
    
    // Debug: vérifier la structure
    // logger.debug('Labels', `Obj ${obj.customType}: ${obj._objects.length} éléments`);
    
    // Structure : [forme, icône, labelDimensions] (3 éléments)
    // ou [forme, icône] (2 éléments - besoin de créer labelDimensions)
    // ou [ellipse, emoji, nomLabel, dimensionsLabel] (4 éléments pour arbres)
    
    let labelDimensions = null;
    let needsCreation = false;
    
    if (obj._objects.length === 3) {
      // Format standard : forme + icône + dimensions
      labelDimensions = obj._objects[2];
    } else if (obj._objects.length === 4 && obj.customType === 'arbre-a-planter') {
      // Format arbre : ellipse + emoji + nom + dimensions
      labelDimensions = obj._objects[3];
    } else if (obj._objects.length === 2 && obj.customType && obj.customType !== 'arbre-a-planter') {
      // Format sans dimensions : forme + icône uniquement - il faut créer le label
      needsCreation = true;
    }
    
    if (!needsCreation && (!labelDimensions || labelDimensions.type !== 'text')) return;
    
    let newText = '';
    
    if (obj.customType === 'maison') {
      const w = (obj.getScaledWidth() / echelle).toFixed(1);
      const h = (obj.getScaledHeight() / echelle).toFixed(1);
      newText = `${w}×${h}m`;
    } else if (obj.customType === 'terrasse') {
      const w = (obj.getScaledWidth() / echelle).toFixed(1);
      const h = (obj.getScaledHeight() / echelle).toFixed(1);
      newText = `${w}×${h}m`;
    } else if (obj.customType === 'paves') {
      const w = (obj.getScaledWidth() / echelle).toFixed(1);
      const h = (obj.getScaledHeight() / echelle).toFixed(1);
      newText = `${w}×${h}m`;
    } else if (obj.customType === 'citerne') {
      const d = (obj.diametre || 1.5).toFixed(1);
      const p = (obj.profondeur || 2.5).toFixed(1);
      const volume = (Math.PI * Math.pow(d / 2, 2) * p).toFixed(1);
      newText = `Ø${d}m · ${volume}m³\nProf: ${p}m`;
    } else if (obj.customType === 'caisson-eau') {
      const largeur = (obj.largeurCaisson || 5).toFixed(1);
      const profondeur = (obj.profondeurCaisson || 3).toFixed(1);
      const hauteur = (obj.hauteurCaisson || 1).toFixed(1);
      const volume = (largeur * profondeur * hauteur).toFixed(1);
      newText = `${largeur}×${profondeur}×${hauteur}m · ${volume}m³`;
    }
    
    // Créer ou mettre à jour le label
    if (needsCreation && newText) {
      // Créer un nouveau label de dimensions
      const forme = obj._objects[0];
      let posY = 0;
      
      if (forme.type === 'rect') {
        posY = -(obj.getScaledHeight() / 2) - 15;
      } else if (forme.type === 'circle') {
        posY = -(forme.radius * (forme.scaleX || 1)) - 18;
      }
      
      const couleur = obj.customType === 'maison' ? '#757575' :
                     obj.customType === 'terrasse' ? '#757575' :
                     obj.customType === 'paves' ? '#7cb342' :
                     obj.customType === 'citerne' ? '#1976d2' :
                     obj.customType === 'caisson-eau' ? '#1565c0' : '#757575';
      
      const labelDim = new fabric.Text(newText, {
        left: 0,
        top: posY,
        fontSize: obj.customType === 'caisson-eau' || obj.customType === 'citerne' ? 9 : 10,
        fontWeight: '600',
        fill: couleur,
        textAlign: 'center',
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: 2
      });
      
      obj.add(labelDim);
      obj.dirty = true;
      obj.setCoords();
    } else if (newText && labelDimensions && labelDimensions.text !== newText) {
      // Mettre à jour le label existant
      labelDimensions.set({ text: newText });
      obj.dirty = true;
    }
  });
};

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
  
  // MAISON
  if (planData.maison) {
    const angleStr = planData.maison.angle ? `, angle: ${planData.maison.angle}` : '';
    code += `  // MAISON\n  const maison = new fabric.Rect({left: ${(planData.maison.left * echelle).toFixed(1)}, top: ${(planData.maison.top * echelle).toFixed(1)}, width: ${(planData.maison.width * echelle).toFixed(1)}, height: ${(planData.maison.height * echelle).toFixed(1)}, fill: '#bdbdbd', stroke: '#757575', strokeWidth: 3, customType: 'maison', profondeurFondations: ${planData.maison.profondeurFondations || 1.2}, hauteurBatiment: ${planData.maison.hauteurBatiment || 7}${angleStr}});\n  canvas.add(maison);\n\n`;
  }
  
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
  console.log(`  🏠 Maison: ${planData.maison ? '✅' : '❌'}`);
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
    maison: null,
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
      planData.maison = {
        left: obj.left / echelle,
        top: obj.top / echelle,
        width: obj.getScaledWidth() / echelle,
        height: obj.getScaledHeight() / echelle,
        angle: obj.angle || 0,
        profondeurFondations: obj.profondeurFondations,
        hauteurBatiment: obj.hauteurBatiment
      };
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
        profondeurEnterree: obj.profondeurEnterree || 1.0
      });
    } else if (obj.customType === 'terrasse') {
      planData.terrasses.push({
        left: obj.left / echelle,
        top: obj.top / echelle,
        width: obj.getScaledWidth() / echelle,
        height: obj.getScaledHeight() / echelle,
        angle: obj.angle || 0,
        hauteurDalle: obj.hauteurDalle || 0.15,
        profondeurFondation: obj.profondeurFondation || 0.3
      });
    } else if (obj.customType === 'paves') {
      planData.paves.push({
        left: obj.left / echelle,
        top: obj.top / echelle,
        width: obj.getScaledWidth() / echelle,
        height: obj.getScaledHeight() / echelle,
        angle: obj.angle || 0,
        hauteurPaves: obj.hauteurPaves || 0.08,
        profondeurGravier: obj.profondeurGravier || 0.15
      });
    } else if (obj.customType === 'citerne') {
      planData.citernes.push({
        left: obj.left / echelle,
        top: obj.top / echelle,
        width: obj.getScaledWidth() / echelle,
        height: obj.getScaledHeight() / echelle,
        angle: obj.angle || 0,
        profondeur: obj.profondeur,
        diametre: obj.diametre
      });
    }
  });

  localStorage.setItem('planTerrain', JSON.stringify(planData));
  onPlanComplete(planData);
  
  // ✅ LOG COPIABLE automatique avec throttle de 1 seconde
  loggerPositionsPlanCopiable(planData, echelle);
};

/**
 * Charger un plan depuis localStorage
 * ⚠️ FONCTION OBSOLÈTE - Le chargement se fait maintenant automatiquement
 * Cette fonction n'est plus utilisée car le plan se recharge automatiquement
 * depuis localStorage à chaque modification
 */
export const chargerPlanSauvegarde = (canvas, echelle, ajouterMesuresLive) => {
  logger.warn('ImportPlan', 'chargerPlanSauvegarde est obsolète - utiliser le système automatique');
  // Ne fait plus rien - le plan se charge automatiquement
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
  // ✅ Mettre à jour les labels des Groups (crée automatiquement les dimensions si absentes)
  mettreAJourLabelsGroups(canvas, echelle);
  
  // Supprimer les anciens labels de mesures externes (ne sont plus utilisés)
  canvas.getObjects().forEach(obj => {
    if (obj.measureLabel) canvas.remove(obj);
  });
  
  canvas.renderAll();
};

