import React, { useEffect, useContext } from 'react'

import withProvider from 'context'
import UserContext from 'context/user'
import { hot } from 'react-hot-loader/root'

import debug from 'utils/debug'
import useGoogleAPI from './utils/hooks/google_api'

import AppRouter from './AppRouter'
import Login from './pages/Login'

import './i18n'

window.debug = debug

const App = () => {
  const { initClient } = useGoogleAPI()
  useEffect(initClient, [])
  const { user } = useContext(UserContext)

  return user ? <AppRouter /> : <Login />
}

export default hot(withProvider(App))
