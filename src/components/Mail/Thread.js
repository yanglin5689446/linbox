
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
import getSender from 'utils/getSender'

import DeleteIcon from '@material-ui/icons/Delete'

import useGmailAPI from 'utils/hooks/gmail_api'

import { threadSharedStyles } from './styles'

const styles = theme => ({
  ...threadSharedStyles(theme),
  snippet: {
    color: colors.grey[700],
  },
  subject: {
    color: colors.grey[800],
  },
  mails: {
    padding: 0,
    display: 'block',
  },
})

const Thread = ({ classes, messages }) => {
  const { trashThread } = useGmailAPI()
  const [expanded, setExpanded] = useState(false)
  const getSubject = useCallback(message => message.payload
    .headers
    .find(e => e.name === 'Subject')
    .value, [])
  const senders = messages.map(getSender)
  const getSenderName = useCallback(({ name, mail }) => name || mail.split('@')[0])

  return (
    <ExpansionPanel expanded={expanded} onChange={() => setExpanded(exp => !exp)}>
      <ExpansionPanelSummary classes={{ root: classes.summary, content: classes.summaryContent }}>
        {
          expanded
            ? <span className={classes.subject}>{ getSubject(messages[0]) }</span>
            : (
              <React.Fragment>
                <div className={classes.sender}>
                  <Avatar
                    alt=''
                    className={classes.avatar}
                  >
                    { getSenderName(senders[0])[0] }
                  </Avatar>
                  <Typography className={classes.name}>
                    {
                      [...new Set(senders.map(getSenderName))].join(', ')
                    }
                  </Typography>
                </div>
                <Typography className={classes.brief}>
                  { getSubject(messages[0]) }
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
          messages.map((message, index) => (
            <Message
              key={message.id}
              initialExpand={index === messages.length - 1}
              {...message}
            />
          ))
        }
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

export default withStyles(styles)(Thread)
