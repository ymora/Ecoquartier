# 📐 Système d'axes 2D ↔ 3D

## 🎯 Objectif : COHÉRENCE TOTALE

### Fabric.js (2D Canvas)
```
    ↑ top (Y négatif vers haut)
    |
    |
    +----→ left (X vers droite)
  (0,0)
```

### Three.js (3D Scène)
```
     Y (hauteur)
     ↑
     |
     +----→ X (gauche-droite)
    /
   Z (profondeur avant-arrière)
```

## ⚠️ PROBLÈME ACTUEL

Le terrain 3D utilise un `PlaneGeometry` avec `rotation={[-Math.PI/2, 0, 0]}`

**Avant rotation** (buffer vertices) :
- vertices[i+0] = X
- vertices[i+1] = Y  
- vertices[i+2] = Z

**Après rotation de -90° sur X** :
- X reste X (gauche-droite)
- Y devient Z (profondeur)
- Z devient Y (hauteur)

## ✅ SOLUTION : Simplification

**Au lieu de tourner le plan, créer directement un plan horizontal !**

```javascript
// ❌ Ancien (confus)
<PlaneGeometry />
rotation={[-Math.PI/2, 0, 0]}
vertices[i+2] = elevation  // Modifie Z qui devient Y

// ✅ Nouveau (clair)
<PlaneGeometry />
rotation={[0, 0, 0]}  // PAS de rotation
vertices[i+1] = elevation  // Modifie Y directement
```

OU mieux encore :

```javascript
// ✅ Utiliser BufferGeometry directement en XZ horizontal
const geometry = new THREE.BufferGeometry();
// Créer les vertices directement en [X, elevation, Z]
```

