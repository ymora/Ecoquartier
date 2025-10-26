import { memo, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { 
  GeometryFactory, 
  MaterialFactory, 
  CalculationUtils,
  unifiedCache 
} from '../../utils/unified/UnifiedPlanSystem';

/**
 * Composant Arbre 3D unifié et optimisé
 * Utilise le système unifié pour toutes les opérations
 */

function UnifiedArbre3D({ 
  position = [0, 0, 0], 
  arbreData = {},
  hauteur = 6,
  envergure = 4,
  profondeurRacines = 1.5,
  anneeProjection = 0,
  saison = 'ete',
  elevationSol = 0,
  validationStatus = 'ok',
  onClick,
  lod = 'high'
}) {
  
  // Calculs de croissance mémorisés
  const croissance = useMemo(() => {
    return CalculationUtils.calculateArbreGrowth(anneeProjection, hauteur, envergure);
  }, [anneeProjection, hauteur, envergure]);

  // Géométries mémorisées avec cache
  const geometries = useMemo(() => {
    const { hauteur: hauteurActuelle, envergure: envergureActuelle } = croissance;
    
    return {
      tronc: unifiedCache.getGeometry(
        `tronc-${hauteurActuelle}-${lod}`,
        () => GeometryFactory.createArbreGeometry(hauteurActuelle, envergureActuelle, lod).tronc
      ),
      feuillage: unifiedCache.getGeometry(
        `feuillage-${envergureActuelle}-${lod}`,
        () => GeometryFactory.createArbreGeometry(hauteurActuelle, envergureActuelle, lod).feuillage
      ),
      racines: unifiedCache.getGeometry(
        `racines-${profondeurRacines}-${lod}`,
        () => new THREE.ConeGeometry(profondeurRacines * 0.8, profondeurRacines, lod === 'high' ? 8 : 6)
      )
    };
  }, [croissance, profondeurRacines, lod]);

  // Matériaux mémorisés avec cache
  const materials = useMemo(() => {
    return {
      tronc: unifiedCache.getMaterial(
        'tronc-material',
        () => new THREE.MeshStandardMaterial({
          color: '#8B4513',
          roughness: 0.9,
          metalness: 0.1
        })
      ),
      feuillage: unifiedCache.getMaterial(
        `feuillage-${saison}-material`,
        () => MaterialFactory.createArbreMaterial(saison, arbreData)
      ),
      racines: unifiedCache.getMaterial(
        'racines-material',
        () => new THREE.MeshStandardMaterial({
          color: '#654321',
          roughness: 0.95,
          metalness: 0.05,
          transparent: true,
          opacity: 0.7
        })
      )
    };
  }, [saison, arbreData]);

  // Positions mémorisées
  const positions = useMemo(() => {
    const { hauteur: hauteurActuelle, envergure: envergureActuelle } = croissance;
    
    return {
      tronc: [0, hauteurActuelle / 2 + elevationSol, 0],
      feuillage: [0, hauteurActuelle * 0.7 + elevationSol, 0],
      racines: [0, elevationSol - profondeurRacines / 2, 0]
    };
  }, [croissance, elevationSol, profondeurRacines]);

  // Callback optimisé
  const handleClick = useCallback((event) => {
    event.stopPropagation();
    if (onClick) onClick(event);
  }, [onClick]);

  // Couleur de validation
  const validationColor = useMemo(() => {
    switch (validationStatus) {
      case 'ok': return '#4CAF50';
      case 'warning': return '#FF9800';
      case 'error': return '#F44336';
      default: return '#4CAF50';
    }
  }, [validationStatus]);

  return (
    <group position={position} onClick={handleClick}>
      
      {/* RACINES (si profondeurRacines > 0) */}
      {profondeurRacines > 0 && (
        <mesh 
          position={positions.racines} 
          geometry={geometries.racines} 
          material={materials.racines} 
          castShadow 
        />
      )}
      
      {/* TRONC */}
      <mesh 
        position={positions.tronc} 
        geometry={geometries.tronc} 
        material={materials.tronc} 
        castShadow 
        receiveShadow 
      />
      
      {/* FEUILLAGE */}
      <mesh 
        position={positions.feuillage} 
        geometry={geometries.feuillage} 
        material={materials.feuillage} 
        castShadow 
        receiveShadow 
      />
      
      {/* INDICATEUR DE VALIDATION */}
      {validationStatus !== 'ok' && (
        <mesh position={[0, croissance.hauteur + elevationSol + 0.5, 0]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial 
            color={validationColor} 
            emissive={validationColor} 
            emissiveIntensity={0.3}
          />
        </mesh>
      )}
      
      {/* NOM DE L'ARBRE (si disponible) */}
      {arbreData?.nom && (
        <mesh position={[0, croissance.hauteur + elevationSol + 1, 0]}>
          <planeGeometry args={[2, 0.5]} />
          <meshBasicMaterial 
            color="#000000" 
            transparent 
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
    </group>
  );
}

export default memo(UnifiedArbre3D);
