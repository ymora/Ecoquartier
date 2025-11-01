import { memo, useCallback, useMemo } from 'react';
import * as THREE from 'three';

function Sol3D({ 
  largeur = 30, 
  hauteur = 30,
  offsetX = 0,
  offsetZ = 0,
  transparent = false,
  couchesSol = [
    { nom: 'Terre végétale', profondeur: 30, couleur: '#8d6e63' },
    { nom: 'Marne calcaire', profondeur: 70, couleur: '#bdbdbd' },
    { nom: 'Sous-sol', profondeur: 200, couleur: '#a1887f' }
  ],
  maillageElevation = null, // ✅ Maillage pour terrain non uniforme
  tailleMailleM = 5, // ✅ Taille des cellules du maillage
  onTerrainClick
}) {
  // Icônes par couche
  const icones = ['🌱', '🪨', '⛰️'];
  
  // Gestionnaire de clic sur le terrain
  const handleTerrainClick = useCallback((event) => {
    event.stopPropagation();
    if (onTerrainClick) {
      onTerrainClick({
        customType: 'sol',
        name: 'Terrain',
        position: [offsetX, 0, offsetZ],
        largeur,
        hauteur,
        couchesSol
      });
    }
  }, [onTerrainClick, offsetX, offsetZ, largeur, hauteur, couchesSol]);
  
  // Calculer les profondeurs cumulées
  let profondeurCumulee = 0;
  const couches = couchesSol.map((couche) => {
    const profondeurM = couche.profondeur / 100;
    const position = profondeurCumulee + profondeurM / 2;
    profondeurCumulee += profondeurM;
    
    return {
      ...couche,
      profondeurM,
      positionY: -position,
      profondeurCumuleeAvant: profondeurCumulee - profondeurM
    };
  });
  
  // Centre du terrain adaptatif
  const centreX = offsetX + largeur / 2;
  const centreZ = offsetZ + hauteur / 2;
  
  // ✅ Créer une géométrie déformée si maillage d'élévation disponible
  const geometrieSurface = useMemo(() => {
    if (!maillageElevation || maillageElevation.length === 0) {
      // Terrain plat classique
      console.warn('⚠️ Sol3D: Pas de maillage d\'élévation, terrain plat par défaut');
      return new THREE.PlaneGeometry(largeur, hauteur);
    }
    
    // ✅ Terrain déformé selon le maillage de NŒUDS
    // Le maillage contient les élévations des nœuds (intersections)
    const nbNoeudsZ = maillageElevation.length;
    const nbNoeudsX = maillageElevation[0]?.length || 0;
    
    console.log('🌍 Sol3D: Création terrain déformé', {
      nbNoeudsX,
      nbNoeudsZ,
      tailleMailleM,
      elevationsMax: Math.max(...maillageElevation.flat()),
      elevationsMin: Math.min(...maillageElevation.flat())
    });
    
    // Créer une grille de vertices (segments = cellules)
    const nbCellulesX = nbNoeudsX - 1;
    const nbCellulesZ = nbNoeudsZ - 1;
    const segmentsX = nbCellulesX;
    const segmentsZ = nbCellulesZ;
    
    const geometry = new THREE.PlaneGeometry(largeur, hauteur, segmentsX, segmentsZ);
    
    // Modifier les vertices selon le maillage d'élévation
    const vertices = geometry.attributes.position.array;
    
    // Calculer la largeur/hauteur réelles du maillage
    const largeurMaillage = nbCellulesX * tailleMailleM;
    const hauteurMaillage = nbCellulesZ * tailleMailleM;
    
    // Offset pour centrer le maillage
    const offsetXMaillage = (largeur - largeurMaillage) / 2;
    const offsetZMaillage = (hauteur - hauteurMaillage) / 2;
    
    // ⭐ MEILLEURE PRATIQUE : Utiliser directement les élévations des NŒUDS
    // Chaque vertex correspond à un nœud du maillage
    for (let i = 0; i <= segmentsZ; i++) {
      for (let j = 0; j <= segmentsX; j++) {
        const index = (i * (segmentsX + 1) + j) * 3;
        
        // Position du vertex dans le plan local
        const vx = vertices[index];     // x
        const vz = vertices[index + 1]; // y (devient z après rotation)
        
        // Convertir en coordonnées du maillage (origine coin supérieur gauche du maillage)
        const localX = vx + largeur / 2 - offsetXMaillage;
        const localZ = vz + hauteur / 2 - offsetZMaillage;
        
        // Trouver le nœud correspondant
        const noeudI = Math.round(localZ / tailleMailleM);
        const noeudJ = Math.round(localX / tailleMailleM);
        
        // Obtenir l'élévation du nœud (avec limites de sécurité)
        let elevation = 0;
        if (noeudI >= 0 && noeudI < nbNoeudsZ && noeudJ >= 0 && noeudJ < nbNoeudsX) {
          elevation = maillageElevation[noeudI][noeudJ];
        }
        
        // Modifier la coordonnée Z (hauteur)
        vertices[index + 2] = elevation;
      }
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals(); // Recalculer les normales pour l'éclairage
    
    console.log('✅ Sol3D: Géométrie déformée créée avec', vertices.length / 3, 'vertices');
    
    return geometry;
  }, [maillageElevation, tailleMailleM, largeur, hauteur, JSON.stringify(maillageElevation)]);
  
  return (
    <group position={[centreX, 0, centreZ]}>
      {/* SOL SURFACE (herbe verte) - Déformé selon maillage */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.07, 0]} 
        receiveShadow
        geometry={geometrieSurface}
        onClick={handleTerrainClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'auto';
        }}
      >
        <meshStandardMaterial 
          color="#8bc34a"
          roughness={0.9}
          transparent={transparent}
          opacity={transparent ? 0.3 : 1.0}
        />
      </mesh>
      
      {/* COUCHES DE SOL (dynamique) */}
      {couches.map((couche, index) => (
        <group key={index}>
          {/* Couche de sol - ✅ Transparence augmentée pour voir les racines */}
          <mesh 
            position={[0, couche.positionY, 0]}
            raycast={() => null} // ✅ Désactiver l'interaction pour permettre clic sur objets en dessous
          >
            <boxGeometry args={[largeur, couche.profondeurM, hauteur]} />
            <meshStandardMaterial 
              color={couche.couleur}
              transparent 
              opacity={transparent ? 0.25 - index * 0.05 : 0.85 - index * 0.1}
              roughness={0.95}
              metalness={index * 0.05}
              depthWrite={!transparent}
              side={2}
            />
          </mesh>
          
          {/* Bordure visible entre les couches (sauf pour la dernière) - Masquée si transparent */}
          {!transparent && index < couches.length - 1 && (
            <>
              <mesh 
                position={[0, -(couche.profondeurCumuleeAvant + couche.profondeurM), 0]} 
                rotation={[-Math.PI / 2, 0, 0]}
                raycast={() => null}
              >
                <planeGeometry args={[largeur, hauteur]} />
                <meshBasicMaterial 
                  color="#4a3728"
                  opacity={0.9}
                  transparent
                />
              </mesh>
              
              {/* Lignes orange de séparation */}
              <mesh 
                position={[0, -(couche.profondeurCumuleeAvant + couche.profondeurM), largeur / 2]} 
                rotation={[0, 0, 0]}
                raycast={() => null}
              >
                <boxGeometry args={[largeur, 0.05, 0.1]} />
                <meshBasicMaterial color="#ff9800" />
              </mesh>
              <mesh 
                position={[0, -(couche.profondeurCumuleeAvant + couche.profondeurM), -largeur / 2]} 
                rotation={[0, 0, 0]}
                raycast={() => null}
              >
                <boxGeometry args={[largeur, 0.05, 0.1]} />
                <meshBasicMaterial color="#ff9800" />
              </mesh>
            </>
          )}
        </group>
      ))}
      
      {/* Label supprimé - vestige qui créait un rectangle blanc */}
      
      {/* Ligne de référence niveau 0 (sous l'herbe) - Masquée si transparent */}
      {!transparent && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[largeur + 2, 0.01, hauteur + 2]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.2} />
        </mesh>
      )}
    </group>
  );
}

// Optimisation : Éviter re-renders du sol 3D
export default memo(Sol3D);

