#!/usr/bin/env python3
"""
Script de conversion OBJ → GLB
Utilise trimesh pour convertir automatiquement tous les fichiers OBJ
"""

import trimesh
import os
from pathlib import Path

# Chemins
MODELS_DIR = Path("client/public/models/arbres")

FILES = [
    ("tree-1.obj", "tree-1.glb"),
    ("tree-2.obj", "tree-2.glb"),
    ("tree-3.obj", "tree-3.glb"),
]

print("Conversion OBJ -> GLB")
print("=" * 50)
print()

def convert_obj_to_glb(obj_file, glb_file):
    """Convertir un fichier OBJ en GLB"""
    obj_path = MODELS_DIR / obj_file
    glb_path = MODELS_DIR / glb_file
    
    print(f"[*] Lecture: {obj_file}...")
    
    try:
        # Charger le mesh OBJ (avec matériaux si .mtl existe)
        mesh = trimesh.load(str(obj_path), process=False)
        
        # Obtenir la taille originale
        original_size = obj_path.stat().st_size / (1024 * 1024)  # MB
        
        print(f"    OK - Charge ({type(mesh).__name__})")
        
        # Exporter en GLB
        print(f"[*] Export: {glb_file}...")
        mesh.export(str(glb_path))
        
        # Obtenir la nouvelle taille
        new_size = glb_path.stat().st_size / (1024 * 1024)  # MB
        reduction = ((1 - new_size / original_size) * 100)
        
        print(f"    Taille originale: {original_size:.2f} MB")
        print(f"    Nouvelle taille: {new_size:.2f} MB")
        print(f"    Reduction: {reduction:.1f}%")
        print()
        
        return True
        
    except Exception as e:
        print(f"    ERREUR: {e}")
        print()
        return False

def main():
    """Fonction principale"""
    
    # Vérifier que le dossier existe
    if not MODELS_DIR.exists():
        print(f"ERREUR: Dossier non trouve: {MODELS_DIR}")
        print(f"   Chemin actuel: {os.getcwd()}")
        return
    
    success_count = 0
    
    # Convertir tous les fichiers
    for obj_file, glb_file in FILES:
        if convert_obj_to_glb(obj_file, glb_file):
            success_count += 1
    
    print("=" * 50)
    print(f"[OK] Conversion terminee: {success_count}/{len(FILES)} fichiers")
    print()
    print(f"Fichiers GLB crees dans:")
    print(f"   {MODELS_DIR.absolute()}")
    print()
    
    if success_count == len(FILES):
        print("SUCCES! Tous les fichiers ont ete convertis!")
        print()
        print("Prochaines etapes:")
        print("   1. Verifier les fichiers .glb dans le dossier")
        print("   2. Mettre a jour modeles3D.js pour utiliser .glb")
        print("   3. Rebuild: cd client && npm run build")
    else:
        print("ATTENTION: Certains fichiers n'ont pas pu etre convertis")

if __name__ == "__main__":
    main()

