/**
 * Script de conversion OBJ → GLB
 * Utilise Three.js pour charger les OBJ et exporter en GLB
 */

import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const MODELS_DIR = path.join(__dirname, '../client/public/models/arbres');

const FILES_TO_CONVERT = [
  { obj: 'tree-1.obj', mtl: 'tree-1.mtl', output: 'tree-1.glb' },
  { obj: 'tree-2.obj', mtl: 'tree-2.mtl', output: 'tree-2.glb' },
  { obj: 'tree-3.obj', mtl: 'tree-3.mtl', output: 'tree-3.glb' }
];

console.log('🌳 Conversion OBJ → GLB');
console.log('========================\n');

async function convertOBJToGLB(objFile, mtlFile, outputFile) {
  return new Promise((resolve, reject) => {
    const objPath = path.join(MODELS_DIR, objFile);
    const mtlPath = path.join(MODELS_DIR, mtlFile);
    const outputPath = path.join(MODELS_DIR, outputFile);
    
    console.log(`📂 Lecture: ${objFile}...`);
    
    // Lire les fichiers
    const objData = fs.readFileSync(objPath, 'utf8');
    const mtlData = fs.readFileSync(mtlPath, 'utf8');
    
    // Charger les matériaux
    const mtlLoader = new MTLLoader();
    const materials = mtlLoader.parse(mtlData, path.dirname(mtlPath));
    materials.preload();
    
    // Charger l'objet
    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    const object = objLoader.parse(objData);
    
    console.log(`✅ OBJ chargé (${object.children.length} mesh)`);
    
    // Exporter en GLB
    const exporter = new GLTFExporter();
    
    exporter.parse(
      object,
      (gltf) => {
        // Sauvegarder le GLB
        const buffer = Buffer.from(gltf);
        fs.writeFileSync(outputPath, buffer);
        
        const originalSize = fs.statSync(objPath).size;
        const newSize = fs.statSync(outputPath).size;
        const reduction = ((1 - newSize / originalSize) * 100).toFixed(1);
        
        console.log(`💾 Sauvegardé: ${outputFile}`);
        console.log(`📊 Taille originale: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`📊 Nouvelle taille: ${(newSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`🎉 Réduction: ${reduction}%\n`);
        
        resolve();
      },
      (error) => {
        console.error(`❌ Erreur export:`, error);
        reject(error);
      },
      {
        binary: true, // Format GLB (binaire)
        onlyVisible: true,
        truncateDrawRange: true,
        embedImages: true,
        forcePowerOfTwoTextures: false,
        maxTextureSize: 2048 // Réduire les textures si trop grandes
      }
    );
  });
}

async function main() {
  try {
    for (const file of FILES_TO_CONVERT) {
      await convertOBJToGLB(file.obj, file.mtl, file.output);
    }
    
    console.log('✅ Conversion terminée !');
    console.log('\n📁 Fichiers GLB créés dans:');
    console.log(`   ${MODELS_DIR}\n`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

main();

