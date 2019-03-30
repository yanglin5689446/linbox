
import React, { useContext, useCallback } from 'react'
import { withStyles, Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'

import DraftsContext from 'context/drafts'

const styles = theme => ({
  root: {
    position: 'fixed',
    right: 24,
    bottom: 24,
  }
})

const NewMailButton = ({ classes }) => {
  const { newDraftEdit } = useContext(DraftsContext)
  const createNewDraftEdit = useCallback(() => newDraftEdit(null), [])

  return (
    <div className={classes.root} >
      <Fab color="secondary" onClick={createNewDraftEdit}>
        <AddIcon />
      </Fab>
    </div>
  )
}

export default withStyles(styles)(NewMailButton)