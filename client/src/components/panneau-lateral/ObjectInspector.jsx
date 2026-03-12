import React, { useState } from 'react';
import { getInfoOmbreArbre } from '../../utils/canvas/ombreArbre';
import { canvasOperations } from '../../utils/canvas/canvasOperations';
import { modifierElevationNoeudsSelectionnes, modifierToutLeMaillage } from '../../utils/canvas/terrainUtils';

/**
 * Composant ObjectInspector - Inspection et réglages de l'objet sélectionné
 */
export default function ObjectInspector({
    objetSelectionne,
    canvas,
    echelle,
    onDimensionsChange,
    onExporterPlan,
    onSyncKeyChange
}) {
    const [positionOuvert, setPositionOuvert] = useState(true);
    const [dimensionsOuvert, setDimensionsOuvert] = useState(true);
    const [toitOuvert, setToitOuvert] = useState(true);

    if (!objetSelectionne || objetSelectionne.customType === 'maillage-relief') return null;

    const updateObjetProp = (prop, value) => {
        if (objetSelectionne && canvas) {
            if (prop === 'typeToit') {
                objetSelectionne.set({ [prop]: value });
                const penteDefaut = value === 'monopente' ? 2 : value === 'deux-pentes' ? 15 : 3;
                objetSelectionne.set({ penteToit: penteDefaut });
            } else {
                const numValue = parseFloat(value);
                if (isNaN(numValue)) return;
                objetSelectionne.set({ [prop]: numValue });

                if ((prop === 'largeur' || prop === 'profondeur') &&
                    (objetSelectionne.customType === 'maison' ||
                        objetSelectionne.customType === 'terrasse' ||
                        objetSelectionne.customType === 'paves' ||
                        objetSelectionne.customType === 'caisson-eau')) {

                    let rect = null;
                    if (objetSelectionne._objects) {
                        rect = objetSelectionne._objects.find(o => o.type === 'rect');
                    }
                    if (!rect && objetSelectionne.getObjects) {
                        rect = objetSelectionne.getObjects().find(o => o.type === 'rect');
                    }

                    if (rect) {
                        const largeur = objetSelectionne.largeur || 5;
                        const profondeur = objetSelectionne.profondeur || 3;

                        rect.set({
                            width: largeur * echelle,
                            height: profondeur * echelle,
                            originX: 'center',
                            originY: 'center'
                        });

                        const texte = objetSelectionne._objects?.find(o => o.type === 'text') ||
                            (objetSelectionne.getObjects ? objetSelectionne.getObjects().find(o => o.type === 'text') : null);
                        if (texte) {
                            const tailleIcone = Math.min(largeur * echelle, profondeur * echelle) * 0.4;
                            texte.set({
                                fontSize: Math.max(tailleIcone, 24),
                                originX: 'center',
                                originY: 'center'
                            });
                        }

                        if (objetSelectionne._calcBounds) {
                            objetSelectionne._calcBounds();
                        }
                        objetSelectionne.setCoords();
                    }
                }
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
                            background: isDisabled ? '#e0e0e0' : '#f44336',
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
                                cursor: isDisabled ? 'not-allowed' : 'text',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                textAlign: 'center',
                                padding: '4px'
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
            if (isNaN(value)) return;

            if (objetSelectionne.type === 'group') {
                const objects = objetSelectionne.getObjects();
                objects.forEach(obj => {
                    if (obj.type === 'rect') {
                        if (prop === 'width') {
                            obj.set({ width: value * echelle });
                        } else {
                            obj.set({ height: value * echelle });
                        }
                    } else if (obj.type === 'text') {
                        const newSize = Math.min(value * echelle * 0.4, value * echelle * 0.4);
                        obj.set({ fontSize: Math.max(newSize, 24) });
                    }
                });

                if (prop === 'width') {
                    objetSelectionne.set({ width: value * echelle, largeur: value });
                } else {
                    objetSelectionne.set({ height: value * echelle, profondeur: value });
                }
            } else {
                if (prop === 'width') {
                    objetSelectionne.set({ width: value * echelle });
                } else {
                    objetSelectionne.set({ height: value * echelle });
                }
            }

            objetSelectionne.setCoords();
            canvas.requestRenderAll();
            canvas.fire('object:modified', { target: objetSelectionne });

            if (onDimensionsChange) {
                const objets = canvas.getObjects().filter(obj =>
                    obj.customType &&
                    obj.customType !== 'grille' &&
                    obj.customType !== 'boussole' &&
                    obj.customType !== 'indicateur-sud' &&
                    obj.customType !== 'aide-button' &&
                    obj.customType !== 'dimension-box' &&
                    obj.customType !== 'center-mark'
                );

                if (objets.length > 0) {
                    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
                    objets.forEach(obj => {
                        const left = obj.left - (obj.getScaledWidth ? obj.getScaledWidth() : obj.width) / 2;
                        const right = obj.left + (obj.getScaledWidth ? obj.getScaledWidth() : obj.width) / 2;
                        const top = obj.top - (obj.getScaledHeight ? obj.getScaledHeight() : obj.height) / 2;
                        const bottom = obj.top + (obj.getScaledHeight ? obj.getScaledHeight() : obj.height) / 2;
                        minX = Math.min(minX, left);
                        maxX = Math.max(maxX, right);
                        minY = Math.min(minY, top);
                        maxY = Math.max(maxY, bottom);
                    });
                    const largeur = Math.max((maxX - minX) / echelle, 10);
                    const hauteur = Math.max((maxY - minY) / echelle, 10);
                    onDimensionsChange({ largeur, hauteur });
                }
            }
        };

        return renderNumberInput(label, getValue(), handleChange, min, max, step, 'm');
    };

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
        }
    };

    return (
        <div style={{ marginTop: '1rem' }}>
            <div className="section-title">🎯 Objet sélectionné</div>
            <div className="info-box" style={{ background: '#fff3e0', borderColor: '#ff9800', marginBottom: '1rem', padding: '10px', borderRadius: '8px', border: '1px solid #ffb74d' }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                    {objetSelectionne.customType === 'maison' && `🏠 Maison${objetSelectionne.numero ? ` #${objetSelectionne.numero}` : ''}`}
                    {objetSelectionne.customType === 'citerne' && `💧 Citerne${objetSelectionne.numero ? ` #${objetSelectionne.numero}` : ''}`}
                    {objetSelectionne.customType === 'caisson-eau' && `🟦 Caisson eau${objetSelectionne.numero ? ` #${objetSelectionne.numero}` : ''}`}
                    {objetSelectionne.customType === 'canalisation' && `🚰 Canalisation${objetSelectionne.numero ? ` #${objetSelectionne.numero}` : ''}`}
                    {objetSelectionne.customType === 'cloture' && `🪵 Clôture${objetSelectionne.numero ? ` #${objetSelectionne.numero}` : ''}`}
                    {objetSelectionne.customType === 'terrasse' && `🪨 Terrasse${objetSelectionne.numero ? ` #${objetSelectionne.numero}` : ''}`}
                    {objetSelectionne.customType === 'paves' && `🌱 Pavés enherbés${objetSelectionne.numero ? ` #${objetSelectionne.numero}` : ''}`}
                    {objetSelectionne.customType === 'arbre-a-planter' && `🌳 ${objetSelectionne.arbreData?.name || 'Arbre'}${objetSelectionne.numero ? ` #${objetSelectionne.numero}` : ''}`}
                    {objetSelectionne.customType === 'arbre-existant' && `🌳 Arbre existant${objetSelectionne.numero ? ` #${objetSelectionne.numero}` : ''}`}
                </div>
            </div>

            {objetSelectionne.customType === 'maison' && (
                <>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <button onClick={() => setPositionOuvert(!positionOuvert)} style={styles.boutonSection(positionOuvert, '#2196f3')}>
                            <span>📍 Position</span>
                            <span style={{ fontSize: '1rem' }}>{positionOuvert ? '▼' : '▶'}</span>
                        </button>
                        {positionOuvert && (
                            <div style={styles.conteneurListe}>
                                {renderNumberInput('Rotation', Math.round(objetSelectionne.angle || 0).toString(), (e) => updateObjetProp('angle', e.target.value), 0, 360, 5, '°')}
                                {renderNumberInput('Élévation rel. sol', (objetSelectionne.elevationSol || 0).toString(), (e) => updateObjetProp('elevationSol', e.target.value), -5, 10, 0.1, 'm')}
                            </div>
                        )}
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <button onClick={() => setDimensionsOuvert(!dimensionsOuvert)} style={styles.boutonSection(dimensionsOuvert, '#4caf50')}>
                            <span>📏 Dimensions</span>
                            <span style={{ fontSize: '1rem' }}>{dimensionsOuvert ? '▼' : '▶'}</span>
                        </button>
                        {dimensionsOuvert && (
                            <div style={styles.conteneurListe}>
                                {renderDimensionInput('Largeur', 'width', 2, 30, 0.1)}
                                {renderDimensionInput('Profondeur', 'height', 2, 30, 0.1)}
                                {renderNumberInput('Hauteur', (objetSelectionne.hauteur || 7).toString(), (e) => updateObjetProp('hauteur', e.target.value), 3, 15, 0.5, 'm')}
                            </div>
                        )}
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <button onClick={() => setToitOuvert(!toitOuvert)} style={styles.boutonSection(toitOuvert, '#ff9800')}>
                            <span>🏠 Type de toit</span>
                            <span style={{ fontSize: '1rem' }}>{toitOuvert ? '▼' : '▶'}</span>
                        </button>
                        {toitOuvert && (
                            <div style={styles.conteneurListe}>
                                <div style={{ padding: '0.5rem', fontSize: '0.85rem' }}>
                                    {['plan', 'monopente', 'deux-pentes'].map((type) => (
                                        <label key={type} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.2rem', cursor: 'pointer' }}>
                                            <input type="radio" name="typeToit" value={type} checked={(objetSelectionne.typeToit || 'deux-pentes') === type} onChange={(e) => updateObjetProp('typeToit', e.target.value)} style={{ marginRight: '0.5rem' }} />
                                            <span style={{ textTransform: 'capitalize' }}>{type === 'deux-pentes' ? 'Deux pentes traditionnelles' : type === 'monopente' ? 'Monopente' : 'Plan'}</span>
                                        </label>
                                    ))}
                                </div>
                                {(objetSelectionne.typeToit === 'monopente' || objetSelectionne.typeToit === 'deux-pentes') && (
                                    <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#f9f9f9', borderRadius: '4px' }}>
                                        {renderNumberInput('Pente du toit', Math.round(objetSelectionne.penteToit || (objetSelectionne.typeToit === 'monopente' ? 2 : 15)).toString(), (e) => updateObjetProp('penteToit', e.target.value), 1, 60, 1, '°')}
                                        {objetSelectionne.typeToit === 'monopente' && (
                                            <div style={{ marginTop: '0.5rem' }}>
                                                <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Orientation de la pente</label>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <button onClick={() => updateObjetProp('orientationToit', ((objetSelectionne.orientationToit || 0) - 90 + 360) % 360)} style={{ padding: '0.5rem', background: '#2196f3', color: 'white', border: 'none', borderRadius: '4px' }}>-</button>
                                                    <div style={{ padding: '0.5rem', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', flex: 1, textAlign: 'center' }}>
                                                        {(() => {
                                                            const deg = parseInt(objetSelectionne.orientationToit || 0);
                                                            if (deg === 0) return 'Nord (0°)';
                                                            if (deg === 90) return 'Est (90°)';
                                                            if (deg === 180) return 'Sud (180°)';
                                                            if (deg === 270) return 'Ouest (270°)';
                                                            return `${deg}°`;
                                                        })()}
                                                    </div>
                                                    <button onClick={() => updateObjetProp('orientationToit', ((objetSelectionne.orientationToit || 0) + 90) % 360)} style={{ padding: '0.5rem', background: '#2196f3', color: 'white', border: 'none', borderRadius: '4px' }}>+</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}

            {objetSelectionne.customType === 'citerne' && (
                <>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <button onClick={() => setDimensionsOuvert(!dimensionsOuvert)} style={styles.boutonSection(dimensionsOuvert, '#4caf50')}>
                            <span>📏 Dimensions</span>
                            <span style={{ fontSize: '1rem' }}>{dimensionsOuvert ? '▼' : '▶'}</span>
                        </button>
                        {dimensionsOuvert && (
                            <div style={styles.conteneurListe}>
                                {renderNumberInput('Diamètre', (objetSelectionne.diametre || 1.5).toString(), (e) => updateObjetProp('diametre', e.target.value), 0.5, 3, 0.1, 'm')}
                                {renderNumberInput('Longueur', (objetSelectionne.longueur || 2.5).toString(), (e) => updateObjetProp('longueur', e.target.value), 1, 5, 0.5, 'm')}
                                <div className="info-box">💧 Volume : {(Math.PI * Math.pow((objetSelectionne.diametre || 1.5) / 2, 2) * (objetSelectionne.longueur || 2.5)).toFixed(2)}m³</div>
                            </div>
                        )}
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <button onClick={() => setPositionOuvert(!positionOuvert)} style={styles.boutonSection(positionOuvert, '#2196f3')}>
                            <span>📍 Position</span>
                            <span style={{ fontSize: '1rem' }}>{positionOuvert ? '▼' : '▶'}</span>
                        </button>
                        {positionOuvert && (
                            <div style={styles.conteneurListe}>
                                {renderNumberInput('Élévation sol (m)', (objetSelectionne.elevationSol || 0).toString(), (e) => updateObjetProp('elevationSol', e.target.value), -5, 5, 0.1, 'm')}
                                <div className="info-box" style={{ background: '#fff3e0', padding: '0.5rem', marginTop: '0.5rem' }}>💡 Négatif = enterré</div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Raccourci pour arbres (à planter ou existants) */}
            {(objetSelectionne.customType === 'arbre-a-planter' || objetSelectionne.customType === 'arbre-existant') && (
                <div className="objet-controls">
                    {objetSelectionne.customType === 'arbre-existant' && (
                        <>
                            {renderNumberInput('Ø Couronne (m)', (objetSelectionne.diametreArbre || 5).toString(), (e) => {
                                const newDiam = parseFloat(e.target.value);
                                objetSelectionne.set({ diametreArbre: newDiam });
                                if (objetSelectionne._objects?.[0]) {
                                    objetSelectionne._objects[0].set({ radius: (newDiam / 2) * (canvas.getZoom() * 20) });
                                }
                                objetSelectionne.setCoords();
                                canvas.requestRenderAll();
                            }, 1, 15, 0.5, 'm')}
                            {renderNumberInput('Hauteur (m)', (objetSelectionne.hauteurArbre || 8).toString(), (e) => updateObjetProp('hauteurArbre', e.target.value), 2, 30, 0.5, 'm')}
                            {renderNumberInput('Prof. racines (m)', (objetSelectionne.profondeurRacines || 2.5).toString(), (e) => updateObjetProp('profondeurRacines', e.target.value), 0.5, 5, 0.5, 'm')}
                        </>
                    )}

                    {objetSelectionne.customType === 'arbre-a-planter' && (
                        <>
                            <div className="info-box info-box-success" style={{ background: '#d4edda', padding: '10px', borderRadius: '8px', border: '1px solid #c3e6cb', marginBottom: '10px' }}>
                                {objetSelectionne.tailles ? (
                                    <div style={{ fontSize: '0.8rem', color: '#155724' }}>
                                        <div>📏 <strong>Plantation:</strong> {objetSelectionne.tailles.envergureActuelle?.toFixed(2)}m × {objetSelectionne.tailles.hauteurActuelle?.toFixed(2)}m</div>
                                        <div>🌳 <strong>Tronc:</strong> ⌀{((objetSelectionne.tailles.diametreTroncActuel || 0) * 100).toFixed(2)}cm</div>
                                    </div>
                                ) : <div style={{ fontStyle: 'italic' }}>Dimensions en cours...</div>}
                            </div>

                            {/* Validation UI */}
                            <div className="info-box" style={{
                                background: objetSelectionne.validationStatus === 'ok' ? '#d4edda' :
                                    objetSelectionne.validationStatus === 'warning' ? '#fff3cd' : '#f8d7da',
                                padding: '10px', borderRadius: '8px', border: '1px solid #ddd'
                            }}>
                                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                                    {objetSelectionne.validationStatus === 'ok' ? '✅ Position conforme' :
                                        objetSelectionne.validationStatus === 'warning' ? '⚠️ Avertissement' : '❌ Problème de placement'}
                                </div>
                                {objetSelectionne.validationMessages?.map((msg, i) => (
                                    <div key={i} style={{ fontSize: '0.75rem', marginTop: '5px' }}>• {msg}</div>
                                ))}
                            </div>

                            {/* Ombre */}
                            {objetSelectionne.arbreData && (() => {
                                const infoOmbre = getInfoOmbreArbre(objetSelectionne.arbreData, 'ete', 0.5);
                                if (!infoOmbre) return null;
                                return (
                                    <div style={{ background: '#fffbe6', padding: '10px', borderRadius: '8px', border: '1px solid #ffe58f', marginTop: '10px' }}>
                                        <div style={{ fontWeight: 'bold', color: '#d46b08', fontSize: '0.85rem' }}>☀️ Ombre portée (Été)</div>
                                        <div style={{ fontSize: '0.75rem' }}>Long: {infoOmbre.longueurOmbre} | Densité: {infoOmbre.densiteFeuillage}</div>
                                    </div>
                                );
                            })()}
                        </>
                    )}

                    <button
                        className="btn-outil"
                        onClick={() => {
                            canvasOperations.supprimer(canvas, objetSelectionne);
                            canvasOperations.rendre(canvas);
                            if (onExporterPlan) onExporterPlan(canvas);
                        }}
                        style={{ background: '#dc3545', color: 'white', width: '100%', marginTop: '1rem', padding: '10px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        🗑️ Supprimer cet arbre
                    </button>
                </div>
            )}
        </div>
    );
}
