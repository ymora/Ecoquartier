import { useGLTF, useTexture } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { memo, useEffect, useState } from 'react';
import { useLoader } from '@react-three/fiber';

/**
 * Composant pour charger et afficher des modèles 3D réels (GLB ou OBJ)
 * 
 * @param {Array} position - Position [x, y, z]
 * @param {string} modelPath - Chemin vers le modèle (.glb ou .obj)
 * @param {string} mtlPath - Chemin vers le matériau (.mtl) si OBJ
 * @param {number} scale - Échelle du modèle
 * @param {Array} rotation - Rotation [x, y, z] en radians
 * @param {Function} onClick - Callback au clic
 * @param {number} anneeProjection - Année de projection (0-20)
 */
function Arbre3DModel({ 
  position = [0, 0, 0], 
  modelPath,
  mtlPath = null,
  scale = 1,
  rotation = [0, 0, 0],
  onClick,
  anneeProjection = 20
}) {
  const [model, setModel] = useState(null);
  const [error, setError] = useState(null);
  
  // Déterminer le type de fichier
  const fileExtension = modelPath?.split('.').pop()?.toLowerCase();
  const isGLB = fileExtension === 'glb' || fileExtension === 'gltf';
  const isOBJ = fileExtension === 'obj';
  
  // Charger GLB/GLTF
  const gltfData = isGLB ? useGLTF(modelPath, true) : null;
  
  // Charger OBJ avec matériaux
  useEffect(() => {
    if (!isOBJ || !modelPath) return;
    
    const loadOBJ = async () => {
      try {
        let materials = null;
        
        // Charger les matériaux si fournis
        if (mtlPath) {
          const mtlLoader = new MTLLoader();
          materials = await mtlLoader.loadAsync(mtlPath);
          materials.preload();
        }
        
        // Charger l'objet
        const objLoader = new OBJLoader();
        if (materials) {
          objLoader.setMaterials(materials);
        }
        
        const object = await objLoader.loadAsync(modelPath);
        
        // Activer les ombres pour tous les mesh
        object.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        
        setModel(object);
      } catch (err) {
        console.error('Erreur chargement OBJ:', err);
        setError(err.message);
      }
    };
    
    loadOBJ();
  }, [modelPath, mtlPath, isOBJ]);
  
  // Calculer l'échelle selon l'année de projection
  const progression = Math.min(anneeProjection / 20, 1);
  const scaleJeune = 0.3; // 30% à la plantation
  const scaleFinal = scaleJeune + (1 - scaleJeune) * progression;
  const finalScale = scale * scaleFinal;
  
  // Erreur de chargement
  if (error) {
    return (
      <group position={position}>
        <mesh>
          <boxGeometry args={[1, 3, 1]} />
          <meshBasicMaterial color="red" wireframe />
        </mesh>
      </group>
    );
  }
  
  // GLB/GLTF
  if (isGLB && gltfData) {
    const clonedScene = gltfData.scene.clone();
    
    // Activer les ombres
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    return (
      <primitive 
        object={clonedScene}
        position={position}
        scale={[finalScale, finalScale, finalScale]}
        rotation={rotation}
        onClick={onClick}
      />
    );
  }
  
  // OBJ
  if (isOBJ && model) {
    return (
      <primitive 
        object={model}
        position={position}
        scale={[finalScale, finalScale, finalScale]}
        rotation={rotation}
        onClick={onClick}
      />
    );
  }
  
  // Chargement en cours
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1, 32]} />
        <meshBasicMaterial color="#4caf50" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

// Fonction utilitaire pour précharger les modèles
export const preloadModel = (path) => {
  const ext = path.split('.').pop().toLowerCase();
  if (ext === 'glb' || ext === 'gltf') {
    useGLTF.preload(path);
  }
};

export default memo(Arbre3DModel);

