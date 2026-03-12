import React from 'react';
import { modifierElevationNoeudsSelectionnes, modifierToutLeMaillage } from '../../utils/canvas/terrainUtils';

/**
 * Composant TerrainManager - Gestion du relief et des couches de sol
 */
export default function TerrainManager({
    canvas,
    couchesSol,
    onCouchesSolChange
}) {
    const maillage = canvas?.getObjects().find(obj => obj.customType === 'maillage-relief');

    const handleDragStart = (e, index) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index);
    };

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
        if (fromIndex !== targetIndex && canvas && couchesSol) {
            const nouvellesCouches = [...couchesSol];
            const [deplacee] = nouvellesCouches.splice(fromIndex, 1);
            nouvellesCouches.splice(targetIndex, 0, deplacee);
            canvas.couchesSol = nouvellesCouches;
            canvas.fire('couches:updated', { couches: nouvellesCouches });
            onCouchesSolChange(nouvellesCouches);
        }
    };

    const updateCoucheProfondeur = (index, delta) => {
        if (canvas && couchesSol) {
            const nouvellesCouches = [...couchesSol];
            const current = nouvellesCouches[index].profondeur;
            const newVal = Math.max(5, Math.min(300, current + delta));
            nouvellesCouches[index].profondeur = newVal;
            canvas.couchesSol = nouvellesCouches;
            canvas.fire('couches:updated', { couches: nouvellesCouches });
            onCouchesSolChange(nouvellesCouches);
        }
    };

    const supprimerCouche = (index) => {
        if (canvas && couchesSol) {
            const nouvellesCouches = couchesSol.filter((_, i) => i !== index);
            canvas.couchesSol = nouvellesCouches;
            canvas.fire('couches:updated', { couches: nouvellesCouches });
            onCouchesSolChange(nouvellesCouches);
        }
    };

    const nbNoeudsSel = maillage?.noeudsSelectionnes?.length || 0;

    return (
        <div className="terrain-manager">
            <div className="section-title">🌍 Relief du terrain</div>

            <div style={{ background: '#e3f2fd', border: '1px solid #2196f3', borderRadius: '6px', padding: '0.8rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1976d2' }}>
                    Points d'élévation
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                    <label style={{ fontSize: '0.8rem' }}>{nbNoeudsSel > 0 ? `${nbNoeudsSel} nœud(s) choisi(s)` : 'Sélectionnez des points'}</label>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                            onClick={() => modifierElevationNoeudsSelectionnes(maillage, -0.1)}
                            disabled={nbNoeudsSel === 0}
                            style={{ padding: '5px 10px', background: nbNoeudsSel === 0 ? '#ccc' : '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            −
                        </button>
                        <button
                            onClick={() => modifierElevationNoeudsSelectionnes(maillage, 0.1)}
                            disabled={nbNoeudsSel === 0}
                            style={{ padding: '5px 10px', background: nbNoeudsSel === 0 ? '#ccc' : '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            +
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button onClick={() => modifierToutLeMaillage(maillage, () => 0, '✅ Terrain aplati')} style={{ flex: 1, padding: '5px', background: '#2196f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>↕️ Plat</button>
                    <button onClick={() => modifierToutLeMaillage(maillage, (v) => v + 0.5, '✅ +50cm')} style={{ flex: 1, padding: '5px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>⬆️ +50cm</button>
                    <button onClick={() => modifierToutLeMaillage(maillage, (v) => v - 0.5, '✅ -50cm')} style={{ flex: 1, padding: '5px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>⬇️ -50cm</button>
                </div>
            </div>

            <div className="section-title">🪨 Composition du sol ({couchesSol?.length || 0})</div>

            {(!couchesSol || couchesSol.length === 0) ? (
                <div className="info-box" style={{ background: '#fff3e0', padding: '1rem', textAlign: 'center', borderRadius: '8px', border: '1px solid #ff9800' }}>
                    <p style={{ fontSize: '0.8rem', color: '#e65100' }}>Aucune couche. Ajoutez-en depuis l'onglet "Ajouter".</p>
                </div>
            ) : (
                <div className="couches-list">
                    {couchesSol.map((couche, index) => (
                        <div
                            key={index}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDrop(e, index)}
                            style={{ background: 'white', border: '1px solid #ddd', borderRadius: '6px', padding: '8px', marginBottom: '8px', cursor: 'grab' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                                <span style={{ fontSize: '1.2rem' }}>⋮⋮</span>
                                <div style={{ width: '15px', height: '15px', background: couche.couleur, borderRadius: '2px', border: '1px solid #666' }} />
                                <span style={{ flex: 1, fontWeight: 'bold', fontSize: '0.85rem' }}>{couche.nom}</span>
                                <button onClick={() => supprimerCouche(index)} style={{ padding: '2px 6px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>🗑️</button>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <label style={{ fontSize: '0.75rem', color: '#666' }}>Épaisseur:</label>
                                <button onClick={() => updateCoucheProfondeur(index, -5)} style={{ width: '25px', height: '25px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>-</button>
                                <span style={{ minWidth: '40px', textAlign: 'center', fontWeight: 'bold' }}>{couche.profondeur}cm</span>
                                <button onClick={() => updateCoucheProfondeur(index, 5)} style={{ width: '25px', height: '25px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+</button>
                            </div>
                        </div>
                    ))}
                    <div className="info-box-info" style={{ background: '#e1f5fe', padding: '8px', borderRadius: '6px', fontSize: '0.8rem', border: '1px solid #b3e5fc' }}>
                        📏 Profondeur totale : {(couchesSol.reduce((sum, c) => sum + c.profondeur, 0) / 100).toFixed(2)}m
                    </div>
                </div>
            )}
        </div>
    );
}
