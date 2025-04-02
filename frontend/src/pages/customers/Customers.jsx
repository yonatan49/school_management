import React from 'react'
import useAuth from '../../hooks/useAuth'

const Customers = () => {
  useAuth();
  
  return (
    <div>Customers</div>
  )
}

export default Customers