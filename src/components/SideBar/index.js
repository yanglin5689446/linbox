
import React, { useContext } from 'react'
import {
  withStyles,
  Drawer,
  List,
  Divider,
  colors,
} from '@material-ui/core'
import InboxIcon from '@material-ui/icons/Inbox'
import DraftsIcon from '@material-ui/icons/Drafts'
import CheckIcon from '@material-ui/icons/Check'
import DeleteIcon from '@material-ui/icons/Delete'
import AccountBoxIcon from '@material-ui/icons/AccountBox'
import EmailIcon from '@material-ui/icons/Email'
import { useTranslation } from 'react-i18next'
import LabelsContext from 'context/labels'

import AppBar from 'components/AppBar'
import Tab from './Tab'

const SideBar = ({ classes, open }) => {
  const { t } = useTranslation(['sidebar'])
  const { labels } = useContext(LabelsContext)
  return (
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
          <Tab icon={<InboxIcon className={classes.inbox} />} to='/' text={t('INBOX')} />
          {/*
            <Tab
              icon={<AccessTimeIcon
              className={classes.snoozed} />}
              to='/snoozed'
              text={t('SNOOZED')}
            />
          */}
          <Tab icon={<CheckIcon className={classes.done} />} to='/done' text={t('DONE')} />

          <Divider className={classes.divider} />

          <Tab icon={<DraftsIcon />} to='/drafts' text={t('DRAFTS')} />
          <Tab icon={<DeleteIcon />} to='/trash' text={t('TRASH')} />

          {/*
            <Tab icon={<SendIcon />} to='/Send' text={t('SEND')} />
            <Tab icon={<NotificationsIcon />} to='/reminder' text={t('REMINDER')} />
            <Tab icon={<ReportIcon />} to='/spam' text={t('SPAM')} />
          */}

          <Tab
            icon={<AccountBoxIcon />}
            text={t('CONTACTS')}
            to='https://contacts.google.com/'
            external
          />

          <Divider className={classes.divider} />

          {
            !!labels.user
            && labels.user
              .filter(label => label.type === 'user')
              .map(label => <Tab key={label.id} icon={<EmailIcon />} text={label.name} />)
          }

          <Divider className={classes.divider} />

          {/*
            <Tab icon={<AddIcon />} text='Create...' />

            <Divider className={classes.divider} />

            <Tab icon={<SettingsIcon />} text='Settings' />
          */}
        </List>
      </Drawer>
    </div>
  )
}

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
  inbox: {
    color: colors.blue[500],
  },
  snoozed: {
    color: colors.orange[800],
  },
  done: {
    color: colors.green[600],
  },
  divider: {
    margin: '10px 5px 5px 10px',
  },
})


export default withStyles(styles)(SideBar)
