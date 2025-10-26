import { useCallback, useMemo, useEffect, useRef } from 'react';
import { useUnifiedState } from '../contexts/UnifiedStateContext';
import { ECHELLE_PIXELS_PAR_METRE } from '../config/constants';

/**
 * Hook pour la synchronisation du rendu entre 2D et 3D
 * Gère la conversion des données et la synchronisation bidirectionnelle
 */

export function useUnifiedRendering() {
  const { state, actions, getters, syncHandlers } = useUnifiedState();
  const lastSyncTime = useRef(0);
  const syncThrottle = 100; // ms
  
  // Conversion des données unifiées vers le format 2D (Fabric.js)
  const convertTo2DFormat = useCallback((unifiedData) => {
    const echelle = ECHELLE_PIXELS_PAR_METRE;
    
    return {
      maisons: unifiedData.maisons.map(obj => ({
        left: obj.position[0] * echelle,
        top: obj.position[2] * echelle,
        width: obj.dimensions.largeur * echelle,
        height: obj.dimensions.profondeur * echelle,
        angle: obj.properties.angle || 0,
        hauteurBatiment: obj.dimensions.hauteur,
        profondeurFondations: obj.properties.profondeurFondations || 1.2,
        elevationSol: obj.properties.elevationSol || 0,
        customType: 'maison'
      })),
      
      citernes: unifiedData.citernes.map(obj => ({
        left: obj.position[0] * echelle,
        top: obj.position[2] * echelle,
        diametre: obj.dimensions.diametre,
        profondeur: obj.dimensions.profondeur,
        volume: obj.properties.volume || 3000,
        elevationSol: obj.properties.elevationSol || 0,
        customType: 'citerne'
      })),
      
      canalisations: unifiedData.canalisations.map(obj => ({
        x1: obj.position[0] * echelle,
        y1: obj.position[2] * echelle,
        x2: obj.endPosition[0] * echelle,
        y2: obj.endPosition[2] * echelle,
        profondeur: obj.properties.profondeur || 0.6,
        diametre: obj.properties.diametre || 0.1,
        elevationSol: obj.properties.elevationSol || 0,
        customType: 'canalisation'
      })),
      
      clotures: unifiedData.clotures.map(obj => ({
        x1: obj.position[0] * echelle,
        y1: obj.position[2] * echelle,
        x2: obj.endPosition[0] * echelle,
        y2: obj.endPosition[2] * echelle,
        hauteurCloture: obj.properties.hauteur || 1.5,
        epaisseur: obj.properties.epaisseur || 0.05,
        customType: 'cloture'
      })),
      
      terrasses: unifiedData.terrasses.map(obj => ({
        left: obj.position[0] * echelle,
        top: obj.position[2] * echelle,
        width: obj.dimensions.largeur * echelle,
        height: obj.dimensions.profondeur * echelle,
        angle: obj.properties.angle || 0,
        hauteurDalle: obj.dimensions.hauteur,
        elevationSol: obj.properties.elevationSol || 0,
        customType: 'terrasse'
      })),
      
      paves: unifiedData.paves.map(obj => ({
        left: obj.position[0] * echelle,
        top: obj.position[2] * echelle,
        width: obj.dimensions.largeur * echelle,
        height: obj.dimensions.profondeur * echelle,
        angle: obj.properties.angle || 0,
        hauteurPaves: obj.dimensions.hauteur,
        elevationSol: obj.properties.elevationSol || 0,
        profondeurGravier: obj.properties.profondeurGravier || 0.15,
        customType: 'paves'
      })),
      
      arbres: unifiedData.arbres.map(obj => ({
        left: obj.position[0] * echelle,
        top: obj.position[2] * echelle,
        hauteur: obj.dimensions.hauteur,
        envergure: obj.dimensions.envergure,
        profondeurRacines: obj.dimensions.profondeurRacines,
        arbreData: obj.properties.arbreData,
        validationStatus: obj.properties.validationStatus || 'ok',
        customType: 'arbre-a-planter'
      }))
    };
  }, []);

  // Conversion des données unifiées vers le format 3D
  const convertTo3DFormat = useCallback((unifiedData) => {
    return {
      maisons: unifiedData.maisons.map(obj => ({
        position: obj.position,
        largeur: obj.dimensions.largeur,
        profondeur: obj.dimensions.profondeur,
        hauteur: obj.dimensions.hauteur,
        profondeurFondations: obj.properties.profondeurFondations || 1.2,
        angle: obj.properties.angle || 0,
        customType: 'maison'
      })),
      
      citernes: unifiedData.citernes.map(obj => ({
        position: obj.position,
        largeur: obj.dimensions.diametre,
        profondeur: obj.dimensions.diametre,
        profondeurEnterree: obj.dimensions.profondeur,
        volume: obj.properties.volume || 3000,
        elevationSol: obj.properties.elevationSol || 0,
        customType: 'citerne'
      })),
      
      canalisations: unifiedData.canalisations.map(obj => ({
        x1: obj.position[0],
        y1: obj.position[2],
        x2: obj.endPosition[0],
        y2: obj.endPosition[2],
        profondeur: obj.properties.profondeur || 0.6,
        diametre: obj.properties.diametre || 0.1,
        customType: 'canalisation'
      })),
      
      clotures: unifiedData.clotures.map(obj => ({
        x1: obj.position[0],
        y1: obj.position[2],
        x2: obj.endPosition[0],
        y2: obj.endPosition[2],
        hauteur: obj.properties.hauteur || 1.5,
        epaisseur: obj.properties.epaisseur || 0.05,
        customType: 'cloture'
      })),
      
      terrasses: unifiedData.terrasses.map(obj => ({
        position: obj.position,
        largeur: obj.dimensions.largeur,
        profondeur: obj.dimensions.profondeur,
        hauteur: obj.dimensions.hauteur,
        angle: obj.properties.angle || 0,
        elevationSol: obj.properties.elevationSol || 0,
        type: 'terrasse',
        customType: 'terrasse'
      })),
      
      paves: unifiedData.paves.map(obj => ({
        position: obj.position,
        largeur: obj.dimensions.largeur,
        profondeur: obj.dimensions.profondeur,
        hauteur: obj.dimensions.hauteur,
        angle: obj.properties.angle || 0,
        type: 'pave-enherbe',
        customType: 'paves'
      })),
      
      arbres: unifiedData.arbres.map(obj => ({
        position: obj.position,
        arbreData: obj.properties.arbreData,
        hauteur: obj.dimensions.hauteur,
        envergure: obj.dimensions.envergure,
        profondeurRacines: obj.dimensions.profondeurRacines,
        validationStatus: obj.properties.validationStatus || 'ok',
        customType: 'arbre-a-planter'
      }))
    };
  }, []);
  
  // Synchronisation 2D → 3D avec throttling
  const sync2DTo3D = useCallback((canvasData) => {
    const now = Date.now();
    if (now - lastSyncTime.current < syncThrottle) {
      return; // Throttle
    }
    lastSyncTime.current = now;
    
    // Convertir les données du canvas 2D vers le format unifié
    const unifiedData = convertCanvasToUnified(canvasData);
    actions.setPlanData(unifiedData);
    actions.sync2DTo3D();
  }, [actions]);
  
  // Synchronisation 3D → 2D avec throttling
  const sync3DTo2D = useCallback((objectId, newPosition, newProperties = {}) => {
    const now = Date.now();
    if (now - lastSyncTime.current < syncThrottle) {
      return; // Throttle
    }
    lastSyncTime.current = now;
    
    // Mettre à jour l'objet dans l'état unifié
    actions.updateObjectProperties(objectId, {
      position: newPosition,
      ...newProperties
    });
    actions.sync3DTo2D();
  }, [actions]);
  
  // Conversion du canvas 2D vers le format unifié
  const convertCanvasToUnified = useCallback((canvasData) => {
    const echelle = ECHELLE_PIXELS_PAR_METRE;
    
    return {
      maisons: (canvasData.maisons || []).map((maison, idx) => ({
        id: `maison-${idx}`,
        type: 'maison',
        position: [maison.left / echelle, 0, maison.top / echelle],
        dimensions: {
          largeur: (maison.getScaledWidth ? maison.getScaledWidth() : maison.width) / echelle,
          profondeur: (maison.getScaledHeight ? maison.getScaledHeight() : maison.height) / echelle,
          hauteur: maison.hauteurBatiment || 7
        },
        properties: {
          angle: maison.angle || 0,
          elevationSol: maison.elevationSol || 0,
          profondeurFondations: maison.profondeurFondations || 1.2
        },
        customType: 'maison'
      })),
      
      citernes: (canvasData.citernes || []).map((citerne, idx) => ({
        id: `citerne-${idx}`,
        type: 'citerne',
        position: [citerne.left / echelle, 0, citerne.top / echelle],
        dimensions: {
          diametre: citerne.diametre || 1.5,
          profondeur: citerne.profondeur || 2.5
        },
        properties: {
          volume: citerne.volume || 3000,
          elevationSol: citerne.elevationSol || 0
        },
        customType: 'citerne'
      })),
      
      canalisations: (canvasData.canalisations || []).map((canal, idx) => ({
        id: `canal-${idx}`,
        type: 'canalisation',
        position: [
          (canal.x1 || canal.left) / echelle,
          0,
          (canal.y1 || canal.top) / echelle
        ],
        endPosition: [
          (canal.x2 || canal.left + 100) / echelle,
          0,
          (canal.y2 || canal.top) / echelle
        ],
        properties: {
          profondeur: canal.profondeur || 0.6,
          diametre: canal.diametre || 0.1,
          elevationSol: canal.elevationSol || 0
        },
        customType: 'canalisation'
      })),
      
      clotures: (canvasData.clotures || []).map((cloture, idx) => ({
        id: `cloture-${idx}`,
        type: 'cloture',
        position: [
          (cloture.x1 || cloture.left) / echelle,
          0,
          (cloture.y1 || cloture.top) / echelle
        ],
        endPosition: [
          (cloture.x2 || cloture.left + 100) / echelle,
          0,
          (cloture.y2 || cloture.top) / echelle
        ],
        properties: {
          hauteur: cloture.hauteurCloture || 1.5,
          epaisseur: cloture.epaisseur || 0.05
        },
        customType: 'cloture'
      })),
      
      terrasses: (canvasData.terrasses || []).map((terrasse, idx) => ({
        id: `terrasse-${idx}`,
        type: 'terrasse',
        position: [terrasse.left / echelle, 0, terrasse.top / echelle],
        dimensions: {
          largeur: (terrasse.getScaledWidth ? terrasse.getScaledWidth() : terrasse.width) / echelle,
          profondeur: (terrasse.getScaledHeight ? terrasse.getScaledHeight() : terrasse.height) / echelle,
          hauteur: terrasse.hauteurDalle || 0.15
        },
        properties: {
          angle: terrasse.angle || 0,
          elevationSol: terrasse.elevationSol || 0
        },
        customType: 'terrasse'
      })),
      
      paves: (canvasData.paves || []).map((pave, idx) => ({
        id: `pave-${idx}`,
        type: 'pave',
        position: [pave.left / echelle, 0, pave.top / echelle],
        dimensions: {
          largeur: (pave.getScaledWidth ? pave.getScaledWidth() : pave.width) / echelle,
          profondeur: (pave.getScaledHeight ? pave.getScaledHeight() : pave.height) / echelle,
          hauteur: pave.hauteurPaves || 0.08
        },
        properties: {
          angle: pave.angle || 0,
          elevationSol: pave.elevationSol || 0,
          profondeurGravier: pave.profondeurGravier || 0.15
        },
        customType: 'paves'
      })),
      
      arbres: (canvasData.arbres || []).map((arbre, idx) => ({
        id: `arbre-${idx}`,
        type: 'arbre',
        position: [arbre.left / echelle, 0, arbre.top / echelle],
        dimensions: {
          hauteur: arbre.hauteur || 6,
          envergure: arbre.envergure || 4,
          profondeurRacines: arbre.profondeurRacines || 1.5
        },
        properties: {
          arbreData: arbre.arbreData,
          validationStatus: arbre.validationStatus || 'ok'
        },
        customType: 'arbre-a-planter'
      }))
    };
  }, []);

  // Obtenir les données formatées pour la vue 2D
  const get2DData = useCallback(() => {
    return convertTo2DFormat(state.planData);
  }, [state.planData, convertTo2DFormat]);
  
  // Obtenir les données formatées pour la vue 3D
  const get3DData = useCallback(() => {
    return convertTo3DFormat(state.planData);
  }, [state.planData, convertTo3DFormat]);
  
  // Obtenir les paramètres de vue
  const getViewParams = useCallback(() => {
    return state.viewParams;
  }, [state.viewParams]);
  
  // Obtenir l'état de synchronisation
  const getSyncState = useCallback(() => {
    return state.syncState;
  }, [state.syncState]);
  
  // Vérifier si la synchronisation est nécessaire
  const needsSync = useCallback(() => {
    const now = Date.now();
    const lastSync = Math.max(
      state.syncState.lastSync2D || 0,
      state.syncState.lastSync3D || 0
    );
    return now - lastSync > syncThrottle;
  }, [state.syncState, syncThrottle]);
  
  // Rendu mémorisé
  const rendering = useMemo(() => ({
    // Conversion de données
    convertTo2DFormat,
    convertTo3DFormat,
    convertCanvasToUnified,
    
    // Synchronisation
    sync2DTo3D,
    sync3DTo2D,
    
    // Getters
    get2DData,
    get3DData,
    getViewParams,
    getSyncState,
    needsSync
  }), [
    convertTo2DFormat,
    convertTo3DFormat,
    convertCanvasToUnified,
    sync2DTo3D,
    sync3DTo2D,
    get2DData,
    get3DData,
    getViewParams,
    getSyncState,
    needsSync
  ]);
  
  return rendering;
}

export default useUnifiedRendering;