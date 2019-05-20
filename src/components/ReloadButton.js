
import React from 'react'
import { withStyles, Fab } from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/Refresh'

const styles = () => ({
  reloadButton: {
    marginBottom: 8,
  },
  refreshIcon: {
    margin: 2,
  },
})

const ReloadButton = ({ classes, onClick }) => (
  <Fab
    variant='extended'
    size='small'
    color='primary'
    onClick={onClick}
    className={classes.reloadButton}
  >
    <RefreshIcon className={classes.refreshIcon} />
    Reload
  </Fab>
)

export default withStyles(styles)(ReloadButton)
