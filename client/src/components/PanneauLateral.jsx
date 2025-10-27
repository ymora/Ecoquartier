import { useState, useEffect, useRef, memo } from 'react';
import SolInteractif from './SolInteractif';
import plantesData from '../data/arbustesData';
import './PanneauLateral.css';
import { 
  highlightHover, 
  unhighlightHover, 
  highlightSelection, 
  unhighlightSelection 
} from '../utils/canvas/highlightUtils';

/**
 * Panneau latéral avec onglets pour outils et configuration
 */
function PanneauLateral({ 
  canvas,
  couchesSol,
  onCouchesSolChange,
  dimensions,
  echelle = 40, // Échelle par défaut (40 pixels = 1 mètre)
  onDimensionsChange,
  imageFondChargee,
  opaciteImage,
  onAjouterMaison,
  onAjouterTerrasse,
  onAjouterPaves,
  onAjouterCanalisation,
  onAjouterCiterne,
  onAjouterCaissonEau,
  onAjouterCloture,
  onVerrouillerSelection,
  onSupprimerSelection,
  onEffacerTout,
  onChargerPlanParDefaut,
  onChargerImageFond,
  onAjusterOpaciteImage,
  onSupprimerImageFond,
  onResetZoom,
  onExporterPlan,
  onLoggerComplet,
  onExporterComplet,
  onAjouterArbrePlante,
  onRetirerArbrePlante,
  onSyncKeyChange,
  ongletActifExterne = null
}) {
  const [ongletActif, setOngletActif] = useState('outils');
  const [objetSelectionne, setObjetSelectionne] = useState(null);
  const [arbreSelectionne, setArbreSelectionne] = useState(plantesData[0].id);
  const [arbresOuvert, setArbresOuvert] = useState(false);
  const [arbustesOuvert, setArbustesOuvert] = useState(false);
  const [batimentsOuvert, setBatimentsOuvert] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [reseauxOuvert, setReseauxOuvert] = useState(false);
  const [actionsOuvert, setActionsOuvert] = useState(false);
  const [surPlanOuvert, setSurPlanOuvert] = useState(true); // Ouvert par défaut
  
  // États pour sections repliables dans Config
  const [dimensionsOuvert, setDimensionsOuvert] = useState(true);
  const [positionOuvert, setPositionOuvert] = useState(true);
  const [profondeursOuvert, setProfondeursOuvert] = useState(true);
  const [toitOuvert, setToitOuvert] = useState(true);
  
  // État pour forcer le re-render des dimensions
  const [dimensionUpdate, setDimensionUpdate] = useState(0);
  
  // Ref pour stocker l'objet précédemment sélectionné (évite boucle infinie)
  const objetSelectionnePrecedentRef = useRef(null);
  
  useEffect(() => {
    if (ongletActifExterne) {
      setOngletActif(ongletActifExterne);
    }
  }, [ongletActifExterne]);
  
  // Séparer arbres et arbustes
  const arbres = plantesData.filter(p => p.type === 'arbre');
  const arbustes = plantesData.filter(p => !p.type || p.type === 'arbuste');
  
  const styles = {
    boutonSection: (ouvert, couleur) => ({
      width: '100%',
      padding: '0.6rem',
      background: ouvert ? couleur : 'white',
      color: ouvert ? 'white' : '#333',
      border: `1px solid ${couleur}`,
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '0.85rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'all 0.2s'
    }),
    conteneurListe: {
      marginTop: '0.3rem',
      background: 'white',
      borderRadius: '4px',
      border: '1px solid #ddd'
    },
    boutonListe: {
      width: '100%',
      padding: '0.5rem',
      background: 'white',
      color: '#333',
      border: 'none',
      borderBottom: '1px solid #f0f0f0',
      cursor: 'pointer',
      fontSize: '0.85rem',
      fontWeight: '500',
      textAlign: 'left',
      transition: 'background 0.2s'
    },
    boutonListeDernier: {
      width: '100%',
      padding: '0.5rem',
      background: 'white',
      color: '#333',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.85rem',
      fontWeight: '500',
      textAlign: 'left',
      transition: 'background 0.2s'
    },
    boutonSupprimer: {
      background: '#f44336',
      color: 'white',
      border: 'none',
      borderRadius: '3px',
      padding: '0.2rem 0.4rem',
      cursor: 'pointer',
      fontSize: '0.7rem',
      transition: 'transform 0.2s'
    },
    ligneObjet: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.3rem',
      marginBottom: '0.2rem',
      background: 'white',
      borderRadius: '3px',
      fontSize: '0.75rem',
      cursor: 'pointer'
    }
  };
  
  const creerBoutonAction = (onClick, texte, couleur = '#333', estDanger = false) => (
    <button 
      onClick={onClick}
      style={{
        ...styles.boutonListeDernier,
        color: estDanger ? '#f44336' : couleur,
        borderBottom: '1px solid #f0f0f0'
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = estDanger ? '#ffebee' : '#f1f8e9'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
    >
      {texte}
    </button>
  );
  
  const creerBoutonOutil = (onClick, icone, texte, titre, estDernier = false) => (
    <button 
      onClick={onClick}
      title={titre}
      style={estDernier ? styles.boutonListeDernier : styles.boutonListe}
      onMouseEnter={(e) => e.currentTarget.style.background = '#f1f8e9'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
    >
      {icone} {texte}
    </button>
  );
  
  const creerEnTeteSection = (ouvert, setOuvert, titre, couleur) => (
    <button
      onClick={() => setOuvert(!ouvert)}
      style={styles.boutonSection(ouvert, couleur)}
    >
      <span>{titre}</span>
      <span style={{ fontSize: '1rem' }}>{ouvert ? '▼' : '▶'}</span>
    </button>
  );
  
  // Gérer la sélection d'objets
  useEffect(() => {
    if (!canvas) return;
    
    const handleSelection = (e) => {
      const obj = e.selected?.[0];
      if (obj && (obj.customType === 'maison' || obj.customType === 'citerne' || 
                  obj.customType === 'caisson-eau' || obj.customType === 'canalisation' || 
                  obj.customType === 'cloture' || obj.customType === 'terrasse' || 
                  obj.customType === 'paves' || obj.customType === 'arbre-a-planter' ||
                  obj.customType === 'arbre-existant')) {
        // Retirer la mise en évidence de l'objet précédent s'il y en a un
        if (objetSelectionnePrecedentRef.current) {
          unhighlightSelection(objetSelectionnePrecedentRef.current, canvas);
        }
        setObjetSelectionne(obj);
        objetSelectionnePrecedentRef.current = obj;
        // Mettre en évidence visuellement l'objet sélectionné (vert)
        highlightSelection(obj, canvas);
        setOngletActif('config');
      } else {
        // Retirer la mise en évidence de l'objet précédent
        if (objetSelectionnePrecedentRef.current) {
          unhighlightSelection(objetSelectionnePrecedentRef.current, canvas);
        }
        setObjetSelectionne(null);
        objetSelectionnePrecedentRef.current = null;
      }
    };
    
    const handleDeselection = () => {
      // Retirer la mise en évidence de l'objet précédent
      if (objetSelectionnePrecedentRef.current) {
        unhighlightSelection(objetSelectionnePrecedentRef.current, canvas);
      }
      setObjetSelectionne(null);
      objetSelectionnePrecedentRef.current = null;
    };
    
    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', handleDeselection);
    
    return () => {
      canvas.off('selection:created', handleSelection);
      canvas.off('selection:updated', handleSelection);
      canvas.off('selection:cleared', handleDeselection);
    };
  }, [canvas]);
  
  const updateObjetProp = (prop, value) => {
    if (objetSelectionne && canvas) {
      if (prop === 'typeToit') {
        objetSelectionne.set({ [prop]: value });
      } else {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return;
      objetSelectionne.set({ [prop]: numValue });
      }
      
      objetSelectionne.setCoords();
      canvas.requestRenderAll();
      
      if (onSyncKeyChange) {
        onSyncKeyChange(Date.now());
      }
      
      canvas.fire('object:modified', { target: objetSelectionne });
      
      if (onExporterPlan) {
        setTimeout(() => onExporterPlan(canvas), 100);
      }
    }
  };

  const renderNumberInput = (label, value, onChange, min, max, step, unit = 'm', disabled = false) => {
    const isDisabled = disabled || (min === max && value === min.toString());
    
    return (
      <div className="config-row">
        <label>{label}</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <button
            type="button"
            onClick={() => {
              if (isDisabled) return;
              const normalizedValue = typeof value === 'string' ? parseFloat(value) : value;
              const currentValue = isNaN(normalizedValue) ? min : normalizedValue;
              const newValue = Math.max(min, currentValue - step);
              onChange({ target: { value: newValue.toString() } });
            }}
            disabled={isDisabled}
            style={{
              background: isDisabled ? '#e0e0e0' : '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              width: '33px',
              height: '33px',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              opacity: isDisabled ? 0.5 : 1
            }}
          >
            −
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <input 
              type="text" 
              value={value}
              onChange={onChange}
              disabled={isDisabled}
              style={{ 
                width: '60px', 
                minWidth: '50px', 
                flexShrink: 1,
                background: isDisabled ? '#f5f5f5' : 'white',
                cursor: isDisabled ? 'not-allowed' : 'text'
              }}
            />
            <span style={{ fontSize: '0.75rem', color: '#888', fontWeight: '600', flexShrink: 0 }}>{unit}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (isDisabled) return;
              const normalizedValue = typeof value === 'string' ? parseFloat(value) : value;
              const currentValue = isNaN(normalizedValue) ? min : normalizedValue;
              const newValue = Math.min(max, currentValue + step);
              onChange({ target: { value: newValue.toString() } });
            }}
            disabled={isDisabled}
            style={{
              background: isDisabled ? '#e0e0e0' : '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              width: '33px',
              height: '33px',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              opacity: isDisabled ? 0.5 : 1
            }}
          >
            +
          </button>
        </div>
      </div>
    );
  };

  const renderDimensionInput = (label, prop, min, max, step) => {
    const getValue = () => {
      if (prop === 'width') {
        return ((objetSelectionne.getScaledWidth ? objetSelectionne.getScaledWidth() : objetSelectionne.width) / echelle).toFixed(2);
      } else {
        return ((objetSelectionne.getScaledHeight ? objetSelectionne.getScaledHeight() : objetSelectionne.height) / echelle).toFixed(2);
      }
    };
    
    const handleChange = (e) => {
      const value = parseFloat(e.target.value);
      
      if (objetSelectionne.type === 'group') {
        // Pour les groupes, mettre à jour les éléments internes
        const objects = objetSelectionne.getObjects();
        objects.forEach(obj => {
          if (obj.type === 'rect') {
            if (prop === 'width') {
              obj.set({ width: value * echelle });
            } else {
              obj.set({ height: value * echelle });
            }
          } else if (obj.type === 'text') {
            // Ajuster la taille de l'icône proportionnellement
            const newSize = Math.min(value * echelle * 0.4, value * echelle * 0.4);
            obj.set({ fontSize: Math.max(newSize, 24) });
          }
        });
      }
      
      if (prop === 'width') {
        updateObjetProp('width', (value * echelle).toString());
      } else {
        updateObjetProp('height', (value * echelle).toString());
      }
      canvas.fire('object:modified', { target: objetSelectionne });
      
      setDimensionUpdate(prev => prev + 1);
    };
    
    return renderNumberInput(label, getValue(), handleChange, min, max, step, 'm');
  };

  return (
    <div className="panneau-lateral">
      {/* Boutons de chargement - TOUJOURS VISIBLES */}
      <div style={{ padding: '0.75rem', borderBottom: '2px solid #1976d2', background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)' }}>
        {/* Bouton Charger plan par défaut */}
        <button
          className="btn btn-warning btn-full"
          onClick={onChargerPlanParDefaut}
          title="Charger le plan par défaut avec 2 maisons, terrasses, pavés..."
          style={{ 
            background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.7rem 1rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 3px 6px rgba(255, 152, 0, 0.3)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 12px rgba(255, 152, 0, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 3px 6px rgba(255, 152, 0, 0.3)';
          }}
        >
          🏠 Charger plan par défaut
        </button>
        
        {/* Bouton Charger plan de fond */}
        <button
          className={`btn btn-full ${imageFondChargee ? 'btn-success' : 'btn-primary'}`}
          onClick={onChargerImageFond}
          title="Charger plan cadastral, photo aérienne..."
          style={{
            background: imageFondChargee ? 
              'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)' : 
              'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.7rem 1rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: imageFondChargee ? 
              '0 3px 6px rgba(76, 175, 80, 0.3)' : 
              '0 3px 6px rgba(33, 150, 243, 0.3)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => {
            if (imageFondChargee) {
              e.target.style.background = 'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)';
              e.target.style.boxShadow = '0 6px 12px rgba(76, 175, 80, 0.4)';
            } else {
              e.target.style.background = 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)';
              e.target.style.boxShadow = '0 6px 12px rgba(33, 150, 243, 0.4)';
            }
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            if (imageFondChargee) {
              e.target.style.background = 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)';
              e.target.style.boxShadow = '0 3px 6px rgba(76, 175, 80, 0.3)';
            } else {
              e.target.style.background = 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)';
              e.target.style.boxShadow = '0 3px 6px rgba(33, 150, 243, 0.3)';
            }
            e.target.style.transform = 'translateY(0)';
          }}
        >
          📷 {imageFondChargee ? 'Image chargée' : 'Charger plan de fond'}
        </button>
        
        {/* Contrôles d'opacité si image chargée */}
        {imageFondChargee && (
          <div style={{ 
            marginTop: '0.5rem',
            background: 'white',
            borderRadius: '6px',
            border: '1px solid #ddd',
            padding: '0.5rem'
          }}>
            <label style={{ fontSize: '0.75rem', color: '#1976d2', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>
              Opacité: {Math.round(opaciteImage * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={opaciteImage}
              onChange={(e) => onAjusterOpaciteImage(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
            <button
              onClick={onSupprimerImageFond}
              style={{
                width: '100%',
                marginTop: '0.3rem',
                padding: '0.4rem',
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}
            >
              🗑️ Supprimer image
            </button>
          </div>
        )}
      </div>

      {/* En-tête avec onglets */}
      <div className="tabs">
        <button 
          className={`tab ${ongletActif === 'outils' ? 'active' : ''}`}
          onClick={() => setOngletActif('outils')}
        >
          ⚙️ Outils
        </button>
        <button 
          className={`tab ${ongletActif === 'config' ? 'active' : ''}`}
          onClick={() => setOngletActif('config')}
        >
          📋 Config
        </button>
      </div>

      {/* Contenu selon onglet actif */}
      {ongletActif === 'config' ? (
        <div className="panneau-outils-content">
          {/* COMPOSITION DU SOL */}
          <div className="section-header">
            <h3 className="section-title">🌍 Composition du sol</h3>
          </div>
          <SolInteractif 
            couchesSol={couchesSol} 
            onCouchesSolChange={onCouchesSolChange} 
          />
          
          <div className="info-box info-box-info" style={{ marginTop: '0.5rem' }}>
            📏 Profondeur totale : {couchesSol ? (couchesSol.reduce((sum, c) => sum + c.profondeur, 0) / 100).toFixed(2) : 0} m
          </div>
          
          {/* Bouton pour accéder aux couches végétales dans l'onglet Config */}
          {!objetSelectionne && (
            <button
              onClick={() => setOngletActif('config')}
              className="btn btn-primary btn-full"
              style={{ marginTop: '0.5rem' }}
            >
              ⚙️ Ouvrir configuration des couches
            </button>
          )}
          
          {/* OBJET SÉLECTIONNÉ */}
          {objetSelectionne && (
            <>
              <div className="section-title">🎯 Objet sélectionné</div>
              <div className="info-box" style={{ background: '#fff3e0', borderColor: '#ff9800' }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                {objetSelectionne.customType === 'maison' && '🏠 Maison'}
                {objetSelectionne.customType === 'citerne' && '💧 Citerne'}
                  {objetSelectionne.customType === 'caisson-eau' && '🟦 Caisson eau'}
                {objetSelectionne.customType === 'canalisation' && '🚰 Canalisation'}
                {objetSelectionne.customType === 'cloture' && '🚧 Clôture'}
                  {objetSelectionne.customType === 'terrasse' && '🏡 Terrasse'}
                  {objetSelectionne.customType === 'paves' && '🟩 Pavés'}
                  {objetSelectionne.customType === 'arbre-a-planter' && `🌳 ${objetSelectionne.arbreData?.name || 'Arbre'}`}
                  {objetSelectionne.customType === 'arbre-existant' && '🌳 Arbre existant'}
                </div>
              </div>
              
              {objetSelectionne.customType === 'maison' && (
                <>
                  {/* POSITION */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => setPositionOuvert(!positionOuvert)}
                      style={styles.boutonSection(positionOuvert, '#2196f3')}
                    >
                      <span>📍 Position</span>
                      <span style={{ fontSize: '1rem' }}>{positionOuvert ? '▼' : '▶'}</span>
                    </button>
                    {positionOuvert && (
                      <div style={styles.conteneurListe}>
                        {renderNumberInput(
                          'Rotation',
                          Math.round(objetSelectionne.angle || 0).toString(),
                          (e) => updateObjetProp('angle', e.target.value),
                          0, 360, 5, '°'
                        )}
                        {renderNumberInput(
                          'Élévation rel. sol',
                          (objetSelectionne.elevationSol || 0).toString(),
                          (e) => updateObjetProp('elevationSol', e.target.value),
                          -5, 10, 0.1, 'm'
                        )}
                      </div>
                    )}
                  </div>

                  {/* DIMENSIONS */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => setDimensionsOuvert(!dimensionsOuvert)}
                      style={styles.boutonSection(dimensionsOuvert, '#4caf50')}
                    >
                      <span>📏 Dimensions</span>
                      <span style={{ fontSize: '1rem' }}>{dimensionsOuvert ? '▼' : '▶'}</span>
                    </button>
                    {dimensionsOuvert && (
                      <div style={styles.conteneurListe}>
                        {renderDimensionInput('Largeur', 'width', 2, 30, 0.1)}
                        {renderDimensionInput('Profondeur', 'height', 2, 30, 0.1)}
                        {renderNumberInput(
                          'Hauteur',
                          (objetSelectionne.hauteur || 7).toString(),
                          (e) => updateObjetProp('hauteur', e.target.value),
                          3, 15, 0.5, 'm'
                        )}
                      </div>
                    )}
                  </div>

                  {/* TYPE DE TOIT */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => setToitOuvert(!toitOuvert)}
                      style={styles.boutonSection(toitOuvert, '#ff9800')}
                    >
                      <span>🏠 Type de toit</span>
                      <span style={{ fontSize: '1rem' }}>{toitOuvert ? '▼' : '▶'}</span>
                    </button>
                    {toitOuvert && (
                      <div style={styles.conteneurListe}>
                        <div style={{ padding: '0.5rem', fontSize: '0.85rem' }}>
                          <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>
                            Sélectionner le type de toit :
                          </label>
                          {['plan', 'monopente', 'deux-pentes'].map((type) => (
                            <label key={type} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.2rem', cursor: 'pointer' }}>
                              <input
                                type="radio"
                                name="typeToit"
                                value={type}
                                checked={(objetSelectionne.typeToit || 'deux-pentes') === type}
                                onChange={(e) => updateObjetProp('typeToit', e.target.value)}
                                style={{ marginRight: '0.5rem' }}
                              />
                              <span style={{ textTransform: 'capitalize' }}>
                                {type === 'deux-pentes' ? 'Deux pentes traditionnelles' : 
                                 type === 'monopente' ? 'Monopente' : 
                                 'Plan'}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* TYPE DE TOIT */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => setProfondeursOuvert(!profondeursOuvert)}
                      style={styles.boutonSection(profondeursOuvert, '#ff9800')}
                    >
                      <span>🏠 Type de toit</span>
                      <span style={{ fontSize: '1rem' }}>{profondeursOuvert ? '▼' : '▶'}</span>
                    </button>
                    {profondeursOuvert && (
                      <div style={styles.conteneurListe}>
                        <div className="config-row">
                          <label>Type de toit</label>
                          <select
                            value={objetSelectionne.typeToit || '2pans'}
                            onChange={(e) => updateObjetProp('typeToit', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.3rem',
                              border: '1px solid #ddd',
                              borderRadius: '4px',
                              fontSize: '0.8rem'
                            }}
                          >
                            <option value="2pans">🏠 2 pans (classique)</option>
                            <option value="monopente">🏠 Monopente</option>
                            <option value="plat">🏠 Plat</option>
                          </select>
                        </div>
                        {(objetSelectionne.typeToit === 'monopente' || objetSelectionne.typeToit === '2pans') && (
                          <div className="config-row" style={{ marginTop: '0.5rem' }}>
                            <label>Pente du toit</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <button
                                onClick={() => updateObjetProp('penteToit', Math.max(1, (objetSelectionne.penteToit || 3) - 1))}
                                style={{
                                  background: '#f44336',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '3px',
                                  padding: '0.2rem 0.4rem',
                                  fontSize: '0.7rem',
                                  cursor: 'pointer'
                                }}
                              >
                                -
                              </button>
                              <input
                                type="number"
                                value={Math.round(objetSelectionne.penteToit || 3)}
                                onChange={(e) => updateObjetProp('penteToit', e.target.value)}
                                min="1"
                                max="60"
                                step="1"
                                style={{
                                  width: '60px',
                                  padding: '0.2rem',
                                  border: '1px solid #ddd',
                                  borderRadius: '3px',
                                  fontSize: '0.8rem',
                                  textAlign: 'center'
                                }}
                              />
                              <button
                                onClick={() => updateObjetProp('penteToit', Math.min(60, (objetSelectionne.penteToit || 3) + 1))}
                                style={{
                                  background: '#4caf50',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '3px',
                                  padding: '0.2rem 0.4rem',
                                  fontSize: '0.7rem',
                                  cursor: 'pointer'
                                }}
                              >
                                +
                              </button>
                              <span style={{ fontSize: '0.7rem', color: '#666' }}>°</span>
                            </div>
                          </div>
                        )}
                        {(objetSelectionne.typeToit === 'monopente' || objetSelectionne.typeToit === '2pans') && (
                          <div className="config-row" style={{ marginTop: '0.5rem' }}>
                            <label>Orientation pente</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <button
                                onClick={() => updateObjetProp('orientationToit', ((objetSelectionne.orientationToit || 0) - 90 + 360) % 360)}
                                style={{
                                  background: '#f44336',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '3px',
                                  padding: '0.2rem 0.4rem',
                                  fontSize: '0.7rem',
                                  cursor: 'pointer'
                                }}
                              >
                                ↺
                              </button>
                              <select
                                value={objetSelectionne.orientationToit || 0}
                                onChange={(e) => updateObjetProp('orientationToit', parseInt(e.target.value))}
                                style={{
                                  width: '100px',
                                  padding: '0.2rem',
                                  border: '1px solid #ddd',
                                  borderRadius: '3px',
                                  fontSize: '0.8rem'
                                }}
                              >
                                <option value={0}>Nord (0°)</option>
                                <option value={90}>Est (90°)</option>
                                <option value={180}>Sud (180°)</option>
                                <option value={270}>Ouest (270°)</option>
                              </select>
                              <button
                                onClick={() => updateObjetProp('orientationToit', ((objetSelectionne.orientationToit || 0) + 90) % 360)}
                                style={{
                                  background: '#4caf50',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '3px',
                                  padding: '0.2rem 0.4rem',
                                  fontSize: '0.7rem',
                                  cursor: 'pointer'
                                }}
                              >
                                ↻
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {objetSelectionne.customType === 'citerne' && (
                <>
                  {/* DIMENSIONS */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => setDimensionsOuvert(!dimensionsOuvert)}
                      style={styles.boutonSection(dimensionsOuvert, '#4caf50')}
                    >
                      <span>📏 Dimensions</span>
                      <span style={{ fontSize: '1rem' }}>{dimensionsOuvert ? '▼' : '▶'}</span>
                    </button>
                    {dimensionsOuvert && (
                      <div style={styles.conteneurListe}>
                        {renderNumberInput(
                          'Diamètre',
                          (objetSelectionne.diametre || 1.5).toString(),
                          (e) => updateObjetProp('diametre', e.target.value),
                          0.5, 3, 0.1, 'm'
                        )}
                        {renderNumberInput(
                          'Longueur',
                          (objetSelectionne.longueur || 2.5).toString(),
                          (e) => updateObjetProp('longueur', e.target.value),
                          1, 5, 0.5, 'm'
                        )}
                        <div className="info-box">
                          💧 Volume : {(Math.PI * Math.pow((objetSelectionne.diametre || 1.5) / 2, 2) * (objetSelectionne.longueur || 2.5)).toFixed(2)}m³
                        </div>
                      </div>
                    )}
                  </div>

                  {/* POSITION */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => setPositionOuvert(!positionOuvert)}
                      style={styles.boutonSection(positionOuvert, '#2196f3')}
                    >
                      <span>📍 Position</span>
                      <span style={{ fontSize: '1rem' }}>{positionOuvert ? '▼' : '▶'}</span>
                    </button>
                    {positionOuvert && (
                      <div style={styles.conteneurListe}>
                        {renderNumberInput(
                          'Élévation sol (m)',
                          (objetSelectionne.elevationSol || 0).toString(),
                          (e) => updateObjetProp('elevationSol', e.target.value),
                          -5, 5, 0.1, 'm'
                        )}
                        <div className="info-box" style={{ background: '#fff3e0', padding: '0.5rem', marginTop: '0.5rem' }}>
                          💡 Négatif = enterré (ex: -2.5m sous terre)
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {objetSelectionne.customType === 'caisson-eau' && (
                <>
                  {/* POSITION */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => setPositionOuvert(!positionOuvert)}
                      style={styles.boutonSection(positionOuvert, '#2196f3')}
                    >
                      <span>📍 Position</span>
                      <span style={{ fontSize: '1rem' }}>{positionOuvert ? '▼' : '▶'}</span>
                    </button>
                    {positionOuvert && (
                      <div style={styles.conteneurListe}>
                        {renderNumberInput(
                          'Rotation',
                          Math.round(objetSelectionne.angle || 0).toString(),
                          (e) => updateObjetProp('angle', e.target.value),
                          0, 360, 5, '°'
                        )}
                        {renderNumberInput(
                          'Élévation sol (m)',
                          (objetSelectionne.elevationSol || 0).toString(),
                          (e) => updateObjetProp('elevationSol', e.target.value),
                          -3, 5, 0.1, 'm'
                        )}
                        <div className="info-box" style={{ background: '#fff3e0', padding: '0.5rem', marginTop: '0.5rem' }}>
                          💡 Négatif = enterré (ex: -1m sous terre)
                        </div>
                      </div>
                    )}
                  </div>

                  {/* DIMENSIONS */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => setDimensionsOuvert(!dimensionsOuvert)}
                      style={styles.boutonSection(dimensionsOuvert, '#4caf50')}
                    >
                      <span>📏 Dimensions</span>
                      <span style={{ fontSize: '1rem' }}>{dimensionsOuvert ? '▼' : '▶'}</span>
                    </button>
                    {dimensionsOuvert && (
                      <div style={styles.conteneurListe}>
                        {renderNumberInput(
                          'Largeur',
                          (objetSelectionne.largeur || 5).toString(),
                          (e) => updateObjetProp('largeur', e.target.value),
                          1, 10, 0.5, 'm'
                        )}
                        {renderNumberInput(
                          'Profondeur',
                          (objetSelectionne.profondeur || 3).toString(),
                          (e) => updateObjetProp('profondeur', e.target.value),
                          1, 10, 0.5, 'm'
                        )}
                        {renderNumberInput(
                          'Hauteur',
                          (objetSelectionne.hauteur || 1).toString(),
                          (e) => updateObjetProp('hauteur', e.target.value),
                          0.5, 3, 0.1, 'm'
                        )}
                  <div className="info-box">
                    💧 Volume : {((objetSelectionne.largeur || 5) * (objetSelectionne.profondeur || 3) * (objetSelectionne.hauteur || 1)).toFixed(2)}m³
                  </div>
                </div>
                    )}
                  </div>

                </>
              )}
              
              {objetSelectionne.customType === 'terrasse' && (
                <>
                  {/* POSITION */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => setPositionOuvert(!positionOuvert)}
                      style={styles.boutonSection(positionOuvert, '#2196f3')}
                    >
                      <span>📍 Position</span>
                      <span style={{ fontSize: '1rem' }}>{positionOuvert ? '▼' : '▶'}</span>
                    </button>
                    {positionOuvert && (
                      <div style={styles.conteneurListe}>
                        {renderNumberInput(
                          'Rotation',
                          Math.round(objetSelectionne.angle || 0).toString(),
                          (e) => updateObjetProp('angle', e.target.value),
                          0, 360, 5, '°'
                        )}
                        {renderNumberInput(
                          '⚠️ Élévation sol (m)',
                          (objetSelectionne.elevationSol || 0).toString(),
                          (e) => updateObjetProp('elevationSol', e.target.value),
                          -2, 2, 0.1, 'm'
                        )}
                      </div>
                    )}
                  </div>

                  {/* DIMENSIONS */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => setDimensionsOuvert(!dimensionsOuvert)}
                      style={styles.boutonSection(dimensionsOuvert, '#4caf50')}
                    >
                      <span>📏 Dimensions</span>
                      <span style={{ fontSize: '1rem' }}>{dimensionsOuvert ? '▼' : '▶'}</span>
                    </button>
                    {dimensionsOuvert && (
                      <div style={styles.conteneurListe}>
                        {renderDimensionInput('Largeur', 'width', 1, 20, 0.1)}
                        {renderDimensionInput('Profondeur', 'height', 1, 20, 0.1)}
                        {renderNumberInput(
                          'Hauteur dalle',
                          (objetSelectionne.hauteurDalle || 0.15).toString(),
                          (e) => updateObjetProp('hauteurDalle', e.target.value),
                          -1, 1, 0.05, 'm'
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {objetSelectionne.customType === 'paves' && (
                <>
                  {/* POSITION */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => setPositionOuvert(!positionOuvert)}
                      style={styles.boutonSection(positionOuvert, '#2196f3')}
                    >
                      <span>📍 Position</span>
                      <span style={{ fontSize: '1rem' }}>{positionOuvert ? '▼' : '▶'}</span>
                    </button>
                    {positionOuvert && (
                      <div style={styles.conteneurListe}>
                        {renderNumberInput(
                          'Rotation',
                          Math.round(objetSelectionne.angle || 0).toString(),
                          (e) => updateObjetProp('angle', e.target.value),
                          0, 360, 5, '°'
                        )}
                        {renderNumberInput(
                          '⚠️ Élévation sol (m)',
                          (objetSelectionne.elevationSol || 0).toString(),
                          (e) => updateObjetProp('elevationSol', e.target.value),
                          -2, 2, 0.1, 'm'
                        )}
                      </div>
                    )}
                  </div>

                  {/* DIMENSIONS */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => setDimensionsOuvert(!dimensionsOuvert)}
                      style={styles.boutonSection(dimensionsOuvert, '#4caf50')}
                    >
                      <span>📏 Dimensions</span>
                      <span style={{ fontSize: '1rem' }}>{dimensionsOuvert ? '▼' : '▶'}</span>
                    </button>
                    {dimensionsOuvert && (
                      <div style={styles.conteneurListe}>
                        {renderDimensionInput('Largeur', 'width', 1, 20, 0.1)}
                        {renderDimensionInput('Profondeur', 'height', 1, 20, 0.1)}
                        {renderNumberInput(
                          'Hauteur',
                          (objetSelectionne.hauteur || 0.08).toString(),
                          (e) => updateObjetProp('hauteur', e.target.value),
                          0.05, 0.2, 0.01, 'm'
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {objetSelectionne.customType === 'canalisation' && (
                <>
                  {/* POSITION */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => setPositionOuvert(!positionOuvert)}
                      style={styles.boutonSection(positionOuvert, '#2196f3')}
                    >
                      <span>📍 Position</span>
                      <span style={{ fontSize: '1rem' }}>{positionOuvert ? '▼' : '▶'}</span>
                    </button>
                    {positionOuvert && (
                      <div style={styles.conteneurListe}>
                        {renderNumberInput(
                          'Élévation sol (m)',
                          (objetSelectionne.elevationSol || 0).toString(),
                          (e) => updateObjetProp('elevationSol', e.target.value),
                          -2, 5, 0.1, 'm'
                        )}
                        <div className="info-box" style={{ background: '#fff3e0', padding: '0.5rem', marginTop: '0.5rem' }}>
                          💡 Négatif = enterré (ex: -0.6m sous terre)
                        </div>
                      </div>
                    )}
                  </div>

                  {/* DIMENSIONS */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <button
                      onClick={() => setDimensionsOuvert(!dimensionsOuvert)}
                      style={styles.boutonSection(dimensionsOuvert, '#4caf50')}
                    >
                      <span>📏 Dimensions</span>
                      <span style={{ fontSize: '1rem' }}>{dimensionsOuvert ? '▼' : '▶'}</span>
                    </button>
                    {dimensionsOuvert && (
                      <div style={styles.conteneurListe}>
                        {renderNumberInput(
                          'Diamètre',
                          (objetSelectionne.diametre || 0.1).toString(),
                          (e) => updateObjetProp('diametre', e.target.value),
                          0.05, 0.5, 0.05, 'm'
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {objetSelectionne.customType === 'cloture' && (
                <div className="objet-controls">
                  {renderNumberInput(
                    'Hauteur',
                    (objetSelectionne.hauteur || 1.5).toString(),
                    (e) => updateObjetProp('hauteur', e.target.value),
                    0.5, 3, 0.1, 'm'
                  )}
                  <div className="objet-controls">
                    {renderNumberInput(
                      'Épaisseur',
                      '5',
                      () => {}, // Désactivé - aucune action
                      5, 5, 1, 'cm'
                    )}
                  </div>
                </div>
              )}
              
              {/* ✅ Arbre existant : 3 dimensions éditables */}
              {objetSelectionne.customType === 'arbre-existant' && (
                <div className="objet-controls">
                  {renderNumberInput(
                    'Ø Couronne (m)',
                    (objetSelectionne.diametreArbre || 5).toString(),
                    (e) => {
                      const newDiam = parseFloat(e.target.value);
                      const newRadius = (newDiam / 2) * canvas.getZoom() * 20; // Approximation échelle
                      objetSelectionne.set({ diametreArbre: newDiam });
                      // Redimensionner le cercle
                      if (objetSelectionne._objects && objetSelectionne._objects[0]) {
                        objetSelectionne._objects[0].set({ radius: newRadius });
                      }
                      objetSelectionne.setCoords();
                      canvas.requestRenderAll();
                      if (onExporterPlan) {
                        setTimeout(() => onExporterPlan(canvas), 100);
                      }
                    },
                    1, 15, 0.5, 'm'
                  )}
                  {renderNumberInput(
                    'Hauteur (m)',
                    (objetSelectionne.hauteurArbre || 8).toString(),
                    (e) => updateObjetProp('hauteurArbre', e.target.value),
                    2, 30, 0.5, 'm'
                  )}
                  {renderNumberInput(
                    'Prof. racines (m)',
                    (objetSelectionne.profondeurRacines || 2.5).toString(),
                    (e) => updateObjetProp('profondeurRacines', e.target.value),
                    0.5, 5, 0.5, 'm'
                  )}
                </div>
              )}
              
              {/* ✅ Arbre à planter : Informations de validation et placement */}
              {objetSelectionne.customType === 'arbre-a-planter' && (
                <div className="objet-controls">
                  {/* Dimensions actuelles */}
                  <div className="info-box info-box-success">
                    {objetSelectionne.tailles ? (
                      <div style={{ fontSize: '0.8rem', color: '#495057' }}>
                        <div>📏 <strong>Plantation:</strong> {objetSelectionne.tailles.envergureActuelle?.toFixed(2) || 'N/A'}m × {objetSelectionne.tailles.hauteurActuelle?.toFixed(2) || 'N/A'}m</div>
                        <div>🌳 <strong>Tronc:</strong> ⌀{((objetSelectionne.tailles.diametreTroncActuel || 0) * 100).toFixed(2)}cm {objetSelectionne.iconeType || ''}</div>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.8rem', color: '#6c757d', fontStyle: 'italic' }}>
                        📏 Dimensions en cours de calcul...
                      </div>
                    )}
                  </div>
                  
                  {/* Statut de validation */}
                  <div className="info-box" style={{ 
                    background: objetSelectionne.validationStatus === 'ok' ? '#d4edda' : 
                              objetSelectionne.validationStatus === 'warning' ? '#fff3cd' : '#f8d7da',
                    borderColor: objetSelectionne.validationStatus === 'ok' ? '#c3e6cb' : 
                                objetSelectionne.validationStatus === 'warning' ? '#ffeaa7' : '#f5c6cb'
                  }}>
                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      {objetSelectionne.validationStatus === 'ok' ? '✅ Position conforme' : 
                       objetSelectionne.validationStatus === 'warning' ? '⚠️ Avertissement' : 
                       '❌ Problème de placement'}
                    </div>
                    
                    {/* Messages de validation */}
                    {objetSelectionne.validationMessages && objetSelectionne.validationMessages.length > 0 && (
                      <div style={{ fontSize: '0.8rem' }}>
                        {objetSelectionne.validationMessages.map((msg, index) => {
                          // Identifier les types de problèmes
                          const isRacines = msg.includes('Racines') || msg.includes('racines');
                          const isFondations = msg.includes('🏠') || msg.includes('fondations');
                          const isCanalisations = msg.includes('🚰') || msg.includes('canalisations');
                          const isCritique = msg.includes('CRITIQUE') || msg.includes('ILLÉGAL');
                          
                          return (
                            <div key={index} className={`info-box ${isCritique ? 'info-box-error' : 'info-box-warning'}`} style={{ 
                              marginBottom: '0.3rem',
                              padding: '0.3rem',
                              fontSize: '0.8rem'
                            }}>
                              {isRacines && <span style={{ fontWeight: 'bold' }}>🌱 RACINES: </span>}
                              {isFondations && <span style={{ fontWeight: 'bold' }}>🏠 FONDATIONS: </span>}
                              {isCanalisations && <span style={{ fontWeight: 'bold' }}>🚰 CANALISATIONS: </span>}
                              {msg}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  
                  {/* Conseils de racines */}
                  {objetSelectionne.validationConseils && objetSelectionne.validationConseils.length > 0 && (
                    <div className="info-box" style={{ background: '#e3f2fd', borderColor: '#2196f3' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#1976d2' }}>
                        💡 Conseils de plantation
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#1565c0' }}>
                        {objetSelectionne.validationConseils.map((conseil, index) => (
                          <div key={index} style={{ marginBottom: '0.3rem' }}>
                            • {conseil}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div style={{ marginTop: '0.5rem' }}>
                    <button
                      className="btn-outil"
                      onClick={() => {
                        // Supprimer l'arbre du canvas
                        if (canvas) {
                          canvas.remove(objetSelectionne);
                          canvas.renderAll();
                          if (onExporterPlan) {
                            setTimeout(() => onExporterPlan(canvas), 100);
                          }
                        }
                      }}
                      style={{
                        background: '#dc3545',
                        color: 'white',
                        width: '100%'
                      }}
                    >
                      🗑️ Supprimer cet arbre
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ) : ongletActif === 'outils' ? (
        <div className="panneau-outils-content">
          {/* STRUCTURES */}
          <div style={{ marginBottom: '0.5rem' }}>
            <button
              onClick={() => setBatimentsOuvert(!batimentsOuvert)}
              style={{
                width: '100%',
                padding: '0.6rem',
                background: batimentsOuvert ? '#ff9800' : 'white',
                color: batimentsOuvert ? 'white' : '#333',
                border: '1px solid #ff9800',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s'
              }}
            >
              <span>🏗️ Structures (3)</span>
              <span style={{ fontSize: '1rem' }}>{batimentsOuvert ? '▼' : '▶'}</span>
            </button>
            {batimentsOuvert && (
              <div style={{ 
                marginTop: '0.3rem',
                background: 'white',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}>
                <button 
                  onClick={onAjouterMaison} 
                  title="Maison 10×10m, Hauteur 7m"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'white',
                    color: '#333',
                    border: 'none',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    textAlign: 'left',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f8e9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
              🏠 Maison
            </button>
                <button 
                  onClick={onAjouterTerrasse} 
                  title="Terrasse 4×3m"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'white',
                    color: '#333',
                    border: 'none',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    textAlign: 'left',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f8e9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
              🏡 Terrasse
            </button>
                <button 
                  onClick={onAjouterPaves} 
                  title="Pavés 5×5m"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'white',
                    color: '#333',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    textAlign: 'left',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f8e9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
              🟩 Pavés
            </button>
              </div>
            )}
          </div>
          
          {/* RÉSEAUX */}
          <div style={{ marginBottom: '0.5rem' }}>
            <button
              onClick={() => setReseauxOuvert(!reseauxOuvert)}
              style={{
                width: '100%',
                padding: '0.6rem',
                background: reseauxOuvert ? '#2196f3' : 'white',
                color: reseauxOuvert ? 'white' : '#333',
                border: '1px solid #2196f3',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s'
              }}
            >
              <span>🔧 Réseaux enterrés (4)</span>
              <span style={{ fontSize: '1rem' }}>{reseauxOuvert ? '▼' : '▶'}</span>
            </button>
            {reseauxOuvert && (
              <div style={{ 
                marginTop: '0.3rem',
                background: 'white',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}>
                <button 
                  onClick={onAjouterCanalisation} 
                  title="Canalisation (prof. 0.6m)"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'white',
                    color: '#333',
                    border: 'none',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    textAlign: 'left',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f8e9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
              🚰 Canalisation
            </button>
                <button 
                  onClick={onAjouterCiterne} 
                  title="Citerne Ø1.5m (prof. 2.5m)"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'white',
                    color: '#333',
                    border: 'none',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    textAlign: 'left',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f8e9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
              💧 Citerne
            </button>
                <button 
                  onClick={onAjouterCaissonEau} 
                  title="Caisson rétention 5×3×1m (15m³)"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'white',
                    color: '#333',
                    border: 'none',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    textAlign: 'left',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f8e9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  🟦 Caisson eau
                </button>
                <button 
                  onClick={onAjouterCloture} 
                  title="Clôture limite propriété"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'white',
                    color: '#333',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    textAlign: 'left',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f8e9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
              🚧 Clôture
            </button>
          </div>
            )}
          </div>
          
          {/* ARBRES ET ARBUSTES À PLANTER */}
          <div style={{ marginBottom: '0.5rem' }}>
            
            {/* ARBRES */}
            <div style={{ marginBottom: '0.5rem' }}>
            <button 
                onClick={() => setArbresOuvert(!arbresOuvert)}
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  background: arbresOuvert ? '#4caf50' : 'white',
                  color: arbresOuvert ? 'white' : '#333',
                  border: '1px solid #4caf50',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s'
                }}
              >
                <span>🌳 Arbres ({arbres.length})</span>
                <span style={{ fontSize: '1rem' }}>{arbresOuvert ? '▼' : '▶'}</span>
            </button>
              {arbresOuvert && (
                <div style={{ 
                  maxHeight: '250px', 
                  overflowY: 'auto',
                  marginTop: '0.3rem',
                  background: 'white',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}>
                  {arbres.map(plante => (
                    <div 
                      key={plante.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.4rem',
                        borderBottom: '1px solid #f0f0f0',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f1f8e9'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                      <span style={{ flex: 1, fontSize: '0.8rem', fontWeight: '500' }}>
                        {plante.name}
                      </span>
            <button 
                        onClick={() => onAjouterArbrePlante && onAjouterArbrePlante(plante)}
                        style={{
                          background: '#4caf50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        title={`Ajouter ${plante.name}`}
                      >
                        ➕
            </button>
                    </div>
                  ))}
                </div>
              )}
          </div>
          
            {/* ARBUSTES */}
            <div style={{ marginBottom: '0.5rem' }}>
            <button 
                onClick={() => setArbustesOuvert(!arbustesOuvert)}
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  background: arbustesOuvert ? '#8bc34a' : 'white',
                  color: arbustesOuvert ? 'white' : '#333',
                  border: '1px solid #8bc34a',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s'
                }}
              >
                <span>🌿 Arbustes ({arbustes.length})</span>
                <span style={{ fontSize: '1rem' }}>{arbustesOuvert ? '▼' : '▶'}</span>
            </button>
              {arbustesOuvert && (
                <div style={{ 
                  maxHeight: '250px', 
                  overflowY: 'auto',
                  marginTop: '0.3rem',
                  background: 'white',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}>
                  {arbustes.map(plante => (
                    <div 
                      key={plante.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.4rem',
                        borderBottom: '1px solid #f0f0f0',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f1f8e9'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                      <span style={{ flex: 1, fontSize: '0.8rem', fontWeight: '500' }}>
                        {plante.name}
                      </span>
            <button 
                        onClick={() => onAjouterArbrePlante && onAjouterArbrePlante(plante)}
                        style={{
                          background: '#8bc34a',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        title={`Ajouter ${plante.name}`}
                      >
                        ➕
            </button>
                    </div>
                  ))}
                </div>
              )}
          </div>
          
          </div>
          
          {/* Liste des éléments sur le plan - ACCORDÉON */}
          {(canvas && canvas.getObjects) && (() => {
            const objetsCanvas = canvas.getObjects().filter(obj => 
              obj.customType && 
              obj.customType !== 'arbre-a-planter' && // Les arbres à planter sont gérés séparément
              obj.customType !== 'arbre-existant' && // Arbres existants supprimés
              !obj.isGridLine && 
              !obj.isBoussole && 
              !obj.isImageFond &&
              !obj.measureLabel &&
              !obj.isLigneMesure
            );
            
            const nbObjets = objetsCanvas.length; // arbresAPlanter supprimé
            
            if (nbObjets === 0) return null;
            
            return (
              <div style={{ marginBottom: '0.5rem' }}>
                <button
                  onClick={() => setSurPlanOuvert(!surPlanOuvert)}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    background: surPlanOuvert ? '#4caf50' : 'white',
                    color: surPlanOuvert ? 'white' : '#333',
                    border: '1px solid #4caf50',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s'
                  }}
                >
                  <span>📦 Sur le plan ({nbObjets})</span>
                  <span style={{ fontSize: '1rem' }}>{surPlanOuvert ? '▼' : '▶'}</span>
                </button>
                {surPlanOuvert && (
                  <div style={{ 
                    marginTop: '0.3rem',
                    background: 'white',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}>
                    <div style={{ 
                      maxHeight: '200px', 
                      overflowY: 'auto'
                    }}>
                    {/* Arbres à planter */}
                    
                    {/* Autres objets du canvas */}
                    {objetsCanvas.map((obj, index) => {
                      const icone = 
                        obj.customType === 'maison' ? '🏠' :
                        obj.customType === 'terrasse' ? '🪵' :
                        obj.customType === 'paves' ? '🌿' :
                        obj.customType === 'citerne' ? '💧' :
                        obj.customType === 'caisson-eau' ? '💦' :
                        obj.customType === 'canalisation' ? '🚰' :
                        obj.customType === 'cloture' ? '🚧' : '📦';
                      
                      const nom = 
                        obj.customType === 'maison' ? 'Maison' :
                        obj.customType === 'terrasse' ? 'Terrasse' :
                        obj.customType === 'paves' ? 'Pavés enherbés' :
                        obj.customType === 'citerne' ? 'Citerne' :
                        obj.customType === 'caisson-eau' ? 'Caisson eau' :
                        obj.customType === 'canalisation' ? 'Canalisation' :
                        obj.customType === 'cloture' ? 'Clôture' : `Type: ${obj.customType || 'inconnu'}`;
                      
                      return (
                        <div 
                          key={`objet-${obj.customType}-${index}`}
                          onMouseEnter={() => highlightHover(obj, canvas)}
                          onMouseLeave={() => unhighlightHover(obj, canvas)}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.3rem',
                            marginBottom: '0.2rem',
                            background: 'white',
                            borderRadius: '3px',
                            fontSize: '0.75rem',
                            border: '1px solid #e0e0e0',
                            cursor: 'pointer'
                          }}
                        >
                          <span style={{ flex: 1, fontWeight: '500', color: '#333' }}>
                            {icone} {nom}
                          </span>
          <button 
                            onClick={() => {
                              canvas.remove(obj);
                              canvas.renderAll();
                              onExporterPlan && onExporterPlan(canvas);
                            }}
                            style={{
                              background: '#f44336',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              padding: '0.2rem 0.4rem',
                              cursor: 'pointer',
                              fontSize: '0.7rem',
                              transition: 'transform 0.2s'
                            }}
                            title={`Supprimer ${nom}`}
                          >
                            🗑️
          </button>
              </div>
                      );
                    })}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
          
          {/* ACTIONS */}
          <div style={{ marginBottom: '0.5rem' }}>
              <button 
              onClick={() => setActionsOuvert(!actionsOuvert)}
              style={{
                width: '100%',
                padding: '0.6rem',
                background: actionsOuvert ? '#9c27b0' : 'white',
                color: actionsOuvert ? 'white' : '#333',
                border: '1px solid #9c27b0',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s'
              }}
            >
              <span>⚡ Actions & Plan (5)</span>
              <span style={{ fontSize: '1rem' }}>{actionsOuvert ? '▼' : '▶'}</span>
              </button>
            {actionsOuvert && (
              <div style={{ 
                marginTop: '0.3rem',
                background: 'white',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}>
                <button 
                  onClick={onVerrouillerSelection} 
                  title="Verrouiller"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'white',
                    color: '#333',
                    border: 'none',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    textAlign: 'left',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f8e9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  🔒 Verrouiller sélection
                </button>
                <button 
                  onClick={onSupprimerSelection} 
                  title="Supprimer"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'white',
                    color: '#f44336',
                    border: 'none',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    textAlign: 'left',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#ffebee'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  🗑️ Supprimer sélection
                </button>
                <button 
                  onClick={onEffacerTout} 
                  title="Effacer tout"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'white',
                    color: '#f44336',
                    border: 'none',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    textAlign: 'left',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#ffebee'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  ⚠️ Effacer tout
                </button>
                <button 
                  onClick={onLoggerComplet} 
                  title="Log complet de tous les paramètres de tous les objets"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'white',
                    color: '#2196f3',
                    border: 'none',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    textAlign: 'left',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#e3f2fd'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  🔍 Log complet
                </button>
                <button 
                  onClick={onExporterComplet} 
                  title="Exporter toutes les données en JSON"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'white',
                    color: '#4caf50',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    textAlign: 'left',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#e8f5e9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  💾 Export JSON
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

// Optimisation : Éviter re-renders inutiles
export default memo(PanneauLateral);

