import { useState, useRef } from 'react';
import './SolInteractif.css';

/**
 * Visualisation interactive du sol avec lignes draggables
 */
function SolInteractif({ couchesSol, onCouchesSolChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const containerRef = useRef(null);
  
  if (!couchesSol || couchesSol.length === 0) return null;
  
  const profondeurTotale = couchesSol.reduce((sum, c) => sum + c.profondeur, 0);
  
  // Démarrer le drag
  const handleMouseDown = (e, index) => {
    e.preventDefault();
    setIsDragging(true);
    setDragIndex(index);
  };
  
  // Pendant le drag
  const handleMouseMove = (e) => {
    if (!isDragging || dragIndex === null || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const containerHeight = rect.height;
    
    // Calculer la nouvelle position en pourcentage
    const pourcentageY = Math.max(0, Math.min(100, (mouseY / containerHeight) * 100));
    
    // Calculer les nouvelles profondeurs
    const nouvellesCouches = [...couchesSol];
    
    // Position cumulative jusqu'à la couche actuelle
    let positionCumulative = 0;
    for (let i = 0; i < dragIndex; i++) {
      positionCumulative += nouvellesCouches[i].profondeur;
    }
    
    // Nouvelle profondeur absolue à cette position
    const nouvelleProfondeurAbsolue = (pourcentageY / 100) * profondeurTotale;
    
    // Calculer les changements
    const delta = nouvelleProfondeurAbsolue - positionCumulative;
    
    // Ajuster les couches adjacentes
    const coucheActuelle = nouvellesCouches[dragIndex];
    const coucheSuivante = nouvellesCouches[dragIndex + 1];
    
    if (coucheSuivante) {
      const nouvelleProfCourante = Math.max(5, coucheActuelle.profondeur + delta);
      const nouvelleProfSuivante = Math.max(5, coucheSuivante.profondeur - delta);
      
      nouvellesCouches[dragIndex].profondeur = Math.round(nouvelleProfCourante);
      nouvellesCouches[dragIndex + 1].profondeur = Math.round(nouvelleProfSuivante);
      
      if (onCouchesSolChange) {
        onCouchesSolChange(nouvellesCouches);
      }
    }
  };
  
  // Terminer le drag
  const handleMouseUp = () => {
    setIsDragging(false);
    setDragIndex(null);
  };
  
  // Commencer l'édition
  const handleClickValue = (index) => {
    setEditingIndex(index);
    setEditValue(couchesSol[index].profondeur.toString());
  };
  
  // Valider l'édition
  const handleBlur = () => {
    if (editingIndex !== null && editValue !== '') {
      const nouvellesCouches = [...couchesSol];
      nouvellesCouches[editingIndex].profondeur = Math.max(5, Math.min(200, parseInt(editValue) || 5));
      if (onCouchesSolChange) {
        onCouchesSolChange(nouvellesCouches);
      }
    }
    setEditingIndex(null);
    setEditValue('');
  };
  
  // Valider avec Entrée
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setEditingIndex(null);
      setEditValue('');
    }
  };
  
  return (
    <div 
      className="sol-interactif-container"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="sol-visualisation" ref={containerRef}>
        {couchesSol.map((couche, index) => {
          const hauteurPourcent = (couche.profondeur / profondeurTotale) * 100;
          return (
            <div key={index}>
              <div 
                className="sol-couche-rect"
                style={{ 
                  backgroundColor: couche.couleur,
                  height: `${hauteurPourcent}%`
                }}
              >
                <div className="sol-couche-label">
                  <strong>{couche.nom}</strong>
                  {editingIndex === index ? (
                    <input
                      type="number"
                      className="sol-couche-edit"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                      autoFocus
                      min="5"
                      max="200"
                    />
                  ) : (
                    <span 
                      className="sol-couche-prof clickable"
                      onClick={() => handleClickValue(index)}
                      title="Cliquer pour modifier"
                    >
                      {couche.profondeur}cm
                    </span>
                  )}
                </div>
              </div>
              
              {/* Ligne draggable entre les couches */}
              {index < couchesSol.length - 1 && (
                <div 
                  className={`sol-separateur ${isDragging && dragIndex === index ? 'dragging' : ''}`}
                  onMouseDown={(e) => handleMouseDown(e, index)}
                  title="Glisser pour ajuster"
                >
                  <div className="sol-separateur-ligne"></div>
                  <div className="sol-separateur-handle">⋮</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SolInteractif;

