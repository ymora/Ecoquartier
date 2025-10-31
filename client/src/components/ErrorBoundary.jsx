import React from 'react';
import { ICONS } from '../config/icons';

/**
 * Error Boundary pour capturer les erreurs React
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    // Mettre à jour l'état pour afficher l'UI de fallback
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log l'erreur
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // UI de fallback
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2>{ICONS.error} Erreur de l'application</h2>
            <p>Une erreur inattendue s'est produite. Veuillez recharger la page.</p>
            
            {/* eslint-disable-next-line no-undef */}
            {typeof process !== 'undefined' && process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>Détails techniques</summary>
                <pre>{this.state.error && this.state.error.toString()}</pre>
                <pre>{this.state.errorInfo.componentStack}</pre>
              </details>
            )}
            
            <button 
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              {ICONS.refresh} Recharger la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
