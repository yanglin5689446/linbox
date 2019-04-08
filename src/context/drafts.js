
import React, { useReducer, useCallback } from 'react'

const DraftsContext = React.createContext()

const actions = {
  updateDrafts: 'UPDATE_DRAFTS',
  newDraftEdit: 'NEW_DRAFT_EDIT',
  closeDraftEdit: 'CLOSE_DRAFT_EDIT',
  updateDraftEdit: 'UPDATE_DRAFT_EDIT',
}

const reducer = (state, action) => {
  const { payload } = action
  switch (action.type) {
    case 'UPDATE_DRAFTS':
      return { ...state, drafts: payload }
    case 'NEW_DRAFT_EDIT':
      return {
        ...state,
        editing: {
          ...state.editing,
          [payload.id]: payload,
        },
      }
    case 'CLOSE_DRAFT_EDIT': {
      const { [payload]: discard, ...editing } = state.editing
      return { ...state, editing }
    }
    case 'UPDATE_DRAFT_EDIT':
      return {
        ...state,
        editing: {
          ...state.editing,
          [payload.id]: {
            ...state[payload.id],
            ...payload,
          },
        },
      }
    default:
      return state
  }
}

export const DraftsWrapper = Component => (props) => {
  const [drafts, dispatch] = useReducer(reducer, {
    drafts: [],
    editing: {},
  })
  const updateDrafts = useCallback(payload => dispatch({
    type: actions.updateDrafts,
    payload,
  }), [])
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
      drafts, newDraftEdit, closeDraftEdit, updateDraftEdit, updateDrafts,
    }}
    >
      <Component {...props} />
    </DraftsContext.Provider>
  )
}

export default DraftsContext
