const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const app = express();
const PORT = 3001;

// Configuration multer (upload temporaire)
const upload = multer({ 
  dest: 'admin/temp/',
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Middleware
app.use(express.json());
app.use(express.static('admin'));

// CORS pour localhost
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Vérifier si une image existe
app.get('/check-image', async (req, res) => {
  try {
    const { espece, filename } = req.query;
    const imagePath = path.join(__dirname, '..', 'client', 'public', 'images', espece, filename);
    
    try {
      await fs.access(imagePath);
      res.json({ exists: true, path: imagePath });
    } catch {
      res.json({ exists: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload des images
app.post('/upload', upload.array('images'), async (req, res) => {
  try {
    const configs = req.body.configs;
    const configsArray = Array.isArray(configs) ? configs.map(c => JSON.parse(c)) : [JSON.parse(configs)];
    const files = req.files;
    
    const results = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const config = configsArray[i];
      
      try {
        // Créer le dossier de destination si nécessaire
        const targetDir = path.join(__dirname, '..', 'client', 'public', 'images', config.espece);
        await fs.mkdir(targetDir, { recursive: true });
        
        // Chemin de destination final
        const targetPath = path.join(targetDir, config.targetName);
        
        // Copier le fichier
        await fs.copyFile(file.path, targetPath);
        
        // Supprimer le fichier temporaire
        await fs.unlink(file.path);
        
        results.push({
          success: true,
          message: `✓ ${config.targetName} ${config.exists ? 'remplacé' : 'ajouté'}`
        });
      } catch (err) {
        results.push({
          success: false,
          message: `✗ ${config.targetName}: ${err.message}`
        });
      }
    }
    
    res.json({
      success: true,
      processed: results.filter(r => r.success).length,
      details: results
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Git commit et push
app.post('/git-publish', async (req, res) => {
  try {
    const { count } = req.body;
    const projectRoot = path.join(__dirname, '..');
    
    // Git add
    await execPromise('git add client/public/images/', { cwd: projectRoot });
    
    // Git commit
    const commitMessage = `Add: ${count} nouvelle(s) image(s) via interface admin`;
    await execPromise(`git commit -m "${commitMessage}"`, { cwd: projectRoot });
    
    // Git push
    await execPromise('git push', { cwd: projectRoot });
    
    res.json({ 
      success: true, 
      message: `${count} image(s) publiée(s) sur GitHub` 
    });
  } catch (err) {
    // Si pas de changements, ce n'est pas une erreur
    if (err.message.includes('nothing to commit')) {
      res.json({ 
        success: true, 
        message: 'Aucun changement à publier' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: err.message 
      });
    }
  }
});

// Créer le dossier temp si nécessaire
fs.mkdir(path.join(__dirname, 'temp'), { recursive: true }).catch(() => {});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log('');
  console.log('═══════════════════════════════════════════════════');
  console.log('  🌳 Interface Admin - Haies Bessancourt');
  console.log('═══════════════════════════════════════════════════');
  console.log('');
  console.log(`  ✓ Serveur démarré sur: http://localhost:${PORT}`);
  console.log('');
  console.log('  📤 Ouvrez votre navigateur sur cette URL');
  console.log('  🖼️  Glissez-déposez vos images');
  console.log('  🚀 Publiez sur GitHub en 1 clic');
  console.log('');
  console.log('  Appuyez sur Ctrl+C pour arrêter');
  console.log('═══════════════════════════════════════════════════');
  console.log('');
});

