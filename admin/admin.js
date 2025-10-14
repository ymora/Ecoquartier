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
  uploadQueue: []
};

// Éléments DOM
const filterEspece = document.getElementById('filterEspece');
const filterType = document.getElementById('filterType');
const resetFiltersBtn = document.getElementById('resetFilters');
const existingImagesGrid = document.getElementById('existingImagesGrid');
const selectedCount = document.getElementById('selectedCount');
const deleteSelectedBtn = document.getElementById('deleteSelected');
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

  // Sélection/suppression
  deleteSelectedBtn.addEventListener('click', deleteSelectedImages);

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
  state.selectedImages.clear();
  
  await loadExistingImages();
  renderExistingImages();
  updateSelectionUI();
}

function resetFilters() {
  filterEspece.value = '';
  filterType.value = '';
  state.filterEspece = '';
  state.filterType = '';
  state.selectedImages.clear();
  state.existingImages = [];
  renderExistingImages();
  updateSelectionUI();
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
    <div class="existing-item" data-filename="${escapeHTML(img.filename)}">
      <input 
        type="checkbox" 
        class="existing-item-checkbox"
        data-filename="${escapeHTML(img.filename)}"
      >
      
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
      
      <span class="existing-item-info">
        #${escapeHTML(String(img.number))}
      </span>
      
      <button class="btn-small btn-primary" data-filename="${escapeHTML(img.filename)}">
        💾 Sauver
      </button>
    </div>
  `).join('');

  attachExistingImageListeners();
}

// Attacher les event listeners aux images existantes
function attachExistingImageListeners() {
  // Checkboxes
  document.querySelectorAll('.existing-item-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const filename = e.target.dataset.filename;
      toggleImageSelection(filename, e.target.checked);
    });
  });

  // Images (clic pour zoom)
  document.querySelectorAll('.existing-item-thumb').forEach(img => {
    img.addEventListener('click', (e) => {
      const fullPath = e.target.dataset.fullpath;
      openImageModal(`http://localhost:3001${fullPath}`);
    });
    img.style.cursor = 'pointer';
  });

  // Boutons sauver
  document.querySelectorAll('.existing-item .btn-primary').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const filename = e.currentTarget.dataset.filename;
      await renameExistingImage(filename);
    });
  });

  // Changements de selects
  document.querySelectorAll('.config-espece-existing, .config-type-existing').forEach(select => {
    select.addEventListener('change', (e) => {
      const filename = e.target.dataset.filename;
      const btn = document.querySelector(`.existing-item .btn-primary[data-filename="${filename}"]`);
      if (btn) {
        btn.style.background = '#ed8936'; // Orange pour indiquer changement non sauvé
        btn.textContent = '💾 Sauver *';
      }
    });
  });
}

// Renommer une image existante
async function renameExistingImage(oldFilename) {
  const item = document.querySelector(`.existing-item[data-filename="${oldFilename}"]`);
  const especeSelect = item.querySelector('.config-espece-existing');
  const typeSelect = item.querySelector('.config-type-existing');
  const btn = item.querySelector('.btn-primary');
  
  const newEspece = especeSelect.value;
  const newType = typeSelect.value;
  
  // Trouver l'image dans state
  const img = state.existingImages.find(i => i.filename === oldFilename);
  if (!img) return;
  
  // Si rien n'a changé
  if (img.espece === newEspece && img.type === newType) {
    alert('Aucune modification détectée');
    return;
  }
  
  btn.disabled = true;
  btn.textContent = '⏳ Sauvegarde...';
  
  try {
    const response = await fetch('/rename-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        oldFilename: oldFilename,
        oldEspece: img.espece,
        newEspece: newEspece,
        newType: newType
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      addLog('success', result.message);
      btn.style.background = '#48bb78'; // Vert
      btn.textContent = '✓ Sauvé';
      
      // Recharger les images
      setTimeout(async () => {
        await loadExistingImages();
        renderExistingImages();
      }, 1000);
    } else {
      addLog('error', result.error);
      btn.disabled = false;
      btn.textContent = '💾 Sauver';
    }
  } catch (err) {
    addLog('error', 'Erreur: ' + err.message);
    btn.disabled = false;
    btn.textContent = '💾 Sauver';
  }
  
  showLog();
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

// Gestion sélection images
function toggleImageSelection(filename, selected) {
  const card = document.querySelector(`.image-card[data-filename="${filename}"]`);
  
  if (selected) {
    state.selectedImages.add(filename);
    card.classList.add('selected');
  } else {
    state.selectedImages.delete(filename);
    card.classList.remove('selected');
  }
  
  updateSelectionUI();
}

function updateSelectionUI() {
  const count = state.selectedImages.size;
  selectedCount.textContent = `${count} sélectionnée(s)`;
  deleteSelectedBtn.disabled = count === 0;
}

// Supprimer les images sélectionnées
async function deleteSelectedImages() {
  const count = state.selectedImages.size;
  if (count === 0) return;

  if (!confirm(`Supprimer ${count} image(s) ?`)) return;

  deleteSelectedBtn.disabled = true;
  deleteSelectedBtn.textContent = '⏳ Suppression...';
  
  const results = [];
  
  for (const filename of state.selectedImages) {
    try {
      const response = await fetch('/delete-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          espece: state.filterEspece,
          filename: filename
        })
      });
      
      const result = await response.json();
      results.push(result);
      
      if (result.success) {
        addLog('success', result.message);
      } else {
        addLog('error', result.error);
      }
    } catch (err) {
      addLog('error', `Erreur: ${filename} - ${err.message}`);
    }
  }

  // Recharger les images
  state.selectedImages.clear();
  await loadExistingImages();
  renderExistingImages();
  updateSelectionUI();
  
  deleteSelectedBtn.disabled = false;
  deleteSelectedBtn.textContent = '🗑️ Supprimer la sélection';
  
  showLog();
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

  uploadQueue.innerHTML = state.uploadQueue.map(item => `
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
  `).join('');

  uploadActions.classList.remove('hidden');

  // Event listeners
  document.querySelectorAll('.config-espece').forEach(select => {
    select.addEventListener('change', (e) => {
      const item = state.uploadQueue.find(i => i.id === Number(e.target.dataset.id));
      item.espece = e.target.value;
      item.type = '';
      renderUploadQueue();
    });
  });

  document.querySelectorAll('.config-type').forEach(select => {
    select.addEventListener('change', (e) => {
      const item = state.uploadQueue.find(i => i.id === Number(e.target.dataset.id));
      item.type = e.target.value;
      renderUploadQueue();
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
