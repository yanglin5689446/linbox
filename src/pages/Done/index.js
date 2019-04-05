
import React, { useContext, useCallback } from 'react'
import {
  withStyles,
} from '@material-ui/core'

import TimeSlice from 'components/TimeSlice'

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

const Done = ({ classes }) => {
  const { mails } = useContext(MailsContext)
  const getDoneMails = useCallback(() => compose(
    processThreads,
    filterThreadsByLabel(labels => !labels.some(e => ['INBOX', 'TRASH', 'SPAM'].includes(e))),
  )(mails.raw), [mails.raw])

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
