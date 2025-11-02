# 🔍 TEST EXPORT/IMPORT JSON

## 📋 Format attendu par planLoader.js (planDefault.json)

```json
{
  "metadata": {
    "version": "1.0",
    "description": "Plan simplifié"
  },
  "objets": [
    {
      "type": "maison",
      "id": "maison-1",
      "pos": [-200, -100],      ← PIXELS
      "dim": [10, 10],          ← MÈTRES
      "props": {
        "hauteur": 7,
        "angle": 0
      }
    }
  ]
}
```

## 📤 Format généré par telechargerPlanJSON()

```javascript
// exportImport.js ligne 99
{
  type: 'maison',
  id: obj.customId || 'maison-' + Date.now(),
  pos: [obj.left, obj.top],              // ← PIXELS ✅
  dim: [obj.largeur || 10, obj.profondeur || 10],  // ← MÈTRES ✅
  props: {
    hauteur: obj.hauteur || 7,
    angle: obj.angle || 0,
    elevationSol: obj.elevationSol || 0,
    typeToit: obj.typeToit || 'deux-pentes',
    penteToit: obj.penteToit || 30,
    orientationToit: obj.orientationToit || 0
  }
}
```

## ✅ VÉRIFICATION

**Structure :** ✅ Identique
**pos :** ✅ PIXELS (obj.left, obj.top)
**dim :** ✅ MÈTRES (obj.largeur, obj.profondeur)

**Différences :**
- Props supplémentaires : `elevationSol`, `typeToit`, `penteToit`, `orientationToit`
  → ✅ OK, juste plus complet

## 🔍 IMPORT planLoader.js

```javascript
// planLoader.js ligne 76-85
case 'maison':
  objet = creerMaisonObjet(echelle);
  objet.set({
    largeur: dim[0],           // ← MÈTRES ✅
    profondeur: dim[1],        // ← MÈTRES ✅
    hauteur: props.hauteur,
    elevationSol: props.elevationSol || 0,
    typeToit: props.typeToit || 'deux-pentes',
    angle: props.angle || 0
  });
  break;

// Ligne 206-208
objet.set({
  left: pos[0],    // ← PIXELS ✅
  top: pos[1]      // ← PIXELS ✅
});
```

## ✅ RÉSULTAT

**TOUT EST COHÉRENT !**

Le format exporté DEVRAIT fonctionner !

## 🤔 POURQUOI "JSON non valide" ?

Hypothèses :
1. ❌ Caractères spéciaux dans le JSON (arbreData avec guillemets?)
2. ❌ Maillage avec NaN ou Infinity?
3. ❌ Erreur de parsing (JSON mal formé)?
4. ❌ Extension de fichier (.txt au lieu de .json)?

## 🔍 ACTION

Tester l'export et afficher le JSON dans la console pour vérifier.

