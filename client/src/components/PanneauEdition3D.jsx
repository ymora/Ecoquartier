import { useState } from 'react';
import { FaTimes, FaRuler, FaArrowDown, FaArrowUp } from 'react-icons/fa';
import './PanneauEdition3D.css';

function PanneauEdition3D({ objet, onChange, onClose }) {
  const [valeurs, setValeurs] = useState(objet);
  
  const handleChange = (propriete, valeur) => {
    const nouvellesValeurs = { ...valeurs, [propriete]: parseFloat(valeur) };
    setValeurs(nouvellesValeurs);
    onChange(propriete, parseFloat(valeur));
  };
  
  const renderChamps = () => {
    switch (objet.type) {
      case 'maison':
        return (
          <>
            <div className="champ-edition">
              <label>
                <FaRuler /> Largeur (m)
                <input 
                  type="number" 
                  min="5" 
                  max="30" 
                  step="0.5"
                  value={valeurs.largeur || 10}
                  onChange={(e) => handleChange('largeur', e.target.value)}
                />
              </label>
            </div>
            
            <div className="champ-edition">
              <label>
                <FaRuler /> Profondeur (m)
                <input 
                  type="number" 
                  min="5" 
                  max="30" 
                  step="0.5"
                  value={valeurs.profondeur || 8}
                  onChange={(e) => handleChange('profondeur', e.target.value)}
                />
              </label>
            </div>
            
            <div className="champ-edition">
              <label>
                <FaArrowUp /> Hauteur maison (m)
                <input 
                  type="number" 
                  min="3" 
                  max="15" 
                  step="0.5"
                  value={valeurs.hauteur || 7}
                  onChange={(e) => handleChange('hauteur', e.target.value)}
                />
              </label>
            </div>
            
            <div className="champ-edition">
              <label>
                <FaArrowDown /> Profondeur fondations (m)
                <input 
                  type="number" 
                  min="0.5" 
                  max="3" 
                  step="0.1"
                  value={valeurs.profondeurFondations || 1.2}
                  onChange={(e) => handleChange('profondeurFondations', e.target.value)}
                />
              </label>
            </div>
            
            <div className="info-edition">
              💡 Type de fondations : 
              {valeurs.profondeurFondations < 0.8 ? ' Superficielles' : 
               valeurs.profondeurFondations < 1.5 ? ' Semi-profondes' : ' Profondes'}
            </div>
          </>
        );
        
      case 'citerne':
        return (
          <>
            <div className="champ-edition">
              <label>
                <FaRuler /> Diamètre (m)
                <input 
                  type="number" 
                  min="1" 
                  max="4" 
                  step="0.1"
                  value={valeurs.profondeur || 2}
                  onChange={(e) => handleChange('profondeur', e.target.value)}
                />
              </label>
            </div>
            
            <div className="champ-edition">
              <label>
                <FaArrowDown /> Profondeur enterrée (m)
                <input 
                  type="number" 
                  min="1" 
                  max="5" 
                  step="0.1"
                  value={valeurs.profondeurEnterree || 2.5}
                  onChange={(e) => handleChange('profondeurEnterree', e.target.value)}
                />
              </label>
            </div>
            
            <div className="champ-edition">
              <label>
                💧 Volume (litres)
                <input 
                  type="number" 
                  min="1000" 
                  max="10000" 
                  step="500"
                  value={valeurs.volume || 3000}
                  onChange={(e) => handleChange('volume', e.target.value)}
                />
              </label>
            </div>
            
            <div className="info-edition">
              💡 Capacité : {(valeurs.volume / 1000).toFixed(1)}m³
            </div>
          </>
        );
        
      case 'arbre':
        return (
          <>
            <div className="info-edition">
              🌳 <strong>{objet.name}</strong>
            </div>
            
            <div className="info-edition readonly">
              📏 Hauteur à maturité : {objet.tailleMaturite || 'N/A'}
            </div>
            
            <div className="info-edition readonly">
              📊 Envergure : {objet.envergure || 'N/A'}
            </div>
            
            <div className="info-edition readonly">
              🌱 Profondeur racines : {objet.reglementation?.systemeRacinaire?.profondeur || 'N/A'}
            </div>
            
            <div className="info-edition">
              💡 <em>Les dimensions de l'arbre viennent des données botaniques et ne sont pas modifiables</em>
            </div>
          </>
        );
        
      default:
        return <p>Sélectionnez un objet pour l'éditer</p>;
    }
  };
  
  return (
    <div className="panneau-edition-3d">
      <div className="panneau-header">
        <h3>✏️ Éditer {objet.type === 'maison' ? 'la Maison' : 
                        objet.type === 'citerne' ? 'la Citerne' :
                        objet.type === 'arbre' ? "l'Arbre" : "l'Objet"}</h3>
        <button onClick={onClose} className="btn-close">
          <FaTimes />
        </button>
      </div>
      
      <div className="panneau-body">
        {renderChamps()}
      </div>
      
      <div className="panneau-footer">
        <button onClick={onClose} className="btn-valider">
          ✅ Valider
        </button>
      </div>
    </div>
  );
}

export default PanneauEdition3D;

