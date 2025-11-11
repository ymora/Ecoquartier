/**
 * APP CLEAN - Interface Complètement Nouvelle
 * Intègre le mode planificateur 2D/3D complet
 */
import { useState, lazy, Suspense } from 'react';
import './styles-v2/reset.css';
import './styles-v2/design-tokens.css';
import './styles-v2/neo-bridge.css';
import './styles-v2/app-clean.css';
import './styles-v2/planner-theme-fix.css';
import plantesData from './data/arbustesData';

// Lazy load des composants lourds
const CanvasTerrain = lazy(() => import('./components/CanvasTerrain'));

// Composants
import PlantDetailWithImages from './components/PlantDetailWithImages';
import ComparisonTable from './components/ComparisonTable';
import LogViewer from './components/LogViewer';

export default function AppClean() {
  const [theme, setTheme] = useState('dark');
  const [mode, setMode] = useState('explorer'); // 'explorer' ou 'planner'
  const [selectedPlants, setSelectedPlants] = useState([plantesData[0]]);
  const [search, setSearch] = useState('');
  const [logViewerOpen, setLogViewerOpen] = useState(false);
  const [arbresExpanded, setArbresExpanded] = useState(true);
  const [arbustesExpanded, setArbustesExpanded] = useState(true);
  
  // États pour la timeline du planificateur
  const [anneeProjection, setAnneeProjection] = useState(0);
  const [heureJournee, setHeureJournee] = useState(90);
  const [saison, setSaison] = useState('ete');
  
  // Callbacks pour les actions du menu déroulant
  const [canvasActions, setCanvasActions] = useState({
    chargerPlan: null,
    chargerImageFond: null,
    exporterPlan: null
  });

  // Appliquer le thème au chargement et aux changements
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // Filtrer les plantes selon la recherche
  const filteredPlants = plantesData.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-clean">
      {/* HEADER */}
      <header className="header-clean">
        <div className="header-brand" style={{ position: 'relative' }}>
          <div className="logo">🌳</div>
          <div className="header-title-menu">
            <h1>Haies Bessancourt</h1>
            <p>Écocartier</p>
            
            {/* Menu déroulant au survol */}
            {mode === 'planner' && (
              <div className="dropdown-menu-header">
                <div className="dropdown-menu-content">
                  <div className="dropdown-menu-title">📁 Gestion du plan</div>
                  <button 
                    className="dropdown-menu-item"
                    onClick={() => canvasActions.chargerPlan && canvasActions.chargerPlan()}
                    disabled={!canvasActions.chargerPlan}
                  >
                    <span className="dropdown-icon">📂</span>
                    <span>Charger mon plan</span>
                  </button>
                  <button 
                    className="dropdown-menu-item"
                    onClick={() => canvasActions.chargerImageFond && canvasActions.chargerImageFond()}
                    disabled={!canvasActions.chargerImageFond}
                  >
                    <span className="dropdown-icon">📍</span>
                    <span>Plan cadastral</span>
                  </button>
                  <button 
                    className="dropdown-menu-item"
                    onClick={() => canvasActions.exporterPlan && canvasActions.exporterPlan()}
                    disabled={!canvasActions.exporterPlan}
                  >
                    <span className="dropdown-icon">💾</span>
                    <span>Exporter mon plan</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <nav className="header-nav">
          <button
            className={mode === 'explorer' ? 'active' : ''}
            onClick={() => setMode('explorer')}
          >
            🌿 Explorer
          </button>
          <button
            className={mode === 'planner' ? 'active' : ''}
            onClick={() => setMode('planner')}
          >
            🌳 Planifier
          </button>
          
          {/* ✅ Bouton Admin - Visible UNIQUEMENT en développement */}
          {import.meta.env.DEV && (
            <button
              className="admin-shortcut"
              onClick={() => window.open('http://localhost:3001', '_blank')}
              title="Ouvrir l'interface admin (upload images)"
              style={{
                position: 'absolute',
                right: '1rem',
                padding: '0.5rem 1rem',
                background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(255, 152, 0, 0.3)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #f57c00 0%, #e65100 100%)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(255, 152, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(255, 152, 0, 0.3)';
              }}
            >
              ⚙️ Admin
            </button>
          )}
        </nav>

        <div className="header-actions">
          <button onClick={toggleTheme} title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button onClick={() => setLogViewerOpen(true)} title="Journal des logs (Debug)">
            🐛
          </button>
        </div>
      </header>

      <div className="app-body">
        {/* SIDEBAR */}
        {mode === 'explorer' && (
          <aside className="sidebar-clean">
            <div className="search-box">
              <input
                type="text"
                placeholder="Rechercher une plante..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="plant-list">
              {/* Section Arbres */}
              <div className="plant-category">
                <button 
                  className="category-header"
                  onClick={() => setArbresExpanded(!arbresExpanded)}
                >
                  <span className="category-icon">{arbresExpanded ? '▼' : '▶'}</span>
                  <span className="category-title">🌳 Arbres</span>
                  <span className="category-count">
                    ({filteredPlants.filter(p => p.type === 'arbre').length})
                  </span>
                </button>
                
                {arbresExpanded && filteredPlants.filter(p => p.type === 'arbre').map(plant => {
                  const isSelected = selectedPlants.some(p => p.id === plant.id);
                  return (
                    <div
                      key={plant.id}
                      className={`plant-item ${isSelected ? 'active' : ''}`}
                      onClick={() => {
                        if (isSelected && selectedPlants.length > 1) {
                          setSelectedPlants(selectedPlants.filter(p => p.id !== plant.id));
                        } else if (!isSelected) {
                          setSelectedPlants([...selectedPlants, plant]);
                        }
                      }}
                    >
                      <div className="plant-icon">🌳</div>
                      <div className="plant-info">
                        <h3>{plant.name}</h3>
                        <p>{plant.tailleMaturite}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Section Arbustes */}
              <div className="plant-category">
                <button 
                  className="category-header"
                  onClick={() => setArbustesExpanded(!arbustesExpanded)}
                >
                  <span className="category-icon">{arbustesExpanded ? '▼' : '▶'}</span>
                  <span className="category-title">🌿 Arbustes</span>
                  <span className="category-count">
                    ({filteredPlants.filter(p => p.type === 'arbuste').length})
                  </span>
                </button>
                
                {arbustesExpanded && filteredPlants.filter(p => p.type === 'arbuste').map(plant => {
                  const isSelected = selectedPlants.some(p => p.id === plant.id);
                  return (
                    <div
                      key={plant.id}
                      className={`plant-item ${isSelected ? 'active' : ''}`}
                      onClick={() => {
                        if (isSelected && selectedPlants.length > 1) {
                          setSelectedPlants(selectedPlants.filter(p => p.id !== plant.id));
                        } else if (!isSelected) {
                          setSelectedPlants([...selectedPlants, plant]);
                        }
                      }}
                    >
                      <div className="plant-icon">🌿</div>
                      <div className="plant-info">
                        <h3>{plant.name}</h3>
                        <p>{plant.tailleMaturite}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        )}

        {/* CONTENT */}
        <main className="content-clean">
          {mode === 'explorer' && selectedPlants.length === 1 && (
            <PlantDetailWithImages plant={selectedPlants[0]} />
          )}

          {mode === 'explorer' && selectedPlants.length > 1 && (
            <ComparisonTable plants={selectedPlants} />
          )}

          {mode === 'planner' && (
            <Suspense fallback={<div className="loading">Chargement du planificateur...</div>}>
              <CanvasTerrain
                anneeProjection={anneeProjection}
                heureJournee={heureJournee}
                saison={saison}
                onActionsReady={setCanvasActions}
              />
            </Suspense>
          )}
        </main>

        {/* Timeline compacte en bas pour le planificateur */}
        {mode === 'planner' && (
          <div className="timeline-compact">
            <div className="timeline-item">
              <span className="timeline-label">📅</span>
              <input
                type="range"
                min="0"
                max="30"
                value={anneeProjection}
                onChange={(e) => setAnneeProjection(Number(e.target.value))}
                title="Croissance (0-30 ans)"
              />
              <span className="timeline-val">{anneeProjection}a</span>
            </div>

            <div className="timeline-item">
              <span className="timeline-label">🕐</span>
              <input
                type="range"
                min="0"
                max="180"
                step="10"
                value={heureJournee}
                onChange={(e) => setHeureJournee(Number(e.target.value))}
                title="Heure de la journée"
              />
              <span className="timeline-val">{Math.floor(heureJournee / 15) + 6}h</span>
            </div>

            <div className="timeline-item">
              <div className="season-compact">
                {[
                  { id: 'printemps', icon: '🌸' },
                  { id: 'ete', icon: '☀️' },
                  { id: 'automne', icon: '🍂' },
                  { id: 'hiver', icon: '❄️' }
                ].map(s => (
                  <button
                    key={s.id}
                    className={`season-compact-btn ${saison === s.id ? 'active' : ''}`}
                    onClick={() => setSaison(s.id)}
                    title={s.id.charAt(0).toUpperCase() + s.id.slice(1)}
                  >
                    {s.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Log Viewer */}
      {logViewerOpen && (
        <LogViewer 
          isOpen={logViewerOpen}
          onClose={() => setLogViewerOpen(false)}
        />
      )}
    </div>
  );
}

