
import React, { useState } from 'react'
import {
  withStyles,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Divider,
  InputBase,
  colors,
} from '@material-ui/core'
import DraftsIcon from '@material-ui/icons/Drafts'
import ClearIcon from '@material-ui/icons/Clear'
import MinimizeIcon from '@material-ui/icons/Minimize'
import Select from 'react-select'
import classNames from 'classnames'

const styles = theme => ({
  root: {
    flexBasis: '1px',
    flexDirection: 'row-reverse',
  },
  card: {
    width: 480,
    height: 400,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  header: {
    background: colors.grey[800],
    height: 40,
  },
  icon: {
    height: 18,
    width: 18,
  },
  logoIcon: {
    color: colors.grey[50]
  },
  iconButton: {
    padding: 0,
    margin: '0 4px',
    color: colors.grey[400],
    transition: 'color 0.2s',
    '&:hover': {
      color: colors.grey[50],
    }
  },
  content: {
    padding: 0,
  },
  input: {
    padding: '4px 12px',
  },
  subject: {
    padding: '12px 12px',
    fontWeight: 'bold',
  }
})

const EditDraft = ({ classes }) => {
  return (
    <div className={classes.root}>
      <Card className={classes.card} >
        <CardHeader
          className={classes.header}
          avatar={<DraftsIcon className={classNames(classes.icon, classes.logoIcon)} />}
          action={
            <span>
              <IconButton className={classes.iconButton}>
                <MinimizeIcon className={classes.icon} />
              </IconButton>
              <IconButton className={classes.iconButton}>
                <ClearIcon className={classes.icon} />
              </IconButton>
            </span>
          }
        />
        <CardContent className={classes.content}>
          <InputBase
            placeholder="Receipient"
            className={classes.input}
            inputProps={{
              'aria-label': 'Receipient',
            }}
          />
          <Divider />
          <InputBase
            placeholder="Sender"
            className={classes.input}
            inputProps={{
              'aria-label': 'Sender',
            }}
          />
          <Divider />
          <InputBase
            placeholder="Subject"
            className={classes.subject}
            inputProps={{
              'aria-label': 'Subject',
            }}
          />
          <br />
          <InputBase
            placeholder="Write something"
            className={classes.input}
            multiline
            inputProps={{
              'aria-label': 'Content',
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default withStyles(styles)(EditDraft)