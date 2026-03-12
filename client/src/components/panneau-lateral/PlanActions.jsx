import React, { useState } from 'react';

/**
 * Composant PlanActions - Gestion du fond de plan (image de fond)
 */
export default function PlanActions({
    imageFondChargee,
    opaciteImage,
    onChargerImageFond,
    onAjusterOpaciteImage,
    onSupprimerImageFond,
    onChoisirImageFondURL
}) {
    const [fondOuvert, setFondOuvert] = useState(true);

    return (
        <div style={{ marginBottom: '0.5rem', marginTop: '1rem' }}>
            <button
                onClick={() => setFondOuvert(!fondOuvert)}
                style={{
                    width: '100%',
                    padding: '0.6rem',
                    background: fondOuvert ? '#607d8b' : 'white',
                    color: fondOuvert ? 'white' : '#333',
                    border: '1px solid #607d8b',
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
                <span>🖼️ Fond de plan</span>
                <span>{fondOuvert ? '▼' : '▶'}</span>
            </button>

            {fondOuvert && (
                <div style={{ marginTop: '5px', padding: '10px', background: 'white', borderRadius: '4px', border: '1px solid #ddd' }}>
                    <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                        <button
                            onClick={onChargerImageFond}
                            style={{ flex: 1, padding: '8px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}
                        >
                            📂 Charger
                        </button>
                        {imageFondChargee && (
                            <button onClick={onSupprimerImageFond} style={{ padding: '8px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                🗑️
                            </button>
                        )}
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#666', marginBottom: '5px', display: 'block' }}>Galerie :</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
                            {[
                                { id: 'soft', name: 'Nature', url: '/assets/images/backgrounds/nature_soft.png' },
                                { id: 'meadow', name: 'Prairie', url: '/assets/images/backgrounds/meadow_lush.png' },
                                { id: 'blueprint', name: 'Plan', url: '/assets/images/backgrounds/blueprint.png' }
                            ].map(bg => (
                                <div
                                    key={bg.id}
                                    onClick={() => onChoisirImageFondURL?.(bg.url)}
                                    style={{ cursor: 'pointer', borderRadius: '4px', textAlign: 'center' }}
                                >
                                    <img src={bg.url} alt={bg.name} style={{ width: '100%', height: '40px', objectFit: 'cover', borderRadius: '3px' }} />
                                    <div style={{ fontSize: '0.6rem' }}>{bg.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {imageFondChargee && (
                        <div style={{ marginTop: '10px' }}>
                            <label style={{ fontSize: '0.75rem' }}>Opacité: {Math.round(opaciteImage * 100)}%</label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={opaciteImage * 100}
                                onChange={(e) => onAjusterOpaciteImage(parseInt(e.target.value) / 100)}
                                style={{ width: '100%', cursor: 'pointer' }}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
