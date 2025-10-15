# 📖 Guide Interface Admin - Haies Bessancourt

## 🚀 Démarrage

### **Lancer l'interface admin**
```bash
npm run admin
```

### **Ouvrir dans le navigateur**
```
http://localhost:3001
```

---

## 🎯 Interface Simplifiée

L'interface admin a été **entièrement refondue** pour une utilisation **simple, logique et sans redondance**.

---

## 🖥️ **LAYOUT**

```
┌─────────────────────────────────────────────────────────┐
│ 🔍 FILTRES                                               │
│ [Espèce ▼] [Type ▼] [🔄 Réinitialiser]                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 📷 IMAGES EXISTANTES                                     │
│ 0 sélectionnée(s) [🗑️ Supprimer la sélection]          │
│                                                          │
│ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐                │
│ │☑ #1   │ │☐ #2   │ │☐ #3   │ │☐ #4   │                │
│ │[image]│ │[image]│ │[image]│ │[image]│                │
│ └───────┘ └───────┘ └───────┘ └───────┘                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 📤 AJOUTER DE NOUVELLES IMAGES                           │
│ [📁 Glisser-déposer ou cliquer]  (zone compacte)        │
│                                                          │
│ Images à uploader :                                      │
│ ┌────────────────────────────────────────────────────┐  │
│ │ [img] image1.jpg                                    │  │
│ │       [Espèce ▼] [Type ▼]  [⏳ En attente] [🚀] [🗑️] │  │
│ └────────────────────────────────────────────────────┘  │
│ ┌────────────────────────────────────────────────────┐  │
│ │ [img] image2.jpg                                    │  │
│ │       [Kanzan ▼] [Fleurs ▼] [⏳ En attente] [🚀] [🗑️] │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ [🚀 Envoyer toutes les images] [🗑️ Vider la file]       │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 **WORKFLOWS**

### **Workflow 1: Visualiser les images**

1. **Sélectionner une espèce** dans le premier filtre
2. **Sélectionner un type** dans le second filtre
3. ✅ **Les images s'affichent automatiquement**

---

### **Workflow 2: Supprimer des images**

1. **Appliquer les filtres** (espèce + type)
2. **Cliquer sur les images** à supprimer (elles deviennent vertes)
   - OU cocher les checkbox
   - Sélection multiple possible
3. **Cliquer sur "🗑️ Supprimer la sélection"**
4. **Confirmer** la suppression
5. ✅ **Les images sont supprimées et la grille se rafraîchit**

---

### **Workflow 3: Ajouter une nouvelle image**

1. **Glisser-déposer une image** dans la zone compacte
   - OU cliquer pour parcourir vos fichiers
2. L'image apparaît dans la **file d'attente**
3. **Sélectionner l'espèce** (détection automatique si nom de fichier contient l'espèce)
4. **Sélectionner le type** (détection automatique si nom de fichier contient le type)
5. **Cliquer sur "🚀 Envoyer"** pour cette image
6. ✅ **L'image est uploadée et apparaîtra dans la grille**

---

### **Workflow 4: Ajouter plusieurs images d'un coup**

1. **Glisser-déposer plusieurs images** (ou sélection multiple)
2. Toutes les images apparaissent dans la **file d'attente**
3. **Configurer chaque image** :
   - Sélectionner espèce
   - Sélectionner type
4. **Option A** : Cliquer "🚀 Envoyer" sur chaque image individuellement
5. **Option B** : Cliquer "🚀 Envoyer toutes les images" pour envoyer en lot
6. ✅ **Toutes les images configurées sont uploadées**

---

### **Workflow 5: Remplacer une image existante**

1. **Appliquer les filtres** pour voir l'image actuelle
2. **Uploader la nouvelle image** avec les mêmes espèce/type
3. Le système **numérotera automatiquement** (ex: `fleurs_01.jpg`, `fleurs_02.jpg`...)
4. ✅ **La nouvelle image est ajoutée** (pas de remplacement automatique)
5. Si vous voulez **vraiment remplacer** :
   - Supprimer l'ancienne via la sélection
   - Uploader la nouvelle

---

## 🎨 **FONCTIONNALITÉS DÉTAILLÉES**

### **1️⃣ Filtres**

- **Espèce** : 
  - Prunus Kanzan, Accolade, Sunset Boulevard
  - Noisetier, Fusain, Troène, Osmanthe, Cornouiller, Seringat

- **Type** :
  - Vue générale
  - Bourgeons
  - Fleurs
  - Fruits
  - Automne
  - Hiver

- **Réinitialiser** : Efface tous les filtres

---

### **2️⃣ Grille d'images existantes**

- **Affichage** : Grille responsive (s'adapte à la taille de l'écran)
- **Sélection** : 
  - Cliquer sur une carte = sélectionner/désélectionner
  - OU cocher/décocher la checkbox
  - Carte sélectionnée = fond vert
- **Informations** : 
  - Miniature de l'image
  - Numéro (#1, #2, #3...)
  - Nom du fichier
- **Compteur** : "X sélectionnée(s)" mis à jour en temps réel

---

### **3️⃣ Upload**

#### **Zone de dépôt**
- **Compacte** : Petite zone horizontale
- **Glisser-déposer** : Drag & drop d'images
- **Clic** : Ouvre l'explorateur de fichiers
- **Formats** : JPG, PNG, WebP (max 5 MB)

#### **File d'attente**
- **Miniature** : Aperçu de l'image
- **Nom du fichier** : Affiché
- **Configuration** :
  - Select "Espèce" (détection auto si possible)
  - Select "Type" (détection auto si possible)
- **Statut** :
  - ⏳ En attente (jaune)
  - 🔄 Envoi... (bleu)
  - ✓ Envoyé (vert)
  - ✗ Erreur (rouge)
- **Actions** :
  - 🚀 Envoyer : Upload cette image
  - 🗑️ : Retirer de la file

#### **Actions globales**
- **🚀 Envoyer toutes les images** : Upload en lot
- **🗑️ Vider la file** : Efface toutes les images en attente

---

### **4️⃣ Détection automatique**

Le système **analyse le nom du fichier** pour détecter :

**Espèces** :
```
kanzan_fleurs.jpg        → Détecte "Prunus Kanzan"
accolade_automne.png     → Détecte "Prunus Accolade"
noisetier_vue.webp       → Détecte "Noisetier"
```

**Types** :
```
kanzan_fleurs.jpg        → Détecte "Fleurs"
accolade_automne.png     → Détecte "Automne"
noisetier_vue_generale.webp → Détecte "Vue générale"
```

**Mots-clés détectés** :
- `vue`, `general` → Vue générale
- `bourgeon` → Bourgeons
- `fleur` → Fleurs
- `fruit` → Fruits
- `automne` → Automne
- `hiver` → Hiver

---

### **5️⃣ Logging**

- **Journal en temps réel** : Affiche toutes les opérations
- **Types de logs** :
  - 🔵 Info (bleu)
  - ✅ Succès (vert)
  - ⚠️ Avertissement (orange)
  - ❌ Erreur (rouge)
- **Horodatage** : Chaque log avec l'heure précise
- **Auto-scroll** : Défile automatiquement vers le bas

---

## ⚙️ **TIPS & ASTUCES**

### ✅ **Bonnes pratiques**

1. **Nommer vos fichiers intelligemment** :
   ```
   ✅ kanzan_fleurs_gros_plan.jpg  → Détection auto
   ✅ noisetier_automne_01.png     → Détection auto
   ❌ IMG_1234.jpg                 → Aucune détection
   ```

2. **Filtrer avant de supprimer** :
   - Appliquer les filtres pour voir exactement ce que vous allez supprimer
   - Vérifier la sélection avant de confirmer

3. **Configurer avant d'envoyer** :
   - Toutes les images de la file doivent avoir une espèce ET un type
   - Le bouton "Envoyer" est désactivé si configuration incomplète

4. **Vérifier les statuts** :
   - ✓ Envoyé (vert) = Image uploadée avec succès
   - ✗ Erreur (rouge) = Cliquer à nouveau sur "Envoyer" pour réessayer

---

### 🔄 **Workflow optimal**

**Pour ajouter des images en masse** :

1. **Préparer vos fichiers** avec des noms intelligents :
   ```
   kanzan_fleurs_01.jpg
   kanzan_fleurs_02.jpg
   kanzan_bourgeons_01.jpg
   accolade_automne_01.jpg
   ```

2. **Glisser-déposer toutes les images** en une fois

3. **Vérifier la détection automatique** (espèce/type)

4. **Corriger manuellement** si nécessaire

5. **Cliquer "🚀 Envoyer toutes les images"**

6. ✅ **Toutes vos images sont uploadées en un clic !**

---

## 🚀 **DÉPLOIEMENT**

### **Local** :
1. Images uploadées → Stockées dans `client/public/images/`
2. Visible immédiatement sur le site local

### **Production** :
1. Les images sont uploadées localement
2. Pusher sur GitHub manuellement :
   ```bash
   git add client/public/images/
   git commit -m "Add: nouvelles images"
   git push
   ```
3. Render détecte le push et **redéploie automatiquement**
4. Images visibles sur le site en production après ~2 minutes

---

## 🆘 **AIDE & DÉPANNAGE**

### **Les images ne s'affichent pas**
- ✅ Vérifier que les filtres sont bien appliqués
- ✅ Vérifier qu'il y a bien des images pour cette espèce/type
- ✅ Rafraîchir la page (Ctrl + F5)

### **L'upload échoue**
- ✅ Vérifier que espèce ET type sont sélectionnés
- ✅ Vérifier le format de l'image (JPG, PNG, WebP)
- ✅ Vérifier la taille (< 5 MB)
- ✅ Consulter le journal pour l'erreur exacte

### **La détection auto ne fonctionne pas**
- ✅ Vérifier le nom du fichier (mots-clés présents ?)
- ✅ Configurer manuellement via les selects
- ✅ Renommer vos fichiers pour utiliser les mots-clés détectés

---

## 📊 **STATISTIQUES**

- **Filtres** : 2 (Espèce + Type)
- **Espèces** : 9
- **Types** : 6
- **Formats supportés** : 3 (JPG, PNG, WebP)
- **Taille max** : 5 MB
- **Sélection** : Multiple (illimitée)
- **Upload** : Multiple (illimité)
- **Détection auto** : Espèce + Type

---

## ✅ **CHECKLIST**

Avant d'uploader :
- [ ] Fichiers bien nommés (mots-clés pour détection auto)
- [ ] Formats valides (JPG, PNG, WebP)
- [ ] Taille < 5 MB par fichier
- [ ] Espèce et type configurés pour chaque image

Après upload :
- [ ] Statut "✓ Envoyé" pour toutes les images
- [ ] Images visibles dans la grille (avec filtres)
- [ ] Journal sans erreurs
- [ ] Git commit + push pour déployer en production

---

**🎉 Bonne gestion d'images !**

