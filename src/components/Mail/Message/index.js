
import React, {
  useState, useEffect, useContext, useCallback, useMemo, useRef,
} from 'react'
import {
  withStyles,
  Card,
  CardContent,
  colors,
} from '@material-ui/core'

import uuid from 'uuid/v1'

import MailsContext from 'context/mails'
import useGmailAPI from 'utils/hooks/gmail_api'
import processHTMLContent from 'utils/mails/processHTMLContent'
import Header from './Header'

const styles = () => ({
  root: {
    width: '100%',
    borderTop: `1px solid ${colors.grey[300]}`,
  },
  cardContent: {
    padding: '8px !important',
  },
  content: {
    marginLeft: '5rem',
    marginRight: '5rem',
    paddingBottom: '16px',
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
      className={classes.root}
    >
      <div style={{ display: 'none' }}>{id}</div>
      <CardContent className={classes.cardContent}>
        <Header
          expanded={expanded}
          onClick={() => setExpanded(exp => !exp)}
          content={cooked.content}
          snippet={snippet}
          name={from.name}
          actions={actions}
          handlers={{
            backToInbox, markAsDone, trash, permanentDelete,
          }}
        />
        {
          expanded
          && (
          <div
            id={scope.current}
            className={classes.content}
            dangerouslySetInnerHTML={{ __html: cooked.content }}
          />
          )
        }
      </CardContent>
    </Card>
  )
}

export default withStyles(styles)(Message)
