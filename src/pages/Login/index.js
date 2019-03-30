
import React from 'react'
import {
  withStyles,
  Button,
} from '@material-ui/core'
import useGoogleAPI from 'utils/hooks/google_api'

const styles = () => ({
  root: {
    display: 'flex',
    height: '100vh',
  },
  container: {
    margin: 'auto',
  },
})

const Login = ({ classes }) => {
  const { signIn } = useGoogleAPI()
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Button onClick={signIn} variant='contained'>
          Sign in
        </Button>
      </div>
    </div>
  )
}

export default withStyles(styles)(Login)
