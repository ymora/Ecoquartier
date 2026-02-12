export const ecoConseilsData = {
    sol: {
        title: "Le Sol Vivant",
        icon: "🌱",
        image: "/assets/images/backgrounds/nature_soft.png",
        intro: "Le sol n'est pas un simple support inerte, c'est un écosystème complexe et vivant. Un sol en bonne santé est la clé d'un jardin résilient et productif.",
        sections: [
            {
                id: "types_sol",
                title: "Comprendre son Sol",
                content: [
                    { type: "Argileux", description: "Lourd, colle aux bottes, retient l'eau. Riche mais difficile à travailler.", action: "Aérer avec compost et paillage." },
                    { type: "Sableux", description: "Léger, granuleux, ne retient pas l'eau. Se réchauffe vite.", action: "Enrichir massivement en humus." },
                    { type: "Calcaire", description: "Caillouteux, clair, sèche vite. Bloque certains nutriments (fer).", action: "Apport de matière organique acide (compost, feuilles)." },
                    { type: "Franc", description: "L'idéal : équilibre parfait argile/sable/humus.", action: "À préserver précieusement !" }
                ]
            },
            {
                id: "vers_de_terre",
                title: "Les Vers de Terre : Ingénieurs du Sol",
                description: "Ils sont invisibles mais essentiels. Ils labourent, aèrent et fertilisent le sol gratuitement.",
                roles: [
                    "Aération : Leurs galeries permettent à l'eau et l'air de circuler jusqu'aux racines.",
                    "Fertilisation : Leurs déjections (turricules) sont 5x plus riches en azote que la terre environnante.",
                    "Mélange : Ils remontent les minéraux et enfouissent la matière organique (complexe argilo-humique)."
                ],
                conseil: "🚫 Interdiction absolue du motoculteur qui tue les vers. Préférer la Grelinette."
            },
            {
                id: "amelioration",
                title: "Améliorer sans détruire",
                techniques: [
                    { name: "Paillage (Mulch)", description: "Couvrir le sol en permanence (feuilles, paille, broyat). Protège du soleil, nourrit la vie, retient l'eau." },
                    { name: "Non-Travail du Sol", description: "Ne jamais retourner la terre (labour). Cela détruit les mycorhizes et tue la faune. Utiliser une Grelinette." },
                    { name: "Apports Organiques", description: "Compost mûr et fumier à l'automne. Le sol digère, les plantes se nourrissent." },
                    { name: "Engrais Verts", description: "Semer trèfle, moutarde ou phacélie. Protège le sol et l'enrichit en azote une fois fauché." },
                    { name: "BRF (Bois Raméal Fragmenté)", description: "Broyat de jeunes branches. Apporte de la lignine qui stimule les champignons bénéfiques." }
                ]
            },
            {
                id: "erreurs",
                title: "🚫 Les 5 Erreurs Fatales",
                description: "Selon les experts du sol vivant :",
                list: [
                    "Travailler le sol en profondeur (bouleverser les couches)",
                    "Laisser la terre à nu (le soleil 'brûle' l'humus)",
                    "Piétiner les zones de culture (asphyxie des racines)",
                    "Utiliser des produits chimiques (tue la vie du sol)",
                    "Forcer la fertilité avec des engrais solubles"
                ]
            }
        ]
    },
    gazon: {
        title: "Pelouses Écologiques",
        icon: "🦗",
        intro: "Le gazon anglais 'green de golf' est une aberration écologique (eau, engrais, tonte). Optez pour des alternatives durables et vivantes.",
        alternatives: [
            {
                name: "Le Micro-Trèfle",
                scientific: "Trifolium repens 'Pipolina'",
                image: "/assets/images/eco/clover.png",
                benefits: [
                    "Auto-suffisant en azote (capte l'azote de l'air)",
                    "Reste vert même en été (racines profondes)",
                    "Pas d'arrosage une fois installé",
                    "Tonte réduite (pousse lente)"
                ],
                usage: "Idéal pour remplacer ou densifier une pelouse existante. S'utilise pur ou en mélange."
            },
            {
                name: "La Prairie Fleurie",
                image: "/assets/images/backgrounds/meadow_lush.png",
                benefits: [
                    "Explosion de biodiversité (papillons, abeilles)",
                    "Entretien quasi-nul (1 fauche par an)",
                    "Esthétique champêtre et colorée",
                    "Gîte pour la faune auxiliaire"
                ],
                usage: "Pour les zones du jardin où l'on ne marche pas souvent. Fond du jardin, talus."
            },
            {
                name: "Gestion Différenciée",
                description: "Le compromis idéal : tondre des chemins de circulation et laisser le reste en prairie libre.",
                action: "Dessinez des courbes à la tondeuse, c'est très esthétique !"
            }
        ],
        entretien_bio: {
            title: "Entretien 100% Naturel",
            steps: [
                "Tonte haute (6-8 cm) : Garde l'humidité et empêche les 'mauvaises' herbes.",
                "Mulching : Laisser l'herbe coupée sur place (engrais naturel).",
                "Zéro phyto : Les pissenlits sont la première nourriture des abeilles, laissez-les !",
                "Scarification douce : Au printemps pour aérer si besoin."
            ]
        }
    }
};
