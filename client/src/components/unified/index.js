/**
 * Export du système unifié de plage plan 2D/3D
 * Centralise tous les exports pour faciliter l'importation
 */

// Composants principaux
export { default as UnifiedPlanViewer } from './UnifiedPlanViewer';
export { default as UnifiedRenderer3D } from './UnifiedRenderer3D';
export { default as UnifiedControls } from './UnifiedControls';

// Composants 3D spécialisés
export { default as UnifiedMaison3D } from './UnifiedMaison3D';
export { default as UnifiedArbre3D } from './UnifiedArbre3D';

// Hooks
export { 
  useUnifiedPlan, 
  useUnifiedGeometry, 
  useUnifiedMaterial, 
  usePerformanceMetrics 
} from '../../hooks/unified/useUnifiedPlan';

// Utilitaires
export {
  PlanConverter,
  GeometryFactory,
  MaterialFactory,
  CalculationUtils,
  ValidationUtils,
  UnifiedCache,
  unifiedCache,
  PLAN_CONSTANTS
} from '../../utils/unified/UnifiedPlanSystem';

// Constantes
export * from '../../config/unifiedConstants';

// Export par défaut
export { default } from './UnifiedPlanViewer';
