import { useRef, useMemo, memo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Composant Arbre 3D Ultra-Réaliste
 * Qualité digne d'un jeu vidéo 2025
 * - Fleurs individuelles en instancing
 * - Feuilles individuelles
 * - Écorce texturée
 * - Variations de couleurs
 * - Effets saisonniers spectaculaires
 */
function Arbre3DAvance({ 
  position = [0, 0, 0], 
  arbreData, 
  hauteur = 6, 
  envergure = 4, 
  profondeurRacines = 1.5,
  validationStatus = 'ok',
  anneeProjection = 0,
  saison = 'ete',
  onClick
}) {
  const groupRef = useRef();
  
  // ========== CALCUL DES TAILLES SELON L'ÂGE ==========
  const hauteurPlantation = 2;
  const envergurePlantation = 0.8;
  const profondeurRacinesPlantation = 0.3;
  
  const progression = Math.min(anneeProjection / 20, 1);
  
  const hauteurActuelle = hauteurPlantation + (hauteur - hauteurPlantation) * progression;
  const envergureActuelle = envergurePlantation + (envergure - envergurePlantation) * progression;
  const profondeurRacinesActuelle = profondeurRacinesPlantation + (profondeurRacines - profondeurRacinesPlantation) * progression;
  
  const rayonTronc = Math.min(0.3, hauteurActuelle * 0.04);
  const rayonTroncBase = rayonTronc * 1.3;
  
  // ========== DÉTECTION SAISON ET COULEURS ==========
  
  const getInfosSaison = () => {
    const calendrier = arbreData?.calendrierAnnuel || [];
    const isCaduc = arbreData?.feuillage?.type === 'Caduc';
    
    switch (saison) {
      case 'hiver': {
        const moisHiver = calendrier.find(c => 
          c.mois?.toLowerCase().includes('janvier') ||
          c.mois?.toLowerCase().includes('février') ||
          c.mois?.toLowerCase().includes('décembre')
        );
        
        return {
          feuillage: isCaduc ? null : '#1b5e20',
          typeRendu: isCaduc ? 'branches-nues' : 'feuillage',
          densite: isCaduc ? 0 : 0.3,
          bourgeons: isCaduc,
          nombreBourgeons: 20
        };
      }
      
      case 'printemps': {
        const moisPrintemps = calendrier.find(c => 
          c.mois?.toLowerCase().includes('mars') ||
          c.mois?.toLowerCase().includes('avril') ||
          c.mois?.toLowerCase().includes('mai')
        );
        
        // Vérifier floraison
        if (moisPrintemps?.action?.toLowerCase().includes('floraison') && arbreData?.floraison) {
          const couleurFleur = getCouleurDepuisTexte(arbreData.floraison.couleur);
          const description = arbreData.floraison.description?.toLowerCase() || '';
          
          // Nombre de fleurs selon description
          let nombreFleurs = 100;
          if (description.includes('spectaculaire') || description.includes('abondant')) {
            nombreFleurs = 300; // Floraison massive
          } else if (description.includes('modéré')) {
            nombreFleurs = 80;
          }
          
          // Taille des fleurs selon type
          let tailleFleur = 0.15;
          if (description.includes('double') || description.includes('pompon')) {
            tailleFleur = 0.25; // Fleurs doubles plus grosses
          } else if (description.includes('petit')) {
            tailleFleur = 0.08;
          }
          
          return {
            feuillage: null,
            typeRendu: 'floraison',
            couleurFleurs: couleurFleur,
            nombreFleurs,
            tailleFleur,
            densite: 1.0,
            brillance: true // Fleurs brillent
          };
        }
        
        // Débourrement
        if (moisPrintemps?.action?.toLowerCase().includes('débourrement')) {
          const couleur = arbreData.feuillage?.description?.toLowerCase().includes('bronze') 
            ? '#cd7f32' 
            : '#a5d6a7';
          return {
            feuillage: couleur,
            typeRendu: 'jeunes-feuilles',
            densite: 0.5,
            tailleFeui lle: 0.8 // 80% de la taille normale
          };
        }
        
        return {
          feuillage: '#7cb342',
          typeRendu: 'feuillage',
          densite: 0.7
        };
      }
      
      case 'ete':
        return {
          feuillage: '#2e7d32',
          typeRendu: 'feuillage',
          densite: 1.0, // Densité maximale
          tailleFeui lle: 1.0
        };
      
      case 'automne': {
        const couleurAutomne = arbreData?.feuillage?.couleurAutomne 
          ? getCouleurDepuisTexte(arbreData.feuillage.couleurAutomne)
          : '#d84315';
        
        // Variations de couleurs pour réalisme
        const isSpectaculaire = arbreData?.feuillage?.couleurAutomne?.toLowerCase().includes('spectaculaire');
        
        return {
          feuillage: couleurAutomne,
          typeRendu: 'feuillage-automne',
          densite: 0.8,
          variations: isSpectaculaire ? 0.3 : 0.15, // Variation de couleur
          brillance: true // Couleurs automnales brillent au soleil
        };
      }
      
      default:
        return { feuillage: '#2e7d32', typeRendu: 'feuillage', densite: 0.8 };
    }
  };
  
  const getCouleurDepuisTexte = (texte) => {
    const txt = texte.toLowerCase();
    if (txt.includes('rose fuchsia') || txt.includes('fuchsia intense')) return '#e91e63';
    if (txt.includes('rose') && txt.includes('pâle')) return '#f8bbd0';
    if (txt.includes('rose')) return '#f06292';
    if (txt.includes('blanc pur')) return '#ffffff';
    if (txt.includes('blanc')) return '#f5f5f5';
    if (txt.includes('jaune') && txt.includes('lumineux')) return '#ffeb3b';
    if (txt.includes('jaune')) return '#ffd54f';
    if (txt.includes('doré')) return '#ffd700';
    if (txt.includes('orange') && txt.includes('vif')) return '#ff6f00';
    if (txt.includes('orange')) return '#ff9800';
    if (txt.includes('cuivré')) return '#d84315';
    if (txt.includes('bronze')) return '#cd7f32';
    if (txt.includes('rouge') && txt.includes('flamboyant')) return '#c62828';
    if (txt.includes('rouge') && txt.includes('sang')) return '#b71c1c';
    if (txt.includes('écarlate')) return '#f44336';
    if (txt.includes('rouge')) return '#e53935';
    if (txt.includes('pourpre') && txt.includes('intense')) return '#7b1fa2';
    if (txt.includes('pourpre')) return '#9c27b0';
    if (txt.includes('vert') && txt.includes('foncé')) return '#1b5e20';
    if (txt.includes('vert') && txt.includes('tendre')) return '#81c784';
    if (txt.includes('vert')) return '#4caf50';
    return '#2e7d32';
  };
  
  const infosSaison = getInfosSaison();
  const couleurValidation = validationStatus === 'error' ? '#f44336' : validationStatus === 'warning' ? '#ff9800' : '#2e7d32';
  
  // ========== CRÉATION DES FLEURS EN INSTANCING ==========
  
  const instancesFleurs = useMemo(() => {
    if (infosSaison.typeRendu !== 'floraison') return null;
    
    const count = infosSaison.nombreFleurs;
    const positions = [];
    const scales = [];
    const colors = [];
    
    // Générer positions aléatoires sur une sphère (couronne de l'arbre)
    const rayonCouronne = envergureActuelle / 2;
    const hauteurCouronne = hauteurActuelle + envergureActuelle * 0.3;
    
    for (let i = 0; i < count; i++) {
      // Distribution sphérique
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = rayonCouronne * Math.sin(phi) * Math.cos(theta);
      const y = hauteurCouronne + rayonCouronne * 0.3 * Math.cos(phi);
      const z = rayonCouronne * Math.sin(phi) * Math.sin(theta);
      
      positions.push(x, y, z);
      
      // Variation de taille
      const scale = infosSaison.tailleFleur * (0.8 + Math.random() * 0.4);
      scales.push(scale, scale, scale);
      
      // Variation de couleur (légère)
      const baseColor = new THREE.Color(infosSaison.couleurFleurs);
      const variation = 0.1;
      baseColor.r += (Math.random() - 0.5) * variation;
      baseColor.g += (Math.random() - 0.5) * variation;
      baseColor.b += (Math.random() - 0.5) * variation;
      
      colors.push(baseColor.r, baseColor.g, baseColor.b);
    }
    
    return { positions, scales, colors, count };
  }, [infosSaison, envergureActuelle, hauteurActuelle]);
  
  // ========== CRÉATION DES FEUILLES EN INSTANCING ==========
  
  const instancesFeuilles = useMemo(() => {
    if (infosSaison.typeRendu !== 'feuillage' && infosSaison.typeRendu !== 'feuillage-automne' && infosSaison.typeRendu !== 'jeunes-feuilles') {
      return null;
    }
    
    const count = Math.floor(200 * infosSaison.densite); // Nombre selon densité
    const positions = [];
    const rotations = [];
    const scales = [];
    const colors = [];
    
    const rayonCouronne = envergureActuelle / 2;
    const hauteurCouronne = hauteurActuelle + envergureActuelle * 0.3;
    
    for (let i = 0; i < count; i++) {
      // Distribution sphérique
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = rayonCouronne * Math.sin(phi) * Math.cos(theta);
      const y = hauteurCouronne + rayonCouronne * 0.4 * Math.cos(phi);
      const z = rayonCouronne * Math.sin(phi) * Math.sin(theta);
      
      positions.push(x, y, z);
      
      // Rotation aléatoire pour naturel
      rotations.push(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      // Taille variable
      const tailleFeuille = infosSaison.tailleFeuille || 1.0;
      const scale = 0.12 * tailleFeuille * (0.7 + Math.random() * 0.6);
      scales.push(scale, scale * 1.5, scale); // Feuilles oblongues
      
      // Variation de couleur (automne surtout)
      const baseColor = new THREE.Color(infosSaison.feuillage);
      const variation = infosSaison.variations || 0.05;
      baseColor.r += (Math.random() - 0.5) * variation;
      baseColor.g += (Math.random() - 0.5) * variation;
      baseColor.b += (Math.random() - 0.5) * variation;
      
      colors.push(baseColor.r, baseColor.g, baseColor.b);
    }
    
    return { positions, rotations, scales, colors, count };
  }, [infosSaison, envergureActuelle, hauteurActuelle]);
  
  // ========== TEXTURE ÉCORCE PROCÉDURALE ==========
  
  const textureEcorce = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Fond base écorce
    const gradient = ctx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, '#5d4037');
    gradient.addColorStop(0.5, '#6d4c41');
    gradient.addColorStop(1, '#4e342e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    
    // Fissures verticales (réalisme écorce)
    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 2;
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * 512;
      const offset = Math.random() * 40 - 20;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.bezierCurveTo(
        x + offset, 170,
        x - offset, 340,
        x, 512
      );
      ctx.stroke();
    }
    
    // Texture granuleuse
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const alpha = Math.random() * 0.3;
      ctx.fillStyle = `rgba(${Math.random() > 0.5 ? 30 : 90}, ${Math.random() > 0.5 ? 20 : 70}, ${Math.random() > 0.5 ? 10 : 50}, ${alpha})`;
      ctx.fillRect(x, y, 1, 1);
    }
    
    return new THREE.CanvasTexture(canvas);
  }, []);
  
  // ========== RENDU JSX 3D ==========
  
  return (
    <group ref={groupRef} position={position} onClick={onClick}>
      
      {/* TRONC avec texture écorce réaliste */}
      <mesh position={[0, hauteurActuelle / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[rayonTronc, rayonTroncBase, hauteurActuelle, 16]} />
        <meshStandardMaterial 
          map={textureEcorce}
          roughness={0.95}
          metalness={0}
          bumpScale={0.02}
        />
      </mesh>
      
      {/* BRANCHES PRINCIPALES (5-8 branches) */}
      {[...Array(Math.floor(5 + progression * 3))].map((_, i) => {
        const angle = (i / (5 + progression * 3)) * Math.PI * 2;
        const hauteurBranche = hauteurActuelle * (0.6 + Math.random() * 0.2);
        const longueurBranche = envergureActuelle * (0.25 + Math.random() * 0.15);
        const anglePente = -Math.PI / 6 - Math.random() * Math.PI / 12;
        
        const x = Math.cos(angle) * longueurBranche * 0.3;
        const z = Math.sin(angle) * longueurBranche * 0.3;
        
        return (
          <mesh 
            key={`branche-${i}`}
            position={[x, hauteurBranche, z]}
            rotation={[0, angle, anglePente]}
            castShadow
          >
            <cylinderGeometry args={[rayonTronc * 0.25, rayonTronc * 0.4, longueurBranche, 8]} />
            <meshStandardMaterial 
              map={textureEcorce}
              roughness={0.9}
              metalness={0}
            />
          </mesh>
        );
      })}
      
      {/* FLORAISON - Fleurs individuelles en instancing */}
      {infosSaison.typeRendu === 'floraison' && instancesFleurs && (
        <instancedMesh args={[null, null, instancesFleurs.count]} castShadow>
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial 
            color={infosSaison.couleurFleurs}
            roughness={0.3}
            metalness={0.1}
            emissive={infosSaison.couleurFleurs}
            emissiveIntensity={0.3}
          />
          {instancesFleurs.positions.map((_, i) => {
            if (i % 3 === 0) {
              const idx = i / 3;
              const matrix = new THREE.Matrix4();
              matrix.setPosition(
                instancesFleurs.positions[i],
                instancesFleurs.positions[i + 1],
                instancesFleurs.positions[i + 2]
              );
              matrix.scale(new THREE.Vector3(
                instancesFleurs.scales[i],
                instancesFleurs.scales[i + 1],
                instancesFleurs.scales[i + 2]
              ));
              return <primitive key={idx} object={matrix} attach={`instanceMatrix[${idx}]`} />;
            }
            return null;
          }).filter(Boolean)}
        </instancedMesh>
      )}
      
      {/* FEUILLAGE - Feuilles individuelles en instancing */}
      {(infosSaison.typeRendu === 'feuillage' || 
        infosSaison.typeRendu === 'feuillage-automne' || 
        infosSaison.typeRendu === 'jeunes-feuilles') && instancesFeuilles && (
        <>
          {/* Masse de feuillage (base) - Plus légère qu'avant */}
          <mesh position={[0, hauteurActuelle + envergureActuelle * 0.3, 0]} castShadow receiveShadow>
            <sphereGeometry args={[envergureActuelle / 2, 24, 18]} />
            <meshStandardMaterial 
              color={infosSaison.feuillage}
              transparent 
              opacity={0.6 * infosSaison.densite}
              roughness={0.85}
              emissive={infosSaison.brillance ? infosSaison.feuillage : '#000000'}
              emissiveIntensity={infosSaison.brillance ? 0.15 : 0}
            />
          </mesh>
          
          {/* Couches supplémentaires pour volume */}
          <mesh position={[envergureActuelle * 0.2, hauteurActuelle + envergureActuelle * 0.35, envergureActuelle * 0.15]} castShadow receiveShadow>
            <sphereGeometry args={[envergureActuelle / 3, 16, 12]} />
            <meshStandardMaterial 
              color={infosSaison.feuillage}
              transparent 
              opacity={0.5 * infosSaison.densite}
              roughness={0.85}
            />
          </mesh>
          
          <mesh position={[-envergureActuelle * 0.2, hauteurActuelle + envergureActuelle * 0.25, -envergureActuelle * 0.15]} castShadow receiveShadow>
            <sphereGeometry args={[envergureActuelle / 3.5, 16, 12]} />
            <meshStandardMaterial 
              color={infosSaison.feuillage}
              transparent 
              opacity={0.45 * infosSaison.densite}
              roughness={0.85}
            />
          </mesh>
        </>
      )}
      
      {/* HIVER - Bourgeons sur branches nues */}
      {infosSaison.bourgeons && infosSaison.nombreBourgeons > 0 && (
        <>
          {[...Array(infosSaison.nombreBourgeons)].map((_, i) => {
            const angle = Math.random() * Math.PI * 2;
            const rayon = envergureActuelle * (0.2 + Math.random() * 0.2);
            const hauteur = hauteurActuelle * (0.4 + Math.random() * 0.5);
            
            return (
              <mesh 
                key={`bourgeon-${i}`}
                position={[
                  Math.cos(angle) * rayon,
                  hauteur,
                  Math.sin(angle) * rayon
                ]}
                castShadow
              >
                <sphereGeometry args={[0.06, 6, 4]} />
                <meshStandardMaterial 
                  color="#8d6e63"
                  roughness={0.8}
                  metalness={0.05}
                />
              </mesh>
            );
          })}
        </>
      )}
      
      {/* RACINES sous terre */}
      {profondeurRacinesActuelle > 0 && (
        <>
          {/* Racines principales (5-7 racines) */}
          {[...Array(6)].map((_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            const longueur = envergureActuelle * 0.4;
            const profondeur = profondeurRacinesActuelle * (0.6 + Math.random() * 0.4);
            
            return (
              <mesh 
                key={`racine-${i}`}
                position={[
                  Math.cos(angle) * longueur * 0.3,
                  -profondeur / 2,
                  Math.sin(angle) * longueur * 0.3
                ]}
                rotation={[Math.PI / 4, angle, 0]}
              >
                <cylinderGeometry args={[rayonTronc * 0.3, rayonTronc * 0.15, profondeur, 8]} />
                <meshStandardMaterial 
                  color={validationStatus === 'error' ? '#ff0000' : '#8B4513'}
                  transparent 
                  opacity={0.5}
                  wireframe
                />
              </mesh>
            );
          })}
          
          {/* Pivot central */}
          <mesh position={[0, -profondeurRacinesActuelle / 2, 0]}>
            <coneGeometry args={[rayonTronc * 0.8, profondeurRacinesActuelle, 8]} />
            <meshStandardMaterial 
              color={validationStatus === 'error' ? '#ff0000' : '#8B4513'}
              transparent 
              opacity={0.4}
              wireframe
            />
          </mesh>
        </>
      )}
      
      {/* INDICATEURS VISUELS DE VALIDATION */}
      
      {/* Cercle au sol - Couleur selon validation */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[envergureActuelle / 2 - 0.1, envergureActuelle / 2 + 0.1, 64]} />
        <meshBasicMaterial 
          color={couleurValidation}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Halo pulsant si problème */}
      {validationStatus === 'error' && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
          <ringGeometry args={[envergureActuelle / 2 + 0.2, envergureActuelle / 2 + 0.5, 64]} />
          <meshBasicMaterial 
            color="#ff0000"
            transparent
            opacity={0.6}
          />
        </mesh>
      )}
      
      {validationStatus === 'warning' && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
          <ringGeometry args={[envergureActuelle / 2 + 0.2, envergureActuelle / 2 + 0.4, 64]} />
          <meshBasicMaterial 
            color="#ff9800"
            transparent
            opacity={0.5}
          />
        </mesh>
      )}
      
      {/* Symbole d'alerte pulsant */}
      {validationStatus === 'error' && (
        <Html position={[0, hauteurActuelle + envergureActuelle * 0.6, 0]} center>
          <div style={{ 
            fontSize: '32px',
            animation: 'pulse 1.5s ease-in-out infinite',
            textShadow: '0 0 10px rgba(255,0,0,0.8)'
          }}>
            ⚠️
          </div>
        </Html>
      )}
      
      {/* Label nom discret */}
      <Html position={[0, hauteurActuelle + envergureActuelle * 0.5 + 0.2, 0]} center>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.9)', 
          padding: '2px 6px', 
          borderRadius: '3px',
          fontSize: '9px',
          fontWeight: '500',
          color: '#424242',
          whiteSpace: 'nowrap',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: 'none'
        }}>
          {arbreData?.name || 'Arbre'}
        </div>
      </Html>
      
      {/* Particules de feuilles qui tombent en automne */}
      {infosSaison.typeRendu === 'feuillage-automne' && (
        <>
          {[...Array(15)].map((_, i) => (
            <mesh 
              key={`feuille-tombante-${i}`}
              position={[
                (Math.random() - 0.5) * envergureActuelle,
                hauteurActuelle * Math.random() * 0.5,
                (Math.random() - 0.5) * envergureActuelle
              ]}
              rotation={[
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
              ]}
            >
              <planeGeometry args={[0.08, 0.12]} />
              <meshStandardMaterial 
                color={infosSaison.feuillage}
                transparent
                opacity={0.7}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </>
      )}
      
    </group>
  );
}

// Optimisation : Éviter re-renders des arbres 3D
export default memo(Arbre3DAvance);

