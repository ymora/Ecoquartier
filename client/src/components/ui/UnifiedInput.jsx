import React, { memo } from 'react';
import { DeleteSimpleIcon } from '../icons/ModernIcons';

/**
 * Composant d'input unifié pour tous les contrôles numériques
 * Remplace tous les inputs redondants avec un style cohérent
 */

const UnifiedInput = memo(({
  type = 'number',
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = '',
  label = '',
  placeholder = '',
  disabled = false,
  className = '',
  style = {},
  showDelete = false,
  onDelete,
  onIncrement,
  onDecrement,
  size = 'medium' // 'small', 'medium', 'large'
}) => {
  
  // Styles unifiés selon la taille
  const sizeStyles = {
    small: {
      input: { width: '50px', padding: '0.2rem 0.3rem', fontSize: '0.7rem' },
      button: { width: '20px', height: '20px', fontSize: '0.6rem' },
      unit: { fontSize: '0.6rem' }
    },
    medium: {
      input: { width: '60px', padding: '0.3rem 0.4rem', fontSize: '0.8rem' },
      button: { width: '24px', height: '24px', fontSize: '0.7rem' },
      unit: { fontSize: '0.7rem' }
    },
    large: {
      input: { width: '80px', padding: '0.4rem 0.5rem', fontSize: '0.9rem' },
      button: { width: '28px', height: '28px', fontSize: '0.8rem' },
      unit: { fontSize: '0.8rem' }
    }
  };

  const currentSize = sizeStyles[size];

  const handleIncrement = () => {
    if (onIncrement) {
      onIncrement();
    } else if (type === 'number' && onChange) {
      const newValue = Math.min((parseFloat(value) || 0) + step, max || Infinity);
      onChange({ target: { value: newValue.toString() } });
    }
  };

  const handleDecrement = () => {
    if (onDecrement) {
      onDecrement();
    } else if (type === 'number' && onChange) {
      const newValue = Math.max((parseFloat(value) || 0) - step, min || -Infinity);
      onChange({ target: { value: newValue.toString() } });
    }
  };

  return (
    <div className={`unified-input-container ${className}`} style={style}>
      {label && (
        <label className="unified-input-label" style={{ fontSize: currentSize.unit.fontSize }}>
          {label}
        </label>
      )}
      
      <div className="unified-input-group" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
        {/* Bouton décrémenter */}
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || (type === 'number' && parseFloat(value) <= (min || -Infinity))}
          className="unified-input-button unified-input-button-decrement"
          style={{
            ...currentSize.button,
            background: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '3px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          title="Décrémenter"
        >
          −
        </button>

        {/* Input principal */}
        <input
          type={type}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          disabled={disabled}
          className="unified-input-field"
          style={{
            ...currentSize.input,
            border: '1px solid #ddd',
            borderRadius: '3px',
            textAlign: 'center',
            fontWeight: '600',
            color: '#333',
            transition: 'border-color 0.2s ease'
          }}
        />

        {/* Bouton incrémenter */}
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || (type === 'number' && parseFloat(value) >= (max || Infinity))}
          className="unified-input-button unified-input-button-increment"
          style={{
            ...currentSize.button,
            background: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '3px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          title="Incrémenter"
        >
          +
        </button>

        {/* Unité */}
        {unit && (
          <span className="unified-input-unit" style={{ ...currentSize.unit, color: '#666', fontWeight: '600' }}>
            {unit}
          </span>
        )}

        {/* Bouton de suppression */}
        {showDelete && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="unified-input-delete"
            style={{
              ...currentSize.button,
              background: '#ffebee',
              border: '1px solid #f44336',
              borderRadius: '3px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              color: '#f44336'
            }}
            title="Supprimer"
          >
            <DeleteSimpleIcon size={currentSize.button.width * 0.6} color="#f44336" />
          </button>
        )}
      </div>
    </div>
  );
});

// Styles CSS pour les états hover/focus
const styles = `
.unified-input-container {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.unified-input-label {
  font-weight: 600;
  color: #555;
  margin: 0;
}

.unified-input-group {
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.unified-input-field:focus {
  outline: none;
  border-color: #2196f3;
  background: #e3f2fd;
}

.unified-input-button:hover:not(:disabled) {
  background: #e0e0e0 !important;
  border-color: #bbb !important;
}

.unified-input-button:active:not(:disabled) {
  transform: scale(0.95);
}

.unified-input-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.unified-input-delete:hover {
  background: #f44336 !important;
  color: white !important;
}

.unified-input-delete:hover svg {
  color: white !important;
}
`;

// Injecter les styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default UnifiedInput;
