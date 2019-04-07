
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
import Message from 'components/Message'
import getSender from 'utils/getSender'

const styles = () => ({
  summary: {
    display: 'flex',
  },
  summaryContent: {
    maxWidth: '100%',
  },
  sender: {
    flex: 2,
    display: 'flex',
  },
  avatar: {
    height: 24,
    width: 24,
  },
  name: {
    width: 150,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    paddingLeft: 16,
    paddingRight: 16,
  },
  brief: {
    flex: 8,
    minWidth: 0,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
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
              </React.Fragment>
            )
        }

      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.mails}>
        {
          messages.map(message => <Message key={message.id} {...message} />)
        }
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

export default withStyles(styles)(Thread)
