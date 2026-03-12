import React, { useState } from 'react';
import { highlightHover, unhighlightHover } from '../../utils/canvas/highlightUtils';
import { canvasOperations } from '../../utils/canvas/canvasOperations';

/**
 * Composant ObjectList - Liste des objets présents sur le plan
 */
export default function ObjectList({ canvas, onExporterPlan }) {
    const [ouvert, setOuvert] = useState(true);

    if (!canvas || !canvas.getObjects) return null;

    const objetsCanvas = canvas.getObjects().filter(obj =>
        obj.customType &&
        obj.customType !== 'arbre-a-planter' &&
        obj.customType !== 'arbre-existant' &&
        obj.customType !== 'maillage-relief' &&
        obj.customType !== 'noeud-relief' &&
        !obj.isGridLine &&
        !obj.isBoussole &&
        !obj.isImageFond &&
        !obj.measureLabel &&
        !obj.isLigneMesure
    );

    const nbObjets = objetsCanvas.length;
    if (nbObjets === 0) return null;

    const getIcone = (type) => {
        switch (type) {
            case 'maison': return '🏠';
            case 'terrasse': return '🪨';
            case 'paves': return '🌱';
            case 'citerne': return '💧';
            case 'caisson-eau': return '💦';
            case 'canalisation': return '🚰';
            case 'cloture': return '🪵';
            default: return '📦';
        }
    };

    const getNom = (type) => {
        switch (type) {
            case 'maison': return 'Maison';
            case 'terrasse': return 'Terrasse';
            case 'paves': return 'Pavés enherbés';
            case 'citerne': return 'Citerne';
            case 'caisson-eau': return 'Caisson eau';
            case 'canalisation': return 'Canalisation';
            case 'cloture': return 'Clôture';
            default: return type || 'Inconnu';
        }
    };

    return (
        <div style={{ marginBottom: '1rem' }}>
            <button
                onClick={() => setOuvert(!ouvert)}
                style={{
                    width: '100%',
                    padding: '0.6rem',
                    background: ouvert ? '#4caf50' : 'white',
                    color: ouvert ? 'white' : '#333',
                    border: '1px solid #4caf50',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <span>📦 Sur le plan ({nbObjets})</span>
                <span>{ouvert ? '▼' : '▶'}</span>
            </button>

            {ouvert && (
                <div style={{ marginTop: '5px', maxHeight: '200px', overflowY: 'auto', background: 'white', borderRadius: '4px', border: '1px solid #ddd' }}>
                    {objetsCanvas.map((obj, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                canvas.setActiveObject(obj);
                                canvas.renderAll();
                            }}
                            onMouseEnter={() => highlightHover(obj, canvas)}
                            onMouseLeave={() => unhighlightHover(obj, canvas)}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '8px',
                                borderBottom: '1px solid #eee',
                                cursor: 'pointer',
                                fontSize: '0.8rem'
                            }}
                        >
                            <span>{getIcone(obj.customType)} {getNom(obj.customType)}</span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    canvasOperations.supprimer(canvas, obj);
                                    canvasOperations.rendre(canvas);
                                    if (onExporterPlan) onExporterPlan(canvas);
                                }}
                                style={{ background: '#f44336', color: 'white', border: 'none', borderRadius: '3px', padding: '2px 6px', cursor: 'pointer' }}
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
