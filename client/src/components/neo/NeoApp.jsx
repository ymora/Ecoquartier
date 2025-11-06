/**
 * Wrapper principal pour l'interface Neo Garden
 */
import { memo, useEffect } from 'react';
import NeoHeader from './NeoHeader';
import NeoSidebar from './NeoSidebar';
import NeoTimeline from './NeoTimeline';
import useLocalStorage from '../../hooks/useLocalStorage';
import '../../styles/neo-garden.css';

const NeoApp = memo(({ 
  currentMode,
  onModeChange,
  sidebarContent,
  canvasContent,
  timelineProps,
  showTimeline = true
}) => {
  const [isDarkTheme, setIsDarkTheme] = useLocalStorage('neoTheme', true);

  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.add('neo-theme');
    } else {
      document.body.classList.remove('neo-theme');
    }
  }, [isDarkTheme]);

  return (
    <div className="neo-app">
      <NeoHeader
        currentMode={currentMode}
        onModeChange={onModeChange}
        isDarkTheme={isDarkTheme}
        onThemeToggle={() => setIsDarkTheme(!isDarkTheme)}
      />

      <div className="neo-main">
        <NeoSidebar>
          {sidebarContent}
        </NeoSidebar>

        <main className="neo-canvas">
          {canvasContent}
        </main>
      </div>

      {showTimeline && timelineProps && (
        <NeoTimeline {...timelineProps} />
      )}
    </div>
  );
});

NeoApp.displayName = 'NeoApp';

export default NeoApp;

