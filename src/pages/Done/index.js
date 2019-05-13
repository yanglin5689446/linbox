
import React from 'react'
import {
  withStyles,
} from '@material-ui/core'

import TimeSlice from 'components/Mail/TimeSlice'

import useProcessedMails from 'utils/hooks/processed_mails'

const styles = () => ({
  container: {
    width: '70vw',
    maxWidth: 1200,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
})

const Done = ({ classes }) => {
  const processed = useProcessedMails({ excludes: ['INBOX', 'TRASH', 'SPAM'] })

  return (
    <div className={classes.container}>
      {
        processed
          ? processed.map(clusters => (
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
