import React, { memo } from 'react';
import { DeleteIcon, TrashIcon } from '../icons/ModernIcons';

/**
 * Composant bouton unifié pour tous les boutons de l'application
 * Remplace tous les boutons redondants avec un style cohérent
 */

const UnifiedButton = memo(({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary', 'secondary', 'danger', 'success', 'warning', 'info'
  size = 'medium', // 'small', 'medium', 'large'
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left', // 'left', 'right', 'only'
  className = '',
  style = {},
  title = '',
  ...props
}) => {
  
  // Styles de base selon la variante
  const variantStyles = {
    primary: {
      background: '#2196f3',
      color: 'white',
      border: '1px solid #1976d2',
      hover: { background: '#1976d2' }
    },
    secondary: {
      background: '#f5f5f5',
      color: '#333',
      border: '1px solid #ddd',
      hover: { background: '#e0e0e0' }
    },
    danger: {
      background: '#f44336',
      color: 'white',
      border: '1px solid #d32f2f',
      hover: { background: '#d32f2f' }
    },
    success: {
      background: '#4caf50',
      color: 'white',
      border: '1px solid #388e3c',
      hover: { background: '#388e3c' }
    },
    warning: {
      background: '#ff9800',
      color: 'white',
      border: '1px solid #f57c00',
      hover: { background: '#f57c00' }
    },
    info: {
      background: '#00bcd4',
      color: 'white',
      border: '1px solid #0097a7',
      hover: { background: '#0097a7' }
    }
  };

  // Styles selon la taille
  const sizeStyles = {
    small: {
      padding: '0.25rem 0.5rem',
      fontSize: '0.75rem',
      minHeight: '28px'
    },
    medium: {
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      minHeight: '36px'
    },
    large: {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      minHeight: '44px'
    }
  };

  const currentVariant = variantStyles[variant] || variantStyles.primary;
  const currentSize = sizeStyles[size] || sizeStyles.medium;

  // Rendu de l'icône
  const renderIcon = () => {
    if (!icon) return null;
    
    const iconSize = size === 'small' ? 14 : size === 'large' ? 20 : 16;
    
    // Icônes spéciales
    if (icon === 'delete') {
      return <DeleteIcon size={iconSize} color="currentColor" />;
    }
    if (icon === 'trash') {
      return <TrashIcon size={iconSize} color="currentColor" />;
    }
    
    // Icône générique (emoji ou texte)
    return <span style={{ fontSize: iconSize }}>{icon}</span>;
  };

  // Rendu du contenu
  const renderContent = () => {
    if (iconPosition === 'only') {
      return renderIcon();
    }
    
    if (icon && iconPosition === 'left') {
      return (
        <>
          {renderIcon()}
          {children && <span style={{ marginLeft: '0.5rem' }}>{children}</span>}
        </>
      );
    }
    
    if (icon && iconPosition === 'right') {
      return (
        <>
          {children && <span style={{ marginRight: '0.5rem' }}>{children}</span>}
          {renderIcon()}
        </>
      );
    }
    
    return children;
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`unified-button unified-button-${variant} unified-button-${size} ${className}`}
      style={{
        ...currentVariant,
        ...currentSize,
        borderRadius: '4px',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.25rem',
        transition: 'all 0.2s ease',
        opacity: disabled || loading ? 0.6 : 1,
        ...style
      }}
      title={title}
      {...props}
    >
      {loading && (
        <span 
          style={{ 
            width: '16px', 
            height: '16px', 
            border: '2px solid transparent',
            borderTop: '2px solid currentColor',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: '0.5rem'
          }}
        />
      )}
      {renderContent()}
    </button>
  );
});

// Styles CSS pour les états hover/focus
const styles = `
.unified-button {
  position: relative;
  overflow: hidden;
}

.unified-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.unified-button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.unified-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.3);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Variantes spéciales */
.unified-button-danger:hover:not(:disabled) {
  background: #d32f2f !important;
}

.unified-button-success:hover:not(:disabled) {
  background: #388e3c !important;
}

.unified-button-warning:hover:not(:disabled) {
  background: #f57c00 !important;
}

.unified-button-info:hover:not(:disabled) {
  background: #0097a7 !important;
}

/* Tailles spéciales */
.unified-button-small {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}

.unified-button-large {
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
}
`;

// Injecter les styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default UnifiedButton;
