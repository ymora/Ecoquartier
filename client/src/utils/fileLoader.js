/**
 * fileLoader.js
 * ✅ Utilitaire pour charger des fichiers JSON avec l'explorateur Windows natif
 * Élimine l'utilisation de prompt() pour une meilleure UX
 */

/**
 * Charger un fichier JSON avec l'explorateur Windows
 * @param {Function} onFileSelected - Callback appelé avec le contenu du fichier
 * @param {string} accept - Types de fichiers acceptés (défaut: '.json')
 */
export const chargerFichierAvecExplorateur = (onFileSelected, accept = '.json') => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = accept;
  input.style.display = 'none';
  
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = JSON.parse(event.target.result);
        onFileSelected(content, file.name);
      } catch (error) {
        console.error('Erreur lors du parsing du JSON:', error);
        alert('Erreur: Le fichier sélectionné n\'est pas un JSON valide.');
      }
    };
    
    reader.onerror = () => {
      console.error('Erreur lors de la lecture du fichier');
      alert('Erreur lors de la lecture du fichier.');
    };
    
    reader.readAsText(file);
  };
  
  // Ajouter temporairement au DOM et déclencher le clic
  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
};

/**
 * Charger un plan JSON depuis l'explorateur Windows
 * @param {Function} onPlanLoaded - Callback appelé avec les données du plan
 */
export const chargerPlanJSONAvecExplorateur = (onPlanLoaded) => {
  chargerFichierAvecExplorateur((planData, fileName) => {
    console.log(`Plan chargé depuis: ${fileName}`);
    onPlanLoaded(planData, fileName);
  }, '.json');
};

/**
 * Exporter un plan vers un fichier JSON
 * @param {Object} planData - Données du plan à exporter
 * @param {string} fileName - Nom du fichier (défaut: 'mon-plan.json')
 */
export const exporterPlanVersFichier = (planData, fileName = 'mon-plan.json') => {
  const dataStr = JSON.stringify(planData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = fileName;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(link.href);
};
