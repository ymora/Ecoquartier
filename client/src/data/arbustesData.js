import plantSchema from '../validation/plantSchema';

export const arbresData = [
  {
    id: 'prunus-kanzan',
    name: 'Cerisier du Japon Kanzan',
    nomScientifique: 'Prunus serrulata \'Kanzan\'',
    famille: 'Rosaceae',
    type: 'arbre',
    tailleMaturite: '6-10 m',
    envergure: '4-6 m',
    images: [
      'prunus-kanzan/prunus-kanzan_vue_generale_01.jpg',
      'prunus-kanzan/prunus-kanzan_vue_generale_02.jpg',
      'prunus-kanzan/prunus-kanzan_vue_generale_03.jpg',
      'prunus-kanzan/prunus-kanzan_fleurs_01.jpg',
      'prunus-kanzan/prunus-kanzan_fleurs_02.jpg',
      'prunus-kanzan/prunus-kanzan_fleurs_03.jpg',
      'prunus-kanzan/prunus-kanzan_fleurs_04.jpg',
      'prunus-kanzan/prunus-kanzan_fleurs_05.jpg',
      'prunus-kanzan/prunus-kanzan_fleurs_06.jpg',
      'prunus-kanzan/prunus-kanzan_fleurs_07.jpg',
      'prunus-kanzan/prunus-kanzan_fleurs_08.jpg',
      'prunus-kanzan/prunus-kanzan_fleurs_09.jpg',
    ],
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
    images: [
      'prunus-accolade/prunus-accolade_vue_generale_01.jpg',
      'prunus-accolade/prunus-accolade_vue_generale_02.jpg',
      'prunus-accolade/prunus-accolade_vue_generale_03.jpg',
      'prunus-accolade/prunus-accolade_fleurs_01.jpg',
      'prunus-accolade/prunus-accolade_fleurs_02.jpg',
      'prunus-accolade/prunus-accolade_feuilles_01.jpg',
    ],
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
          loi: '⚠️ AGRICULTEURS : Interdiction légale (16 mars - 15 août). PARTICULIERS : Recommandation forte.',
          raison: 'Protection oiseaux nicheurs (Code Rural + Biodiversité)',
          sanction: 'Agriculteurs : Amende + réduction aides PAC. Particuliers : Responsabilité si destruction habitat protégé.',
          application: 'Agriculteurs (Loi) / Particuliers (Civisme & arrêtés locaux)'
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
    images: [
      'prunus-sunset-boulevard/prunus-sunset-boulevard_vue_generale_01.jpg',
      'prunus-sunset-boulevard/prunus-sunset-boulevard_vue_generale_02.jpg',
      'prunus-sunset-boulevard/prunus-sunset-boulevard_fleurs_01.jpg',
      'prunus-sunset-boulevard/prunus-sunset-boulevard_fleurs_02.jpg',
    ],
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
          loi: '⚠️ AGRICULTEURS : Interdiction légale (16 mars - 15 août). PARTICULIERS : Recommandation forte.',
          raison: 'Protection oiseaux nicheurs',
          sanction: 'Agriculteurs : Amende. Particuliers : Risque verbalisation si destruction nids.',
          application: 'Agriculteurs (Loi) / Particuliers (Civisme & arrêtés locaux)'
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
          loi: '⚠️ AGRICULTEURS : Interdiction légale (16 mars - 15 août). PARTICULIERS : Recommandation forte.',
          raison: 'Protection oiseaux nicheurs (Code de l\'Environnement)',
          sanction: 'Agriculteurs : Aides PAC. Particuliers : Amende si destruction espèce protégée.',
          application: 'Agriculteurs (Obligation) / Particuliers (Responsabilité)',
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
    id: 'erable-champetre',
    name: 'Érable champêtre',
    nomScientifique: 'Acer campestre',
    famille: 'Sapindaceae (anciennement Aceraceae)',
    type: 'arbre',
    tailleMaturite: '10-15 m (taille moyenne, bien adapté jardins)',
    envergure: '8-12 m (couronne arrondie dense)',
    floraison: {
      periode: 'Avril à Mai (avec ou juste après les feuilles)',
      description: 'Petites fleurs (5 mm) jaune-vert en corymbes dressés, discrètes mais mellifères',
      couleur: 'Jaune-vert',
      parfum: 'Discret, légèrement sucré'
    },
    fructification: {
      periode: 'Septembre à Octobre',
      description: 'Samares doubles horizontales (disamares) avec ailes opposées à 180° (2-3 cm), très caractéristiques',
      couleur: 'Brun-roux à maturité'
    },
    feuillage: {
      type: 'Caduc',
      couleurAutomne: 'Jaune doré à orange (parfois rouge-orangé)',
      description: 'Feuilles opposées à 3-5 lobes arrondis (4-10 cm), vert foncé mat dessus, pubescentes dessous. Lobes moins pointus que autres érables.'
    },
    rameaux: {
      couleur: 'Brun-gris',
      particularite: 'Jeunes rameaux parfois avec crêtes liégeuses (ailées) caractéristiques. Écorce gris-brun fissurée en plaques. Bourgeons petits bruns.'
    },
    plantation: {
      periode: 'Octobre à Mars (hors gel)',
      conseil: 'Automne IDÉAL (octobre-novembre). TOLÈRE CALCAIRE (contrairement Acer rubrum) - Parfait Bessancourt ! Prévoir 8-10m d\'espace. Très adaptable. Excellent haies champêtres, alignements, isolé. Motte ou racines nues acceptées. Tuteurage 2 ans.'
    },
    sol: {
      type: 'Tous types, très tolérant, préfère frais et profond',
      ph: '6.0-8.0 (neutre à calcaire - TOLÈRE BIEN CALCAIRE) - Excellent Île-de-France !',
      humidite: 'Frais à sec. Excellente résistance sécheresse une fois établi (3-4 ans). Tolère sols argileux lourds et calcaires.'
    },
    exposition: 'Soleil à mi-ombre (très tolérant). Supporte ombre légère mieux que autres érables.',
    arrosage: 'Régulier les 2-3 premières années. Ensuite résistant à la sécheresse. Peu exigeant une fois établi. Paillage recommandé jeunes plants.',
    rusticite: '-25 à -30°C (zone 5-8, très rustique). Parfaitement adapté climat Île-de-France.',
    croissance: 'Lente à moyenne (20-40 cm/an). Plus lente que Acer rubrum mais adapté petits jardins.',
    taille: {
      periode: 'Novembre à mars (hors gel) OU août-septembre',
      frequence: 'Tous les 3-5 ans (peu exigeant)',
      methode: 'EXCELLENT pour taille ! Supporte taille sévère (haies). Formation jeunes plants si souhaité. Taille de structure si besoin. Supporte recépage. Désinfecter outils.',
      conseil: 'Un des érables les plus tolérants à la taille. Peut être conduit en haie haute champêtre (taille régulière). Moins de "pleurs" que autres érables. Éviter quand même taille printemps (mars-avril) si possible.'
    },
    calendrierAnnuel: [
      { mois: 'Janvier-Février', action: 'Repos végétatif - Taille possible (hors gel)', icone: '❄️' },
      { mois: 'Mars-Avril', action: 'Débourrement - Fertilisation organique', icone: '🌱' },
      { mois: 'Avril-Mai', action: 'Floraison discrète jaune-vert mellifère', icone: '🌸' },
      { mois: 'Juin-Juillet', action: 'Croissance - Arrosage si sec (jeunes plants)', icone: '💧' },
      { mois: 'Août-Septembre', action: 'Taille possible - Formation samares horizontales', icone: '✂️' },
      { mois: 'Septembre-Octobre', action: 'Couleurs automnales dorées + samares brunes', icone: '🍂' },
      { mois: 'Novembre-Décembre', action: 'Chute feuilles - Taille haie possible - Paillage', icone: '🍁' }
    ],
    maladies: [
      'Taches foliaires fongiques "goudron de l\'érable" (Rhytisma) - inesthétique mais bénin',
      'Oïdium possible (esthétique uniquement)',
      'Pucerons (printemps - miellat)',
      'Verticilliose (rare)',
      'Anthracnose (rare)',
      'TRÈS RÉSISTANT globalement - Un des érables les plus robustes !',
      'Tolère pollution urbaine, calcaire, sécheresse',
      'Pratiquement aucune maladie grave'
    ],
    biodiveriste: {
      faune: 'Arbre INDIGÈNE européen - Excellent biodiversité locale ! Fleurs mellifères (avril-mai) pour abeilles, bourdons. Samares consommées oiseaux granivores, rongeurs. Feuillage dense abrite faune.',
      insectes: 'Très mellifère (nectar abondant). Chenilles de nombreux papillons locaux. Pucerons = nourriture auxiliaires (coccinelles, syrphes). Abrite insectes saproxyliques (bois mort).',
      oiseaux: 'Excellent site nidification (feuillage dense, branches fournies). Samares appréciées mésanges, pinsons, verdiers. Perchoir. Espèce LOCALE favorisant faune indigène.'
    },
    toxicite: {
      niveau: 'Non toxique',
      danger: 'Aucun danger pour humains ni animaux domestiques.',
      prevention: 'Pas de précaution particulière. Sève non toxique.'
    },
    utilisations: [
      'Haie champêtre haute (taille régulière)',
      'Arbre d\'alignement urbain (résiste pollution)',
      'Isolé ornement (petits à moyens jardins)',
      'Brise-vent champêtre',
      'Arbre mellifère (haies bocagères)',
      'Bois dur : tournerie, lutherie, manches outils',
      'Biodiversité (espèce indigène européenne)',
      'Arbre fruitier ornement (samares horizontales caractéristiques)',
      'Stabilisation talus',
      'Excellent substitut érable rouge pour sol calcaire !',
      'Haies libres mixtes'
    ],
    anecdote: 'L\'érable champêtre est le SEUL érable INDIGÈNE de France ! Arbre des campagnes et bocages depuis des millénaires, il était autrefois taillé en têtard dans les haies. Ses samares horizontales (ailes à 180°) sont uniques parmi les érables. Son bois très dur était utilisé pour fabriquer des manches d\'outils et des instruments de musique. Parfaitement adapté au climat et sols d\'Île-de-France (tolère calcaire !), c\'est l\'alternative IDÉALE à l\'érable rouge pour Bessancourt !',

    // ========== RÉGLEMENTATION ==========
    reglementation: {
      systemeRacinaire: {
        type: 'Mixte : pivotant + traçant modéré',
        profondeur: '1-1.5 m (pivot central + latérales)',
        etalement: '8-12 m (proportionnel à couronne)',
        agressivite: 'MODÉRÉE (bien moindre qu\'Acer rubrum)',
        description: 'Système racinaire équilibré avec pivot central + racines traçantes modérées. Moins agressif que la plupart des érables. Adapté zones urbaines. Racines tolèrent bien sols compactés et calcaires.'
      },
      risques: [
        'Racines superficielles modérées (rayon 5-8m)',
        'Soulèvement pavages possible si < 3m (mais rare)',
        'Compétition racinaire normale (pelouse possible sous couronne)',
        'Risque canalisations faible si > 3m',
        'Adapté alignements urbains (racines tolérantes)',
        'Beaucoup moins problématique qu\'Acer rubrum',
        'Peut être planté en haie (supporte taille racines)'
      ],
      distancesLegales: {
        voisinage: {
          regle: 'Code Civil Article 671',
          distance: '2 m minimum de la limite de propriété',
          justification: 'Hauteur > 2 m à maturité (10-15 m)',
          sanction: 'Le voisin peut exiger l\'arrachage ou la taille à 2m de haut',
          option: 'Peut être conduit en haie haute taillée régulièrement'
        },
        espacesPublics: {
          distance: '3-4 m minimum',
          regle: 'PLU de Bessancourt',
          justification: 'Excellent alignement urbain - Racines tolérantes - Taille adaptable'
        },
        entreArbres: {
          distance: '6-8 m (haie libre) ou 3-5 m (haie taillée)',
          justification: 'Couronne moyenne. Supporte proximité autres arbres. Peut être planté en haie champêtre dense.'
        },
        infrastructures: {
          fondations: '4-5 m minimum',
          canalisations: '3-4 m minimum',
          fossesSeptiques: '5 m minimum',
          piscine: '4 m minimum',
          terrasse: '3 m minimum',
          allees_pavees: '3 m minimum',
          trottoirs: '3 m minimum',
          murs: '3 m minimum'
        }
      },
      conseils: '✅ EXCELLENT CHOIX pour Bessancourt ! Tolère calcaire, pollution, sécheresse. Adapté petits/moyens jardins (10-15m). Racines modérées (beaucoup moins problématiques qu\'Acer rubrum). Parfait : haies champêtres, alignements, isolé, brise-vent. Arbre INDIGÈNE favorisant biodiversité locale. Distances raisonnables vs autres érables.'
    },

    // ========== INFORMATIONS COMPLÉMENTAIRES ==========
    informationsComplementaires: {
      pollinisation: {
        type: 'Monoïque (fleurs mâles et femelles sur même arbre)',
        besoin: 'Autofertile - Aucun pollinisateur nécessaire',
        production: 'Samares horizontales abondantes (septembre-octobre), caractéristiques et décoratives',
        conseil: 'Floraison mellifère (avril-mai) excellente pour abeilles domestiques et sauvages. Samares restent longtemps sur l\'arbre (décoratives automne/hiver).'
      },
      dangersEtPrecautions: {
        taille: {
          danger: 'FAIBLE À MODÉRÉ - Supporte bien la taille',
          risques: [
            'Écoulement sève modéré (moins qu\'Acer rubrum)',
            'Chancre possible sur plaies (rare)',
            'Entrée champignons si plaies importantes'
          ],
          periodeDanger: '⛔ Éviter février-avril (montée sève, mais moins grave que Acer rubrum)',
          periodeSecuritaire: '✅ Août-septembre (idéal) OU novembre-février (hors gel)',
          protection: 'Cicatrisant recommandé sur plaies > 5cm',
          conseil: 'EXCELLENT pour taille ! Supporte taille sévère et régulière (haies champêtres). Peut être taillé en têtard (tradition ancestrale). Moins de problèmes de sève que autres érables.'
        },
        reglementationTaille: {
          loi: '⚠️ AGRICULTEURS : Interdiction légale (16 mars - 15 août). PARTICULIERS : Recommandation forte.',
          raison: 'Protection oiseaux (Code Rural + Biodiversité)',
          sanction: 'Agriculteurs : Aides PAC. Particuliers : Amende si destruction nids prouvée.',
          application: 'Agriculteurs (Loi) / Particuliers (Civisme & arrêtés locaux)',
          exception: 'Travaux urgents sécurité. Haies champêtres : voir mairie.'
        }
      },
      allergies: {
        pollen: 'FAIBLE (pollen peu allergisant)',
        niveau: 'Allergénicité faible - Floraison avril-mai',
        symptomes: 'Rarement problématique',
        contact: 'Aucun risque cutané',
        sensibles: 'Très rarement allergies (moins qu\'autres érables)'
      },
      animauxDomestiques: {
        chiens: '✅ Non toxique',
        chats: '✅ Non toxique',
        chevaux: '✅ Non toxique',
        oiseaux: '✅ Excellent - Nidification + samares consommées',
        ecureuils: '✅ Sans danger',
        conseil: 'Totalement sans danger pour tous animaux domestiques et sauvages. Aucune toxicité connue (contrairement Acer rubrum pour chevaux).'
      },
      protectionHivernale: {
        adulte: 'AUCUNE protection nécessaire (très rustique -25°C à -30°C)',
        jeunesPlants: [
          'Paillage organique recommandé première année',
          'Protection inutile (très rustique)',
          'Résiste bien gel et vent'
        ],
        gelPrintanier: '✅ RÉSISTE BIEN gel tardif (débourrement tardif)',
        gelAutomnal: 'Tolère premières gelées sans problème'
      },
      fertilisation: {
        besoins: 'FAIBLES à MODÉRÉS (peu exigeant)',
        periode: 'Mars-avril (avant débourrement)',
        type: 'Compost bien décomposé',
        quantite: '2-3 kg compost par m² couronne (jeunes plants)',
        frequence: 'Annuelle 3 premières années, puis tous les 2-3 ans',
        specificite: '✅ TOLÈRE SOLS CALCAIRES - Aucun apport acidifiant nécessaire (contrairement Acer rubrum)',
        conseil: 'Très peu exigeant. Pousse bien en sols pauvres calcaires. Compost suffit largement.'
      },
      specificites: {
        indigene: '🇫🇷 ARBRE INDIGÈNE FRANÇAIS - Seul érable natif de France !',
        calcaire: '✅ TOLÈRE PARFAITEMENT CALCAIRE - Idéal sols Bessancourt (pH 6-8)',
        haie: 'Excellent en haie champêtre haute (taille régulière supportée)',
        samares: 'Samares HORIZONTALES (180°) uniques - Différencie facilement des autres érables',
        liege: 'Rameaux parfois avec crêtes liégeuses ailées (caractéristique botanique intéressante)',
        tetard: 'Tradition : taillé en têtard dans haies bocagères (repousse vigoureuse)',
        urbain: 'Excellente tolérance pollution urbaine + sols compactés',
        biodiversite: 'Espèce locale = favorise insectes et oiseaux indigènes (co-évolution)',
        adaptable: 'Un des érables les plus ADAPTABLES (sol, taille, climat, pollution)'
      },
      sujetsForums: [
        'Érable champêtre vs érable rouge ? Champêtre MEILLEUR pour Bessancourt (calcaire OK)',
        'Sol calcaire - quel érable ? Champêtre ou sycomore (PAS rouge !)',
        'Peut-on le tailler en haie ? OUI excellent (supporte taille sévère)',
        'Croissance lente - inconvénient ? NON avantage (adapté petits jardins)',
        'Arbre indigène France ? OUI seul érable natif',
        'Samares horizontales - pourquoi ? Caractéristique botanique Acer campestre',
        'Résiste pollution ? OUI très bien (alignements urbains)',
        'Biodiversité locale ? EXCELLENTE (espèce indigène)',
        'Distance maison ? 4-5m suffisant (racines modérées)',
        'Taille en têtard possible ? OUI tradition bocagère',
        'Feuilles plus petites que autres érables ? Normal (4-10cm vs 15cm)',
        'Adapté haie champêtre mixte ? PARFAIT !'
      ]
    }
  },
  {
    id: 'erable-japonais',
    name: 'Érable du Japon',
    nomScientifique: 'Acer palmatum',
    famille: 'Sapindaceae (anciennement Aceraceae)',
    type: 'arbre',
    tailleMaturite: '4-8 m (petit arbre/grand arbuste selon variété)',
    envergure: '4-6 m (port étalé élégant)',
    floraison: {
      periode: 'Avril à Mai (discrète)',
      description: 'Petites fleurs (5-6 mm) pourpre-rouge en petites grappes pendantes, discrètes mais élégantes',
      couleur: 'Pourpre-rouge à rose',
      parfum: 'Absent'
    },
    fructification: {
      periode: 'Septembre à Octobre',
      description: 'Samares doubles rougeâtres (disamares) à ailes formant angle aigu, en grappes',
      couleur: 'Rouge à brun'
    },
    feuillage: {
      type: 'Caduc',
      couleurAutomne: 'Rouge écarlate à pourpre flamboyant (SPECTACULAIRE selon variétés)',
      description: 'Feuilles palmées finement découpées à 5-9 lobes profondément dentés (5-10 cm), élégantes. Variétés : vertes, pourpres, panachées.'
    },
    rameaux: {
      couleur: 'Vert à pourpre selon variétés',
      particularite: 'Ramification dense et fine. Port naturel élégant en cépée. Écorce lisse gris-brun. Silhouette hivernale sculpturale très décorative.'
    },
    plantation: {
      periode: 'Septembre à Novembre (automne impératif) OU Mars-Avril (printemps)',
      conseil: 'Automne PRÉFÉRABLE. Sol ACIDE À NEUTRE (pH 5.5-7) - Éviter calcaire fort. Situation ABRITÉE des vents froids et desséchants IMPÉRATIVE. Mi-ombre idéale. Prévoir 4-5m espace. Excellent petits jardins, patios, bacs. Motte ou conteneur uniquement. Paillage obligatoire.'
    },
    sol: {
      type: 'Frais, bien drainé, riche en humus, léger, ACIDE à NEUTRE',
      ph: '5.5-7.0 (légèrement acide à neutre - Éviter calcaire > 7.5)',
      humidite: 'Frais IMPÉRATIF. Redoute sécheresse ET excès d\'eau. Drainage parfait essentiel. Arrosage régulier crucial.'
    },
    exposition: 'Mi-ombre à ombre légère (IDÉAL). Éviter soleil direct après-midi et vents froids. Situation abritée obligatoire.',
    arrosage: 'Régulier et constant TOUTE LA VIE. Maintenir sol frais en permanence. Arrosage 2-3x/semaine été. Paillage épais OBLIGATOIRE (10-15cm). Redoute sécheresse (brûlure feuilles).',
    rusticite: '-15 à -20°C selon variétés (zone 6-8). Rustique Île-de-France MAIS sensible vents froids, soleil hivernal, gel tardif. PROTECTION NÉCESSAIRE.',
    croissance: 'Très lente (10-25 cm/an). Patience nécessaire mais beauté exceptionnelle.',
    taille: {
      periode: 'Novembre à février (hors gel) - Repos végétatif',
      frequence: 'Minimale - Laisser port naturel',
      methode: 'Taille MINIMALE : bois mort, branches croisées uniquement. Port naturel = beauté. Éviter taille sévère. Cicatrisant obligatoire. Désinfecter outils (verticilliose).',
      conseil: '⚠️ Port naturel sculpté = charme de l\'arbre. Taille légère structure si nécessaire jeunes plants. Ensuite : quasi AUCUNE taille. Laisser développer librement. Éviter taille printemps (montée sève). Variétés naines : 0 taille.'
    },
    calendrierAnnuel: [
      { mois: 'Janvier-Février', action: 'Repos - Protection si grand froid - Silhouette sculpturale', icone: '❄️' },
      { mois: 'Mars', action: 'Débourrement délicat - Fertilisation organique légère', icone: '🌱' },
      { mois: 'Avril-Mai', action: 'Floraison discrète pourpre + Jeunes feuilles colorées', icone: '🌸' },
      { mois: 'Juin-Juillet', action: 'Arrosage RÉGULIER - Ombrage si soleil fort', icone: '💧' },
      { mois: 'Août', action: 'Maintenir fraîcheur sol - Paillage épais', icone: '💧' },
      { mois: 'Septembre-Octobre', action: '🍂 COULEURS AUTOMNALES SPECTACULAIRES (rouge/pourpre/orange)', icone: '🍂' },
      { mois: 'Novembre', action: 'Chute feuilles - Taille minimale si besoin - Paillage hiver', icone: '🍁' },
      { mois: 'Décembre', action: 'Protection hiver (voile, paillage) - Beauté hivernale', icone: '❄️' }
    ],
    maladies: [
      'Verticilliose (Verticillium) - GRAVE flétrissement vasculaire (surveiller)',
      'Anthracnose - taches foliaires (humidité)',
      'Brûlure feuilles (soleil direct, sécheresse) - FRÉQUENT',
      'Pucerons (printemps)',
      'Cochenilles farineuses',
      'Acariens (temps chaud sec)',
      'Oïdium (humidité stagnante)',
      'Chlorose en sol calcaire (pH > 7.5)',
      'Sensible stress hydrique et thermique'
    ],
    biodiveriste: {
      faune: 'Fleurs mellifères discrètes pour abeilles et petits pollinisateurs. Feuillage dense abrite petits oiseaux. Samares consommées oiseaux granivores. Bon support biodiversité jardins.',
      insectes: 'Fleurs mellifères (avril-mai). Feuillage abrite pucerons → nourriture coccinelles, syrphes. Moins d\'insectes que érables indigènes (espèce asiatique).',
      oiseaux: 'Nidification petits passereaux (branches fines denses). Samares appréciées mésanges. Perchoir élégant.'
    },
    toxicite: {
      niveau: 'Non toxique',
      danger: 'Aucun danger connu pour humains ni animaux domestiques.',
      prevention: 'Pas de précaution particulière.'
    },
    utilisations: [
      'Arbre d\'ornement EXCEPTIONNEL (feuillage découpé spectaculaire)',
      'Petits jardins et patios (taille modérée)',
      'Jardins japonais et zen',
      'Isolé sur pelouse (mise en valeur)',
      'Massif arbustes',
      'Culture en BAC/POT (excellent - variétés naines)',
      'Bonsaï (espèce privilégiée)',
      'Jardins d\'ombre (tolère mi-ombre)',
      'Couleurs automnales exceptionnelles',
      'Collections érables (nombreuses variétés)',
      'Jardins contemporains et design'
    ],
    anecdote: 'L\'érable du Japon est LE roi des petits jardins ! Avec plus de 1000 variétés (feuillage vert, pourpre, panaché, lacinié), il offre une diversité incroyable. Au Japon, la contemplation des érables en automne (Momijigari) est une tradition aussi importante que celle des cerisiers ! Ses feuilles finement découpées et ses couleurs flamboyantes en font un arbre de collection. Parfait pour Bessancourt car taille modeste (4-8m) et adapté petits espaces urbains. Symbole de l\'élégance japonaise !',

    // ========== RÉGLEMENTATION ==========
    reglementation: {
      systemeRacinaire: {
        type: 'Superficiel dense mais COMPACT',
        profondeur: '0.4-0.8 m (très superficiel)',
        etalement: '4-6 m (proportionnel taille arbre - COMPACT)',
        agressivite: 'TRÈS FAIBLE (excellent petits jardins)',
        description: 'Système racinaire superficiel MAIS compact et peu étendu (petit arbre). Racines fines nombreuses. NON invasif. Excellent proximité terrasses, patios. Parfait culture en bac. Tolère bien sols limités.'
      },
      risques: [
        'Risques TRÈS FAIBLES (petit arbre)',
        'Racines superficielles compactes (rayon 3-4m)',
        'Aucun soulèvement pavages (racines fines)',
        'Aucun risque canalisations (taille modeste)',
        'Peut être planté près maisons (3m suffit)',
        'Parfait petits jardins urbains',
        'Culture en bac possible (racines contenues)'
      ],
      distancesLegales: {
        voisinage: {
          regle: 'Code Civil Article 671',
          distance: '2 m minimum de la limite de propriété',
          justification: 'Hauteur > 2 m à maturité (4-8 m)',
          sanction: 'Le voisin peut exiger l\'arrachage ou la taille à 2m de haut',
          option: 'Variétés naines (< 2m) : distance 0.5m possible'
        },
        espacesPublics: {
          distance: '2-3 m minimum',
          regle: 'PLU de Bessancourt',
          justification: 'Petit arbre, racines compactes - Bien adapté espaces restreints'
        },
        entreArbres: {
          distance: '4-5 m',
          justification: 'Petit arbre. Tolère proximité. Couronne compacte.'
        },
        infrastructures: {
          fondations: '3 m minimum',
          canalisations: '2.5 m minimum',
          fossesSeptiques: '3 m minimum',
          piscine: '2.5 m minimum',
          terrasse: '2 m minimum',
          murs: '2 m minimum',
          bac_terrasse: 'Excellent en pot (80-150cm diamètre)'
        }
      },
      conseils: '⭐ PARFAIT PETITS JARDINS ! Racines compactes non invasives. Taille modeste (4-8m). Adapté jardins urbains, patios, terrasses. Culture en bac excellente. Distances raisonnables. MAIS exigeant : mi-ombre, sol frais, arrosage régulier, protection vents. Arbre de collection et prestige.'
    },

    // ========== INFORMATIONS COMPLÉMENTAIRES ==========
    informationsComplementaires: {
      pollinisation: {
        type: 'Monoïque (fleurs mâles et femelles sur même arbre)',
        besoin: 'Autofertile - Aucun pollinisateur nécessaire',
        production: 'Samares rougeâtres discrètes (automne)',
        conseil: 'Planté pour beauté feuillage (pas pour fruits). Floraison discrète mellifère.'
      },
      dangersEtPrecautions: {
        taille: {
          danger: 'MODÉRÉ - Sensible stress',
          risques: [
            'Écoulement sève modéré si taille printemps',
            'Verticilliose par outils contaminés',
            'Port naturel = beauté (taille gâche esthétique)',
            'Repousse lente si taille sévère'
          ],
          periodeDanger: '⛔ Éviter mars-mai (montée sève) ET été (stress chaleur)',
          periodeSecuritaire: '✅ Novembre-février (repos végétatif, hors gel)',
          protection: 'Cicatrisant recommandé. DÉSINFECTER outils (alcool/javel - verticilliose)',
          conseil: '🌿 Taille MINIMALE recommandée. Port naturel sculpté = essence même de l\'érable japonais. Uniquement bois mort ou branches gênantes. Laisser silhouette naturelle. Variétés naines : 0 taille.'
        },
        reglementationTaille: {
          loi: '⚠️ AGRICULTEURS : Interdiction légale (16 mars - 15 août). PARTICULIERS : Recommandation forte.',
          raison: 'Protection oiseaux nicheurs',
          sanction: 'Agriculteurs : Amende PAC. Particuliers : Amende si destruction nids.',
          application: 'Agriculteurs (Loi) / Particuliers (Civisme & arrêtés locaux)',
          exception: 'Travaux urgents sécurité'
        },
        sensibilites: {
          alerte: '⚠️ ARBRE DÉLICAT - Exigeant en soins',
          soleil: '☀️ Soleil direct après-midi = BRÛLURE feuilles (fréquent)',
          vent: '💨 Vents froids/secs = DESSÈCHEMENT feuillage',
          secheresse: '🔴 Sécheresse = BRÛLURE feuilles (bords bruns)',
          gel: '❄️ Gel printanier tardif = dégâts jeunes pousses',
          stress: 'Sensible tous stress (eau, chaleur, vent, gel)',
          conseil: '⚠️ Emplacement CRUCIAL : mi-ombre, abrité vent, sol toujours frais. Pas un arbre facile ! Demande attention régulière.'
        }
      },
      allergies: {
        pollen: 'FAIBLE (floraison discrète)',
        contact: 'Aucun',
        sensibles: 'Rarement problématique',
        conseil: 'Aucun problème allergique connu'
      },
      animauxDomestiques: {
        chiens: '✅ Non toxique',
        chats: '✅ Non toxique',
        chevaux: '✅ Non toxique',
        oiseaux: '✅ Sans danger - Nidification appréciée',
        conseil: 'Aucune toxicité connue. Sans danger tous animaux.'
      },
      protectionHivernale: {
        adulte: 'Protection RECOMMANDÉE même adulte si variété sensible',
        jeunesPlants: [
          '🔴 PROTECTION OBLIGATOIRE 3-5 premières années',
          'Paillage ÉPAIS (20 cm) base tronc',
          'Voile hivernage P17 si températures < -10°C',
          'Protection tronc contre soleil hivernal (alternance gel-dégel)',
          'Brise-vent si zone exposée vents froids',
          'Arrosage modéré hiver si absence pluie prolongée'
        ],
        gelPrintanier: '⚠️ TRÈS SENSIBLE gel tardif (avril-mai). Jeunes pousses fragiles. Peut détruire jeunes feuilles. Voile si annonce gel.',
        gelAutomnal: 'Premières gelées améliorent couleurs automnales (septembre-octobre)'
      },
      fertilisation: {
        besoins: 'MODÉRÉS (petit arbre croissance lente)',
        periode: 'Mars-avril (printemps) - UNE SEULE fois',
        type: 'Engrais arbres terre bruyère OU compost acide (éviter azote excessif)',
        quantite: '50-100g engrais spécial érables japonais',
        frequence: 'Annuelle (printemps uniquement)',
        specificite: 'Préfère engrais à libération lente. Éviter engrais chimique fort (brûlure racines fines). Sol acide à neutre.',
        exces: '⚠️ EXCÈS AZOTE = croissance molle = sensibilité gel/vent. PAS d\'engrais fort !',
        conseil: 'Peu exigeant. Compost acide léger suffit. Mulch feuilles mortes excellent (acidification naturelle).'
      },
      specificites: {
        varietes: '🌈 1000+ VARIÉTÉS : feuillage vert, pourpre, panaché, lacinié (finement découpé). Naines (1-2m) à grandes (6-8m).',
        feuillage: '🍁 Feuillage EXCEPTIONNEL : finement découpé, palmé, élégant. Variétés pourpres très recherchées.',
        couleurs: '🎨 Couleurs automnales SPECTACULAIRES : rouge écarlate, orange, pourpre (septembre-novembre)',
        taille: 'Petit arbre (4-8m) = IDÉAL petits jardins urbains et patios',
        bac: '✅ EXCELLENT en pot/bac (terrasses, balcons) - Variétés naines parfaites',
        bonsai: 'Espèce privilégiée bonsaï (repousse, ramification fine)',
        ombre: 'Tolère mi-ombre (rare chez arbres ornementaux couleurs)',
        delicat: '⚠️ Arbre DÉLICAT exigeant (eau, ombre, vent, sol) - Pas débutants',
        prestige: 'Arbre de PRESTIGE et collection - Beauté exceptionnelle',
        japonais: '🇯🇵 Symbole jardins japonais - Tradition Momijigari (contemplation automne)'
      },
      sujetsForums: [
        'Feuilles brûlées bords bruns ? Soleil direct + sécheresse (déplacer ou ombrager)',
        'Quel emplacement ? Mi-ombre, abrité vents, sol frais constant',
        'Culture en pot possible ? OUI excellent (variétés naines)',
        'Sol calcaire Bessancourt - OK ? Éviter si pH > 7.5 (chlorose). Terre bruyère en fosse.',
        'Arrosage fréquence ? 2-3x/semaine été + paillage épais',
        'Quelle variété choisir ? Pourpre : Atropurpureum, Bloodgood. Vert : Osakazuki, Sango-kaku',
        'Croissance lente normal ? OUI (10-25cm/an) - Patience récompensée !',
        'Protection hiver nécessaire ? OUI 3-5 ans + voile si < -12°C',
        'Peut-on tailler ? Quasi JAMAIS - Port naturel = beauté',
        'Feuilles tombent été - pourquoi ? Stress hydrique OU sol trop sec',
        'Variété naine pour petit jardin ? Dissectum (1.5m), Shaina (2m)',
        'Momijigari - c\'est quoi ? Tradition japonaise contemplation érables automne'
      ]
    }
  },
  {
    id: 'lagerstroemia-indica-haute-tige',
    name: 'Lilas des Indes haute tige',
    nomScientifique: 'Lagerstroemia indica',
    famille: 'Lythraceae',
    type: 'arbre',
    tailleMaturite: '5-7 m',
    envergure: '3-5 m',
    floraison: {
      periode: 'Juillet à Octobre',
      description: 'Floraison spectaculaire et prolongée en panicules denses',
      couleur: 'Rose, rouge, blanc ou mauve selon variété',
      parfum: 'Léger et agréable'
    },
    fructification: {
      periode: 'Automne',
      description: 'Capsules décoratives persistantes en hiver',
      couleur: 'Brun'
    },
    feuillage: {
      type: 'Caduc',
      couleurAutomne: 'Orange vif à rouge pourpre',
      description: 'Feuilles ovales, vert bronze au printemps puis vert foncé. Très belles couleurs automnales.'
    },
    ecorce: {
      description: 'Écorce lisse et décorative qui s\'exfolie, révélant des teintes roses, grises et crème',
      interet: 'Décoratif toute l\'année, même en hiver'
    },
    plantation: {
      periode: 'Mars à Mai (après gelées)',
      conseil: 'Préférer le printemps. Demande chaleur. Planter en situation ensoleillée et abritée. Praliner les racines.'
    },
    sol: {
      type: 'Profond, riche, bien drainé, légèrement acide',
      ph: '6.0-7.0',
      humidite: 'Frais en été, bien drainé en hiver'
    },
    exposition: 'Plein soleil (6h minimum) - ESSENTIEL pour floraison',
    arrosage: 'Régulier les 2 premières années. Arrosage hebdomadaire en été une fois installé. Supporte sécheresse courte.',
    rusticite: '-15°C (rustique en Île-de-France)',
    croissance: 'Moyenne (30-40 cm/an)',
    taille: {
      periode: 'Février-Mars (hors gel, avant débourrement)',
      frequence: 'Annuelle recommandée',
      methode: 'Taille courte en février stimule floraison abondante. Supprimer bois mort et branches croisées. Raccourcir branches de l\'année précédente de 1/3.',
      conseil: 'Fleurit sur bois de l\'année : la taille de fin d\'hiver favorise une floraison spectaculaire. Plus la taille est courte, plus la floraison est généreuse.'
    },
    calendrierAnnuel: [
      { mois: 'Janvier-Février', action: 'Repos - Taille possible en fin février hors gel', icone: '❄️' },
      { mois: 'Mars', action: 'Débourrement tardif - Fertilisation', icone: '🌱' },
      { mois: 'Avril-Mai', action: 'Feuillage bronze puis vert', icone: '🍃' },
      { mois: 'Juin', action: 'Croissance active - Arrosage', icone: '💧' },
      { mois: 'Juillet-Août', action: 'FLORAISON spectaculaire continue', icone: '🌸' },
      { mois: 'Septembre-Octobre', action: 'Fin de floraison - Couleurs automnales', icone: '🍂' },
      { mois: 'Novembre-Décembre', action: 'Chute feuilles - Écorce décorative visible', icone: '🌿' }
    ],
    maladies: [
      'Oïdium (blanc sur feuilles)',
      'Pucerons (printemps)',
      'Chlorose si sol trop calcaire'
    ],
    biodiversite: {
      faune: 'Très mellifère, attire papillons et abeilles pendant tout l\'été',
      insectes: 'Floraison longue = ressource prolongée pour pollinisateurs',
      oiseaux: 'Abri apprécié, branches multiples'
    },
    toxicite: {
      niveau: 'Non toxique',
      danger: 'Aucun',
      prevention: 'Sans danger pour enfants et animaux'
    },
    utilisations: [
      'Arbre d\'ornement isolé',
      'Alignement petites rues',
      'Près terrasses (floraison estivale)',
      'Jardins de ville',
      'Pot sur terrasse (variétés naines)'
    ],
    anecdote: 'Originaire de Chine, le Lilas des Indes est aussi appelé "arbre aux cent jours" car sa floraison dure exceptionnellement longtemps (juillet à octobre). Son écorce lisse et colorée le rend décoratif même en hiver !',

    // ========== RÉGLEMENTATION ==========
    reglementation: {
      systemeRacinaire: {
        type: 'Pivotant et traçant',
        profondeur: '1-1.5 m',
        etalement: '4-6 m',
        agressivite: 'Faible à modérée',
        description: 'Racines peu agressives, respecte fondations et canalisations si bien distant'
      },
      risques: [
        'Racines peuvent soulever pavages si < 2m',
        'Débourrement tardif (fin avril) - normal',
        'Sensible oïdium (blanc) si air stagnant'
      ],
      distancesLegales: {
        voisinage: {
          regle: 'Code Civil Article 671',
          distance: '2 m minimum de la limite de propriété',
          justification: 'Hauteur > 2 m à maturité (5-7 m)',
          sanction: 'Le voisin peut exiger l\'arrachage ou la taille à 2m de haut'
        },
        espacesPublics: {
          distance: '2-3 m',
          regle: 'PLU local'
        },
        entreArbres: {
          distance: '4-5 m',
          justification: 'Développement harmonieux des couronnes'
        },
        infrastructures: {
          fondations: '3-4 m minimum',
          canalisations: '3 m minimum',
          fossesSeptiques: '5 m minimum',
          terrasse: '2.5 m minimum',
          piscine: '3 m minimum'
        }
      },
      conseils: 'Excellent pour petits jardins. Floraison estivale exceptionnelle. Prévoir soleil maximum. Tailler court en hiver pour floraison abondante.'
    },

    // ========== INFORMATIONS COMPLÉMENTAIRES ==========
    informationsComplementaires: {
      pollinisation: {
        type: 'Hermaphrodite autofertile',
        besoin: 'Aucun',
        production: 'Capsules décoratives',
        conseil: 'Planté pour floraison exceptionnelle et écorce'
      },
      dangersEtPrecautions: {
        taille: {
          danger: 'FAIBLE',
          risques: ['Perte floraison si taille tardive'],
          periodeDanger: '⛔ 16 mars - 15 août (loi nidification)',
          periodeSecuritaire: '✅ Février-début mars (hors gel)',
          protection: 'Pas nécessaire',
          conseil: '⚠️ IMPORTANT : Tailler en fin d\'hiver (février-mars) pour floraison maximale. Plus vous taillez court, plus il fleurit !'
        },
        reglementationTaille: {
          loi: '⚠️ AGRICULTEURS : Interdiction légale (16 mars - 15 août). PARTICULIERS : Recommandation forte.',
          raison: 'Protection oiseaux nicheurs',
          solution: 'Tailler impérativement en février-mars',
          sanction: 'Agriculteurs : Réduction aides PAC. Particuliers : Responsabilité si destruction nids.'
        }
      },
      allergies: {
        pollen: 'Faible',
        contact: 'Aucun'
      },
      animauxDomestiques: {
        chiens: '✅ Non toxique',
        chats: '✅ Non toxique',
        chevaux: '✅ Non toxique'
      },
      protectionHivernale: {
        adulte: 'Rustique -15°C (Île-de-France)',
        jeunesPlants: ['Paillage 2 premières années', 'Voile si < -12°C'],
        gelPrintanier: 'Débourrement tardif (fin avril) - peu concerné'
      },
      fertilisation: {
        besoins: 'Moyens',
        periode: 'Mars-Avril',
        type: 'Compost + engrais arbres fleurs',
        quantite: '3-5 kg compost',
        frequence: 'Annuelle',
        conseil: 'Apport potasse (K) favorise floraison'
      },
      sujetsForums: [
        'Floraison faible pourquoi ? → Manque de soleil OU taille tardive',
        'Débourrement très tardif normal ? → OUI (fin avril-mai)',
        'Oïdium blanc sur feuilles → Traiter au soufre, aérer',
        'Feuilles brûlées été → Arrosage insuffisant',
        'Quelle variété choisir ? Rouge : \'Dynamite\', Rose : \'Tuscarora\', Blanc : \'Natchez\''
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
    images: [
      'noisetier/noisetier_vue_generale_01.jpg',
      'noisetier/noisetier_vue_generale_02.jpg',
      'noisetier/noisetier_fruits_01.jpg',
      'noisetier/noisetier_fruits_02.jpg',
      'noisetier/noisetier_feuilles_01.jpg',
      'noisetier/noisetier_tronc_01.jpg',
    ],
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
          loi: '⚠️ AGRICULTEURS : Interdiction légale (16 mars - 15 août). PARTICULIERS : Recommandation forte.',
          raison: 'Protection nidification oiseaux (Code Rural + PAC)',
          sanction: 'Agriculteurs : Amende PAC. Particuliers : Amende si destruction nids.',
          application: 'Agriculteurs (Loi) / Particuliers (Civisme)'
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
    images: [
      'fusain/fusain_vue_generale_01.jpg',
      'fusain/fusain_fleurs_01.jpg',
      'fusain/fusain_fleurs_02.jpg',
      'fusain/fusain_fleurs_03.jpg',
      'fusain/fusain_fleurs_04.jpg',
      'fusain/fusain_fleurs_05.jpg',
      'fusain/fusain_fleurs_06.jpg',
      'fusain/fusain_bourgeons_01.jpg',
    ],
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
          loi: '⚠️ AGRICULTEURS : Interdiction légale (16 mars - 15 août). PARTICULIERS : Recommandation forte.',
          raison: 'Nidification oiseaux',
          sanction: 'Agriculteurs : Amende PAC. Particuliers : Risque verbalisation si destruction nids.',
          application: 'Agriculteurs (Loi) / Particuliers (Civisme)'
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
    images: [
      'troene/troene_vue_generale_01.jpg',
      'troene/troene_fleurs_01.jpg',
      'troene/troene_fleurs_02.jpg',
      'troene/troene_fleurs_03.jpg',
      'troene/troene_fruits_01.jpg',
      'troene/troene_feuilles_01.jpg',
    ],
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
          loi: '⚠️ AGRICULTEURS : Interdiction légale (16 mars - 15 août). PARTICULIERS : Recommandation forte.',
          raison: 'Nidification (troène = site privilégié oiseaux)',
          sanction: 'Agriculteurs : Amende PAC. Particuliers : Responsabilité si destruction nids.',
          application: 'Agriculteurs (Loi) / Particuliers (Civisme)',
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
    images: [
      'osmanthe/osmanthe_vue_generale_01.jpg',
      'osmanthe/osmanthe_vue_generale_02.jpg',
      'osmanthe/osmanthe_fleurs_01.jpg',
      'osmanthe/osmanthe_fleurs_02.jpg',
      'osmanthe/osmanthe_fleurs_03.jpg',
      'osmanthe/osmanthe_fleurs_04.jpg',
      'osmanthe/osmanthe_feuilles_01.jpg',
    ],
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
          loi: '⚠️ AGRICULTEURS : Interdiction légale (16 mars - 15 août). PARTICULIERS : Recommandation forte.',
          raison: 'Protection oiseaux',
          sanction: 'Agriculteurs : Amende PAC. Particuliers : Responsabilité si destruction nids.',
          application: 'Agriculteurs (Loi) / Particuliers (Civisme)'
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
    images: [
      'cornouiller/cornouiller_vue_generale_01.jpg',
      'cornouiller/cornouiller_fruits_01.jpg',
      'cornouiller/cornouiller_bourgeons_01.jpg',
      'cornouiller/cornouiller_tronc_01.jpg',
      'cornouiller/cornouiller_tronc_02.jpg',
    ],
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
          loi: '⚠️ AGRICULTEURS : Interdiction légale (16 mars - 15 août). PARTICULIERS : Recommandation forte.',
          raison: 'Site de nidification important',
          sanction: 'Agriculteurs : Amende PAC. Particuliers : Responsabilité si destruction nids.',
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
    images: [
      'seringat/seringat_vue_generale_01.jpg',
      'seringat/seringat_vue_generale_02.jpg',
      'seringat/seringat_vue_generale_03.jpg',
      'seringat/seringat_fleurs_01.jpg',
      'seringat/seringat_fleurs_02.jpg',
    ],
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
          loi: '⚠️ AGRICULTEURS : Interdiction légale (16 mars - 15 août). PARTICULIERS : Recommandation forte.',
          raison: 'Période inclut la floraison (mai-juin)',
          conflit: '⚠️ Conflit : La taille optimale (juin-juillet) tombe en période sensible.',
          solution: 'Vérifier ABSENCE de nids avant taille. Préférer taille légère.',
          sanction: 'Amende si destruction de nids prouvée'
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
const plantesData = [...arbresData, ...arbustesData];

// Validation des données au chargement
const validatePlantsData = (data) => {
  try {
    // Valider chaque plante
    const validatedPlants = data.map(plant => {
      const validatedPlant = plantSchema.validateSync(plant);
      return validatedPlant;
    });

    console.log('✅ Données de plantes validées:', validatedPlants.length);
    return validatedPlants;
  } catch (error) {
    console.error('❌ Erreur de validation des données de plantes:', error.message);
    console.warn('⚠️ Utilisation des données non validées - peut causer des erreurs');
    return data; // Fallback sur les données originales
  }
};

// Exporter les données validées
export default validatePlantsData(plantesData);
