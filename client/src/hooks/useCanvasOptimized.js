import { useCallback, useMemo, useRef } from 'react';
import { recentrerVueSurContenu } from '../utils/canvas/creerObjets';
import { notifications } from '../utils/notifications';

/**
 * Hook optimisé pour la gestion du canvas
 * Centralise la logique et optimise les performances
 */
export const useCanvasOptimized = ({
  fabricCanvasRef,
  echelle,
  ajouterGrille,
  ajouterBoussole,
  ajouterIndicateurSud,
  chargerPlanDemoUtils
}) => {
  // Refs pour éviter les re-renders
  const isInitializedRef = useRef(false);
  const lastSyncRef = useRef(0);

  // Fonction de chargement du plan par défaut optimisée
  const chargerPlanParDefaut = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Nettoyer complètement le canvas (sauf grille, boussole, etc.)
    const objets = canvas.getObjects().filter(obj => 
      !obj.isGridLine && 
      !obj.isBoussole && 
      !obj.isSolIndicator &&
      !obj.alignmentGuide &&
      !obj.isDimensionBox &&
      !obj.isAideButton &&
      !obj.isImageFond &&
      !obj.isCenterMark &&
      !obj.measureLabel
    );
    objets.forEach(obj => canvas.remove(obj));
    
    // Effacer le localStorage pour forcer le plan par défaut
    localStorage.removeItem('planTerrain');
    
    // Charger le plan par défaut
    chargerPlanDemoUtils(canvas, echelle, ajouterGrille);
    
    // Recentrer la vue sur le plan
    setTimeout(() => {
      recentrerVueSurContenu(canvas);
    }, 200);
    
    // Notification
    notifications.planLoaded();
  }, [fabricCanvasRef, echelle, ajouterGrille, chargerPlanDemoUtils]);

  // Fonction de génération de log optimisée
  const genererLogCopiable = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    // Récupérer les données du plan actuel depuis localStorage
    const planDataString = localStorage.getItem('planTerrain');
    
    if (!planDataString) {
      notifications.warning('Aucun plan sauvegardé');
      return;
    }
    
    const planData = JSON.parse(planDataString);
    
    // Générer le log dans la console
    console.log('=== LOG COPIABLE DU PLAN ===');
    console.log('Données du plan:', planData);
    console.log('Échelle:', echelle);
    console.log('Nombre d\'objets:', fabricCanvasRef.current.getObjects().length);
    console.log('========================');
    
    // Notification
    notifications.info('📋 Log généré ! Ouvrez la console (F12)');
  }, [fabricCanvasRef, echelle]);

  // Fonction de chargement d'image optimisée
  const chargerImageFond = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = fabricCanvasRef.current;
          
          // Supprimer l'ancienne image si elle existe
          const oldImage = canvas.getObjects().find(obj => obj.isImageFond);
          if (oldImage) canvas.remove(oldImage);
          
          // Créer la nouvelle image
          const fabricImage = new fabric.Image(img, {
            left: 0,
            top: 0,
            scaleX: canvas.width / img.width,
            scaleY: canvas.height / img.height,
            selectable: false,
            evented: false,
            isImageFond: true
          });
          
          canvas.add(fabricImage);
          canvas.sendToBack(fabricImage);
          canvas.renderAll();
          
          notifications.success('Image de fond chargée');
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    };
    
    input.click();
  }, [fabricCanvasRef]);

  // Statistiques optimisées avec useMemo
  const statistiques = useMemo(() => {
    if (!fabricCanvasRef.current) return {
      nbObjets: 0,
      nbMaisons: 0,
      nbArbres: 0,
      nbCiterne: 0,
      nbCaissonEau: 0,
      nbCanalisation: 0,
      nbCloture: 0,
      nbTerrasse: 0,
      nbPaves: 0
    };
    
    const objets = fabricCanvasRef.current.getObjects();
    const stats = objets.reduce((acc, obj) => {
      acc.nbObjets++;
      
      switch (obj.customType) {
        case 'maison':
          acc.nbMaisons++;
          break;
        case 'arbre-a-planter':
        case 'arbre-existant':
          acc.nbArbres++;
          break;
        case 'citerne':
          acc.nbCiterne++;
          break;
        case 'caisson-eau':
          acc.nbCaissonEau++;
          break;
        case 'canalisation':
          acc.nbCanalisation++;
          break;
        case 'cloture':
          acc.nbCloture++;
          break;
        case 'terrasse':
          acc.nbTerrasse++;
          break;
        case 'paves':
          acc.nbPaves++;
          break;
      }
      
      return acc;
    }, {
      nbObjets: 0,
      nbMaisons: 0,
      nbArbres: 0,
      nbCiterne: 0,
      nbCaissonEau: 0,
      nbCanalisation: 0,
      nbCloture: 0,
      nbTerrasse: 0,
      nbPaves: 0
    });
    
    return stats;
  }, [fabricCanvasRef.current?.getObjects().length]);

  return {
    chargerPlanParDefaut,
    genererLogCopiable,
    chargerImageFond,
    statistiques
  };
};
