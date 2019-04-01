
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
import classNames from 'classnames'

import Thread from 'components/Thread'
import { clusters } from 'constants/cluster_types'
import getSender from 'utils/getSender'

const styles = () => ({
  expanded: {
    transition: 'background .2s',
    background: colors.grey[300],
  },
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
  content: {
    display: 'block',
  },
  nested: {
    padding: 24,
  },
  nestedTitle: {
    paddingLeft: 24,
    margin: 5,
  },
})

const Cluster = ({ classes, labelIds, threads }) => {
  const [expanded, setExpanded] = useState(false)
  const labelId = labelIds.find(e => clusters.includes(e))
  const senders = threads
    .map(thread => thread.threads)
    .flat()
    .map(thread => thread.messages[0])
    .map(getSender)
  const getSenderName = useCallback(({ name, mail }) => name || mail.split('@')[0])

  return (
    <ExpansionPanel
      expanded={expanded}
      onChange={() => setExpanded(exp => !exp)}
      className={classNames(expanded && classes.expanded)}
    >
      <ExpansionPanelSummary className={classes.summary}>
        {
          expanded
            ? (
              <Typography variant='h3'>
                { labelId }
              </Typography>
            )
            : (
              <React.Fragment>
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
                  { [...new Set(senders.map(getSenderName))].join(', ') }
                </Typography>
              </React.Fragment>
            )
        }


      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.content}>
        {
          Object
            .values(threads)
            .map(nested => (
              <div key={nested.label} className={classes.nested}>
                <Typography
                  variant='subtitle1'
                  className={classes.nestedTitle}
                >
                  {nested.label}
                </Typography>
                { nested.threads.map(thread => <Thread key={thread.id} {...thread} />) }
              </div>
            ))
        }
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

export default withStyles(styles)(Cluster)
