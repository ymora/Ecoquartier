// Configuration des espèces
const ESPECES = [
  { id: 'prunus-kanzan', nom: 'Cerisier Kanzan' },
  { id: 'prunus-accolade', nom: 'Cerisier Accolade' },
  { id: 'prunus-sunset-boulevard', nom: 'Cerisier Sunset Boulevard' },
  { id: 'noisetier', nom: 'Noisetier' },
  { id: 'fusain', nom: 'Fusain d\'Europe' },
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

let pendingImages = [];

// Éléments DOM
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const imagesList = document.getElementById('imagesList');
const actions = document.getElementById('actions');
const imageCount = document.getElementById('imageCount');
const clearAllBtn = document.getElementById('clearAll');
const publishBtn = document.getElementById('publishBtn');
const logContainer = document.getElementById('logContainer');
const log = document.getElementById('log');

// Drag & Drop handlers
dropzone.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  fileInput.click();
});

dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
  dropzone.classList.add('dragover');
});

dropzone.addEventListener('dragleave', (e) => {
  e.preventDefault();
  e.stopPropagation();
  dropzone.classList.remove('dragover');
});

dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  e.stopPropagation();
  dropzone.classList.remove('dragover');
  console.log('Files dropped:', e.dataTransfer.files.length);
  handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', (e) => {
  console.log('Files selected:', e.target.files.length);
  handleFiles(e.target.files);
});

// Gestion des fichiers
function handleFiles(files) {
  console.log('handleFiles called with:', files);
  
  if (!files || files.length === 0) {
    console.error('No files provided');
    return;
  }
  
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  Array.from(files).forEach(file => {
    console.log('Processing file:', file.name, file.type);
    if (validTypes.includes(file.type) || file.type.startsWith('image/')) {
      addImageToList(file);
    } else {
      console.warn('File skipped (not an image):', file.name, file.type);
      alert(`Fichier ${file.name} ignoré - Format non supporté. Utilisez JPG, PNG ou WebP.`);
    }
  });
  updateUI();
}

function addImageToList(file) {
  console.log('addImageToList:', file.name);
  const id = Date.now() + Math.random();
  const reader = new FileReader();
  
  reader.onload = (e) => {
    console.log('Image loaded, creating preview');
    const imageData = {
      id,
      file,
      preview: e.target.result,
      espece: '',
      type: '',
      status: 'pending',
      exists: false
    };
    
    pendingImages.push(imageData);
    renderImageItem(imageData);
    updateUI();
  };
  
  reader.onerror = (e) => {
    console.error('FileReader error:', e);
  };
  
  reader.readAsDataURL(file);
}

function renderImageItem(imageData) {
  const div = document.createElement('div');
  div.className = 'image-item';
  div.dataset.id = imageData.id;
  
  div.innerHTML = `
    <img src="${imageData.preview}" alt="Preview" class="image-preview">
    
    <div class="image-config">
      <h4>${imageData.file.name}</h4>
      <div class="config-row">
        <div class="config-group">
          <label>Espèce</label>
          <select class="espece-select" data-id="${imageData.id}">
            <option value="">-- Sélectionner --</option>
            ${ESPECES.map(e => `<option value="${e.id}">${e.nom}</option>`).join('')}
          </select>
        </div>
        <div class="config-group">
          <label>Type d'image</label>
          <select class="type-select" data-id="${imageData.id}" disabled>
            <option value="">-- Sélectionner espèce d'abord --</option>
          </select>
        </div>
      </div>
      <div class="status-zone"></div>
    </div>
    
    <div class="image-actions">
      <button class="btn btn-validate" data-id="${imageData.id}" disabled>
        ✓ Valider
      </button>
      <button class="btn btn-delete" data-id="${imageData.id}">
        ✗ Supprimer
      </button>
    </div>
  `;
  
  imagesList.appendChild(div);
  
  // Event listeners
  const especeSelect = div.querySelector('.espece-select');
  const typeSelect = div.querySelector('.type-select');
  const validateBtn = div.querySelector('.btn-validate');
  const deleteBtn = div.querySelector('.btn-delete');
  const statusZone = div.querySelector('.status-zone');
  
  especeSelect.addEventListener('change', async (e) => {
    imageData.espece = e.target.value;
    
    // Activer le select de type
    typeSelect.disabled = false;
    typeSelect.innerHTML = `
      <option value="">-- Sélectionner --</option>
      ${TYPES.map(t => `<option value="${t.id}">${t.nom}</option>`).join('')}
    `;
    
    // Reset type si espèce change
    imageData.type = '';
    validateBtn.disabled = true;
    statusZone.innerHTML = '';
  });
  
  typeSelect.addEventListener('change', async (e) => {
    imageData.type = e.target.value;
    
    if (imageData.espece && imageData.type) {
      // Vérifier si l'image existe déjà
      const targetName = `${imageData.espece}_${imageData.type}.jpg`;
      const exists = await checkImageExists(imageData.espece, targetName);
      
      imageData.exists = exists;
      imageData.targetName = targetName;
      
      if (exists) {
        statusZone.innerHTML = `
          <div class="status-message warning">
            ⚠️ Une image existe déjà pour ${ESPECES.find(e => e.id === imageData.espece).nom} - ${TYPES.find(t => t.id === imageData.type).nom}
            <br>Cliquer sur "Valider" la remplacera
          </div>
        `;
      } else {
        statusZone.innerHTML = `
          <div class="status-message success">
            ✓ Nouveau fichier - Sera nommé : ${targetName}
          </div>
        `;
      }
      
      validateBtn.disabled = false;
    }
  });
  
  validateBtn.addEventListener('click', () => {
    imageData.status = 'validated';
    div.style.opacity = '0.7';
    div.style.borderColor = '#48bb78';
    validateBtn.disabled = true;
    validateBtn.textContent = '✓ Validé';
    validateBtn.style.background = '#38a169';
    updateUI();
  });
  
  deleteBtn.addEventListener('click', () => {
    pendingImages = pendingImages.filter(img => img.id !== imageData.id);
    div.remove();
    updateUI();
  });
}

async function checkImageExists(espece, filename) {
  try {
    const response = await fetch(`http://localhost:3001/check-image?espece=${espece}&filename=${filename}`);
    const data = await response.json();
    return data.exists;
  } catch (err) {
    return false;
  }
}

function updateUI() {
  const validatedCount = pendingImages.filter(img => img.status === 'validated').length;
  imageCount.textContent = validatedCount;
  
  if (pendingImages.length > 0) {
    actions.classList.remove('hidden');
  } else {
    actions.classList.add('hidden');
  }
  
  publishBtn.disabled = validatedCount === 0;
}

// Actions globales
clearAllBtn.addEventListener('click', () => {
  if (confirm('Effacer toutes les images en attente ?')) {
    pendingImages = [];
    imagesList.innerHTML = '';
    updateUI();
  }
});

publishBtn.addEventListener('click', async () => {
  const validated = pendingImages.filter(img => img.status === 'validated');
  
  if (validated.length === 0) {
    alert('Aucune image validée !');
    return;
  }
  
  if (!confirm(`Publier ${validated.length} image(s) sur GitHub ?`)) {
    return;
  }
  
  publishBtn.disabled = true;
  publishBtn.textContent = '⏳ Publication en cours...';
  logContainer.classList.remove('hidden');
  log.innerHTML = '';
  
  addLog('info', `🚀 Début de la publication de ${validated.length} image(s)...`);
  
  try {
    // Envoyer les images au serveur
    const formData = new FormData();
    
    validated.forEach((imageData, index) => {
      formData.append(`images`, imageData.file);
      formData.append(`configs`, JSON.stringify({
        espece: imageData.espece,
        type: imageData.type,
        targetName: imageData.targetName,
        exists: imageData.exists
      }));
    });
    
    const response = await fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (result.success) {
      addLog('success', `✓ ${result.processed} image(s) traitée(s)`);
      result.details.forEach(detail => {
        addLog(detail.success ? 'success' : 'error', detail.message);
      });
      
      addLog('info', '📤 Commit Git en cours...');
      
      // Git commit et push
      const gitResponse = await fetch('http://localhost:3001/git-publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: result.processed })
      });
      
      const gitResult = await gitResponse.json();
      
      if (gitResult.success) {
        addLog('success', '✓ Commit Git réussi');
        addLog('success', '✓ Push sur GitHub réussi');
        addLog('success', '🎉 Publication terminée !');
        addLog('info', '⏳ Render va redéployer automatiquement dans 2-3 minutes');
        
        // Nettoyer
        setTimeout(() => {
          pendingImages = [];
          imagesList.innerHTML = '';
          updateUI();
          publishBtn.disabled = false;
          publishBtn.textContent = '🚀 Publier sur GitHub';
        }, 3000);
      } else {
        addLog('error', `✗ Erreur Git: ${gitResult.error}`);
      }
    } else {
      addLog('error', `✗ Erreur: ${result.error}`);
    }
  } catch (err) {
    addLog('error', `✗ Erreur serveur: ${err.message}`);
    publishBtn.disabled = false;
    publishBtn.textContent = '🚀 Publier sur GitHub';
  }
});

function addLog(type, message) {
  const p = document.createElement('p');
  p.className = `log-${type}`;
  p.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  log.appendChild(p);
  log.scrollTop = log.scrollHeight;
}

