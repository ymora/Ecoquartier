/**
 * Script de conversion des images JPG en WebP
 * Optimisation : 14.8 MB → ~4.4 MB (gain de 70%)
 * 
 * Usage:
 *   node scripts/convert-to-webp.cjs
 * 
 * Options:
 *   --dry-run : Afficher ce qui serait fait sans effectuer les conversions
 *   --quality=85 : Qualité WebP (default: 85)
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const IMAGE_DIR = path.join(__dirname, '../public/images');
const WEBP_QUALITY = parseInt(process.argv.find(arg => arg.startsWith('--quality='))?.split('=')[1] || '85');
const DRY_RUN = process.argv.includes('--dry-run');

// Statistiques
let stats = {
  totalFiles: 0,
  converted: 0,
  skipped: 0,
  errors: 0,
  sizeBefore: 0,
  sizeAfter: 0
};

/**
 * Convertir récursivement tous les JPG en WebP
 */
async function convertDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Récursif sur les sous-dossiers
      await convertDirectory(fullPath);
    } else if (entry.isFile() && /\.(jpg|jpeg)$/i.test(entry.name)) {
      await convertImage(fullPath);
    }
  }
}

/**
 * Convertir une image JPG en WebP
 */
async function convertImage(inputPath) {
  stats.totalFiles++;
  
  const outputPath = inputPath.replace(/\.(jpg|jpeg)$/i, '.webp');
  const relativePath = path.relative(IMAGE_DIR, inputPath);
  
  // Vérifier si le WebP existe déjà
  if (fs.existsSync(outputPath) && !DRY_RUN) {
    console.log(`⏭️  Sauté (existe déjà) : ${relativePath}`);
    stats.skipped++;
    return;
  }
  
  try {
    // Taille avant
    const statsBefore = fs.statSync(inputPath);
    stats.sizeBefore += statsBefore.size;
    
    if (DRY_RUN) {
      console.log(`🔍 [DRY-RUN] Convertirait : ${relativePath} (${formatBytes(statsBefore.size)})`);
      stats.converted++;
      // Estimer la taille après (70% de réduction moyenne)
      stats.sizeAfter += statsBefore.size * 0.3;
      return;
    }
    
    // Conversion WebP
    await sharp(inputPath)
      .webp({ 
        quality: WEBP_QUALITY,
        effort: 6 // Niveau de compression (0-6, 6 = maximum)
      })
      .toFile(outputPath);
    
    // Taille après
    const statsAfter = fs.statSync(outputPath);
    stats.sizeAfter += statsAfter.size;
    
    const reduction = ((1 - statsAfter.size / statsBefore.size) * 100).toFixed(1);
    
    console.log(`✅ Converti : ${relativePath}`);
    console.log(`   ${formatBytes(statsBefore.size)} → ${formatBytes(statsAfter.size)} (-${reduction}%)`);
    
    stats.converted++;
  } catch (error) {
    console.error(`❌ Erreur : ${relativePath}`, error.message);
    stats.errors++;
  }
}

/**
 * Formater les octets en unités lisibles
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Afficher le rapport final
 */
function printReport() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 RAPPORT DE CONVERSION');
  console.log('='.repeat(60));
  console.log(`Total fichiers JPG trouvés : ${stats.totalFiles}`);
  console.log(`✅ Convertis               : ${stats.converted}`);
  console.log(`⏭️  Sautés (déjà WebP)     : ${stats.skipped}`);
  console.log(`❌ Erreurs                 : ${stats.errors}`);
  console.log('');
  console.log(`Taille AVANT               : ${formatBytes(stats.sizeBefore)}`);
  console.log(`Taille APRÈS               : ${formatBytes(stats.sizeAfter)}`);
  
  if (stats.sizeBefore > 0) {
    const totalReduction = ((1 - stats.sizeAfter / stats.sizeBefore) * 100).toFixed(1);
    const savedBytes = stats.sizeBefore - stats.sizeAfter;
    console.log(`Économie TOTALE            : ${formatBytes(savedBytes)} (-${totalReduction}%)`);
  }
  
  console.log('='.repeat(60));
  
  if (DRY_RUN) {
    console.log('\n⚠️  MODE DRY-RUN : Aucune conversion effectuée');
    console.log('Pour effectuer les conversions, relancez sans --dry-run');
  } else {
    console.log('\n🎉 Conversion terminée avec succès !');
    console.log('\n📝 Prochaines étapes :');
    console.log('   1. Vérifier visuellement quelques images WebP');
    console.log('   2. Mettre à jour le code pour utiliser WebP (avec fallback JPG)');
    console.log('   3. Tester l\'application');
    console.log('   4. Une fois validé, supprimer les JPG originaux');
  }
}

/**
 * Main
 */
async function main() {
  console.log('🚀 Conversion JPG → WebP');
  console.log(`📁 Répertoire : ${IMAGE_DIR}`);
  console.log(`🎨 Qualité WebP : ${WEBP_QUALITY}`);
  console.log(`🔍 Mode : ${DRY_RUN ? 'DRY-RUN (simulation)' : 'CONVERSION RÉELLE'}`);
  console.log('');
  
  if (!fs.existsSync(IMAGE_DIR)) {
    console.error(`❌ Répertoire introuvable : ${IMAGE_DIR}`);
    process.exit(1);
  }
  
  await convertDirectory(IMAGE_DIR);
  printReport();
}

// Exécution
main().catch(error => {
  console.error('❌ Erreur fatale :', error);
  process.exit(1);
});

