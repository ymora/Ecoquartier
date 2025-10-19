# 🔗 SYSTÈME DE CLÔTURES CONNECTÉES

**Version** : 2.1.3  
**Fichier** : `client/src/utils/canvas/cloturesHelpers.js`  
**Objectif** : Gérer intelligemment les clôtures connectées

---

## 🎯 FONCTIONNEMENT

### Connexions Automatiques

Quand vous créez plusieurs segments de clôture :
1. **Détection automatique** des extrémités proches (< 15px)
2. **Snap magnétique** pour connecter
3. **Indicateurs visuels** (cercles verts) aux points de connexion

### Étirement Intelligent

Quand vous déplacez une clôture connectée :
- ✅ **Les autres clôtures s'étirent** pour maintenir la connexion
- ✅ **Pas de déconnexion** accidentelle
- ✅ **Mise à jour en temps réel**

---

## 🔧 COMPORTEMENT ATTENDU

### Cas 1 : Clôture Libre (0 connexion)
```
Avant :  ─────────
Drag  :      ─────────  (se déplace librement)
Après :      ─────────
```

### Cas 2 : Clôture avec 1 Connexion
```
Avant :  A───────B
              │
              C

Déplacer B :
         A───────────B  (s'étire)
              │
              C
```

### Cas 3 : Clôture avec 2 Connexions ⭐
```
Avant :  A───────B───────C

Déplacer B vers le haut :
         A       B (impossible - point fixe)
          \     /
           \   /
            \ /
             C

Alternative - Étirer les 2 segments :
         A
          \
           B (tire les 2 clôtures)
          /
         C
```

**Le point B tire sur les 2 clôtures qui s'étirent !**

---

## 💻 CODE ACTUEL

### Fonction `ajusterCloturesConnectees`

```javascript
export const ajusterCloturesConnectees = (cloture, canvas) => {
  const connectees = trouverCloturesConnectees(cloture, canvas);
  const pointsActuels = getCloturePoints(cloture);
  
  connectees.forEach(({ cloture: autre, connexions }) => {
    connexions.forEach(({ point, autrePoint }) => {
      // Déterminer quel point de l'autre clôture doit suivre
      if (autrePoint === 'x1y1') {
        // Point 1 suit le point déplacé
        newX1 = pointsActuels[point].x;
        newY1 = pointsActuels[point].y;
      } else if (autrePoint === 'x2y2') {
        // Point 2 suit le point déplacé
        newX2 = pointsActuels[point].x;
        newY2 = pointsActuels[point].y;
      }
      
      // Mettre à jour la clôture (elle s'étire)
      updateClotureCoords(autre, newX1, newY1, newX2, newY2);
    });
  });
};
```

**Principe** :
1. Trouver toutes les clôtures connectées
2. Pour chaque connexion, mettre à jour le point connecté
3. La clôture s'étire automatiquement

---

## 🐛 PROBLÈME SIGNALÉ

**Symptôme** : Quand on déplace une clôture avec 2 extrémités fixées, les autres ne grandissent pas correctement.

**Cause possible** :
1. La fonction n'est pas appelée
2. Les connexions ne sont pas détectées
3. Les coordonnées ne sont pas mises à jour correctement

---

## ✅ CORRECTION APPORTÉE

### 1. Appel de Fonction Corrigé
```javascript
// AVANT (useCanvasEvents.js)
deplacerClotureAvecConnexions(e.target, canvas, e);

// APRÈS
deplacerClotureAvecConnexions(e.target, canvas);
// Le paramètre 'e' inutilisé était supprimé
```

### 2. Paramètres Nettoyés
```javascript
// AVANT
ajusterCloturesConnectees(cloture, canvas, deltaX, deltaY);

// APRÈS
ajusterCloturesConnectees(cloture, canvas);
// deltaX et deltaY n'étaient pas utilisés
```

---

## 🎮 COMMENT TESTER

### Test 1 : Clôtures en L
1. Créer une clôture horizontale
2. Créer une clôture verticale qui se connecte
3. Déplacer l'extrémité connectée
4. **Attendu** : Les 2 clôtures s'étirent ✅

### Test 2 : Clôtures en T
1. Créer 3 clôtures connectées en T
2. Déplacer le point central
3. **Attendu** : Les 3 clôtures s'étirent en étoile ✅

### Test 3 : Rectangle Fermé
1. Créer 4 clôtures formant un rectangle
2. Déplacer un coin
3. **Attendu** : Les 2 côtés adjacents s'étirent ✅

---

## 🔍 INDICATEURS VISUELS

### Points de Connexion
- **Cercle vert** = 2+ clôtures connectées
- **Pas de cercle** = Extrémité libre

### Snap Magnétique
- **Cercle bleu** apparaît quand proche d'un point de connexion
- **Snap automatique** < 15px

---

## ⚙️ PARAMÈTRES

```javascript
const SNAP_TOLERANCE = 15; // Distance max pour snap (pixels)
const CONNECTION_INDICATOR_RADIUS = 6; // Taille des cercles
```

---

## ✅ ÉTAT ACTUEL

**Fonctionnalités** :
- ✅ Détection automatique des connexions
- ✅ Snap magnétique
- ✅ Indicateurs visuels (cercles verts)
- ✅ Étirement des clôtures connectées
- ✅ Support clôtures multiples (T, X, etc.)

**Correction appliquée** :
- ✅ Paramètres inutiles supprimés
- ✅ Appels de fonction nettoyés
- ✅ Code optimisé

---

## 🎯 PROCHAINES AMÉLIORATIONS POSSIBLES

1. **Contraintes d'angle** : Maintenir angles droits si souhaité
2. **Distance minimale** : Empêcher clôtures trop courtes
3. **Feedback visuel** : Montrer la tension sur les clôtures
4. **Modes de connexion** : Rigide, flexible, etc.

---

**Document créé le** : 19 octobre 2025  
**But** : Documenter le système de clôtures connectées

