import { useRef, memo } from 'react';
import { Html } from '@react-three/drei';

function Arbre3D({ 
  position = [0, 0, 0], 
  arbreData, 
  hauteur = 6, 
  envergure = 4, 
  profondeurRacines = 1.5,
  validationStatus = 'ok',
  anneeProjection = 0,
  saison = 'ete', // Nouvelle prop pour la saison
  onClick
}) {
  const groupRef = useRef();
  
  // Déterminer la couleur du feuillage selon la saison ET les données botaniques réelles
  const getCouleurFeuillage = () => {
    // Si validation problème, priorité aux couleurs d'alerte
    if (validationStatus === 'error') return '#f44336';
    if (validationStatus === 'warning') return '#ff9800';
    
    // Utiliser le calendrier annuel si disponible (plus précis)
    if (arbreData?.calendrierAnnuel && Array.isArray(arbreData.calendrierAnnuel)) {
      const calendrier = arbreData.calendrierAnnuel;
      
      switch (saison) {
        case 'hiver': {
          // Décembre-Janvier-Février
          const hiver = calendrier.find(c => 
            c.mois?.toLowerCase().includes('décembre') || 
            c.mois?.toLowerCase().includes('janvier') ||
            c.mois?.toLowerCase().includes('février')
          );
          
          // Arbres caducs : branches nues en hiver
          if (arbreData?.feuillage?.type === 'Caduc') {
            // Vérifier si mention de chute des feuilles
            if (hiver?.action?.toLowerCase().includes('chute')) {
              return null; // Pas de feuillage
            }
            return null; // Pas de feuillage en hiver pour caducs
          }
          // Persistants : vert foncé
          return '#2d5016';
        }
          
        case 'printemps': {
          // Mars-Avril-Mai
          const printemps = calendrier.find(c => 
            c.mois?.toLowerCase().includes('mars') ||
            c.mois?.toLowerCase().includes('avril') ||
            c.mois?.toLowerCase().includes('mai')
          );
          
          // Vérifier floraison spectaculaire
          if (printemps?.action?.toLowerCase().includes('floraison')) {
            // Extraire couleur depuis le calendrier ou floraison
            if (arbreData.floraison?.couleur) {
              return getCouleurDepuisTexte(arbreData.floraison.couleur);
            }
          }
          
          // Débourrement (feuilles naissantes)
          if (printemps?.action?.toLowerCase().includes('débourrement') || 
              printemps?.action?.toLowerCase().includes('bourgeon')) {
            // Couleur bronze/pourpre du débourrement
            if (arbreData.feuillage?.description?.toLowerCase().includes('bronze')) {
              return '#cd7f32'; // Bronze
            }
            if (arbreData.feuillage?.description?.toLowerCase().includes('pourpre')) {
              return '#8e44ad'; // Pourpre
            }
            return '#a5d6a7'; // Vert tendre par défaut
          }
          
          return '#7cb342'; // Vert clair printemps
        }
          
        case 'ete':
          // Juin-Juillet-Août
          // Été : feuillage vert dense
          return '#2e7d32';
          
        case 'automne': {
          // Septembre-Octobre-Novembre
          const automne = calendrier.find(c => 
            c.mois?.toLowerCase().includes('octobre') ||
            c.mois?.toLowerCase().includes('novembre') ||
            c.mois?.toLowerCase().includes('septembre')
          );
          
          // Couleur d'automne depuis les données
          if (arbreData.feuillage?.couleurAutomne) {
            return getCouleurDepuisTexte(arbreData.feuillage.couleurAutomne);
          }
          
          // Vérifier le calendrier pour infos automne
          if (automne?.action?.toLowerCase().includes('couleur')) {
            // Mention de couleurs dans le calendrier
            return getCouleurDepuisTexte(automne.action);
          }
          
          return '#d84315'; // Orange/rouge automne par défaut
        }
          
        default:
          return '#2e7d32';
      }
    }
    
    // Fallback si pas de calendrier : utiliser l'ancienne méthode
    switch (saison) {
      case 'hiver':
        if (arbreData?.feuillage?.type === 'Caduc') return null;
        return '#2d5016';
      case 'printemps':
        if (arbreData?.floraison?.couleur) {
          return getCouleurDepuisTexte(arbreData.floraison.couleur);
        }
        return '#7cb342';
      case 'ete':
        return '#2e7d32';
      case 'automne':
        if (arbreData?.feuillage?.couleurAutomne) {
          return getCouleurDepuisTexte(arbreData.feuillage.couleurAutomne);
        }
        return '#d84315';
      default:
        return '#2e7d32';
    }
  };
  
  // Convertir description texte en code couleur (amélioré avec plus de nuances)
  const getCouleurDepuisTexte = (texte) => {
    const txt = texte.toLowerCase();
    
    // Roses et magenta
    if (txt.includes('rose fuchsia') || txt.includes('fuchsia intense')) return '#e91e63'; // Rose fuchsia vif
    if (txt.includes('rose') && txt.includes('pâle')) return '#f8bbd0';
    if (txt.includes('rose') || txt.includes('pink')) return '#f06292';
    if (txt.includes('magenta')) return '#e91e63';
    
    // Blancs et crème
    if (txt.includes('blanc pur')) return '#ffffff';
    if (txt.includes('blanc')) return '#f5f5f5';
    if (txt.includes('crème') || txt.includes('ivoire')) return '#fff8dc';
    
    // Jaunes et dorés
    if (txt.includes('jaune') && txt.includes('lumineux')) return '#ffeb3b'; // Jaune vif
    if (txt.includes('jaune') && txt.includes('pâle')) return '#fff9c4';
    if (txt.includes('jaune')) return '#ffd54f';
    if (txt.includes('doré') || txt.includes('or')) return '#ffd700';
    
    // Oranges
    if (txt.includes('orange') && txt.includes('vif')) return '#ff6f00'; // Orange vif
    if (txt.includes('orange')) return '#ff9800';
    if (txt.includes('cuivré') || txt.includes('cuivre')) return '#d84315';
    if (txt.includes('bronze')) return '#cd7f32';
    
    // Rouges
    if (txt.includes('rouge') && (txt.includes('flamboyant') || txt.includes('spectaculaire'))) return '#c62828'; // Rouge intense
    if (txt.includes('rouge') && txt.includes('sang')) return '#b71c1c'; // Rouge sang
    if (txt.includes('écarlate')) return '#f44336'; // Rouge écarlate
    if (txt.includes('rouge')) return '#e53935';
    if (txt.includes('pourpre') && txt.includes('intense')) return '#7b1fa2'; // Pourpre intense
    if (txt.includes('pourpre')) return '#9c27b0';
    
    // Verts
    if (txt.includes('vert') && txt.includes('foncé')) return '#1b5e20'; // Vert très foncé
    if (txt.includes('vert') && txt.includes('tendre')) return '#81c784'; // Vert tendre
    if (txt.includes('vert')) return '#4caf50';
    
    return '#2e7d32'; // Vert par défaut
  };
  
  const couleurFeuillage = getCouleurFeuillage();
  const couleurValidation = validationStatus === 'error' ? '#f44336' : validationStatus === 'warning' ? '#ff9800' : '#2e7d32';
  
  // PROJECTION TEMPORELLE : Calculer taille selon l'année
  // Tailles à la plantation (jeune plant - année 0)
    const hauteurPlantation = 2; // 2m à la plantation
    const envergurePlantation = 0.8; // 0.8m de diamètre
    const profondeurRacinesPlantation = 0.3; // 30cm de racines
    
  // Tailles à maturité (20 ans)
  const hauteurMaturite = hauteur;
  const envergureMaturite = envergure;
  const profondeurRacinesMaturite = profondeurRacines;
  
  // Croissance linéaire de 0 à 20 ans
    const progression = Math.min(anneeProjection / 20, 1);
    
  let hauteurActuelle = hauteurPlantation + (hauteurMaturite - hauteurPlantation) * progression;
  let envergureActuelle = envergurePlantation + (envergureMaturite - envergurePlantation) * progression;
  let profondeurRacinesActuelle = profondeurRacinesPlantation + (profondeurRacinesMaturite - profondeurRacinesPlantation) * progression;
  
  // Calculer taille du tronc proportionnelle
  const rayonTronc = Math.min(0.3, hauteurActuelle * 0.04);
  const rayonTroncBase = rayonTronc * 1.2; // Base légèrement plus large
  
  return (
    <group ref={groupRef} position={position} onClick={onClick}>
      {/* TRONC (marron avec texture écorce simulée) */}
      <mesh position={[0, hauteurActuelle / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[rayonTronc, rayonTroncBase, hauteurActuelle, 12]} />
        <meshStandardMaterial 
          color="#6d4c41" 
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>
      
      {/* FEUILLAGE/FLEURS selon saison */}
      {couleurFeuillage && (
        <>
          {/* COURONNE principale */}
          <mesh position={[0, hauteurActuelle + envergureActuelle * 0.3, 0]} castShadow receiveShadow>
        <sphereGeometry args={[envergureActuelle / 2, 16, 12]} />
        <meshStandardMaterial 
              color={couleurFeuillage}
              transparent 
              opacity={saison === 'printemps' ? 0.9 : 0.85} // Plus opaque au printemps (fleurs denses)
              roughness={saison === 'printemps' ? 0.4 : 0.8} // Plus lisse au printemps (pétales)
              emissive={saison === 'printemps' ? couleurFeuillage : '#000000'}
              emissiveIntensity={saison === 'printemps' ? 0.2 : 0} // Fleurs brillent légèrement
            />
          </mesh>
          
          {/* Couches de feuillage supplémentaires pour effet volume */}
          <mesh position={[envergureActuelle * 0.15, hauteurActuelle + envergureActuelle * 0.35, envergureActuelle * 0.1]} castShadow receiveShadow>
            <sphereGeometry args={[envergureActuelle / 3, 12, 10]} />
            <meshStandardMaterial 
              color={couleurFeuillage}
              transparent 
              opacity={saison === 'printemps' ? 0.85 : 0.75}
              roughness={saison === 'printemps' ? 0.4 : 0.8}
              emissive={saison === 'printemps' ? couleurFeuillage : '#000000'}
              emissiveIntensity={saison === 'printemps' ? 0.15 : 0}
            />
          </mesh>
          <mesh position={[-envergureActuelle * 0.15, hauteurActuelle + envergureActuelle * 0.25, -envergureActuelle * 0.1]} castShadow receiveShadow>
            <sphereGeometry args={[envergureActuelle / 3.5, 12, 10]} />
            <meshStandardMaterial 
              color={couleurFeuillage}
          transparent 
              opacity={saison === 'printemps' ? 0.8 : 0.7}
              roughness={saison === 'printemps' ? 0.4 : 0.8}
            />
          </mesh>
        </>
      )}
      
      {/* HIVER : Bourgeons sur branches nues */}
      {saison === 'hiver' && arbreData?.feuillage?.type === 'Caduc' && (
        <>
          {/* Petits bourgeons sur les branches */}
          {[...Array(12)].map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const rayon = envergureActuelle * 0.3;
            return (
              <mesh 
                key={i}
                position={[
                  Math.cos(angle) * rayon,
                  hauteurActuelle + envergureActuelle * 0.2,
                  Math.sin(angle) * rayon
                ]}
              >
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshStandardMaterial color="#8d6e63" roughness={0.6} />
              </mesh>
            );
          })}
        </>
      )}
      
      {/* Branches principales visibles */}
      <mesh position={[envergureActuelle * 0.2, hauteurActuelle * 0.75, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
        <cylinderGeometry args={[rayonTronc * 0.4, rayonTronc * 0.5, hauteurActuelle * 0.3, 8]} />
        <meshStandardMaterial color="#795548" roughness={0.85} metalness={0.05} />
      </mesh>
      <mesh position={[-envergureActuelle * 0.2, hauteurActuelle * 0.7, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <cylinderGeometry args={[rayonTronc * 0.35, rayonTronc * 0.45, hauteurActuelle * 0.25, 8]} />
        <meshStandardMaterial color="#795548" roughness={0.85} metalness={0.05} />
      </mesh>
      
      {/* RACINES sous terre (wireframe pour transparence) */}
      {profondeurRacinesActuelle > 0 && (
        <mesh position={[0, -profondeurRacinesActuelle / 2, 0]}>
          <coneGeometry args={[envergureActuelle / 3, profondeurRacinesActuelle, 8]} />
          <meshStandardMaterial 
            color={validationStatus === 'error' ? '#ff0000' : '#8B4513'}
            transparent 
            opacity={0.4}
            wireframe
          />
        </mesh>
      )}
      
      {/* Indicateurs visuels de validation (sans texte) */}
      
      {/* CERCLE AU SOL - Couleur selon validation */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[envergureActuelle / 2 - 0.1, envergureActuelle / 2 + 0.1, 32]} />
        <meshBasicMaterial 
          color={couleurValidation}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* HALO DE VALIDATION - Pulse si problème */}
      {validationStatus === 'error' && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
          <ringGeometry args={[envergureActuelle / 2 + 0.2, envergureActuelle / 2 + 0.5, 32]} />
          <meshBasicMaterial 
            color="#ff0000"
            transparent
            opacity={0.6}
          />
        </mesh>
      )}
      
      {validationStatus === 'warning' && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
          <ringGeometry args={[envergureActuelle / 2 + 0.2, envergureActuelle / 2 + 0.4, 32]} />
          <meshBasicMaterial 
            color="#ff9800"
            transparent
            opacity={0.5}
          />
        </mesh>
      )}
      
      {/* SYMBOLE D'ALERTE AU-DESSUS (seulement si erreur) */}
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
      
      {/* Label nom discret (au clic seulement - optionnel) */}
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
    </group>
  );
}

// Optimisation : Éviter re-renders des arbres 3D
export default memo(Arbre3D);

