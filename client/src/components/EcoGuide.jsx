import React, { useState, useMemo } from 'react';
import { ecoConseilsData } from '../data/ecoConseilsData';
import { motion, AnimatePresence } from 'framer-motion';
import './EcoGuide.css';

export default function EcoGuide() {
    const [activeTab, setActiveTab] = useState('sol');
    const [selectedSolType, setSelectedSolType] = useState(null);
    const [search, setSearch] = useState('');

    const filteredSoilTips = useMemo(() => {
        if (!selectedSolType) return ecoConseilsData.sol.sections[0].content;
        return ecoConseilsData.sol.sections[0].content.filter(s => s.type === selectedSolType);
    }, [selectedSolType]);

    return (
        <div className="eco-v2">
            <header className="eco-header">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="eco-title-block"
                >
                    <h1>Guide de l'Éco-Jardinier</h1>
                    <p>Apprendre à cultiver avec la nature, pas contre elle.</p>
                </motion.div>
                
                <div className="eco-nav-pills">
                    <button 
                        className={`eco-pill ${activeTab === 'sol' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sol')}
                    >
                        🌱 Sol Vivant
                    </button>
                    <button 
                        className={`eco-pill ${activeTab === 'gazon' ? 'active' : ''}`}
                        onClick={() => setActiveTab('gazon')}
                    >
                        🦗 Pelouse Gérée
                    </button>
                </div>
            </header>

            <main className="eco-main">
                <AnimatePresence mode="wait">
                    {activeTab === 'sol' ? (
                        <motion.section 
                            key="sol"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="eco-section"
                        >
                            {/* Interactive Soil Simulator */}
                            <div className="soil-simulator">
                                <div className="sim-header">
                                    <h3>🧪 Simulateur "Mon Sol"</h3>
                                    <p>Identifiez votre terre pour obtenir des conseils sur mesure.</p>
                                </div>
                                <div className="sol-types-grid">
                                    {['Argileux', 'Sableux', 'Calcaire', 'Franc'].map(type => (
                                        <button 
                                            key={type}
                                            className={`sol-type-card ${selectedSolType === type ? 'selected' : ''}`}
                                            onClick={() => setSelectedSolType(selectedSolType === type ? null : type)}
                                        >
                                            <div className="sol-icon">
                                                {type === 'Argileux' && '🧱'}
                                                {type === 'Sableux' && '🏖️'}
                                                {type === 'Calcaire' && '💎'}
                                                {type === 'Franc' && '✨'}
                                            </div>
                                            <span>{type}</span>
                                        </button>
                                    ))}
                                </div>

                                <AnimatePresence>
                                    {selectedSolType && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="sol-result-card"
                                        >
                                            {filteredSoilTips.map((tip, i) => (
                                                <div key={i} className="tip-content">
                                                    <h4>Conseil Expert pour sol {tip.type}</h4>
                                                    <p><strong>Défis :</strong> {tip.description}</p>
                                                    <div className="action-box">
                                                        <strong>💡 Action Prioritaire :</strong> {tip.action}
                                                    </div>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="eco-grid-v2">
                                <div className="eco-card-v2 highlight">
                                    <h3>🪱 Les Vers de Terre</h3>
                                    <p>{ecoConseilsData.sol.sections[1].description}</p>
                                    <ul>
                                        {ecoConseilsData.sol.sections[1].roles.map((r, i) => <li key={i}>{r}</li>)}
                                    </ul>
                                </div>
                                <div className="eco-card-v2 danger">
                                    <h3>🚫 Erreurs Fatales</h3>
                                    <ul>
                                        {ecoConseilsData.sol.sections[3].list.map((e, i) => <li key={i}>{e}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </motion.section>
                    ) : (
                        <motion.section 
                            key="gazon"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="eco-section"
                        >
                            <div className="alt-grid-v2">
                                {ecoConseilsData.gazon.alternatives.map((alt, i) => (
                                    <div key={i} className="alt-card-v2">
                                        <h4>{alt.name}</h4>
                                        {alt.benefits && (
                                            <ul>
                                                {alt.benefits.map((b, j) => <li key={j}>{b}</li>)}
                                            </ul>
                                        )}
                                        {alt.description && <p>{alt.description}</p>}
                                        <div className="alt-usage">📍 {alt.usage || alt.action}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
