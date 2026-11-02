import { useContext } from 'react'
import { DesignContext } from '../context/DesignContext'

export function useDesign() {
  const context = useContext(DesignContext)
  if (!context) throw new Error('useDesign must be used inside DesignProvider')
  return context
}
