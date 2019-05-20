
import React, { useState, useCallback, useContext } from 'react'
import {
  withStyles,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Avatar,
  Chip,
  colors,
} from '@material-ui/core'
import InboxIcon from '@material-ui/icons/Inbox'
import Message from 'components/Mail/Message'
import DeleteIcon from '@material-ui/icons/Delete'
import CheckIcon from '@material-ui/icons/Check'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile'
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto'

import classNames from 'classnames'

import useGmailAPI from 'utils/hooks/gmail_api'

import MailsContext from 'context/mails'
import { threadSharedStyles } from './styles'

const styles = theme => ({
  ...threadSharedStyles(theme),
  snippet: {
    color: colors.grey[500],
  },
  subject: {
    color: colors.grey[800],
  },
  mails: {
    padding: 0,
    display: 'block',
  },
  attachments: {
    marginTop: '.5rem',
  },
  attachmentIcon: {
    color: theme.palette.secondary.light,
    marginLeft: '.5rem',
  },
  iconDone: {
    color: colors.green[600],
  },
  iconInbox: {
    color: colors.blue[500],
  },
})


const Thread = ({
  id, classes, messages, hasUnread, actions,
}) => {
  const { trashThread, deleteThread, batchModifyMessages } = useGmailAPI()
  const { removeThreadLabel, addThreadLabel } = useContext(MailsContext)
  const [expanded, setExpanded] = useState(false)

  const ids = messages.map(message => message.id)

  const mimeTypeIcon = useCallback((type) => {
    switch (type) {
      case 'image/jpg':
        return <InsertPhotoIcon color='secondary' className={classes.attachmentIcon} />
      default:
        return <InsertDriveFileIcon color='secondary' className={classes.attachmentIcon} />
    }
  })

  const backToInbox = useCallback((e) => {
    addThreadLabel({ id, label: 'INBOX' })
    batchModifyMessages({ ids, add: ['INBOX'] })
    e.stopPropagation()
  }, [messages])

  const markAsDone = useCallback((e) => {
    removeThreadLabel({ id, label: 'INBOX' })
    batchModifyMessages({ ids, remove: ['INBOX'] })
    e.stopPropagation()
  }, [messages])

  const trash = useCallback((e) => {
    trashThread(id)
    e.stopPropagation()
  }, [messages])
  const permanentDelete = useCallback((e) => {
    deleteThread(id)
    e.stopPropagation()
  }, [messages])


  const senderUnreadMap = messages.reduce((accum, current) => {
    const n = current.from.name
    accum[n] = accum[n] || current.unread //eslint-disable-line
    return accum
  }, {})
  const firstSenderName = messages[0].from.name
  const senderUnreadList = Object.entries(senderUnreadMap)
  const isLastSender = index => index === senderUnreadList.length - 1
  const threadTitle = senderUnreadList
    .map(([name, unread], index) => (
      <span key={name} className={unread ? classes.unread : ''}>
        {name}
        {isLastSender(index) || ', '}
      </span>
    ))

  const attachments = messages.flatMap(message => message.attachments)

  return (
    <ExpansionPanel expanded={expanded} onChange={() => setExpanded(exp => !exp)}>
      <ExpansionPanelSummary classes={{ root: classes.summary, content: classes.summaryContent }}>
        {
          expanded
            ? <span className={classes.subject}>{ messages[0].subject }</span>
            : (
              <React.Fragment>
                <div className={classes.sender}>
                  <Avatar
                    alt=''
                    className={classes.avatar}
                  >
                    { firstSenderName[0] }
                  </Avatar>
                  <Typography className={classes.name}>
                    { threadTitle }
                  </Typography>
                </div>
                <Typography className={classes.brief} component='div'>
                  <span className={hasUnread ? classes.unread : ''}>
                    { messages[0].subject }
                  </span>
                  <span className={classes.snippet}>{ ` - ${messages[0].snippet}` }</span>
                  {
                    attachments.length > 0
                      && (
                      <div className={classes.attachments}>
                        {
                          attachments.map(({ id: attachmentId, name, mimeType }) => (
                            <Chip
                              key={attachmentId}
                              icon={mimeTypeIcon(mimeType)}
                              variant='outlined'
                              label={name}
                              clickable
                            />
                          ))
                        }
                      </div>
                      )
                  }

                </Typography>

                <div className={classes.actions}>
                  {
                    actions.backToInbox
                    && (
                      <InboxIcon
                        className={classNames(classes.actionIcon, classes.iconInbox)}
                        onClick={backToInbox}
                      />
                    )
                  }
                  {
                    actions.markAsDone
                    && (
                      <CheckIcon
                        className={classNames(classes.actionIcon, classes.iconDone)}
                        onClick={markAsDone}
                      />
                    )
                  }
                  {
                    actions.trash
                    && (
                      <DeleteIcon
                        className={classes.actionIcon}
                        onClick={trash}
                      />
                    )
                  }
                  {
                    actions.permanentDelete
                    && (
                      <DeleteIcon
                        className={classes.actionIcon}
                        onClick={permanentDelete}
                      />
                    )
                  }
                </div>
              </React.Fragment>
            )
        }

      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.mails}>
        {
          expanded
            ? messages.map((message, index) => (
              <Message
                key={message.id}
                initialExpand={index === messages.length - 1}
                actions={actions}
                {...message}
              />
            ))
            : ''
        }
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

export default withStyles(styles)(Thread)
