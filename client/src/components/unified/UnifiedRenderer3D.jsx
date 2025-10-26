import { memo, useMemo, useCallback, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { useUnifiedPlan, usePerformanceMetrics } from '../../hooks/unified/useUnifiedPlan';
import UnifiedMaison3D from './UnifiedMaison3D';
import UnifiedArbre3D from './UnifiedArbre3D';

/**
 * Rendu 3D unifié et optimisé
 * Centralise toute la logique de rendu
 */

function UnifiedRenderer3D({ 
  planData, 
  anneeProjection = 0, 
  saison = 'ete',
  solTransparent = true,
  onObjectSelect,
  onObjectModify,
  onObjectDelete,
  className = '',
  style = {}
}) {
  
  const canvasRef = useRef();
  const { data3D, validationResults, selectedObject, handleObjectSelect, handleObjectModify, handleObjectDelete } = useUnifiedPlan(planData, {
    anneeProjection,
    saison,
    solTransparent
  });

  const performanceMetrics = usePerformanceMetrics();

  // Configuration de la caméra mémorisée
  const cameraConfig = useMemo(() => ({
    position: [15, 15, 15],
    fov: 50,
    near: 0.1,
    far: 1000
  }), []);

  // Configuration des lumières mémorisée
  const lightingConfig = useMemo(() => ({
    ambient: { intensity: 0.4 },
    directional: { 
      position: [10, 10, 5], 
      intensity: 1,
      castShadow: true,
      shadowMapSize: 2048
    }
  }), []);

  // Gestionnaire de sélection optimisé
  const handleClick = useCallback((event) => {
    if (event.object && event.object.userData) {
      handleObjectSelect(event.object.userData);
      if (onObjectSelect) onObjectSelect(event.object.userData);
    }
  }, [handleObjectSelect, onObjectSelect]);

  // Gestionnaire de modification optimisé
  const handleModify = useCallback((object, newProperties) => {
    handleObjectModify(object, newProperties);
    if (onObjectModify) onObjectModify(object, newProperties);
  }, [handleObjectModify, onObjectModify]);

  // Gestionnaire de suppression optimisé
  const handleDelete = useCallback((object) => {
    handleObjectDelete(object);
    if (onObjectDelete) onObjectDelete(object);
  }, [handleObjectDelete, onObjectDelete]);

  // Configuration des contrôles mémorisée
  const controlsConfig = useMemo(() => ({
    enablePan: true,
    enableZoom: true,
    enableRotate: true,
    minDistance: 5,
    maxDistance: 50,
    maxPolarAngle: Math.PI / 2
  }), []);

  // Configuration de l'environnement mémorisée
  const environmentConfig = useMemo(() => ({
    preset: 'sunset',
    background: false,
    intensity: 0.5
  }), []);

  // Configuration des ombres mémorisée
  const shadowConfig = useMemo(() => ({
    position: [0, -0.1, 0],
    opacity: 0.25,
    width: 20,
    height: 20,
    blur: 1,
    far: 50
  }), []);

  // Rendu des maisons mémorisé
  const renderedMaisons = useMemo(() => {
    if (!data3D?.maisons?.length) return null;

    return data3D.maisons.map((maison, index) => (
      <UnifiedMaison3D
        key={`maison-${index}`}
        position={maison.position}
        largeur={maison.largeur}
        profondeur={maison.profondeur}
        hauteur={maison.hauteur}
        profondeurFondations={maison.profondeurFondations}
        angle={maison.angle}
        typeToit={maison.typeToit}
        penteToit={maison.penteToit}
        orientationToit={maison.orientationToit}
        onClick={handleClick}
        lod={performanceMetrics.isLowEndDevice ? 'low' : 'high'}
        userData={{ type: 'maison', index, ...maison }}
      />
    ));
  }, [data3D?.maisons, handleClick, performanceMetrics.isLowEndDevice]);

  // Rendu des arbres mémorisé
  const renderedArbres = useMemo(() => {
    if (!data3D?.arbres?.length) return null;

    return data3D.arbres.map((arbre, index) => (
      <UnifiedArbre3D
        key={`arbre-${index}`}
        position={arbre.position}
        arbreData={arbre.arbreData}
        hauteur={arbre.hauteur}
        envergure={arbre.envergure}
        profondeurRacines={arbre.profondeurRacines}
        anneeProjection={arbre.anneeProjection}
        saison={saison}
        elevationSol={arbre.elevationSol}
        validationStatus={validationResults[`arbre-${index}`]?.status || 'ok'}
        onClick={handleClick}
        lod={performanceMetrics.isLowEndDevice ? 'low' : 'high'}
        userData={{ type: 'arbre', index, ...arbre }}
      />
    ));
  }, [data3D?.arbres, saison, validationResults, handleClick, performanceMetrics.isLowEndDevice]);

  // Rendu des citernes mémorisé
  const renderedCiternes = useMemo(() => {
    if (!data3D?.citernes?.length) return null;

    return data3D.citernes.map((citerne, index) => (
      <mesh
        key={`citerne-${index}`}
        position={citerne.position}
        onClick={handleClick}
        userData={{ type: 'citerne', index, ...citerne }}
      >
        <cylinderGeometry args={[citerne.diametre / 2, citerne.diametre / 2, citerne.profondeur, 16]} />
        <meshStandardMaterial 
          color="#4a90e2" 
          transparent 
          opacity={0.7}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
    ));
  }, [data3D?.citernes, handleClick]);

  // Rendu du sol mémorisé
  const renderedSol = useMemo(() => {
    if (!data3D) return null;

    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color="#90EE90" 
          transparent={solTransparent}
          opacity={solTransparent ? 0.3 : 1}
          roughness={0.8}
        />
      </mesh>
    );
  }, [data3D, solTransparent]);

  // Rendu des grilles mémorisé
  const renderedGrilles = useMemo(() => {
    if (!data3D) return null;

    return (
      <group>
        {/* Grille principale */}
        <gridHelper args={[50, 50, '#888888', '#888888']} />
        
        {/* Grille secondaire */}
        <gridHelper args={[10, 10, '#cccccc', '#cccccc']} />
      </group>
    );
  }, [data3D]);

  // Rendu des axes mémorisé
  const renderedAxes = useMemo(() => {
    return <axesHelper args={[5]} />;
  }, []);

  // Effet de mise à jour des performances
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.style.willChange = performanceMetrics.isLowEndDevice ? 'auto' : 'transform';
    }
  }, [performanceMetrics.isLowEndDevice]);

  if (!data3D) {
    return (
      <div className={`unified-renderer-3d ${className}`} style={style}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          color: '#666'
        }}>
          Chargement du plan 3D...
        </div>
      </div>
    );
  }

  return (
    <div className={`unified-renderer-3d ${className}`} style={style}>
      <Canvas
        ref={canvasRef}
        camera={cameraConfig}
        shadows
        gl={{ 
          antialias: !performanceMetrics.isLowEndDevice,
          alpha: true,
          powerPreference: performanceMetrics.isLowEndDevice ? 'low-power' : 'high-performance'
        }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = 2; // PCFSoftShadowMap
        }}
      >
        {/* LUMIÈRES */}
        <ambientLight intensity={lightingConfig.ambient.intensity} />
        <directionalLight
          position={lightingConfig.directional.position}
          intensity={lightingConfig.directional.intensity}
          castShadow={lightingConfig.directional.castShadow}
          shadowMapSize={lightingConfig.directional.shadowMapSize}
        />

        {/* ENVIRONNEMENT */}
        <Environment {...environmentConfig} />

        {/* OMBRES */}
        <ContactShadows {...shadowConfig} />

        {/* CONTRÔLES */}
        <OrbitControls {...controlsConfig} />

        {/* OBJETS 3D */}
        {renderedSol}
        {renderedGrilles}
        {renderedAxes}
        {renderedMaisons}
        {renderedArbres}
        {renderedCiternes}
      </Canvas>
    </div>
  );
}

export default memo(UnifiedRenderer3D);
