# 🚀 Guide de Déploiement sur Render

## ⚡ DÉMARRAGE RAPIDE (7 minutes)

### Étape 1 : Git (2 min)

```powershell
cd "d:\Textes\Maison Bessancourt\Bouygues - LOTICIS\Haies"

git init
git config user.name "Votre Nom"
git config user.email "votre@email.com"
git branch -M main
git add .
git commit -m "Initial commit - Haies Bessancourt"
```

### Étape 2 : GitHub (2 min)

1. Aller sur https://github.com/new
2. **Repository name** : `haies-bessancourt`
3. **Visibility** : **Public** ✅ (requis pour plan gratuit Render)
4. Ne PAS cocher "Initialize with README"
5. Cliquer **"Create repository"**

### Étape 3 : Push (1 min)

```powershell
# Remplacer USERNAME par votre nom d'utilisateur GitHub
git remote add origin https://github.com/USERNAME/haies-bessancourt.git
git push -u origin main
```

💡 **Si demande mot de passe** : Utiliser un Personal Access Token
- Créer : https://github.com/settings/tokens
- Permissions : Cocher `repo`

### Étape 4 : Render (2 min)

1. Aller sur https://dashboard.render.com
2. **"Sign Up with GitHub"** (bouton bleu)
3. Autoriser Render
4. **"New +"** → **"Blueprint"**
5. Chercher `haies-bessancourt` → **"Connect"**
6. Render détecte `render.yaml` → **"Apply"**
7. Attendre 3-5 minutes

✅ **Site en ligne !** → `https://haies-bessancourt-frontend.onrender.com`

---

## 📋 CONFIGURATION AUTOMATIQUE

Le fichier `render.yaml` configure tout automatiquement :

```yaml
services:
  - type: web
    name: haies-bessancourt-frontend
    env: static
    buildCommand: cd client && npm install && npm run build
    staticPublishPath: ./client/dist
    envVars:
      - key: NODE_VERSION
        value: 20.11.0
```

**Render va** :
- ✅ Installer Node.js 20.11.0
- ✅ Installer les dépendances
- ✅ Builder l'application
- ✅ Déployer sur CDN global
- ✅ Configurer HTTPS/SSL gratuit

---

## 🔄 MISES À JOUR

À chaque modification, pusher sur GitHub :

```powershell
git add .
git commit -m "Description des modifications"
git push
```

→ Render redéploie **automatiquement** ! 🚀

---

## 🌐 DOMAINE PERSONNALISÉ (Optionnel)

1. Dashboard Render → Votre service → **Settings**
2. **Custom Domains** → **"Add Custom Domain"**
3. Entrer votre domaine (ex: `haies-bessancourt.fr`)
4. Render fournit les paramètres DNS :
   ```
   Type: CNAME
   Name: @
   Value: haies-bessancourt-frontend.onrender.com
   ```
5. Ajouter ce CNAME chez votre registrar
6. Attendre propagation DNS (2-48h)

✅ HTTPS automatique !

---

## 💰 PLANS

### Plan GRATUIT
- ✅ 100 GB bande passante/mois
- ✅ SSL/HTTPS gratuit
- ✅ CDN global
- ✅ Builds illimités
- ⚠️ Se met en veille après 15 min d'inactivité

### Plan STARTER (7$/mois)
- ✅ Pas de mise en veille
- ✅ 500 GB bande passante
- ✅ Support prioritaire

---

## 🐛 DÉPANNAGE

### Build échoue

**Tester en local d'abord** :
```powershell
cd client
npm install
npm run build
```

Si ça marche localement, vérifier que tous les fichiers sont pushés :
```powershell
git status
git add .
git commit -m "Fix build"
git push
```

### Images ne s'affichent pas

- Vérifier structure : `client/public/images/{plante}/{plante}_type.jpg`
- Vérifier que les images sont pushées sur GitHub
- Voir le guide **IMAGES.md**

### Site lent

- Optimiser images (< 500 KB via TinyPNG.com)
- Upgrade vers plan Starter (pas de veille)

### Page blanche

1. Ouvrir Console navigateur (F12)
2. Regarder les erreurs
3. Vérifier les logs Render

---

## ✅ CHECKLIST POST-DÉPLOIEMENT

- [ ] Site charge
- [ ] Images s'affichent (si ajoutées)
- [ ] Navigation menu fonctionne
- [ ] Mode Comparaison fonctionne
- [ ] Galerie photos (← → et zoom)
- [ ] Onglets (Général, Culture, Réglementation, etc.)
- [ ] Responsive mobile
- [ ] HTTPS actif (cadenas vert)

---

## 📞 SUPPORT

- **Documentation** : https://render.com/docs
- **Status** : https://status.render.com
- **Support** : support@render.com

---

## 🎯 QUE CHOISIR SUR RENDER

| Étape | Action |
|-------|--------|
| **Connexion** | "Sign Up with GitHub" |
| **Dashboard** | "New +" → "Blueprint" |
| **Repository** | Sélectionner votre repo |
| **Configuration** | "Apply" (détecte render.yaml) |
| **Résultat** | Site en ligne en 3-5 min ! |

---

**✅ Déploiement automatique avec `render.yaml` !**
