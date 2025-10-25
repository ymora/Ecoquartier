import React from 'react';
import { ICONS } from '../../config/icons';

/**
 * Section Outils du panneau latéral
 */
const SectionOutils = ({
  imageFondChargee,
  onChargerImageFond,
  onSupprimerImageFond,
  opaciteImageFond,
  onOpaciteImageFondChange,
  onChargerPlanParDefaut,
  batimentsOuvert,
  setBatimentsOuvert,
  onAjouterMaison,
  onAjouterCiterne,
  onAjouterCaissonEau,
  onAjouterCanalisation,
  onAjouterCloture,
  onAjouterTerrasse,
  onAjouterPaves,
  vegetationOuvert,
  setVegetationOuvert,
  onAjouterArbre,
  onAjouterArbuste
}) => {
  return (
    <div className="panneau-outils-content">
      {/* 📷 PLAN DE FOND */}
      <div className="section-header">
        <h3 className="section-title">📷 Plan de fond</h3>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <button
          className={`btn btn-full ${imageFondChargee ? 'btn-success' : 'btn-primary'}`}
          onClick={onChargerImageFond}
          title="Charger plan cadastral, photo aérienne..."
        >
          📷 {imageFondChargee ? 'Image chargée' : 'Charger plan de fond'}
        </button>
        {imageFondChargee && (
          <div style={{ 
            marginTop: '0.3rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '500' }}>
              Opacité: {Math.round(opaciteImageFond * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={opaciteImageFond}
              onChange={(e) => onOpaciteImageFondChange(parseFloat(e.target.value))}
              style={{ flex: 1 }}
            />
            <button
              onClick={onSupprimerImageFond}
              style={{
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '0.3rem 0.6rem',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              🗑️
            </button>
          </div>
        )}
      </div>
      
      {/* 🏠 PLAN PAR DÉFAUT */}
      <div className="section-header">
        <h3 className="section-title">🏠 Plan par défaut</h3>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <button
          className="btn btn-warning btn-full"
          onClick={onChargerPlanParDefaut}
          title="Charger le plan par défaut avec 2 maisons, terrasses, pavés..."
        >
          🏠 Charger plan par défaut
        </button>
      </div>
      
      {/* 🏗️ STRUCTURES */}
      <div className="section-header">
        <h3 className="section-title">🏗️ Structures</h3>
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <button
          onClick={() => setBatimentsOuvert(!batimentsOuvert)}
          style={{
            width: '100%',
            padding: '0.5rem',
            background: batimentsOuvert ? '#4caf50' : '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.85rem',
            marginBottom: '0.5rem'
          }}
        >
          {batimentsOuvert ? '▼' : '▶'} Maisons & Structures
        </button>
        
        {batimentsOuvert && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <button
              onClick={onAjouterMaison}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.4rem' }}
            >
              🏠 Ajouter maison
            </button>
            <button
              onClick={onAjouterCiterne}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.4rem' }}
            >
              💧 Ajouter citerne
            </button>
            <button
              onClick={onAjouterCaissonEau}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.4rem' }}
            >
              📦 Ajouter caisson
            </button>
            <button
              onClick={onAjouterCanalisation}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.4rem' }}
            >
              🚰 Ajouter canalisation
            </button>
            <button
              onClick={onAjouterCloture}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.4rem' }}
            >
              🚧 Ajouter clôture
            </button>
            <button
              onClick={onAjouterTerrasse}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.4rem' }}
            >
              🪵 Ajouter terrasse
            </button>
            <button
              onClick={onAjouterPaves}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.4rem' }}
            >
              🟩 Ajouter pavés
            </button>
          </div>
        )}
      </div>
      
      {/* 🌱 VÉGÉTATION */}
      <div className="section-header">
        <h3 className="section-title">🌱 Végétation</h3>
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <button
          onClick={() => setVegetationOuvert(!vegetationOuvert)}
          style={{
            width: '100%',
            padding: '0.5rem',
            background: vegetationOuvert ? '#4caf50' : '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.85rem',
            marginBottom: '0.5rem'
          }}
        >
          {vegetationOuvert ? '▼' : '▶'} Arbres & Arbustes
        </button>
        
        {vegetationOuvert && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <button
              onClick={onAjouterArbre}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.4rem' }}
            >
              🌳 Ajouter arbre
            </button>
            <button
              onClick={onAjouterArbuste}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.4rem' }}
            >
              🌿 Ajouter arbuste
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionOutils;
