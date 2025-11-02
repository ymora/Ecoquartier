# 🚨 PROBLÈME EXPORT/IMPORT JSON

## 🔍 INCOHÉRENCE DÉTECTÉE

### Deux fonctions d'export différentes !

#### 1️⃣ `telechargerPlanJSON()` - Nouveau format
```javascript
// Ligne 99 - exportImport.js
pos: [obj.left, obj.top],  // ← PIXELS !!
dim: [obj.largeur || 10, obj.profondeur || 10],  // ← MÈTRES !!
```

#### 2️⃣ `exporterPlan()` - Ancien format  
```javascript
// Ligne 289 - exportImport.js
left: obj.left / echelle,  // ← MÈTRES (divisé par échelle)
top: obj.top / echelle,    // ← MÈTRES
```

### ❌ INCOHÉRENCE

```
telechargerPlanJSON() : pos en PIXELS, dim en MÈTRES
exporterPlan()        : left/top en MÈTRES

planLoader.js         : Attend des PIXELS (pos[0], pos[1])
```

## 🎯 SOLUTION

**Uniformiser sur PIXELS** car :
1. ✅ Format natif de Fabric.js
2. ✅ Pas besoin de l'échelle pour réimporter
3. ✅ Simple et direct
4. ✅ L'échelle peut changer (30px/m aujourd'hui, autre demain)

## ✅ CORRECTION À FAIRE

### `telechargerPlanJSON()` - OK ✅
```javascript
pos: [obj.left, obj.top],  // PIXELS ✅
```

### `planLoader.js` - OK ✅
```javascript
objet.set({
  left: pos[0],  // Reçoit PIXELS ✅
  top: pos[1]
});
```

### Conversion 2D→3D - OK ✅
```javascript
const posX = objet.left / echelle;  // PIXELS → MÈTRES ✅
const posZ = objet.top / echelle;
```

**TOUT EST COHÉRENT SI on utilise `telechargerPlanJSON()` !**

## 🔄 L'ancien `exporterPlan()` ?

Ligne 289-480 : Ancien format (en MÈTRES)
→ Utilisé pour quoi ? À vérifier !
→ Peut-être pour la 3D directement ?
→ À unifier ou clarifier !

