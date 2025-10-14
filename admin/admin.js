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
const saveAllBtn = document.getElementById('saveAll');
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
  saveAllBtn.addEventListener('click', saveAllModifications);
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
    <div class="existing-item" data-filename="${escapeHTML(img.filename)}" data-espece="${escapeHTML(img.espece)}">
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
  document.querySelectorAll('.existing-item .btn-success-outline').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const filename = e.currentTarget.dataset.filename;
      await renameExistingImage(filename);
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

  // Changements de selects
  document.querySelectorAll('.config-espece-existing, .config-type-existing').forEach(select => {
    select.addEventListener('change', (e) => {
      const filename = e.target.dataset.filename;
      const item = document.querySelector(`.existing-item[data-filename="${filename}"]`);
      const btn = item.querySelector('.btn-success-outline');
      if (btn) {
        btn.classList.add('modified');
        btn.setAttribute('title', 'Sauvegarder les modifications *');
      }
      
      updateSaveAllButton();
    });
  });

  // Changements de numéro (permutation)
  document.querySelectorAll('.input-number').forEach(input => {
    input.addEventListener('change', async (e) => {
      const filename = e.target.dataset.filename;
      const currentNumber = parseInt(e.target.dataset.currentNumber);
      const newNumber = parseInt(e.target.value);
      
      if (newNumber === currentNumber || newNumber < 1) {
        e.target.value = currentNumber;
        return;
      }
      
      const img = state.existingImages.find(i => i.filename === filename);
      if (!img) return;
      
      // Vérifier si le nouveau numéro existe déjà
      const targetImg = state.existingImages.find(i => 
        i.espece === img.espece && 
        i.type === img.type && 
        i.number === newNumber
      );
      
      if (targetImg) {
        // Permutation nécessaire
        if (confirm(`Permuter #${currentNumber} ↔ #${newNumber} ?`)) {
          await swapImageNumbers(img, targetImg);
        } else {
          e.target.value = currentNumber;
        }
      } else {
        // Pas de conflit, juste renommer
        if (confirm(`Changer le numéro de #${currentNumber} à #${newNumber} ?`)) {
          await changeImageNumber(img, newNumber);
        } else {
          e.target.value = currentNumber;
        }
      }
    });
  });
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
  
  if (!confirm(`Sauvegarder ${modifiedItems.length} modification(s) ?`)) return;
  
  saveAllBtn.disabled = true;
  showLog();
  
  for (const btn of modifiedItems) {
    const filename = btn.dataset.filename;
    await renameExistingImage(filename);
  }
  
  saveAllBtn.disabled = false;
  updateSaveAllButton();
}

// Mettre à jour l'état du bouton "Sauvegarder tout"
function updateSaveAllButton() {
  const modifiedCount = document.querySelectorAll('.btn-success-outline.modified').length;
  saveAllBtn.disabled = modifiedCount === 0;
  
  if (modifiedCount > 0) {
    saveAllBtn.setAttribute('title', `Sauvegarder ${modifiedCount} modification(s)`);
  } else {
    saveAllBtn.setAttribute('title', 'Sauvegarder toutes les modifications');
  }
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
      btn.classList.remove('modified');
      btn.classList.add('saved');
      btn.setAttribute('title', '✓ Sauvegardé');
      
      // Recharger les images
      setTimeout(async () => {
        await loadExistingImages();
        renderExistingImages();
        updateSaveAllButton();
      }, 1000);
    } else {
      addLog('error', result.error);
      btn.disabled = false;
    }
  } catch (err) {
    addLog('error', 'Erreur: ' + err.message);
    btn.disabled = false;
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
  const item = document.querySelector(`.existing-item[data-filename="${filename}"]`);
  
  if (selected) {
    state.selectedImages.add(filename);
    if (item) item.classList.add('selected');
  } else {
    state.selectedImages.delete(filename);
    if (item) item.classList.remove('selected');
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
  deleteSelectedBtn.setAttribute('title', 'Suppression en cours...');
  
  const results = [];
  
  for (const filename of state.selectedImages) {
    // Trouver l'espèce de cette image
    const img = state.existingImages.find(i => i.filename === filename);
    if (!img) continue;
    
    try {
      const response = await fetch('/delete-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          espece: img.espece,
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
  deleteSelectedBtn.setAttribute('title', 'Supprimer la sélection');
  
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
