
import React from 'react'
import { withStyles } from '@material-ui/core'


import useProcessedMails from 'utils/hooks/processed_mails'
import Thread from 'components/Mail/Thread'
import ReloadButton from 'components/ReloadButton'

const styles = () => ({
  container: {
    width: '70vw',
    maxWidth: 1200,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  reloadButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
})

const Trash = ({ classes }) => {
  const processed = useProcessedMails({ includes: ['TRASH'], aggregate: false })

  return (
    <div className={classes.container}>
      <div className={classes.reloadButtonContainer}>
        <ReloadButton />
      </div>
      <div>
        {
          processed.map(thread => <Thread key={thread.id} {...thread} />)
        }
      </div>

    </div>
  )
}

export default withStyles(styles)(Trash)
