import { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Sky } from '@react-three/drei';
import Arbre3D from './3d/Arbre3D';
import Maison3D from './3d/Maison3D';
import Sol3D from './3d/Sol3D';
import Canalisation3D from './3d/Canalisation3D';
import Citerne3D from './3d/Citerne3D';
import Cloture3D from './3d/Cloture3D';
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
  ]
}) {
  const [objetSelectionne, setObjetSelectionne] = useState(null);
  const [vueMode, setVueMode] = useState('perspective'); // perspective, dessus, cote, coupe
  const [afficherSousTerre, setAfficherSousTerre] = useState(true);
  
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
      data3D.arbres = planData.arbres.map(a => ({
        position: [a.left / echelle, 0, a.top / echelle],
        arbreData: a.arbreData,
        hauteur: a.hauteur || 6,
        envergure: a.envergure || 4,
        profondeurRacines: a.profondeurRacines || 1.5,
        validationStatus: a.validationStatus || 'ok'
      }));
    }
    
    // Arbres existants
    if (planData.arbresExistants && planData.arbresExistants.length > 0) {
      data3D.arbresExistants = planData.arbresExistants.map(a => ({
        position: [a.left / echelle, 0, a.top / echelle],
        hauteur: a.hauteur || 8,
        envergure: a.envergure || 6,
        profondeurRacines: 2
      }));
    }
    
    return data3D;
  };
  
  const data3D = convertir2DTo3D();
  
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
        
        {/* Arbres à planter */}
        {arbresAPlanter.map((arbre, idx) => {
          // Trouver la position depuis planData
          const arbreCanvas = planData?.arbresPlantes?.find(a => a.id === arbre.id);
          if (!arbreCanvas) return null;
          
          const hauteurStr = arbre.tailleMaturite || '6';
          const hauteurMax = parseFloat(hauteurStr.split('-').pop().replace('m', '').trim());
          const envergureStr = arbre.envergure || '4';
          const envergureMax = parseFloat(envergureStr.split('-').pop());
          const profondeurRacines = parseFloat(arbre.reglementation?.systemeRacinaire?.profondeur?.split('-')[0] || '1');
          
          return (
            <Arbre3D
              key={`arbre-${idx}`}
              position={[
                arbreCanvas.left / 40,
                0,
                arbreCanvas.top / 40
              ]}
              arbreData={arbre}
              hauteur={hauteurMax}
              envergure={envergureMax}
              profondeurRacines={afficherSousTerre ? profondeurRacines : 0}
              validationStatus={arbreCanvas.validationStatus || 'ok'}
              anneeProjection={anneeProjection}
              onClick={() => handleObjetClick({ type: 'arbre', ...arbre })}
            />
          );
        })}
        
        {/* Caméra contrôlable */}
        <OrbitControls 
          enablePan 
          enableZoom 
          enableRotate
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
        <div className="legende-item"><span className="color-box" style={{background: '#795548'}}></span> Terre végétale ({couchesSol[0].profondeur}cm)</div>
        <div className="legende-item"><span className="color-box" style={{background: '#bdbdbd'}}></span> {couchesSol[1].nom} ({couchesSol[1].profondeur}cm)</div>
      </div>
      
      {/* Aide */}
      <div className="aide-3d">
        <p>🖱️ <strong>Clic gauche + drag</strong> : Rotation</p>
        <p>🖱️ <strong>Molette</strong> : Zoom</p>
        <p>🖱️ <strong>Clic droit + drag</strong> : Panoramique</p>
        <p>👆 <strong>Clic sur objet</strong> : Éditer propriétés</p>
      </div>
    </div>
  );
}

export default CanvasTerrain3D;

