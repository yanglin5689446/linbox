import React, { useEffect, useContext } from 'react'

import withProvider from 'context'
import UserContext from 'context/user'
import { hot } from 'react-hot-loader/root'
import AppRouter from './AppRouter'
import Login from './pages/Login'

import useGoogleAPI from './utils/hooks/google_api'
import './App.css'

const App = () => {
  const { initClient } = useGoogleAPI()
  useEffect(initClient, [])
  const { user } = useContext(UserContext)

  return user ? <AppRouter /> : <Login />
}

export default hot(withProvider(App))
