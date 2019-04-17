
import React from 'react'
import {
  withStyles,
  Button,
} from '@material-ui/core'
import useGoogleAPI from 'utils/hooks/google_api'
import { useTranslation } from 'react-i18next'

const styles = () => ({
  root: {
    display: 'flex',
    height: '100vh',
  },
  container: {
    margin: 'auto',
  },
  signInButton: {
  },
  signInText: {
    paddingLeft: 8,
  },
})

const Login = ({ classes }) => {
  const { signIn } = useGoogleAPI()
  const { t } = useTranslation(['actions'])
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Button className={classes.signInButton} onClick={signIn} variant='outlined'>
          <img
            src='https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg'
            alt='Google Icon'
            width={24}
            height={24}
          />
          <span className={classes.signInText}>{ t('SIGN_IN') }</span>
        </Button>
      </div>
    </div>
  )
}

export default withStyles(styles)(Login)
