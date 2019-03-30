import React, { useEffect, useContext } from 'react'

import withProvider from 'context'
import UserContext from 'context/user'
import AppRouter from './AppRouter'
import Login from './pages/Login'

import './App.css'
import useGoogleAPI from './utils/hooks/google_api'

const App = () => {
  const { initClient } = useGoogleAPI()
  useEffect(initClient, [])
  const { user } = useContext(UserContext)

  return user ? <AppRouter /> : <Login />
}

export default withProvider(App)
