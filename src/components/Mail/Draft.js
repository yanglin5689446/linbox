
import React, { useState, useContext } from 'react'
import {
  withStyles,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Avatar,
  Typography,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

import UserContext from 'context/user'
import useGmailAPI from 'utils/hooks/gmail_api'

import parsePayload from 'utils/mails/parsePayload'
import { threadSharedStyles } from './styles'

const styles = theme => ({
  ...threadSharedStyles(theme),
})

const Draft = ({
  classes, snippet, payload, threadId, id,
}) => {
  const { user } = useContext(UserContext)
  const { trashDraft } = useGmailAPI()
  const [expanded, setExpanded] = useState(false)

  const parsed = parsePayload({ id, payload })
  const sender = user.names[0].displayName

  return (
    <ExpansionPanel expanded={expanded} onChange={() => setExpanded(exp => !exp)}>
      <ExpansionPanelSummary classes={{ root: classes.summary, content: classes.summaryContent }}>
        <React.Fragment>
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
              expanded || (
                <Typography className={classes.brief}>
                  { parsed.subject }
                  <span className={classes.snippet}>
                    { parsed.subject ? `- ${snippet}` : snippet }
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
        </React.Fragment>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.mails}>
        <div dangerouslySetInnerHTML={{ __html: parsed.content }} />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

export default withStyles(styles)(Draft)
