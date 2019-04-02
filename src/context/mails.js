
import React, { useState, useCallback } from 'react'

const MailsContext = React.createContext()

export const MailsWrapper = Component => (props) => {
  const [mails, setMails] = useState({
    raw: [],
  })

  const updateMails = useCallback(updates => setMails(prev => ({
    ...prev,
    ...updates,
  })), [])

  return (
    <MailsContext.Provider value={{ mails, updateMails }}>
      <Component {...props} />
    </MailsContext.Provider>
  )
}

export default MailsContext
