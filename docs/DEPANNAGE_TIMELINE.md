# 🔧 DÉPANNAGE - Timeline Non Visible en Mode 2D

**Problème** : "Je ne vois pas la timeline en mode 2D"  
**Version** : 2.1.3  
**Date** : 19 octobre 2025

---

## ✅ SOLUTION RAPIDE

### Étape 1 : Vérifier le Bouton Toggle

1. **Ouvrir le Planificateur** (bouton "📐 Planificateur")
2. **Rester en mode 2D** (bouton "2D" actif en haut à droite)
3. **Regarder le panneau latéral GAUCHE**
4. **Cliquer sur l'onglet "🛠️ Outils"** (2ème onglet)
5. **Chercher le bouton 📅** (3ème ligne de boutons)
6. **Vérifier sa couleur** :
   - ✅ **Fond vert** = Timeline ACTIVE → Elle devrait être visible en bas
   - ❌ **Fond gris** = Timeline MASQUÉE → **CLIQUER DESSUS** pour l'afficher

### Étape 2 : Chercher la Timeline en Bas de l'Écran

Une fois le bouton 📅 **actif (vert)**, la timeline apparaît **EN BAS DE L'ÉCRAN** :

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│           PANNEAU LATÉRAL    │   CANVAS 2D          │
│                              │                      │
│                              │                      │
│                              │                      │
│                              │                      │
└─────────────────────────────────────────────────────┘
           ┌───────────────────────────────┐
           │ 📅 Projection temporelle (2D) │
           │ Aujourd'hui [===●====] Maturité│
           │ 🌱 10 ans - Croissance (~50%)  │
           └───────────────────────────────┘
              ↑ TIMELINE ICI (en bas, centrée)
```

**Position exacte** :
- **20px du bas de l'écran**
- **Centrée horizontalement**
- **Au-dessus de tout** (z-index 2000)
- **Fond blanc** avec bordure verte

---

## 🐛 SI LA TIMELINE N'APPARAÎT TOUJOURS PAS

### Cause 1 : Bouton désactivé

**Vérification** :
```
Panneau latéral > Onglet "🛠️ Outils" > Bouton 📅
```

**Action** : Cliquer sur 📅 pour activer (doit devenir vert)

### Cause 2 : Résolution d'écran trop petite

**Vérification** : La timeline a `min-width: 500px`

**Action** :
- Zoomer/Dézoomer le navigateur (Ctrl + 0)
- Agrandir la fenêtre
- Scroller vers le bas

### Cause 3 : Conflit CSS

**Vérification** : Ouvrir la console développeur (F12)

**Action** :
1. Appuyer sur **F12**
2. Onglet **"Console"**
3. Chercher des erreurs en rouge
4. Partager les erreurs pour diagnostic

### Cause 4 : Pas d'arbres placés

**Note** : La timeline fonctionne même sans arbres, mais c'est plus utile avec des arbres !

**Action** :
1. Mode "Comparaison" → Sélectionner 1+ arbres
2. Cliquer sur "📐 Planificateur"
3. Les arbres apparaissent sur le canvas
4. Bouger le slider timeline → arbres grandissent

---

## 🔍 CHECKLIST DE VÉRIFICATION

Cochez chaque point :

- [ ] Le **Planificateur** est ouvert
- [ ] Mode **2D** actif (bouton "2D" bleu en haut à droite)
- [ ] **Panneau latéral** visible à gauche
- [ ] Onglet **"🛠️ Outils"** sélectionné
- [ ] Bouton **📅** présent (3ème ligne)
- [ ] Bouton **📅** est **VERT** (actif)
- [ ] Regardé **tout en bas de l'écran** (20px du bas)
- [ ] Timeline visible avec **fond blanc** et **bordure verte**

---

## 📊 COMPARAISON VISUELLE

### BOUTON 📅 DÉSACTIVÉ (Timeline masquée) ❌
```
┌──────────┐
│    📅    │ ← Fond gris/blanc
└──────────┘
```
**Action** : CLIQUER pour activer

### BOUTON 📅 ACTIVÉ (Timeline visible) ✅
```
┌──────────┐
│    📅    │ ← Fond vert clair + bordure verte
└──────────┘
```
**Résultat** : Timeline visible en bas !

---

## 💡 ASTUCE RAPIDE

**Si vous ne trouvez toujours pas** :

1. **Recharger la page** (F5)
2. **Ouvrir le Planificateur**
3. **Rester en 2D**
4. **Scroller tout en bas** de la fenêtre
5. La timeline devrait apparaître **par défaut** (bouton 📅 vert automatiquement)

---

## 🎮 UTILISATION DE LA TIMELINE

Une fois visible :

1. **Slider** : Déplacer de gauche (0 ans) à droite (20+ ans)
2. **Arbres** : Grandissent en temps réel sur le canvas
3. **Labels** : Mis à jour avec dimensions actuelles
4. **Validation** : Recalculée selon nouvelles tailles

### Exemples Visuels

**Année 0** : Petit cercle (2m)
```
  🌳
  ◯  ← Petit
```

**Année 10** : Cercle moyen (6m)
```
   🌳
  ●●●  ← Moyen
 ●●●●●
  ●●●
```

**Année 20** : Grand cercle (10m)
```
    🌳
  ●●●●●
 ●●●●●●●  ← Grand
●●●●●●●●●
 ●●●●●●●
  ●●●●●
```

---

## 📞 SI PROBLÈME PERSISTE

**Informations à fournir** :
1. Version du navigateur (Chrome, Firefox, Edge ?)
2. Résolution d'écran
3. Capture d'écran de l'interface
4. Erreurs dans la console (F12)

---

## ✅ ÉTAT APRÈS CORRECTION

**CSS renforcé** : `!important` sur tous les styles de `.timeline-croissance`  
**Visibilité** : `display: block !important` + `visibility: visible !important`  
**Z-index** : 2000 (au-dessus de tout)  
**Position** : Fixed, bottom 20px, centrée  

**La timeline DOIT être visible** ! Si ce n'est pas le cas, il y a un problème externe (cache navigateur, extension, etc.)

---

**Document créé le** : 19 octobre 2025  
**Pour aider** : Localiser et activer la timeline en mode 2D

