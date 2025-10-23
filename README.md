# 🌳 Les Haies de l'Écocartier de Bessancourt

Application web de planification paysagère pour l'écoquartier de Bessancourt.

## 🎯 Fonctionnalités

- ✅ **12 espèces documentées** (6 arbres + 6 arbustes)
- ✅ **Fiches détaillées** avec 7 onglets complets
- ✅ **Mode comparaison** avec 20 critères
- ✅ **Planificateur 2D** avec validation temps réel
- ✅ **Vue 3D** immersive avec ombres et saisons
- ✅ **Simulation croissance** (0-20 ans)
- ✅ **Validation réglementaire** (Code Civil Art. 671)

## 🚀 Installation

```bash
cd client
npm install
npm run dev
```

→ http://localhost:5173

## 🏗️ Architecture

**Stack** : React 18 + Vite 6 + Fabric.js (2D) + Three.js (3D)

**Structure** :
```
client/src/
├── components/     # Composants React (CanvasTerrain, CanvasTerrain3D)
├── hooks/         # Hooks personnalisés (useCanvasInit, useCanvasEvents)
├── utils/          # Utilitaires (validation, export/import)
└── data/           # Données des 12 espèces
```

## 📐 Système de Coordonnées

- **Échelle** : 40 pixels = 1 mètre
- **Dimensions** : 30m × 30m par défaut
- **Origine** : Centre pour objets (originX/Y: 'center')

## ✨ Planificateur 2D/3D

### Vue 2D
- Canvas interactif avec zoom/pan
- Ajout objets : maisons, terrasses, pavés, citernes, canalisations, clôtures
- Validation distances en temps réel
- Timeline 0-20 ans
- Ombres dynamiques selon saisons

### Vue 3D
- Rendu réaliste avec ombres
- Simulation croissance temporelle
- 4 saisons (hiver, printemps, été, automne)
- Rotation ombres selon heure du jour
- Mode déplacement objets en 3D

### Validation
**Distances vérifiées** :
- 🏠 Fondations : 5m minimum
- 🚰 Canalisations : 4m minimum
- ⚖️ Voisinage (Code Civil) : 2m minimum
- 💧 Citernes : 6m minimum
- 🌳 Entre arbres : 5m minimum

**Paliers** :
- 🟢 Vert (100%) : Conforme
- 🟡 Jaune (80-99%) : Attention
- 🟠 Orange (50-79%) : Respect minimum
- 🔴 Rouge (<50%) : Non conforme

## 📸 Gestion Images

**Interface Admin** (recommandée) :
```bash
npm run admin
```
→ http://localhost:3001

Glisser-déposer images → Sélectionner espèce/type → Publier

## 🌐 Déploiement Render

1. dashboard.render.com
2. Sign Up with GitHub
3. New + → Blueprint
4. Connect "Ecoquartier"
5. Apply

→ Site en ligne en 3-5 min

## 📚 Documentation

- **Installation rapide** : Cette page
- **Guide admin** : `ADMIN_README.md`
- **Historique versions** : `docs/CHANGELOG.md`

## 📝 Contact

**Mairie de Bessancourt** : 01 30 40 44 47

---

**Version** : 2.5.0  
**Dernière mise à jour** : 23 octobre 2025  
**Statut** : ✅ Production Ready
