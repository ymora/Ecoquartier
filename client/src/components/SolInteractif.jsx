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
  
  // ✅ Limite totale du sol à 3.0m (300cm)
  const PROFONDEUR_MAX_TOTALE = 300;
  
  // Valider l'édition avec limite 3m
  const handleBlur = () => {
    if (editingIndex !== null && editValue !== '') {
      const nouvellesCouches = [...couchesSol];
      const nouvelleProfondeur = Math.max(5, Math.min(200, parseInt(editValue) || 5));
      
      // Vérifier que le total ne dépasse pas 300cm
      const totalSansActuelle = nouvellesCouches.reduce((sum, c, idx) => 
        idx === editingIndex ? sum : sum + c.profondeur, 0);
      const profondeurFinale = Math.min(nouvelleProfondeur, PROFONDEUR_MAX_TOTALE - totalSansActuelle);
      
      nouvellesCouches[editingIndex].profondeur = profondeurFinale;
      if (onCouchesSolChange) {
        onCouchesSolChange(nouvellesCouches);
      }
    }
    setEditingIndex(null);
    setEditValue('');
  };
  
  // ✅ Boutons +/- plus simples
  const ajusterCouche = (index, delta) => {
    const nouvellesCouches = [...couchesSol];
    const nouvelleProfondeur = Math.max(5, nouvellesCouches[index].profondeur + delta);
    
    // Vérifier la limite totale
    const totalSansActuelle = nouvellesCouches.reduce((sum, c, idx) => 
      idx === index ? sum : sum + c.profondeur, 0);
    
    if (totalSansActuelle + nouvelleProfondeur <= PROFONDEUR_MAX_TOTALE) {
      nouvellesCouches[index].profondeur = nouvelleProfondeur;
      if (onCouchesSolChange) {
        onCouchesSolChange(nouvellesCouches);
      }
    }
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
    <div className="sol-interactif-container">
      {/* ✅ Info profondeur totale avec limite */}
      <div className="sol-total-info" style={{
        textAlign: 'center',
        fontSize: '0.7rem',
        padding: '0.4rem',
        background: profondeurTotale > PROFONDEUR_MAX_TOTALE ? '#ffebee' : '#e8f5e9',
        color: profondeurTotale > PROFONDEUR_MAX_TOTALE ? '#c62828' : '#2e7d32',
        fontWeight: '600',
        borderRadius: '4px',
        marginBottom: '0.5rem'
      }}>
        📏 Total: {(profondeurTotale / 100).toFixed(2)}m / 3.00m max
        {profondeurTotale > PROFONDEUR_MAX_TOTALE && ' ⚠️'}
      </div>
      
      {/* ✅ Inputs harmonisés avec flèches natives */}
      <div className="sol-couches-controles">
        {couchesSol.map((couche, index) => (
          <div key={index} className="sol-couche-controle">
            <div 
              className="sol-couche-couleur" 
              style={{ backgroundColor: couche.couleur }}
            ></div>
            
            <div className="sol-couche-nom">{couche.nom}</div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'nowrap' }}>
              <button
                type="button"
                onClick={() => ajusterCouche(index, -5)}
                style={{
                  background: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  width: '33px',
                  height: '33px',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                −
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <input
                  type="text"
                  className="sol-couche-input"
                  value={couche.profondeur}
                  onChange={(e) => {
                    const nouvellesCouches = [...couchesSol];
                    const nouvelleProfondeur = Math.max(5, parseInt(e.target.value) || 5);
                    
                    // Vérifier la limite totale
                    const totalSansActuelle = nouvellesCouches.reduce((sum, c, idx) => 
                      idx === index ? sum : sum + c.profondeur, 0);
                    
                    if (totalSansActuelle + nouvelleProfondeur <= PROFONDEUR_MAX_TOTALE) {
                      nouvellesCouches[index].profondeur = nouvelleProfondeur;
                      if (onCouchesSolChange) {
                        onCouchesSolChange(nouvellesCouches);
                      }
                    }
                  }}
                  style={{ width: '60px', minWidth: '50px', textAlign: 'right', flexShrink: 1 }}
                />
                <span style={{ fontSize: '0.75rem', color: '#888', fontWeight: '600', width: '1.5ch', textAlign: 'left' }}>cm</span>
              </div>
              <button
                type="button"
                onClick={() => ajusterCouche(index, 5)}
                style={{
                  background: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  width: '33px',
                  height: '33px',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SolInteractif;

