
import React, { useContext, useCallback } from 'react'
import {
  withStyles,
} from '@material-ui/core'

import TimeSlice from 'components/Mail/TimeSlice'

import MailsContext from 'context/mails'
import processThreads from 'utils/processThreads'
import filterThreadsByLabel from 'utils/filterThreadsByLabel'
import compose from 'utils/compose'

const styles = () => ({
  container: {
    width: '70vw',
    maxWidth: 1200,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
})

const Inbox = ({ classes }) => {
  const { mails } = useContext(MailsContext)
  const getInboxMails = useCallback(() => compose(
    processThreads,
    filterThreadsByLabel(labels => labels.includes('INBOX')),
  )(mails.raw), [mails.raw])
  const inboxMails = getInboxMails()

  return (
    <div className={classes.container}>
      {
        inboxMails
          ? inboxMails.map(clusters => (
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
