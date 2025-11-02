/**
 * diagnosticPositions.js
 * 🔍 Diagnostic complet de synchronisation 2D↔3D
 */

import logger from '../logger';

/**
 * Comparer les positions 2D et 3D pour tous les objets
 */
export const diagnostiquerPositions2D3D = (canvas, data3D, echelle = 30) => {
  if (!canvas || !data3D) {
    logger.warn('Diagnostic', 'Canvas ou data3D manquant');
    return;
  }
  
  const objets2D = canvas.getObjects();
  const rapport = {
    total2D: objets2D.length,
    total3D: 0,
    ecarts: []
  };
  
  logger.info('Diagnostic', '🔍 DÉBUT DIAGNOSTIC POSITIONS 2D↔3D');
  logger.info('Diagnostic', `Échelle: ${echelle} px/m`);
  logger.info('Diagnostic', '─'.repeat(80));
  
  // Fonction helper pour convertir position 2D→3D
  const convertirPos2Dto3D = (obj) => {
    return {
      x: obj.left / echelle,
      z: obj.top / echelle
    };
  };
  
  // Diagnostic MAISONS
  const maisons2D = objets2D.filter(o => o.customType === 'maison');
  const maisons3D = data3D.maisons || [];
  rapport.total3D += maisons3D.length;
  
  logger.info('Diagnostic', `\n🏠 MAISONS (${maisons2D.length} en 2D, ${maisons3D.length} en 3D)`);
  
  maisons2D.forEach((m2d, idx) => {
    const pos2D = convertirPos2Dto3D(m2d);
    const m3d = maisons3D[idx];
    
    if (m3d) {
      const pos3D = { x: m3d.position[0], z: m3d.position[2] };
      const ecartX = Math.abs(pos2D.x - pos3D.x);
      const ecartZ = Math.abs(pos2D.z - pos3D.z);
      const ecartTotal = Math.sqrt(ecartX * ecartX + ecartZ * ecartZ);
      
      const largeur2D = m2d.getScaledWidth() / echelle;
      const profondeur2D = m2d.getScaledHeight() / echelle;
      
      logger.info('Diagnostic', 
        `  Maison #${idx + 1}:\n` +
        `    2D: centre=(${pos2D.x.toFixed(2)}, ${pos2D.z.toFixed(2)}) dim=${largeur2D.toFixed(2)}×${profondeur2D.toFixed(2)}m originX="${m2d.originX}" originY="${m2d.originY}"\n` +
        `    3D: centre=(${pos3D.x.toFixed(2)}, ${pos3D.z.toFixed(2)}) dim=${m3d.largeur.toFixed(2)}×${m3d.profondeur.toFixed(2)}m\n` +
        `    📏 Écart: ${ecartTotal.toFixed(3)}m (X:${ecartX.toFixed(3)}m Z:${ecartZ.toFixed(3)}m) ${ecartTotal > 0.1 ? '❌ PROBLÈME!' : '✅ OK'}`
      );
      
      if (ecartTotal > 0.1) {
        rapport.ecarts.push({
          type: 'maison',
          index: idx,
          ecart: ecartTotal,
          pos2D,
          pos3D
        });
      }
    }
  });
  
  // Diagnostic CAISSONS D'EAU
  const caissons2D = objets2D.filter(o => o.customType === 'caisson-eau');
  const caissons3D = (data3D.citernes || []).filter(c => c.customType === 'caisson-eau');
  rapport.total3D += caissons3D.length;
  
  logger.info('Diagnostic', `\n💦 CAISSONS D'EAU (${caissons2D.length} en 2D, ${caissons3D.length} en 3D)`);
  
  caissons2D.forEach((c2d, idx) => {
    const pos2D = convertirPos2Dto3D(c2d);
    const c3d = caissons3D[idx];
    
    if (c3d) {
      const pos3D = { x: c3d.position[0], z: c3d.position[2] };
      const ecartX = Math.abs(pos2D.x - pos3D.x);
      const ecartZ = Math.abs(pos2D.z - pos3D.z);
      const ecartTotal = Math.sqrt(ecartX * ecartX + ecartZ * ecartZ);
      
      const largeur2D = c2d.getScaledWidth() / echelle;
      const profondeur2D = c2d.getScaledHeight() / echelle;
      
      logger.info('Diagnostic', 
        `  Caisson #${idx + 1}:\n` +
        `    2D: centre=(${pos2D.x.toFixed(2)}, ${pos2D.z.toFixed(2)}) dim=${largeur2D.toFixed(2)}×${profondeur2D.toFixed(2)}m originX="${c2d.originX}" originY="${c2d.originY}"\n` +
        `    3D: centre=(${pos3D.x.toFixed(2)}, ${pos3D.z.toFixed(2)}) dim=${c3d.largeur.toFixed(2)}×${c3d.profondeur.toFixed(2)}m\n` +
        `    📏 Écart: ${ecartTotal.toFixed(3)}m (X:${ecartX.toFixed(3)}m Z:${ecartZ.toFixed(3)}m) ${ecartTotal > 0.1 ? '❌ PROBLÈME!' : '✅ OK'}`
      );
      
      if (ecartTotal > 0.1) {
        rapport.ecarts.push({
          type: 'caisson-eau',
          index: idx,
          ecart: ecartTotal,
          pos2D,
          pos3D
        });
      }
    }
  });
  
  // Diagnostic TERRASSES
  const terrasses2D = objets2D.filter(o => o.customType === 'terrasse');
  const terrasses3D = data3D.terrasses || [];
  rapport.total3D += terrasses3D.length;
  
  logger.info('Diagnostic', `\n🏡 TERRASSES (${terrasses2D.length} en 2D, ${terrasses3D.length} en 3D)`);
  
  terrasses2D.forEach((t2d, idx) => {
    const pos2D = convertirPos2Dto3D(t2d);
    const t3d = terrasses3D[idx];
    
    if (t3d) {
      const pos3D = { x: t3d.position[0], z: t3d.position[2] };
      const ecartX = Math.abs(pos2D.x - pos3D.x);
      const ecartZ = Math.abs(pos2D.z - pos3D.z);
      const ecartTotal = Math.sqrt(ecartX * ecartX + ecartZ * ecartZ);
      
      logger.info('Diagnostic', 
        `  Terrasse #${idx + 1}: Écart=${ecartTotal.toFixed(3)}m ${ecartTotal > 0.1 ? '❌' : '✅'}`
      );
      
      if (ecartTotal > 0.1) {
        rapport.ecarts.push({
          type: 'terrasse',
          index: idx,
          ecart: ecartTotal,
          pos2D,
          pos3D
        });
      }
    }
  });
  
  // Diagnostic PAVÉS
  const paves2D = objets2D.filter(o => o.customType === 'paves');
  const paves3D = (data3D.terrasses || []).filter(t => t.customType === 'paves');
  rapport.total3D += paves3D.length;
  
  logger.info('Diagnostic', `\n🟩 PAVÉS (${paves2D.length} en 2D, ${paves3D.length} en 3D)`);
  
  paves2D.forEach((p2d, idx) => {
    const pos2D = convertirPos2Dto3D(p2d);
    const p3d = paves3D[idx];
    
    if (p3d) {
      const pos3D = { x: p3d.position[0], z: p3d.position[2] };
      const ecartX = Math.abs(pos2D.x - pos3D.x);
      const ecartZ = Math.abs(pos2D.z - pos3D.z);
      const ecartTotal = Math.sqrt(ecartX * ecartX + ecartZ * ecartZ);
      
      logger.info('Diagnostic', 
        `  Pavés #${idx + 1}: Écart=${ecartTotal.toFixed(3)}m ${ecartTotal > 0.1 ? '❌' : '✅'}`
      );
      
      if (ecartTotal > 0.1) {
        rapport.ecarts.push({
          type: 'paves',
          index: idx,
          ecart: ecartTotal,
          pos2D,
          pos3D
        });
      }
    }
  });
  
  // RÉSUMÉ
  logger.info('Diagnostic', '─'.repeat(80));
  logger.info('Diagnostic', `\n📊 RÉSUMÉ:`);
  logger.info('Diagnostic', `  Objets 2D: ${rapport.total2D}`);
  logger.info('Diagnostic', `  Objets 3D: ${rapport.total3D}`);
  logger.info('Diagnostic', `  Écarts > 0.1m: ${rapport.ecarts.length}`);
  
  if (rapport.ecarts.length > 0) {
    logger.error('Diagnostic', `\n❌ ${rapport.ecarts.length} OBJETS MAL POSITIONNÉS:`);
    rapport.ecarts.forEach(e => {
      logger.error('Diagnostic', 
        `  - ${e.type} #${e.index + 1}: Écart=${e.ecart.toFixed(3)}m 2D=(${e.pos2D.x.toFixed(2)}, ${e.pos2D.z.toFixed(2)}) 3D=(${e.pos3D.x.toFixed(2)}, ${e.pos3D.z.toFixed(2)})`
      );
    });
  } else {
    logger.info('Diagnostic', '\n✅ TOUTES LES POSITIONS SONT CORRECTES!');
  }
  
  logger.info('Diagnostic', '🔍 FIN DIAGNOSTIC\n');
  
  return rapport;
};

