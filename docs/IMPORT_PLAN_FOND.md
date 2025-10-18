# 📷 Import de Plan de Fond (Kazaplan ou autre)

## 🎯 Vue d'ensemble

Le planificateur de terrain permet désormais de **charger une image de votre plan existant** (comme un plan Kazaplan de Leroy Merlin) pour l'utiliser comme fond de référence lors du placement de vos arbres.

## ✨ Fonctionnalités

- ✅ **Import d'image** : PNG, JPG, JPEG acceptés
- ✅ **Ajustement automatique** : L'image s'adapte à la taille du canvas
- ✅ **Opacité réglable** : Slider de 0% à 100% pour ajuster la transparence
- ✅ **Repositionnement** : Déplacer, redimensionner et pivoter l'image
- ✅ **Non-exportée** : L'image reste en arrière-plan et n'est pas sauvegardée dans le plan
- ✅ **Préservée** : L'image n'est pas supprimée lors du chargement d'un plan ou de l'effacement

## 📋 Mode d'emploi

### 1. Préparer votre plan Kazaplan

#### Option A : Capture d'écran (Rapide)
1. Connectez-vous sur [kazaplan.com](https://www.kazaplan.com)
2. Ouvrez votre projet
3. Passez en **vue 2D** (vue de dessus)
4. Ajustez le zoom pour voir l'ensemble du terrain
5. Faites une **capture d'écran** :
   - Windows : `Win + Shift + S`
   - Mac : `Cmd + Shift + 4`
6. Sauvegardez l'image (PNG recommandé)

#### Option B : Export (Si disponible)
1. Dans Kazaplan, cherchez l'option "Exporter" ou "Télécharger"
2. Choisissez le format **PNG** ou **JPG**
3. Téléchargez le fichier

### 2. Charger l'image dans le planificateur

1. Ouvrez le **Planificateur de Terrain** dans l'application
2. Dans la palette d'outils à gauche, descendez jusqu'à la section **"📷 Plan de Fond"**
3. Cliquez sur le bouton **"📷 Charger Image"**
4. Sélectionnez votre fichier image
5. ✅ L'image apparaît immédiatement en fond de canvas !

### 3. Ajuster l'image

#### Opacité
- Un **slider d'opacité** apparaît sous le bouton
- Glissez pour ajuster de 0% (invisible) à 100% (opaque)
- **Recommandation** : 40-60% pour bien voir à la fois l'image et les éléments à dessiner

#### Position et taille
- L'image est **sélectionnable** et **déplaçable**
- **Cliquez et glissez** pour la déplacer
- **Utilisez les coins** pour la redimensionner
- **Rotation disponible** si nécessaire

### 4. Tracer par-dessus

1. L'image sert de **guide visuel**
2. Utilisez les outils normaux pour tracer :
   - 🏠 Maison
   - 🚧 Clôtures
   - 🚰 Canalisations
   - 🌳 Arbres existants
3. Les validations réglementaires s'appliquent normalement

### 5. Supprimer l'image de fond

- Cliquez sur **"🗑️ Retirer Image"** dans la section Plan de Fond
- L'image disparaît mais vos tracés restent

## 💡 Conseils d'utilisation

### Pour un alignement précis

1. **Chargez d'abord l'image** avant de dessiner
2. Ajustez l'**échelle de l'image** en la redimensionnant pour correspondre aux dimensions réelles
3. Utilisez les **dimensions cliquables** en haut à gauche du canvas pour vérifier l'échelle
4. **Verrouillez l'image** une fois positionnée (clic droit > 🔒 Verrouiller)

### Pour une meilleure visibilité

- **Opacité 40-50%** : Bon compromis pour voir l'image ET les éléments dessinés
- **Opacité 80-100%** : Pour vérifier l'alignement avec l'image
- **Opacité 0-20%** : Pour se concentrer sur les éléments dessinés

### Formats d'image recommandés

| Format | Qualité | Poids | Recommandation |
|--------|---------|-------|----------------|
| PNG | ⭐⭐⭐⭐⭐ | Lourd | ✅ Meilleur choix (netteté) |
| JPG | ⭐⭐⭐⭐ | Léger | ✅ Bon compromis |
| JPEG | ⭐⭐⭐⭐ | Léger | ✅ Équivalent JPG |

### Résolution optimale

- **Minimum** : 800 × 600 pixels
- **Recommandé** : 1920 × 1080 pixels
- **Maximum** : 4000 × 3000 pixels (au-delà, risque de ralentissement)

## 🔧 Fonctionnalités avancées

### Verrouillage de l'image

1. Sélectionnez l'image de fond
2. Un menu contextuel apparaît avec 🔒
3. Cliquez pour verrouiller la position et la taille
4. Cliquez à nouveau pour déverrouiller

### L'image ne gêne pas

- ❌ Pas exportée dans le plan sauvegardé
- ❌ Pas supprimée lors du chargement d'un plan
- ❌ Pas supprimée avec la touche Suppr
- ❌ Pas incluse dans les mesures automatiques
- ✅ Préservée lors de l'effacement du plan
- ✅ Uniquement supprimée via le bouton dédié

## 🎬 Exemple complet : De Kazaplan au planificateur

### Étape 1 : Préparer Kazaplan
```
1. Ouvrir kazaplan.com
2. Vue 2D
3. Capturer (Win+Shift+S)
4. Sauvegarder en plan_maison.png
```

### Étape 2 : Importer
```
1. Planificateur > 📷 Charger Image
2. Sélectionner plan_maison.png
3. Image apparaît
```

### Étape 3 : Ajuster
```
1. Opacité → 50%
2. Redimensionner pour correspondre aux dimensions
3. Verrouiller (🔒)
```

### Étape 4 : Dessiner
```
1. Tracer les clôtures sur les limites visibles
2. Positionner la maison sur l'image
3. Ajouter canalisations et arbres
4. Vérifier les validations
```

### Étape 5 : Finaliser
```
1. Réduire l'opacité à 20% pour voir les éléments dessinés
2. Exporter ou sauvegarder le plan
3. (Optionnel) Retirer l'image de fond
```

## ❓ FAQ

### Q : L'image est floue, que faire ?
**R** : Utilisez une image de meilleure résolution (PNG recommandé, minimum 1920×1080).

### Q : L'image disparaît quand je sauvegarde le plan
**R** : Normal ! L'image n'est pas exportée, elle sert uniquement de guide visuel. Rechargez-la si nécessaire.

### Q : Comment ajuster l'échelle de l'image ?
**R** : 
1. Mesurez une distance connue sur l'image (ex: largeur de la maison)
2. Redimensionnez l'image en utilisant les coins
3. Comparez avec les mesures affichées en temps réel
4. Ajustez jusqu'à correspondance

### Q : Puis-je charger plusieurs images ?
**R** : Non, une seule image de fond à la fois. Chargez une nouvelle image pour remplacer l'ancienne.

### Q : L'image ralentit le canvas
**R** : Réduisez la résolution de l'image (max 2000×2000 pixels recommandé).

## 🚀 Cas d'usage

### 1. Plan Kazaplan complet
Chargez votre plan Kazaplan pour éviter de tout redessiner et placez directement vos arbres.

### 2. Photo aérienne du terrain
Utilisez une photo satellite/aérienne de votre propriété pour un placement ultra-précis.

### 3. Plan d'architecte scanné
Importez un plan papier scanné pour digitaliser facilement votre projet.

### 4. Esquisse dessinée à la main
Scannez votre esquisse et utilisez-la comme base pour le dessin numérique.

## 🎨 Workflow recommandé

```
1. 📸 Capturer le plan Kazaplan
   ↓
2. 📷 Charger dans le planificateur
   ↓
3. 🎚️ Ajuster l'opacité (50%)
   ↓
4. 📏 Redimensionner pour correspondre à l'échelle
   ↓
5. 🔒 Verrouiller l'image
   ↓
6. 🖊️ Tracer les éléments principaux
   ↓
7. 🌳 Placer les arbres
   ↓
8. ✅ Vérifier les validations
   ↓
9. 💾 Sauvegarder le plan
```

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez que l'image est au format PNG ou JPG
2. Vérifiez que la résolution est raisonnable (< 4000×3000)
3. Essayez de recharger l'image
4. Contactez la mairie de Bessancourt : **01 30 40 44 47**

---

**Dernière mise à jour** : 18 octobre 2025  
**Version** : 1.0.0

