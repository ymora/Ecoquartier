# ✅ Tests à Effectuer - Checklist Complète

## 🚀 Démarrage de l'Application

### 1. Installation et Démarrage

```bash
# Terminal 1 - Application cliente
cd client
npm install
npm run dev
```

**URL :** http://localhost:5173

**✅ Vérifications :**
- [ ] L'application démarre sans erreur
- [ ] Aucune erreur dans la console
- [ ] Le header moderne s'affiche
- [ ] Les styles CSS sont appliqués

---

## 🎨 Interface Utilisateur

### 2. Nouvelle Interface ModernHeader

**✅ Tests :**
- [ ] Le header s'affiche en haut de page
- [ ] Logo et titre "Les Haies de l'Écocartier" visibles
- [ ] 3 boutons de navigation présents :
  - [ ] 📋 Fiches Détaillées
  - [ ] 🔍 Comparateur
  - [ ] 🌳 Planificateur 3D
- [ ] Bouton de menu (burger) visible sur mobile
- [ ] Hover sur les boutons fonctionne
- [ ] Indicateur actif (barre bleue) apparaît

### 3. Navigation Entre Modes

**✅ Tests :**
- [ ] Clic sur "Fiches Détaillées" → Mode normal
- [ ] Clic sur "Comparateur" → Mode comparaison
- [ ] Clic sur "Planificateur 3D" → Mode planification
- [ ] La transition entre modes est fluide
- [ ] Aucune erreur console lors des changements

---

## 📋 Mode Fiches Détaillées

### 4. Navigation des Plantes

**✅ Tests :**
- [ ] Menu latéral s'affiche avec liste des plantes
- [ ] Clic sur une plante → Fiche détaillée s'affiche
- [ ] Images de la plante se chargent
- [ ] Navigation entre images (flèches) fonctionne
- [ ] Toutes les informations sont affichées :
  - [ ] Nom scientifique
  - [ ] Dimensions
  - [ ] Période de floraison
  - [ ] Exposition
  - [ ] Type de sol

### 5. Chargement des Images

**✅ Tests :**
- [ ] Les images se chargent progressivement
- [ ] Indicateur de chargement visible
- [ ] Pas d'erreur si image manquante
- [ ] Zoom sur image fonctionne
- [ ] Légendes des images affichées

---

## 🔍 Mode Comparateur

### 6. Sélection de Plantes

**✅ Tests :**
- [ ] Liste des arbres visible
- [ ] Liste des arbustes visible
- [ ] Clic sur plante → Ajout au comparateur
- [ ] Bouton sélectionné change de couleur
- [ ] Maximum de plantes sélectionnables fonctionne

### 7. Tableau Comparatif

**✅ Tests :**
- [ ] Tableau s'affiche avec colonnes
- [ ] Images comparatives visibles
- [ ] Navigation d'images par plante fonctionne
- [ ] Filtrage par type d'image fonctionne :
  - [ ] Tous types
  - [ ] Vue générale
  - [ ] Bourgeons
  - [ ] Fleurs
  - [ ] Fruits
- [ ] Boutons "Afficher/Masquer" fonctionnent
- [ ] Bouton "Tout afficher" fonctionne
- [ ] Suppression d'une plante fonctionne (X)

### 8. Critères de Comparaison

**✅ Tests :**
- [ ] Dimensions affichées
- [ ] Périodes de floraison affichées
- [ ] Couleurs des fleurs affichées
- [ ] Type de feuillage affiché
- [ ] Informations d'ombre affichées
- [ ] Distance légale voisinage affichée
- [ ] Toxicité affichée avec couleurs
- [ ] Réglementation taille affichée

---

## 🌳 Mode Planificateur 3D

### 9. Canvas 2D

**✅ Tests :**
- [ ] Canvas 2D s'affiche
- [ ] Grille visible
- [ ] Boussole d'orientation visible
- [ ] Outils de dessin fonctionnent :
  - [ ] Maison
  - [ ] Citerne
  - [ ] Caisson
  - [ ] Clôture
  - [ ] Terrasse
  - [ ] Pavés enherbés
  - [ ] Arbres
- [ ] Sélection d'objets fonctionne
- [ ] Déplacement d'objets fonctionne
- [ ] Suppression d'objets fonctionne
- [ ] Menu contextuel (clic droit) fonctionne

### 10. Canvas 3D

**✅ Tests :**
- [ ] Basculement 2D ↔ 3D fonctionne
- [ ] Scène 3D se charge
- [ ] Objets 2D apparaissent en 3D
- [ ] Rotation caméra (clic gauche + glisser) fonctionne
- [ ] Zoom (molette) fonctionne
- [ ] Pan (clic droit + glisser) fonctionne
- [ ] Soleil visible et animé
- [ ] Ombres visibles
- [ ] Terrain 3D affiché
- [ ] Arbres 3D affichés avec textures
- [ ] Menu contextuel 3D fonctionne

### 11. Synchronisation 2D ↔ 3D

**✅ Tests :**
- [ ] Objet créé en 2D apparaît en 3D
- [ ] Objet déplacé en 2D se déplace en 3D
- [ ] Objet supprimé en 2D disparaît en 3D
- [ ] Objet verrouillé en 2D est verrouillé en 3D
- [ ] Sélection 2D = sélection 3D (highlight)
- [ ] Modification propriétés 2D = mise à jour 3D

### 12. Export/Import de Plans

**✅ Tests :**
- [ ] Bouton "Exporter" disponible
- [ ] Export JSON télécharge un fichier
- [ ] Fichier JSON contient toutes les données
- [ ] Bouton "Importer" disponible
- [ ] Import JSON recharge le plan
- [ ] Tous les objets sont restaurés
- [ ] Propriétés conservées

---

## ⚡ Performance

### 13. Temps de Chargement

**✅ Tests :**
- [ ] Application démarre en < 2 secondes
- [ ] Images chargent en < 1 seconde
- [ ] Canvas 3D charge en < 3 secondes
- [ ] Pas de lag lors des interactions
- [ ] Animations fluides (60 FPS)

### 14. Cache et Optimisation

**✅ Tests :**
- [ ] Images chargées une seule fois (cache)
- [ ] Rechargement de page plus rapide
- [ ] Pas de requêtes multiples pour même image
- [ ] Console ne montre pas d'avertissements

---

## 📱 Responsive

### 15. Mobile (< 768px)

**✅ Tests :**
- [ ] Header responsive avec menu burger
- [ ] Menu burger ouvre/ferme le menu
- [ ] Navigation mobile fonctionne
- [ ] Tableau comparateur scrollable
- [ ] Canvas 2D utilisable au doigt
- [ ] Canvas 3D utilisable (pinch to zoom)
- [ ] Tous les textes lisibles
- [ ] Boutons suffisamment grands

### 16. Tablette (768px - 1024px)

**✅ Tests :**
- [ ] Layout adapté
- [ ] Navigation visible
- [ ] Tableau comparateur lisible
- [ ] Canvas utilisables
- [ ] Pas de débordement horizontal

### 17. Desktop (> 1024px)

**✅ Tests :**
- [ ] Layout optimal
- [ ] Tous les éléments visibles
- [ ] Navigation fluide
- [ ] Pas d'espace perdu

---

## 🔧 Nouveaux Hooks

### 18. useImageLoader

**Test manuel dans la console :**

```jsx
// Copier-coller dans la console du navigateur
import useImageLoader from './hooks/useImageLoader';

// Tester le chargement
const { images, loading, error } = useImageLoader({ id: 'prunus-kanzan' });
console.log('Images:', images);
```

**✅ Tests :**
- [ ] Hook retourne un objet { images, loading, error }
- [ ] `loading` est `true` pendant le chargement
- [ ] `images` est un tableau après chargement
- [ ] `error` contient un message si erreur
- [ ] Cache fonctionne (deuxième appel instantané)

### 19. useLocalStorage

**Test manuel dans la console :**

```jsx
import useLocalStorage from './hooks/useLocalStorage';

// Tester stockage
const [value, setValue] = useLocalStorage('test', 'default');
setValue('new value');
console.log('Value:', value);
```

**✅ Tests :**
- [ ] Valeur sauvegardée dans localStorage
- [ ] Rechargement page conserve la valeur
- [ ] Changement dans un onglet sync dans autre onglet
- [ ] Suppression fonctionne

### 20. useMediaQuery

**Test manuel dans la console :**

```jsx
import { useBreakpoint } from './hooks/useMediaQuery';

// Tester breakpoints
const { isMobile, isTablet, isDesktop } = useBreakpoint();
console.log('Mobile:', isMobile, 'Tablet:', isTablet, 'Desktop:', isDesktop);
```

**✅ Tests :**
- [ ] Détecte correctement le type d'appareil
- [ ] Réagit aux changements de taille fenêtre
- [ ] Retourne les bons booléens

---

## 📡 API Centralisée

### 21. imageService

**Test dans la console du navigateur (admin) :**

```javascript
// Test listImages
const images = await imageService.listImages({ espece: 'prunus-kanzan' });
console.log('Images:', images);

// Test checkImageExists
const exists = await imageService.checkImageExists('prunus-kanzan', 'prunus-kanzan_fleurs_01.jpg');
console.log('Exists:', exists);
```

**✅ Tests :**
- [ ] `listImages()` retourne un tableau
- [ ] `checkImageExists()` retourne un booléen
- [ ] Erreurs gérées gracieusement
- [ ] Messages d'erreur clairs

---

## 🎨 Composants Modernes

### 22. ModernCard

**Test visuel :**
- [ ] Carte s'affiche correctement
- [ ] 4 variantes disponibles (default, outlined, elevated, gradient)
- [ ] Hover effect fonctionne
- [ ] Header avec icône affiché
- [ ] Actions (boutons) affichées
- [ ] Body contient le contenu
- [ ] Grid fonctionne (2, 3, 4 colonnes)

### 23. ModernHeader

**Test visuel :**
- [ ] Header en haut de page (sticky)
- [ ] Logo affiché
- [ ] Titre affiché
- [ ] 3 boutons navigation affichés
- [ ] Indicateur actif visible
- [ ] Responsive fonctionne
- [ ] Menu burger sur mobile

---

## 🛠️ Utilitaires Performance

### 24. Debounce

**Test dans la console :**

```javascript
import { debounce } from './utils/performance';

let count = 0;
const debouncedFunc = debounce(() => {
  count++;
  console.log('Called:', count);
}, 300);

// Appeler rapidement
for (let i = 0; i < 10; i++) {
  debouncedFunc();
}

// Attendre 400ms → count devrait être 1
setTimeout(() => console.log('Final count:', count), 400);
```

**✅ Tests :**
- [ ] Fonction exécutée une seule fois
- [ ] Délai respecté
- [ ] Annulation fonctionne

### 25. Throttle

**Test dans la console :**

```javascript
import { throttle } from './utils/performance';

let count = 0;
const throttledFunc = throttle(() => {
  count++;
  console.log('Called:', count);
}, 100);

// Appeler rapidement
for (let i = 0; i < 10; i++) {
  throttledFunc();
}

console.log('Count:', count); // Devrait être 1
```

**✅ Tests :**
- [ ] Première exécution immédiate
- [ ] Exécutions suivantes throttlées
- [ ] Fréquence respectée

### 26. Memoize

**Test dans la console :**

```javascript
import { memoize } from './utils/performance';

let callCount = 0;
const expensiveFunc = (a, b) => {
  callCount++;
  return a + b;
};

const memoizedFunc = memoize(expensiveFunc);

console.log(memoizedFunc(1, 2)); // Calcul
console.log(memoizedFunc(1, 2)); // Cache
console.log('Call count:', callCount); // Devrait être 1
```

**✅ Tests :**
- [ ] Première exécution calcule
- [ ] Exécutions suivantes utilisent cache
- [ ] Différents arguments = différents caches

---

## 🐛 Console & Erreurs

### 27. Console Navigateur

**✅ Vérifications :**
- [ ] Aucune erreur rouge
- [ ] Aucun avertissement (warnings) important
- [ ] Pas de logs inutiles en production
- [ ] Messages de debug désactivables

### 28. Network (Onglet Réseau)

**✅ Vérifications :**
- [ ] Pas de requêtes multiples pour mêmes ressources
- [ ] Images chargées une seule fois
- [ ] API appelée seulement quand nécessaire
- [ ] Pas d'erreurs 404
- [ ] Pas d'erreurs 500

---

## ✅ CHECKLIST FINALE

### Tests Critiques (Obligatoires)

- [ ] ✅ Application démarre sans erreur
- [ ] ✅ Nouvelle interface s'affiche
- [ ] ✅ Navigation entre modes fonctionne
- [ ] ✅ Mode Fiches Détaillées OK
- [ ] ✅ Mode Comparateur OK
- [ ] ✅ Mode Planificateur 2D/3D OK
- [ ] ✅ Responsive mobile fonctionne
- [ ] ✅ Aucune erreur console
- [ ] ✅ Performance acceptable (< 3s chargement)

### Tests Optionnels (Recommandés)

- [ ] 🔄 Hooks personnalisés testés
- [ ] 🔄 API centralisée testée
- [ ] 🔄 Utilitaires performance testés
- [ ] 🔄 Composants modernes testés
- [ ] 🔄 Cache fonctionnel
- [ ] 🔄 Export/Import plans OK

---

## 📝 Rapport de Tests

### Template à Remplir

```
Date: ___________
Testeur: ___________
Navigateur: ___________ (Chrome, Firefox, Safari, Edge)
OS: ___________ (Windows, Mac, Linux)

RÉSULTATS:
✅ Tests réussis: ___/28
❌ Tests échoués: ___/28
⚠️ Tests partiels: ___/28

PROBLÈMES IDENTIFIÉS:
1. ___________________________________________
2. ___________________________________________
3. ___________________________________________

NOTES:
___________________________________________
___________________________________________
___________________________________________

SCORE FINAL: ___/100
```

---

## 🚨 En Cas de Problème

### Problème : Application ne démarre pas

**Solutions :**
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install

# Vérifier la version de Node
node --version  # Doit être >= 16

# Nettoyer le cache
npm cache clean --force
```

### Problème : Erreurs de build

**Solutions :**
```bash
# Build propre
npm run build

# Vérifier les imports
# Vérifier que tous les fichiers existent
```

### Problème : Styles CSS ne s'appliquent pas

**Solutions :**
- Vérifier que `theme.css` est importé dans `App.jsx`
- Vider le cache du navigateur (Ctrl+Shift+R)
- Vérifier la console pour erreurs CSS

### Problème : Images ne se chargent pas

**Solutions :**
- Vérifier que `images.json` existe dans `client/public/`
- Vérifier les chemins d'images
- Vérifier la console réseau (onglet Network)

---

## 📞 Support

Si vous rencontrez un problème non résolu :

1. Consulter `DOCUMENTATION_OPTIMISATION.md`
2. Consulter `README_OPTIMISATION.md`
3. Vérifier les logs dans la console
4. Créer une issue sur le dépôt Git

**Mairie de Bessancourt :** 01 30 40 44 47

---

**Bon courage pour les tests !** 🧪✅

