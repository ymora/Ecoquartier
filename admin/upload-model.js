// Configuration
let selectedType = 'cerisier';
let uploadedFile = null;
let modelName = '';

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  initTypeSelector();
  initUpload();
  initModelName();
  initConvert();
});

// === SÉLECTEUR DE TYPE ===
function initTypeSelector() {
  const typeBtns = document.querySelectorAll('.type-btn');
  
  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedType = btn.dataset.type;
      updateFilename();
    });
  });
}

// === NOM DU MODÈLE ===
function initModelName() {
  const input = document.getElementById('modelName');
  
  input.addEventListener('input', () => {
    modelName = input.value.trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-');
    updateFilename();
  });
  
  // Valeur par défaut
  input.value = 'general';
  modelName = 'general';
  updateFilename();
}

function updateFilename() {
  const filename = `${selectedType}-${modelName || 'general'}.glb`;
  document.getElementById('resultFilename').textContent = filename;
}

// === UPLOAD ===
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
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  });
  
  // Sélection de fichier
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  });
}

function handleFile(file) {
  // Vérifier l'extension
  const ext = file.name.split('.').pop().toLowerCase();
  const validExts = ['blend', 'obj', 'fbx', 'gltf', 'glb'];
  
  if (!validExts.includes(ext)) {
    alert('❌ Format non supporté. Utilisez .blend, .obj, .fbx, ou .gltf');
    return;
  }
  
  // Vérifier la taille (max 200 MB)
  if (file.size > 200 * 1024 * 1024) {
    alert('❌ Fichier trop gros (max 200 MB)');
    return;
  }
  
  uploadedFile = file;
  
  // Afficher l'aperçu
  document.getElementById('fileName').textContent = file.name;
  document.getElementById('fileSize').textContent = formatSize(file.size);
  document.getElementById('filePreview').classList.add('show');
  
  // Activer le bouton de conversion
  document.getElementById('convertBtn').disabled = false;
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// === CONVERSION ===
function initConvert() {
  document.getElementById('convertBtn').addEventListener('click', startConversion);
}

async function startConversion() {
  if (!uploadedFile) {
    alert('❌ Veuillez sélectionner un fichier');
    return;
  }
  
  if (!modelName) {
    alert('❌ Veuillez donner un nom au modèle');
    return;
  }
  
  // Désactiver le bouton
  const btn = document.getElementById('convertBtn');
  btn.disabled = true;
  btn.textContent = '⏳ Conversion...';
  
  // Afficher la progression
  const progress = document.getElementById('progress');
  progress.classList.add('show');
  
  // Cacher le résultat précédent
  document.getElementById('result').classList.remove('show');
  
  try {
    // Préparer les données
    const formData = new FormData();
    formData.append('file', uploadedFile);
    formData.append('type', selectedType);
    formData.append('name', modelName);
    
    // Simuler la progression
    updateProgress(20, 'Upload du fichier...');
    
    // Appel API
    const response = await fetch('http://localhost:3001/api/upload-model', {
      method: 'POST',
      body: formData
    });
    
    updateProgress(50, 'Conversion en cours...');
    
    if (!response.ok) {
      throw new Error('Erreur serveur');
    }
    
    const result = await response.json();
    
    updateProgress(100, 'Terminé !');
    
    // Afficher le résultat
    setTimeout(() => {
      showResult('success', `
        ✅ Modèle converti avec succès !<br>
        📁 ${result.filename}<br>
        📊 ${result.originalSize} → ${result.glbSize}<br>
        📉 Réduction : ${result.reduction}%
      `);
      
      // Réinitialiser après 3 secondes
      setTimeout(resetForm, 3000);
    }, 500);
    
  } catch (error) {
    console.error('Erreur:', error);
    
    // Afficher l'erreur
    showResult('error', `
      ❌ Erreur de conversion<br>
      ${error.message}<br><br>
      💡 Lancez manuellement :<br>
      <code>python convert_to_glb.py</code>
    `);
    
    btn.disabled = false;
    btn.textContent = '🔄 Réessayer';
  }
}

function updateProgress(percent, text) {
  document.getElementById('progressFill').style.width = percent + '%';
  document.getElementById('progressText').textContent = text;
}

function showResult(type, text) {
  const result = document.getElementById('result');
  result.className = `result ${type} show`;
  
  if (type === 'success') {
    document.getElementById('resultIcon').textContent = '✅';
  } else {
    document.getElementById('resultIcon').textContent = '❌';
  }
  
  document.getElementById('resultText').innerHTML = text;
  document.getElementById('progress').classList.remove('show');
}

function resetForm() {
  // Réinitialiser
  uploadedFile = null;
  document.getElementById('filePreview').classList.remove('show');
  document.getElementById('result').classList.remove('show');
  document.getElementById('progress').classList.remove('show');
  document.getElementById('fileInput').value = '';
  
  const btn = document.getElementById('convertBtn');
  btn.disabled = true;
  btn.textContent = '🔄 Convertir et Stocker';
  
  updateProgress(0, '');
}

// === MODE HORS LIGNE ===
// Si pas de serveur, proposer le téléchargement manuel
setTimeout(() => {
  fetch('http://localhost:3001/api/ping')
    .catch(() => {
      console.warn('⚠️ Serveur API non disponible');
      console.log('💡 Lancez: node admin/server-api.js');
    });
}, 1000);

