
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
    flex: 1,
    display: 'flex',
  },
  avatar: {
    height: 24,
    width: 24,
  },
  name: {
    flex: 3,
    minWidth: 0,
    width: 150,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    paddingLeft: 16,
    paddingRight: 16,
    letterSpacing: 0.2,
  },
  brief: {
    flex: 6,
    minWidth: 0,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    letterSpacing: 0.2,
  },
  actions: {
    padding: '0 !important',
    display: 'none',
    '$summary:hover &': {
      display: 'block',
    },
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
  unread: {
    fontWeight: 600,
  },
})

export default {
  threadSharedStyles,
}
