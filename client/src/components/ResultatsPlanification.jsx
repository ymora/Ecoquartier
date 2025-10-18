import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { trouverEmplacementsOptimaux } from '../utils/placementAlgorithm';
import './ResultatsPlanification.css';

function ResultatsPlanification({ plan, arbres, dimensions, orientation, onSuggestionsCalculees }) {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionSelectionnee, setSuggestionSelectionnee] = useState(null);
  const echelle = 30; // 30 pixels = 1 mètre

  // Calculer les suggestions à l'ouverture
  useEffect(() => {
    if (!plan || arbres.length === 0) return;

    const suggestionsCalculees = trouverEmplacementsOptimaux(plan, arbres, {
      pasGrille: 0.5,
      nombreSuggestions: 5
    });

    setSuggestions(suggestionsCalculees);
    onSuggestionsCalculees(suggestionsCalculees);

    if (suggestionsCalculees.length > 0) {
      setSuggestionSelectionnee(0);
    }
  }, [plan, arbres, onSuggestionsCalculees]);

  // Initialiser le canvas et afficher le plan + suggestions
  useEffect(() => {
    if (!canvasRef.current || !plan) return;

    const fabricCanvas = new fabric.Canvas('canvas-resultats', {
      width: Math.min(plan.largeur * echelle, 800),
      height: Math.min(plan.hauteur * echelle, 600),
      backgroundColor: '#e8f5e9',
      selection: false
    });

    // Grille légère
    ajouterGrille(fabricCanvas);

    // Dessiner les éléments du plan
    dessinerPlan(fabricCanvas);

    // Dessiner les suggestions
    dessinerSuggestions(fabricCanvas, suggestions);

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, [plan, suggestions]);

  const ajouterGrille = (fabricCanvas) => {
    const width = fabricCanvas.width;
    const height = fabricCanvas.height;

    for (let i = 0; i <= width; i += echelle) {
      fabricCanvas.add(new fabric.Line([i, 0, i, height], {
        stroke: '#c8e6c9',
        strokeWidth: 0.5,
        selectable: false,
        evented: false
      }));
    }

    for (let i = 0; i <= height; i += echelle) {
      fabricCanvas.add(new fabric.Line([0, i, width, i], {
        stroke: '#c8e6c9',
        strokeWidth: 0.5,
        selectable: false,
        evented: false
      }));
    }
  };

  const dessinerPlan = (fabricCanvas) => {
    // Maison
    if (plan.maison) {
      const maison = new fabric.Rect({
        left: plan.maison.left * echelle,
        top: plan.maison.top * echelle,
        width: plan.maison.width * echelle,
        height: plan.maison.height * echelle,
        fill: '#bdbdbd',
        stroke: '#424242',
        strokeWidth: 2,
        selectable: false
      });
      fabricCanvas.add(maison);

      const label = new fabric.Text('🏠', {
        left: (plan.maison.left + plan.maison.width / 2) * echelle,
        top: (plan.maison.top + plan.maison.height / 2) * echelle,
        fontSize: 32,
        originX: 'center',
        originY: 'center',
        selectable: false
      });
      fabricCanvas.add(label);
    }

    // Canalisations
    plan.canalisations.forEach(canal => {
      const ligne = new fabric.Line([
        canal.x1 * echelle,
        canal.y1 * echelle,
        canal.x2 * echelle,
        canal.y2 * echelle
      ], {
        stroke: '#2196f3',
        strokeWidth: 3,
        strokeDashArray: [5, 5],
        selectable: false
      });
      fabricCanvas.add(ligne);
    });

    // Arbres existants
    plan.arbresExistants.forEach(arbre => {
      const cercle = new fabric.Circle({
        left: arbre.left * echelle,
        top: arbre.top * echelle,
        radius: arbre.radius * echelle,
        fill: 'rgba(76, 175, 80, 0.3)',
        stroke: '#2e7d32',
        strokeWidth: 2,
        originX: 'center',
        originY: 'center',
        selectable: false
      });
      fabricCanvas.add(cercle);

      const emoji = new fabric.Text('🌳', {
        left: arbre.left * echelle,
        top: arbre.top * echelle,
        fontSize: 24,
        originX: 'center',
        originY: 'center',
        selectable: false
      });
      fabricCanvas.add(emoji);
    });

    // Terrasses
    plan.terrasses.forEach(terrasse => {
      const rect = new fabric.Rect({
        left: terrasse.left * echelle,
        top: terrasse.top * echelle,
        width: terrasse.width * echelle,
        height: terrasse.height * echelle,
        fill: '#ffecb3',
        stroke: '#f57c00',
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        selectable: false
      });
      fabricCanvas.add(rect);
    });
  };

  const dessinerSuggestions = (fabricCanvas, suggestions) => {
    if (!arbres[0]) return;

    const envergure = parseFloat(arbres[0].envergure?.split('-')[1] || 5);
    const rayon = (envergure / 2) * echelle;

    suggestions.forEach((suggestion, index) => {
      const opacity = index === suggestionSelectionnee ? 0.5 : 0.2;
      const strokeWidth = index === suggestionSelectionnee ? 4 : 2;

      // Cercle représentant l'envergure de l'arbre
      const cercle = new fabric.Circle({
        left: suggestion.x * echelle,
        top: suggestion.y * echelle,
        radius: rayon,
        fill: `rgba(76, 175, 80, ${opacity})`,
        stroke: index === 0 ? '#1b5e20' : index === 1 ? '#388e3c' : '#66bb6a',
        strokeWidth: strokeWidth,
        originX: 'center',
        originY: 'center',
        selectable: false
      });
      fabricCanvas.add(cercle);

      // Numéro de suggestion
      const numero = new fabric.Text(`⭐${index + 1}`, {
        left: suggestion.x * echelle,
        top: (suggestion.y - rayon / echelle - 1) * echelle,
        fontSize: 20,
        fontWeight: 'bold',
        fill: '#1b5e20',
        originX: 'center',
        originY: 'center',
        selectable: false
      });
      fabricCanvas.add(numero);

      // Score
      const scoreText = new fabric.Text(`${Math.round(suggestion.score)}%`, {
        left: suggestion.x * echelle,
        top: (suggestion.y + rayon / echelle + 0.5) * echelle,
        fontSize: 14,
        fontWeight: 'bold',
        fill: '#1b5e20',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        originX: 'center',
        originY: 'center',
        selectable: false
      });
      fabricCanvas.add(scoreText);
    });
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return { label: 'EXCELLENT', classe: 'excellent' };
    if (score >= 75) return { label: 'TRÈS BON', classe: 'tres-bon' };
    if (score >= 60) return { label: 'BON', classe: 'bon' };
    if (score >= 40) return { label: 'ACCEPTABLE', classe: 'acceptable' };
    return { label: 'DÉCONSEILLÉ', classe: 'deconsseille' };
  };

  return (
    <div className="resultats-planification-container">
      <h3>✨ Étape 3 : Emplacements suggérés</h3>

      <div className="resultats-content">
        <div className="canvas-resultats-wrapper">
          <canvas id="canvas-resultats" ref={canvasRef}></canvas>
          
          {suggestions.length === 0 && (
            <div className="no-suggestions">
              <p>😔 Aucun emplacement trouvé respectant toutes les contraintes.</p>
              <p>Essayez de modifier votre plan ou de choisir un arbre plus petit.</p>
            </div>
          )}
        </div>

        <div className="suggestions-list">
          <h4>📊 {suggestions.length} emplacement{suggestions.length > 1 ? 's' : ''} trouvé{suggestions.length > 1 ? 's' : ''}</h4>
          
          {suggestions.map((suggestion, index) => {
            const scoreInfo = getScoreLabel(suggestion.score);
            
            return (
              <div 
                key={index}
                className={`suggestion-card ${suggestionSelectionnee === index ? 'active' : ''}`}
                onClick={() => setSuggestionSelectionnee(index)}
              >
                <div className="suggestion-header">
                  <span className="suggestion-numero">⭐ #{index + 1}</span>
                  <span className={`suggestion-score ${scoreInfo.classe}`}>
                    {Math.round(suggestion.score)}% - {scoreInfo.label}
                  </span>
                </div>

                <div className="suggestion-position">
                  <strong>📍 Position :</strong> 
                  {suggestion.x.toFixed(1)}m (Est), {suggestion.y.toFixed(1)}m (Nord)
                </div>

                <div className="suggestion-raisons">
                  {suggestion.raisons.map((raison, i) => (
                    <div key={i} className="raison-item">
                      {raison}
                    </div>
                  ))}
                </div>

                {suggestion.alertes.length > 0 && (
                  <div className="suggestion-alertes">
                    {suggestion.alertes.map((alerte, i) => (
                      <div key={i} className="alerte-item">
                        {alerte}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="export-actions">
          <button className="btn-export" onClick={() => alert('Fonctionnalité à venir : Export PDF')}>
            💾 Sauvegarder en PDF
          </button>
          <button className="btn-export" onClick={() => alert('Fonctionnalité à venir : Partager')}>
            📤 Partager
          </button>
        </div>
      )}
    </div>
  );
}

export default ResultatsPlanification;

