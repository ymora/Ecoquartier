# 🌳 Les Haies de l'Écocartier de Bessancourt

Application web interactive pour découvrir les arbres et arbustes de l'écocartier de Bessancourt avec informations botaniques détaillées, réglementation et conseils d'entretien.

## 🎯 Fonctionnalités

- ✅ **12 espèces documentées** - **6 arbres** (Prunus Kanzan, Accolade, Sunset Boulevard, Arbre de Judée, Érable champêtre, Érable du Japon) + **6 arbustes** (Noisetier, Fusain, Troène, Osmanthe, Cornouiller, Seringat)
- ✅ **Mode classique** : Fiches détaillées avec 7 onglets complets
- ✅ **Mode comparaison** : Comparer 2+ plantes avec **20 critères** (distances, racines, fertilisation, allergies, etc.)
- ✅ **Planificateur 2D** : Canvas interactif avec validation temps réel
- ✅ **Vue 3D** ⭐ NOUVEAU ! : Visualisation 3D avec hauteurs, profondeurs, racines sous terre
- ✅ **Galerie photos** : 6-8 types par espèce (vue, bourgeons, fleurs, fruits, feuilles, tronc, automne, hiver)
- ✅ **Réglementation complète** : Distances légales (Code Civil), système racinaire, risques infrastructures
- ✅ **Données centralisées** : Architecture professionnelle (1 seul fichier de données)
- ✅ **Badges fiabilité** : Niveau de confiance des données affiché
- ✅ **Responsive** : Adapté mobile/tablette/desktop

## 🚀 Installation Locale

```bash
# Cloner le projet
git clone https://github.com/ymora/Ecoquartier.git
cd Ecoquartier

# Installer et lancer
cd client
npm install
npm run dev
```

→ Ouvrir http://localhost:5173

## 📸 Gestion des Images

### **État actuel : 17/54 images (31%)**

### **Méthode 1 : Interface Admin** ⭐ (Recommandée - Nouveau !)

```bash
# 1. Lancer l'interface admin
npm run admin

# 2. Ouvrir http://localhost:3001

# 3. Glisser-déposer vos images
# 4. Sélectionner espèce + type pour chaque image
# 5. Valider
# 6. Publier → Git push automatique !

✅ 30 secondes par image !
```

Voir détails : **[docs/GUIDES.md](docs/GUIDES.md)** section "Guide Admin"

### **Méthode 2 : Script Python** (Téléchargement massif)

```bash
# ChatGPT trouve URLs → images_completes.json → Script
python telecharger_toutes_images.py
```

Voir détails : **[docs/GUIDES.md](docs/GUIDES.md)** section "Guide Développeur"

## 🌐 Déploiement sur Render

```bash
# Le code est déjà sur GitHub : https://github.com/ymora/Ecoquartier

# Sur Render :
1. dashboard.render.com
2. Sign Up with GitHub
3. New + → Blueprint
4. Connect "Ecoquartier"
5. Apply (détecte render.yaml auto)
6. Attendre 3-5 min

✅ Site en ligne !
```

Voir détails : **[docs/GUIDES.md](docs/GUIDES.md)** section "Déploiement"

## 📚 Documentation

**📖 [Index complet de la documentation](docs/INDEX.md)** - 5 fichiers consolidés et à jour

### **Accès rapide**

- 📖 **[INDEX.md](docs/INDEX.md)** : Point d'entrée documentation
- 📝 **[CHANGELOG.md](docs/CHANGELOG.md)** : Historique des versions
- 🏗️ **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** : Architecture technique
- ⚙️ **[FONCTIONNALITES.md](docs/FONCTIONNALITES.md)** : Planificateur 2D/3D, Validation
- 📚 **[GUIDES.md](docs/GUIDES.md)** : Guides utilisateur/admin/développeur

## 🛠️ Technologies

- **Frontend** : React 18.3 + Vite 6.3
- **3D Engine** : React Three Fiber + Three.js ⭐ NOUVEAU !
- **Styling** : CSS3 moderne (thème clair)
- **Icons** : React Icons
- **Canvas 2D** : Fabric.js
- **Backend Admin** : Node.js + Express
- **Déploiement** : Render (CDN + HTTPS auto)

## 📊 Statistiques

```
Composants React   : 25+ (dont 9 composants 3D ⭐)
Fichiers données   : 1 (centralisé)
Espèces           : 12
Composants 3D     : 9 (Arbre, Maison, Sol, etc.)
Images prévues    : 72 (6 par espèce)
Critères/plante   : 50+
Onglets          : 7
Modes vue         : 6 (Normal, Comparaison, 2D, 3D + 4 vues 3D)
```

## 📄 Licence

© 2025 Écocartier de Bessancourt. Tous droits réservés.

---

**Développé avec 💚 pour la biodiversité locale**
