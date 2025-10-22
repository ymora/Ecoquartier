import './TimelineSection.css';

/**
 * Section réutilisable pour la timeline
 * Structure : Contrôle en haut + Texte en dessous aligné
 */
function TimelineSection({ 
  children, 
  bottomText, 
  width = 180,
  hasBorder = false 
}) {
  return (
    <div 
      className={`timeline-section ${hasBorder ? 'with-border' : ''}`}
      style={{ 
        minWidth: `${width}px`, 
        maxWidth: `${width}px`, 
        width: `${width}px` 
      }}
    >
      {/* Contrôle (slider, jauge, boutons, etc.) */}
      <div className="timeline-control">
        {children}
      </div>
      
      {/* Texte aligné en dessous */}
      {bottomText && (
        <div className="timeline-bottom-text">
          {bottomText}
        </div>
      )}
    </div>
  );
}

export default TimelineSection;

