import { useRef, useMemo, memo, useCallback } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { geometryCache } from '../../utils/cache/GeometryCache';
import { useLODSystem } from '../../hooks/useLODSystem';
import HaloPulsant from './HaloPulsant';

/**
 * Version ultra-optimisée du composant Arbre3D
 * Utilise toutes les techniques d'optimisation avancées
 */

function UltraOptimizedArbre3D({ 
  position = [0, 0, 0], 
  arbreData, 
  hauteur = 6, 
  envergure = 4, 
  profondeurRacines = 1.5,
  validationStatus = 'ok',
  anneeProjection = 0,
  saison = 'ete',
  elevationSol = 0,
  onClick,
  lod = 'high'
}) {
  const groupRef = useRef();
  const { getLODLevel, optimizeGeometry, optimizeMaterial } = useLODSystem();
  
  // Position ajustée avec élévation du sol (mémorisée)
  const positionAjustee = useMemo(() => [
    position[0], 
    position[1] + elevationSol,
    position[2]
  ], [position, elevationSol]);
  
  // Calculs mémorisés selon le LOD
  const arbreCalculs = useMemo(() => {
    const hauteurPlantation = 2;
    const envergurePlantation = 0.8;
    const profondeurRacinesPlantation = 0.3;
    
    const progression = Math.min(anneeProjection / 20, 1);
    
    const hauteurActuelle = hauteurPlantation + (hauteur - hauteurPlantation) * progression;
    const envergureActuelle = envergurePlantation + (envergure - envergurePlantation) * progression;
    const profondeurRacinesActuelle = profondeurRacinesPlantation + (profondeurRacines - profondeurRacinesPlantation) * progression;
    
    const rayonTronc = Math.min(0.3, hauteurActuelle * 0.04);
    const rayonTroncBase = rayonTronc * 1.3;
    
    return {
      hauteurActuelle,
      envergureActuelle,
      profondeurRacinesActuelle,
      rayonTronc,
      rayonTroncBase,
      progression
    };
  }, [hauteur, envergure, profondeurRacines, anneeProjection]);
  
  // Géométries optimisées avec cache
  const geometries = useMemo(() => {
    const { hauteurActuelle, envergureActuelle, rayonTronc, rayonTroncBase } = arbreCalculs;
    
    const geometries = {};
    
    // Tronc - géométrie optimisée selon LOD
    const troncSegments = lod === 'high' ? 16 : lod === 'medium' ? 8 : 6;
    geometries.tronc = geometryCache.get(
      'cylinder',
      { radiusTop: rayonTronc, radiusBottom: rayonTroncBase, height: hauteurActuelle, segments: troncSegments },
      () => new THREE.CylinderGeometry(rayonTronc, rayonTroncBase, hauteurActuelle, troncSegments)
    );
    
    // Feuillage - géométrie simplifiée pour LOD bas
    const feuillageSegments = lod === 'high' ? 24 : lod === 'medium' ? 16 : 8;
    geometries.feuillage = geometryCache.get(
      'sphere',
      { radius: envergureActuelle / 2, segments: feuillageSegments },
      () => new THREE.SphereGeometry(envergureActuelle / 2, feuillageSegments, Math.floor(feuillageSegments * 0.75))
    );
    
    // Racines - seulement pour LOD élevé
    if (lod !== 'low' && arbreCalculs.profondeurRacinesActuelle > 0) {
      geometries.racines = geometryCache.get(
        'cone',
        { radius: arbreCalculs.rayonTronc * 0.6, height: arbreCalculs.profondeurRacinesActuelle, segments: 8 },
        () => new THREE.ConeGeometry(arbreCalculs.rayonTronc * 0.6, arbreCalculs.profondeurRacinesActuelle, 8)
      );
    }
    
    return geometries;
  }, [arbreCalculs, lod]);
  
  // Matériaux optimisés avec cache
  const materials = useMemo(() => {
    const materials = {};
    
    // Matériau tronc
    materials.tronc = new THREE.MeshStandardMaterial({
      color: '#8B4513',
      roughness: 0.9,
      metalness: 0.1
    });
    
    // Matériau feuillage selon la saison
    const couleurFeuillage = getCouleurSaison(saison, arbreData);
    materials.feuillage = new THREE.MeshStandardMaterial({
      color: couleurFeuillage,
      transparent: true,
      opacity: 0.8,
      roughness: 0.85
    });
    
    // Matériau racines
    if (geometries.racines) {
      materials.racines = new THREE.MeshStandardMaterial({
        color: validationStatus === 'error' ? '#ff0000' : '#6d4c41',
        transparent: true,
        opacity: 0.6,
        roughness: 0.9
      });
    }
    
    // Optimiser les matériaux selon le LOD
    Object.keys(materials).forEach(key => {
      materials[key] = optimizeMaterial(materials[key], lod);
    });
    
    return materials;
  }, [saison, arbreData, validationStatus, lod, geometries.racines]);
  
  // Instances optimisées pour les feuilles/fleurs (seulement pour LOD élevé)
  const instances = useMemo(() => {
    if (lod === 'low') return null;
    
    const { envergureActuelle, hauteurActuelle } = arbreCalculs;
    const count = lod === 'high' ? 200 : 100;
    
    const positions = [];
    const scales = [];
    const colors = [];
    
    for (let i = 0; i < count; i++) {
      // Distribution sphérique optimisée
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = (envergureActuelle / 2) * Math.sin(phi) * Math.cos(theta);
      const y = hauteurActuelle + (envergureActuelle / 2) * 0.3 * Math.cos(phi);
      const z = (envergureActuelle / 2) * Math.sin(phi) * Math.sin(theta);
      
      positions.push(x, y, z);
      scales.push(0.1, 0.1, 0.1);
      colors.push(0.2, 0.8, 0.2);
    }
    
    return { positions, scales, colors, count };
  }, [arbreCalculs, lod]);
  
  // Gestionnaire de clic optimisé
  const handleClick = useCallback((event) => {
    event.stopPropagation();
    if (onClick) onClick(event);
  }, [onClick]);
  
  // Fonction pour obtenir la couleur selon la saison (mémorisée)
  const getCouleurSaison = useCallback((saison, arbreData) => {
    switch (saison) {
      case 'hiver':
        return arbreData?.feuillage?.type === 'Caduc' ? '#8B4513' : '#1b5e20';
      case 'printemps':
        return '#7cb342';
      case 'ete':
        return '#2e7d32';
      case 'automne':
        return '#d84315';
      default:
        return '#2e7d32';
    }
  }, []);
  
  return (
    <group ref={groupRef} position={positionAjustee} onClick={handleClick}>
      
      {/* TRONC optimisé */}
      <mesh 
        position={[0, arbreCalculs.hauteurActuelle / 2, 0]} 
        castShadow 
        receiveShadow
        geometry={geometries.tronc}
        material={materials.tronc}
      />
      
      {/* FEUILLAGE optimisé selon LOD */}
      {lod !== 'low' && (
        <mesh 
          position={[0, arbreCalculs.hauteurActuelle + arbreCalculs.envergureActuelle * 0.3, 0]} 
          castShadow 
          receiveShadow
          geometry={geometries.feuillage}
          material={materials.feuillage}
        />
      )}
      
      {/* INSTANCES pour LOD élevé */}
      {lod === 'high' && instances && (
        <instancedMesh 
          args={[null, null, instances.count]} 
          castShadow
          geometry={new THREE.SphereGeometry(0.1, 6, 4)}
          material={materials.feuillage}
        >
          {instances.positions.map((_, i) => {
            if (i % 3 === 0) {
              const idx = i / 3;
              const matrix = new THREE.Matrix4();
              matrix.setPosition(
                instances.positions[i],
                instances.positions[i + 1],
                instances.positions[i + 2]
              );
              matrix.scale(new THREE.Vector3(
                instances.scales[i],
                instances.scales[i + 1],
                instances.scales[i + 2]
              ));
              return <primitive key={idx} object={matrix} attach={`instanceMatrix[${idx}]`} />;
            }
            return null;
          }).filter(Boolean)}
        </instancedMesh>
      )}
      
      {/* RACINES simplifiées pour LOD bas */}
      {geometries.racines && (
        <mesh position={[0, -arbreCalculs.profondeurRacinesActuelle / 2, 0]} castShadow>
          <primitive object={geometries.racines} />
          <primitive object={materials.racines} />
        </mesh>
      )}
      
      {/* HALO PULSANT - seulement pour LOD élevé */}
      {lod === 'high' && (
        <HaloPulsant 
          status={validationStatus}
          position={[0, elevationSol, 0]}
          envergure={arbreCalculs.envergureActuelle}
        />
      )}
      
      {/* LABEL - seulement pour LOD élevé */}
      {lod === 'high' && (
        <Html position={[0, arbreCalculs.hauteurActuelle + 0.3, 0]} center>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '5px 10px',
            borderRadius: '8px',
            fontSize: '10px',
            fontWeight: '600',
            color: '#333',
            border: '1.5px solid #4caf50',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            textAlign: 'left',
            lineHeight: '1.4',
            minWidth: '140px'
          }}>
            <div style={{ fontWeight: '700', color: '#2e7d32', whiteSpace: 'nowrap' }}>
              {arbreData?.name || 'Arbre'}
            </div>
            <div style={{ fontSize: '9px', color: '#666', whiteSpace: 'nowrap' }}>
              ↕️ {arbreCalculs.hauteurActuelle.toFixed(1)}m · ↔️ {arbreCalculs.envergureActuelle.toFixed(1)}m
            </div>
          </div>
        </Html>
      )}
      
    </group>
  );
}

// Optimisation : Éviter re-renders des arbres 3D
export default memo(UltraOptimizedArbre3D);
