/**
 * POINT D'ENTRÉE CLEAN - Interface Sans Doublons
 * Complètement neuve, zéro ancien code
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppClean from './App-clean.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppClean />
  </StrictMode>,
)

