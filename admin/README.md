# 🖼️ Interface Admin - Gestion des Images

## 🎯 Fonctionnalités

✅ **Glisser-déposer** des images (drag & drop)
✅ **Sélection facile** de l'espèce et du type
✅ **Détection automatique** si image existe déjà
✅ **Confirmation** avant remplacement
✅ **Renommage automatique** selon nomenclature
✅ **Aperçu** des images avant validation
✅ **Git commit & push automatique** en 1 clic
✅ **Compatible Render** (pas de backend en ligne nécessaire)

---

## 🚀 Démarrage Rapide

### **1. Installer les dépendances** (première fois uniquement)
```bash
npm install
```

### **2. Lancer l'interface admin**
```bash
npm run admin
```

### **3. Ouvrir dans le navigateur**
```
http://localhost:3001
```

---

## 📋 Workflow

### **Étape 1 : Glisser-déposer**
- Glissez vos images dans la zone dédiée
- Ou cliquez pour parcourir vos fichiers
- Formats acceptés : JPG, JPEG, PNG
- Taille max : 5 MB par image

### **Étape 2 : Configurer chaque image**
Pour chaque image :
1. **Sélectionner l'espèce** (dropdown)
   - Prunus Kanzan, Accolade, Sunset Boulevard
   - Noisetier, Fusain, Troène, Osmanthe
   - Cornouiller, Seringat
   
2. **Sélectionner le type** (dropdown activé après espèce)
   - Vue générale
   - Bourgeons
   - Fleurs
   - Fruits
   - Automne
   - Hiver

3. **Vérification automatique**
   - ✅ **Nouveau fichier** : Message de confirmation vert
   - ⚠️ **Existe déjà** : Avertissement orange

4. **Valider** : Cliquer sur le bouton "✓ Valider"

### **Étape 3 : Publier**
1. Toutes les images validées apparaissent dans le compteur
2. Cliquer **"🚀 Publier sur GitHub"**
3. Confirmation demandée
4. **Automatique** :
   - Images renommées (format: `{espece}_{type}.jpg`)
   - Copiées dans `client/public/images/{espece}/`
   - Git add + commit + push
   - Render redéploie automatiquement

### **Étape 4 : Terminé !**
Le site est mis à jour automatiquement en 2-3 minutes ! 🎉

---

## 🎨 Nomenclature Automatique

L'interface renomme automatiquement selon le format :

| Espèce sélectionnée | Type sélectionné | Nom final |
|---------------------|------------------|-----------|
| Prunus Kanzan | Fleurs | `prunus-kanzan_fleurs.jpg` |
| Noisetier | Fruits | `noisetier_fruits.jpg` |
| Fusain | Automne | `fusain_automne.jpg` |

**Vous n'avez rien à renommer manuellement !** ✅

---

## 📊 Exemples d'Usage

### **Ajouter 1 image**
⏱️ **Temps : 30 secondes**
1. Glisser l'image
2. Sélectionner espèce + type
3. Valider
4. Publier

### **Ajouter 10 images**
⏱️ **Temps : 3-4 minutes**
1. Glisser les 10 images
2. Configurer chacune (2-3 clics par image)
3. Tout valider
4. Publier en 1 clic

### **Remplacer une image existante**
⏱️ **Temps : 30 secondes**
1. Glisser la nouvelle image
2. Sélectionner espèce + type
3. ⚠️ Message : "Existe déjà - Remplacer ?"
4. Valider (remplace)
5. Publier

---

## 🔧 Technique

### **Frontend** (Interface)
- HTML5 Drag & Drop API
- Vanilla JavaScript (pas de framework)
- CSS moderne avec animations

### **Backend** (Serveur local)
- Express.js (serveur HTTP)
- Multer (gestion upload)
- Node.js fs (copie fichiers)
- Child process (Git automatique)

### **Port** : 3001 (pour ne pas conflictuer avec Vite:5173)

---

## ⚙️ Configuration Git

Le serveur utilise Git automatiquement :
```bash
git add client/public/images/
git commit -m "Add: X nouvelle(s) image(s) via interface admin"
git push
```

**Assurez-vous que Git est configuré** :
```bash
git config user.name "Votre Nom"
git config user.email "votre@email.com"
```

---

## 🛡️ Sécurité

- ✅ **Local uniquement** (localhost:3001)
- ✅ **Pas accessible** depuis internet
- ✅ **Validation** taille fichier (5MB max)
- ✅ **Validation** format (JPG, PNG uniquement)
- ✅ **Aperçu** avant publication
- ✅ **Confirmation** avant remplacement

---

## 📝 Logs

L'interface affiche en temps réel :
- Téléchargement des images
- Renommage
- Copie dans les dossiers
- Commit Git
- Push GitHub
- État du déploiement Render

---

## 🔄 Arrêter le Serveur

Dans le terminal :
```
Ctrl + C
```

---

## 📞 Dépannage

### **Port 3001 déjà utilisé**
Modifier le PORT dans `admin/server.js` (ligne 9)

### **Erreur Git**
Vérifier que Git est configuré et que vous avez les droits de push

### **Images ne s'affichent pas**
- Vérifier que le serveur est lancé (`npm run admin`)
- Vérifier la console navigateur (F12)

---

## ✅ Avantages

- 🆓 Gratuit (pas de backend cloud)
- 🚀 Rapide (30 sec par image)
- 🎯 Simple (3 clics par image)
- 🔒 Sécurisé (local uniquement)
- 🔄 Git workflow propre
- ✅ Compatible Render

---

**Interface prête à utiliser !** 🎉

