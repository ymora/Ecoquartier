import { memo, useMemo, useCallback } from 'react';
import * as THREE from 'three';

/**
 * Version optimisée du composant Maison3D
 * Utilise des techniques d'optimisation avancées
 */

function OptimizedMaison3D({ 
  position = [0, 0, 0], 
  largeur = 10, 
  profondeur = 8, 
  hauteur = 7,
  profondeurFondations = 1.2,
  angle = 0,
  typeToit = '2pans',
  penteToit = 30,
  orientationToit = 0,
  onClick
}) {
  
  // Mémoriser les calculs coûteux
  const calculs = useMemo(() => {
    const angleRad = -(angle * Math.PI) / 180;
    const dimensionPente = typeToit === 'monopente' && (orientationToit === 90 || orientationToit === 270) ? profondeur : largeur;
    const hauteurToit = Math.tan((penteToit * Math.PI) / 180) * (dimensionPente / 2);
    
    return { angleRad, hauteurToit };
  }, [angle, typeToit, penteToit, orientationToit, largeur, profondeur]);

  // Mémoriser les géométries
  const geometries = useMemo(() => {
    const { hauteurToit } = calculs;
    
    const geometries = {};
    
    // Tronc principal
    geometries.maison = new THREE.BoxGeometry(largeur, hauteur, profondeur);
    
    // Fondations
    geometries.fondations = new THREE.BoxGeometry(largeur + 1, 0.4, profondeur + 1);
    geometries.sousSol = new THREE.BoxGeometry(largeur, 2.1, profondeur);
    
    // Toit selon le type
    switch (typeToit) {
      case 'plat':
        geometries.toit = new THREE.BoxGeometry(largeur, 0.2, profondeur);
        break;
        
      case 'monopente':
        const shape = new THREE.Shape();
        if (orientationToit === 0 || orientationToit === 180) {
          shape.moveTo(-largeur / 2, 0);
          shape.lineTo(largeur / 2, 0);
          shape.lineTo(largeur / 2, hauteurToit);
          shape.lineTo(-largeur / 2, 0);
        } else {
          shape.moveTo(-profondeur / 2, 0);
          shape.lineTo(profondeur / 2, 0);
          shape.lineTo(profondeur / 2, hauteurToit);
          shape.lineTo(-profondeur / 2, 0);
        }
        
        const extrudeSettings = {
          steps: 1,
          depth: orientationToit === 0 || orientationToit === 180 ? profondeur : largeur,
          bevelEnabled: false
        };
        geometries.toit = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        break;
        
      case '2pans':
      default:
        const shape2pans = new THREE.Shape();
        shape2pans.moveTo(-largeur / 2, 0);
        shape2pans.lineTo(0, hauteurToit);
        shape2pans.lineTo(largeur / 2, 0);
        shape2pans.lineTo(-largeur / 2, 0);
        
        const extrudeSettings2pans = {
          steps: 1,
          depth: profondeur,
          bevelEnabled: false
        };
        geometries.toit = new THREE.ExtrudeGeometry(shape2pans, extrudeSettings2pans);
        break;
    }
    
    return geometries;
  }, [largeur, profondeur, hauteur, typeToit, orientationToit, calculs.hauteurToit]);

  // Mémoriser les matériaux
  const materials = useMemo(() => {
    return {
      maison: new THREE.MeshStandardMaterial({
        color: '#f5e6d3',
        roughness: 0.8,
        metalness: 0.05
      }),
      fondations: new THREE.MeshStandardMaterial({
        color: '#666666',
        transparent: true,
        opacity: 0.4,
        wireframe: true
      }),
      sousSol: new THREE.MeshStandardMaterial({
        color: '#999999',
        transparent: true,
        opacity: 0.6,
        roughness: 0.9
      }),
      toit: new THREE.MeshStandardMaterial({
        color: typeToit === 'plat' ? '#666666' : 
               typeToit === 'monopente' ? '#8B0000' : '#b71c1c',
        roughness: 0.7,
        metalness: 0.1,
        side: THREE.DoubleSide
      }),
      fenetre: new THREE.MeshStandardMaterial({
        color: '#4a90e2',
        roughness: 0.1,
        metalness: 0.8
      }),
      porte: new THREE.MeshStandardMaterial({
        color: '#8b4513',
        roughness: 0.7,
        metalness: 0.1
      }),
      poignee: new THREE.MeshStandardMaterial({
        color: '#ffd700',
        roughness: 0.2,
        metalness: 0.9
      })
    };
  }, [typeToit]);

  // Mémoriser les positions
  const positions = useMemo(() => {
    const { hauteurToit } = calculs;
    return {
      fondations: [0, -2.5 + 0.2, 0],
      sousSol: [0, -1.05, 0],
      maison: [0, hauteur / 2, 0],
      toit: [
        0, 
        hauteur + (typeToit === 'plat' ? 0.1 : 0), 
        typeToit === 'plat' ? 0 : -(orientationToit === 0 || orientationToit === 180 ? profondeur : largeur) / 2
      ],
      faite: typeToit === '2pans' ? [0, hauteur + hauteurToit, 0] : null,
      cheminee: typeToit === '2pans' ? [-largeur * 0.25, hauteur + hauteurToit * 0.7, 0] : null
    };
  }, [hauteur, profondeur, largeur, typeToit, orientationToit, calculs.hauteurToit]);

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
      <mesh position={positions.maison} geometry={geometries.maison} material={materials.maison} castShadow receiveShadow />
      
      {/* FENÊTRES */}
      <mesh position={[0, hauteur * 0.6, profondeur / 2 + 0.02]} geometry={new THREE.BoxGeometry(1.2, 1.5, 0.1)} material={materials.fenetre} castShadow />
      <mesh position={[-2.5, hauteur * 0.6, profondeur / 2 + 0.02]} geometry={new THREE.BoxGeometry(1.2, 1.5, 0.1)} material={materials.fenetre} castShadow />
      <mesh position={[2.5, hauteur * 0.6, profondeur / 2 + 0.02]} geometry={new THREE.BoxGeometry(1.2, 1.5, 0.1)} material={materials.fenetre} castShadow />
      
      {/* PORTE */}
      <mesh position={[0, hauteur * 0.2, profondeur / 2 + 0.02]} geometry={new THREE.BoxGeometry(1, 2.2, 0.15)} material={materials.porte} castShadow />
      <mesh position={[0.3, hauteur * 0.2, profondeur / 2 + 0.1]} geometry={new THREE.SphereGeometry(0.08, 8, 8)} material={materials.poignee} castShadow />
      
      {/* TOIT */}
      <mesh 
        position={positions.toit} 
        rotation={[0, typeToit === 'monopente' ? (orientationToit * Math.PI) / 180 : 0, 0]}
        geometry={geometries.toit}
        material={materials.toit}
        castShadow
      />
      
      {/* FAÎTAGE (seulement pour toit à 2 pans) */}
      {positions.faite && (
        <mesh position={positions.faite} geometry={new THREE.BoxGeometry(0.15, 0.15, profondeur + 0.2)} material={new THREE.MeshStandardMaterial({ color: '#8b0000', roughness: 0.5 })} castShadow />
      )}
      
      {/* CHEMINÉE (seulement pour toit à 2 pans) */}
      {positions.cheminee && (
        <mesh position={positions.cheminee} geometry={new THREE.BoxGeometry(0.6, 1.2, 0.6)} material={new THREE.MeshStandardMaterial({ color: '#8b4513', roughness: 0.8 })} castShadow />
      )}
      
    </group>
  );
}

export default memo(OptimizedMaison3D);
