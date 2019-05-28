
import React, { useState, useCallback } from 'react'

const LoadingStatusContext = React.createContext()

export const STATUS = {
  IDLE: 'IDLE',
  FETCHING: 'FETCHING',
  DONE: 'DONE',
}

export const LoadingStatusWrapper = Component => (props) => {
  const [status, setStatus] = useState({
    mails: STATUS.IDLE,
    drafts: STATUS.IDLE,
  })

  const setMailsStatus = useCallback(
    params => setStatus(state => ({ ...state, mails: params })),
    [setStatus],
  )
  const setDraftsStatus = useCallback(
    params => setStatus(state => ({ ...state, drafts: params })),
    [setStatus],
  )

  return (
    <LoadingStatusContext.Provider value={{
      setMailsStatus,
      setDraftsStatus,
      status,
    }}
    >
      <Component {...props} />
    </LoadingStatusContext.Provider>
  )
}


export default LoadingStatusContext
