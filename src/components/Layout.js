
import React, { useCallback, useState } from 'react'
import { withStyles } from '@material-ui/core'
import AppBar from './AppBar'
import SideBar from './SideBar'
import classNames from 'classnames'

const styles = theme => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: SideBar.width / 4,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
})

const Layout = ({ children, classes }) => {
  const [sideBarOpen, setSideBarOpen] = useState(true)
  const toggleSideBar = useCallback(() => setSideBarOpen(open => !open), [])
  return (
    <div>
      <AppBar toggleSideBar={toggleSideBar} />
      <SideBar open={sideBarOpen} />
      <main className={classNames(classes.content, sideBarOpen || classes.contentShift )}>
        { children }
      </main>
    </div>
  )
}

export default withStyles(styles)(Layout)