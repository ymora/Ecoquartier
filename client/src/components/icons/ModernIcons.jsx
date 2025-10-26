import React from 'react';

/**
 * Icônes modernes et cohérentes avec le style de l'application
 * Remplace les emojis par des SVG modernes
 */

// Icône de suppression moderne
export const DeleteIcon = ({ size = 16, color = '#f44336', className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`modern-icon delete-icon ${className}`}
    {...props}
  >
    <path
      d="M3 6h18l-1 13H4L3 6zM8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 11v6M14 11v6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Icône de suppression simple (pour les boutons compacts)
export const DeleteSimpleIcon = ({ size = 14, color = '#f44336', className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`modern-icon delete-simple-icon ${className}`}
    {...props}
  >
    <path
      d="M18 6L6 18M6 6l12 12"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Icône de suppression avec cercle
export const DeleteCircleIcon = ({ size = 16, color = '#f44336', className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`modern-icon delete-circle-icon ${className}`}
    {...props}
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke={color}
      strokeWidth="2"
    />
    <path
      d="M15 9l-6 6M9 9l6 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Icône de suppression avec poubelle
export const TrashIcon = ({ size = 16, color = '#f44336', className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`modern-icon trash-icon ${className}`}
    {...props}
  >
    <path
      d="M3 6h18l-1 13H4L3 6zM8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 11v6M14 11v6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Icône de suppression avec alerte
export const DeleteAlertIcon = ({ size = 16, color = '#f44336', className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`modern-icon delete-alert-icon ${className}`}
    {...props}
  >
    <path
      d="M12 9v4M12 17h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 9l-6 6M9 9l6 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Icône de suppression avec confirmation
export const DeleteConfirmIcon = ({ size = 16, color = '#f44336', className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`modern-icon delete-confirm-icon ${className}`}
    {...props}
  >
    <path
      d="M9 12l2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 9l-6 6M9 9l6 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Icône de suppression avec flèche
export const DeleteArrowIcon = ({ size = 16, color = '#f44336', className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`modern-icon delete-arrow-icon ${className}`}
    {...props}
  >
    <path
      d="M3 6h18l-1 13H4L3 6zM8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 11v6M14 11v6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Icône de suppression avec point d'exclamation
export const DeleteExclamationIcon = ({ size = 16, color = '#f44336', className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`modern-icon delete-exclamation-icon ${className}`}
    {...props}
  >
    <path
      d="M12 9v4M12 17h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 9l-6 6M9 9l6 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Icône de suppression avec cercle plein
export const DeleteFilledIcon = ({ size = 16, color = '#f44336', className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`modern-icon delete-filled-icon ${className}`}
    {...props}
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      fill={color}
    />
    <path
      d="M15 9l-6 6M9 9l6 6"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Icône de suppression avec poubelle pleine
export const TrashFilledIcon = ({ size = 16, color = '#f44336', className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`modern-icon trash-filled-icon ${className}`}
    {...props}
  >
    <path
      d="M3 6h18l-1 13H4L3 6zM8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
      fill={color}
    />
    <path
      d="M10 11v6M14 11v6"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Export par défaut
export default {
  DeleteIcon,
  DeleteSimpleIcon,
  DeleteCircleIcon,
  TrashIcon,
  DeleteAlertIcon,
  DeleteConfirmIcon,
  DeleteArrowIcon,
  DeleteExclamationIcon,
  DeleteFilledIcon,
  TrashFilledIcon
};
