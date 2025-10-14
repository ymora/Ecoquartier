// Configuration
const ESPECES = [];
const TYPES = [
  { id: 'vue_generale', nom: 'Vue générale' },
  { id: 'bourgeons', nom: 'Bourgeons' },
  { id: 'fleurs', nom: 'Fleurs' },
  { id: 'fruits', nom: 'Fruits' },
  { id: 'automne', nom: 'Automne' },
  { id: 'hiver', nom: 'Hiver' }
];

// État global
let state = {
  filterEspece: '',
  filterType: '',
  existingImages: [],
  selectedImages: new Set(),
  uploadQueue: [],
  pendingChanges: {} // Changements en attente par filename
};

// Éléments DOM
const filterEspece = document.getElementById('filterEspece');
const filterType = document.getElementById('filterType');
const resetFiltersBtn = document.getElementById('resetFilters');
const existingImagesGrid = document.getElementById('existingImagesGrid');
const saveAllBtn = document.getElementById('saveAll');
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const uploadQueue = document.getElementById('uploadQueue');
const uploadActions = document.getElementById('uploadActions');
const uploadAllBtn = document.getElementById('uploadAll');
const clearQueueBtn = document.getElementById('clearQueue');
const logContainer = document.getElementById('logContainer');
const log = document.getElementById('log');

// Fonction d'échappement HTML pour prévenir XSS
function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

// Initialisation
async function init() {
  await loadConfig();
  populateFilters();
  attachEventListeners();
  
  // Charger toutes les images au démarrage
  await loadExistingImages();
  renderExistingImages();
  
  addLog('info', '✓ Interface chargée');
}

// Charger la configuration
async function loadConfig() {
  try {
    const response = await fetch('/images_completes.json');
    const config = await response.json();
    
    ESPECES.length = 0;
    config.especes.forEach(espece => {
      ESPECES.push({
        id: espece.id,
        nom: espece.nom
      });
    });
  } catch (err) {
    addLog('error', 'Erreur chargement configuration: ' + err.message);
  }
}

// Remplir les filtres
function populateFilters() {
  filterEspece.innerHTML = '<option value="">-- Toutes les espèces --</option>';
  ESPECES.forEach(espece => {
    const option = document.createElement('option');
    option.value = espece.id;
    option.textContent = espece.nom;
    filterEspece.appendChild(option);
  });

  filterType.innerHTML = '<option value="">-- Tous les types --</option>';
  TYPES.forEach(type => {
    const option = document.createElement('option');
    option.value = type.id;
    option.textContent = type.nom;
    filterType.appendChild(option);
  });
}

// Event listeners
function attachEventListeners() {
  // Filtres
  filterEspece.addEventListener('change', handleFilterChange);
  filterType.addEventListener('change', handleFilterChange);
  resetFiltersBtn.addEventListener('click', resetFilters);

  // Sauvegarder tout
  saveAllBtn.addEventListener('click', saveAllModifications);

  // Upload
  dropzone.addEventListener('click', () => fileInput.click());
  dropzone.addEventListener('dragover', handleDragOver);
  dropzone.addEventListener('dragleave', handleDragLeave);
  dropzone.addEventListener('drop', handleDrop);
  fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

  // Actions upload
  uploadAllBtn.addEventListener('click', uploadAll);
  clearQueueBtn.addEventListener('click', clearUploadQueue);
}

// Gestion des filtres
async function handleFilterChange() {
  state.filterEspece = filterEspece.value;
  state.filterType = filterType.value;
  
  await loadExistingImages();
  renderExistingImages();
}

function resetFilters() {
  filterEspece.value = '';
  filterType.value = '';
  state.filterEspece = '';
  state.filterType = '';
  state.existingImages = [];
  renderExistingImages();
}

// Charger les images existantes avec filtres
async function loadExistingImages() {
  try {
    // Construire l'URL avec filtres optionnels
    let url = '/list-images';
    const params = new URLSearchParams();
    
    if (state.filterEspece) params.append('espece', state.filterEspece);
    if (state.filterType) params.append('type', state.filterType);
    
    if (params.toString()) {
      url += '?' + params.toString();
    }
    
    const response = await fetch(url);
    const data = await response.json();
    state.existingImages = data.images || [];
  } catch (err) {
    addLog('error', 'Erreur chargement images: ' + err.message);
    state.existingImages = [];
  }
}

// Afficher les images existantes (format liste unifié)
function renderExistingImages() {
  if (state.existingImages.length === 0) {
    existingImagesGrid.innerHTML = '<p class="empty-message">Aucune image trouvée</p>';
    return;
  }

  existingImagesGrid.innerHTML = state.existingImages.map(img => `
    <div class="existing-item" data-filename="${escapeHTML(img.filename)}" data-espece="${escapeHTML(img.espece)}">
      <img 
        src="http://localhost:3001${escapeHTML(img.path)}" 
        alt="${escapeHTML(img.filename)}" 
        class="existing-item-thumb"
        data-fullpath="${escapeHTML(img.path)}"
      >
      
      <div class="existing-item-config">
        <div>
          <div class="existing-item-name">${escapeHTML(img.filename)}</div>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
            <select class="config-espece-existing" data-filename="${escapeHTML(img.filename)}">
              ${ESPECES.map(e => `
                <option value="${e.id}" ${img.espece === e.id ? 'selected' : ''}>
                  ${escapeHTML(e.nom)}
                </option>
              `).join('')}
            </select>
            
            <select class="config-type-existing" data-filename="${escapeHTML(img.filename)}">
              ${TYPES.map(t => `
                <option value="${t.id}" ${img.type === t.id ? 'selected' : ''}>
                  ${escapeHTML(t.nom)}
                </option>
              `).join('')}
            </select>
          </div>
        </div>
      </div>
      
      <div class="existing-item-number">
        <label>#</label>
        <input 
          type="number" 
          min="1" 
          max="99" 
          value="${img.number}" 
          class="input-number"
          data-filename="${escapeHTML(img.filename)}"
          data-current-number="${img.number}"
          title="Changer le numéro (permute automatiquement)"
        >
      </div>
      
      <button class="btn-icon-outline btn-success-outline" data-filename="${escapeHTML(img.filename)}" title="Sauvegarder les modifications">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
          <polyline points="17 21 17 13 7 13 7 21"/>
          <polyline points="7 3 7 8 15 8"/>
        </svg>
      </button>
      
      <button class="btn-icon-outline btn-danger-outline" data-filename="${escapeHTML(img.filename)}" data-espece="${escapeHTML(img.espece)}" title="Supprimer cette image">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          <line x1="10" y1="11" x2="10" y2="17"/>
          <line x1="14" y1="11" x2="14" y2="17"/>
        </svg>
      </button>
    </div>
  `).join('');

  attachExistingImageListeners();
}

// Attacher les event listeners aux images existantes
function attachExistingImageListeners() {
  // Images (clic pour zoom)
  document.querySelectorAll('.existing-item-thumb').forEach(img => {
    img.addEventListener('click', (e) => {
      const fullPath = e.target.dataset.fullpath;
      openImageModal(`http://localhost:3001${fullPath}`);
    });
    img.style.cursor = 'pointer';
  });

  // Boutons sauver
  document.querySelectorAll('.existing-item .btn-success-outline').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const filename = e.currentTarget.dataset.filename;
      await saveImageChanges(filename);
    });
  });

  // Boutons supprimer individuels
  document.querySelectorAll('.existing-item .btn-danger-outline').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const filename = e.currentTarget.dataset.filename;
      const espece = e.currentTarget.dataset.espece;
      
      if (!confirm(`Supprimer ${filename} ?`)) return;
      
      try {
        const response = await fetch('/delete-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ espece, filename })
        });
        
        const result = await response.json();
        
        if (result.success) {
          addLog('success', result.message);
          await loadExistingImages();
          renderExistingImages();
        } else {
          addLog('error', result.error);
        }
      } catch (err) {
        addLog('error', 'Erreur: ' + err.message);
      }
      
      showLog();
    });
  });

  // Changements de selects et numéro (tracking sans sauvegarde)
  document.querySelectorAll('.config-espece-existing, .config-type-existing, .input-number').forEach(element => {
    element.addEventListener('change', (e) => {
      const filename = e.target.dataset.filename;
      const item = document.querySelector(`.existing-item[data-filename="${filename}"]`);
      
      if (!item) return;
      
      // Initialiser les changements pour ce fichier si nécessaire
      if (!state.pendingChanges[filename]) {
        const img = state.existingImages.find(i => i.filename === filename);
        state.pendingChanges[filename] = {
          filename: filename,
          originalEspece: img.espece,
          originalType: img.type,
          originalNumber: img.number,
          newEspece: img.espece,
          newType: img.type,
          newNumber: img.number
        };
      }
      
      // Mettre à jour les changements
      const especeSelect = item.querySelector('.config-espece-existing');
      const typeSelect = item.querySelector('.config-type-existing');
      const numberInput = item.querySelector('.input-number');
      
      state.pendingChanges[filename].newEspece = especeSelect.value;
      state.pendingChanges[filename].newType = typeSelect.value;
      state.pendingChanges[filename].newNumber = parseInt(numberInput.value);
      
      // Vérifier s'il y a vraiment des changements
      const hasChanges = 
        state.pendingChanges[filename].newEspece !== state.pendingChanges[filename].originalEspece ||
        state.pendingChanges[filename].newType !== state.pendingChanges[filename].originalType ||
        state.pendingChanges[filename].newNumber !== state.pendingChanges[filename].originalNumber;
      
      const btn = item.querySelector('.btn-success-outline');
      
      if (hasChanges) {
        // Vérifier les conflits
        const conflict = detectConflict(filename, state.pendingChanges[filename]);
        
        if (conflict) {
          // CONFLIT détecté
          item.classList.add('has-conflict');
          item.classList.remove('has-changes');
          btn.classList.add('conflict');
          btn.classList.remove('modified');
          btn.disabled = true;
          btn.setAttribute('title', conflict.message);
          
          // Afficher suggestion
          showConflictSuggestion(item, conflict.suggestion);
        } else {
          // Marquer comme modifié (pas de conflit)
          item.classList.add('has-changes');
          item.classList.remove('has-conflict');
          btn.classList.add('modified');
          btn.classList.remove('conflict');
          btn.disabled = false;
          btn.setAttribute('title', 'Sauvegarder tous les changements');
          hideConflictSuggestion(item);
        }
      } else {
        // Retirer l'indicateur si retour à l'état original
        item.classList.remove('has-changes');
        item.classList.remove('has-conflict');
        btn.classList.remove('modified');
        btn.classList.remove('conflict');
        btn.disabled = false;
        btn.setAttribute('title', 'Sauvegarder les modifications');
        delete state.pendingChanges[filename];
        hideConflictSuggestion(item);
      }
      
      updateSaveAllButton();
    });
  });
}

// Détecter les conflits entre modifications en attente
function detectConflict(currentFilename, changes) {
  const targetKey = `${changes.newEspece}_${changes.newType}_${changes.newNumber}`;
  
  // Vérifier les modifications en attente
  for (const [filename, pendingChange] of Object.entries(state.pendingChanges)) {
    if (filename === currentFilename) continue;
    
    const pendingKey = `${pendingChange.newEspece}_${pendingChange.newType}_${pendingChange.newNumber}`;
    
    if (pendingKey === targetKey) {
      return {
        message: `⚠️ Conflit avec ${filename} (aussi ${changes.newType} #${changes.newNumber})`,
        suggestion: getSuggestedNumber(changes.newEspece, changes.newType)
      };
    }
  }
  
  // Vérifier les images existantes non modifiées
  const existingConflict = state.existingImages.find(img =>
    img.filename !== currentFilename &&
    img.espece === changes.newEspece &&
    img.type === changes.newType &&
    img.number === changes.newNumber &&
    !state.pendingChanges[img.filename] // Pas déjà en cours de modification
  );
  
  if (existingConflict) {
    return {
      message: `⚠️ Le numéro #${changes.newNumber} existe déjà (permutation auto lors de la sauvegarde)`,
      suggestion: null // Permutation OK, pas de suggestion
    };
  }
  
  return null;
}

// Trouver le prochain numéro disponible pour une espèce/type
function getSuggestedNumber(espece, type) {
  const existing = state.existingImages
    .filter(img => img.espece === espece && img.type === type)
    .map(img => img.number);
  
  const pending = Object.values(state.pendingChanges)
    .filter(change => change.newEspece === espece && change.newType === type)
    .map(change => change.newNumber);
  
  const allNumbers = [...existing, ...pending];
  const maxNumber = allNumbers.length > 0 ? Math.max(...allNumbers) : 0;
  
  return maxNumber + 1;
}

// Afficher suggestion de numéro
function showConflictSuggestion(item, suggestion) {
  if (!suggestion) return;
  
  let suggestionDiv = item.querySelector('.conflict-suggestion');
  if (!suggestionDiv) {
    suggestionDiv = document.createElement('div');
    suggestionDiv.className = 'conflict-suggestion';
    item.appendChild(suggestionDiv);
  }
  
  suggestionDiv.innerHTML = `
    <span>Prochain dispo : #${String(suggestion).padStart(2, '0')}</span>
    <button class="btn-apply-suggestion" data-number="${suggestion}">Appliquer</button>
  `;
  
  // Event listener pour appliquer la suggestion
  const applyBtn = suggestionDiv.querySelector('.btn-apply-suggestion');
  applyBtn.addEventListener('click', () => {
    const numberInput = item.querySelector('.input-number');
    numberInput.value = suggestion;
    numberInput.dispatchEvent(new Event('change'));
  });
}

// Cacher suggestion de conflit
function hideConflictSuggestion(item) {
  const suggestionDiv = item.querySelector('.conflict-suggestion');
  if (suggestionDiv) {
    suggestionDiv.remove();
  }
}

// Permuter les numéros de deux images
async function swapImageNumbers(img1, img2) {
  try {
    const response = await fetch('/swap-images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image1: {
          filename: img1.filename,
          espece: img1.espece,
          type: img1.type,
          number: img1.number
        },
        image2: {
          filename: img2.filename,
          espece: img2.espece,
          type: img2.type,
          number: img2.number
        }
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      addLog('success', result.message);
      await loadExistingImages();
      renderExistingImages();
    } else {
      addLog('error', result.error);
    }
    
    showLog();
  } catch (err) {
    addLog('error', 'Erreur permutation: ' + err.message);
    showLog();
  }
}

// Changer le numéro d'une image (sans conflit)
async function changeImageNumber(img, newNumber) {
  try {
    const response = await fetch('/change-number', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: img.filename,
        espece: img.espece,
        type: img.type,
        currentNumber: img.number,
        newNumber: newNumber
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      addLog('success', result.message);
      await loadExistingImages();
      renderExistingImages();
    } else {
      addLog('error', result.error);
    }
    
    showLog();
  } catch (err) {
    addLog('error', 'Erreur changement numéro: ' + err.message);
    showLog();
  }
}

// Sauvegarder toutes les modifications
async function saveAllModifications() {
  const modifiedItems = document.querySelectorAll('.existing-item .btn-success-outline.modified');
  
  if (modifiedItems.length === 0) {
    alert('Aucune modification à sauvegarder');
    return;
  }
  
  saveAllBtn.disabled = true;
  showLog();
  
  for (const btn of modifiedItems) {
    const filename = btn.dataset.filename;
    await saveImageChanges(filename);
  }
  
  saveAllBtn.disabled = false;
  updateSaveAllButton();
}

// Mettre à jour l'état du bouton "Sauvegarder tout"
function updateSaveAllButton() {
  const modifiedCount = document.querySelectorAll('.btn-success-outline.modified').length;
  saveAllBtn.disabled = modifiedCount === 0;
  
  if (modifiedCount > 0) {
    saveAllBtn.classList.add('has-changes');
    saveAllBtn.setAttribute('data-count', modifiedCount);
    saveAllBtn.setAttribute('title', `Sauvegarder ${modifiedCount} modification(s)`);
  } else {
    saveAllBtn.classList.remove('has-changes');
    saveAllBtn.removeAttribute('data-count');
    saveAllBtn.setAttribute('title', 'Sauvegarder toutes les modifications');
  }
}

// Sauvegarder tous les changements d'une image
async function saveImageChanges(filename) {
  const changes = state.pendingChanges[filename];
  if (!changes) {
    alert('Aucune modification détectée');
    return;
  }
  
  const item = document.querySelector(`.existing-item[data-filename="${filename}"]`);
  const btn = item.querySelector('.btn-success-outline');
  
  btn.disabled = true;
  showLog();
  
  try {
    const img = state.existingImages.find(i => i.filename === filename);
    if (!img) return;
    
    // Déterminer le type d'opération
    const hasNumberChange = changes.newNumber !== changes.originalNumber;
    const hasTypeOrEspeceChange = 
      changes.newEspece !== changes.originalEspece || 
      changes.newType !== changes.originalType;
    
    // Si changement de numéro ET espèce/type, faire espèce/type d'abord
    if (hasTypeOrEspeceChange) {
      addLog('info', `🔄 Modification espèce/type...`);
      const response = await fetch('/rename-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldFilename: filename,
          oldEspece: changes.originalEspece,
          newEspece: changes.newEspece,
          newType: changes.newType
        })
      });
      
      const result = await response.json();
      if (result.success) {
        addLog('success', result.message);
      } else {
        addLog('error', result.error);
        btn.disabled = false;
        return;
      }
    } else if (hasNumberChange) {
      // Seulement changement de numéro
      const targetImg = state.existingImages.find(i => 
        i.espece === img.espece && 
        i.type === img.type && 
        i.number === changes.newNumber
      );
      
      if (targetImg) {
        // Permutation
        addLog('info', `🔄 Permutation #${changes.originalNumber} ↔ #${changes.newNumber}...`);
        const response = await fetch('/swap-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image1: {
              filename: filename,
              espece: img.espece,
              type: img.type,
              number: img.number
            },
            image2: {
              filename: targetImg.filename,
              espece: targetImg.espece,
              type: targetImg.type,
              number: targetImg.number
            }
          })
        });
        
        const result = await response.json();
        if (result.success) {
          addLog('success', result.message);
        } else {
          addLog('error', result.error);
          btn.disabled = false;
          return;
        }
      } else {
        // Simple changement de numéro
        addLog('info', `🔄 Changement #${changes.originalNumber} → #${changes.newNumber}...`);
        const response = await fetch('/change-number', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: filename,
            espece: img.espece,
            type: img.type,
            currentNumber: changes.originalNumber,
            newNumber: changes.newNumber
          })
        });
        
        const result = await response.json();
        if (result.success) {
          addLog('success', result.message);
        } else {
          addLog('error', result.error);
          btn.disabled = false;
          return;
        }
      }
    }
    
    // Succès : nettoyer les changements
    delete state.pendingChanges[filename];
    btn.classList.remove('modified');
    btn.classList.add('saved');
    item.classList.remove('has-changes');
    
    // Recharger
    setTimeout(async () => {
      await loadExistingImages();
      renderExistingImages();
      updateSaveAllButton();
    }, 1000);
    
  } catch (err) {
    addLog('error', 'Erreur: ' + err.message);
    btn.disabled = false;
  }
}

// Modal d'image en plein écran
function openImageModal(imageSrc) {
  // Créer le modal s'il n'existe pas
  let modal = document.getElementById('imageModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'imageModal';
    modal.className = 'image-modal';
    modal.innerHTML = `
      <div class="image-modal-overlay"></div>
      <div class="image-modal-content">
        <button class="image-modal-close">✕</button>
        <img class="image-modal-img" src="" alt="Image en plein écran">
      </div>
    `;
    document.body.appendChild(modal);
    
    // Event listeners
    modal.querySelector('.image-modal-overlay').addEventListener('click', closeImageModal);
    modal.querySelector('.image-modal-close').addEventListener('click', closeImageModal);
    
    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeImageModal();
      }
    });
  }
  
  // Afficher le modal
  const img = modal.querySelector('.image-modal-img');
  img.src = imageSrc;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeImageModal() {
  const modal = document.getElementById('imageModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Drag & Drop
function handleDragOver(e) {
  e.preventDefault();
  dropzone.classList.add('drag-over');
}

function handleDragLeave(e) {
  e.preventDefault();
  dropzone.classList.remove('drag-over');
}

function handleDrop(e) {
  e.preventDefault();
  dropzone.classList.remove('drag-over');
  handleFiles(e.dataTransfer.files);
}

// Gestion des fichiers
function handleFiles(files) {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  Array.from(files).forEach(file => {
    if (!validTypes.includes(file.type) && !file.type.startsWith('image/')) {
      alert(`Fichier ${file.name} ignoré - Format non supporté`);
      return;
    }
    
    addToUploadQueue(file);
  });
}

// Ajouter à la file d'upload
function addToUploadQueue(file) {
  const id = Date.now() + Math.random();
  const reader = new FileReader();
  
  reader.onload = (e) => {
    // Détection auto espèce/type
    const fileName = file.name.toLowerCase();
    let detectedEspece = '';
    let detectedType = '';
    
    // Détecter espèce
    for (const espece of ESPECES) {
      if (fileName.includes(espece.id) || fileName.includes(espece.nom.toLowerCase())) {
        detectedEspece = espece.id;
        break;
      }
    }
    
    // Détecter type
    if (fileName.includes('vue') || fileName.includes('general')) detectedType = 'vue_generale';
    else if (fileName.includes('bourgeon')) detectedType = 'bourgeons';
    else if (fileName.includes('fleur')) detectedType = 'fleurs';
    else if (fileName.includes('fruit')) detectedType = 'fruits';
    else if (fileName.includes('automne')) detectedType = 'automne';
    else if (fileName.includes('hiver')) detectedType = 'hiver';
    
    const uploadItem = {
      id,
      file,
      preview: e.target.result,
      espece: detectedEspece,
      type: detectedType,
      status: 'pending'
    };
    
    state.uploadQueue.push(uploadItem);
    renderUploadQueue();
  };
  
  reader.readAsDataURL(file);
}

// Afficher la file d'upload
function renderUploadQueue() {
  if (state.uploadQueue.length === 0) {
    uploadQueue.innerHTML = '';
    uploadActions.classList.add('hidden');
    return;
  }

  uploadQueue.innerHTML = state.uploadQueue.map(item => {
    let nextNumberInfo = '';
    
    // Si espèce et type sont sélectionnés, calculer le prochain numéro
    if (item.espece && item.type) {
      const existingCount = state.existingImages.filter(img => 
        img.espece === item.espece && img.type === item.type
      ).length;
      const nextNumber = existingCount + 1;
      nextNumberInfo = `→ #${String(nextNumber).padStart(2, '0')}`;
    }
    
    return `
    <div class="upload-item" data-id="${item.id}">
      <img src="${item.preview}" alt="${escapeHTML(item.file.name)}" class="upload-item-thumb">
      
      <div class="upload-item-config">
        <div>
          <div class="upload-item-name">${escapeHTML(item.file.name)}</div>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
            <select class="config-espece" data-id="${item.id}">
              <option value="">-- Espèce --</option>
              ${ESPECES.map(e => `
                <option value="${e.id}" ${item.espece === e.id ? 'selected' : ''}>
                  ${escapeHTML(e.nom)}
                </option>
              `).join('')}
            </select>
            
            <select class="config-type" data-id="${item.id}" ${!item.espece ? 'disabled' : ''}>
              <option value="">-- Type --</option>
              ${TYPES.map(t => `
                <option value="${t.id}" ${item.type === t.id ? 'selected' : ''}>
                  ${escapeHTML(t.nom)}
                </option>
              `).join('')}
            </select>
          </div>
          ${nextNumberInfo ? `<div class="next-number-badge">${nextNumberInfo}</div>` : ''}
        </div>
      </div>
      
      <span class="upload-item-status status-${item.status}">
        ${getStatusLabel(item.status)}
      </span>
      
      <button class="btn-small btn-primary" data-id="${item.id}" ${!canUpload(item) ? 'disabled' : ''}>
        🚀 Envoyer
      </button>
      
      <button class="btn-small btn-danger" data-id="${item.id}">
        🗑️
      </button>
    </div>
  `;
  }).join('');

  uploadActions.classList.remove('hidden');

  // Event listeners
  document.querySelectorAll('.config-espece').forEach(select => {
    select.addEventListener('change', (e) => {
      const item = state.uploadQueue.find(i => i.id === Number(e.target.dataset.id));
      item.espece = e.target.value;
      item.type = '';
      renderUploadQueue(); // Re-render pour mettre à jour le badge numéro
    });
  });

  document.querySelectorAll('.config-type').forEach(select => {
    select.addEventListener('change', (e) => {
      const item = state.uploadQueue.find(i => i.id === Number(e.target.dataset.id));
      item.type = e.target.value;
      renderUploadQueue(); // Re-render pour afficher le prochain numéro
    });
  });

  document.querySelectorAll('.upload-item .btn-primary').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = Number(e.currentTarget.dataset.id);
      await uploadSingle(id);
    });
  });

  document.querySelectorAll('.upload-item .btn-danger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(e.currentTarget.dataset.id);
      state.uploadQueue = state.uploadQueue.filter(item => item.id !== id);
      renderUploadQueue();
    });
  });
}

// Upload une seule image
async function uploadSingle(id) {
  const item = state.uploadQueue.find(i => i.id === id);
  if (!item || !canUpload(item)) return;

  item.status = 'uploading';
  renderUploadQueue();

  try {
    const formData = new FormData();
    formData.append('images', item.file);
    formData.append('configs', JSON.stringify({
      espece: item.espece,
      type: item.type,
      targetName: `${item.espece}_${item.type}.jpg`
    }));

    const response = await fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      item.status = 'success';
      addLog('success', result.details[0].message);
      
      // Retirer de la file après 2s
      setTimeout(() => {
        state.uploadQueue = state.uploadQueue.filter(i => i.id !== id);
        renderUploadQueue();
      }, 2000);
    } else {
      item.status = 'error';
      addLog('error', result.error);
    }
  } catch (err) {
    item.status = 'error';
    addLog('error', `Erreur upload: ${err.message}`);
  }

  renderUploadQueue();
  showLog();
  
  // Recharger les images existantes si on est sur les mêmes filtres
  if (state.filterEspece === item.espece && state.filterType === item.type) {
    await loadExistingImages();
    renderExistingImages();
  }
}

// Upload toutes les images
async function uploadAll() {
  const readyItems = state.uploadQueue.filter(item => canUpload(item) && item.status === 'pending');
  
  if (readyItems.length === 0) {
    alert('Aucune image prête à être envoyée');
    return;
  }

  if (!confirm(`Envoyer ${readyItems.length} image(s) ?`)) return;

  uploadAllBtn.disabled = true;
  uploadAllBtn.textContent = '⏳ Envoi en cours...';
  showLog();

  for (const item of readyItems) {
    await uploadSingle(item.id);
  }

  uploadAllBtn.disabled = false;
  uploadAllBtn.textContent = '🚀 Envoyer toutes les images';
  
  addLog('success', `✓ ${readyItems.length} image(s) envoyée(s)`);
}

// Vider la file
function clearUploadQueue() {
  if (!confirm('Vider toute la file d\'upload ?')) return;
  state.uploadQueue = [];
  renderUploadQueue();
}

// Utilitaires
function canUpload(item) {
  return item.espece && item.type && (item.status === 'pending' || item.status === 'error');
}

function getStatusLabel(status) {
  const labels = {
    pending: '⏳ En attente',
    uploading: '🔄 Envoi...',
    success: '✓ Envoyé',
    error: '✗ Erreur'
  };
  return labels[status] || status;
}

// Logging
function addLog(type, message) {
  const timestamp = new Date().toLocaleTimeString('fr-FR');
  const logEntry = document.createElement('div');
  logEntry.className = `log-${type}`;
  logEntry.textContent = `[${timestamp}] ${message}`;
  log.appendChild(logEntry);
  log.scrollTop = log.scrollHeight;
}

function showLog() {
  logContainer.classList.remove('hidden');
}

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', init);
