
import React from 'react'
import {
  withStyles,
} from '@material-ui/core'
import EditDraft from './EditDraft'

const styles = () => ({
  root: {
    position: 'fixed',
    right: 100,
    bottom: 0,
    display: 'flex',
  },
})

const DraftsContainer = ({ classes, drafts }) => (
  <div className={classes.root}>
    {
      Object.entries(drafts.editing).map(([id, draft]) => <EditDraft key={id} {...draft} />)
    }
  </div>
)

export default withStyles(styles)(DraftsContainer)
