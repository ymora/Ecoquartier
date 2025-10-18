# 📚 Documentation du Projet

Documentation complète du projet "Les Haies de l'Écocartier de Bessancourt".

**9 fichiers essentiels, organisés et à jour.**

---

## 🚀 Démarrage Rapide

| Besoin | Document | ⏱️ Temps |
|--------|----------|----------|
| **Utiliser le site** | [GUIDE_UTILISATION_COMPLET.md](GUIDE_UTILISATION_COMPLET.md) | 5 min |
| **Gérer les images** | [GUIDE_ADMIN.md](GUIDE_ADMIN.md) | 3 min |
| **Ajouter une espèce** | [GUIDE_AJOUT_NOUVEL_ARBRE.md](GUIDE_AJOUT_NOUVEL_ARBRE.md) | 10 min |
| **Comprendre le code** | [ARCHITECTURE.md](ARCHITECTURE.md) | 15 min |
| **Déployer** | [DEPLOIEMENT.md](DEPLOIEMENT.md) | 5 min |

---

## 📖 Documentation Complète

### 🎯 Pour les Utilisateurs

**[GUIDE_UTILISATION_COMPLET.md](GUIDE_UTILISATION_COMPLET.md)**  
Comment utiliser le site web : fiches plantes, comparateur, planificateur de terrain
- Navigation et filtres
- Galerie photos
- Mode comparaison (20 critères)
- Planificateur interactif

---

### 👨‍💼 Pour les Administrateurs

**[GUIDE_ADMIN.md](GUIDE_ADMIN.md)**  
Interface d'administration complète pour gérer les images
- Upload avec glisser-déposer
- Numérotation automatique +1
- Permutation et réorganisation
- Synchronisation Git automatique
- Scripts disponibles

**[GUIDE_AJOUT_NOUVEL_ARBRE.md](GUIDE_AJOUT_NOUVEL_ARBRE.md)**  
Procédure complète pour ajouter une nouvelle espèce
- Structure des données (1 seul fichier à modifier)
- Checklist complète
- Ajout des images
- Tests et validation

---

### 💻 Pour les Développeurs

**[ARCHITECTURE.md](ARCHITECTURE.md)**  
Architecture technique complète du projet
- Structure des fichiers
- Architecture des données centralisées
- CanvasTerrain.jsx (3500+ lignes)
- Configuration centralisée
- Utilitaires modulaires
- Notes techniques (erreurs 404, sécurité)

**[PLANIFICATEUR.md](PLANIFICATEUR.md)**  
Documentation du planificateur de terrain
- Fonctionnalités actuelles
- Validation réglementaire automatique
- Auto-placement intelligent
- Import de plan de fond
- Améliorations futures (V2)

**[VALIDATION_SOURCES.md](VALIDATION_SOURCES.md)**  
Sources et fiabilité des données botaniques
- Méthodologie
- Sources officielles
- Niveaux de confiance
- Badges de fiabilité

---

### 🚀 Déploiement

**[DEPLOIEMENT.md](DEPLOIEMENT.md)**  
Déploiement sur Render.com
- Configuration render.yaml
- Build automatique
- Variables d'environnement
- Troubleshooting

---

### 📋 Historique

**[CHANGELOG.md](CHANGELOG.md)**  
Historique des versions et changements
- Ajouts d'espèces
- Refactoring majeurs
- Nouvelles fonctionnalités
- Corrections de bugs

---

## 📂 Structure du Projet

```
Haies/
├── client/                    # Application React
│   ├── src/
│   │   ├── components/        # 14 composants React
│   │   ├── data/              # arbustesData.js (centralisé)
│   │   ├── config/            # planificateurConfig.js
│   │   └── utils/             # 8 utilitaires modulaires
│   ├── public/
│   │   └── images/            # Images des 12 espèces
│   └── dist/                  # Build de production
│
├── admin/                     # Interface d'administration
│   ├── server.js              # Backend Node.js
│   ├── admin.js               # Frontend admin
│   └── index.html             # Interface web
│
├── docs/                      # Documentation (9 fichiers)
│   ├── INDEX.md               # Ce fichier
│   ├── ARCHITECTURE.md        # Architecture technique
│   ├── PLANIFICATEUR.md       # Planificateur de terrain
│   ├── GUIDE_ADMIN.md         # Guide administration
│   ├── GUIDE_AJOUT_NOUVEL_ARBRE.md
│   ├── GUIDE_UTILISATION_COMPLET.md
│   ├── DEPLOIEMENT.md
│   ├── VALIDATION_SOURCES.md
│   └── CHANGELOG.md
│
└── README.md                  # Fichier principal du projet
```

---

## 🎯 Navigation par Rôle

### 👤 Utilisateur
1. [Guide d'utilisation](GUIDE_UTILISATION_COMPLET.md) - Découvrir toutes les fonctionnalités
2. [README principal](../README.md) - Vue d'ensemble du projet

### 👨‍💼 Administrateur
1. [Guide Admin](GUIDE_ADMIN.md) - Gérer les images (⭐ principal)
2. [Ajouter un arbre](GUIDE_AJOUT_NOUVEL_ARBRE.md) - Nouvelle espèce
3. [Déploiement](DEPLOIEMENT.md) - Publier les modifications

### 💻 Développeur
1. [Architecture](ARCHITECTURE.md) - Comprendre le code (⭐ essentiel)
2. [Planificateur](PLANIFICATEUR.md) - Fonctionnalités du canvas
3. [Validation sources](VALIDATION_SOURCES.md) - Fiabilité des données
4. [Changelog](CHANGELOG.md) - Historique des modifications

---

## 🔍 Recherche par Mot-Clé

**Images** → [GUIDE_ADMIN.md](GUIDE_ADMIN.md)  
**Upload** → [GUIDE_ADMIN.md](GUIDE_ADMIN.md)  
**Nouvelle espèce** → [GUIDE_AJOUT_NOUVEL_ARBRE.md](GUIDE_AJOUT_NOUVEL_ARBRE.md)  
**Planificateur** → [PLANIFICATEUR.md](PLANIFICATEUR.md)  
**Canvas** → [ARCHITECTURE.md](ARCHITECTURE.md) + [PLANIFICATEUR.md](PLANIFICATEUR.md)  
**Données centralisées** → [ARCHITECTURE.md](ARCHITECTURE.md)  
**Erreurs 404** → [ARCHITECTURE.md](ARCHITECTURE.md#notes-techniques-importantes)  
**Sécurité** → [ARCHITECTURE.md](ARCHITECTURE.md#sécurité)  
**Render** → [DEPLOIEMENT.md](DEPLOIEMENT.md)  
**Import plan** → [PLANIFICATEUR.md](PLANIFICATEUR.md#import-de-plan-de-fond)  
**Comparateur** → [GUIDE_UTILISATION_COMPLET.md](GUIDE_UTILISATION_COMPLET.md)  
**Synchronisation** → [GUIDE_ADMIN.md](GUIDE_ADMIN.md#synchronisation-automatique)

---

## 📊 Statistiques

| Métrique | Valeur |
|----------|--------|
| **Espèces** | 12 (6 arbres + 6 arbustes) |
| **Composants React** | 14 |
| **Lignes de code** | ~10 000+ |
| **Fichiers de données** | 1 (centralisé) |
| **Critères comparaison** | 20 |
| **Fichiers documentation** | 9 (optimisé) |
| **Build production** | ~163 kB gzippé |

---

## 💡 Technologies

- **Frontend** : React 18.3 + Vite 6.3
- **Planificateur** : Fabric.js (canvas interactif)
- **Styling** : CSS3 moderne
- **Backend Admin** : Node.js + Express
- **Déploiement** : Render.com (CDN + HTTPS auto)

---

## 🤝 Contribution

### Ajouter une Image
1. `npm run admin`
2. Glisser-déposer image
3. Sélectionner espèce + type
4. Cliquer 🚀
5. ✅ Push Git automatique

### Ajouter une Espèce
1. Lire [GUIDE_AJOUT_NOUVEL_ARBRE.md](GUIDE_AJOUT_NOUVEL_ARBRE.md)
2. Modifier `client/src/data/arbustesData.js` (1 seul fichier)
3. Ajouter images dans `client/public/images/{id}/`
4. Build & Test
5. Commit & Push

### Modifier le Code
1. Lire [ARCHITECTURE.md](ARCHITECTURE.md)
2. Modifier fichiers appropriés
3. Tester localement (`npm run dev`)
4. Commit & Push → Render redéploie automatiquement

---

## 📞 Contact

**Pour les réglementations de plantation :**  
Mairie de Bessancourt : **01 30 40 44 47**

---

## ✨ Optimisation Documentation

Cette documentation a été **optimisée et consolidée** :
- ❌ **Avant** : 34 fichiers dispersés avec redondances
- ✅ **Après** : 9 fichiers essentiels, organisés et à jour
- 🎯 **Réduction** : -73% de fichiers
- ✅ **Zéro redondance** : Chaque information à un seul endroit
- ✅ **Navigation claire** : Index structuré par rôle et besoin

---

**Développé avec 💚 pour la biodiversité locale**
