
import React, { useContext, useEffect } from 'react'
import {
  withStyles,
} from '@material-ui/core'

import TimeSlice from 'components/TimeSlice'

import MailsContext from 'context/mails'
import useGmailAPI from 'utils/hooks/gmail_api'

const styles = () => ({
  container: {
    width: '60vw',
    maxWidth: 1200,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
})

const Inbox = ({ classes }) => {
  const { mails } = useContext(MailsContext)
  const { initLoadInbox } = useGmailAPI()
  useEffect(initLoadInbox, [])
  return (
    <div className={classes.container}>
      {
        mails.inbox
          ? Object.entries(mails.inbox.processed)
            .map(([key, Clusters]) => (
              <TimeSlice
                key={key}
                name={key}
                Clusters={Clusters}
              />
            ))
          : 'Loading...'
      }
    </div>
  )
}

export default withStyles(styles)(Inbox)
