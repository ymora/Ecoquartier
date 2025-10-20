import { useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import logger from '../utils/logger';
import { autoSortOnMove, forcerTriObjets } from '../utils/canvas/depthSorting';

/**
 * Hook pour initialiser le canvas Fabric.js
 * Gère l'initialisation, les dimensions, la grille, la boussole
 */
export const useCanvasInit = ({
  canvasRef,
  fabricCanvasRef,
  ajouterGrille,
  ajouterIndicateurSud,
  chargerPlanDemo
}) => {
  // Refs pour le pan (persistent entre renders)
  const isPanningRef = useRef(false);
  const lastPosXRef = useRef(0);
  const lastPosYRef = useRef(0);

  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;
    
    logger.info('Canvas', 'Initialisation');

    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const headerHeight = 65;
    const panneauLateralWidth = 300;
    const timelineHeight = 140;
    
    const availableHeight = viewportHeight - headerHeight - timelineHeight;
    const availableWidth = viewportWidth - panneauLateralWidth - 40;
    
    const canvas = new fabric.Canvas('canvas-terrain', {
      width: availableWidth,
      height: availableHeight,
      backgroundColor: 'transparent',
      selection: true,
      centeredScaling: false,
      centeredRotation: true,
      snapAngle: 15,
      snapThreshold: 10
    });

    fabricCanvasRef.current = canvas;

    // ========== TRI AUTOMATIQUE PAR PROFONDEUR ==========
    // Activer le tri automatique des objets par position Y (simulation de profondeur)
    autoSortOnMove(canvas);
    logger.info('Canvas', 'Tri automatique par profondeur activé');

    // ========== ZOOM AVEC MOLETTE ==========
    canvas.on('mouse:wheel', (opt) => {
      const delta = opt.e.deltaY;
      let zoom = canvas.getZoom();
      
      // Zoom in/out avec limites
      zoom *= 0.999 ** delta;
      
      // Limites : 50% à 300%
      if (zoom > 3) zoom = 3;
      if (zoom < 0.5) zoom = 0.5;
      
      // Zoomer vers le point de la souris
      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    // ========== PAN (DÉPLACEMENT) AVEC ÉVÉNEMENTS DOM ==========
    // Utiliser les événements DOM natifs car Fabric.js peut bloquer mouse:move
    const canvasElement = canvas.wrapperEl;
    
    const handleMouseDown = (evt) => {
      // Clic gauche maintenu OU Alt + clic OU clic molette OU clic droit pour activer pan
      if (evt.button === 0 || evt.altKey || evt.button === 1 || evt.button === 2) {
        // Vérifier qu'on ne clique pas sur un objet Fabric.js
        const target = canvas.findTarget(evt);
        
        // Si on clique sur le canvas vide (pas d'objet), activer le pan
        if (!target || target === canvas.backgroundImage) {
          isPanningRef.current = true;
          canvas.selection = false;
          canvasElement.style.cursor = 'grabbing';
          lastPosXRef.current = evt.clientX;
          lastPosYRef.current = evt.clientY;
          evt.preventDefault();
          evt.stopPropagation();
        }
      }
    };
    
    const handleMouseMove = (evt) => {
      if (isPanningRef.current) {
        const vpt = canvas.viewportTransform;
        const deltaX = evt.clientX - lastPosXRef.current;
        const deltaY = evt.clientY - lastPosYRef.current;
        
        vpt[4] += deltaX;
        vpt[5] += deltaY;
        
        canvas.requestRenderAll();
        lastPosXRef.current = evt.clientX;
        lastPosYRef.current = evt.clientY;
        evt.preventDefault();
      }
    };
    
    const handleMouseUp = () => {
      if (isPanningRef.current) {
        isPanningRef.current = false;
        canvas.selection = true;
        canvasElement.style.cursor = 'default';
      }
    };
    
    // Attacher les événements DOM
    canvasElement.addEventListener('mousedown', handleMouseDown);
    canvasElement.addEventListener('mousemove', handleMouseMove);
    canvasElement.addEventListener('mouseup', handleMouseUp);
    canvasElement.addEventListener('mouseleave', handleMouseUp); // Arrêter si on sort du canvas

    // Désactiver menu contextuel clic droit (utilisé pour pan)
    canvas.wrapperEl.oncontextmenu = (e) => {
      e.preventDefault();
      return false;
    };

    ajouterGrille(canvas);
    ajouterIndicateurSud(canvas);

    // Charger le plan démo automatiquement
    if (chargerPlanDemo) {
      setTimeout(() => {
        chargerPlanDemo();
        logger.info('Canvas', '✅ Plan démo chargé automatiquement');
      }, 100);
    }

    logger.info('Canvas', '✅ Zoom molette et Pan activés');

    return () => {
      // Nettoyer les event listeners DOM
      canvasElement.removeEventListener('mousedown', handleMouseDown);
      canvasElement.removeEventListener('mousemove', handleMouseMove);
      canvasElement.removeEventListener('mouseup', handleMouseUp);
      canvasElement.removeEventListener('mouseleave', handleMouseUp);
      
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};

