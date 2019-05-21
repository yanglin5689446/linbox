
import React, { useReducer } from 'react'
import actionCreator from 'utils/actionCreator'

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
    case actions.updateDrafts:
      return { ...state, drafts: payload }
    case actions.newDraftEdit:
      return {
        ...state,
        editing: {
          ...state.editing,
          [payload.id]: payload,
        },
      }
    case actions.closeDraftEdit: {
      const { [payload]: discard, ...editing } = state.editing
      return { ...state, editing }
    }
    case actions.updateDraftEdit:
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
  const updateDrafts = actionCreator(actions.updateDrafts, dispatch)
  const newDraftEdit = actionCreator(actions.newDraftEdit, dispatch)
  const closeDraftEdit = actionCreator(actions.closeDraftEdit, dispatch)
  const updateDraftEdit = actionCreator(actions.updateDraftEdit, dispatch)

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
