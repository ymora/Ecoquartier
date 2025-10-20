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
      logger.warn('Timeline', 'Aucun arbre à redimensionner', { annee: anneeProjection });
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
        
        if (!arbreGroup._objects || !Array.isArray(arbreGroup._objects) || arbreGroup._objects.length < 4) {
          logger.error('Timeline', `${arbre.name} n'est pas un groupe valide`);
          return;
        }
        
        const tailles = calculerTailleSelonAnnee(arbre, anneeProjection);
        
        if (!tailles || !tailles.largeur || !tailles.hauteur) {
          logger.error('Timeline', `Tailles invalides pour ${arbre.name}`, { tailles });
          return;
        }
        
        const ellipse = arbreGroup._objects[0];
        const emoji = arbreGroup._objects[1];
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
        
        arbreGroup.dirty = true;
        arbreGroup.setCoords();
        validerPositionArbre(canvas, arbreGroup);
        
      } catch (error) {
        logger.error('Timeline', `Erreur redimensionnement arbre ${idx}`, error);
      }
    });
    
    // Un seul appel de render (requestRenderAll fait déjà le renderAll)
    canvas.requestRenderAll();
    
    logger.info('Timeline', `✅ ${arbresPlantes.length} arbres redimensionnés (année ${anneeProjection})`);
  }, [anneeProjection]); // eslint-disable-line react-hooks/exhaustive-deps
};

