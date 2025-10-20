/**
 * API Server pour la conversion de modèles 3D
 * 
 * À intégrer dans admin/server.js ou lancer séparément
 * 
 * Installation:
 *   npm install express multer
 * 
 * Utilisation:
 *   node admin/server-api.js
 */

const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Configuration multer pour l'upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const category = req.body.category || 'autre';
    const uploadDir = path.join(__dirname, '..', 'upload', category);
    
    // Créer le dossier si nécessaire
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB max
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.obj' || ext === '.mtl') {
      cb(null, true);
    } else {
      cb(new Error('Format non supporté. Utilisez .obj ou .mtl'));
    }
  }
});

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// === ENDPOINT: Upload + Conversion ===
app.post('/api/convert', upload.array('files'), (req, res) => {
  const category = req.body.category || 'autre';
  const files = req.files;
  
  console.log(`📁 Catégorie: ${category}`);
  console.log(`📦 Fichiers reçus: ${files.length}`);
  
  // Lancer le script Python de conversion
  const pythonScript = path.join(__dirname, '..', 'convert_to_glb.py');
  
  exec(`python "${pythonScript}"`, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Erreur conversion:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
        stderr
      });
    }
    
    console.log('✅ Conversion réussie');
    console.log(stdout);
    
    // Parser la sortie pour compter les fichiers
    const converted = (stdout.match(/Conversion terminee: (\d+)/)?.[1]) || 0;
    const reduction = (stdout.match(/Reduction: ([\d.]+)%/)?.[1]) || 0;
    
    res.json({
      success: true,
      converted: parseInt(converted),
      reduction: parseFloat(reduction),
      log: stdout
    });
  });
});

// === ENDPOINT: Lister les modèles GLB ===
app.get('/api/models', (req, res) => {
  const modelsDir = path.join(__dirname, '..', 'client', 'public', 'models', 'arbres');
  
  try {
    const files = fs.readdirSync(modelsDir)
      .filter(f => f.endsWith('.glb'))
      .map(f => {
        const stats = fs.statSync(path.join(modelsDir, f));
        const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        const category = f.split('-')[0];
        
        return {
          name: f,
          path: f,
          size: `${sizeMB} MB`,
          category,
          created: stats.mtime
        };
      });
    
    res.json({
      success: true,
      models: files
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// === ENDPOINT: Supprimer un modèle ===
app.delete('/api/models/:name', (req, res) => {
  const fileName = req.params.name;
  const filePath = path.join(__dirname, '..', 'client', 'public', 'models', 'arbres', fileName);
  
  try {
    fs.unlinkSync(filePath);
    res.json({ success: true, message: `${fileName} supprimé` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 API Server démarré sur http://localhost:${PORT}`);
  console.log(`📁 Upload: POST /api/convert`);
  console.log(`📚 Liste: GET /api/models`);
  console.log(`🗑️ Supprimer: DELETE /api/models/:name`);
});

