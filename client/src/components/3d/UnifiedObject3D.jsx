import { memo, useCallback } from 'react';
import Maison3D from './Maison3D';
import Citerne3D from './Citerne3D';
import PaveEnherbe3D from './PaveEnherbe3D';
import Arbre3D from './Arbre3D';

/**
 * Rendu 3D unifié d'un objet
 * Utilise le système unifié pour éviter la duplication
 */
const UnifiedObject3D = memo(({ 
  unifiedObject,
  onObjetClick,
  onObjetDragEnd,
  modeDeplacement = false,
  validationMap3D = null
}) => {
  // 🔍 Debug de ce que reçoit UnifiedObject3D (désactivé pour éviter les boucles)
  // console.log('🔍 [UnifiedObject3D] Reçoit:', {
  //   type: unifiedObject?.type,
  //   id: unifiedObject?.id,
  //   position: unifiedObject?.position,
  //   dimensions: unifiedObject?.dimensions,
  //   customType: unifiedObject?.customType,
  //   largeur: unifiedObject?.largeur,
  //   profondeur: unifiedObject?.profondeur,
  //   hauteur: unifiedObject?.hauteur,
  //   angle: unifiedObject?.angle,
  //   typeToit: unifiedObject?.material?.typeToit
  // });
  /**
   * Gère le clic sur l'objet
   */
  const handleClick = useCallback(() => {
    if (onObjetClick) {
      onObjetClick({
        ...unifiedObject,
        type: unifiedObject.type,
        customType: unifiedObject.type,
        position: unifiedObject.position
      });
    }
  }, [unifiedObject, onObjetClick]);

  // Rendu selon le type d'objet
  switch (unifiedObject.type) {
    case 'maison':
      return (
        <Maison3D
          position={unifiedObject.position}
          largeur={unifiedObject.largeur || unifiedObject.dimensions.largeur}
          profondeur={unifiedObject.profondeur || unifiedObject.dimensions.profondeur}
          hauteur={unifiedObject.hauteur || unifiedObject.dimensions.hauteur}
          elevationSol={unifiedObject.position[1]}
          angle={unifiedObject.angle || unifiedObject.rotation}
          typeToit={unifiedObject.material?.typeToit || 'deux-pentes'}
          profondeurFondations={unifiedObject.profondeurFondations || 1.2}
          onClick={handleClick}
        />
      );
      
    case 'citerne':
      return (
        <Citerne3D
          position={unifiedObject.position}
          largeur={unifiedObject.largeur || unifiedObject.dimensions.diametre}
          profondeur={unifiedObject.profondeur || unifiedObject.dimensions.diametre}
          profondeurEnterree={unifiedObject.profondeurEnterree || 2.5}
          volume={unifiedObject.volume || 3000}
          elevationSol={unifiedObject.elevationSol || unifiedObject.position[1]}
          onClick={handleClick}
        />
      );
      
    case 'terrasse':
    case 'pave':
      return (
        <PaveEnherbe3D
          position={[unifiedObject.position[0], 0, unifiedObject.position[2]]}
          largeur={unifiedObject.dimensions.largeur}
          profondeur={unifiedObject.dimensions.profondeur}
          onClick={handleClick}
        />
      );
      
    case 'arbre':
      const validation3D = validationMap3D?.arbres?.get(unifiedObject.id) || { status: 'ok', messages: [] };
      return (
        <Arbre3D
          position={unifiedObject.position}
          arbreData={unifiedObject.arbreData || unifiedObject.metadata?.arbreData || {}}
          hauteur={unifiedObject.hauteur || unifiedObject.dimensions.hauteur}
          envergure={unifiedObject.envergure || unifiedObject.dimensions.envergure}
          profondeurRacines={unifiedObject.profondeurRacines || unifiedObject.dimensions.profondeurRacines}
          validationStatus={unifiedObject.validationStatus || validation3D.status}
          anneeProjection={0}
          saison="ete"
          onClick={handleClick}
        />
      );
      
    default:
      return null;
  }
});

UnifiedObject3D.displayName = 'UnifiedObject3D';

export default UnifiedObject3D;
