# 📝 Changelog

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
- Fichier JSON pour URLs (`images_urls.json`)
- Script téléchargement automatique (PowerShell)
- Script copie images nommées
- Script renommage interactif
- Prompt ChatGPT optimisé
- Vérification automatique des images

#### 🐛 Corrections
- Bug PHP corrigé (paramètre directory)
- Données botaniques corrigées (tailles, espèces précisées)
- Fusain : taille 1-3m → 3-6m corrigée
- Floraison, fructification, toxicité ajoutées
- Sécurité renforcée (validation stricte, headers CSP)
- Code mort supprimé (100%)
- Doublons éliminés (100%)

---

**Version actuelle** : 1.0.0  
**Build** : 77 KB gzippé (49 modules)  
**Statut** : ✅ Production Ready
