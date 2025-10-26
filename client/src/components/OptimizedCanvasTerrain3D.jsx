import { useRef, useState, useMemo, useCallback, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Sky } from '@react-three/drei';
import { geometryCache } from '../utils/cache/GeometryCache';
import { useLODSystem } from '../hooks/useLODSystem';
import OptimizedMaison3D from './3d/OptimizedMaison3D';
import OptimizedArbre3D from './3d/OptimizedArbre3D';
import { ECHELLE_PIXELS_PAR_METRE } from '../config/constants';

/**
 * Version optimisée du composant CanvasTerrain3D
 * Utilise des techniques d'optimisation avancées
 */

function OptimizedCanvasTerrain3D({ 
  dimensions = { largeur: 30, hauteur: 30 },
  planData = null,
  anneeProjection = 0,
  saison = 'ete',
  heureJournee = 90,
  orientation = 'nord-haut',
  couchesSol = [],
  onObjetPositionChange = null,
  onObjetSelectionChange = null
}) {
  const [vueMode, setVueMode] = useState('perspective');
  const [modeDeplacement, setModeDeplacement] = useState(false);
  const [solTransparent, setSolTransparent] = useState(true);
  const [objetSelectionne3D, setObjetSelectionne3D] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(0);
  const orbitControlsRef = useRef();
  
  // Utiliser le système LOD
  const { getLODLevel, optimizeGeometry, optimizeMaterial } = useLODSystem();
  
  // Conversion 2D→3D optimisée avec cache
  const data3D = useMemo(() => {
    if (!planData) return null;
    
    const echelle = ECHELLE_PIXELS_PAR_METRE;
    const data3D = {
      maison: null,
      citernes: [],
      canalisations: [],
      clotures: [],
      terrasses: [],
      paves: [],
      arbres: []
    };
    
    // Maisons optimisées
    if (planData.maisons && planData.maisons.length > 0) {
      data3D.maisons = planData.maisons.map((maison, idx) => {
        const maisonWidth = maison.getScaledWidth ? maison.getScaledWidth() : maison.width;
        const maisonHeight = maison.getScaledHeight ? maison.getScaledHeight() : maison.height;
        
        const largeur = maisonWidth / echelle;
        const profondeur = maisonHeight / echelle;
        const posX = maison.left / echelle;
        const posZ = maison.top / echelle;
        
        return {
          position: [posX, 0, posZ],
          largeur,
          profondeur,
          hauteur: maison.hauteurBatiment || 7,
          profondeurFondations: maison.profondeurFondations || 1.2,
          angle: maison.angle || 0,
          typeToit: maison.typeToit || '2pans',
          penteToit: maison.penteToit || 30,
          orientationToit: maison.orientationToit || 0,
          customType: 'maison',
          lod: getLODLevel([posX, 0, posZ])
        };
      });
    }
    
    // Arbres optimisés
    if (planData.arbres && planData.arbres.length > 0) {
      data3D.arbres = planData.arbres.map((arbre, idx) => {
        const arbreWidth = arbre.getScaledWidth ? arbre.getScaledWidth() : arbre.width;
        const arbreHeight = arbre.getScaledHeight ? arbre.getScaledHeight() : arbre.height;
        
        const envergureMax = Math.max(arbreWidth, arbreHeight) / echelle;
        const posX = arbre.left / echelle;
        const posZ = arbre.top / echelle;
        
        return {
          position: [posX, 0, posZ],
          arbreData: arbre.arbreData,
          hauteur: parseHauteur(arbre.arbreData?.tailleMaturite) || 6,
          envergure: envergureMax,
          profondeurRacines: solTransparent ? (envergureMax * 0.3) : 0,
          validationStatus: 'ok',
          anneeProjection,
          saison,
          elevationSol: arbre.elevationSol || 0,
          customType: 'arbre-a-planter',
          lod: getLODLevel([posX, 0, posZ])
        };
      });
    }
    
    return data3D;
  }, [planData, anneeProjection, solTransparent, saison, forceUpdate, getLODLevel]);
  
  // Gestionnaire de clic optimisé
  const handleObjetClick = useCallback((objet) => {
    setObjetSelectionne3D(objet);
    if (onObjetSelectionChange) {
      onObjetSelectionChange(objet);
    }
  }, [onObjetSelectionChange]);
  
  // Gestionnaire de déplacement optimisé
  const handleObjetDrag = useCallback((objet, newPosition) => {
    if (onObjetPositionChange) {
      onObjetPositionChange(objet, newPosition);
    }
  }, [onObjetPositionChange]);
  
  // Forcer la mise à jour
  useEffect(() => {
    if (planData) {
      setForceUpdate(prev => prev + 1);
    }
  }, [planData]);
  
  // Nettoyer le cache à la fin
  useEffect(() => {
    return () => {
      geometryCache.clear();
    };
  }, []);
  
  if (!data3D) {
    return <div className="loading-3d">🌳 Chargement 3D...</div>;
  }
  
  return (
    <Canvas
      shadows
      camera={{ position: [15, 15, 15], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
    >
      <PerspectiveCamera makeDefault position={[15, 15, 15]} />
      <OrbitControls 
        ref={orbitControlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
      />
      
      {/* Éclairage optimisé */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Ciel */}
      <Sky
        distance={450000}
        sunPosition={[0, 1, 0]}
        inclination={0}
        azimuth={0.25}
      />
      
      {/* Sol */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#90EE90" transparent={solTransparent} opacity={0.3} />
      </mesh>
      
      {/* Maisons optimisées */}
      {data3D.maisons?.map((maison, idx) => (
        <OptimizedMaison3D
          key={`maison-${idx}`}
          {...maison}
          onClick={() => handleObjetClick({ type: 'maison', ...maison, index: idx })}
        />
      ))}
      
      {/* Arbres optimisés */}
      {data3D.arbres?.map((arbre, idx) => (
        <OptimizedArbre3D
          key={`arbre-${idx}`}
          {...arbre}
          onClick={() => handleObjetClick({ type: 'arbre', ...arbre, index: idx })}
        />
      ))}
      
    </Canvas>
  );
}

// Fonction utilitaire pour parser la hauteur
function parseHauteur(tailleMaturite) {
  if (!tailleMaturite) return 6;
  
  const match = tailleMaturite.match(/(\d+(?:\.\d+)?)\s*m/);
  if (match) {
    return parseFloat(match[1]);
  }
  
  return 6;
}

export default OptimizedCanvasTerrain3D;
