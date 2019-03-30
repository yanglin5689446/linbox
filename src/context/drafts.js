
import React, { useReducer, useCallback } from 'react'

const DraftsContext = React.createContext()

const actions = {
  newDraftEdit: 'NEW_DRAFT_EDIT',
  closeDraftEdit: 'CLOSE_DRAFT_EDIT',
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'NEW_DRAFT_EDIT':
      return [...state, action.payload]
    case 'CLOSE_DRAFT_EDIT':
      return [
        ...state.slice(0, action.payload),
        ...state.slice(action.payload + 1, state.length),
      ]
    default:
      return state
  }
}

export const DraftsWrapper = Component => (props) => {
  const [drafts, dispatch] = useReducer(reducer, [])
  const newDraftEdit = useCallback(payload => dispatch({
    type: actions.newDraftEdit,
    payload,
  }), [])
  const closeDraftEdit = useCallback(payload => dispatch({
    type: actions.closeDraftEdit,
    payload,
  }), [])

  return (
    <DraftsContext.Provider value={{ drafts, newDraftEdit, closeDraftEdit }}>
      <Component {...props} />
    </DraftsContext.Provider>
  )
}

export default DraftsContext
