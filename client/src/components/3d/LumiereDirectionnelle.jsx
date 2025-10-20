import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * Lumière directionnelle dynamique selon la saison et l'heure
 * Génère des ombres réalistes basées sur la position astronomique du soleil
 * 
 * Latitude Bessancourt : 49°N
 * Orientation : Nord en haut (défaut)
 */
function LumiereDirectionnelle({ 
  saison = 'ete',
  heureJournee = 'midi', // 'lever', 'matin', 'midi', 'soir', 'coucher'
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
    
    // Azimut selon l'heure (angle horizontal, 0° = Sud)
    const azimuthAngles = {
      'lever': -90,    // Est (lever du soleil)
      'matin': -45,    // Sud-Est
      'midi': 0,       // Sud (midi solaire)
      'soir': 45,      // Sud-Ouest
      'coucher': 90    // Ouest (coucher du soleil)
    };
    
    // Élévation (hauteur du soleil)
    const elevationBase = elevationAngles[saison] || 41;
    
    // Ajuster l'élévation selon l'heure (plus bas matin/soir)
    let elevation = elevationBase;
    if (heureJournee === 'lever' || heureJournee === 'coucher') {
      elevation = elevation * 0.3; // 30% de la hauteur max au lever/coucher
    } else if (heureJournee === 'matin' || heureJournee === 'soir') {
      elevation = elevation * 0.7; // 70% de la hauteur max
    }
    
    // Azimut (rotation horizontale)
    const azimuth = azimuthAngles[heureJournee] || 0;
    
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
  }, [saison, heureJournee, orientation, distance]);
  
  // Intensité lumineuse selon la saison et l'heure
  const lightIntensity = useMemo(() => {
    let baseIntensity = intensity;
    
    // Réduction en hiver (jours courts, lumière faible)
    if (saison === 'hiver') {
      baseIntensity *= 0.8;
    }
    
    // Réduction au lever/coucher (lumière rasante)
    if (heureJournee === 'lever' || heureJournee === 'coucher') {
      baseIntensity *= 0.6;
    } else if (heureJournee === 'matin' || heureJournee === 'soir') {
      baseIntensity *= 0.85;
    }
    
    return baseIntensity;
  }, [saison, heureJournee, intensity]);
  
  // Couleur de la lumière selon l'heure (température de couleur)
  const lightColor = useMemo(() => {
    if (heureJournee === 'lever') return '#FFD4A3'; // Orange chaud lever
    if (heureJournee === 'coucher') return '#FF9A56'; // Orange rougeâtre coucher
    if (heureJournee === 'matin') return '#FFF5E6'; // Blanc chaud matin
    if (heureJournee === 'soir') return '#FFE4B5'; // Blanc orangé soir
    return '#FFFFFF'; // Blanc neutre midi
  }, [heureJournee]);
  
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

