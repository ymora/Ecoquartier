/**
 * Calculs solaires simplifiés pour les ombres réalistes
 * Basé sur la latitude de la France (49°N)
 */

/**
 * Calculer la position du soleil de manière simplifiée
 * @param {number} heure - Heure de la journée (0-24)
 * @param {string} saison - Saison ('hiver', 'printemps', 'ete', 'automne')
 * @returns {object} Position du soleil {azimuth, elevation}
 */
export function calculerSoleilSimple(heure, saison) {
  // Convertir l'heure en angle (6h-18h -> 0-180°)
  const heureNormalized = Math.max(0, Math.min(1, (heure - 6) / 12)); // 6h-18h -> 0-1
  const angleHeure = heureNormalized * 180; // 0-180°
  
  // Azimut : 0° = Est (lever), 90° = Sud (midi), 180° = Ouest (coucher)
  // En France, le soleil se lève à l'Est et se couche à l'Ouest
  const azimuth = angleHeure; // 0° = Est, 90° = Sud, 180° = Ouest
  
  // Élévation selon la saison (hauteur maximale à midi)
  const elevationsMax = {
    hiver: 18,    // Hiver : soleil bas
    printemps: 41, // Printemps : soleil moyen
    ete: 64,      // Été : soleil haut
    automne: 41   // Automne : soleil moyen
  };
  
  const elevationMax = elevationsMax[saison] || 41;
  
  // Élévation selon l'heure (courbe sinusoïdale)
  const elevationFactor = Math.sin(heureNormalized * Math.PI);
  const elevation = elevationMax * elevationFactor;
  
  return {
    azimuth: azimuth,
    elevation: Math.max(0, elevation) // Le soleil ne peut pas être sous l'horizon
  };
}

/**
 * Convertir en coordonnées 3D pour Three.js
 * @param {number} azimuth - Azimut en degrés
 * @param {number} elevation - Élévation en degrés
 * @param {number} distance - Distance du soleil
 * @returns {object} Position 3D {x, y, z}
 */
export function soleil3D(azimuth, elevation, distance) {
  const azimuthRad = azimuth * Math.PI / 180;
  const elevationRad = elevation * Math.PI / 180;
  
  return {
    x: distance * Math.cos(elevationRad) * Math.sin(azimuthRad),
    y: distance * Math.sin(elevationRad),
    z: distance * Math.cos(elevationRad) * Math.cos(azimuthRad)
  };
}

/**
 * Convertir en coordonnées 2D pour le canvas
 * @param {number} azimuth - Azimut en degrés
 * @param {number} distance - Distance en pixels
 * @returns {object} Position 2D {x, y}
 */
export function soleil2D(azimuth, distance) {
  const azimuthRad = azimuth * Math.PI / 180;
  
  return {
    x: distance * Math.sin(azimuthRad),
    y: -distance * Math.cos(azimuthRad) // Négatif car Y va vers le bas en 2D
  };
}
