import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Cube de navigation 3D style Fusion 360
 * Permet de sélectionner rapidement les vues principales
 */
function CubeNavigation3D({ 
  vueActuelle = 'perspective',
  onVueChange = () => {},
  position = [0, 0, 0],
  size = 1
}) {
  const cubeRef = useRef();
  const [hovered, setHovered] = useState(null);
  const [rotation, setRotation] = useState([0, 0, 0]);

  // Animation de rotation continue
  useFrame((state) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x = rotation[0] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      cubeRef.current.rotation.y = rotation[1] + state.clock.elapsedTime * 0.2;
      cubeRef.current.rotation.z = rotation[2];
    }
  });

  // Faces du cube avec leurs vues correspondantes
  const faces = [
    { id: 'perspective', normal: [0, 0, 1], color: '#4CAF50', label: '🎮', position: [0, 0, 0.6] },
    { id: 'dessus', normal: [0, 1, 0], color: '#2196F3', label: '🔝', position: [0, 0.6, 0] },
    { id: 'cote', normal: [1, 0, 0], color: '#FF9800', label: '👉', position: [0.6, 0, 0] },
    { id: 'perspective-iso', normal: [-1, -1, 1], color: '#9C27B0', label: '🎯', position: [-0.4, -0.4, 0.4] },
    { id: 'perspective-iso2', normal: [1, -1, 1], color: '#E91E63', label: '🎪', position: [0.4, -0.4, 0.4] },
    { id: 'dessous', normal: [0, -1, 0], color: '#607D8B', label: '🔽', position: [0, -0.6, 0] }
  ];

  const handleFaceClick = (faceId) => {
    onVueChange(faceId);
    
    // Animation de rotation vers la face sélectionnée
    const face = faces.find(f => f.id === faceId);
    if (face) {
      const targetRotation = new THREE.Euler().setFromQuaternion(
        new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 0, 1), // Face avant par défaut
          new THREE.Vector3(...face.normal).normalize()
        )
      );
      
      setRotation([targetRotation.x, targetRotation.y, targetRotation.z]);
    }
  };

  return (
    <group ref={cubeRef} position={position}>
      {/* Cube principal */}
      <mesh 
        scale={[size, size, size]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={hovered ? '#ffffff' : '#f0f0f0'}
          transparent
          opacity={0.8}
          wireframe={true}
          wireframeLinewidth={2}
        />
      </mesh>

      {/* Faces cliquables */}
      {faces.map((face, index) => (
        <group key={face.id}>
          {/* Face invisible pour le clic */}
          <mesh 
            position={face.position.map(p => p * size * 0.51)}
            onClick={() => handleFaceClick(face.id)}
            onPointerOver={() => setHovered(face.id)}
            onPointerOut={() => setHovered(null)}
          >
            <planeGeometry args={[size * 0.8, size * 0.8]} />
            <meshBasicMaterial 
              color={vueActuelle === face.id ? face.color : 'transparent'}
              transparent
              opacity={vueActuelle === face.id ? 0.3 : 0}
            />
          </mesh>

          {/* Label de la face */}
          <mesh position={face.position.map(p => p * size * 0.52)}>
            <planeGeometry args={[size * 0.3, size * 0.3]} />
            <meshBasicMaterial 
              color={vueActuelle === face.id ? face.color : '#333333'}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* Texte du label (simulé avec un carré coloré) */}
          <mesh position={face.position.map(p => p * size * 0.53)}>
            <planeGeometry args={[size * 0.2, size * 0.2]} />
            <meshBasicMaterial 
              color={vueActuelle === face.id ? '#ffffff' : face.color}
              transparent
              opacity={0.9}
            />
          </mesh>
        </group>
      ))}

      {/* Indicateur de vue actuelle */}
      <mesh position={[0, 0, size * 0.6]}>
        <sphereGeometry args={[size * 0.1, 8, 8]} />
        <meshBasicMaterial 
          color={faces.find(f => f.id === vueActuelle)?.color || '#4CAF50'}
          emissive={faces.find(f => f.id === vueActuelle)?.color || '#4CAF50'}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

export default CubeNavigation3D;
