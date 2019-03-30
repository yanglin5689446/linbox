
import React, { useState } from 'react'
import {
  withStyles,
} from '@material-ui/core'
import EditDraft from './EditDraft'

const styles = theme => ({
  root: {
    position: 'fixed',
    right: 100,
    bottom: 0,
    display: 'flex',
  },
})

const DraftsContainer = ({ classes, drafts }) => {
  console.log(drafts)
  return (
    <div className={classes.root}>
      {
        drafts.map((draft, index) => <EditDraft key={index} {...draft} />)
      }
    </div>
  )
}

export default withStyles(styles)(DraftsContainer)