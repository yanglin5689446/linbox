
import React, { useState, useCallback } from 'react'
import {
  withStyles,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Avatar,
} from '@material-ui/core'

import { clusters } from 'constants/cluster_types'
import debug from 'utils/debug'

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
})

const Cluster = ({ classes, labelIds, threads }) => {
  const [expanded, setExpanded] = useState(false)
  const labelId = labelIds.find(e => clusters.includes(e))
  const getSenders = useCallback(() => {
    const headers = threads
      .map(thread => thread.threads)
      .flat()
      .map(thread => thread.messages[0])
      .map(message => message.payload.headers.find(e => e.name === 'From'))
      .map(header => header.value)
      .map(debug)
    const uniqueHeaders = [...new Set(headers)]
    return uniqueHeaders
      .map((header) => {
        const mailRegex = /([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)/g
        const mail = header.match(mailRegex)[0]
        const name = header.replace(mail, '').replace(' <>', '').replace(/"/g, '')
        return { name, mail }
      })
      .reduce((result, { name, mail }) => ({ ...result, [name || mail]: mail }), [])
  }, [threads])
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
            { labelId }
          </Typography>
        </div>
        <Typography className={classes.brief}>
          { Object.entries(getSenders()).map(([name]) => name).join(', ') }
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Typography />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

export default withStyles(styles)(Cluster)
