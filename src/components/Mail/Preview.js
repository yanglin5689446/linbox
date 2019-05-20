
import React from 'react'
import {
  withStyles,
  Typography,
} from '@material-ui/core'
import { useTranslation } from 'react-i18next'

import Cluster from './Cluster'
import Thread from './Thread'

const styles = () => ({
  title: {
    paddingLeft: 24,
    margin: 5,
  },
})

const Preview = ({ classes, clusters }) => {
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
        clusters.threads.map(props => (props.id
          ? <Thread key={props.id} {...props} />
          : <Cluster key={props.primaryLabel.id} {...props} />))
      }
    </div>
  )
}

export default withStyles(styles)(Preview)
