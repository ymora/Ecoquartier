# 🔍 AUDIT COMPLET DES COMPOSANTS - `src/components/`

## 📊 RÉSUMÉ
- **Total fichiers**: ~45 composants React + CSS
- **Composants 3D**: 16 fichiers dans `3d/`
- **Structure**: Organisé mais présence de code mort et doublons potentiels

---

## ❌ CODE MORT IDENTIFIÉ

### 1. `PlanificateurTerrain.jsx` + `OnboardingPlanificateur.jsx`
- **Statut**: ❌ **JAMAIS IMPORTÉ**
- **Usage**: Ancien composant remplacé par `Comparateur` avec `modePlanification`
- **Action**: ✅ **À SUPPRIMER**

### 2. `canvas/CanvasControls.jsx`
- **Statut**: ❌ **JAMAIS IMPORTÉ**
- **Action**: ✅ **À VÉRIFIER puis SUPPRIMER si inutile**

### 3. `ui/` (dossier vide)
- **Statut**: ❌ **VIDE**
- **Action**: ✅ **À SUPPRIMER**

### 4. `SectionConfig.jsx` et `SectionOutils.jsx`
- **Statut**: ⚠️ **DÉJÀ INTÉGRÉ DANS PanneauLateral.jsx**
- **Problème**: Ces composants existent mais ne sont jamais importés
- **Action**: ✅ **À SUPPRIMER** (code déjà dans PanneauLateral directement)

---

## 🔄 DOUBLONS / SIMILARITÉS

### 1. **Composants 3D similaires** (`3d/`)
Tous suivent un pattern similaire mais sont justifiés :
- ✅ `Maison3D.jsx`, `Citerne3D.jsx`, `Caisson3D.jsx`, `Cloture3D.jsx`, `Canalisation3D.jsx`
- ✅ Chacun a une géométrie unique → **Pas de doublon, OK**

### 2. **Arbre3D vs Arbre3DModel**
- `Arbre3D.jsx`: Génération procédurale
- `Arbre3DModel.jsx`: Chargement GLB avec fallback vers Arbre3D
- ✅ **Pas doublon, logique de fallback** → **OK**

### 3. **SelectionRing3D**
- ✅ **DÉJÀ UNIFIÉ** dans session précédente
- ✅ Utilisé partout pour anneaux de sélection → **OK**

### 4. **GaugeHeure + TimelineSection**
- Utilisés dans `CanvasTerrain.jsx` pour la timeline
- ✅ **Pas de doublon, OK**

---

## 📁 STRUCTURE À AMÉLIORER

### Problèmes actuels :
1. **PanneauLateral.jsx** (1920 lignes !)
   - ⚠️ **TROP GROS** : Devrait être découpé
   - Contient logique outils + config + sélection
   - **Suggestion**: Extraire dans `panneau/SectionOutils.jsx` et `panneau/SectionConfig.jsx` (mais ces fichiers existent déjà mais ne sont pas utilisés !)

2. **CanvasTerrain.jsx** (1159 lignes)
   - ⚠️ **GROS mais justifié** (orchestration 2D/3D)
   - Contient beaucoup de logique métier
   - **OK pour l'instant**, mais pourrait extraire hooks personnalisés

3. **Comparateur.jsx**
   - Gère mode comparaison + planification
   - **OK**, structure cohérente

---

## ✅ COMPOSANTS BIEN STRUCTURÉS

### Composants principaux (utilisés) :
- ✅ `Navigation.jsx` - Navigation principale
- ✅ `ArbusteDetail.jsx` - Fiches détaillées (lazy loaded)
- ✅ `Comparateur.jsx` - Mode comparaison/planification (lazy loaded)
- ✅ `CanvasTerrain.jsx` - Vue 2D principale
- ✅ `CanvasTerrain3D.jsx` - Vue 3D (lazy loaded)
- ✅ `PanneauLateral.jsx` - Panneau outils/config (trop gros mais fonctionnel)
- ✅ `ErrorBoundary.jsx` - Gestion d'erreurs
- ✅ `LogViewer.jsx` - Debug
- ✅ `Disclaimer.jsx` - Disclaimer légal
- ✅ `ModeSelector.jsx` - Sélecteur de mode

### Composants utilitaires :
- ✅ `GaugeHeure.jsx` - Jauge heure
- ✅ `TimelineSection.jsx` - Section timeline
- ✅ `FiabiliteBadge.jsx` - Badge fiabilité
- ✅ `SolInteractif.jsx` - Configuration sol (utilisé dans PanneauLateral)
- ✅ `SelecteurArbres.jsx` - Sélecteur arbres (utilisé dans Comparateur)
- ✅ `ImageGallery.jsx` - Galerie images
- ✅ `Icon.jsx` + `icons/ModernIcons.jsx` - Icônes

---

## 🎯 ACTIONS RECOMMANDÉES

### 🔴 URGENT (Code mort)
1. **Supprimer** `PlanificateurTerrain.jsx`
2. **Supprimer** `OnboardingPlanificateur.jsx`
3. **Supprimer** `canvas/CanvasControls.jsx` (si non utilisé)
4. **Supprimer** dossier `ui/` (vide)
5. **Supprimer** `panneau/SectionConfig.jsx` et `SectionOutils.jsx` (déjà intégrés dans PanneauLateral)

### 🟡 AMÉLIORATION (Refactoring)
1. **Découper PanneauLateral.jsx** (1920 lignes → max 500 lignes)
   - Extraire sections dans `panneau/SectionOutils.jsx` et `SectionConfig.jsx` (réutiliser les fichiers existants !)
   - Ou créer `panneau/SectionConfigActuelle.jsx` et `SectionOutilsActuelle.jsx`

2. **Vérifier** si `DashboardTerrain.jsx` est utilisé
   - Si non → supprimer
   - Si oui → vérifier si logique peut être intégrée dans PanneauLateral

### 🟢 OPTIMISATION (Plus tard)
- Extraire hooks personnalisés de `CanvasTerrain.jsx` si nécessaire
- Centraliser styles CSS communs

---

## 📈 STATISTIQUES

- **Composants actifs**: ~35
- **Composants morts**: ~5-7
- **Taux de code mort**: ~15%
- **Fichiers trop gros (>1000 lignes)**: 2 (CanvasTerrain, PanneauLateral)

---

## ✅ CONCLUSION

**Structure globale**: ✅ **BONNE** mais présence de code mort à nettoyer

**Priorités**:
1. 🔴 Supprimer code mort (PlanificateurTerrain, OnboardingPlanificateur, CanvasControls, ui/)
2. 🟡 Refactoriser PanneauLateral (découpage)
3. 🟢 Optimisations futures

