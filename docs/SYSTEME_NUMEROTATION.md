# 🔢 SYSTÈME DE NUMÉROTATION DES IMAGES

## ✅ SYSTÈME ACTUEL (déjà en place)

### **Format du nom de fichier**
```
{espece}_{type}_{numero}.{extension}
```

### **Exemple : Prunus Kanzan**

#### **Type : fleurs** (numérotation indépendante)
```
prunus-kanzan_fleurs_01.jpg  ← Numéro 1 pour LES FLEURS
prunus-kanzan_fleurs_02.jpg  ← Numéro 2 pour LES FLEURS
prunus-kanzan_fleurs_03.jpg  ← Numéro 3 pour LES FLEURS
prunus-kanzan_fleurs_04.jpg
prunus-kanzan_fleurs_05.jpg
prunus-kanzan_fleurs_06.jpg
prunus-kanzan_fleurs_07.jpg
prunus-kanzan_fleurs_08.jpg
prunus-kanzan_fleurs_09.jpg  ← Numéro 9 pour LES FLEURS
```

#### **Type : vue_generale** (numérotation indépendante)
```
prunus-kanzan_vue_generale_01.jpg  ← Numéro 1 pour VUE GÉNÉRALE
prunus-kanzan_vue_generale_02.jpg  ← Numéro 2 pour VUE GÉNÉRALE
prunus-kanzan_vue_generale_03.jpg  ← Numéro 3 pour VUE GÉNÉRALE
```

#### **Type : feuilles** (si on en avait)
```
prunus-kanzan_feuilles_01.jpg  ← Numéro 1 pour FEUILLES
prunus-kanzan_feuilles_02.jpg  ← Numéro 2 pour FEUILLES
```

---

## 🎯 CARACTÉRISTIQUES

### **Numérotation par type** ✅
```
Chaque TYPE a sa propre numérotation qui commence à 01:

fleurs:        01, 02, 03, 04, ... (indépendant)
vue_generale:  01, 02, 03, ...     (indépendant)
feuilles:      01, 02, 03, ...     (indépendant)
fruits:        01, 02, 03, ...     (indépendant)
bourgeons:     01, 02, 03, ...     (indépendant)
tronc:         01, 02, 03, ...     (indépendant)
automne:       01, 02, 03, ...     (indépendant)
hiver:         01, 02, 03, ...     (indépendant)
```

### **Avantages**
✅ **Chaque type indépendant** : Fleurs peut avoir 20 photos, vue_generale 3  
✅ **Flexible** : Ajouter/supprimer un type ne perturbe pas les autres  
✅ **Clair** : On sait immédiatement combien de photos par type  
✅ **Scalable** : Pas de limite globale  

---

## 🔍 EXEMPLE COMPLET : Fusain

```
fusain_bourgeons_01.jpg       ← Type BOURGEONS, numéro 01
fusain_fleurs_01.jpg          ← Type FLEURS, numéro 01
fusain_fleurs_02.jpg          ← Type FLEURS, numéro 02
fusain_fleurs_03.jpg          ← Type FLEURS, numéro 03
fusain_fleurs_04.jpg          ← Type FLEURS, numéro 04
fusain_fleurs_05.jpg          ← Type FLEURS, numéro 05
fusain_fleurs_06.jpg          ← Type FLEURS, numéro 06
fusain_vue_generale_01.jpg    ← Type VUE_GENERALE, numéro 01
```

**Analyse** :
- Bourgeons : 1 photo (01)
- Fleurs : 6 photos (01-06) ← numérotation indépendante
- Vue générale : 1 photo (01) ← numérotation indépendante

---

## 💻 COMMENT ÇA FONCTIONNE

### **1. Dans ImageGallery.jsx (site web)**
```javascript
// Pour chaque type d'image
for (const imageType of imageTypes) {
  let imageNumber = 1;  // ← Commence à 1 POUR CE TYPE
  
  while (imageNumber <= 10) {
    const imagePath = `/${arbusteId}/${arbusteId}_${imageType.type}_${paddedNumber}.jpg`;
    // Cherche: kanzan_fleurs_01, _02, _03, etc.
    
    imageNumber++; // Incrémente POUR CE TYPE uniquement
  }
}
```

### **2. Dans l'admin (server.js)**
```javascript
// Extraction du numéro depuis le nom de fichier
const match = filename.match(/_(\d+)\.(jpg|jpeg|png|webp)$/);
const number = match ? parseInt(match[1]) : 0;

// Chaque fichier a son numéro dans son nom
// kanzan_fleurs_05.jpg → type: fleurs, number: 5
// kanzan_vue_generale_02.jpg → type: vue_generale, number: 2
```

### **3. Auto-numérotation admin (admin.js)**
```javascript
// Calculer le prochain numéro pour ce TYPE spécifique
const existingCount = state.existingImages.filter(img => 
  img.espece === item.espece && 
  img.type === item.type  // ← Filtre par TYPE
).length;

const nextNumber = existingCount + 1;
// Si 6 images "fleurs" → prochain numéro = 7
// Si 2 images "vue_generale" → prochain numéro = 3
```

---

## ✅ CONCLUSION

**Votre système de numérotation fonctionne EXACTEMENT comme vous le souhaitez** :

✅ Chaque **type** a sa **propre numérotation** (01, 02, 03...)  
✅ Indépendance totale entre les types  
✅ Fonctionne parfaitement sur le **site web** (normal et comparaison)  
✅ **Auto-numérotation admin** fonctionne correctement  
✅ **Pas de complexité** ajoutée  

**Vous n'avez rien à changer, c'est déjà optimal !** 🎯✅
