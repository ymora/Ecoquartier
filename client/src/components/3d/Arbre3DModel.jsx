import React, { memo, Suspense, useMemo, useRef } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import Arbre3D from './Arbre3D';
import HaloPulsant from './HaloPulsant';

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
  hauteurMaturite = 7, // Hauteur à maturité en mètres (depuis arbustesData.hauteurMaturite)
  scale = 0.2, // Échelle de base du modèle (à ajuster selon les logs)
  rotation = [0, 0, 0],
  onClick,
  anneeProjection = 20,
  arbreData = null,
  envergure = 5, // Envergure pour le cercle de validation
  validationStatus = 'ok', // 'ok', 'warning', 'error'
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
          hauteurMaturite={hauteurMaturite}
          envergure={envergure}
          validationStatus={validationStatus}
          rotation={rotation}
          onClick={onClick}
          anneeProjection={anneeProjection}
          arbreData={arbreData}
        />
      </ErrorBoundary>
    </Suspense>
  );
}

// Composant interne pour charger le GLB - SANS modification de couleur
// Les modèles GLB gardent leur apparence originale
function GLBModel({ modelPath, position, hauteurMaturite = 7, envergure = 5, validationStatus = 'ok', rotation, onClick, anneeProjection, arbreData }) {
  const { scene } = useGLTF(modelPath);
  const groupRef = useRef();
  
  // Cloner et configurer la scène une seule fois
  const { clonedScene, hauteurModele } = useMemo(() => {
    const cloned = scene.clone();
    
    // Activer les ombres pour tous les mesh
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    // Mesurer la hauteur RÉELLE du modèle Blender
    cloned.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(cloned);
    const hauteurMesuree = box.max.y - box.min.y;
    
    return { clonedScene: cloned, hauteurModele: hauteurMesuree };
  }, [scene]);
  
  // CALCUL AUTOMATIQUE DU SCALE pour que l'arbre atteigne hauteurMaturite
  // 1. Calculer le scale nécessaire pour atteindre hauteurMaturite
  const scaleNecessaire = hauteurMaturite / hauteurModele;
  
  // 2. Appliquer la croissance selon anneeProjection
  const progression = Math.min(anneeProjection / 20, 1);
  const scaleJeune = 0.15; // 15% de la hauteur à maturité (jeune plant)
  const scaleProgression = scaleJeune + (1 - scaleJeune) * progression;
  
  // 3. Scale final = scale nécessaire × progression de croissance
  const finalScale = scaleNecessaire * scaleProgression;
  const hauteurFinale = hauteurModele * finalScale;
  
  // Calculer l'envergure actuelle selon la progression
  const envergureActuelle = envergure * scaleProgression;
  
  // Matériau pour les racines
  const racinesMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#5d4037',
    roughness: 0.95,
    metalness: 0.1
  }), []);
  
  return (
    <group ref={groupRef}>
      <primitive 
        object={clonedScene}
        position={position}
        scale={[finalScale, finalScale, finalScale]}
        rotation={rotation}
        onClick={onClick}
      />
      
      {/* Racines visibles qui sortent du sol (4 branches radiales) */}
      {[0, 90, 180, 270].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const longueurRacine = envergureActuelle * 0.4;
        const epaisseurRacine = finalScale * 0.3;
        
        return (
          <mesh
            key={angle}
            position={[
              position[0] + Math.cos(rad) * longueurRacine * 0.3,
              position[1] - 0.05,
              position[2] + Math.sin(rad) * longueurRacine * 0.3
            ]}
            rotation={[0, rad, Math.PI / 12]}
            castShadow
          >
            <cylinderGeometry args={[epaisseurRacine * 0.6, epaisseurRacine, longueurRacine, 6]} />
            <primitive object={racinesMaterial} />
          </mesh>
        );
      })}
      
      {/* HALO PULSANT ANIMÉ - Uniquement si validation NON-OK */}
      {validationStatus !== 'ok' && (
        <HaloPulsant 
          couleur={validationStatus === 'erreur' ? '#f44336' : '#ff9800'}
          taille={envergureActuelle * 0.6}
        />
      )}
      
      {/* Label avec nom au-dessus - UNIFIÉ avec Arbre3D.jsx */}
      <Html distanceFactor={10} position={[0, hauteurFinale + 1, 0]}>
        <div style={{
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none'
        }}>
          {arbreData?.name || 'Arbre'} - {Math.round(progression * 100)}% croissance
        </div>
      </Html>
    </group>
  );
}

// Indicateur de chargement
function LoadingIndicator({ position }) {
  return (
    <group position={position}>
      {/* Indicateur simple : sphère pulsante */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial 
          color="#4caf50"
          emissive="#4caf50"
          emissiveIntensity={0.5}
        />
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

  static getDerivedStateFromError() {
    // Fallback silencieux - l'arbre procédural sera utilisé
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default memo(Arbre3DModel);

