
import React, { useState, useEffect, useContext } from 'react'
import {
  withStyles,
  Card,
  CardContent,
  Avatar,
  colors,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

import MailsContext from 'context/mails'
import useGmailAPI from 'utils/hooks/gmail_api'

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
  body: {
    padding: 4,
    width: '100%',
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
  classes, threadId, id, from, snippet, content, initialExpand, unread,
}) => {
  const { markMessageAsRead } = useContext(MailsContext)
  const { modifyMessage, trashMessage } = useGmailAPI()
  const [expanded, setExpanded] = useState(initialExpand)
  useEffect(() => {
    if (expanded && unread) {
      modifyMessage({ id, remove: ['UNREAD'] })
      markMessageAsRead({ threadId, id })
    }
  }, [unread, expanded])
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
              <DeleteIcon
                className={classes.actionIcon}
                onClick={(e) => {
                  trashMessage({ id, threadId })
                  e.stopPropagation()
                }}
              />
            </div>
          </div>
          {
            expanded
              ? <div dangerouslySetInnerHTML={{ __html: content }} />
              : <div className={classes.snippet}>{ snippet }</div>
          }
        </div>
      </CardContent>
    </Card>
  )
}

export default withStyles(styles)(Message)
