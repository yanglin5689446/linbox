
import React, { useState, useCallback, useContext } from 'react'
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

import DeleteIcon from '@material-ui/icons/Delete'
import LocalOfferIcon from '@material-ui/icons/LocalOffer'
import PeopleIcon from '@material-ui/icons/People'
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer'
import FlagIcon from '@material-ui/icons/Flag'
import CheckIcon from '@material-ui/icons/Check'

import LabelsContext from 'context/labels'
import Thread from 'components/Mail/Thread'
import useGmailAPI from 'utils/hooks/gmail_api'
import MailsContext from '../../context/mails'

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
  threadCount: {
    paddingLeft: 4,
    color: theme.palette.grey[700],
  },
  label: {
    padding: '0 24px',
  },
  systemLabels: {
    background: 'transparent',
  },
  forums: {
    color: colors.indigo[600],
  },
  updates: {
    color: colors.deepOrange[500],
  },
  promotions: {
    color: colors.cyan[300],
  },
  social: {
    color: colors.red[700],
  },
})

const getLabelIcon = (label) => {
  switch (label.id) {
    case 'CATEGORY_FORUMS':
      return <QuestionAnswerIcon />
    case 'CATEGORY_UPDATES':
      return <FlagIcon />
    case 'CATEGORY_PROMOTIONS':
      return <LocalOfferIcon />
    case 'CATEGORY_SOCIAL':
      return <PeopleIcon />
    default:
      return null
  }
}

const getLabelClass = label => label.id.split('_')[1].toLowerCase()

const Cluster = ({ classes, labelIds, threads }) => {
  const { trashThread, batchModifyMessages } = useGmailAPI()
  const { removeThreadLabel } = useContext(MailsContext)
  const { labels } = useContext(LabelsContext)
  const [expanded, setExpanded] = useState(false)
  const getLabel = useCallback((ids) => {
    let label = labels.user.find(l => ids.includes(l.id))
    if (!label)label = labels.category.find(l => ids.includes(l.id))
    return label
  })
  const label = getLabel(labelIds)
  const { t } = useTranslation(['labels', 'date'])
  const threadCount = Object.values(threads)
    .map(thread => thread.threads.length)
    .reduce((accum, current) => accum + current, 0)
  const senderUnreadMap = threads
    .map(thread => thread.threads)
    .flat()
    .map(thread => ({ from: thread.messages[0].from, unread: thread.hasUnread }))
    .reduce((accum, current) => {
      const n = current.from.name
      accum[n] = accum[n] || current.unread // eslint-disable-line
      return accum
    }, {})
  const senderUnreadList = Object.entries(senderUnreadMap)

  const hasUnread = senderUnreadList.some(entries => entries[1])

  const isLastSender = index => index === senderUnreadList.length - 1
  const clusterTitle = senderUnreadList
    .map(([name, unread], index) => (
      <span key={name} className={unread ? classes.unread : ''}>
        {name}
        {isLastSender(index) || ', '}
      </span>
    ))

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
                { label.type === 'system' ? t(label.id) : label.name }
              </Typography>
            )
            : (
              <React.Fragment>
                <div className={classes.sender}>
                  <Avatar
                    alt=''
                    className={
                      classNames(
                        classes.avatar,
                        label.type === 'system' && classes.systemLabels,
                        label.type === 'system' && classes[getLabelClass(label)],
                      )
                    }
                  >
                    {
                      label.type === 'system'
                        ? getLabelIcon(label)
                        : label.name[0]
                    }
                  </Avatar>
                  <Typography className={classNames(classes.name, hasUnread && classes.unread)}>
                    <span className={label.type === 'system' ? classes[getLabelClass(label)] : null}>
                      { label.type === 'system' ? t(label.id) : label.name }
                    </span>
                    {
                      threadCount > 1
                        ? (
                          <span className={classes.threadCount}>
                            {`(${threadCount})`}
                          </span>
                        )
                        : null
                    }

                  </Typography>
                </div>
                <Typography className={classes.brief}>
                  <span>
                    { clusterTitle }
                  </span>
                </Typography>
                <div className={classes.actions}>
                  <CheckIcon
                    className={classes.actionIcon}
                    onClick={(e) => {
                      const flattenThreads = Object.values(threads)
                        .map(thread => thread.threads)
                        .flat()
                      flattenThreads.forEach(({ id }) => removeThreadLabel({ id, label: 'INBOX' }))
                      const ids = flattenThreads
                        .map(thread => thread.messages)
                        .flat()
                        .map(({ id }) => id)
                      batchModifyMessages({ ids, remove: ['INBOX'] })
                      e.stopPropagation()
                    }}
                  />
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
