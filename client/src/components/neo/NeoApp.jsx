/**
 * Wrapper principal Neo Garden
 * Applique le thème sombre à toute l'application
 */
import { memo, useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import NeoHeader from './NeoHeader';
import NeoTimeline from './NeoTimeline';
import useLocalStorage from '../../hooks/useLocalStorage';
import '../../styles/neo-garden.css';

const NeoApp = memo(({ 
  currentMode,
  onModeChange,
  sidebarContent,
  canvasContent,
  timelineProps,
  showTimeline = false,
  showSidebar = true
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage('neoSidebarCollapsed', false);

  // Activer le thème Neo au montage
  useEffect(() => {
    document.body.classList.add('neo-theme');
    return () => {
      document.body.classList.remove('neo-theme');
    };
  }, []);

  return (
    <div className="neo-app">
      <NeoHeader
        currentMode={currentMode}
        onModeChange={onModeChange}
        isDarkTheme={true}
        onThemeToggle={() => {}} // Neo Garden est toujours en mode sombre
      />

      <div className="neo-main">
        {/* Sidebar optionnelle */}
        {showSidebar && sidebarContent && (
          <aside className={`neo-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
            <div className="neo-sidebar-content">
              {sidebarContent}
            </div>
            
            <button
              className="neo-sidebar-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? 'Étendre' : 'Réduire'}
            >
              {sidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
            </button>
          </aside>
        )}

        {/* Canvas/Contenu principal */}
        <main className={`neo-canvas ${!showSidebar || !sidebarContent ? 'full-width' : ''}`}>
          {canvasContent}
        </main>
      </div>

      {/* Timeline optionnelle */}
      {showTimeline && timelineProps && (
        <NeoTimeline {...timelineProps} />
      )}
    </div>
  );
});

NeoApp.displayName = 'NeoApp';

export default NeoApp;
