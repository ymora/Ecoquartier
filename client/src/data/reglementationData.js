/**
 * Données sur le système racinaire, réglementation et distances de plantation
 * Basé sur le Code Civil français (Articles 671-673) et connaissances botaniques
 */

export const reglementationData = {
  // ARBRES
  'prunus-kanzan': {
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

  'prunus-accolade': {
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

  'prunus-sunset-boulevard': {
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

  // ARBUSTES
  'noisetier': {
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

  'fusain': {
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

  'troene': {
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

  'osmanthe': {
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

  'cornouiller': {
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

  'seringat': {
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
  }
};

// Règles générales du Code Civil
export const reglesGenerales = {
  codeCivil: {
    article671: {
      titre: 'Distance des plantations près des limites de propriété',
      texte: 'Il n\'est permis d\'avoir des arbres, arbrisseaux et arbustes près de la limite de la propriété voisine qu\'à la distance prescrite par les règlements particuliers actuellement existants, ou par des usages constants et reconnus et, à défaut de règlements et usages, qu\'à la distance de deux mètres de la ligne séparative des deux héritages pour les plantations dont la hauteur dépasse deux mètres, et à la distance d\'un demi-mètre pour les autres plantations.',
      resume: {
        hauteur_sup_2m: '2 m de la limite',
        hauteur_inf_2m: '0.5 m de la limite'
      }
    },
    article672: {
      titre: 'Droit du voisin',
      texte: 'Le voisin peut exiger que les arbres, arbrisseaux et arbustes plantés à une distance moindre que la distance légale soient arrachés ou réduits à la hauteur de 2 mètres.',
      sanctions: [
        'Arrachage complet de la plante',
        'OU taille à maximum 2 mètres de hauteur',
        'À la charge du propriétaire fautif'
      ]
    },
    article673: {
      titre: 'Branches et racines dépassant',
      texte: 'Celui sur la propriété duquel avancent les branches des arbres, arbustes et arbrisseaux du voisin peut contraindre celui-ci à les couper. Les fruits tombés naturellement de ces branches lui appartiennent. Si ce sont les racines, ronces ou brindilles qui avancent sur son héritage, il a le droit de les couper lui-même à la limite de la ligne séparative.',
      droits: {
        branches: 'Le voisin peut exiger la coupe',
        fruits: 'Appartiennent au propriétaire du terrain où ils tombent',
        racines: 'Le voisin peut les couper lui-même à la limite'
      }
    }
  },
  PLU: {
    definition: 'Plan Local d\'Urbanisme',
    role: 'Peut imposer des distances supérieures au Code Civil',
    consultation: 'Mairie de Bessancourt ou site internet de la ville',
    specificites: [
      'Distances accrues près espaces publics (voirie, trottoirs)',
      'Restrictions dans lotissements ou zones protégées',
      'Essence interdites ou obligatoires selon zones'
    ]
  },
  reseaux: {
    electricite: 'Élagage obligatoire si contact avec lignes',
    gaz: 'Distance minimale 1-2m selon diamètre canalisation',
    eau: 'Distance minimale 1-2m (racines cherchent l\'eau)',
    assainissement: 'Distance minimale 3m (risque colmatage racines)',
    telecommunications: 'Distance minimale 0.5-1m'
  },
  sanctions: {
    nonRespectDistances: [
      'Mise en demeure du voisin',
      'Action en justice possible',
      'Arrachage ou taille obligatoire',
      'Dommages et intérêts si préjudice',
      'Frais à la charge du propriétaire'
    ],
    degatsInfrastructures: [
      'Responsabilité civile du propriétaire',
      'Réparation des dégâts à sa charge',
      'Assurance habitation peut refuser',
      'Coûts : 5 000€ - 50 000€ selon dégâts'
    ],
    prescription: 'Les arbres plantés depuis > 30 ans peuvent acquérir prescription (cas complexe, consulter avocat)'
  },
  bonnesPratiques: [
    'Toujours consulter le PLU avant plantation',
    'Mesurer distance DEPUIS le tronc (pas les branches)',
    'Anticiper la taille adulte (pas la taille actuelle)',
    'Installer barrière anti-racines si < distance idéale',
    'Documenter (photos, dates) la plantation',
    'Informer le voisinage (courtoisie)',
    'Tailler régulièrement pour maintenir < 2m si proche limite',
    'Souscrire assurance responsabilité civile adaptée'
  ]
};

export default { reglementationData, reglesGenerales };

