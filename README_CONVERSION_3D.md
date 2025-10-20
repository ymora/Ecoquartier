# 🌳 Conversion et Gestion des Modèles 3D

## 🎯 SYSTÈME SIMPLIFIÉ

### Principe
- **1 modèle** peut être utilisé par **plusieurs arbres**
- Exemple : `cerisier-general.glb` utilisé pour Kanzan, Accolade, Sunset
- Fichiers organisés par **type** : `cerisier/`, `erable/`, `magnolia/`

### Structure
```
client/public/models/
├── cerisier/
│   ├── cerisier-kanzan.glb      ← Modèle spécifique
│   └── cerisier-general.glb     ← Modèle générique pour tous les cerisiers
├── erable/
│   ├── erable-japon.glb
│   └── erable-general.glb
└── magnolia/
    └── magnolia-general.glb
```

---

## 🚀 MÉTHODE 1 : Interface Web (⭐ Recommandée)

### Installation

```bash
# 1. Installer les dépendances
npm install express multer cors

# 2. Lancer le serveur
node admin/server-api.js
```

### Utilisation

1. **Ouvrir** : http://localhost:3001/upload-model.html

2. **Choisir** le type d'arbre :
   - 🌸 Cerisier
   - 🍁 Érable
   - 🌺 Magnolia
   - 🌳 Prunus
   - 🌿 Arbuste

3. **Nommer** le modèle :
   - Exemple : `kanzan` → `cerisier-kanzan.glb`
   - Exemple : `general` → `cerisier-general.glb`

4. **Uploader** votre fichier :
   - Formats : `.blend`, `.obj`, `.fbx`, `.gltf`
   - Taille max : 200 MB

5. **Convertir** :
   - Clic sur "Convertir et Stocker"
   - ✨ Le fichier GLB est créé automatiquement !

### Résultat

```
✅ Fichier créé :
   client/public/models/cerisier/cerisier-kanzan.glb
   
📊 Réduction : -61%
📁 Prêt à utiliser !
```

---

## 🐍 MÉTHODE 2 : Script Python (Sans Interface)

### Pour fichiers OBJ uniquement

```bash
# 1. Placer vos fichiers OBJ/MTL dans upload/{type}/
upload/cerisier/mon-arbre.obj
upload/cerisier/mon-arbre.mtl

# 2. Lancer la conversion
python convert_to_glb.py

# 3. Résultat automatique :
client/public/models/arbres/cerisier-mon-arbre.glb
```

**Limitation** : Ne supporte que OBJ (pas .blend ni .fbx)

---

## 📁 ORGANISATION DES FICHIERS

### Sources (upload/)

```
upload/
├── cerisier/
│   ├── tree-1.obj + .mtl
│   ├── tree-2.obj + .mtl
│   └── kanzan.blend
├── erable/
│   └── japon.blend
└── magnolia/
    └── general.obj + .mtl
```

### Fichiers Web (client/public/models/)

```
client/public/models/
├── cerisier/
│   ├── cerisier-tree-1.glb
│   ├── cerisier-tree-2.glb
│   └── cerisier-kanzan.glb
├── erable/
│   └── erable-japon.glb
└── magnolia/
    └── magnolia-general.glb
```

---

## ⚙️ CONFIGURATION

### Mapping Flexible dans modeles3D.js

```javascript
// Plusieurs arbres peuvent utiliser le MÊME modèle
export const ARBRE_TO_MODEL = {
  // Tous les cerisiers utilisent le même modèle générique
  'cerisier-kanzan': 'cerisier-general',
  'cerisier-accolade': 'cerisier-general',
  'cerisier-sunset': 'cerisier-general',
  
  // Ou des modèles spécifiques
  'cerisier-kanzan': 'cerisier-kanzan',  // Modèle dédié
  
  // Tous les érables utilisent le même
  'erable-japon': 'erable-general',
  'erable-champetre': 'erable-general',
};
```

---

## 🔄 CONVERSION DE FORMATS

### Blender (.blend) → GLB

**Via Blender ligne de commande** :
```bash
blender mon-arbre.blend --background --python-expr "import bpy; bpy.ops.export_scene.gltf(filepath='output.glb', export_format='GLB')" --quit
```

**Via l'interface web** :
- Upload le .blend
- Conversion automatique si Blender installé

### OBJ (.obj) → GLB

**Via Python** :
```bash
python convert_to_glb.py
```

**Via l'interface web** :
- Upload le .obj (+ .mtl si présent)
- Conversion automatique

### FBX (.fbx) → GLB

**Via fbx2gltf** :
```bash
npm install -g fbx2gltf
fbx2gltf input.fbx output.glb
```

---

## 📊 RÉSUMÉ DES OPTIONS

| Format | Taille | Conversion | Outil |
|--------|--------|------------|-------|
| **.blend** | 100 MB | Blender CLI | Interface web OU Blender |
| **.obj** | 30 MB | Python trimesh | Interface web OU Python |
| **.fbx** | 20 MB | fbx2gltf | Interface web OU npm |
| **.glb** | 10 MB | Aucune | Copie directe ✅ |

---

## 🎯 RECOMMANDATION

### Workflow Idéal

1. **Télécharger** modèles depuis Sketchfab/Poly Haven (format GLB si possible)
2. **Ou télécharger** en .blend/.obj/.fbx et convertir
3. **Nommer** par type : `cerisier-general.glb`, `erable-japon.glb`
4. **Utiliser** un même modèle pour plusieurs variétés

### Exemple Pratique

```
Télécharger : cherry-blossom.glb depuis Sketchfab
↓
Renommer : cerisier-general.glb
↓
Placer : client/public/models/cerisier/
↓
Mapper : Kanzan, Accolade, Sunset → cerisier-general
↓
✅ 1 modèle pour 3+ arbres !
```

---

## 🛠️ DÉPANNAGE

### Le serveur ne démarre pas

```bash
# Installer les dépendances
npm install express multer cors
```

### Blender non trouvé

Installer Blender : https://www.blender.org/download/
Ou convertir avec l'outil en ligne : https://products.aspose.app/3d/conversion/blend-to-glb

### Erreur Python

```bash
pip install trimesh[easy]
```

---

## 📚 LIENS UTILES

- **Interface Upload** : `admin/upload-model.html`
- **Serveur API** : `admin/server-api.js`
- **Script Python** : `convert_to_glb.py`
- **Configuration** : `client/src/config/modeles3D.js`

---

**Créé le 20/10/2025 - Système flexible et évolutif** 🌳✨
