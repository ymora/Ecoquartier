# 🌳 Guide Simple : Upload de Modèles 3D

## 🎯 CONCEPT

**1 modèle générique = Plusieurs variétés d'arbres**

Exemple :
- `cerisier-general.glb` → Utilisé pour Kanzan, Accolade, Sunset
- `erable-general.glb` → Utilisé pour tous les érables
- Pas besoin d'un modèle pour chaque variété !

---

## 🚀 UTILISATION ULTRA-SIMPLE

### Étape 1 : Démarrer le Serveur

```bash
node admin/server-api.js
```

### Étape 2 : Ouvrir l'Interface

**URL** : http://localhost:3001/upload-model.html

### Étape 3 : Upload en 3 Clics

```
1️⃣ Cliquer sur "Cerisier" (ou Érable, Magnolia, etc.)
2️⃣ Nom: "general" ou "kanzan" ou autre
3️⃣ Glisser votre fichier .blend (ou .obj, .fbx)
4️⃣ Cliquer "Convertir et Stocker"
```

✨ **Terminé !** Le fichier GLB est créé et prêt.

---

## 📁 RÉSULTAT

```
client/public/models/
├── cerisier/
│   └── cerisier-general.glb  ✅ Créé !
├── erable/
│   └── erable-general.glb
└── magnolia/
    └── magnolia-general.glb
```

---

## 🗺️ MAPPING

Éditez `client/src/config/modeles3D.js` :

```javascript
// PLUSIEURS arbres peuvent utiliser le MÊME modèle
export const ARBRE_TO_MODEL = {
  // Tous les cerisiers → 1 seul modèle
  'cerisier-kanzan': 'cerisier-general',
  'cerisier-accolade': 'cerisier-general',
  'cerisier-sunset': 'cerisier-general',
  
  // Tous les érables → 1 seul modèle
  'erable-japon': 'erable-general',
  'erable-champetre': 'erable-general',
};
```

---

## 💡 EXEMPLES

### Exemple 1 : Cerisier Générique

```
Fichier : Cherry_Blossom.blend (téléchargé de Sketchfab)
↓
1. Choisir : Cerisier
2. Nom : "general"
3. Upload : Cherry_Blossom.blend
4. Convertir
↓
Résultat : cerisier-general.glb
↓
Utilisé par : Kanzan, Accolade, Sunset, tous les cerisiers !
```

### Exemple 2 : Érable du Japon

```
Fichier : Japanese_Maple.obj
↓
1. Choisir : Érable
2. Nom : "general"
3. Upload : Japanese_Maple.obj
4. Convertir
↓
Résultat : erable-general.glb
↓
Utilisé par : Tous les érables japonais !
```

---

## 📊 AVANTAGES

| Avant | Après |
|-------|-------|
| 1 modèle par variété | 1 modèle pour plusieurs variétés |
| Besoin de 10+ modèles | Besoin de 3-5 modèles |
| Difficile à maintenir | Facile à gérer |
| Lourd (100+ MB) | Léger (15-30 MB) |

---

## 🎨 SOURCES DE MODÈLES

### Sketchfab (⭐ Meilleur)
- URL : https://sketchfab.com/search?q=cherry+blossom&type=models&features=downloadable
- Format : GLB direct (pas de conversion !)
- Licence : CC BY 4.0 (la plupart)

### Poly Haven
- URL : https://polyhaven.com/models/nature
- Format : GLB, Blend
- Licence : CC0 (domaine public)

### TurboSquid Free
- URL : https://www.turbosquid.com/Search/3D-Models/free/cherry+tree
- Format : Multiple (FBX, OBJ)
- Licence : Varie

---

## ✅ CHECKLIST

- [ ] Serveur lancé (`node admin/server-api.js`)
- [ ] Interface ouverte (http://localhost:3001/upload-model.html)
- [ ] Type sélectionné (Cerisier, Érable, etc.)
- [ ] Nom donné (general, kanzan, etc.)
- [ ] Fichier uploadé (.blend, .obj, .fbx)
- [ ] Conversion lancée
- [ ] Fichier GLB créé
- [ ] Configuration mise à jour dans `modeles3D.js`
- [ ] Build : `cd client && npm run build`
- [ ] Test sur le site !

---

**Système ultra-simplifié et flexible !** 🎯✨

