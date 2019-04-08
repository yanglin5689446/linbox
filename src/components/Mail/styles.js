
export const threadSharedStyles = theme => ({
  expanded: {
    transition: 'all .1s',
    background: theme.palette.grey[300],
    width: 'calc(100% + 48px)',
    marginLeft: -24,
  },
  summary: {
    display: 'flex',
  },
  summaryContent: {
    maxWidth: '100%',
  },
  sender: {
    flex: 2,
    display: 'flex',
  },
  avatar: {
    height: 24,
    width: 24,
  },
  name: {
    width: 150,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    paddingLeft: 16,
    paddingRight: 16,
  },
  brief: {
    flex: 8,
    minWidth: 0,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
})

export default {
  threadSharedStyles,
}
