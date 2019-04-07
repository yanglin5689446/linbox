
import React, { useState, useCallback } from 'react'
import {
  withStyles,
  Card,
  CardContent,
  Avatar,
  colors,
} from '@material-ui/core'

import URLSafeBase64 from 'urlsafe-base64'

import getSender from 'utils/getSender'

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
  avatar: {
    height: 32,
    width: 32,
    margin: '4px 12px',
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
  classes, snippet, payload, draft,
}) => {
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
          <strong>{ sender.name }</strong>
          <br />
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
