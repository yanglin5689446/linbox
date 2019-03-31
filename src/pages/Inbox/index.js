
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
          ? mails.inbox.processed
            .map(clusters => (
              <TimeSlice
                key={clusters.label}
                clusters={clusters}
              />
            ))
          : 'Loading...'
      }
    </div>
  )
}

export default withStyles(styles)(Inbox)
