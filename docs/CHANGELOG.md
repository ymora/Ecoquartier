# 📝 Changelog

## [1.0.1] - 2025-10-15

### 📚 Organisation Documentation

**Restructuration Complète**
- Tous les guides déplacés dans `docs/`
- Suppression des fichiers temporaires d'audit et d'optimisation
- Consolidation des CHANGELOG
- Structure documentaire claire et maintenable

**Fichiers Déplacés**
- `AUDIT_CODE.md` → `docs/AUDIT_SECURITE.md`
- `GUIDE_ADMIN_INTERFACE.md` → `docs/GUIDE_ADMIN.md`
- `GUIDE_RAPIDE_ADMIN.md` → `docs/GUIDE_RAPIDE_ADMIN.md`
- `OUTILS_DISPONIBLES.md` → `docs/OUTILS.md`

**Fichiers Supprimés**
- `AUDIT_CODE_ADMIN.md` (tâche terminée)
- `AUDIT_RESUME.txt` (doublon)
- `OPTIMISATION_FINALE.txt` (tâche terminée)
- `CHANGELOG_ADMIN.txt` (consolidé)
- `admin/README.md` (doublon)

---

## [1.0.0] - 2025-01-14

### Interface Admin - Refonte Complète

**🎨 Thème Cohérent**
- Adaptation au thème de l'application principale
- Fond clair (#fafbfc) au lieu de dark (#1a1a2e)
- Blanc pour sections (#ffffff)
- Vert pâle pour tertiary (#f0f7f2)
- Texte sombre (#2c3e50) au lieu de clair
- Bordures subtiles (#d4e4d7)
- Ombres légères

**🔧 Corrections**
- Route GET `/images_completes.json` ajoutée
- Fix fetch('/images_completes.json')
- Correction injection Git
- Échappement innerHTML pour sécurité XSS

**🎉 Nouvelle Structure UX**
1. FILTRES (Espèce + Type) → Affichage instantané
2. IMAGES EXISTANTES → Visualisation + Sélection multiple
3. UPLOAD → Zone compacte + File d'attente

**Fonctionnalités Admin**
- ✅ Filtrage en temps réel
- ✅ Sélection multiple (checkbox + clic)
- ✅ Suppression en lot
- ✅ Upload flexible (1 par 1 ou en masse)
- ✅ Détection auto espèce/type
- ✅ Statuts visuels (pending/uploading/success/error)
- ✅ Log temps réel
- ✅ Numérotation automatique +1
- ✅ Permutation de numéros
- ✅ Modal zoom plein écran
- ✅ Push GitHub automatique

**📊 Optimisations**
- Code mort supprimé (-205 lignes, -8%)
- Code 100% fonctionnel
- Performance améliorée
- Maintenance simplifiée

---

## [1.0.0] - 2025-01-13

### Version Initiale Complète

Application React moderne pour la documentation des haies de l'écocartier de Bessancourt.

#### ✨ Fonctionnalités

**Plantes Documentées**
- 3 arbres (Cerisiers japonais : Kanzan, Accolade, Sunset Boulevard)
- 6 arbustes (Noisetier, Fusain, Troène, Osmanthe, Cornouiller, Seringat)

**Informations par Plante**
- Fiche botanique complète (floraison, fruits, feuillage, rusticité)
- Calendrier annuel d'entretien (12 mois)
- Biodiversité et valeur écologique
- Avertissements toxicité
- **NOUVEAU** : Réglementation et distances légales

**⚖️ Réglementation** (Fonctionnalité Majeure)
- Système racinaire détaillé (type, profondeur, étalement, agressivité)
- Risques potentiels (infrastructures, voisinage)
- Distances légales (Code Civil Article 671-673)
  - Voisinage : 0.5m ou 2m selon hauteur
  - Espaces publics (PLU)
  - Entre arbres/arbustes
  - Infrastructures (fondations, canalisations, fosses, terrasses)
- Sanctions en cas de non-respect
- Conseils pratiques personnalisés

**🔍 Mode Comparaison**
- Comparaison 2-3 plantes côte à côte
- Tableau comparatif avec 10+ critères
- Photos défilantes pour chaque plante
- Toxicité avec code couleur
- Accessible via bouton [🔍 Comparer]

**Interface**
- Thème clair naturel (blanc/vert)
- Images de fond (title-background.png + wood-background.jpg)
- Navigation déployable (Arbres vs Arbustes)
- 6 onglets : Général, Plantation, Entretien, Réglementation, Calendrier, Biodiversité
- Galerie photos interactive (zoom, navigation clavier ← →)
- Responsive mobile, tablette, desktop

#### 🔧 Technique
- React 18 + Vite
- 8 composants modulaires (+ Comparateur)
- Build optimisé : 77 KB gzippé
- Lazy loading des images
- Code splitting (React + Icons)
- SEO complet (meta tags, sitemap, robots.txt)
- Accessibilité WCAG (navigation clavier, ARIA)
- API PHP sécurisée

#### 📥 Système Images
- Fichier JSON pour URLs (`images_completes.json`)
- Script téléchargement automatique Python
- Interface admin pour gestion images
- Détection automatique espèce/type
- Push GitHub automatique

#### 🐛 Corrections
- Bug PHP corrigé (paramètre directory)
- Données botaniques corrigées (tailles, espèces précisées)
- Fusain : taille 1-3m → 3-6m corrigée
- Floraison, fructification, toxicité ajoutées
- Sécurité renforcée (validation stricte, headers CSP)
- Code mort supprimé (100%)
- Doublons éliminés (100%)

---

**Version actuelle** : 1.0.1  
**Build** : 77 KB gzippé (49 modules)  
**Statut** : ✅ Production Ready
