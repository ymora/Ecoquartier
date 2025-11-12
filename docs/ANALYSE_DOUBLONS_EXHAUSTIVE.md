# 🔍 ANALYSE EXHAUSTIVE DES DOUBLONS - Code Réutilisable

**Date** : 12 novembre 2025  
**Objectif** : Identifier TOUS les doublons et opportunités de réutilisation

---

## 📊 RÉSUMÉ EXÉCUTIF

### Doublons Identifiés

| Catégorie | Occurrences | Criticité | Action |
|-----------|-------------|-----------|--------|
| **Handlers hover** (PanneauLateral) | 36× | ÉLEVÉE | ✅ Créer hook `useHoverEffect` |
| **Labels 3D** (Html components) | 4× | MOYENNE | ✅ Créer `Label3D` |
| **Styles boutons** (inline) | ~50× | MOYENNE | ✅ Créer classes CSS |
| **Validation guard clauses** | 15× | FAIBLE | ✅ Créer helper |
| **Console.log DEBUG** | 20+ | FAIBLE | ✅ Migrer vers logger |

---

## 🔴 CRITICITÉ ÉLEVÉE

### 1. Handlers Hover Dupliqués (36×)

**Pattern répété** dans `PanneauLateral.jsx` :

```javascript
// ❌ Répété 36 fois !
onMouseEnter={(e) => e.currentTarget.style.background = '#f1f8e9'}
onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
```

**Solution** : Hook personnalisé
```javascript
// ✅ hooks/useHoverEffect.js
export const useHoverEffect = (hoverColor, normalColor) => ({
  onMouseEnter: (e) => e.currentTarget.style.background = hoverColor,
  onMouseLeave: (e) => e.currentTarget.style.background = normalColor
});

// Utilisation
<button {...useHoverEffect('#f1f8e9', 'white')}>
```

**Alternative CSS (meilleure)** :
```css
.btn-hover-green:hover {
  background: #f1f8e9 !important;
}
```

**Impact** : -72 lignes de code

---

### 2. Labels 3D Répétés (4×)

**Pattern répété** dans composants 3D :

```javascript
// ❌ Dupliqué dans Arbre3D, Arbre3DModel, Caisson3D, Soleil3D
<Html position={[0, y, 0]} center>
  <div style={{
    background: 'rgba(0,0,0,0.7)',
    color: 'white',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '11px',
    whiteSpace: 'nowrap'
  }}>
    {texte}
  </div>
</Html>
```

**Solution** : Composant réutilisable
```javascript
// ✅ components/3d/Label3D.jsx
export default function Label3D({ position, children }) {
  return (
    <Html position={position} center>
      <div className="label-3d">{children}</div>
    </Html>
  );
}

// CSS
.label-3d {
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  fontSize: 11px;
  white-space: nowrap;
}
```

**Impact** : -40 lignes de code, +15 lignes de composant

---

## 🟡 CRITICITÉ MOYENNE

### 3. Styles Boutons Inline (50+)

**Pattern répété** dans `PanneauLateral.jsx` :

```javascript
// ❌ Style défini en ligne ~50 fois
style={{
  width: '100%',
  padding: '0.5rem',
  background: 'white',
  color: '#333',
  border: 'none',
  borderBottom: '1px solid #f0f0f0',
  cursor: 'pointer',
  fontSize: '0.85rem',
  fontWeight: '500',
  textAlign: 'left',
  transition: 'background 0.2s'
}}
```

**Solution** : Objet styles centralisé (DÉJÀ FAIT !)
```javascript
// ✅ DÉJÀ PARTIELLEMENT FAIT (lignes 97-153)
const styles = {
  boutonListe: { ... },  // ✅ Existe
  boutonListeDernier: { ... }  // ✅ Existe
}

// ❌ MAIS : Styles encore répétés inline dans 36 boutons
```

**Action** : Utiliser `style={styles.boutonListe}` partout

**Impact** : -400 lignes de code

---

### 4. Création de Matériaux 3D

**Pattern répété** dans les composants 3D :

```javascript
// ❌ Chaque composant crée ses matériaux avec useMemo
const materials = useMemo(() => ({
  material1: new THREE.MeshStandardMaterial({ ... }),
  material2: new THREE.MeshStandardMaterial({ ... })
}), [deps]);
```

**Solution** : Factory de matériaux
```javascript
// ✅ utils/3d/materials.js
export const createMaterial = (color, options = {}) => {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: options.roughness || 0.8,
    metalness: options.metalness || 0.1,
    transparent: options.transparent || false,
    opacity: options.opacity || 1,
    ...options
  });
};
```

**Impact** : Code plus lisible et maintenable

---

## 🟢 CRITICITÉ FAIBLE

### 5. Guard Clauses Répétées (15×)

**Pattern répété** :

```javascript
// ❌ Répété partout
if (!canvas) return;
if (!obj || !canvas) return;
if (!canvas || !objet) return;
```

**Solution** : Déjà bien géré avec les guards simples. À garder tel quel.

---

### 6. Console.log DEBUG (20+)

**Pattern répété** dans `duplicationUtils.js`, `useCanvasEvents.js` :

```javascript
// ❌ Console.log encore présents
console.log('🔧 DEBUG: Début duplication...');
console.log('🔧 DEBUG: Type:', obj.customType);
```

**Solution** : Migrer vers logger
```javascript
// ✅ Utiliser logger partout
logger.debug('Duplication', `Type: ${obj.customType}`);
```

**Impact** : Cohérence du logging

---

## ✅ DÉJÀ BIEN FACTORISÉ

### Ce Qui Est Déjà Bien

1. **canvasOperations.js** ✅
   - `ajouter()`, `supprimer()`, `rendre()`, `selectionner()`
   - Évite la duplication d'opérations canvas

2. **creerObjetsGeneriques.js** ✅
   - `creerObjetRectangulaire()`, `creerObjetCirculaire()`
   - Factory pattern pour créer des objets

3. **dupliquerObjet()** unifié ✅
   - Une seule fonction pour Ctrl+D ET menu contextuel

4. **Hooks personnalisés** ✅
   - `useCanvasInit`, `useCanvasEvents`, `useTimelineSync`
   - Logique réutilisable séparée

5. **Logger centralisé** ✅
   - Un seul point de logging

6. **FullscreenGallery** ✅
   - Composant galerie unifié (vient d'être créé)

---

## 📋 PLAN D'ACTION

### Phase 1 : Labels 3D (Impact Immédiat)
- [ ] Créer `Label3D.jsx` réutilisable
- [ ] Créer `Label3D.css`
- [ ] Remplacer dans 4 composants 3D

### Phase 2 : Styles Boutons (Impact Majeur)
- [ ] Utiliser `styles.boutonListe` existant partout
- [ ] Supprimer les 36 styles inline identiques
- [ ] Créer classe CSS `.btn-hover-green`

### Phase 3 : Console.log → Logger
- [ ] Remplacer console.log par logger.debug()
- [ ] Nettoyer les 20+ console.log de debug

### Phase 4 : Matériaux 3D (Optionnel)
- [ ] Créer `utils/3d/materials.js`
- [ ] Factory pour matériaux courants

---

## 📊 ESTIMATION DES GAINS

| Refactorisation | Lignes Économisées | Effort |
|----------------|-------------------|--------|
| Labels 3D | -40 lignes | 15 min |
| Styles boutons | -400 lignes | 30 min |
| Console → Logger | -20 lignes | 10 min |
| **TOTAL** | **-460 lignes** | **55 min** |

---

**Analyse créée le** : 12 novembre 2025  
**Prochain document** : PLAN_REFACTORISATION_2025.md

