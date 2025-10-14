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

// Afficher les images existantes
function renderExistingImages() {
  if (state.existingImages.length === 0) {
    existingImagesGrid.innerHTML = '<p class="empty-message">Aucune image trouvée</p>';
    return;
  }

  // Grouper les images par espèce et type si pas de filtres
  const shouldGroup = !state.filterEspece && !state.filterType;
  
  if (shouldGroup) {
    renderGroupedImages();
  } else {
    renderSimpleImages();
  }
}

// Affichage simple (avec filtres)
function renderSimpleImages() {
  existingImagesGrid.innerHTML = state.existingImages.map(img => `
    <div class="image-card" data-filename="${escapeHTML(img.filename)}">
      <input 
        type="checkbox" 
        class="image-card-checkbox"
        data-filename="${escapeHTML(img.filename)}"
      >
      <img 
        src="http://localhost:3001${escapeHTML(img.path)}" 
        alt="${escapeHTML(img.filename)}" 
        class="image-card-thumb"
      >
      <div class="image-card-info">#${escapeHTML(String(img.number))}</div>
      <div class="image-card-name">${escapeHTML(img.filename)}</div>
    </div>
  `).join('');

  attachImageCardListeners();
}

// Affichage groupé (sans filtres)
function renderGroupedImages() {
  // Grouper par espèce
  const grouped = {};
  state.existingImages.forEach(img => {
    if (!grouped[img.espece]) {
      grouped[img.espece] = {
        nom: img.especeNom,
        images: []
      };
    }
    grouped[img.espece].images.push(img);
  });

  let html = '';
  Object.keys(grouped).sort().forEach(especeId => {
    const group = grouped[especeId];
    html += `
      <div class="image-group-header">
        <h3>${escapeHTML(group.nom)}</h3>
        <span class="image-count">${group.images.length} image(s)</span>
      </div>
    `;
    
    group.images.forEach(img => {
      html += `
        <div class="image-card" data-filename="${escapeHTML(img.filename)}">
          <input 
            type="checkbox" 
            class="image-card-checkbox"
            data-filename="${escapeHTML(img.filename)}"
          >
          <img 
            src="http://localhost:3001${escapeHTML(img.path)}" 
            alt="${escapeHTML(img.filename)}" 
            class="image-card-thumb"
          >
          <div class="image-card-info">
            <span class="type-badge">${escapeHTML(img.typeNom)}</span>
            <span class="number-badge">#${escapeHTML(String(img.number))}</span>
          </div>
          <div class="image-card-name">${escapeHTML(img.filename)}</div>
        </div>
      `;
    });
  });

  existingImagesGrid.innerHTML = html;
  attachImageCardListeners();
}

// Attacher les event listeners aux cartes
function attachImageCardListeners() {
  document.querySelectorAll('.image-card').forEach(card => {
    const checkbox = card.querySelector('.image-card-checkbox');
    const filename = card.dataset.filename;

    card.addEventListener('click', (e) => {
      if (e.target === checkbox) return;
      checkbox.checked = !checkbox.checked;
      toggleImageSelection(filename, checkbox.checked);
    });

    checkbox.addEventListener('change', (e) => {
      toggleImageSelection(filename, e.target.checked);
    });
  });
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
