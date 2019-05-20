
import React from 'react'
import { withStyles, Fab } from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/Refresh'

import useGmailAPI from 'utils/hooks/gmail_api'

const styles = () => ({
  refreshIcon: {
    margin: 2,
  },
})

const ReloadButton = ({ classes }) => {
  const { loadMails } = useGmailAPI()
  return (
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
  )
}

export default withStyles(styles)(ReloadButton)
