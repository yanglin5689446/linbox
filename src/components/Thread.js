
import React, { useState, useCallback } from 'react'
import {
  withStyles,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Avatar,
} from '@material-ui/core'

const styles = () => ({
  summary: {
    display: 'flex',
  },
  sender: {
    flexGrow: 2,
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
  snippet: {
    flexGrow: 15,
  },
})

const Thread = ({ classes, messages }) => {
  const [expanded, setExpanded] = useState(false)
  const getSenders = useCallback(() => {
    const headers = messages
      .map(message => message.payload.headers.find(e => e.name === 'From'))
      .map(header => header.value)
    const uniqueHeaders = [...new Set(headers)]
    return uniqueHeaders
      .map(header => header.split(' '))
      .map(([name, mail]) => ({ name, mail }))
  }, [messages])

  return (
    <ExpansionPanel expanded={expanded} onChange={() => setExpanded(exp => !exp)}>
      <ExpansionPanelSummary className={classes.summary}>
        <div className={classes.sender}>
          <Avatar
            alt=''
            src='https://thispersondoesnotexist.com/image'
            className={classes.avatar}
          />
          <Typography className={classes.name}>
            {
              getSenders()
                .map(sendor => sendor.name)
                .join(', ')
            }
          </Typography>
        </div>
        <Typography className={classes.snippet}>
          { messages[0].snippet }
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Typography />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

export default withStyles(styles)(Thread)
