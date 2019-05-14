
import React, { useState, useCallback } from 'react'

const LabelsContext = React.createContext()

export const LabelsWrapper = Component => (props) => {
  const [labels, setLabels] = useState({
    category: [],
    system: [],
    user: [],
  })

  const updateLabels = useCallback(updates => setLabels(prev => ({
    ...prev,
    ...updates,
  })), [])

  return (
    <LabelsContext.Provider value={{ labels, updateLabels }}>
      <Component {...props} />
    </LabelsContext.Provider>
  )
}

export default LabelsContext
