# 🎨 CONCEPTION NOUVELLE INTERFACE - PROFESSIONNELLE

## 🎯 OBJECTIF

Créer une **interface complètement repensée**, moderne, épurée et professionnelle.

**Inspirations** : Figma, Notion, Linear, Vercel, Stripe

---

## 📊 ANALYSE UTILISATEUR

### Parcours Principaux

**Utilisateur Type 1** : Citoyen qui veut choisir une plante
1. Découvrir les plantes disponibles
2. Comparer 2-3 options
3. Voir les détails (floraison, entretien, règles)
4. Décider

**Utilisateur Type 2** : Résident qui planifie son jardin
1. Dessiner son terrain
2. Ajouter sa maison, réseaux
3. Placer des arbres
4. Vérifier les règles de distance
5. Voir en 3D avec croissance
6. Exporter/Sauvegarder

---

## 🎨 NOUVELLE INTERFACE - WIREFRAMES

### 1. Layout Principal (Épuré)

```
┌──────────────────────────────────────────────────────────┐
│ HEADER MODERNE (56px, fixe, épuré)                      │
│ ┌────┐  Explorer • Planifier      🌙 🔍 ⚙️            │
│ │ 🌳 │                                                   │
│ └────┘                                                   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ ┌─────────────┬──────────────────────────────────────┐ │
│ │ SIDEBAR     │  CONTENU PRINCIPAL                   │ │
│ │ (260px)     │  (flex-1, max-width: 1400px)        │ │
│ │             │                                       │ │
│ │ ┌─────────┐ │  ┌──────────────────────────────┐  │ │
│ │ │ Card 1  │ │  │                              │  │ │
│ │ │ 🌸      │ │  │   Contenu adaptatif          │  │ │
│ │ └─────────┘ │  │   (Fiche, Tableau, Canvas)   │  │ │
│ │ ┌─────────┐ │  │                              │  │ │
│ │ │ Card 2  │ │  └──────────────────────────────┘  │ │
│ │ │ 🌿      │ │                                     │ │
│ │ └─────────┘ │                                     │ │
│ │     ...     │                                     │ │
│ └─────────────┴──────────────────────────────────────┘ │
│                                                          │
└──────────────────────────────────────────────────────────┘
    ▲ Timeline (100px) apparaît en bas en mode Plan
```

### 2. Header Moderne (56px)

```
┌─────────────────────────────────────────────────────────┐
│ 🌳 Haies     Explorer • Planifier     🌙 🔍 ⚙️         │
│  Bessancourt                                             │
└─────────────────────────────────────────────────────────┘
```

**Caractéristiques** :
- Hauteur : 56px (plus compact)
- Logo + Titre (gauche)
- Navigation tabs (centre)
- Actions (droite) : 3 icônes max
- Fond : Glassmorphism subtil
- Border-bottom : 1px

### 3. Sidebar (260px, collapsible)

#### Mode Explorer
```
┌──────────────┐
│ 🔍 Recherche │  ← Input moderne
├──────────────┤
│ Filtres ▼    │  ← Accordéon
│ • Type       │
│ • Hauteur    │
│ • Exposition │
├──────────────┤
│ ┌──────────┐ │
│ │ 🌸 Card  │ │  ← Card plante
│ │ Cerisier │ │
│ │ 6-10m    │ │
│ └──────────┘ │
│ ┌──────────┐ │
│ │ 🌿 Card  │ │
│ │ Érable   │ │
│ │ 4-8m     │ │
│ └──────────┘ │
│     ...      │
└──────────────┘
```

#### Mode Planificateur
```
┌──────────────┐
│ Outils ▼     │  ← Accordéon
│ 🏠 Maison    │  ← Icon + Label
│ 🌳 Arbre     │
│ 💧 Citerne   │
│ 🚰 Canalisation│
├──────────────┤
│ Objets ▼     │  ← Liste objets placés
│ • Maison     │
│ • Arbre 1    │
│ • Citerne    │
└──────────────┘
```

### 4. Contenu Principal

#### Mode Explorer - Fiche Plante
```
┌────────────────────────────────────┐
│ ┌────────┐ Cerisier du Japon      │  ← Header avec image
│ │ Photo  │ Prunus serrulata        │
│ └────────┘ • Rosaceae              │
├────────────────────────────────────┤
│ [Général][Entretien][Plantation]   │  ← Tabs simples
├────────────────────────────────────┤
│                                    │
│ Galerie (3 images) →               │  ← Carrousel
│                                    │
│ ℹ️ Description                     │
│ Lorem ipsum...                     │
│                                    │
│ 📏 Caractéristiques               │
│ • Hauteur : 6-10m                 │
│ • Floraison : Avril-Mai           │
│ • Sol : Frais, drainé             │
│                                    │
└────────────────────────────────────┘
```

#### Mode Explorer - Comparaison
```
┌─────────────────────────────────────────────┐
│ Comparer (3 plantes) [× Réinitialiser]     │
├──────────┬──────────┬──────────┬──────────┤
│  Critère │ Cerisier │  Érable  │ Magnolia │
├──────────┼──────────┼──────────┼──────────┤
│ Hauteur  │  6-10m   │   4-8m   │  5-8m    │
│ Floraison│ Avr-Mai  │   Mars   │ Mai-Juin │
│   ...    │   ...    │   ...    │   ...    │
└──────────┴──────────┴──────────┴──────────┘
```

#### Mode Planificateur - Canvas
```
┌────────────────────────────────────┐
│ [2D] [3D]  Terrain 30×30m         │  ← Contrôles en haut
├────────────────────────────────────┤
│                                    │
│        CANVAS INTERACTIF           │
│        (Fabric.js ou Three.js)     │
│                                    │
│  ✅ Validations en overlay         │
│                                    │
└────────────────────────────────────┘
```

### 5. Timeline (100px, bottom, mode Plan uniquement)

```
┌──────────┬──────────┬───────────┬────────────┐
│ 📅 Année │ 🕐 Heure │ 🌸 Saison │ 📐 Vue     │
│ [━━●━━━] │ [━━●━━━] │ [•••·]    │ [2D][3D]  │
│ 0-20 ans │ 6h-18h   │ Été       │           │
└──────────┴──────────┴───────────┴────────────┘
```

---

## 🎨 DESIGN SYSTEM (Vraiment Pro)

### Couleurs

#### Mode Sombre
```
--bg-primary:     #09090b  (fond principal)
--bg-secondary:   #18181b  (surfaces)
--bg-tertiary:    #27272a  (hover)

--text-primary:   #fafafa  (texte principal)
--text-secondary: #a1a1aa  (texte secondaire)
--text-tertiary:  #71717a  (texte muted)

--border:         #27272a  (borders)
--border-hover:   #3f3f46  (borders hover)

--accent:         #10b981  (vert nature)
--accent-hover:   #059669
```

#### Mode Clair
```
--bg-primary:     #ffffff
--bg-secondary:   #f9fafb
--bg-tertiary:    #f3f4f6

--text-primary:   #09090b
--text-secondary: #52525b
--text-tertiary:  #a1a1aa

--border:         #e4e4e7
--border-hover:   #d4d4d8

--accent:         #059669  (vert foncé)
--accent-hover:   #047857
```

### Typography
```
Font:     Inter, -apple-system, system-ui
Sizes:    12px, 14px, 16px, 20px, 24px, 32px
Weights:  400 (normal), 500 (medium), 600 (semibold)
Leading:  1.4 (tight), 1.6 (normal), 1.8 (relaxed)
```

### Espacements (Grille 4px)
```
4px, 8px, 12px, 16px, 20px, 24px, 32px, 48px, 64px
```

### Composants

#### Button
```
Height:   36px (sm), 40px (md), 44px (lg)
Padding:  0 16px
Radius:   8px
Shadow:   Subtile au hover
```

#### Card
```
Padding:  20px
Radius:   12px
Border:   1px solid var(--border)
Shadow:   0 1px 3px rgba(0,0,0,0.1)
```

#### Input
```
Height:   40px
Padding:  0 12px
Radius:   8px
Border:   1px, focus: accent
```

---

## 📝 PLAN D'IMPLÉMENTATION

### Étape 1 : Créer Nouveau Design System (30 min)
✅ `styles/design-pro.css` - Variables modernes
✅ `styles/theme-dark.css` - Mode sombre
✅ `styles/theme-light.css` - Mode clair

### Étape 2 : Composants UI de Base (1h)
- `components/ui/Button.jsx` - Bouton universel
- `components/ui/Card.jsx` - Card universelle
- `components/ui/Input.jsx` - Input universel
- `components/ui/Badge.jsx`
- `components/ui/Tabs.jsx`

### Étape 3 : Layout (1h)
- `components/layout/AppShell.jsx` - Container principal
- `components/layout/Header.jsx` - Header moderne
- `components/layout/Sidebar.jsx` - Sidebar adaptative

### Étape 4 : Mode Explorer (2h)
- `components/explorer/PlantGrid.jsx` - Grille plantes
- `components/explorer/PlantCard.jsx` - Card compacte
- `components/explorer/PlantSheet.jsx` - Fiche moderne
- `components/explorer/Comparator.jsx` - Tableau moderne

### Étape 5 : Mode Planificateur (3h)
- `components/planner/Canvas.jsx` - Canvas 2D/3D unifié
- `components/planner/Toolbar.jsx` - Outils sidebar
- `components/planner/Timeline.jsx` - Timeline moderne
- `components/planner/Inspector.jsx` - Props objet

### Étape 6 : Migration Progressive (1h)
- Créer App-v2.jsx
- Tester côte à côte
- Basculer si validé

**Total : ~8h30**

---

## 🚀 VOULEZ-VOUS QUE JE PROCÈDE ?

Je vais créer cette nouvelle interface complète et moderne.

**Options** :

**A) OUI, créez la nouvelle interface**
→ Je commence maintenant, étape par étape

**B) Montrez-moi d'abord des mockups**
→ Je crée des wireframes HTML/CSS statiques

**C) Juste améliorez l'existant**
→ Je garde la structure mais modernise

**Que préférez-vous ?** 🎨

