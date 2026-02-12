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

    console.log('%c💡 Copiez le JSON ci-dessous pour sauvegarder votre plan', 'color: #ff9800; font-weight: bold');
    console.log('');
    console.log('%cJSON de votre plan:', 'color: #2196f3; font-weight: bold');
    console.log(JSON.stringify(planParDefaut, null, 2));
    console.log('');
    console.log('%c💾 Sauvegardez ce JSON et utilisez "Importer plan" pour le recharger', 'color: #4caf50; font-weight: bold');

  }, 1000); // Throttle de 1 seconde
};

/**
 * Vérifier si le maillage contient des élévations (pour optimisation export)
 */
const estMaillageNonPlat = (maillage) => {
  if (!maillage || !Array.isArray(maillage)) return false;

  // Si au moins un nœud a une élévation != 0, le maillage est non-plat
  for (let i = 0; i < maillage.length; i++) {
    for (let j = 0; j < maillage[i].length; j++) {
      if (maillage[i][j] !== 0) return true;
    }
  }

  return false;
};

/**
 * Télécharger le plan actuel en fichier JSON (format compatible avec planLoader)
 */
export const telechargerPlanJSON = (canvas, dimensions, orientation, echelle) => {
  console.log('🔧 DEBUG telechargerPlanJSON:', { canvas, dimensions, orientation, echelle });

  if (!canvas) {
    logger.error('Export', 'Canvas non disponible');
    alert('❌ Erreur: Canvas non disponible pour l\'export');
    return;
  }

  const objets = canvas.getObjects();
  console.log('🔧 DEBUG objets sur le canvas:', objets.length);

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

    // ✅ Éviter les sous-éléments du maillage du terrain (nœuds, lignes, labels)
    if (obj.isNoeudMaillage || obj.isLigneMaillage || obj.isLabelMaillage) return;

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
          logger.warn('Export', '⚠️ Terrain dupliqué détecté, ignoré');
          return; // Sortir du forEach pour éviter duplication
        }

        terrainExporte = true;
        objetExporte = {
          type: 'sol',
          id: 'terrain-principal',
          pos: [0, 0], // Toujours centré
          dim: [dimensions.largeur, dimensions.hauteur], // Redondant avec metadata mais nécessaire pour import
          props: {
            couchesSol: obj.couchesSol || [],
            // ✅ Maillage : Ne stocker que si non-plat (optimisation)
            maillageElevation: estMaillageNonPlat(obj.maillageElevation) ? obj.maillageElevation : null,
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
  console.log('🔧 DEBUG blob créé:', blob.size, 'bytes');

  // Créer un lien de téléchargement
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `plan-haies-${new Date().toISOString().slice(0, 10)}.json`;
  console.log('🔧 DEBUG téléchargement:', a.download);

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  logger.info('Export', `✅ Plan exporté : ${a.download} (${planJSON.objets.length} objets)`);
  alert(`✅ Plan sauvegardé : ${a.download}\n${planJSON.objets.length} objets exportés`);
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
 * Charger une image de fond depuis une URL ou un fichier
 */
export const chargerImageDepuisURL = async (fabricCanvasRef, imageFondRef, opaciteImage, setImageFondChargee, imageUrl, dimensions, echelle) => {
  console.log('🔍 chargerImageDepuisURL:', imageUrl);

  const canvas = fabricCanvasRef.current;
  if (!canvas) {
    console.error('❌ Canvas non disponible');
    return;
  }

  try {
    const img = await fabric.Image.fromURL(imageUrl);
    console.log('🖼️ Image chargée avec succès!', img);
    if (!img) {
      console.error('❌ Image est null après chargement!');
      return;
    }

    if (imageFondRef.current) {
      canvasOperations.supprimer(canvas, imageFondRef.current);
    }

    // Le terrain est TOUJOURS centré à 0,0 (avec originX/Y: 'center')
    const centreTerrain = { x: 0, y: 0 };

    // ✅ ÉCHELLE RÉELLE : L'image doit correspondre aux dimensions du TERRAIN (en mètres)
    // Terrain : dimensions.largeur × dimensions.hauteur (mètres)
    // Taille en pixels : (dimensions.largeur × echelle) × (dimensions.hauteur × echelle)
    const tailleTerrainPxLargeur = dimensions.largeur * echelle;
    const tailleTerrainPxHauteur = dimensions.hauteur * echelle;

    const scaleX = tailleTerrainPxLargeur / img.width;
    const scaleY = tailleTerrainPxHauteur / img.height;

    console.log('📏 ÉCHELLE RÉELLE (même qu\'en 3D):');
    console.log('  - Terrain réel:', dimensions.largeur, 'm ×', dimensions.hauteur, 'm');
    console.log('  - Terrain en pixels:', tailleTerrainPxLargeur, 'px ×', tailleTerrainPxHauteur, 'px');
    console.log('  - Image originale:', img.width, 'px ×', img.height, 'px');
    console.log('  - Scale calculé:', { x: scaleX, y: scaleY });

    console.log('📐 Configuration de l\'image:', {
      dimensions: { width: img.width, height: img.height },
      scaleX: scaleX,
      scaleY: scaleY,
      position: centreTerrain,
      opacity: opaciteImage
    });

    img.set({
      left: centreTerrain.x,
      top: centreTerrain.y,
      scaleX: scaleX,
      scaleY: scaleY,
      opacity: opaciteImage,
      selectable: true,
      hasControls: true,
      hasBorders: true,
      isImageFond: true,
      evented: true,
      visible: true,
      originX: 'center',
      originY: 'center'
    });

    canvasOperations.ajouter(canvas, img);
    canvas.sendObjectToBack(img);

    imageFondRef.current = img;
    setImageFondChargee(true);
    canvasOperations.rendre(canvas);

    logger.info('ImageFond', `✅ Image chargée (${img.width}x${img.height}px, échelle: ${scaleX.toFixed(2)} × ${scaleY.toFixed(2)})`);
  } catch (error) {
    console.error('❌ Erreur lors du chargement de l\'image:', error);
    alert(`❌ Erreur chargement image: ${error.message}`);
  }
};

/**
 * Charger une image de fond depuis un fichier utilisateur
 */
export const chargerImageFond = (fabricCanvasRef, imageFondRef, opaciteImage, setImageFondChargee, dimensions, echelle) => {
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
      const imgUrl = event.target.result; // Data URL (base64)

      console.log('🔄 Tentative de création de l\'image Fabric...');
      console.log('📊 Type de données:', typeof imgUrl, '- Longueur:', imgUrl?.length);
      console.log('📊 Début de l\'URL:', imgUrl?.substring(0, 50));

      const canvas = fabricCanvasRef.current;
      if (!canvas) {
        console.error('❌ Canvas non disponible');
        alert('❌ Erreur: Canvas non disponible');
        return;
      }

      // Fabric.js v6 utilise des Promises (syntaxe moderne)
      fabric.Image.fromURL(imgUrl).then((img) => {
        console.log('🖼️ Image Fabric chargée avec succès!', img);
        if (!img) {
          console.error('❌ Image est null après chargement!');
          alert('❌ Erreur: Impossible de charger l\'image');
          return;
        }
        if (!canvas) {
          console.error('❌ Canvas non disponible');
          return;
        }

        if (imageFondRef.current) {
          canvasOperations.supprimer(canvas, imageFondRef.current);
        }

        // Trouver le centre du terrain (croix rouge)
        const terrainObj = canvas.getObjects().find(obj => obj.customType === 'sol');
        console.log('🔍 Terrain trouvé:', terrainObj ? 'OUI' : 'NON');
        if (terrainObj) {
          console.log('  - Position terrain:', { left: terrainObj.left, top: terrainObj.top });
          console.log('  - Origin terrain:', { x: terrainObj.originX, y: terrainObj.originY });
          console.log('  - Dimensions terrain:', { width: terrainObj.width, height: terrainObj.height });
        }

        // Le terrain est TOUJOURS centré à 0,0 (avec originX/Y: 'center')
        // Donc le centre absolu du terrain sur le canvas est à 0,0
        const centreTerrain = { x: 0, y: 0 };

        console.log('🎯 Centre du terrain utilisé pour l\'image:', centreTerrain);

        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );

        console.log('📏 Dimensions:', {
          image: { width: img.width, height: img.height },
          canvas: { width: canvas.width, height: canvas.height },
          scale: scale,
          centreTerrain: centreTerrain
        });

        // Configuration de l'image avec logs détaillés
        console.log('📐 Configuration de l\'image:');
        console.log('  - Dimensions image:', { width: img.width, height: img.height });
        console.log('  - Dimensions canvas:', { width: canvas.width, height: canvas.height });
        console.log('  - Scale calculé:', scale);
        console.log('  - Position (centre terrain):', centreTerrain);
        console.log('  - Opacité:', opaciteImage);

        img.set({
          left: centreTerrain.x,
          top: centreTerrain.y,
          scaleX: scale,
          scaleY: scale,
          opacity: opaciteImage,
          selectable: true,
          hasControls: true,
          hasBorders: true,
          isImageFond: true,
          evented: true,
          visible: true,
          originX: 'center',
          originY: 'center',
          // CRITIQUE: S'assurer que l'image a bien un fond
          backgroundColor: null,
          fill: null
        });

        console.log('✅ Image configurée:', {
          left: img.left,
          top: img.top,
          scaleX: img.scaleX,
          scaleY: img.scaleY,
          width: img.width,
          height: img.height,
          opacity: img.opacity,
          visible: img.visible
        });

        canvasOperations.ajouter(canvas, img);

        // Ordre de profondeur correct: image fond (index 0) -> grille (index 1+) -> objets
        console.log('🔧 Avant tri z-order, objets sur canvas:', canvas.getObjects().length);

        // 1. Envoyer l'image tout au fond (index 0)
        canvas.sendObjectToBack(img);
        console.log('🔧 Image envoyée au fond, son index:', canvas.getObjects().indexOf(img));

        // 2. La grille reste où elle est (au-dessus de l'image)
        // Ne PAS toucher à la grille, elle est déjà au bon endroit

        console.log('🔧 Après tri, ordre des objets:');
        canvas.getObjects().slice(0, 10).forEach((obj, idx) => {
          const type = obj.isImageFond ? '🖼️ IMAGE FOND' :
            obj.isGridLine ? '📏 GRILLE' :
              obj.customType ? `📦 ${obj.customType}` :
                '❓ ' + obj.type;
          console.log(`  Index ${idx}: ${type} - visible: ${obj.visible}, opacity: ${obj.opacity}`);
        });

        imageFondRef.current = img;
        setImageFondChargee(true);

        console.log('🎨 Rendu du canvas...');
        canvasOperations.rendre(canvas);

        // VÉRIFICATION POST-RENDU
        setTimeout(() => {
          const imgDansCanvas = canvas.getObjects().find(o => o.isImageFond);
          if (imgDansCanvas) {
            console.log('✅ VERIFICATION: Image présente dans le canvas après rendu');
            console.log('  - Index:', canvas.getObjects().indexOf(imgDansCanvas));
            console.log('  - Visible:', imgDansCanvas.visible);
            console.log('  - Opacity:', imgDansCanvas.opacity);
            console.log('  - Position:', { left: imgDansCanvas.left, top: imgDansCanvas.top });
            console.log('  - Scale:', { x: imgDansCanvas.scaleX, y: imgDansCanvas.scaleY });
            console.log('  - Rendered dimensions:', {
              width: imgDansCanvas.width * imgDansCanvas.scaleX,
              height: imgDansCanvas.height * imgDansCanvas.scaleY
            });
          } else {
            console.error('❌ ERREUR: Image NON trouvée dans le canvas après rendu!');
          }
        }, 100);

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
      }).catch((error) => {
        console.error('❌ Erreur Fabric.js lors du chargement de l\'image:', error);
        alert(`❌ Erreur lors du chargement de l'image: ${error.message}`);
      });
    };
    reader.readAsDataURL(file);
  };

  input.click();
};

/**
 * Charger le plan d'implantation par défaut au démarrage
 */
export const chargerPlanImplantationParDefaut = async (fabricCanvasRef, imageFondRef, opaciteImage, setImageFondChargee, dimensions, echelle) => {
  console.log('🏗️ Chargement du plan d\'implantation par défaut...');

  // Plan d'implantation d'exemple pour les nouveaux utilisateurs
  const imageParDefaut = '/images/plan-implantation-defaut.jpg';

  await chargerImageDepuisURL(fabricCanvasRef, imageFondRef, opaciteImage, setImageFondChargee, imageParDefaut, dimensions, echelle);
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

