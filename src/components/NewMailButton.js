
import React, { useCallback } from 'react'
import { withStyles, Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'

import useGmailAPI from 'utils/hooks/gmail_api'

const styles = () => ({
  root: {
    position: 'fixed',
    right: 24,
    bottom: 24,
  },
})

const NewMailButton = ({ classes }) => {
  const { createDraft } = useGmailAPI()

  const createNewDraftEdit = useCallback(() => createDraft({
    subject: '',
    content: '',
    receipients: '',
  }), [])

  return (
    <div className={classes.root}>
      <Fab color='secondary' onClick={createNewDraftEdit}>
        <AddIcon />
      </Fab>
    </div>
  )
}

export default withStyles(styles)(NewMailButton)
