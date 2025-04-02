import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/header/Header'
import Breadcrumb from '../../components/breadcrumbs/Breadcrumbs';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';
import { FaHome } from 'react-icons/fa';
import { IoAddCircleOutline } from 'react-icons/io5';
import { useSnackbar } from 'notistack';
import { IconButton } from '@mui/material';
import Table from '../../components/table/Table';

const Courses = () => {
  useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/courses')
      .then((response) => {
        setCourses(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        console.log(error);
        setLoading(false);
      });
  }, []);

  const handleDeleteCourse = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setLoading(true);
      axios
        .delete(`http://localhost:5555/courses/${id}`)
        .then(() => {
          setCourses(courses.filter((course) => course._id !== id));
          setLoading(false);
          enqueueSnackbar('Course deleted successfully', { variant: 'success' });
        })
        .catch((error) => {
          setLoading(false);
          enqueueSnackbar('An error occurred while deleting the course', { variant: 'error' });
          console.log(error);
        });
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', headerAlign: 'center', align: 'center', width: 50 },
    { field: 'courseName', headerName: 'Name', headerAlign: 'center', align: 'center', width: 150 },
    { field: 'courseFee', headerName: 'Course Fee', headerAlign: 'center', align: 'center', width: 100 },
    { field: 'campus', headerName: 'Campus', headerAlign: 'center', align: 'center', width: 140 },
    { field: 'durationWeeks', headerName: 'Total Weeks', headerAlign: 'center', align: 'center', width: 110 },
    { field: 'durationDays', headerName: 'Days/week', headerAlign: 'center', align: 'center', width: 100 },
    { field: 'durationHours', headerName: 'Hours/day', headerAlign: 'center', align: 'center', width: 100 },
    { field: 'material', headerName: 'Materials', headerAlign: 'center', align: 'center', flex: 2 },
    { field: 'registrationFee', headerName: 'Registration Fee', headerAlign: 'center', align: 'center', width: 140 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <div>
          <IconButton component={Link} to={`/courses/view/${params.row._id}`}>
            <BsInfoCircle style={{ color: 'blue' }} />
          </IconButton>
          <IconButton component={Link} to={`/courses/edit/${params.row._id}`}>
            <AiOutlineEdit style={{ color: 'green' }} />
          </IconButton>
          <IconButton onClick={() => handleDeleteCourse(params.row._id)}>
            <MdOutlineDelete style={{ color: 'red' }} />
          </IconButton>
        </div>
      ),
    },
  ];

  const rows = courses.map((course, index) => ({
    id: index + 1,
    ...course,
  }));

  const breadcrumbsLinks = [
    { path: '/dashboard', label: 'Home', icon: <FaHome /> },
    { path: '', label: 'Courses' },
  ];

  return (
    <div>
      <Header />
      <div className='container2'>
        <Breadcrumb links={breadcrumbsLinks} />
        <div style={{ display: 'flex', justifyContent: 'end ' }}>
          <button style={{ marginTop: '20px', padding: '10px 50px' }} onClick={() => navigate('/courses/add')}>
            <IoAddCircleOutline /> Add Course
          </button>
        </div>
        <div className="table-container">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <Table columns={columns} rows={rows} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
