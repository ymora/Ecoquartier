import { useState, useEffect } from 'react';
import { getLogHistory, exportLogs, clearLogs, showLogStats } from '../utils/logger';
import './LogViewer.css';

function LogViewer({ isOpen, onClose }) {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState({ level: '', component: '' });
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Charger les logs
  const refreshLogs = () => {
    const history = getLogHistory(filter);
    setLogs(history);
  };

  // Auto-refresh toutes les 2 secondes
  useEffect(() => {
    if (!isOpen || !autoRefresh) return;
    
    refreshLogs();
    const interval = setInterval(refreshLogs, 2000);
    
    return () => clearInterval(interval);
  }, [isOpen, autoRefresh, filter]);

  // Charger au montage
  useEffect(() => {
    if (isOpen) {
      refreshLogs();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Composants uniques pour filtres
  const components = [...new Set(logs.map(log => log.component).filter(Boolean))];
  
  // Icônes par niveau
  const getLevelIcon = (level) => {
    switch (level) {
      case 'debug': return '🔍';
      case 'info': return 'ℹ️';
      case 'warn': return '⚠️';
      case 'error': return '❌';
      default: return '•';
    }
  };

  // Couleur par niveau
  const getLevelClass = (level) => {
    return `log-level-${level}`;
  };

  const handleExport = () => {
    exportLogs();
    alert('✅ Logs exportés en JSON !');
  };

  const handleClear = () => {
    if (confirm('Effacer tous les logs ?')) {
      clearLogs();
      refreshLogs();
    }
  };

  const handleStats = () => {
    showLogStats();
    alert('📊 Statistiques affichées dans la console');
  };

  return (
    <div className="log-viewer-overlay" onClick={onClose}>
      <div className="log-viewer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="log-viewer-header">
          <h3>🔍 Journal des logs</h3>
          <div className="log-viewer-controls">
            <label>
              <input 
                type="checkbox" 
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              Auto-refresh
            </label>
            <button onClick={refreshLogs} title="Rafraîchir">🔄</button>
            <button onClick={handleStats} title="Statistiques">📊</button>
            <button onClick={handleExport} title="Exporter JSON">💾</button>
            <button onClick={handleClear} title="Effacer">🗑️</button>
            <button onClick={onClose} title="Fermer">✖️</button>
          </div>
        </div>

        {/* Filtres */}
        <div className="log-viewer-filters">
          <select 
            value={filter.level} 
            onChange={(e) => setFilter({ ...filter, level: e.target.value })}
          >
            <option value="">Tous niveaux</option>
            <option value="debug">🔍 Debug</option>
            <option value="info">ℹ️ Info</option>
            <option value="warn">⚠️ Warning</option>
            <option value="error">❌ Error</option>
          </select>

          <select 
            value={filter.component} 
            onChange={(e) => setFilter({ ...filter, component: e.target.value })}
          >
            <option value="">Tous composants</option>
            {components.map(comp => (
              <option key={comp} value={comp}>{comp}</option>
            ))}
          </select>

          <span className="log-count">{logs.length} log{logs.length > 1 ? 's' : ''}</span>
        </div>

        {/* Liste des logs */}
        <div className="log-viewer-content">
          {logs.length === 0 ? (
            <div className="log-empty">Aucun log à afficher</div>
          ) : (
            <table className="log-table">
              <thead>
                <tr>
                  <th>Heure</th>
                  <th>Niveau</th>
                  <th>Composant</th>
                  <th>Message</th>
                  <th>Données</th>
                </tr>
              </thead>
              <tbody>
                {logs.slice().reverse().map((log, index) => (
                  <tr key={index} className={getLevelClass(log.level)}>
                    <td className="log-time">{log.timestampFormatted}</td>
                    <td className="log-level">
                      {getLevelIcon(log.level)} {log.level}
                    </td>
                    <td className="log-component">{log.component || '-'}</td>
                    <td className="log-message">{log.message}</td>
                    <td className="log-data">
                      {log.data ? (
                        <details>
                          <summary>Voir données</summary>
                          <pre>{JSON.stringify(log.data, null, 2)}</pre>
                        </details>
                      ) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="log-viewer-footer">
          <span>💡 Utilisez aussi: window.planificateurLogs dans la console</span>
        </div>
      </div>
    </div>
  );
}

export default LogViewer;

