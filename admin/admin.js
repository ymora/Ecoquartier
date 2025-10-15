// Configuration
const ESPECES = [
  { id: 'prunus-kanzan', nom: 'Cerisier du Japon Kanzan' },
  { id: 'prunus-accolade', nom: 'Cerisier Accolade' },
  { id: 'prunus-sunset-boulevard', nom: 'Cerisier Sunset Boulevard' },
  { id: 'noisetier', nom: 'Noisetier' },
  { id: 'fusain', nom: "Fusain d'Europe" },
  { id: 'troene', nom: 'Troène commun' },
  { id: 'osmanthe', nom: 'Osmanthe de Burkwood' },
  { id: 'cornouiller', nom: 'Cornouiller sanguin' },
  { id: 'seringat', nom: 'Seringat' }
];

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
  populateFilters();
  attachEventListeners();
  
  // Charger toutes les images au démarrage
  await loadExistingImages();
  renderExistingImages();
  
  addLog('info', '✓ Interface chargée');
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

  // Sauvegarder tout (modifs + uploads)
  saveAllBtn.addEventListener('click', saveAllModifications);

  // Upload
  dropzone.addEventListener('click', () => fileInput.click());
  dropzone.addEventListener('dragover', handleDragOver);
  dropzone.addEventListener('dragleave', handleDragLeave);
  dropzone.addEventListener('drop', handleDrop);
  fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

  // Actions upload
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
      
      <div class="number-badge-container"></div>
      
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
          
          // Supprimer les changements en attente pour cette image
          delete state.pendingChanges[filename];
          
          // Recharger sans perdre les autres modifications
          await loadExistingImages();
          renderExistingImages();
          restorePendingChanges(); // Restaurer les modifications en attente
        } else {
          addLog('error', result.error);
        }
      } catch (err) {
        addLog('error', 'Erreur: ' + err.message);
      }
      
      showLog();
    });
  });

  // Changements de selects (tracking sans sauvegarde)
  document.querySelectorAll('.config-espece-existing, .config-type-existing').forEach(element => {
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
      
      state.pendingChanges[filename].newEspece = especeSelect.value;
      state.pendingChanges[filename].newType = typeSelect.value;
      
      // AUTO-NUMÉROTATION : Si espèce ou type change, trouver automatiquement le prochain numéro
      const especeChanged = state.pendingChanges[filename].newEspece !== state.pendingChanges[filename].originalEspece;
      const typeChanged = state.pendingChanges[filename].newType !== state.pendingChanges[filename].originalType;
      
      if (especeChanged || typeChanged) {
        // Calculer le prochain numéro disponible pour cette nouvelle combinaison
        const nextNumber = getSuggestedNumber(state.pendingChanges[filename].newEspece, state.pendingChanges[filename].newType);
        state.pendingChanges[filename].newNumber = nextNumber;
        
        // Afficher un badge informatif à droite
        const container = item.querySelector('.number-badge-container');
        container.innerHTML = `<div class="auto-number-badge">→ #${String(nextNumber).padStart(2, '0')}</div>`;
      } else {
        // Si retour à l'espèce/type d'origine
        state.pendingChanges[filename].newNumber = state.pendingChanges[filename].originalNumber;
        
        // Vider le badge auto
        const container = item.querySelector('.number-badge-container');
        if (container) container.innerHTML = '';
      }
      
      // Vérifier s'il y a vraiment des changements
      const hasChanges = 
        state.pendingChanges[filename].newEspece !== state.pendingChanges[filename].originalEspece ||
        state.pendingChanges[filename].newType !== state.pendingChanges[filename].originalType ||
        state.pendingChanges[filename].newNumber !== state.pendingChanges[filename].originalNumber;
      
      if (hasChanges) {
        // Marquer comme modifié (auto-numérotation évite les conflits)
        item.classList.add('has-changes');
        item.classList.remove('has-conflict');
      } else {
        // Retirer l'indicateur si retour à l'état original
        item.classList.remove('has-changes');
        item.classList.remove('has-conflict');
        delete state.pendingChanges[filename];
      }
      
      updateSaveAllButton();
    });
  });
}

// Trouver le prochain numéro disponible pour une espèce/type (comble les trous)
function getSuggestedNumber(espece, type) {
  const existing = state.existingImages
    .filter(img => img.espece === espece && img.type === type)
    .map(img => img.number);
  
  const pending = Object.values(state.pendingChanges)
    .filter(change => change.newEspece === espece && change.newType === type)
    .map(change => change.newNumber);
  
  const allNumbers = [...new Set([...existing, ...pending])].sort((a, b) => a - b);
  
  // Si aucun numéro, commencer à 1
  if (allNumbers.length === 0) return 1;
  
  // Chercher le premier trou dans la séquence
  for (let i = 1; i <= allNumbers.length + 1; i++) {
    if (!allNumbers.includes(i)) {
      return i;
    }
  }
  
  // Par sécurité (ne devrait jamais arriver)
  return allNumbers.length + 1;
}

// Restaurer les modifications en attente après rechargement
function restorePendingChanges() {
  for (const [filename, changes] of Object.entries(state.pendingChanges)) {
    const item = document.querySelector(`.existing-item[data-filename="${filename}"]`);
    if (!item) {
      // Image supprimée, nettoyer
      delete state.pendingChanges[filename];
      continue;
    }
    
    // Appliquer les valeurs modifiées
    const especeSelect = item.querySelector('.config-espece-existing');
    const typeSelect = item.querySelector('.config-type-existing');
    
    if (especeSelect) especeSelect.value = changes.newEspece;
    if (typeSelect) typeSelect.value = changes.newType;
    
    // Vérifier les conflits et appliquer les styles
    const hasChanges = 
      changes.newEspece !== changes.originalEspece ||
      changes.newType !== changes.originalType ||
      changes.newNumber !== changes.originalNumber;
    
    if (hasChanges) {
      item.classList.add('has-changes');
    }
  }
  
  updateSaveAllButton();
}

// Sauvegarder toutes les modifications ET uploader nouvelles images
async function saveAllModifications() {
  const modifiedCount = Object.keys(state.pendingChanges).length;
  const uploadCount = state.uploadQueue.filter(item => canUpload(item) && item.status === 'pending').length;
  
  if (modifiedCount === 0 && uploadCount === 0) {
    alert('Aucune modification ou upload à traiter');
    return;
  }
  
  if (!confirm(`Traiter ${modifiedCount} modification(s) et ${uploadCount} upload(s) ?`)) {
    return;
  }
  
  saveAllBtn.disabled = true;
  showLog();
  
  // 1. Sauvegarder les modifications des images existantes
  for (const filename of Object.keys(state.pendingChanges)) {
    await saveImageChanges(filename);
  }
  
  // 2. Uploader les nouvelles images
  const readyItems = state.uploadQueue.filter(item => canUpload(item) && item.status === 'pending');
  for (const item of readyItems) {
    await uploadSingle(item.id);
  }
  
  saveAllBtn.disabled = false;
  updateSaveAllButton();
  
  addLog('success', `✓ ${modifiedCount + uploadCount} opération(s) terminée(s) - Push GitHub effectué`);
}

// Mettre à jour l'état du bouton "Sauvegarder tout"
function updateSaveAllButton() {
  const modifiedCount = Object.keys(state.pendingChanges).length;
  const uploadCount = state.uploadQueue.filter(item => canUpload(item) && item.status === 'pending').length;
  const totalCount = modifiedCount + uploadCount;
  
  saveAllBtn.disabled = totalCount === 0;
  
  if (totalCount > 0) {
    saveAllBtn.classList.add('has-changes');
    saveAllBtn.setAttribute('data-count', totalCount);
    
    const parts = [];
    if (modifiedCount > 0) parts.push(`${modifiedCount} modification(s)`);
    if (uploadCount > 0) parts.push(`${uploadCount} upload(s)`);
    
    saveAllBtn.setAttribute('title', `Traiter: ${parts.join(' + ')}`);
  } else {
    saveAllBtn.classList.remove('has-changes');
    saveAllBtn.removeAttribute('data-count');
    saveAllBtn.setAttribute('title', 'Sauvegarder et uploader');
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
    
    // Succès : nettoyer les changements de cette image
    delete state.pendingChanges[filename];
    item.classList.remove('has-changes');
    item.classList.remove('has-conflict');
    
    // Recharger et restaurer les autres modifications
    setTimeout(async () => {
      await loadExistingImages();
      renderExistingImages();
      restorePendingChanges(); // Restaurer les modifications des autres images
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

  uploadQueue.innerHTML = state.uploadQueue.map((item, index) => {
    let nextNumberInfo = '';
    
    // Si espèce et type sont sélectionnés, calculer le prochain numéro
    if (item.espece && item.type) {
      // Compter les images existantes
      const existingCount = state.existingImages.filter(img => 
        img.espece === item.espece && img.type === item.type
      ).length;
      
      // Compter les images AVANT celle-ci dans la file d'upload (même espèce+type)
      const queueBefore = state.uploadQueue.slice(0, index).filter(queueItem =>
        queueItem.espece === item.espece && 
        queueItem.type === item.type
      ).length;
      
      // Numéro = existantes + images avant dans queue + 1
      const nextNumber = existingCount + queueBefore + 1;
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
        </div>
      </div>
      
      <div class="number-badge-container">
        ${nextNumberInfo ? `<div class="next-number-badge">${nextNumberInfo}</div>` : ''}
      </div>
      
      <button class="btn-icon-outline btn-danger-outline" data-id="${item.id}" title="Retirer de la file">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          <line x1="10" y1="11" x2="10" y2="17"/>
          <line x1="14" y1="11" x2="14" y2="17"/>
        </svg>
      </button>
    </div>
  `;
  }).join('');

  uploadActions.classList.remove('hidden');

  // Event listeners pour miniatures (zoom plein écran)
  document.querySelectorAll('.upload-item-thumb').forEach(thumb => {
    thumb.addEventListener('click', (e) => {
      openImageModal(e.target.src);
    });
    thumb.style.cursor = 'pointer';
  });

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

  document.querySelectorAll('.upload-item .btn-danger-outline').forEach(btn => {
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
  
  // Recharger les images existantes
  await loadExistingImages();
  renderExistingImages();
  updateSaveAllButton();
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
