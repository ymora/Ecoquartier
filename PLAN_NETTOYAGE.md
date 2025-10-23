# 🧹 PLAN DE NETTOYAGE - Structure Projet

## ❌ PROBLÈMES IDENTIFIÉS

### 1. Doublons Images
- **`images/` (racine)** : 60 images JPG - DOUBLON avec `client/public/images/`
- **Action** : Supprimer `images/` racine (garder uniquement `client/public/images/`)

### 2. Doublon Répertoire `client/client/`
- **`client/client/`** : Sous-répertoire erroné
- **Contenu** : Modèles cerisier/erable/magnolia + utils/validation
- **Action** : Supprimer `client/client/` complet

### 3. Dossier `upload/` Inutilisé
- **`upload/cerisier/`** : Fichiers OBJ/MTL non convertis
- **État** : Modèles déjà convertis en GLB dans `client/public/models/cerisier/`
- **Action** : Supprimer `upload/` complet

### 4. Scripts Obsolètes
- **`get_images.php`** : Non utilisé (pas de référence dans le code)
- **`convert_to_glb.py`** : Utilisé uniquement dans admin (garder admin/server-api.js uniquement)
- **Action** : Supprimer ces fichiers

## ✅ STRUCTURE PROPRE (RECOMMANDÉE)

```
racine/
├── README.md                 # Documentation principale
├── ADMIN_README.md           # Guide admin
├── render.yaml               # Config déploiement
├── package.json              # Dépendances racine
│
├── admin/                    # Interface admin upload
│   ├── server.js
│   ├── server-api.js
│   ├── index.html
│   ├── models.html
│   ├── admin.js
│   ├── admin.css
│   ├── models.js
│   ├── upload-model.html
│   └── upload-model.js
│
├── client/                   # Application React principale
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   │   ├── images/          ✅ SEUL emplacement images
│   │   ├── models/          ✅ Modèles 3D GLB
│   │   └── images.json
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── utils/
│       ├── config/
│       └── data/
│
└── docs/
    └── CHANGELOG.md         # Historique versions
```

## 🗑️ ÉLÉMENTS À SUPPRIMER

1. ❌ `images/` (racine) - doublon
2. ❌ `client/client/` - doublon erroné
3. ❌ `upload/` - fichiers OBJ inutilisés
4. ❌ `get_images.php` - script obsolète
5. ❌ `convert_to_glb.py` - script obsolète

**Total** : ~70 MB d'espace libéré (images doublons)

