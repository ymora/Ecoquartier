import { useRef, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Sky } from '@react-three/drei';
import Arbre3D from './3d/Arbre3D';
import Maison3D from './3d/Maison3D';
import Sol3D from './3d/Sol3D';
import Canalisation3D from './3d/Canalisation3D';
import Citerne3D from './3d/Citerne3D';
import Cloture3D from './3d/Cloture3D';
import ObjetDraggable3D from './3d/ObjetDraggable3D';
import PanneauEdition3D from './PanneauEdition3D';
import './CanvasTerrain3D.css';

function CanvasTerrain3D({ 
  dimensions = { largeur: 30, hauteur: 30 },
  planData = null,
  arbresAPlanter = [],
  anneeProjection = 0,
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
  const orbitControlsRef = useRef();
  
  // Convertir les données 2D en 3D
  const convertir2DTo3D = () => {
    const echelle = 30; // ÉCHELLE CORRECTE : 30 pixels = 1 mètre
    
    const data3D = {
      maison: null,
      arbres: [],
      canalisations: [],
      citernes: [],
      clotures: [],
      terrasses: [],
      arbresExistants: []
    };
    
    if (!planData) return data3D;
    
    // Maison (si existe)
    if (planData.maison) {
      const maisonWidth = planData.maison.getScaledWidth ? planData.maison.getScaledWidth() : planData.maison.width;
      const maisonHeight = planData.maison.getScaledHeight ? planData.maison.getScaledHeight() : planData.maison.height;
      
      data3D.maison = {
        position: [
          planData.maison.left / echelle, 
          0, 
          planData.maison.top / echelle
        ],
        largeur: maisonWidth / echelle,
        profondeur: maisonHeight / echelle,
        hauteur: planData.maison.hauteurBatiment || 7,
        profondeurFondations: planData.maison.profondeurFondations || 1.2
      };
    }
    
    // Citernes (objets circulaires - Groups)
    if (planData.citernes && planData.citernes.length > 0) {
      data3D.citernes = planData.citernes.map(c => {
        const diametre = c.diametre || 1.5;
        return {
          position: [c.left / echelle, 0, c.top / echelle],
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
        
        return {
          position: [a.left / echelle, 0, a.top / echelle],
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
      data3D.arbresExistants = planData.arbresExistants.map(a => ({
        position: [a.left / echelle, 0, a.top / echelle],
        arbreData: { name: 'Arbre existant' },
        hauteur: a.hauteur || 8,
        envergure: a.envergure || 6,
        profondeurRacines: 2,
        validationStatus: 'ok'
      }));
    }
    
    return data3D;
  };
  
  const data3D = convertir2DTo3D();
  
  // Calculer les bounds de la maison pour validation collision
  const maisonBounds = data3D?.maison ? {
    minX: data3D.maison.position[0],
    maxX: data3D.maison.position[0] + data3D.maison.largeur,
    minZ: data3D.maison.position[2],
    maxZ: data3D.maison.position[2] + data3D.maison.profondeur
  } : null;
  
  // Positions de caméra selon mode
  const cameraPositions = {
    perspective: [20, 15, 20],
    dessus: [0, 30, 0],
    cote: [30, 5, 0],
    coupe: [0, 5, 25]
  };
  
  const handleObjetClick = (objet) => {
    setObjetSelectionne(objet);
  };
  
  const handleProprieteChange = (propriete, valeur) => {
    // Mettre à jour l'objet sélectionné
    if (objetSelectionne) {
      setObjetSelectionne({
        ...objetSelectionne,
        [propriete]: valeur
      });
      // TODO: Propager au planData
    }
  };
  
  // Callback pour le drag end d'un objet
  const handleObjetDragEnd = (dragData) => {
    if (onObjetPositionChange) {
      onObjetPositionChange(dragData);
    }
  };
  
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
          <span>👁️ Afficher sous-terre (racines, fondations, canalisations)</span>
        </label>
        
        <label className="checkbox-3d">
          <input 
            type="checkbox" 
            checked={modeDeplacement}
            onChange={(e) => setModeDeplacement(e.target.checked)}
          />
          <span>✋ Mode déplacement d'objets (drag & drop)</span>
        </label>
      </div>
      
      {/* Canvas 3D */}
      <Canvas shadows dpr={[1, 2]} className="canvas-3d">
        {/* Ciel */}
        <Sky sunPosition={[100, 20, 100]} />
        
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
        
        {/* Sol avec couches */}
        <Sol3D 
          largeur={dimensions.largeur} 
          hauteur={dimensions.hauteur}
          couchesSol={couchesSol}
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
        {data3D?.arbres?.map((arbre, idx) => (
          <ObjetDraggable3D
            key={`arbre-plante-${idx}`}
            position={arbre.position}
            type="arbre-a-planter"
            enabled={modeDeplacement}
            onDragEnd={handleObjetDragEnd}
            maisonBounds={maisonBounds}
          >
            <Arbre3D
              position={[0, 0, 0]} // Position relative au groupe draggable
              arbreData={arbre.arbreData}
              hauteur={arbre.hauteur}
              envergure={arbre.envergure}
              profondeurRacines={afficherSousTerre ? arbre.profondeurRacines : 0}
              validationStatus={arbre.validationStatus || 'ok'}
              anneeProjection={anneeProjection}
              onClick={() => handleObjetClick({ type: 'arbre', ...arbre })}
            />
          </ObjetDraggable3D>
        ))}
        
        {/* Arbres existants (draggable si mode activé) */}
        {data3D?.arbresExistants?.map((arbre, idx) => (
          <ObjetDraggable3D
            key={`arbre-existant-${idx}`}
            position={arbre.position}
            type="arbre-existant"
            enabled={modeDeplacement}
            onDragEnd={handleObjetDragEnd}
            maisonBounds={maisonBounds}
          >
            <Arbre3D
              position={[0, 0, 0]} // Position relative au groupe draggable
              arbreData={arbre.arbreData}
              hauteur={arbre.hauteur}
              envergure={arbre.envergure}
              profondeurRacines={afficherSousTerre ? arbre.profondeurRacines : 0}
              validationStatus={arbre.validationStatus || 'ok'}
              anneeProjection={0}
              onClick={() => handleObjetClick({ type: 'arbre-existant', ...arbre })}
            />
          </ObjetDraggable3D>
        ))}
        
        {/* Caméra contrôlable */}
        <OrbitControls 
          ref={orbitControlsRef}
          enablePan={!modeDeplacement} 
          enableZoom 
          enableRotate={!modeDeplacement}
          enabled={!modeDeplacement} // Désactiver OrbitControls en mode déplacement
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2 - 0.1} // Empêcher de passer sous le sol
          target={[0, 0, 0]}
        />
        
        <PerspectiveCamera 
          makeDefault 
          position={cameraPositions[vueMode]}
          fov={60}
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
      
      {/* Légende */}
      <div className="legende-3d">
        <h4>🎨 Légende</h4>
        <div className="legende-item"><span className="color-box" style={{background: '#2e7d32'}}></span> Arbre conforme</div>
        <div className="legende-item"><span className="color-box" style={{background: '#ff9800'}}></span> Arbre attention</div>
        <div className="legende-item"><span className="color-box" style={{background: '#f44336'}}></span> Arbre problème</div>
        {couchesSol.map((couche, idx) => (
          <div key={idx} className="legende-item">
            <span className="color-box" style={{background: couche.couleur}}></span> 
            {couche.nom} ({couche.profondeur}cm)
          </div>
        ))}
      </div>
      
      {/* Aide */}
      <div className="aide-3d">
        {!modeDeplacement ? (
          <>
            <p>🖱️ <strong>Clic gauche + drag</strong> : Rotation</p>
            <p>🖱️ <strong>Molette</strong> : Zoom</p>
            <p>🖱️ <strong>Clic droit + drag</strong> : Panoramique</p>
            <p>👆 <strong>Clic sur objet</strong> : Éditer propriétés</p>
          </>
        ) : (
          <>
            <p>✋ <strong>MODE DÉPLACEMENT ACTIF</strong></p>
            <p>👆 <strong>Clic + drag sur arbre</strong> : Déplacer</p>
            <p>🚫 <strong>Impossible d'entrer dans maison</strong></p>
            <p>💾 <strong>Position synchronisée avec 2D</strong></p>
          </>
        )}
      </div>
    </div>
  );
}

export default CanvasTerrain3D;

