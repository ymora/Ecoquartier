/**
 * API Server pour la conversion de modèles 3D
 * 
 * Installation:
 *   npm install express multer cors
 * 
 * Utilisation:
 *   node admin/server-api.js
 *   Puis ouvrir: http://localhost:3001/upload-model.html
 */

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// CORS et JSON
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Configuration multer pour l'upload temporaire
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.body.type || 'autre';
    const uploadDir = path.join(__dirname, '..', 'upload', type);
    
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
  limits: { fileSize: 200 * 1024 * 1024 }, // 200 MB max
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.blend', '.obj', '.mtl', '.fbx', '.gltf', '.glb'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Format non supporté'));
    }
  }
});

// === ENDPOINT: Upload + Conversion ===
app.post('/api/upload-model', upload.single('file'), async (req, res) => {
  try {
    const { type, name } = req.body;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ success: false, error: 'Aucun fichier uploadé' });
    }
    
    console.log(`📁 Type: ${type}`);
    console.log(`📝 Nom: ${name}`);
    console.log(`📦 Fichier: ${file.originalname} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    
    const fileExt = path.extname(file.originalname).toLowerCase();
    const outputFilename = `${type}-${name}.glb`;
    const outputPath = path.join(__dirname, '..', 'client', 'public', 'models', type, outputFilename);
    
    // Créer le dossier de sortie
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Si c'est déjà un GLB, juste le copier
    if (fileExt === '.glb') {
      fs.copyFileSync(file.path, outputPath);
      
      const originalSize = (file.size / 1024 / 1024).toFixed(2);
      
      return res.json({
        success: true,
        filename: outputFilename,
        path: `/models/${type}/${outputFilename}`,
        originalSize: `${originalSize} MB`,
        glbSize: `${originalSize} MB`,
        reduction: 0,
        message: 'Fichier GLB copié (pas de conversion nécessaire)'
      });
    }
    
    // Conversion selon le format
    let conversionCmd = '';
    
    if (fileExt === '.blend') {
      // Conversion Blender → GLB (nécessite Blender en ligne de commande)
      const blenderPath = findBlenderPath();
      if (blenderPath) {
        conversionCmd = `"${blenderPath}" "${file.path}" --background --python-expr "import bpy; bpy.ops.export_scene.gltf(filepath='${outputPath}', export_format='GLB')" --quit`;
      } else {
        throw new Error('Blender non installé. Installez Blender ou convertissez manuellement.');
      }
    } else if (fileExt === '.obj') {
      // Conversion OBJ → GLB via Python
      conversionCmd = `python convert_to_glb.py`;
    } else if (fileExt === '.fbx') {
      // Conversion FBX → GLB (nécessite fbx2gltf)
      conversionCmd = `fbx2gltf "${file.path}" "${outputPath}"`;
    } else if (fileExt === '.gltf') {
      // Conversion GLTF → GLB (compression)
      conversionCmd = `gltf-pipeline -i "${file.path}" -o "${outputPath}" -b`;
    }
    
    console.log(`🔄 Commande: ${conversionCmd}`);
    
    // Exécuter la conversion
    exec(conversionCmd, (error, stdout, stderr) => {
      const originalSize = (file.size / 1024 / 1024).toFixed(2);
      
      if (error) {
        console.error('❌ Erreur conversion:', error);
        console.error('Stderr:', stderr);
        
        return res.status(500).json({
          success: false,
          error: error.message,
          stderr,
          hint: 'Lancez manuellement: python convert_to_glb.py'
        });
      }
      
      // Vérifier que le fichier GLB a été créé
      if (fs.existsSync(outputPath)) {
        const glbSize = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2);
        const reduction = ((1 - glbSize / originalSize) * 100).toFixed(1);
        
        console.log('✅ Conversion réussie');
        console.log(`📊 ${originalSize} MB → ${glbSize} MB (-${reduction}%)`);
        
        res.json({
          success: true,
          filename: outputFilename,
          path: `/models/${type}/${outputFilename}`,
          originalSize: `${originalSize} MB`,
          glbSize: `${glbSize} MB`,
          reduction: parseFloat(reduction),
          log: stdout
        });
      } else {
        throw new Error('Fichier GLB non créé');
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// === ENDPOINT: Lister les modèles GLB ===
app.get('/api/models', (req, res) => {
  const modelsBaseDir = path.join(__dirname, '..', 'client', 'public', 'models');
  const allModels = [];
  
  try {
    // Scanner tous les sous-dossiers (cerisier, erable, etc.)
    const types = fs.readdirSync(modelsBaseDir);
    
    types.forEach(type => {
      const typeDir = path.join(modelsBaseDir, type);
      if (fs.statSync(typeDir).isDirectory()) {
        const files = fs.readdirSync(typeDir)
          .filter(f => f.endsWith('.glb'));
        
        files.forEach(f => {
          const stats = fs.statSync(path.join(typeDir, f));
          const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
          
          allModels.push({
            name: f,
            path: `${type}/${f}`,
            size: `${sizeMB} MB`,
            type,
            created: stats.mtime
          });
        });
      }
    });
    
    res.json({
      success: true,
      models: allModels
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// === ENDPOINT: Ping (vérifier si le serveur tourne) ===
app.get('/api/ping', (req, res) => {
  res.json({ success: true, message: 'Serveur actif' });
});

// Trouver Blender dans le système
function findBlenderPath() {
  const possiblePaths = [
    'C:\\Program Files\\Blender Foundation\\Blender 4.2\\blender.exe',
    'C:\\Program Files\\Blender Foundation\\Blender 4.1\\blender.exe',
    'C:\\Program Files\\Blender Foundation\\Blender 4.0\\blender.exe',
    'C:\\Program Files\\Blender Foundation\\Blender 3.6\\blender.exe',
    '/usr/bin/blender',
    '/Applications/Blender.app/Contents/MacOS/Blender'
  ];
  
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  
  return null;
}

// Démarrer le serveur
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🚀 API Server de Conversion 3D');
  console.log('='.repeat(60));
  console.log();
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📤 Interface Upload: http://localhost:${PORT}/upload-model.html`);
  console.log();
  console.log('📋 Endpoints disponibles:');
  console.log('  POST   /api/upload-model  - Upload & Conversion');
  console.log('  GET    /api/models        - Liste des modèles');
  console.log('  GET    /api/ping          - Vérifier le serveur');
  console.log();
  console.log('💡 Astuces:');
  console.log('  - Formats supportés: .blend, .obj, .fbx, .gltf');
  console.log('  - Taille max: 200 MB par fichier');
  console.log('  - Organisation: client/public/models/{type}/{nom}.glb');
  console.log();
  console.log('='.repeat(60));
});
