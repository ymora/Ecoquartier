export const arbresData = [
  {
    id: 'prunus-kanzan',
    name: 'Cerisier du Japon Kanzan',
    nomScientifique: 'Prunus serrulata \'Kanzan\'',
    famille: 'Rosaceae',
    type: 'arbre',
    tailleMaturite: '6-10 m',
    envergure: '4-6 m',
    floraison: {
      periode: 'Avril à Mai',
      description: 'Fleurs doubles spectaculaires en pompons, très abondantes, couvrant entièrement les branches',
      couleur: 'Rose fuchsia intense',
      parfum: 'Légèrement parfumé'
    },
    fructification: {
      periode: 'Rare en culture',
      description: 'Fruits rarement produits en culture (variété ornementale)',
      couleur: 'N/A'
    },
    feuillage: {
      type: 'Caduc',
      couleurAutomne: 'Orange cuivré à bronze',
      description: 'Feuilles ovales, dentées, vert bronze au débourrement puis vert foncé'
    },
    plantation: {
      periode: 'Octobre à Mars (hors gel)',
      conseil: 'Préférer l\'automne. Éviter les sols calcaires. Prévoir 6-8m d\'espace. Planter en situation abritée des vents forts qui abîment les fleurs.'
    },
    sol: {
      type: 'Profond, frais, bien drainé, légèrement acide',
      ph: '6.0-7.0 (éviter le calcaire)',
      humidite: 'Frais, supporte mal la sécheresse prolongée'
    },
    exposition: 'Soleil (6h minimum), abrité des vents',
    arrosage: 'Régulier les 3 premières années. Arrosage hebdomadaire en été. Paillage recommandé.',
    rusticite: '-20°C (très rustique)',
    croissance: 'Moyenne (30-40 cm/an)',
    taille: {
      periode: 'Juste après floraison (mai-juin) - CRUCIAL',
      frequence: 'Légère annuelle',
      methode: 'Taille minimale : supprimer bois mort et branches mal placées. Éviter taille sévère qui compromet la floraison. Cicatrisant recommandé.',
      conseil: '⚠️ Ne JAMAIS tailler en hiver ! Les cerisiers sont sensibles aux maladies (chancre, gommose). Tailler uniquement par temps sec après floraison.'
    },
    calendrierAnnuel: [
      { mois: 'Janvier-Février', action: 'Repos végétatif - Ne pas tailler !', icone: '❄️' },
      { mois: 'Mars', action: 'Débourrement bronze - Fertilisation organique', icone: '🌱' },
      { mois: 'Avril-Mai', action: 'FLORAISON spectaculaire rose fuchsia', icone: '🌸' },
      { mois: 'Juin', action: 'Taille légère si nécessaire - Arrosage', icone: '✂️' },
      { mois: 'Juillet-Août', action: 'Croissance - Arrosage régulier si sec', icone: '💧' },
      { mois: 'Septembre', action: 'Ralentissement croissance', icone: '🍃' },
      { mois: 'Octobre-Novembre', action: 'Couleurs automnales bronze/orange', icone: '🍂' },
      { mois: 'Décembre', action: 'Chute des feuilles - Paillage hivernal', icone: '🍁' }
    ],
    maladies: [
      'Chancre bactérien (grave - surveiller)',
      'Gommose (écoulement résine - tailler par temps sec)',
      'Criblure (taches foliaires)',
      'Pucerons noirs (printemps)',
      'Cochenilles'
    ],
    biodiveriste: {
      faune: 'Fleurs mellifères très appréciées des abeilles et bourdons. Abri pour oiseaux.',
      insectes: 'Excellent pour pollinisateurs au printemps (période cruciale)',
      oiseaux: 'Site de nidification apprécié (feuillage dense)'
    },
    toxicite: {
      niveau: 'Feuilles et noyaux toxiques',
      danger: '⚠️ Feuilles contiennent du cyanure en faible quantité. Noyaux toxiques (amandes amères). Éviter ingestion.',
      prevention: 'Surveiller enfants et animaux. Pas de danger par simple contact.'
    },
    utilisations: [
      'Arbre d\'ornement spectaculaire',
      'Alignement et avenue',
      'Isolé sur pelouse',
      'Parcs et jardins',
      'Symbole du Hanami japonais',
      'Fleurs coupées décoratives'
    ],
    anecdote: '\'Kanzan\' signifie "montagne de fleurs" en japonais. C\'est l\'un des cerisiers japonais les plus plantés au monde pour sa floraison spectaculaire. Au Japon, la contemplation des cerisiers en fleurs (Hanami) est une tradition ancestrale célébrée nationalement.',
    
    // ========== RÉGLEMENTATION ==========
    reglementation: {
      systemeRacinaire: {
        type: 'Traçant et pivotant mixte',
        profondeur: '1-1.5 m',
        etalement: '8-12 m (1.5x la couronne)',
        agressivite: 'Modérée',
        description: 'Racines traçantes en surface + pivot central. Éviter à moins de 5m des fondations, canalisations, fosses septiques.'
      },
      risques: [
        'Racines peuvent soulever pavages si trop proche (< 3m)',
        'Risque de colmatage des canalisations si < 4m',
        'Racines de surface peuvent endommager pelouse',
        'Branches peuvent gêner lignes électriques (hauteur 8-10m)'
      ],
      distancesLegales: {
        voisinage: {
          regle: 'Code Civil Article 671',
          distance: '2 m minimum de la limite de propriété',
          justification: 'Hauteur > 2 m à maturité (6-10 m)',
          sanction: 'Le voisin peut exiger l\'arrachage ou la taille à 2m de haut'
        },
        espacesPublics: {
          distance: 'Variable selon PLU local (généralement 3-4 m)',
          regle: 'Consulter le PLU de Bessancourt',
          justification: 'Éviter gêne voirie, visibilité, réseaux enterrés'
        },
        entreArbres: {
          distance: '5-6 m',
          justification: 'Développement optimal des couronnes sans compétition'
        },
        infrastructures: {
          fondations: '5-6 m minimum',
          canalisations: '4-5 m minimum',
          fossesSeptiques: '6 m minimum',
          piscine: '4 m minimum',
          terrasse: '3 m minimum'
        }
      },
      conseils: 'Excellente pour alignement ou isolé mais prévoir espace suffisant. Éviter proximité immédiate de la maison.'
    },
    
    // ========== INFORMATIONS COMPLÉMENTAIRES ==========
    informationsComplementaires: {
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
          loi: '⚠️ AGRICULTEURS : Interdiction légale (16 mars - 15 août, arrêté préfectoral). PARTICULIERS : Recommandation forte LPO (début printemps - fin août)',
          raison: 'Protection nidification oiseaux nicheurs',
          sanction: 'Agriculteurs : Réduction 3% aides PAC + amende. Particuliers : Responsabilité civile si dégâts',
          exception: 'Travaux urgents de sécurité avec autorisation préfet (tous)',
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
    }
  },
  {
    id: 'prunus-accolade',
    name: 'Cerisier Accolade',
    nomScientifique: 'Prunus × subhirtella \'Accolade\'',
    famille: 'Rosaceae',
    type: 'arbre',
    tailleMaturite: '6-8 m',
    envergure: '4-5 m',
    floraison: {
      periode: 'Mars à Avril (précoce)',
      description: 'Fleurs semi-doubles en grappes pendantes, floraison précoce et abondante',
      couleur: 'Rose clair à blanc rosé',
      parfum: 'Légèrement parfumé'
    },
    fructification: {
      periode: 'Rare',
      description: 'Fruits rarement produits (hybride stérile)',
      couleur: 'N/A'
    },
    feuillage: {
      type: 'Caduc',
      couleurAutomne: 'Orange à rouge cuivré',
      description: 'Feuilles ovales, finement dentées, vert tendre au débourrement'
    },
    rameaux: {
      couleur: 'Brun rougeâtre',
      particularite: 'Port étalé gracieux, branches arquées'
    },
    plantation: {
      periode: 'Octobre à Mars (hors gel)',
      conseil: 'Automne idéal. Sol léger et drainant impératif. Prévoir 6m d\'espace. Un des cerisiers les plus adaptables.'
    },
    sol: {
      type: 'Tous types bien drainés, tolère calcaire léger',
      ph: '6.0-7.5 (plus tolérant que Kanzan)',
      humidite: 'Frais à sec, bonne résistance sécheresse une fois établi'
    },
    exposition: 'Soleil à mi-ombre',
    arrosage: 'Modéré. Résiste mieux à la sécheresse que Kanzan.',
    rusticite: '-25°C (très rustique)',
    croissance: 'Moyenne (30-40 cm/an)',
    taille: {
      periode: 'Après floraison (mai) si nécessaire',
      frequence: 'Minimale',
      methode: 'Port naturellement harmonieux. Taille très légère uniquement : bois mort, branches croisées. Cicatrisant obligatoire.',
      conseil: 'Un des cerisiers nécessitant le moins de taille. Laisser le port naturel se développer. Éviter absolument la taille d\'hiver.'
    },
    calendrierAnnuel: [
      { mois: 'Janvier-Février', action: 'Repos - Bourgeons floraux visibles', icone: '❄️' },
      { mois: 'Mars', action: 'FLORAISON précoce rose pâle', icone: '🌸' },
      { mois: 'Avril', action: 'Fin floraison - Débourrement feuillage', icone: '🌱' },
      { mois: 'Mai', action: 'Taille légère si besoin - Fertilisation', icone: '✂️' },
      { mois: 'Juin-Août', action: 'Croissance - Arrosage modéré', icone: '💧' },
      { mois: 'Septembre-Octobre', action: 'Ralentissement croissance', icone: '🍃' },
      { mois: 'Novembre', action: 'Couleurs automnales orange/rouge', icone: '🍂' },
      { mois: 'Décembre', action: 'Chute des feuilles - Paillage', icone: '🍁' }
    ],
    maladies: [
      'Très résistant aux maladies (meilleur que Kanzan)',
      'Chancre bactérien (rare)',
      'Pucerons (printemps)',
      'Moniliose (rare)'
    ],
    biodiveriste: {
      faune: 'Floraison précoce cruciale pour abeilles sortant d\'hibernation',
      insectes: 'Source de nectar majeure en fin d\'hiver/début printemps',
      oiseaux: 'Nidification et perchoir'
    },
    toxicite: {
      niveau: 'Feuilles et noyaux toxiques',
      danger: '⚠️ Comme tous les Prunus : feuilles et noyaux contiennent cyanure. Pas de danger par contact.',
      prevention: 'Surveiller enfants et animaux'
    },
    utilisations: [
      'Arbre d\'ornement isolé',
      'Petit jardin (taille modérée)',
      'Alignement urbain',
      'Parcs et espaces verts',
      'Fleurs précoces pour pollinisateurs',
      'Excellent rapport beauté/entretien'
    ],
    anecdote: '\'Accolade\' est un hybride anglais créé dans les années 1950. Son nom évoque l\'accueil chaleureux du printemps. C\'est un des cerisiers les plus faciles à cultiver et l\'un des premiers à fleurir, annonçant le réveil de la nature.',
    
    // ========== RÉGLEMENTATION ==========
    reglementation: {
      systemeRacinaire: {
        type: 'Traçant modéré',
        profondeur: '0.8-1.2 m',
        etalement: '6-10 m',
        agressivite: 'Faible à modérée',
        description: 'Système racinaire moins agressif que Kanzan. Racines superficielles mais moins envahissantes.'
      },
      risques: [
        'Racines de surface modérées',
        'Risque faible pour infrastructures si distance > 3m',
        'Branches arquées peuvent déborder chez le voisin'
      ],
      distancesLegales: {
        voisinage: {
          regle: 'Code Civil Article 671',
          distance: '2 m minimum',
          justification: 'Hauteur > 2 m (6-8 m)',
          sanction: 'Exigence d\'arrachage ou taille possible'
        },
        espacesPublics: {
          distance: '3 m minimum',
          regle: 'PLU local'
        },
        entreArbres: {
          distance: '4-5 m',
          justification: 'Port étalé gracieux nécessite espace'
        },
        infrastructures: {
          fondations: '4 m minimum',
          canalisations: '3 m minimum',
          fossesSeptiques: '5 m minimum',
          piscine: '3 m minimum',
          terrasse: '2.5 m minimum'
        }
      },
      conseils: 'Un des cerisiers les plus adaptés aux petits jardins. Système racinaire moins problématique.'
    },
    
    // ========== INFORMATIONS COMPLÉMENTAIRES ==========
    informationsComplementaires: {
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
    }
  },
  {
    id: 'prunus-sunset-boulevard',
    name: 'Cerisier Sunset Boulevard',
    nomScientifique: 'Prunus serrulata \'Sunset Boulevard\'',
    famille: 'Rosaceae',
    type: 'arbre',
    tailleMaturite: '5-7 m',
    envergure: '3-4 m',
    floraison: {
      periode: 'Avril',
      description: 'Fleurs simples à semi-doubles, abondantes, légèrement parfumées',
      couleur: 'Rose saumon à corail (couleur unique)',
      parfum: 'Parfum délicat'
    },
    fructification: {
      periode: 'Rare',
      description: 'Fruits rarement produits (variété ornementale)',
      couleur: 'N/A'
    },
    feuillage: {
      type: 'Caduc',
      couleurAutomne: 'Orange vif à rouge flamboyant (spectaculaire)',
      description: 'Feuilles bronze pourpré au débourrement, puis vert foncé brillant'
    },
    rameaux: {
      couleur: 'Rouge-brun',
      particularite: 'Jeunes pousses pourpres très décoratives. Port érigé puis étalé.'
    },
    plantation: {
      periode: 'Octobre à Mars (hors gel)',
      conseil: 'Automne préférable. Sol bien drainé essentiel. Prévoir 5-6m d\'espace. Excellent choix pour petits jardins (taille modérée).'
    },
    sol: {
      type: 'Bien drainé, fertile, léger',
      ph: '6.0-7.0 (éviter calcaire fort)',
      humidite: 'Frais, redoute l\'humidité stagnante'
    },
    exposition: 'Soleil (indispensable pour couleurs automnales)',
    arrosage: 'Régulier les 2-3 premières années. Paillage fortement recommandé.',
    rusticite: '-20°C (rustique)',
    croissance: 'Moyenne (25-35 cm/an)',
    taille: {
      periode: 'Après floraison (mai-juin)',
      frequence: 'Minimale',
      methode: 'Taille très légère. Supprimer uniquement bois mort et branches mal orientées. Port naturellement élégant à préserver. Cicatrisant obligatoire.',
      conseil: 'Variété récente sélectionnée pour port harmonieux nécessitant peu de taille. Laisser développer naturellement. Éviter taille hivernale (risque maladies).'
    },
    calendrierAnnuel: [
      { mois: 'Janvier-Février', action: 'Repos - Bourgeons pourpres visibles', icone: '❄️' },
      { mois: 'Mars', action: 'Débourrement bronze pourpré spectaculaire', icone: '🌱' },
      { mois: 'Avril', action: 'FLORAISON rose saumon unique', icone: '🌸' },
      { mois: 'Mai-Juin', action: 'Taille minimale si besoin - Fertilisation', icone: '✂️' },
      { mois: 'Juillet-Août', action: 'Feuillage vert brillant - Arrosage régulier', icone: '💧' },
      { mois: 'Septembre', action: 'Début changement couleurs', icone: '🍃' },
      { mois: 'Octobre-Novembre', action: 'COULEURS AUTOMNALES spectaculaires (orange/rouge)', icone: '🍂' },
      { mois: 'Décembre', action: 'Chute des feuilles - Paillage', icone: '🍁' }
    ],
    maladies: [
      'Chancre bactérien (surveiller)',
      'Gommose (tailler par temps sec)',
      'Pucerons',
      'Résistance correcte globalement'
    ],
    biodiveriste: {
      faune: 'Fleurs mellifères pour abeilles et bourdons. Couleurs automnales attirent les oiseaux migrateurs.',
      insectes: 'Bon pour pollinisateurs au printemps',
      oiseaux: 'Nidification et observation des couleurs'
    },
    toxicite: {
      niveau: 'Feuilles et noyaux toxiques',
      danger: '⚠️ Comme tous les Prunus : feuilles et noyaux toxiques (cyanure). Pas de danger par contact.',
      prevention: 'Surveiller enfants et animaux domestiques'
    },
    utilisations: [
      'Arbre d\'ornement 4 saisons (printemps + automne)',
      'Petit à moyen jardin',
      'Isolé sur pelouse',
      'Alignement urbain',
      'Parcs et jardins publics',
      'Couleur unique rose saumon',
      'Spectacle automnal exceptionnel'
    ],
    anecdote: '\'Sunset Boulevard\' est une variété récente (années 2000) sélectionnée pour sa couleur de fleurs unique rose saumon/corail et son spectacle automnal flamboyant. Son nom évoque les couchers de soleil de Californie. C\'est un des rares cerisiers offrant 2 spectacles : floraison printanière + couleurs automnales exceptionnelles.',
    
    // ========== RÉGLEMENTATION ==========
    reglementation: {
      systemeRacinaire: {
        type: 'Traçant modéré',
        profondeur: '0.8-1 m',
        etalement: '5-8 m',
        agressivite: 'Faible',
        description: 'Système racinaire compact. Variété récente sélectionnée pour taille modérée et racines peu envahissantes.'
      },
      risques: [
        'Risques minimaux si distance > 2.5m',
        'Taille modérée limite les problèmes',
        'Racines superficielles modérées'
      ],
      distancesLegales: {
        voisinage: {
          regle: 'Code Civil Article 671',
          distance: '2 m minimum',
          justification: 'Hauteur > 2 m (5-7 m)',
          sanction: 'Taille ou arrachage exigible'
        },
        espacesPublics: {
          distance: '2.5-3 m',
          regle: 'PLU local'
        },
        entreArbres: {
          distance: '4 m',
          justification: 'Taille modérée permet espacement réduit'
        },
        infrastructures: {
          fondations: '3.5 m minimum',
          canalisations: '3 m minimum',
          fossesSeptiques: '4 m minimum',
          piscine: '2.5 m minimum',
          terrasse: '2 m minimum'
        }
      },
      conseils: 'Excellent pour petits jardins urbains. Taille et racines modérées. Respecter quand même les distances légales.'
    },
    
    // ========== INFORMATIONS COMPLÉMENTAIRES ==========
    informationsComplementaires: {
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
    }
  },
  {
    id: 'arbre-judee',
    name: 'Arbre de Judée',
    nomScientifique: 'Cercis siliquastrum',
    famille: 'Fabaceae (Légumineuses)',
    type: 'arbre',
    tailleMaturite: '6-10 m',
    envergure: '5-8 m',
    floraison: {
      periode: 'Avril à Mai (avant les feuilles)',
      description: 'Fleurs papilionacées (2-2.5 cm) en grappes denses directement sur le tronc et les branches (cauliflorie remarquable)',
      couleur: 'Rose-pourpre à magenta vif',
      parfum: 'Légèrement parfumé, délicat'
    },
    fructification: {
      periode: 'Août à Novembre',
      description: 'Gousses plates (8-12 cm) pourpres devenant brunes, persistant tout l\'hiver, très décoratives',
      couleur: 'Pourpre rougeâtre virant au brun'
    },
    feuillage: {
      type: 'Caduc',
      couleurAutomne: 'Jaune doré lumineux',
      description: 'Feuilles cordiformes (en forme de cœur parfait), 7-12 cm, vert bleuté, glabres, très caractéristiques'
    },
    rameaux: {
      couleur: 'Brun-gris à noirâtre',
      particularite: 'Floraison cauliflore spectaculaire : fleurs apparaissant directement sur le tronc et les vieilles branches (phénomène rare)'
    },
    plantation: {
      periode: 'Septembre à Novembre (automne impératif)',
      conseil: 'Plantation automnale OBLIGATOIRE pour meilleure reprise. JAMAIS de déplacement après installation (racines pivotantes profondes). Sol bien drainé essentiel. Prévoir 6-8m d\'espace. Planter JEUNE (2-3 ans maximum, en conteneur). Éviter racines nues. Tuteurage recommandé 2 premières années.'
    },
    sol: {
      type: 'Tous types bien drainés, excellente tolérance calcaire',
      ph: '6.5-8.5 (préfère légèrement alcalin, supporte bien calcaire)',
      humidite: 'Bien drainé IMPÉRATIF, redoute humidité stagnante et sols lourds. Excellente résistance sécheresse une fois établi (3-4 ans).'
    },
    exposition: 'Soleil (6h minimum), tolère mi-ombre légère. Abrité des vents froids et dominants.',
    arrosage: 'Régulier et généreux les 3 premières années (crucial pour enracinement). Ensuite, arrosage exceptionnel seulement. Paillage recommandé été/hiver.',
    rusticite: '-15 à -18°C (zone 6-9). Rustique en Île-de-France. Jeunes pousses sensibles gelées tardives (avril). Protéger jeunes plants si < -10°C.',
    croissance: 'Lente les 5 premières années (10-20 cm/an), puis moyenne (30-40 cm/an). Floraison à partir de 5-7 ans.',
    taille: {
      periode: 'Fin d\'été (août-septembre) si absolument nécessaire',
      frequence: 'Minimale - éviter au maximum',
      methode: 'ÉVITER TOUTE TAILLE ! Port naturel étalé magnifique à préserver. Uniquement bois mort, branches cassées ou dangereuses. Cicatrisation très lente. Cicatrisant obligatoire sur toute plaie. Désinfecter outils.',
      conseil: '⚠️ Arbre à NE PAS TAILLER sauf urgence absolue. Très mauvaise cicatrisation = porte d\'entrée maladies. Port naturel tortueux fait son charme. Si taille obligatoire : fin d\'été uniquement, JAMAIS en hiver (risque chancre, gel). Ne jamais étêter ni recéper.'
    },
    calendrierAnnuel: [
      { mois: 'Janvier-Février', action: 'Repos végétatif - Protection jeunes plants si < -10°C', icone: '❄️' },
      { mois: 'Mars', action: 'Gonflement bourgeons floraux sur tronc et branches', icone: '🌱' },
      { mois: 'Avril-Mai', action: '🌸 FLORAISON SPECTACULAIRE rose-pourpre (cauliflorie)', icone: '🌸' },
      { mois: 'Mai-Juin', action: 'Débourrement feuillage cordiforme - Fertilisation organique', icone: '🍃' },
      { mois: 'Juillet-Août', action: 'Croissance - Arrosage si sécheresse prolongée (jeunes sujets)', icone: '💧' },
      { mois: 'Septembre', action: 'Gousses pourpres décoratives se forment', icone: '🫘' },
      { mois: 'Octobre-Novembre', action: 'Couleurs automnales dorées + gousses brunes persistantes', icone: '🍂' },
      { mois: 'Décembre', action: 'Chute feuilles - Gousses décoratives persistent hiver', icone: '🍁' }
    ],
    maladies: [
      'Verticilliose (flétrissement vasculaire - grave mais rare)',
      'Chancre (éviter toute blessure)',
      'Pourridié (Armillaria) en sol trop humide',
      'Oïdium possible (esthétique)',
      'Cochenilles (rares)',
      'TRÈS résistant globalement si bien placé (drainage++)'
    ],
    biodiveriste: {
      faune: 'Fleurs mellifères EXCEPTIONNELLES : nectar abondant pour abeilles domestiques, bourdons, abeilles solitaires (période cruciale avril-mai). Gousses appréciées de certains oiseaux. Feuillage cordiforme abrite insectes.',
      insectes: 'Excellent pour pollinisateurs au printemps (floraison précoce et abondante). Attire abeilles, bourdons, papillons, syrphes. Chenilles de plusieurs papillons.',
      oiseaux: 'Nidification dans branches étalées. Abri et perchoir. Graines consommées par certaines espèces.'
    },
    toxicite: {
      niveau: 'Gousses et graines toxiques - Fleurs COMESTIBLES',
      danger: '⚠️ Gousses et graines contiennent alcaloïdes toxiques (cythisine). Ingestion peut provoquer nausées, vomissements, troubles digestifs. MAIS : Fleurs totalement comestibles et délicieuses (tradition méditerranéenne).',
      prevention: 'Surveiller jeunes enfants avec gousses. Ne pas consommer graines. Fleurs comestibles : salade, beignets, décoration pâtisserie (goût légèrement acidulé).'
    },
    utilisations: [
      'Arbre d\'ornement spectaculaire (cauliflorie unique)',
      'Isolé sur pelouse (mise en valeur)',
      'Alignement zones méditerranéennes et urbaines',
      'Parcs et jardins publics',
      'Résiste bien pollution urbaine',
      'Arbre emblématique bassin méditerranéen',
      'Fleurs comestibles gastronomie (salades, beignets)',
      'Bonsaï (possible)',
      'Stabilisation talus secs et calcaires'
    ],
    anecdote: 'L\'arbre de Judée présente une cauliflorie spectaculaire : ses fleurs rose-pourpre apparaissent directement sur le tronc et les vieilles branches, phénomène rare en climat tempéré ! Selon la légende chrétienne, Judas se serait pendu à cet arbre après avoir trahi Jésus, d\'où son nom. Les fleurs, honteuses, seraient devenues roses (elles étaient blanches avant). Originaire du Moyen-Orient, il symbolise le renouveau printanier méditerranéen. Ses fleurs sont comestibles et utilisées en cuisine depuis l\'Antiquité !',
    
    // ========== RÉGLEMENTATION ==========
    reglementation: {
      systemeRacinaire: {
        type: 'Pivotant profond',
        profondeur: '1.5-2.5 m (pivot très profond)',
        etalement: '5-8 m (latéral modéré)',
        agressivite: 'Faible à modérée',
        description: 'Racine pivotante TRÈS profonde et puissante. Racines latérales peu nombreuses. NE JAMAIS DÉPLACER après installation (pivot impossible à extraire). Recherche l\'eau en profondeur.'
      },
      risques: [
        'Racine pivotante profonde peut endommager fondations fissurées si < 5m',
        'Difficile voire impossible à déplacer une fois établi',
        'Racines peuvent chercher fissures/canalisations en profondeur',
        'Port étalé : branches peuvent déborder chez voisin si trop proche',
        'Gousses toxiques : risque ingestion enfants/animaux',
        'Racines de surface modérées dans rayon 3m'
      ],
      distancesLegales: {
        voisinage: {
          regle: 'Code Civil Article 671',
          distance: '2 m minimum de la limite de propriété',
          justification: 'Hauteur > 2 m à maturité (6-10 m)',
          sanction: 'Le voisin peut exiger l\'arrachage ou la taille à 2m de haut (très difficile car mauvaise cicatrisation)',
          option: 'Prévoir 3-4 m idéalement pour le port étalé'
        },
        espacesPublics: {
          distance: '3-4 m minimum',
          regle: 'PLU de Bessancourt (zones méditerranéennes : souvent prescrit)',
          justification: 'Port étalé + branches tortueuses peuvent gêner passage'
        },
        entreArbres: {
          distance: '6-8 m',
          justification: 'Port étalé large + pivot profond nécessitent espace. Compétition racinaire en profondeur.'
        },
        infrastructures: {
          fondations: '5-6 m minimum (pivot profond !)',
          canalisations: '4-5 m minimum (racines cherchent eau profondeur)',
          fossesSeptiques: '6-7 m minimum (risque infiltration profonde)',
          piscine: '5 m minimum',
          terrasse: '4 m minimum',
          murs: '4 m minimum (racines peuvent fissurer)'
        }
      },
      conseils: 'Arbre MAGNIFIQUE mais prévoir emplacement définitif (impossible à déplacer). Racine pivot puissante : éloigner des fondations. Excellent en isolé sur pelouse ou talus sec calcaire. NE PAS planter près infrastructures sensibles. Résiste pollution urbaine.'
    },
    
    // ========== INFORMATIONS COMPLÉMENTAIRES ==========
    informationsComplementaires: {
      pollinisation: {
        type: 'Hermaphrodite (autofertile)',
        besoin: 'Aucun pollinisateur nécessaire',
        production: 'Gousses décoratives produites chaque année (contiennent graines)',
        conseil: 'Floraison abondante dès 5-7 ans. Fleurs mellifères exceptionnelles. Gousses persistent hiver (décoratives).'
      },
      dangersEtPrecautions: {
        taille: {
          danger: 'TRÈS ÉLEVÉ - ⚠️ ARBRE À NE PAS TAILLER !',
          risques: [
            '🔴 CICATRISATION TRÈS LENTE (plaies restent ouvertes des années)',
            '🔴 CHANCRE quasi-systématique sur plaies de taille',
            '🔴 DÉPÉRISSEMENT branches entières après taille',
            'Entrée champignons par plaies',
            'Port naturel tortueux = charme de l\'arbre (taille gâche esthétique)',
            'Taille sévère peut TUER l\'arbre'
          ],
          periodeDanger: '⛔ HIVER TRÈS DANGEREUX (gel + humidité = chancre)',
          periodeSecuritaire: '✅ Fin août-septembre UNIQUEMENT si absolue nécessité',
          protection: '🚨 Cicatrisant OBLIGATOIRE + désinfection outils + mastic cicatrisant professionnel',
          conseil: '🚫 NE JAMAIS TAILLER sauf urgence sécurité (branche cassée dangereuse). Choisir emplacement définitif pour éviter toute taille future. Port naturel étalé/tortueux = beauté de l\'arbre.'
        },
        reglementationTaille: {
          loi: '⚠️ INTERDICTION LÉGALE 16 mars - 15 août (protection nidification oiseaux)',
          raison: 'Code Rural + arrêtés préfectoraux + directive LPO',
          sanction: 'Amende jusqu\'à 3 750€ + dédommagement si oiseaux détruits',
          application: 'Tous arbres en zone rurale et périurbaine',
          exception: 'Travaux urgents sécurité avec autorisation préfectorale'
        },
        deplacementImpossible: {
          alerte: '🚨 NE JAMAIS DÉPLACER après plantation !',
          raison: 'Racine pivotante très profonde (2m+) impossible à extraire',
          consequence: 'Tentative déplacement = MORT de l\'arbre à 99%',
          conseil: 'Planter JEUNE (2-3 ans max) en EMPLACEMENT DÉFINITIF. Réfléchir 10-20 ans avant.'
        }
      },
      allergies: {
        pollen: 'Faible (peu de pollen aérien)',
        contact: 'Aucun risque cutané',
        sensibles: 'Personnes allergiques légumineuses (rare)'
      },
      animauxDomestiques: {
        chiens: '⚠️ GOUSSES et GRAINES TOXIQUES - Surveiller (alcaloïdes)',
        chats: '⚠️ TOXIQUE - Éviter ingestion gousses',
        chevaux: '⚠️ Modérément toxique - Éviter accès gousses',
        poules: '⚠️ Graines toxiques',
        oiseaux: '✅ Sans danger pour oiseaux sauvages (graines consommables)',
        conseil: '🌸 FLEURS COMESTIBLES pour humains ! Retirer gousses au sol si animaux présents. Symptômes intoxication : vomissements, diarrhée. Appeler vétérinaire.'
      },
      protectionHivernale: {
        adulte: 'Aucune protection nécessaire (rustique -15°C établi)',
        jeunesPlants: [
          '🔴 JEUNES PLANTS SENSIBLES les 3 premières années',
          'Paillage épais (15-20 cm) base tronc obligatoire',
          'Voile hivernage P17 si températures < -10°C',
          'Protection tronc contre gel/soleil hiver (alternance gel-dégel)',
          'Brise-vent si zone exposée vents froids dominants',
          'Arrosage modéré hiver si absence pluie (racines profondes)'
        ],
        gelPrintanier: '⚠️ ATTENTION : Gel tardif avril détruit fleurs déjà ouvertes. Jeunes pousses sensibles gelées printemps.'
      },
      fertilisation: {
        besoins: 'TRÈS FAIBLES (légumineuse fixe azote de l\'air)',
        periode: 'Mai-juin (après floraison)',
        type: 'Compost mûr SANS excès azote OU engrais organique pauvre azote',
        quantite: '1-2 kg compost par m² couronne (jeunes plants)',
        frequence: 'Annuelle 3 premières années, puis JAMAIS (autosuffisant)',
        exces: '⚠️ EXCÈS AZOTE = croissance excessive = sensibilité gel + maladies. PAS d\'engrais chimique azote !',
        particularite: 'Fabrique son propre azote (nodosités racines). Sol calcaire pauvre = PARFAIT.'
      },
      specificites: {
        cauliflorie: '🌸 FLORAISON SUR TRONC ET VIEILLES BRANCHES (phénomène rare climat tempéré)',
        delaiFloraison: 'Première floraison : 5-7 ans après plantation (patience !)',
        fleursComestibles: '✨ FLEURS ROSES COMESTIBLES : salades, beignets, pâtisseries (goût acidulé/citronné)',
        gousses: 'Gousses pourpres très décoratives persistant tout hiver',
        sol: 'ADORE le calcaire (rare chez arbres ornementaux !) - Parfait Île-de-France',
        secheresse: 'Excellente résistance sécheresse une fois établi (3-4 ans) grâce pivot profond'
      },
      sujetsForums: [
        'Pourquoi mon arbre de Judée ne fleurit pas ? (trop jeune < 5 ans, ombre, sol trop riche azote)',
        'Puis-je tailler mon arbre de Judée ? NON JAMAIS (sauf urgence) !',
        'Branches mortes après taille - chancre (ne plus tailler, laisser cicatriser)',
        'Peut-on déplacer un arbre de Judée ? NON impossible (racine pivot)',
        'Fleurs comestibles - comment les utiliser ? (salade, beignets, congélation possible)',
        'Gousses toxiques pour chien ? OUI surveiller (fleurs OK humains)',
        'Ne fleurit que sur un côté : normal si ombre partielle d\'un côté',
        'Feuilles apparaissent APRÈS fleurs (normal - cauliflorie)'
      ]
    }
  },
  {
    id: 'erable-rouge',
    name: 'Érable rouge',
    nomScientifique: 'Acer rubrum',
    famille: 'Sapindaceae (anciennement Aceraceae)',
    type: 'arbre',
    tailleMaturite: '12-20 m en culture (jusqu\'à 30m en milieu naturel)',
    envergure: '10-15 m (couronne arrondie à ovale)',
    floraison: {
      periode: 'Mars à Avril (très précoce, avant les feuilles)',
      description: 'Petites fleurs (5-8 mm) en glomérules denses sur rameaux nus, apparaissant avant le feuillage',
      couleur: 'Rouge vif à rouge orangé (parfois jaune)',
      parfum: 'Discret'
    },
    fructification: {
      periode: 'Mai à Juin (mature rapidement)',
      description: 'Samares doubles (disamares) ailées en V (2-2.5 cm), en grappes pendantes, dispersées par le vent',
      couleur: 'Rouge vif à rose devenant brun à maturité'
    },
    feuillage: {
      type: 'Caduc',
      couleurAutomne: 'Rouge écarlate à orange flamboyant (spectaculaire, un des premiers à colorer)',
      description: 'Feuilles opposées à 3-5 lobes dentés (6-10 cm), vert foncé brillant dessus, glauque blanchâtre dessous'
    },
    rameaux: {
      couleur: 'Rougeâtre à rouge-brun',
      particularite: 'Jeunes rameaux fins rouge vif. Bourgeons rouges groupés en hiver, très décoratifs. Écorce gris-argenté se fissurant avec l\'âge.'
    },
    plantation: {
      periode: 'Octobre à Mars (hors gel)',
      conseil: 'Automne IDÉAL (octobre-novembre) pour enracinement avant hiver. Sol ACIDE impératif (chlorose en sol calcaire). Prévoir 10-15m d\'espace minimum. Éviter zones très ventées et polluées. Excellent pour zones humides, berges, jardins pluviaux. Motte ou conteneur (éviter racines nues). Tuteurage 2-3 ans.'
    },
    sol: {
      type: 'Profond (min 80cm), frais à humide, riche en humus, ACIDE',
      ph: '4.5-6.5 (acide à légèrement acide - ÉVITER ABSOLUMENT CALCAIRE)',
      humidite: 'Frais à humide, voire détrempé. Tolère inondations temporaires et sols lourds argileux. Excellent pour zones humides. Craint sécheresse prolongée (feuillage brûle).'
    },
    exposition: 'Soleil (6h minimum) à mi-ombre. Couleurs automnales exceptionnelles en plein soleil. Tolère ombre légère.',
    arrosage: 'Régulier et abondant, surtout 3-5 premières années. Maintenir sol frais été. Arrosage hebdomadaire si sec. Supporte mal sécheresse (stress hydrique = brunissement feuillage). Paillage organique épais recommandé.',
    rusticite: '-30 à -35°C (zone 3-9, très rustique). Un des érables les plus rustiques. Tolère gel tardif.',
    croissance: 'Rapide (40-60 cm/an dans bonnes conditions, jusqu\'à 80 cm si sol optimal). Plus rapide en sol frais et acide.',
    taille: {
      periode: 'Fin d\'été (août-septembre) à automne (novembre) - JAMAIS au printemps',
      frequence: 'Minimale',
      methode: 'Taille de formation 3-5 premières années (port central dominant). Ensuite, taille minimale : bois mort, branches croisées/cassées uniquement. Port naturel arrondi à préserver. Éviter taille sévère. Désinfecter outils.',
      conseil: '⚠️ CRUCIAL : Ne JAMAIS tailler fin hiver/printemps (février-mai) ! Montée de sève très abondante = écoulement massif ("pleurs") affaiblissant gravement l\'arbre. Tailler UNIQUEMENT fin été/automne (août-novembre) ou plein hiver par grand froid (décembre-janvier). Cicatrisant recommandé.'
    },
    calendrierAnnuel: [
      { mois: 'Janvier-Février', action: 'Repos - Bourgeons rouges décoratifs - Taille hiver possible', icone: '❄️' },
      { mois: 'Mars-Avril', action: '🌸 FLORAISON précoce rouge vif avant feuilles', icone: '🌸' },
      { mois: 'Mai', action: 'Débourrement feuillage - Samares rouges décoratives - Fertilisation', icone: '🌱' },
      { mois: 'Juin-Juillet', action: 'Croissance active - Arrosage régulier si sec', icone: '💧' },
      { mois: 'Août', action: 'Croissance ralentit - Taille possible si nécessaire', icone: '✂️' },
      { mois: 'Septembre-Octobre', action: '🍂 COULEURS AUTOMNALES spectaculaires (un des premiers)', icone: '🍂' },
      { mois: 'Novembre', action: 'Chute des feuilles - Taille possible - Paillage', icone: '🍁' },
      { mois: 'Décembre', action: 'Repos - Rameaux rouges visibles', icone: '❄️' }
    ],
    maladies: [
      'Verticilliose (Verticillium) - flétrissement vasculaire grave (surveiller)',
      'Taches foliaires fongiques "goudron de l\'érable" (Rhytisma) - inesthétique mais bénin',
      'Chlorose ferrique en sol calcaire (jaunissement feuilles - GRAVE)',
      'Pucerons (printemps - miellat)',
      'Cochenilles (rares)',
      'Anthracnose (Discula/Kabatiella) - taches foliaires',
      'Brûlure des feuilles en cas sécheresse',
      'Sensible sel de déneigement (éviter bordures routes salées)',
      'Résistant globalement si sol acide et frais'
    ],
    biodiveriste: {
      faune: 'Fleurs mellifères précoces ESSENTIELLES pour abeilles, bourdons sortant hibernation (mars-avril = période critique). Samares consommées écureuils, tamias, oiseaux (pics, gros-becs, chardonnerets). Excellent arbre faune.',
      insectes: 'Très bon pour pollinisateurs précoces (nectar/pollen abondants). Chenilles de nombreux papillons (Papilio, Nymphalidae). Abrite insectes xylophages (bois mort). Pucerons = proies auxiliaires.',
      oiseaux: 'Excellent site nidification (branches solides, feuillage dense). Graines/samares très appréciées. Pics recherchent larves. Perchoir et abri hiver.'
    },
    toxicite: {
      niveau: 'Non toxique pour l\'homme',
      danger: '⚠️ Feuilles fanées/flétries peuvent être TOXIQUES pour CHEVAUX (rare mais documenté : anémie hémolytique). Feuilles fraîches et sève inoffensives. Aucun danger humain.',
      prevention: 'Éviter accès chevaux aux feuilles tombées/flétries. Aucun danger pour autres animaux domestiques ni humains. Sève comestible (sirop, moins productif qu\'Acer saccharum).'
    },
    utilisations: [
      'Arbre d\'ornement pour couleurs automnales EXCEPTIONNELLES',
      'Isolé sur pelouse (mise en valeur spectacle automnal)',
      'Alignement urbain (tolère pollution modérée)',
      'Grands jardins et parcs',
      'Arbre d\'ombrage (couronne dense)',
      'Zones humides, berges, jardins pluviaux (tolérance inondations)',
      'Stabilisation berges et zones argileuses',
      'Emblème du Canada (feuille sur drapeau)',
      'Sirop d\'érable (moins productif qu\'Acer saccharum, possible)',
      'Bois : menuiserie, ébénisterie, pâte à papier',
      'Biodiversité et faune (nidification, nourriture)'
    ],
    anecdote: 'L\'érable rouge est surnommé "le messager de l\'automne" : il est souvent le PREMIER arbre à se colorer en septembre, virant au rouge écarlate flamboyant spectaculaire ! C\'est l\'emblème du Canada (feuille sur drapeau national). En Amérique du Nord, il annonce aussi le printemps avec sa floraison rouge précoce avant même les feuilles. Son nom scientifique "rubrum" (rouge en latin) fait référence à TOUT : fleurs rouges, samares rouges, rameaux rouges, bourgeons rouges ET couleurs automnales rouges ! Un arbre "rouge toute l\'année" !',
    
    // ========== RÉGLEMENTATION ==========
    reglementation: {
      systemeRacinaire: {
        type: 'Superficiel dense et étendu',
        profondeur: '0.5-1 m (TRÈS superficiel)',
        etalement: '12-18 m (1.5-2x la couronne !)',
        agressivite: 'ÉLEVÉE',
        description: 'Système racinaire TRÈS superficiel et TRÈS étendu (un des plus agressifs). Racines denses en surface. Soulève facilement pavages, dallages, trottoirs. Excellent pour berges mais PROBLÉMATIQUE près infrastructures. Cherche activement l\'eau et l\'humidité.'
      },
      risques: [
        '⚠️ RACINES TRÈS SUPERFICIELLES et TRÈS ÉTENDUES (rayon 10-15m)',
        'SOULÈVEMENT pavages, dallages, trottoirs quasi-systématique si < 5m',
        'COLMATAGE canalisations/égouts si < 6m (racines cherchent eau)',
        'Endommagement fondations possibles si fissures présentes et < 8m',
        'Compétition racinaire INTENSE : pelouse/plantation impossible sous couronne',
        'Racines peuvent fissurer fosses septiques si < 8m',
        'Aspire beaucoup d\'eau : assèchement sol rayon 5-8m',
        'Branches lourdes : risque chute en cas tempête (grand arbre)',
        'Peut endommager terrasses, allées, bordures si < 4m'
      ],
      distancesLegales: {
        voisinage: {
          regle: 'Code Civil Article 671',
          distance: '2 m minimum LÉGAL - MAIS 8-10m FORTEMENT RECOMMANDÉ',
          justification: 'Hauteur > 2 m (12-20 m). MAIS racines superficielles s\'étendent jusqu\'à 15m',
          sanction: 'Arrachage ou taille exigible. MAIS dégâts racines = responsabilité civile propriétaire (coûts énormes)',
          option: '⚠️ Distance légale ≠ distance sécuritaire. Racines ne respectent pas les limites de propriété !'
        },
        espacesPublics: {
          distance: '5-8 m minimum',
          regle: 'PLU + règlements voirie (souvent interdit en milieu urbain dense)',
          justification: 'Racines superficielles soulèvent trottoirs/chaussées. Coûts réparation municipaux élevés.'
        },
        entreArbres: {
          distance: '12-15 m minimum',
          justification: 'Grand arbre + système racinaire étendu. Compétition racinaire très intense.'
        },
        infrastructures: {
          fondations: '8-10 m minimum (12m idéal)',
          canalisations: '6-8 m minimum (racines très agressives vers eau)',
          fossesSeptiques: '8-10 m MINIMUM (risque colmatage majeur)',
          piscine: '8 m minimum',
          terrasse: '5-6 m minimum',
          allees_pavees: '5 m minimum',
          trottoirs: '6 m minimum',
          parking_bitume: '6 m minimum',
          murs: '5 m minimum',
          reseaux_enterres: '5 m minimum'
        }
      },
      conseils: '🚨 ARBRE MAGNIFIQUE mais RACINES TRÈS PROBLÉMATIQUES. Réservé aux GRANDS jardins/parcs avec ESPACE SUFFISANT. PARFAIT pour : isolé sur grande pelouse, berges de cours d\'eau, zones humides, grands parcs publics. À ÉVITER : jardins < 400m², proximité maisons, zones urbaines denses, près infrastructures. ⚠️ Coûts réparation dégâts racines : 10 000€-50 000€. Sol ACIDE impératif (chlorose si calcaire). Un des plus beaux arbres pour couleurs automnales mais EXIGE ESPACE !'
    },
    
    // ========== INFORMATIONS COMPLÉMENTAIRES ==========
    informationsComplementaires: {
      pollinisation: {
        type: 'Monoïque (fleurs mâles et femelles séparées sur même arbre)',
        besoin: 'Pollinisation croisée améliore production (planter plusieurs sujets espacés)',
        production: 'Samares ailées rouges abondantes (mai-juin), dispersées par vent',
        conseil: 'Floraison précoce (mars-avril) = nourriture CRUCIALE pour abeilles sortant hibernation. Samares rouges très décoratives printemps.'
      },
      dangersEtPrecautions: {
        taille: {
          danger: 'ÉLEVÉ - "PLEURS" DE SÈVE ABONDANTS',
          risques: [
            '🔴 ÉCOULEMENT DE SÈVE MASSIF si taille fin hiver/printemps (février-mai)',
            'Affaiblissement grave de l\'arbre par perte sève',
            'Plaies attirent insectes xylophages',
            'Chancre possible',
            'Entrée champignons par plaies',
            'Grands arbres : branches lourdes (risque chute si mal taillé)'
          ],
          periodeDanger: '⛔ INTERDIT FÉVRIER-MAI (montée sève = "pleurs" massifs)',
          periodeSecuritaire: '✅ Août-septembre (fin été) OU décembre-janvier (plein hiver par grand froid sec)',
          protection: 'Cicatrisant recommandé sur plaies > 3cm. Désinfecter outils.',
          conseil: 'Taille de formation 3-5 premières années (élagage professionnel recommandé). Ensuite MINIMAL : bois mort uniquement. Port naturel arrondi magnifique à préserver.'
        },
        reglementationTaille: {
          loi: '⚠️ INTERDICTION LÉGALE 16 mars - 15 août (protection oiseaux nicheurs)',
          raison: 'Code Rural + arrêtés préfectoraux + directive LPO (Ligue Protection Oiseaux)',
          sanction: 'Agriculteurs : amende 3 750€ + réduction 3% aides PAC. Particuliers : responsabilité civile destruction nids/oisillons.',
          application: 'TOUS arbres zones rurales/périurbaines (Bessancourt inclus)',
          exception: 'Travaux urgents sécurité (branche menaçant tomber) avec autorisation préfectorale. Élagage lignes électriques autorisé.'
        },
        racinesProblematiques: {
          alerte: '🚨 SYSTÈME RACINAIRE TRÈS AGRESSIF ET SUPERFICIEL',
          etendue: 'Racines s\'étendent 12-18m (rayon 10-15m depuis tronc)',
          profondeur: 'TRÈS superficielles (30-80cm) - quasi-totalement en surface',
          degats: [
            'SOULÈVEMENT pavages/dallages/trottoirs QUASI-SYSTÉMATIQUE si < 5m',
            'FISSURATION terrasses, allées, bordures si < 4m',
            'COLMATAGE canalisations/égouts si < 6m (racines cherchent eau activement)',
            'ENDOMMAGEMENT fondations si fissures pré-existantes et < 8m',
            'ASPIRATION eau importante = pelouse/plantes impossibles sous couronne',
            'Compétition racinaire INTENSE rayon 8m'
          ],
          couts: '💰 Réparation dégâts : 10 000€ - 50 000€ selon ampleur',
          responsabilite: 'Propriétaire arbre RESPONSABLE CIVILEMENT de tous dégâts causés par racines',
          prevention: '⚠️ RESPECTER DISTANCES MINIMALES INFRASTRUCTURES (voir réglementation). Barrière anti-racines inefficace (racines trop étendues).',
          conseil: 'Réservé GRANDS jardins/parcs > 400m². NE PAS PLANTER près habitations/infrastructures.'
        }
      },
      allergies: {
        pollen: 'MODÉRÉ (pollen anémophile - transporté par vent)',
        niveau: 'Allergénicité moyenne - Floraison précoce mars-avril',
        symptomes: 'Rhinite allergique possible chez personnes sensibles',
        contact: 'Aucun risque cutané',
        sensibles: 'Personnes allergiques pollens d\'arbres printemps'
      },
      animauxDomestiques: {
        chiens: '✅ Non toxique',
        chats: '✅ Non toxique',
        chevaux: '🔴 TRÈS TOXIQUE - Feuilles fanées/flétries provoquent anémie hémolytique',
        detail_chevaux: '⚠️ DANGER SPÉCIFIQUE CHEVAUX : Feuilles fraîches = OK. Feuilles FANÉES/FLÉTRIES (tombées au sol, flétrissant sur branches) = TOXIQUES. Provoque anémie hémolytique pouvant être MORTELLE. Symptômes : léthargie, muqueuses pâles, urine foncée. APPELER VÉTÉRINAIRE d\'urgence.',
        oiseaux: '✅ Excellent - Samares consommées, nidification appréciée',
        ecureuils: '✅ Samares appréciées',
        conseil: 'NE PAS planter dans paddocks/pâtures chevaux. Clôturer pour empêcher accès feuilles tombées. Autres animaux domestiques : aucun danger.'
      },
      protectionHivernale: {
        adulte: 'AUCUNE protection nécessaire (rustique -30°C à -35°C)',
        jeunesPlants: [
          'Paillage organique épais (15 cm) base tronc recommandé',
          'Protection inutile même jeune (très rustique)',
          'Arrosage régulier automne pour bonne préparation hiver'
        ],
        gelPrintanier: '✅ RÉSISTE BIEN gel tardif (bourgeons tardifs, tolérance gel)',
        gelAutomnal: '✅ Couleurs automnales AMÉLIORÉES par premières gelées (septembre-octobre)'
      },
      fertilisation: {
        besoins: 'MODÉRÉS à ÉLEVÉS (grand arbre croissance rapide)',
        periode: 'Mars-avril (avant débourrement) + Juin (croissance active)',
        type: 'Compost bien décomposé OU engrais organique NPK équilibré (10-10-10)',
        quantite: '5-10 kg compost mûr par m² couronne (arbre établi)',
        frequence: 'Annuelle 5-10 premières années, puis tous les 2 ans',
        specificite: '⚠️ SOL ACIDE OBLIGATOIRE : apport soufre/tourbe si sol neutre. Engrais acidifiant recommandé.',
        chlorose: '🔴 CHLOROSE FERRIQUE si sol calcaire (pH > 6.5) = feuilles jaunes, croissance ralentie. TRAITEMENT : chélate de fer + acidification sol.',
        conseil: 'Mulching feuilles mortes excellent (acidification naturelle sol + apport matière organique).'
      },
      specificites: {
        solAcide: '🔴 SOL ACIDE IMPÉRATIF (pH 4.5-6.5) - ÉCHEC GARANTI en sol calcaire',
        chloroseCalcaire: 'Chlorose ferrique sévère en sol calcaire (feuilles jaunes, arbre dépérit)',
        testSol: '⚠️ TESTER pH SOL avant achat ! Bessancourt : sols souvent calcaires (pH 7-8) = INADAPTÉ érable rouge',
        alternative: 'Si sol calcaire Bessancourt : préférer Acer pseudoplatanus (érable sycomore) ou Acer campestre (érable champêtre) - tolèrent calcaire',
        zonesHumides: '✅ EXCELLENT pour zones humides, berges, jardins pluviaux (tolère inondations temporaires)',
        grandsEspaces: 'Réservé GRANDS jardins/parcs > 400m² - Arbre IMPOSANT (12-20m)',
        couleurs: '🍂 "Messager de l\'automne" : PREMIER arbre à colorer (septembre) - Rouge écarlate spectaculaire',
        siropErable: '🍁 Production sirop d\'érable POSSIBLE mais moins productif qu\'Acer saccharum. Nécessite 40L sève pour 1L sirop.'
      },
      sujetsForums: [
        'Sol calcaire Bessancourt - puis-je planter érable rouge ? NON (chlorose garantie)',
        'Test pH sol - comment faire ? (kit jardinerie, laboratoire analyse)',
        'Feuilles jaunes entre nervures vertes : chlorose ferrique (sol trop alcalin)',
        'Racines soulèvent terrasse - que faire ? (coûts réparation + arrachage souvent obligatoire)',
        'Érable rouge adapté petit jardin ? NON (racines + taille - minimum 400m²)',
        'Alternatives érable rouge sol calcaire ? Acer pseudoplatanus, A. campestre, A. platanoides',
        'Pourquoi feuilles brûlent en été ? (sécheresse - arrosage insuffisant)',
        'Production sirop érable maison : possible ? Oui mais 40L sève → 1L sirop',
        'Quand couleurs automnales apparaissent ? Septembre (premier arbre à colorer)',
        'Feuilles flétries toxiques chevaux : VRAI - danger mortel équidés',
        'Distance minimum maison ? 8-10m (racines superficielles très étendues)',
        'Tailler en mars - sève coule abondamment : NORMAL (ne jamais tailler février-mai !)'
      ]
    }
  }
];

export const arbustesData = [
  {
    id: 'noisetier',
    name: 'Noisetier',
    nomScientifique: 'Corylus avellana',
    famille: 'Betulaceae',
    tailleMaturite: '3-8 m',
    envergure: '3-5 m',
    floraison: {
      periode: 'Janvier à Mars',
      description: 'Chatons mâles jaunes pendants (5-8 cm) et fleurs femelles discrètes rouges',
      couleur: 'Jaune doré'
    },
    fructification: {
      periode: 'Septembre à Octobre',
      description: 'Noisettes groupées par 2-4, enveloppées dans une cupule verte',
      couleur: 'Brun à maturité'
    },
    feuillage: {
      type: 'Caduc',
      couleurAutomne: 'Jaune doré',
      description: 'Feuilles arrondies, dentées, légèrement velues'
    },
    plantation: {
      periode: 'Octobre à Mars (hors gel)',
      conseil: 'Privilégier l\'automne pour un meilleur enracinement. Planter au moins 2 sujets pour favoriser la pollinisation croisée et la fructification.'
    },
    sol: {
      type: 'Tous types, bien drainé, riche en humus',
      ph: '6.0-7.5 (légèrement acide à neutre)',
      humidite: 'Frais, supporte la sécheresse une fois établi'
    },
    exposition: 'Soleil à mi-ombre (6h minimum de soleil)',
    arrosage: 'Régulier la première année, puis modéré. Arrosage hebdomadaire en période sèche.',
    rusticite: '-25°C (très rustique)',
    croissance: 'Rapide (40-60 cm/an)',
    taille: {
      periode: 'Février-Mars (avant floraison) ou après récolte',
      frequence: 'Tous les 3-4 ans',
      methode: 'Suppression des branches mortes, recépage des vieux bois. Éclaircir le centre pour aérer.',
      conseil: 'Ne pas tailler en hiver pendant la floraison pour ne pas perdre les chatons. Éliminer les drageons pour limiter l\'expansion.'
    },
    calendrierAnnuel: [
      { mois: 'Janvier-Février', action: 'Floraison des chatons - Observer', icone: '🌸' },
      { mois: 'Mars', action: 'Fin de floraison - Fertilisation organique', icone: '🌱' },
      { mois: 'Avril-Mai', action: 'Développement du feuillage', icone: '🍃' },
      { mois: 'Juin-Août', action: 'Croissance - Arrosage si sec', icone: '💧' },
      { mois: 'Septembre-Octobre', action: 'Récolte des noisettes', icone: '🌰' },
      { mois: 'Novembre', action: 'Taille si nécessaire - Paillage', icone: '✂️' },
      { mois: 'Décembre', action: 'Repos végétatif', icone: '❄️' }
    ],
    maladies: [
      'Pucerons (traiter au savon noir)',
      'Balanin (insecte - ramasser les fruits tombés)',
      'Moniliose (champignon - éliminer fruits atteints)'
    ],
    biodiveriste: {
      faune: 'Chatons appréciés des abeilles solitaires. Noisettes consommées par écureuils, geais, pics.',
      insectes: 'Abrite de nombreux insectes auxiliaires',
      oiseaux: 'Site de nidification pour mésanges, rouge-gorge'
    },
    toxicite: {
      niveau: 'Non toxique',
      allergie: 'ATTENTION : Pollen très allergisant (janvier-mars). Noisettes allergènes pour certaines personnes.'
    },
    utilisations: [
      'Haie libre champêtre',
      'Production de noisettes comestibles',
      'Bois souple utilisé en vannerie',
      'Stabilisation des berges',
      'Mellifère précoce'
    ],
    anecdote: 'Le noisetier est l\'un des premiers arbustes à fleurir, dès janvier. Ses chatons produisent un pollen abondant transporté par le vent.',
    
    // ========== RÉGLEMENTATION ==========
    reglementation: {
      systemeRacinaire: {
        type: 'Superficiel traçant + drageons',
        profondeur: '0.4-0.8 m',
        etalement: '4-6 m (drageonne abondamment)',
        agressivite: 'Élevée (drageons)',
        description: 'Racines TRÈS superficielles + nombreux drageons. Peut être envahissant si non contrôlé. Éliminer drageons régulièrement.'
      },
      risques: [
        'DRAGEONS envahissants (peut coloniser 6m²)',
        'Racines superficielles peuvent soulever dallages',
        'Compétition racinaire avec autres plantes',
        'Peut obstruer gouttières si trop proche (3-6 m)'
      ],
      distancesLegales: {
        voisinage: {
          regle: 'Code Civil Article 671',
          distance: '2 m minimum (ou 0.5m si taillé < 2m)',
          justification: 'Hauteur > 2 m (3-8 m)',
          sanction: 'Taille obligatoire à 2m de haut ou arrachage',
          option: 'Si taillé et maintenu < 2m : distance réduite à 0.5m'
        },
        espacesPublics: {
          distance: '1.5-2 m',
          regle: 'PLU + règlement de voirie'
        },
        entreArbustes: {
          distance: '1.5-2 m en haie, 3 m isolé',
          justification: 'Drageons envahissants'
        },
        infrastructures: {
          fondations: '3 m minimum',
          canalisations: '2.5 m minimum (drageons !)',
          fossesSeptiques: '4 m minimum',
          terrasse: '2 m minimum',
          allées: '1.5 m minimum'
        }
      },
      conseils: 'Parfait en haie libre mais CONTRÔLER les drageons. Barrière anti-racines recommandée près des allées. Ne pas planter près canalisations.'
    },
    
    // ========== INFORMATIONS COMPLÉMENTAIRES ==========
    informationsComplementaires: {
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
    }
  },
  {
    id: 'fusain',
    name: 'Fusain d\'Europe',
    nomScientifique: 'Euonymus europaeus',
    famille: 'Celastraceae',
    tailleMaturite: '3-6 m',
    envergure: '2-4 m',
    floraison: {
      periode: 'Mai à Juin',
      description: 'Petites fleurs discrètes à 4 pétales en cymes',
      couleur: 'Blanc verdâtre'
    },
    fructification: {
      periode: 'Septembre à Novembre',
      description: 'Capsules roses à 4 lobes s\'ouvrant pour révéler des graines orange vif - TRÈS DÉCORATIVES',
      couleur: 'Rose-rouge et orange'
    },
    feuillage: {
      type: 'Caduc',
      couleurAutomne: 'Rouge écarlate à pourpre intense',
      description: 'Feuilles opposées, ovales, finement dentées'
    },
    plantation: {
      periode: 'Octobre à Mars (hors gel)',
      conseil: 'Préférer l\'automne. Bien espacer (1,5-2 m) car développement important.'
    },
    sol: {
      type: 'Tous types, préfère calcaire',
      ph: '5.5-8.0 (tolère le calcaire)',
      humidite: 'Frais à sec, supporte la sécheresse'
    },
    exposition: 'Soleil à mi-ombre',
    arrosage: 'Modéré, résistant à la sécheresse une fois établi',
    rusticite: '-25°C (très rustique)',
    croissance: 'Lente à moyenne (20-40 cm/an)',
    taille: {
      periode: 'Février-Mars (fin d\'hiver)',
      frequence: 'Tous les 2-3 ans',
      methode: 'Taille légère pour maintenir la forme. Suppression du bois mort. Peut être recépé pour rajeunir.',
      conseil: 'Tailler après la chute des feuilles et avant le débourrement. Le fusain supporte bien la taille.'
    },
    calendrierAnnuel: [
      { mois: 'Janvier-Février', action: 'Repos - Taille si nécessaire', icone: '✂️' },
      { mois: 'Mars-Avril', action: 'Débourrement - Fertilisation', icone: '🌱' },
      { mois: 'Mai-Juin', action: 'Floraison discrète', icone: '🌸' },
      { mois: 'Juillet-Août', action: 'Croissance - Arrosage si sec', icone: '💧' },
      { mois: 'Septembre-Octobre', action: 'Fructification décorative - Couleurs automnales', icone: '🍂' },
      { mois: 'Novembre-Décembre', action: 'Chute des feuilles - Paillage', icone: '❄️' }
    ],
    maladies: [
      'Cochenilles (traiter à l\'huile blanche)',
      'Pucerons noirs (savon noir)',
      'Oïdium (fongicide soufre)'
    ],
    biodiveriste: {
      faune: 'Fruits très appréciés des oiseaux (grives, merles, rouge-gorge)',
      insectes: 'Fleurs mellifères pour abeilles et papillons',
      oiseaux: 'Excellent arbuste d\'accueil pour la nidification'
    },
    toxicite: {
      niveau: 'TOXIQUE - TOUTES LES PARTIES',
      danger: '⚠️ TRÈS DANGEREUX : Fruits, feuilles, écorce et graines contiennent des alcaloïdes toxiques. Ingestion peut provoquer vomissements, diarrhées, troubles cardiaques. Potentiellement mortel.',
      prevention: 'ÉLOIGNER DES ENFANTS ET ANIMAUX. Porter des gants lors de la taille.'
    },
    utilisations: [
      'Haie libre ornementale',
      'Arbuste d\'ornement pour couleurs automnales spectaculaires',
      'Traditionnellement : bois très dur utilisé pour fusains à dessin',
      'Excellent pour la biodiversité'
    ],
    anecdote: 'Son nom vient de l\'usage traditionnel de son bois très dur pour fabriquer les fusains utilisés par les artistes. Ses fruits roses éclatants sont un régal pour les yeux en automne !',
    
    // ========== RÉGLEMENTATION ==========
    reglementation: {
      systemeRacinaire: {
        type: 'Pivotant modéré',
        profondeur: '0.8-1.2 m',
        etalement: '2-4 m',
        agressivite: 'Faible',
        description: 'Racines profondes, peu de racines superficielles. Un des arbustes les moins problématiques.'
      },
      risques: [
        'Risques très faibles',
        'Racines peu agressives',
        'ATTENTION : TOUTES les parties TRÈS TOXIQUES !'
      ],
      distancesLegales: {
        voisinage: {
          regle: 'Code Civil Article 671',
          distance: '2 m (hauteur 3-6 m) OU 0.5m si taillé < 2m',
          justification: 'Hauteur naturelle > 2 m',
          sanction: 'Arrachage ou taille exigible',
          option: 'En haie taillée < 2m : 0.5m suffit'
        },
        espacesPublics: {
          distance: '1-1.5 m',
          regle: 'PLU local'
        },
        entreArbustes: {
          distance: '1.5-2 m en haie, 2.5 m isolé'
        },
        infrastructures: {
          fondations: '2 m minimum',
          canalisations: '1.5 m minimum',
          fossesSeptiques: '3 m minimum',
          terrasse: '1.5 m minimum',
          aire_de_jeux: '5 m minimum (TOXICITÉ !)'
        }
      },
      conseils: 'Racines non problématiques MAIS éloigner des aires de jeux et enfants (toxicité extrême). Excellent en haie taillée.'
    },
    
    // ========== INFORMATIONS COMPLÉMENTAIRES ==========
    informationsComplementaires: {
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
    }
  },
  {
    id: 'troene',
    name: 'Troène commun',
    nomScientifique: 'Ligustrum vulgare',
    famille: 'Oleaceae',
    tailleMaturite: '2-4 m',
    envergure: '1.5-2.5 m',
    floraison: {
      periode: 'Juin à Juillet',
      description: 'Grappes denses de petites fleurs tubulaires très parfumées',
      couleur: 'Blanc crème',
      parfum: 'Intense, sucré (peut être entêtant)'
    },
    fructification: {
      periode: 'Septembre à Février',
      description: 'Baies globuleuses en grappes, persistantes l\'hiver',
      couleur: 'Noir brillant'
    },
    feuillage: {
      type: 'Semi-persistant (persiste en hiver doux, caduc en hiver froid)',
      couleurAutomne: 'Vert foncé à pourpre',
      description: 'Feuilles opposées, oblongues, coriaces, vert foncé brillant'
    },
    plantation: {
      periode: 'Octobre à Mars (hors gel)',
      conseil: 'Pour haie dense : planter tous les 60-80 cm. Rabattre à 30 cm après plantation pour favoriser la ramification.'
    },
    sol: {
      type: 'Tous types, très tolérant',
      ph: '5.5-8.0 (supporte le calcaire)',
      humidite: 'Frais à sec, très résistant à la sécheresse'
    },
    exposition: 'Soleil à ombre (très tolérant)',
    arrosage: 'Faible, très résistant à la sécheresse une fois établi',
    rusticite: '-25°C (très rustique)',
    croissance: 'Rapide (40-60 cm/an)',
    taille: {
      periode: 'Mai-Juin et Septembre (2 tailles/an pour haie)',
      frequence: '2-3 fois par an pour haie dense',
      methode: 'Taille stricte possible. Pour haie : couper 1/3 de la pousse. Haie libre : taille légère après floraison.',
      conseil: 'Supporte très bien la taille sévère. Pour haie fleurie, tailler après floraison. Le troène repousse facilement même après recépage.'
    },
    calendrierAnnuel: [
      { mois: 'Janvier-Février', action: 'Repos - Feuillage persistant ou caduc selon climat', icone: '❄️' },
      { mois: 'Mars-Avril', action: 'Débourrement - Fertilisation', icone: '🌱' },
      { mois: 'Mai', action: 'Première taille pour haie', icone: '✂️' },
      { mois: 'Juin-Juillet', action: 'Floraison parfumée - Très mellifère', icone: '🌸' },
      { mois: 'Août', action: 'Arrosage si sécheresse', icone: '💧' },
      { mois: 'Septembre', action: 'Deuxième taille + fructification', icone: '✂️' },
      { mois: 'Octobre-Décembre', action: 'Baies noires décoratives', icone: '🫐' }
    ],
    maladies: [
      'Très résistant aux maladies',
      'Oïdium possible (rare)',
      'Pucerons occasionnels'
    ],
    biodiveriste: {
      faune: 'Baies consommées par 20+ espèces d\'oiseaux en hiver (merles, grives, fauvettes)',
      insectes: 'Très mellifère - attire abeilles, bourdons, papillons',
      oiseaux: 'Excellent site de nidification grâce au feuillage dense'
    },
    toxicite: {
      niveau: 'TOXIQUE - Baies et feuilles',
      danger: '⚠️ Baies toxiques pour l\'homme : vomissements, diarrhées, maux de tête. Éviter ingestion.',
      prevention: 'Surveiller les jeunes enfants. Les oiseaux peuvent les consommer sans danger.'
    },
    utilisations: [
      'Haie taillée dense (brise-vue)',
      'Haie libre fleurie',
      'Excellent brise-vent',
      'Stabilisation des talus',
      'Très apprécié pour la biodiversité'
    ],
    anecdote: 'Le troène est l\'un des arbustes de haie les plus utilisés en Europe. Son nom vient du latin "ligare" (lier) car ses branches flexibles servaient à faire des liens. Champion de la résistance : pollution, sécheresse, taille sévère... rien ne l\'arrête !',
    
    // ========== RÉGLEMENTATION ==========
    reglementation: {
      systemeRacinaire: {
        type: 'Dense et superficiel',
        profondeur: '0.3-0.6 m',
        etalement: '3-5 m',
        agressivite: 'Modérée',
        description: 'Racines TRÈS superficielles et denses. Excellentes pour stabiliser talus. Peuvent concurrencer autres plantes.'
      },
      risques: [
        'Racines superficielles denses (compétition avec pelouse)',
        'Peut assécher le sol autour (rayon 2m)',
        'Racines peuvent soulever dalles si < 1m',
        'Baies toxiques (risque ingestion enfants)'
      ],
      distancesLegales: {
        voisinage: {
          regle: 'Code Civil Article 671',
          distance: '0.5 m pour haie taillée < 2m (usage le plus fréquent)',
          justification: 'Généralement taillé en haie < 2m',
          sanction: 'Si > 2m : distance devient 2m obligatoire',
          option: 'Haie taillée : 0.5m suffit. Libre : 2m obligatoire'
        },
        espacesPublics: {
          distance: '0.5-1 m (haie) ou 2 m (libre)',
          regle: 'PLU + règlement voirie'
        },
        entreArbustes: {
          distance: '0.6-0.8 m en haie dense, 1.5 m en haie libre'
        },
        infrastructures: {
          fondations: '1.5 m minimum',
          canalisations: '1.5 m minimum (racines cherchent l\'eau)',
          fossesSeptiques: '3 m minimum',
          terrasse: '1 m minimum',
          aire_de_jeux: '3 m minimum (baies toxiques)'
        }
      },
      conseils: 'Champion des haies taillées. Distance 0.5m légale si maintenu < 2m de haut. Parfait pour brise-vue mais racines superficielles.'
    },
    
    // ========== INFORMATIONS COMPLÉMENTAIRES ==========
    informationsComplementaires: {
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
    }
  },
  {
    id: 'osmanthe',
    name: 'Osmanthe de Burkwood',
    nomScientifique: 'Osmanthus × burkwoodii',
    famille: 'Oleaceae',
    tailleMaturite: '2-3 m',
    envergure: '1.5-2 m',
    floraison: {
      periode: 'Avril à Mai',
      description: 'Grappes de petites fleurs tubulaires extrêmement parfumées',
      couleur: 'Blanc pur',
      parfum: 'Intense, sucré, rappelant le jasmin et l\'abricot'
    },
    fructification: {
      periode: 'Rare en culture',
      description: 'Drupes ovales (rares)',
      couleur: 'Bleu-noir'
    },
    feuillage: {
      type: 'Persistant',
      couleurAutomne: 'Vert foncé toute l\'année',
      description: 'Feuilles coriaces, ovales, dentées, vert foncé brillant'
    },
    plantation: {
      periode: 'Mars-Avril ou Septembre-Octobre',
      conseil: 'Préférer le printemps en climat froid. Protéger du vent froid. Planter en situation abritée près d\'un passage pour profiter du parfum.'
    },
    sol: {
      type: 'Bien drainé, riche en humus, frais',
      ph: '6.0-7.5 (légèrement acide à neutre)',
      humidite: 'Frais, craint l\'humidité stagnante'
    },
    exposition: 'Soleil à mi-ombre (protégé des vents froids)',
    arrosage: 'Régulier, surtout en été. Maintenir le sol frais.',
    rusticite: '-12 à -15°C (rustique en Île-de-France avec protection)',
    croissance: 'Lente (15-25 cm/an)',
    taille: {
      periode: 'Après floraison (mai-juin)',
      frequence: 'Tous les 2-3 ans si nécessaire',
      methode: 'Taille légère pour maintenir forme compacte. Supporte bien la taille. Éliminer le bois mort.',
      conseil: 'Peu exigeant en taille. Tailler juste après la floraison pour ne pas compromettre la floraison suivante.'
    },
    calendrierAnnuel: [
      { mois: 'Janvier-Février', action: 'Repos - Protection si grand froid', icone: '❄️' },
      { mois: 'Mars', action: 'Débourrement - Fertilisation', icone: '🌱' },
      { mois: 'Avril-Mai', action: 'Floraison parfumée spectaculaire', icone: '🌸' },
      { mois: 'Juin', action: 'Taille légère après floraison', icone: '✂️' },
      { mois: 'Juillet-Août', action: 'Arrosage régulier', icone: '💧' },
      { mois: 'Septembre-Octobre', action: 'Paillage', icone: '🍂' },
      { mois: 'Novembre-Décembre', action: 'Feuillage persistant décoratif', icone: '🌿' }
    ],
    maladies: [
      'Très résistant',
      'Cochenilles occasionnelles',
      'Chlorose si sol trop calcaire'
    ],
    biodiveriste: {
      faune: 'Abri permanent grâce au feuillage persistant',
      insectes: 'Très mellifère - attire abeilles et bourdons au printemps',
      oiseaux: 'Site de nidification apprécié'
    },
    toxicite: {
      niveau: 'Non toxique',
      allergie: 'Parfum intense peut incommoder certaines personnes sensibles'
    },
    utilisations: [
      'Haie libre ou taillée persistante',
      'Arbuste d\'ornement pour parfum',
      'Haie basse à moyenne',
      'Plantation près des entrées et terrasses',
      'Couvre-sol en massif'
    ],
    anecdote: 'L\'osmanthe de Burkwood est un hybride entre O. delavayi et O. decorus. Son parfum envoûtant au printemps en fait l\'un des arbustes les plus appréciés des jardins. En Chine, les fleurs d\'osmanthe parfument le thé et les pâtisseries !',
    
    // ========== RÉGLEMENTATION ==========
    reglementation: {
      systemeRacinaire: {
        type: 'Compact et peu profond',
        profondeur: '0.4-0.7 m',
        etalement: '2-3 m',
        agressivite: 'Très faible',
        description: 'Système racinaire NON invasif, compact. Croissance lente. Excellent pour proximité terrasses.'
      },
      risques: [
        'Risques quasi nuls',
        'Racines non agressives',
        'Croissance lente limite expansion',
        'Peut être planté près des terrasses'
      ],
      distancesLegales: {
        voisinage: {
          regle: 'Code Civil Article 671',
          distance: '0.5 m (généralement < 2m) OU 2m si laissé libre',
          justification: 'Hauteur naturelle 2-3 m',
          sanction: 'Selon hauteur effective',
          option: 'Souvent maintenu < 2m : 0.5m suffit'
        },
        espacesPublics: {
          distance: '0.5-1 m',
          regle: 'PLU local'
        },
        entreArbustes: {
          distance: '0.8-1 m en haie, 1.5 m isolé'
        },
        infrastructures: {
          fondations: '1.5 m minimum (peut être réduit à 1m)',
          canalisations: '1 m minimum',
          fossesSeptiques: '2 m minimum',
          terrasse: '0.8 m minimum',
          piscine: '1.5 m minimum'
        }
      },
      conseils: 'UN DES MEILLEURS pour proximité maison/terrasse. Racines compactes, croissance lente, feuillage persistant. Parfait en bac également.'
    },
    
    // ========== INFORMATIONS COMPLÉMENTAIRES ==========
    informationsComplementaires: {
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
        'Résiste bien à -15°C en Île-de-France'
      ]
    }
  },
  {
    id: 'cornouiller',
    name: 'Cornouiller sanguin',
    nomScientifique: 'Cornus sanguinea',
    famille: 'Cornaceae',
    tailleMaturite: '3-5 m',
    envergure: '2.5-4 m',
    floraison: {
      periode: 'Mai à Juin',
      description: 'Corymbes plats de petites fleurs',
      couleur: 'Blanc crème'
    },
    fructification: {
      periode: 'Août à Octobre',
      description: 'Drupes globuleuses en grappes',
      couleur: 'Noir bleuté (non comestibles mais non toxiques)'
    },
    feuillage: {
      type: 'Caduc',
      couleurAutomne: 'Rouge sang à pourpre intense',
      description: 'Feuilles opposées, ovales, nervures arquées caractéristiques'
    },
    rameaux: {
      couleur: 'Rouge sang en hiver (très décoratif)',
      particularite: 'Jeunes rameaux rouge vif, surtout visibles en hiver après la chute des feuilles'
    },
    plantation: {
      periode: 'Octobre à Mars (hors gel)',
      conseil: 'Préférer l\'automne. Pour haie : espacer de 80-100 cm. Bien arroser la première année.'
    },
    sol: {
      type: 'Tous types, préfère frais et humifère',
      ph: '6.0-8.0 (tolère le calcaire)',
      humidite: 'Frais à humide, supporte les sols temporairement inondés'
    },
    exposition: 'Soleil à mi-ombre',
    arrosage: 'Régulier, apprécie les sols frais',
    rusticite: '-30°C (très rustique)',
    croissance: 'Rapide (40-60 cm/an)',
    taille: {
      periode: 'Mars (fin d\'hiver) pour les rameaux colorés',
      frequence: 'Recépage tous les 2-3 ans recommandé',
      methode: 'RECÉPAGE SÉVÈRE conseillé : couper à 10-20 cm du sol tous les 2-3 ans pour favoriser les jeunes rameaux rouges très décoratifs en hiver.',
      conseil: 'Plus la taille est sévère, plus les nouveaux rameaux seront colorés et vigoureux. Tailler en mars avant le débourrement.'
    },
    calendrierAnnuel: [
      { mois: 'Janvier-Février', action: 'Rameaux rouges décoratifs', icone: '🔴' },
      { mois: 'Mars', action: 'Recépage si souhaité - Fertilisation', icone: '✂️' },
      { mois: 'Avril', action: 'Débourrement', icone: '🌱' },
      { mois: 'Mai-Juin', action: 'Floraison mellifère', icone: '🌸' },
      { mois: 'Juillet-Août', action: 'Croissance - Arrosage si sec', icone: '💧' },
      { mois: 'Septembre-Octobre', action: 'Fructification + couleurs automnales', icone: '🍂' },
      { mois: 'Novembre-Décembre', action: 'Chute des feuilles - rameaux colorés apparaissent', icone: '❄️' }
    ],
    maladies: [
      'Anthracnose (taches foliaires) - traiter au cuivre',
      'Oïdium possible',
      'Généralement résistant'
    ],
    biodiveriste: {
      faune: 'Fruits très appréciés par 15+ espèces d\'oiseaux',
      insectes: 'Mellifère - attire pollinisateurs',
      oiseaux: 'Excellent pour nidification et alimentation hivernale'
    },
    toxicite: {
      niveau: 'Fruits non comestibles pour l\'homme (amers, irritants)',
      danger: 'Peuvent provoquer troubles digestifs légers. Sans danger pour oiseaux.',
      prevention: 'Ne pas consommer'
    },
    utilisations: [
      'Haie champêtre',
      'Ornement pour rameaux colorés en hiver',
      'Stabilisation des berges et zones humides',
      'Massif d\'arbustes',
      'Excellent pour biodiversité'
    ],
    anecdote: 'Son nom "sanguin" vient de la couleur rouge sang de ses jeunes rameaux en hiver. En hiver, après la taille, les jeunes pousses forment un spectacle flamboyant ! Autrefois, on utilisait ses rameaux flexibles pour la vannerie.',
    
    // ========== RÉGLEMENTATION ==========
    reglementation: {
      systemeRacinaire: {
        type: 'Superficiel dense + drageons modérés',
        profondeur: '0.5-0.8 m',
        etalement: '4-6 m',
        agressivite: 'Modérée',
        description: 'Racines superficielles + drageons occasionnels. Supporte sols humides. Peut coloniser lentement.'
      },
      risques: [
        'Drageons occasionnels (moins que noisetier)',
        'Racines superficielles dans rayon 3m',
        'Peut assécher sol localement',
        'Fruits non comestibles (amers)'
      ],
      distancesLegales: {
        voisinage: {
          regle: 'Code Civil Article 671',
          distance: '2 m minimum',
          justification: 'Hauteur > 2 m (3-5 m)',
          sanction: 'Taille ou arrachage exigible',
          option: 'Si recépé régulièrement < 2m : 0.5m possible'
        },
        espacesPublics: {
          distance: '1.5-2 m',
          regle: 'PLU local'
        },
        entreArbustes: {
          distance: '0.8-1 m en haie champêtre'
        },
        infrastructures: {
          fondations: '2.5 m minimum',
          canalisations: '2 m minimum',
          fossesSeptiques: '3 m minimum',
          terrasse: '1.5 m minimum',
          zones_humides: 'Excellent (tolère eau stagnante)'
        }
      },
      conseils: 'Parfait pour zones humides et berges. Recépage régulier recommandé pour rameaux colorés ET pour réduire hauteur (distance 0.5m alors possible).'
    },
    
    // ========== INFORMATIONS COMPLÉMENTAIRES ==========
    informationsComplementaires: {
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
    }
  },
  {
    id: 'seringat',
    name: 'Seringat / Jasmin des poètes',
    nomScientifique: 'Philadelphus coronarius',
    famille: 'Hydrangeaceae',
    tailleMaturite: '2-3 m',
    envergure: '2-3 m',
    floraison: {
      periode: 'Mai à Juin',
      description: 'Fleurs simples ou doubles à 4 pétales, en grappes',
      couleur: 'Blanc pur',
      parfum: 'Très intense, rappelle la fleur d\'oranger et le jasmin'
    },
    fructification: {
      periode: 'Insignifiante',
      description: 'Capsules brunes sans intérêt décoratif'
    },
    feuillage: {
      type: 'Caduc',
      couleurAutomne: 'Jaune pâle',
      description: 'Feuilles opposées, ovales, dentées, vert moyen'
    },
    plantation: {
      periode: 'Octobre à Mars (hors gel)',
      conseil: 'Préférer l\'automne. Planter près des lieux de passage pour profiter du parfum envoûtant.'
    },
    sol: {
      type: 'Tous types, bien drainé, frais',
      ph: '6.0-8.0 (très tolérant)',
      humidite: 'Frais, tolère courtes périodes de sécheresse'
    },
    exposition: 'Soleil à mi-ombre (floraison meilleure au soleil)',
    arrosage: 'Régulier, surtout en été et pendant la floraison',
    rusticite: '-25°C (très rustique)',
    croissance: 'Rapide (40-50 cm/an)',
    taille: {
      periode: 'JUSTE APRÈS LA FLORAISON (juin-juillet) - IMPÉRATIF',
      frequence: 'Annuelle',
      methode: 'Supprimer 1/3 des vieilles branches après floraison. Rabattre les rameaux ayant fleuri. Recépage possible tous les 4-5 ans pour rajeunir.',
      conseil: '⚠️ CRUCIAL : Tailler UNIQUEMENT après floraison car fleurit sur bois de l\'année précédente. Taille tardive = pas de fleurs l\'année suivante !'
    },
    calendrierAnnuel: [
      { mois: 'Janvier-Février', action: 'Repos végétatif', icone: '❄️' },
      { mois: 'Mars-Avril', action: 'Débourrement - Fertilisation', icone: '🌱' },
      { mois: 'Mai-Juin', action: 'Floraison spectaculaire et parfumée', icone: '🌸' },
      { mois: 'Juillet', action: 'TAILLE après floraison', icone: '✂️' },
      { mois: 'Août', action: 'Arrosage si sécheresse', icone: '💧' },
      { mois: 'Septembre-Octobre', action: 'Formation des bourgeons floraux pour l\'an prochain', icone: '🌱' },
      { mois: 'Novembre-Décembre', action: 'Chute des feuilles - Paillage', icone: '🍂' }
    ],
    maladies: [
      'Très résistant aux maladies',
      'Pucerons occasionnels (juin)',
      'Cochenilles rares'
    ],
    biodiveriste: {
      faune: 'Abri pour petits oiseaux et insectes',
      insectes: 'Très mellifère - attire abeilles, bourdons et papillons',
      oiseaux: 'Site de nidification apprécié pour le feuillage dense'
    },
    toxicite: {
      niveau: 'Non toxique',
      allergie: 'Parfum très intense peut incommoder personnes sensibles'
    },
    utilisations: [
      'Haie libre fleurie',
      'Arbuste d\'ornement isolé',
      'Massif d\'arbustes',
      'Plantation près des terrasses et fenêtres',
      'Fleurs coupées pour bouquets parfumés'
    ],
    anecdote: 'Appelé "Jasmin des poètes" pour son parfum envoûtant rappelant le jasmin. Son nom "seringat" vient du grec "syrinx" (flûte) car ses rameaux creux servaient à fabriquer des instruments. C\'est l\'un des arbustes les plus parfumés du jardin !',
    
    // ========== RÉGLEMENTATION ==========
    reglementation: {
      systemeRacinaire: {
        type: 'Superficiel compact',
        profondeur: '0.4-0.6 m',
        etalement: '2-3 m',
        agressivite: 'Très faible',
        description: 'Racines superficielles mais compactes et NON envahissantes. Excellent pour petits jardins.'
      },
      risques: [
        'Risques très faibles',
        'Racines non agressives',
        'Peut être planté près terrasses',
        'Parfum intense peut gêner certaines personnes (fenêtres)'
      ],
      distancesLegales: {
        voisinage: {
          regle: 'Code Civil Article 671',
          distance: '0.5 m si taillé < 2m OU 2m si libre',
          justification: 'Hauteur naturelle 2-3 m',
          sanction: 'Selon hauteur maintenue',
          option: 'Généralement maintenu < 2m : 0.5m légal'
        },
        espacesPublics: {
          distance: '0.5-1 m',
          regle: 'PLU local'
        },
        entreArbustes: {
          distance: '1-1.5 m'
        },
        infrastructures: {
          fondations: '1.5 m minimum',
          canalisations: '1 m minimum',
          fossesSeptiques: '2 m minimum',
          terrasse: '1 m minimum',
          fenetres: '1.5-2 m (parfum intense !)'
        }
      },
      conseils: 'Parfait près terrasses pour parfum MAIS attention fenêtres chambres (parfum peut être entêtant la nuit). Racines non problématiques.'
    },
    
    // ========== INFORMATIONS COMPLÉMENTAIRES ==========
    informationsComplementaires: {
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
  }
];

// Ajouter le type 'arbuste' à tous les arbustes
arbustesData.forEach(arbuste => {
  arbuste.type = 'arbuste';
});

// Données combinées avec distinction type
export const plantesData = [...arbresData, ...arbustesData];

export default plantesData;

