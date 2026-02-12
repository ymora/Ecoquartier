import React, { useState } from 'react';
import { ecoConseilsData } from '../data/ecoConseilsData';
import './EcoGuide.css';

export default function EcoGuide() {
    const [activeTab, setActiveTab] = useState('sol'); // 'sol' ou 'gazon'

    return (
        <div className="eco-guide-container">
            <div className="eco-guide-header">
                <h2>Guide de l'Éco-Jardinier</h2>
                <p className="subtitle">Comprendre et respecter la vie pour un jardin résilient</p>
            </div>

            <div className="eco-tabs">
                <button
                    className={`eco-tab-btn ${activeTab === 'sol' ? 'active' : ''}`}
                    onClick={() => setActiveTab('sol')}
                >
                    {ecoConseilsData.sol.icon} {ecoConseilsData.sol.title}
                </button>
                <button
                    className={`eco-tab-btn ${activeTab === 'gazon' ? 'active' : ''}`}
                    onClick={() => setActiveTab('gazon')}
                >
                    {ecoConseilsData.gazon.icon} {ecoConseilsData.gazon.title}
                </button>
            </div>

            <div className="eco-content">
                {activeTab === 'sol' && (
                    <div className="section-sol animate-fade-in">
                        <div className="intro-card" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                            <div className="intro-text">
                                <p>{ecoConseilsData.sol.intro}</p>
                            </div>
                            {ecoConseilsData.sol.image && (
                                <div className="intro-image">
                                    <img src={ecoConseilsData.sol.image} alt="Sol vivant illustration" style={{ width: '250px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                </div>
                            )}
                        </div>

                        <div className="grid-2-col">
                            {/* Types de Sol */}
                            <div className="eco-card">
                                <h3>🔍 {ecoConseilsData.sol.sections[0].title}</h3>
                                <div className="sol-types-list">
                                    {ecoConseilsData.sol.sections[0].content.map((sol, idx) => (
                                        <div key={idx} className="sol-item">
                                            <span className="badge-type">{sol.type}</span>
                                            <p>{sol.description}</p>
                                            <small>💡 {sol.action}</small>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Vers de Terre */}
                            <div className="eco-card highlight-card">
                                <h3>🪱 {ecoConseilsData.sol.sections[1].title}</h3>
                                <p><em>{ecoConseilsData.sol.sections[1].description}</em></p>
                                <ul className="roles-list">
                                    {ecoConseilsData.sol.sections[1].roles.map((role, idx) => (
                                        <li key={idx}>✅ {role}</li>
                                    ))}
                                </ul>
                                <div className="alert-box">
                                    {ecoConseilsData.sol.sections[1].conseil}
                                </div>
                            </div>
                        </div>

                        {/* Techniques */}
                        <div className="eco-card full-width">
                            <h3>🛠️ {ecoConseilsData.sol.sections[2].title}</h3>
                            <div className="techniques-grid">
                                {ecoConseilsData.sol.sections[2].techniques.map((tech, idx) => (
                                    <div key={idx} className="technique-item">
                                        <h4>{tech.name}</h4>
                                        <p>{tech.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Erreurs à éviter (Vidéo) */}
                        {ecoConseilsData.sol.sections[3] && (
                            <div className="eco-card full-width alert-card animate-fade-in" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                <h3 style={{ color: '#ef4444' }}>{ecoConseilsData.sol.sections[3].title}</h3>
                                <p><em>{ecoConseilsData.sol.sections[3].description}</em></p>
                                <ul className="errors-list" style={{ listStyle: 'none', paddingLeft: 0, marginTop: '1rem' }}>
                                    {ecoConseilsData.sol.sections[3].list.map((error, idx) => (
                                        <li key={idx} style={{ marginBottom: '0.5rem' }}>❌ {error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'gazon' && (
                    <div className="section-gazon animate-fade-in">
                        <div className="intro-card">
                            <p>{ecoConseilsData.gazon.intro}</p>
                        </div>

                        <div className="alternatives-container">
                            {ecoConseilsData.gazon.alternatives.map((alt, idx) => (
                                <div key={idx} className="eco-card alternative-card">
                                    <div className="alternative-header">
                                        <h3>{alt.name} <small>{alt.scientific || ''}</small></h3>
                                        {alt.image && (
                                            <div className="alt-image-container" style={{ margin: '1rem 0' }}>
                                                <img src={alt.image} alt={alt.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px' }} />
                                            </div>
                                        )}
                                    </div>
                                    {alt.benefits ? (
                                        <ul className="benefits-list">
                                            {alt.benefits.map((benefit, bIdx) => (
                                                <li key={bIdx}>🌿 {benefit}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>{alt.description}</p>
                                    )}
                                    {alt.usage && <p className="usage-info">📍 {alt.usage}</p>}
                                    {alt.action && <p className="action-info">💡 {alt.action}</p>}
                                </div>
                            ))}
                        </div>

                        <div className="eco-card full-width maintenance-card">
                            <h3>🚜 {ecoConseilsData.gazon.entretien_bio.title}</h3>
                            <div className="steps-grid">
                                {ecoConseilsData.gazon.entretien_bio.steps.map((step, idx) => (
                                    <div key={idx} className="step-item">
                                        <span className="step-number">{idx + 1}</span>
                                        <p>{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

