import { createContext, useContext, useReducer, useCallback, useMemo } from 'react';

/**
 * Contexte unifié pour la gestion d'état 2D/3D
 * Centralise toutes les données et actions partagées entre les vues
 */

// Types d'actions pour le reducer
const ACTIONS = {
  // État de l'application
  SET_VIEW_MODE: 'SET_VIEW_MODE',
  SET_LOADING: 'SET_LOADING',
  
  // Données du plan
  SET_PLAN_DATA: 'SET_PLAN_DATA',
  UPDATE_OBJECT: 'UPDATE_OBJECT',
  ADD_OBJECT: 'ADD_OBJECT',
  REMOVE_OBJECT: 'REMOVE_OBJECT',
  
  // Sélection d'objets
  SET_SELECTED_OBJECT: 'SET_SELECTED_OBJECT',
  CLEAR_SELECTION: 'CLEAR_SELECTION',
  
  // Configuration des objets
  UPDATE_OBJECT_PROPERTIES: 'UPDATE_OBJECT_PROPERTIES',
  
  // Synchronisation 2D/3D
  SYNC_2D_TO_3D: 'SYNC_2D_TO_3D',
  SYNC_3D_TO_2D: 'SYNC_3D_TO_2D',
  
  // Paramètres de vue
  SET_VIEW_PARAMS: 'SET_VIEW_PARAMS',
  SET_ANIMATION_STATE: 'SET_ANIMATION_STATE',
  
  // Validation
  UPDATE_VALIDATION: 'UPDATE_VALIDATION'
};

// État initial
const initialState = {
  // État de l'application
  viewMode: '2d', // '2d' | '3d'
  isLoading: false,
  
  // Données du plan unifiées
  planData: {
    maisons: [],
    citernes: [],
    canalisations: [],
    clotures: [],
    terrasses: [],
    arbres: [],
    paves: []
  },
  
  // Sélection
  selectedObject: null,
  selectedObjectId: null,
  
  // Paramètres de vue
  viewParams: {
    anneeProjection: 0,
    saison: 'ete',
    heureJournee: 90,
    orientation: 'nord-haut',
    dimensions: { largeur: 30, hauteur: 30 },
    echelle: 40
  },
  
  // État d'animation
  animationState: {
    isAnimating: false,
    animationProgress: 0
  },
  
  // Validation
  validation: {
    arbres: new Map(),
    canalisations: new Map(),
    clotures: new Map()
  },
  
  // Synchronisation
  syncState: {
    lastSync2D: null,
    lastSync3D: null,
    isSyncing: false
  }
};

// Reducer pour gérer les actions
function unifiedReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_VIEW_MODE:
      return {
        ...state,
        viewMode: action.payload
      };
      
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
      
    case ACTIONS.SET_PLAN_DATA:
      return {
        ...state,
        planData: { ...state.planData, ...action.payload }
      };
      
    case ACTIONS.UPDATE_OBJECT:
      const { objectType, objectId, updates } = action.payload;
      return {
        ...state,
        planData: {
          ...state.planData,
          [objectType]: state.planData[objectType].map(obj => 
            obj.id === objectId ? { ...obj, ...updates } : obj
          )
        }
      };
      
    case ACTIONS.ADD_OBJECT:
      const { objectType: addType, object } = action.payload;
      return {
        ...state,
        planData: {
          ...state.planData,
          [addType]: [...state.planData[addType], object]
        }
      };
      
    case ACTIONS.REMOVE_OBJECT:
      const { objectType: removeType, objectId: removeId } = action.payload;
      return {
        ...state,
        planData: {
          ...state.planData,
          [removeType]: state.planData[removeType].filter(obj => obj.id !== removeId)
        }
      };
      
    case ACTIONS.SET_SELECTED_OBJECT:
      return {
        ...state,
        selectedObject: action.payload,
        selectedObjectId: action.payload?.id || null
      };
      
    case ACTIONS.CLEAR_SELECTION:
      return {
        ...state,
        selectedObject: null,
        selectedObjectId: null
      };
      
    case ACTIONS.UPDATE_OBJECT_PROPERTIES:
      const { objectId: propId, properties } = action.payload;
      return {
        ...state,
        planData: {
          ...state.planData,
          // Mettre à jour l'objet dans tous les types possibles
          ...Object.keys(state.planData).reduce((acc, type) => {
            acc[type] = state.planData[type].map(obj => 
              obj.id === propId ? { ...obj, ...properties } : obj
            );
            return acc;
          }, {})
        }
      };
      
    case ACTIONS.SET_VIEW_PARAMS:
      return {
        ...state,
        viewParams: { ...state.viewParams, ...action.payload }
      };
      
    case ACTIONS.SET_ANIMATION_STATE:
      return {
        ...state,
        animationState: { ...state.animationState, ...action.payload }
      };
      
    case ACTIONS.UPDATE_VALIDATION:
      const { validationType, validationData } = action.payload;
      return {
        ...state,
        validation: {
          ...state.validation,
          [validationType]: validationData
        }
      };
      
    case ACTIONS.SYNC_2D_TO_3D:
      return {
        ...state,
        syncState: {
          ...state.syncState,
          lastSync2D: Date.now(),
          isSyncing: true
        }
      };
      
    case ACTIONS.SYNC_3D_TO_2D:
      return {
        ...state,
        syncState: {
          ...state.syncState,
          lastSync3D: Date.now(),
          isSyncing: true
        }
      };
      
    default:
      return state;
  }
}

// Contexte
const UnifiedStateContext = createContext();

// Provider
export function UnifiedStateProvider({ children }) {
  const [state, dispatch] = useReducer(unifiedReducer, initialState);
  
  // Actions mémorisées
  const actions = useMemo(() => ({
    // Vue
    setViewMode: (mode) => dispatch({ type: ACTIONS.SET_VIEW_MODE, payload: mode }),
    setLoading: (loading) => dispatch({ type: ACTIONS.SET_LOADING, payload: loading }),
    
    // Données du plan
    setPlanData: (data) => dispatch({ type: ACTIONS.SET_PLAN_DATA, payload: data }),
    updateObject: (objectType, objectId, updates) => 
      dispatch({ type: ACTIONS.UPDATE_OBJECT, payload: { objectType, objectId, updates } }),
    addObject: (objectType, object) => 
      dispatch({ type: ACTIONS.ADD_OBJECT, payload: { objectType, object } }),
    removeObject: (objectType, objectId) => 
      dispatch({ type: ACTIONS.REMOVE_OBJECT, payload: { objectType, objectId } }),
    
    // Sélection
    setSelectedObject: (object) => dispatch({ type: ACTIONS.SET_SELECTED_OBJECT, payload: object }),
    clearSelection: () => dispatch({ type: ACTIONS.CLEAR_SELECTION }),
    
    // Propriétés d'objets
    updateObjectProperties: (objectId, properties) => 
      dispatch({ type: ACTIONS.UPDATE_OBJECT_PROPERTIES, payload: { objectId, properties } }),
    
    // Paramètres de vue
    setViewParams: (params) => dispatch({ type: ACTIONS.SET_VIEW_PARAMS, payload: params }),
    setAnimationState: (animationState) => 
      dispatch({ type: ACTIONS.SET_ANIMATION_STATE, payload: animationState }),
    
    // Validation
    updateValidation: (validationType, validationData) => 
      dispatch({ type: ACTIONS.UPDATE_VALIDATION, payload: { validationType, validationData } }),
    
    // Synchronisation
    sync2DTo3D: () => dispatch({ type: ACTIONS.SYNC_2D_TO_3D }),
    sync3DTo2D: () => dispatch({ type: ACTIONS.SYNC_3D_TO_2D })
  }), []);
  
  // Getters mémorisés
  const getters = useMemo(() => ({
    // Obtenir un objet par ID
    getObjectById: (objectId) => {
      for (const type of Object.keys(state.planData)) {
        const obj = state.planData[type].find(o => o.id === objectId);
        if (obj) return { type, object: obj };
      }
      return null;
    },
    
    // Obtenir tous les objets d'un type
    getObjectsByType: (type) => state.planData[type] || [],
    
    // Obtenir les objets sélectionnés
    getSelectedObjects: () => {
      if (!state.selectedObjectId) return [];
      const found = getters.getObjectById(state.selectedObjectId);
      return found ? [found.object] : [];
    },
    
    // Vérifier si un objet est sélectionné
    isObjectSelected: (objectId) => state.selectedObjectId === objectId,
    
    // Obtenir les paramètres de vue
    getViewParams: () => state.viewParams,
    
    // Obtenir l'état de validation
    getValidationState: (objectId) => {
      for (const [type, validationMap] of Object.entries(state.validation)) {
        if (validationMap.has && validationMap.has(objectId)) {
          return validationMap.get(objectId);
        }
      }
      return { status: 'ok', messages: [] };
    }
  }), [state]);
  
  // Synchronisation bidirectionnelle
  const syncHandlers = useMemo(() => ({
    // 2D → 3D
    handle2DTo3DSync: useCallback((canvasData) => {
      actions.sync2DTo3D();
      // Convertir les données du canvas 2D vers le format unifié
      const unifiedData = convertCanvasToUnified(canvasData);
      actions.setPlanData(unifiedData);
    }, [actions]),
    
    // 3D → 2D
    handle3DTo2DSync: useCallback((objectId, newPosition, newProperties = {}) => {
      actions.sync3DTo2D();
      actions.updateObjectProperties(objectId, {
        position: newPosition,
        ...newProperties
      });
    }, [actions])
  }), [actions]);
  
  const value = useMemo(() => ({
    state,
    actions,
    getters,
    syncHandlers
  }), [state, actions, getters, syncHandlers]);
  
  return (
    <UnifiedStateContext.Provider value={value}>
      {children}
    </UnifiedStateContext.Provider>
  );
}

// Hook pour utiliser le contexte
export function useUnifiedState() {
  const context = useContext(UnifiedStateContext);
  if (!context) {
    throw new Error('useUnifiedState must be used within a UnifiedStateProvider');
  }
  return context;
}

// Fonction utilitaire pour convertir les données du canvas 2D vers le format unifié
function convertCanvasToUnified(canvasData) {
  const echelle = 40; // Échelle par défaut
  
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
}

export default UnifiedStateContext;
