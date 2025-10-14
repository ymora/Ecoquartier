# 🌿 Les Haies de l'Écocartier de Bessancourt

Application web interactive présentant les arbustes et arbres pour haies champêtres de l'écocartier de Bessancourt.

## 🚀 Démarrage Rapide

### Installation

```bash
cd client
npm install
```

### Développement

```bash
npm run dev
```

Ouvrir [http://localhost:5173](http://localhost:5173)

### Build Production

```bash
npm run build
```

## ✨ Fonctionnalités

### 🌳 3 Arbres Documentés
- **Cerisier du Japon Kanzan** (Prunus serrulata 'Kanzan') - Floraison spectaculaire rose fuchsia
- **Cerisier Accolade** (Prunus × subhirtella 'Accolade') - Floraison précoce rose pâle
- **Cerisier Sunset Boulevard** (Prunus serrulata 'Sunset Boulevard') - Couleur unique rose saumon

### 🌿 6 Arbustes Documentés
- **Noisetier** (Corylus avellana)
- **Fusain d'Europe** (Euonymus europaeus) ⚠️ Très toxique
- **Troène commun** (Ligustrum vulgare)
- **Osmanthe de Burkwood** (Osmanthus × burkwoodii)
- **Cornouiller sanguin** (Cornus sanguinea)
- **Seringat** (Philadelphus coronarius)

### 📋 Informations Complètes
- Fiche botanique détaillée
- Calendrier annuel d'entretien (12 mois)
- Conseils de plantation et taille
- Galerie photos avec zoom
- Biodiversité et valeur écologique
- Avertissements de toxicité

### 🔍 Mode Comparaison
- Comparer 2-3 plantes côte à côte
- Tableau comparatif avec critères clés
- Photos défilantes pour chaque plante
- Aide au choix de la plante idéale

### 🎨 Interface
- Thème clair naturel
- Navigation déployable (Arbres/Arbustes)
- Galerie interactive (← → zoom)
- Responsive (mobile, tablette, desktop)
- Accessible (navigation clavier, WCAG)

## 📸 Ajouter des Images

### Méthode Automatique (Recommandé)

1. **Copier** le contenu de `PROMPT_SIMPLE_CHATGPT.txt`
2. **Coller** dans ChatGPT
3. **Télécharger** les images générées
4. **Placer** dans `downloads/`
5. **Lancer** : `.\copier_images.ps1`

Voir [GUIDE_TELECHARGEMENT.md](GUIDE_TELECHARGEMENT.md) pour plus de détails.

### Vérifier les Images

```bash
cd client
npm run check-images
```

## 📁 Structure

```
Haies/
├── client/           # Application React
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   └── ...
│   └── public/
│       └── images/
├── downloads/        # Images à traiter
├── images/           # Images source
└── render.yaml       # Config déploiement
```

## 🌐 Déploiement sur Render

Le fichier `render.yaml` configure automatiquement le déploiement.

1. Push sur GitHub/GitLab
2. Connecter sur [Render](https://render.com)
3. Déploiement automatique

Voir [DEPLOIEMENT.md](DEPLOIEMENT.md) pour le guide complet.

## 📊 Performance

- Build : 73 KB gzippé ⚡
- Lazy loading images
- Code splitting
- Score Lighthouse : 95+

## 🔒 Sécurité

- Validation PHP stricte
- Headers CSP, X-Frame-Options
- Protection Directory Traversal
- HTTPS obligatoire

## 🎯 Technologies

- **Frontend** : React 18 + Vite
- **Styling** : CSS3 (thème clair)
- **Icons** : React Icons
- **Backend** : PHP (API images - optionnel)
- **Déploiement** : Render

## 📝 Documentation

### 📚 Guides Essentiels
- **[DEPLOIEMENT.md](DEPLOIEMENT.md)** - Déployer sur Render en 7 minutes
- **[IMAGES.md](IMAGES.md)** - Ajouter/gérer les images (ChatGPT + Script)
- **[CHANGELOG.md](CHANGELOG.md)** - Historique des versions

### 🔧 Documentation Technique
- [docs/VALIDATION_SOURCES.md](docs/VALIDATION_SOURCES.md) - Fiabilité des données
- [docs/COMPARAISON_MODES.md](docs/COMPARAISON_MODES.md) - Parité des modes d'affichage

## 🐛 Scripts Utiles

```bash
# Vérifier les images manquantes
cd client
npm run check-images

# Gérer les images (tout-en-un)
.\gerer_images.ps1           # Détection automatique
.\gerer_images.ps1 -Force    # Remplacer images existantes
.\gerer_images.ps1 -Help     # Aide détaillée
```

## 📄 Licence

© 2025 Écocartier de Bessancourt. Tous droits réservés.

---

**Développé avec 💚 pour la biodiversité locale**
