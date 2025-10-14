import './FiabiliteBadge.css';

function FiabiliteBadge({ niveau, info }) {
  const configs = {
    haute: {
      icon: '✅',
      label: 'Vérifié',
      color: 'success',
      tooltip: 'Information vérifiée auprès de sources officielles'
    },
    moyenne: {
      icon: '🟡',
      label: 'Estimé',
      color: 'warning',
      tooltip: 'Estimation basée sur littérature horticole (peut varier)'
    },
    faible: {
      icon: '⚠️',
      label: 'Variable',
      color: 'danger',
      tooltip: 'Varie fortement selon conditions locales - Consulter professionnel'
    }
  };

  const config = configs[niveau] || configs.moyenne;

  return (
    <span className={`fiabilite-badge ${config.color}`} title={info || config.tooltip}>
      {config.icon} {config.label}
    </span>
  );
}

export default FiabiliteBadge;

