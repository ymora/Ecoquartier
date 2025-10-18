# 📚 Index de la Documentation

Documentation complète du projet "Les Haies de l'Écocartier de Bessancourt".

**Dernière mise à jour** : 18 octobre 2025

---

## 🚀 Démarrage Rapide

| Document | Description | Pour qui ? |
|----------|-------------|------------|
| **[README.md](../README.md)** | Vue d'ensemble du projet | 👥 Tous |
| **[GUIDE_UTILISATION_COMPLET.md](GUIDE_UTILISATION_COMPLET.md)** | Guide utilisateur complet | 👤 Utilisateurs |
| **[GUIDE_RAPIDE_ADMIN.md](GUIDE_RAPIDE_ADMIN.md)** | Référence rapide administration | 👨‍💼 Admins |
| **[DEPLOIEMENT.md](DEPLOIEMENT.md)** | Déploiement sur Render | 🚀 DevOps |

---

## 📖 Guides Utilisateur

### Pour les Utilisateurs du Site

- **[GUIDE_UTILISATION_COMPLET.md](GUIDE_UTILISATION_COMPLET.md)**  
  Guide complet des fonctionnalités : fiches plantes, comparateur, planificateur de terrain

### Pour les Administrateurs

- **[GUIDE_ADMIN.md](GUIDE_ADMIN.md)**  
  Interface d'administration complète : ajout d'images, gestion des espèces, publication
  
- **[GUIDE_RAPIDE_ADMIN.md](GUIDE_RAPIDE_ADMIN.md)**  
  Référence rapide pour les actions courantes

- **[GUIDE_AJOUT_NOUVEL_ARBRE.md](GUIDE_AJOUT_NOUVEL_ARBRE.md)**  
  Procédure détaillée pour ajouter une nouvelle espèce

---

## 🏗️ Documentation Technique

### Architecture

- **[ARCHITECTURE.md](ARCHITECTURE.md)**  
  Architecture complète du code : structure des fichiers, données centralisées, CanvasTerrain.jsx
  
- **[PLANIFICATEUR.md](PLANIFICATEUR.md)**  
  Fonctionnalités du planificateur de terrain : validation, auto-placement, améliorations futures

### Déploiement et Synchronisation

- **[DEPLOIEMENT.md](DEPLOIEMENT.md)**  
  Procédure de déploiement sur Render.com avec build automatique
  
- **[SYNCHRONISATION_ADMIN_SITE.md](SYNCHRONISATION_ADMIN_SITE.md)**  
  Synchronisation entre l'interface admin et le site

### Sécurité et Qualité

- **[AUDIT_SECURITE.md](AUDIT_SECURITE.md)**  
  Audit de sécurité : validation des entrées, protection XSS, bonnes pratiques
  
- **[VALIDATION_SOURCES.md](VALIDATION_SOURCES.md)**  
  Sources et fiabilité des données botaniques

- **[ERREURS_404_NORMALES.md](ERREURS_404_NORMALES.md)**  
  Pourquoi les erreurs 404 dans la console sont normales et attendues

---

## 🛠️ Outils et Fonctionnalités

- **[OUTILS.md](OUTILS.md)**  
  Tous les outils disponibles : scripts, utilitaires, helpers

- **[IMPORT_PLAN_FOND.md](IMPORT_PLAN_FOND.md)**  
  Comment importer un plan existant (Kazaplan) dans le planificateur

---

## 📋 Suivi du Projet

- **[CHANGELOG.md](CHANGELOG.md)**  
  Historique des changements et versions du projet

---

## 📂 Structure du Projet

```
Haies/
├── client/                 # Application React
│   ├── src/
│   │   ├── components/     # Composants React (14 fichiers)
│   │   ├── data/           # Données centralisées (arbustesData.js)
│   │   ├── config/         # Configuration (planificateurConfig.js)
│   │   └── utils/          # Utilitaires (8 fichiers)
│   ├── public/
│   │   └── images/         # Images des plantes
│   └── dist/               # Build de production
├── admin/                  # Interface d'administration
│   ├── admin.js            # Backend Node.js
│   └── index.html          # Interface web
├── docs/                   # Documentation (vous êtes ici)
└── README.md               # Fichier README principal
```

---

## 🎯 Navigation par Besoin

### "Je veux utiliser le site"
→ [GUIDE_UTILISATION_COMPLET.md](GUIDE_UTILISATION_COMPLET.md)

### "Je veux ajouter des images"
→ [GUIDE_ADMIN.md](GUIDE_ADMIN.md)

### "Je veux ajouter une espèce"
→ [GUIDE_AJOUT_NOUVEL_ARBRE.md](GUIDE_AJOUT_NOUVEL_ARBRE.md)

### "Je veux comprendre le code"
→ [ARCHITECTURE.md](ARCHITECTURE.md)

### "Je veux déployer le site"
→ [DEPLOIEMENT.md](DEPLOIEMENT.md)

### "Je veux importer mon plan de terrain"
→ [IMPORT_PLAN_FOND.md](IMPORT_PLAN_FOND.md)

### "Je vois des erreurs 404 dans la console"
→ [ERREURS_404_NORMALES.md](ERREURS_404_NORMALES.md) (c'est normal !)

---

## 📊 Statistiques du Projet

| Métrique | Valeur |
|----------|--------|
| **Espèces documentées** | 12 (6 arbres + 6 arbustes) |
| **Composants React** | 14 |
| **Lignes de code** | ~10 000+ |
| **Fichiers de données** | 1 (centralisé) |
| **Images prévues** | 72 (6 par espèce) |
| **Critères de comparaison** | 20 |
| **Documentation** | 15 fichiers |

---

## 💡 Technologies Utilisées

- **Frontend** : React 18.3 + Vite 6.3
- **Planificateur** : Fabric.js (canvas interactif)
- **Styling** : CSS3 moderne
- **Icons** : React Icons
- **Backend Admin** : Node.js + Express
- **Déploiement** : Render.com (CDN + HTTPS auto)

---

## 🤝 Contribution

Pour toute modification :
1. Lire la documentation pertinente ci-dessus
2. Suivre les guides ([GUIDE_AJOUT_NOUVEL_ARBRE.md](GUIDE_AJOUT_NOUVEL_ARBRE.md) ou [GUIDE_ADMIN.md](GUIDE_ADMIN.md))
3. Tester localement
4. Commit + Push (déploiement automatique sur Render)

---

## 📞 Contact

Pour toute question sur les réglementations de plantation :  
**Mairie de Bessancourt** : 01 30 40 44 47

---

**Développé avec 💚 pour la biodiversité locale**
