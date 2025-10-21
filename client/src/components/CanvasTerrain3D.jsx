import { useRef, useState, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Sky } from '@react-three/drei';
import Arbre3D from './3d/Arbre3D';
import Arbre3DModel from './3d/Arbre3DModel';
import { getModelPourArbre } from '../config/modeles3D';
import Maison3D from './3d/Maison3D';
import Sol3D from './3d/Sol3D';
import Canalisation3D from './3d/Canalisation3D';
import Citerne3D from './3d/Citerne3D';
import Cloture3D from './3d/Cloture3D';
import ObjetDraggable3D from './3d/ObjetDraggable3D';
// PanneauEdition3D supprimé - pas nécessaire
import Soleil3D from './3d/Soleil3D';
import LumiereDirectionnelle from './3d/LumiereDirectionnelle';
// GrilleReference, SelecteurHeure et CubeNavigation3D ne sont plus nécessaires
import { ECHELLE_PIXELS_PAR_METRE } from '../config/constants';
import { validerArbres3D } from '../utils/validation3D';
import './CanvasTerrain3D.css';

// Fonction utilitaire pour parser la taille à maturité depuis arbustesData
// Ex: "6-10 m" → 8 (moyenne), "4 m" → 4
function parseHauteur(tailleMaturite) {
  if (!tailleMaturite) return 7; // Valeur par défaut
  
  const match = tailleMaturite.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/);
  if (match) {
    // Format "6-10 m" → prendre la moyenne
    const min = parseFloat(match[1]);
    const max = parseFloat(match[2]);
    return (min + max) / 2;
  }
  
  // Format "4 m" → prendre la valeur
  const singleMatch = tailleMaturite.match(/(\d+(?:\.\d+)?)/);
  if (singleMatch) {
    return parseFloat(singleMatch[1]);
  }
  
  return 7; // Défaut
}

function CanvasTerrain3D({ 
  dimensions = { largeur: 30, hauteur: 30 },
  planData = null,
  anneeProjection = 0,
  saison = 'ete', // Saison pour le soleil ET le feuillage des arbres
  heureJournee = 90, // Angle de la journée pour les ombres (0° = matin, 180° = soir)
  orientation = 'nord-haut', // Orientation du terrain pour les ombres
  couchesSol = [
    { nom: 'Terre végétale', profondeur: 30, couleur: '#795548', type: 'terre' },
    { nom: 'Marne calcaire', profondeur: 70, couleur: '#bdbdbd', type: 'marne' }
  ],
  onObjetPositionChange = null
}) {
  // Passer l'angle directement au soleil pour un mouvement fluide
  // heureJournee est maintenant un angle de 0° (matin) à 180° (soir)
  const [vueMode, setVueMode] = useState('perspective'); // perspective, dessus, cote (coupe supprimée)
  const [modeDeplacement, setModeDeplacement] = useState(false); // Mode déplacement d'objets
  const [solTransparent, setSolTransparent] = useState(true); // ✅ Sol transparent TOUJOURS ACTIF = voir racines, fondations, citernes, canalisations
  const orbitControlsRef = useRef();
  
  // Convertir les données 2D en 3D
  // Recalculer quand planData OU anneeProjection change
  const convertir2DTo3D = () => {
    const echelle = ECHELLE_PIXELS_PAR_METRE; // Utilisation de la constante globale : 40 pixels = 1 mètre
    
    const data3D = {
      maison: null,
      arbres: [],
      canalisations: [],
      citernes: [],
      clotures: [],
      terrasses: [],
      arbresExistants: [],
      bounds: { minX: 0, maxX: 0, minZ: 0, maxZ: 0 } // Limites des objets
    };
    
    if (!planData) return data3D;
    
    // Tracker les limites de tous les objets
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    
    const updateBounds = (x, z, largeur = 0, profondeur = 0) => {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x + largeur);
      minZ = Math.min(minZ, z);
      maxZ = Math.max(maxZ, z + profondeur);
    };
    
    // Maison (si existe)
    if (planData.maison) {
      const maisonWidth = planData.maison.getScaledWidth ? planData.maison.getScaledWidth() : planData.maison.width;
      const maisonHeight = planData.maison.getScaledHeight ? planData.maison.getScaledHeight() : planData.maison.height;
      
      const posX = planData.maison.left / echelle;
      const posZ = planData.maison.top / echelle;
      const largeur = maisonWidth / echelle;
      const profondeur = maisonHeight / echelle;
      
      data3D.maison = {
        position: [posX, 0, posZ],
        largeur,
        profondeur,
        hauteur: planData.maison.hauteurBatiment || 7,
        profondeurFondations: planData.maison.profondeurFondations || 1.2
      };
      
      updateBounds(posX, posZ, largeur, profondeur);
    }
    
    // Citernes (objets circulaires - Groups)
    if (planData.citernes && planData.citernes.length > 0) {
      data3D.citernes = planData.citernes.map(c => {
        const diametre = c.diametre || 1.5;
        const posX = c.left / echelle;
        const posZ = c.top / echelle;
        
        updateBounds(posX - diametre/2, posZ - diametre/2, diametre, diametre);
        
        return {
          position: [posX, 0, posZ],
          largeur: diametre,
          profondeur: diametre,
          profondeurEnterree: c.profondeur || 2.5,
          volume: c.volume || 3000
        };
      });
    }
    
    // Canalisations (Groups avec x1, y1, x2, y2)
    if (planData.canalisations && planData.canalisations.length > 0) {
      data3D.canalisations = planData.canalisations.map(c => {
        // Si c'est un Group, utiliser x1, y1, x2, y2 directement
        const x1 = c.x1 !== undefined ? c.x1 : c.left;
        const y1 = c.y1 !== undefined ? c.y1 : c.top;
        const x2 = c.x2 !== undefined ? c.x2 : c.left + 100;
        const y2 = c.y2 !== undefined ? c.y2 : c.top;
        
        return {
          x1: x1 / echelle,
          y1: y1 / echelle,
          x2: x2 / echelle,
          y2: y2 / echelle,
          profondeur: c.profondeur || 0.6,
          diametre: c.diametre || 0.1
        };
      });
    }
    
    // Clôtures (Groups avec x1, y1, x2, y2)
    if (planData.clotures && planData.clotures.length > 0) {
      data3D.clotures = planData.clotures.map(c => {
        // Utiliser directement x1, y1, x2, y2 du Group
        const x1 = c.x1 !== undefined ? c.x1 : c.left;
        const y1 = c.y1 !== undefined ? c.y1 : c.top;
        const x2 = c.x2 !== undefined ? c.x2 : c.left + 100;
        const y2 = c.y2 !== undefined ? c.y2 : c.top;
        
        return {
          x1: x1 / echelle,
          y1: y1 / echelle,
          x2: x2 / echelle,
          y2: y2 / echelle,
          hauteur: c.hauteurCloture || 1.5,
          epaisseur: c.epaisseur || 0.05
        };
      });
    }
    
    // Terrasses/Pavés - ✅ Support des DEUX types
    data3D.terrasses = [];
    
    // Terrasses classiques
    if (planData.terrasses && planData.terrasses.length > 0) {
      planData.terrasses.forEach(t => {
        const terrasseWidth = t.getScaledWidth ? t.getScaledWidth() : t.width;
        const terrasseHeight = t.getScaledHeight ? t.getScaledHeight() : t.height;
        
        data3D.terrasses.push({
          position: [t.left / echelle, 0, t.top / echelle],
          largeur: terrasseWidth / echelle,
          profondeur: terrasseHeight / echelle,
          hauteur: 0.1, // 10cm d'épaisseur
          type: 'terrasse'
        });
      });
    }
    
    // Pavés enherbés (customType='paves' en 2D)
    if (planData.paves && planData.paves.length > 0) {
      planData.paves.forEach(p => {
        const paveWidth = p.getScaledWidth ? p.getScaledWidth() : p.width;
        const paveHeight = p.getScaledHeight ? p.getScaledHeight() : p.height;
        
        data3D.terrasses.push({
          position: [p.left / echelle, 0, p.top / echelle],
          largeur: paveWidth / echelle,
          profondeur: paveHeight / echelle,
          hauteur: 0.05, // 5cm d'épaisseur (plus fin que terrasse)
          type: 'pave-enherbe'
        });
      });
    }
    
    // Arbres à planter
    if (planData.arbres && planData.arbres.length > 0) {
      data3D.arbres = planData.arbres.map(a => {
        // Extraire taille à maturité depuis arbreData
        const arbreData = a.arbreData || {};
        const hauteurStr = arbreData.tailleMaturite || '6m';
        const hauteurMax = parseFloat(hauteurStr.split('-').pop().replace('m', '').trim());
        const envergureStr = arbreData.envergure || '4';
        const envergureMax = parseFloat(envergureStr.split('-').pop());
        
        // Profondeur des racines
        let profondeurRacines = 1.5;
        if (arbreData.reglementation?.systemeRacinaire?.profondeur) {
          const profStr = arbreData.reglementation.systemeRacinaire.profondeur;
          profondeurRacines = parseFloat(profStr.split('-')[0]);
        }
        
        const posX = a.left / echelle;
        const posZ = a.top / echelle;
        
        // Mettre à jour les bounds avec l'envergure de l'arbre
        updateBounds(posX - envergureMax/2, posZ - envergureMax/2, envergureMax, envergureMax);
        
        // IMPORTANT : La croissance temporelle est gérée dans Arbre3D.jsx
        // On passe les tailles max, Arbre3D calcule la taille actuelle selon anneeProjection
        
        return {
          position: [posX, 0, posZ],
          arbreData: arbreData,
          hauteur: hauteurMax,
          envergure: envergureMax,
          profondeurRacines: profondeurRacines,
          validationStatus: a.validationStatus || 'ok'
        };
      });
    }
    
    // Arbres existants
    if (planData.arbresExistants && planData.arbresExistants.length > 0) {
      data3D.arbresExistants = planData.arbresExistants.map(a => {
        const posX = a.left / echelle;
        const posZ = a.top / echelle;
        const env = a.envergure || 6;
        
        updateBounds(posX - env/2, posZ - env/2, env, env);
        
        return {
          position: [posX, 0, posZ],
          arbreData: { name: 'Arbre existant' },
          hauteur: a.hauteur || 8,
          envergure: env,
          profondeurRacines: 2,
          validationStatus: 'ok'
        };
      });
    }
    
    // Calculer les dimensions du terrain avec marge de 5m
    const marge = 5;
    if (minX !== Infinity) {
      data3D.bounds = {
        minX: Math.floor(minX) - marge,
        maxX: Math.ceil(maxX) + marge,
        minZ: Math.floor(minZ) - marge,
        maxZ: Math.ceil(maxZ) + marge
      };
    } else {
      // Pas d'objets : utiliser dimensions par défaut
      data3D.bounds = {
        minX: 0,
        maxX: dimensions.largeur,
        minZ: 0,
        maxZ: dimensions.hauteur
      };
    }
    
    return data3D;
  };
  
  // Optimisation : Mémoriser la conversion 2D→3D (calcul coûteux)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const data3D = useMemo(() => convertir2DTo3D(), [planData, anneeProjection, dimensions.largeur, dimensions.hauteur]);
  
  // Valider tous les arbres en 3D pour avoir les statuts à jour
  const validationMap3D = useMemo(() => {
    // Combiner arbres à planter + arbres existants pour la validation globale
    const tousLesArbres = [
      ...(data3D.arbres || []),
      ...(data3D.arbresExistants || [])
    ];
    
    if (tousLesArbres.length === 0) return { arbres: new Map(), arbresExistants: new Map() };
    
    const validationComplete = validerArbres3D(
      tousLesArbres,
      data3D.maison,
      data3D.canalisations,
      data3D.citernes,
      data3D.clotures,
      data3D.terrasses
    );
    
    // Séparer les validations pour arbres à planter vs existants
    const nbArbresPlantes = data3D.arbres?.length || 0;
    const arbresMap = new Map();
    const existantsMap = new Map();
    
    validationComplete.forEach((val, idx) => {
      if (idx < nbArbresPlantes) {
        arbresMap.set(idx, val);
      } else {
        existantsMap.set(idx - nbArbresPlantes, val);
      }
    });
    
    return { arbres: arbresMap, arbresExistants: existantsMap };
  }, [data3D]);
  
  // Calculer les dimensions du terrain adaptatif (mémorisé)
  const terrainDimensions = useMemo(() => ({
    largeur: data3D.bounds.maxX - data3D.bounds.minX,
    hauteur: data3D.bounds.maxZ - data3D.bounds.minZ,
    centreX: (data3D.bounds.minX + data3D.bounds.maxX) / 2,
    centreZ: (data3D.bounds.minZ + data3D.bounds.maxZ) / 2
  }), [data3D.bounds]);
  
  const { largeur: terrainLargeur, hauteur: terrainHauteur, centreX: terrainCentreX, centreZ: terrainCentreZ } = terrainDimensions;
  
  // Calculer les bounds de la maison pour validation collision (mémorisé)
  const maisonBounds = useMemo(() => data3D?.maison ? {
    minX: data3D.maison.position[0],
    maxX: data3D.maison.position[0] + data3D.maison.largeur,
    minZ: data3D.maison.position[2],
    maxZ: data3D.maison.position[2] + data3D.maison.profondeur
  } : null, [data3D]);
  
  // Positions de caméra selon mode (mémorisées)
  const cameraPositions = useMemo(() => {
    const centreX = terrainCentreX;
    const centreZ = terrainCentreZ;
    const maxDim = Math.max(terrainLargeur, terrainHauteur);
    
    return {
      perspective: [centreX + maxDim * 0.6, maxDim * 0.5, centreZ + maxDim * 0.6],
      dessus: [centreX, maxDim * 1.2, centreZ],
      cote: [centreX + maxDim, maxDim * 0.3, centreZ],
      coupe: [centreX, maxDim * 0.3, centreZ + maxDim * 0.8]
    };
  }, [terrainLargeur, terrainHauteur, terrainCentreX, terrainCentreZ]);
  
  const handleObjetClick = useCallback((objet) => {
    // Modal d'édition supprimé - clic désactivé
    // setObjetSelectionne(objet);
  }, []);
  
  // handleProprieteChange supprimé - modal d'édition non nécessaire
  
  // Callback pour le drag end d'un objet (mémorisé)
  // ✅ FIXE : Ajouter un délai pour éviter le figement dû au re-render
  const handleObjetDragEnd = useCallback((dragData) => {
    if (onObjetPositionChange) {
      // ✅ Appel asynchrone pour éviter le figement du drag
      setTimeout(() => {
        onObjetPositionChange(dragData);
      }, 100); // 100ms de délai pour laisser l'animation se terminer
    }
  }, [onObjetPositionChange]);
  
  return (
    <div className="canvas-terrain-3d">
      {/* Barre d'outils 3D */}
      <div className="toolbar-3d">
        
        {/* ✅ Vue sous terre TOUJOURS ACTIVE - racines, fondations, citernes et canalisations toujours visibles */}
        
        <label className="checkbox-3d">
          <input 
            type="checkbox" 
            checked={modeDeplacement}
            onChange={(e) => setModeDeplacement(e.target.checked)}
          />
          <span>✋ Mode déplacement d'objets</span>
        </label>
      </div>
      
      {/* Canvas 3D */}
      <Canvas shadows dpr={[1, 2]} className="canvas-3d">
        {/* Ciel */}
        <Sky sunPosition={[100, 20, 100]} />
        
        {/* Soleil 3D visuel selon la saison et l'angle fluide */}
        <Soleil3D saison={saison} angleJournee={heureJournee} distance={60} />
        
        {/* Lumière ambiante (éclairage global) */}
        <ambientLight intensity={0.5} />
        
        {/* Lumière directionnelle synchronisée avec le soleil (génère les ombres) */}
        <LumiereDirectionnelle
          saison={saison}
          angleJournee={heureJournee}
          orientation={orientation}
          distance={50}
          intensity={1.2}
          shadowMapSize={2048}
        />
        
        {/* Sol avec couches - Taille adaptative */}
        <Sol3D 
          largeur={terrainLargeur} 
          hauteur={terrainHauteur}
          offsetX={data3D.bounds.minX}
          offsetZ={data3D.bounds.minZ}
          couchesSol={couchesSol}
          transparent={solTransparent}
        />
        
        {/* Maison */}
        {data3D?.maison && (
          <Maison3D 
            {...data3D.maison}
            onClick={() => handleObjetClick({ type: 'maison', ...data3D.maison })}
          />
        )}
        
        {/* Citernes */}
        {data3D?.citernes?.map((citerne, idx) => (
          <Citerne3D 
            key={`citerne-${idx}`}
            {...citerne}
            onClick={() => handleObjetClick({ type: 'citerne', ...citerne, index: idx })}
          />
        ))}
        
        {/* Canalisations - Visibles uniquement si sol transparent */}
        {solTransparent && data3D?.canalisations?.map((canal, idx) => (
          <Canalisation3D 
            key={`canal-${idx}`}
            {...canal}
          />
        ))}
        
        {/* Clôtures */}
        {data3D?.clotures?.map((cloture, idx) => (
          <Cloture3D 
            key={`cloture-${idx}`}
            {...cloture}
          />
        ))}
        
        {/* Terrasses/Pavés enherbés */}
        {data3D?.terrasses?.map((terrasse, idx) => (
          <mesh 
            key={`terrasse-${idx}`}
            position={[
              terrasse.position[0] + terrasse.largeur / 2,
              terrasse.hauteur / 2,
              terrasse.position[2] + terrasse.profondeur / 2
            ]}
            receiveShadow
            castShadow
          >
            <boxGeometry args={[terrasse.largeur, terrasse.hauteur, terrasse.profondeur]} />
            <meshStandardMaterial 
              color={terrasse.type === 'pave-enherbe' ? '#7cb342' : '#9e9e9e'}
              roughness={terrasse.type === 'pave-enherbe' ? 0.9 : 0.7}
              metalness={0}
              emissive={terrasse.type === 'pave-enherbe' ? '#2e7d32' : '#000000'}
              emissiveIntensity={terrasse.type === 'pave-enherbe' ? 0.1 : 0}
            />
          </mesh>
        ))}
        
        {/* Arbres à planter (draggable si mode activé) */}
        {data3D?.arbres?.map((arbre, idx) => {
          // Vérifier si un modèle 3D réel existe
          const model3D = arbre.arbreData?.id ? getModelPourArbre(arbre.arbreData.id) : null;
          
          // Récupérer le statut de validation 3D
          const validation3D = validationMap3D.arbres.get(idx) || { status: 'ok', messages: [] };
          const validationStatus = validation3D.status;
          
          if (model3D) {
            console.log(`[3D] Utilisation modèle GLB pour ${arbre.arbreData.id}:`, model3D.path);
          }
          
          return (
            <ObjetDraggable3D
              key={arbre.arbreData?.id ? `arbre-${arbre.arbreData.id}-${idx}` : `arbre-plante-${idx}`}
              position={arbre.position}
              type="arbre-a-planter"
              enabled={modeDeplacement}
              onDragEnd={handleObjetDragEnd}
              maisonBounds={maisonBounds}
            >
              {model3D ? (
                /* Modèle 3D réel (GLB) avec fallback automatique */
                <Arbre3DModel
                  position={[0, 0, 0]}
                  modelPath={model3D.path}
                  hauteurMaturite={parseHauteur(arbre.arbreData?.tailleMaturite)}
                  envergure={arbre.envergure}
                  validationStatus={validationStatus}
                  rotation={model3D.rotation}
                  anneeProjection={anneeProjection}
                  saison={saison}
                  arbreData={arbre.arbreData}
                  onClick={() => handleObjetClick({ type: 'arbre', ...arbre })}
                  fallbackProps={{
                    arbreData: arbre.arbreData,
                    hauteur: arbre.hauteur,
                    envergure: arbre.envergure,
                    profondeurRacines: solTransparent ? arbre.profondeurRacines : 0,
                    validationStatus: arbre.validationStatus || 'ok',
                    anneeProjection: anneeProjection,
                    saison: saison,
                    onClick: () => handleObjetClick({ type: 'arbre', ...arbre })
                  }}
                />
              ) : (
                /* Arbre procédural (pas de modèle GLB) */
                <Arbre3D
                  position={[0, 0, 0]}
                  arbreData={arbre.arbreData}
                  hauteur={arbre.hauteur}
                  envergure={arbre.envergure}
                  profondeurRacines={solTransparent ? arbre.profondeurRacines : 0}
                  validationStatus={validationStatus}
                  anneeProjection={anneeProjection}
                  saison={saison}
                  onClick={() => handleObjetClick({ type: 'arbre', ...arbre })}
                />
              )}
            </ObjetDraggable3D>
          );
        })}
        
        {/* Arbres existants (draggable si mode activé) */}
        {data3D?.arbresExistants?.map((arbre, idx) => {
          // Vérifier si un modèle 3D réel existe
          const model3D = arbre.arbreData?.id ? getModelPourArbre(arbre.arbreData.id) : null;
          
          // Récupérer le statut de validation 3D
          const validation3D = validationMap3D.arbresExistants.get(idx) || { status: 'ok', messages: [] };
          const validationStatus = validation3D.status;
          
          return (
            <ObjetDraggable3D
              key={`arbre-existant-${idx}`}
              position={arbre.position}
              type="arbre-existant"
              enabled={modeDeplacement}
              onDragEnd={handleObjetDragEnd}
              maisonBounds={maisonBounds}
            >
              {model3D ? (
                /* Modèle 3D réel (GLB) avec fallback automatique */
                <Arbre3DModel
                  position={[0, 0, 0]}
                  modelPath={model3D.path}
                  hauteurMaturite={parseHauteur(arbre.arbreData?.tailleMaturite)}
                  envergure={arbre.envergure}
                  validationStatus={validationStatus}
                  rotation={model3D.rotation}
                  anneeProjection={20} // Arbres existants = matures
                  saison={saison}
                  arbreData={arbre.arbreData}
                  onClick={() => handleObjetClick({ type: 'arbre-existant', ...arbre })}
                  fallbackProps={{
                    arbreData: arbre.arbreData,
                    hauteur: arbre.hauteur,
                    envergure: arbre.envergure,
                    profondeurRacines: solTransparent ? arbre.profondeurRacines : 0,
                    validationStatus: arbre.validationStatus || 'ok',
                    anneeProjection: 0,
                    saison: saison,
                    onClick: () => handleObjetClick({ type: 'arbre-existant', ...arbre })
                  }}
                />
              ) : (
                /* Arbre procédural (pas de modèle GLB) */
                <Arbre3D
                  position={[0, 0, 0]}
                  arbreData={arbre.arbreData}
                  hauteur={arbre.hauteur}
                  envergure={arbre.envergure}
                  profondeurRacines={solTransparent ? arbre.profondeurRacines : 0}
                  validationStatus={validationStatus}
                  anneeProjection={0}
                  saison={saison}
                  onClick={() => handleObjetClick({ type: 'arbre-existant', ...arbre })}
                />
              )}
            </ObjetDraggable3D>
          );
        })}
        
        {/* Caméra contrôlable */}
        <OrbitControls 
          ref={orbitControlsRef}
          enablePan={!modeDeplacement} 
          enableZoom 
          enableRotate={!modeDeplacement}
          enabled={!modeDeplacement} // Désactiver OrbitControls en mode déplacement
          minPolarAngle={0}
          maxPolarAngle={Math.PI} // ✅ Permet de voir par dessous (fondations, racines)
          target={[terrainCentreX, 0, terrainCentreZ]}
          minDistance={5} // Distance minimale (5m)
          maxDistance={200} // Distance maximale (200m)
        />
        
        <PerspectiveCamera 
          makeDefault 
          position={cameraPositions[vueMode]}
          fov={60}
          near={0.1}
          far={1000}
        />
        
        {/* Lumière hémisphérique pour éclairage naturel */}
        <hemisphereLight 
          skyColor="#87CEEB" 
          groundColor="#8B4513" 
          intensity={0.6} 
        />
      </Canvas>
      
      {/* Panneau d'édition supprimé - pas nécessaire */}
    </div>
  );
}

export default CanvasTerrain3D;

