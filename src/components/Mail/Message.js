
import React, {
  useState, useEffect, useContext, useMemo, useRef, useCallback,
} from 'react'
import {
  withStyles,
  Card,
  CardContent,
  Avatar,
  colors,
} from '@material-ui/core'
import uuid from 'uuid/v1'

import InboxIcon from '@material-ui/icons/Inbox'
import DeleteIcon from '@material-ui/icons/Delete'
import CheckIcon from '@material-ui/icons/Check'

import classNames from 'classnames'

import MailsContext from 'context/mails'
import useGmailAPI from 'utils/hooks/gmail_api'
import processHTMLContent from 'utils/mails/processHTMLContent'

const styles = () => ({
  root: {
    width: '100%',
    cursor: 'pointer',
    borderTop: `1px solid ${colors.grey[300]}`,
  },
  content: {
    display: 'flex',
    padding: '8px !important',
  },
  head: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  avatar: {
    height: 32,
    width: 32,
    margin: '4px 12px',
  },
  actionIcon: {
    margin: '0 4px',
    fontSize: '1.25rem',
    cursor: 'pointer',
    opacity: 0.78,
    '&:hover': {
      opacity: 1,
    },
  },
  iconDone: {
    color: colors.green[600],
  },
  iconInbox: {
    color: colors.blue[500],
  },
  body: {
    padding: 4,
    width: 'calc(100% - 32px - 12px * 2)',
  },
  snippet: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    fontSize: 14,
    width: 'calc(70vw - 32px - 12px * 2 - 20px)',
  },
})

const Message = ({
  classes, threadId, id, from, snippet, content, initialExpand, unread, actions,
}) => {
  const { addMessageLabel, removeMessageLabel } = useContext(MailsContext)
  const { modifyMessage, trashMessage, deleteMessage } = useGmailAPI()
  const [expanded, setExpanded] = useState(initialExpand)
  const scope = useRef(uuid())

  const backToInbox = useCallback((e) => {
    addMessageLabel({ id, label: 'INBOX' })
    modifyMessage({ id, add: ['INBOX'] })
    e.stopPropagation()
  }, [id])

  const markAsDone = useCallback((e) => {
    removeMessageLabel({ id, label: 'INBOX' })
    modifyMessage({ id, remove: ['INBOX'] })
    e.stopPropagation()
  }, [id])

  const trash = useCallback((e) => {
    trashMessage({ id, threadId })
    e.stopPropagation()
  }, [id])
  const permanentDelete = useCallback((e) => {
    deleteMessage(id)
    e.stopPropagation()
  }, [id])


  useEffect(() => {
    if (expanded && unread) {
      modifyMessage({ id, remove: ['UNREAD'] })
      removeMessageLabel({ threadId, id, label: 'UNREAD' })
    }
  }, [unread, expanded])
  const cooked = useMemo(() => processHTMLContent(scope.current, content), [scope, content])
  return (
    <Card
      onClick={() => setExpanded(exp => !exp)}
      className={classes.root}
    >
      <CardContent className={classes.content}>
        <Avatar
          alt=''
          className={classes.avatar}
        >
          { from.name[0] }
        </Avatar>
        <div className={classes.body}>
          <div className={classes.head}>
            <strong>{ from.name }</strong>
            <div className={classes.actions}>
              {
                actions.backToInbox
                && (
                  <InboxIcon
                    className={classNames(classes.actionIcon, classes.iconInbox)}
                    onClick={backToInbox}
                  />
                )
              }
              {
                actions.markAsDone
                && (
                  <CheckIcon
                    className={classNames(classes.actionIcon, classes.iconDone)}
                    onClick={markAsDone}
                  />
                )
              }
              {
                actions.trash
                && (
                  <DeleteIcon
                    className={classes.actionIcon}
                    onClick={trash}
                  />
                )
              }
              {
                actions.permanentDelete
                && (
                  <DeleteIcon
                    className={classes.actionIcon}
                    onClick={permanentDelete}
                  />
                )
              }
            </div>
          </div>
          {
            expanded
              ? <div id={scope.current} dangerouslySetInnerHTML={{ __html: cooked.content }} />
              : <div className={classes.snippet}>{ snippet }</div>
          }
        </div>
      </CardContent>
    </Card>
  )
}

export default withStyles(styles)(Message)
