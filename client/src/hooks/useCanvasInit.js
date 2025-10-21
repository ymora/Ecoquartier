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
  chargerPlanDemo,
  chargerPlanSauvegarde // ✅ Nouveau : fonction pour charger le plan sauvegardé
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

    // ========== TRI PAR PROFONDEUR ==========
    // Le tri est géré manuellement dans useCanvasEvents pour éviter les doubles renderAll()
    // autoSortOnMove(canvas) est désactivé
    logger.info('Canvas', 'Tri par profondeur géré manuellement dans useCanvasEvents');

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
      // Seulement pour le pan (Alt + clic OU clic molette OU clic droit)
      // PAS pour le clic gauche normal (qui doit permettre de sélectionner/déplacer les objets)
      if (evt.altKey || evt.button === 1 || evt.button === 2) {
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

    // ✅ NOUVEAU : Charger automatiquement le plan sauvegardé, sinon le plan démo
    setTimeout(() => {
      const planSauvegarde = localStorage.getItem('planTerrain');
      
      if (planSauvegarde && chargerPlanSauvegarde) {
        // Charger le plan sauvegardé
        try {
          chargerPlanSauvegarde();
          logger.info('Canvas', '✅ Plan sauvegardé restauré automatiquement');
          
          // Afficher notification temporaire
          const notification = document.createElement('div');
          notification.textContent = '💾 Plan restauré';
          notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
          `;
          document.body.appendChild(notification);
          setTimeout(() => {
            notification.style.transition = 'opacity 0.3s ease';
            notification.style.opacity = '0';
            setTimeout(() => document.body.removeChild(notification), 300);
          }, 2000);
        } catch (error) {
          logger.error('Canvas', 'Erreur chargement plan sauvegardé:', error);
          // En cas d'erreur, charger le plan démo
          if (chargerPlanDemo) {
            chargerPlanDemo();
            logger.info('Canvas', '✅ Plan démo chargé (plan sauvegardé corrompu)');
          }
        }
      } else if (chargerPlanDemo) {
        // Pas de plan sauvegardé : charger le plan démo
        chargerPlanDemo();
        logger.info('Canvas', '✅ Plan démo chargé automatiquement');
      }
    }, 100);

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

