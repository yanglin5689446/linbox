
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
import { useTranslation } from 'react-i18next'

import Thread from 'components/Thread'
import { labels } from 'constants/system_labels'
import getSender from 'utils/getSender'

const styles = () => ({
  expanded: {
    transition: 'all .1s',
    background: colors.grey[300],
    width: 'calc(100% + 48px)',
    marginLeft: -24,
  },
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
  content: {
    display: 'block',
    border: `24px solid ${colors.grey[300]}`,
    padding: 0,
  },
  nested: {
  },
  nestedTitle: {
    paddingLeft: 24,
    margin: 5,
  },
  label: {
    padding: '0 24px',
  },
})

const Cluster = ({ classes, labelIds, threads }) => {
  const [expanded, setExpanded] = useState(false)
  const labelId = labelIds.find(e => labels.includes(e))
  const { t } = useTranslation(['labels', 'date'])
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
      <ExpansionPanelSummary classes={{ root: classes.summary, content: classes.summaryContent }}>
        {
          expanded
            ? (
              <Typography variant='h5' classes={{ h5: classes.label }}>
                { t(labelId) }
              </Typography>
            )
            : (
              <React.Fragment>
                <div className={classes.sender}>
                  <Avatar
                    alt=''
                    className={classes.avatar}
                  >
                    { labelId[0] }
                  </Avatar>
                  <Typography className={classes.name}>
                    { t(labelId) }
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
                  { t(`date:${nested.label}`, { date: nested.date }) }
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
