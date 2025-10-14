# -*- coding: utf-8 -*-
"""
Script complet pour télécharger TOUTES les images du projet
Utilise le fichier images_completes.json comme source unique de vérité
"""
import os
import json
import requests
import time

def load_config():
    """Charge la configuration depuis le JSON"""
    with open('images_completes.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def download_image(url, filepath, retry=3):
    """Télécharge une image avec gestion des erreurs"""
    for attempt in range(retry):
        try:
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            size_kb = os.path.getsize(filepath) / 1024
            
            if size_kb < 10:
                print(f"   ATTENTION: Fichier trop petit ({size_kb:.1f} KB)")
                os.remove(filepath)
                return False
            
            print(f"   OK: {os.path.basename(filepath)} ({size_kb:.1f} KB)")
            return True
            
        except Exception as e:
            if attempt < retry - 1:
                print(f"   Tentative {attempt + 1}/{retry} echouee, retry...")
                time.sleep(2)
            else:
                print(f"   ERREUR: {str(e)[:80]}")
                return False
    
    return False

def main():
    print("\n" + "="*70)
    print("  TELECHARGEMENT COMPLET - Haies Bessancourt")
    print("="*70)
    
    config = load_config()
    
    total_images = sum(len(esp['images']) for esp in config['especes'])
    print(f"\nTotal a telecharger: {total_images} images")
    print(f"Especes: {len(config['especes'])}")
    
    dalle_count = sum(1 for esp in config['especes'] for img in esp['images'] if img['url'] == 'CHATGPT_DALLE')
    pexels_count = total_images - dalle_count
    
    print(f"- Pexels: {pexels_count} images")
    print(f"- DALL-E: {dalle_count} images (a generer manuellement)")
    print("\nDemarrage...\n")
    
    success = []
    errors = []
    dalle_list = []
    
    i = 0
    for espece in config['especes']:
        print(f"\n{'='*70}")
        print(f"  {espece['nom'].upper()} ({espece['type']})")
        print(f"{'='*70}")
        
        for img in espece['images']:
            i += 1
            filepath = f"client/public/images/{espece['id']}/{img['nom']}"
            
            print(f"[{i}/{total_images}] {img['nom']}")
            
            if img['url'] == 'CHATGPT_DALLE':
                print(f"   DALLE: A generer avec ChatGPT")
                dalle_list.append({
                    'fichier': img['nom'],
                    'description': img['description'],
                    'espece': espece['nom']
                })
                continue
            
            if download_image(img['url'], filepath):
                success.append(filepath)
            else:
                errors.append(filepath)
            
            if i < total_images:
                time.sleep(1)
    
    # Résumé
    print("\n" + "="*70)
    print("  RESUME")
    print("="*70)
    print(f"\nReussis (Pexels): {len(success)}/{pexels_count}")
    print(f"Erreurs:          {len(errors)}/{pexels_count}")
    print(f"A generer (DALL-E): {len(dalle_list)}")
    
    if dalle_list:
        print("\n" + "="*70)
        print("  IMAGES A GENERER AVEC CHATGPT")
        print("="*70)
        for item in dalle_list:
            print(f"\n{item['fichier']}")
            print(f"  Espece: {item['espece']}")
            print(f"  Description: {item['description']}")
    
    if success:
        print("\n" + "="*70)
        print("  PROCHAINES ETAPES")
        print("="*70)
        print("\n1. Generer les images DALL-E avec ChatGPT")
        print("   Utiliser: PROMPT_CHATGPT_COMPLET.txt")
        print("\n2. Placer les images DALL-E dans client/public/images/")
        print("\n3. git add client/public/images/")
        print("4. git commit -m 'Add: toutes les images (Pexels + DALL-E)'")
        print("5. git push")
        print("\nRender redéploiera automatiquement !")
    
    return len(success), len(errors), len(dalle_list)

if __name__ == "__main__":
    try:
        success_count, error_count, dalle_count = main()
        print(f"\n{'='*70}\n")
        exit(0 if error_count == 0 else 1)
    except KeyboardInterrupt:
        print("\n\nInterrompu par l'utilisateur.")
        exit(1)
    except FileNotFoundError:
        print("\n\nERREUR: Fichier images_completes.json introuvable!")
        exit(1)
    except Exception as e:
        print(f"\n\nERREUR FATALE: {e}")
        exit(1)

