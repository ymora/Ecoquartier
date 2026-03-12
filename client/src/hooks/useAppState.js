import { useState } from 'react';
import plantesData from '../data/arbustesData';

/**
 * Hook personnalisé pour gérer l'état global de l'application.
 * Améliore la lisibilité de App.jsx et facilite les tests.
 */
export const useAppState = () => {
    const [theme, setTheme] = useState('dark');
    const [mode, setMode] = useState('explorer'); // 'explorer', 'planner', 'eco-guide'
    const [selectedPlants, setSelectedPlants] = useState([plantesData[0]]);
    const [inspectedPlant, setInspectedPlant] = useState(null);
    const [search, setSearch] = useState('');
    const [logViewerOpen, setLogViewerOpen] = useState(false);
    const [arbresExpanded, setArbresExpanded] = useState(true);
    const [arbustesExpanded, setArbustesExpanded] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // États pour la timeline du planificateur
    const [anneeProjection, setAnneeProjection] = useState(0);
    const [heureJournee, setHeureJournee] = useState(90);
    const [saison, setSaison] = useState('ete');

    // Callbacks pour les actions du canvas
    const [canvasActions, setCanvasActions] = useState({
        chargerPlan: null,
        chargerImageFond: null,
        exporterPlan: null
    });

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    };

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    return {
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
    };
};
