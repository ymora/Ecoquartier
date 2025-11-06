# 🧭 Guide de Navigation - Neo Garden

## 🎯 OÙ SONT LES BOUTONS DE MODE ?

### 📍 **Dans le Header en Haut**

Les boutons pour changer de mode sont **dans le header Neo Garden**, au centre :

```
┌──────────────────────────────────────────────────────┐
│ [🌳] Les Haies    [📋 Fiches] [🔍 Comparateur] [🌳 Plan]  🔍🌙👤 │
│                    ↑ CLIQUEZ ICI ↑                   │
└──────────────────────────────────────────────────────┘
```

---

## 🖱️ COMMENT CHANGER DE MODE

### **3 Boutons de Navigation**

1. **📋 Fiches Détaillées**
   - Cliquer sur ce bouton
   - Affiche les fiches complètes des plantes

2. **🔍 Comparateur**
   - Cliquer sur ce bouton
   - Affiche le tableau de comparaison

3. **🌳 Planificateur 3D**
   - Cliquer sur ce bouton
   - Affiche le canvas + timeline

### **Bouton Actif**

Le bouton du mode actuel est **bleu** (`#3b82f6`) :

```
[📋 Fiches]  [🔍 Comparateur]  [🌳 Planificateur]
   ↑                                  
 Actif = fond bleu + texte blanc
```

---

## 📱 SUR MOBILE

Sur mobile (< 768px), les boutons sont sous le header :

```
┌───────────────────────────┐
│ [🌳] Les Haies    🔍🌙👤│ ← Header
├───────────────────────────┤
│ 📋 Fiches Détaillées      │ ← Boutons
│ 🔍 Comparateur            │   empilés
│ 🌳 Planificateur 3D       │   verticalement
├───────────────────────────┤
│ Contenu                   │
```

---

## 🎨 APPARENCE DES BOUTONS

### **État Normal**

```
Fond : Transparent
Texte : Gris (#d4d4d4)
Border : Aucune
```

### **Au Survol** (Hover)

```
Fond : Gris foncé (#1f1f1f)
Texte : Blanc (#fafafa)
```

### **Actif** (Mode sélectionné)

```
Fond : Bleu (#3b82f6)
Texte : Blanc
Bord : Arrondi 6px
```

---

## 🔍 LOCALISATION EXACTE

### **Dans le Code**

**Fichier** : `client/src/components/neo/NeoHeader.jsx`  
**Lignes** : 31-42

```jsx
<nav className="neo-header-nav">
  {modes.map(mode => (
    <button
      className={`neo-nav-link ${currentMode === mode.id ? 'active' : ''}`}
      onClick={() => onModeChange(mode.id)}
    >
      <span>{mode.icon}</span>
      <span>{mode.label}</span>
    </button>
  ))}
</nav>
```

### **Dans l'Interface**

**Position** : Centre du header  
**Alignement** : Horizontal (desktop), Vertical (mobile)  
**Toujours visible** : Oui  

---

## ✅ VÉRIFICATIONS

Si vous ne voyez pas les boutons :

### **1. Vérifier le header**

Le header doit être visible en haut avec :
- 🌳 Logo à gauche
- "Les Haies de l'Écocartier" titre
- **3 boutons au centre** 📋 🔍 🌳
- Actions à droite 🔍 🌙 👤

### **2. Vérifier la console**

Ouvrir la console (F12) et vérifier :
- Aucune erreur
- Les boutons sont dans le DOM
- Les classes CSS sont appliquées

### **3. Vérifier le CSS**

Le fichier `neo-garden.css` doit être chargé :
- Inspecter un bouton
- Vérifier les styles appliqués
- Classe `neo-nav-link` présente

---

## 🐛 Résolution de Problèmes

### **Problème : Boutons invisibles**

**Solution** :
1. Vider le cache (Ctrl+Shift+R)
2. Vérifier que `neo-garden.css` est importé
3. Vérifier console pour erreurs

### **Problème : Boutons ne réagissent pas au clic**

**Solution** :
1. Vérifier que `onModeChange` est bien passé à NeoHeader
2. Vérifier la console pour erreurs JavaScript
3. Vérifier que `setMode` fonctionne

### **Problème : Sur mobile, menu caché**

**Solution** :
- Les boutons s'affichent automatiquement sous le header
- Si non visible, vérifier le z-index

---

## 📸 CAPTURE D'ÉCRAN (Description)

### **Desktop**

```
┌────────────────────────────────────────────────┐
│ [🌳] Les Haies de l'Écocartier • Bessancourt   │
│                                                │
│  [📋 Fiches Détaillées]  ← BOUTON 1           │
│  [🔍 Comparateur]        ← BOUTON 2           │
│  [🌳 Planificateur 3D]   ← BOUTON 3           │
│                                                │
│                          🔍 🌙 👤             │
└────────────────────────────────────────────────┘
```

Le bouton actif est **bleu**, les autres sont **gris**.

---

## 🎯 EXEMPLE D'UTILISATION

### **Pour aller au Comparateur** :

1. Chercher le header (tout en haut, noir)
2. Regarder au centre
3. Cliquer sur **🔍 Comparateur**
4. Le mode change instantanément

### **Pour aller au Planificateur** :

1. Chercher le header
2. Cliquer sur **🌳 Planificateur 3D**
3. La timeline apparaît en bas
4. Le canvas s'affiche au centre

---

## 💡 ASTUCE

**Les 3 boutons sont TOUJOURS visibles** dans le header Neo Garden.

Ils sont **au centre du header**, entre :
- Le titre (gauche)
- Les actions (droite)

**Impossible de les rater !** 😊

---

**Si vous ne les voyez toujours pas, faites-le moi savoir et je corrigerai immédiatement !** 🚀

