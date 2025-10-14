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
    
    // Essayer de détecter automatiquement l'espèce et le type depuis le nom de fichier
    const fileName = file.name.toLowerCase();
    let detectedEspece = '';
    let detectedType = '';
    
    // Détecter l'espèce
    if (fileName.includes('kanzan')) detectedEspece = 'prunus-kanzan';
    else if (fileName.includes('accolade')) detectedEspece = 'prunus-accolade';
    else if (fileName.includes('sunset')) detectedEspece = 'prunus-sunset-boulevard';
    else if (fileName.includes('noisetier')) detectedEspece = 'noisetier';
    else if (fileName.includes('fusain')) detectedEspece = 'fusain';
    else if (fileName.includes('troene')) detectedEspece = 'troene';
    else if (fileName.includes('osmanthe')) detectedEspece = 'osmanthe';
    else if (fileName.includes('cornouiller')) detectedEspece = 'cornouiller';
    else if (fileName.includes('seringat')) detectedEspece = 'seringat';
    
    // Détecter le type
    if (fileName.includes('vue') || fileName.includes('general')) detectedType = 'vue_generale';
    else if (fileName.includes('bourgeon')) detectedType = 'bourgeons';
    else if (fileName.includes('fleur')) detectedType = 'fleurs';
    else if (fileName.includes('fruit')) detectedType = 'fruits';
    else if (fileName.includes('automne')) detectedType = 'automne';
    else if (fileName.includes('hiver')) detectedType = 'hiver';
    
    const imageData = {
      id,
      file,
      preview: e.target.result,
      espece: detectedEspece,
      type: detectedType,
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
      // Charger les images existantes
      const existingImages = await loadExistingImages(imageData.espece, imageData.type);
      
      // Afficher les images existantes
      if (existingImages.length > 0) {
        statusZone.innerHTML = `
          <div class="existing-images-section">
            <h5>📷 Images existantes (${existingImages.length}) :</h5>
            <div class="existing-images-grid">
              ${existingImages.map(img => `
                <div class="existing-image-item">
                  <img src="http://localhost:3001${img.path}" alt="${img.filename}" class="existing-image-thumb">
                  <span class="existing-image-name">#${img.number}</span>
                  <button class="btn-delete-existing" data-espece="${imageData.espece}" data-filename="${img.filename}">
                    🗑️
                  </button>
                </div>
              `).join('')}
            </div>
            <div class="status-message success">
              ✓ Votre nouvelle image sera ajoutée avec le numéro ${existingImages.length + 1}
            </div>
          </div>
        `;
        
        // Event listeners pour les boutons de suppression
        statusZone.querySelectorAll('.btn-delete-existing').forEach(btn => {
          btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const espece = btn.dataset.espece;
            const filename = btn.dataset.filename;
            
            if (confirm(`Supprimer ${filename} ?`)) {
              const result = await deleteExistingImage(espece, filename);
              if (result.success) {
                alert(result.message);
                // Recharger la liste
                typeSelect.dispatchEvent(new Event('change'));
              } else {
                alert('Erreur: ' + result.error);
              }
            }
          });
        });
      } else {
        statusZone.innerHTML = `
          <div class="status-message success">
            ✓ Prêt à ajouter la première image pour ce type
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

// Charger les images existantes pour une espèce et un type
async function loadExistingImages(espece, type) {
  try {
    const response = await fetch(`http://localhost:3001/list-images?espece=${espece}&type=${type}`);
    const data = await response.json();
    return data.images || [];
  } catch (err) {
    console.error('Erreur chargement images:', err);
    return [];
  }
}

// Supprimer une image existante
async function deleteExistingImage(espece, filename) {
  try {
    const response = await fetch('http://localhost:3001/delete-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ espece, filename })
    });
    return await response.json();
  } catch (err) {
    console.error('Erreur suppression:', err);
    return { success: false, error: err.message };
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

