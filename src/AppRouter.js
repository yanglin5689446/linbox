
import React, { useEffect } from 'react'
import { BrowserRouter, Switch } from 'react-router-dom'
import { Route } from 'react-router'
import CssBaseline from '@material-ui/core/CssBaseline'
import Layout from 'components/Layout'

import Inbox from 'pages/Inbox'
import Done from 'pages/Done'
import useGmailAPI from 'utils/hooks/gmail_api'

const Dummy = name => () => (<div>{name}</div>)

const AppRouter = () => {
  const { loadMails } = useGmailAPI()
  useEffect(loadMails, [])
  return (
    <BrowserRouter>
      <CssBaseline />
      <Layout>
        <Switch>
          <Route exact path='/' component={Inbox} />
          <Route path='/snoozed' component={Dummy('snoozed')} />
          <Route path='/done' component={Done} />
          <Route path='/drafts' component={Dummy('drafts')} />
          <Route path='/sent' component={Dummy('sent')} />
          <Route path='/reminders' component={Dummy('reminders')} />
          <Route path='/trash' component={Dummy('trash')} />
          <Route path='/span' component={Dummy('span')} />
          <Route path='/trips' component={Dummy('trips')} />
          <Route path='/cluster/:id' component={Dummy('cluster/:id')} />
        </Switch>
      </Layout>
    </BrowserRouter>
  )
}


export default AppRouter
