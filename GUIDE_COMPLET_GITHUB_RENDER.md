# 🚀 Guide Complet : GitHub → Render

## 📋 PARTIE 1 : CONFIGURATION GITHUB

### **Après avoir créé le repository sur GitHub.com**

#### **1. Configuration Générale (Settings → General)**

```
Repository name: haies-bessancourt
Description: 🌳 Guide interactif des haies et arbres de l'écocartier 
             de Bessancourt : botaniques, réglementation, biodiversité 
             et conseils d'entretien.

☑️ Include in the home page: Oui
```

#### **2. Topics (Settings → General → Topics)**

Cliquer sur "Add topics" et ajouter :
```
botanique, biodiversite, haies, arbres, ecocartier, 
bessancourt, val-doise, react, vite, environnement
```

#### **3. Social Preview (Settings → General → Social preview)**

Optionnel mais recommandé :
- Upload une image 1280x640px
- Par exemple : Screenshot de votre application

#### **4. Features (Settings → General → Features)**

```
☑️ Issues          → Oui (pour signaler problèmes)
☑️ Projects        → Non (pas nécessaire)
☐ Preserve        → Non
☑️ Wikis          → Non
☑️ Discussions    → Optionnel
```

#### **5. Permissions (Settings → Actions → General)**

```
Actions permissions:
○ Disable actions
○ Allow all actions and reusable workflows  ← Recommandé
○ Allow [organization] actions and reusable workflows
```

#### **6. Branch Protection (Settings → Branches)**

Optionnel pour un projet solo, mais recommandé :
```
Add branch protection rule:
Branch name pattern: main

☑️ Require a pull request before merging
☐ Require status checks to pass
☐ Require conversation resolution
☐ Require linear history
```

---

## 💻 PARTIE 2 : PUSHER LE CODE

### **Commandes Git (dans PowerShell)**

```powershell
# 1. Aller dans votre dossier
cd "d:\Textes\Maison Bessancourt\Bouygues - LOTICIS\Haies"

# 2. Vérifier que Git est installé
git --version

# 3. Initialiser Git (si pas déjà fait)
git init

# 4. Configurer votre identité
git config user.name "Ecoquartier Bessancourt"
git config user.email "votre@email.com"

# 5. Vérifier le .gitignore
cat .gitignore

# 6. Créer la branche main
git branch -M main

# 7. Ajouter tous les fichiers
git add .

# 8. Vérifier ce qui va être commité
git status

# 9. Premier commit
git commit -m "Initial commit - Guide Haies Écocartier Bessancourt

- Application React + Vite
- 9 espèces documentées
- Informations botaniques détaillées
- Réglementation et distances légales
- Mode comparaison
- Système de fiabilité des données"

# 10. Lier au repository GitHub
# REMPLACER "Ecoquartier" et "haies-bessancourt" par vos vraies valeurs
git remote add origin https://github.com/Ecoquartier/haies-bessancourt.git

# 11. Vérifier la connexion
git remote -v

# 12. Pusher sur GitHub
git push -u origin main
```

### **Si demande d'authentification :**

**Option A : Personal Access Token (Recommandé)**
1. Aller sur https://github.com/settings/tokens
2. "Generate new token" → "Generate new token (classic)"
3. Note : "Haies Bessancourt Deploy"
4. Expiration : 90 days (ou No expiration)
5. Cocher : ✅ `repo` (Full control of private repositories)
6. "Generate token"
7. **COPIER LE TOKEN** (ne sera montré qu'une fois !)
8. Utiliser ce token comme **mot de passe** dans PowerShell

**Option B : GitHub CLI**
```powershell
# Installer GitHub CLI d'abord : winget install GitHub.cli
gh auth login
```

---

## 🌐 PARTIE 3 : CONNECTER À RENDER

### **Étape 1 : Vérifier que le code est sur GitHub**

1. Aller sur `https://github.com/Ecoquartier/haies-bessancourt`
2. Vérifier que tous vos fichiers sont bien là
3. Vérifier que `render.yaml` est présent

✅ **Si vous voyez votre code → OK, on continue !**

---

### **Étape 2 : Créer un compte Render**

1. Aller sur https://dashboard.render.com
2. Cliquer **"Get Started"**
3. **"Sign Up with GitHub"** ← IMPORTANT : Choisir cette option !
4. Autoriser Render à accéder à vos repositories
5. Vous arrivez sur le Dashboard

---

### **Étape 3 : Déployer avec Blueprint (AUTOMATIQUE)**

#### **3.1 Dans le Dashboard Render**

```
Dashboard → [New +] (bouton en haut à droite)
              ↓
    Sélectionner "Blueprint"
```

#### **3.2 Connecter le Repository**

```
┌─────────────────────────────────────┐
│ Connect a Git Repository            │
├─────────────────────────────────────┤
│                                     │
│ Search: [haies-bessancourt]         │
│                                     │
│ ○ Ecoquartier/haies-bessancourt     │
│                                     │
│   [Connect]  ← CLIQUER ICI          │
│                                     │
└─────────────────────────────────────┘
```

**Si vous ne voyez pas votre repository** :
- Cliquer "Configure Render on GitHub"
- Donner accès au repository
- Revenir sur Render

#### **3.3 Render détecte le Blueprint**

Render va lire votre `render.yaml` et afficher :

```
┌─────────────────────────────────────┐
│ ✅ Blueprint Detected               │
├─────────────────────────────────────┤
│                                     │
│ render.yaml found                   │
│                                     │
│ Services to create:                 │
│ • haies-bessancourt-frontend        │
│   Type: Static Site                 │
│   Build: cd client && npm install   │
│          && npm run build           │
│   Publish: client/dist              │
│   Node: 20.11.0                     │
│                                     │
│ [Apply]  ← CLIQUER ICI              │
│                                     │
└─────────────────────────────────────┘
```

#### **3.4 Cliquer "Apply"**

Render va maintenant :
1. ✅ Cloner votre repository depuis GitHub
2. ✅ Installer Node.js 20.11.0
3. ✅ Exécuter `cd client && npm install`
4. ✅ Exécuter `npm run build`
5. ✅ Déployer `client/dist` sur le CDN
6. ✅ Configurer HTTPS/SSL automatiquement

**Durée : 3-5 minutes** ⏱️

#### **3.5 Suivre le déploiement**

Vous verrez en temps réel :

```
┌─────────────────────────────────────┐
│ Deploying...                        │
├─────────────────────────────────────┤
│                                     │
│ ⏳ Cloning repository...            │
│ ✅ Installing Node.js 20.11.0...    │
│ ⏳ Running npm install...           │
│ ⏳ Building application...          │
│    vite v7.1.9 building...          │
│    ✓ 54 modules transformed         │
│ ✅ Build complete                   │
│ ⏳ Deploying to CDN...              │
│ ✅ Deploy succeeded!                │
│                                     │
│ Live at:                            │
│ https://haies-bessancourt-          │
│ frontend.onrender.com               │
│                                     │
│ [Open]  ← CLIQUER POUR VOIR         │
│                                     │
└─────────────────────────────────────┘
```

---

### **Étape 4 : Vérifier le déploiement**

#### **4.1 Ouvrir le site**

Cliquer sur "Open" ou aller sur l'URL fournie :
```
https://haies-bessancourt-frontend.onrender.com
```

#### **4.2 Checklist de vérification**

- [ ] Site charge
- [ ] Menu de navigation s'affiche
- [ ] Cliquer sur une plante → Détails s'affichent
- [ ] Bouton "Comparer" fonctionne
- [ ] Sélectionner 2 plantes → Comparaison s'affiche
- [ ] Images (message "à venir" si pas encore ajoutées)
- [ ] Disclaimer s'affiche au 1er chargement
- [ ] Responsive (réduire la fenêtre)
- [ ] HTTPS actif (cadenas vert 🔒)

✅ **Tout fonctionne ? BRAVO !** 🎉

---

## 🔄 PARTIE 4 : MISES À JOUR AUTOMATIQUES

### **Comment ça marche ?**

Render est maintenant **connecté à GitHub**. 

À chaque fois que vous pushez du code :
```
1. Vous modifiez du code localement
2. git commit + git push
3. Render détecte le changement
4. Redéploie automatiquement
5. Site mis à jour en 2-3 min !
```

### **Workflow de mise à jour**

```powershell
# 1. Modifier votre code
# ...

# 2. Vérifier les changements
git status

# 3. Ajouter les modifications
git add .

# 4. Commiter
git commit -m "Add: nouvelles images pour Prunus Kanzan"

# 5. Pusher
git push

# ✅ Render redéploie automatiquement !
```

### **Suivre le redéploiement**

Sur le Dashboard Render :
- Vous verrez "Deploying..." en temps réel
- Logs disponibles dans l'onglet "Logs"
- Notification par email (si activé)

---

## ⚙️ PARTIE 5 : CONFIGURATION AVANCÉE RENDER

### **Settings à vérifier (optionnel)**

Dans Dashboard → Votre service → **Settings** :

#### **Auto-Deploy**
```
☑️ Auto-Deploy: Yes  ← Recommandé
Branch: main
```

#### **Build Command** (déjà configuré par render.yaml)
```
cd client && npm install && npm run build
```

#### **Publish Directory** (déjà configuré)
```
client/dist
```

#### **Environment Variables** (déjà configuré)
```
NODE_VERSION = 20.11.0
```

#### **Custom Domain** (optionnel)

Si vous avez un domaine :
1. Custom Domains → "Add Custom Domain"
2. Entrer : `haies-bessancourt.fr`
3. Ajouter le CNAME chez votre registrar
4. HTTPS automatique

---

## 📊 RÉCAPITULATIF DU PROCESSUS COMPLET

```
1️⃣ GITHUB
   ├── Créer repository "Ecoquartier/haies-bessancourt"
   ├── Configurer (description, topics, etc.)
   └── ✅ Repository prêt

2️⃣ GIT LOCAL
   ├── git init
   ├── git add .
   ├── git commit
   ├── git remote add origin https://...
   └── git push
   └── ✅ Code sur GitHub

3️⃣ RENDER
   ├── Sign Up with GitHub
   ├── New + → Blueprint
   ├── Connect repository
   ├── Apply (détecte render.yaml)
   └── Attendre 3-5 min
   └── ✅ Site en ligne !

4️⃣ MISES À JOUR
   ├── Modifier code local
   ├── git commit + push
   └── Render redéploie auto
   └── ✅ Site à jour !
```

---

## ⏱️ TEMPS ESTIMÉ

| Étape | Durée |
|-------|-------|
| Configuration GitHub | 5 min |
| Git + Push | 3 min |
| Connexion Render | 2 min |
| Déploiement | 3-5 min |
| **TOTAL** | **13-15 min** |

---

## 🆘 DÉPANNAGE

### **Problème 1 : Git push échoue**

```
Error: Authentication failed
```

**Solution** :
- Utiliser un Personal Access Token
- Voir section "Authentification" ci-dessus

---

### **Problème 2 : Render ne voit pas le repository**

**Solution** :
- Dashboard Render → Account Settings
- GitHub → "Configure Render"
- Donner accès au repository

---

### **Problème 3 : Build échoue sur Render**

```
Error: npm install failed
```

**Solution** :
1. Vérifier que `client/package.json` existe
2. Tester en local : `cd client && npm install && npm run build`
3. Vérifier les logs Render pour l'erreur exacte

---

### **Problème 4 : Site déployé mais page blanche**

**Solution** :
1. Ouvrir Console navigateur (F12)
2. Vérifier les erreurs
3. Vérifier que `render.yaml` a bien `client/dist` comme publish directory

---

## ✅ CHECKLIST FINALE

### **GitHub**
- [ ] Repository créé
- [ ] Description ajoutée
- [ ] Topics ajoutés
- [ ] Code pushé
- [ ] Tous les fichiers visibles

### **Render**
- [ ] Compte créé avec GitHub
- [ ] Repository connecté
- [ ] Blueprint appliqué
- [ ] Déploiement réussi
- [ ] Site accessible

### **Vérification Site**
- [ ] Navigation fonctionne
- [ ] Comparaison fonctionne
- [ ] Disclaimer s'affiche
- [ ] HTTPS actif

---

**✅ VOTRE SITE EST MAINTENANT EN LIGNE ET SE MET À JOUR AUTOMATIQUEMENT !** 🎉

**URL finale** : `https://haies-bessancourt-frontend.onrender.com`

