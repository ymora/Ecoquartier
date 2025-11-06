/**
 * Sidebar Neo Garden - Panneau latéral rétractable
 */
import { memo, useState } from 'react';
import { 
  FaHome, FaTree, FaSeedling, FaRuler, FaPalette, 
  FaChartBar, FaCog, FaChevronLeft, FaChevronRight 
} from 'react-icons/fa';

const NeoSidebar = memo(({ children, onItemClick }) => {
  const [collapsed, setCollapsed] = useState(false);

  const sections = [
    {
      title: 'Objets',
      items: [
        { id: 'maison', icon: <FaHome />, label: 'Maison' },
        { id: 'terrain', icon: <FaRuler />, label: 'Terrain' },
        { id: 'infrastructure', icon: <FaCog />, label: 'Infrastructures' }
      ]
    },
    {
      title: 'Végétation',
      items: [
        { id: 'arbres', icon: <FaTree />, label: 'Arbres' },
        { id: 'arbustes', icon: <FaSeedling />, label: 'Arbustes' }
      ]
    },
    {
      title: 'Affichage',
      items: [
        { id: 'style', icon: <FaPalette />, label: 'Style' },
        { id: 'stats', icon: <FaChartBar />, label: 'Statistiques' }
      ]
    }
  ];

  return (
    <aside className={`neo-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="neo-sidebar-content">
        {sections.map((section, idx) => (
          <div key={idx} className="neo-sidebar-section">
            <div className="neo-sidebar-section-title">{section.title}</div>
            {section.items.map(item => (
              <button
                key={item.id}
                className="neo-sidebar-item"
                onClick={() => onItemClick?.(item.id)}
                title={item.label}
              >
                <span className="neo-sidebar-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        ))}
        
        {children && (
          <div className="neo-sidebar-section">
            {children}
          </div>
        )}
      </div>

      <button
        className="neo-sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? 'Étendre' : 'Réduire'}
      >
        {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>
    </aside>
  );
});

NeoSidebar.displayName = 'NeoSidebar';

export default NeoSidebar;

