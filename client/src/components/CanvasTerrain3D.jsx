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
import PanneauEdition3D from './PanneauEdition3D';
import Soleil3D from './3d/Soleil3D';
import { ECHELLE_PIXELS_PAR_METRE } from '../config/constants';
import './CanvasTerrain3D.css';

function CanvasTerrain3D({ 
  dimensions = { largeur: 30, hauteur: 30 },
  planData = null,
  anneeProjection = 0,
  saison = 'ete', // Saison pour le soleil ET le feuillage des arbres
  couchesSol = [
    { nom: 'Terre végétale', profondeur: 30, couleur: '#795548', type: 'terre' },
    { nom: 'Marne calcaire', profondeur: 70, couleur: '#bdbdbd', type: 'marne' }
  ],
  onObjetPositionChange = null
}) {
  const [objetSelectionne, setObjetSelectionne] = useState(null);
  const [vueMode, setVueMode] = useState('perspective'); // perspective, dessus, cote, coupe
  const [afficherSousTerre, setAfficherSousTerre] = useState(true);
  const [modeDeplacement, setModeDeplacement] = useState(false); // Mode déplacement d'objets
  const [solTransparent, setSolTransparent] = useState(false); // Rendre le sol transparent pour voir les racines
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
    
    // Terrasses/Pavés
    if (planData.terrasses && planData.terrasses.length > 0) {
      data3D.terrasses = planData.terrasses.map(t => {
        const terrasseWidth = t.getScaledWidth ? t.getScaledWidth() : t.width;
        const terrasseHeight = t.getScaledHeight ? t.getScaledHeight() : t.height;
        
        return {
          position: [t.left / echelle, 0, t.top / echelle],
          largeur: terrasseWidth / echelle,
          profondeur: terrasseHeight / echelle,
          hauteur: 0.1 // 10cm d'épaisseur
        };
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
    setObjetSelectionne(objet);
  }, []);
  
  const handleProprieteChange = useCallback((propriete, valeur) => {
    // Mettre à jour l'objet sélectionné
    setObjetSelectionne(prev => prev ? {
      ...prev,
      [propriete]: valeur
    } : prev);
    
    // Propager au planData si callback fourni
    if (onObjetPositionChange && objetSelectionne) {
      onObjetPositionChange({
        type: objetSelectionne.type,
        propriete,
        valeur,
        objet: objetSelectionne
      });
    }
  }, [objetSelectionne, onObjetPositionChange]);
  
  // Callback pour le drag end d'un objet (mémorisé)
  const handleObjetDragEnd = useCallback((dragData) => {
    if (onObjetPositionChange) {
      onObjetPositionChange(dragData);
    }
  }, [onObjetPositionChange]);
  
  return (
    <div className="canvas-terrain-3d">
      {/* Barre d'outils 3D */}
      <div className="toolbar-3d">
        <div className="vue-selector">
          <button 
            className={vueMode === 'perspective' ? 'active' : ''}
            onClick={() => setVueMode('perspective')}
            title="Vue perspective"
          >
            🎮 Perspective
          </button>
          <button 
            className={vueMode === 'dessus' ? 'active' : ''}
            onClick={() => setVueMode('dessus')}
            title="Vue de dessus"
          >
            🔝 Dessus
          </button>
          <button 
            className={vueMode === 'cote' ? 'active' : ''}
            onClick={() => setVueMode('cote')}
            title="Vue de côté"
          >
            👉 Côté
          </button>
          <button 
            className={vueMode === 'coupe' ? 'active' : ''}
            onClick={() => setVueMode('coupe')}
            title="Vue en coupe"
          >
            📐 Coupe
          </button>
        </div>
        
        <label className="checkbox-3d">
          <input 
            type="checkbox" 
            checked={afficherSousTerre}
            onChange={(e) => setAfficherSousTerre(e.target.checked)}
          />
          <span>👁️ Afficher racines et fondations</span>
        </label>
        
        <label className="checkbox-3d">
          <input 
            type="checkbox" 
            checked={solTransparent}
            onChange={(e) => setSolTransparent(e.target.checked)}
          />
          <span>🔍 Sol transparent (voir sous terre)</span>
        </label>
        
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
        
        {/* Soleil 3D selon la saison */}
        <Soleil3D saison={saison} distance={35} />
        
        {/* Lumières */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 20, 10]} 
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
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
        
        {/* Canalisations */}
        {afficherSousTerre && data3D?.canalisations?.map((canal, idx) => (
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
        
        {/* Terrasses/Pavés */}
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
              color="#9e9e9e"
              roughness={0.7}
              metalness={0.2}
            />
          </mesh>
        ))}
        
        {/* Arbres à planter (draggable si mode activé) */}
        {data3D?.arbres?.map((arbre, idx) => {
          // Vérifier si un modèle 3D réel existe
          const model3D = arbre.arbreData?.id ? getModelPourArbre(arbre.arbreData.id) : null;
          
          return (
            <ObjetDraggable3D
              key={`arbre-plante-${idx}`}
              position={arbre.position}
              type="arbre-a-planter"
              enabled={modeDeplacement}
              onDragEnd={handleObjetDragEnd}
              maisonBounds={maisonBounds}
            >
              {model3D ? (
                /* Modèle 3D réel (GLB) */
                <Arbre3DModel
                  position={[0, 0, 0]}
                  modelPath={model3D.path}
                  scale={model3D.scale * (arbre.hauteur / model3D.hauteurReelle)}
                  rotation={model3D.rotation}
                  anneeProjection={anneeProjection}
                  onClick={() => handleObjetClick({ type: 'arbre', ...arbre })}
                />
              ) : (
                /* Arbre procédural (actuel) */
                <Arbre3D
                  position={[0, 0, 0]}
                  arbreData={arbre.arbreData}
                  hauteur={arbre.hauteur}
                  envergure={arbre.envergure}
                  profondeurRacines={afficherSousTerre ? arbre.profondeurRacines : 0}
                  validationStatus={arbre.validationStatus || 'ok'}
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
                /* Modèle 3D réel (GLB) */
                <Arbre3DModel
                  position={[0, 0, 0]}
                  modelPath={model3D.path}
                  scale={model3D.scale * (arbre.hauteur / model3D.hauteurReelle)}
                  rotation={model3D.rotation}
                  anneeProjection={20} // Arbres existants = matures
                  onClick={() => handleObjetClick({ type: 'arbre-existant', ...arbre })}
                />
              ) : (
                /* Arbre procédural (actuel) */
                <Arbre3D
                  position={[0, 0, 0]}
                  arbreData={arbre.arbreData}
                  hauteur={arbre.hauteur}
                  envergure={arbre.envergure}
                  profondeurRacines={afficherSousTerre ? arbre.profondeurRacines : 0}
                  validationStatus={arbre.validationStatus || 'ok'}
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
          maxPolarAngle={Math.PI / 2 - 0.1} // Empêcher de passer sous le sol
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
      
      {/* Panneau d'édition (si objet sélectionné) */}
      {objetSelectionne && (
        <PanneauEdition3D
          objet={objetSelectionne}
          onChange={handleProprieteChange}
          onClose={() => setObjetSelectionne(null)}
        />
      )}
    </div>
  );
}

export default CanvasTerrain3D;

