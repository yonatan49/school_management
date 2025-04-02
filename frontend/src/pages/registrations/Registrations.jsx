import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/header/Header';
import Breadcrumb from '../../components/breadcrumbs/Breadcrumbs';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';
import { FaHome } from 'react-icons/fa';
import { IoAddCircleOutline } from 'react-icons/io5';
import { useSnackbar } from 'notistack';
import { IconButton } from '@mui/material';
import Table from '../../components/table/Table';

const Registrations = () => {
  useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const { data: registrationData } = await axios.get('http://localhost:5555/registrations');

        // Fetch related student and course data
        const studentPromises = registrationData.data.map((registration) =>
          axios.get(`http://localhost:5555/students/check/${encodeURIComponent(registration.studentId)}`)
        );

        const coursePromises = registrationData.data.flatMap((registration) =>
          registration.courseIds.map((courseId) =>
            axios.get(`http://localhost:5555/courses/${courseId}`)
          )
        );

        const studentResponses = await Promise.all(studentPromises);
        const courseResponses = await Promise.all(coursePromises);

        const studentMap = studentResponses.reduce((map, response) => {
          map[response.data.studentId] = response.data.fullName;
          return map;
        }, {});

        const courseMap = courseResponses.reduce((map, response) => {
          map[response.data._id] = response.data.courseName;
          return map;
        }, {});

        const updatedRegistrations = registrationData.data.map((registration) => ({
          ...registration,
          studentName: studentMap[registration.studentId],
          courseNames: registration.courseIds.map((id) => courseMap[id]).join(', '),
        }));

        setRegistrations(updatedRegistrations);
        setFilteredRegistrations(updatedRegistrations);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        console.log(error);
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  useEffect(() => {
    // Filter registrations based on the search term
    const filtered = registrations.filter((registration) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        registration.studentId.toLowerCase().includes(searchLower) ||
        (registration.studentName && registration.studentName.toLowerCase().includes(searchLower)) ||
        (registration.courseNames && registration.courseNames.toLowerCase().includes(searchLower))
      );
    });
    setFilteredRegistrations(filtered);
  }, [searchTerm, registrations]);

  const handleDeleteRegistration = (id) => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      setLoading(true);
      axios
        .delete(`http://localhost:5555/registrations/${id}`)
        .then(() => {
          setRegistrations(registrations.filter((registration) => registration._id !== id));
          setLoading(false);
          enqueueSnackbar('Registration deleted successfully', { variant: 'success' });
        })
        .catch((error) => {
          setLoading(false);
          enqueueSnackbar('An error occurred while deleting the registration', { variant: 'error' });
          console.log(error);
        });
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', headerAlign: 'center', align: 'center', width: 10 },
    { field: 'studentId', headerName: 'Student ID', headerAlign: 'center', align: 'center', width: 100 },
    { field: 'studentName', headerName: 'Student Name', headerAlign: 'center', align: 'center', width: 300 },
    { field: 'courseNames', headerName: 'Courses', headerAlign: 'center', align: 'center', width: 150 },
    { field: 'discountedFee', headerName: 'Fee', headerAlign: 'center', align: 'center', width: 100 },
    { field: 'paidAmount1', headerName: '1st Payment', headerAlign: 'center', align: 'center', width: 100 },
    { field: 'formattedPaidOn1', headerName: '1st Payment Date', headerAlign: 'center', align: 'center', width: 130 },
    { field: 'paidAmount2', headerName: 'Final Payment', headerAlign: 'center', align: 'center', width: 130 },
    { field: 'approvedBy', headerName: 'Approved By', headerAlign: 'center', align: 'center', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <div>
          <IconButton component={Link} to={`/registrations/view/${params.row._id}`}>
            <BsInfoCircle style={{ color: 'blue' }} />
          </IconButton>
          <IconButton component={Link} to={`/registrations/edit/${params.row._id}`}>
            <AiOutlineEdit style={{ color: 'green' }} />
          </IconButton>
          <IconButton onClick={() => handleDeleteRegistration(params.row._id)}>
            <MdOutlineDelete style={{ color: 'red' }} />
          </IconButton>
        </div>
      ),
    },
  ];

  const rows = filteredRegistrations.map((registration, index) => ({
    id: index + 1,
    studentId: registration.studentId,
    studentName: registration.studentName || 'N/A',
    courseNames: registration.courseNames || 'N/A',
    discountedFee: registration.discountedFee,
    paidAmount1: registration.paidAmount1,
    formattedPaidOn1: new Date(registration.paidOn1).toISOString().split('T')[0],
    paidAmount2: registration.paidAmount2,
    ...registration,
  }));

  const breadcrumbsLinks = [
    { path: '/dashboard', label: 'Home', icon: <FaHome /> },
    { path: '', label: 'Registrations' },
  ];

  return (
    <div>
      <Header />
      <div className='container2'>
        <Breadcrumb links={breadcrumbsLinks} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ margin: '20px', padding: '10px', width: '300px' }}
          />
          <button style={{ marginTop: '20px', padding: '10px 50px' }} onClick={() => navigate('/registrations/add')}>
            <IoAddCircleOutline /> Add Registration
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

export default Registrations;
