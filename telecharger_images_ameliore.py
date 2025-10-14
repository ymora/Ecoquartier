# -*- coding: utf-8 -*-
"""
Script amélioré pour télécharger les images des plantes
Utilise uniquement des sources fiables (Pexels, Unsplash)
"""
import os
import requests
import time

# URLs vérifiées et fonctionnelles
images = {
    # PRUNUS KANZAN - Cerisier du Japon à fleurs doubles rose fuchsia
    "client/public/images/prunus-kanzan/prunus-kanzan_fleurs.jpg": 
        "https://images.pexels.com/photos/16639909/pexels-photo-16639909.jpeg?auto=compress&cs=tinysrgb&w=1600",
    
    "client/public/images/prunus-kanzan/prunus-kanzan_vue_generale.jpg": 
        "https://images.pexels.com/photos/12100172/pexels-photo-12100172.jpeg?auto=compress&cs=tinysrgb&w=1600",
    
    "client/public/images/prunus-kanzan/prunus-kanzan_bourgeons.jpg": 
        "https://images.pexels.com/photos/12514691/pexels-photo-12514691.jpeg?auto=compress&cs=tinysrgb&w=1600",
    
    "client/public/images/prunus-kanzan/prunus-kanzan_automne.jpg": 
        "https://images.pexels.com/photos/2246476/pexels-photo-2246476.jpeg?auto=compress&cs=tinysrgb&w=1600",
    
    # PRUNUS ACCOLADE - Cerisier à fleurs rose pâle semi-doubles
    "client/public/images/prunus-accolade/prunus-accolade_fleurs.jpg": 
        "https://images.pexels.com/photos/31809822/pexels-photo-31809822.jpeg?auto=compress&cs=tinysrgb&w=1600",
    
    "client/public/images/prunus-accolade/prunus-accolade_vue_generale.jpg": 
        "https://images.pexels.com/photos/56866/cherry-blossom-tree-flowers-spring.jpg?auto=compress&cs=tinysrgb&w=1600",
    
    "client/public/images/prunus-accolade/prunus-accolade_bourgeons.jpg": 
        "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=1600",
    
    "client/public/images/prunus-accolade/prunus-accolade_automne.jpg": 
        "https://images.pexels.com/photos/1407305/pexels-photo-1407305.jpeg?auto=compress&cs=tinysrgb&w=1600",
    
    # PRUNUS SUNSET BOULEVARD - Cerisier à fleurs rose saumon/corail
    "client/public/images/prunus-sunset-boulevard/prunus-sunset-boulevard_fleurs.jpg": 
        "https://images.pexels.com/photos/2253879/pexels-photo-2253879.jpeg?auto=compress&cs=tinysrgb&w=1600",
    
    "client/public/images/prunus-sunset-boulevard/prunus-sunset-boulevard_vue_generale.jpg": 
        "https://images.pexels.com/photos/1022922/pexels-photo-1022922.jpeg?auto=compress&cs=tinysrgb&w=1600",
    
    "client/public/images/prunus-sunset-boulevard/prunus-sunset-boulevard_bourgeons.jpg": 
        "https://images.pexels.com/photos/3073666/pexels-photo-3073666.jpeg?auto=compress&cs=tinysrgb&w=1600",
    
    "client/public/images/prunus-sunset-boulevard/prunus-sunset-boulevard_automne.jpg": 
        "https://images.pexels.com/photos/1441315/pexels-photo-1441315.jpeg?auto=compress&cs=tinysrgb&w=1600",
    
    # NOISETIER - Chatons jaunes
    "client/public/images/noisetier/noisetier_fleurs.jpg": 
        "https://images.pexels.com/photos/4792495/pexels-photo-4792495.jpeg?auto=compress&cs=tinysrgb&w=1600",
    
    # CORNOUILLER - Fleurs blanches et fruits noirs
    "client/public/images/cornouiller/cornouiller_fleurs.jpg": 
        "https://images.pexels.com/photos/7728886/pexels-photo-7728886.jpeg?auto=compress&cs=tinysrgb&w=1600",
    
    "client/public/images/cornouiller/cornouiller_fruits.jpg": 
        "https://images.pexels.com/photos/6231862/pexels-photo-6231862.jpeg?auto=compress&cs=tinysrgb&w=1600",
}

def download_image(url, filepath, retry=3):
    """Télécharge une image avec gestion des erreurs et retry"""
    for attempt in range(retry):
        try:
            # Créer le dossier si nécessaire
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            
            # Headers pour éviter les blocages
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            
            # Télécharger
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            
            # Sauvegarder
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            # Vérifier la taille
            size_kb = os.path.getsize(filepath) / 1024
            
            if size_kb < 10:
                print(f"   ATTENTION: Fichier trop petit ({size_kb:.1f} KB)")
                return False
            
            print(f"   OK: {os.path.basename(filepath)} ({size_kb:.1f} KB)")
            return True
            
        except requests.exceptions.RequestException as e:
            if attempt < retry - 1:
                print(f"   Tentative {attempt + 1}/{retry} echouee, retry...")
                time.sleep(2)
            else:
                print(f"   ERREUR: {str(e)[:80]}")
                return False
        except Exception as e:
            print(f"   ERREUR inattendue: {str(e)[:80]}")
            return False
    
    return False

def main():
    print("\n" + "="*60)
    print("  TELECHARGEMENT DES IMAGES - Haies Bessancourt")
    print("="*60)
    print(f"\nTotal a telecharger: {len(images)} images")
    print("\nDemarrage...\n")
    
    success = []
    errors = []
    
    for i, (filepath, url) in enumerate(images.items(), 1):
        plante = os.path.basename(os.path.dirname(filepath))
        filename = os.path.basename(filepath)
        
        print(f"[{i}/{len(images)}] {plante}/{filename}")
        
        if download_image(url, filepath):
            success.append(filepath)
        else:
            errors.append(filepath)
        
        # Pause entre téléchargements pour ne pas surcharger
        if i < len(images):
            time.sleep(1)
    
    # Résumé
    print("\n" + "="*60)
    print("  RESUME")
    print("="*60)
    print(f"\nReussis: {len(success)}/{len(images)}")
    print(f"Erreurs:  {len(errors)}/{len(images)}")
    
    if success:
        print("\n✓ Images telechargees:")
        for fp in success:
            print(f"  - {fp}")
    
    if errors:
        print("\n✗ Images en erreur:")
        for fp in errors:
            print(f"  - {fp}")
    
    print("\n" + "="*60)
    
    if len(success) > 0:
        print("\nPROCHAINES ETAPES:")
        print("1. Verifier les images dans client/public/images/")
        print("2. git add client/public/images/")
        print("3. git commit -m 'Add: images des plantes'")
        print("4. git push")
        print("\nRender redéploiera automatiquement !")
    
    return len(success), len(errors)

if __name__ == "__main__":
    try:
        success_count, error_count = main()
        exit(0 if error_count == 0 else 1)
    except KeyboardInterrupt:
        print("\n\nInterrompu par l'utilisateur.")
        exit(1)
    except Exception as e:
        print(f"\n\nERREUR FATALE: {e}")
        exit(1)

