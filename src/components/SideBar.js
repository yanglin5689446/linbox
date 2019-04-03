
import React from 'react'
import { withRouter } from 'react-router'
import {
  withStyles,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@material-ui/core'
import InboxIcon from '@material-ui/icons/Inbox'
import DraftsIcon from '@material-ui/icons/Drafts'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import CheckIcon from '@material-ui/icons/Check'
import SendIcon from '@material-ui/icons/Send'
import NotificationsIcon from '@material-ui/icons/Notifications'
import DeleteIcon from '@material-ui/icons/Delete'
import ReportIcon from '@material-ui/icons/Report'
import AccountBoxIcon from '@material-ui/icons/AccountBox'
import SettingsIcon from '@material-ui/icons/Settings'
import AddIcon from '@material-ui/icons/Add'
import AppBar from './AppBar'

const Tab = withRouter(({
  text, icon, to, history,
}) => (
  <ListItem button onClick={() => (to ? history.push(to) : null)}>
    <ListItemIcon>
      { icon }
    </ListItemIcon>
    <ListItemText primary={text} />
  </ListItem>
))

const SideBar = ({ classes, open }) => (
  <div>
    <Drawer
      className={classes.drawer}
      variant='persistent'
      anchor='left'
      open={open}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <List component='nav'>
        <Tab icon={<InboxIcon />} to='/' text='Inbox' />
        <Tab icon={<AccessTimeIcon />} to='/snoozed' text='Snoozed' />
        <Tab icon={<CheckIcon />} to='/done' text='Done' />

        <Divider className={classes.divider} />

        <Tab icon={<DraftsIcon />} to='/drafts' text='Drafts' />
        <Tab icon={<SendIcon />} to='/Send' text='Send' />
        <Tab icon={<NotificationsIcon />} to='/reminder' text='Reminder' />
        <Tab icon={<DeleteIcon />} to='/trash' text='Trash' />
        <Tab icon={<ReportIcon />} to='/spam' text='Spam' />
        <Tab icon={<AccountBoxIcon />} text='Contacts' />

        <Divider className={classes.divider} />

        <Tab icon={<AddIcon />} text='Create...' />

        <Divider className={classes.divider} />

        <Tab icon={<SettingsIcon />} text='Settings' />
      </List>
    </Drawer>
  </div>
)

SideBar.width = 240

const styles = () => ({
  drawerPaper: {
    width: SideBar.width,
    marginTop: AppBar.height,
    padding: 5,
    background: 'transparent',
    border: 'none',
    zIndex: 10,
  },
  divider: {
    margin: '10px 5px 5px 10px',
  },
})


export default withStyles(styles)(SideBar)
