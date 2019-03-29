
import React from 'react'
import {
  withStyles
} from '@material-ui/core'

import TimeSlice from 'components/TimeSlice'

const styles = theme => ({
  container: {
    width: '60vw',
    maxWidth: 1200,
    marginLeft: 'auto',
    marginRight: 'auto',
  }
})

// @todo: fake data
const mails = {
  today: {
    'GitHub' : {
      type: 'groups',
      threads: [
        {
          id: 'foo',
          threadId: 'bar',
          payload: {
            parts: {
              body: {
                data: 'bG9sIGJ5ZSBpbmJveAo='
              }
            }
          }
        }
      ]
    },
    'Foo Bar': {
      type: 'thread',
      id: 'foo',
        threadId: 'bar',
        payload: {
          parts: {
            body: {
              data: 'bG9sIGJ5ZSBpbmJveAo='
            }
          }
        }
    }
  }
}

const Inbox = ({ classes }) => {
  return (
    <div className={classes.container}>
      {
        Object.entries(mails)
          .map(([key, threadGroups]) =>
            <TimeSlice
              key={key}
              name={key}
              threadGroups={threadGroups}
            />
          )
      }
    </div>
  )
}

export default withStyles(styles)(Inbox)