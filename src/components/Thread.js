
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
})

const Thread = ({ classes, messages }) => {
  const [expanded, setExpanded] = useState(false)
  const getSenders = useCallback(() => {
    const headers = messages
      .map(message => message.payload.headers.find(e => e.name === 'From'))
      .map(header => header.value)
    const uniqueHeaders = [...new Set(headers)]
    return uniqueHeaders
      .map((header) => {
        const mailRegex = /([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)/g
        const mail = header.match(mailRegex)[0]
        const name = header.replace(mail, '').replace(' <>', '').replace(/"/g, '')
        return { name, mail }
      })
      .reduce((result, { name, mail }) => ({ ...result, [name || mail]: mail }), [])
  }, [messages])
  const getSubject = useCallback(message => message.payload
    .headers
    .find(e => e.name === 'Subject')
    .value, [])

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
            { Object.entries(getSenders()).map(([name]) => name).join(', ') }
          </Typography>
        </div>
        <Typography className={classes.brief}>
          { getSubject(messages[0]) }
          <span className={classes.snippet}>{ ` - ${messages[0].snippet}` }</span>
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Typography />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

export default withStyles(styles)(Thread)
