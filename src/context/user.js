
import React, { useState } from 'react'

const User = React.createContext()

export const UserWrapper = Component => (props) => {
  const [user, updateUserProfile] = useState(null)

  return (
    <User.Provider value={{ user, updateUserProfile }}>
      <Component {...props} />
    </User.Provider>
  )
}

export default User
