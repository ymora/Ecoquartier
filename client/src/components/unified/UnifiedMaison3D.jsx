import { memo, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { 
  GeometryFactory, 
  MaterialFactory, 
  CalculationUtils,
  unifiedCache,
  PLAN_CONSTANTS 
} from '../../utils/unified/UnifiedPlanSystem';

/**
 * Composant Maison 3D unifié et optimisé
 * Utilise le système unifié pour toutes les opérations
 */

function UnifiedMaison3D({ 
  position = [0, 0, 0], 
  largeur = 10, 
  profondeur = 8, 
  hauteur = 7,
  profondeurFondations = 1.2,
  angle = 0,
  typeToit = '2pans',
  penteToit = 30,
  orientationToit = 0,
  onClick,
  lod = 'high'
}) {
  
  // Calculs mémorisés
  const calculs = useMemo(() => {
    const angleRad = -(angle * Math.PI) / 180;
    const hauteurToit = CalculationUtils.calculateToitHeight(penteToit, largeur);
    
    return { angleRad, hauteurToit };
  }, [angle, penteToit, largeur]);

  // Géométries mémorisées avec cache
  const geometries = useMemo(() => {
    const { hauteurToit } = calculs;
    
    return {
      maison: unifiedCache.getGeometry(
        `maison-${largeur}-${profondeur}-${hauteur}`,
        () => new THREE.BoxGeometry(largeur, hauteur, profondeur)
      ),
      fondations: unifiedCache.getGeometry(
        `fondations-${largeur}-${profondeur}`,
        () => new THREE.BoxGeometry(largeur + 1, 0.4, profondeur + 1)
      ),
      sousSol: unifiedCache.getGeometry(
        `sousSol-${largeur}-${profondeur}`,
        () => new THREE.BoxGeometry(largeur, 2.1, profondeur)
      ),
      toit: unifiedCache.getGeometry(
        `toit-${typeToit}-${largeur}-${profondeur}-${hauteurToit}-${orientationToit}`,
        () => GeometryFactory.createToitGeometry(typeToit, largeur, profondeur, hauteurToit, orientationToit)
      )
    };
  }, [largeur, profondeur, hauteur, typeToit, calculs.hauteurToit, orientationToit]);

  // Matériaux mémorisés avec cache
  const materials = useMemo(() => {
    return {
      maison: unifiedCache.getMaterial(
        'maison-material',
        () => MaterialFactory.createMaisonMaterial()
      ),
      fondations: unifiedCache.getMaterial(
        'fondations-material',
        () => new THREE.MeshStandardMaterial({
          color: PLAN_CONSTANTS.COULEURS.MAISON.fondations,
          transparent: true,
          opacity: PLAN_CONSTANTS.MATERIAUX.OPACITY.FONDATIONS,
          wireframe: true
        })
      ),
      sousSol: unifiedCache.getMaterial(
        'sousSol-material',
        () => new THREE.MeshStandardMaterial({
          color: PLAN_CONSTANTS.COULEURS.MAISON.sousSol,
          transparent: true,
          opacity: PLAN_CONSTANTS.MATERIAUX.OPACITY.SOUS_SOL,
          roughness: PLAN_CONSTANTS.MATERIAUX.ROUGHNESS.MAISON
        })
      ),
      toit: unifiedCache.getMaterial(
        `toit-${typeToit}-material`,
        () => MaterialFactory.createToitMaterial(typeToit)
      ),
      fenetre: unifiedCache.getMaterial(
        'fenetre-material',
        () => new THREE.MeshStandardMaterial({
          color: PLAN_CONSTANTS.COULEURS.MAISON.fenetre,
          roughness: 0.1,
          metalness: 0.8
        })
      ),
      porte: unifiedCache.getMaterial(
        'porte-material',
        () => new THREE.MeshStandardMaterial({
          color: PLAN_CONSTANTS.COULEURS.MAISON.porte,
          roughness: 0.7,
          metalness: 0.1
        })
      )
    };
  }, [typeToit]);

  // Positions mémorisées
  const positions = useMemo(() => {
    const { hauteurToit } = calculs;
    
    return {
      fondations: [0, -2.5 + 0.2, 0],
      sousSol: [0, -1.05, 0],
      maison: [0, hauteur / 2, 0],
      toit: [0, hauteur + (typeToit === 'plat' ? 0.1 : 0), 0],
      toitMesh: [0, 0, typeToit === 'plat' ? 0 : -profondeur / 2],
      faite: typeToit === '2pans' ? [0, hauteurToit, 0] : null,
      cheminee: typeToit === '2pans' ? [-largeur * 0.25, hauteurToit * 0.7, 0] : null
    };
  }, [hauteur, profondeur, largeur, typeToit, calculs.hauteurToit]);

  // Callback optimisé
  const handleClick = useCallback((event) => {
    event.stopPropagation();
    if (onClick) onClick(event);
  }, [onClick]);

  return (
    <group position={position} rotation={[0, calculs.angleRad, 0]} onClick={handleClick}>
      
      {/* FONDATIONS */}
      <mesh position={positions.fondations} geometry={geometries.fondations} material={materials.fondations} />
      
      {/* SOUS-SOL */}
      <mesh position={positions.sousSol} geometry={geometries.sousSol} material={materials.sousSol} />
      
      {/* MAISON PRINCIPALE */}
      <mesh 
        position={positions.maison} 
        geometry={geometries.maison} 
        material={materials.maison} 
        castShadow 
        receiveShadow 
      />
      
      {/* FENÊTRES */}
      <mesh position={[0, hauteur * 0.6, profondeur / 2 + 0.02]} geometry={new THREE.BoxGeometry(1.2, 1.5, 0.1)} material={materials.fenetre} castShadow />
      <mesh position={[-2.5, hauteur * 0.6, profondeur / 2 + 0.02]} geometry={new THREE.BoxGeometry(1.2, 1.5, 0.1)} material={materials.fenetre} castShadow />
      <mesh position={[2.5, hauteur * 0.6, profondeur / 2 + 0.02]} geometry={new THREE.BoxGeometry(1.2, 1.5, 0.1)} material={materials.fenetre} castShadow />
      
      {/* PORTE */}
      <mesh position={[0, hauteur * 0.2, profondeur / 2 + 0.02]} geometry={new THREE.BoxGeometry(1, 2.2, 0.15)} material={materials.porte} castShadow />
      <mesh position={[0.3, hauteur * 0.2, profondeur / 2 + 0.1]} geometry={new THREE.SphereGeometry(0.08, 8, 8)} material={new THREE.MeshStandardMaterial({ color: '#ffd700', roughness: 0.2, metalness: 0.9 })} castShadow />
      
      {/* TOIT - GROUPE COMPLET */}
      <group position={positions.toit}>
        <group 
          rotation={[
            0, 
            (typeToit === 'monopente' || typeToit === '2pans') ? (orientationToit * Math.PI) / 180 : 0, 
            0
          ]}
        >
          {/* Toit principal */}
          <mesh position={positions.toitMesh} geometry={geometries.toit} material={materials.toit} castShadow />
          
          {/* Faîtage (seulement pour toit à 2 pans) */}
          {positions.faite && (
            <mesh position={positions.faite} geometry={new THREE.BoxGeometry(0.15, 0.15, profondeur + 0.2)} material={new THREE.MeshStandardMaterial({ color: '#8b0000', roughness: 0.5 })} castShadow />
          )}
          
          {/* Cheminée (seulement pour toit à 2 pans) */}
          {positions.cheminee && (
            <mesh position={positions.cheminee} geometry={new THREE.BoxGeometry(0.6, 1.2, 0.6)} material={new THREE.MeshStandardMaterial({ color: '#8b4513', roughness: 0.8 })} castShadow />
          )}
        </group>
      </group>
      
    </group>
  );
}

export default memo(UnifiedMaison3D);
