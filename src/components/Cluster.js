
import React, { useState } from 'react'
import {
  withStyles,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Avatar,
} from '@material-ui/core'

const styles = () => ({
  summary: {
    display: 'flex',
  },
  sender: {
    flexGrow: 2,
    display: 'flex',
  },
  avatar: {
    height: 24,
    width: 24,
    display: 'inline-block',
  },
  name: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  snippet: {
    flexGrow: 15,
  },
})

const Cluster = ({ classes }) => {
  const [expanded, setExpanded] = useState(false)
  return (
    <ExpansionPanel expanded={expanded} onChange={() => setExpanded(exp => !exp)}>
      <ExpansionPanelSummary className={classes.summary}>
        <div className={classes.sender}>
          <Avatar
            alt=''
            src='https://thispersondoesnotexist.com/image'
            className={classes.avatar}
          />
          <Typography className={classes.name} />
        </div>
        <Typography className={classes.snippet}>I am an expansion panel</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Typography />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

export default withStyles(styles)(Cluster)
