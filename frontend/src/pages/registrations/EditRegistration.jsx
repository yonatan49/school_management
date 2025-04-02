import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import Header from '../../components/header/Header';
import Breadcrumb from '../../components/breadcrumbs/Breadcrumbs';
import { FaHome } from 'react-icons/fa';
import { CircularProgress } from '@mui/material';
import { FaPencil } from 'react-icons/fa6';
import { useSnackbar } from 'notistack';

const EditRegistration = () => {
  useAuth();
  const { id } = useParams();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [totalFee, setTotalFee] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountFee, setDiscountFee] = useState(0);
  const [paidOn1, setPaidOn1] = useState('');
  const [payment1, setPayment1] = useState('');
  const [receipt1, setReceipt1] = useState('');
  const [paidOn2, setPaidOn2] = useState('');
  const [payment2, setPayment2] = useState('');
  const [receipt2, setReceipt2] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedStudentError, setSelectedStudentError] = useState('');
  const [selectedCoursesError, setSelectedCoursesError] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [payment1Error, setPayment1Error] = useState('');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentResponse = await axios.get('http://localhost:5555/students');
        const courseResponse = await axios.get('http://localhost:5555/courses');
        const registrationResponse = await axios.get(`http://localhost:5555/registrations/${id}`);

        console.log("Students API response:", studentResponse.data);
        console.log("Courses API response:", courseResponse.data);
        console.log("Registration API response:", registrationResponse.data);

        setStudents(studentResponse.data.data);
        setCourses(courseResponse.data.data);

        const registration = registrationResponse.data;
        const registeredStudent = studentResponse.data.data.find(student => student.studentId === registration.studentId);

        setSelectedStudent({
          value: registration.studentId,
          label: `${registeredStudent.fullName} (${registeredStudent.studentId})`
        });

        setSelectedCourses(registration.courseIds.map(courseId => {
          const course = courseResponse.data.data.find(c => c._id === courseId);
          return { value: course._id, label: course.courseName };
        }));

        setTotalFee(registration.totalFee);
        setDiscount(registration.discount);
        setDiscountFee(registration.discountedFee);
        setPaidOn1(registration.paidOn1 ? registration.paidOn1.split('T')[0] : '');
        setPayment1(registration.paidAmount1);
        setReceipt1(registration.paymentReceipt1);
        setPaidOn2(registration.paidOn2 ? registration.paidOn2.split('T')[0] : '');
        setPayment2(registration.paidAmount2);
        setReceipt2(registration.paymentReceipt2);
        setLoading(false);
      } catch (error) {
        setFetchError("Error fetching data: ", error)
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [id]);

  const handleStudentChange = (selectedOption) => {
    setSelectedStudent(selectedOption);

    // Set paidOn1 to the admissionDate of the selected student
    const student = students.find(student => student.studentId === selectedOption.value);
    if (student && student.admissionDate) {
      setPaidOn1(student.admissionDate.split('T')[0]);
    }
  };

  const handleCoursesChange = (selectedOptions) => {
    setSelectedCourses(selectedOptions || []);

    // Calculate the total fee based on selected courses
    const total = (selectedOptions || []).reduce((sum, course) => {
      const foundCourse = courses.find(c => c._id === course.value);
      return sum + (foundCourse ? foundCourse.courseFee : 0);
    }, 0);
    setTotalFee(total);
  };

  useEffect(() => {
    const discountAmount = (totalFee * discount) / 100;
    setDiscountFee(totalFee - discountAmount);
  }, [totalFee, discount]);

  const validate = () => {
    let isValid = true;

    if (!selectedStudent) {
      setSelectedStudentError('Select a student');
      isValid = false;
    } else {
      setSelectedStudentError('');
    }

    if (selectedCourses.length === 0) {
      setSelectedCoursesError('Select at least one course');
      isValid = false;
    } else {
      setSelectedCoursesError('');
    }

    if (discount < 0 || discount > 100) {
      setDiscountError('Enter a value between 0 and 100');
      isValid = false;
    } else {
      setDiscountError('');
    }

    if (!payment1) {
      setPayment1Error('1st payment amount cannot be empty');
      isValid = false;
    } else if (payment1 > discountFee || payment1 < 0) {
      setError(`Enter a value between 0 and ${discountFee}`);
      isValid = false;
    } else {
      setPayment1Error('');
    }

    if ((payment2 + payment1) > discountFee) {
      setError('Check payment amount and try again');
      isValid = false;
    } else {
      setError('');
    }

    return isValid;
  };

  const handleUpdateRegistration = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;
    setIsSaving(true);

    const registrationData = {
      studentId: selectedStudent.value,
      courseIds: selectedCourses.map(course => course.value),
      totalFee,
      discount,
      discountedFee: discountFee,
      paidOn1: paidOn1 ? new Date(paidOn1) : null,
      paidAmount1: payment1 ? parseFloat(payment1) : 0,
      paymentReceipt1: receipt1 || '',
      paidOn2: paidOn2 ? new Date(paidOn2) : null,
      paidAmount2: payment2 ? parseFloat(payment2) : 0,
      paymentReceipt2: receipt2 || '',
      approvedBy: '',
    };

    try {
      await axios.put(`http://localhost:5555/registrations/${id}`, registrationData);
      enqueueSnackbar('Registration updated successfully', { variant: 'success' });
      navigate('/registrations');
    } catch (error) {
      enqueueSnackbar('An error occurred while updating the registration', { variant: 'error' });
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  const breadcrumbsLinks = [
    { path: '/dashboard', label: 'Home', icon: <FaHome /> },
    { path: '/registrations', label: 'Registrations' },
    { path: '', label: 'Edit Registration' }
  ];

  return (
    <div>
      <Header />
      <div className='container2'>
        <Breadcrumb links={breadcrumbsLinks} />
        {loading ? (
          <p>Loading...</p>
        ) : fetchError ? (
          <p>Error: {fetchError}</p>
        ) : (
          <div className="form-container">
            <div className="cont">
              <h3>Edit Registration Details</h3>
              <hr />
              <form onSubmit={handleUpdateRegistration}>
                <div className='form-row'>
                  <label className='input-label'>
                    Student
                    <Select
                      options={students.map(student => ({
                        value: student.studentId,
                        label: `${student.fullName} (${student.studentId})`
                      }))}
                      value={selectedStudent}
                      onChange={handleStudentChange}
                    />
                    {selectedStudentError && <p style={{ color: '#f00', fontSize: '13px', marginLeft: '10px', fontWeight: '400' }}>{selectedStudentError}</p>}
                  </label>
                </div>
                <div className='form-row'>
                  <label className='input-label'>
                    Courses
                    <Select
                      options={courses.map(course => ({
                        value: course._id,
                        label: course.courseName
                      }))}
                      isMulti
                      value={selectedCourses}
                      onChange={handleCoursesChange}
                    />
                    {selectedCoursesError && <p style={{ color: '#f00', fontSize: '13px', marginLeft: '10px', fontWeight: '400' }}>{selectedCoursesError}</p>}
                  </label>
                </div>
                <div className="form-row">
                  <label className='input-label'>
                    Total Fee (Br.)
                    <input
                      className='input-field'
                      type='number'
                      name='totalFee'
                      value={totalFee}
                      disabled
                    />
                  </label>
                  <label className='input-label'>
                    Discount (%)
                    <input
                      className='input-field'
                      type='number'
                      name='discount'
                      placeholder='Discount (%)'
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                    />
                    {discountError && <p style={{ color: '#f00', fontSize: '13px', marginLeft: '10px', fontWeight: '400' }}>{discountError}</p>}
                  </label>
                  <label className='input-label'>
                    Discounted Fee (Br.)
                    <input
                      className='input-field'
                      type='number'
                      name='discountedFee'
                      value={discountFee}
                      disabled
                    />
                  </label>
                </div>
                <div className='form-row'>
                  <label className='input-label'>
                    1st Payment Date
                    <input
                      className='input-field'
                      type='date'
                      name='paidOn1'
                      value={paidOn1}
                      onChange={(e) => setPaidOn1(e.target.value)}
                    />
                  </label>
                  <label className='input-label'>
                    1st Payment Amount (Br.)
                    <input
                      className='input-field'
                      type='number'
                      name='payment1'
                      placeholder='Amount'
                      value={payment1}
                      onChange={(e) => setPayment1(e.target.value)}
                    />
                    {payment1Error && <p style={{ color: '#f00', fontSize: '13px', marginLeft: '10px', fontWeight: '400' }}>{payment1Error}</p>}
                  </label>
                  <label className='input-label'>
                    1st Payment Receipt No.
                    <input
                      className='input-field'
                      type='text'
                      name='receipt1'
                      placeholder='Receipt No.'
                      value={receipt1}
                      onChange={(e) => setReceipt1(e.target.value)}
                    />
                  </label>
                </div>
                <div className='form-row'>
                  <label className='input-label'>
                    2nd Payment Date
                    <input
                      className='input-field'
                      type='date'
                      name='paidOn2'
                      value={paidOn2}
                      onChange={(e) => setPaidOn2(e.target.value)}
                    />
                  </label>
                  <label className='input-label'>
                    2nd Payment Amount (Br.)
                    <input
                      className='input-field'
                      type='number'
                      name='payment2'
                      placeholder='Amount'
                      value={payment2}
                      onChange={(e) => setPayment2(e.target.value)}
                    />
                  </label>
                  <label className='input-label'>
                    2nd Payment Receipt No.
                    <input
                      className='input-field'
                      type='text'
                      name='receipt2'
                      placeholder='Receipt No.'
                      value={receipt2}
                      onChange={(e) => setReceipt2(e.target.value)}
                    />
                  </label>
                </div>
                {error && <p style={{ color: '#f00', fontSize: '13px', marginLeft: '10px', fontWeight: '400' }}>{error}</p>}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button type="submit" className='save' disabled={isSaving}>
                    {isSaving ? <CircularProgress size={24} /> : <>Update <FaPencil /></>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditRegistration;
