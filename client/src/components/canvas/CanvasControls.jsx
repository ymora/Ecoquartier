import React from 'react';
import { FaMap, FaCube } from 'react-icons/fa';
import { notifications } from '../../utils/notifications';

/**
 * Contrôles du canvas - Version refactorisée
 */
const CanvasControls = ({
  mode3D,
  onToggle3D,
  onChargerImageFond,
  onChargerPlanParDefaut,
  onGenererLogCopiable,
  imageFondChargee,
  nbObjets
}) => {
  return (
    <div className="canvas-controls">
      {/* Bouton 2D/3D */}
      <button
        onClick={onToggle3D}
        className="btn btn-primary"
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: mode3D ? '#ff9800' : '#2196f3',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '0.9rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transition: 'all 0.2s ease'
        }}
        title={mode3D ? 'Passer en vue 2D' : 'Passer en vue 3D'}
      >
        {mode3D ? <FaMap /> : <FaCube />}
        {mode3D ? 'Vue 2D' : 'Vue 3D'}
      </button>

      {/* Bouton Planifier */}
      <button
        onClick={onChargerPlanParDefaut}
        className="btn btn-warning"
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          padding: '0.5rem 1rem',
          background: '#ff9800',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '0.9rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transition: 'all 0.2s ease'
        }}
        title="Charger le plan par défaut"
      >
        🏠 Planifier
      </button>

      {/* Bouton Charger image */}
      <button
        onClick={onChargerImageFond}
        className="btn btn-secondary"
        style={{
          position: 'absolute',
          top: '50px',
          right: '10px',
          zIndex: 1000,
          padding: '0.5rem 1rem',
          background: imageFondChargee ? '#4caf50' : '#757575',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '0.9rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transition: 'all 0.2s ease'
        }}
        title="Charger une image de fond"
      >
        📷 {imageFondChargee ? 'Image chargée' : 'Image'}
      </button>

      {/* Bouton Log */}
      <button
        onClick={onGenererLogCopiable}
        className="btn btn-info"
        style={{
          position: 'absolute',
          top: '90px',
          right: '10px',
          zIndex: 1000,
          padding: '0.5rem 1rem',
          background: '#9c27b0',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '0.9rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transition: 'all 0.2s ease'
        }}
        title="Générer un log copiable"
      >
        📋 Log
      </button>

      {/* Compteur d'objets */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          zIndex: 1000,
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '0.3rem 0.6rem',
          borderRadius: '4px',
          fontSize: '0.8rem',
          fontWeight: '500'
        }}
      >
        📊 {nbObjets} objets
      </div>
    </div>
  );
};

export default CanvasControls;
