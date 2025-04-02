import React, { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import Header from '../../components/header/Header'
import Breadcrumb from '../../components/breadcrumbs/Breadcrumbs'
import { FaHome, FaPrint } from 'react-icons/fa'
import { FaPencil } from 'react-icons/fa6'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const ViewStudent = () => {
  useAuth();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState({});
  const [registrations, setRegistrations] = useState();
  const [fetchStudentError, setFetchStudentError] = useState();
  const [fetchRegistrationError, setFetchRegistrationError] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/students/${id}`)
      .then((response) => {
        setStudent(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setFetchStudentError(error);
        console.log(error);
        setLoading(false);
      })
  }, [])

  const breadcrumbsLinks = [
    { path: '/dashboard', label: 'Home', icon: <FaHome /> },
    { path: '/students', label: 'Students' },
    { path: '', label: 'Student Details' }
  ]

  return (
    <div>
      <Header />
      <div className="container2">
        <Breadcrumb links={breadcrumbsLinks} />
        {loading ? (
          <p>Loading...</p>
        ) : fetchStudentError ? (
          <p>Error: {fetchStudentError}</p>
        ) : fetchRegistrationError ? (
          <p>Error: {fetchRegistrationError}</p>
        ) : (
          <div className='form-container'>
            <div className="cont">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>Student Details: {student.fullName} ({student.studentId})</h3>
                <div>
                  <button style={{ fontSize: '16px', padding: '10px', margin: '0 0 0 10px' }} onClick={() => navigate(`/students/edit/${id}`)}>Edit <FaPencil /></button>
                  <button style={{ fontSize: '16px', padding: '10px', margin: '0 0 0 10px' }}>Print <FaPrint /></button>
                </div>
              </div>
              <hr />
              <div style={{ display: 'flex' }}>
                <img
                  src={
                    student?.imageURL
                      ? student.imageURL
                      : 'https://cdn0.iconfinder.com/data/icons/multimedia-solid-30px/30/user_account_profile-512.png'
                  }
                  alt="Student profile"
                  style={{ width: '100px', height: '100px', border: '2px double', marginRight: '50px' }}
                />
                <div style={{ padding: '0 30px', width: '60%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p>Full Name: <b>{student.fullName}</b></p>
                    <p>Id: <b>{student.studentId}</b></p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p>Gender: <b>{student.gender}</b></p>
                    <p>Age: <b>{student.age}</b></p>
                    <p>
                      Admission Date: <b>{student?.admissionDate ? new Date(student.admissionDate).toISOString().split('T')[0] : 'N/A'}</b>
                    </p>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '80%' }}>
                    <p>Phone Number: <b>{student.phoneNumber}</b></p>
                    <p>Home Phone: <b>{student.guardianPhoneNumber}</b></p>
                    <p>Nationality: <b>{student.nationality}</b></p>
                    
                  </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewStudent