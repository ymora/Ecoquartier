# 🌳 Conversion de Modèles 3D

## 🚀 MÉTHODE AUTOMATIQUE (Recommandée)

### Script Python - convert_to_glb.py

**Ce script convertit automatiquement tous vos fichiers OBJ en GLB.**

#### Utilisation :

```bash
# Placer vos fichiers .obj et .mtl dans client/public/models/arbres/
# Puis lancer :
python convert_to_glb.py
```

#### Résultat :

- ✅ Conversion OBJ → GLB automatique
- ✅ Réduction de taille -60 à -80%
- ✅ Format web-optimisé
- ✅ Rapport détaillé des conversions

#### Prérequis :

```bash
# Installer trimesh (une seule fois)
pip install trimesh[easy]
```

---

## 📝 AJOUTER DE NOUVEAUX MODÈLES

### Étape 1 : Ajouter les fichiers OBJ

Placer vos fichiers dans `client/public/models/arbres/` :
```
client/public/models/arbres/
├── mon-arbre.obj
└── mon-arbre.mtl
```

### Étape 2 : Modifier le script

Éditer `convert_to_glb.py` :

```python
FILES = [
    ("tree-1.obj", "tree-1.glb"),
    ("tree-2.obj", "tree-2.glb"),
    ("tree-3.obj", "tree-3.glb"),
    ("mon-arbre.obj", "mon-arbre.glb"),  # Ajouter ici
]
```

### Étape 3 : Lancer la conversion

```bash
python convert_to_glb.py
```

### Étape 4 : Configurer le mapping

Éditer `client/src/config/modeles3D.js` :

```javascript
// 1. Ajouter le modèle
'mon-arbre': {
  path: '/models/arbres/mon-arbre.glb',
  type: 'glb',
  scale: 0.5,
  rotation: [0, 0, 0],
  hauteurReelle: 8,
  nom: 'Mon Arbre'
}

// 2. Mapper à un arbre de la base de données
export const ARBRE_TO_MODEL = {
  'cerisier-kanzan': 'mon-arbre',  // Utiliser le nouveau modèle
  // ...
};
```

### Étape 5 : Rebuild

```bash
cd client
npm run build
```

---

## 🛠️ MÉTHODES ALTERNATIVES

### Si le script Python ne fonctionne pas

#### Option A : Conversion en ligne (gratuit, sans installation)

1. Aller sur : https://products.aspose.app/3d/conversion/obj-to-glb
2. Upload votre fichier .obj
3. Télécharger le .glb résultant
4. Placer dans `client/public/models/arbres/`

#### Option B : Avec Blender (meilleure qualité)

1. Télécharger Blender : https://www.blender.org/download/
2. Ouvrir Blender
3. `File → Import → Wavefront (.obj)`
4. `File → Export → glTF 2.0 (.glb/.gltf)`
5. Options importantes :
   - Format: **glTF Binary (.glb)** ✅
   - Transform: **+Y Up** ✅
   - Compression: **Draco** ✅
6. Sauvegarder dans `client/public/models/arbres/`

---

## 📊 RÉSULTATS ATTENDUS

| Format | Taille Moyenne | Chargement |
|--------|---------------|------------|
| OBJ original | 30-50 MB | 3-5 secondes |
| **GLB (script)** | **10-15 MB** | **1-2 secondes** ✅ |
| GLB + Draco | 3-5 MB | <1 seconde |

---

## 🐛 DÉPANNAGE

### Erreur "trimesh not found"
```bash
pip install trimesh[easy]
```

### Erreur "Module not found"
```bash
pip install numpy pillow networkx
```

### Le modèle ne s'affiche pas
1. Vérifier le chemin dans `modeles3D.js`
2. Vérifier la console du navigateur (F12)
3. Rebuild : `cd client && npm run build`

---

## 📚 DOCUMENTATION COMPLÈTE

- `docs/GUIDE_CONVERSION_3D.md` - Guide détaillé Blender
- `docs/UTILISATION_MODELES_3D.md` - Intégration dans l'app
- `SUCCES_CONVERSION_3D.md` - Récapitulatif des conversions

---

**Script créé et testé le 20/10/2025**  
**3 arbres convertis avec succès : tree-1, tree-2, tree-3**

