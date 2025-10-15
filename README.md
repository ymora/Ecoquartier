# 🌳 Les Haies de l'Écocartier de Bessancourt

Application web interactive pour découvrir les arbres et arbustes de l'écocartier de Bessancourt avec informations botaniques détaillées, réglementation et conseils d'entretien.

## 🎯 Fonctionnalités

- ✅ **9 espèces documentées** (Prunus, Noisetier, Fusain, Troène, Osmanthe, Cornouiller, Seringat)
- ✅ **Mode classique** : Fiches détaillées avec 7 onglets
- ✅ **Mode comparaison** : Comparer 2-3 plantes côte à côte
- ✅ **Galerie photos** : 6 types par espèce (vue, bourgeons, fleurs, fruits, automne, hiver)
- ✅ **Réglementation** : Distances légales, système racinaire, risques
- ✅ **Badges fiabilité** : Niveau de confiance des données
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

Voir détails : **[docs/GUIDE_ADMIN.md](docs/GUIDE_ADMIN.md)**

### **Méthode 2 : Script Python** (Téléchargement massif)

```bash
# ChatGPT trouve URLs → images_completes.json → Script
python telecharger_toutes_images.py
```

Voir détails : **[docs/OUTILS.md](docs/OUTILS.md)**

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

Voir détails : **[docs/DEPLOIEMENT.md](docs/DEPLOIEMENT.md)**

## 📚 Documentation

### **Guides d'utilisation**
- **[docs/GUIDE_ADMIN.md](docs/GUIDE_ADMIN.md)** - Interface admin complète
- **[docs/GUIDE_RAPIDE_ADMIN.md](docs/GUIDE_RAPIDE_ADMIN.md)** - Référence rapide
- **[docs/OUTILS.md](docs/OUTILS.md)** - Tous les outils disponibles

### **Documentation technique**
- **[docs/DEPLOIEMENT.md](docs/DEPLOIEMENT.md)** - Déploiement Render
- **[docs/CHANGELOG.md](docs/CHANGELOG.md)** - Historique versions
- **[docs/VALIDATION_SOURCES.md](docs/VALIDATION_SOURCES.md)** - Fiabilité données
- **[docs/AUDIT_SECURITE.md](docs/AUDIT_SECURITE.md)** - Audit sécurité

## 🛠️ Technologies

- **Frontend** : React 18.3 + Vite 6.3
- **Styling** : CSS3 moderne (thème clair)
- **Icons** : React Icons
- **Backend** : PHP (API images - optionnel)
- **Déploiement** : Render (CDN + HTTPS auto)

## 📊 Statistiques

```
Composants React   : 10
Fichiers données   : 3
Espèces           : 9
Images prévues    : 54 (6 par espèce)
Images actuelles  : 17
Critères/plante   : 50+
Onglets          : 7
```

## 📄 Licence

© 2025 Écocartier de Bessancourt. Tous droits réservés.

---

**Développé avec 💚 pour la biodiversité locale**
