
import React, {
  useState, useEffect, useContext, useMemo, useRef,
} from 'react'
import {
  withStyles,
  Card,
  CardContent,
  Avatar,
  colors,
} from '@material-ui/core'
import uuid from 'uuid/v1'

import DeleteIcon from '@material-ui/icons/Delete'

import MailsContext from 'context/mails'
import useGmailAPI from 'utils/hooks/gmail_api'
import cssParser from 'css'

const styles = () => ({
  root: {
    width: '100%',
    cursor: 'pointer',
    borderTop: `1px solid ${colors.grey[300]}`,
  },
  content: {
    display: 'flex',
    padding: '8px !important',
  },
  head: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  avatar: {
    height: 32,
    width: 32,
    margin: '4px 12px',
  },
  actionIcon: {
    margin: '0 4px',
    fontSize: '1.25rem',
    cursor: 'pointer',
    opacity: 0.78,
    '&:hover': {
      opacity: 1,
    },
  },
  body: {
    padding: 4,
    width: 'calc(100% - 32px - 12px * 2)',
  },
  snippet: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    fontSize: 14,
    width: 'calc(70vw - 32px - 12px * 2 - 20px)',
  },
})

const processHTMLContent = (scope, raw) => {
  const parser = new DOMParser()
  const serializer = new XMLSerializer()
  const doc = parser.parseFromString(raw, 'text/html')
  // add target='_blank' to all links
  const links = Array.from(doc.getElementsByTagName('a'))
  links.forEach(link => link.setAttribute('target', '_blank'))
  // add target='_blank' to all areas
  const areas = Array.from(doc.getElementsByTagName('area'))
  areas.forEach(link => link.setAttribute('target', '_blank'))

  const stylesheets = Array.from(doc.getElementsByTagName('style'))
  const stripAndAddScope = selectors => selectors
    .filter(selector => selector.toLowerCase !== 'body')
    .map(selector => `#${scope} ${selector}`)
  stylesheets.forEach((stylesheet) => {
    try {
      const css = cssParser.parse(stylesheet.innerText)
      Object.values(css.stylesheet.rules)
        .forEach((rule) => {
          if (rule.type === 'rule') {
            rule.selectors = stripAndAddScope(rule.selectors) // eslint-disable-line
          } else if (rule.type === 'media') {
            rule.rules.forEach((r) => {
              r.selectors = stripAndAddScope(r.selectors)  // eslint-disable-line
            })
          }
        })
      stylesheet.innerText = cssParser.stringify(css, { compress: true })  // eslint-disable-line
    } catch (e) {
      stylesheet.innerText = ''  // eslint-disable-line
    }
  })

  return {
    content: serializer.serializeToString(doc),
  }
}

const Message = ({
  classes, threadId, id, from, snippet, content, initialExpand, unread,
}) => {
  const { removeMessageLabel } = useContext(MailsContext)
  const { modifyMessage, trashMessage } = useGmailAPI()
  const [expanded, setExpanded] = useState(initialExpand)
  const scope = useRef(uuid())
  useEffect(() => {
    if (expanded && unread) {
      modifyMessage({ id, remove: ['UNREAD'] })
      removeMessageLabel({ threadId, id, label: 'UNREAD' })
    }
  }, [unread, expanded])
  const cooked = useMemo(() => processHTMLContent(scope.current, content), [scope, content])
  return (
    <Card
      onClick={() => setExpanded(exp => !exp)}
      className={classes.root}
    >
      <CardContent className={classes.content}>
        <Avatar
          alt=''
          className={classes.avatar}
        >
          { from.name[0] }
        </Avatar>
        <div className={classes.body}>
          <div className={classes.head}>
            <strong>{ from.name }</strong>
            <div className={classes.actions}>
              <DeleteIcon
                className={classes.actionIcon}
                onClick={(e) => {
                  trashMessage({ id, threadId })
                  e.stopPropagation()
                }}
              />
            </div>
          </div>
          {
            expanded
              ? <div id={scope.current} dangerouslySetInnerHTML={{ __html: cooked.content }} />
              : <div className={classes.snippet}>{ snippet }</div>
          }
        </div>
      </CardContent>
    </Card>
  )
}

export default withStyles(styles)(Message)
