import React from 'react'
import useAuth from '../../hooks/useAuth'

const Clients = () => {
  useAuth();
  return (
    <div>Clients</div>
  )
}

export default Clients