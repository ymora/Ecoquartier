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
    
    // ⭐ CORRECTION : Mapper directement les vertices sur les nœuds du maillage
    // PlaneGeometry crée (segmentsX+1) × (segmentsZ+1) vertices
    // Cela correspond exactement à nbNoeudsX × nbNoeudsZ
    
    console.log('🔍 Avant modification vertices:', {
      premierVertex: [vertices[0], vertices[1], vertices[2]],
      dernierVertex: [vertices[vertices.length-3], vertices[vertices.length-2], vertices[vertices.length-1]]
    });
    
    for (let i = 0; i <= segmentsZ; i++) {
      for (let j = 0; j <= segmentsX; j++) {
        const index = (i * (segmentsX + 1) + j) * 3;
        
        // ✅ Correspondance directe : vertex[i,j] = nœud[i,j]
        const elevation = maillageElevation[i][j] || 0;
        
        // ⚠️ IMPORTANT : PlaneGeometry avec rotation [-PI/2, 0, 0]
        // Les coordonnées sont : [x, y, z] dans le buffer
        // Après rotation : x reste x, y devient z (profondeur), z devient y (hauteur)
        // Donc on doit modifier l'index + 2 (qui est Z avant rotation, devient Y après)
        vertices[index + 2] = elevation;
        
        if (elevation !== 0) {
          console.log(`Vertex [${i},${j}] index=${index} elevation=${elevation}m`);
        }
      }
    }
    
    console.log('✅ Sol3D: Vertices déformés', {
      nbVertices: (segmentsX + 1) * (segmentsZ + 1),
      nbNoeuds: nbNoeudsX * nbNoeudsZ,
      elevations: maillageElevation.flat().filter(e => e !== 0).length + ' non-nulles',
      premierVertexModifie: [vertices[0], vertices[1], vertices[2]]
    });
    
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals(); // Recalculer les normales pour l'éclairage
    
    return geometry;
  }, [maillageElevation, tailleMailleM, largeur, hauteur, JSON.stringify(maillageElevation)]);
  
  // ✅ Afficher les nœuds en 3D si maillage disponible
  const noeuds3D = useMemo(() => {
    if (!maillageElevation || maillageElevation.length === 0) return [];
    
    const nbNoeudsZ = maillageElevation.length;
    const nbNoeudsX = maillageElevation[0]?.length || 0;
    const nodes = [];
    
    const largeurMaillage = (nbNoeudsX - 1) * tailleMailleM;
    const hauteurMaillage = (nbNoeudsZ - 1) * tailleMailleM;
    const offsetXMaillage = (largeur - largeurMaillage) / 2;
    const offsetZMaillage = (hauteur - hauteurMaillage) / 2;
    
    for (let i = 0; i < nbNoeudsZ; i++) {
      for (let j = 0; j < nbNoeudsX; j++) {
        const elevation = maillageElevation[i][j];
        
        // Position du nœud (centré sur le terrain)
        const x = -largeur / 2 + offsetXMaillage + j * tailleMailleM;
        const z = -hauteur / 2 + offsetZMaillage + i * tailleMailleM;
        
        nodes.push({
          position: [x, elevation, z],
          elevation,
          i,
          j
        });
      }
    }
    
    return nodes;
  }, [maillageElevation, tailleMailleM, largeur, hauteur]);
  
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
      
      {/* ✅ Nœuds d'élévation visibles en 3D */}
      {noeuds3D.map((noeud, idx) => (
        <mesh 
          key={idx}
          position={noeud.position}
        >
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial 
            color={noeud.elevation === 0 ? '#2196f3' : (noeud.elevation > 0 ? '#4caf50' : '#f44336')}
            emissive={noeud.elevation === 0 ? '#1565c0' : (noeud.elevation > 0 ? '#2e7d32' : '#c62828')}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
      
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

