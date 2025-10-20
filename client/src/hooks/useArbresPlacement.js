import { useEffect } from 'react';
import * as fabric from 'fabric';
import logger from '../utils/logger';

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
      arbresExistants.forEach(a => canvas.remove(a));

      arbresAPlanter.forEach((arbre, index) => {
        logger.debug('AjoutArbres', `Ajout arbre ${index + 1}/${arbresAPlanter.length}: ${arbre.name}`);
        
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

        const labelNom = new fabric.Text(arbre.name, {
          fontSize: 10,
          fontWeight: 'bold',
          originX: 'center',
          originY: 'center',
          top: hauteur * 0.25,
          fill: '#1b5e20',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          padding: 3,
          selectable: false,
          evented: false
        });

        const labelDimensions = new fabric.Text(
          `Plantation: ${tailles.envergureActuelle.toFixed(1)}m × ${tailles.hauteurActuelle.toFixed(1)}m\nTronc: ⌀${(tailles.diametreTroncActuel * 100).toFixed(0)}cm ${iconeType}`,
          {
            fontSize: 9,
            originX: 'center',
            originY: 'center',
            top: hauteur * 0.38,
            fill: '#424242',
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            padding: 2,
            selectable: false,
            evented: false
          }
        );

        const arbreGroup = new fabric.Group([ellipse, emoji, labelNom, labelDimensions], {
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
        canvas.add(arbreGroup);
        validerPositionArbre(canvas, arbreGroup);
        
        logger.debug('AjoutArbres', `✅ ${arbre.name} ajouté en position ${position.x.toFixed(0)}, ${position.y.toFixed(0)}`);
      });

      // Trier les objets par profondeur après ajout
      forcerTriObjets(canvas);
      
      canvas.renderAll();
      logger.info('AjoutArbres', `✅ ${arbresAPlanter.length} arbres ajoutés (triés par profondeur)`);
    }, 500);

  }, [arbresAPlanter]); // eslint-disable-line react-hooks/exhaustive-deps
};

