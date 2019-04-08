
import React from 'react'
import { NavLink } from 'react-router-dom'
import { withRouter } from 'react-router'
import {
  withStyles,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core'
import CallMadeIcon from '@material-ui/icons/CallMade'

const styles = theme => ({
  root: {
    padding: '8px 16px',
  },
  icon: {
    color: theme.palette.grey[600],
    marginRight: 8,
  },
  navlink: {
    color: 'inherit',
    textDecoration: 'none',
    '&.active': {
      fontWeight: 'bold',
    },
  },
  externalLinkIcon: {
    fontSize: 16,
    color: theme.palette.grey[600],
    marginRight: 12,
    marginLeft: 4,
    verticalAlign: -2,
    display: 'none',
    '$root:hover &': {
      display: 'inline-block',
    },
  },
})

const LinkTo = ({
  classes, text, to, external,
}) => (external
  ? (
    <a href={to} className={classes.navlink} target='_blank' rel='noopener noreferrer'>
      {text}
      <CallMadeIcon className={classes.externalLinkIcon} />
    </a>
  )
  : <NavLink className={classes.navlink} exact to={to}>{ text }</NavLink>)

const Tab = withRouter(({
  classes, text, icon, to, external, history,
}) => (
  <ListItem
    classes={{ root: classes.root }}
    button
    onClick={() => to && !external && history.push(to)}
  >
    <ListItemIcon className={classes.icon}>
      { icon }
    </ListItemIcon>
    <ListItemText
      primaryTypographyProps={{ variant: 'body1' }}
      primary={
        to
          ? <LinkTo classes={classes} to={to} text={text} external={external} />
          : text
      }
    />

  </ListItem>
))

export default withStyles(styles)(Tab)
