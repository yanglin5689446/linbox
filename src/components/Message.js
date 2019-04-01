
import React, { useState } from 'react'
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
    padding: 8,
  },
  avatar: {
    height: 32,
    width: 32,
    margin: '4px 8px',
  },
  body: {
    padding: 4,
  },
  snippet: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    fontSize: 14,
    width: 1000,
  },
})

const Message = ({ classes, snippet, payload }) => {
  const [expanded, setExpanded] = useState(false)
  const type = payload.body.size ? 'text' : 'html'
  const raw = type === 'text'
    ? payload.body.data
    : payload.parts.find(e => e.mimeType === 'text/html').body.data
  const decoded = new TextDecoder().decode(URLSafeBase64.decode(raw))
  const sender = getSender({ payload })
  const content = type === 'text'
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
          src='https://thispersondoesnotexist.com/image'
          className={classes.avatar}
        />
        <div className={classes.body}>
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
