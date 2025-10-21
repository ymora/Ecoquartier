import { useEffect } from 'react';
import * as fabric from 'fabric';
import logger from '../utils/logger';
import { forcerTriObjets } from '../utils/canvas/depthSorting';

/**
 * Hook pour ajouter automatiquement les arbres à planter
 */
export const useArbresPlacement = ({
  fabricCanvasRef,
  arbresAPlanter,
  anneeProjection,
  calculerTailleSelonAnnee,
  trouverPositionValide,
  validerPositionArbre
}) => {
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || arbresAPlanter.length === 0) {
      logger.warn('AjoutArbres', 'Arbres non ajoutés', { 
        canvasExiste: !!canvas, 
        nbArbres: arbresAPlanter.length 
      });
      return;
    }
    
    logger.info('AjoutArbres', `Ajout de ${arbresAPlanter.length} arbres`);
    
    setTimeout(() => {
      const arbresExistants = canvas.getObjects().filter(obj => obj.customType === 'arbre-a-planter');
      
      const idsExistants = arbresExistants.map(a => a.arbreData?.id).sort().join(',');
      const idsAPlanter = arbresAPlanter.map(a => a.id).sort().join(',');
      
      if (idsExistants === idsAPlanter && arbresExistants.length === arbresAPlanter.length) {
        logger.info('AjoutArbres', `✅ Mêmes ${arbresAPlanter.length} arbres déjà présents, skip`);
        return;
      }
      
      logger.warn('AjoutArbres', `🔄 Liste changée: ${arbresExistants.length} → ${arbresAPlanter.length} arbres`);
      
      // ✅ FIXE : Supprimer SEULEMENT les arbres qui ne sont plus dans la liste
      const idsAPlanterSet = new Set(arbresAPlanter.map(a => a.id));
      arbresExistants.forEach(arbreExistant => {
        const idExistant = arbreExistant.arbreData?.id;
        if (!idsAPlanterSet.has(idExistant)) {
          // Cet arbre n'est plus dans la liste → le supprimer
          canvas.remove(arbreExistant);
          logger.info('AjoutArbres', `🗑️ Arbre ${arbreExistant.arbreData?.name} retiré`);
        }
      });
      
      // ✅ Ajouter SEULEMENT les nouveaux arbres
      const idsExistantsSet = new Set(arbresExistants.map(a => a.arbreData?.id));

      arbresAPlanter.forEach((arbre, index) => {
        // Si l'arbre existe déjà, ne rien faire
        if (idsExistantsSet.has(arbre.id)) {
          logger.info('AjoutArbres', `⏭️ ${arbre.name} déjà présent, conservé en place`);
          return;
        }
        
        logger.info('AjoutArbres', `➕ Ajout nouveau: ${arbre.name}`);
        // Debug désactivé pour performance (boucle)
        // logger.debug('AjoutArbres', `Ajout arbre ${index + 1}/${arbresAPlanter.length}: ${arbre.name}`);
        
        const tailles = calculerTailleSelonAnnee(arbre, anneeProjection);
        const largeur = tailles.largeur;
        const hauteur = tailles.hauteur;
        
        const position = trouverPositionValide(canvas, arbre, largeur, hauteur, index);
        
        const ellipse = new fabric.Ellipse({
          rx: largeur / 2,
          ry: hauteur / 2,
          fill: 'rgba(129, 199, 132, 0.4)',
          stroke: '#2e7d32',
          strokeWidth: 2,
          originX: 'center',
          originY: 'center'
        });

        const iconeType = tailles.typeCroissance === 'rapide' ? '⚡' : tailles.typeCroissance === 'lente' ? '🐌' : '🌿';
        const texteEmoji = arbre.type === 'Arbre' ? '🌳' : '🌿';
        
        const emoji = new fabric.Text(texteEmoji, {
          fontSize: Math.min(largeur, hauteur) * 0.3,
          originX: 'center',
          originY: 'center',
          top: -hauteur * 0.15,
          fill: '#1b5e20',
          selectable: false,
          evented: false
        });

        // Labels supprimés : toutes les infos sont maintenant dans le tooltip au survol

        const arbreGroup = new fabric.Group([ellipse, emoji], {
          left: position.x,
          top: position.y,
          originX: 'center',
          originY: 'center',
          customType: 'arbre-a-planter',
          hasControls: true,
          hasBorders: true,
          lockScalingX: true,
          lockScalingY: true,
          lockRotation: true
        });

        arbreGroup.arbreData = arbre;
        // Stocker les dimensions pour le tooltip
        arbreGroup.tailles = tailles;
        arbreGroup.iconeType = iconeType;
        canvas.add(arbreGroup);
        
        // Valider avec protection contre les erreurs
        try {
          validerPositionArbre(canvas, arbreGroup);
        } catch (error) {
          logger.error('AjoutArbres', `Erreur validation ${arbre.name}:`, error);
        }
        
        // Debug désactivé pour performance (boucle)
        // logger.debug('AjoutArbres', `✅ ${arbre.name} ajouté en position ${position.x.toFixed(0)}, ${position.y.toFixed(0)}`);
      });

      // Trier les objets par profondeur après ajout
      forcerTriObjets(canvas);
      
      canvas.renderAll();
      logger.info('AjoutArbres', `✅ ${arbresAPlanter.length} arbres ajoutés (triés par profondeur)`);
    }, 500);

  }, [arbresAPlanter]); // eslint-disable-line react-hooks/exhaustive-deps
};

