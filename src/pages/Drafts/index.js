
import React, { useContext, useEffect } from 'react'
import {
  withStyles,
} from '@material-ui/core'

import Message from 'components/Message'

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
          .map(draft => <Message key={draft.id} {...draft.message} draft />)
      }
    </div>
  )
}

export default withStyles(styles)(Drafts)
