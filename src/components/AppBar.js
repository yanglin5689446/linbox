
import React from 'react'
import {
  withStyles,
  AppBar as MUIAppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Paper,
  Avatar,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'

const AppBar = ({ classes, toggleSideBar }) => (
  <MUIAppBar
    position='sticky'
    className={classes.appBar}
  >
    <Toolbar>
      <IconButton
        className={classes.menuButton}
        color='inherit'
        aria-label='Menu'
        onClick={toggleSideBar}
      >
        <MenuIcon />
      </IconButton>
      <Typography variant='h6' color='inherit' className={classes.grow}>
          Inbox
      </Typography>
      <Paper className={classes.searchField} elevation={1}>
        <IconButton className={classes.searchButton} aria-label='Menu'>
          <SearchIcon />
        </IconButton>
        <InputBase className={classes.input} placeholder='Search' />
      </Paper>
      <div className={classes.otherComponents}>
        <Avatar
          alt=''
          src='https://thispersondoesnotexist.com/image'
          className={classes.avatar}
        />
      </div>
    </Toolbar>
  </MUIAppBar>
)

AppBar.height = 64

const styles = theme => ({
  appBar: {
    height: AppBar.height,
    zIndex: 1000,
  },
  grow: {
    flexBasis: '300px',
  },
  otherComponents: {
    flexGrow: 2,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  searchField: {
    flexGrow: 5,
    height: '2.5rem',
    lineHeight: '2.5rem',
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  searchButton: {
    padding: '0px 20px 0px 20px',
  },
  pinSwitch: {
    marginLeft: 10,
  },
  pinIcon: {
    width: 36,
    height: 36,
    fontSize: 18,
    lineHeight: '36px',
    background: theme.palette.primary.light,
    boxShadow: theme.shadows[3],
  },
  pinBar: {
    width: '3rem',
  },
  avatar: {

  },
})

export default withStyles(styles)(AppBar)
