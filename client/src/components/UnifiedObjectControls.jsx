import { useState, useCallback, useMemo } from 'react';
import { useUnifiedObjectControls } from '../hooks/useUnifiedObjectControls';
import './UnifiedObjectControls.css';

/**
 * Composant de contrôles unifié pour les objets 2D/3D
 * Interface unique pour modifier les propriétés des objets
 */

function UnifiedObjectControls({ 
  objectId, 
  objectType, 
  onPropertyChange,
  className = '',
  compact = false 
}) {
  const { controls, selectedObject, isObjectSelected } = useUnifiedObjectControls();
  const [expandedSections, setExpandedSections] = useState({
    dimensions: true,
    position: true,
    properties: true
  });
  
  // Vérifier si l'objet est sélectionné
  const isSelected = isObjectSelected(objectId);
  
  // Obtenir les propriétés éditables pour ce type d'objet
  const editableProperties = useMemo(() => {
    return controls.getEditableProperties(objectType);
  }, [controls, objectType]);
  
  // Grouper les propriétés par section
  const groupedProperties = useMemo(() => {
    const groups = {
      dimensions: [],
      position: [],
      properties: []
    };
    
    editableProperties.forEach(prop => {
      if (prop.key.includes('dimensions.')) {
        groups.dimensions.push(prop);
      } else if (prop.key.includes('position.') || prop.key === 'properties.angle') {
        groups.position.push(prop);
      } else {
        groups.properties.push(prop);
      }
    });
    
    return groups;
  }, [editableProperties]);
  
  // Toggle d'une section
  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);
  
  // Mise à jour d'une propriété
  const handlePropertyChange = useCallback((propertyKey, value) => {
    controls.updateNestedProperty(objectId, propertyKey, value);
    
    // Callback personnalisé si fourni
    if (onPropertyChange) {
      onPropertyChange(propertyKey, value);
    }
  }, [controls, objectId, onPropertyChange]);
  
  // Rendu d'un champ de propriété
  const renderPropertyField = useCallback((property) => {
    const currentValue = controls.getPropertyValue(objectId, property.key);
    const displayValue = currentValue !== null ? currentValue : property.min;
    
    return (
      <div key={property.key} className="property-field">
        <label className="property-label">
          {property.label}
        </label>
        <div className="property-controls">
          <button
            type="button"
            onClick={() => {
              const newValue = Math.max(property.min, displayValue - property.step);
              handlePropertyChange(property.key, newValue);
            }}
            disabled={displayValue <= property.min}
            className="property-button property-button-minus"
            title={`Diminuer ${property.label}`}
          >
            −
          </button>
          
          <div className="property-input-container">
            <input
              type="number"
              value={displayValue}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  handlePropertyChange(property.key, Math.max(property.min, Math.min(property.max, value)));
                }
              }}
              min={property.min}
              max={property.max}
              step={property.step}
              className="property-input"
            />
            <span className="property-unit">{property.unit}</span>
          </div>
          
          <button
            type="button"
            onClick={() => {
              const newValue = Math.min(property.max, displayValue + property.step);
              handlePropertyChange(property.key, newValue);
            }}
            disabled={displayValue >= property.max}
            className="property-button property-button-plus"
            title={`Augmenter ${property.label}`}
          >
            +
          </button>
        </div>
      </div>
    );
  }, [controls, objectId, handlePropertyChange]);
  
  // Rendu d'une section
  const renderSection = useCallback((sectionKey, sectionName, properties, icon) => {
    if (properties.length === 0) return null;
    
    const isExpanded = expandedSections[sectionKey];
    
    return (
      <div key={sectionKey} className="property-section">
        <button
          type="button"
          onClick={() => toggleSection(sectionKey)}
          className={`section-header ${isExpanded ? 'expanded' : ''}`}
        >
          <span className="section-icon">{icon}</span>
          <span className="section-title">{sectionName}</span>
          <span className="section-toggle">
            {isExpanded ? '▼' : '▶'}
          </span>
        </button>
        
        {isExpanded && (
          <div className="section-content">
            {properties.map(renderPropertyField)}
          </div>
        )}
      </div>
    );
  }, [expandedSections, toggleSection, renderPropertyField]);
  
  // Actions rapides
  const renderQuickActions = useCallback(() => {
    if (!isSelected) return null;
    
    return (
      <div className="quick-actions">
        <button
          type="button"
          onClick={() => controls.duplicateObject(objectId)}
          className="quick-action-button"
          title="Dupliquer l'objet"
        >
          📋 Dupliquer
        </button>
        
        <button
          type="button"
          onClick={() => controls.removeObject(objectId)}
          className="quick-action-button danger"
          title="Supprimer l'objet"
        >
          🗑️ Supprimer
        </button>
      </div>
    );
  }, [isSelected, controls, objectId]);
  
  // Informations sur l'objet
  const renderObjectInfo = useCallback(() => {
    if (!selectedObject) return null;
    
    return (
      <div className="object-info">
        <div className="object-type">
          {getObjectIcon(objectType)} {getObjectTypeName(objectType)}
        </div>
        <div className="object-id">
          ID: {objectId}
        </div>
      </div>
    );
  }, [selectedObject, objectType, objectId]);
  
  if (!isSelected) {
    return (
      <div className={`unified-object-controls ${className}`}>
        <div className="no-selection">
          <div className="no-selection-icon">🎯</div>
          <div className="no-selection-text">
            Sélectionnez un objet pour voir ses contrôles
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`unified-object-controls ${className} ${compact ? 'compact' : ''}`}>
      {renderObjectInfo()}
      
      <div className="controls-content">
        {renderSection('dimensions', '📏 Dimensions', groupedProperties.dimensions, '📏')}
        {renderSection('position', '📍 Position', groupedProperties.position, '📍')}
        {renderSection('properties', '⚙️ Propriétés', groupedProperties.properties, '⚙️')}
      </div>
      
      {renderQuickActions()}
    </div>
  );
}

// Fonctions utilitaires
function getObjectIcon(objectType) {
  const icons = {
    maison: '🏠',
    citerne: '💧',
    canalisation: '🚰',
    cloture: '🚧',
    terrasse: '🏡',
    pave: '🟩',
    arbre: '🌳'
  };
  return icons[objectType] || '📦';
}

function getObjectTypeName(objectType) {
  const names = {
    maison: 'Maison',
    citerne: 'Citerne',
    canalisation: 'Canalisation',
    cloture: 'Clôture',
    terrasse: 'Terrasse',
    pave: 'Pavés',
    arbre: 'Arbre'
  };
  return names[objectType] || 'Objet';
}

export default UnifiedObjectControls;