import React from 'react';
import SolInteractif from '../SolInteractif';

/**
 * Section Config du panneau latéral
 */
const SectionConfig = ({
  couchesSol,
  onCouchesSolChange,
  objetSelectionne,
  onSupprimerObjet,
  onUpdateObjetProp,
  toitOuvert,
  setToitOuvert
}) => {
  return (
    <div className="panneau-outils-content">
      {/* COMPOSITION DU SOL */}
      <div className="section-header">
        <h3 className="section-title">🌍 Composition du sol</h3>
      </div>
      <SolInteractif 
        couchesSol={couchesSol} 
        onCouchesSolChange={onCouchesSolChange} 
      />
      
      <div className="info-box info-box-info" style={{ marginTop: '0.5rem' }}>
        📏 Profondeur totale : {couchesSol ? (couchesSol.reduce((sum, c) => sum + c.profondeur, 0) / 100).toFixed(2) : 0} m
      </div>
      
      {/* OBJET SÉLECTIONNÉ */}
      {objetSelectionne && (
        <>
          <div className="section-header">
            <h3 className="section-title">🎯 Objet sélectionné</h3>
          </div>
          <div className="info-box" style={{ background: '#fff3e0', borderColor: '#ff9800' }}>
            <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
              {objetSelectionne.customType === 'maison' && '🏠 Maison'}
              {objetSelectionne.customType === 'citerne' && '💧 Citerne'}
              {objetSelectionne.customType === 'caisson-eau' && '📦 Caisson d\'eau'}
              {objetSelectionne.customType === 'canalisation' && '🚰 Canalisation'}
              {objetSelectionne.customType === 'cloture' && '🚧 Clôture'}
              {objetSelectionne.customType === 'terrasse' && '🪵 Terrasse'}
              {objetSelectionne.customType === 'paves' && '🟩 Pavés'}
              {objetSelectionne.customType === 'arbre-a-planter' && `🌳 ${objetSelectionne.arbreData?.name || 'Arbre'}`}
              {objetSelectionne.customType === 'arbre-existant' && '🌳 Arbre existant'}
            </div>
          </div>

          {/* Configuration spécifique selon le type d'objet */}
          {objetSelectionne.customType === 'maison' && (
            <div className="objet-controls">
              {/* Type de toit */}
              <div style={{ marginBottom: '1rem' }}>
                <button
                  onClick={() => setToitOuvert(!toitOuvert)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: toitOuvert ? '#4caf50' : '#2196f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    marginBottom: '0.5rem'
                  }}
                >
                  {toitOuvert ? '▼' : '▶'} Type de toit
                </button>
                
                {toitOuvert && (
                  <div style={{ padding: '0.5rem', background: '#f5f5f5', borderRadius: '4px' }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>
                        Type de toit actuel : {objetSelectionne.typeToit || 'deux-pentes'}
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <input
                            type="radio"
                            name="typeToit"
                            value="plan"
                            checked={objetSelectionne.typeToit === 'plan'}
                            onChange={(e) => onUpdateObjetProp('typeToit', e.target.value)}
                          />
                          🏢 Toit plan
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <input
                            type="radio"
                            name="typeToit"
                            value="monopente"
                            checked={objetSelectionne.typeToit === 'monopente'}
                            onChange={(e) => onUpdateObjetProp('typeToit', e.target.value)}
                          />
                          🏠 Toit monopente
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <input
                            type="radio"
                            name="typeToit"
                            value="deux-pentes"
                            checked={objetSelectionne.typeToit === 'deux-pentes'}
                            onChange={(e) => onUpdateObjetProp('typeToit', e.target.value)}
                          />
                          🏘️ Toit deux pentes (traditionnel)
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Arbre à planter : Informations de validation et placement */}
          {objetSelectionne.customType === 'arbre-a-planter' && (
            <div className="objet-controls">
              {/* Dimensions actuelles */}
              <div className="info-box info-box-success">
                {objetSelectionne.tailles ? (
                  <div style={{ fontSize: '0.8rem', color: '#495057' }}>
                    <div>📏 <strong>Plantation:</strong> {objetSelectionne.tailles.envergureActuelle?.toFixed(1) || 'N/A'}m × {objetSelectionne.tailles.hauteurActuelle?.toFixed(1) || 'N/A'}m</div>
                    <div>🌳 <strong>Tronc:</strong> ⌀{((objetSelectionne.tailles.diametreTroncActuel || 0) * 100).toFixed(0)}cm {objetSelectionne.iconeType || ''}</div>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: '#6c757d', fontStyle: 'italic' }}>
                    📏 Dimensions en cours de calcul...
                  </div>
                )}
              </div>
              
              {/* Messages de validation */}
              {objetSelectionne.validationMessages && objetSelectionne.validationMessages.length > 0 && (
                <div style={{ fontSize: '0.8rem' }}>
                  {objetSelectionne.validationMessages.map((msg, index) => {
                    // Identifier les types de problèmes
                    const isRacines = msg.includes('Racines') || msg.includes('racines');
                    const isFondations = msg.includes('🏠') || msg.includes('fondations');
                    const isCanalisations = msg.includes('🚰') || msg.includes('canalisations');
                    const isCritique = msg.includes('CRITIQUE') || msg.includes('ILLÉGAL');
                    
                    return (
                      <div key={index} className={`info-box ${isCritique ? 'info-box-error' : 'info-box-warning'}`} style={{ 
                        marginBottom: '0.3rem',
                        padding: '0.3rem',
                        fontSize: '0.8rem'
                      }}>
                        {isRacines && <span style={{ fontWeight: 'bold' }}>🌱 RACINES: </span>}
                        {isFondations && <span style={{ fontWeight: 'bold' }}>🏠 FONDATIONS: </span>}
                        {isCanalisations && <span style={{ fontWeight: 'bold' }}>🚰 CANALISATIONS: </span>}
                        {msg}
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Conseils de racines */}
              <div className="info-box info-box-info" style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>💡 Conseils de plantation :</div>
                <div>• Distance minimale des fondations : 3m</div>
                <div>• Distance des canalisations : 2m</div>
                <div>• Espacement entre arbres : 5-8m</div>
                <div>• Éviter les zones de passage</div>
              </div>
              
              {/* Bouton supprimer */}
              <button
                onClick={onSupprimerObjet}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  marginTop: '0.5rem'
                }}
              >
                🗑️ Supprimer cet arbre
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SectionConfig;
