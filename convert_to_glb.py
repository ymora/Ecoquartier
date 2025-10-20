#!/usr/bin/env python3
"""
Script de conversion OBJ → GLB (Version Automatique)
Scanne tous les sous-dossiers de upload/ et convertit les fichiers OBJ trouvés
"""

import trimesh
import os
from pathlib import Path

# Chemins
UPLOAD_DIR = Path("upload")
OUTPUT_DIR = Path("client/public/models/arbres")

print("=" * 60)
print("    CONVERSION AUTOMATIQUE OBJ -> GLB")
print("=" * 60)
print()

def convert_obj_to_glb(obj_path, glb_path):
    """Convertir un fichier OBJ en GLB"""
    try:
        # Charger le mesh OBJ (avec matériaux si .mtl existe)
        mesh = trimesh.load(str(obj_path), process=False)
        
        # Obtenir la taille originale
        original_size = obj_path.stat().st_size / (1024 * 1024)  # MB
        
        print(f"    OK - Charge ({type(mesh).__name__})")
        
        # Exporter en GLB
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

def find_obj_files():
    """Trouver tous les fichiers OBJ dans les sous-dossiers de upload/"""
    obj_files = []
    
    if not UPLOAD_DIR.exists():
        print(f"ERREUR: Dossier {UPLOAD_DIR} non trouve")
        print("Creer la structure: upload/cerisier/, upload/erable/, etc.")
        return []
    
    # Scanner tous les sous-dossiers
    for category_dir in UPLOAD_DIR.iterdir():
        if category_dir.is_dir():
            category_name = category_dir.name
            
            # Chercher les fichiers .obj dans ce dossier
            for obj_file in category_dir.glob("*.obj"):
                obj_files.append({
                    'category': category_name,
                    'obj_path': obj_file,
                    'obj_name': obj_file.stem,  # Nom sans extension
                    'glb_name': f"{category_name}-{obj_file.stem}.glb"
                })
    
    return obj_files

def main():
    """Fonction principale"""
    
    # Créer le dossier de sortie s'il n'existe pas
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # Trouver tous les fichiers OBJ
    print("[*] Recherche des fichiers OBJ dans upload/...")
    print()
    
    obj_files = find_obj_files()
    
    if not obj_files:
        print("Aucun fichier OBJ trouve.")
        print()
        print("Structure attendue:")
        print("  upload/")
        print("    cerisier/")
        print("      tree-1.obj")
        print("      tree-1.mtl")
        print("    erable/")
        print("      maple-1.obj")
        print("      maple-1.mtl")
        print("    ...")
        return
    
    print(f"Trouve {len(obj_files)} fichier(s) OBJ:")
    for f in obj_files:
        print(f"  - {f['category']}/{f['obj_name']}.obj -> {f['glb_name']}")
    print()
    
    # Convertir tous les fichiers
    success_count = 0
    
    for file_info in obj_files:
        category = file_info['category']
        obj_path = file_info['obj_path']
        glb_name = file_info['glb_name']
        glb_path = OUTPUT_DIR / glb_name
        
        print(f"[*] Conversion: {category}/{obj_path.name} -> {glb_name}")
        
        if convert_obj_to_glb(obj_path, glb_path):
            success_count += 1
    
    # Résumé
    print("=" * 60)
    print(f"[OK] Conversion terminee: {success_count}/{len(obj_files)} fichiers")
    print()
    print(f"Fichiers GLB crees dans:")
    print(f"   {OUTPUT_DIR.absolute()}")
    print()
    
    if success_count == len(obj_files):
        print("SUCCES! Tous les fichiers ont ete convertis!")
        print()
        print("Prochaines etapes:")
        print("  1. Verifier les fichiers .glb dans client/public/models/arbres/")
        print("  2. Mettre a jour modeles3D.js pour utiliser les nouveaux .glb")
        print("  3. Rebuild: cd client && npm run build")
    else:
        print("ATTENTION: Certains fichiers n'ont pas pu etre convertis")
    
    print()
    print("Nomenclature des fichiers GLB:")
    print("  upload/cerisier/tree-1.obj -> cerisier-tree-1.glb")
    print("  upload/erable/maple-1.obj  -> erable-maple-1.glb")
    print()

if __name__ == "__main__":
    main()
