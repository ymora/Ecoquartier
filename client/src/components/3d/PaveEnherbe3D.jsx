import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Pavé enherbé simplifié
 * - Pavés béton gris 15cm × 15cm × 5cm espacés
 * - L'herbe du terrain est visible entre les pavés
 */
function PaveEnherbe3D({ 
  position = [0, 0, 0], 
  largeur = 2, 
  profondeur = 2,
  onClick = null
}) {
  
  // Configuration des pavés
  const TAILLE_PAVE = 0.15; // 15 cm
  const EPAISSEUR_PAVE = 0.08; // 8 cm
  const ESPACEMENT = 0.04; // 4 cm entre les pavés
  const HAUTEUR_HERBE = 0.05; // 5 cm de hauteur d'herbe
  
  // Calculer le nombre de pavés selon les dimensions
  const nbPavesX = Math.floor(largeur / (TAILLE_PAVE + ESPACEMENT));
  const nbPavesZ = Math.floor(profondeur / (TAILLE_PAVE + ESPACEMENT));
  
  // Générer les positions des pavés
  const paves = useMemo(() => {
    const positions = [];
    const offsetX = -largeur / 2;
    const offsetZ = -profondeur / 2;
    
    for (let x = 0; x < nbPavesX; x++) {
      for (let z = 0; z < nbPavesZ; z++) {
        const posX = offsetX + x * (TAILLE_PAVE + ESPACEMENT) + TAILLE_PAVE / 2;
        const posZ = offsetZ + z * (TAILLE_PAVE + ESPACEMENT) + TAILLE_PAVE / 2;
        // Pavés posés SUR l'herbe (5 cm) + demi-épaisseur du pavé (4 cm)
        positions.push([posX, HAUTEUR_HERBE + EPAISSEUR_PAVE / 2, posZ]);
      }
    }
    
    return positions;
  }, [largeur, profondeur, nbPavesX, nbPavesZ]);
  
  // ✅ Texture d'herbe procédurale
  const textureHerbe = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Fond vert herbe
    ctx.fillStyle = '#66bb6a';
    ctx.fillRect(0, 0, 256, 256);
    
    // Ajouter des variations (brins d'herbe stylisés)
    for (let i = 0; i < 800; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const shade = Math.floor(Math.random() * 30) - 15;
      ctx.fillStyle = `rgb(${102 + shade}, ${187 + shade}, ${106 + shade})`;
      ctx.fillRect(x, y, 1, 2);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(largeur * 5, profondeur * 5);
    
    return texture;
  }, [largeur, profondeur]);
  
  return (
    <group position={position} onClick={onClick}>
      {/* Plan d'herbe texturé à 5 cm de hauteur */}
      <mesh position={[0, HAUTEUR_HERBE / 2, 0]} receiveShadow>
        <boxGeometry args={[largeur, HAUTEUR_HERBE, profondeur]} />
        <meshStandardMaterial 
          map={textureHerbe}
          roughness={0.9}
          metalness={0}
        />
      </mesh>
      
      {/* Pavés béton 15cm × 15cm avec contour sombre */}
      {paves.map((pavePos, idx) => (
        <group key={`pave-${idx}`} position={pavePos}>
          {/* Pavé principal gris */}
        <mesh 
          castShadow
          receiveShadow
        >
          <boxGeometry args={[TAILLE_PAVE, EPAISSEUR_PAVE, TAILLE_PAVE]} />
          <meshStandardMaterial 
            color="#bdbdbd"
              roughness={0.7}
              metalness={0.2}
          />
        </mesh>
          
          {/* Contour sombre autour du pavé */}
          <mesh position={[0, EPAISSEUR_PAVE / 2, 0]}>
            <boxGeometry args={[TAILLE_PAVE + 0.002, 0.001, TAILLE_PAVE + 0.002]} />
          <meshStandardMaterial 
              color="#757575"
              roughness={0.9}
        />
      </mesh>
        </group>
      ))}
    </group>
  );
}

export default PaveEnherbe3D;
