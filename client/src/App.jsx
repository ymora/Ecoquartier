/**
 * Application principale "Les Haies de Bessancourt"
 */
import { useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from './hooks/useAppState';
import { useIsMobile } from './hooks/useIsMobile';
import { useTranslation } from 'react-i18next';
import './styles-v2/reset.css';
import './styles-v2/design-tokens.css';
import './styles-v2/app.css';
import './styles-v2/planner-theme-fix.css';
import './styles-v2/inspector-modal.css'; // Modal d'inspection
import plantesData from './data/arbustesData';
import './i18n'; // Import i18n configuration

// Lazy load des composants lourds
const CanvasTerrain = lazy(() => import('./components/CanvasTerrain'));
const EcoGuide = lazy(() => import('./components/EcoGuide'));

// Composants
import PlantDetailWithImages from './components/PlantDetailWithImages';
import ComparisonTable from './components/ComparisonTable';
import LogViewer from './components/LogViewer';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  const { t } = useTranslation();
  const {
    theme, setTheme,
    mode, setMode,
    selectedPlants, setSelectedPlants,
    inspectedPlant, setInspectedPlant,
    search, setSearch,
    logViewerOpen, setLogViewerOpen,
    arbresExpanded, setArbresExpanded,
    arbustesExpanded, setArbustesExpanded,
    sidebarOpen, toggleSidebar, closeSidebar,
    anneeProjection, setAnneeProjection,
    heureJournee, setHeureJournee,
    saison, setSaison,
    canvasActions, setCanvasActions,
    toggleTheme
  } = useAppState();

  const isMobile = useIsMobile(768);

  // Fermer la sidebar automatiquement lors d'un passage Desktop -> Mobile pour éviter l'overlay bloquant
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      closeSidebar();
    }
  }, [isMobile]);


  // Appliquer le thème au chargement et aux changements
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
  }

  // Filtrer les plantes selon la recherche
  const filteredPlants = plantesData.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ErrorBoundary>
      <div className="app">
        {/* HEADER */}
        <header className="header-clean">
          <div className="header-brand" style={{ position: 'relative' }}>
            {/* ✅ Bouton Hamburger (Mobile uniquement) */}
            <button
              className={`hamburger-btn ${sidebarOpen ? 'active' : ''}`}
              onClick={toggleSidebar}
              aria-label="Menu"
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
            <div className="logo">🌳</div>
            <div className="header-title-menu">
              <h1>{t('app.title')}</h1>
              <p>{t('app.subtitle')}</p>

              {/* Menu déroulant au survol */}
              {mode === 'planner' && (
                <div className="dropdown-menu-header">
                  <div className="dropdown-menu-content">
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

          <nav className={`header-nav ${sidebarOpen && mode !== 'explorer' ? 'mobile-open' : ''}`}>
            <button
              className={mode === 'explorer' ? 'active' : ''}
              onClick={() => { setMode('explorer'); if (isMobile) toggleSidebar(); }}
              aria-label="Mode exploration des plantes"
            >
              🌿 {t('app.modes.explorer')}
            </button>
            <button
              className={mode === 'planner' ? 'active' : ''}
              onClick={() => { setMode('planner'); if (isMobile && sidebarOpen) toggleSidebar(); }}
              aria-label="Mode planification de haies"
            >
              🌳 {t('app.modes.planner')}
            </button>
            <button
              className={mode === 'eco-guide' ? 'active' : ''}
              onClick={() => { setMode('eco-guide'); if (isMobile && sidebarOpen) toggleSidebar(); }}
              aria-label="Guide de l'Éco-Jardinier"
            >
              🌱 Éco-Guide
            </button>
          </nav>

          <div className="header-actions">
            {/* ✅ Bouton Admin - Visible UNIQUEMENT en développement */}
            {import.meta.env.DEV && (
              <button
                onClick={() => window.open('http://localhost:3001', '_blank')}
                title="Ouvrir l'interface admin (upload images)"
                className="header-icon-btn"
              >
                ⚙️
              </button>
            )}

            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? t('app.buttons.theme.light') : t('app.buttons.theme.dark')}
              aria-label={theme === 'dark' ? t('app.buttons.theme.light') : t('app.buttons.theme.dark')}
              className="header-icon-btn"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => setLogViewerOpen(true)}
              title={t('app.buttons.logs')}
              aria-label={t('app.buttons.logs')}
              className="header-icon-btn"
            >
              🐛
            </button>
          </div>
        </header>

        <div className={`app-body ${sidebarOpen ? 'sidebar-visible' : ''}`}>
          <AnimatePresence mode="wait">
            {mode === 'explorer' && (
              <motion.aside 
                key="sidebar"
                initial={{ x: -280, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -280, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={`sidebar-clean ${sidebarOpen ? 'open' : ''}`}
              >
                <div className="search-box">
                  <input
                    type="text"
                    placeholder={t('app.search.placeholder')}
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
              </motion.aside>
            )}
          </AnimatePresence>

          {/* CONTENT */}
          <main className={`content-clean ${sidebarOpen ? 'sidebar-open' : ''}`} onClick={closeSidebar}>
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                style={{ height: '100%', width: '100%' }}
              >
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
                      onPlantSelect={setInspectedPlant}
                    />
                  </Suspense>
                )}

                {/* Modal d'Inspection (Mode Planner) */}
                {mode === 'planner' && inspectedPlant && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`plant-inspector-modal ${theme}`}
                  >
                    <div className="plant-inspector-header">
                      <h2>{inspectedPlant.name}</h2>
                      <button
                        className="close-inspector-btn"
                        onClick={() => setInspectedPlant(null)}
                        title="Fermer"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="plant-inspector-content">
                      <PlantDetailWithImages plant={inspectedPlant} />
                    </div>
                  </motion.div>
                )}

                {mode === 'eco-guide' && (
                  <Suspense fallback={<div className="loading">Chargement du guide...</div>}>
                    <EcoGuide />
                  </Suspense>
                )}
              </motion.div>
            </AnimatePresence>
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
    </ErrorBoundary>
  );
}

