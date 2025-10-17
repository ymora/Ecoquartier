# 📘 Guide : Ajouter un nouvel arbre ou arbuste

**Architecture centralisée** : Toutes les données dans UN SEUL fichier !

---

## 🚀 Procédure rapide (5 étapes)

### **Étape 1 : Ouvrir le fichier de données**

```
client/src/data/arbustesData.js
```

### **Étape 2 : Choisir un modèle**

Copier un arbre/arbuste **similaire** existant :

| Pour ajouter... | Copier... | Raison |
|----------------|-----------|---------|
| Cerisier | `prunus-kanzan` | Même famille, structure complète |
| Arbre méditerranéen | `arbre-judee` | Spécificités méditerranéennes |
| Grand arbre racines problématiques | `erable-rouge` | Avertissements racines |
| Arbuste haie | `troene` | Distances haies, taille fréquente |
| Arbuste parfumé | `osmanthe` ou `seringat` | Gestion parfum |
| Arbuste toxique | `fusain` | Avertissements toxicité |
| Arbuste fruits comestibles | `noisetier` | Pollinisation, fructification |

### **Étape 3 : Remplir TOUTES les sections**

#### ✅ **Données de base** (OBLIGATOIRE - toujours présent)
```javascript
{
  id: 'nom-arbre',                    // ← URL friendly (pas d'espaces)
  name: 'Nom Commun',
  nomScientifique: 'Genus species',
  famille: 'Famille botanique',
  type: 'arbre' ou 'arbuste',
  tailleMaturite: 'X-Y m',
  envergure: 'X-Y m',
  
  floraison: {
    periode: 'Mois',
    description: '...',
    couleur: '...',
    parfum: '...'                     // ← Si applicable
  },
  
  fructification: {
    periode: '...',
    description: '...',
    couleur: '...'
  },
  
  feuillage: {
    type: 'Caduc/Persistant/Semi-persistant',
    couleurAutomne: '...',
    description: '...'
  },
  
  rameaux: {                          // ← Si remarquables
    couleur: '...',
    particularite: '...'
  },
  
  plantation: {
    periode: '...',
    conseil: '...'
  },
  
  sol: {
    type: '...',
    ph: '...',
    humidite: '...'
  },
  
  exposition: '...',
  arrosage: '...',
  rusticite: '...',
  croissance: '...',
  
  taille: {
    periode: '...',
    frequence: '...',
    methode: '...',
    conseil: '...'
  },
  
  calendrierAnnuel: [
    { mois: '...', action: '...', icone: '...' },
    // ... 8-12 entrées couvrant l'année
  ],
  
  maladies: [ '...', '...', ... ],
  
  biodiveriste: {
    faune: '...',
    insectes: '...',
    oiseaux: '...'
  },
  
  toxicite: {
    niveau: '...',
    danger: '...',
    prevention: '...',
    allergie: '...'                   // ← Si applicable
  },
  
  utilisations: [ '...', '...', ... ],
  
  anecdote: '...',
```

#### ✅ **Réglementation** (OBLIGATOIRE)
```javascript
  reglementation: {
    systemeRacinaire: {
      type: 'Pivotant/Traçant/Superficiel/Dense...',
      profondeur: 'X-Y m',
      etalement: 'X-Y m',
      agressivite: 'Faible/Modérée/Élevée',
      description: 'Détails...'
    },
    
    risques: [
      'Risque 1',
      'Risque 2',
      '...'
    ],
    
    distancesLegales: {
      voisinage: {
        regle: 'Code Civil Article 671',
        distance: 'X m minimum',
        justification: '...',
        sanction: '...',
        option: '...'                 // ← Si applicable
      },
      
      espacesPublics: {
        distance: 'X m',
        regle: 'PLU local',
        justification: '...'          // ← Si applicable
      },
      
      entreArbres: {                  // ← Pour arbres
        distance: 'X m',
        justification: '...'
      },
      // OU
      entreArbustes: {                // ← Pour arbustes
        distance: 'X m en haie, Y m isolé',
        justification: '...'          // ← Si applicable
      },
      
      infrastructures: {
        fondations: 'X m minimum',
        canalisations: 'X m minimum',
        fossesSeptiques: 'X m minimum',
        piscine: 'X m minimum',
        terrasse: 'X m minimum',
        // ... autres selon pertinence
      }
    },
    
    conseils: 'Conseils pratiques placement...'
  },
```

#### ✅ **Informations complémentaires** (OBLIGATOIRE)
```javascript
  informationsComplementaires: {
    pollinisation: {
      type: 'Autofertile/Monoïque/Hermaphrodite/Autostérile...',
      besoin: '...',
      production: '...',
      conseil: '...'
    },
    
    dangersEtPrecautions: {
      taille: {
        danger: 'FAIBLE/MODÉRÉ/ÉLEVÉ/TRÈS ÉLEVÉ',
        risques: [ '...', '...' ],
        periodeDanger: '⛔ ...',
        periodeSecuritaire: '✅ ...',
        protection: '...',
        conseil: '...'
      },
      
      reglementationTaille: {
        loi: '⚠️ INTERDICTION 16 mars - 15 août',
        raison: 'Protection nidification oiseaux',
        sanction: 'Amende 3 750€...',
        application: '...',
        exception: '...'              // ← Si applicable
      },
      
      deplacementImpossible: {        // ← Si applicable (racine pivot)
        alerte: '...',
        raison: '...',
        consequence: '...',
        conseil: '...'
      },
      
      racinesProblematiques: {        // ← Si racines agressives
        alerte: '...',
        etendue: '...',
        profondeur: '...',
        degats: [ '...', '...' ],
        couts: '...',
        responsabilite: '...',
        prevention: '...',
        conseil: '...'
      },
      
      manipulation: '...'             // ← Si toxique (ex: fusain)
    },
    
    allergies: {
      pollen: 'Faible/Modéré/Élevé',
      niveau: '...',                  // ← Si élevé
      symptomes: '...',               // ← Si élevé
      periode: '...',                 // ← Si applicable
      contact: '...',
      parfum: '...',                  // ← Si parfum intense
      sensibles: '...',
      conseil: '...',
      noisettes: '...'                // ← Si applicable (noisetier)
    },
    
    animauxDomestiques: {
      chiens: '✅ Non toxique' ou '⚠️ Toxique' ou '🔴 TRÈS TOXIQUE',
      chats: '...',
      chevaux: '...',
      detail_chevaux: '...',          // ← Si danger spécifique
      symptomes: '...',               // ← Si toxique
      dose: '...',                    // ← Si toxique
      urgence: '...',                 // ← Si très toxique
      oiseaux: '...',
      ecureuils: '...',               // ← Si applicable
      poules: '...',                  // ← Si applicable
      conseil: '...'
    },
    
    protectionHivernale: {
      adulte: '...',
      jeunesPlants: [ '...', '...' ],
      gelPrintanier: '...',           // ← Si sensible
      gelAutomnal: '...',             // ← Si applicable (érable)
      feuillage: '...',               // ← Si semi-persistant
      rameaux: '...'                  // ← Si décoratifs hiver
    },
    
    fertilisation: {
      besoins: 'Très faibles/Faibles/Modérés/Élevés',
      periode: '...',
      type: '...',
      quantite: '...',
      frequence: '...',
      specificite: '...',             // ← Si particularités (sol acide, etc.)
      chlorose: '...',                // ← Si sensible calcaire
      exces: '...',                   // ← Avertissements
      special: '...',                 // ← Éléments spéciaux (bore, etc.)
      particularite: '...',           // ← Si légumineuse, etc.
      conseil: '...'
    },
    
    specificites: {                   // ← Si applicable (particularités uniques)
      cauliflorie: '...',             // ← Arbre de Judée
      solAcide: '...',                // ← Érable rouge
      chloroseCalcaire: '...',        // ← Érable rouge
      testSol: '...',
      alternative: '...',
      fleursComestibles: '...',       // ← Arbre de Judée
      delaiFloraison: '...',
      siropErable: '...',             // ← Érable rouge
      // ... autres spécificités selon l'arbre
    },
    
    sujetsForums: [                   // ← Questions fréquentes (4-12 items)
      'Question 1 ? → Réponse',
      'Question 2 ? → Réponse',
      '...'
    ]
  }
}
```

### **Étape 4 : Ajouter les images**

```bash
# Créer le dossier
mkdir client/public/images/[id-arbre]

# Ajouter les photos (JPG recommandé)
# Nomenclature : [id-arbre]_[type]_[numéro].jpg
# Types : vue_generale, fleurs, feuilles, fruits, bourgeons, tronc, automne, hiver
```

Mettre à jour `client/public/images.json` :
```json
{
  "nom-arbre": [
    "nom-arbre_vue_generale_01.jpg",
    "nom-arbre_fleurs_01.jpg",
    "nom-arbre_fleurs_02.jpg",
    "..."
  ]
}
```

### **Étape 5 : Vérifier**

```bash
# Tester le build
cd client
npm run build

# Vérifier qu'il n'y a pas d'erreurs
# ✅ Si build réussi → TERMINÉ !
```

---

## 🔎 Sources d'informations recommandées

Pour remplir les données, croiser plusieurs sources :

### Données botaniques
- Missouri Botanical Garden (missouribotanicalgarden.org)
- RHS - Royal Horticultural Society (rhs.org.uk)
- USDA Plant Database (plants.usda.gov)
- Jardin Botanique de France

### Réglementation française
- Code Civil Articles 671-673 (Légifrance)
- PLU de Bessancourt (mairie-bessancourt.fr)
- Service-Public.gouv.fr (distances légales)

### Système racinaire
- Littérature horticole spécialisée
- Guides techniques paysagistes
- Retours d'expérience forums

### Allergies et toxicité
- Centre Antipoison (cap.chru-lille.fr)
- ANSES (anses.fr)
- Réseau National de Vigilance et de Prévention des Pathologies Végétales

### Biodiversité
- LPO - Ligue Protection Oiseaux (lpo.fr)
- Guides mellifères
- Observatoire de la Biodiversité des Jardins

---

## ⚠️ Checklist anti-oubli

Avant de considérer l'ajout comme terminé :

- [ ] **Données de base** : Toutes les sections remplies ?
- [ ] **Réglementation** : Système racinaire + distances + risques ?
- [ ] **Infos complémentaires** : Pollinisation + dangers + allergies + animaux + fertilisation ?
- [ ] **Calendrier annuel** : 8-12 entrées couvrant toute l'année ?
- [ ] **Dossier images** : Créé avec au moins 3 photos ?
- [ ] **images.json** : Entrée ajoutée ?
- [ ] **Build test** : `npm run build` réussi ?
- [ ] **Vérification visuelle** : Tous les onglets affichent des données ?
- [ ] **Comparateur** : La plante s'affiche correctement ?

---

## 💡 Astuces

### Pour les racines
- Agressivité **Faible** : Osmanthe, Fusain
- Agressivité **Modérée** : Troène, Cornouiller, Prunus
- Agressivité **Élevée** : Noisetier (drageons), Érable rouge (superficielles)

### Pour la toxicité
- **Non toxique** : Noisetier, Osmanthe, Cornouiller, Seringat
- **Modérément toxique** : Troène (baies amères)
- **Toxique** : Prunus (feuilles/noyaux cyanure), Arbre de Judée (gousses)
- **TRÈS toxique** : Fusain (TOUTES parties), Érable rouge (chevaux uniquement)

### Pour les allergies
- **Très allergisant** : Noisetier (pollen janvier-mars)
- **Modéré** : Troène, Érable rouge
- **Faible** : Prunus, Fusain, Osmanthe
- **Parfum intense** : Osmanthe, Seringat, Troène

### Pour la taille
- **NE PAS tailler** : Arbre de Judée (cicatrisation très lente)
- **Dangers ÉLEVÉS** : Prunus (chancre, gommose), Érable rouge (pleurs sève)
- **Dangers MODÉRÉS** : Certains Prunus
- **Sans danger** : Troène, Seringat, Cornouiller, Noisetier, Fusain, Osmanthe

### Pour le sol
- **Aime le calcaire** : Arbre de Judée, Fusain
- **Tolère calcaire** : Troène, Cornouiller, Noisetier
- **Préfère neutre** : Prunus, Osmanthe
- **EXIGE sol acide** : Érable rouge (pH 4.5-6.5)

---

## 📝 Template vide

Un template vide est disponible en copiant n'importe quel arbre existant et en remplaçant toutes les valeurs.

**Recommandation** : Copier `prunus-kanzan` (structure la plus complète) et adapter.

---

## 🆘 En cas de problème

### Build échoue
1. Vérifier la syntaxe JavaScript (virgules, accolades)
2. Vérifier que tous les champs obligatoires sont présents
3. Chercher les erreurs dans la console de build

### Onglets vides
1. Vérifier que `reglementation` existe
2. Vérifier que `informationsComplementaires` existe
3. Vérifier la structure (orthographe des clés)

### Images ne s'affichent pas
1. Vérifier que le dossier existe : `client/public/images/[id]`
2. Vérifier `images.json` - entrée présente avec bon id
3. Vérifier nomenclature fichiers : `[id]_[type]_[num].jpg`

---

✨ **Avec cette procédure, ajouter un arbre prend 15-30 minutes au lieu de risquer des oublis !**

**Plus jamais d'onglets vides !** 🎊

