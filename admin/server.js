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
  dest: path.join(__dirname, 'temp'),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques depuis le dossier admin
app.use(express.static(path.join(__dirname)));

// CORS pour localhost
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Servir les images du projet
app.use('/images', express.static(path.join(__dirname, '..', 'client', 'public', 'images')));

// Servir le fichier images_completes.json
app.get('/images_completes.json', async (req, res) => {
  try {
    const jsonPath = path.join(__dirname, '..', 'images_completes.json');
    res.sendFile(jsonPath);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lister toutes les images existantes (avec filtres optionnels)
app.get('/list-images', async (req, res) => {
  try {
    const { espece, type } = req.query;
    const imagesDir = path.join(__dirname, '..', 'client', 'public', 'images');
    
    let allImages = [];
    
    try {
      const especes = await fs.readdir(imagesDir, { withFileTypes: true });
      
      for (const especeDir of especes) {
        if (!especeDir.isDirectory()) continue;
        
        const especeId = especeDir.name;
        
        // Filtrer par espèce si spécifié
        if (espece && especeId !== espece) continue;
        
        const especePath = path.join(imagesDir, especeId);
        const files = await fs.readdir(especePath);
        
        // Pattern pour détecter uniquement les images numérotées (format standard)
        const pattern = /^(.+?)_(.+?)_(\d+)\.(jpg|jpeg|png|webp)$/i;
        
        files.forEach(file => {
          const match = file.match(pattern);
          if (match) {
            const [, fileEspece, fileType, fileNumber, fileExt] = match;
            
            // Filtrer par type si spécifié
            if (type && fileType !== type) return;
            
            allImages.push({
              filename: file,
              espece: fileEspece,
              especeNom: fileEspece.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              type: fileType,
              typeNom: getTypeLabel(fileType),
              number: parseInt(fileNumber),
              path: `/images/${especeId}/${file}`
            });
          }
        });
      }
      
      // Trier par espèce, type, puis numéro
      allImages.sort((a, b) => {
        if (a.espece !== b.espece) return a.espece.localeCompare(b.espece);
        if (a.type !== b.type) return a.type.localeCompare(b.type);
        return a.number - b.number;
      });
      
      res.json({ images: allImages });
    } catch (err) {
      res.json({ images: [] });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fonction helper pour les labels de types
function getTypeLabel(type) {
  const labels = {
    vue_generale: 'Vue générale',
    bourgeons: 'Bourgeons',
    fleurs: 'Fleurs',
    fruits: 'Fruits',
    automne: 'Automne',
    hiver: 'Hiver'
  };
  return labels[type] || type;
}

// Permuter les numéros de deux images
app.post('/swap-images', async (req, res) => {
  try {
    const { image1, image2 } = req.body;
    
    if (!image1 || !image2) {
      return res.status(400).json({ success: false, error: 'Paramètres manquants' });
    }
    
    const imagesDir = path.join(__dirname, '..', 'client', 'public', 'images');
    
    // Chemins des fichiers
    const path1 = path.join(imagesDir, image1.espece, image1.filename);
    const path2 = path.join(imagesDir, image2.espece, image2.filename);
    
    // Fichier temporaire pour la permutation
    const tempPath = path.join(imagesDir, image1.espece, `temp_swap_${Date.now()}.tmp`);
    
    try {
      // Permutation en 3 étapes (éviter écrasement)
      await fs.rename(path1, tempPath);
      await fs.rename(path2, path1);
      await fs.rename(tempPath, path2);
      
      res.json({
        success: true,
        message: `✓ Permutation #${image1.number} ↔ #${image2.number}`
      });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Erreur permutation: ' + err.message });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Changer le numéro d'une image (sans conflit)
app.post('/change-number', async (req, res) => {
  try {
    const { filename, espece, type, currentNumber, newNumber } = req.body;
    
    if (!filename || !espece || !type || !currentNumber || !newNumber) {
      return res.status(400).json({ success: false, error: 'Paramètres manquants' });
    }
    
    const imagesDir = path.join(__dirname, '..', 'client', 'public', 'images');
    const oldPath = path.join(imagesDir, espece, filename);
    
    // Extraire l'extension
    const extMatch = filename.match(/(\.[^.]+)$/);
    const extension = extMatch ? extMatch[1] : '.jpg';
    
    const newFilename = `${espece}_${type}_${String(newNumber).padStart(2, '0')}${extension}`;
    const newPath = path.join(imagesDir, espece, newFilename);
    
    try {
      await fs.rename(oldPath, newPath);
      
      res.json({
        success: true,
        message: `✓ #${currentNumber} → #${newNumber}`,
        newFilename
      });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Erreur renommage: ' + err.message });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Renommer/déplacer une image
app.post('/rename-image', async (req, res) => {
  try {
    const { oldFilename, oldEspece, newEspece, newType } = req.body;
    
    if (!oldFilename || !oldEspece || !newEspece || !newType) {
      return res.status(400).json({ success: false, error: 'Paramètres manquants' });
    }
    
    const imagesDir = path.join(__dirname, '..', 'client', 'public', 'images');
    const oldPath = path.join(imagesDir, oldEspece, oldFilename);
    
    // Extraire le numéro et l'extension
    const match = oldFilename.match(/^.+?_.+?_(\d+)(\..+)$/);
    if (!match) {
      return res.status(400).json({ success: false, error: 'Nom de fichier invalide' });
    }
    
    const [, oldNumber, extension] = match;
    
    // Trouver le prochain numéro disponible pour le nouveau type
    const targetDir = path.join(imagesDir, newEspece);
    await fs.mkdir(targetDir, { recursive: true });
    
    const nextNumber = await getNextImageNumber(targetDir, `${newEspece}_${newType}`, extension);
    const newFilename = `${newEspece}_${newType}_${String(nextNumber).padStart(2, '0')}${extension}`;
    const newPath = path.join(targetDir, newFilename);
    
    try {
      // Copier le fichier
      await fs.copyFile(oldPath, newPath);
      
      // Supprimer l'ancien
      await fs.unlink(oldPath);
      
      res.json({ 
        success: true, 
        message: `✓ ${oldFilename} → ${newFilename}`,
        newFilename
      });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Erreur lors du déplacement: ' + err.message });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Supprimer une image
app.post('/delete-image', async (req, res) => {
  try {
    const { espece, filename } = req.body;
    
    if (!espece || !filename) {
      return res.status(400).json({ success: false, error: 'Paramètres manquants' });
    }
    
    const imagePath = path.join(__dirname, '..', 'client', 'public', 'images', espece, filename);
    
    try {
      await fs.unlink(imagePath);
      res.json({ success: true, message: `✓ ${filename} supprimé` });
    } catch (err) {
      res.status(404).json({ success: false, error: 'Image introuvable' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
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

// Fonction pour trouver le prochain numéro disponible
async function getNextImageNumber(targetDir, baseName, extension) {
  try {
    const files = await fs.readdir(targetDir);
    const pattern = new RegExp(`^${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}_(\\d+)${extension.replace('.', '\\.')}$`);
    const numbers = files
      .map(f => {
        const match = f.match(pattern);
        return match ? parseInt(match[1]) : 0;
      })
      .filter(n => n > 0);
    
    return numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
  } catch {
    return 1; // Dossier n'existe pas encore
  }
}

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
        
        // Extraire le nom de base et l'extension
        const extMatch = config.targetName.match(/(\.[^.]+)$/);
        const extension = extMatch ? extMatch[1] : '.jpg';
        const baseName = config.targetName.replace(extension, '');
        
        // Trouver le prochain numéro disponible
        const nextNumber = await getNextImageNumber(targetDir, baseName, extension);
        const numberedName = `${baseName}_${String(nextNumber).padStart(2, '0')}${extension}`;
        
        // Chemin de destination final
        const targetPath = path.join(targetDir, numberedName);
        
        // Copier le fichier
        await fs.copyFile(file.path, targetPath);
        
        // Supprimer le fichier temporaire
        await fs.unlink(file.path);
        
        results.push({
          success: true,
          message: `✓ ${numberedName} ajouté`,
          filename: numberedName
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
    
    // Git commit - Sécurisé contre injection de commande
    const safeCount = parseInt(count) || 0;
    const commitMessage = `Add: ${safeCount} nouvelle(s) image(s) via interface admin`;
    // Échapper les caractères dangereux
    const sanitizedMessage = commitMessage.replace(/["'`$\\]/g, '\\$&');
    await execPromise(`git commit -m "${sanitizedMessage}"`, { cwd: projectRoot });
    
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

