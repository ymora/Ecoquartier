# Structure de CanvasTerrain.jsx

## 📊 Vue d'ensemble

**Fichier** : `client/src/components/CanvasTerrain.jsx`  
**Lignes** : ~3500  
**Rôle** : Composant principal du planificateur de terrain interactif

---

## 📁 Organisation du code

### 1. IMPORTS & CONFIGURATION (lignes 1-30)
- Imports React, Fabric.js, composants
- States (17 states pour gérer l'interface)
- Refs (canvas, tooltip, menu contextuel)
- Constante `echelle = 40` (40px = 1m)

### 2. INITIALISATION CANVAS (lignes 31-350)
- `useEffect` principal : création du canvas Fabric.js
- Calcul dimensions (viewport - header - timeline)
- Événements canvas :
  - `object:moving` → Snap-to-grid + snap magnétique
  - `object:modified` → Consolidé (guides, export, validation)
  - `object:scaling` → Mesures live
  - `selection:created/updated/cleared` → Menu + panneau validation
  - `mouse:dblclick` → Points intermédiaires lignes

### 3. TIMELINE & CROISSANCE (lignes 351-460)
- `useEffect` anneeProjection
- Redimensionnement arbres selon âge
- Accès `_objects[]` pour ellipse, emoji, labels
- Try/catch pour robustesse

### 4. DRAG & DROP PANNEAUX (lignes 461-560)
- Menu contextuel déplaçable
- Panneau validation déplaçable
- EventListeners mousedown/move/up

### 5. AFFICHAGE & VALIDATION (lignes 561-1200)
- `afficherMenuContextuel()` → Bulle lock/delete
- `afficherTooltipValidation()` → Panneau latéral avec infos arbre
- `afficherCercleTronc()` → Cercle rouge tronc pendant drag
- `afficherLignesMesure()` → Lignes rouges pointillées vers obstacles
- `cacherTooltipValidation()` et `cacherCercleTronc()`

### 6. ACTIONS UTILISATEUR (lignes 1201-1250)
- `supprimerObjetActif()` → Delete key
- `supprimerSelection()` → Bouton poubelle
- `verrouillerSelection()` / `deverrouillerTout()`
- `effacerTout()` → Reset canvas

### 7. ZONES & CONTRAINTES (lignes 1251-1400)
- `afficherZonesContraintes()` → Halos rouges/orange/jaunes
- Zones autour maison, citernes, clôtures
- `afficherOmbreMaison()` → Ombre portée selon saison + hauteur

### 8. VALIDATION ARBRES (lignes 1401-1640)
- `validerPositionArbre()` → Fonction CRITIQUE
  - Vérification distances légales (voisinage, fondations, canalisations)
  - Validation 3D (profondeur racines vs fondations/tuyaux)
  - Vérification sol (type, pH, drainage)
  - Classification : problèmes (rouge) / avertissements (orange) / OK (vert)
  - Changement couleur ellipse via `_objects[0]`

### 9. CALCULS TAILLES & PLACEMENT (lignes 1641-1430)
- `calculerTailleSelonAnnee()` → Croissance réaliste
  - Tailles plantation vs maturité
  - Croissance rapide/moyenne/lente
  - Pourcentages selon années
- `trouverPositionValide()` → Placement automatique intelligent
  - Grille de recherche (tous les 2m)
  - Score : proximité centre, distance obstacles, espacement arbres
  - Retourne meilleure position

### 10. HELPERS GÉOMÉTRIQUES (lignes 1431-1470)
- `calculerDistanceRectangle()` → Point vs rectangle
- `calculerDistanceLigne()` → Point vs ligne
- `trouverPointPlusProcheMaison()` et `trouverPointPlusProcheLigne()`

### 11. AJOUT ARBRES DEPUIS COMPARATEUR (lignes 1740-1880)
- `useEffect` arbresAPlanter
- Comparaison IDs existants vs à planter
- Suppression anciens + ajout nouveaux
- Placement automatique via `trouverPositionValide()`
- Logs détaillés pour debug

### 12. PLAN PAR DÉFAUT (lignes 1950-2090)
- `creerPlanParDefaut()` → Clôture 25×15m + Maison 10×10m + Pavés 5×5m
- Adapté à la taille du canvas
- `useEffect` chargement automatique au démarrage

### 13. BOUSSOLE/INDICATEUR SUD (lignes 2270-2420)
- `ajouterIndicateurSud()` → Soleil orange draggable
- Calcul orientation selon position
- Événements moving/modified/mouseup pour drag

### 14. GRILLE (lignes 2421-2470)
- `ajouterGrille()` → Lignes vertes tous les 1m
- Lignes épaisses tous les 5m

### 15. EXPORT/IMPORT PLAN (lignes 2470-2770)
- `exporterPlan()` → Sauvegarde localStorage
- `chargerPlanSauvegarde()` → Chargement au démarrage
- Filtrage objets UI (grille, boussole, mesures)
- JSON stringify des données

### 16. CRÉATION OBJETS UTILISATEUR (lignes 2775-3100)
- `ajouterMaison()` → Maison 10×10m avec label
- `ajouterCanalisation()` → Ligne grise
- `ajouterCiterne()` → Rectangle bleu citerne/fosse
- `ajouterCloture()` → Ligne jaune pointillée
- `ajouterTerrasse()` → Rectangle beige
- `ajouterPaves()` → Rectangle vert clair
- `ajouterArbreExistant()` → Cercle vert avec emoji

### 17. ÉDITION AVANCÉE (lignes 3100-3200)
- `ajouterPointIntermediaire()` → Double-clic sur ligne pour courber
- `ajouterMesuresLive()` → Labels dimensions sur objets
- Édition mesures au clic

### 18. IMAGE DE FOND (lignes 2660-2770)
- `chargerImageFond()` → File input PNG/JPG
- `ajusterOpaciteImage()` → Slider opacité
- `supprimerImageFond()` → Retirer image
- Placement position 0 (sous grille)

### 19. RENDER JSX (lignes 3361-3670)
- Panneau latéral unifié (onglets Outils/Stats)
- Panneau validation (déplaçable)
- Canvas HTML
- Menu contextuel
- Timeline croissance (slider années)

---

## 🎯 Fonctions principales (par ordre d'importance)

1. **`validerPositionArbre()`** - CRITIQUE (validation 3D + légale)
2. **`calculerTailleSelonAnnee()`** - Croissance réaliste
3. **`trouverPositionValide()`** - Placement automatique intelligent
4. **`afficherTooltipValidation()`** - Panneau latéral infos arbre
5. **`afficherZonesContraintes()`** - Halos visuels
6. **`exporterPlan()` / `chargerPlanSauvegarde()`** - Persistance
7. **`creerPlanParDefaut()`** - Plan initial
8. **`ajouterGrille()`** - Grille visuelle
9. **Fonctions `ajouter**()`** - Création objets (10 fonctions)

---

## 🔧 Points de maintenance

### Si besoin modifier la validation :
→ Ligne 1436 : `validerPositionArbre()`

### Si besoin modifier la croissance :
→ Ligne 1641 : `calculerTailleSelonAnnee()`

### Si besoin ajouter un type d'objet :
→ Ligne 2775+ : Créer fonction `ajouter**()`
→ Ligne 3380+ : Ajouter bouton dans JSX

### Si besoin modifier les zones :
→ Ligne 1008 : `afficherZonesContraintes()`

### Si besoin modifier le plan par défaut :
→ Ligne 1956 : `creerPlanParDefaut()`

---

## 💡 Recommandations futures

**Si refactorisation nécessaire (>4000 lignes) :**

1. Créer `utils/canvas/creerObjets.js` :
   - Toutes les fonctions `ajouter*()`
   - ~500 lignes

2. Créer `utils/canvas/validation.js` :
   - `validerPositionArbre()`
   - `afficherLignesMesure()`
   - `afficherTooltipValidation()`
   - ~300 lignes

3. Créer `utils/canvas/zones.js` :
   - `afficherZonesContraintes()`
   - `afficherOmbreMaison()`
   - ~200 lignes

4. Créer `utils/canvas/planPersistence.js` :
   - `exporterPlan()`
   - `chargerPlanSauvegarde()`
   - `creerPlanParDefaut()`
   - ~300 lignes

**CanvasTerrain.jsx final : ~2000 lignes**

---

## 📝 Notes importantes

- **Échelle** : 40px = 1m (configurable ligne 12)
- **Accès groupe Fabric.js** : Toujours `_objects[]` et JAMAIS `.item()`
- **Événement `object:modified`** : UN SEUL gestionnaire (ligne 158)
- **Doublons** : Aucun événement en doublon autorisé
- **Logs** : Utiliser `logger` pour debug

