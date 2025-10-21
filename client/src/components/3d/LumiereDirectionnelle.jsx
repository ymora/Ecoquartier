import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * Lumière directionnelle dynamique selon la saison et l'angle fluide
 * Génère des ombres réalistes basées sur la position astronomique du soleil
 * 
 * Latitude Bessancourt : 49°N
 * Orientation : Nord en haut (défaut)
 */
function LumiereDirectionnelle({ 
  saison = 'ete',
  angleJournee = 90, // Angle de 0° (matin) à 180° (soir)
  heureJournee = null, // DEPRECATED: gardé pour compatibilité
  orientation = 'nord-haut', // 'nord-haut', 'sud-haut', 'est-haut', 'ouest-haut'
  distance = 50,
  intensity = 1.2,
  shadowMapSize = 2048
}) {
  const lightRef = useRef();
  
  // Calcul de la position du soleil
  const sunPosition = useMemo(() => {
    // Angles solaires selon la saison (élévation à midi)
    const elevationAngles = {
      hiver: 18,      // 21 décembre - soleil très bas
      printemps: 41,  // 21 mars - soleil moyen
      automne: 41,    // 21 septembre - soleil moyen
      ete: 64         // 21 juin - soleil très haut
    };
    
    // Élévation maximale à midi selon la saison
    const elevationMax = elevationAngles[saison] || 41;
    
    // Convertir l'angle de la journée (0-180°) en azimut et élévation
    // angleJournee: 0° = lever (Est), 90° = midi (Sud), 180° = coucher (Ouest)
    
    // Azimut : -90° (Est) → 0° (Sud) → +90° (Ouest)
    const azimuth = (angleJournee - 90) * 1; // Linéaire de -90 à +90
    
    // Élévation : courbe parabolique (bas au lever/coucher, haut à midi)
    const angleNormalized = (angleJournee / 180) * Math.PI; // 0 à π
    const elevationFactor = Math.sin(angleNormalized); // 0 → 1 → 0
    
    // Élévation minimale (lever/coucher) = 5°, maximale (midi) = elevationMax
    const elevationMin = 5;
    const elevation = elevationMin + (elevationMax - elevationMin) * elevationFactor;
    
    // Ajustement selon l'orientation du terrain
    const orientationOffsets = {
      'nord-haut': 0,
      'sud-haut': 180,
      'est-haut': -90,
      'ouest-haut': 90
    };
    
    const azimuthAjuste = azimuth + (orientationOffsets[orientation] || 0);
    
    // Conversion en radians
    const elevationRad = (elevation * Math.PI) / 180;
    const azimuthRad = (azimuthAjuste * Math.PI) / 180;
    
    // Calcul de la position 3D
    // Système de coordonnées Three.js : +Y = Haut, +Z = Sud, +X = Est
    const x = distance * Math.cos(elevationRad) * Math.sin(azimuthRad);
    const y = distance * Math.sin(elevationRad);
    const z = distance * Math.cos(elevationRad) * Math.cos(azimuthRad);
    
    return {
      position: [x, y, z],
      elevation: elevation,
      azimuth: azimuthAjuste
    };
  }, [saison, angleJournee, orientation, distance]);
  
  // Intensité lumineuse selon la saison et l'heure
  const lightIntensity = useMemo(() => {
    let baseIntensity = intensity;
    
    // Réduction en hiver (jours courts, lumière faible)
    if (saison === 'hiver') {
      baseIntensity *= 0.8;
    }
    
    // Réduction basée sur l'élévation du soleil (plus bas = moins d'intensité)
    const angleNormalized = (angleJournee / 180) * Math.PI;
    const elevationFactor = Math.sin(angleNormalized); // 0 → 1 → 0
    const intensityMultiplier = 0.6 + 0.4 * elevationFactor; // 0.6 à 1.0
    baseIntensity *= intensityMultiplier;
    
    return baseIntensity;
  }, [saison, angleJournee, intensity]);
  
  // Couleur de la lumière selon l'angle (température de couleur)
  const lightColor = useMemo(() => {
    // Transition fluide de orange (lever/coucher) à blanc (midi)
    if (angleJournee < 30) return '#FFD4A3'; // Orange chaud lever
    if (angleJournee < 60) return '#FFF5E6'; // Blanc chaud matin
    if (angleJournee < 120) return '#FFFFFF'; // Blanc neutre milieu journée
    if (angleJournee < 150) return '#FFE4B5'; // Blanc orangé soir
    return '#FF9A56'; // Orange rougeâtre coucher
  }, [angleJournee]);
  
  return (
    <directionalLight
      ref={lightRef}
      position={sunPosition.position}
      intensity={lightIntensity}
      color={lightColor}
      castShadow
      shadow-mapSize={[shadowMapSize, shadowMapSize]}
      shadow-camera-left={-30}
      shadow-camera-right={30}
      shadow-camera-top={30}
      shadow-camera-bottom={-30}
      shadow-camera-near={0.5}
      shadow-camera-far={distance * 2}
      shadow-bias={-0.0001}
    />
  );
}

export default LumiereDirectionnelle;

