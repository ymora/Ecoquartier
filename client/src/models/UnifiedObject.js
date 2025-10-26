/**
 * Modèle d'objet unifié pour 2D/3D
 * Principe DRY : Un seul objet, deux représentations
 * Applique les principes SOLID et les meilleures pratiques 2025
 */

export class UnifiedObject {
  constructor(data = {}) {
    // Propriétés de base (communes 2D/3D)
    this.id = data.id || this.generateId();
    this.type = data.type || 'unknown';
    this.position = data.position || { x: 0, y: 0, z: 0 };
    this.rotation = data.rotation || 0;
    this.scale = data.scale || { x: 1, y: 1, z: 1 };
    
    // Propriétés spécifiques selon le type
    this.dimensions = data.dimensions || {};
    this.material = data.material || {};
    this.metadata = data.metadata || {};
    
    // État de synchronisation
    this._dirty = false;
    this._listeners = new Set();
  }

  /**
   * Génère un ID unique
   */
  generateId() {
    return `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Met à jour une propriété et notifie les listeners
   */
  setProperty(key, value) {
    const oldValue = this[key];
    this[key] = value;
    this._dirty = true;
    
    // Notifier les changements
    this._notifyChange(key, value, oldValue);
  }

  /**
   * Met à jour plusieurs propriétés en une fois
   */
  setProperties(properties) {
    const changes = {};
    
    Object.entries(properties).forEach(([key, value]) => {
      const oldValue = this[key];
      this[key] = value;
      changes[key] = { value, oldValue };
    });
    
    this._dirty = true;
    this._notifyChanges(changes);
  }

  /**
   * Obtient une propriété avec valeur par défaut
   */
  getProperty(key, defaultValue = null) {
    return this[key] !== undefined ? this[key] : defaultValue;
  }

  /**
   * Ajoute un listener pour les changements
   */
  addChangeListener(callback) {
    this._listeners.add(callback);
    return () => this._listeners.delete(callback);
  }

  /**
   * Notifie un changement
   */
  _notifyChange(key, newValue, oldValue) {
    this._listeners.forEach(callback => {
      try {
        callback({ key, newValue, oldValue, object: this });
      } catch (error) {
        console.error('Erreur dans le listener:', error);
      }
    });
  }

  /**
   * Notifie plusieurs changements
   */
  _notifyChanges(changes) {
    this._listeners.forEach(callback => {
      try {
        callback({ changes, object: this });
      } catch (error) {
        console.error('Erreur dans le listener:', error);
      }
    });
  }

  /**
   * Marque l'objet comme propre
   */
  markClean() {
    this._dirty = false;
  }

  /**
   * Vérifie si l'objet a des changements non sauvegardés
   */
  isDirty() {
    return this._dirty;
  }

  /**
   * Sérialise l'objet pour la sauvegarde
   */
  serialize() {
    return {
      id: this.id,
      type: this.type,
      position: { ...this.position },
      rotation: this.rotation,
      scale: { ...this.scale },
      dimensions: { ...this.dimensions },
      material: { ...this.material },
      metadata: { ...this.metadata }
    };
  }

  /**
   * Désérialise un objet depuis la sauvegarde
   */
  static deserialize(data) {
    return new UnifiedObject(data);
  }

  /**
   * Clone l'objet
   */
  clone() {
    return new UnifiedObject(this.serialize());
  }

  /**
   * Valide les propriétés de l'objet
   */
  validate() {
    const errors = [];
    
    // Validation de base
    if (!this.type) {
      errors.push('Type d\'objet requis');
    }
    
    if (!this.position || typeof this.position.x !== 'number') {
      errors.push('Position X invalide');
    }
    
    if (!this.position || typeof this.position.z !== 'number') {
      errors.push('Position Z invalide');
    }
    
    // Validation spécifique selon le type
    switch (this.type) {
      case 'maison':
        if (!this.dimensions.largeur || this.dimensions.largeur <= 0) {
          errors.push('Largeur de maison invalide');
        }
        if (!this.dimensions.profondeur || this.dimensions.profondeur <= 0) {
          errors.push('Profondeur de maison invalide');
        }
        break;
        
      case 'citerne':
        if (!this.dimensions.diametre || this.dimensions.diametre <= 0) {
          errors.push('Diamètre de citerne invalide');
        }
        break;
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * Factory pour créer des objets typés
 */
export class ObjectFactory {
  static createMaison(data = {}) {
    return new UnifiedObject({
      type: 'maison',
      dimensions: {
        largeur: 10,
        profondeur: 8,
        hauteur: 7,
        ...data.dimensions
      },
      material: {
        couleur: '#f5e6d3',
        typeToit: 'deux-pentes',
        ...data.material
      },
      ...data
    });
  }

  static createCiterne(data = {}) {
    return new UnifiedObject({
      type: 'citerne',
      dimensions: {
        diametre: 1.5,
        longueur: 2.5,
        hauteur: 1.5,
        ...data.dimensions
      },
      material: {
        couleur: '#00acc1',
        ...data.material
      },
      ...data
    });
  }

  static createTerrasse(data = {}) {
    return new UnifiedObject({
      type: 'terrasse',
      dimensions: {
        largeur: 4,
        profondeur: 3,
        hauteur: 0.15,
        ...data.dimensions
      },
      material: {
        couleur: '#8d6e63',
        ...data.material
      },
      ...data
    });
  }

  static createArbre(data = {}) {
    return new UnifiedObject({
      type: 'arbre',
      dimensions: {
        hauteur: 8,
        envergure: 5,
        profondeurRacines: 2.5,
        ...data.dimensions
      },
      material: {
        couleur: '#4caf50',
        ...data.material
      },
      metadata: {
        arbreData: data.arbreData || {},
        validationStatus: 'ok',
        ...data.metadata
      },
      ...data
    });
  }
}

export default UnifiedObject;
