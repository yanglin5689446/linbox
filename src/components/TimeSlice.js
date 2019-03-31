
import React from 'react'
import {
  withStyles,
  Typography,
} from '@material-ui/core'
import ClusterOrThread from './ClusterOrThread'

const styles = () => ({
  title: {
    paddingLeft: 24,
    margin: 5,
  },
})

const TimeSlice = ({ classes, clusters }) => (
  <div>
    <Typography
      variant='subtitle1'
      className={classes.title}
    >
      {clusters.label}
    </Typography>
    {
      // @todo: change key to something other than index
      // eslint-disable-next-line
      clusters.threads.map((thread, index) => <ClusterOrThread key={index} {...thread} />)
    }
  </div>
)

export default withStyles(styles)(TimeSlice)
