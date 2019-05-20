
import React from 'react'
import {
  withStyles,
} from '@material-ui/core'

import useProcessedMails from 'utils/hooks/processed_mails'
import useGmailAPI from 'utils/hooks/gmail_api'
import Preview from 'components/Mail/Preview'
import ReloadButton from 'components/ReloadButton'

import styles from 'pages/style'

const Inbox = ({ classes }) => {
  const processed = useProcessedMails({ includes: ['INBOX', 'SENT'] })
  const { loadMails } = useGmailAPI()

  return (
    <div className={classes.container}>
      <div className={classes.reloadButtonContainer}>
        <ReloadButton onClick={loadMails} />
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

export default withStyles(styles)(Inbox)
