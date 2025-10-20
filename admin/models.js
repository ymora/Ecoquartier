// Gestionnaire de modèles 3D
let currentCategory = 'cerisier';
let uploadedFiles = [];
let models = [];

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initUpload();
  initCategorySelector();
  loadModels();
  loadMapping();
});

// === NAVIGATION TABS ===
function initTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      
      // Activer le tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Afficher le contenu
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      document.getElementById(`${tabName}-tab`).classList.add('active');
      
      // Charger les données si nécessaire
      if (tabName === 'library') loadModels();
      if (tabName === 'config') loadMapping();
    });
  });
}

// === SÉLECTEUR DE CATÉGORIE ===
function initCategorySelector() {
  const categoryBtns = document.querySelectorAll('.category-btn');
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      currentCategory = btn.dataset.category;
      addLog(`📁 Catégorie sélectionnée: ${currentCategory}`);
    });
  });
}

// === UPLOAD DE FICHIERS ===
function initUpload() {
  const uploadZone = document.getElementById('uploadZone');
  const fileInput = document.getElementById('fileInput');
  
  // Clic sur la zone
  uploadZone.addEventListener('click', () => fileInput.click());
  
  // Drag & Drop
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
  });
  
  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
  });
  
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
  });
  
  // Sélection de fichiers
  fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
  });
  
  // Boutons
  document.getElementById('convertBtn').addEventListener('click', startConversion);
  document.getElementById('clearBtn').addEventListener('click', clearFiles);
}

function handleFiles(files) {
  Array.from(files).forEach(file => {
    // Vérifier l'extension
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'obj' && ext !== 'mtl') {
      alert(`❌ Format non supporté: ${file.name}`);
      return;
    }
    
    // Vérifier la taille (max 100 MB)
    if (file.size > 100 * 1024 * 1024) {
      alert(`❌ Fichier trop gros: ${file.name} (max 100 MB)`);
      return;
    }
    
    uploadedFiles.push(file);
    addLog(`✅ Fichier ajouté: ${file.name} (${formatSize(file.size)})`);
  });
  
  displayFiles();
}

function displayFiles() {
  const fileList = document.getElementById('fileList');
  const filesDiv = document.getElementById('files');
  
  if (uploadedFiles.length === 0) {
    fileList.style.display = 'none';
    return;
  }
  
  fileList.style.display = 'block';
  filesDiv.innerHTML = '';
  
  // Grouper par paire OBJ/MTL
  const objFiles = uploadedFiles.filter(f => f.name.endsWith('.obj'));
  const mtlFiles = uploadedFiles.filter(f => f.name.endsWith('.mtl'));
  
  objFiles.forEach(objFile => {
    const baseName = objFile.name.replace('.obj', '');
    const mtlFile = mtlFiles.find(f => f.name === `${baseName}.mtl`);
    
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.innerHTML = `
      <div class="file-info">
        <div class="file-icon">📦</div>
        <div class="file-details">
          <div class="file-name">${baseName}</div>
          <div class="file-size">
            OBJ: ${formatSize(objFile.size)}
            ${mtlFile ? ` • MTL: ${formatSize(mtlFile.size)}` : ''}
          </div>
        </div>
      </div>
      <div class="file-actions">
        <button class="btn btn-danger" onclick="removeFile('${objFile.name}')">🗑️</button>
      </div>
    `;
    filesDiv.appendChild(fileItem);
  });
}

function removeFile(fileName) {
  const baseName = fileName.replace('.obj', '');
  uploadedFiles = uploadedFiles.filter(f => 
    !f.name.startsWith(baseName)
  );
  displayFiles();
  addLog(`🗑️ Fichier supprimé: ${fileName}`);
}

function clearFiles() {
  if (confirm('Effacer tous les fichiers ?')) {
    uploadedFiles = [];
    displayFiles();
    addLog('🗑️ Tous les fichiers supprimés');
  }
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// === CONVERSION ===
async function startConversion() {
  const objFiles = uploadedFiles.filter(f => f.name.endsWith('.obj'));
  
  if (objFiles.length === 0) {
    alert('❌ Aucun fichier OBJ à convertir');
    return;
  }
  
  // Afficher la barre de progression
  document.getElementById('progressContainer').style.display = 'block';
  document.getElementById('conversionLog').style.display = 'block';
  document.getElementById('convertBtn').disabled = true;
  
  addLog('🚀 Démarrage de la conversion...');
  addLog(`📁 Catégorie: ${currentCategory}`);
  addLog(`📦 Fichiers à convertir: ${objFiles.length}`);
  
  // MÉTHODE 1: Appeler le script Python côté serveur
  // (Nécessite un serveur Node.js)
  try {
    const formData = new FormData();
    formData.append('category', currentCategory);
    
    uploadedFiles.forEach(file => {
      formData.append('files', file);
    });
    
    const response = await fetch('/api/convert', {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      const result = await response.json();
      addLog(`✅ Conversion réussie!`);
      addLog(`📊 ${result.converted} fichiers GLB créés`);
      addLog(`📉 Réduction: ${result.reduction}%`);
      
      // Recharger la bibliothèque
      loadModels();
      
      // Nettoyer
      setTimeout(() => {
        clearFiles();
        document.getElementById('progressContainer').style.display = 'none';
        document.getElementById('convertBtn').disabled = false;
      }, 2000);
    } else {
      throw new Error('Erreur serveur');
    }
  } catch (error) {
    addLog(`❌ Erreur: ${error.message}`);
    addLog('💡 Astuce: Lancez manuellement "python convert_to_glb.py"');
    document.getElementById('convertBtn').disabled = false;
  }
}

// === BIBLIOTHÈQUE ===
async function loadModels() {
  const grid = document.getElementById('modelsGrid');
  
  try {
    // Lister les fichiers GLB disponibles
    const response = await fetch('/api/models');
    const data = await response.json();
    models = data.models;
    
    document.getElementById('modelCount').textContent = models.length;
    
    grid.innerHTML = '';
    models.forEach(model => {
      const card = createModelCard(model);
      grid.appendChild(card);
    });
  } catch (error) {
    grid.innerHTML = `
      <div class="alert alert-warning">
        <strong>⚠️ Mode hors ligne</strong><br>
        Impossible de charger la liste des modèles. Les fichiers GLB sont dans:<br>
        <code>client/public/models/arbres/</code>
      </div>
    `;
  }
}

function createModelCard(model) {
  const card = document.createElement('div');
  card.className = 'model-card';
  card.innerHTML = `
    <div class="model-preview">🌳</div>
    <div class="model-info">
      <div class="model-name">${model.name}</div>
      <div class="model-meta">
        ${model.size} • ${model.category}
      </div>
      <span class="status status-success">✓ Prêt</span>
    </div>
    <div class="file-actions">
      <button class="btn btn-primary" onclick="previewModel('${model.path}')">
        👁️ Aperçu
      </button>
      <button class="btn btn-danger" onclick="deleteModel('${model.name}')">
        🗑️
      </button>
    </div>
  `;
  return card;
}

function previewModel(path) {
  // TODO: Ouvrir une modal avec un viewer Three.js
  window.open(`/models/arbres/${path}`, '_blank');
}

function deleteModel(name) {
  if (confirm(`Supprimer ${name} ?`)) {
    addLog(`🗑️ Suppression de ${name}...`);
    // TODO: Appel API pour supprimer
  }
}

// === CONFIGURATION / MAPPING ===
async function loadMapping() {
  const list = document.getElementById('mappingList');
  
  // Charger la config actuelle
  try {
    const response = await fetch('../client/src/config/modeles3D.js');
    const text = await response.text();
    
    // Parser (simpliste)
    list.innerHTML = '<p>Configuration actuelle chargée</p>';
  } catch (error) {
    list.innerHTML = `
      <div class="alert alert-warning">
        <strong>ℹ️ Configuration manuelle</strong><br>
        Éditez <code>client/src/config/modeles3D.js</code> pour mapper les modèles
      </div>
    `;
  }
}

document.getElementById('saveMappingBtn').addEventListener('click', () => {
  alert('💾 Pour l\'instant, éditez client/src/config/modeles3D.js manuellement');
});

// === LOG ===
function addLog(message) {
  console.log(message);
  const logContent = document.getElementById('logContent');
  if (logContent) {
    const line = document.createElement('div');
    line.className = 'log-line';
    line.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logContent.appendChild(line);
    logContent.scrollTop = logContent.scrollHeight;
  }
}

// === AIDE ===
window.addEventListener('load', () => {
  addLog('✅ Interface admin modèles 3D chargée');
  addLog('📝 Sélectionnez une catégorie et uploadez vos fichiers OBJ/MTL');
});

