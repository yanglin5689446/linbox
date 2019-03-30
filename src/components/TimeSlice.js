
import React from 'react'
import {
  withStyles,
  Typography,
} from '@material-ui/core'
import Cluster from './Cluster'
import Thread from './Thread'

const styles = () => ({
  title: {
    paddingLeft: 24,
    margin: 5,
  },
})

const TimeSlice = ({ classes, name, Clusters }) => (
  <div>
    <Typography
      variant='subtitle1'
      className={classes.title}
    >
      {name}
    </Typography>
    {
      Object.entries(Clusters)
        .map(([key, object]) => (object.type === 'thread'
          ? <Thread key={key} name={key} {...object} />
          : <Cluster key={key} name={key} threads={object.threads} />))
    }
  </div>
)

export default withStyles(styles)(TimeSlice)
