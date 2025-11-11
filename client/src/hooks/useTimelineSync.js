import { useEffect } from 'react';
import logger from '../utils/logger';

/**
 * Hook pour synchroniser la timeline avec les arbres
 * Redimensionne les arbres selon l'année de projection
 */
export const useTimelineSync = ({
  fabricCanvasRef,
  anneeProjection,
  calculerTailleSelonAnnee,
  validerPositionArbre
}) => {
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const arbresPlantes = canvas.getObjects().filter(obj => obj.customType === 'arbre-a-planter');
    
    if (arbresPlantes.length === 0) {
      // Pas d'arbres à redimensionner - c'est normal si l'utilisateur n'en a pas ajouté
      // logger.debug('Timeline', 'Aucun arbre à redimensionner', { annee: anneeProjection });
      return;
    }
    
    // Debug désactivé pour performance (changement fréquent de timeline)
    // logger.debug('Timeline', `Redimensionnement ${arbresPlantes.length} arbres → ${anneeProjection} ans`);
    
    arbresPlantes.forEach((arbreGroup, idx) => {
      try {
        if (!arbreGroup || !arbreGroup.arbreData) {
          logger.error('Timeline', `arbreGroup ${idx} est null/undefined`);
          return;
        }
        
        const arbre = arbreGroup.arbreData;
        
        if (!arbreGroup._objects || !Array.isArray(arbreGroup._objects)) {
          logger.error('Timeline', `${arbre?.name || 'Arbre'} n'a pas de _objects`);
          return;
        }
        
        const nbElements = arbreGroup._objects.length;
        
        // ✅ GESTION FLEXIBLE : Arbres avec 2 éléments (cercle + label) OU 4 éléments (ellipse + emoji + nomLabel + dimensionsLabel)
        if (nbElements < 2) {
          logger.error('Timeline', `${arbre.name} groupe invalide (${nbElements} éléments)`);
          return;
        }
        
        const tailles = calculerTailleSelonAnnee(arbre, anneeProjection);
        
        if (!tailles || !tailles.largeur || !tailles.hauteur) {
          logger.error('Timeline', `Tailles invalides pour ${arbre.name}`, { tailles });
          return;
        }
        
        // ✅ Adapter selon le nombre d'éléments dans le groupe
        if (nbElements === 2) {
          // Structure simplifiée : [0: cercle, 1: label]
          const cercle = arbreGroup._objects[0];
          const label = arbreGroup._objects[1];
          
          if (cercle && (cercle.type === 'circle' || cercle.type === 'ellipse')) {
            if (cercle.type === 'circle') {
              // Convertir cercle en ellipse pour la croissance
              const newRadius = Math.max(tailles.largeur, tailles.hauteur) / 2;
              cercle.set({ radius: newRadius });
            } else {
              cercle.set({
                rx: tailles.largeur / 2,
                ry: tailles.hauteur / 2
              });
            }
          }
          
          // Mettre à jour le label avec les informations de croissance
          if (label && label.type === 'text') {
            const iconeType = tailles.typeCroissance === 'rapide' ? '⚡' : tailles.typeCroissance === 'lente' ? '🐌' : '🌿';
            let texte = arbre.name;
            
            if (anneeProjection === 0) {
              texte += `\n${tailles.envergureActuelle.toFixed(1)}×${tailles.hauteurActuelle.toFixed(1)}m`;
            } else if (anneeProjection >= tailles.anneesMaturite) {
              texte += `\n${tailles.envergureMax}×${tailles.hauteurMax}m (maturité)`;
            } else {
              texte += `\n${tailles.envergureActuelle.toFixed(1)}×${tailles.hauteurActuelle.toFixed(1)}m (${anneeProjection}ans ${iconeType})`;
            }
            
            label.set({ text: texte });
          }
          
        } else if (nbElements >= 4) {
          // Structure complète : [0: ellipse, 1: emoji, 2: nomLabel, 3: dimensionsLabel]
          const ellipse = arbreGroup._objects[0];
          const emoji = arbreGroup._objects[1];
          const nomLabel = arbreGroup._objects[2];
          const dimensionsLabel = arbreGroup._objects[3];
          
          if (ellipse && ellipse.type === 'ellipse') {
            ellipse.set({
              rx: tailles.largeur / 2,
              ry: tailles.hauteur / 2
            });
          }
          
          if (emoji) {
            const newFontSize = Math.min(tailles.largeur, tailles.hauteur) * 0.3;
            emoji.set({ fontSize: newFontSize });
          }
          
          if (dimensionsLabel) {
            let texte;
            const iconeType = tailles.typeCroissance === 'rapide' ? '⚡' : tailles.typeCroissance === 'lente' ? '🐌' : '🌿';
            
            if (anneeProjection === 0) {
              texte = `Plantation: ${tailles.envergureActuelle.toFixed(1)}m × ${tailles.hauteurActuelle.toFixed(1)}m\nTronc: ⌀${(tailles.diametreTroncActuel * 100).toFixed(0)}cm ${iconeType}`;
            } else if (anneeProjection >= tailles.anneesMaturite) {
              texte = `Maturité (${tailles.anneesMaturite}+ ans): ${tailles.envergureMax}m × ${tailles.hauteurMax}m\nTronc: ⌀${(tailles.diametreTroncActuel * 100).toFixed(0)}cm ${iconeType}`;
            } else {
              const progH = Math.round(tailles.pourcentageHauteur * 100);
              const progE = Math.round(tailles.pourcentageEnvergure * 100);
              texte = `${anneeProjection} an${anneeProjection > 1 ? 's' : ''}: ${tailles.envergureActuelle.toFixed(1)}m × ${tailles.hauteurActuelle.toFixed(1)}m\nTronc: ⌀${(tailles.diametreTroncActuel * 100).toFixed(0)}cm ${iconeType} (H:${progH}% E:${progE}%)`;
            }
            
            dimensionsLabel.set({ text: texte });
          }
        }
        
        // ✅ Forcer le recalcul complet du groupe pour affichage correct
        arbreGroup.dirty = true;
        arbreGroup.setCoords(); // Met à jour les coordonnées pour la sélection
        validerPositionArbre(canvas, arbreGroup);
        
      } catch (error) {
        logger.error('Timeline', `Erreur redimensionnement arbre ${idx}`, error);
      }
    });
    
    // Un seul appel de render (requestRenderAll fait déjà le renderAll)
    canvas.requestRenderAll();
    
    logger.info('Timeline', `✅ ${arbresPlantes.length} arbres redimensionnés (année ${anneeProjection})`);
  }, [
    anneeProjection,
    fabricCanvasRef,
    calculerTailleSelonAnnee,
    validerPositionArbre
  ]);
};

