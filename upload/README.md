# 📁 Dossier Upload - Modèles 3D Sources

Ce dossier contient les fichiers sources (OBJ, MTL, blend) organisés par type d'arbre.

## 📂 Structure

```
upload/
├── cerisier/          ← Cerisiers japonais, Prunus
│   ├── tree-1.obj
│   ├── tree-1.mtl
│   ├── tree-2.obj
│   ├── tree-2.mtl
│   ├── tree-3.obj
│   └── tree-3.mtl
│
├── erable/            ← Érables du Japon, etc.
│   └── (à ajouter)
│
├── magnolia/          ← Magnolias
│   └── (à ajouter)
│
└── ...                ← Autres types d'arbres
```

## 🚀 Utilisation

### Ajouter un nouveau type d'arbre

1. **Créer un dossier** pour le type d'arbre :
   ```bash
   mkdir upload/erable
   ```

2. **Ajouter vos fichiers** OBJ/MTL :
   ```
   upload/erable/
   ├── maple-1.obj
   ├── maple-1.mtl
   ├── maple-2.obj
   └── maple-2.mtl
   ```

3. **Lancer la conversion** :
   ```bash
   python convert_to_glb.py
   ```

4. **Résultat** : Fichiers GLB créés automatiquement :
   ```
   client/public/models/arbres/
   ├── erable-maple-1.glb
   └── erable-maple-2.glb
   ```

### Convention de Nommage

Le script crée automatiquement les noms selon le pattern :
```
upload/{categorie}/{nom}.obj  →  {categorie}-{nom}.glb
```

**Exemples** :
- `upload/cerisier/tree-1.obj` → `cerisier-tree-1.glb`
- `upload/erable/maple-1.obj` → `erable-maple-1.glb`
- `upload/magnolia/flower-1.obj` → `magnolia-flower-1.glb`

## ✅ Fichiers Actuels

### Cerisiers (3 modèles)
- ✅ `cerisier/tree-1.obj` (31 MB) → `cerisier-tree-1.glb` (12 MB)
- ✅ `cerisier/tree-2.obj` (31 MB) → `cerisier-tree-2.glb` (12 MB)
- ✅ `cerisier/tree-3.obj` (31 MB) → `cerisier-tree-3.glb` (12 MB)

**Total** : 93 MB (OBJ) → 36 MB (GLB) = **-61%**

## 📝 Configuration

Après conversion, configurer dans `client/src/config/modeles3D.js` :

```javascript
// 1. Ajouter le modèle
'erable-maple-1': {
  path: '/models/arbres/erable-maple-1.glb',
  type: 'glb',
  scale: 0.5,
  rotation: [0, 0, 0],
  hauteurReelle: 8,
  nom: 'Érable du Japon'
}

// 2. Mapper à un arbre
export const ARBRE_TO_MODEL = {
  'erable-japon': 'erable-maple-1',
  // ...
};
```

## 🔄 Workflow Complet

```bash
# 1. Ajouter fichiers sources
upload/erable/maple-1.obj
upload/erable/maple-1.mtl

# 2. Convertir
python convert_to_glb.py

# 3. Vérifier la sortie
client/public/models/arbres/erable-maple-1.glb

# 4. Configurer
# Éditer client/src/config/modeles3D.js

# 5. Rebuild
cd client && npm run build
```

## 📊 Avantages de cette Structure

- ✅ **Organisation claire** par type d'arbre
- ✅ **Conversion automatique** de tous les sous-dossiers
- ✅ **Nommage cohérent** (catégorie-nom.glb)
- ✅ **Facile d'ajouter** de nouveaux modèles
- ✅ **Sources préservées** (OBJ/MTL gardés)

## 🎯 Prochains Ajouts Recommandés

Créer ces dossiers et ajouter vos modèles :
- `upload/erable/` - Érables (Acer palmatum, etc.)
- `upload/magnolia/` - Magnolias
- `upload/prunus/` - Autres Prunus
- `upload/arbustes/` - Arbustes (< 5m)

---

**Note** : Les fichiers sources (OBJ/MTL) restent dans ce dossier et ne sont PAS inclus dans le build final. Seuls les GLB optimisés sont utilisés par l'application.

