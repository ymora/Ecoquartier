# ✅ Tests de Régression - Phase 4

**Date**: 10 novembre 2025  
**Après nettoyage**: 18 fichiers supprimés, 32 MD archivés, CSS optimisé

---

## 🎯 Checklist de Tests

### ✅ Build et Compilation

```bash
npm run build
```

**Résultat**: ✅ **SUCCÈS**
- Aucune erreur de compilation
- Bundle size stable : 910 KB Three.js, 286 KB Fabric
- Compression optimale : ~500 KB total (gzip)
- Warnings attendus : dynamic imports (normal)

---

## 🧪 Tests Fonctionnels Requis

### Mode Explorer

#### Test 1: Sélection plante unique
- [ ] Cliquer sur "Explorer" dans le header
- [ ] Sélectionner une plante dans la liste latérale
- [ ] **Attendu**: Fiche détaillée avec galerie photos
- [ ] **Vérifier**: Navigation entre photos, fullscreen, placeholder si pas de photo

#### Test 2: Multi-sélection et comparaison
- [ ] Sélectionner 2-3 plantes (clic sur les cases)
- [ ] **Attendu**: Tableau de comparaison avec colonnes alignées
- [ ] **Vérifier**: Photos, caractéristiques, scrolling synchronisé

#### Test 3: Filtre et recherche
- [ ] Taper dans la barre de recherche
- [ ] **Attendu**: Liste filtrée en temps réel
- [ ] **Vérifier**: Arbres et arbustes séparés, expand/collapse

---

### Mode Planner - Canvas 2D

#### Test 4: Ajout d'objets
- [ ] Cliquer sur "Planifier" dans le header
- [ ] Ajouter une maison (onglet Outils)
- [ ] Ajouter un arbre à planter
- [ ] Ajouter une canalisation
- [ ] Ajouter une clôture
- [ ] **Vérifier**: Tous les objets visibles, déplaçables, propriétés affichées

#### Test 5: Validation distances
- [ ] Placer un arbre trop près de la maison (< 2m)
- [ ] **Attendu**: Ligne rouge de mesure + distance affichée
- [ ] **Vérifier**: Toutes les contraintes (maison, canalisations, autres arbres, clôtures)

#### Test 6: Timeline croissance
- [ ] Ajouter un arbre
- [ ] Déplacer le slider "Croissance" de 0 à 20 ans
- [ ] **Attendu**: L'ellipse de l'arbre grandit proportionnellement
- [ ] **Vérifier**: Label mis à jour avec nouvelles dimensions

#### Test 7: Heure et saison
- [ ] Déplacer le slider "Heure"
- [ ] **Attendu**: Indicateur de soleil se déplace
- [ ] Cliquer sur les boutons saison (🌸☀️🍂❄️)
- [ ] **Vérifier**: Saison active mise en évidence

#### Test 8: Export/Import JSON
- [ ] Créer un plan avec plusieurs objets
- [ ] Onglet "Plan" → "Télécharger le plan (JSON)"
- [ ] **Attendu**: Fichier JSON téléchargé
- [ ] Recharger la page
- [ ] Onglet "Plan" → "Charger un plan" → sélectionner le JSON
- [ ] **Vérifier**: Plan restauré exactement à l'identique

---

### Mode Planner - Vue 3D

#### Test 9: Basculer en 3D
- [ ] Avec un plan existant, cliquer sur "Vue 3D"
- [ ] **Attendu**: Vue 3D s'affiche avec tous les objets
- [ ] **Vérifier**: Arbres, maison, sol avec couches, clôtures visibles

#### Test 10: Contrôles 3D
- [ ] Glisser pour orbiter la caméra
- [ ] Molette pour zoomer
- [ ] Clic droit + glisser pour panner
- [ ] **Vérifier**: Mouvements fluides, pas de lag

#### Test 11: Timeline 3D
- [ ] En vue 3D, déplacer le slider "Croissance"
- [ ] **Attendu**: Arbres 3D grandissent
- [ ] Déplacer le slider "Heure"
- [ ] **Attendu**: Position du soleil change, ombres se déplacent

#### Test 12: Synchronisation 2D ↔ 3D
- [ ] Passer en 2D
- [ ] Ajouter un objet
- [ ] Passer en 3D
- [ ] **Attendu**: Nouvel objet visible en 3D
- [ ] Inverse : modifier en 3D, vérifier en 2D

---

### Interface et Thème

#### Test 13: Mode Jour/Nuit
- [ ] Cliquer sur l'icône soleil/lune dans le header
- [ ] **Attendu**: Thème bascule instantanément
- [ ] **Vérifier**: 
  - Tous les composants changent de couleur
  - Panneau latéral, timeline, boutons, menus
  - Contrastes lisibles dans les deux modes

#### Test 14: Responsive
- [ ] Réduire la largeur de la fenêtre (< 900px)
- [ ] **Attendu**: Timeline passe en colonne verticale
- [ ] **Vérifier**: Tous les éléments restent accessibles

#### Test 15: Boutons 2D/3D
- [ ] En mode planificateur, vérifier les boutons 2D/3D en haut à droite
- [ ] **Attendu**: 
  - Boutons compacts (70px)
  - Icônes visibles
  - Toggle fonctionne
  - État actif mis en évidence

#### Test 16: Timeline compacte
- [ ] En mode planificateur, vérifier la timeline en bas
- [ ] **Attendu**:
  - Centrée horizontalement
  - Décalée de 48px du bas (visible au-dessus de la barre Windows)
  - Icônes uniformes (32x32px)
  - Sliders fonctionnels

---

### Log Viewer

#### Test 17: Affichage des logs
- [ ] Cliquer sur "📋 Logs" dans le header
- [ ] **Attendu**: Panel de logs s'ouvre
- [ ] **Vérifier**: 
  - Logs par catégorie (Canvas, Timeline, Validation, etc.)
  - Bouton fermer fonctionne
  - Scrolling si beaucoup de logs

---

## 📊 Résumé des Tests

### Avant Tests
- Build : ✅ Succès
- Aucune erreur de compilation
- Bundle optimisé

### Après Tests (À COMPLÉTER PAR L'UTILISATEUR)

| Catégorie | Tests | Passés | Échoués | Notes |
|-----------|-------|--------|---------|-------|
| Build | 1 | ✅ 1 | 0 | - |
| Explorer | 3 | ? | ? | - |
| Planner 2D | 5 | ? | ? | - |
| Planner 3D | 4 | ? | ? | - |
| Interface | 4 | ? | ? | - |
| Logs | 1 | ? | ? | - |
| **TOTAL** | **18** | **?** | **?** | - |

---

## 🐛 Bugs Trouvés

*(À compléter si des problèmes sont découverts)*

| # | Description | Sévérité | Statut |
|---|-------------|----------|--------|
| - | - | - | - |

---

## ✅ Validation Finale

- [ ] Tous les tests passent
- [ ] Aucun bug bloquant
- [ ] Performance acceptable (< 3s chargement initial)
- [ ] Thème jour/nuit cohérent partout
- [ ] Timeline fonctionnelle et visible

---

**Prochaine étape**: Si tous les tests passent → Push vers production ✅

