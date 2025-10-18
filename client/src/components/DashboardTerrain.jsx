import { useEffect, useState } from 'react';
import './DashboardTerrain.css';

function DashboardTerrain({ canvas, arbres, couchesSol, onCouchesSolChange }) {
  const [stats, setStats] = useState(null);
  const echelle = 30;

  useEffect(() => {
    if (!canvas) return;
    
    const calculer = () => {
      const objets = canvas.getObjects();
      
      // Arbres plantés
      const arbresPlantes = objets.filter(obj => obj.customType === 'arbre-a-planter');
      const arbresExistants = objets.filter(obj => obj.customType === 'arbre-existant');
      const totalArbres = arbresPlantes.length + arbresExistants.length;
      
      // Surface plantée (somme des couronnes)
      let surfacePlantee = 0;
      arbresPlantes.forEach(arbreGroup => {
        const arbre = arbreGroup.arbreData;
        if (arbre) {
          const envergure = parseFloat(arbre.envergure?.split('-').pop() || '5');
          surfacePlantee += Math.PI * Math.pow(envergure / 2, 2);
        }
      });
      
      // Surface minéralisée (terrasses + pavés)
      let surfaceMinerale = 0;
      const terrasses = objets.filter(obj => obj.customType === 'paves');
      terrasses.forEach(t => {
        const w = t.getScaledWidth() / echelle;
        const h = t.getScaledHeight() / echelle;
        surfaceMinerale += w * h;
      });
      
      // Surface totale (approximation canvas)
      const surfaceTotale = (canvas.width * canvas.height) / (echelle * echelle);
      
      // Surface libre
      const surfaceLibre = surfaceTotale - surfacePlantee - surfaceMinerale;
      
      // Arrosage estimé (litres/semaine)
      let arrosageEstime = 0;
      arbresPlantes.forEach(arbreGroup => {
        const arbre = arbreGroup.arbreData;
        if (!arbre) return;
        
        if (arbre.arrosage?.includes('Régulier')) {
          arrosageEstime += 50; // 50L/semaine pour arrosage régulier
        } else if (arbre.arrosage?.includes('Abondant')) {
          arrosageEstime += 100;
        } else if (arbre.arrosage?.includes('Modéré')) {
          arrosageEstime += 30;
        } else {
          arrosageEstime += 20; // Minimum
        }
      });
      
      // Score biodiversité
      let scoreBiodiversite = 0;
      let melliferes = 0;
      let fructification = 0;
      
      arbresPlantes.forEach(arbreGroup => {
        const arbre = arbreGroup.arbreData;
        if (!arbre) return;
        
        if (arbre.biodiversite?.faune?.includes('Mellifère') || 
            arbre.biodiversite?.faune?.includes('abeilles')) {
          melliferes++;
          scoreBiodiversite += 30;
        }
        
        if (arbre.fructification?.periode && 
            !arbre.fructification.periode.includes('Rare') &&
            !arbre.fructification.periode.includes('N/A')) {
          fructification++;
          scoreBiodiversite += 25;
        }
        
        // Bonus diversité (>3 espèces différentes)
        if (totalArbres >= 3) scoreBiodiversite += 20;
        
        // Bonus plantes locales
        if (arbre.famille === 'Rosaceae' || arbre.famille === 'Betulaceae') {
          scoreBiodiversite += 15;
        }
      });
      
      scoreBiodiversite = Math.min(100, scoreBiodiversite); // Max 100
      
      // Temps d'entretien (heures/mois)
      let tempsEntretien = totalArbres * 0.5; // 30min par arbre/mois
      
      // Conformité réglementaire
      let conformite = 100;
      let nbAvertissements = 0;
      let nbProblemes = 0;
      
      arbresPlantes.forEach(arbreGroup => {
        if (arbreGroup.validationStatus === 'error') {
          nbProblemes++;
          conformite -= 20;
        } else if (arbreGroup.validationStatus === 'warning') {
          nbAvertissements++;
          conformite -= 5;
        }
      });
      
      conformite = Math.max(0, conformite);
      
      setStats({
        totalArbres,
        arbresPlantes: arbresPlantes.length,
        arbresExistants: arbresExistants.length,
        surfaceTotale: surfaceTotale.toFixed(0),
        surfacePlantee: surfacePlantee.toFixed(1),
        surfaceMinerale: surfaceMinerale.toFixed(1),
        surfaceLibre: surfaceLibre.toFixed(1),
        pourcentagePlante: ((surfacePlantee / surfaceTotale) * 100).toFixed(0),
        pourcentageMinerale: ((surfaceMinerale / surfaceTotale) * 100).toFixed(0),
        pourcentageLibre: ((surfaceLibre / surfaceTotale) * 100).toFixed(0),
        arrosageEstime,
        tempsEntretien: tempsEntretien.toFixed(1),
        scoreBiodiversite,
        melliferes,
        fructification,
        conformite,
        nbProblemes,
        nbAvertissements
      });
    };
    
    calculer();
    
    // Recalculer quand le canvas change
    const interval = setInterval(calculer, 2000); // Toutes les 2 secondes
    
    return () => clearInterval(interval);
  }, [canvas, arbres]);

  if (!stats) return null;

  const getEtoilesBiodiversite = (score) => {
    if (score >= 80) return '⭐⭐⭐⭐⭐';
    if (score >= 60) return '⭐⭐⭐⭐';
    if (score >= 40) return '⭐⭐⭐';
    if (score >= 20) return '⭐⭐';
    return '⭐';
  };

  return (
    <div className="dashboard-terrain">
      <div className="dashboard-header">
        <h4>📊 Statistiques du Terrain</h4>
      </div>
      
      <div className="dashboard-content">
        {/* Arbres */}
        <div className="stat-section">
          <div className="stat-label">🌳 Arbres</div>
          <div className="stat-value">{stats.totalArbres}</div>
          <div className="stat-detail">
            {stats.arbresPlantes} à planter + {stats.arbresExistants} existants
          </div>
        </div>
        
        {/* Surfaces */}
        <div className="stat-section">
          <div className="stat-label">📏 Surface totale</div>
          <div className="stat-value">{stats.surfaceTotale}m²</div>
        </div>
        
        <div className="stat-bar">
          <div className="bar-segment bar-plante" style={{ width: `${stats.pourcentagePlante}%` }}></div>
          <div className="bar-segment bar-minerale" style={{ width: `${stats.pourcentageMinerale}%` }}></div>
          <div className="bar-segment bar-libre" style={{ width: `${stats.pourcentageLibre}%` }}></div>
        </div>
        
        <div className="stat-legend">
          <div><span className="dot dot-plante"></span> Plantée: {stats.surfacePlantee}m² ({stats.pourcentagePlante}%)</div>
          <div><span className="dot dot-minerale"></span> Minérale: {stats.surfaceMinerale}m² ({stats.pourcentageMinerale}%)</div>
          <div><span className="dot dot-libre"></span> Libre: {stats.surfaceLibre}m² ({stats.pourcentageLibre}%)</div>
        </div>
        
        {/* Biodiversité */}
        <div className="stat-section highlight">
          <div className="stat-label">🦋 Biodiversité</div>
          <div className="stat-value">{getEtoilesBiodiversite(stats.scoreBiodiversite)}</div>
          <div className="stat-detail">
            Score: {stats.scoreBiodiversite}/100
          </div>
          <div className="stat-subdetail">
            🐝 {stats.melliferes} mellifères · 🍇 {stats.fructification} fruitiers
          </div>
        </div>
        
        {/* Entretien */}
        <div className="stat-section">
          <div className="stat-label">💧 Arrosage</div>
          <div className="stat-value">{stats.arrosageEstime}L/sem</div>
        </div>
        
        <div className="stat-section">
          <div className="stat-label">⏱️ Entretien</div>
          <div className="stat-value">{stats.tempsEntretien}h/mois</div>
        </div>
        
        {/* Conformité */}
        <div className={`stat-section highlight ${stats.conformite === 100 ? 'success' : stats.conformite >= 80 ? 'warning' : 'error'}`}>
          <div className="stat-label">⚖️ Conformité</div>
          <div className="stat-value">{stats.conformite}%</div>
          {stats.nbProblemes > 0 && (
            <div className="stat-alert">❌ {stats.nbProblemes} problème(s)</div>
          )}
        {stats.nbAvertissements > 0 && (
          <div className="stat-warning">⚠️ {stats.nbAvertissements} avertissement(s)</div>
        )}
      </div>
      
      {/* Section composition du sol - Rectangle visuel */}
      <div className="stat-section highlight sol-section">
        <div className="stat-label">🌍 Composition du sol</div>
        
        {/* Rectangle de visualisation du sol (100cm de hauteur totale) */}
        <div className="sol-visualisation">
          {couchesSol && couchesSol.map((couche, index) => {
            // Calculer la hauteur relative (proportionnelle)
            const profondeurTotale = couchesSol.reduce((sum, c) => sum + c.profondeur, 0);
            const hauteurPourcent = (couche.profondeur / profondeurTotale) * 100;
            
            return (
              <div 
                key={index} 
                className="sol-couche-rect"
                style={{ 
                  backgroundColor: couche.couleur,
                  height: `${hauteurPourcent}%`,
                  borderBottom: index < couchesSol.length - 1 ? '2px dashed #fff' : 'none'
                }}
              >
                <div className="sol-couche-label">
                  <strong>{couche.nom}</strong>
                  <span className="sol-couche-prof">{couche.profondeur}cm</span>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Contrôles d'édition par couche */}
        <div className="sol-controles">
          {couchesSol && couchesSol.map((couche, index) => (
            <div key={index} className="sol-controle-ligne">
              <div className="sol-controle-label">
                <div 
                  className="sol-couleur-mini" 
                  style={{ backgroundColor: couche.couleur }}
                ></div>
                <span>{couche.nom}</span>
              </div>
              
              <div className="sol-controle-boutons">
                <button
                  className="btn-sol-adjust"
                  onClick={() => {
                    if (onCouchesSolChange) {
                      const nouvellesCouches = [...couchesSol];
                      nouvellesCouches[index].profondeur = Math.max(5, nouvellesCouches[index].profondeur - 5);
                      onCouchesSolChange(nouvellesCouches);
                    }
                  }}
                  title="Réduire de 5cm"
                >
                  −
                </button>
                
                <span className="sol-controle-valeur">{couche.profondeur}cm</span>
                
                <button
                  className="btn-sol-adjust"
                  onClick={() => {
                    if (onCouchesSolChange) {
                      const nouvellesCouches = [...couchesSol];
                      nouvellesCouches[index].profondeur = Math.min(200, nouvellesCouches[index].profondeur + 5);
                      onCouchesSolChange(nouvellesCouches);
                    }
                  }}
                  title="Augmenter de 5cm"
                >
                  +
                </button>
              </div>
              
              {/* Dropdown type de sol */}
              <select
                className="sol-type-select"
                value={couche.type}
                onChange={(e) => {
                  if (onCouchesSolChange) {
                    const nouvellesCouches = [...couchesSol];
                    nouvellesCouches[index].type = e.target.value;
                    
                    // Mettre à jour la couleur selon le type
                    if (index === 0) {
                      nouvellesCouches[index].couleur = '#8d6e63'; // Terre végétale
                    } else {
                      switch(e.target.value) {
                        case 'argileux':
                          nouvellesCouches[index].couleur = '#a1887f';
                          nouvellesCouches[index].nom = 'Marne';
                          break;
                        case 'calcaire':
                          nouvellesCouches[index].couleur = '#d7ccc8';
                          nouvellesCouches[index].nom = 'Calcaire';
                          break;
                        case 'sableux':
                          nouvellesCouches[index].couleur = '#ffecb3';
                          nouvellesCouches[index].nom = 'Sable';
                          break;
                        case 'rocheux':
                          nouvellesCouches[index].couleur = '#78909c';
                          nouvellesCouches[index].nom = 'Roche';
                          break;
                        default:
                          nouvellesCouches[index].couleur = '#8d6e63';
                      }
                    }
                    
                    onCouchesSolChange(nouvellesCouches);
                  }
                }}
              >
                <option value="fertile">Fertile</option>
                <option value="argileux">Argileux</option>
                <option value="sableux">Sableux</option>
                <option value="calcaire">Calcaire</option>
                <option value="rocheux">Rocheux</option>
              </select>
            </div>
          ))}
        </div>
        
        <div className="sol-info">
          ℹ️ Profondeur totale : {couchesSol ? couchesSol.reduce((sum, c) => sum + c.profondeur, 0) : 0}cm
        </div>
      </div>
    </div>
  </div>
  );
}

export default DashboardTerrain;

