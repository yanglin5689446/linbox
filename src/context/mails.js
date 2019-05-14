
import React, { useReducer, useCallback } from 'react'

const MailsContext = React.createContext()

const actions = {
  setMails: 'SET_MAILS',
  removeMessage: 'REMOVE_MESSAGE',
  removeThread: 'REMOVE_THREAD',
  markMessageAsRead: 'MARK_MESSAGE_AS_READ',
}

const reducer = (state, action) => {
  const { payload } = action
  switch (action.type) {
    case 'SET_MAILS':
      return payload
    case 'MARK_MESSAGE_AS_READ': {
      const { threadId, id } = payload
      const index = state.findIndex(thread => thread.id === threadId)
      const thread = state[index]
      const updated = {
        ...thread,
        messages: thread.messages
          .map(message => (message.id !== id
            ? message
            : ({
              ...message,
              labelIds: message.labelIds.filter(labelId => labelId !== 'UNREAD'),
            }))),
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

  const markMessageAsRead = useCallback(payload => dispatch({
    type: actions.markMessageAsRead,
    payload,
  }), [])

  return (
    <MailsContext.Provider value={{
      markMessageAsRead, removeMessage, removeThread, mails, setMails,
    }}
    >
      <Component {...props} />
    </MailsContext.Provider>
  )
}

export default MailsContext
