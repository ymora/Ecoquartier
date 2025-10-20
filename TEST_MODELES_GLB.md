# 🧪 Test des Modèles GLB

## ✅ MODÈLES ACTIVÉS

Les modèles 3D GLB sont maintenant **actifs** pour test :

| Arbre | Modèle GLB | Taille | Chargement |
|-------|------------|--------|------------|
| Cerisier Kanzan | cerisier-tree-1.glb | 12 MB | ~5-10s |
| Cerisier Accolade | cerisier-tree-1.glb | 12 MB | ~5-10s |
| Cerisier Sunset | cerisier-tree-2.glb | 12 MB | ~5-10s |
| Érable du Japon | cerisier-tree-3.glb | 12 MB | ~5-10s |

---

## 🎮 COMMENT TESTER

### Méthode 1 : Mode Planification 3D

1. **Ouvrir** : http://localhost:5173/
2. **Cliquer** : "Planification 3D" (bouton en haut)
3. **Sélectionner** : Cerisier du Japon Kanzan
4. **Cliquer** : Sur le terrain pour placer l'arbre
5. **Attendre** : 5-10 secondes (cercle vert de chargement)
6. ✨ **Observer** : Le modèle 3D réel apparaît !

### Méthode 2 : Console de Debug

Ouvrez la console (F12) pour voir les logs :
- `[3D] Chargement modèle: /models/cerisier/cerisier-tree-1.glb`
- `[3D] Modèle chargé avec succès`
- Ou `[3D] Erreur chargement, fallback vers procédural`

---

## 🔍 INDICATEURS DE CHARGEMENT

### Pendant le Chargement (5-10s)
```
┌─────────────┐
│   Cercle    │  ← Indicateur vert qui pulse
│    vert     │
│  chargement │
└─────────────┘
```

### Après Chargement Réussi
```
┌─────────────┐
│   Arbre 3D  │  ← Modèle GLB réel détaillé
│    réel     │     (tronc, branches, feuilles)
│   détaillé  │
└─────────────┘
```

### Si Échec (Fallback)
```
┌─────────────┐
│   Arbre 3D  │  ← Arbre procédural (300 fleurs)
│  procédural │     Toujours beau et rapide !
│  (normal)   │
└─────────────┘
```

---

## ⚠️ PROBLÈMES POSSIBLES

### 1. Le modèle ne s'affiche pas

**Causes** :
- Fichier GLB manquant ou mal placé
- Fichier trop lourd (timeout)
- Erreur de chargement

**Solution** :
- Vérifier : `client/public/models/cerisier/cerisier-tree-1.glb` existe
- Ouvrir console (F12) pour voir les erreurs
- Le fallback procédural s'active automatiquement

### 2. Chargement très lent

**Normal** : 12 MB par arbre = 5-10 secondes

**Solutions** :
```bash
# Compresser avec Draco (12 MB → 2-3 MB)
npm install -g gltf-pipeline
gltf-pipeline -i cerisier-tree-1.glb -o cerisier-tree-1.glb -d

# Ou télécharger modèles légers depuis Sketchfab (< 5 MB)
```

### 3. Erreur dans la console

**Si vous voyez** :
- `404 (Not Found)` → Vérifier le chemin du fichier
- `Failed to fetch` → Serveur dev pas lancé ?
- `Out of memory` → Fichier trop gros, utiliser fallback

---

## 🎯 COMMANDES UTILES

### Vérifier les Fichiers GLB

```bash
# Lister les fichiers
ls client/public/models/cerisier/

# Devrait afficher:
# cerisier-tree-1.glb (12 MB)
# cerisier-tree-2.glb (12 MB)
# cerisier-tree-3.glb (12 MB)
```

### Tester le Chargement

Ouvrez directement le fichier GLB dans le navigateur :
```
http://localhost:5173/models/cerisier/cerisier-tree-1.glb
```

Si le téléchargement démarre → Fichier OK ✅

### Compresser pour Accélérer

```bash
cd client/public/models/cerisier
gltf-pipeline -i cerisier-tree-1.glb -o cerisier-tree-1-compressed.glb -d
# Puis renommer compressed en original
```

---

## 💡 RECOMMANDATION

**Pour l'instant** :
- Les modèles sont lourds (12 MB chacun)
- Chargement lent mais **fonctionne**
- Fallback automatique en cas d'erreur

**Prochaine étape** :
1. Compresser avec Draco (-75%)
2. Ou télécharger modèles légers Sketchfab (< 2 MB)
3. Performance instantanée !

---

## 🎉 ÉTAT ACTUEL

| Élément | Status |
|---------|--------|
| Modèles GLB présents | ✅ 3 fichiers |
| Configuration activée | ✅ Oui |
| Fallback configuré | ✅ Oui |
| Build réussi | ✅ Oui |
| Prêt à tester | ✅ Oui |

---

**Lancez le site et ajoutez un Cerisier Kanzan en 3D !**  
**Le modèle GLB devrait se charger (avec patience) !** 🌳✨

