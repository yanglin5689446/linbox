
import React, { useState } from 'react'

const MailsContext = React.createContext()

export const MailsWrapper = Component => (props) => {
  const [mails, setMails] = useState([])

  return (
    <MailsContext.Provider value={{ mails, setMails }}>
      <Component {...props} />
    </MailsContext.Provider>
  )
}

export default MailsContext
