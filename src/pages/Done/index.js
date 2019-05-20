
import React from 'react'
import {
  withStyles,
  Fab,
} from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/Refresh'

import Preview from 'components/Mail/Preview'

import useProcessedMails from 'utils/hooks/processed_mails'
import useGmailAPI from 'utils/hooks/gmail_api'

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
  refreshIcon: {
    margin: 2,
  },
})

const Done = ({ classes }) => {
  const processed = useProcessedMails({ excludes: ['INBOX', 'TRASH', 'SPAM'] })
  const { loadMails } = useGmailAPI()

  return (
    <div className={classes.container}>
      <div className={classes.reloadButtonContainer}>
        <Fab
          variant='extended'
          size='small'
          color='primary'
          onClick={loadMails}
          className={classes.reloadButton}
        >
          <RefreshIcon className={classes.refreshIcon} />
          Reload
        </Fab>
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
