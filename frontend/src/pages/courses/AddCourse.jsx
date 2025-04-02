import React, { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import axios from 'axios'
import Header from '../../components/header/Header'
import Breadcrumb from '../../components/breadcrumbs/Breadcrumbs'
import { FaHome } from 'react-icons/fa'
import { IoIosSend } from "react-icons/io";
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'

const AddCourse = () => {
  useAuth();
  const [courseName, setCourseName] = useState('');
  const [campus, setCampus] = useState('Betelhem Plaza');
  const [courseFee, setCourseFee] = useState('');
  const [description, setDescription] = useState('');
  const [durationDays, setDurationDays] = useState('');
  const [durationHours, setDurationHours] = useState('');
  const [durationWeeks, setDurationWeeks] = useState('');
  const [material, setMaterial] = useState('');
  const [registrationFee, setRegistrationFee] = useState('');
  const [tests, setTests] = useState(['']);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [courseNameError, setCourseNameError] = useState('');
  const [durationWeeksError, setDurationWeeksError] = useState('');
  const [durationDaysError, setDurationDaysError] = useState('');
  const [durationHoursError, setDurationHoursError] = useState('');
  const [registrationFeeError, setRegistrationFeeError] = useState('');
  const [courseFeeError, setCourseFeeError] = useState('');
  const [testsError, setTestsError] = useState('');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleAddTest = () => {
    setTests([...tests, '']);
  };

  const handleRemoveTest = (index) => {
    const newTests = tests.filter((_, i) => i !== index);
    setTests(newTests);
  };

  const handleTestChange = (index, event) => {
    const newTests = tests.map((test, i) => (i === index ? event.target.value : test));
    setTests(newTests);
  };

  const validate = () => {
    let isValid = true;

    if (!courseName) {
      setCourseNameError('Course Name is required');
      isValid = false;
    } else {
      setCourseNameError('');
    }

    if (!durationWeeks) {
      setDurationWeeksError('Duration weeks is required');
      isValid = false;
    } else {
      setDurationWeeksError('');
    }

    if (!durationDays) {
      setDurationDaysError('Days/week is required');
      isValid = false;
    } else if (durationDays > 7 || durationDays <= 0) {
      setDurationDaysError('Enter a value between 1 and 7');
      isValid = false;
    } else {
      setDurationDaysError('');
    }

    if (!durationHours) {
      setDurationHoursError('Hours/day is required');
      isValid = false;
    } else if (durationHours > 12 || durationHours <= 0) {
      setDurationHoursError('Enter a value between 1 and 12');
      isValid = false;
    } else {
      setDurationHoursError('');
    }

    if (!registrationFee) {
      setRegistrationFeeError('Registration fee is required');
      isValid = false;
    } else if (registrationFee < 0) {
      setRegistrationFeeError('Enter a value greater than 0');
      isValid = false;
    } else {
      setRegistrationFeeError('');
    }

    if (!courseFee) {
      setCourseFeeError('Course fee is required');
      isValid = false;
    } else if (courseFee < 0) {
      setCourseFeeError('Enter a value greater than 0');
      isValid = false;
    } else {
      setCourseFeeError('');
    }

    if (!tests || tests.length === 0 || tests.some(test => test.trim() === '')) {
      setTestsError('Atleast 1 test is required and cannot be empty');
      isValid = false;
    } else {
      setTestsError('');
    }
    return isValid;
  }

  const handleAddCourse = (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;
    setIsSaving(true);

    const data = {
      courseName,
      campus,
      courseFee,
      description,
      durationDays,
      durationHours,
      durationWeeks,
      material,
      registrationFee,
      tests
    };
    axios
      .post('http://localhost:5555/courses', data)
      .then(() => {
        setIsSaving(false);
        enqueueSnackbar('New course added successfully', { variant: 'success'} );
        navigate('/courses');
      })
      .catch((error) => {
        setIsSaving(false);
        enqueueSnackbar('An error occured while adding new course', { variant: 'error' });
        console.log(error);
      })
  }

  const breadcrumbsLinks = [
    { path: '/dashboard', label: 'Home', icon: <FaHome /> },
    { path: '/courses', label: 'Courses' },
    { path: '', label: 'Add Course'}
  ];

  return (
    <div>
      <Header />
      <div className='container2'>
        <Breadcrumb links={breadcrumbsLinks} />
        <div className='form-container'>
          <div className="cont">
            <h3>Course Details</h3>
            <hr />
            <form onSubmit={handleAddCourse}>
              <div className="form-row">
                  <label className='input-label'>
                    Course Name
                    <input
                      className='input-field'
                      type='text'
                      name='courseName'
                      placeholder='Course Name'
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                    />
                    {courseNameError && <p style={{ color: '#f00', fontSize: '13px', marginLeft: '10px', fontWeight: '400' }}>{courseNameError}</p>}
                  </label>
                  <label className='input-label'>
                    Campus
                    <select
                      className='input-field'
                      name='campus'
                      value={campus}
                      onChange={(e) => setCampus(e.target.value)}
                    >
                      <option value='Betelhem Plaza'>Betelhem Plaza - Megenagna</option>
                      <option value='AG Grace'>AG Grace - 24</option>
                    </select>
                  </label>
                </div>
                <div className="form-row">
                  <label className='input-label'>
                    Total Weeks
                    <input
                      className='input-field'
                      type='number'
                      name='durationWeeks'
                      placeholder='Total Weeks'
                      value={durationWeeks}
                      onChange={(e) => setDurationWeeks(e.target.value)}
                    />
                    {durationWeeksError && <p style={{ color: '#f00', fontSize: '13px', marginLeft: '10px', fontWeight: '400' }}>{durationWeeksError}</p>}
                  </label>
                  <label className='input-label'>
                    Days/week
                    <input
                      className='input-field'
                      type='number'
                      name='durationDays'
                      placeholder='Days/week'
                      value={durationDays}
                      onChange={(e) => setDurationDays(e.target.value)}
                    />
                    {durationDaysError && <p style={{ color: '#f00', fontSize: '13px', marginLeft: '10px', fontWeight: '400' }}>{durationDaysError}</p>}
                  </label>
                  <label className='input-label'>
                    Hours/day
                    <input
                      className='input-field'
                      type='number'
                      name='durationHours'
                      placeholder='Hours/day'
                      value={durationHours}
                      onChange={(e) => setDurationHours(e.target.value)}
                    />
                    {durationHoursError && <p style={{ color: '#f00', fontSize: '13px', marginLeft: '10px', fontWeight: '400' }}>{durationHoursError}</p>}
                  </label>
                </div>
                <div className="form-row">
                  <label className='input-label'>
                    Registration Fee (Br.)
                    <input
                      className='input-field'
                      type='number'
                      name='registrationFee'
                      placeholder='Registration Fee'
                      value={registrationFee}
                      onChange={(e) => setRegistrationFee(e.target.value)}
                    />
                    {registrationFeeError && <p style={{ color: '#f00', fontSize: '13px', marginLeft: '10px', fontWeight: '400' }}>{registrationFeeError}</p>}
                  </label>
                  <label className='input-label'>
                    Course Fee (Br.)
                    <input
                      className='input-field'
                      type='number'
                      name='courseFee'
                      placeholder='Course Fee'
                      value={courseFee}
                      onChange={(e) => setCourseFee(e.target.value)}
                    />
                    {courseFeeError && <p style={{ color: '#f00', fontSize: '13px', marginLeft: '10px', fontWeight: '400' }}>{courseFeeError}</p>}
                  </label>
                </div>
                <div className="form-row">
                  <label className='input-label'>
                    Course Description
                    <textarea
                      className='input-field'
                      type='text'
                      name='description'
                      placeholder='Course Description'
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      style={{ resize: 'none', width: '100%' }}
                    />
                  </label>
                </div>
                <div className="form-row">
                  <label className='input-label'>
                    Materials
                    <textarea
                      className='input-field'
                      type='text'
                      name='material'
                      placeholder='Materials'
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      style={{ resize: 'none', width: '100%' }}
                    />
                  </label>
                </div>
                <div className="form-row">
                  <label className='input-label'>
                    Tests
                    {tests.map((test, index) => (
                      <div key={index} className="form-row">
                        <input
                          className='input-field'
                          type='text'
                          name='tests'
                          placeholder='Test'
                          value={test}
                          onChange={(e) => handleTestChange(index, e)}
                        />
                        <button type='button' style={{ fontSize: '14px', padding: '10px', margin: '0 0 0 10px' }} onClick={() => handleRemoveTest(index)}>Remove</button>
                      </div>
                    ))}
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      {testsError ? <p style={{ color: '#f00', fontSize: '13px', marginLeft: '10px', fontWeight: '400' }}>{testsError}</p> : <div></div>}
                      <button type='button' style={{ fontSize: '14px', padding: '10px 30px', margin: '0 0 0 10px' }} onClick={handleAddTest}>Add Test</button>
                    </div>
                  </label>
                </div>
                {error && <p className='error'>{error}</p>}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button type="submit" className='save' disabled={isSaving}>
                    {isSaving ? <CircularProgress size={24} /> : <>Save <IoIosSend /></>}
                  </button>
                </div>
            </form>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default AddCourse