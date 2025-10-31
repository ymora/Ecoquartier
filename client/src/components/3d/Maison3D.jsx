import { memo, useMemo } from 'react';
import * as THREE from 'three';

function Maison3D({ 
  position = [0, 0, 0], 
  largeur = 10, 
  profondeur = 8, 
  hauteur = 7,
  angle = 0,
  typeToit = '2pans',
  penteToit = 3,
  orientationToit = 0,
  onClick
}) {
  // Constantes et calculs
  const hauteurFondationsSemelles = 0.4;
  const hauteurMursSousSol = 2.1;
  const profondeurTotaleSousSol = hauteurFondationsSemelles + hauteurMursSousSol;
  
  // Calculs du toit
  const dimensionPente = typeToit === 'monopente' && (orientationToit === 90 || orientationToit === 270) ? profondeur : largeur;
  const hauteurToit = Math.tan((penteToit * Math.PI) / 180) * (dimensionPente / 2);
  const angleRad = -(angle * Math.PI) / 180;
  
  // Matériaux optimisés avec useMemo
  const materials = useMemo(() => ({
    fondations: new THREE.MeshStandardMaterial({
      color: "#666666",
      transparent: true,
      opacity: 0.4,
      wireframe: true
    }),
    sousSol: new THREE.MeshStandardMaterial({
      color: "#999999",
      transparent: true,
      opacity: 0.6,
      roughness: 0.9
    }),
    murs: new THREE.MeshStandardMaterial({
      color: "#f5e6d3",
      roughness: 0.8,
      metalness: 0.05
    }),
    fenetres: new THREE.MeshStandardMaterial({
      color: "#4a90e2",
      roughness: 0.1,
      metalness: 0.8
    }),
    porte: new THREE.MeshStandardMaterial({
      color: "#8b4513",
      roughness: 0.7,
      metalness: 0.1
    }),
    poignee: new THREE.MeshStandardMaterial({
      color: "#ffd700",
      roughness: 0.2,
      metalness: 0.9
    }),
    toit: new THREE.MeshStandardMaterial({
      color: typeToit === 'plan' ? "#666666" : 
             typeToit === 'monopente' ? "#8B0000" : "#b71c1c",
      roughness: 0.8,
      metalness: 0.1
    }),
    faitage: new THREE.MeshStandardMaterial({
      color: "#8b0000",
      roughness: 0.5
    }),
    cheminee: new THREE.MeshStandardMaterial({
      color: "#8b4513",
      roughness: 0.8
    })
  }), [typeToit]);

  // Géométrie du toit optimisée
  const toitGeometry = useMemo(() => {
    switch (typeToit) {
      case 'plan':
        return new THREE.BoxGeometry(largeur, 0.2, profondeur);
        
      case 'monopente': {
        const shape = new THREE.Shape();
        const penteY = hauteurToit;
        
        if (orientationToit === 0 || orientationToit === 180) {
          const dimensionPente = Math.max(largeur, profondeur);
          shape.moveTo(-dimensionPente / 2, 0);
          shape.lineTo(dimensionPente / 2, 0);
          shape.lineTo(dimensionPente / 2, penteY);
          shape.lineTo(-dimensionPente / 2, 0);
        } else {
          const dimensionPente = Math.min(largeur, profondeur);
          shape.moveTo(-dimensionPente / 2, 0);
          shape.lineTo(dimensionPente / 2, 0);
          shape.lineTo(dimensionPente / 2, penteY);
          shape.lineTo(-dimensionPente / 2, 0);
        }
        
        const extrudeSettings = {
          steps: 1,
          depth: orientationToit === 0 || orientationToit === 180 ? 
                 Math.min(largeur, profondeur) : 
                 Math.max(largeur, profondeur),
          bevelEnabled: false
        };
        
        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
      }
        
      case '2pans':
      default: {
        const shape2pans = new THREE.Shape();
        const penteY2pans = hauteurToit;
        
        shape2pans.moveTo(-largeur / 2, 0);
        shape2pans.lineTo(0, penteY2pans);
        shape2pans.lineTo(largeur / 2, 0);
        shape2pans.lineTo(-largeur / 2, 0);
        
        const extrudeSettings2pans = {
          steps: 1,
          depth: profondeur,
          bevelEnabled: false
        };
        
        return new THREE.ExtrudeGeometry(shape2pans, extrudeSettings2pans);
      }
    }
  }, [typeToit, largeur, profondeur, hauteurToit, orientationToit]);

  // Configuration des fenêtres
  const fenetres = [
    { position: [0, hauteur * 0.6, profondeur / 2 + 0.02] },
    { position: [-2.5, hauteur * 0.6, profondeur / 2 + 0.02] },
    { position: [2.5, hauteur * 0.6, profondeur / 2 + 0.02] }
  ];

  return (
    <group position={position} rotation={[0, angleRad, 0]} onClick={onClick}>
      {/* Fondations */}
      <mesh position={[0, -profondeurTotaleSousSol + hauteurFondationsSemelles / 2, 0]}>
        <boxGeometry args={[largeur + 1, hauteurFondationsSemelles, profondeur + 1]} />
        <primitive object={materials.fondations} />
      </mesh>
      
      {/* Murs sous-sol */}
      <mesh position={[0, -hauteurMursSousSol / 2, 0]}>
        <boxGeometry args={[largeur, hauteurMursSousSol, profondeur]} />
        <primitive object={materials.sousSol} />
      </mesh>
      
      {/* Murs RDC + étages */}
      <mesh position={[0, hauteur / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[largeur, hauteur, profondeur]} />
        <primitive object={materials.murs} />
      </mesh>
      
      {/* Fenêtres */}
      {fenetres.map((fenetre, index) => (
        <mesh key={index} position={fenetre.position} castShadow>
          <boxGeometry args={[1.2, 1.5, 0.1]} />
          <primitive object={materials.fenetres} />
        </mesh>
      ))}
      
      {/* Porte */}
      <mesh position={[0, hauteur * 0.2, profondeur / 2 + 0.02]} castShadow>
        <boxGeometry args={[1, 2.2, 0.15]} />
        <primitive object={materials.porte} />
      </mesh>
      
      {/* Poignée */}
      <mesh position={[0.3, hauteur * 0.2, profondeur / 2 + 0.1]} castShadow>
        <sphereGeometry args={[0.08, 8, 8]} />
        <primitive object={materials.poignee} />
      </mesh>
      
      {/* Toit */}
      <group 
        position={[
          0, 
          hauteur + (typeToit === 'plan' ? 0.1 : 0), 
          typeToit === 'plan' ? 0 : 0
        ]}
        rotation={[
          0, 
          (typeToit === 'monopente' || typeToit === '2pans') ? (orientationToit * Math.PI) / 180 : 0, 
          0
        ]}
      >
        <mesh 
          position={[0, 0, typeToit === 'plan' ? 0 : -profondeur / 2]}
          castShadow
        >
          <primitive object={toitGeometry} />
          <primitive object={materials.toit} />
        </mesh>
        
        {/* Faîtage - seulement pour toit à 2 pans */}
        {typeToit === '2pans' && (
          <mesh position={[0, hauteurToit, 0]} castShadow>
            <boxGeometry args={[0.15, 0.15, profondeur + 0.2]} />
            <primitive object={materials.faitage} />
          </mesh>
        )}
        
        {/* Cheminée - seulement pour toit à 2 pans */}
        {typeToit === '2pans' && (
          <mesh position={[-largeur * 0.25, hauteurToit * 0.7, 0]} castShadow>
            <boxGeometry args={[0.6, 1.2, 0.6]} />
            <primitive object={materials.cheminee} />
          </mesh>
        )}
      </group>
    </group>
  );
}

export default memo(Maison3D);