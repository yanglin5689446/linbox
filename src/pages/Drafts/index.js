
import React, { useContext, useEffect } from 'react'
import {
  withStyles,
} from '@material-ui/core'

import Draft from 'components/Mail/Draft'

import DraftsContext from 'context/drafts'
import useGmailAPI from 'utils/hooks/gmail_api'

const styles = () => ({
  container: {
    width: '70vw',
    maxWidth: 1200,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
})

const Drafts = ({ classes }) => {
  const { loadDrafts } = useGmailAPI()
  const { drafts } = useContext(DraftsContext)

  useEffect(() => {
    loadDrafts()
  }, [])

  return (
    <div className={classes.container}>
      {
        Object.values(drafts.drafts)
          .map(draft => <Draft key={draft.id} draftId={draft.id} {...draft.message} />)
      }
    </div>
  )
}

export default withStyles(styles)(Drafts)
