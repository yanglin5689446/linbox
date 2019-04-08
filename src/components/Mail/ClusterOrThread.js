
import React from 'react'
import Cluster from './Cluster'
import Thread from './Thread'

const ClusterOrThread = ({ classes, id, ...props }) => (id
  ? <Thread id={id} {...props} />
  : <Cluster {...props} />)
export default ClusterOrThread
