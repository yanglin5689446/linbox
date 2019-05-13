
import React, { useContext, useCallback } from 'react'
import {
  withStyles,
} from '@material-ui/core'

import TimeSlice from 'components/Mail/TimeSlice'

import MailsContext from 'context/mails'
import LabelsContext from 'context/labels'
import processThreads from 'utils/processThreads'
import filterThreadsByLabel from 'utils/filterThreadsByLabel'

const styles = () => ({
  container: {
    width: '70vw',
    maxWidth: 1200,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
})

const Done = ({ classes }) => {
  const { mails } = useContext(MailsContext)
  const { labels } = useContext(LabelsContext)
  const getDoneMails = useCallback(() => {
    const threads = filterThreadsByLabel(labelIds => !labelIds
      .some(e => ['INBOX', 'TRASH', 'SPAM']
        .includes(e)))(mails)
    return processThreads(threads, labels)
  }, [mails])

  const doneMails = getDoneMails()

  return (
    <div className={classes.container}>
      {
        doneMails
          ? doneMails.map(clusters => (
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

export default withStyles(styles)(Done)
