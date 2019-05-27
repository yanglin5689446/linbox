
import React from 'react'
import {
  withStyles,
  Avatar,
} from '@material-ui/core'

import Actions from './Actions'

const styles = () => ({
  root: {
    display: 'flex',
    cursor: 'pointer',
    alignItems: 'flex-center',
  },
  head: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  avatar: {
    height: 32,
    width: 32,
    margin: '4px 12px',
  },
  body: {
    padding: 4,
    width: 'calc(100% - 32px - 12px * 2)',
  },
  snippet: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    fontSize: 14,
    width: 'calc(70vw - 32px - 12px * 2 - 20px)',
  },
})

const Header = ({
  classes, snippet, expanded, actions, name, onClick, handlers,
}) => (
  <div className={classes.root} onClick={onClick} onKeyUp={onClick} role='button' tabIndex={0}>
    <Avatar alt='' className={classes.avatar}>
      { name[0] }
    </Avatar>
    <div className={classes.body}>
      <div className={classes.head}>
        <strong>{ name }</strong>
        <Actions actions={actions} handlers={handlers} />
      </div>
      {
          expanded
            ? null
            : <div className={classes.snippet}>{ snippet }</div>
        }
    </div>
  </div>
)

export default withStyles(styles)(Header)
