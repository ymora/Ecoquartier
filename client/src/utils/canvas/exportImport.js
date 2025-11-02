/**
 * exportImport.js  
 * Export/import du plan et gestion image de fond
 */

import * as fabric from 'fabric';
import logger from '../logger';
import { debugLog } from '../../config/debug';
import { canvasOperations } from './canvasOperations';


// Timer pour throttle du logger
let loggerTimeout = null;

/**
 * Logger les positions du plan en format COPIABLE
 * ✅ Permet de copier-coller pour créer un plan par défaut
 * ⚠️ Throttlé à 1 fois par seconde pour éviter les boucles infinies
 */
export const loggerPositionsPlanCopiable = (planData, echelle) => {
  console.log('🔧 DEBUG: loggerPositionsPlanCopiable appelé avec:', planData);
  
  // Throttle : Ne logger qu'une fois par seconde
  if (loggerTimeout) {
    clearTimeout(loggerTimeout);
  }
  
  loggerTimeout = setTimeout(() => {
    console.clear();
  
  console.log('%c═══════════════════════════════════════════════════════', 'color: #4caf50; font-weight: bold');
  console.log('%c📋 JSON DU PLAN PAR DÉFAUT - FORMAT COPIABLE', 'color: #4caf50; font-weight: bold; font-size: 16px');
  console.log('%c═══════════════════════════════════════════════════════', 'color: #4caf50; font-weight: bold');
  console.log('');
  
  // Générer un JSON propre du plan par défaut
  const planParDefaut = {
    metadata: {
      generated: new Date().toISOString(),
      dimensions: `${planData.largeur}m × ${planData.hauteur}m`,
      orientation: planData.orientation,
      echelle: echelle
    },
    objets: {
      maisons: planData.maisons || [],
      citernes: planData.citernes || [],
      caissonsEau: planData.caissonsEau || [],
      terrasses: planData.terrasses || [],
      paves: planData.paves || [],
      canalisations: planData.canalisations || [],
      clotures: planData.clotures || [],
      arbres: planData.arbres || []
    }
  };
  
  console.log('%c💡 Copiez le JSON ci-dessous pour mettre à jour planDemo.js', 'color: #ff9800; font-weight: bold');
  console.log('');
  console.log('%cJSON du plan par défaut:', 'color: #2196f3; font-weight: bold');
  console.log(JSON.stringify(planParDefaut, null, 2));
  console.log('');
  console.log('%c💾 Pour utiliser ce JSON, remplacez le contenu de planDemo.js par ce format', 'color: #4caf50; font-weight: bold');
  
  }, 1000); // Throttle de 1 seconde
};

/**
 * Télécharger le plan actuel en fichier JSON (format compatible avec planLoader)
 */
export const telechargerPlanJSON = (canvas, dimensions, orientation, echelle) => {
  if (!canvas) {
    logger.error('Export', 'Canvas non disponible');
    return;
  }
  
  const objets = canvas.getObjects();
  
  // ✅ Convertir au format compatible avec planLoader.js
  const planJSON = {
    metadata: {
      version: '1.0',
      description: 'Plan exporté',
      date: new Date().toISOString(),
      dimensions: `${dimensions.largeur}m × ${dimensions.hauteur}m`,
      orientation: orientation
    },
    objets: []
  };
  
  // ✅ Compteurs pour IDs uniques
  const compteurs = {};
  
  // ✅ Variable pour éviter terrain dupliqué
  let terrainExporte = false;
  
  objets.forEach(obj => {
    // ✅ Filtrer TOUS les éléments UI (pas seulement grille, boussole)
    if (obj.isGridLine || obj.measureLabel || obj.isBoussole || obj.isImageFond || 
        obj.isSolIndicator || obj.isCenterMark || obj.alignmentGuide || 
        obj.isDimensionBox || obj.isAideButton) return;
    
    // ✅ Éviter les sous-éléments du maillage du terrain (nœuds, lignes)
    if (obj.isNoeudMaillage || obj.isLigneMaillage) return;
    
    let objetExporte = null;
    
    switch (obj.customType) {
      case 'maison':
        // ✅ Générer ID unique avec compteur
        compteurs.maison = (compteurs.maison || 0) + 1;
        objetExporte = {
          type: 'maison',
          id: obj.customId || `maison-${Date.now()}-${compteurs.maison}`,
          pos: [obj.left, obj.top],
          dim: [obj.largeur || 10, obj.profondeur || 10],
          props: {
            hauteur: obj.hauteur || 7,
            angle: obj.angle || 0,
            elevationSol: obj.elevationSol || 0,
            typeToit: obj.typeToit || 'deux-pentes',
            penteToit: obj.penteToit || 30,
            orientationToit: obj.orientationToit || 0
          }
        };
        break;
        
      case 'terrasse':
        compteurs.terrasse = (compteurs.terrasse || 0) + 1;
        objetExporte = {
          type: 'terrasse',
          id: obj.customId || `terrasse-${Date.now()}-${compteurs.terrasse}`,
          pos: [obj.left, obj.top],
          dim: [obj.largeur || 5, obj.profondeur || 4],
          props: {
            hauteur: obj.hauteur || 0.15,
            angle: obj.angle || 0,
            elevationSol: obj.elevationSol || 0
          }
        };
        break;
        
      case 'paves':
        compteurs.paves = (compteurs.paves || 0) + 1;
        objetExporte = {
          type: 'paves',
          id: obj.customId || `paves-${Date.now()}-${compteurs.paves}`,
          pos: [obj.left, obj.top],
          dim: [obj.largeur || 5, obj.profondeur || 5],
          props: {
            hauteur: obj.hauteur || 0.08,
            angle: obj.angle || 0,
            elevationSol: obj.elevationSol || 0
          }
        };
        break;
        
      case 'caisson-eau':
        compteurs.caisson = (compteurs.caisson || 0) + 1;
        objetExporte = {
          type: 'caisson-eau',
          id: obj.customId || `caisson-${Date.now()}-${compteurs.caisson}`,
          pos: [obj.left, obj.top],
          dim: [obj.largeur || 5, obj.profondeur || 3],
          props: {
            hauteur: obj.hauteur || 1,
        angle: obj.angle || 0,
            elevationSol: obj.elevationSol || -1.0
          }
        };
        break;
        
      case 'sol':
        // ✅ Exporter le terrain UNE SEULE FOIS
        if (terrainExporte) {
          logger.warn('Export', 'Terrain déjà exporté, objet ignoré (doublon)');
          return; // Sortir du forEach
        }
        
        terrainExporte = true;
        objetExporte = {
          type: 'sol',
          id: 'terrain-principal',
          pos: [0, 0],
          dim: [dimensions.largeur, dimensions.hauteur],
          props: {
            couchesSol: obj.couchesSol || [],
            maillageElevation: obj.maillageElevation || null,
            tailleMailleM: obj.tailleMailleM || 5
          }
        };
        break;
        
      case 'arbre-a-planter':
      case 'arbre-existant':
      case 'arbre':
        compteurs.arbre = (compteurs.arbre || 0) + 1;
        objetExporte = {
          type: 'arbre',
          id: obj.customId || obj.planteId || `arbre-${Date.now()}-${compteurs.arbre}`,
          pos: [obj.left, obj.top],
          dim: null,
          props: {
            // ✅ OPTIMISÉ : Stocker uniquement l'ID de l'arbre (pas tout arbreData)
            // arbreData sera rechargé depuis arbustesData.js à l'import
            arbreId: obj.arbreData?.id,
            nomPlante: obj.nomPlante || obj.arbreData?.nom,
            planteId: obj.planteId,
            elevationSol: obj.elevationSol || 0
            // ✅ validationStatus sera recalculé à l'import
          }
        };
        break;
        
      case 'canalisation':
        compteurs.canalisation = (compteurs.canalisation || 0) + 1;
        objetExporte = {
          type: 'canalisation',
          id: obj.customId || `canalisation-${Date.now()}-${compteurs.canalisation}`,
          pos: [obj.x1, obj.y1],
          dim: [obj.x2 - obj.x1, obj.y2 - obj.y1],
          props: {
        x1: obj.x1,
        y1: obj.y1,
        x2: obj.x2,
        y2: obj.y2,
        diametre: obj.diametre || 0.1,
        elevationSol: obj.elevationSol || -0.6
          }
        };
        break;
        
      case 'cloture':
        compteurs.cloture = (compteurs.cloture || 0) + 1;
        objetExporte = {
          type: 'cloture',
          id: obj.customId || `cloture-${Date.now()}-${compteurs.cloture}`,
          pos: [obj.x1, obj.y1],
          dim: [obj.x2 - obj.x1, obj.y2 - obj.y1],
          props: {
        x1: obj.x1,
        y1: obj.y1,
        x2: obj.x2,
        y2: obj.y2,
            hauteur: obj.hauteur || 2,
            epaisseur: obj.epaisseur || 0.1,
            elevationSol: obj.elevationSol || 0.05
          }
        };
        break;
        
      case 'citerne':
        compteurs.citerne = (compteurs.citerne || 0) + 1;
        objetExporte = {
          type: 'citerne',
          id: obj.customId || `citerne-${Date.now()}-${compteurs.citerne}`,
          pos: [obj.left, obj.top],
          dim: [obj.width || 2, obj.height || 2],
          props: {
            capacite: obj.capacite || 5000,
            diametre: obj.diametre || 2,
            hauteur: obj.hauteur || 2,
        angle: obj.angle || 0,
            elevationSol: obj.elevationSol || -2.0
          }
        };
        break;
    }
    
    if (objetExporte) {
      planJSON.objets.push(objetExporte);
    }
  });
  
  // 🔍 VALIDATION : Vérifier que le JSON est valide avant export
  let jsonString;
  try {
    jsonString = JSON.stringify(planJSON, null, 2);
    
    // Test de parsing pour vérifier la validité
    JSON.parse(jsonString);
    
    logger.info('Export', `✅ JSON valide généré (${planJSON.objets.length} objets)`);
    console.log('📋 Aperçu du JSON exporté:', planJSON);
  } catch (error) {
    logger.error('Export', `❌ Erreur lors de la génération du JSON: ${error.message}`);
    alert(`Erreur lors de l'export: ${error.message}`);
    return;
  }
  
  // Créer un blob JSON
  const blob = new Blob([jsonString], { type: 'application/json' });
  
  // Créer un lien de téléchargement
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `plan-haies-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  logger.info('Export', `✅ Plan exporté : ${a.download} (${planJSON.objets.length} objets)`);
};

/**
 * ✅ FONCTION SIMPLIFIÉE - Callback pour synchronisation 3D
 * Signature conservée pour compatibilité, mais seuls canvas et onPlanComplete sont utilisés
 */
export const exporterPlan = (canvas, dimensions, orientation, echelle, onPlanComplete) => {
  // Ancienne signature : (canvas, dimensions, orientation, echelle, onPlanComplete)
  // Nouvelle logique : Simple callback sans génération de format JSON
  if (onPlanComplete) {
    onPlanComplete(canvas);
  }
};

/**
 * ✅ CODE NETTOYÉ - Un seul système d'export/import
 * 
 * Avant: 2 fonctions avec formats différents (PIXELS vs MÈTRES)
 * Maintenant: 1 seul format (PIXELS) via telechargerPlanJSON()
 * 
 * Export: telechargerPlanJSON() → Fichier JSON en PIXELS
 * Import: planLoader.js → Charge JSON en PIXELS
 * Callback: exporterPlan() → Simple callback pour sync 3D
 */

/**
 * Charger une image de fond
 */
export const chargerImageFond = (fabricCanvasRef, imageFondRef, opaciteImage, setImageFondChargee, ajouterGrille) => {
  console.log('🔍 chargerImageFond appelée');
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/png,image/jpeg,image/jpg';
  
  input.onchange = (e) => {
    const file = e.target.files[0];
    console.log('📁 Fichier sélectionné:', file ? file.name : 'Aucun fichier');
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      console.log('📖 Fichier lu avec succès');
      const imgUrl = event.target.result;
      
      try {
        console.log('🔄 Tentative de création de l\'image Fabric...');
        
        // Créer une URL temporaire pour l'image
        const blob = new Blob([file], { type: file.type });
        const url = URL.createObjectURL(blob);
        
        // Utiliser fabric.Image.fromURL avec l'URL temporaire
        fabric.Image.fromURL(url, (img) => {
          console.log('🖼️ Image Fabric chargée:', img);
        const canvas = fabricCanvasRef.current;
          if (!canvas) {
            console.error('❌ Canvas non disponible');
            return;
          }
        
        if (imageFondRef.current) {
          canvasOperations.supprimer(canvas, imageFondRef.current);
        }
        
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );
        
        console.log('📏 Dimensions:', {
          image: { width: img.width, height: img.height },
          canvas: { width: canvas.width, height: canvas.height },
          scale: scale,
          center: { x: canvas.width / 2, y: canvas.height / 2 }
        });
        
        img.set({
          left: canvas.width / 2,
          top: canvas.height / 2,
          scaleX: scale,
          scaleY: scale,
          opacity: opaciteImage,
          selectable: true,
          hasControls: true,
          hasBorders: true,
          isImageFond: true,
          evented: true,
          // S'assurer que l'image est visible
          visible: true,
          // Centrer l'image sur le canvas
          originX: 'center',
          originY: 'center'
        });
        
        canvasOperations.ajouter(canvas, img);
        
        // Ordre de profondeur: grille (tout derrière) -> image fond -> objets
        const allObjects = canvas.getObjects();
        const gridLines = allObjects.filter(o => o.isGridLine);
        
        // Envoyer l'image tout au fond
        canvas.sendObjectToBack(img);
        
        // Envoyer les lignes de grille encore plus au fond
        gridLines.forEach(line => canvas.sendObjectToBack(line));
        
        imageFondRef.current = img;
        setImageFondChargee(true);
        
        canvasOperations.rendre(canvas);
        
        // Debug pour vérifier la visibilité
        console.log('Image de fond chargée:', {
          position: { left: img.left, top: img.top },
          scale: { x: img.scaleX, y: img.scaleY },
          opacity: img.opacity,
          visible: img.visible,
          origin: { x: img.originX, y: img.originY },
          canvasSize: { width: canvas.width, height: canvas.height }
        });
        
        logger.info('ImageFond', `✅ Image chargée (${img.width}x${img.height}px, échelle: ${scale.toFixed(2)}, opacité: ${opaciteImage})`);
        
        // Nettoyer l'URL temporaire
        URL.revokeObjectURL(url);
        
        }, (error) => {
          console.error('❌ Erreur lors du chargement de l\'image:', error);
          // Nettoyer l'URL temporaire même en cas d'erreur
          URL.revokeObjectURL(url);
        });
        
      } catch (error) {
        console.error('❌ Erreur lors de la création de l\'image:', error);
      }
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
    canvasOperations.rendre(fabricCanvasRef.current);
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
    canvasOperations.supprimer(canvas, imageFondRef.current);
    imageFondRef.current = null;
    setImageFondChargee(false);
    canvasOperations.rendre(canvas);
  logger.info('ImageFond', 'Image de fond supprimée');
};

/**
 * Ajouter les mesures live sur les objets
 */
export const ajouterMesuresLive = (canvas, echelle, exporterPlanCallback) => {
  // Supprimer les anciens labels de mesures
  canvas.getObjects().forEach(obj => {
    if (obj.measureLabel) canvasOperations.supprimer(canvas, obj);
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

      canvasOperations.ajouter(canvas, labelW);

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

      canvasOperations.ajouter(canvas, labelH);
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

      canvasOperations.ajouter(canvas, labelCiterne);
    }
  });
  
  canvasOperations.rendre(canvas);
};

