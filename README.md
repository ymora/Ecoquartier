# 🌳 Les Haies de l'Écocartier de Bessancourt

Application web de planification paysagère avec **mode jour/nuit complet**.

---

## ✨ MODE JOUR/NUIT ACTIVÉ

### 🎨 Changement de Thème
Cliquez sur **☀️/🌙** dans le header pour basculer entre :
- ☀️ **Mode Clair** : Fond blanc, texte noir (jour)
- 🌙 **Mode Sombre** : Fond noir, texte blanc (nuit)
- 🔄 **Mode Auto** : Suit votre système Windows

**Fonctionnalités** :
- Transitions fluides (200ms)
- Thème conservé au rechargement
- Adapté sur TOUTE l'interface
- 300+ variables CSS

---

## 🎯 Fonctionnalités

- ✅ **12 espèces documentées** (6 arbres + 6 arbustes)
- ✅ **Fiches détaillées** avec 7 onglets complets
- ✅ **Mode comparaison** avec 20 critères
- ✅ **Planificateur 2D** avec validation temps réel
- ✅ **Vue 3D** immersive avec ombres et saisons
- ✅ **Simulation croissance** (0-20 ans)
- ✅ **Validation réglementaire** (Code Civil Art. 671)

---

## 🚀 Installation

```bash
cd client
npm install
npm run dev
```

→ **http://localhost:5173**

---

## 🏗️ Architecture

**Stack** : React 18 + Vite 6 + Fabric.js (2D) + Three.js (3D)

**Nouveau** : Système de thème professionnel

```
client/src/
├── theme/              # Système de thème complet
│   ├── tokens.css          # 300+ variables CSS
│   ├── lightTheme.css      # Mode jour
│   ├── darkTheme.css       # Mode nuit
│   └── ThemeProvider.jsx   # Context React
│
├── styles/
│   ├── common.css          # Classes réutilisables
│   ├── buttons-unified.css # Boutons cohérents
│   └── neo-compat.css      # Compatibilité
│
├── components/         # Composants React
├── hooks/             # Hooks personnalisés
├── utils/              # Utilitaires
└── data/               # Données des 12 espèces
```

---

## 🔧 Corrections Appliquées

### 1. Boutons Taille Fixe ✅
- Tailles cohérentes (40px desktop, 44px mobile)
- Plus de variation entre modes
- Touch targets WCAG AA

### 2. Menu Stable ✅
- Ancien système `.navigation` supprimé
- Menu ne bouge plus en mode fiche
- 9,739 caractères de code obsolète retirés

### 3. Z-index Organisés ✅
- 111 z-index standardisés
- Hiérarchie cohérente (0 → 9999)
- Pas de chevauchements visuels

---

## 📚 Documentation

- **INTERFACE_JOUR_NUIT_FINAL.md** - Guide complet
- **README.md** - Ce fichier

---

## 💡 Utilisation Développeur

### Hook useTheme()
```jsx
import { useTheme } from './theme';

const { isDark, toggleTheme } = useTheme();
```

### Variables CSS
```css
background: var(--bg-primary);
color: var(--text-primary);
padding: var(--spacing-md);
```

### Classes Réutilisables
```html
<button class="btn-base btn-primary">Cliquer</button>
<div class="card">Contenu</div>
```

---

## 📞 Contact

**Mairie de Bessancourt** : 01 30 40 44 47

---

**Version** : 3.0.0  
**Date** : 7 novembre 2025  
**Status** : ✅ Production Ready
