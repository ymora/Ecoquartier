# 📅 GUIDE DE LA TIMELINE - Projection Temporelle

**Version** : 2.1.3  
**Composant** : Timeline de croissance des arbres  
**Modes** : 2D et 3D

---

## 🎯 QU'EST-CE QUE LA TIMELINE ?

La timeline permet de **visualiser la croissance des arbres dans le temps** :
- **Année 0** : Plantation (jeunes plants 2m)
- **Années 1-19** : Croissance progressive
- **Année 20+** : Maturité (taille adulte)

---

## 🔍 OÙ SE TROUVE LA TIMELINE ?

### Position
- **En bas de l'écran** (barre fixe centrée)
- **Au-dessus de tout** (z-index 2000)
- **Visible en 2D ET en 3D**

### Bouton Toggle
Dans le **panneau latéral gauche**, onglet "🛠️ Outils" :
- Bouton **📅** (Projection temporelle)
- **Vert** = Timeline visible ✅
- **Gris** = Timeline masquée

---

## 📖 COMMENT L'UTILISER

### Étape 1 : Activer la Timeline
1. Ouvrir le **Planificateur de Terrain**
2. Vérifier que le bouton **📅** est **actif** (vert) dans le panneau latéral
3. Si gris, **cliquer dessus** pour afficher la timeline

### Étape 2 : Utiliser le Slider
1. La timeline apparaît **en bas de l'écran**
2. **Déplacer le slider** :
   - ⬅️ **Gauche** = Année 0 (Plantation)
   - ➡️ **Droite** = Année 20+ (Maturité)
3. Observer les arbres **grandir en temps réel** !

### Étape 3 : Choisir la Saison (optionnel)
1. Activer l'**ombre** avec le bouton 🌗
2. Choisir la **saison** avec les boutons :
   - ❄️ **Hiver** : Ombre longue (18°)
   - 🌸 **Printemps** : Ombre moyenne (41°)
   - ☀️ **Été** : Ombre courte (64°)
   - 🍂 **Automne** : Ombre moyenne (41°)

---

## 🌳 TAILLES SELON L'ANNÉE

### Exemple : Cerisier du Japon (10m max)

| Année | Hauteur | Envergure | Tronc | État |
|-------|---------|-----------|-------|------|
| **0** | 2.0m | 0.8m | ⌀5cm | 🌱 Plantation |
| **5** | 4.0m | 2.0m | ⌀15cm | 🌿 Jeune |
| **10** | 6.0m | 3.5m | ⌀25cm | 🌳 Croissance |
| **15** | 8.0m | 5.0m | ⌀35cm | 🌳 Adulte |
| **20+** | 10.0m | 6.5m | ⌀45cm | 🌳 Maturité |

### Différences 2D vs 3D

#### Mode 2D
- **Cercle** s'agrandit sur le canvas
- **Label** affiche les dimensions exactes
- **Icône croissance** : ⚡ (rapide), 🌿 (moyenne), 🐌 (lente)
- **Validation** recalculée à chaque changement

#### Mode 3D
- **Tronc** s'élève progressivement
- **Feuillage** s'élargit en volume
- **Racines** s'approfondissent
- **Branches** apparaissent et grandissent

---

## 🐛 DÉPANNAGE

### "Je ne vois pas la timeline"

**Solution 1** : Vérifier le bouton 📅
1. Ouvrir le **panneau latéral gauche**
2. Cliquer sur l'onglet **🛠️ Outils**
3. Vérifier que le bouton **📅** est **actif** (vert)
4. Si gris, **cliquer dessus**

**Solution 2** : Vérifier le mode
1. La timeline fonctionne en **2D et 3D**
2. Elle est toujours en **bas de l'écran**
3. Si vous ne la voyez pas, essayez de **scroller vers le bas**

**Solution 3** : Recharger la page
1. Appuyer sur **F5** pour rafraîchir
2. La timeline devrait être **visible par défaut**

### "Le slider ne bouge pas les arbres"

**Vérification** :
1. Avez-vous **ajouté des arbres** à planter ?
2. Les arbres doivent être de type **"arbre-a-planter"** (pas "arbre existant")
3. Vérifier dans la console JavaScript (F12) s'il y a des erreurs

**Solution** :
1. Ajouter au moins 1 arbre depuis le **Comparateur**
2. Placer l'arbre sur le terrain
3. Déplacer le slider → l'arbre doit grandir

### "La timeline masque le canvas"

**Si timeline gêne** :
1. Cliquer sur le bouton **📅** dans le panneau latéral
2. La timeline se masque
3. Re-cliquer pour l'afficher à nouveau

---

## ⚙️ PARAMÈTRES TECHNIQUES

### State
```javascript
const [anneeProjection, setAnneeProjection] = useState(0);
const [timelineVisible, setTimelineVisible] = useState(true);
```

### CSS
```css
.timeline-croissance {
  position: fixed !important;
  bottom: 20px !important;
  z-index: 2000 !important; /* Au-dessus de tout */
}
```

### Props
```javascript
// CanvasTerrain.jsx → CanvasTerrain3D.jsx
<CanvasTerrain3D
  anneeProjection={anneeProjection}
  saison={saison}
/>

// CanvasTerrain3D.jsx → Arbre3D.jsx
<Arbre3D
  anneeProjection={anneeProjection}
/>
```

---

## 🌟 FONCTIONNALITÉS

### Timeline 2D ✅
- ✅ Redimensionnement des cercles arbres
- ✅ Mise à jour des labels (dimensions, tronc)
- ✅ Icônes croissance (⚡🌿🐌)
- ✅ Pourcentage de maturité
- ✅ Validation recalculée

### Timeline 3D ✅
- ✅ Hauteur du tronc
- ✅ Volume du feuillage
- ✅ Profondeur des racines
- ✅ Taille des branches
- ✅ Label année (ex: "5 ans")

### Saison (si ombre active) ✅
- ✅ Position du soleil 3D
- ✅ Angle selon saison
- ✅ Ombre portée 2D
- ✅ Label saison + angle

---

## ✅ CONCLUSION

La timeline est un **outil puissant** pour :
- 📊 Planifier la croissance à long terme
- 🌳 Visualiser les tailles adultes
- ⚖️ Vérifier les distances futures
- 🎨 Comprendre l'évolution du jardin

**Astuce** : Testez différentes années (0, 5, 10, 20) pour voir l'évolution complète !

---

**Document créé le** : 19 octobre 2025  
**Mis à jour le** : 19 octobre 2025  
**Version** : 2.1.3

