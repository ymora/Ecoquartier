# 📝 Changelog

## [1.1.0] - 2025-10-17 🎉 REFACTORING MAJEUR

### 🌳 Ajout de 2 nouveaux arbres

**Arbre de Judée** (Cercis siliquastrum)
- Floraison cauliflore spectaculaire (fleurs sur tronc)
- Fleurs comestibles
- Adore le calcaire - Parfait Île-de-France
- ⚠️ NE JAMAIS tailler ni déplacer
- 200+ lignes de données complètes

**Érable rouge** (Acer rubrum)
- Couleurs automnales exceptionnelles (rouge écarlate)
- ⚠️ SOL ACIDE impératif - Bessancourt inadapté (sols calcaires)
- ⚠️ Racines TRÈS problématiques (superficielles, étendues 12-18m)
- Réservé GRANDS jardins >400m²
- 230+ lignes de données complètes

**Total : 11 espèces** (5 arbres + 6 arbustes)

---

### 🔄 REFACTORING COMPLET : Centralisation des Données

**MIGRATION MAJEURE** : 3 fichiers → 1 fichier unique

**Avant (architecture dispersée)** :
```
client/src/data/
├── arbustesData.js              (~900 lignes)
├── reglementationData.js        (~450 lignes)
└── informationsComplementaires.js (~850 lignes)
```

**Après (architecture centralisée)** :
```
client/src/data/
└── arbustesData.js              (~2100 lignes - TOUT centralisé)
```

**Avantages** :
- ✅ 1 seul fichier à modifier pour ajouter un arbre (vs 3)
- ✅ 0 risque d'oubli → Plus jamais d'onglets vides
- ✅ Structure claire avec commentaires séparateurs
- ✅ Maintenance simplifiée (division du risque d'erreur par 3)

**Travail effectué** :
- ✅ Migration de 11 plantes (5 arbres + 6 arbustes)
- ✅ ~1200 lignes de données consolidées
- ✅ 2 fichiers supprimés
- ✅ 2 composants adaptés (ArbusteDetail.jsx, Comparateur.jsx)
- ✅ 103 références mises à jour
- ✅ Build réussi - 0 erreurs

---

### 📊 Comparateur : +7 nouveaux critères

**Enrichissement massif du mode comparaison** :

**Nouveaux critères ajoutés** :
1. 🌳 **Distance entre arbres** (planning plantation)
2. 🏊 **Distance piscine** (infrastructures)
3. 🏡 **Distance terrasse** (infrastructures)
4. ⚠️ **Risques racines** (top 3 risques détaillés)
5. 🌱 **Fertilisation** (besoins, période, fréquence)
6. ❄️ **Protection hivernale** (adulte vs jeunes plants)
7. ⭐ **Spécificités** (particularités uniques : cauliflorie, sol acide, etc.)

**Total : 20 critères** (vs 13 avant = +54% de données exploitées)

**Toutes les données disponibles sont maintenant exploitées dans le comparateur !**

---

### 🛠️ Autres mises à jour

**Admin** :
- ✅ Ajout arbre-judee dans liste espèces
- ✅ Ajout erable-rouge dans liste espèces
- ✅ Keywords pour recherche

**Images** :
- ✅ Dossiers créés : `client/public/images/arbre-judee/`
- ✅ Dossiers créés : `client/public/images/erable-rouge/`
- ✅ Dossiers créés : `images/arbre-judee/`
- ✅ Dossiers créés : `images/erable-rouge/`
- ✅ README.txt guide photos dans chaque dossier
- ✅ `images.json` mis à jour

**SEO** :
- ✅ `sitemap.xml` mis à jour (11 espèces + arbres Prunus)
- ✅ `dist/sitemap.xml` synchronisé

**Documentation** :
- ✅ `docs/REFACTORING_STRUCTURE_DONNEES.md` - Explication refactoring
- ✅ `docs/CENTRALISATION_DONNEES_COMPLETE.md` - Rapport complet
- ✅ `docs/RESUME_AJOUTS_CENTRALISATION.md` - Résumé détaillé  
- ✅ `docs/GUIDE_AJOUT_NOUVEL_ARBRE.md` - Guide pratique ajout futurs arbres
- ✅ `README.md` - Mise à jour fonctionnalités

**Sauvegarde** :
- ✅ `client/src/data/arbustesData.js.backup` - Version avant refactoring

---

### 📈 Impact

| Métrique | Avant | Après | Amélioration |
|----------|-------|-------|--------------|
| **Espèces** | 9 | 11 | +22% 🌳 |
| **Arbres** | 3 | 5 | +67% 🌳 |
| **Fichiers données** | 3 | 1 | -66% ✅ |
| **Critères Comparateur** | 13 | 20 | +54% 📊 |
| **Risque d'erreur** | Élevé | Faible | -66% ✅ |
| **Lignes arbustesData.js** | 900 | 2100 | +133% |
| **Maintenabilité** | Moyenne | **Excellente** | ⭐⭐⭐ |

---

### ⚠️ BREAKING CHANGES

**Fichiers supprimés** :
- `client/src/data/reglementationData.js`
- `client/src/data/informationsComplementaires.js`

**Si vous avez des branches en cours** :
- Les imports de ces fichiers ne fonctionneront plus
- Utiliser la nouvelle structure consolidée dans `arbustesData.js`
- Voir `docs/GUIDE_AJOUT_NOUVEL_ARBRE.md` pour la nouvelle procédure

**Migration automatique** : Tous les composants ont été adaptés automatiquement.

---

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
