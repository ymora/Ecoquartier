import { useRef, useMemo, memo, useCallback } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import HaloPulsant from './HaloPulsant';

/**
 * Composant Arbre 3D Optimisé
 * Version consolidée avec toutes les fonctionnalités
 */
function Arbre3D({ 
  position = [0, 0, 0], 
  arbreData, 
  hauteur = 6, 
  envergure = 4, 
  profondeurRacines = 1.5,
  validationStatus = 'ok',
  anneeProjection = 0,
  saison = 'ete',
  elevationSol = 0,
  onClick
}) {
  const groupRef = useRef();
  
  // Calculs optimisés avec useMemo
  const arbreCalculs = useMemo(() => {
    const hauteurPlantation = 2;
    const envergurePlantation = 0.8;
    const profondeurRacinesPlantation = 0.3;
    
    const progression = Math.min(anneeProjection / 20, 1);
    
    const hauteurActuelle = hauteurPlantation + (hauteur - hauteurPlantation) * progression;
    const envergureActuelle = envergurePlantation + (envergure - envergurePlantation) * progression;
    const profondeurRacinesActuelle = profondeurRacinesPlantation + (profondeurRacines - profondeurRacinesPlantation) * progression;
    
    const rayonTronc = Math.min(0.3, hauteurActuelle * 0.04);
    const rayonTroncBase = rayonTronc * 1.3;
    
    return {
      hauteurActuelle,
      envergureActuelle,
      profondeurRacinesActuelle,
      rayonTronc,
      rayonTroncBase,
      progression
    };
  }, [hauteur, envergure, profondeurRacines, anneeProjection]);

  // Position ajustée avec élévation du sol
  const positionAjustee = useMemo(() => [
    position[0], 
    position[1] + elevationSol,
    position[2]
  ], [position, elevationSol]);

  // Configuration saisonnière optimisée
  const configSaison = useMemo(() => {
    const calendrier = arbreData?.calendrierAnnuel || [];
    const isCaduc = arbreData?.feuillage?.type === 'Caduc';
    
    const getCouleurDepuisTexte = (texte) => {
      const couleurs = {
        'blanc': '#ffffff', 'blanche': '#ffffff',
        'rose': '#ff69b4', 'rosé': '#ff69b4',
        'rouge': '#dc143c',
        'jaune': '#ffd700',
        'violet': '#8a2be2', 'violette': '#8a2be2',
        'bleu': '#4169e1', 'bleue': '#4169e1'
      };
      
      for (const [mot, couleur] of Object.entries(couleurs)) {
        if (texte?.toLowerCase().includes(mot)) return couleur;
      }
      return '#ff69b4'; // Rose par défaut
    };

    switch (saison) {
      case 'hiver':
        return {
          feuillage: isCaduc ? null : '#1b5e20',
          typeRendu: isCaduc ? 'branches-nues' : 'feuillage',
          densite: isCaduc ? 0 : 0.3,
          bourgeons: isCaduc,
          nombreBourgeons: 20
        };
      
      case 'printemps': {
        const moisPrintemps = calendrier.find(c => 
          c.mois?.toLowerCase().includes('mars') ||
          c.mois?.toLowerCase().includes('avril') ||
          c.mois?.toLowerCase().includes('mai')
        );
        
        if (moisPrintemps?.action?.toLowerCase().includes('floraison') && arbreData?.floraison) {
          const couleurFleur = getCouleurDepuisTexte(arbreData.floraison.couleur);
          const description = arbreData.floraison.description?.toLowerCase() || '';
          
          let nombreFleurs = 100;
          if (description.includes('spectaculaire') || description.includes('abondant')) {
            nombreFleurs = 300;
          } else if (description.includes('modéré')) {
            nombreFleurs = 80;
          }
          
          let tailleFleur = 0.15;
          if (description.includes('double') || description.includes('pompon')) {
            tailleFleur = 0.25;
          } else if (description.includes('petit')) {
            tailleFleur = 0.08;
          }
          
          return {
            feuillage: '#4caf50',
            typeRendu: 'floraison',
            densite: 0.8,
            couleurFleur,
            nombreFleurs,
            tailleFleur
          };
        }
        
        return {
          feuillage: '#4caf50',
          typeRendu: 'feuillage',
          densite: 0.6,
          bourgeons: true,
          nombreBourgeons: 50
        };
      }
      
      case 'ete':
        return {
          feuillage: '#2e7d32',
          typeRendu: 'feuillage',
          densite: 1.0,
          fruits: arbreData?.fruits ? {
            couleur: getCouleurDepuisTexte(arbreData.fruits.couleur),
            nombre: 30,
            taille: 0.1
          } : null
        };
      
      case 'automne':
        return {
          feuillage: '#ff6f00',
          typeRendu: 'feuillage',
          densite: 0.7,
          couleursAutomne: ['#ff6f00', '#ff8f00', '#ffa000', '#ffb300']
        };
      
      default:
        return {
          feuillage: '#2e7d32',
          typeRendu: 'feuillage',
          densite: 0.8
        };
    }
  }, [saison, arbreData]);

  // Matériaux optimisés
  const materials = useMemo(() => ({
    tronc: new THREE.MeshStandardMaterial({
      color: '#8d6e63',
      roughness: 0.9,
      metalness: 0.1
    }),
    feuillage: new THREE.MeshStandardMaterial({
      color: configSaison.feuillage,
      transparent: true,
      opacity: 0.8
    }),
    racines: new THREE.MeshStandardMaterial({
      color: '#5d4037',
      roughness: 0.95
    }),
    fleurs: configSaison.couleurFleur ? new THREE.MeshStandardMaterial({
      color: configSaison.couleurFleur,
      transparent: true,
      opacity: 0.9
    }) : null,
    fruits: configSaison.fruits ? new THREE.MeshStandardMaterial({
      color: configSaison.fruits.couleur,
      roughness: 0.3
    }) : null
  }), [configSaison]);

  // Géométries optimisées
  const geometries = useMemo(() => ({
    tronc: new THREE.CylinderGeometry(
      arbreCalculs.rayonTronc, 
      arbreCalculs.rayonTroncBase, 
      arbreCalculs.hauteurActuelle * 0.7, 
      8
    ),
    couronne: new THREE.SphereGeometry(
      arbreCalculs.envergureActuelle / 2, 
      12, 
      8
    ),
    racines: new THREE.ConeGeometry(
      arbreCalculs.rayonTroncBase * 2, 
      arbreCalculs.profondeurRacinesActuelle, 
      6
    )
  }), [arbreCalculs]);

  // Gestionnaire de clic optimisé
  const handleClick = useCallback((event) => {
    event.stopPropagation();
    if (onClick) {
      onClick({
        type: 'arbre',
        position: positionAjustee,
        arbreData,
        validationStatus
      });
    }
  }, [onClick, positionAjustee, arbreData, validationStatus]);

  // Rendu des fleurs optimisé
  const renderFleurs = useCallback(() => {
    if (configSaison.typeRendu !== 'floraison' || !materials.fleurs) return null;
    
    const fleurs = [];
    const nombreFleurs = configSaison.nombreFleurs || 100;
    const tailleFleur = configSaison.tailleFleur || 0.15;
    
    for (let i = 0; i < nombreFleurs; i++) {
      const angle = (i / nombreFleurs) * Math.PI * 2;
      const rayon = (Math.random() * arbreCalculs.envergureActuelle) / 2;
      const hauteurFleur = Math.random() * arbreCalculs.hauteurActuelle * 0.6 + arbreCalculs.hauteurActuelle * 0.3;
      
      fleurs.push(
        <mesh
          key={i}
          position={[
            Math.cos(angle) * rayon,
            hauteurFleur,
            Math.sin(angle) * rayon
          ]}
        >
          <sphereGeometry args={[tailleFleur, 6, 4]} />
          <primitive object={materials.fleurs} />
        </mesh>
      );
    }
    
    return fleurs;
  }, [configSaison, materials.fleurs, arbreCalculs]);

  // Rendu des fruits optimisé
  const renderFruits = useCallback(() => {
    if (!configSaison.fruits || !materials.fruits) return null;
    
    const fruits = [];
    const nombreFruits = configSaison.fruits.nombre || 30;
    
    for (let i = 0; i < nombreFruits; i++) {
      const angle = (i / nombreFruits) * Math.PI * 2;
      const rayon = (Math.random() * arbreCalculs.envergureActuelle) / 2;
      const hauteurFruit = Math.random() * arbreCalculs.hauteurActuelle * 0.4 + arbreCalculs.hauteurActuelle * 0.4;
      
      fruits.push(
        <mesh
          key={i}
          position={[
            Math.cos(angle) * rayon,
            hauteurFruit,
            Math.sin(angle) * rayon
          ]}
        >
          <sphereGeometry args={[configSaison.fruits.taille, 6, 4]} />
          <primitive object={materials.fruits} />
        </mesh>
      );
    }
    
    return fruits;
  }, [configSaison, materials.fruits, arbreCalculs]);

  return (
    <group ref={groupRef} position={positionAjustee} onClick={handleClick}>
      {/* Racines */}
      <mesh position={[0, -arbreCalculs.profondeurRacinesActuelle / 2, 0]} castShadow>
        <primitive object={geometries.racines} />
        <primitive object={materials.racines} />
      </mesh>
      
      {/* Tronc */}
      <mesh position={[0, arbreCalculs.hauteurActuelle * 0.35, 0]} castShadow receiveShadow>
        <primitive object={geometries.tronc} />
        <primitive object={materials.tronc} />
      </mesh>
      
      {/* Couronne de feuillage */}
      {configSaison.typeRendu === 'feuillage' && (
        <mesh position={[0, arbreCalculs.hauteurActuelle * 0.7, 0]} castShadow>
          <primitive object={geometries.couronne} />
          <primitive object={materials.feuillage} />
        </mesh>
      )}
      
      {/* Fleurs */}
      {renderFleurs()}
      
      {/* Fruits */}
      {renderFruits()}
      
      {/* Halo de validation */}
      {validationStatus !== 'ok' && (
        <HaloPulsant 
          couleur={validationStatus === 'erreur' ? '#f44336' : '#ff9800'}
          taille={arbreCalculs.envergureActuelle * 1.2}
        />
      )}
      
      {/* Label avec informations */}
      <Html distanceFactor={10} position={[0, arbreCalculs.hauteurActuelle + 1, 0]}>
        <div style={{
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none'
        }}>
          {arbreData?.nom || 'Arbre'} - {Math.round(arbreCalculs.progression * 100)}% croissance
        </div>
      </Html>
    </group>
  );
}

export default memo(Arbre3D);