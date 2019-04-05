
import React, { useState, useCallback } from 'react'

const ContactsContext = React.createContext()

export const ContactsWrapper = Component => (props) => {
  const [contacts, setContacts] = useState({})

  const updateContacts = useCallback(updates => setContacts(prev => ({
    ...prev,
    ...updates,
  })), [])

  return (
    <ContactsContext.Provider value={{ contacts, updateContacts }}>
      <Component {...props} />
    </ContactsContext.Provider>
  )
}

export default ContactsContext
