# 📁 Structure du Projet

## 🎯 ORGANISATION SIMPLIFIÉE

La documentation a été consolidée de **11 fichiers .md** → **3 fichiers essentiels**

---

## 📚 DOCUMENTATION RACINE

### **README.md** 
→ Vue d'ensemble du projet, installation, utilisation

### **DEPLOIEMENT.md** ⚡
→ **Guide complet déploiement Render en 7 minutes**
- Étapes Git/GitHub/Render
- Configuration automatique
- Dépannage
- Plans & coûts

**Remplace** :
- ~~GUIDE_DEPLOIEMENT_RENDER.md~~
- ~~ETAPES_DEPLOIEMENT.md~~
- ~~DEPLOIEMENT_MANUEL_RENDER.md~~

### **IMAGES.md** 📸
→ **Guide complet gestion des images**
- Solution ChatGPT + DALL-E (10 min)
- Script unifié `gerer_images.ps1`
- URLs manuelles (alternative)
- Nomenclature & structure
- Optimisation

**Remplace** :
- ~~GUIDE_TELECHARGEMENT.md~~
- ~~COMMENT_OBTENIR_URLS.md~~
- ~~PROBLEME_URLS.md~~

### **CHANGELOG.md**
→ Historique des versions et modifications

---

## 📂 DOSSIER docs/

Documentation technique détaillée :

### **VALIDATION_SOURCES.md**
→ Méthodologie de validation des données botaniques et légales
→ Niveaux de fiabilité (Haute/Moyenne/Basse)

### **COMPARAISON_MODES.md**
→ Analyse détaillée de la parité entre mode classique et comparaison
→ 50+ critères comparés

---

## 🔧 FICHIERS DE CONFIGURATION

### **render.yaml**
→ Configuration Render (déploiement automatique)

### **images_urls.json**
→ URLs des images à télécharger (pour script)

### **PROMPT_SIMPLE_CHATGPT.txt**
→ Prompt pour générer images avec ChatGPT/DALL-E

### **gerer_images.ps1**
→ Script PowerShell unifié (téléchargement/copie/renommage)

### **get_images.php**
→ API backend pour lister les images (optionnel)

---

## 📊 STRUCTURE COMPLÈTE

```
Haies/
│
├── 📄 README.md                        (Vue d'ensemble)
├── 📄 DEPLOIEMENT.md                   (Guide Render)
├── 📄 IMAGES.md                        (Guide images)
├── 📄 CHANGELOG.md                     (Historique)
│
├── 📂 docs/                            (Documentation technique)
│   ├── VALIDATION_SOURCES.md
│   ├── COMPARAISON_MODES.md
│   └── STRUCTURE_PROJET.md             (ce fichier)
│
├── 🔧 render.yaml                      (Config Render)
├── 🔧 images_urls.json                 (URLs images)
├── 🔧 gerer_images.ps1                 (Script images)
├── 🔧 PROMPT_SIMPLE_CHATGPT.txt       (Prompt DALL-E)
├── 🔧 get_images.php                   (API images)
├── 🔧 .gitignore
│
├── 📂 client/                          (Application React)
│   ├── public/
│   │   └── images/                     (Images des plantes)
│   ├── src/
│   │   ├── components/                 (10 composants React)
│   │   ├── data/                       (3 fichiers de données)
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── 📂 downloads/                       (Images temporaires)
├── 📂 images/                          (Images originales)
└── 📂 archive/                         (Anciens fichiers)
```

---

## 🎯 GUIDE RAPIDE

### **Pour déployer** :
→ Lire **DEPLOIEMENT.md**

### **Pour ajouter des images** :
→ Lire **IMAGES.md**

### **Pour comprendre la fiabilité des données** :
→ Lire **docs/VALIDATION_SOURCES.md**

### **Pour comparer les modes d'affichage** :
→ Lire **docs/COMPARAISON_MODES.md**

---

## 📈 AVANT / APRÈS

### ❌ Avant (11 fichiers .md)
```
README.md
DEPLOIEMENT.md
GUIDE_DEPLOIEMENT_RENDER.md     ← Redondant
ETAPES_DEPLOIEMENT.md           ← Redondant
DEPLOIEMENT_MANUEL_RENDER.md    ← Redondant
GUIDE_TELECHARGEMENT.md         ← Redondant
COMMENT_OBTENIR_URLS.md         ← Redondant
PROBLEME_URLS.md                ← Redondant
VALIDATION_SOURCES.md           ← Technique
COMPARAISON_MODES.md            ← Technique
CHANGELOG.md
```

### ✅ Après (3 + 2 fichiers .md)
```
README.md                       (Vue d'ensemble)
DEPLOIEMENT.md                  (Consolidé × 3)
IMAGES.md                       (Consolidé × 3)
CHANGELOG.md                    (Historique)

docs/
├── VALIDATION_SOURCES.md       (Technique)
├── COMPARAISON_MODES.md        (Technique)
└── STRUCTURE_PROJET.md         (Ce fichier)
```

**Réduction de 45% des fichiers !** 📉

---

## ✅ AVANTAGES

1. **Moins de confusion** - 3 guides clairs au lieu de 11
2. **Pas de redondance** - Chaque info à un seul endroit
3. **Organisation logique** - Guides essentiels en racine, technique dans docs/
4. **Navigation facile** - README pointe vers tout
5. **Maintenance simple** - Moins de fichiers à maintenir

---

**✅ Documentation consolidée et organisée !**

