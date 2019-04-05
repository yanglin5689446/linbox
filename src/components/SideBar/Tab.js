
import React from 'react'
import { NavLink } from 'react-router-dom'
import { withRouter } from 'react-router'
import {
  withStyles,
  ListItem,
  ListItemIcon,
  ListItemText,
  colors,
} from '@material-ui/core'

const styles = () => ({
  root: {
    padding: '8px 16px',
  },
  icon: {
    color: colors.grey[600],
    marginRight: 8,
  },
  navlink: {
    color: 'inherit',
    textDecoration: 'none',
    '&.active': {
      fontWeight: 'bold',
    },
  },
})

const Tab = withRouter(({
  classes, text, icon, to, history,
}) => (
  <ListItem className={classes.root} button onClick={() => (to ? history.push(to) : null)}>
    <ListItemIcon className={classes.icon}>
      { icon }
    </ListItemIcon>
    <ListItemText
      primaryTypographyProps={{ variant: 'body1' }}
      primary={
        to
          ? <NavLink className={classes.navlink} exact to={to}>{ text }</NavLink>
          : text
      }
    />
  </ListItem>
))

export default withStyles(styles)(Tab)
