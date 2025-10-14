/**
 * Informations complémentaires importantes souvent oubliées
 * - Pollinisation
 * - Dangers de la taille
 * - Allergies
 * - Animaux domestiques
 * - Protection hivernale
 * - Périodes interdites de taille (loi)
 */

export const informationsComplementaires = {
  // ARBRES
  'prunus-kanzan': {
    pollinisation: {
      type: 'Autofertile (stérile en pratique)',
      besoin: 'Aucun pollinisateur nécessaire',
      production: 'Fruits RAREMENT produits (variété ornementale à fleurs doubles)',
      conseil: 'Planté uniquement pour ornement, pas pour fruits'
    },
    dangersEtPrecautions: {
      taille: {
        danger: 'ÉLEVÉ - Cerisiers très sensibles aux maladies',
        risques: [
          'CHANCRE BACTÉRIEN (peut tuer l\'arbre)',
          'GOMMOSE (écoulement de résine)',
          'Entrée de champignons par les plaies de taille',
          'Cicatrisation très lente'
        ],
        periodeDanger: '⛔ JAMAIS tailler octobre-avril (pluie, gel)',
        periodeSecuritaire: '✅ Mai-juin UNIQUEMENT, après floraison, par temps SEC',
        protection: 'Cicatrisant OBLIGATOIRE sur toute plaie > 2cm',
        conseil: 'Minimiser la taille. Laisser port naturel. Un cerisier bien placé ne nécessite quasi aucune taille.'
      },
      reglementationTaille: {
        loi: '⚠️ INTERDICTION LÉGALE de tailler 16 mars - 15 août',
        raison: 'Protection nidification oiseaux (Code Rural)',
        sanction: 'Réduction 3% aides PAC (agriculteurs) + amende possible',
        exception: 'Travaux urgents sécurité avec autorisation préfet',
        application: 'S\'applique aux haies ET arbres isolés en zone rurale/périurbaine'
      }
    },
    allergies: {
      pollen: 'Faible (peu de pollen, fleurs doubles)',
      contact: 'Aucun risque',
      sensibles: 'Personnes allergiques aux Rosacées (rare)'
    },
    animauxDomestiques: {
      chiens: '⚠️ Feuilles et noyaux toxiques (cyanure) - Surveiller',
      chats: '⚠️ Toxique - Éviter ingestion feuilles',
      chevaux: '🔴 DANGEREUX - Feuilles très toxiques pour équidés',
      oiseaux: '✅ Sans danger - Les oiseaux peuvent se percher',
      conseil: 'Surveiller animaux, surtout chevaux. Feuilles tombées au sol restent toxiques.'
    },
    protectionHivernale: {
      adulte: 'Aucune protection nécessaire (rustique -20°C)',
      jeunesPlants: [
        'Paillage épais (10-15 cm) les 2 premières années',
        'Voile hivernage si gel < -15°C la première année',
        'Protéger le point de greffe si présent'
      ],
      gelPrintanier: '⚠️ Gel tardif (avril) peut détruire les fleurs déjà ouvertes'
    },
    fertilisation: {
      besoins: 'Faibles à modérés',
      periode: 'Mars (avant floraison)',
      type: 'Compost ou engrais organique',
      quantite: '2-3 kg de compost par m² de couronne',
      frequence: 'Annuelle les 5 premières années, puis tous les 2-3 ans',
      exces: '⚠️ Excès d\'azote = croissance excessive = sensibilité maladies'
    },
    sujetsForums: [
      'Pourquoi mon cerisier ne fleurit pas ? (plantation trop récente, ombre, sol calcaire)',
      'Gommose sur le tronc - que faire ? (ne pas tailler en hiver, cicatriser plaies)',
      'Branches qui meurent après taille (chancre - tailler en été uniquement)',
      'Peut-on le tailler en hiver ? NON JAMAIS !'
    ]
  },

  'prunus-accolade': {
    pollinisation: {
      type: 'Autofertile (stérile)',
      besoin: 'Aucun',
      production: 'Fruits très rares (hybride)',
      conseil: 'Ornement uniquement'
    },
    dangersEtPrecautions: {
      taille: {
        danger: 'MODÉRÉ - Moins sensible que Kanzan',
        risques: ['Chancre (rare)', 'Gommose possible', 'Champignons'],
        periodeDanger: '⛔ Éviter octobre-mars',
        periodeSecuritaire: '✅ Mai-juin, temps sec',
        protection: 'Cicatrisant recommandé',
        conseil: 'Taille minimale nécessaire - Port naturellement harmonieux'
      },
      reglementationTaille: {
        loi: '⚠️ INTERDICTION 16 mars - 15 août',
        raison: 'Protection oiseaux nicheurs',
        sanction: 'Amende + réduction aides PAC',
        application: 'Toutes zones'
      }
    },
    allergies: {
      pollen: 'Faible',
      contact: 'Aucun',
      sensibles: 'Rosacées (rare)'
    },
    animauxDomestiques: {
      chiens: '⚠️ Feuilles toxiques',
      chats: '⚠️ Toxique',
      chevaux: '🔴 Très toxique',
      conseil: 'Moins dangereux que Kanzan mais surveiller quand même'
    },
    protectionHivernale: {
      adulte: 'Aucune (très rustique -25°C)',
      jeunesPlants: ['Paillage 2 premières années'],
      gelPrintanier: 'Floraison précoce (mars) sensible gel tardif'
    },
    fertilisation: {
      besoins: 'Faibles',
      periode: 'Mars',
      type: 'Compost',
      quantite: '2 kg par m²',
      frequence: 'Tous les 2 ans suffit'
    },
    sujetsForums: [
      'Floraison précoce gelée - normal, année suivante OK',
      'Très peu de maladies - un des plus résistants',
      'Croissance lente les 3 premières années'
    ]
  },

  'prunus-sunset-boulevard': {
    pollinisation: {
      type: 'Autofertile (stérile)',
      besoin: 'Aucun',
      production: 'Pas de fruits',
      conseil: 'Ornement - couleur unique rose saumon'
    },
    dangersEtPrecautions: {
      taille: {
        danger: 'MODÉRÉ',
        risques: ['Chancre', 'Gommose'],
        periodeDanger: '⛔ Octobre-mars',
        periodeSecuritaire: '✅ Mai-juin',
        protection: 'Cicatrisant recommandé',
        conseil: 'Variété récente à taille minimale'
      },
      reglementationTaille: {
        loi: '⚠️ INTERDICTION 16 mars - 15 août',
        raison: 'Protection nidification',
        sanction: 'Amende',
        application: 'Toutes zones'
      }
    },
    allergies: {
      pollen: 'Faible',
      contact: 'Aucun',
      sensibles: 'Rosacées (rare)'
    },
    animauxDomestiques: {
      chiens: '⚠️ Feuilles toxiques',
      chats: '⚠️ Toxique',
      chevaux: '🔴 Très toxique',
      conseil: 'Surveillance standard Prunus'
    },
    protectionHivernale: {
      adulte: 'Aucune (-20°C)',
      jeunesPlants: ['Paillage', 'Voile si < -18°C première année'],
      gelPrintanier: 'Floraison avril - risque gel modéré'
    },
    fertilisation: {
      besoins: 'Modérés',
      periode: 'Mars',
      type: 'Compost bien décomposé',
      quantite: '2-3 kg par m²',
      frequence: 'Annuelle jeunes, puis tous les 2 ans'
    },
    sujetsForums: [
      'Couleur rose saumon unique - bien choisir emplacement',
      'Couleurs automnales spectaculaires - besoin soleil',
      'Jeunes pousses pourpres au printemps magnifiques'
    ]
  },

  // ARBUSTES
  'noisetier': {
    pollinisation: {
      type: 'MONOÏQUE mais AUTOSTÉRILE',
      besoin: '⚠️ MINIMUM 2 PLANTS nécessaires pour fructification',
      production: 'Noisettes abondantes SI pollinisation croisée',
      conseil: 'Planter 2+ sujets espacés 3-5m. Pollinisation vent (janvier-mars). Variétés différentes = meilleur rendement.'
    },
    dangersEtPrecautions: {
      taille: {
        danger: 'FAIBLE',
        risques: ['Repousse vigoureuse après taille', 'Drageons stimulés si taille sévère'],
        periodeDanger: '⛔ 16 mars - 15 août (loi protection oiseaux)',
        periodeSecuritaire: '✅ Février-mars (avant floraison) OU novembre après récolte',
        protection: 'Pas nécessaire',
        conseil: 'Supporte très bien la taille. Recépage possible pour rajeunir.'
      },
      reglementationTaille: {
        loi: '⚠️ INTERDICTION LÉGALE 16 mars - 15 août',
        raison: 'Protection nidification oiseaux (Code Rural + PAC)',
        sanction: 'Amende 3 750€ + réduction 3% aides PAC',
        application: 'Haies et arbustes isolés'
      }
    },
    allergies: {
      pollen: '🔴 TRÈS ALLERGISANT (janvier-mars)',
      niveau: 'Allergénicité ÉLEVÉE - Pollen abondant transporté par vent',
      symptomes: 'Rhinite, conjonctivite, asthme (personnes sensibles)',
      periode: 'Janvier à mars (floraison chatons)',
      conseil: 'Éloigner des fenêtres chambres. Personnes allergiques : éviter proximité.',
      noisettes: '⚠️ ALLERGIE ALIMENTAIRE fréquente (anaphylaxie possible)'
    },
    animauxDomestiques: {
      chiens: '✅ Feuilles et noisettes non toxiques',
      chats: '✅ Non toxique',
      chevaux: '✅ Non toxique - Apprécient les noisettes',
      oiseaux: '✅ Excellent - Noisettes très appréciées',
      ecureuils: '✅ Friands de noisettes',
      conseil: 'Sans danger pour animaux. Attention allergie noisettes (humains).'
    },
    protectionHivernale: {
      adulte: 'Aucune (très rustique -25°C)',
      jeunesPlants: ['Paillage recommandé première année'],
      gelPrintanier: 'Floraison hiver (janvier-mars) résiste au gel'
    },
    fertilisation: {
      besoins: 'Modérés',
      periode: 'Mars (après floraison)',
      type: 'Compost + cendres de bois (potassium)',
      quantite: '3-4 kg compost par pied',
      frequence: 'Annuelle pour bonne fructification',
      special: 'Bore et calcium importants pour noisettes'
    },
    sujetsForums: [
      'Pourquoi pas de noisettes ? → Besoin 2 plants minimum !',
      'Drageons envahissants → Couper à la bêche régulièrement',
      'Quand récolter ? → Septembre quand cupule brunit',
      'Pollen allergisant → Vrai, planter loin des fenêtres'
    ]
  },

  'fusain': {
    pollinisation: {
      type: 'Hermaphrodite autofertile',
      besoin: 'Aucun',
      production: 'Fruits décoratifs abondants',
      conseil: 'Fructification automatique (insectes pollinisateurs)'
    },
    dangersEtPrecautions: {
      taille: {
        danger: 'FAIBLE',
        risques: ['Aucun risque particulier'],
        periodeDanger: '⛔ 16 mars - 15 août (loi)',
        periodeSecuritaire: '✅ Février-mars OU septembre-octobre',
        protection: 'Pas nécessaire',
        conseil: '⚠️ PORTER DES GANTS - toute la plante est TOXIQUE'
      },
      reglementationTaille: {
        loi: '⚠️ INTERDICTION 16 mars - 15 août',
        raison: 'Nidification oiseaux',
        sanction: 'Amende 3 750€',
        application: 'Toutes haies'
      },
      manipulation: '🔴 GANTS OBLIGATOIRES - Sève irritante, toute plante toxique'
    },
    allergies: {
      pollen: 'Faible',
      contact: '⚠️ Sève peut irriter peau sensible',
      conseil: 'Porter gants lors taille. Se laver mains après contact.'
    },
    animauxDomestiques: {
      chiens: '🔴 TRÈS TOXIQUE - Fruits et feuilles',
      chats: '🔴 TRÈS TOXIQUE',
      chevaux: '🔴 MORTEL - Éloigner absolument',
      symptomes: 'Vomissements, diarrhées, troubles cardiaques, convulsions',
      dose: 'Quelques fruits peuvent être mortels',
      urgence: 'Vétérinaire IMMÉDIATEMENT si ingestion',
      oiseaux: '✅ Les oiseaux peuvent manger fruits sans danger',
      conseil: '🔴 NE PAS planter si chevaux, chiens ou chats accessibles aux fruits'
    },
    protectionHivernale: {
      adulte: 'Aucune (très rustique -25°C)',
      jeunesPlants: ['Paillage premier hiver'],
      gelPrintanier: 'Résistant'
    },
    fertilisation: {
      besoins: 'Faibles',
      periode: 'Avril',
      type: 'Compost léger',
      quantite: '1-2 kg par pied',
      frequence: 'Tous les 2-3 ans',
      conseil: 'Éviter excès azote (croissance molle)'
    },
    sujetsForums: [
      'Fruits roses magnifiques mais TOXIQUES - attention enfants/animaux',
      'Peut-on le planter si on a un chien ? NON recommandé',
      'Oiseaux mangent fruits - normal et sans danger pour eux'
    ]
  },

  'troene': {
    pollinisation: {
      type: 'Hermaphrodite autofertile',
      besoin: 'Aucun',
      production: 'Baies noires abondantes (septembre-février)',
      conseil: 'Fructification automatique. Fleurs mellifères (juin-juillet).'
    },
    dangersEtPrecautions: {
      taille: {
        danger: 'TRÈS FAIBLE - Supporte taille sévère',
        risques: ['Aucun'],
        periodeDanger: '⛔ 16 mars - 15 août (loi)',
        periodeSecuritaire: '✅ Mai-juin après floraison + Septembre',
        protection: 'Pas nécessaire',
        conseil: 'Champion de la taille ! Supporte recépage complet. Repousse vigoureuse.'
      },
      reglementationTaille: {
        loi: '⚠️ INTERDICTION 16 mars - 15 août',
        raison: 'Nidification (troène = site privilégié oiseaux)',
        sanction: 'Amende 3 750€',
        application: 'Haies et sujets isolés',
        tolerance: 'Haie taillée stricte : tolérance locale parfois (vérifier mairie)'
      }
    },
    allergies: {
      pollen: 'Modéré',
      periode: 'Juin-juillet (floraison)',
      symptomes: 'Rhinite possible (personnes sensibles)',
      parfum: '⚠️ Parfum INTENSE peut incommoder (entêtant pour certains)',
      conseil: 'Éviter près fenêtres chambres si sensible aux parfums'
    },
    animauxDomestiques: {
      chiens: '⚠️ Baies toxiques (troubles digestifs)',
      chats: '⚠️ Baies toxiques',
      chevaux: '⚠️ Feuilles et baies toxiques',
      symptomes: 'Vomissements, diarrhées, maux de tête',
      dose: 'Ingestion importante nécessaire (goût amer dissuasif)',
      oiseaux: '✅ Sans danger - Les oiseaux adorent les baies !',
      conseil: 'Baies amères (animaux les crachent souvent). Surveiller quand même jeunes chiens.'
    },
    protectionHivernale: {
      adulte: 'Aucune (très rustique -25°C)',
      jeunesPlants: ['Paillage optionnel'],
      feuillage: 'Semi-persistant (garde feuilles hiver doux)'
    },
    fertilisation: {
      besoins: 'Très faibles',
      periode: 'Avril',
      type: 'Compost',
      quantite: '1-2 kg par m linéaire de haie',
      frequence: 'Tous les 2-3 ans',
      conseil: 'Plante peu exigeante. Compost suffit.'
    },
    sujetsForums: [
      'Parfum trop fort - normal, c\'est sa caractéristique',
      'Haie dense en combien de temps ? 2-3 ans avec tailles',
      'Baies noires toxiques ? Oui mais amères (animaux ne mangent pas)',
      'Peut-on tailler tout l\'été ? NON - interdiction 16 mars - 15 août'
    ]
  },

  'osmanthe': {
    pollinisation: {
      type: 'Hermaphrodite',
      besoin: 'Aucun (mais hybride stérile)',
      production: 'Fruits très rares (hybride)',
      conseil: 'Planté pour parfum extraordinaire'
    },
    dangersEtPrecautions: {
      taille: {
        danger: 'TRÈS FAIBLE',
        risques: ['Aucun'],
        periodeDanger: '⛔ 16 mars - 15 août (loi)',
        periodeSecuritaire: '✅ Mai-juin après floraison',
        protection: 'Pas nécessaire',
        conseil: 'Croissance lente = taille minimale. Très tolérant.'
      },
      reglementationTaille: {
        loi: '⚠️ INTERDICTION 16 mars - 15 août',
        raison: 'Protection oiseaux',
        sanction: 'Amende',
        application: 'Toutes haies'
      }
    },
    allergies: {
      pollen: 'Faible',
      parfum: '⚠️ Parfum TRÈS INTENSE (avril-mai)',
      sensibles: 'Peut incommoder personnes sensibles parfums',
      conseil: 'Éviter près fenêtres si intolérance parfums forts. Sinon = délice !'
    },
    animauxDomestiques: {
      chiens: '✅ Non toxique',
      chats: '✅ Non toxique',
      chevaux: '✅ Non toxique',
      conseil: 'Sans danger pour tous animaux'
    },
    protectionHivernale: {
      adulte: 'Aucune (-12 à -15°C)',
      jeunesPlants: [
        'Paillage épais première année',
        'Voile hivernage si < -12°C première année',
        'Protéger du vent froid'
      ],
      gelPrintanier: 'Floraison avril-mai, peu sensible'
    },
    fertilisation: {
      besoins: 'Modérés',
      periode: 'Mars-avril',
      type: 'Engrais arbustes terre bruyère',
      quantite: '50-100g engrais complet',
      frequence: 'Annuelle',
      conseil: 'Préfère engrais à libération lente'
    },
    sujetsForums: [
      'Parfum extraordinaire - vaut le coup !',
      'Croissance lente - patience première année',
      'Feuillage persistant = vert toute l\'année',
      'Supporte bien la culture en pot'
    ]
  },

  'cornouiller': {
    pollinisation: {
      type: 'Hermaphrodite autofertile',
      besoin: 'Aucun',
      production: 'Fruits noirs abondants (août-octobre)',
      conseil: 'Fructification spontanée. Très mellifère.'
    },
    dangersEtPrecautions: {
      taille: {
        danger: 'TRÈS FAIBLE',
        risques: ['Aucun - très résistant'],
        periodeDanger: '⛔ 16 mars - 15 août (loi)',
        periodeSecuritaire: '✅ Mars (recépage tous les 2-3 ans recommandé)',
        protection: 'Pas nécessaire',
        conseil: 'RECÉPAGE SÉVÈRE recommandé tous les 2-3 ans pour rameaux rouges spectaculaires. Couper à 10-20 cm du sol.'
      },
      reglementationTaille: {
        loi: '⚠️ INTERDICTION 16 mars - 15 août',
        raison: 'Site de nidification important',
        sanction: 'Amende 3 750€',
        application: 'Toutes haies champêtres',
        note: 'Respecter impérativement - excellent site nidification'
      }
    },
    allergies: {
      pollen: 'Faible',
      contact: 'Aucun',
      conseil: 'Aucun problème allergique connu'
    },
    animauxDomestiques: {
      chiens: '✅ Fruits non comestibles mais non toxiques (amers)',
      chats: '✅ Non toxique',
      chevaux: '✅ Non toxique',
      oiseaux: '✅ Fruits très appréciés (15+ espèces)',
      conseil: 'Sans danger. Fruits amers = animaux ne mangent pas. Oiseaux adorent.'
    },
    protectionHivernale: {
      adulte: 'Aucune (très rustique -30°C)',
      jeunesPlants: ['Paillage optionnel'],
      rameaux: 'Rameaux rouges = décor hivernal spectaculaire !'
    },
    fertilisation: {
      besoins: 'Faibles',
      periode: 'Mars',
      type: 'Compost',
      quantite: '2 kg par pied',
      frequence: 'Tous les 2 ans',
      conseil: 'Plante peu exigeante. Supporte sols pauvres.'
    },
    sujetsForums: [
      'Recépage tous les combien ? 2-3 ans pour beaux rameaux rouges',
      'Taille sévère endommage ? NON - repousse vigoureuse',
      'Rameaux pas très rouges - recéper plus sévèrement + soleil',
      'Supporte zones humides ? OUI excellent !'
    ]
  },

  'seringat': {
    pollinisation: {
      type: 'Hermaphrodite autofertile',
      besoin: 'Aucun',
      production: 'Capsules sans intérêt',
      conseil: 'Planté pour parfum exceptionnel fleurs'
    },
    dangersEtPrecautions: {
      taille: {
        danger: 'FAIBLE',
        risques: ['Perte floraison si taille tardive'],
        periodeDanger: '⛔ 16 mars - 15 août (loi) + ⛔ Automne-hiver (perte floraison)',
        periodeSecuritaire: '✅ JUSTE APRÈS floraison (juin-juillet) - IMPÉRATIF',
        protection: 'Pas nécessaire',
        conseil: '🔴 CRUCIAL : Tailler UNIQUEMENT après floraison ! Fleurit sur bois de l\'année précédente. Taille tardive = pas de fleurs année suivante.'
      },
      reglementationTaille: {
        loi: '⚠️ INTERDICTION 16 mars - 15 août',
        raison: 'Période inclut la floraison (mai-juin)',
        conflit: '⚠️ Conflit : Période légale chevauche période de taille optimale (juin-juillet)',
        solution: 'Tailler début juin (avant 15 juin) OU fin août-septembre (perd floraison suivante)',
        sanction: 'Amende si taille pendant période interdite'
      }
    },
    allergies: {
      pollen: 'Faible',
      parfum: '⚠️ Parfum TRÈS INTENSE (mai-juin)',
      sensibles: 'Peut incommoder personnes sensibles',
      conseil: 'Parfum entêtant la nuit. Éviter près fenêtres chambres si sensible.'
    },
    animauxDomestiques: {
      chiens: '✅ Non toxique',
      chats: '✅ Non toxique',
      chevaux: '✅ Non toxique',
      conseil: 'Totalement sans danger pour animaux'
    },
    protectionHivernale: {
      adulte: 'Aucune (très rustique -25°C)',
      jeunesPlants: ['Paillage optionnel'],
      gelPrintanier: 'Floraison mai-juin, après gelées'
    },
    fertilisation: {
      besoins: 'Faibles',
      periode: 'Mars',
      type: 'Compost',
      quantite: '2 kg par pied',
      frequence: 'Annuelle',
      conseil: 'Peu exigeant. Éviter excès azote.'
    },
    sujetsForums: [
      'Pas de fleurs pourquoi ? → Taillé en automne/hiver = erreur classique',
      'Quand tailler ? → IMPÉRATIVEMENT après floraison (juin)',
      'Parfum trop fort - planter loin des chambres',
      'Croissance rapide - comment ralentir ? Taille annuelle légère'
    ]
  }
};

// Règles générales applicables à toutes les plantes
export const reglesGeneralesComplementaires = {
  periodeTailleInterdite: {
    dates: '16 mars au 15 août (inclus)',
    loi: 'Code Rural + BCAE (Bonnes Conditions Agricoles et Environnementales)',
    raison: 'Protection nidification et élevage des oisillons',
    application: 'TOUTES haies, arbres, arbustes en zone rurale et périurbaine',
    exceptions: [
      'Travaux urgents de sécurité (chute imminente) avec autorisation',
      'Jardins privatifs urbains (tolérance locale - vérifier mairie)',
      'Taille légère de formation jeunes plants (tolérance)'
    ],
    sanctions: {
      particuliers: 'Amende jusqu\'à 3 750€',
      agriculteurs: 'Réduction 3% aides PAC + amende',
      collectivites: 'Amende + sanctions administratives'
    },
    conseil: 'Respecter IMPÉRATIVEMENT. Période couvre quasi toute la belle saison. Planifier tailles février-mars OU septembre-octobre.'
  },

  securityTaille: {
    equipement: [
      'Gants épais (protection)',
      'Lunettes de protection (projections)',
      'Vêtements longs (branches)',
      'Chaussures fermées antidérapantes',
      'Échelle stable (arbres)',
      'Sécateur/cisaille bien affûtés'
    ],
    precautions: [
      'Ne jamais tailler seul en hauteur',
      'Vérifier absence lignes électriques',
      'Temps sec uniquement (pas de pluie)',
      'Pas de vent fort (branches instables)',
      'Désinfecter outils entre plantes (maladies)',
      'Cicatrisant sur plaies > 2cm (arbres)'
    ],
    premiers_secours: [
      'Trousse premiers secours à proximité',
      'Téléphone accessible',
      'Connaissance gestes urgence (chute, coupure)',
      'Numéro urgences : 15 (SAMU) ou 112'
    ]
  },

  fertilisation: {
    analyse_sol: 'Recommandée tous les 3-5 ans (pH, NPK)',
    periodes: {
      printemps: 'Mars-avril (croissance)',
      automne: 'Octobre (repos végétatif - engrais lent)'
    },
    types: {
      organique: 'Compost, fumier composté (préféré)',
      mineral: 'NPK équilibré (10-10-10)',
      специalisé: 'Terre bruyère pour Osmanthe'
    },
    exces: [
      'Croissance molle (sensibilité maladies)',
      'Moins de fleurs (trop d\'azote)',
      'Pollution nappes phréatiques',
      'Brûlure racinaire si excès'
    ]
  },

  maladiesCommunes: {
    champignons: {
      oidium: 'Soufre ou bicarbonate',
      rouille: 'Bouillie bordelaise',
      anthracnose: 'Cuivre',
      prevention: 'Aération, éviter excès humidité'
    },
    insectes: {
      pucerons: 'Savon noir, auxiliaires (coccinelles)',
      cochenilles: 'Huile blanche hiver',
      chenilles: 'Bacillus thuringiensis',
      prevention: 'Biodiversité (oiseaux, insectes auxiliaires)'
    },
    bacteries: {
      chancre: 'Taille bois sain, cicatrisant, éviter blessures',
      gommose: 'Taille en été, drainage, pas d\'excès eau'
    }
  },

  eau: {
    arrosageJeunesPlants: '10-15L par semaine première année',
    arrosageChaleur: '20-30L par semaine si canicule',
    paillage: 'ESSENTIEL - Économise 50% eau + limite adventices',
    epaisseurPaillis: '10-15 cm',
    typesPaillis: [
      'BRF (Bois Raméal Fragmenté) - excellent',
      'Écorces de pin - longue durée',
      'Paille - économique',
      'Tontes séchées - gratuit'
    ],
    drainage: 'Trou drainage si sol argileux (gravier fond)'
  },

  climat: {
    canicule: [
      'Arrosage accru (2x par semaine)',
      'Paillage épais',
      'Ombrage jeunes plants si possible',
      'Éviter fertilisation période sèche'
    ],
    gel: [
      'Paillage racines',
      'Voile hivernage jeunes plants',
      'Butter le pied (10-15 cm terre)',
      'Éviter arrosage avant gel (eau gèle)'
    ],
    secheresse: [
      'Paillage OBLIGATOIRE',
      'Arrosage profond (30 cm) plutôt que superficiel',
      'Stopper fertilisation',
      'Binage superficiel (casse capillarité)'
    ]
  }
};

export default { informationsComplementaires, reglesGeneralesComplementaires };

