
import React, { useState, useCallback, useContext } from 'react'
import {
  withStyles,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Avatar,
  Typography,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

import URLSafeBase64 from 'urlsafe-base64'

import UserContext from 'context/user'
import useGmailAPI from 'utils/hooks/gmail_api'

import { threadSharedStyles } from './styles'

const styles = theme => ({
  ...threadSharedStyles(theme),
})

const Draft = ({
  classes, snippet, payload, threadId,
}) => {
  const { user } = useContext(UserContext)
  const { trashDraft } = useGmailAPI()
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

  const sender = user.names[0].displayName
  const parsed = parsePayloadType(payload)
  // @todo: support more mimetype
  if (!parsed.raw) return null
  const decoded = new TextDecoder().decode(URLSafeBase64.decode(parsed.raw))
  const content = parsed.type === 'text'
    ? <pre>{ decoded }</pre>
    : <div dangerouslySetInnerHTML={{ __html: decoded }} />
  const getSubject = useCallback(p => p
    .headers
    .find(e => e.name === 'Subject')
    .value, [])
  const subject = getSubject(payload)

  return (
    <ExpansionPanel expanded={expanded} onChange={() => setExpanded(exp => !exp)}>
      <ExpansionPanelSummary classes={{ root: classes.summary, content: classes.summaryContent }}>
        <div className={classes.sender}>
          <Avatar
            alt=''
            className={classes.avatar}
          >
            { sender[0] }
          </Avatar>
          <Typography className={classes.name}>
            { sender }
          </Typography>
        </div>
        {
          expanded
            ? null
            : (
              <Typography className={classes.brief}>
                { subject }
                <span className={classes.snippet}>
                  { subject ? `- ${snippet}` : snippet }
                </span>
              </Typography>
            )
        }
        <div className={classes.actions}>
          <DeleteIcon
            className={classes.actionIcon}
            onClick={(e) => {
              trashDraft(threadId)
              e.stopPropagation()
            }}
          />
        </div>

      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.mails}>
        { content }
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

export default withStyles(styles)(Draft)
