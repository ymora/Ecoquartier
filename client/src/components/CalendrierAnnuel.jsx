import './CalendrierAnnuel.css';

function CalendrierAnnuel({ calendrier }) {
  return (
    <div className="calendrier-annuel">
      <h2>📅 Calendrier d'entretien annuel</h2>
      <div className="calendrier-grid">
        {calendrier.map((periode, index) => (
          <div key={index} className="calendrier-card">
            <div className="calendrier-icon">{periode.icone}</div>
            <h3 className="calendrier-mois">{periode.mois}</h3>
            <p className="calendrier-action">{periode.action}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CalendrierAnnuel;

