# 🎯 Système de Validation Unifié 2D/3D

## Architecture

```
client/src/utils/validation/
├── validationCore.js       # ✨ Logique PURE de validation
├── validationAdapter.js    # 🔌 Adaptateurs 2D/3D
├── index.js                # 📦 Point d'entrée
└── README.md               # 📖 Documentation
```

## Principe

**UN SEUL système de validation** utilisé par 2D (Fabric.js) et 3D (Three.js) pour garantir la **cohérence absolue**.

## Fonctionnement

### 1. **Collecte des critères** (Adaptateurs)

Les adaptateurs `collecterCriteres2D()` et `collecterCriteres3D()` parcourent la scène et créent une liste de **critères standardisés** :

```javascript
{
  type: 'maison',
  distance: 4.2,        // Distance réelle mesurée (m)
  distanceMin: 5,       // Distance minimale requise (m)
  icone: '🏠',
  label: 'fondations',
  metadata: {
    profondeurRacines: 1.5,
    profondeurObjet: 1.2
  }
}
```

### 2. **Validation** (Core)

La fonction `validerArbre()` calcule :
- **`pourcentageMin`** : Le **pire pourcentage** de tous les critères (= critère le plus critique)
- **`status`** : Statut selon les 4 paliers
- **`messages`** : Liste des messages d'avertissement/erreur
- **`conseils`** : Conseils contextuels

### 3. **Statut et couleurs**

| Pourcentage | Statut | Couleur | Signification |
|-------------|--------|---------|---------------|
| **< 50%** | `critical` | 🔴 Rouge foncé | Danger immédiat / Illégal |
| **50-75%** | `error` | 🟠 Orange-rouge | Problème sérieux |
| **75-100%** | `warning` | 🟡 Orange-jaune | Attention requise |
| **≥ 100%** | `ok` | 🟢 Vert | Conforme |

## Utilisation

### En 2D (Fabric.js)

```javascript
import { validerArbre2D, getCouleursPourStatut } from '../utils/validation';

// Valider un arbre
const resultat = validerArbre2D(arbreGroup, canvas, echelle, {
  couchesSol: [...],
  orientation: 'nord-bas'
});

// Appliquer les couleurs
const couleurs = getCouleursPourStatut(resultat.status);
ellipse.set({
  fill: couleurs.fill,
  stroke: couleurs.stroke
});

// Afficher les messages
console.log(resultat.messages); // ["🏠 2.8m (56% de 5m fondations)", ...]
console.log(resultat.pourcentageMin); // 56
```

### En 3D (Three.js)

```javascript
import { validerArbre3D, getCouleursPourStatut } from '../utils/validation';

// Valider un arbre
const resultat = validerArbre3D(arbreData, position, index, {
  arbres: [...],
  maison: {...},
  canalisations: [...],
  citernes: [...],
  clotures: [...]
}, {
  couchesSol: [...],
  orientation: 'nord-bas'
});

// Même résultat qu'en 2D !
const couleurs = getCouleursPourStatut(resultat.status);
```

## Critères vérifiés

### 1. 🏠 **Maison/Fondations**
- Distance minimale depuis `arbre.reglementation.distancesLegales.infrastructures.fondations`
- Cas spécial : Si `profondeurRacines > profondeurFondations` → critique absolu

### 2. 🚰 **Canalisations**
- Distance minimale depuis `arbre.reglementation.distancesLegales.infrastructures.canalisations`
- Cas spécial : Si `profondeurRacines > profondeurCanalisation` → critique absolu

### 3. ⚖️ **Clôtures/Limites** (Code Civil Art.671)
- Distance minimale depuis `arbre.reglementation.distancesLegales.voisinage.distance`
- Cas spécial : Si `distance < rayonTronc` → illégal (critique absolu)

### 4. 💧 **Citernes/Fosses septiques**
- Distance minimale depuis `arbre.reglementation.distancesLegales.infrastructures.fossesSeptiques`
- Cas spécial : Si `profondeurRacines > profondeurCiterne` → critique absolu

### 5. 🟩 **Terrasses/Pavés**
- Distance minimale depuis `arbre.reglementation.distancesLegales.infrastructures.terrasse`
- **Ajustement** : +1m si `systemeRacinaire === 'Élevée'` ou `'Forte'`

### 6. 🌳 **Autres arbres**
- Distance minimale : **`Math.max(distArbre1, distArbre2)`** (contrainte la plus stricte)
- **Contrainte bidirectionnelle** : Les deux arbres sont validés avec la même distance min

## Cas spéciaux

### Racines qui atteignent l'objet
Si `profondeurRacines > profondeurObjet` ET `distance < distanceMin` :
- **Pourcentage = 0%** (critique absolu)
- Message : `"🏠 Racines 1.5m > fondations 1.2m (4.2m)"`

### Tronc dépasse la limite
Si `distance < rayonTronc` pour une clôture :
- **Pourcentage = 0%** (illégal)
- Message : `"⚖️ Tronc dépasse limite (0.05m) ILLÉGAL"`

### Racines agressives
Si `systemeRacinaire === 'Élevée'` ou `'Forte'` :
- Distance terrasse : `+1m` (ex: 3m → 4m)

## Contrainte bidirectionnelle

**Exemple** :
- 🌸 Arbre A : distance min = **5m**
- 🍁 Arbre B : distance min = **3m**
- **Distance réelle** : **4m**

**Résultat** :
- Distance applicable : **`Math.max(5, 3) = 5m`**
- Pourcentage : **4 / 5 = 80%**
- Les **deux arbres** sont en statut `warning` (🟡 orange-jaune)

## Conseils contextuels

Conseils ajoutés selon les caractéristiques de l'arbre :
- Système racinaire agressif
- Besoin de soleil
- Arrosage régulier
- Préférence sol frais
- Compatibilité avec le sol en profondeur

## Avantages

✅ **Cohérence garantie** : 2D et 3D utilisent **exactement** la même logique  
✅ **Maintenabilité** : Modifier un critère = **un seul endroit**  
✅ **Testabilité** : Fonctions pures, faciles à tester  
✅ **Extensibilité** : Ajouter un critère = ajouter dans `collecterCriteres()`  
✅ **Performance** : Calcul optimisé avec `pourcentageMinGlobal`  

## Modification future

### Ajouter un nouveau critère

1. **Dans `validationAdapter.js`** : Ajouter la collecte du critère dans `collecterCriteres2D()` et `collecterCriteres3D()`
2. **Dans `arbustesData.js`** : Ajouter la distance dans `reglementation.distancesLegales`
3. **C'est tout !** Le reste est automatique.

### Modifier les paliers de couleurs

1. **Dans `validationCore.js`** : Modifier `getStatusFromPourcentage()` et `getCouleursPourStatut()`
2. Les changements s'appliquent automatiquement en 2D et 3D

## Tests

Pour tester le système :

```javascript
import { validerArbre, extraireDistancesMin } from './validation';

// Créer des critères de test
const criteres = [
  {
    type: 'maison',
    distance: 2.5,
    distanceMin: 5,
    icone: '🏠',
    label: 'fondations',
    metadata: {}
  },
  {
    type: 'arbre',
    distance: 3.8,
    distanceMin: 5,
    icone: '🌳',
    label: 'autre arbre',
    metadata: {}
  }
];

// Valider
const resultat = validerArbre(arbreData, criteres);

// Vérifier
console.assert(resultat.status === 'critical'); // 2.5/5 = 50%, donc critical
console.assert(resultat.pourcentageMin === 50);
```

## Performance

- **O(n)** : Parcours linéaire de tous les objets
- **Optimisé** : Calcul de `pourcentageMinGlobal` en une seule passe
- **Pas de duplication** : Logique centralisée

## Dépendances

- `../canvas/canvasHelpers` : Fonctions de calcul de distance (2D uniquement)
- Aucune autre dépendance !


