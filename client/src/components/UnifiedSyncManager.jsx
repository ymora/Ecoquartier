import { useEffect, useCallback, useRef } from 'react';
import { useUnifiedRendering } from '../hooks/useUnifiedRendering';
import { useUnifiedState } from '../contexts/UnifiedStateContext';

/**
 * Composant de gestion de la synchronisation en temps réel entre 2D et 3D
 * Écoute les changements et synchronise automatiquement les vues
 */

function UnifiedSyncManager({ 
  canvas2D, 
  canvas3D, 
  onSync2DTo3D, 
  onSync3DTo2D,
  syncInterval = 100 // ms
}) {
  const { state } = useUnifiedState();
  const { sync2DTo3D, sync3DTo2D, get2DData, get3DData, needsSync } = useUnifiedRendering();
  const syncIntervalRef = useRef(null);
  const lastCanvasDataRef = useRef(null);
  const last3DDataRef = useRef(null);
  
  // Synchronisation 2D → 3D
  const handle2DTo3DSync = useCallback(() => {
    if (!canvas2D) return;
    
    try {
      // Extraire les données du canvas 2D
      const canvasData = extractCanvasData(canvas2D);
      
      // Vérifier si les données ont changé
      const dataString = JSON.stringify(canvasData);
      if (dataString === lastCanvasDataRef.current) {
        return; // Pas de changement
      }
      lastCanvasDataRef.current = dataString;
      
      // Synchroniser vers 3D
      sync2DTo3D(canvasData);
      
      // Callback personnalisé
      if (onSync2DTo3D) {
        onSync2DTo3D(canvasData);
      }
      
      console.log('🔄 Synchronisation 2D → 3D effectuée');
    } catch (error) {
      console.error('❌ Erreur synchronisation 2D → 3D:', error);
    }
  }, [canvas2D, sync2DTo3D, onSync2DTo3D]);
  
  // Synchronisation 3D → 2D
  const handle3DTo2DSync = useCallback(() => {
    if (!canvas2D) return;
    
    try {
      // Obtenir les données 3D formatées pour 2D
      const data3D = get3DData();
      
      // Vérifier si les données ont changé
      const dataString = JSON.stringify(data3D);
      if (dataString === last3DDataRef.current) {
        return; // Pas de changement
      }
      last3DDataRef.current = dataString;
      
      // Appliquer les changements au canvas 2D
      apply3DDataToCanvas(canvas2D, data3D);
      
      // Callback personnalisé
      if (onSync3DTo2D) {
        onSync3DTo2D(data3D);
      }
      
      console.log('🔄 Synchronisation 3D → 2D effectuée');
    } catch (error) {
      console.error('❌ Erreur synchronisation 3D → 2D:', error);
    }
  }, [canvas2D, get3DData, onSync3DTo2D]);
  
  // Extraction des données du canvas 2D
  const extractCanvasData = useCallback((canvas) => {
    if (!canvas || !canvas.getObjects) return {};
    
    const objects = canvas.getObjects();
    
    return {
      maisons: objects.filter(obj => obj.customType === 'maison'),
      citernes: objects.filter(obj => obj.customType === 'citerne'),
      canalisations: objects.filter(obj => obj.customType === 'canalisation'),
      clotures: objects.filter(obj => obj.customType === 'cloture'),
      terrasses: objects.filter(obj => obj.customType === 'terrasse'),
      paves: objects.filter(obj => obj.customType === 'paves'),
      arbres: objects.filter(obj => obj.customType === 'arbre-a-planter')
    };
  }, []);
  
  // Application des données 3D au canvas 2D
  const apply3DDataToCanvas = useCallback((canvas, data3D) => {
    if (!canvas) return;
    
    // Mettre à jour les objets existants
    Object.keys(data3D).forEach(type => {
      const objects = data3D[type];
      if (!objects) return;
      
      objects.forEach((obj3D, index) => {
        // Trouver l'objet correspondant dans le canvas
        const canvasObjects = canvas.getObjects();
        const canvasObj = canvasObjects.find(obj => 
          obj.customType === obj3D.customType && 
          obj.index === index
        );
        
        if (canvasObj) {
          // Mettre à jour les propriétés
          if (obj3D.position) {
            canvasObj.set({
              left: obj3D.position[0] * 40, // Échelle
              top: obj3D.position[2] * 40
            });
          }
          
          if (obj3D.largeur !== undefined) {
            canvasObj.set({ width: obj3D.largeur * 40 });
          }
          
          if (obj3D.profondeur !== undefined) {
            canvasObj.set({ height: obj3D.profondeur * 40 });
          }
          
          if (obj3D.angle !== undefined) {
            canvasObj.set({ angle: obj3D.angle });
          }
          
          canvasObj.setCoords();
        }
      });
    });
    
    canvas.requestRenderAll();
  }, []);
  
  // Écouter les changements du canvas 2D
  useEffect(() => {
    if (!canvas2D) return;
    
    const handleCanvasChange = () => {
      if (state.viewMode === '2d') {
        handle2DTo3DSync();
      }
    };
    
    // Événements de modification du canvas
    canvas2D.on('object:added', handleCanvasChange);
    canvas2D.on('object:removed', handleCanvasChange);
    canvas2D.on('object:modified', handleCanvasChange);
    canvas2D.on('object:moving', handleCanvasChange);
    canvas2D.on('object:scaling', handleCanvasChange);
    canvas2D.on('object:rotating', handleCanvasChange);
    
    return () => {
      canvas2D.off('object:added', handleCanvasChange);
      canvas2D.off('object:removed', handleCanvasChange);
      canvas2D.off('object:modified', handleCanvasChange);
      canvas2D.off('object:moving', handleCanvasChange);
      canvas2D.off('object:scaling', handleCanvasChange);
      canvas2D.off('object:rotating', handleCanvasChange);
    };
  }, [canvas2D, state.viewMode, handle2DTo3DSync]);
  
  // Écouter les changements de l'état unifié
  useEffect(() => {
    if (state.syncState.isSyncing) {
      if (state.viewMode === '3d') {
        handle3DTo2DSync();
      }
    }
  }, [state.syncState, state.viewMode, handle3DTo2DSync]);
  
  // Synchronisation périodique
  useEffect(() => {
    if (syncInterval <= 0) return;
    
    syncIntervalRef.current = setInterval(() => {
      if (needsSync()) {
        if (state.viewMode === '2d') {
          handle2DTo3DSync();
        } else if (state.viewMode === '3d') {
          handle3DTo2DSync();
        }
      }
    }, syncInterval);
    
    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [syncInterval, needsSync, state.viewMode, handle2DTo3DSync, handle3DTo2DSync]);
  
  // Synchronisation manuelle
  const forceSync = useCallback(() => {
    if (state.viewMode === '2d') {
      handle2DTo3DSync();
    } else if (state.viewMode === '3d') {
      handle3DTo2DSync();
    }
  }, [state.viewMode, handle2DTo3DSync, handle3DTo2DSync]);
  
  // Exposer les méthodes de synchronisation
  useEffect(() => {
    // Exposer les méthodes globalement pour debug
    window.unifiedSync = {
      forceSync,
      handle2DTo3DSync,
      handle3DTo2DSync,
      get2DData,
      get3DData
    };
    
    return () => {
      delete window.unifiedSync;
    };
  }, [forceSync, handle2DTo3DSync, handle3DTo2DSync, get2DData, get3DData]);
  
  // Le composant ne rend rien, il gère juste la synchronisation
  return null;
}

export default UnifiedSyncManager;
