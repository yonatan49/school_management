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

const Students = () => {
  useAuth();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/students')
      .then((response) => {
        setStudents(response.data.data);
        setFilteredStudents(response.data.data); // Initialize filtered data
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        console.log(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Filter students dynamically as search term changes
    const filtered = students.filter((student) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        student.fullName.toLowerCase().includes(searchLower) ||
        student.studentId.toLowerCase().includes(searchLower) ||
        (student.phoneNumber && student.phoneNumber.toLowerCase().includes(searchLower)) ||
        (student.city && student.city.toLowerCase().includes(searchLower)) ||
        (student.subCity && student.subCity.toLowerCase().includes(searchLower))
      );
    });
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const handleDeleteStudent = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setLoading(true);
      axios
        .delete(`http://localhost:5555/students/${id}`)
        .then(() => {
          setStudents(students.filter((student) => student._id !== id));
          enqueueSnackbar('Student deleted successfully', { variant: 'success' });
          setLoading(false);
        })
        .catch((error) => {
          enqueueSnackbar('An error occurred while deleting the student', { variant: 'error' });
          console.log(error);
          setLoading(false);
        });
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', headerAlign: 'center', align: 'center', width: 10 },
    { field: 'studentId', headerName: 'Student ID', headerAlign: 'center', align: 'center', width: 100 },
    {
      field: 'photo',
      headerName: 'Photo',
      headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={params.row.imageUrl}
            alt=""
            style={{ width: '40px', height: '40px', marginRight: '10px', marginBottom: '15px', border: '1px solid' }}
          />
        </div>
      ),
      width: 60,
    },
    { field: 'fullName', headerName: 'Full Name', headerAlign: 'center', width: 250 },
    { field: 'gender', headerName: 'Gender', headerAlign: 'center', align: 'center', width: 100 },
    { field: 'formattedAdmissionDate', headerName: 'Admitted On', headerAlign: 'center', align: 'center', width: 190 },
    { field: 'phoneNumber', headerName: 'Phone Number', headerAlign: 'center', align: 'center', width: 140 },
    { field: 'address', headerName: 'Address', headerAlign: 'center', align: 'center', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <div>
          <IconButton component={Link} to={`/students/view/${params.row._id}`}>
            <BsInfoCircle style={{ color: 'blue' }} />
          </IconButton>
          <IconButton component={Link} to={`/students/edit/${params.row._id}`}>
            <AiOutlineEdit style={{ color: 'green' }} />
          </IconButton>
          <IconButton onClick={() => handleDeleteStudent(params.row._id)}>
            <MdOutlineDelete style={{ color: 'red' }} />
          </IconButton>
        </div>
      ),
    },
  ];

  const rows = filteredStudents.map((student, index) => ({
    id: index + 1,
    fullName: student.fullName,
    imageUrl: student.imageURL || 'https://cdn0.iconfinder.com/data/icons/multimedia-solid-30px/30/user_account_profile-512.png',
    address: `${student.city}, ${student.subCity}, Wor. ${student.wereda}`,
    formattedAdmissionDate: new Date(student.admissionDate).toISOString().split('T')[0],
    ...student,
  }));

  const breadcrumbsLinks = [
    { path: '/dashboard', label: 'Home', icon: <FaHome /> },
    { path: '', label: 'Students' },
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
          <button style={{ marginTop: '20px', padding: '10px 50px' }} onClick={() => navigate('/students/add')}>
            <IoAddCircleOutline /> Add Student
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

export default Students;
