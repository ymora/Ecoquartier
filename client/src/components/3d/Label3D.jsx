/**
 * LABEL 3D - Composant réutilisable pour afficher des labels dans la scène 3D
 * ✅ Unifié entre tous les composants 3D
 * ✅ Pas de duplication de code
 */
import { Html } from '@react-three/drei';
import './Label3D.css';

/**
 * Label flottant en 3D avec style uniforme
 * @param {Array} position - Position [x, y, z]
 * @param {ReactNode} children - Contenu du label
 * @param {string} variant - Variante de style ('default', 'large', 'compact')
 * @param {number} distanceFactor - Facteur de distance pour Html (optionnel)
 */
export default function Label3D({ 
  position, 
  children, 
  variant = 'default',
  distanceFactor 
}) {
  const htmlProps = distanceFactor ? { distanceFactor, position } : { position };
  
  return (
    <Html {...htmlProps} center>
      <div className={`label-3d label-3d-${variant}`}>
        {children}
      </div>
    </Html>
  );
}

