
import React, { useState, useCallback } from 'react'
import processThreads from 'utils/processThreads'

const MailsContext = React.createContext()

export const MailsWrapper = Component => (props) => {
  const [mails, setMails] = useState({})

  const updateMails = useCallback(({ div, threads }) => setMails(prev => ({
    ...prev,
    [div]: {
      raw: threads,
      processed: processThreads(threads),
    },
  })), [])

  return (
    <MailsContext.Provider value={{ mails, updateMails }}>
      <Component {...props} />
    </MailsContext.Provider>
  )
}

export default MailsContext
