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

    // Calculer la hauteur disponible (viewport - header - footer - marges)
    const viewportHeight = window.innerHeight;
    const headerHeight = 150; // Hauteur approximative du header avec arbres
    const footerHeight = 80;  // Hauteur du footer avec boutons
    const availableHeight = viewportHeight - headerHeight - footerHeight - 40; // -40 pour marges
    
    const canvas = new fabric.Canvas('canvas-terrain', {
      width: dimensions.largeur * echelle,
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
        // Revalider si c'est un arbre
        if (e.target.customType === 'arbre-a-planter') {
          validerPositionArbre(canvas, e.target);
        }
      }
    });
    
    canvas.on('object:modified', (e) => {
      // Revalider tous les arbres après modification
      if (e.target) {
        canvas.getObjects().filter(obj => obj.customType === 'arbre-a-planter').forEach(arbre => {
          validerPositionArbre(canvas, arbre);
        });
      }
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

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, []); // Dépendances vides = s'exécute UNE SEULE FOIS

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
        
        // Position valide trouvée
        positions.push({ x, y, score: Math.random() }); // Score aléatoire pour varier
      }
    }
    
    // Si aucune position valide, placer en diagonale par défaut (en dehors mais visible)
    if (positions.length === 0) {
      console.warn(`⚠️ Aucune position valide trouvée pour ${arbre.name}, placement par défaut`);
      return {
        x: 150 + (index * 200),
        y: 150 + (index * 150)
      };
    }
    
    // Trier par score et prendre la meilleure
    positions.sort((a, b) => b.score - a.score);
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
    
    // Vérifier maison/fondations
    const maison = canvas.getObjects().find(obj => obj.customType === 'maison');
    if (maison) {
      const distMaison = calculerDistanceRectangle(x, y, maison) / echelle;
      if (distMaison < distanceFondations) {
        problemes.push(`🏠 Trop près de la maison (${distMaison.toFixed(1)}m < ${distanceFondations}m requis)`);
      } else if (distMaison < distanceFondations + 1) {
        avertissements.push(`🏠 Proche de la maison (${distMaison.toFixed(1)}m, ${distanceFondations}m recommandé)`);
      }
    }
    
    // Vérifier canalisations
    const canalisations = canvas.getObjects().filter(obj => obj.customType === 'canalisation');
    for (const canal of canalisations) {
      const distCanal = calculerDistanceLigne(x, y, canal) / echelle;
      if (distCanal < distanceCanalisations) {
        problemes.push(`🚰 Trop près d'une canalisation (${distCanal.toFixed(1)}m < ${distanceCanalisations}m requis)`);
      }
    }
    
    // Vérifier clôtures/limites
    const clotures = canvas.getObjects().filter(obj => obj.customType === 'cloture');
    for (const cloture of clotures) {
      const distCloture = calculerDistanceLigne(x, y, cloture) / echelle;
      if (distCloture < distanceCloture) {
        problemes.push(`🚧 Trop près de la limite (${distCloture.toFixed(1)}m < ${distanceCloture}m légal)`);
      } else if (distCloture < distanceCloture + 0.5) {
        avertissements.push(`🚧 Proche de la limite (${distCloture.toFixed(1)}m, ${distanceCloture}m minimum)`);
      }
    }
    
    // Vérifier terrasses
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

  // Ajouter les arbres à planter automatiquement au démarrage
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || arbresAPlanter.length === 0) return;
    
    // Attendre que le plan par défaut soit chargé avant d'ajouter les arbres
    setTimeout(() => {
      // Vérifier si les arbres sont déjà sur le canvas
      const arbresExistants = canvas.getObjects().filter(obj => obj.customType === 'arbre-a-planter');
      if (arbresExistants.length >= arbresAPlanter.length) return;

      // Ajouter chaque arbre avec sa taille réelle (ellipse : largeur = envergure, hauteur = hauteur)
    arbresAPlanter.forEach((arbre, index) => {
      // Extraire l'envergure (largeur) - prendre la valeur max si plage
      const envergureStr = arbre.envergure || '5';
      const envergureMax = parseFloat(envergureStr.split('-').pop());
      
      // Extraire la hauteur - prendre la valeur max si plage
      const hauteurStr = arbre.tailleMaturite || '5';
      const hauteurMax = parseFloat(hauteurStr.split('-').pop().replace('m', '').trim());
      
      // Convertir en pixels
      const largeur = envergureMax * echelle;
      const hauteur = hauteurMax * echelle;
      
      // Trouver une position valide qui respecte toutes les contraintes
      const position = trouverPositionValide(canvas, arbre, largeur, hauteur, index);
      const offsetX = position.x;
      const offsetY = position.y;

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
      const dimensions = new fabric.Text(`${envergureMax}m × ${hauteurMax}m`, {
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
        customType: 'arbre-a-planter',
        arbreData: arbre
      });

      canvas.add(group);
      
      // Valider la position initiale
      validerPositionArbre(canvas, group);
    });

    canvas.renderAll();
    ajouterMesuresLive(canvas);
    }, 500); // Attendre 500ms pour que le plan par défaut soit chargé
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
    ajouterIndicateurSud(canvas);
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
    console.log(`✅ Plan par défaut créé : clôture ${largeurM}×${hauteurM}m, maison 10×10m, pavés 5×5m sous la maison (utilise tout l'espace disponible)`);
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

  const ajouterBoutonAide = (canvas) => {
    const size = 40; // Réduit de 50 à 40
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
      selectable: false, // Ne pas être sélectionnable
      hasControls: false,
      hasBorders: false,
      lockMovementX: true,
      lockMovementY: true,
      hoverCursor: 'pointer',
      evented: true,
      isAideButton: true, // Ignoré lors de l'export
      excludeFromExport: true // Exclu de l'export
    });

    // Point d'interrogation
    const icon = new fabric.Text('?', {
      left: btnX,
      top: btnY,
      fontSize: 24, // Réduit de 28 à 24
      fontWeight: 'bold',
      fill: 'white',
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
      isAideButton: true,
      excludeFromExport: true
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

    // Calculer l'orientation quand le soleil bouge
    soleil.on('moving', () => {
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
      if (obj.isGridLine || obj.measureLabel || obj.isBoussole || obj.alignmentGuide || obj.isDimensionBox || obj.isAideButton) return;

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
      width: 10 * echelle,  // 10m par défaut
      height: 10 * echelle, // 10m par défaut
      fill: '#bdbdbd',
      stroke: '#424242',
      strokeWidth: 2,
      customType: 'maison'
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
      hasBorders: true, // Afficher les bordures pour mieux voir
      hasControls: true,
      lockScalingY: false, // Autoriser tout type de scaling
      lockScalingX: false,
      lockRotation: false, // Autoriser rotation
      strokeUniform: true, // L'épaisseur reste constante
      perPixelTargetFind: true,
      cornerSize: 12,
      cornerColor: '#757575',
      cornerStyle: 'circle',
      transparentCorners: false
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
      
      // Effacer seulement les objets du plan (pas grille, boussole, dimensions, aide)
      const objets = canvas.getObjects().filter(obj => 
        !obj.isGridLine && 
        !obj.isBoussole && 
        !obj.isDimensionBox && 
        !obj.isAideButton &&
        !obj.measureLabel &&
        !obj.alignmentGuide
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
          <button className="btn-outil" onClick={ajouterMaison} title="Ajouter une maison">
            🏠
          </button>
          <button className="btn-outil" onClick={ajouterCanalisation} title="Ajouter une canalisation (gris)">
            🚰
          </button>
          <button className="btn-outil" onClick={ajouterCloture} title="Ajouter une clôture (jaune pointillés)">
            🚧
          </button>
          <button className="btn-outil" onClick={ajouterArbreExistant} title="Ajouter un arbre existant">
            🌳
          </button>
          <button className="btn-outil" onClick={ajouterTerrasse} title="Ajouter une terrasse">
            🏡
          </button>
          <button className="btn-outil" onClick={ajouterPaves} title="Ajouter des pavés enherbés">
            🟩
          </button>
          <button className="btn-outil btn-success" onClick={chargerPlanSauvegarde} title="Charger le plan sauvegardé">
            📥
          </button>
          <button className="btn-outil btn-lock" onClick={verrouillerSelection} title="Verrouiller la sélection">
            🔒
          </button>
          <button className="btn-outil btn-unlock" onClick={deverrouillerTout} title="Tout déverrouiller">
            🔓
          </button>
          <button className="btn-outil btn-danger" onClick={supprimerSelection} title="Supprimer la sélection (ou Suppr)">
            🗑️
          </button>
          <button className="btn-outil btn-danger" onClick={effacerTout} title="Effacer tout le plan + sauvegarde">
            ⚠️
          </button>
          <button className="btn-outil" onClick={() => {
            const saved = localStorage.getItem('planTerrain');
            if (saved) {
              const planData = JSON.parse(saved);
              const date = new Date(planData.timestamp || Date.now()).toLocaleString('fr-FR');
              alert(`💾 Plan sauvegardé le ${date}\n✅ Sera rechargé automatiquement`);
            } else {
              alert('Aucune sauvegarde trouvée');
            }
          }} title="Vérifier la sauvegarde">
            💾
          </button>
        </div>
      </div>

      {/* Aide flottante (overlay) */}
      <div className="canvas-aide" style={{ display: 'none' }}>
        <button className="close-aide-btn" onClick={() => toggleAide()}>×</button>
        <h4>💡 Aide & Raccourcis</h4>
        <div className="aide-grid">
          <div className="aide-section">
            <strong>🖱️ Souris</strong>
            <ul>
              <li>Glisser pour déplacer</li>
              <li>Coins pour redimensionner</li>
              <li>Snap automatique grille</li>
              <li>Guides rouges alignement</li>
            </ul>
          </div>
          
          <div className="aide-section">
            <strong>⌨️ Clavier</strong>
            <ul>
              <li><kbd>Suppr</kbd> Supprimer</li>
              <li><kbd>Ctrl+D</kbd> Dupliquer</li>
              <li><kbd>↑↓←→</kbd> Déplacer 10cm</li>
              <li><kbd>Shift+↑</kbd> Déplacer 1m</li>
            </ul>
          </div>
        </div>
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
