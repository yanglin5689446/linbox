
import React, { useReducer, useCallback } from 'react'

const MailsContext = React.createContext()

const actions = {
  setMails: 'SET_MAILS',
  removeMessage: 'REMOVE_MESSAGE',
  removeThread: 'REMOVE_THREAD',
  removeMessageLabel: 'REMOVE_MESSAGE_LABEL',
  removeThreadLabel: 'REMOVE_THREAD_LABEL',
}

const reducer = (state, action) => {
  const { payload } = action
  switch (action.type) {
    case 'SET_MAILS':
      return payload
    case 'REMOVE_MESSAGE_LABEL': {
      const { threadId, id, label } = payload
      const index = state.findIndex(thread => thread.id === threadId)
      const thread = state[index]
      const updated = {
        ...thread,
        messages: thread.messages
          .map(message => (message.id !== id
            ? message
            : ({
              ...message,
              labelIds: message.labelIds.filter(labelId => labelId !== label),
            }))),
      }
      return [
        ...state.slice(0, index),
        updated,
        ...state.slice(index + 1),
      ]
    }

    case 'REMOVE_THREAD_LABEL': {
      const { id, label } = payload
      const index = state.findIndex(thread => thread.id === id)
      const thread = state[index]
      const updated = {
        ...thread,
        messages: thread.messages
          .map(message => ({
            ...message,
            labelIds: message.labelIds.filter(labelId => labelId !== label),
          })),
      }
      return [
        ...state.slice(0, index),
        updated,
        ...state.slice(index + 1),
      ]
    }

    case 'REMOVE_MESSAGE': {
      const { threadId, id } = payload
      const index = state.findIndex(thread => thread.id === threadId)
      const thread = state[index]
      const updated = {
        ...thread,
        messages: thread.messages.filter(message => message.id !== id),
      }
      return [
        ...state.slice(0, index),
        updated,
        ...state.slice(index + 1),
      ]
    }
    case 'REMOVE_THREAD': {
      const id = payload
      const index = state.findIndex(thread => thread.id === id)
      return [
        ...state.slice(0, index),
        ...state.slice(index + 1),
      ]
    }

    default:
      return state
  }
}

export const MailsWrapper = Component => (props) => {
  const [mails, dispatch] = useReducer(reducer, [])
  const setMails = useCallback(payload => dispatch({
    type: actions.setMails,
    payload,
  }), [])

  const removeMessage = useCallback(payload => dispatch({
    type: actions.removeMessage,
    payload,
  }), [])

  const removeThread = useCallback(payload => dispatch({
    type: actions.removeThread,
    payload,
  }), [])

  const removeMessageLabel = useCallback(payload => dispatch({
    type: actions.removeMessageLabel,
    payload,
  }), [])

  const removeThreadLabel = useCallback(payload => dispatch({
    type: actions.removeThreadLabel,
    payload,
  }), [])

  return (
    <MailsContext.Provider value={{
      removeMessageLabel,
      removeThreadLabel,
      removeMessage,
      removeThread,
      mails,
      setMails,
    }}
    >
      <Component {...props} />
    </MailsContext.Provider>
  )
}

export default MailsContext
