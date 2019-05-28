
import React, { useContext } from 'react'
import {
  CircularProgress,
  withStyles,
} from '@material-ui/core'

import LoadingStatusContext, { STATUS } from 'context/loadingStatus'

import useProcessedMails from 'utils/hooks/processed_mails'
import useGmailAPI from 'utils/hooks/gmail_api'
import Preview from 'components/Mail/Preview'
import ReloadButton from 'components/ReloadButton'

import styles from 'pages/style'

const PureCircularProgress = React.memo(CircularProgress)

const Inbox = ({ classes }) => {
  const processed = useProcessedMails({ includes: ['INBOX', 'SENT'] })
  const { loadMails } = useGmailAPI()
  const { status } = useContext(LoadingStatusContext)

  return (
    <div className={classes.container}>
      {
        status.mails === STATUS.DONE
          ? (
            <React.Fragment>
              <div className={classes.reloadButtonContainer}>
                <ReloadButton onClick={loadMails} />
              </div>
              <div>
                {
                  processed.map(clusters => (
                    <Preview
                      key={clusters.label}
                      clusters={clusters}
                      actions={{
                        markAsDone: true,
                        trash: true,
                      }}
                    />
                  ))
                }
              </div>
            </React.Fragment>
          )
          : (
            <div className={classes.circularProgressContainer}>
              <PureCircularProgress size={60} className={classes.circularProgress} />
              <div className={classes.loadingText}>{ status.mails }</div>
            </div>
          )
      }

    </div>
  )
}

export default withStyles(styles)(Inbox)
