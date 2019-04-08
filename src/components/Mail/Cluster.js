
import React, { useState, useCallback } from 'react'
import {
  withStyles,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Avatar,
} from '@material-ui/core'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'

import DeleteIcon from '@material-ui/icons/Delete'

import Thread from 'components/Mail/Thread'
import { labels } from 'constants/system_labels'
import getSender from 'utils/getSender'
import useGmailAPI from 'utils/hooks/gmail_api'

import { threadSharedStyles } from './styles'

const styles = theme => ({
  ...threadSharedStyles(theme),
  content: {
    display: 'block',
    border: `24px solid ${theme.palette.grey[300]}`,
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
  const { trashThread } = useGmailAPI()
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
                <div className={classes.actions}>
                  <DeleteIcon
                    className={classes.actionIcon}
                    onClick={(e) => {
                      Object.values(threads)
                        .forEach(nested => nested.threads
                          .forEach(thread => trashThread(thread.messages[0].threadId)))
                      e.stopPropagation()
                    }}
                  />
                </div>
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
