# 🌿 NEO GARDEN - README

## 🎯 Qu'est-ce que Neo Garden ?

**Neo Garden** est la nouvelle interface **sombre, épurée et professionnelle** de votre application "Les Haies de l'Écocartier de Bessancourt".

---

## 🚀 DÉMARRAGE RAPIDE

### 1. Lancer l'application

```bash
cd client
npm run dev
```

### 2. Ouvrir dans le navigateur

**URL** : http://localhost:5173

### 3. Vous voyez :

```
┌───────────────────────────────────────────────┐
│ [🌳] Les Haies     📋  🔍  🌳     🔍 🌙 👤 │ ← Header noir
│                     ↑   ↑   ↑               │
│                    CLIQUEZ SUR CES BOUTONS  │
└───────────────────────────────────────────────┘
```

---

## 🖱️ NAVIGATION

### **3 Boutons au Centre du Header**

| Bouton | Mode | Description |
|--------|------|-------------|
| **📋 Fiches Détaillées** | `normal` | Voir les fiches complètes des plantes |
| **🔍 Comparateur** | `comparaison` | Comparer plusieurs plantes |
| **🌳 Planificateur 3D** | `planification` | Dessiner votre jardin en 2D/3D |

**Le bouton actif est BLEU** 🔵

---

## 🎨 THÈME

### **Neo Garden = Thème Sombre Professionnel**

- Background : Noir profond `#0a0a0a`
- Texte : Blanc `#fafafa`
- Accents : Bleu, Vert, Orange, Rose
- Style : Glassmorphism avec blur

### **Appliqué à 100% du site** ✅

Tous les modes (Fiches, Comparateur, Planificateur) utilisent le même thème sombre.

---

## 📋 MODE FICHES DÉTAILLÉES

**Cliquer sur : 📋**

```
┌──────────┬────────────────────┐
│ Liste    │                    │
│ Plantes  │  Fiche détaillée   │
│          │                    │
│ 🌳 Arbre │  - Images          │
│ 🌿 Arbuste│ - Caractéristiques │
│          │  - Plantation      │
│          │  - Entretien       │
└──────────┴────────────────────┘
```

**Actions** :
- Cliquer sur une plante dans la liste (gauche)
- La fiche s'affiche à droite

---

## 🔍 MODE COMPARATEUR

**Cliquer sur : 🔍**

```
┌───────────────────────────────┐
│ Sélection                     │
│ [x] Arbre 1  [ ] Arbuste 1    │ ← Cocher les plantes
│ [ ] Arbre 2  [x] Arbuste 2    │
├───────────────────────────────┤
│ Tableau Comparatif            │
│ Critère    | Arbre 1 | Arbuste 2 |
│ Hauteur    | 8m      | 2m        │
│ Floraison  | Mai     | Juin      │
└───────────────────────────────┘
```

**Actions** :
- Cocher des plantes en haut
- Comparer les critères dans le tableau

---

## 🌳 MODE PLANIFICATEUR 3D

**Cliquer sur : 🌳**

```
┌───────────────────────────────┐
│        CANVAS                 │
│      (Dessinez votre jardin)  │
│                               │
├───────────────────────────────┤
│ TIMELINE                      │
│ [🌱] [🕐] [☀️] [👁️]        │
│ Croissance Heure Saison Vue   │
└───────────────────────────────┘
```

**Actions** :
- Dessiner votre terrain
- Placer des arbres
- Utiliser la timeline en bas :
  - 🌱 Projeter la croissance (0-20 ans)
  - 🕐 Changer l'heure (ombres)
  - ☀️ Changer la saison
  - 👁️ Basculer 2D/3D

---

## 🎯 TIMELINE (Mode Planificateur)

### **4 Cartes en Bas**

```
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│ 🌱      │ │ 🕐      │ │ ☀️      │ │ 👁️      │
│Croissance│ │  Heure  │ │ Saison  │ │  Vue    │
│━━━●━━━━ │ │━━●━━━━━│ │[🌸][☀️]│ │[2D][3D] │
│ An 5    │ │ 14h00   │ │[🍂][❄️]│ │Recentrer│
└─────────┘ └─────────┘ └─────────┘ └─────────┘
   Vert       Orange      Rose        Bleu
```

**Chaque carte** :
- Hover : S'agrandit légèrement
- Barre colorée apparaît en haut
- Ombre portée plus forte

---

## 📱 SUR MOBILE

### **Boutons de Mode**

Sur mobile, les 3 boutons s'affichent **sous le header** :

```
┌─────────────────┐
│ 🌳 Les Haies    │ Header
├─────────────────┤
│ 📋 Fiches       │ ← Bouton 1
│ 🔍 Comparateur  │ ← Bouton 2
│ 🌳 Planificateur│ ← Bouton 3
├─────────────────┤
│ Contenu         │
```

### **Timeline**

Sur mobile, les 4 cartes s'empilent **verticalement** :

```
┌─────────────┐
│ 🌱 Croissance│
│ An 5        │
├─────────────┤
│ 🕐 Heure    │
│ 14h00       │
├─────────────┤
│ ☀️ Saison   │
│ [○][○][●][○]│
├─────────────┤
│ 👁️ Vue      │
│ [2D] [3D]   │
└─────────────┘
```

---

## ⚠️ SI VOUS NE VOYEZ PAS LES BOUTONS

### **Vérifications** :

1. **Le header est-il visible en haut ?**
   - Oui → Regardez au centre
   - Non → Rechargez la page (F5)

2. **Voyez-vous 3 boutons au centre ?**
   - Oui → Parfait ! Cliquez dessus
   - Non → Videz le cache (Ctrl+Shift+R)

3. **Les boutons réagissent-ils au clic ?**
   - Oui → Tout fonctionne !
   - Non → Vérifiez la console (F12)

---

## 🎨 APPARENCE DES BOUTONS

### **Bouton Normal** (Inactif)

```
Fond : Transparent
Texte : Gris clair
Taille : Normale
```

### **Bouton Hover** (Survol)

```
Fond : Gris foncé
Texte : Blanc
Animation : Légère
```

### **Bouton Actif** (Mode sélectionné)

```
Fond : BLEU (#3b82f6)
Texte : BLANC
Taille : Légèrement plus grand
```

---

## 💡 ASTUCES

### **Navigation Rapide**

- **Raccourci clavier** : (à venir)
  - `1` = Fiches
  - `2` = Comparateur
  - `3` = Planificateur

### **Identifier le Mode Actuel**

Regardez le bouton **BLEU** dans le header :
- Si **📋 est bleu** → Vous êtes en mode Fiches
- Si **🔍 est bleu** → Vous êtes en mode Comparateur
- Si **🌳 est bleu** → Vous êtes en mode Planificateur

---

## 📞 BESOIN D'AIDE ?

### **1. Consultez les Guides**

- `COMMENT_NAVIGUER.md` (ce fichier)
- `GUIDE_NAVIGATION_NEO.md` (version détaillée)
- `NEO_GARDEN_GUIDE.md` (guide complet)

### **2. Vérifiez la Console**

Ouvrir F12 (Chrome/Firefox) :
- Onglet "Console" : Vérifier les erreurs
- Onglet "Elements" : Inspecter le header

### **3. Contactez le Support**

**Mairie de Bessancourt** : 01 30 40 44 47

---

## ✅ CHECKLIST

Avant de demander de l'aide, vérifiez :

- [ ] L'application est démarrée (`npm run dev`)
- [ ] Le navigateur affiche http://localhost:5173
- [ ] Le header noir est visible en haut
- [ ] Les 3 boutons sont visibles au centre
- [ ] Le cache a été vidé (Ctrl+Shift+R)
- [ ] Aucune erreur dans la console (F12)

---

## 🎉 VOUS AVEZ TROUVÉ !

**Les boutons sont au CENTRE du header** :

📋 **Fiches** | 🔍 **Comparateur** | 🌳 **Planificateur**

**Cliquez dessus pour changer de mode !**

---

**Bon jardinage virtuel !** 🌳✨

