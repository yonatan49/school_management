import React from 'react'
import useAuth from '../../hooks/useAuth'

const Users = () => {
  useAuth();
  
  return (
    <div>Users</div>
  )
}

export default Users