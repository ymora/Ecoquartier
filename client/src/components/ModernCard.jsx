/**
 * Composant Card moderne et réutilisable
 */
import { memo } from 'react';
import './ModernCard.css';

const ModernCard = memo(({ 
  children, 
  title, 
  subtitle,
  icon,
  actions,
  variant = 'default', // 'default', 'outlined', 'elevated', 'gradient'
  hover = false,
  className = '',
  onClick,
  ...props 
}) => {
  const cardClasses = [
    'modern-card',
    `modern-card-${variant}`,
    hover && 'modern-card-hover',
    onClick && 'modern-card-clickable',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={onClick} {...props}>
      {(title || icon || actions) && (
        <div className="modern-card-header">
          <div className="modern-card-header-left">
            {icon && <div className="modern-card-icon">{icon}</div>}
            <div className="modern-card-titles">
              {title && <h3 className="modern-card-title">{title}</h3>}
              {subtitle && <p className="modern-card-subtitle">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="modern-card-actions">{actions}</div>}
        </div>
      )}
      
      <div className="modern-card-body">
        {children}
      </div>
    </div>
  );
});

ModernCard.displayName = 'ModernCard';

export default ModernCard;

/**
 * Composant CardGrid pour afficher plusieurs cartes
 */
export const ModernCardGrid = memo(({ children, columns = 3, gap = 'md', className = '' }) => {
  const gridClasses = [
    'modern-card-grid',
    `modern-card-grid-${columns}`,
    `gap-${gap}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
});

ModernCardGrid.displayName = 'ModernCardGrid';

/**
 * Composant pour les statistiques dans une carte
 */
export const CardStat = memo(({ label, value, icon, trend, trendValue }) => (
  <div className="card-stat">
    <div className="card-stat-header">
      {icon && <span className="card-stat-icon">{icon}</span>}
      <span className="card-stat-label">{label}</span>
    </div>
    <div className="card-stat-value">{value}</div>
    {trend && (
      <div className={`card-stat-trend trend-${trend}`}>
        {trend === 'up' && '↑'}
        {trend === 'down' && '↓'}
        {trendValue && ` ${trendValue}`}
      </div>
    )}
  </div>
));

CardStat.displayName = 'CardStat';

