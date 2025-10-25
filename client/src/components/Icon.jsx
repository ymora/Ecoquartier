/**
 * Composant d'icônes professionnelles unifié
 */

import { ICONS } from '../config/icons';

const Icon = ({ name, size = 'md', color = 'primary', className = '', ...props }) => {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm', 
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl'
  };

  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
    info: 'text-info'
  };

  return (
    <span 
      className={`icon ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      {...props}
    >
      {ICONS[name] || '❓'}
    </span>
  );
};

export default Icon;
