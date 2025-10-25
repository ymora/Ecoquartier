import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Sky } from '@react-three/drei';
import Arbre3D from './3d/Arbre3D';
import Arbre3DModel from './3d/Arbre3DModel';
import { getModelPourArbre } from '../config/modeles3D';
import Maison3D from './3d/Maison3D';
import Sol3D from './3d/Sol3D';
import Canalisation3D from './3d/Canalisation3D';
import Citerne3D from './3d/Citerne3D';
import Caisson3D from './3d/Caisson3D';
import Cloture3D from './3d/Cloture3D';
import ObjetDraggable3D from './3d/ObjetDraggable3D';
import PaveEnherbe3D from './3d/PaveEnherbe3D';
// PanneauEdition3D supprimé - pas nécessaire
import Soleil3D from './3d/Soleil3D';
import LumiereDirectionnelle from './3d/LumiereDirectionnelle';
// GrilleReference, SelecteurHeure et CubeNavigation3D ne sont plus nécessaires
import { ECHELLE_PIXELS_PAR_METRE } from '../config/constants';
import { validerArbres3D } from '../utils/validation3D';
import { dupliquerObjet } from '../utils/canvas/duplicationUtils';
import { afficherMenuContextuel, cacherMenuContextuel } from '../utils/canvas/menuContextuel';
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
  syncKey = 0, // ✅ Clé pour forcer la synchronisation
  onObjetPositionChange = null,
  onObjetSelectionChange = null, // ✅ Callback pour sélectionner un objet 3D
  canvas2D = null, // ✅ Référence au canvas 2D pour les actions
  exporterPlan = null, // ✅ Fonction d'export du plan
  revaliderTous = null, // ✅ Fonction de revalidation
  contextMenuRef2D = null // ✅ Référence au modal 2D existant
}) {
  // Passer l'angle directement au soleil pour un mouvement fluide
  // heureJournee est maintenant un angle de 0° (matin) à 180° (soir)
  const [vueMode, setVueMode] = useState('perspective'); // perspective, dessus, cote (coupe supprimée)
  const [modeDeplacement, setModeDeplacement] = useState(false); // Mode déplacement d'objets
  const [solTransparent, setSolTransparent] = useState(true); // ✅ Sol transparent TOUJOURS ACTIF = voir racines, fondations, citernes, canalisations
  const [objetSelectionne3D, setObjetSelectionne3D] = useState(null); // ✅ Objet sélectionné en 3D pour highlight
  const orbitControlsRef = useRef();
  
  // Convertir les données 2D en 3D
  // Recalculer quand planData OU anneeProjection change
  const convertir2DTo3D = () => {
    const echelle = ECHELLE_PIXELS_PAR_METRE; // Utilisation de la constante globale : 40 pixels = 1 mètre
    
    // Debug désactivé pour performance (produit des logs volumineux)
    
    const data3D = {
      maison: null,
      arbres: [],
      canalisations: [],
      citernes: [],
      clotures: [],
      terrasses: [],
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
    
    // Maisons (tableau)
    if (planData.maisons && planData.maisons.length > 0) {
      data3D.maisons = planData.maisons.map((maison, idx) => {
        const maisonWidth = maison.getScaledWidth ? maison.getScaledWidth() : maison.width;
        const maisonHeight = maison.getScaledHeight ? maison.getScaledHeight() : maison.height;
        
        const largeur = maisonWidth / echelle;
        const profondeur = maisonHeight / echelle;
        
        // Les objets 2D avec originX/Y: 'center' sont déjà centrés
        // Donc on utilise directement left/top pour la position 3D
        const posX = maison.left / echelle;
        const posZ = maison.top / echelle;
        
        // Debug désactivé pour performance
        
        updateBounds(posX - largeur/2, posZ - profondeur/2, largeur, profondeur);
        
        return {
          position: [posX, 0, posZ],
          largeur: maison.largeur || largeur,
          profondeur: maison.profondeur || profondeur,
          hauteur: maison.hauteur || 7,
          elevationSol: maison.elevationSol || 0,
          angle: maison.angle || 0,
          typeToit: maison.typeToit || 'deux-pentes',
          customType: 'maison'
        };
      });
    }
    
    // Citernes (objets circulaires - Groups)
    if (planData.citernes && planData.citernes.length > 0) {
      data3D.citernes = planData.citernes.map(c => {
        const diametre = c.diametre || 1.5;
        // Position centrée (les cercles utilisent origin: 'center')
        const posX = c.left / echelle;
        const posZ = c.top / echelle;
        
        // Debug désactivé pour performance
        
        updateBounds(posX - diametre/2, posZ - diametre/2, diametre, diametre);
        
        return {
          position: [posX, 0, posZ],
          diametre: diametre,
          longueur: c.longueur || 2.5,
          hauteur: diametre,
          volume: c.volume || 3000,
          elevationSol: c.elevationSol || -2.5,
          customType: 'citerne'
        };
      });
    }
    
    // Caissons d'eau rectangulaires
    if (planData.caissonsEau && planData.caissonsEau.length > 0) {
      planData.caissonsEau.forEach(c => {
        const largeur = c.largeur || 5;
        const profondeur = c.profondeur || 3;
        const hauteur = c.hauteur || 1;
        
        // Position centrée
        const posX = c.left / echelle;
        const posZ = c.top / echelle;
        
        if (!data3D.citernes) data3D.citernes = [];
        data3D.citernes.push({
          position: [posX, 0, posZ],
          largeur,
          profondeur,
          hauteur,
          volume: largeur * profondeur * hauteur,
          angle: c.angle || 0,
          elevationSol: c.elevationSol || -1.0,
          type: 'caisson',
          customType: 'caisson-eau'
        });
        
        updateBounds(posX - largeur/2, posZ - profondeur/2, largeur, profondeur);
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
          diametre: c.diametre || 0.1,
          elevationSol: c.elevationSol || -0.6,
          customType: 'canalisation'
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
          hauteur: c.hauteur || 1.5,
          epaisseur: c.epaisseur || 0.05,
          customType: 'cloture' // ✅ Ajout pour synchronisation avec le canvas 2D
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
        const largeur = terrasseWidth / echelle;
        const profondeur = terrasseHeight / echelle;
        
        // Position centrée (les groupes 2D utilisent originX/Y: 'center')
        const posX = t.left / echelle;
        const posZ = t.top / echelle;
        
        data3D.terrasses.push({
          position: [posX, 0, posZ],
          largeur: t.largeur || largeur,
          profondeur: t.profondeur || profondeur,
          hauteur: t.hauteur || 0.15,
          angle: t.angle || 0,
          elevationSol: t.elevationSol || 0,
          type: 'terrasse',
          customType: 'terrasse'
        });
        
        updateBounds(posX - largeur/2, posZ - profondeur/2, largeur, profondeur);
      });
    }
    
    // Pavés enherbés (customType='paves' en 2D)
    if (planData.paves && planData.paves.length > 0) {
      planData.paves.forEach(p => {
        const paveWidth = p.getScaledWidth ? p.getScaledWidth() : p.width;
        const paveHeight = p.getScaledHeight ? p.getScaledHeight() : p.height;
        const largeur = paveWidth / echelle;
        const profondeur = paveHeight / echelle;
        
        // Position centrée
        const posX = p.left / echelle;
        const posZ = p.top / echelle;
        
        data3D.terrasses.push({
          position: [posX, 0, posZ],
          largeur: p.largeur || largeur,
          profondeur: p.profondeur || profondeur,
          hauteur: p.hauteur || 0.08,
          angle: p.angle || 0,
          type: 'pave-enherbe',
          customType: 'paves'
        });
        
        updateBounds(posX - largeur/2, posZ - profondeur/2, largeur, profondeur);
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
          validationStatus: a.validationStatus || 'ok',
          customType: 'arbre-a-planter' // ✅ Ajout pour synchronisation avec le canvas 2D
        };
      });
    }
    
    
    // ✅ Calculer les dimensions du terrain avec marge de 5m
    const marge = 5;
    if (minX !== Infinity) {
      data3D.bounds = {
        minX: Math.floor(minX) - marge,
        maxX: Math.ceil(maxX) + marge,
        minZ: Math.floor(minZ) - marge,
        maxZ: Math.ceil(maxZ) + marge
      };
    } else {
      // Pas d'objets : terrain minimal 20×20m
      data3D.bounds = {
        minX: -10,
        maxX: 10,
        minZ: -10,
        maxZ: 10
      };
    }
    
    return data3D;
  };
  
  // Optimisation : Mémoriser la conversion 2D→3D (calcul coûteux)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const data3D = useMemo(() => convertir2DTo3D(), [planData, anneeProjection, dimensions.largeur, dimensions.hauteur, syncKey]);
  
  // Valider tous les arbres en 3D pour avoir les statuts à jour
  const validationMap3D = useMemo(() => {
    const tousLesArbres = data3D.arbres || [];
    
    if (tousLesArbres.length === 0) return { arbres: new Map() };
    
    const validationComplete = validerArbres3D(
      tousLesArbres,
      data3D.maisons,
      data3D.canalisations,
      data3D.citernes,
      data3D.clotures,
      data3D.terrasses
    );
    
    // Mapper les validations aux arbres
    const arbresMap = new Map();
    validationComplete.forEach((val, idx) => {
      arbresMap.set(idx, val);
    });
    
    return { arbres: arbresMap };
  }, [data3D]);
  
  // Calculer les dimensions du terrain adaptatif (mémorisé)
  const terrainDimensions = useMemo(() => ({
    largeur: data3D.bounds.maxX - data3D.bounds.minX,
    hauteur: data3D.bounds.maxZ - data3D.bounds.minZ,
    // Centre FIXE du terrain (toujours à 0,0) - ne dépend pas des objets
    centreX: 0,
    centreZ: 0
  }), [data3D.bounds]);
  
  const { largeur: terrainLargeur, hauteur: terrainHauteur, centreX: terrainCentreX, centreZ: terrainCentreZ } = terrainDimensions;
  
  // Calculer les bounds des maisons pour validation collision (mémorisé)
  // ✅ Les positions 3D sont centrées, donc on doit soustraire/ajouter la demi-dimension
  const maisonsBounds = useMemo(() => (data3D?.maisons || []).map(maison => ({
    minX: maison.position[0] - maison.largeur / 2,
    maxX: maison.position[0] + maison.largeur / 2,
    minZ: maison.position[2] - maison.profondeur / 2,
    maxZ: maison.position[2] + maison.profondeur / 2
  })), [data3D]);
  
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
    setObjetSelectionne3D(objet);
    
    // ✅ Trouver l'objet 2D correspondant
    if (canvas2D && contextMenuRef2D) {
      const objets2D = canvas2D.getObjects();
      const objet2D = objets2D.find(obj => 
        obj.customType === objet.customType && 
        Math.abs(obj.left - objet.position[0] * ECHELLE_PIXELS_PAR_METRE) < 50 &&
        Math.abs(obj.top - objet.position[2] * ECHELLE_PIXELS_PAR_METRE) < 50
      );
      
      if (objet2D) {
        // ✅ Sélectionner l'objet 2D
        canvas2D.setActiveObject(objet2D);
        canvas2D.renderAll();
        
        // ✅ Afficher le modal 2D (système original)
        afficherMenuContextuel(objet2D, canvas2D, contextMenuRef2D, contextMenuRef2D);
      }
    }
    
    if (onObjetSelectionChange) {
      onObjetSelectionChange(objet);
    }
  }, [onObjetSelectionChange, canvas2D, contextMenuRef2D]);
  
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
  
  // Écouter l'événement de réinitialisation de la caméra 3D
  useEffect(() => {
    const handleResetCamera = () => {
      if (orbitControlsRef.current) {
        // Réinitialiser les contrôles OrbitControls vers le centre (0,0,0)
        orbitControlsRef.current.reset();
        
        // S'assurer que la caméra regarde le centre (0,0,0)
        orbitControlsRef.current.target.set(0, 0, 0);
        orbitControlsRef.current.update();
        
        // Revenir en vue perspective si on est dans une autre vue
        setVueMode('perspective');
      }
    };
    
    window.addEventListener('reset3DCamera', handleResetCamera);
    
    return () => {
      window.removeEventListener('reset3DCamera', handleResetCamera);
    };
  }, []);

  // ✅ Le modal 2D gère déjà le clic extérieur

  
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
        <Soleil3D 
          saison={saison} 
          angleJournee={heureJournee} 
          distance={60}
          terrainCentreX={terrainCentreX}
          terrainCentreZ={terrainCentreZ}
        />
        
        {/* Repères visuels au centre du terrain */}
        <mesh position={[terrainCentreX, 2.0, terrainCentreZ]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial 
            color="#ff0000"
            emissive="#ff0000"
            emissiveIntensity={0.8}
          />
        </mesh>
        <mesh position={[terrainCentreX, 0.1, terrainCentreZ]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.2, 1.5, 32]} />
          <meshBasicMaterial color="#ff0000" side={2} />
        </mesh>
        
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
        
        {/* Maisons */}
        {data3D?.maisons?.map((maison, idx) => (
          <Maison3D 
            key={`maison-${idx}`}
            {...maison}
            typeToit={maison.typeToit || 'deux-pentes'}
            onClick={() => handleObjetClick({ type: 'maison', ...maison, index: idx })}
          />
        ))}
        
        {/* Citernes cylindriques */}
        {data3D?.citernes?.filter(c => c.type !== 'caisson').map((citerne, idx) => (
          <Citerne3D 
            key={`citerne-${idx}`}
            {...citerne}
            onClick={() => handleObjetClick({ 
              type: 'citerne', 
              ...citerne, 
              index: idx,
              position: [citerne.position[0], citerne.elevationSol, citerne.position[2]]
            })}
          />
        ))}
        
        {/* Caissons d'eau rectangulaires */}
        {data3D?.citernes?.filter(c => c.type === 'caisson').map((caisson, idx) => (
          <Caisson3D 
            key={`caisson-${idx}`}
            {...caisson}
            onClick={() => handleObjetClick({ 
              type: 'caisson-eau', 
              ...caisson, 
              index: idx,
              position: [caisson.position[0], caisson.elevationSol, caisson.position[2]]
            })}
          />
        ))}
        
        {/* Canalisations - Visibles uniquement si sol transparent */}
        {solTransparent && data3D?.canalisations?.map((canal, idx) => {
          const centerX = (canal.x1 + canal.x2) / 2;
          const centerY = (canal.y1 + canal.y2) / 2;
          return (
            <Canalisation3D 
              key={`canal-${idx}`}
              {...canal}
              onClick={() => handleObjetClick({ 
                type: 'canalisation', 
                ...canal, 
                index: idx,
                position: [centerX, canal.elevationSol, centerY]
              })}
            />
          );
        })}
        
        {/* Clôtures */}
        {data3D?.clotures?.map((cloture, idx) => {
          const centerX = (cloture.x1 + cloture.x2) / 2;
          const centerY = (cloture.y1 + cloture.y2) / 2;
          return (
            <Cloture3D 
              key={`cloture-${idx}`}
              {...cloture}
              onClick={() => handleObjetClick({ 
                type: 'cloture', 
                ...cloture, 
                index: idx,
                position: [centerX, cloture.hauteur / 2, centerY] // ✅ Position réelle rendue
              })}
            />
          );
        })}
        
        {/* Terrasses/Pavés enherbés ultra-réalistes */}
        {data3D?.terrasses?.map((terrasse, idx) => (
          terrasse.type === 'pave-enherbe' ? (
            // ✅ Pavés enherbés ultra-réalistes avec herbe qui bouge au vent
            <PaveEnherbe3D
              key={`pave-${idx}`}
              position={[
                terrasse.position[0],
                0,
                terrasse.position[2]
              ]}
              largeur={terrasse.largeur}
              profondeur={terrasse.profondeur}
              onClick={() => handleObjetClick({ 
                ...terrasse, 
                type: 'paves',
                customType: 'paves',
                index: idx,
                position: [terrasse.position[0], 0, terrasse.position[2]]
              })}
            />
          ) : (
            // Terrasse classique (béton gris)
            <mesh 
              key={`terrasse-${idx}`}
              position={[
                terrasse.position[0],
                terrasse.elevationSol || 0, // Positionner à l'élévation du sol
                terrasse.position[2]
              ]}
              rotation={[0, terrasse.angle ? -(terrasse.angle * Math.PI / 180) : 0, 0]}
              receiveShadow
              castShadow
              onClick={() => handleObjetClick({ 
                ...terrasse, 
                type: 'terrasse',
                customType: 'terrasse',
                index: idx,
                position: [terrasse.position[0], terrasse.elevationSol || 0, terrasse.position[2]]
              })}
            >
              <boxGeometry args={[terrasse.largeur, terrasse.hauteur, terrasse.profondeur]} />
              <meshStandardMaterial 
                color="#8d6e63"
                roughness={0.9}
                metalness={0.1}
              />
            </mesh>
          )
        ))}
        
        {/* Arbres à planter (draggable si mode activé) */}
        {data3D?.arbres?.map((arbre, idx) => {
          // Vérifier si un modèle 3D réel existe
          const model3D = arbre.arbreData?.id ? getModelPourArbre(arbre.arbreData.id) : null;
          
          // Récupérer le statut de validation 3D
          const validation3D = validationMap3D.arbres.get(idx) || { status: 'ok', messages: [] };
          const validationStatus = validation3D.status;
          
          if (model3D) {
          }
          
          return (
            <ObjetDraggable3D
              key={arbre.arbreData?.id ? `arbre-${arbre.arbreData.id}-${idx}` : `arbre-plante-${idx}`}
              position={arbre.position}
              type="arbre-a-planter"
              enabled={modeDeplacement}
              onDragEnd={handleObjetDragEnd}
              maisonBounds={maisonsBounds}
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
                  onClick={() => handleObjetClick({ type: 'arbre', ...arbre, customType: 'arbre-a-planter' })}
                  fallbackProps={{
                    arbreData: arbre.arbreData,
                    hauteur: arbre.hauteur,
                    envergure: arbre.envergure,
                    profondeurRacines: solTransparent ? arbre.profondeurRacines : 0,
                    validationStatus: arbre.validationStatus || 'ok',
                    anneeProjection: anneeProjection,
                    saison: saison,
                    onClick: () => handleObjetClick({ type: 'arbre', ...arbre, customType: 'arbre-a-planter' })
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
                  onClick={() => handleObjetClick({ type: 'arbre', ...arbre, customType: 'arbre-a-planter' })}
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
      
      {/* ✅ Pas de modal 3D - on utilise le modal 2D existant */}
      
      {/* Panneau d'édition supprimé - pas nécessaire */}
    </div>
  );
}

export default CanvasTerrain3D;

