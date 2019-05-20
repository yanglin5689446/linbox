
import React from 'react'
import { withStyles } from '@material-ui/core'

import useProcessedMails from 'utils/hooks/processed_mails'
import useGmailAPI from 'utils/hooks/gmail_api'
import Thread from 'components/Mail/Thread'
import ReloadButton from 'components/ReloadButton'

import styles from 'pages/style'

const Trash = ({ classes }) => {
  const processed = useProcessedMails({ includes: ['TRASH'], aggregate: false })
  const { loadMails } = useGmailAPI()

  return (
    <div className={classes.container}>
      <div className={classes.reloadButtonContainer}>
        <ReloadButton onClick={loadMails} />
      </div>
      <div>
        {
          processed.map(thread => <Thread key={thread.id} {...thread} />)
        }
      </div>

    </div>
  )
}

export default withStyles(styles)(Trash)
