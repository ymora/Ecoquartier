import React, { memo } from 'react';

/**
 * Composant select unifié pour tous les menus déroulants
 * Remplace tous les selects redondants avec un style cohérent
 */

const UnifiedSelect = memo(({
  value,
  onChange,
  options = [],
  placeholder = 'Sélectionner...',
  disabled = false,
  size = 'medium', // 'small', 'medium', 'large'
  variant = 'default', // 'default', 'outlined', 'filled'
  className = '',
  style = {},
  title = '',
  ...props
}) => {
  
  // Styles selon la taille
  const sizeStyles = {
    small: {
      padding: '0.25rem 0.5rem',
      fontSize: '0.75rem',
      minHeight: '28px'
    },
    medium: {
      padding: '0.4rem 0.6rem',
      fontSize: '0.875rem',
      minHeight: '36px'
    },
    large: {
      padding: '0.6rem 0.8rem',
      fontSize: '1rem',
      minHeight: '44px'
    }
  };

  // Styles selon la variante
  const variantStyles = {
    default: {
      background: 'white',
      border: '1px solid #ddd',
      borderRadius: '4px'
    },
    outlined: {
      background: 'transparent',
      border: '2px solid #2196f3',
      borderRadius: '4px'
    },
    filled: {
      background: '#f5f5f5',
      border: '1px solid #e0e0e0',
      borderRadius: '4px'
    }
  };

  const currentSize = sizeStyles[size] || sizeStyles.medium;
  const currentVariant = variantStyles[variant] || variantStyles.default;

  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`unified-select unified-select-${size} unified-select-${variant} ${className}`}
      style={{
        ...currentSize,
        ...currentVariant,
        color: '#333',
        fontWeight: '500',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        opacity: disabled ? 0.6 : 1,
        ...style
      }}
      title={title}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option, index) => {
        if (typeof option === 'string') {
          return (
            <option key={index} value={option}>
              {option}
            </option>
          );
        }
        return (
          <option key={option.value || index} value={option.value}>
            {option.label || option.text || option.value}
          </option>
        );
      })}
    </select>
  );
});

// Styles CSS pour les états hover/focus
const styles = `
.unified-select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1rem;
  padding-right: 2rem;
}

.unified-select:hover:not(:disabled) {
  border-color: #2196f3;
  background-color: #f5f5f5;
}

.unified-select:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.2);
}

.unified-select:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* Variantes spéciales */
.unified-select-outlined:hover:not(:disabled) {
  background-color: rgba(33, 150, 243, 0.05);
}

.unified-select-filled:hover:not(:disabled) {
  background-color: #eeeeee;
  border-color: #bbb;
}
`;

// Injecter les styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default UnifiedSelect;
