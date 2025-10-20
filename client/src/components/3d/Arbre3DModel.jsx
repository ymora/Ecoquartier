import React, { memo, Suspense } from 'react';
import { useGLTF } from '@react-three/drei';
import Arbre3D from './Arbre3D';

/**
 * Composant pour charger et afficher des modèles 3D réels (GLB)
 * Avec fallback automatique vers Arbre3D si le modèle ne charge pas
 * 
 * @param {Array} position - Position [x, y, z]
 * @param {string} modelPath - Chemin vers le modèle .glb
 * @param {number} scale - Échelle du modèle
 * @param {Array} rotation - Rotation [x, y, z] en radians
 * @param {Function} onClick - Callback au clic
 * @param {number} anneeProjection - Année de projection (0-20)
 * @param {object} fallbackProps - Props pour l'arbre procédural en cas d'erreur
 */
function Arbre3DModel({ 
  position = [0, 0, 0], 
  modelPath,
  scale = 1,
  rotation = [0, 0, 0],
  onClick,
  anneeProjection = 20,
  fallbackProps = {}
}) {
  // Vérifier que le chemin existe
  if (!modelPath) {
    return <Arbre3DFallback position={position} {...fallbackProps} />;
  }
  
  return (
    <Suspense fallback={<LoadingIndicator position={position} />}>
      <ErrorBoundary fallback={<Arbre3DFallback position={position} {...fallbackProps} />}>
        <GLBModel 
          modelPath={modelPath}
          position={position}
          scale={scale}
          rotation={rotation}
          onClick={onClick}
          anneeProjection={anneeProjection}
        />
      </ErrorBoundary>
    </Suspense>
  );
}

// Composant interne pour charger le GLB
function GLBModel({ modelPath, position, scale, rotation, onClick, anneeProjection }) {
  const { scene } = useGLTF(modelPath);
  
  // Calculer l'échelle selon l'année de projection
  const progression = Math.min(anneeProjection / 20, 1);
  const scaleJeune = 0.3; // 30% à la plantation
  const scaleFinal = scaleJeune + (1 - scaleJeune) * progression;
  const finalScale = scale * scaleFinal;
  
  const clonedScene = scene.clone();
  
  // Activer les ombres pour tous les mesh
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

// Indicateur de chargement
function LoadingIndicator({ position }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <ringGeometry args={[0.8, 1, 32]} />
        <meshBasicMaterial color="#4caf50" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

// Arbre procédural en fallback
function Arbre3DFallback({ position, ...props }) {
  return <Arbre3D position={position} {...props} />;
}

// Error Boundary simple pour React Three Fiber
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.warn('Erreur chargement modèle 3D, utilisation du fallback:', error);
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Fonction utilitaire pour précharger les modèles
export const preloadModel = (path) => {
  try {
    useGLTF.preload(path);
  } catch (error) {
    console.warn(`Impossible de précharger: ${path}`, error);
  }
};

export default memo(Arbre3DModel);

