import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const plantes = [
  { id: 'prunus-kanzan', type: 'arbre', nom: 'Cerisier Kanzan' },
  { id: 'prunus-accolade', type: 'arbre', nom: 'Cerisier Accolade' },
  { id: 'prunus-sunset-boulevard', type: 'arbre', nom: 'Cerisier Sunset Blvd' },
  { id: 'noisetier', type: 'arbuste', nom: 'Noisetier' },
  { id: 'fusain', type: 'arbuste', nom: 'Fusain' },
  { id: 'troene', type: 'arbuste', nom: 'Troène' },
  { id: 'osmanthe', type: 'arbuste', nom: 'Osmanthe' },
  { id: 'cornouiller', type: 'arbuste', nom: 'Cornouiller' },
  { id: 'seringat', type: 'arbuste', nom: 'Seringat' }
];

const imageTypes = [
  { suffix: 'vue_generale', label: 'Vue générale', priority: 1 },
  { suffix: 'fleurs', label: 'Floraison', priority: 2 },
  { suffix: 'bourgeons', label: 'Bourgeons', priority: 3 },
  { suffix: 'fruits', label: 'Fruits', priority: 4 },
  { suffix: 'automne', label: 'Automne', priority: 5 },
  { suffix: 'hiver', label: 'Hiver', priority: 6 }
];

const baseDir = path.join(__dirname, 'public', 'images');

console.log('\n📸 RAPPORT DES IMAGES - Les Haies de Bessancourt\n');
console.log('='.repeat(70));

let totalImages = 0;
let totalManquantes = 0;
let totalTropGrosses = 0;

plantes.forEach(plante => {
  const planteDir = path.join(baseDir, plante.id);
  const typeIcon = plante.type === 'arbre' ? '🌳' : '🌿';
  
  console.log(`\n${typeIcon} ${plante.nom.toUpperCase()} (${plante.id})`);
  console.log('-'.repeat(70));
  
  if (!fs.existsSync(planteDir)) {
    console.log('  ❌ DOSSIER N\'EXISTE PAS !');
    totalManquantes += imageTypes.length;
    return;
  }
  
  const files = fs.readdirSync(planteDir).filter(f => 
    f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png')
  );
  
  let planteTotal = 0;
  let planteManquantes = 0;
  
  imageTypes.forEach(type => {
    const expectedFile = `${plante.id}_${type.suffix}.jpg`;
    const exists = files.some(f => f === expectedFile);
    
    if (exists) {
      const filePath = path.join(planteDir, expectedFile);
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(1);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      let status = '✅';
      let warning = '';
      
      if (stats.size > 500000) {
        status = '⚠️ ';
        warning = ' → COMPRESSER (tinypng.com)';
        totalTropGrosses++;
      }
      
      console.log(`  ${status} ${type.label.padEnd(15)} ${expectedFile.padEnd(40)} ${sizeKB.padStart(7)} KB${warning}`);
      planteTotal++;
      totalImages++;
    } else {
      console.log(`  🔴 ${type.label.padEnd(15)} MANQUANT : ${expectedFile}`);
      planteManquantes++;
      totalManquantes++;
    }
  });
  
  const completionPercent = ((planteTotal / imageTypes.length) * 100).toFixed(0);
  console.log(`\n  📊 Progression : ${planteTotal}/${imageTypes.length} (${completionPercent}%)`);
});

console.log('\n' + '='.repeat(70));
console.log(`\n📊 STATISTIQUES GLOBALES`);
console.log(`  ✅ Images présentes : ${totalImages}`);
console.log(`  🔴 Images manquantes : ${totalManquantes}`);
console.log(`  ⚠️  Images à compresser : ${totalTropGrosses}`);
console.log(`  📈 Taux de complétion : ${((totalImages / (totalImages + totalManquantes)) * 100).toFixed(1)}%`);

console.log(`\n💡 PRIORITÉS :`);
console.log(`  1. 🔴 URGENT : Images des 3 cerisiers (18 images manquantes)`);
console.log(`  2. 🟡 Compléter noisetier et cornouiller (4 images)`);
console.log(`  3. 🟢 Optionnel : Photos de floraison pour tous`);

console.log(`\n🔗 SOURCES RECOMMANDÉES :`);
console.log(`  • Pixabay.com (gratuit, haute qualité)`);
console.log(`  • Unsplash.com (gratuit, professionnelle)`);
console.log(`  • Wikimedia Commons (libre, attribution parfois requise)`);

console.log(`\n📏 NOMENCLATURE :`);
imageTypes.forEach(type => {
  console.log(`  • {plante}_${type.suffix}.jpg  →  ${type.label}`);
});

console.log(`\n✅ APRÈS TÉLÉCHARGEMENT :`);
console.log(`  1. Compresser : tinypng.com (< 500 KB)`);
console.log(`  2. Renommer selon convention ci-dessus`);
console.log(`  3. Copier dans client/public/images/{plante}/`);
console.log(`  4. Relancer ce script pour vérifier\n`);

