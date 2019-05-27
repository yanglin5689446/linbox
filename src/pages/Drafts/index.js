
import React, { useContext, useEffect } from 'react'
import {
  withStyles,
} from '@material-ui/core'

import DraftsContext from 'context/drafts'
import useGmailAPI from 'utils/hooks/gmail_api'
import Draft from 'components/Mail/Draft'
import ReloadButton from 'components/ReloadButton'

import styles from 'pages/style'

const Drafts = ({ classes }) => {
  const { loadDrafts } = useGmailAPI()
  const { drafts } = useContext(DraftsContext)

  useEffect(() => {
    loadDrafts()
  }, [])

  return (
    <div className={classes.container}>
      <div className={classes.reloadButtonContainer}>
        <ReloadButton onClick={loadDrafts} />
      </div>
      {
        Object.values(drafts.drafts)
          .map(draft => <Draft key={draft.id} id={draft.id} {...draft.message} />)
      }
    </div>
  )
}

export default withStyles(styles)(Drafts)
