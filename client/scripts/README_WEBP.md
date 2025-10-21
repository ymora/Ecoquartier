# 🖼️ Conversion WebP - Guide

## ⚠️ Problème d'installation sharp sur Windows

Le script `convert-to-webp.cjs` nécessite `sharp` qui peut avoir des problèmes d'installation sur Windows.

### Solution 1 : Installer detect-libc manuellement
```bash
npm install --save-dev detect-libc
node scripts/convert-to-webp.cjs --dry-run
```

### Solution 2 : Utiliser un outil en ligne
- [Squoosh](https://squoosh.app/) - Outil Google gratuit
- [CloudConvert](https://cloudconvert.com/jpg-to-webp)

### Solution 3 : Conversion manuelle avec Blender/GIMP
1. Ouvrir l'image dans GIMP
2. Fichier > Exporter sous
3. Choisir format WebP
4. Qualité : 85%

## 📊 Gains attendus

- **60 images JPG** dans `public/images/`
- **Poids actuel** : 14.8 MB
- **Après conversion** : ~4.4 MB
- **Économie** : -70% (~10 MB gagnés)

## 🎯 Impact sur l'utilisateur

- Chargement initial **5x plus rapide**
- Moins de données mobiles consommées
- Meilleure note Lighthouse (+20 points)

## 📝 Prochaines étapes après conversion

1. ✅ Convertir les images
2. Mettre à jour le code pour utiliser WebP :
   ```jsx
   <picture>
     <source srcSet="image.webp" type="image/webp" />
     <img src="image.jpg" alt="..." /> {/* Fallback */}
   </picture>
   ```
3. Tester visuellement
4. Supprimer les JPG originaux

