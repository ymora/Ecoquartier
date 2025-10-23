/**
 * canvasBatchManager.js
 * ✅ Gestionnaire de batch pour optimiser les opérations canvas
 * Réduit les appels renderAll() multiples en les groupant
 */

/**
 * Créer un gestionnaire de batch pour le canvas
 * @param {fabric.Canvas} canvas - Instance du canvas
 * @returns {Object} Gestionnaire de batch
 */
export const createBatchManager = (canvas) => {
  let isBatching = false;
  let renderRequested = false;
  
  const batchManager = {
    /**
     * Démarrer un batch d'opérations
     */
    start() {
      isBatching = true;
      renderRequested = false;
    },
    
    /**
     * Finir le batch et render si nécessaire
     */
    end() {
      isBatching = false;
      if (renderRequested) {
        canvas.renderAll();
        renderRequested = false;
      }
    },
    
    /**
     * Déclencher un render (seulement si pas en batch ou à la fin du batch)
     */
    render() {
      if (isBatching) {
        renderRequested = true;
      } else {
        canvas.renderAll();
      }
    },
    
    /**
     * Exécuter une fonction dans un batch
     */
    execute(operation) {
      this.start();
      try {
        operation();
      } finally {
        this.end();
      }
    }
  };
  
  return batchManager;
};

/**
 * Wrapper pour exécuter plusieurs opérations dans un batch
 * @param {fabric.Canvas} canvas - Instance du canvas
 * @param {Function} operations - Fonction contenant les opérations à exécuter
 */
export const executeBatch = (canvas, operations) => {
  const batchManager = createBatchManager(canvas);
  batchManager.execute(operations);
};

/**
 * Décorateur pour wrapper automatiquement une fonction dans un batch
 * @param {Function} fn - Fonction à wrapper
 * @returns {Function} Fonction wrapper dans un batch
 */
export const withBatch = (fn) => {
  return (canvas, ...args) => {
    const batchManager = createBatchManager(canvas);
    return batchManager.execute(() => fn(canvas, ...args));
  };
};

