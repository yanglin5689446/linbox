
import React, { useState } from 'react'
import {
  withStyles,
  Card,
  CardContent,
  Avatar,
  colors,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

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
  snippet: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    fontSize: 14,
    width: 'calc(70vw - 32px - 12px * 2 - 20px)',
  },
})

const Message = ({
  classes, id, from, snippet, content, initialExpand,
}) => {
  const { trashMessage } = useGmailAPI()
  const [expanded, setExpanded] = useState(initialExpand)
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
                  trashMessage(id)
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
