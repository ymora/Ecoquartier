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
    anecdote: '\'Kanzan\' signifie "montagne de fleurs" en japonais. C\'est l\'un des cerisiers japonais les plus plantés au monde pour sa floraison spectaculaire. Au Japon, la contemplation des cerisiers en fleurs (Hanami) est une tradition ancestrale célébrée nationalement.'
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
    anecdote: '\'Accolade\' est un hybride anglais créé dans les années 1950. Son nom évoque l\'accueil chaleureux du printemps. C\'est un des cerisiers les plus faciles à cultiver et l\'un des premiers à fleurir, annonçant le réveil de la nature.'
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
    anecdote: '\'Sunset Boulevard\' est une variété récente (années 2000) sélectionnée pour sa couleur de fleurs unique rose saumon/corail et son spectacle automnal flamboyant. Son nom évoque les couchers de soleil de Californie. C\'est un des rares cerisiers offrant 2 spectacles : floraison printanière + couleurs automnales exceptionnelles.'
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
    anecdote: 'Le noisetier est l\'un des premiers arbustes à fleurir, dès janvier. Ses chatons produisent un pollen abondant transporté par le vent.'
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
    anecdote: 'Son nom vient de l\'usage traditionnel de son bois très dur pour fabriquer les fusains utilisés par les artistes. Ses fruits roses éclatants sont un régal pour les yeux en automne !'
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
    anecdote: 'Le troène est l\'un des arbustes de haie les plus utilisés en Europe. Son nom vient du latin "ligare" (lier) car ses branches flexibles servaient à faire des liens. Champion de la résistance : pollution, sécheresse, taille sévère... rien ne l\'arrête !'
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
    anecdote: 'L\'osmanthe de Burkwood est un hybride entre O. delavayi et O. decorus. Son parfum envoûtant au printemps en fait l\'un des arbustes les plus appréciés des jardins. En Chine, les fleurs d\'osmanthe parfument le thé et les pâtisseries !'
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
    anecdote: 'Son nom "sanguin" vient de la couleur rouge sang de ses jeunes rameaux en hiver. En hiver, après la taille, les jeunes pousses forment un spectacle flamboyant ! Autrefois, on utilisait ses rameaux flexibles pour la vannerie.'
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
    anecdote: 'Appelé "Jasmin des poètes" pour son parfum envoûtant rappelant le jasmin. Son nom "seringat" vient du grec "syrinx" (flûte) car ses rameaux creux servaient à fabriquer des instruments. C\'est l\'un des arbustes les plus parfumés du jardin !'
  }
];

// Ajouter le type 'arbuste' à tous les arbustes
arbustesData.forEach(arbuste => {
  arbuste.type = 'arbuste';
});

// Données combinées avec distinction type
export const plantesData = [...arbresData, ...arbustesData];

export default plantesData;

