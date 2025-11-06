/**
 * Canvas Terrain adapté pour l'interface Neo Garden
 * Version simplifiée et optimisée
 */
import { memo } from 'react';
import CanvasTerrain from './CanvasTerrain';
import PanneauLateral from './PanneauLateral';
import NeoTimeline from './neo/NeoTimeline';

const CanvasTerrainNeo = memo(({
  dimensions,
  orientation,
  onDimensionsChange,
  onOrientationChange,
  onCanvasReady
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%',
      width: '100%'
    }}>
      {/* Canvas principal (sans timeline intégrée) */}
      <div style={{ flex: 1, position: 'relative' }}>
        <CanvasTerrain
          dimensions={dimensions}
          orientation={orientation}
          onDimensionsChange={onDimensionsChange}
          onOrientationChange={onOrientationChange}
          onCanvasReady={onCanvasReady}
        />
      </div>
    </div>
  );
});

CanvasTerrainNeo.displayName = 'CanvasTerrainNeo';

export default CanvasTerrainNeo;

