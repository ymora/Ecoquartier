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

## 📸 Compléter les Images (5 minutes)

### **État actuel : 17/54 images (31%)**

### **Workflow** :

```bash
# 1. Copier PROMPT_CHATGPT_TROUVER_URLS.txt dans ChatGPT
# 2. Copier images_completes.json dans le prompt
# 3. ChatGPT cherche les 37 URLs manquantes (vraies photos)
# 4. Copier le JSON retourné → images_completes.json
# 5. Lancer le script
python telecharger_toutes_images.py

# ✅ 54/54 images téléchargées !
```

Voir détails : `GUIDE_IMAGES.md`

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

Voir détails : `docs/DEPLOIEMENT.md`

## 📚 Documentation

- **[GUIDE_IMAGES.md](GUIDE_IMAGES.md)** - Système d'images complet
- **[docs/DEPLOIEMENT.md](docs/DEPLOIEMENT.md)** - Déploiement Render
- **[docs/CHANGELOG.md](docs/CHANGELOG.md)** - Historique versions
- **[docs/VALIDATION_SOURCES.md](docs/VALIDATION_SOURCES.md)** - Fiabilité données

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
