/**
 * croissance.js
 * Calculs de croissance des arbres selon l'année
 */

/**
 * Calculer la taille d'un arbre selon l'année de projection
 */
export const calculerTailleSelonAnnee = (arbre, annee, echelle = 30) => {
  // Tailles à la plantation (jeune plant) - Valeurs configurables
  const hauteurPlantation = 2.0;    // 2m à la plantation (jeune plant standard)
  const envergurePlantation = 0.8;  // 0.8m couronne initiale
  const diametreTroncPlantation = 0.05; // 5cm de diamètre
  
  // Extraire taille à maturité
  const envergureStr = arbre.envergure || '5';
  const envergureMax = parseFloat(envergureStr.split('-').pop());
  const hauteurStr = arbre.tailleMaturite || '5';
  const hauteurMax = parseFloat(hauteurStr.split('-').pop().replace('m', '').trim());
  
  // Diamètre tronc adulte (estimation RÉALISTE basée sur hauteur et type)
  let diametreTroncMax;
  if (hauteurMax > 10) {
    // Grands arbres (10-20m) : 30-60cm de diamètre
    diametreTroncMax = Math.min(0.6, hauteurMax * 0.04);
  } else if (hauteurMax > 6) {
    // Arbres moyens (6-10m) : 20-40cm de diamètre
    diametreTroncMax = Math.min(0.4, hauteurMax * 0.035);
  } else if (hauteurMax > 3) {
    // Grands arbustes (3-6m) : 10-20cm de diamètre
    diametreTroncMax = Math.min(0.2, hauteurMax * 0.03);
  } else {
    // Arbustes (< 3m) : 5-15cm de diamètre
    diametreTroncMax = Math.min(0.15, hauteurMax * 0.04);
  }
  
  // Extraire vitesse de croissance
  const croissanceStr = arbre.croissance || 'Moyenne (30-40 cm/an)';
  
  // Détecter le type de croissance
  let typeCroissance = 'moyenne';
  let vitesseCroissance = 30; // Par défaut
  let coefficientEnvergure = 1.0;
  
  if (croissanceStr.toLowerCase().includes('rapide') || croissanceStr.toLowerCase().includes('vigoureuse')) {
    typeCroissance = 'rapide';
    vitesseCroissance = 50;
    coefficientEnvergure = 1.2;
  } else if (croissanceStr.toLowerCase().includes('lente') || croissanceStr.toLowerCase().includes('lent')) {
    typeCroissance = 'lente';
    vitesseCroissance = 15;
    coefficientEnvergure = 0.8;
  } else {
    typeCroissance = 'moyenne';
    vitesseCroissance = 30;
    coefficientEnvergure = 1.0;
  }
  
  // Années pour atteindre maturité
  const anneesMaturite = Math.max(5, Math.min(30, (hauteurMax - hauteurPlantation) / (vitesseCroissance / 100))) || 20;
  const anneesMaturiteEnvergure = anneesMaturite * coefficientEnvergure;
  
  // Calculer les pourcentages de croissance
  let pourcentageHauteur = 0;
  let pourcentageEnvergure = 0;
  
  if (annee >= anneesMaturite) {
    pourcentageHauteur = 1.0;
  } else if (annee > 0) {
    pourcentageHauteur = annee / anneesMaturite;
  }
  
  if (annee >= anneesMaturiteEnvergure) {
    pourcentageEnvergure = 1.0;
  } else if (annee > 0) {
    pourcentageEnvergure = annee / anneesMaturiteEnvergure;
    if (pourcentageEnvergure > 1.0) pourcentageEnvergure = 1.0;
  }
  
  const pourcentageTronc = pourcentageHauteur > 0 ? Math.sqrt(pourcentageHauteur) : 0;
  
  // Taille actuelle selon l'année
  const hauteurActuelle = hauteurPlantation + (hauteurMax - hauteurPlantation) * pourcentageHauteur;
  const envergureActuelle = envergurePlantation + (envergureMax - envergurePlantation) * pourcentageEnvergure;
  const diametreTroncActuel = diametreTroncPlantation + (diametreTroncMax - diametreTroncPlantation) * pourcentageTronc;
  
  // Conversion en pixels
  const largeur = envergureActuelle * echelle;
  const hauteur = hauteurActuelle * echelle;
  
  return { 
    largeur, 
    hauteur, 
    pourcentage: pourcentageHauteur,
    pourcentageHauteur,
    pourcentageEnvergure,
    pourcentageTronc,
    envergureMax, 
    hauteurMax,
    envergureActuelle,
    hauteurActuelle,
    diametreTroncActuel,
    anneesMaturite: Math.round(anneesMaturite),
    anneesMaturiteEnvergure: Math.round(anneesMaturiteEnvergure),
    typeCroissance,
    vitesseCroissance
  };
};

