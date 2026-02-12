import React, { useState } from 'react';
import './MaintenanceGuide.css';

/**
 * GUIDE D'ENTRETIEN COMPLET
 * Remplace la simple carte "Taille" par un module riche avec calendrier
 */
export default function MaintenanceGuide({ plant }) {
    const [activeTab, setActiveTab] = useState('calendrier'); // 'calendrier' | 'conseils' | 'risques'

    // Si pas de données de calendrier, fallback sur affichage simple
    const hasCalendar = plant.calendrierAnnuel && plant.calendrierAnnuel.length > 0;

    return (
        <div className="maintenance-guide">
            <div className="guide-header">
                <h3>📅 Guide d'Entretien Annuel</h3>
                <p className="guide-subtitle">Suivez le rythme des saisons pour un arbuste en pleine santé</p>
            </div>

            {/* Navigation Onglets (Mobile Friendly) */}
            <div className="guide-tabs">
                <button
                    className={`guide-tab ${activeTab === 'calendrier' ? 'active' : ''}`}
                    onClick={() => setActiveTab('calendrier')}
                >
                    🗓️ Calendrier
                </button>
                <button
                    className={`guide-tab ${activeTab === 'conseils' ? 'active' : ''}`}
                    onClick={() => setActiveTab('conseils')}
                >
                    💡 Conseils
                </button>
                {plant.informationsComplementaires?.dangersEtPrecautions && (
                    <button
                        className={`guide-tab ${activeTab === 'risques' ? 'active' : ''}`}
                        onClick={() => setActiveTab('risques')}
                    >
                        ⚠️ Précautions
                    </button>
                )}
            </div>

            <div className="guide-content">
                {/* === ONGLET 1 : CALENDRIER VISUEL === */}
                {activeTab === 'calendrier' && (
                    <div className="calendar-view">
                        {hasCalendar ? (
                            <div className="timeline-vertical">
                                {plant.calendrierAnnuel.map((item, index) => (
                                    <div key={index} className="timeline-event">
                                        <div className="event-marker">
                                            <span className="event-icon">{item.icone}</span>
                                        </div>
                                        <div className="event-content">
                                            <div className="event-time">{item.mois}</div>
                                            <div className="event-action">{item.action}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="empty-state">Aucun calendrier détaillé disponible pour cet arbuste.</p>
                        )}
                    </div>
                )}

                {/* === ONGLET 2 : CONSEILS DÉTAILLÉS === */}
                {activeTab === 'conseils' && (
                    <div className="tips-view">
                        <div className="tip-block">
                            <h4>✂️ Taille</h4>
                            <p><strong>Période idéale :</strong> {plant.taille?.periode}</p>
                            <p><strong>Fréquence :</strong> {plant.taille?.frequence}</p>
                            <div className="tip-box method">
                                <h5>Comment tailler ?</h5>
                                <p>{plant.taille?.methode}</p>
                            </div>
                            {plant.taille?.conseil && (
                                <div className="tip-box warning">
                                    <strong>Note importante :</strong> {plant.taille.conseil}
                                </div>
                            )}
                        </div>

                        <div className="tip-block">
                            <h4>💧 Arrosage & Sol</h4>
                            <p>{plant.arrosage}</p>
                            <p><strong>Sol préféré :</strong> {plant.sol?.type}</p>
                        </div>

                        {plant.informationsComplementaires?.fertilisation && (
                            <div className="tip-block">
                                <h4>🧪 Fertilisation</h4>
                                <p><strong>Besoins :</strong> {plant.informationsComplementaires.fertilisation.besoins}</p>
                                <p><strong>Quoi apporter :</strong> {plant.informationsComplementaires.fertilisation.type}</p>
                                <p><strong>Quand :</strong> {plant.informationsComplementaires.fertilisation.periode}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* === ONGLET 3 : DANGERS & PRÉCAUTIONS === */}
                {activeTab === 'risques' && plant.informationsComplementaires?.dangersEtPrecautions && (
                    <div className="risks-view">
                        {plant.informationsComplementaires.dangersEtPrecautions.taille && (
                            <div className="risk-block">
                                <h4>⚠️ Risques liés à la taille</h4>
                                <div className={`risk-level level-${plant.informationsComplementaires.dangersEtPrecautions.taille.danger.toLowerCase().includes('élevé') ? 'high' : 'medium'}`}>
                                    Niveau de risque : {plant.informationsComplementaires.dangersEtPrecautions.taille.danger}
                                </div>
                                <ul>
                                    {plant.informationsComplementaires.dangersEtPrecautions.taille.risques?.map((r, i) => (
                                        <li key={i}>{r}</li>
                                    ))}
                                </ul>
                                <div className="safe-period">
                                    ✅ Période sûre : {plant.informationsComplementaires.dangersEtPrecautions.taille.periodeSecuritaire}
                                </div>
                                <div className="unsafe-period">
                                    ⛔ À éviter : {plant.informationsComplementaires.dangersEtPrecautions.taille.periodeDanger}
                                </div>
                            </div>
                        )}

                        {plant.toxicite && (
                            <div className="risk-block toxicity">
                                <h4>☠️ Toxicité</h4>
                                <p className="toxicity-level">{plant.toxicite.niveau}</p>
                                <p>{plant.toxicite.danger}</p>
                                <p><strong>Prévention :</strong> {plant.toxicite.prevention}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
