# ⚙️ FONCTIONNALITÉS COMPLÈTES - Planificateur 2D/3D

Documentation technique de toutes les fonctionnalités.

---

## 📐 PLANIFICATEUR 2D

### Vue d'Ensemble

**Canvas interactif** permettant de :
- Planifier l'emplacement des arbres
- Placer structures (maison, terrasse, citernes)
- Valider distances légales en temps réel
- Projeter la croissance (0-20 ans)
- Visualiser ombres portées

### Fonctionnalités Principales

#### 1. Placement Intelligent

**Auto-placement** :
- Algorithme de recherche de positions valides
- Respect automatique des distances légales
- Optimisation du score (éloignement obstacles)
- Grille de recherche (tous les 1m)

**Placement manuel** :
- Drag & drop libre
- Validation temps réel
- Feedback visuel (couleur arbre)
- Snap magnétique (accrochage 10cm)

#### 2. Validation Réglementaire

**Distances vérifiées** :
- **Voisinage** : Code Civil Art. 671 (2m mini)
- **Fondations** : 5m mini (selon espèce)
- **Canalisations** : 4m mini
- **Fosses septiques** : 6m mini
- **Entre arbres** : 5m mini
- **Clôtures** : Tronc ne doit pas dépasser

**Validation 3D** :
- Profondeur racines vs fondations
- Profondeur racines vs canalisations
- Racines vs citerne
- Visuel 3D des conflits

#### 3. Timeline (Projection Temporelle)

**Slider 0-20 ans** :
- Année 0 : Plantation (H:2m, Ø:0.8m, Tronc:5cm)
- Années 1-19 : Croissance progressive
- Année 20+ : Maturité atteinte

**Calculs croissance** :
- Basés sur vitesse croissance (cm/an)
- Rapide : 50cm/an, Maturité 10-15 ans
- Moyenne : 30cm/an, Maturité 15-20 ans
- Lente : 15cm/an, Maturité 20-30 ans

**Affichage** :
- Taille couronne ajustée
- Taille tronc ajustée
- Label mis à jour avec % maturité

#### 4. Zones Contraintes

**Visualisation** :
- 🔴 Zone rouge : Distance minimale légale
- 🟠 Zone orange : Zone attention (+1m)
- 🟡 Zone jaune : Clôtures (±2m)
- 🔵 Zone bleue : Citernes/fosses (6m)

**Toggle** : Bouton 👁️ dans outils

#### 5. Ombre Portée

**Calcul** selon saison (latitude 49°N) :
- ❄️ **Hiver** (21 déc) : Angle 18° → Ombre longue
- 🌸 **Printemps** (21 mars) : Angle 45° → Ombre moyenne  
- ☀️ **Été** (21 juin) : Angle 65° → Ombre courte
- 🍂 **Automne** (21 sept) : Angle 45° → Ombre moyenne

**Formule** : `Longueur ombre = Hauteur maison / tan(angle)`

**Direction** : Toujours vers le NORD (soleil au sud à midi)

#### 6. Export/Import

**Export** :
- Sauvegarde automatique dans localStorage
- Format JSON
- Inclut : objets, arbres, dimensions, orientation

**Import** :
- Chargement automatique au démarrage
- Bouton "Charger plan" pour réinitialiser

#### 7. Image de Fond

**Usage** :
- Charger plan existant (Kazaplan, etc.)
- Superposer pour tracer précisément
- Opacité ajustable (0-100%)
- Redimensionnable et déplaçable

---

## 🎮 VUE 3D

### Vue d'Ensemble

**Visualisation immersive** avec :
- Hauteurs réelles des bâtiments
- Profondeurs (fondations, racines, canalisations)
- Validation 3D des conflits
- Édition interactive

### Composants 3D

#### Arbre3D
**Éléments** :
- 🟤 Tronc (cylindre, hauteur selon espèce)
- 🟢 Couronne (sphère, diamètre selon envergure)
- 🟫 Racines (wireframe, profondeur selon données)

**Données** :
- Hauteur : `tailleMaturite` (ex: "6-10m")
- Envergure : `envergure` (ex: "4-6m")
- Profondeur racines : `reglementation.systemeRacinaire.profondeur`

#### Maison3D
**Éléments** :
- 🏠 Murs (box, couleur beige)
- 🔺 Toit (pyramide, couleur tuiles)
- 🟫 Fondations (wireframe gris, sous terre)

**Éditable** :
- Largeur, profondeur, hauteur
- Profondeur fondations (défaut 1.2m)

#### Sol3D
**Couches** :
- 🟤 Terre végétale (30cm, marron)
- 🟫 Marne calcaire (70cm, gris-beige)

**Éditable** : Profondeur et type de chaque couche

#### Canalisation3D
**Éléments** :
- 🔵 Tube (cylindre horizontal, gris)
- Profondeur éditable (défaut 0.6m)

#### Citerne3D
**Éléments** :
- 💧 Réservoir (cylindre, bleu semi-transparent)
- Profondeur, diamètre, volume éditables
- Wireframe si sous terre

#### Cloture3D
**Éléments** :
- 🟫 Poteaux (cylindres verticaux)
- 🟡 Fils (lignes jaunes)

### 4 Modes de Vue

#### 🎮 Perspective
- Vue libre 3D
- OrbitControls (rotation, zoom, pan)
- Vue d'ensemble immersive

#### 🔝 Dessus
- Caméra au-dessus (position Y haute)
- Vue de haut comme un plan
- Utile pour placement précis

#### 👉 Côté
- Caméra sur le côté (position X)
- Voir toutes les hauteurs
- Voir maison vs arbres

#### 📐 Coupe
- Vue en coupe transversale
- Voir toutes les profondeurs
- Voir racines vs fondations vs canalisations

### Édition Interactive

**Panneau Édition 3D** (clic sur objet) :

**Maison** :
- Largeur (m)
- Profondeur (m)
- Hauteur (m)
- Profondeur fondations (m)

**Citerne** :
- Diamètre (m)
- Profondeur (m)
- Volume (L) - Calculé automatiquement

**Toggle "Montrer sous-terre"** :
- ON : Voir racines, fondations, canalisations
- OFF : Cacher pour vue surface uniquement

### Validation 3D

**Couleurs** :
- 🟢 **Vert** : Aucun conflit
- 🟠 **Orange** : Proche mais OK
- 🔴 **Rouge** : Conflit détecté

**Exemples conflits** :
- Racines (1.5m prof.) + Fondations (1.2m prof.) + Distance 4m → 🔴 Rouge
- Racines touchent canalisation enterrée → 🔴 Rouge

---

## ✅ VALIDATION ET SOURCES

### Sources Réglementaires

#### Code Civil

**Article 671** :
> "Il n'est permis d'avoir des arbres, arbrisseaux et arbustes près de la limite de la propriété voisine qu'à la distance prescrite par les règlements particuliers actuellement existants, ou par des usages constants et reconnus et, à défaut de règlements et usages, qu'à la distance de deux mètres de la ligne séparative des deux héritages pour les plantations dont la hauteur dépasse deux mètres, et à la distance d'un demi-mètre pour les autres plantations."

**Application** :
- Arbre >2m : Minimum 2m de la limite
- Haie <2m : Minimum 0.5m de la limite
- **Sanction** : Voisin peut exiger arrachage

#### Distances Infrastructures

**Fondations** :
- Minimum 5m (arbres racines agressives)
- Minimum 3m (arbres racines modérées)
- Basé sur profondeur racines + profondeur fondations

**Canalisations** :
- Minimum 4m (racines agressives)
- Minimum 3m (racines modérées)
- Risque : Colmatage par racines

**Fosses septiques** :
- Minimum 6m (réglementation sanitaire)
- Risque : Contamination + colmatage

### Sources Botaniques

**Données espèces** :
- Kraüter.com (fiabilité ⭐⭐⭐⭐)
- FloreAlpes.com (fiabilité ⭐⭐⭐⭐⭐)
- Rustica.fr (fiabilité ⭐⭐⭐⭐)
- Jardiner-malin.fr (fiabilité ⭐⭐⭐)

**Réglementation** :
- Code Civil
- PLU Bessancourt
- DTU 13.3 (fondations)
- Norme NF P98-331 (canalisations)

### Algorithme Validation

```javascript
Pour chaque arbre {
  1. Extraire distances minimales depuis reglementation
  2. Calculer distance à chaque obstacle
  3. Comparer avec distances minimales
  4. Si conflit → Messages d'erreur
  5. Si proche → Messages d'avertissement
  6. Changer couleur arbre (vert/orange/rouge)
  7. Afficher tooltip avec détails
}
```

---

## 📊 STATISTIQUES DASHBOARD

### Calculs

**Biodiversité** (score 0-100) :
- +30 points : Plante mellifère
- +25 points : Fructification (oiseaux)
- +20 points : Diversité espèces
- +15 points : Plante locale/indigène

**Arrosage** (L/semaine) :
- Régulier : 50L/semaine/arbre
- Abondant : 100L/semaine
- Modéré : 30L/semaine
- Minimum : 20L/semaine

**Entretien** (h/mois) :
- 0.5h/mois/arbre (taille, surveillance)

**Conformité** (%) :
```
(Arbres conformes / Total arbres) × 100
```

---

**Version** : 2.1.0  
**État** : ✅ Complet et validé

