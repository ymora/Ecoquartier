import { useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import './CanvasTerrain.css';

function CanvasTerrain({ dimensions, orientation, onDimensionsChange, onOrientationChange, onPlanComplete, arbresAPlanter = [] }) {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null); // Stocker le canvas dans un ref, pas un state
  const echelle = 30; // 30 pixels = 1 mètre
  const outilActifRef = useRef(null);
  const pointsClotureRef = useRef([]);
  const arbresAjoutesRef = useRef(false); // Pour ajouter les arbres une seule fois
  const contextMenuRef = useRef(null); // Référence au menu contextuel HTML
  const aideVisibleRef = useRef(false); // État de visibilité de l'aide

  // Initialiser le canvas UNE SEULE FOIS
  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;

    const canvas = new fabric.Canvas('canvas-terrain', {
      width: Math.min(dimensions.largeur * echelle, 800),
      height: Math.min(dimensions.hauteur * echelle, 600),
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
    ajouterBoussole(canvas);

    // Dimensions du terrain sur le canvas (en haut à gauche)
    ajouterDimensionsSurPlan(canvas);

    // Bouton d'aide sur le canvas (en bas à droite)
    ajouterBoutonAide(canvas);

    // SNAP TO GRID - Aligner automatiquement sur la grille
    canvas.on('object:moving', (e) => {
      const obj = e.target;
      // Snap aux multiples de l'échelle (grille de 1m)
      obj.set({
        left: Math.round(obj.left / echelle) * echelle,
        top: Math.round(obj.top / echelle) * echelle
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
            if (!obj.isGridLine) {
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
      }
    });

    // Afficher menu contextuel lors de la sélection
    canvas.on('selection:created', (e) => {
      afficherMenuContextuel(e.selected[0], canvas);
    });

    canvas.on('selection:updated', (e) => {
      afficherMenuContextuel(e.selected[0], canvas);
    });

    canvas.on('selection:cleared', () => {
      cacherMenuContextuel();
    });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, []); // Dépendances vides = s'exécute UNE SEULE FOIS

  // Afficher le menu contextuel au-dessus de l'objet sélectionné
  const afficherMenuContextuel = (obj, canvas) => {
    if (!obj || obj.isGridLine || obj.isBoussole || obj.measureLabel) {
      cacherMenuContextuel();
      return;
    }

    const menu = contextMenuRef.current;
    if (!menu) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const objCenter = obj.getCenterPoint();
    
    // Positionner au-dessus de l'objet
    menu.style.left = `${canvasRect.left + objCenter.x}px`;
    menu.style.top = `${canvasRect.top + objCenter.y - obj.getScaledHeight() / 2 - 50}px`;
    menu.style.display = 'flex';
    
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

  // Ajouter les arbres à planter automatiquement au démarrage
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || arbresAjoutesRef.current || arbresAPlanter.length === 0) return;

    // Ajouter chaque arbre avec sa taille réelle
    arbresAPlanter.forEach((arbre, index) => {
      const envergureMax = parseFloat(arbre.envergure?.split('-')[1] || arbre.envergure || 5);
      const rayon = (envergureMax / 2) * echelle;
      
      // Positionner en diagonale pour éviter les chevauchements initiaux
      const offsetX = 100 + (index * 150);
      const offsetY = 100 + (index * 100);

      const cercle = new fabric.Circle({
        left: 0,
        top: 0,
        radius: rayon,
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
        fontSize: rayon * 0.6,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false
      });

      // Nom en dessous
      const label = new fabric.Text(arbre.name, {
        left: 0,
        top: rayon + 10,
        fontSize: 14,
        fontWeight: 'bold',
        fill: '#1b5e20',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 4,
        originX: 'center',
        originY: 'top',
        selectable: false,
        evented: false
      });

      const group = new fabric.Group([cercle, emoji, label], {
        left: offsetX,
        top: offsetY,
        customType: 'arbre-a-planter',
        arbreData: arbre
      });

      canvas.add(group);
    });

    arbresAjoutesRef.current = true;
    canvas.renderAll();
    ajouterMesuresLive(canvas);
  }, [arbresAPlanter]);

  // Mettre à jour les dimensions du canvas quand elles changent
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.setWidth(Math.min(dimensions.largeur * echelle, 800));
    canvas.setHeight(Math.min(dimensions.hauteur * echelle, 600));
    
    // Supprimer et recréer la grille, boussole, dimensions et bouton aide
    canvas.getObjects().forEach(obj => {
      if (obj.isGridLine || obj.isBoussole || obj.isDimensionBox || obj.isAideButton) canvas.remove(obj);
    });
    ajouterGrille(canvas);
    ajouterBoussole(canvas);
    ajouterDimensionsSurPlan(canvas);
    ajouterBoutonAide(canvas);
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

  const ajouterDimensionsSurPlan = (canvas) => {
    // Fond semi-transparent
    const fond = new fabric.Rect({
      left: 10,
      top: 10,
      width: 120,
      height: 50,
      fill: 'rgba(255, 255, 255, 0.95)',
      stroke: '#2e7d32',
      strokeWidth: 2,
      rx: 8,
      ry: 8,
      selectable: false,
      evented: false,
      isDimensionBox: true
    });

    // Texte des dimensions - CLIQUABLE
    const textDim = new fabric.Text(`${dimensions.largeur}m × ${dimensions.hauteur}m`, {
      left: 70,
      top: 23,
      fontSize: 14,
      fontWeight: 'bold',
      fill: '#2e7d32',
      originX: 'center',
      originY: 'center',
      selectable: true,
      hasControls: false,
      hasBorders: false,
      lockMovementX: true,
      lockMovementY: true,
      hoverCursor: 'pointer',
      isDimensionBox: true
    });

    textDim.on('mousedown', () => {
      const largeur = prompt('Largeur du terrain (en mètres) :', dimensions.largeur);
      if (largeur && !isNaN(largeur)) {
        const hauteur = prompt('Hauteur du terrain (en mètres) :', dimensions.hauteur);
        if (hauteur && !isNaN(hauteur)) {
          onDimensionsChange({
            largeur: parseInt(largeur),
            hauteur: parseInt(hauteur)
          });
        }
      }
    });

    // Icône
    const icon = new fabric.Text('📐', {
      left: 25,
      top: 23,
      fontSize: 20,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
      isDimensionBox: true
    });

    canvas.add(fond);
    canvas.add(icon);
    canvas.add(textDim);
  };

  const ajouterBoutonAide = (canvas) => {
    const size = 50;
    const btnX = canvas.width - size - 15;
    const btnY = canvas.height - size - 15;

    // Cercle orange
    const cercle = new fabric.Circle({
      left: btnX,
      top: btnY,
      radius: size / 2,
      fill: '#ff9800',
      stroke: '#f57c00',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
      selectable: true,
      hasControls: false,
      hasBorders: false,
      lockMovementX: true,
      lockMovementY: true,
      hoverCursor: 'pointer',
      isAideButton: true
    });

    // Point d'interrogation
    const icon = new fabric.Text('?', {
      left: btnX,
      top: btnY,
      fontSize: 28,
      fontWeight: 'bold',
      fill: 'white',
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
      isAideButton: true
    });

    cercle.on('mousedown', () => {
      toggleAide();
    });

    canvas.add(cercle);
    canvas.add(icon);
  };

  const toggleAide = () => {
    const aidePanel = document.querySelector('.canvas-aide');
    if (aidePanel) {
      if (aideVisibleRef.current) {
        aidePanel.style.display = 'none';
        aideVisibleRef.current = false;
      } else {
        aidePanel.style.display = 'block';
        aideVisibleRef.current = true;
      }
    }
  };

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
      maison: null,
      canalisations: [],
      arbresExistants: [],
      arbresAPlanter: [],
      terrasses: [],
      paves: [],
      clotures: []
    };

    objets.forEach(obj => {
      if (obj.isGridLine || obj.measureLabel || obj.isBoussole || obj.alignmentGuide || obj.isDimensionBox || obj.isAideButton) return;

      if (obj.customType === 'maison') {
        planData.maison = {
          left: obj.left / echelle,
          top: obj.top / echelle,
          width: (obj.getScaledWidth()) / echelle,
          height: (obj.getScaledHeight()) / echelle
        };
      } else if (obj.customType === 'canalisation') {
        if (obj.type === 'line') {
          planData.canalisations.push({
            type: 'line',
            x1: obj.x1,
            y1: obj.y1,
            x2: obj.x2,
            y2: obj.y2
          });
        } else if (obj.type === 'polyline') {
          planData.canalisations.push({
            type: 'polyline',
            points: obj.points
          });
        }
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
      if (obj.isGridLine || obj.measureLabel || obj.isBoussole || obj.alignmentGuide || obj.isDimensionBox || obj.isAideButton) return;

      if (obj.customType === 'maison' || obj.customType === 'terrasse' || obj.customType === 'paves') {
        const w = (obj.getScaledWidth() / echelle).toFixed(1);
        const h = (obj.getScaledHeight() / echelle).toFixed(1);
        
        const labelW = new fabric.Text(`${w}m`, {
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
          const newValue = prompt('Nouvelle largeur (en mètres) :', w);
          if (newValue && !isNaN(newValue)) {
            const newWidth = parseFloat(newValue) * echelle;
            obj.set({ width: newWidth, scaleX: 1 });
            canvas.renderAll();
            ajouterMesuresLive(canvas);
            exporterPlan(canvas);
          }
        });

        canvas.add(labelW);

        const labelH = new fabric.Text(`${h}m`, {
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
          const newValue = prompt('Nouvelle hauteur (en mètres) :', h);
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
        const r = (obj.radius * obj.scaleX / echelle).toFixed(1);
        const couleur = obj.customType === 'arbre-a-planter' ? '#1b5e20' : '#2e7d32';
        
        const labelR = new fabric.Text(`⌀ ${(r * 2).toFixed(1)}m`, {
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
          const newValue = prompt('Nouveau diamètre (en mètres) :', (r * 2).toFixed(1));
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

  // Fonctions d'ajout d'objets
  const ajouterMaison = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const maison = new fabric.Rect({
      left: 50,
      top: 50,
      width: 10 * echelle,
      height: 8 * echelle,
      fill: '#bdbdbd',
      stroke: '#424242',
      strokeWidth: 2,
      customType: 'maison'
    });

    const label = new fabric.Text('🏠', {
      left: 50 + (10 * echelle) / 2,
      top: 50 + (8 * echelle) / 2,
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
      stroke: '#2196f3',
      strokeWidth: 3,
      strokeDashArray: [5, 5],
      customType: 'canalisation',
      selectable: true,
      hasBorders: false,
      hasControls: true
    });

    canvas.add(canalisation);
    canvas.setActiveObject(canalisation);
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
      width: 4 * echelle,
      height: 6 * echelle,
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
      if (!obj.isGridLine) canvas.remove(obj);
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
    
    const objets = canvas.getObjects().filter(obj => !obj.isGridLine && !obj.isBoussole);
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
      
      // Effacer tout sauf la grille
      const objets = canvas.getObjects().filter(obj => !obj.isGridLine);
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
            stroke: '#2196f3',
            strokeWidth: 3,
            strokeDashArray: [5, 5],
            customType: 'canalisation'
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
      <div className="canvas-controls">
        <h3>🛠️ Outils de dessin</h3>
        
        <div className="outils-dessin">
          <button className="btn-outil" onClick={ajouterMaison}>
            🏠 Maison
          </button>
          <button className="btn-outil" onClick={ajouterCanalisation}>
            🚰 Canalisation
          </button>
          <button className="btn-outil" onClick={ajouterArbreExistant}>
            🌳 Arbre existant
          </button>
          <button className="btn-outil" onClick={ajouterTerrasse}>
            🏡 Terrasse
          </button>
          <button className="btn-outil" onClick={ajouterPaves}>
            🟩 Pavés enherbés
          </button>
          <button className="btn-outil btn-success" onClick={chargerPlanSauvegarde}>
            📥 Charger plan sauvegardé
          </button>
          <div className="separator"></div>
          <button className="btn-outil btn-lock" onClick={verrouillerSelection}>
            🔒 Verrouiller sélection
          </button>
          <button className="btn-outil btn-unlock" onClick={deverrouillerTout}>
            🔓 Tout déverrouiller
          </button>
          <div className="raccourci-info lock-info">
            <small>💡 Les objets verrouillés (bordure orange) ne peuvent plus être déplacés ni supprimés</small>
          </div>
          <div className="separator"></div>
          <button className="btn-outil btn-danger" onClick={supprimerSelection}>
            🗑️ Supprimer sélection
          </button>
          <div className="raccourci-info">
            <small>💡 Raccourci : Sélectionnez + touche <kbd>Suppr</kbd> ou <kbd>⌫</kbd></small>
          </div>
          <button className="btn-outil btn-danger" onClick={effacerTout}>
            ⚠️ Effacer tout
          </button>
        </div>

        <div className="canvas-aide" style={{ display: 'none' }}>
          <button className="close-aide-btn" onClick={() => toggleAide()}>×</button>
          <h4>💡 Aide & Raccourcis clavier</h4>
          <div className="aide-grid">
            <div className="aide-section">
              <strong>🖱️ Souris</strong>
              <ul>
                <li>Glisser-déposer pour déplacer</li>
                <li>Coins/bords pour redimensionner</li>
                <li><strong>Snap automatique</strong> à la grille !</li>
                <li><strong>Guides d'alignement</strong> (lignes rouges)</li>
              </ul>
            </div>
            
            <div className="aide-section">
              <strong>⌨️ Clavier</strong>
              <ul>
                <li><kbd>Suppr</kbd> ou <kbd>⌫</kbd> : Supprimer</li>
                <li><kbd>Ctrl+D</kbd> : Dupliquer</li>
                <li><kbd>↑↓←→</kbd> : Déplacer 10cm</li>
                <li><kbd>Shift+↑↓←→</kbd> : Déplacer 1m</li>
              </ul>
            </div>
          </div>
          
          <div className="aide-features">
            <p>✨ <strong>Snap to Grid</strong> : Les objets s'alignent automatiquement sur la grille</p>
            <p>📏 <strong>Guides d'alignement</strong> : Lignes rouges apparaissent quand 2 objets s'alignent</p>
            <p>🎯 <strong>Mesures temps réel</strong> : Dimensions affichées pendant le redimensionnement</p>
            <p>💾 <strong>Sauvegarde auto</strong> : Votre plan est sauvegardé en permanence</p>
          </div>
        </div>
      </div>

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
