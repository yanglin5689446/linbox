
import React, { useState, useCallback } from 'react'
import {
  withStyles,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Avatar,
  colors,
} from '@material-ui/core'
import Message from 'components/Mail/Message'
import DeleteIcon from '@material-ui/icons/Delete'

import useGmailAPI from 'utils/hooks/gmail_api'

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
})

const Thread = ({ classes, messages, hasUnread }) => {
  const { trashThread } = useGmailAPI()
  const [expanded, setExpanded] = useState(false)
  const getSenderName = useCallback(({ name, mail }) => name || mail.split('@')[0])
  const senderUnreadMap = messages.reduce((accum, current) => {
    const n = getSenderName(current.from)
    accum[n] = accum[n] || current.unread //eslint-disable-line
    return accum
  }, {})
  const firstSenderName = getSenderName(messages[0].from)
  const senderUnreadList = Object.entries(senderUnreadMap)
  const isLastSender = index => index === senderUnreadList.length - 1
  const threadTitle = senderUnreadList
    .map(([name, unread], index) => (
      <span key={name} className={unread ? classes.unread : ''}>
        {name}
        {isLastSender(index) || ', '}
      </span>
    ))

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
                <Typography className={classes.brief}>
                  <span className={hasUnread ? classes.unread : ''}>
                    { messages[0].subject }
                  </span>
                  <span className={classes.snippet}>{ ` - ${messages[0].snippet}` }</span>
                </Typography>
                <div className={classes.actions}>
                  <DeleteIcon
                    className={classes.actionIcon}
                    onClick={(e) => {
                      trashThread(messages[0].threadId)
                      e.stopPropagation()
                    }}
                  />
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
                {...message}
              />
            ))
            : null
        }
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

export default withStyles(styles)(Thread)
