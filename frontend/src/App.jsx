import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Sidebar from './components/sidebar/Sidebar'
import Home from './pages/Home'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Dashboard from './pages/Dashboard'
import Clients from './pages/clients/Clients'
import Courses from './pages/courses/Courses'
import AddCourse from './pages/courses/AddCourse'
import EditCourse from './pages/courses/EditCourse'
import ViewCourse from './pages/courses/ViewCourse'
import Customers from './pages/customers/Customers'
import Performances from './pages/performances/Performances'
import Registrations from './pages/registrations/Registrations'
import AddRegistration from './pages/registrations/AddRegistration'
import EditRegistration from './pages/registrations/EditRegistration'
import ViewRegistration from './pages/registrations/ViewRegistration'
import Students from './pages/students/Students'
import AddStudent from './pages/students/AddStudent'
import EditStudent from './pages/students/EditStudent'
import ViewStudent from './pages/students/ViewStudent'
import Users from './pages/users/Users'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/dashboard' element={<Sidebar><Dashboard /></Sidebar>} />
      <Route path='/clients' element={<Sidebar><Clients /></Sidebar>} />
      <Route path='/courses' element={<Sidebar><Courses /></Sidebar>} />
      <Route path='/courses/add' element={<AddCourse />} />
      <Route path='/courses/edit/:id' element={<EditCourse />} />
      <Route path='courses/view/:id' element={<ViewCourse />} />
      <Route path='/customers' element={<Sidebar><Customers /></Sidebar>} />
      <Route path='/performances' element={<Sidebar><Performances /></Sidebar>} />
      <Route path='/registrations' element={<Sidebar><Registrations /></Sidebar>} />
      <Route path='/registrations/add' element={<AddRegistration />} />
      <Route path='/registrations/edit/:id' element={<EditRegistration />} />
      <Route path='registrations/view/:id' element={<ViewRegistration />} />
      <Route path='/students' element={<Sidebar><Students /></Sidebar>} />
      <Route path='/students/add' element={<AddStudent />} />
      <Route path='/students/edit/:id' element={<EditStudent />} />
      <Route path='students/view/:id' element={<ViewStudent />} />
      <Route path='/users' element={<Sidebar><Users /></Sidebar>} />
    </Routes>
  )
}

export default App

