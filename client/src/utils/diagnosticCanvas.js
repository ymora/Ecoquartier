/**
 * Diagnostic complet du canvas Fabric.js
 * Pour identifier les problèmes visuels
 */

export const diagnostiquerCanvas = (canvas) => {
  if (!canvas) {
    console.error('❌ Canvas null ou undefined');
    return;
  }

  console.log('═══════════════════════════════════════');
  console.log('🔍 DIAGNOSTIC COMPLET DU CANVAS');
  console.log('═══════════════════════════════════════');
  
  // Info canvas
  console.log('\n📐 CANVAS:');
  console.log(`   Dimensions: ${canvas.width}×${canvas.height}px`);
  console.log(`   Background: ${canvas.backgroundColor || 'transparent'}`);
  console.log(`   Zoom: ${canvas.getZoom()}`);
  console.log(`   ViewportTransform: ${canvas.viewportTransform}`);
  
  // Objets
  const objets = canvas.getObjects();
  console.log(`\n📊 OBJETS (${objets.length} total):`);
  
  // Grouper par type
  const parType = {};
  objets.forEach(obj => {
    const type = obj.customType || obj.type || 'inconnu';
    parType[type] = (parType[type] || 0) + 1;
  });
  
  console.table(parType);
  
  // Détails par type important
  console.log('\n🌳 ARBRES À PLANTER:');
  const arbres = objets.filter(obj => obj.customType === 'arbre-a-planter');
  arbres.forEach((arbre, i) => {
    console.log(`   ${i+1}. ${arbre.arbreData?.name || 'Inconnu'}`);
    console.log(`      Position: (${arbre.left.toFixed(0)}, ${arbre.top.toFixed(0)})`);
    console.log(`      Visible: ${arbre.visible !== false}`);
    console.log(`      Opacity: ${arbre.opacity || 1}`);
    console.log(`      ScaleX/Y: ${arbre.scaleX?.toFixed(2) || 1} / ${arbre.scaleY?.toFixed(2) || 1}`);
    
    // Ellipse (premier élément du groupe)
    if (arbre.item) {
      const ellipse = arbre.item(0);
      console.log(`      Ellipse: rx=${ellipse.rx?.toFixed(0)}px, ry=${ellipse.ry?.toFixed(0)}px`);
      console.log(`      Fill: ${ellipse.fill}, Stroke: ${ellipse.stroke}`);
    }
  });
  
  // Grille
  console.log('\n▦ GRILLE:');
  const grille = objets.filter(obj => obj.isGridLine);
  console.log(`   Lignes: ${grille.length}`);
  console.log(`   Couleur: ${grille[0]?.stroke || 'N/A'}`);
  
  // Image de fond
  console.log('\n🖼️ IMAGE DE FOND:');
  const imageFond = objets.filter(obj => obj.isImageFond);
  if (imageFond.length > 0) {
    console.log(`   Présente: OUI (${imageFond.length})`);
    console.log(`   Position: index ${objets.indexOf(imageFond[0])}`);
    console.log(`   Opacity: ${imageFond[0].opacity}`);
    console.log(`   Dimensions: ${imageFond[0].width?.toFixed(0)}×${imageFond[0].height?.toFixed(0)}px`);
  } else {
    console.log(`   Présente: NON`);
  }
  
  // Zones de contraintes
  console.log('\n🎨 ZONES CONTRAINTES:');
  const zones = objets.filter(obj => obj.isZoneContrainte);
  console.log(`   Zones: ${zones.length}`);
  
  // Ombres
  console.log('\n☀️ OMBRES:');
  const ombres = objets.filter(obj => obj.isOmbre);
  console.log(`   Ombres: ${ombres.length}`);
  
  // Z-index order
  console.log('\n📚 ORDRE Z-INDEX (5 premiers et 5 derniers):');
  objets.slice(0, 5).forEach((obj, i) => {
    const type = obj.customType || obj.type || obj.isGridLine ? 'grid' : 'autre';
    console.log(`   ${i}. ${type}`);
  });
  console.log('   ...');
  objets.slice(-5).forEach((obj, i) => {
    const type = obj.customType || obj.type || obj.isGridLine ? 'grid' : 'autre';
    const index = objets.length - 5 + i;
    console.log(`   ${index}. ${type}`);
  });
  
  console.log('\n═══════════════════════════════════════');
  console.log('✅ Diagnostic terminé');
  console.log('═══════════════════════════════════════\n');
  
  return {
    totalObjets: objets.length,
    arbres: arbres.length,
    grille: grille.length,
    imageFond: imageFond.length > 0,
    zones: zones.length,
    ombres: ombres.length
  };
};

// Exposer dans window pour console
if (typeof window !== 'undefined') {
  window.diagnosticCanvas = diagnostiquerCanvas;
  console.log('🔍 Diagnostic disponible: window.diagnosticCanvas(canvas)');
}

export default diagnostiquerCanvas;

