import './SolInteractif.css';

/**
 * Visualisation interactive du sol avec lignes draggables
 */
function SolInteractif({ couchesSol, onCouchesSolChange }) {
  if (!couchesSol || couchesSol.length === 0) return null;
  
  const profondeurTotale = couchesSol.reduce((sum, c) => sum + c.profondeur, 0);
  
  // ✅ Limite totale du sol à 3.0m (300cm)
  const PROFONDEUR_MAX_TOTALE = 300;
  
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
                <span style={{ fontSize: '0.75rem', color: '#888', fontWeight: '600', minWidth: '20px', flexShrink: 0 }}>cm</span>
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

