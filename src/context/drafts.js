
import React, { useReducer, useCallback } from 'react'

const DraftsContext = React.createContext()

const actions = {
  newDraftEdit: 'NEW_DRAFT_EDIT',
  closeDraftEdit: 'CLOSE_DRAFT_EDIT',
  updateDraftEdit: 'UPDATE_DRAFT_EDIT',
}

const reducer = (state, action) => {
  const { payload } = action
  switch (action.type) {
    case 'NEW_DRAFT_EDIT':
      return { ...state, [payload.id]: payload }
    case 'CLOSE_DRAFT_EDIT': {
      const { [payload]: discard, ...newState } = state
      return newState
    }
    case 'UPDATE_DRAFT_EDIT':
      return {
        ...state,
        [payload.id]: {
          ...state[payload.id],
          ...payload,
        },
      }
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
  const updateDraftEdit = useCallback(payload => dispatch({
    type: actions.updateDraftEdit,
    payload,
  }), [])

  return (
    <DraftsContext.Provider value={{
      drafts, newDraftEdit, closeDraftEdit, updateDraftEdit,
    }}
    >
      <Component {...props} />
    </DraftsContext.Provider>
  )
}

export default DraftsContext
