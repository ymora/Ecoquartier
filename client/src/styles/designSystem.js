/**
 * Variables CSS centralisées pour éviter la duplication de styles
 * Utilisées dans tous les composants pour un design cohérent
 */

export const COULEURS = {
  // Couleurs principales
  primaire: '#2196f3',
  secondaire: '#4caf50',
  accent: '#ff9800',
  danger: '#f44336',
  warning: '#ff9800',
  success: '#4caf50',
  info: '#2196f3',
  
  // Couleurs de fond
  fond: '#f5f5f5',
  fondCard: '#ffffff',
  fondHover: '#e3f2fd',
  
  // Couleurs de texte
  texte: '#333333',
  texteSecondaire: '#666666',
  texteInverse: '#ffffff',
  
  // Couleurs d'objets
  maison: '#4caf50',
  terrasse: '#9e9e9e',
  paves: '#8bc34a',
  caissonEau: '#1565c0',
  citerne: '#2196f3',
  arbre: '#4caf50',
  canalisation: '#757575',
  cloture: '#ffd54f'
};

export const TAILLES = {
  // Bordures
  bordure: '1px solid #e0e0e0',
  bordureRadius: '8px',
  bordureRadiusPetit: '4px',
  
  // Espacements
  padding: '0.75rem',
  paddingPetit: '0.5rem',
  paddingGrand: '1rem',
  margin: '0.5rem',
  marginPetit: '0.25rem',
  marginGrand: '1rem',
  
  // Tailles de police
  fontSize: '0.9rem',
  fontSizePetit: '0.8rem',
  fontSizeGrand: '1.1rem',
  fontSizeTitre: '1.2rem',
  
  // Hauteurs
  hauteurBouton: '2.5rem',
  hauteurInput: '2rem',
  hauteurCard: 'auto'
};

export const OMBRES = {
  legere: '0 2px 4px rgba(0,0,0,0.1)',
  normale: '0 4px 8px rgba(0,0,0,0.15)',
  forte: '0 8px 16px rgba(0,0,0,0.2)',
  hover: '0 6px 12px rgba(0,0,0,0.25)'
};

export const TRANSITIONS = {
  rapide: 'all 0.2s ease',
  normale: 'all 0.3s ease',
  lente: 'all 0.5s ease'
};

/**
 * Styles de boutons standardisés
 */
export const STYLES_BOUTONS = {
  primaire: {
    background: `linear-gradient(135deg, ${COULEURS.primaire} 0%, #1976d2 100%)`,
    color: COULEURS.texteInverse,
    border: 'none',
    borderRadius: TAILLES.bordureRadius,
    padding: TAILLES.padding,
    fontSize: TAILLES.fontSize,
    fontWeight: '600',
    cursor: 'pointer',
    transition: TRANSITIONS.normale,
    boxShadow: OMBRES.legere,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: OMBRES.hover
    }
  },
  
  secondaire: {
    background: `linear-gradient(135deg, ${COULEURS.secondaire} 0%, #388e3c 100%)`,
    color: COULEURS.texteInverse,
    border: 'none',
    borderRadius: TAILLES.bordureRadius,
    padding: TAILLES.padding,
    fontSize: TAILLES.fontSize,
    fontWeight: '600',
    cursor: 'pointer',
    transition: TRANSITIONS.normale,
    boxShadow: OMBRES.legere
  },
  
  danger: {
    background: `linear-gradient(135deg, ${COULEURS.danger} 0%, #d32f2f 100%)`,
    color: COULEURS.texteInverse,
    border: 'none',
    borderRadius: TAILLES.bordureRadius,
    padding: TAILLES.padding,
    fontSize: TAILLES.fontSize,
    fontWeight: '600',
    cursor: 'pointer',
    transition: TRANSITIONS.normale,
    boxShadow: OMBRES.legere
  }
};

/**
 * Styles de cartes standardisés
 */
export const STYLES_CARTES = {
  base: {
    background: COULEURS.fondCard,
    borderRadius: TAILLES.bordureRadius,
    padding: TAILLES.padding,
    boxShadow: OMBRES.legere,
    border: TAILLES.bordure,
    transition: TRANSITIONS.normale
  },
  
  hover: {
    transform: 'translateY(-2px)',
    boxShadow: OMBRES.normale
  }
};

/**
 * Styles d'inputs standardisés
 */
export const STYLES_INPUTS = {
  base: {
    width: '100%',
    padding: TAILLES.paddingPetit,
    border: TAILLES.bordure,
    borderRadius: TAILLES.bordureRadiusPetit,
    fontSize: TAILLES.fontSize,
    transition: TRANSITIONS.rapide,
    '&:focus': {
      outline: 'none',
      borderColor: COULEURS.primaire,
      boxShadow: `0 0 0 2px ${COULEURS.primaire}20`
    }
  }
};
