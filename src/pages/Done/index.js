
import React from 'react'
import { withStyles } from '@material-ui/core'

import useProcessedMails from 'utils/hooks/processed_mails'
import Preview from 'components/Mail/Preview'
import ReloadButton from 'components/ReloadButton'

const styles = () => ({
  container: {
    width: '70vw',
    maxWidth: 1200,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  reloadButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
})

const Done = ({ classes }) => {
  const processed = useProcessedMails({ excludes: ['INBOX', 'TRASH', 'SPAM'] })

  return (
    <div className={classes.container}>
      <div className={classes.reloadButtonContainer}>
        <ReloadButton />
      </div>
      <div>
        {
          processed
            ? processed.map(clusters => (
              <Preview
                key={clusters.label}
                clusters={clusters}
              />
            ))
            : 'Loading...'
        }
      </div>

    </div>
  )
}

export default withStyles(styles)(Done)
