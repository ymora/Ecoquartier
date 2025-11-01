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
 * Télécharger le plan actuel en fichier JSON
 */
export const telechargerPlanJSON = (canvas, dimensions, orientation, echelle) => {
  if (!canvas) {
    logger.error('Export', 'Canvas non disponible');
    return;
  }
  
  // Réutiliser la logique d'exporterPlan pour extraire les données
  const planData = extraireDonneesPlan(canvas, dimensions, orientation, echelle);
  
  // Créer un blob JSON
  const jsonString = JSON.stringify(planData, null, 2);
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
  
  logger.success('Export', `Plan exporté : ${a.download}`);
};

/**
 * Extraire les données du plan (fonction réutilisable)
 */
const extraireDonneesPlan = (canvas, dimensions, orientation, echelle) => {
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
    clotures: [],
    terrain: null // ✅ Données du terrain avec maillage
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
        largeur: obj.largeur || 10,
        profondeur: obj.profondeur || 10,
        hauteur: obj.hauteur || 7,
        elevationSol: obj.elevationSol || 0,
        typeToit: obj.typeToit || 'deux-pentes'
      });
    } else if (obj.customType === 'canalisation') {
      planData.canalisations.push({
        x1: obj.x1,
        y1: obj.y1,
        x2: obj.x2,
        y2: obj.y2,
        diametre: obj.diametre || 0.1,
        elevationSol: obj.elevationSol || -0.6
      });
    } else if (obj.customType === 'cloture') {
      planData.clotures.push({
        x1: obj.x1,
        y1: obj.y1,
        x2: obj.x2,
        y2: obj.y2,
        hauteur: obj.hauteur || 1.5,
        epaisseur: obj.epaisseur || 0.05,
        elevationSol: obj.elevationSol !== undefined ? obj.elevationSol : 0.05 // ✅ 5 cm au-dessus du sol
      });
    } else if (obj.customType === 'arbre-a-planter') {
      planData.arbresAPlanter.push({
        left: obj.left / echelle,
        top: obj.top / echelle,
        arbreData: obj.arbreData,
        elevationSol: obj.elevationSol || 0 // ✅ Exporter l'élévation du sol
      });
    } else if (obj.customType === 'caisson-eau') {
      planData.caissonsEau.push({
        left: obj.left / echelle,
        top: obj.top / echelle,
        angle: obj.angle || 0,
        largeur: obj.largeur || 5,
        profondeur: obj.profondeur || 3,
        hauteur: obj.hauteur || 1,
        elevationSol: obj.elevationSol || -1.0
      });
    } else if (obj.customType === 'terrasse') {
      planData.terrasses.push({
        left: obj.left / echelle,
        top: obj.top / echelle,
        width: obj.getScaledWidth() / echelle,
        height: obj.getScaledHeight() / echelle,
        angle: obj.angle || 0,
        largeur: obj.largeur || (obj.getScaledWidth() / echelle),
        profondeur: obj.profondeur || (obj.getScaledHeight() / echelle),
        hauteur: obj.hauteur || 0.15,
        elevationSol: obj.elevationSol || 0
      });
    } else if (obj.customType === 'paves') {
      planData.paves.push({
        left: obj.left / echelle,
        top: obj.top / echelle,
        width: obj.getScaledWidth() / echelle,
        height: obj.getScaledHeight() / echelle,
        angle: obj.angle || 0,
        largeur: obj.largeur || (obj.getScaledWidth() / echelle),
        profondeur: obj.profondeur || (obj.getScaledHeight() / echelle),
        hauteur: obj.hauteur || 0.08,
        elevationSol: obj.elevationSol || 0
      });
    } else if (obj.customType === 'citerne') {
      planData.citernes.push({
        left: obj.left / echelle,
        top: obj.top / echelle,
        width: obj.getScaledWidth() / echelle,
        height: obj.getScaledHeight() / echelle,
        angle: obj.angle || 0,
        diametre: obj.diametre || 1.5,
        longueur: obj.longueur || 2.5,
        hauteur: obj.hauteur || obj.diametre || 1.5,
        volume: obj.volume || 3000,
        elevationSol: obj.elevationSol || -2.5
      });
    } else if (obj.customType === 'sol') {
      // ✅ Exporter le terrain avec son maillage d'élévation
      planData.terrain = {
        largeur: obj.width / echelle,
        hauteur: obj.height / echelle,
        couchesSol: obj.couchesSol || [],
        maillageElevation: obj.maillageElevation || null,
        tailleMailleM: obj.tailleMailleM || 5
      };
    }
  });

  localStorage.setItem('planTerrain', JSON.stringify(planData));
  onPlanComplete(planData);
  
  // ❌ LOG COPIABLE retiré - sera généré uniquement sur demande via bouton "Actions"
  // loggerPositionsPlanCopiable(planData, echelle);
};

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

