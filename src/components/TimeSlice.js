
import React from 'react'
import {
  withStyles,
  Typography,
} from '@material-ui/core'
import { useTranslation } from 'react-i18next'

import ClusterOrThread from './ClusterOrThread'

const styles = () => ({
  title: {
    paddingLeft: 24,
    margin: 5,
  },
})

const TimeSlice = ({ classes, clusters }) => {
  const { t } = useTranslation(['date'])
  return (
    <div>
      <Typography
        variant='subtitle1'
        className={classes.title}
      >
        {t(clusters.label, { date: clusters.date })}
      </Typography>
      {
        // @todo: change key to something other than index
        // eslint-disable-next-line
        clusters.threads.map((thread, index) => <ClusterOrThread key={index} {...thread} />)
      }
    </div>
  )
}

export default withStyles(styles)(TimeSlice)
