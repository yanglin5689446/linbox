
import React from 'react'
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
import AppBar from './AppBar';

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
  }
})

const Tab = ({ text, icon }) => (
  <ListItem button>
    <ListItemIcon>
      { icon }
    </ListItemIcon>
    <ListItemText primary={text} />
  </ListItem>
)

const SideBar = ({ classes, open }) => {
  return (
    <div>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <List component="nav">
          <Tab icon={<InboxIcon />} text='Inbox' />
          <Tab icon={<AccessTimeIcon />} text='Snoozed' />
          <Tab icon={<CheckIcon />} text='Done' />

          <Divider className={classes.divider} />

          <Tab icon={<DraftsIcon />} text='Drafts' />
          <Tab icon={<SendIcon />} text='Send' />
          <Tab icon={<NotificationsIcon />} text='Reminder' />
          <Tab icon={<DeleteIcon />} text='Trash' />
          <Tab icon={<ReportIcon />} text='Spam' />
          <Tab icon={<AccountBoxIcon />} text='Contacts' />

          <Divider className={classes.divider} />

          <Tab icon={<AddIcon />} text='Create...' />

          <Divider className={classes.divider} />

          <Tab icon={<SettingsIcon />} text='Settings' />
        </List>
      </Drawer>
    </div>
  )
}

SideBar.width = 240


export default withStyles(styles)(SideBar)