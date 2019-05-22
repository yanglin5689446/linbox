
import React from 'react'

import InboxIcon from '@material-ui/icons/Inbox'
import DeleteIcon from '@material-ui/icons/Delete'
import CheckIcon from '@material-ui/icons/Check'

import classNames from 'classnames'
import { withStyles, colors } from '@material-ui/core'

const styles = () => ({
  actionIcon: {
    margin: '0 4px',
    fontSize: '1.25rem',
    cursor: 'pointer',
    opacity: 0.78,
    '&:hover': {
      opacity: 1,
    },
  },
  iconDone: {
    color: colors.green[600],
  },
  iconInbox: {
    color: colors.blue[500],
  },
})

const Actions = ({ classes, actions, handlers }) => (
  <div>
    {
      actions.backToInbox
      && (
        <InboxIcon
          className={classNames(classes.actionIcon, classes.iconInbox)}
          onClick={handlers.backToInbox}
        />
      )
    }
    {
      actions.markAsDone
      && (
        <CheckIcon
          className={classNames(classes.actionIcon, classes.iconDone)}
          onClick={handlers.markAsDone}
        />
      )
    }
    {
      actions.trash
      && (
        <DeleteIcon
          className={classes.actionIcon}
          onClick={handlers.trash}
        />
      )
    }
    {
      actions.permanentDelete
      && (
        <DeleteIcon
          className={classes.actionIcon}
          onClick={handlers.permanentDelete}
        />
      )
    }
  </div>
)

export default withStyles(styles)(Actions)
