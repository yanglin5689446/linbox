
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
  sender: {
    width: 220,
    display: 'flex',
  },
  avatar: {
    height: 24,
    width: 24,
    display: 'inline-block',
  },
  name: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  brief: {
    width: 500,
    flexGrow: 15,
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
      <ExpansionPanelSummary className={classes.summary}>
        {
          expanded
            ? <span className={classes.subject}>{ getSubject(messages[0]) }</span>
            : (
              <React.Fragment>
                <div className={classes.sender}>
                  <Avatar
                    alt=''
                    src='https://thispersondoesnotexist.com/image'
                    className={classes.avatar}
                  />
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
