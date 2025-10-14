import { useState } from 'react';
import { 
  FaSeedling, 
  FaTree, 
  FaWater, 
  FaSun, 
  FaSnowflake, 
  FaCut,
  FaExclamationTriangle,
  FaBug,
  FaLeaf,
  FaBalanceScale,
  FaRulerCombined
} from 'react-icons/fa';
import ImageGallery from './ImageGallery';
import CalendrierAnnuel from './CalendrierAnnuel';
import FiabiliteBadge from './FiabiliteBadge';
import { reglementationData, reglesGenerales } from '../data/reglementationData';
import { informationsComplementaires, reglesGeneralesComplementaires } from '../data/informationsComplementaires';
import './ArbusteDetail.css';

function ArbusteDetail({ arbuste }) {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="arbuste-detail">
      <div className="arbuste-header">
        <h1>{arbuste.name}</h1>
        <p className="scientific-name">{arbuste.nomScientifique}</p>
        <p className="family">Famille : {arbuste.famille}</p>
      </div>

      <ImageGallery arbusteId={arbuste.id} arbusteName={arbuste.name} />

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          <FaLeaf /> Général
        </button>
        <button 
          className={`tab ${activeTab === 'plantation' ? 'active' : ''}`}
          onClick={() => setActiveTab('plantation')}
        >
          <FaSeedling /> Plantation & Sol
        </button>
        <button 
          className={`tab ${activeTab === 'entretien' ? 'active' : ''}`}
          onClick={() => setActiveTab('entretien')}
        >
          <FaCut /> Entretien
        </button>
        <button 
          className={`tab ${activeTab === 'reglementation' ? 'active' : ''}`}
          onClick={() => setActiveTab('reglementation')}
        >
          <FaBalanceScale /> Réglementation
        </button>
        <button 
          className={`tab ${activeTab === 'precautions' ? 'active' : ''}`}
          onClick={() => setActiveTab('precautions')}
        >
          <FaExclamationTriangle /> Précautions
        </button>
        <button 
          className={`tab ${activeTab === 'calendrier' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendrier')}
        >
          📅 Calendrier
        </button>
        <button 
          className={`tab ${activeTab === 'biodiversite' ? 'active' : ''}`}
          onClick={() => setActiveTab('biodiversite')}
        >
          🦋 Biodiversité
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'general' && (
          <div className="tab-panel">
            <div className="info-grid">
              <div className="info-card">
                <FaTree className="icon" />
                <h3>
                  Taille à maturité
                  <FiabiliteBadge niveau="moyenne" info="Estimation moyenne - Varie selon sol, climat et entretien (±20%)" />
                </h3>
                <p className="value">{arbuste.tailleMaturite}</p>
                <p className="detail">Croissance : {arbuste.croissance}</p>
              </div>

              <div className="info-card">
                <FaSnowflake className="icon" />
                <h3>Rusticité</h3>
                <p className="value">{arbuste.rusticite}</p>
              </div>

              <div className="info-card">
                <FaSun className="icon" />
                <h3>Exposition</h3>
                <p className="value">{arbuste.exposition}</p>
              </div>

              <div className="info-card">
                <FaWater className="icon" />
                <h3>Arrosage</h3>
                <p className="value">{arbuste.arrosage}</p>
              </div>
            </div>

            <div className="section">
              <h2>🌸 Floraison</h2>
              <div className="detail-box">
                <p><strong>Période :</strong> {arbuste.floraison.periode}</p>
                <p><strong>Couleur :</strong> {arbuste.floraison.couleur}</p>
                <p><strong>Description :</strong> {arbuste.floraison.description}</p>
                {arbuste.floraison.parfum && (
                  <p><strong>Parfum :</strong> {arbuste.floraison.parfum}</p>
                )}
              </div>
            </div>

            <div className="section">
              <h2>🍇 Fructification</h2>
              <div className="detail-box">
                <p><strong>Période :</strong> {arbuste.fructification.periode}</p>
                <p><strong>Couleur :</strong> {arbuste.fructification.couleur}</p>
                <p><strong>Description :</strong> {arbuste.fructification.description}</p>
              </div>
            </div>

            <div className="section">
              <h2>🍂 Feuillage</h2>
              <div className="detail-box">
                <p><strong>Type :</strong> {arbuste.feuillage.type}</p>
                <p><strong>Couleur automnale :</strong> {arbuste.feuillage.couleurAutomne}</p>
                <p><strong>Description :</strong> {arbuste.feuillage.description}</p>
              </div>
            </div>

            {arbuste.rameaux && (
              <div className="section">
                <h2>🌿 Rameaux</h2>
                <div className="detail-box">
                  <p><strong>Couleur :</strong> {arbuste.rameaux.couleur}</p>
                  <p><strong>Particularité :</strong> {arbuste.rameaux.particularite}</p>
                </div>
              </div>
            )}

            {arbuste.toxicite && (
              <div className={`section alert ${arbuste.toxicite.niveau.includes('TOXIQUE') ? 'danger' : 'info'}`}>
                <h2><FaExclamationTriangle /> Toxicité</h2>
                <div className="detail-box">
                  <p className="toxicity-level"><strong>{arbuste.toxicite.niveau}</strong></p>
                  {arbuste.toxicite.danger && (
                    <p className="warning">{arbuste.toxicite.danger}</p>
                  )}
                  {arbuste.toxicite.allergie && (
                    <p className="warning">{arbuste.toxicite.allergie}</p>
                  )}
                  {arbuste.toxicite.prevention && (
                    <p><strong>Prévention :</strong> {arbuste.toxicite.prevention}</p>
                  )}
                </div>
              </div>
            )}

            <div className="section">
              <h2>💡 Utilisations</h2>
              <ul className="usage-list">
                {arbuste.utilisations.map((utilisation, index) => (
                  <li key={index}>{utilisation}</li>
                ))}
              </ul>
            </div>

            {arbuste.anecdote && (
              <div className="section anecdote">
                <h2>📖 Le saviez-vous ?</h2>
                <p className="anecdote-text">{arbuste.anecdote}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'plantation' && (
          <div className="tab-panel">
            <div className="section">
              <h2>📅 Période de plantation</h2>
              <div className="detail-box">
                <p className="value">{arbuste.plantation.periode}</p>
                <p><strong>Conseil :</strong> {arbuste.plantation.conseil}</p>
              </div>
            </div>

            <div className="section">
              <h2>🌍 Sol</h2>
              <div className="detail-box">
                <p><strong>Type :</strong> {arbuste.sol.type}</p>
                <p><strong>pH :</strong> {arbuste.sol.ph}</p>
                <p><strong>Humidité :</strong> {arbuste.sol.humidite}</p>
              </div>
            </div>

            <div className="section">
              <h2><FaSun /> Exposition</h2>
              <div className="detail-box">
                <p className="value">{arbuste.exposition}</p>
              </div>
            </div>

            <div className="section">
              <h2><FaWater /> Arrosage</h2>
              <div className="detail-box">
                <p>{arbuste.arrosage}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'entretien' && (
          <div className="tab-panel">
            <div className="section">
              <h2><FaCut /> Taille</h2>
              <div className="detail-box">
                <p><strong>Période :</strong> {arbuste.taille.periode}</p>
                <p><strong>Fréquence :</strong> {arbuste.taille.frequence}</p>
                <p><strong>Méthode :</strong> {arbuste.taille.methode}</p>
                <p className="highlight"><strong>Conseil :</strong> {arbuste.taille.conseil}</p>
              </div>
            </div>

            <div className="section">
              <h2><FaBug /> Maladies et Parasites</h2>
              <ul className="disease-list">
                {arbuste.maladies.map((maladie, index) => (
                  <li key={index}>{maladie}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'reglementation' && reglementationData[arbuste.id] && (
          <div className="tab-panel">
            <div className="section alert info">
              <h2>
                <FaBalanceScale /> Réglementation et Distances Légales
                <FiabiliteBadge niveau="haute" info="Code Civil Articles 671-673 - Textes officiels vérifiés (Service-Public.gouv.fr)" />
              </h2>
              <p className="intro-text">
                ⚠️ <strong>IMPORTANT</strong> : Le non-respect des distances légales peut entraîner l'arrachage forcé de la plante et des sanctions financières.
                <br/><strong>⚖️ Consultez le PLU de Bessancourt en mairie avant plantation.</strong>
              </p>
            </div>

            <div className="section">
              <h2>
                <FaRulerCombined /> Système Racinaire
                <FiabiliteBadge niveau="moyenne" info="Estimations basées sur littérature horticole - Peut varier selon sol et conditions" />
              </h2>
              <div className="detail-box">
                <p><strong>Type :</strong> {reglementationData[arbuste.id].systemeRacinaire.type}</p>
                <p><strong>Profondeur :</strong> {reglementationData[arbuste.id].systemeRacinaire.profondeur}</p>
                <p><strong>Étalement :</strong> {reglementationData[arbuste.id].systemeRacinaire.etalement}</p>
                <p><strong>Agressivité :</strong> {reglementationData[arbuste.id].systemeRacinaire.agressivite}</p>
                <p className="highlight">{reglementationData[arbuste.id].systemeRacinaire.description}</p>
              </div>
            </div>

            <div className="section alert danger">
              <h2><FaExclamationTriangle /> Risques Potentiels</h2>
              <ul className="disease-list">
                {reglementationData[arbuste.id].risques.map((risque, index) => (
                  <li key={index}>{risque}</li>
                ))}
              </ul>
            </div>

            <div className="section">
              <h2>⚖️ Distances Légales (Code Civil Article 671)</h2>
              
              <div className="reglementation-card">
                <h3>🏡 Voisinage</h3>
                <div className="detail-box">
                  <p><strong>Distance minimale :</strong> {reglementationData[arbuste.id].distancesLegales.voisinage.distance}</p>
                  <p><strong>Règle :</strong> {reglementationData[arbuste.id].distancesLegales.voisinage.regle}</p>
                  <p><strong>Justification :</strong> {reglementationData[arbuste.id].distancesLegales.voisinage.justification}</p>
                  {reglementationData[arbuste.id].distancesLegales.voisinage.option && (
                    <p className="highlight"><strong>Option :</strong> {reglementationData[arbuste.id].distancesLegales.voisinage.option}</p>
                  )}
                  <p className="warning"><strong>⚠️ Sanction :</strong> {reglementationData[arbuste.id].distancesLegales.voisinage.sanction}</p>
                </div>
              </div>

              <div className="reglementation-card">
                <h3>🛣️ Espaces Publics</h3>
                <div className="detail-box">
                  <p><strong>Distance :</strong> {reglementationData[arbuste.id].distancesLegales.espacesPublics.distance}</p>
                  <p><strong>Règle :</strong> {reglementationData[arbuste.id].distancesLegales.espacesPublics.regle}</p>
                  <p className="highlight">Consulter le PLU de Bessancourt en mairie ou sur le site de la ville</p>
                </div>
              </div>

              <div className="reglementation-card">
                <h3>🌳 Entre Arbres/Arbustes</h3>
                <div className="detail-box">
                  <p><strong>Distance :</strong> {reglementationData[arbuste.id].distancesLegales.entreArbres?.distance || reglementationData[arbuste.id].distancesLegales.entreArbustes?.distance}</p>
                  <p><strong>Justification :</strong> {reglementationData[arbuste.id].distancesLegales.entreArbres?.justification || reglementationData[arbuste.id].distancesLegales.entreArbustes?.justification}</p>
                </div>
              </div>

              <div className="reglementation-card">
                <h3>🏗️ Infrastructures</h3>
                <div className="detail-box infrastructure-grid">
                  {Object.entries(reglementationData[arbuste.id].distancesLegales.infrastructures).map(([key, value]) => (
                    <div key={key} className="infrastructure-item">
                      <strong>{key.replace(/([A-Z])/g, ' $1').trim()} :</strong>
                      <span className="value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="section alert warning">
              <h2>💡 Conseils Pratiques</h2>
              <p className="highlight">{reglementationData[arbuste.id].conseils}</p>
            </div>
          </div>
        )}

        {activeTab === 'precautions' && informationsComplementaires[arbuste.id] && (
          <div className="tab-panel">
            {/* Pollinisation */}
            <div className="section">
              <h2>🐝 Pollinisation & Fructification</h2>
              <div className="detail-box">
                <p><strong>Type :</strong> {informationsComplementaires[arbuste.id].pollinisation.type}</p>
                <p><strong>Besoin :</strong> {informationsComplementaires[arbuste.id].pollinisation.besoin}</p>
                <p><strong>Production :</strong> {informationsComplementaires[arbuste.id].pollinisation.production}</p>
                <p className="highlight"><strong>Conseil :</strong> {informationsComplementaires[arbuste.id].pollinisation.conseil}</p>
              </div>
            </div>

            {/* Dangers de la Taille */}
            <div className="section alert danger">
              <h2><FaExclamationTriangle /> Dangers de la Taille</h2>
              <div className="detail-box">
                <p><strong>Niveau de danger :</strong> {informationsComplementaires[arbuste.id].dangersEtPrecautions.taille.danger}</p>
                
                <h3>Risques :</h3>
                <ul className="disease-list">
                  {informationsComplementaires[arbuste.id].dangersEtPrecautions.taille.risques.map((risque, index) => (
                    <li key={index}>{risque}</li>
                  ))}
                </ul>
                
                <h3>⛔ Périodes DANGEREUSES :</h3>
                <p className="warning">{informationsComplementaires[arbuste.id].dangersEtPrecautions.taille.periodeDanger}</p>
                
                <h3>✅ Période SÉCURITAIRE :</h3>
                <p className="success-text">{informationsComplementaires[arbuste.id].dangersEtPrecautions.taille.periodeSecuritaire}</p>
                
                {informationsComplementaires[arbuste.id].dangersEtPrecautions.taille.protection && (
                  <p><strong>Protection :</strong> {informationsComplementaires[arbuste.id].dangersEtPrecautions.taille.protection}</p>
                )}
                
                <p className="highlight"><strong>⚠️ Conseil :</strong> {informationsComplementaires[arbuste.id].dangersEtPrecautions.taille.conseil}</p>
              </div>
            </div>

            {/* INTERDICTION LÉGALE TAILLE */}
            <div className="section alert warning">
              <h2>
                ⚖️ INTERDICTION LÉGALE DE TAILLE
                <FiabiliteBadge niveau="haute" info="Code Rural + BCAE (PAC) - Loi vérifiée (LPO France, 2025)" />
              </h2>
              <div className="detail-box">
                <p className="warning-large">
                  <strong>🔴 {informationsComplementaires[arbuste.id].dangersEtPrecautions.reglementationTaille.loi}</strong>
                </p>
                <p><strong>Raison :</strong> {informationsComplementaires[arbuste.id].dangersEtPrecautions.reglementationTaille.raison}</p>
                <p className="warning"><strong>Sanction :</strong> {informationsComplementaires[arbuste.id].dangersEtPrecautions.reglementationTaille.sanction}</p>
                <p><strong>Application :</strong> {informationsComplementaires[arbuste.id].dangersEtPrecautions.reglementationTaille.application}</p>
                {informationsComplementaires[arbuste.id].dangersEtPrecautions.reglementationTaille.conflit && (
                  <p className="warning"><strong>⚠️ Attention :</strong> {informationsComplementaires[arbuste.id].dangersEtPrecautions.reglementationTaille.conflit}</p>
                )}
                {informationsComplementaires[arbuste.id].dangersEtPrecautions.reglementationTaille.solution && (
                  <p className="highlight"><strong>Solution :</strong> {informationsComplementaires[arbuste.id].dangersEtPrecautions.reglementationTaille.solution}</p>
                )}
                <p className="info-source">
                  <strong>Sources :</strong> Code Rural français, BCAE (PAC), LPO France
                </p>
              </div>
            </div>

            {/* Allergies */}
            <div className="section">
              <h2>🤧 Allergies</h2>
              <div className="detail-box">
                <p><strong>Pollen :</strong> {informationsComplementaires[arbuste.id].allergies.pollen}</p>
                {informationsComplementaires[arbuste.id].allergies.niveau && (
                  <p className="warning"><strong>Niveau :</strong> {informationsComplementaires[arbuste.id].allergies.niveau}</p>
                )}
                {informationsComplementaires[arbuste.id].allergies.symptomes && (
                  <p><strong>Symptômes :</strong> {informationsComplementaires[arbuste.id].allergies.symptomes}</p>
                )}
                {informationsComplementaires[arbuste.id].allergies.periode && (
                  <p><strong>Période :</strong> {informationsComplementaires[arbuste.id].allergies.periode}</p>
                )}
                {informationsComplementaires[arbuste.id].allergies.parfum && (
                  <p><strong>Parfum :</strong> {informationsComplementaires[arbuste.id].allergies.parfum}</p>
                )}
                {informationsComplementaires[arbuste.id].allergies.contact && (
                  <p><strong>Contact :</strong> {informationsComplementaires[arbuste.id].allergies.contact}</p>
                )}
                <p className="highlight"><strong>Conseil :</strong> {informationsComplementaires[arbuste.id].allergies.conseil}</p>
              </div>
            </div>

            {/* Animaux Domestiques */}
            <div className="section">
              <h2>🐾 Animaux Domestiques</h2>
              <div className="detail-box">
                <div className="animaux-grid">
                  <div className="animal-item">
                    <strong>🐕 Chiens :</strong>
                    <span>{informationsComplementaires[arbuste.id].animauxDomestiques.chiens}</span>
                  </div>
                  <div className="animal-item">
                    <strong>🐈 Chats :</strong>
                    <span>{informationsComplementaires[arbuste.id].animauxDomestiques.chats}</span>
                  </div>
                  {informationsComplementaires[arbuste.id].animauxDomestiques.chevaux && (
                    <div className="animal-item">
                      <strong>🐴 Chevaux :</strong>
                      <span>{informationsComplementaires[arbuste.id].animauxDomestiques.chevaux}</span>
                    </div>
                  )}
                  {informationsComplementaires[arbuste.id].animauxDomestiques.oiseaux && (
                    <div className="animal-item">
                      <strong>🐦 Oiseaux :</strong>
                      <span>{informationsComplementaires[arbuste.id].animauxDomestiques.oiseaux}</span>
                    </div>
                  )}
                </div>
                {informationsComplementaires[arbuste.id].animauxDomestiques.symptomes && (
                  <p className="warning"><strong>Symptômes intoxication :</strong> {informationsComplementaires[arbuste.id].animauxDomestiques.symptomes}</p>
                )}
                {informationsComplementaires[arbuste.id].animauxDomestiques.urgence && (
                  <p className="danger-text"><strong>🚨 Urgence :</strong> {informationsComplementaires[arbuste.id].animauxDomestiques.urgence}</p>
                )}
                <p className="highlight"><strong>Conseil :</strong> {informationsComplementaires[arbuste.id].animauxDomestiques.conseil}</p>
              </div>
            </div>

            {/* Protection Hivernale */}
            <div className="section">
              <h2>❄️ Protection Hivernale</h2>
              <div className="detail-box">
                <p><strong>Adulte :</strong> {informationsComplementaires[arbuste.id].protectionHivernale.adulte}</p>
                {informationsComplementaires[arbuste.id].protectionHivernale.jeunesPlants && (
                  <>
                    <h3>Jeunes Plants (1-3 ans) :</h3>
                    <ul>
                      {informationsComplementaires[arbuste.id].protectionHivernale.jeunesPlants.map((protection, index) => (
                        <li key={index}>{protection}</li>
                      ))}
                    </ul>
                  </>
                )}
                {informationsComplementaires[arbuste.id].protectionHivernale.gelPrintanier && (
                  <p className="warning"><strong>⚠️ Gel printanier :</strong> {informationsComplementaires[arbuste.id].protectionHivernale.gelPrintanier}</p>
                )}
              </div>
            </div>

            {/* Fertilisation */}
            <div className="section">
              <h2>🌱 Fertilisation</h2>
              <div className="detail-box">
                <p><strong>Besoins :</strong> {informationsComplementaires[arbuste.id].fertilisation.besoins}</p>
                <p><strong>Période :</strong> {informationsComplementaires[arbuste.id].fertilisation.periode}</p>
                <p><strong>Type :</strong> {informationsComplementaires[arbuste.id].fertilisation.type}</p>
                <p><strong>Quantité :</strong> {informationsComplementaires[arbuste.id].fertilisation.quantite}</p>
                <p><strong>Fréquence :</strong> {informationsComplementaires[arbuste.id].fertilisation.frequence}</p>
                <p className="highlight"><strong>Conseil :</strong> {informationsComplementaires[arbuste.id].fertilisation.conseil}</p>
              </div>
            </div>

            {/* Questions Forums */}
            <div className="section anecdote">
              <h2>💬 Questions Fréquentes (Forums)</h2>
              <ul className="forum-list">
                {informationsComplementaires[arbuste.id].sujetsForums.map((sujet, index) => (
                  <li key={index}>{sujet}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'calendrier' && (
          <div className="tab-panel">
            <CalendrierAnnuel calendrier={arbuste.calendrierAnnuel} />
          </div>
        )}

        {activeTab === 'biodiversite' && (
          <div className="tab-panel">
            <div className="section">
              <h2>🦋 Biodiversité & Écologie</h2>
              <div className="detail-box">
                <h3>🐦 Faune</h3>
                <p>{arbuste.biodiveriste.faune}</p>
                
                <h3>🐛 Insectes</h3>
                <p>{arbuste.biodiveriste.insectes}</p>
                
                <h3>🦜 Oiseaux</h3>
                <p>{arbuste.biodiveriste.oiseaux}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArbusteDetail;

