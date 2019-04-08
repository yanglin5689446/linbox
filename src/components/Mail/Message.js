
import React, { useState, useCallback } from 'react'
import {
  withStyles,
  Card,
  CardContent,
  Avatar,
  colors,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

import URLSafeBase64 from 'urlsafe-base64'

import getSender from 'utils/getSender'
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
  },
  draftBody: {
    display: 'flex',
    alignItems: 'center',
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
  classes, snippet, payload, draft, id,
}) => {
  const { trashMessage } = useGmailAPI()
  const [expanded, setExpanded] = useState(false)
  const parsePayloadType = useCallback((p) => {
    switch (p.mimeType) {
      case 'text/plain':
        return { type: 'text', raw: p.body.data }
      case 'text/html':
        return { type: 'html', raw: p.body.data }
      default: {
        let found = p.parts.find(e => e.mimeType === 'text/html')
        if (found) return { type: 'html', raw: found.body.data }
        found = p.parts.find(e => e.mimeType === 'text/plain')
        if (found) return { type: 'text', raw: found.body.data }
      }
        return {}
    }
  }, [])

  const sender = getSender({ payload })
  const parsed = parsePayloadType(payload)
  // @todo: support more mimetype
  if (!parsed.raw) return null
  const decoded = new TextDecoder().decode(URLSafeBase64.decode(parsed.raw))
  const content = parsed.type === 'text'
    ? <pre>{ decoded }</pre>
    : <div dangerouslySetInnerHTML={{ __html: decoded }} />


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
          { sender.name[0] }
        </Avatar>
        <div className={draft ? classes.draftBody : classes.body}>
          <div className={classes.head}>
            <strong>{ sender.name }</strong>
            <div className={classes.actions}>
              <DeleteIcon
                className={classes.actionIcon}
                onClick={(e) => {
                  trashMessage(id)
                  e.stopPropagation()
                }}
              />
            </div>
          </div>
          {
            expanded
              ? content
              : <div className={classes.snippet}>{ snippet }</div>
          }
        </div>
      </CardContent>
    </Card>
  )
}

export default withStyles(styles)(Message)
