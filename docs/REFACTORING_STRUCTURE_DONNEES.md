# Refactoring : Centralisation des données

## ❌ Problème actuel

Les données sont éparpillées dans **3 fichiers** :
- `arbustesData.js` - données de base
- `reglementationData.js` - réglementation et racines  
- `informationsComplementaires.js` - infos complémentaires

**Conséquence** : Pour ajouter un arbre, il faut modifier 3 fichiers → risque d'oubli → onglets vides

## ✅ Solution proposée

**UN SEUL FICHIER** : `arbustesData.js` avec TOUTES les données

## 📋 Structure consolidée (exemple)

```javascript
{
  id: 'prunus-kanzan',
  name: 'Cerisier du Japon Kanzan',
  
  // ========== DONNÉES DE BASE (actuellement dans arbustesData.js) ==========
  nomScientifique: 'Prunus serrulata \'Kanzan\'',
  famille: 'Rosaceae',
  type: 'arbre',
  tailleMaturite: '6-10 m',
  envergure: '4-6 m',
  floraison: { ... },
  fructification: { ... },
  feuillage: { ... },
  rameaux: { ... },
  plantation: { ... },
  sol: { ... },
  exposition: '...',
  arrosage: '...',
  rusticite: '...',
  croissance: '...',
  taille: { ... },
  calendrierAnnuel: [ ... ],
  maladies: [ ... ],
  biodiveriste: { ... },
  toxicite: { ... },
  utilisations: [ ... ],
  anecdote: '...',
  
  // ========== RÉGLEMENTATION (actuellement dans reglementationData.js) ==========
  reglementation: {
    systemeRacinaire: {
      type: '...',
      profondeur: '...',
      etalement: '...',
      agressivite: '...',
      description: '...'
    },
    risques: [ ... ],
    distancesLegales: {
      voisinage: { ... },
      espacesPublics: { ... },
      entreArbres: { ... },
      infrastructures: { ... }
    },
    conseils: '...'
  },
  
  // ========== INFOS COMPLÉMENTAIRES (actuellement dans informationsComplementaires.js) ==========
  informationsComplementaires: {
    pollinisation: { ... },
    dangersEtPrecautions: {
      taille: { ... },
      reglementationTaille: { ... }
    },
    allergies: { ... },
    animauxDomestiques: { ... },
    protectionHivernale: { ... },
    fertilisation: { ... },
    sujetsForums: [ ... ]
  }
}
```

## 🔧 Étapes de migration

1. ✅ Créer nouvelle structure dans arbustesData.js
2. ✅ Migrer toutes les données des 3 fichiers
3. ✅ Mettre à jour ArbusteDetail.jsx pour lire la nouvelle structure
4. ✅ Tester que tout fonctionne
5. ✅ Supprimer reglementationData.js
6. ✅ Supprimer informationsComplementaires.js

## 📊 Résultat attendu

- **1 seul fichier** à modifier pour ajouter/modifier un arbre
- **0 risque** d'oubli
- **Code plus maintenable**
- **Structure plus claire**

