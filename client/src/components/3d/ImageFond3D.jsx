import { useMemo } from 'react';
import * as THREE from 'three';
import { TextureLoader } from 'three';

/**
 * Composant pour afficher l'image de fond chargée en 2D dans la vue 3D
 * @param {string} imageUrl - URL de l'image à afficher
 * @param {number} largeur - Largeur du terrain en mètres
 * @param {number} hauteur - Hauteur du terrain en mètres
 * @param {number} offsetX - Offset X du terrain
 * @param {number} offsetZ - Offset Z du terrain
 * @param {number} opacite - Opacité de l'image (0-1)
 */
function ImageFond3D({ 
  imageUrl, 
  largeur = 30, 
  hauteur = 30,
  offsetX = 0,
  offsetZ = 0,
  opacite = 0.8
}) {
  // Charger la texture de l'image
  const texture = useMemo(() => {
    if (!imageUrl) return null;
    try {
      const loader = new TextureLoader();
      return loader.load(imageUrl, 
        (tex) => {
          // Calculer le ratio pour conserver les proportions
          const imageAspect = tex.image.width / tex.image.height;
          const terrainAspect = largeur / hauteur;
          
          // Ajuster les dimensions pour couvrir tout le terrain
          if (imageAspect > terrainAspect) {
            // Image plus large, ajuster la hauteur
            tex.repeat.set(1, terrainAspect / imageAspect);
          } else {
            // Image plus haute, ajuster la largeur
            tex.repeat.set(imageAspect / terrainAspect, 1);
          }
          
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.RepeatWrapping;
        },
        undefined,
        (error) => {
          console.error('❌ Erreur chargement texture ImageFond3D:', error);
        }
      );
    } catch (error) {
      console.error('❌ Erreur création texture ImageFond3D:', error);
      return null;
    }
  }, [imageUrl, largeur, hauteur]);
  
  if (!texture) return null;
  
  // Positionner l'image au centre du terrain, légèrement au-dessus du sol (pour être visible)
  const centreX = offsetX + largeur / 2;
  const centreZ = offsetZ + hauteur / 2;
  
  return (
    <mesh
      position={[centreX, 0.05, centreZ]} // Légèrement au-dessus du sol (5cm)
      rotation={[-Math.PI / 2, 0, 0]} // Rotation pour être à plat
      receiveShadow
    >
      <planeGeometry args={[largeur, hauteur]} />
      <meshBasicMaterial 
        map={texture} 
        transparent 
        opacity={opacite}
        depthWrite={false}
      />
    </mesh>
  );
}

export default ImageFond3D;

