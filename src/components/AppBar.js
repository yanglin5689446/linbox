
import React, { useContext } from 'react'
import {
  withStyles,
  AppBar as MUIAppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Paper,
  Avatar,
  Tooltip,
  Button,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import { useTranslation } from 'react-i18next'

import useGoogleAPI from 'utils/hooks/google_api'
import UserContext from 'context/user'


const AppBar = ({ classes, toggleSideBar }) => {
  const { t } = useTranslation(['actions'])
  const { user } = useContext(UserContext)
  const { signOut } = useGoogleAPI()
  const { photos } = user
  return (
    <MUIAppBar
      position='sticky'
      className={classes.appBar}
    >
      <Toolbar classes={{ root: classes.toolbar }}>
        <IconButton
          className={classes.menuButton}
          color='inherit'
          aria-label='Menu'
          onClick={toggleSideBar}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant='h6' color='inherit' className={classes.grow}>
          Linbox
        </Typography>
        <Paper className={classes.searchField} elevation={1}>
          <span className={classes.searchIcon} aria-label='Search'>
            <SearchIcon />
          </span>
          <InputBase className={classes.input} placeholder={t('SEARCH')} />
        </Paper>
        <div className={classes.otherComponents}>
          <Tooltip
            title={<Button onClick={signOut} color='primary'>{ t('SIGN_OUT') }</Button>}
            interactive
            classes={{ tooltip: classes.tooltip }}
          >
            <Avatar
              alt=''
              src={photos[0].url}
              className={classes.avatar}
            />
          </Tooltip>
        </div>
      </Toolbar>
    </MUIAppBar>
  )
}
AppBar.height = 56

const styles = theme => ({
  appBar: {
    height: AppBar.height,
    zIndex: 1000,
  },
  toolbar: {
    height: AppBar.height,
    minHeight: AppBar.height,
  },
  grow: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
    width: '15vw',
  },
  otherComponents: {
    width: '15vw',
    minWidth: '80px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  searchField: {
    flexGrow: 5,
    height: '2.5rem',
    lineHeight: '2.5rem',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    width: 24,
    height: 24,
    margin: '0px 20px',
    color: theme.palette.grey[500],
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
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
    cursor: 'pointer',
  },
  logout: {
    zIndex: 100,
  },
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
  },
})

export default withStyles(styles)(AppBar)
