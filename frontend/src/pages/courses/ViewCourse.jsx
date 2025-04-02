import React, { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/header/Header'
import Breadcrumb from '../../components/breadcrumbs/Breadcrumbs';
import { FaHome, FaPrint } from 'react-icons/fa';
import { FaPencil } from 'react-icons/fa6';

const ViewCourse = () => {
  useAuth();
  const [course, setCourse] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/courses/${id}`)
      .then((response) => {
        setCourse(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setFetchError(error);
        console.log(error);
        setLoading(false);
      })
  }, [])

  const breadcrumbsLinks = [
    { path: '/dashboard', label: 'Home', icon: <FaHome /> },
    { path: '/courses', label: 'Courses' },
    { path: '', label: 'Course Details'}
  ]

  return (
    <div>
      <Header />
      <div className="container2">
        <Breadcrumb links={breadcrumbsLinks} />
        {loading ? (
          <p>Loading...</p>
        ) : fetchError ? (
          <p>Error: {fetchError}</p>
        ) : (
          <div className='form-container'>
            <div className='cont'>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>Course Details: {course.courseName}</h3>
                <div>
                  <button style={{fontSize: '16px', padding: '10px', margin: '0 0 0 10px'}} onClick={() => navigate(`/courses/edit/${id}`)}>Edit <FaPencil /></button>
                  <button style={{fontSize: '16px', padding: '10px', margin: '0 0 0 10px'}}>Print <FaPrint /></button>
                </div>
              </div>
              <hr />
              <p>Campus: <b>{course.campus}</b></p>
              <p>Total Weeks: <b>{course.durationWeeks}</b></p>
              <p>Days/week: <b>{course.durationDays}</b></p>
              <p>Hours/day: <b>{course.durationHours}</b></p>
              <p>Registration Fee: <b>{course.registrationFee}</b></p>
              <p>Course Fee: <b>{course.courseFee}</b></p>
              <p>Description: <b>{course.description}</b></p>
              <p>Material: <b>{course.material}</b></p>
              <p>Tests:</p>
              <ol>
                {course.tests && course.tests.length > 0 ? (
                  course.tests.map((test, index) => (
                    <li key={index}><b>{test}</b></li>
                  ))
                ) : (
                  <li><b>No tests available</b></li>
                )}
              </ol>
            </div>
          </div>
        )}
      </div>
      
    </div>
  )
}

export default ViewCourse