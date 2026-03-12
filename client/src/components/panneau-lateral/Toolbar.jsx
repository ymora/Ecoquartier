import React, { useState } from 'react';

/**
 * Composant Toolbar - Onglet "Ajouter" du panneau latéral
 */
export default function Toolbar({
    arbres,
    arbustes,
    onAjouterMaison,
    onAjouterTerrasse,
    onAjouterPaves,
    onAjouterCloture,
    onAjouterCanalisation,
    onAjouterCiterne,
    onAjouterCaissonEau,
    onAjouterArbrePlante,
    handleAjouterCouche,
    onVerrouillerSelection,
    onSupprimerSelection,
    onEffacerTout
}) {
    const [solOuvert, setSolOuvert] = useState(false);
    const [batimentsOuvert, setBatimentsOuvert] = useState(false);
    const [reseauxOuvert, setReseauxOuvert] = useState(false);
    const [arbresOuvert, setArbresOuvert] = useState(false);
    const [arbustesOuvert, setArbustesOuvert] = useState(false);
    const [actionsOuvert, setActionsOuvert] = useState(false);

    return (
        <div className="panneau-outils-content">
            {/* SOL / COMPOSITION */}
            <div style={{ marginBottom: '0.5rem' }}>
                <button
                    onClick={() => setSolOuvert(!solOuvert)}
                    className={`btn-section ${solOuvert ? 'active' : ''}`}
                    style={{
                        width: '100%',
                        padding: '0.6rem',
                        background: solOuvert ? '#8d6e63' : 'white',
                        color: solOuvert ? 'white' : '#333',
                        border: '1px solid #8d6e63',
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
                    <span>🪨 Couches de sol (6)</span>
                    <span style={{ fontSize: '1rem' }}>{solOuvert ? '▼' : '▶'}</span>
                </button>
                {solOuvert && (
                    <div style={{
                        marginTop: '0.3rem',
                        background: 'white',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                    }}>
                        {[
                            { id: 'terre', nom: 'Terre végétale', prof: 30, color: '#8d6e63', icon: '🌱' },
                            { id: 'marne', nom: 'Marne calcaire', prof: 70, color: '#bdbdbd', icon: '🪨' },
                            { id: 'sable', nom: 'Sable', prof: 50, color: '#fdd835', icon: '⏳' },
                            { id: 'argile', nom: 'Argile', prof: 60, color: '#d32f2f', icon: '🧱' },
                            { id: 'gravier', nom: 'Gravier', prof: 40, color: '#9e9e9e', icon: '🪨' },
                            { id: 'roche', nom: 'Roche mère', prof: 100, color: '#5d4037', icon: '⛰️' }
                        ].map(couche => (
                            <div
                                key={couche.id}
                                className="btn-hover-green"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '0.4rem',
                                    borderBottom: '1px solid #f0f0f0',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <span style={{ flex: 1, fontSize: '0.8rem', fontWeight: '500' }}>
                                    {couche.icon} {couche.nom}
                                </span>
                                <button
                                    onClick={() => handleAjouterCouche(couche.id, couche.nom, couche.prof, couche.color)}
                                    className="btn-hover-accent"
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
                                    title={`Ajouter ${couche.nom}`}
                                >
                                    ➕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

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
                    <span>🏗️ Structures (4)</span>
                    <span style={{ fontSize: '1rem' }}>{batimentsOuvert ? '▼' : '▶'}</span>
                </button>
                {batimentsOuvert && (
                    <div style={{
                        marginTop: '0.3rem',
                        background: 'white',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                    }}>
                        <div className="btn-hover-green" style={{ display: 'flex', alignItems: 'center', padding: '0.4rem', borderBottom: '1px solid #f0f0f0' }}>
                            <span style={{ flex: 1, fontSize: '0.8rem', fontWeight: '500' }} title="Maison 10×10m, Hauteur 7m">🏠 Maison</span>
                            <button onClick={onAjouterMaison} className="btn-hover-accent" style={{ background: '#ff9800', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 'bold' }}>➕</button>
                        </div>
                        <div className="btn-hover-green" style={{ display: 'flex', alignItems: 'center', padding: '0.4rem', borderBottom: '1px solid #f0f0f0' }}>
                            <span style={{ flex: 1, fontSize: '0.8rem', fontWeight: '500' }} title="Terrasse 4×3m">🪨 Terrasse</span>
                            <button onClick={onAjouterTerrasse} className="btn-hover-accent" style={{ background: '#ff9800', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 'bold' }}>➕</button>
                        </div>
                        <div className="btn-hover-green" style={{ display: 'flex', alignItems: 'center', padding: '0.4rem', borderBottom: '1px solid #f0f0f0' }}>
                            <span style={{ flex: 1, fontSize: '0.8rem', fontWeight: '500' }} title="Pavés 5×5m">🌱 Pavés enherbés</span>
                            <button onClick={onAjouterPaves} className="btn-hover-accent" style={{ background: '#ff9800', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 'bold' }}>➕</button>
                        </div>
                        <div className="btn-hover-green" style={{ display: 'flex', alignItems: 'center', padding: '0.4rem' }}>
                            <span style={{ flex: 1, fontSize: '0.8rem', fontWeight: '500' }} title="Clôture limite propriété">🪵 Clôture</span>
                            <button onClick={onAjouterCloture} className="btn-hover-accent" style={{ background: '#ff9800', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 'bold' }}>➕</button>
                        </div>
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
                    <span>🔧 Réseaux enterrés (3)</span>
                    <span style={{ fontSize: '1rem' }}>{reseauxOuvert ? '▼' : '▶'}</span>
                </button>
                {reseauxOuvert && (
                    <div style={{
                        marginTop: '0.3rem',
                        background: 'white',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                    }}>
                        <div className="btn-hover-green" style={{ display: 'flex', alignItems: 'center', padding: '0.4rem', borderBottom: '1px solid #f0f0f0' }}>
                            <span style={{ flex: 1, fontSize: '0.8rem', fontWeight: '500' }}>🚰 Canalisation</span>
                            <button onClick={onAjouterCanalisation} className="btn-hover-accent" style={{ background: '#2196f3', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 'bold' }}>➕</button>
                        </div>
                        <div className="btn-hover-green" style={{ display: 'flex', alignItems: 'center', padding: '0.4rem', borderBottom: '1px solid #f0f0f0' }}>
                            <span style={{ flex: 1, fontSize: '0.8rem', fontWeight: '500' }}>💧 Citerne</span>
                            <button onClick={onAjouterCiterne} className="btn-hover-accent" style={{ background: '#2196f3', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 'bold' }}>➕</button>
                        </div>
                        <div className="btn-hover-green" style={{ display: 'flex', alignItems: 'center', padding: '0.4rem' }}>
                            <span style={{ flex: 1, fontSize: '0.8rem', fontWeight: '500' }}>🟦 Caisson eau</span>
                            <button onClick={onAjouterCaissonEau} className="btn-hover-accent" style={{ background: '#2196f3', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 'bold' }}>➕</button>
                        </div>
                    </div>
                )}
            </div>

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
                    <span>🌳 Arbres ({arbres?.length || 0})</span>
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
                        {arbres?.map(plante => (
                            <div key={plante.id} className="btn-hover-green" style={{ display: 'flex', alignItems: 'center', padding: '0.4rem', borderBottom: '1px solid #f0f0f0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '0.8rem' }}>
                                    {plante.images?.[0] && <img src={`/images/${plante.images[0]}`} alt="" style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }} />}
                                    <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>{plante.name}</span>
                                </div>
                                <button onClick={() => onAjouterArbrePlante(plante)} className="btn-hover-accent" style={{ background: '#4caf50', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 'bold' }}>➕</button>
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
                    <span>🌿 Arbustes ({arbustes?.length || 0})</span>
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
                        {arbustes?.map(plante => (
                            <div key={plante.id} className="btn-hover-green" style={{ display: 'flex', alignItems: 'center', padding: '0.4rem', borderBottom: '1px solid #f0f0f0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '0.8rem' }}>
                                    {plante.images?.[0] && <img src={`/images/${plante.images[0]}`} alt="" style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }} />}
                                    <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>{plante.name}</span>
                                </div>
                                <button onClick={() => onAjouterArbrePlante(plante)} className="btn-hover-accent" style={{ background: '#8bc34a', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 'bold' }}>➕</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

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
                    <span>⚡ Actions & Plan</span>
                    <span style={{ fontSize: '1rem' }}>{actionsOuvert ? '▼' : '▶'}</span>
                </button>
                {actionsOuvert && (
                    <div style={{
                        marginTop: '0.3rem',
                        background: 'white',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                    }}>
                        <button onClick={onVerrouillerSelection} className="btn-hover-green" style={{ width: '100%', padding: '0.5rem', background: 'white', color: '#333', border: 'none', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500', textAlign: 'left' }}>🔒 Verrouiller sélection</button>
                        <button onClick={onSupprimerSelection} style={{ width: '100%', padding: '0.5rem', background: 'white', color: '#f44336', border: 'none', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500', textAlign: 'left' }} onMouseEnter={(e) => e.currentTarget.style.background = '#ffebee'} onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>🗑️ Supprimer sélection</button>
                        <button onClick={onEffacerTout} style={{ width: '100%', padding: '0.5rem', background: 'white', color: '#f44336', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500', textAlign: 'left' }} onMouseEnter={(e) => e.currentTarget.style.background = '#ffebee'} onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>⚠️ Effacer tout</button>
                    </div>
                )}
            </div>
        </div>
    );
}
