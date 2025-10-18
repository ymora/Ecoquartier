import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import DashboardTerrain from './DashboardTerrain';
import logger from '../utils/logger';
import diagnosticCanvas from '../utils/diagnosticCanvas';
import './CanvasTerrain.css';

function CanvasTerrain({ dimensions, orientation, onDimensionsChange, onOrientationChange, onPlanComplete, arbresAPlanter = [] }) {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null); // Stocker le canvas dans un ref, pas un state
  const echelle = 30; // 30 pixels = 1 mètre
  const outilActifRef = useRef(null);
  const validationTooltipRef = useRef(null);
  const pointsClotureRef = useRef([]);
  const arbresAjoutesRef = useRef(false); // Pour ajouter les arbres une seule fois
  const contextMenuRef = useRef(null); // Référence au menu contextuel HTML
  const [couchesSol, setCouchesSol] = useState([
    { nom: 'Terre végétale', profondeur: 30, couleur: '#8d6e63', type: 'fertile' },
    { nom: 'Marne', profondeur: 70, couleur: '#a1887f', type: 'argileux' }
  ]); // Composition du sol par défaut
  const imageFondRef = useRef(null); // Image de fond du plan
  const [imageFondChargee, setImageFondChargee] = useState(false); // État pour afficher/cacher les contrôles
  const [opaciteImage, setOpaciteImage] = useState(0.5); // Opacité de l'image de fond (50% par défaut)
  const [zonesContraintesVisibles, setZonesContraintesVisibles] = useState(true); // Afficher les zones de contraintes par défaut
  const [anneeProjection, setAnneeProjection] = useState(20); // Projection temporelle (20 ans par défaut = maturité)
  const [ombreVisible, setOmbreVisible] = useState(false); // Afficher l'ombre de la maison
  const [saison, setSaison] = useState('ete'); // Saison pour calcul ombre (hiver, printemps, ete, automne)
  const [snapMagnetiqueActif, setSnapMagnetiqueActif] = useState(true); // Accrochage magnétique entre objets

  // Initialiser le canvas UNE SEULE FOIS
  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;
    
    logger.info('CanvasTerrain', 'Initialisation du canvas');

    // Calculer la hauteur et largeur disponibles (viewport - header - footer - marges)
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const headerHeight = 150; // Hauteur approximative du header avec arbres
    const footerHeight = 0;  // Pas de footer maintenant
    const sidebarWidth = 250; // Largeur de la palette d'outils
    
    const availableHeight = viewportHeight - headerHeight - footerHeight - 40; // -40 pour marges
    const availableWidth = viewportWidth - sidebarWidth - 40; // -40 pour marges
    
    const canvas = new fabric.Canvas('canvas-terrain', {
      width: availableWidth, // Utiliser toute la largeur disponible
      height: availableHeight, // Utiliser toute la hauteur disponible
      backgroundColor: '#e8f5e9',
      selection: true,
      // Optimisations UX
      centeredScaling: false,
      centeredRotation: true,
      snapAngle: 15, // Rotation par incrément de 15°
      snapThreshold: 10 // Snap à 10 pixels près
    });

    fabricCanvasRef.current = canvas;

    // Grille
    ajouterGrille(canvas);

    // Boussole interactive sur le canvas
    ajouterIndicateurSud(canvas);

    // SNAP TO GRID - Aligner automatiquement sur la grille (5cm)
    canvas.on('object:moving', (e) => {
      const obj = e.target;
      const snapSize = echelle * 0.05; // 5cm en pixels
      
      // Snap aux multiples de 5cm (plus précis que 1m)
      let newLeft = Math.round(obj.left / snapSize) * snapSize;
      let newTop = Math.round(obj.top / snapSize) * snapSize;
      
      // SNAP MAGNÉTIQUE entre objets (si activé)
      if (snapMagnetiqueActif && !obj.isGridLine && !obj.isBoussole) {
        const snapDistance = echelle * 0.1; // 10cm de distance d'accrochage
        
        canvas.getObjects().forEach(target => {
          // Ignorer objets UI et soi-même
          if (target === obj || target.isGridLine || target.isBoussole || 
              target.measureLabel || target.isZoneContrainte || target.isOmbre ||
              target.isLigneMesure || target.isTroncIndicator) return;
          
          // SNAP HORIZONTAL (aligner bords)
          const targetLeft = target.left;
          const targetRight = target.left + (target.getScaledWidth ? target.getScaledWidth() : 0);
          const objWidth = obj.getScaledWidth ? obj.getScaledWidth() : 0;
          
          // Bord gauche obj → Bord gauche target
          if (Math.abs(newLeft - targetLeft) < snapDistance) {
            newLeft = targetLeft;
          }
          // Bord gauche obj → Bord droit target (coller à droite)
          if (Math.abs(newLeft - targetRight) < snapDistance) {
            newLeft = targetRight;
          }
          // Bord droit obj → Bord gauche target (coller à gauche)
          if (Math.abs((newLeft + objWidth) - targetLeft) < snapDistance) {
            newLeft = targetLeft - objWidth;
          }
          
          // SNAP VERTICAL (aligner bords)
          const targetTop = target.top;
          const targetBottom = target.top + (target.getScaledHeight ? target.getScaledHeight() : 0);
          const objHeight = obj.getScaledHeight ? obj.getScaledHeight() : 0;
          
          // Bord haut obj → Bord haut target
          if (Math.abs(newTop - targetTop) < snapDistance) {
            newTop = targetTop;
          }
          // Bord haut obj → Bord bas target (coller en dessous)
          if (Math.abs(newTop - targetBottom) < snapDistance) {
            newTop = targetBottom;
          }
          // Bord bas obj → Bord haut target (coller au-dessus)
          if (Math.abs((newTop + objHeight) - targetTop) < snapDistance) {
            newTop = targetTop - objHeight;
          }
        });
      }
      
      obj.set({
        left: newLeft,
        top: newTop
      });
    });

    // Afficher guides d'alignement
    canvas.on('object:moving', (e) => {
      const obj = e.target;
      const center = obj.getCenterPoint();
      
      // Guides visuels temporaires
      canvas.getObjects().forEach(other => {
        if (other === obj || other.isGridLine || other.measureLabel || other.alignmentGuide) return;
        
        const otherCenter = other.getCenterPoint();
        
        // Alignement horizontal
        if (Math.abs(center.y - otherCenter.y) < 10) {
          obj.set({ top: other.top });
          afficherGuideTemporaire(canvas, 'horizontal', otherCenter.y);
        }
        
        // Alignement vertical
        if (Math.abs(center.x - otherCenter.x) < 10) {
          obj.set({ left: other.left });
          afficherGuideTemporaire(canvas, 'vertical', otherCenter.x);
        }
      });
    });

    canvas.on('object:modified', () => {
      // Supprimer les guides d'alignement
      canvas.getObjects().forEach(obj => {
        if (obj.alignmentGuide) canvas.remove(obj);
      });
      canvas.renderAll();
    });

    // Gestion des raccourcis clavier
    const handleKeyDown = (e) => {
      // Suppr / Backspace : Supprimer
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeObjects = canvas.getActiveObjects();
        const locked = activeObjects.filter(obj => obj.locked);
        
        if (locked.length > 0) {
          alert('⚠️ Objet(s) verrouillé(s) - Déverrouillez d\'abord');
          return;
        }
        
        if (activeObjects.length > 0) {
          activeObjects.forEach(obj => {
            if (!obj.isGridLine && !obj.isImageFond) {
              canvas.remove(obj);
            }
          });
          canvas.discardActiveObject();
          canvas.renderAll();
          exporterPlan(canvas);
        }
      }
      
      // Ctrl+D : Dupliquer
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        const actifs = canvas.getActiveObjects();
        if (actifs.length > 0) {
          actifs.forEach(obj => {
            if (!obj.isGridLine && !obj.measureLabel) {
              obj.clone((cloned) => {
                cloned.set({
                  left: obj.left + echelle,
                  top: obj.top + echelle
                });
                canvas.add(cloned);
                canvas.setActiveObject(cloned);
                canvas.renderAll();
              });
            }
          });
        }
      }
      
      // Flèches : Déplacer de 1m ou 10cm
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        const actifs = canvas.getActiveObjects();
        if (actifs.length > 0) {
          e.preventDefault();
          const delta = e.shiftKey ? echelle : echelle / 10; // Shift = 1m, sinon 10cm
          
          actifs.forEach(obj => {
            if (obj.locked) return;
            
            switch(e.key) {
              case 'ArrowUp':
                obj.set({ top: obj.top - delta });
                break;
              case 'ArrowDown':
                obj.set({ top: obj.top + delta });
                break;
              case 'ArrowLeft':
                obj.set({ left: obj.left - delta });
                break;
              case 'ArrowRight':
                obj.set({ left: obj.left + delta });
                break;
            }
          });
          
          canvas.renderAll();
          ajouterMesuresLive(canvas);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);

    // Export automatique lors des modifications
    const handleModification = (e) => {
      // Ignorer si c'est un label de mesure ou guide
      if (e && e.target && (e.target.measureLabel || e.target.alignmentGuide || e.target.isGridLine)) {
        return;
      }
      exporterPlan(canvas);
      ajouterMesuresLive(canvas);
    };

    canvas.on('object:modified', handleModification);
    canvas.on('object:added', handleModification);
    canvas.on('object:removed', handleModification);
    canvas.on('object:scaling', (e) => {
      if (e.target && !e.target.measureLabel && !e.target.alignmentGuide && !e.target.isGridLine) {
        ajouterMesuresLive(canvas);
        // Mettre à jour la position du menu contextuel
        if (!e.target.isBoussole) {
          afficherMenuContextuel(e.target, canvas);
        }
      }
    });
    canvas.on('object:moving', (e) => {
      if (e.target && !e.target.measureLabel && !e.target.alignmentGuide && !e.target.isGridLine) {
        ajouterMesuresLive(canvas);
        // Mettre à jour la position du menu contextuel
        if (!e.target.isBoussole) {
          afficherMenuContextuel(e.target, canvas);
        }
        // Revalider si c'est un arbre et afficher le tooltip en temps réel
        if (e.target.customType === 'arbre-a-planter') {
          validerPositionArbre(canvas, e.target);
          afficherTooltipValidation(e.target, canvas);
        }
      }
    });
    
    canvas.on('object:modified', (e) => {
      // Cacher le tooltip et le cercle tronc à la fin du déplacement
      cacherTooltipValidation();
      cacherCercleTronc(canvas);
      
      // Revalider tous les arbres après modification
      if (e.target) {
        canvas.getObjects().filter(obj => obj.customType === 'arbre-a-planter').forEach(arbre => {
          validerPositionArbre(canvas, arbre);
        });
      }
      
      // Recalculer les zones de contraintes et l'ombre
      afficherZonesContraintes(canvas);
      afficherOmbreMaison(canvas);
    });

    // Afficher menu contextuel lors de la sélection
    canvas.on('selection:created', (e) => {
      const obj = e.selected[0];
      if (obj && !obj.isAideButton && !obj.isBoussole && !obj.isDimensionBox) {
        afficherMenuContextuel(obj, canvas);
        // Afficher les messages de validation pour les arbres
        if (obj.customType === 'arbre-a-planter' && obj.validationMessages) {
          afficherMessagesValidation(obj);
        }
      }
    });

    canvas.on('selection:updated', (e) => {
      const obj = e.selected[0];
      if (obj && !obj.isAideButton && !obj.isBoussole && !obj.isDimensionBox) {
        afficherMenuContextuel(obj, canvas);
        // Afficher les messages de validation pour les arbres
        if (obj.customType === 'arbre-a-planter' && obj.validationMessages) {
          afficherMessagesValidation(obj);
        }
      }
    });

    canvas.on('selection:cleared', () => {
      cacherMenuContextuel();
    });
    
    // Double-clic sur une ligne (canalisation/clôture) pour ajouter un point intermédiaire
    canvas.on('mouse:dblclick', (e) => {
      if (e.target && (e.target.customType === 'cloture' || e.target.customType === 'canalisation')) {
        ajouterPointIntermediaire(canvas, e.target, e.pointer);
      }
    });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, []); // Dépendances vides = s'exécute UNE SEULE FOIS

  // Afficher/masquer les zones de contraintes quand le toggle change
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      afficherZonesContraintes(canvas);
    }
  }, [zonesContraintesVisibles]);

  // Recalculer l'ombre quand la saison ou la visibilité change
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      afficherOmbreMaison(canvas);
    }
  }, [ombreVisible, saison]);

  // Redimensionner les arbres quand l'année de projection change
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const arbresPlantes = canvas.getObjects().filter(obj => obj.customType === 'arbre-a-planter');
    
    if (arbresPlantes.length === 0) {
      logger.warn('Timeline', 'Aucun arbre à redimensionner', { annee: anneeProjection });
      return;
    }
    
    logger.debug('Timeline', `Redimensionnement ${arbresPlantes.length} arbres → ${anneeProjection} ans`);
    
    arbresPlantes.forEach((arbreGroup, idx) => {
      try {
        const arbre = arbreGroup.arbreData;
        if (!arbre) {
          logger.warn('Timeline', `Arbre ${idx} sans données`);
          return;
        }
        
        const tailles = calculerTailleSelonAnnee(arbre, anneeProjection);
        
        // Vérifier que c'est bien un groupe
        if (!arbreGroup._objects || arbreGroup._objects.length < 4) {
          logger.error('Timeline', `Arbre ${arbre.name} n'est pas un groupe valide`, {
            type: arbreGroup.type,
            hasObjects: !!arbreGroup._objects
          });
          return;
        }
        
        // Accéder directement aux objets du groupe
        const ellipse = arbreGroup._objects[0]; // Premier élément = ellipse
        const emoji = arbreGroup._objects[1];    // Deuxième = emoji
        const label = arbreGroup._objects[2];    // Troisième = nom
        const dimensionsLabel = arbreGroup._objects[3]; // Quatrième = dimensions
        
        // Redimensionner l'ellipse
        if (ellipse && ellipse.type === 'ellipse') {
          ellipse.set({
            rx: tailles.largeur / 2,
            ry: tailles.hauteur / 2
          });
        }
        
        // Mettre à jour l'emoji
        if (emoji) {
          const newFontSize = Math.min(tailles.largeur, tailles.hauteur) * 0.3;
          emoji.set({ fontSize: newFontSize });
        }
        
        // Mettre à jour le label des dimensions
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
        
        // Force dirty pour forcer le rendu du groupe
        arbreGroup.dirty = true;
        arbreGroup.setCoords(); // Recalculer les coordonnées
        
        // Revalider
        validerPositionArbre(canvas, arbreGroup);
        
      } catch (error) {
        logger.error('Timeline', `Erreur redimensionnement arbre ${idx}`, error);
      }
    });
    
    canvas.renderAll();
    canvas.requestRenderAll(); // Force le rendu complet
    afficherZonesContraintes(canvas);
    
    logger.info('Timeline', `✅ ${arbresPlantes.length} arbres redimensionnés (année ${anneeProjection})`);
  }, [anneeProjection]);

  // Note: Modal sol déplacé dans Dashboard (plus pratique)

  // Rendre le menu contextuel déplaçable
  useEffect(() => {
    const menu = contextMenuRef.current;
    if (!menu) return;

    let isDragging = false;
    let currentX, currentY, initialX, initialY;

    const dragStart = (e) => {
      if (menu.style.display === 'none') return;
      
      initialX = e.clientX - menu.offsetLeft;
      initialY = e.clientY - menu.offsetTop;
      isDragging = true;
      menu.style.cursor = 'grabbing';
    };

    const drag = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      
      menu.style.left = currentX + 'px';
      menu.style.top = currentY + 'px';
    };

    const dragEnd = () => {
      isDragging = false;
      menu.style.cursor = 'move';
    };

    menu.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    return () => {
      menu.removeEventListener('mousedown', dragStart);
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', dragEnd);
    };
  }, []);

  // Rendre la palette déplaçable
  useEffect(() => {
    const palette = document.getElementById('palette-outils');
    const header = palette?.querySelector('.palette-header');
    if (!palette || !header) return;

    let isDragging = false;
    let currentX, currentY, initialX, initialY;

    const dragStart = (e) => {
      if (e.type === 'touchstart') {
        initialX = e.touches[0].clientX - palette.offsetLeft;
        initialY = e.touches[0].clientY - palette.offsetTop;
      } else {
        initialX = e.clientX - palette.offsetLeft;
        initialY = e.clientY - palette.offsetTop;
      }

      if (e.target === header || e.target.classList.contains('palette-handle') || e.target.tagName === 'H4') {
        isDragging = true;
        palette.style.cursor = 'grabbing';
      }
    };

    const drag = (e) => {
      if (!isDragging) return;
      e.preventDefault();

      if (e.type === 'touchmove') {
        currentX = e.touches[0].clientX - initialX;
        currentY = e.touches[0].clientY - initialY;
      } else {
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
      }

      palette.style.left = currentX + 'px';
      palette.style.top = currentY + 'px';
    };

    const dragEnd = () => {
      isDragging = false;
      palette.style.cursor = 'grab';
    };

    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    header.addEventListener('touchstart', dragStart);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', dragEnd);

    return () => {
      header.removeEventListener('mousedown', dragStart);
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', dragEnd);
      header.removeEventListener('touchstart', dragStart);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('touchend', dragEnd);
    };
  }, []);

  // Afficher le menu contextuel au-dessus de l'objet sélectionné
  const afficherMenuContextuel = (obj, canvas) => {
    if (!obj || obj.isGridLine || obj.isBoussole || obj.measureLabel || obj.isImageFond) {
      cacherMenuContextuel();
      return;
    }

    const menu = contextMenuRef.current;
    if (!menu) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const objCenter = obj.getCenterPoint();
    const objHeight = obj.getScaledHeight ? obj.getScaledHeight() : 50;
    const objWidth = obj.getScaledWidth ? obj.getScaledWidth() : 50;
    
    // POSITIONNEMENT INTELLIGENT pour éviter masquage
    let menuLeft = canvasRect.left + objCenter.x;
    let menuTop = canvasRect.top + objCenter.y - objHeight / 2 - 50;
    
    const menuWidth = 100; // Largeur approximative du menu
    const menuHeight = 40; // Hauteur approximative
    
    // Si trop en haut → Placer en dessous
    if (menuTop < canvasRect.top + 10) {
      menuTop = canvasRect.top + objCenter.y + objHeight / 2 + 10;
    }
    
    // Si trop à droite → Décaler à gauche
    if (menuLeft + menuWidth > canvasRect.right) {
      menuLeft = canvasRect.right - menuWidth - 10;
    }
    
    // Si trop à gauche → Décaler à droite
    if (menuLeft < canvasRect.left) {
      menuLeft = canvasRect.left + 10;
    }
    
    // Si trop en bas → Remonter
    if (menuTop + menuHeight > canvasRect.bottom) {
      menuTop = canvasRect.bottom - menuHeight - 10;
    }
    
    menu.style.left = `${menuLeft}px`;
    menu.style.top = `${menuTop}px`;
    menu.style.display = 'flex';
    menu.style.cursor = 'move'; // Indiquer déplaçable
    
    // Mettre à jour l'état verrouillé
    const btnLock = menu.querySelector('.context-lock');
    if (obj.locked) {
      btnLock.textContent = '🔓';
      btnLock.title = 'Déverrouiller';
    } else {
      btnLock.textContent = '🔒';
      btnLock.title = 'Verrouiller';
    }
  };

  const cacherMenuContextuel = () => {
    const menu = contextMenuRef.current;
    if (menu) {
      menu.style.display = 'none';
    }
  };

  // Afficher tooltip de validation en temps réel pendant le déplacement
  const afficherTooltipValidation = (arbreGroup, canvas) => {
    const panel = validationTooltipRef.current;
    if (!panel) return;
    
    const messages = arbreGroup.validationMessages || [];
    const status = arbreGroup.validationStatus || 'ok';
    const arbre = arbreGroup.arbreData;
    
    // Déterminer la classe CSS
    let classe = 'validation-ok';
    let icone = '✅';
    if (status === 'error') {
      classe = 'validation-error';
      icone = '❌';
    } else if (status === 'warning') {
      classe = 'validation-warning';
      icone = '⚠️';
    }
    
    // Enrichir les informations affichées
    const tailles = calculerTailleSelonAnnee(arbre, anneeProjection);
    
    // Construire le HTML enrichi
    let html = `<div class="panel-validation-header ${classe}">`;
    html += `<strong>${icone} ${arbre?.name || 'Arbre'}</strong>`;
    html += `</div>`;
    
    // SECTION INFO ARBRE
    html += `<div class="panel-section panel-info">`;
    html += `<div class="panel-subtitle">📊 Informations</div>`;
    html += `<div class="panel-detail">🌳 Taille actuelle: ${tailles.hauteurActuelle.toFixed(1)}m × ${tailles.envergureActuelle.toFixed(1)}m</div>`;
    html += `<div class="panel-detail">⌀ Tronc: ${(tailles.diametreTroncActuel * 100).toFixed(0)}cm</div>`;
    html += `<div class="panel-detail">📅 Âge: ${anneeProjection} an${anneeProjection > 1 ? 's' : ''} (${Math.round(tailles.pourcentageHauteur * 100)}% maturité)</div>`;
    html += `<div class="panel-detail">📏 Racines prof.: ${arbre.reglementation?.systemeRacinaire?.profondeur || 'N/A'}</div>`;
    html += `</div>`;
    
    // SECTION VALIDATION
    html += `<div class="panel-validation-messages">`;
    if (messages.length === 0) {
      html += `<div class="panel-msg panel-msg-success">✅ Emplacement conforme à toutes les règles</div>`;
      html += `<div class="panel-detail">• Distance voisinage respectée</div>`;
      html += `<div class="panel-detail">• Loin des fondations</div>`;
      html += `<div class="panel-detail">• Loin des canalisations</div>`;
      html += `<div class="panel-detail">• Sol compatible</div>`;
    } else {
      messages.forEach(msg => {
        const isError = msg.includes('CRITIQUE') || msg.includes('ILLÉGAL') || msg.includes('DANGER');
        const msgClass = isError ? 'panel-msg-error' : 'panel-msg-warning';
        html += `<div class="panel-msg ${msgClass}">${msg}</div>`;
      });
    }
    html += `</div>`;
    
    // SECTION CONSEILS
    if (status !== 'ok') {
      html += `<div class="panel-section panel-conseils">`;
      html += `<div class="panel-subtitle">💡 Conseils</div>`;
      if (messages.some(m => m.includes('voisinage') || m.includes('limite'))) {
        html += `<div class="panel-detail">• Éloigner de la clôture (limite légale)</div>`;
        html += `<div class="panel-detail">• Minimum: ${arbre.reglementation?.distancesLegales?.voisinage?.distance || '2m'}</div>`;
      }
      if (messages.some(m => m.includes('fondations') || m.includes('maison'))) {
        html += `<div class="panel-detail">• Éloigner de la maison</div>`;
        html += `<div class="panel-detail">• Minimum: ${arbre.reglementation?.distancesLegales?.infrastructures?.fondations || '5m'}</div>`;
      }
      if (messages.some(m => m.includes('canalisation'))) {
        html += `<div class="panel-detail">• Risque colmatage racines</div>`;
        html += `<div class="panel-detail">• Minimum: ${arbre.reglementation?.distancesLegales?.infrastructures?.canalisations || '4m'}</div>`;
      }
      html += `</div>`;
    }
    
    panel.innerHTML = html;
    panel.className = `panel-validation ${classe}`;
    panel.style.display = 'block';
    
    // Afficher un cercle rouge pour le tronc pendant le déplacement
    afficherCercleTronc(canvas, arbreGroup);
    
    // Afficher les lignes de mesure pour les distances problématiques
    afficherLignesMesure(canvas, arbreGroup);
  };
  
  const afficherCercleTronc = (canvas, arbreGroup) => {
    // Supprimer l'ancien cercle s'il existe
    const ancienCercle = canvas.getObjects().find(obj => obj.isTroncIndicator);
    if (ancienCercle) canvas.remove(ancienCercle);
    
    const arbre = arbreGroup.arbreData;
    if (!arbre) return;
    
    // Calculer le diamètre selon l'année de projection
    const tailles = calculerTailleSelonAnnee(arbre, anneeProjection);
    const diametreTronc = tailles.diametreTroncActuel;
    const rayonTronc = (diametreTronc / 2) * echelle;
    
    const cercleTronc = new fabric.Circle({
      left: arbreGroup.left,
      top: arbreGroup.top,
      radius: rayonTronc,
      fill: 'rgba(255, 0, 0, 0.2)',
      stroke: '#d32f2f',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
      isTroncIndicator: true
    });
    
    canvas.add(cercleTronc);
    canvas.renderAll();
  };
  
  // Afficher les lignes de mesure pour les distances problématiques
  const afficherLignesMesure = (canvas, arbreGroup) => {
    // Supprimer les anciennes lignes de mesure
    canvas.getObjects().filter(obj => obj.isLigneMesure).forEach(obj => canvas.remove(obj));
    
    const arbre = arbreGroup.arbreData;
    if (!arbre) return;
    
    const x = arbreGroup.left;
    const y = arbreGroup.top;
    
    // Extraire les distances minimales
    const distanceFondations = parseFloat(arbre.reglementation?.distancesLegales?.infrastructures?.fondations?.split('m')[0] || '5');
    const distanceCanalisations = parseFloat(arbre.reglementation?.distancesLegales?.infrastructures?.canalisations?.split('m')[0] || '4');
    const distanceCloture = parseFloat(arbre.reglementation?.distancesLegales?.voisinage?.distance?.split('m')[0] || '2');
    
    // Vérifier maison
    const maison = canvas.getObjects().find(obj => obj.customType === 'maison');
    if (maison) {
      const distMaison = calculerDistanceRectangle(x, y, maison) / echelle;
      if (distMaison < distanceFondations) {
        // Trouver le point le plus proche sur la maison
        const pointProche = trouverPointPlusProcheMaison(x, y, maison);
        ajouterLigneMesureProbleme(canvas, x, y, pointProche.x, pointProche.y, distMaison, distanceFondations, '🏠');
      }
    }
    
    // Vérifier canalisations
    const canalisations = canvas.getObjects().filter(obj => obj.customType === 'canalisation');
    for (const canal of canalisations) {
      const distCanal = calculerDistanceLigne(x, y, canal) / echelle;
      if (distCanal < distanceCanalisations) {
        const pointProche = trouverPointPlusProcheLigne(x, y, canal);
        ajouterLigneMesureProbleme(canvas, x, y, pointProche.x, pointProche.y, distCanal, distanceCanalisations, '🚰');
      }
    }
    
    // Vérifier clôtures (LIMITE DE PROPRIÉTÉ = VOISINAGE)
    const clotures = canvas.getObjects().filter(obj => obj.customType === 'cloture');
    for (const cloture of clotures) {
      const distCloture = calculerDistanceLigne(x, y, cloture) / echelle;
      if (distCloture < distanceCloture || distCloture < 0.15) {
        const pointProche = trouverPointPlusProcheLigne(x, y, cloture);
        // Message spécifique pour la distance légale voisinage
        const iconeLegal = distCloture < distanceCloture ? '⚖️' : '🚧';
        ajouterLigneMesureProbleme(canvas, x, y, pointProche.x, pointProche.y, distCloture, distanceCloture, iconeLegal);
      }
    }
    
    // Vérifier citernes/fosses
    const citernes = canvas.getObjects().filter(obj => obj.customType === 'citerne');
    const distanceFosseSeptique = parseFloat(arbre.reglementation?.distancesLegales?.infrastructures?.fossesSeptiques?.split('m')[0] || '6');
    for (const citerne of citernes) {
      const distCiterne = calculerDistanceRectangle(x, y, citerne) / echelle;
      if (distCiterne < distanceFosseSeptique) {
        const pointProche = trouverPointPlusProcheMaison(x, y, citerne);
        ajouterLigneMesureProbleme(canvas, x, y, pointProche.x, pointProche.y, distCiterne, distanceFosseSeptique, '💧');
      }
    }
    
    canvas.renderAll();
  };
  
  const ajouterLigneMesureProbleme = (canvas, x1, y1, x2, y2, distActuelle, distMin, icone) => {
    // Ligne pointillée rouge
    const ligne = new fabric.Line([x1, y1, x2, y2], {
      stroke: '#d32f2f',
      strokeWidth: 2,
      strokeDashArray: [8, 4],
      selectable: false,
      evented: false,
      isLigneMesure: true
    });
    canvas.add(ligne);
    
    // Label de distance au milieu
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    
    const label = new fabric.Text(`${icone} ${distActuelle.toFixed(1)}m < ${distMin}m`, {
      left: midX,
      top: midY - 15,
      fontSize: 11,
      fontWeight: 'bold',
      fill: 'white',
      backgroundColor: '#d32f2f',
      padding: 4,
      borderRadius: 4,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
      isLigneMesure: true
    });
    canvas.add(label);
  };
  
  const trouverPointPlusProcheMaison = (px, py, rect) => {
    const rx = rect.left;
    const ry = rect.top;
    const rw = rect.getScaledWidth();
    const rh = rect.getScaledHeight();
    
    const closestX = Math.max(rx, Math.min(px, rx + rw));
    const closestY = Math.max(ry, Math.min(py, ry + rh));
    
    return { x: closestX, y: closestY };
  };
  
  const trouverPointPlusProcheLigne = (px, py, ligne) => {
    const x1 = ligne.x1 + ligne.left;
    const y1 = ligne.y1 + ligne.top;
    const x2 = ligne.x2 + ligne.left;
    const y2 = ligne.y2 + ligne.top;
    
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    const param = lenSq !== 0 ? dot / lenSq : -1;
    
    let xx, yy;
    
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
    
    return { x: xx, y: yy };
  };
  
  const cacherCercleTronc = (canvas) => {
    const cercleTronc = canvas.getObjects().find(obj => obj.isTroncIndicator);
    if (cercleTronc) {
      canvas.remove(cercleTronc);
      canvas.renderAll();
    }
    
    // Aussi cacher les lignes de mesure
    canvas.getObjects().filter(obj => obj.isLigneMesure).forEach(obj => canvas.remove(obj));
    canvas.renderAll();
  };

  // Calculer et afficher l'ombre portée de la maison selon la saison
  const afficherOmbreMaison = (canvas) => {
    // Supprimer les anciennes ombres
    canvas.getObjects().filter(obj => obj.isOmbre).forEach(obj => canvas.remove(obj));
    
    if (!ombreVisible) return;
    
    const maison = canvas.getObjects().find(obj => obj.customType === 'maison');
    if (!maison) return;
    
    // Hauteur de la maison (éditable, par défaut 7m pour R+1)
    const hauteurMaison = maison.hauteurBatiment || 7; // 7m = rez-de-chaussée + 1 étage
    
    // Angles solaires selon la saison (France métropolitaine, ~48°N)
    // Angle = élévation solaire à midi solaire (sud)
    const anglesSolaires = {
      'hiver': 18,      // 21 décembre : soleil très bas (18° à midi)
      'printemps': 45,  // 21 mars/sept : équinoxe
      'ete': 65,        // 21 juin : soleil haut (65° à midi)
      'automne': 45     // 21 septembre : équinoxe
    };
    
    const angleSoleil = anglesSolaires[saison];
    const angleRad = (angleSoleil * Math.PI) / 180;
    
    // Longueur de l'ombre = hauteur / tan(angle)
    const longueurOmbre = hauteurMaison / Math.tan(angleRad);
    const longueurOmbrePx = longueurOmbre * echelle;
    
    // Direction de l'ombre : TOUJOURS VERS LE NORD (opposé au sud)
    // Le soleil est au sud à midi en France
    // L'indicateur ☀️ SUD nous donne la direction du sud
    const indicateurSud = canvas.getObjects().find(obj => obj.isBoussole);
    let angleSud = 0; // Par défaut : sud vers le bas
    if (indicateurSud) {
      angleSud = (indicateurSud.angle || 0) * Math.PI / 180;
    }
    
    // Ombre vers le nord = opposé du sud (+ 180°)
    const angleOmbre = angleSud + Math.PI;
    
    // Calculer les points de l'ombre (projection du rectangle maison)
    const mWidth = maison.getScaledWidth();
    const mHeight = maison.getScaledHeight();
    const mLeft = maison.left;
    const mTop = maison.top;
    
    // 4 coins de la maison
    const coins = [
      { x: mLeft, y: mTop },                          // Haut gauche
      { x: mLeft + mWidth, y: mTop },                 // Haut droit
      { x: mLeft + mWidth, y: mTop + mHeight },       // Bas droit
      { x: mLeft, y: mTop + mHeight }                 // Bas gauche
    ];
    
    // Projeter chaque coin selon l'angle de l'ombre
    const coinsOmbre = coins.map(coin => ({
      x: coin.x + Math.cos(angleOmbre) * longueurOmbrePx,
      y: coin.y + Math.sin(angleOmbre) * longueurOmbrePx
    }));
    
    // Créer le polygone de l'ombre (trapèze : maison + projection)
    // Format correct pour Polygon : points consécutifs formant un contour fermé
    const pointsOmbre = [
      ...coins,                    // 4 coins maison
      coinsOmbre[3],              // Coin projeté 4 (bas gauche)
      coinsOmbre[2],              // Coin projeté 3 (bas droit)
      coinsOmbre[1],              // Coin projeté 2 (haut droit)
      coinsOmbre[0]               // Coin projeté 1 (haut gauche)
    ];
    
    const ombre = new fabric.Polygon(pointsOmbre, {
      fill: 'rgba(0, 0, 0, 0.3)',
      stroke: 'rgba(0, 0, 0, 0.5)',
      strokeWidth: 2,
      strokeDashArray: [8, 4],
      selectable: false,
      evented: false,
      isOmbre: true,
      opacity: 0.8
    });
    
    // Insérer l'ombre juste après les lignes de grille (mais avant les objets)
    const gridCount = canvas.getObjects().filter(obj => obj.isGridLine).length;
    const imageFondCount = canvas.getObjects().filter(obj => obj.isImageFond).length;
    canvas.insertAt(ombre, gridCount + imageFondCount + 1);
    
    logger.info('Ombre', `Ombre créée: ${longueurOmbre.toFixed(1)}m vers nord`, {
      saison,
      angleSoleil,
      hauteurMaison,
      nbPoints: pointsOmbre.length
    });
    
    // Ajouter un label informatif
    const labelOmbre = new fabric.Text(
      `☀️ Ombre ${saison} (${angleSoleil}° soleil, ${longueurOmbre.toFixed(1)}m)`,
      {
        left: mLeft + mWidth / 2,
        top: mTop + mHeight + longueurOmbrePx / 2,
        fontSize: 12,
        fill: '#424242',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 4,
        selectable: false,
        evented: false,
        isOmbre: true
      }
    );
    canvas.add(labelOmbre);
    
    canvas.renderAll();
  };

  // Afficher les zones de contraintes visuelles (halos colorés)
  const afficherZonesContraintes = (canvas) => {
    // Supprimer les anciennes zones
    canvas.getObjects().filter(obj => obj.isZoneContrainte).forEach(obj => canvas.remove(obj));
    
    if (!zonesContraintesVisibles) return;
    
    const arbres = canvas.getObjects().filter(obj => obj.customType === 'arbre-a-planter');
    if (arbres.length === 0) return;
    
    // Pour chaque arbre, récupérer ses contraintes
    arbres.forEach(arbreGroup => {
      const arbre = arbreGroup.arbreData;
      if (!arbre) return;
      
      const distanceFondations = parseFloat(arbre.reglementation?.distancesLegales?.infrastructures?.fondations?.split('m')[0] || '5');
      const distanceCloture = parseFloat(arbre.reglementation?.distancesLegales?.voisinage?.distance?.split('m')[0] || '2');
      
      // Zones autour de la maison
      const maison = canvas.getObjects().find(obj => obj.customType === 'maison');
      if (maison) {
        // Zone interdite (rouge)
        const zoneRouge = new fabric.Rect({
          left: maison.left - distanceFondations * echelle,
          top: maison.top - distanceFondations * echelle,
          width: maison.getScaledWidth() + (distanceFondations * 2 * echelle),
          height: maison.getScaledHeight() + (distanceFondations * 2 * echelle),
          fill: 'rgba(244, 67, 54, 0.08)',
          stroke: '#c62828',
          strokeWidth: 1,
          strokeDashArray: [8, 4],
          selectable: false,
          evented: false,
          isZoneContrainte: true
        });
        canvas.insertAt(zoneRouge, canvas.getObjects().filter(obj => obj.isGridLine).length + 1);
        
        // Zone attention (orange)
        const zoneOrange = new fabric.Rect({
          left: maison.left - (distanceFondations + 1) * echelle,
          top: maison.top - (distanceFondations + 1) * echelle,
          width: maison.getScaledWidth() + ((distanceFondations + 1) * 2 * echelle),
          height: maison.getScaledHeight() + ((distanceFondations + 1) * 2 * echelle),
          fill: 'rgba(255, 152, 0, 0.05)',
          stroke: '#e65100',
          strokeWidth: 1,
          strokeDashArray: [5, 5],
          selectable: false,
          evented: false,
          isZoneContrainte: true
        });
        canvas.insertAt(zoneOrange, canvas.getObjects().filter(obj => obj.isGridLine).length + 1);
      }
      
      // Zones autour des citernes
      const citernes = canvas.getObjects().filter(obj => obj.customType === 'citerne');
      const distanceFosse = parseFloat(arbre.reglementation?.distancesLegales?.infrastructures?.fossesSeptiques?.split('m')[0] || '6');
      citernes.forEach(citerne => {
        const zoneRouge = new fabric.Rect({
          left: citerne.left - distanceFosse * echelle,
          top: citerne.top - distanceFosse * echelle,
          width: citerne.getScaledWidth() + (distanceFosse * 2 * echelle),
          height: citerne.getScaledHeight() + (distanceFosse * 2 * echelle),
          fill: 'rgba(33, 150, 243, 0.08)',
          stroke: '#1976d2',
          strokeWidth: 1,
          strokeDashArray: [8, 4],
          selectable: false,
          evented: false,
          isZoneContrainte: true
        });
        canvas.insertAt(zoneRouge, canvas.getObjects().filter(obj => obj.isGridLine).length + 1);
      });
    });
    
    // Zones le long des clôtures
    const clotures = canvas.getObjects().filter(obj => obj.customType === 'cloture');
    clotures.forEach(cloture => {
      // Créer une zone tampon de 2m le long de la clôture
      const angle = Math.atan2(cloture.y2 - cloture.y1, cloture.x2 - cloture.x1);
      const perpAngle = angle + Math.PI / 2;
      const offset = 2 * echelle;
      
      // Points pour créer un polygone le long de la ligne
      const points = [
        { x: cloture.x1 + cloture.left + Math.cos(perpAngle) * offset, y: cloture.y1 + cloture.top + Math.sin(perpAngle) * offset },
        { x: cloture.x2 + cloture.left + Math.cos(perpAngle) * offset, y: cloture.y2 + cloture.top + Math.sin(perpAngle) * offset },
        { x: cloture.x2 + cloture.left - Math.cos(perpAngle) * offset, y: cloture.y2 + cloture.top - Math.sin(perpAngle) * offset },
        { x: cloture.x1 + cloture.left - Math.cos(perpAngle) * offset, y: cloture.y1 + cloture.top - Math.sin(perpAngle) * offset }
      ];
      
      const zoneClot = new fabric.Polygon(points, {
        fill: 'rgba(255, 193, 7, 0.08)',
        stroke: '#ffa726',
        strokeWidth: 1,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
        isZoneContrainte: true
      });
      canvas.insertAt(zoneClot, canvas.getObjects().filter(obj => obj.isGridLine).length + 1);
    });
    
    canvas.renderAll();
  };

  // Ajouter un point intermédiaire à une ligne pour créer un angle
  const ajouterPointIntermediaire = (canvas, ligne, pointer) => {
    // Récupérer les coordonnées de la ligne
    const x1 = ligne.x1 + ligne.left;
    const y1 = ligne.y1 + ligne.top;
    const x2 = ligne.x2 + ligne.left;
    const y2 = ligne.y2 + ligne.top;
    
    // Point de clic (approximatif au milieu)
    const pointX = pointer.x;
    const pointY = pointer.y;
    
    // Propriétés de la ligne originale
    const props = {
      stroke: ligne.stroke,
      strokeWidth: ligne.strokeWidth,
      strokeDashArray: ligne.strokeDashArray,
      strokeLineCap: ligne.strokeLineCap,
      customType: ligne.customType,
      strokeUniform: ligne.strokeUniform,
      hasBorders: true,
      hasControls: true,
      cornerSize: 12,
      cornerColor: ligne.stroke,
      cornerStyle: 'circle',
      transparentCorners: false
    };
    
    // Créer deux nouvelles lignes
    const ligne1 = new fabric.Line([x1, y1, pointX, pointY], props);
    const ligne2 = new fabric.Line([pointX, pointY, x2, y2], props);
    
    // Créer un point de contrôle déplaçable au milieu
    const point = new fabric.Circle({
      left: pointX,
      top: pointY,
      radius: 6,
      fill: ligne.stroke,
      stroke: 'white',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
      hasControls: false,
      hasBorders: false,
      hoverCursor: 'move',
      customType: 'point-controle',
      linkedLines: [ligne1, ligne2] // Référence aux lignes connectées
    });
    
    // Quand le point bouge, mettre à jour les lignes
    point.on('moving', () => {
      ligne1.set({ x2: point.left, y2: point.top });
      ligne2.set({ x1: point.left, y1: point.top });
      canvas.renderAll();
    });
    
    // Supprimer l'ancienne ligne
    canvas.remove(ligne);
    
    // Ajouter les nouvelles
    canvas.add(ligne1);
    canvas.add(ligne2);
    canvas.add(point);
    
    canvas.renderAll();
    exporterPlan(canvas);
  };
  
  const cacherTooltipValidation = () => {
    const panel = validationTooltipRef.current;
    if (panel) {
      panel.style.display = 'none';
    }
  };

  const afficherMessagesValidation = (arbreGroup) => {
    const messages = arbreGroup.validationMessages || [];
    const conseils = arbreGroup.validationConseils || [];
    const status = arbreGroup.validationStatus || 'ok';
    const arbre = arbreGroup.arbreData;
    
    let titre = '';
    
    if (status === 'error') {
      titre = '❌ PROBLÈMES DÉTECTÉS';
    } else if (status === 'warning') {
      titre = '⚠️ AVERTISSEMENTS';
    } else {
      titre = '✅ POSITION VALIDE';
    }
    
    let messageText = `${arbre?.name || 'Arbre'}\n`;
    messageText += `${arbre?.envergure || '?'}m (envergure) × ${arbre?.tailleMaturite || '?'} (hauteur)\n\n`;
    messageText += `${titre}\n`;
    messageText += messages.join('\n');
    
    if (conseils.length > 0) {
      messageText += '\n\n💡 CONSEILS :\n' + conseils.join('\n');
    }
    
    // Afficher dans un alert pour le moment (on pourrait faire mieux plus tard)
    alert(messageText);
  };

  const supprimerObjetActif = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const actif = canvas.getActiveObject();
    if (actif && !actif.locked && !actif.isGridLine && !actif.isBoussole) {
      canvas.remove(actif);
      canvas.renderAll();
      exporterPlan(canvas);
    } else if (actif && actif.locked) {
      alert('⚠️ Objet verrouillé - Déverrouillez d\'abord');
    }
    cacherMenuContextuel();
  };

  const toggleVerrouObjetActif = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const actif = canvas.getActiveObject();
    if (!actif || actif.isGridLine || actif.isBoussole) return;
    
    if (actif.locked) {
      // Déverrouiller
      actif.locked = false;
      actif.lockMovementX = false;
      actif.lockMovementY = false;
      actif.lockScalingX = false;
      actif.lockScalingY = false;
      actif.lockRotation = false;
      actif.hasControls = true;
      
      if (actif.originalStroke) {
        actif.stroke = actif.originalStroke;
        actif.strokeWidth = (actif.strokeWidth || 3) - 1;
        delete actif.originalStroke;
      }
      if (actif.originalFill) {
        actif.fill = actif.originalFill;
        delete actif.originalFill;
      }
    } else {
      // Verrouiller
      actif.locked = true;
      actif.lockMovementX = true;
      actif.lockMovementY = true;
      actif.lockScalingX = true;
      actif.lockScalingY = true;
      actif.lockRotation = true;
      actif.hasControls = false;
      
      if (actif.stroke) {
        actif.originalStroke = actif.stroke;
        actif.stroke = '#ff9800';
        actif.strokeWidth = (actif.strokeWidth || 2) + 1;
      } else if (actif.fill) {
        actif.originalFill = actif.fill;
        // Assombrir légèrement
        actif.fill = actif.fill.replace('0.3', '0.2').replace('0.4', '0.3');
      }
    }
    
    canvas.renderAll();
    cacherMenuContextuel();
    
    // Re-sélectionner pour montrer le nouveau menu
    setTimeout(() => {
      canvas.setActiveObject(actif);
      afficherMenuContextuel(actif, canvas);
      canvas.renderAll();
    }, 100);
  };

  // Fonction pour trouver une position valide pour un arbre
  const trouverPositionValide = (canvas, arbre, largeur, hauteur, index) => {
    // Extraire les distances minimales depuis les données de l'arbre
    const distanceFondations = parseFloat(arbre.reglementation?.distancesLegales?.infrastructures?.fondations?.split('m')[0] || '5');
    const distanceCanalisations = parseFloat(arbre.reglementation?.distancesLegales?.infrastructures?.canalisations?.split('m')[0] || '4');
    const distanceCloture = parseFloat(arbre.reglementation?.distancesLegales?.voisinage?.distance?.split('m')[0] || '2');
    const distanceEntreArbres = parseFloat(arbre.reglementation?.distancesLegales?.entreArbres?.distance?.split('m')[0] || '5');
    
    // Récupérer tous les objets existants
    const maison = canvas.getObjects().find(obj => obj.customType === 'maison');
    const canalisations = canvas.getObjects().filter(obj => obj.customType === 'canalisation');
    const clotures = canvas.getObjects().filter(obj => obj.customType === 'cloture');
    const autresArbres = canvas.getObjects().filter(obj => obj.customType === 'arbre-a-planter' || obj.customType === 'arbre-existant');
    
    // Grille de recherche (tous les 2m)
    const pasGrille = 2 * echelle;
    const positions = [];
    
    for (let x = 100; x < canvas.width - 100; x += pasGrille) {
      for (let y = 100; y < canvas.height - 100; y += pasGrille) {
        let valide = true;
        
        // Vérifier distance avec la maison
        if (maison) {
          const distMaison = calculerDistanceRectangle(x, y, maison);
          if (distMaison < distanceFondations * echelle) {
            valide = false;
            continue;
          }
        }
        
        // Vérifier distance avec les canalisations
        for (const canal of canalisations) {
          const distCanal = calculerDistanceLigne(x, y, canal);
          if (distCanal < distanceCanalisations * echelle) {
            valide = false;
            break;
          }
        }
        if (!valide) continue;
        
        // Vérifier distance avec les clôtures
        for (const cloture of clotures) {
          const distCloture = calculerDistanceLigne(x, y, cloture);
          if (distCloture < distanceCloture * echelle) {
            valide = false;
            break;
          }
        }
        if (!valide) continue;
        
        // Vérifier distance avec les autres arbres
        for (const autreArbre of autresArbres) {
          const dx = x - autreArbre.left;
          const dy = y - autreArbre.top;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < distanceEntreArbres * echelle) {
            valide = false;
            break;
          }
        }
        if (!valide) continue;
        
        // Calculer un score pour cette position (plus c'est haut, mieux c'est)
        let score = 0;
        
        // Préférer le centre du terrain
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const distFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        score += (1000 - distFromCenter); // Plus près du centre = mieux
        
        // Préférer loin des obstacles
        if (maison) {
          const distMaison = calculerDistanceRectangle(x, y, maison);
          score += distMaison; // Plus loin = mieux
        }
        
        // Préférer loin des autres arbres (éviter regroupement)
        autresArbres.forEach(autreArbre => {
          const dx = x - autreArbre.left;
          const dy = y - autreArbre.top;
          const dist = Math.sqrt(dx * dx + dy * dy);
          score += dist * 0.5; // Bonus distance
        });
        
        positions.push({ x, y, score });
      }
    }
    
    // Si aucune position valide, placer en diagonale par défaut (visible mais clairement invalide)
    if (positions.length === 0) {
      logger.warn('Placement', `Aucune position valide pour ${arbre.name}`, { index });
      return {
        x: 150 + (index * 200),
        y: 150 + (index * 150)
      };
    }
    
    // Trier par score (meilleur en premier) et prendre la meilleure
    positions.sort((a, b) => b.score - a.score);
    logger.debug('Placement', `${positions.length} positions valides trouvées pour ${arbre.name}`, {
      meilleure: positions[0],
      score: positions[0].score.toFixed(0)
    });
    return positions[0];
  };
  
  // Fonction helper : distance entre un point et un rectangle
  const calculerDistanceRectangle = (px, py, rect) => {
    const rx = rect.left;
    const ry = rect.top;
    const rw = rect.getScaledWidth();
    const rh = rect.getScaledHeight();
    
    const dx = Math.max(rx - px, 0, px - (rx + rw));
    const dy = Math.max(ry - py, 0, py - (ry + rh));
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  // Fonction helper : distance entre un point et une ligne
  const calculerDistanceLigne = (px, py, ligne) => {
    const x1 = ligne.x1 + ligne.left;
    const y1 = ligne.y1 + ligne.top;
    const x2 = ligne.x2 + ligne.left;
    const y2 = ligne.y2 + ligne.top;
    
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    const param = lenSq !== 0 ? dot / lenSq : -1;
    
    let xx, yy;
    
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
    
    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Valider la position d'un arbre et changer sa couleur + ajouter tooltip
  const validerPositionArbre = (canvas, arbreGroup) => {
    const arbre = arbreGroup.arbreData;
    if (!arbre) return;
    
    logger.debug('Validation', `Validation arbre: ${arbre.name}`, { arbreId: arbre.id });
    
    // Extraire les distances minimales depuis les données réglementaires
    const distanceFondations = parseFloat(arbre.reglementation?.distancesLegales?.infrastructures?.fondations?.split('m')[0] || '5');
    const distanceCanalisations = parseFloat(arbre.reglementation?.distancesLegales?.infrastructures?.canalisations?.split('m')[0] || '4');
    const distanceCloture = parseFloat(arbre.reglementation?.distancesLegales?.voisinage?.distance?.split('m')[0] || '2');
    const distanceEntreArbres = parseFloat(arbre.reglementation?.distancesLegales?.entreArbres?.distance?.split('m')[0] || '5');
    const distanceTerrasse = parseFloat(arbre.reglementation?.distancesLegales?.infrastructures?.terrasse?.split('m')[0] || '3');
    const distancePiscine = parseFloat(arbre.reglementation?.distancesLegales?.infrastructures?.piscine?.split('m')[0] || '4');
    
    // Données supplémentaires pour validation
    const systemeRacinaire = arbre.reglementation?.systemeRacinaire?.agressivite || 'Modérée';
    const exposition = arbre.exposition || '';
    const solType = arbre.sol?.type || '';
    
    const problemes = [];
    const avertissements = [];
    const conseils = [];
    
    const x = arbreGroup.left;
    const y = arbreGroup.top;
    
    // Vérifier maison/fondations (validation 3D : profondeur)
    const maison = canvas.getObjects().find(obj => obj.customType === 'maison');
    if (maison) {
      const distMaison = calculerDistanceRectangle(x, y, maison) / echelle;
      const profondeurFondations = maison.profondeurFondations || 1.2;
      
      // Si les racines descendent plus profond que les fondations
      if (profondeurRacines > profondeurFondations && distMaison < distanceFondations) {
        problemes.push(`🏠 CRITIQUE: Racines (${profondeurRacines}m prof.) dépassent fondations (${profondeurFondations}m) à ${distMaison.toFixed(1)}m`);
      } else if (distMaison < distanceFondations) {
        problemes.push(`🏠 Trop près de la maison (${distMaison.toFixed(1)}m < ${distanceFondations}m requis)`);
      } else if (distMaison < distanceFondations + 1) {
        avertissements.push(`🏠 Proche de la maison (${distMaison.toFixed(1)}m, ${distanceFondations}m recommandé)`);
      }
    }
    
    // Vérifier canalisations (validation 3D : profondeur)
    const canalisations = canvas.getObjects().filter(obj => obj.customType === 'canalisation');
    for (const canal of canalisations) {
      const distCanal = calculerDistanceLigne(x, y, canal) / echelle;
      const profondeurCanal = canal.profondeur || 0.6;
      
      // Si les racines descendent plus profond que la canalisation
      if (profondeurRacines > profondeurCanal && distCanal < distanceCanalisations) {
        problemes.push(`🚰 CRITIQUE: Racines (${profondeurRacines}m) dépassent canalisation (${profondeurCanal}m) à ${distCanal.toFixed(1)}m - Risque colmatage`);
      } else if (distCanal < distanceCanalisations) {
        problemes.push(`🚰 Trop près d'une canalisation (${distCanal.toFixed(1)}m < ${distanceCanalisations}m requis)`);
      } else if (distCanal < distanceCanalisations + 0.5) {
        avertissements.push(`🚰 Proche canalisation (${distCanal.toFixed(1)}m)`);
      }
    }
    
    // Vérifier clôtures/limites (DISTANCE LÉGALE VOISINAGE - Code Civil Art. 671)
    const clotures = canvas.getObjects().filter(obj => obj.customType === 'cloture');
    
    // Extraire le diamètre du tronc (si disponible, sinon estimation à 30cm)
    const diametreTronc = 0.3; // 30cm par défaut (estimation adulte)
    const rayonTronc = diametreTronc / 2;
    
    for (const cloture of clotures) {
      const distCloture = calculerDistanceLigne(x, y, cloture) / echelle;
      
      // Le TRONC ne doit pas dépasser la clôture (limite interne propriété)
      if (distCloture < rayonTronc) {
        problemes.push(`⚖️ ILLÉGAL: Tronc dépasse votre limite de propriété (${distCloture.toFixed(1)}m < ${rayonTronc.toFixed(1)}m) - Voisin peut exiger arrachage`);
      }
      // L'arbre entier (branches) doit respecter la distance légale voisinage
      else if (distCloture < distanceCloture) {
        const articleLoi = arbre.reglementation?.distancesLegales?.voisinage?.regle || 'Code Civil Art. 671';
        const sanction = arbre.reglementation?.distancesLegales?.voisinage?.sanction || 'Voisin peut exiger arrachage';
        problemes.push(`⚖️ DISTANCE LÉGALE NON RESPECTÉE: ${distCloture.toFixed(1)}m < ${distanceCloture}m requis (${articleLoi}) - ${sanction}`);
      } else if (distCloture < distanceCloture + 0.5) {
        avertissements.push(`⚠️ Proche limite voisinage (${distCloture.toFixed(1)}m, ${distanceCloture}m légal minimum)`);
      }
    }
    
    // Vérifier citernes/fosses septiques (validation 3D critique)
    const citernes = canvas.getObjects().filter(obj => obj.customType === 'citerne');
    const distanceFosseSeptique = parseFloat(arbre.reglementation?.distancesLegales?.infrastructures?.fossesSeptiques?.split('m')[0] || '6');
    
    for (const citerne of citernes) {
      const distCiterne = calculerDistanceRectangle(x, y, citerne) / echelle;
      const profondeurCiterne = citerne.profondeur || 2.5;
      
      // Si les racines atteignent la profondeur de la citerne
      if (profondeurRacines > profondeurCiterne && distCiterne < distanceFosseSeptique) {
        problemes.push(`💧 DANGER: Racines (${profondeurRacines}m) atteignent citerne (${profondeurCiterne}m) - Risque contamination`);
      } else if (distCiterne < distanceFosseSeptique) {
        problemes.push(`💧 Trop près fosse septique (${distCiterne.toFixed(1)}m < ${distanceFosseSeptique}m légal)`);
      }
    }
    
    // Vérifier terrasses/pavés
    const terrasses = canvas.getObjects().filter(obj => obj.customType === 'paves');
    for (const terrasse of terrasses) {
      const distTerrasse = calculerDistanceRectangle(x, y, terrasse) / echelle;
      if (distTerrasse < distanceTerrasse) {
        avertissements.push(`🏡 Proche d'une terrasse (${distTerrasse.toFixed(1)}m < ${distanceTerrasse}m recommandé)`);
      }
    }
    
    // Vérifier autres arbres
    const autresArbres = canvas.getObjects().filter(obj => 
      (obj.customType === 'arbre-a-planter' || obj.customType === 'arbre-existant') && obj !== arbreGroup
    );
    for (const autreArbre of autresArbres) {
      const dx = (x - autreArbre.left) / echelle;
      const dy = (y - autreArbre.top) / echelle;
      const distArbre = Math.sqrt(dx * dx + dy * dy);
      if (distArbre < distanceEntreArbres) {
        problemes.push(`🌳 Trop près d'un autre arbre (${distArbre.toFixed(1)}m < ${distanceEntreArbres}m requis)`);
      } else if (distArbre < distanceEntreArbres + 1) {
        avertissements.push(`🌳 Proche d'un autre arbre (${distArbre.toFixed(1)}m)`);
      }
    }
    
    // Vérifier la compatibilité avec le sol
    const profondeurRacines = parseFloat(arbre.reglementation?.systemeRacinaire?.profondeur?.split('-')[0] || '1');
    const profondeurTerreVegetale = couchesSol[0].profondeur / 100; // Convertir cm en m
    const typeSolProfondeur = couchesSol[1].type;
    
    if (profondeurRacines > profondeurTerreVegetale) {
      const profondeurManquante = profondeurRacines - profondeurTerreVegetale;
      if (typeSolProfondeur === 'calcaire' && arbre.sol?.ph?.includes('acide')) {
        avertissements.push(`🌍 Sol calcaire en profondeur (${couchesSol[1].profondeur}cm) : cet arbre préfère sol acide (pH ${arbre.sol.ph})`);
      } else if (typeSolProfondeur === 'rocheux' && profondeurRacines > 1) {
        problemes.push(`⛰️ Sol rocheux à ${profondeurTerreVegetale}m : racines atteignent ${profondeurRacines}m (croissance limitée)`);
      } else if (typeSolProfondeur === 'argileux' && arbre.sol?.type?.includes('drainé')) {
        avertissements.push(`🌍 Sol argileux en profondeur : drainage peut être insuffisant pour cet arbre`);
      }
    }
    
    // Ajouter des conseils basés sur les caractéristiques de l'arbre
    if (systemeRacinaire === 'Élevée' || systemeRacinaire === 'Forte') {
      conseils.push(`⚠️ Système racinaire ${systemeRacinaire.toLowerCase()} : privilégier éloignement maximal des infrastructures`);
    }
    
    if (exposition.includes('Soleil') && orientation === 'nord-bas') {
      conseils.push(`☀️ Cet arbre aime le soleil : le placer au sud du terrain pour exposition maximale`);
    }
    
    if (arbre.arrosage?.includes('Régulier') || arbre.arrosage?.includes('Abondant')) {
      conseils.push(`💧 Arrosage ${arbre.arrosage.split('.')[0].toLowerCase()} : éviter trop loin du point d'eau`);
    }
    
    if (arbre.sol?.humidite?.includes('Frais') || arbre.sol?.humidite?.includes('Humide')) {
      conseils.push(`💧 Préfère sol frais : éviter zones sèches ou en hauteur`);
    }
    
    // Conseil sur la composition du sol
    conseils.push(`🌍 Sol actuel : ${profondeurTerreVegetale}m de terre végétale, puis ${couchesSol[1].nom.toLowerCase()}`);
    
    // Changer la couleur de l'ellipse
    const ellipse = arbreGroup.item(0); // Premier élément = ellipse
    if (problemes.length > 0) {
      ellipse.set({
        fill: 'rgba(244, 67, 54, 0.4)', // Rouge
        stroke: '#c62828'
      });
      arbreGroup.validationStatus = 'error';
      arbreGroup.validationMessages = problemes;
      arbreGroup.validationConseils = conseils;
    } else if (avertissements.length > 0) {
      ellipse.set({
        fill: 'rgba(255, 152, 0, 0.4)', // Orange
        stroke: '#e65100'
      });
      arbreGroup.validationStatus = 'warning';
      arbreGroup.validationMessages = avertissements;
      arbreGroup.validationConseils = conseils;
    } else {
      ellipse.set({
        fill: 'rgba(129, 199, 132, 0.4)', // Vert
        stroke: '#2e7d32'
      });
      arbreGroup.validationStatus = 'ok';
      arbreGroup.validationMessages = ['✅ Position conforme à toutes les règles'];
      arbreGroup.validationConseils = conseils;
    }
    
    canvas.renderAll();
  };

  // Calculer la taille d'un arbre selon l'année de projection
  const calculerTailleSelonAnnee = (arbre, annee) => {
    // Tailles à la plantation (jeune plant) - Valeurs configurables
    const hauteurPlantation = 2.0;    // 2m à la plantation (jeune plant standard)
    const envergurePlantation = 0.8;  // 0.8m couronne initiale
    const diametreTroncPlantation = 0.05; // 5cm de diamètre
    
    // Extraire taille à maturité
    const envergureStr = arbre.envergure || '5';
    const envergureMax = parseFloat(envergureStr.split('-').pop());
    const hauteurStr = arbre.tailleMaturite || '5';
    const hauteurMax = parseFloat(hauteurStr.split('-').pop().replace('m', '').trim());
    
    // Diamètre tronc adulte (estimation basée sur hauteur et type d'arbre)
    // Arbres élancés (>8m) : tronc plus fin relatif
    // Arbres trapus (<5m) : tronc plus épais relatif
    let diametreTroncMax;
    if (hauteurMax > 8) {
      diametreTroncMax = Math.min(0.5, hauteurMax * 0.05); // 5% pour grands arbres
    } else if (hauteurMax < 5) {
      diametreTroncMax = Math.min(0.4, hauteurMax * 0.08); // 8% pour arbustes
    } else {
      diametreTroncMax = Math.min(0.6, hauteurMax * 0.06); // 6% standard
    }
    
    // Extraire vitesse de croissance (cm/an) et type de croissance
    const croissanceStr = arbre.croissance || 'Moyenne (30-40 cm/an)';
    
    // Détecter le type de croissance
    let typeCroissance = 'moyenne';
    let vitesseCroissance = 30; // Par défaut
    let coefficientEnvergure = 1.0; // Coefficient pour l'envergure
    
    if (croissanceStr.toLowerCase().includes('rapide') || croissanceStr.toLowerCase().includes('vigoureuse')) {
      typeCroissance = 'rapide';
      vitesseCroissance = 50; // 50cm/an par défaut pour rapide
      coefficientEnvergure = 1.2; // Envergure se développe plus vite
    } else if (croissanceStr.toLowerCase().includes('lente') || croissanceStr.toLowerCase().includes('lent')) {
      typeCroissance = 'lente';
      vitesseCroissance = 20; // 20cm/an par défaut pour lente
      coefficientEnvergure = 0.8; // Envergure se développe moins vite
    }
    
    // Extraire les valeurs numériques si présentes
    const match = croissanceStr.match(/(\d+)-?(\d*)\s*cm/);
    if (match) {
      vitesseCroissance = match[2] ? (parseInt(match[1]) + parseInt(match[2])) / 2 : parseInt(match[1]);
    }
    
    // Années pour atteindre maturité (estimation basée sur hauteur)
    const anneesMaturite = Math.max(5, Math.min(30, (hauteurMax - hauteurPlantation) / (vitesseCroissance / 100))) || 20;
    
    // Années pour atteindre maturité envergure (peut être différent)
    const anneesMaturiteEnvergure = anneesMaturite * coefficientEnvergure;
    
    // Calculer les pourcentages de croissance (peuvent être différents pour hauteur/envergure)
    let pourcentageHauteur = 0;
    let pourcentageEnvergure = 0;
    
    // HAUTEUR : Croissance selon type
    if (annee >= anneesMaturite) {
      pourcentageHauteur = 1.0;
    } else if (annee > 0) {
      pourcentageHauteur = annee / anneesMaturite;
    }
    
    // ENVERGURE : Croissance plus rapide ou lente selon type
    if (annee >= anneesMaturiteEnvergure) {
      pourcentageEnvergure = 1.0;
    } else if (annee > 0) {
      pourcentageEnvergure = annee / anneesMaturiteEnvergure;
      
      // Correction : envergure ne doit pas dépasser 100%
      if (pourcentageEnvergure > 1.0) pourcentageEnvergure = 1.0;
    }
    
    // TRONC : Croissance proportionnelle à la hauteur (ralentit avec l'âge)
    // Les premières années, tronc pousse vite, puis ralentit
    const pourcentageTronc = pourcentageHauteur > 0 ? Math.sqrt(pourcentageHauteur) : 0;
    
    // Taille actuelle selon l'année (interpolation adaptée au type)
    const hauteurActuelle = hauteurPlantation + (hauteurMax - hauteurPlantation) * pourcentageHauteur;
    const envergureActuelle = envergurePlantation + (envergureMax - envergurePlantation) * pourcentageEnvergure;
    const diametreTroncActuel = diametreTroncPlantation + (diametreTroncMax - diametreTroncPlantation) * pourcentageTronc;
    
    // Conversion en pixels
    const largeur = envergureActuelle * echelle;
    const hauteur = hauteurActuelle * echelle;
    
    return { 
      largeur, 
      hauteur, 
      pourcentage: pourcentageHauteur, // Pour compatibilité
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

  // Ajouter les arbres à planter automatiquement au démarrage
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || arbresAPlanter.length === 0) {
      logger.warn('CanvasTerrain', 'Arbres non ajoutés', { 
        canvasExiste: !!canvas, 
        nbArbres: arbresAPlanter.length 
      });
      return;
    }
    
    logger.info('CanvasTerrain', `Ajout de ${arbresAPlanter.length} arbres`, {
      arbres: arbresAPlanter.map(a => a.name)
    });
    
    // Attendre que le plan par défaut soit chargé avant d'ajouter les arbres
    setTimeout(() => {
      // Vérifier si les arbres sont déjà sur le canvas
      const arbresExistants = canvas.getObjects().filter(obj => obj.customType === 'arbre-a-planter');
      
      // Comparer les IDs pour voir si la liste a changé
      const idsExistants = arbresExistants.map(a => a.arbreData?.id).sort().join(',');
      const idsAPlanter = arbresAPlanter.map(a => a.id).sort().join(',');
      
      logger.debug('CanvasTerrain', `Arbres: existants=${arbresExistants.length} à_planter=${arbresAPlanter.length}`);
      logger.debug('CanvasTerrain', `IDs: existants="${idsExistants}" vs à_planter="${idsAPlanter}"`);
      
      // Si les listes sont EXACTEMENT identiques, ne rien faire
      if (idsExistants === idsAPlanter && arbresExistants.length === arbresAPlanter.length) {
        logger.info('CanvasTerrain', `✅ Mêmes ${arbresAPlanter.length} arbres déjà présents, skip`);
        return;
      }
      
      // Sinon, supprimer TOUS les anciens arbres et ajouter les nouveaux
      logger.warn('CanvasTerrain', `🔄 Liste changée: ${arbresExistants.length} → ${arbresAPlanter.length} arbres`);
      arbresExistants.forEach(a => {
        logger.debug('Suppression', `Retrait: ${a.arbreData?.name || 'inconnu'}`);
        canvas.remove(a);
      });

      // Ajouter chaque arbre avec sa taille réelle (ellipse : largeur = envergure, hauteur = hauteur)
      logger.info('Ajout', `🌳 Début ajout arbre ${arbresAPlanter.length} arbres`);
    
    arbresAPlanter.forEach((arbre, index) => {
      logger.debug('Ajout', `Traitement arbre ${index + 1}/${arbresAPlanter.length}: ${arbre.name}`);
      
      // Calculer taille selon année de projection
      const tailles = calculerTailleSelonAnnee(arbre, anneeProjection);
      const largeur = tailles.largeur;
      const hauteur = tailles.hauteur;
      
      logger.debug('Ajout', `Tailles calculées: ${largeur.toFixed(0)}×${hauteur.toFixed(0)}px`);
      
      // Trouver une position valide qui respecte toutes les contraintes
      const position = trouverPositionValide(canvas, arbre, largeur, hauteur, index);
      const offsetX = position.x;
      const offsetY = position.y;
      
      logger.debug('Ajout', `Position trouvée: (${offsetX.toFixed(0)}, ${offsetY.toFixed(0)})`);

      // Ellipse (largeur = envergure, hauteur = hauteur de l'arbre)
      const ellipse = new fabric.Ellipse({
        left: 0,
        top: 0,
        rx: largeur / 2,  // Rayon horizontal (envergure/2)
        ry: hauteur / 2,  // Rayon vertical (hauteur/2)
        fill: 'rgba(129, 199, 132, 0.4)',
        stroke: '#2e7d32',
        strokeWidth: 3,
        originX: 'center',
        originY: 'center'
      });

      // Emoji au centre
      const emoji = new fabric.Text('🌳', {
        left: 0,
        top: 0,
        fontSize: Math.min(largeur, hauteur) * 0.3,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false
      });

      // Nom en dessous
      const label = new fabric.Text(arbre.name, {
        left: 0,
        top: hauteur / 2 + 10,
        fontSize: 12,
        fontWeight: 'bold',
        fill: '#1b5e20',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 4,
        originX: 'center',
        originY: 'top',
        selectable: false,
        evented: false
      });
      
      // Dimensions affichées (envergure × hauteur)
      const iconeType = tailles.typeCroissance === 'rapide' ? '⚡' : tailles.typeCroissance === 'lente' ? '🐌' : '🌿';
      const dimensions = new fabric.Text(`${tailles.envergureMax}m × ${tailles.hauteurMax}m ${iconeType}`, {
        left: 0,
        top: -hauteur / 2 - 20,
        fontSize: 10,
        fill: '#666',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 2,
        originX: 'center',
        originY: 'bottom',
        selectable: false,
        evented: false
      });

      const group = new fabric.Group([ellipse, emoji, label, dimensions], {
        left: offsetX,
        top: offsetY,
        originX: 'center',
        originY: 'center',
        customType: 'arbre-a-planter',
        arbreData: arbre
      });

      canvas.add(group);
      logger.info('Ajout', `✅ Arbre ${index + 1}/${arbresAPlanter.length} ajouté: ${arbre.name}`, { 
        position: { x: offsetX.toFixed(0), y: offsetY.toFixed(0) },
        tailles: { envergure: tailles.envergureActuelle.toFixed(1), hauteur: tailles.hauteurActuelle.toFixed(1) }
      });
      
      // Valider la position initiale
      validerPositionArbre(canvas, group);
    });

    // IMPORTANT: Forcer le rendu complet après ajout de tous les arbres
    canvas.renderAll();
    canvas.requestRenderAll();
    ajouterMesuresLive(canvas);
    afficherZonesContraintes(canvas);
    
    // Log final pour vérifier le nombre réel d'arbres sur le canvas
    const arbresFinaux = canvas.getObjects().filter(obj => obj.customType === 'arbre-a-planter');
    logger.info('CanvasTerrain', `🎯 FINAL: ${arbresFinaux.length}/${arbresAPlanter.length} arbres sur canvas`, {
      ids: arbresFinaux.map(a => a.arbreData?.name).join(', ')
    });
    }, 500); // Attendre 500ms pour que le plan par défaut soit chargé
  }, [arbresAPlanter.map(a => a.id).join(',')]); // Réagir quand la liste d'IDs change

  // Mettre à jour les dimensions du canvas quand elles changent
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.setWidth(Math.min(dimensions.largeur * echelle, 800));
    canvas.setHeight(Math.min(dimensions.hauteur * echelle, 600));
    
    // Supprimer et recréer la grille, boussole, sol, dimensions et bouton aide
    canvas.getObjects().forEach(obj => {
      if (obj.isGridLine || obj.isBoussole || obj.isSolIndicator || obj.isDimensionBox || obj.isAideButton) canvas.remove(obj);
    });
    ajouterGrille(canvas);
    ajouterIndicateurSud(canvas);
    canvas.renderAll();
  }, [dimensions.largeur, dimensions.hauteur]);

  const afficherGuideTemporaire = (canvas, type, position) => {
    // Supprimer les anciens guides
    canvas.getObjects().forEach(obj => {
      if (obj.alignmentGuide) canvas.remove(obj);
    });

    if (type === 'horizontal') {
      const line = new fabric.Line([0, position, canvas.width, position], {
        stroke: '#ff5722',
        strokeWidth: 1,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
        alignmentGuide: true,
        opacity: 0.8
      });
      canvas.add(line);
    } else if (type === 'vertical') {
      const line = new fabric.Line([position, 0, position, canvas.height], {
        stroke: '#ff5722',
        strokeWidth: 1,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
        alignmentGuide: true,
        opacity: 0.8
      });
      canvas.add(line);
    }
    canvas.renderAll();
  };


  // Créer un plan par défaut
  const creerPlanParDefaut = (canvas) => {
    // Clôture rectangulaire qui utilise presque tout l'espace disponible
    const margin = 50; // Marge de 50px de chaque côté
    const terrainLargeur = canvas.width - (margin * 2);
    const terrainHauteur = canvas.height - (margin * 2);
    const marginX = margin;
    const marginY = margin;
    
    // 4 côtés de la clôture
    const clotures = [
      // Haut
      { x1: marginX, y1: marginY, x2: marginX + terrainLargeur, y2: marginY },
      // Droite
      { x1: marginX + terrainLargeur, y1: marginY, x2: marginX + terrainLargeur, y2: marginY + terrainHauteur },
      // Bas
      { x1: marginX + terrainLargeur, y1: marginY + terrainHauteur, x2: marginX, y2: marginY + terrainHauteur },
      // Gauche
      { x1: marginX, y1: marginY + terrainHauteur, x2: marginX, y2: marginY }
    ];
    
    clotures.forEach(coords => {
      const cloture = new fabric.Line([coords.x1, coords.y1, coords.x2, coords.y2], {
        stroke: '#ffd54f',
        strokeWidth: 3,
        strokeDashArray: [10, 5],
        strokeLineCap: 'round',
        customType: 'cloture',
        strokeUniform: true,
        hasBorders: true,
        hasControls: true,
        cornerSize: 12,
        cornerColor: '#ffd54f',
        cornerStyle: 'circle',
        transparentCorners: false
      });
      canvas.add(cloture);
    });
    
    // Maison 10m x 10m au centre-gauche
    const maisonSize = 10 * echelle;
    const maisonX = marginX + terrainLargeur * 0.25 - maisonSize / 2;
    const maisonY = marginY + terrainHauteur / 2 - maisonSize / 2;
    
    const maison = new fabric.Rect({
      left: maisonX,
      top: maisonY,
      width: maisonSize,
      height: maisonSize,
      fill: '#bdbdbd',
      stroke: '#424242',
      strokeWidth: 2,
      customType: 'maison'
    });
    
    const maisonLabel = new fabric.Text('🏠', {
      left: maisonX + maisonSize / 2,
      top: maisonY + maisonSize / 2,
      fontSize: 32,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false
    });
    
    const maisonGroup = new fabric.Group([maison, maisonLabel], {
      customType: 'maison'
    });
    canvas.add(maisonGroup);
    
    // Créer le motif pour pavés (fonction réutilisable)
    const creerMotifPaves = () => {
      const patternCanvas = document.createElement('canvas');
      patternCanvas.width = 20;
      patternCanvas.height = 20;
      const ctx = patternCanvas.getContext('2d');
      ctx.fillStyle = '#9ccc65';
      ctx.fillRect(0, 0, 20, 20);
      ctx.fillStyle = '#bdbdbd';
      ctx.fillRect(0, 0, 8, 8);
      ctx.fillRect(12, 12, 8, 8);
      
      return new fabric.Pattern({
        source: patternCanvas,
        repeat: 'repeat'
      });
    };
    
    // Pavés enherbés 5m x 5m en bas de la maison (qui la touchent)
    const paveSize = 5 * echelle;
    const paveX = maisonX + maisonSize / 2 - paveSize / 2; // Centré sous la maison
    const paveY = maisonY + maisonSize; // Juste en dessous de la maison
    
    const paves = new fabric.Rect({
      left: paveX,
      top: paveY,
      width: paveSize,
      height: paveSize,
      fill: creerMotifPaves(),
      stroke: '#7cb342',
      strokeWidth: 2,
      customType: 'paves'
    });
    canvas.add(paves);
    
    canvas.renderAll();
    const largeurM = (terrainLargeur / echelle).toFixed(0);
    const hauteurM = (terrainHauteur / echelle).toFixed(0);
    logger.info('CanvasTerrain', `Plan défaut créé: ${largeurM}×${hauteurM}m`);
    
    // Afficher les zones de contraintes initiales
    setTimeout(() => afficherZonesContraintes(canvas), 100);
  };

  // Charger automatiquement le plan au démarrage
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Vérifier si le plan par défaut existe déjà (vérifier spécifiquement la maison ou les clôtures)
    const planDefautExiste = canvas.getObjects().some(obj => 
      obj.customType === 'maison' || 
      obj.customType === 'cloture' || 
      obj.customType === 'paves'
    );
    
    if (planDefautExiste) return; // Plan déjà créé

    setTimeout(() => {
      // Toujours charger le plan par défaut
      creerPlanParDefaut(canvas);
    }, 300); // Réduit à 300ms pour être avant les arbres
  }, []);

  // Note: Bouton aide supprimé - Remplacé par Onboarding (bouton ❓ dans header)

  const ajouterBoussole = (canvas) => {
    const size = 70;
    const centerX = canvas.width - size / 2 - 15;
    const centerY = size / 2 + 15;

    // Cercle extérieur (ciel)
    const cercle = new fabric.Circle({
      left: centerX,
      top: centerY,
      radius: size / 2,
      fill: '#e3f2fd',
      stroke: '#1976d2',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false
    });

    // Ligne horizon
    const horizon = new fabric.Line([
      centerX - size / 2, centerY,
      centerX + size / 2, centerY
    ], {
      stroke: '#795548',
      strokeWidth: 2,
      selectable: false,
      evented: false
    });

    // Texte "LEVER" à l'Est (gauche)
    const textLever = new fabric.Text('☀️', {
      left: centerX - size / 2 + 8,
      top: centerY,
      fontSize: 16,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false
    });

    // Texte "COUCHER" à l'Ouest (droite)
    const textCoucher = new fabric.Text('🌙', {
      left: centerX + size / 2 - 8,
      top: centerY,
      fontSize: 16,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false
    });

    // Soleil mobile
    // Position selon orientation : Le soleil se lève à l'Est et se couche à l'Ouest
    // Si Nord = haut, Est = droite, donc lever à droite
    let soleilAngle = 0;
    if (orientation === 'nord-haut') soleilAngle = 90; // Est à droite
    else if (orientation === 'nord-droite') soleilAngle = 180; // Est en bas
    else if (orientation === 'nord-bas') soleilAngle = 270; // Est à gauche
    else if (orientation === 'nord-gauche') soleilAngle = 0; // Est en haut

    const soleilRadius = size / 2 - 8;
    const soleilX = centerX + Math.cos((soleilAngle - 90) * Math.PI / 180) * soleilRadius;
    const soleilY = centerY + Math.sin((soleilAngle - 90) * Math.PI / 180) * soleilRadius;

    const soleil = new fabric.Circle({
      left: soleilX,
      top: soleilY,
      radius: 8,
      fill: '#ffd54f',
      stroke: '#ffa726',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
      selectable: true,
      hasControls: false,
      hasBorders: false,
      lockMovementX: true,
      lockMovementY: true,
      hoverCursor: 'grab',
      isBoussole: true
    });

    // Rotation du soleil au drag
    let isRotating = false;

    soleil.on('mousedown', () => {
      isRotating = true;
    });

    canvas.on('mouse:move', (e) => {
      if (!isRotating) return;
      
      const pointer = canvas.getPointer(e.e);
      const angle = Math.atan2(pointer.y - centerY, pointer.x - centerX) * 180 / Math.PI;
      
      // Positionner le soleil sur le cercle
      const newX = centerX + Math.cos((angle) * Math.PI / 180) * soleilRadius;
      const newY = centerY + Math.sin((angle) * Math.PI / 180) * soleilRadius;
      soleil.set({ left: newX, top: newY });
      
      // Calculer l'orientation basée sur la position du soleil (lever)
      // Le soleil se lève à l'Est
      const normalizedAngle = ((angle + 90) % 360 + 360) % 360;
      let newOrientation;
      
      if (normalizedAngle >= 315 || normalizedAngle < 45) {
        newOrientation = 'nord-gauche'; // Est en haut
      } else if (normalizedAngle >= 45 && normalizedAngle < 135) {
        newOrientation = 'nord-haut'; // Est à droite
      } else if (normalizedAngle >= 135 && normalizedAngle < 225) {
        newOrientation = 'nord-droite'; // Est en bas
      } else {
        newOrientation = 'nord-bas'; // Est à gauche
      }
      
      if (newOrientation !== orientation) {
        onOrientationChange(newOrientation);
      }
      
      canvas.renderAll();
    });

    canvas.on('mouse:up', () => {
      isRotating = false;
    });

    // Label explicatif
    const label = new fabric.Text('Est ↔ Ouest', {
      left: centerX,
      top: centerY + size / 2 + 8,
      fontSize: 9,
      fill: '#666',
      originX: 'center',
      originY: 'top',
      selectable: false,
      evented: false
    });

    canvas.add(cercle);
    canvas.add(horizon);
    canvas.add(textLever);
    canvas.add(textCoucher);
    canvas.add(soleil);
    canvas.add(label);
  };

  const editerCouchesSol = (canvas) => {
    const couche1Prof = prompt('Profondeur de terre végétale (cm, ex: 35.5) :', couchesSol[0].profondeur);
    if (!couche1Prof || isNaN(couche1Prof)) return;
    
    const couche2Prof = prompt('Profondeur de la couche suivante (cm, ex: 75.5) :', couchesSol[1].profondeur);
    if (!couche2Prof || isNaN(couche2Prof)) return;
    
    const couche2Type = prompt('Type de sol en profondeur :\n1 = Marne (argileux)\n2 = Calcaire\n3 = Sableux\n4 = Rocheux', '1');
    
    let nom2 = 'Marne';
    let type2 = 'argileux';
    let couleur2 = '#a1887f';
    
    if (couche2Type === '2') {
      nom2 = 'Calcaire';
      type2 = 'calcaire';
      couleur2 = '#d7ccc8';
    } else if (couche2Type === '3') {
      nom2 = 'Sable';
      type2 = 'sableux';
      couleur2 = '#ffecb3';
    } else if (couche2Type === '4') {
      nom2 = 'Roche';
      type2 = 'rocheux';
      couleur2 = '#78909c';
    }
    
    setCouchesSol([
      { nom: 'Terre végétale', profondeur: parseFloat(couche1Prof), couleur: '#8d6e63', type: 'fertile' },
      { nom: nom2, profondeur: parseFloat(couche2Prof), couleur: couleur2, type: type2 }
    ]);
    
    // Revalider tous les arbres avec la nouvelle composition
    if (canvas) {
      canvas.getObjects().filter(obj => obj.customType === 'arbre-a-planter').forEach(arbre => {
        validerPositionArbre(canvas, arbre);
      });
    }
  };

  const ajouterIndicateurSud = (canvas) => {
    // Position initiale du soleil selon l'orientation (le soleil à midi indique le SUD)
    let soleilX, soleilY;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Le soleil à midi est au SUD
    if (orientation === 'nord-haut') {
      soleilX = centerX;
      soleilY = canvas.height - 60; // Sud en bas
    } else if (orientation === 'nord-droite') {
      soleilX = 60; // Sud à gauche
      soleilY = centerY;
    } else if (orientation === 'nord-bas') {
      soleilX = centerX;
      soleilY = 60; // Sud en haut
    } else { // nord-gauche
      soleilX = canvas.width - 60; // Sud à droite
      soleilY = centerY;
    }

    // Soleil "SUD" (midi) - cercle jaune/orange avec dégradé
    const soleil = new fabric.Circle({
      left: soleilX,
      top: soleilY,
      radius: 20,
      fill: new fabric.Gradient({
        type: 'radial',
        coords: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 0,
          r1: 0,
          r2: 20
        },
        colorStops: [
          { offset: 0, color: '#ffeb3b' },  // Jaune vif au centre
          { offset: 0.7, color: '#ffa726' }, // Orange
          { offset: 1, color: '#ff6f00' }    // Orange foncé au bord
        ]
      }),
      stroke: '#ff6f00',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
      selectable: true,
      hasControls: false,
      hasBorders: false,
      lockScalingX: true,
      lockScalingY: true,
      lockRotation: true,
      hoverCursor: 'move',
      isBoussole: true,
      shadow: new fabric.Shadow({
        color: 'rgba(255, 165, 0, 0.6)',
        blur: 15,
        offsetX: 0,
        offsetY: 0
      })
    });

    // Label "SUD (midi)"
    const label = new fabric.Text('SUD', {
      left: soleilX,
      top: soleilY + 30,
      fontSize: 12,
      fontWeight: 'bold',
      fill: '#ff6f00',
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
      isBoussole: true,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      padding: 3
    });

    // Fonction pour calculer et mettre à jour l'orientation
    const updateOrientation = () => {
      // Mettre à jour la position du label
      label.set({
        left: soleil.left,
        top: soleil.top + 30
      });

      // Calculer le vecteur centre -> soleil (indique le SUD)
      const dx = soleil.left - centerX;
      const dy = soleil.top - centerY;
      
      // Calculer l'angle en degrés
      let angle = Math.atan2(dy, dx) * 180 / Math.PI;
      angle = ((angle % 360) + 360) % 360;
      
      // Déterminer l'orientation (où est le NORD par rapport au SUD)
      let newOrientation;
      if (angle >= 315 || angle < 45) {
        newOrientation = 'nord-gauche'; // Sud à droite = Nord à gauche
      } else if (angle >= 45 && angle < 135) {
        newOrientation = 'nord-haut'; // Sud en bas = Nord en haut
      } else if (angle >= 135 && angle < 225) {
        newOrientation = 'nord-droite'; // Sud à gauche = Nord à droite
      } else {
        newOrientation = 'nord-bas'; // Sud en haut = Nord en bas
      }
      
      if (newOrientation !== orientation) {
        onOrientationChange(newOrientation);
      }
      
      canvas.renderAll();
    };
    
    // Événement pendant le déplacement (feedback visuel)
    soleil.on('moving', updateOrientation);
    
    // Événement à la fin du déplacement (important pour "déposer")
    soleil.on('modified', updateOrientation);
    
    // Événement mouseup pour s'assurer que l'objet se dépose
    soleil.on('mouseup', () => {
      canvas.setActiveObject(null); // Désélectionner pour "déposer"
      updateOrientation();
      canvas.renderAll();
    });

    canvas.add(soleil);
    canvas.add(label);
  };

  const ajouterGrille = (canvas) => {
    const width = canvas.width;
    const height = canvas.height;
    const gridLines = [];

    for (let i = 0; i <= width; i += echelle) {
      const line = new fabric.Line([i, 0, i, height], {
        stroke: '#c8e6c9',
        strokeWidth: i % (echelle * 5) === 0 ? 1.5 : 0.5,
        selectable: false,
        evented: false,
        isGridLine: true
      });
      gridLines.push(line);
    }

    for (let i = 0; i <= height; i += echelle) {
      const line = new fabric.Line([0, i, width, i], {
        stroke: '#c8e6c9',
        strokeWidth: i % (echelle * 5) === 0 ? 1.5 : 0.5,
        selectable: false,
        evented: false,
        isGridLine: true
      });
      gridLines.push(line);
    }

    // Ajouter toutes les lignes de grille en premier (elles seront en arrière-plan)
    gridLines.forEach(line => canvas.add(line));
  };

  const exporterPlan = (canvas) => {
    const objets = canvas.getObjects();
    
    const planData = {
      largeur: dimensions.largeur,
      hauteur: dimensions.hauteur,
      orientation,
      timestamp: Date.now(), // Horodatage pour tracer les sauvegardes
      maison: null,
      canalisations: [],
      arbresExistants: [],
      arbresAPlanter: [],
      terrasses: [],
      paves: [],
      clotures: []
    };

    objets.forEach(obj => {
      if (obj.isGridLine || obj.measureLabel || obj.isBoussole || obj.isSolIndicator || obj.alignmentGuide || obj.isDimensionBox || obj.isAideButton || obj.isImageFond) return;

      if (obj.customType === 'maison') {
        planData.maison = {
          left: obj.left / echelle,
          top: obj.top / echelle,
          width: (obj.getScaledWidth()) / echelle,
          height: (obj.getScaledHeight()) / echelle
        };
      } else if (obj.customType === 'canalisation') {
        planData.canalisations.push({
          x1: obj.x1,
          y1: obj.y1,
          x2: obj.x2,
          y2: obj.y2
        });
      } else if (obj.customType === 'cloture') {
        planData.clotures.push({
          x1: obj.x1,
          y1: obj.y1,
          x2: obj.x2,
          y2: obj.y2
        });
      } else if (obj.customType === 'arbre-existant') {
        planData.arbresExistants.push({
          left: obj.left / echelle,
          top: obj.top / echelle,
          radius: (obj.radius * obj.scaleX) / echelle
        });
      } else if (obj.customType === 'arbre-a-planter') {
        planData.arbresAPlanter.push({
          left: obj.left / echelle,
          top: obj.top / echelle,
          radius: (obj.radius * obj.scaleX) / echelle,
          arbreData: obj.arbreData
        });
      } else if (obj.customType === 'terrasse') {
        planData.terrasses.push({
          left: obj.left / echelle,
          top: obj.top / echelle,
          width: (obj.getScaledWidth()) / echelle,
          height: (obj.getScaledHeight()) / echelle
        });
      } else if (obj.customType === 'paves') {
        planData.paves.push({
          left: obj.left / echelle,
          top: obj.top / echelle,
          width: (obj.getScaledWidth()) / echelle,
          height: (obj.getScaledHeight()) / echelle
        });
      } else if (obj.customType === 'cloture' && obj.type === 'polygon') {
        planData.clotures.push({
          points: obj.points
        });
      }
    });

    localStorage.setItem('planTerrain', JSON.stringify(planData));
    onPlanComplete(planData);
  };

  const ajouterMesuresLive = (canvas) => {
    // Supprimer anciennes mesures
    canvas.getObjects().forEach(obj => {
      if (obj.measureLabel) canvas.remove(obj);
    });

    // Ajouter nouvelles mesures
    canvas.getObjects().forEach(obj => {
      if (obj.isGridLine || obj.measureLabel || obj.isBoussole || obj.isSolIndicator || obj.alignmentGuide || obj.isDimensionBox || obj.isAideButton || obj.isImageFond) return;

      if (obj.customType === 'maison' || obj.customType === 'terrasse' || obj.customType === 'paves') {
        const w = obj.getScaledWidth() / echelle;
        const h = obj.getScaledHeight() / echelle;
        
        // Afficher avec 1 décimale si nécessaire, sinon entier
        const wText = w % 1 === 0 ? w : w.toFixed(1);
        const hText = h % 1 === 0 ? h : h.toFixed(1);
        
        const labelW = new fabric.Text(`${wText}m`, {
          left: obj.left + obj.getScaledWidth() / 2,
          top: obj.top - 15,
          fontSize: 12,
          fill: '#1976d2',
          fontWeight: 'bold',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          originX: 'center',
          selectable: true,
          hasControls: false,
          hasBorders: false,
          lockMovementX: true,
          lockMovementY: true,
          hoverCursor: 'pointer',
          measureLabel: true,
          measureType: 'width',
          targetObject: obj
        });

        labelW.on('mousedown', () => {
          const newValue = prompt('Nouvelle largeur (en mètres, ex: 10.5) :', w);
          if (newValue && !isNaN(newValue)) {
            const newWidth = parseFloat(newValue) * echelle;
            obj.set({ width: newWidth, scaleX: 1 });
            canvas.renderAll();
            ajouterMesuresLive(canvas);
            exporterPlan(canvas);
          }
        });

        canvas.add(labelW);

        const labelH = new fabric.Text(`${hText}m`, {
          left: obj.left + obj.getScaledWidth() + 10,
          top: obj.top + obj.getScaledHeight() / 2,
          fontSize: 12,
          fill: '#1976d2',
          fontWeight: 'bold',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          originY: 'center',
          selectable: true,
          hasControls: false,
          hasBorders: false,
          lockMovementX: true,
          lockMovementY: true,
          hoverCursor: 'pointer',
          measureLabel: true,
          measureType: 'height',
          targetObject: obj
        });

        labelH.on('mousedown', () => {
          const newValue = prompt('Nouvelle hauteur (en mètres, ex: 7.5) :', h);
          if (newValue && !isNaN(newValue)) {
            const newHeight = parseFloat(newValue) * echelle;
            obj.set({ height: newHeight, scaleY: 1 });
            canvas.renderAll();
            ajouterMesuresLive(canvas);
            exporterPlan(canvas);
          }
        });

        canvas.add(labelH);
      } else if (obj.customType === 'arbre-existant' || obj.customType === 'arbre-a-planter') {
        const r = obj.radius * obj.scaleX / echelle;
        const couleur = obj.customType === 'arbre-a-planter' ? '#1b5e20' : '#2e7d32';
        
        // Afficher avec 1 décimale si nécessaire
        const diametre = r * 2;
        const rText = diametre % 1 === 0 ? diametre : diametre.toFixed(1);
        
        const labelR = new fabric.Text(`⌀ ${rText}m`, {
          left: obj.left,
          top: obj.top - obj.radius * obj.scaleX - 15,
          fontSize: 12,
          fill: couleur,
          fontWeight: 'bold',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          originX: 'center',
          selectable: true,
          hasControls: false,
          hasBorders: false,
          lockMovementX: true,
          lockMovementY: true,
          hoverCursor: 'pointer',
          measureLabel: true,
          measureType: 'diameter',
          targetObject: obj
        });

        labelR.on('mousedown', () => {
          const newValue = prompt('Nouveau diamètre (en mètres, ex: 2.5) :', r * 2);
          if (newValue && !isNaN(newValue)) {
            const newRadius = (parseFloat(newValue) / 2) * echelle;
            obj.set({ radius: newRadius, scaleX: 1, scaleY: 1 });
            canvas.renderAll();
            ajouterMesuresLive(canvas);
            exporterPlan(canvas);
          }
        });

        canvas.add(labelR);
      }
    });
    
    canvas.renderAll();
  };

  // Charger une image de fond (plan Kazaplan ou autre)
  const chargerImageFond = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/jpg';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgUrl = event.target.result;
        
        fabric.Image.fromURL(imgUrl, (img) => {
          const canvas = fabricCanvasRef.current;
          if (!canvas) {
            logger.error('ImageFond', 'Canvas non disponible');
            return;
          }
          
          logger.info('ImageFond', 'Image chargée depuis fichier', {
            largeur: img.width,
            hauteur: img.height
          });
          
          // Supprimer l'ancienne image de fond si elle existe
          if (imageFondRef.current) {
            canvas.remove(imageFondRef.current);
            logger.debug('ImageFond', 'Ancienne image supprimée');
          }
          
          // Ajuster la taille pour qu'elle s'adapte au canvas
          const scale = Math.min(
            canvas.width / img.width,
            canvas.height / img.height
          );
          
          logger.debug('ImageFond', 'Calcul échelle', {
            canvasW: canvas.width,
            canvasH: canvas.height,
            imgW: img.width,
            imgH: img.height,
            scale,
            opacite: opaciteImage
          });
          
          img.set({
            left: 0,
            top: 0,
            scaleX: scale,
            scaleY: scale,
            opacity: opaciteImage,
            selectable: true, // Permettre de la déplacer/redimensionner
            hasControls: true,
            hasBorders: true,
            lockRotation: false,
            isImageFond: true, // Marquer comme image de fond
            cornerSize: 12,
            cornerColor: '#2196f3',
            cornerStyle: 'circle',
            transparentCorners: false,
            borderColor: '#2196f3',
            borderScaleFactor: 2,
            evented: true // Permettre interactions
          });
          
          // STRATÉGIE : Mettre TOUT EN BAS (sous la grille)
          canvas.add(img);
          canvas.sendToBack(img);
          
          // S'assurer que l'image est vraiment en position 0 (tout en bas)
          canvas.moveTo(img, 0);
          
          imageFondRef.current = img;
          setImageFondChargee(true);
          
          logger.info('ImageFond', '✅ Image placée en arrière-plan (sous grille)', {
            position: 0,
            totalObjets: canvas.getObjects().length,
            opacite: opaciteImage,
            scale
          });
          
          canvas.renderAll();
          
          // Changer le fond du canvas en transparent pour voir l'image
          canvas.backgroundColor = null;
          canvas.renderAll();
          
          alert(`✅ Image de fond chargée et visible !\n\n📊 Détails:\n- Position: ${gridCount} (après grille)\n- Opacité: ${Math.round(opaciteImage * 100)}%\n- Échelle: ${(scale * 100).toFixed(0)}%\n\n💡 Vous pouvez:\n- La déplacer\n- La redimensionner\n- Ajuster l'opacité avec le slider`);
        });
      };
      reader.readAsDataURL(file);
    };
    
    input.click();
  };
  
  // Ajuster l'opacité de l'image de fond
  const ajusterOpaciteImage = (nouvelleOpacite) => {
    setOpaciteImage(nouvelleOpacite);
    if (imageFondRef.current) {
      imageFondRef.current.set({ opacity: nouvelleOpacite });
      fabricCanvasRef.current.renderAll();
    }
  };
  
  // Supprimer l'image de fond
  const supprimerImageFond = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !imageFondRef.current) {
      alert('Aucune image de fond à supprimer');
      return;
    }
    
    if (confirm('Supprimer l\'image de fond ?')) {
      canvas.remove(imageFondRef.current);
      imageFondRef.current = null;
      setImageFondChargee(false);
      
      // Restaurer le fond vert (#f0f4f0)
      canvas.backgroundColor = '#f0f4f0';
      
      canvas.renderAll();
      logger.info('ImageFond', 'Image supprimée, fond vert restauré');
    }
  };

  // Fonctions d'ajout d'objets
  const ajouterMaison = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const maison = new fabric.Rect({
      left: 50,
      top: 50,
      width: 10 * echelle,  // 10m par défaut
      height: 10 * echelle, // 10m par défaut
      fill: '#bdbdbd',
      stroke: '#424242',
      strokeWidth: 2,
      customType: 'maison',
      // Données structurelles éditables
      profondeurFondations: 1.2, // 1.2m par défaut (fondations standard)
      typeFondations: 'semelles', // semelles, pieux, radier
      hauteurBatiment: 7, // 7m de haut (R+1)
      surfaceSol: 100 // 10m × 10m = 100m²
    });

    const label = new fabric.Text('🏠', {
      left: 50 + (10 * echelle) / 2,
      top: 50 + (10 * echelle) / 2,  // Centré sur 10m
      fontSize: 32,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false
    });

    const group = new fabric.Group([maison, label], {
      customType: 'maison'
    });

    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.renderAll();
  };

  const ajouterCanalisation = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const canalisation = new fabric.Line([50, 50, 200, 50], {
      stroke: '#757575', // Gris
      strokeWidth: 3,
      strokeDashArray: null, // Ligne continue
      strokeLineCap: 'round',
      customType: 'canalisation',
      selectable: true,
      hasBorders: true,
      hasControls: true,
      lockScalingY: false,
      lockScalingX: false,
      lockRotation: false,
      strokeUniform: true,
      perPixelTargetFind: true,
      cornerSize: 12,
      cornerColor: '#757575',
      cornerStyle: 'circle',
      transparentCorners: false,
      // Données techniques éditables
      profondeur: 0.6, // 60cm par défaut (canalisation standard)
      diametre: 0.1 // 10cm de diamètre
    });

    canvas.add(canalisation);
    canvas.setActiveObject(canalisation);
    canvas.renderAll();
  };

  const ajouterCloture = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const cloture = new fabric.Line([50, 100, 200, 100], {
      stroke: '#ffd54f', // Jaune
      strokeWidth: 3,
      strokeDashArray: [10, 5], // Pointillés
      strokeLineCap: 'round',
      customType: 'cloture',
      selectable: true,
      hasBorders: true, // Afficher les bordures pour mieux voir
      hasControls: true,
      lockScalingY: false, // Autoriser tout type de scaling
      lockScalingX: false,
      lockRotation: false, // Autoriser rotation
      strokeUniform: true, // L'épaisseur reste constante
      perPixelTargetFind: true,
      cornerSize: 12,
      cornerColor: '#ffd54f',
      cornerStyle: 'circle',
      transparentCorners: false
    });

    canvas.add(cloture);
    canvas.setActiveObject(cloture);
    canvas.renderAll();
  };

  const ajouterArbreExistant = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const rayon = 2 * echelle;

    const arbre = new fabric.Circle({
      left: 0,
      top: 0,
      radius: rayon,
      fill: 'rgba(76, 175, 80, 0.3)',
      stroke: '#2e7d32',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center'
    });

    const label = new fabric.Text('🌳', {
      left: 0,
      top: 0,
      fontSize: rayon * 0.8,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false
    });

    const group = new fabric.Group([arbre, label], {
      left: 100,
      top: 100,
      customType: 'arbre-existant'
    });

    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.renderAll();
  };

  const ajouterTerrasse = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const terrasse = new fabric.Rect({
      left: 150,
      top: 150,
      width: 5 * echelle,
      height: 4 * echelle,
      fill: '#ffecb3',
      stroke: '#f57c00',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      customType: 'terrasse'
    });

    canvas.add(terrasse);
    canvas.setActiveObject(terrasse);
    canvas.renderAll();
  };

  const ajouterCiterne = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const citerne = new fabric.Rect({
      left: 300,
      top: 300,
      width: 2 * echelle,  // 2m par défaut
      height: 3 * echelle, // 3m par défaut
      fill: '#90caf9',
      stroke: '#1976d2',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      customType: 'citerne',
      // Données techniques
      profondeur: 2.5, // 2.5m sous terre (fosse septique/citerne)
      volume: 3000, // 3000L par défaut
      typeCiterne: 'fosse-septique' // fosse-septique, citerne-eau, puits
    });

    canvas.add(citerne);
    canvas.setActiveObject(citerne);
    canvas.renderAll();
  };

  const ajouterPaves = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = 20;
    patternCanvas.height = 20;
    const ctx = patternCanvas.getContext('2d');
    
    ctx.fillStyle = '#9ccc65';
    ctx.fillRect(0, 0, 20, 20);
    ctx.fillStyle = '#bdbdbd';
    ctx.fillRect(0, 0, 8, 8);
    ctx.fillRect(12, 12, 8, 8);
    
    const pattern = new fabric.Pattern({
      source: patternCanvas,
      repeat: 'repeat'
    });

    const paves = new fabric.Rect({
      left: 200,
      top: 200,
      width: 7 * echelle,  // 7m de largeur par défaut
      height: 5 * echelle, // 5m de hauteur par défaut
      fill: pattern,
      stroke: '#7cb342',
      strokeWidth: 2,
      customType: 'paves'
    });

    canvas.add(paves);
    canvas.setActiveObject(paves);
    canvas.renderAll();
  };

  const supprimerSelection = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const actifs = canvas.getActiveObjects();
    const locked = actifs.filter(obj => obj.locked);
    
    if (locked.length > 0) {
      alert(`⚠️ ${locked.length} objet(s) verrouillé(s) ne peut/peuvent pas être supprimé(s). Déverrouillez-le(s) d'abord.`);
      return;
    }
    
    actifs.forEach(obj => {
      if (!obj.isGridLine && !obj.isImageFond) canvas.remove(obj);
    });
    canvas.discardActiveObject();
    canvas.renderAll();
    exporterPlan(canvas);
  };

  const verrouillerSelection = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const actifs = canvas.getActiveObjects();
    if (actifs.length === 0) {
      alert('Sélectionnez d\'abord un ou plusieurs objets');
      return;
    }
    
    actifs.forEach(obj => {
      if (!obj.isGridLine) {
        obj.locked = true;
        // IMPORTANT : Garder selectable = true pour pouvoir le déverrouiller
        obj.selectable = true;
        obj.evented = true;
        // Bloquer les mouvements et modifications
        obj.lockMovementX = true;
        obj.lockMovementY = true;
        obj.lockScalingX = true;
        obj.lockScalingY = true;
        obj.lockRotation = true;
        obj.hasControls = false;
        
        // Ajouter un indicateur visuel
        if (obj.stroke) {
          obj.originalStroke = obj.stroke;
          obj.stroke = '#ff9800';
          obj.strokeWidth = (obj.strokeWidth || 2) + 1;
        } else {
          obj.originalFill = obj.fill;
          obj.fill = obj.fill ? obj.fill.replace('0.3', '0.2').replace('0.4', '0.3') : obj.fill;
        }
      }
    });
    
    canvas.discardActiveObject();
    canvas.renderAll();
    alert(`✅ ${actifs.length} objet(s) verrouillé(s)`);
  };

  const deverrouillerTout = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    let count = 0;
    canvas.getObjects().forEach(obj => {
      if (obj.locked) {
        obj.locked = false;
        obj.selectable = true;
        obj.evented = true;
        // Restaurer les mouvements
        obj.lockMovementX = false;
        obj.lockMovementY = false;
        obj.lockScalingX = false;
        obj.lockScalingY = false;
        obj.lockRotation = false;
        obj.hasControls = true;
        
        // Restaurer l'apparence originale
        if (obj.originalStroke) {
          obj.stroke = obj.originalStroke;
          obj.strokeWidth = (obj.strokeWidth || 3) - 1;
          delete obj.originalStroke;
        }
        if (obj.originalFill) {
          obj.fill = obj.originalFill;
          delete obj.originalFill;
        }
        count++;
      }
    });
    
    canvas.renderAll();
    if (count > 0) {
      alert(`🔓 ${count} objet(s) déverrouillé(s)`);
    } else {
      alert('Aucun objet verrouillé');
    }
  };

  const effacerTout = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    if (!confirm('⚠️ Effacer TOUT le plan et la sauvegarde ?\n(L\'image de fond sera conservée)')) {
      return;
    }
    
    const objets = canvas.getObjects().filter(obj => !obj.isGridLine && !obj.isBoussole && !obj.isImageFond);
    objets.forEach(obj => canvas.remove(obj));
    canvas.renderAll();
    
    localStorage.removeItem('planTerrain');
    exporterPlan(canvas);
  };

  const chargerPlanSauvegarde = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const saved = localStorage.getItem('planTerrain');
    if (!saved) {
      alert('Aucun plan sauvegardé trouvé');
      return;
    }

    try {
      const planData = JSON.parse(saved);
      
      // Effacer seulement les objets du plan (pas grille, boussole, dimensions, aide, image de fond)
      const objets = canvas.getObjects().filter(obj => 
        !obj.isGridLine && 
        !obj.isBoussole && 
        !obj.isDimensionBox && 
        !obj.isAideButton &&
        !obj.measureLabel &&
        !obj.alignmentGuide &&
        !obj.isImageFond
      );
      objets.forEach(obj => canvas.remove(obj));
      
      // Maison
      if (planData.maison) {
        const maison = new fabric.Rect({
          left: planData.maison.left * echelle,
          top: planData.maison.top * echelle,
          width: planData.maison.width * echelle,
          height: planData.maison.height * echelle,
          fill: '#bdbdbd',
          stroke: '#424242',
          strokeWidth: 2,
          customType: 'maison'
        });
        const label = new fabric.Text('🏠', {
          left: (planData.maison.left + planData.maison.width / 2) * echelle,
          top: (planData.maison.top + planData.maison.height / 2) * echelle,
          fontSize: 32,
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false
        });
        const group = new fabric.Group([maison, label], { customType: 'maison' });
        canvas.add(group);
      }
      
      // Canalisations
      if (planData.canalisations) {
        planData.canalisations.forEach(canal => {
          const line = new fabric.Line([
            canal.x1 || 50,
            canal.y1 || 50,
            canal.x2 || 200,
            canal.y2 || 50
          ], {
            stroke: '#757575', // Gris
            strokeWidth: 3,
            strokeDashArray: null, // Ligne continue
            strokeLineCap: 'round',
            customType: 'canalisation',
            strokeUniform: true, // Épaisseur constante
            hasBorders: true,
            hasControls: true,
            cornerSize: 12,
            cornerColor: '#757575',
            cornerStyle: 'circle',
            transparentCorners: false
          });
          canvas.add(line);
        });
      }
      
      // Clôtures
      if (planData.clotures) {
        planData.clotures.forEach(cloture => {
          const line = new fabric.Line([
            cloture.x1,
            cloture.y1,
            cloture.x2,
            cloture.y2
          ], {
            stroke: '#ffd54f', // Jaune
            strokeWidth: 3,
            strokeDashArray: [10, 5], // Pointillés
            strokeLineCap: 'round',
            customType: 'cloture',
            strokeUniform: true, // Épaisseur constante
            hasBorders: true,
            hasControls: true,
            cornerSize: 12,
            cornerColor: '#ffd54f',
            cornerStyle: 'circle',
            transparentCorners: false
          });
          canvas.add(line);
        });
      }
      
      // Arbres existants
      if (planData.arbresExistants) {
        planData.arbresExistants.forEach(arbre => {
          const circle = new fabric.Circle({
            left: arbre.left * echelle,
            top: arbre.top * echelle,
            radius: arbre.radius * echelle,
            fill: 'rgba(76, 175, 80, 0.3)',
            stroke: '#2e7d32',
            strokeWidth: 2,
            customType: 'arbre-existant'
          });
          const label = new fabric.Text('🌳', {
            left: arbre.left * echelle,
            top: arbre.top * echelle,
            fontSize: 24,
            originX: 'center',
            originY: 'center',
            selectable: false,
            evented: false
          });
          const group = new fabric.Group([circle, label], { customType: 'arbre-existant' });
          canvas.add(group);
        });
      }
      
      // Terrasses
      if (planData.terrasses) {
        planData.terrasses.forEach(terrasse => {
          const rect = new fabric.Rect({
            left: terrasse.left * echelle,
            top: terrasse.top * echelle,
            width: terrasse.width * echelle,
            height: terrasse.height * echelle,
            fill: '#ffecb3',
            stroke: '#f57c00',
            strokeWidth: 2,
            strokeDashArray: [5, 5],
            customType: 'terrasse'
          });
          canvas.add(rect);
        });
      }
      
      // Pavés
      if (planData.paves) {
        planData.paves.forEach(pave => {
          const patternCanvas = document.createElement('canvas');
          patternCanvas.width = 20;
          patternCanvas.height = 20;
          const ctx = patternCanvas.getContext('2d');
          ctx.fillStyle = '#9ccc65';
          ctx.fillRect(0, 0, 20, 20);
          ctx.fillStyle = '#bdbdbd';
          ctx.fillRect(0, 0, 8, 8);
          ctx.fillRect(12, 12, 8, 8);
          
          const pattern = new fabric.Pattern({
            source: patternCanvas,
            repeat: 'repeat'
          });
          
          const rect = new fabric.Rect({
            left: pave.left * echelle,
            top: pave.top * echelle,
            width: pave.width * echelle,
            height: pave.height * echelle,
            fill: pattern,
            stroke: '#7cb342',
            strokeWidth: 2,
            customType: 'paves'
          });
          canvas.add(rect);
        });
      }
      
      canvas.renderAll();
      ajouterMesuresLive(canvas);
      alert('Plan chargé avec succès ! ✅');
      
    } catch (error) {
      console.error('Erreur chargement plan:', error);
      alert('Erreur lors du chargement du plan');
    }
  };

  return (
    <div className="canvas-terrain-container">
      {/* Palette d'outils flottante et déplaçable */}
      <div className="palette-outils" id="palette-outils">
        <div className="palette-header">
          <span className="palette-handle">⋮⋮</span>
          <h4>🛠️ Outils</h4>
        </div>
        
        <div className="outils-dessin">
          {/* STRUCTURES */}
          <div className="section-title">🏗️ Structures</div>
          <button 
            className="btn-outil" 
            onClick={ajouterMaison} 
            title="Ajouter maison (10m × 10m, H:7m)&#10;Double-clic pour éditer hauteur"
            aria-label="Ajouter une maison"
          >
            🏠
          </button>
          <button 
            className="btn-outil" 
            onClick={ajouterTerrasse} 
            title="Ajouter terrasse (4m × 3m)&#10;Redimensionnable"
            aria-label="Ajouter une terrasse"
          >
            🏡
          </button>
          <button 
            className="btn-outil" 
            onClick={ajouterPaves} 
            title="Ajouter pavés enherbés (5m × 5m)&#10;Zones perméables"
            aria-label="Ajouter des pavés enherbés"
          >
            🟩
          </button>
          
          {/* RÉSEAUX */}
          <div className="section-title">🔧 Réseaux</div>
          <button 
            className="btn-outil" 
            onClick={ajouterCanalisation} 
            title="Ajouter canalisation (prof. 0.6m)&#10;Gris, trait continu&#10;Double-clic pts pour courber"
            aria-label="Ajouter une canalisation"
          >
            🚰
          </button>
          <button 
            className="btn-outil" 
            onClick={ajouterCiterne} 
            title="Ajouter citerne/fosse (2m × 3m, prof. 2.5m)&#10;Validation 3D automatique"
            aria-label="Ajouter citerne ou fosse septique"
          >
            💧
          </button>
          <button 
            className="btn-outil" 
            onClick={ajouterCloture} 
            title="Ajouter clôture (limite propriété)&#10;Jaune, pointillés&#10;Double-clic pts pour courber"
            aria-label="Ajouter une clôture"
          >
            🚧
          </button>
          
          {/* VÉGÉTATION */}
          <div className="section-title">🌳 Végétation</div>
          <button 
            className="btn-outil" 
            onClick={ajouterArbreExistant} 
            title="Ajouter arbre existant (rayon 2.5m)&#10;Vert, à conserver sur plan"
            aria-label="Ajouter un arbre existant"
          >
            🌳
          </button>
          
          {/* AFFICHAGE */}
          <div className="section-title">👁️ Affichage</div>
          <button 
            className={`btn-outil ${zonesContraintesVisibles ? 'btn-active' : ''}`}
            onClick={() => setZonesContraintesVisibles(!zonesContraintesVisibles)} 
            title="Zones de contraintes (ON/OFF)&#10;Halos colorés : distances légales"
            aria-label="Afficher ou masquer les zones de contraintes"
          >
            👁️
          </button>
          <button 
            className={`btn-outil ${ombreVisible ? 'btn-active' : ''}`}
            onClick={() => setOmbreVisible(!ombreVisible)} 
            title="Ombre portée maison (ON/OFF)&#10;Selon saison et hauteur bâtiment"
            aria-label="Afficher ou masquer l'ombre de la maison"
          >
            ☀️
          </button>
          <button 
            className={`btn-outil ${snapMagnetiqueActif ? 'btn-active' : ''}`}
            onClick={() => setSnapMagnetiqueActif(!snapMagnetiqueActif)} 
            title="Accrochage magnétique (ON/OFF)&#10;Colle automatiquement les objets entre eux&#10;Snap: 5cm grille + 10cm objets"
            aria-label="Activer ou désactiver l'accrochage magnétique"
          >
            🧲
          </button>
          
          {/* ACTIONS */}
          <div className="section-title">⚡ Actions</div>
          <button 
            className="btn-outil btn-lock" 
            onClick={verrouillerSelection} 
            title="Verrouiller sélection&#10;Empêche déplacement/modification"
            aria-label="Verrouiller la sélection"
          >
            🔒
          </button>
          <button 
            className="btn-outil btn-danger" 
            onClick={supprimerSelection} 
            title="Supprimer sélection&#10;Raccourci : Suppr"
            aria-label="Supprimer la sélection"
          >
            🗑️
          </button>
          <button 
            className="btn-outil btn-danger" 
            onClick={effacerTout} 
            title="Effacer TOUT le plan&#10;⚠️ Action irréversible"
            aria-label="Effacer tout le plan"
          >
            ⚠️
          </button>
          <button 
            className="btn-outil" 
            onClick={() => {
              const canvas = fabricCanvasRef.current;
              if (canvas) {
                diagnosticCanvas(canvas);
                alert('🔍 Diagnostic affiché dans console F12');
              }
            }}
            title="Diagnostic canvas (console F12)&#10;Affiche tous les objets et leur état"
            aria-label="Lancer diagnostic canvas"
          >
            🔬
          </button>
        </div>
        
        {/* Section IMAGE DE FOND */}
        <div style={{ padding: '1rem', borderTop: '2px solid #e0e0e0', marginTop: '0.5rem' }}>
          <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: '#2196f3', textAlign: 'center' }}>
            📷 Plan de Fond
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button 
              className="btn-outil" 
              onClick={chargerImageFond}
              title="Charger votre plan Kazaplan (PNG/JPG)"
              style={{ fontSize: '1.2rem', gridColumn: 'span 2' }}
            >
              📷 Charger Image
            </button>
            
            {imageFondChargee && (
              <>
                <div style={{ padding: '0.5rem', background: '#e3f2fd', borderRadius: '6px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: '#1976d2', fontWeight: 'bold' }}>
                    Opacité: {Math.round(opaciteImage * 100)}%
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05"
                    value={opaciteImage}
                    onChange={(e) => ajusterOpaciteImage(parseFloat(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>
                
                <button 
                  className="btn-outil btn-danger" 
                  onClick={supprimerImageFond}
                  title="Supprimer l'image de fond"
                  style={{ fontSize: '1.2rem', gridColumn: 'span 2' }}
                >
                  🗑️ Retirer Image
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Dashboard statistiques (inclut composition du sol) */}
      <DashboardTerrain 
        canvas={fabricCanvasRef.current} 
        arbres={arbresAPlanter}
        couchesSol={couchesSol}
        onCouchesSolChange={setCouchesSol}
      />

      {/* Timeline de croissance (slider temporel) */}
      <div className="timeline-croissance">
        <div className="timeline-row">
          <div className="timeline-section">
            <label>
              <span className="timeline-icon">📅</span>
              <strong>Projection temporelle</strong>
            </label>
            <div className="timeline-slider-container">
              <span className="timeline-label">Aujourd'hui</span>
              <input 
                type="range" 
                min="0" 
                max="20" 
                step="1"
                value={anneeProjection}
                onChange={(e) => setAnneeProjection(parseInt(e.target.value))}
                className="timeline-slider"
              />
              <span className="timeline-label">Maturité</span>
            </div>
            <div className="timeline-value">
              {anneeProjection === 0 && (
                <span>🌱 <strong>Plantation</strong> - Jeune plant (H: 2m, Ø: 0.8m, Tronc: ⌀5cm)</span>
              )}
              {anneeProjection > 0 && anneeProjection < 20 && (
                <span>🌿 <strong>{anneeProjection} an{anneeProjection > 1 ? 's' : ''}</strong> - Croissance en cours (~{Math.round(anneeProjection / 20 * 100)}% maturité)</span>
              )}
              {anneeProjection >= 20 && (
                <span>🌳 <strong>Maturité atteinte</strong> (20+ ans) - Taille adulte maximale</span>
              )}
            </div>
          </div>
          
          {ombreVisible && (
            <div className="timeline-section saison-section">
              <label>
                <span className="timeline-icon">☀️</span>
                <strong>Saison (ombre)</strong>
              </label>
              <div className="saison-buttons">
                <button 
                  className={`btn-saison ${saison === 'hiver' ? 'active' : ''}`}
                  onClick={() => setSaison('hiver')}
                  title="Hiver (21 déc) - Soleil bas 18°"
                >
                  ❄️
                </button>
                <button 
                  className={`btn-saison ${saison === 'printemps' ? 'active' : ''}`}
                  onClick={() => setSaison('printemps')}
                  title="Printemps (21 mars) - Équinoxe 45°"
                >
                  🌸
                </button>
                <button 
                  className={`btn-saison ${saison === 'ete' ? 'active' : ''}`}
                  onClick={() => setSaison('ete')}
                  title="Été (21 juin) - Soleil haut 65°"
                >
                  ☀️
                </button>
                <button 
                  className={`btn-saison ${saison === 'automne' ? 'active' : ''}`}
                  onClick={() => setSaison('automne')}
                  title="Automne (21 sept) - Équinoxe 45°"
                >
                  🍂
                </button>
              </div>
              <div className="saison-info">
                {saison === 'hiver' && '❄️ Hiver : ombre longue (18°)'}
                {saison === 'printemps' && '🌸 Printemps : ombre moyenne (45°)'}
                {saison === 'ete' && '☀️ Été : ombre courte (65°)'}
                {saison === 'automne' && '🍂 Automne : ombre moyenne (45°)'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Panneau de validation latéral fixe */}
      <div className="panel-validation" ref={validationTooltipRef} style={{ display: 'none' }}>
      </div>

      {/* Canvas plein écran */}
      <div className="canvas-wrapper">
        <canvas id="canvas-terrain" ref={canvasRef}></canvas>

        {/* Menu contextuel en bulle */}
        <div className="context-menu" ref={contextMenuRef}>
          <button 
            className="context-btn context-lock"
            onClick={toggleVerrouObjetActif}
            title="Verrouiller/Déverrouiller"
          >
            🔒
          </button>
          <button 
            className="context-btn context-delete"
            onClick={supprimerObjetActif}
            title="Supprimer"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

export default CanvasTerrain;
