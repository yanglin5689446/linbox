
import React, { useContext } from 'react'
import {
  withStyles,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
  Divider,
  InputBase,
  Button,
  colors,
} from '@material-ui/core'
import DraftsIcon from '@material-ui/icons/Drafts'
import ClearIcon from '@material-ui/icons/Clear'
import MinimizeIcon from '@material-ui/icons/Minimize'
import classNames from 'classnames'

import DraftsContext from 'context/drafts'
import useGmailAPI from 'utils/hooks/gmail_api'

const styles = () => ({
  root: {
    flexBasis: '1px',
    flexDirection: 'row-reverse',
  },
  card: {
    width: 480,
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
    color: colors.grey[50],
  },
  iconButton: {
    padding: 0,
    margin: '0 4px',
    color: colors.grey[400],
    transition: 'color 0.2s',
    '&:hover': {
      color: colors.grey[50],
    },
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
  },
})

const EditDraft = ({
  classes, sender, id, subject, receipients, content,
}) => {
  const { closeDraftEdit } = useContext(DraftsContext)
  const { updateDraft, sendDraft, deleteDraft } = useGmailAPI()
  const update = field => e => updateDraft({
    id,
    sender,
    subject,
    receipients,
    content,
    [field]: e.target.value,
  })
  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader
          className={classes.header}
          avatar={<DraftsIcon className={classNames(classes.icon, classes.logoIcon)} />}
          action={(
            <span>
              <IconButton className={classes.iconButton}>
                <MinimizeIcon className={classes.icon} />
              </IconButton>
              <IconButton
                className={classes.iconButton}
                onClick={() => (content
                  ? closeDraftEdit(id)
                  : deleteDraft(id))
              }
              >
                <ClearIcon className={classes.icon} />
              </IconButton>
            </span>
          )}
        />
        <CardContent className={classes.content}>
          <InputBase
            placeholder='Receipient'
            className={classes.input}
            inputProps={{
              'aria-label': 'Receipient',
            }}
            value={receipients}
            onChange={update('receipients')}
          />
          <Divider />
          <InputBase
            placeholder='Sender'
            className={classes.input}
            inputProps={{
              'aria-label': 'Sender',
            }}
            value={sender}
            onChange={update('sender')}
          />
          <Divider />
          <InputBase
            placeholder='Subject'
            className={classes.subject}
            inputProps={{
              'aria-label': 'Subject',
            }}
            value={subject}
            onChange={update('subject')}
          />
          <br />
          <InputBase
            placeholder='Write something'
            className={classes.input}
            multiline
            rows={10}
            inputProps={{
              'aria-label': 'Content',
            }}
            value={content}
            onChange={update('content')}
          />
        </CardContent>
        <CardActions disableActionSpacing>
          <Button variant='contained' color='primary' onClick={() => sendDraft(id)}>
            Send
          </Button>
        </CardActions>
      </Card>
    </div>
  )
}

export default withStyles(styles)(EditDraft)
