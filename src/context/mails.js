
import React, { useReducer } from 'react'
import useActionCreator from 'utils/hooks/action_creator'

const MailsContext = React.createContext()

const actions = {
  setMails: 'SET_MAILS',
  addMessageLabel: 'ADD_MESSAGE_LABEL',
  removeMessage: 'REMOVE_MESSAGE',
  removeThread: 'REMOVE_THREAD',
  removeMessageLabel: 'REMOVE_MESSAGE_LABEL',
  removeThreadLabel: 'REMOVE_THREAD_LABEL',
  addThreadLabel: 'ADD_THREAD_LABEL',
}

const reducer = (state, action) => {
  const { payload } = action
  switch (action.type) {
    case actions.setMails:
      return payload
    case actions.addMessageLabel: {
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
              labelIds: [...message.labelIds, label],
            }))),
      }
      return [
        ...state.slice(0, index),
        updated,
        ...state.slice(index + 1),
      ]
    }
    case actions.removeMessageLabel: {
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

    case actions.removeThreadLabel: {
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

    case actions.addThreadLabel: {
      const { id, label } = payload
      const index = state.findIndex(thread => thread.id === id)
      const thread = state[index]
      const updated = {
        ...thread,
        messages: thread.messages
          .map(message => ({
            ...message,
            labelIds: [...message.labelIds, label],
          })),
      }
      return [
        ...state.slice(0, index),
        updated,
        ...state.slice(index + 1),
      ]
    }

    case actions.removeMessage: {
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
    case actions.removeThread: {
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
  const setMails = useActionCreator(actions.setMails, dispatch)
  const removeMessage = useActionCreator(actions.removeMessage, dispatch)
  const removeThread = useActionCreator(actions.removeThread, dispatch)
  const removeMessageLabel = useActionCreator(actions.removeMessageLabel, dispatch)
  const addMessageLabel = useActionCreator(actions.addMessageLabel, dispatch)
  const removeThreadLabel = useActionCreator(actions.removeThreadLabel, dispatch)
  const addThreadLabel = useActionCreator(actions.addThreadLabel, dispatch)

  return (
    <MailsContext.Provider value={{
      addMessageLabel,
      removeMessageLabel,
      removeThreadLabel,
      removeMessage,
      removeThread,
      addThreadLabel,
      mails,
      setMails,
    }}
    >
      <Component {...props} />
    </MailsContext.Provider>
  )
}

export default MailsContext
