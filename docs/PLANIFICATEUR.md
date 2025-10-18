# 🎨 Planificateur de Terrain - Documentation Complète

Le planificateur de terrain permet de disposer les arbres et arbustes sur un plan 2D en respectant toutes les contraintes réglementaires et botaniques.

---

## 🎯 Fonctionnalités Actuelles

### ✅ Validation Réglementaire Automatique

Toutes les distances sont extraites automatiquement depuis `arbustesData.js` et vérifiées en temps réel :

- **Fondations** : Distance minimale par rapport à la maison
- **Canalisations** : Protection des conduites souterraines
- **Limites/Voisinage** : Conformité au Code Civil Art. 671
- **Entre arbres** : Espacement pour éviter la concurrence
- **Terrasses** : Distances de sécurité
- **Piscine** : Zones d'exclusion autour des bassins

### ✅ Représentation Visuelle Réaliste

- **Ellipses** : largeur = envergure, hauteur = hauteur à maturité
- **Dimensions affichées** : ex. "6-8m × 8-10m"
- **Nom de l'arbre** : visible en dessous de chaque ellipse
- **Couleurs de validation** :
  - 🟢 **VERT** : Conforme (toutes distances respectées)
  - 🟠 **ORANGE** : Attention (proche des limites mais légal)
  - 🔴 **ROUGE** : Problème (non conforme à la réglementation)

### ✅ Auto-Placement Intelligent

- Algorithme de recherche sur grille (pas de 2m)
- Vérification de TOUTES les contraintes
- Placement optimal dès l'ouverture
- Fallback si aucune position valide trouvée

### ✅ Conseils Contextuels

Nouveaux conseils ajoutés basés sur :
- **Système racinaire** : agressivité (Faible/Modérée/Élevée)
- **Exposition** : besoins en soleil vs orientation du terrain
- **Arrosage** : régulier/abondant → proximité point d'eau
- **Sol** : humidité (frais/humide) → éviter zones sèches

### ✅ Sauvegarde Automatique

- LocalStorage (spécifique au navigateur)
- Horodatage des modifications
- Rechargement automatique au retour
- Bouton 💾 pour vérifier l'état

### ✅ Import de Plan de Fond

Vous pouvez importer un plan existant (Kazaplan, etc.) comme arrière-plan :

**Fonctionnalités** :
- ✅ **Import d'image** : PNG, JPG, JPEG acceptés
- ✅ **Ajustement automatique** : L'image s'adapte au canvas
- ✅ **Opacité réglable** : Slider 0-100% pour transparence
- ✅ **Repositionnement** : Déplacer, redimensionner, pivoter
- ✅ **Non-exportée** : L'image reste en arrière-plan

**Mode d'emploi** :
1. Préparer votre plan (capture d'écran ou export)
2. Dans le planificateur : Section "📷 Plan de Fond"
3. Cliquer "📷 Charger Image" et sélectionner fichier
4. Ajuster opacité (recommandé : 40-60%)
5. Positionner/redimensionner l'image
6. Tracer par-dessus avec les outils normaux

**Conseil** : Verrouillez l'image (clic droit > 🔒) une fois positionnée

---

## 💡 Améliorations Futures (V2)

### 1. 🎨 Zones de Contraintes Visuelles

**Halos colorés permanents sur le plan :**
- 🔴 Rouge (0-5m) : Zone interdite autour maison
- 🟠 Orange (5-6m) : Zone attention
- 🟡 Jaune : Bande 2m le long des clôtures
- 🔵 Bleu : 6m autour des fosses septiques

**Implémentation :**
- Halos dégradés autour de chaque obstacle
- Opacité 20% pour ne pas masquer le plan
- Recalculés dynamiquement
- Toggle on/off pour ne pas surcharger

**Avantages :**
- Vision immédiate des zones interdites
- Placement intuitif (éviter le rouge)
- Comme un "jeu" (zones safe/danger)

### 2. 📏 Lignes de Mesure Visuelles

**Affichage des distances en temps réel :**
- Lignes pointillées avec cotes annotées
- Zones d'exclusion colorées autour des obstacles
- Rayon de sécurité visible

### 3. ✨ Mode "Smart Placement" - IA Visuelle

**Bouton magique : "✨ Placement Optimal"**

Fonctionnalité :
1. Analyser TOUT le terrain
2. Calculer score pour chaque position (grille 0.5m)
3. Afficher heatmap colorée :
   - 🟢 Vert foncé = Excellent
   - 🟡 Jaune = Acceptable
   - 🔴 Rouge = Déconseillé
4. Proposer TOP 5 emplacements avec étoiles ⭐
5. Clic sur une étoile → placer l'arbre automatiquement

**Critères de scoring :**
- Distance infrastructures (40%)
- Exposition soleil (20%)
- Compatibilité sol (15%)
- Espace disponible (15%)
- Harmonie avec autres arbres (10%)

### 4. ⏱️ Timeline de Croissance

**Slider temporel : 0 → 5 → 10 → 20 ans → Maturité**

Visualisation :
- **Année 0** : Petit cercle (jeune plant)
- **5 ans** : Ellipse 50% de la taille finale
- **10 ans** : Ellipse 75%
- **Maturité** : Ellipse 100% (actuelle)

**Données utilisées :**
- `arbre.croissance` : "Moyenne (30-40 cm/an)"
- Calcul automatique : 30cm/an × 10 ans = 3m
- Animation smooth entre les étapes

**Bénéfice :** Planification à long terme, anticiper l'évolution

### 5. 🌤️ Calcul de l'Ombre Portée

**Projection de l'ombre selon orientation + heure/saison**
- Zones ensoleillées/ombragées sur le plan
- Slider heure (6h → 20h) + saison (été/hiver)
- Recommandations selon exposition requise par l'arbre

**Formule soleil :**
```
Hauteur soleil (h) = sin(latitude) × sin(déclinaison) + cos(latitude) × cos(déclinaison) × cos(angle_horaire)
Longueur ombre = Hauteur_arbre / tan(h)
```

**Application :**
- Vérifier si arbre ombrage terrasse en été
- Optimiser exposition pour plantes héliophiles
- Éviter ombre excessive sur potager

### 6. 📊 Dashboard Statistiques Temps Réel

**Panneau latéral avec métriques :**
- Nombre d'arbres placés / total prévu
- Surface ombragée totale (m²)
- Taux de conformité réglementaire
- Coût total estimé (plants + plantation)
- Entretien annuel estimé (heures)
- Biodiversité (score pollinisateurs)

### 7. 🎓 Tutoriel Interactif (Onboarding)

**Premier lancement : Guide pas-à-pas**
1. "Bienvenue ! Commencez par définir votre terrain"
2. "Ajoutez votre maison en cliquant ici"
3. "Choisissez un arbre dans la palette"
4. "Placez-le sur le plan - les zones colorées vous guident"
5. "Bravo ! Votre premier arbre est conforme 🎉"

**Format :** Tooltips fléchés, highlight zones interactives, skip possible

### 8. 🌡️ Compatibilité Climatique Locale

**Intégration API météo (Bessancourt) :**
- Températures moyennes annuelles
- Pluviométrie mensuelle
- Gel tardif / canicules
- Score de compatibilité pour chaque espèce

**Exemple :**
```
Érable rouge : ⚠️ 45% compatibilité
- Sol calcaire Bessancourt incompatible
- Rusticité OK (-30°C)
→ DÉCONSEILLÉ pour cette région
```

### 9. 💾 Export et Partage

**Fonctionnalités :**
- Export PNG haute résolution (impression A4)
- Export PDF avec légende et conseils
- Export JSON (sauvegarde/import)
- Lien de partage (URL courte)
- QR code pour mobile

### 10. 📱 Mode Réalité Augmentée (Mobile)

**Visualisation in-situ :**
- Scanner le terrain avec la caméra
- Superposer les arbres en 3D
- Voir hauteur réelle à maturité
- Prendre photos pour validation

---

## 🛠️ Architecture Technique

### Fichiers Clés

- **`CanvasTerrain.jsx`** : Composant principal du planificateur (3500+ lignes)
- **`CanvasTerrain.css`** : Styles du planificateur
- **`planificateurConfig.js`** : Configuration des validations et contraintes
- **`arbustesData.js`** : Données botaniques centralisées

### Validation Logic

```javascript
// Extraction automatique des distances depuis les données
const distanceMinFondations = arbre.reglementation.distancesLegales.infrastructures.fondations;
const distanceMinVoisinage = arbre.reglementation.distancesLegales.voisinage.distance;

// Validation temps réel
function validerPosition(x, y, arbre) {
  // Vérifier distance maison
  // Vérifier distance limites
  // Vérifier distance autres arbres
  // Vérifier distance canalisations
  return { valide: true/false, erreurs: [], conseils: [] };
}
```

### Auto-Placement Algorithm

```javascript
function autoPlacerArbre(arbre) {
  const pas = 2; // grille de 2m
  for (let x = 0; x < terrainLargeur; x += pas) {
    for (let y = 0; y < terrainHauteur; y += pas) {
      if (validerPosition(x, y, arbre).valide) {
        return { x, y }; // Première position valide trouvée
      }
    }
  }
  return null; // Aucune position valide
}
```

---

## 📚 Ressources Complémentaires

- **Code Civil Art. 671** : Distances légales de plantation
- **DTU 32.1** : Travaux d'aménagement paysager
- **CAUE** : Conseils architecturaux et paysagers
- **Forum Jardin** : Retours d'expérience utilisateurs

---

**Dernière mise à jour :** 18 octobre 2025

