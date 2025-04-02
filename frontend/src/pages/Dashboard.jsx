import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import Header from '../components/header/Header';
import Breadcrumb from '../components/breadcrumbs/Breadcrumbs';
import { FaHome } from 'react-icons/fa';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { MdOutlineArrowDropDown } from "react-icons/md";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from 'recharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const styles = {
  paper: { padding: '16px', marginBottom: '16px' },
  chartContainer: { width: '100%', height: 300 },
  progressContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' },
  tableContainer: { marginTop: '20px' },
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalRegistrations: 0,
    genderDistribution: [],
    popularCourses: [],
    recentRegistrations: [],
    registrationTrends: [],
    courseStudentData: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const studentResponse = await axios.get('http://localhost:5555/students');
        const totalStudents = studentResponse.data.count;
        const students = studentResponse.data.data;

        const courseResponse = await axios.get('http://localhost:5555/courses');
        const courses = courseResponse.data.data;
        const totalCourses = courseResponse.data.count;

        const registrationResponse = await axios.get('http://localhost:5555/registrations');
        const registrations = registrationResponse.data.data;
        const totalRegistrations = registrationResponse.data.count;

        const courseStudentData = [];

        for (const course of courses) {
          const registeredStudents = [];

          registrationResponse.data.data.forEach(reg => {
            if (reg.courseIds.includes(course._id)) {
              // Find the student based on reg.studentId
              const student = studentResponse.data.data.find(student => student._id === reg.studentId);

              // If the student exists, push it into the registered students list
              if (student) {
                registeredStudents.push({
                  fullName: student.fullName || "Unknown Student", // Make sure you use fullName here
                  admissionDate: reg.admissionDate ? new Date(reg.admissionDate) : "Invalid Date", // Use the admissionDate from registration
                });
              }
            }
          });

          // Sort registered students by admissionDate (recent first)
          registeredStudents.sort((a, b) => new Date(b.admissionDate) - new Date(a.admissionDate));

          // Push data into courseStudentData
          courseStudentData.push({
            courseName: course.courseName,
            students: registeredStudents,
            totalStudents: registeredStudents.length,
          });
        }
        const genderDistribution = [
          { name: 'Male', value: students.filter(student => student.gender === 'Male').length },
          { name: 'Female', value: students.filter(student => student.gender === 'Female').length },
        ];

        const popularCourses = courses.map(course => ({
          name: course.courseName,
          registrations: registrations.filter(reg => reg.courseIds.includes(course._id)).length,
        }));

        const registrationTrends = registrations.reduce((trends, reg) => {
          const date = new Date(reg.date).toLocaleDateString();
          const trend = trends.find(t => t.date === date);
          if (trend) {
            trend.count += 1;
          } else {
            trends.push({ date, count: 1 });
          }
          return trends;
        }, []);

        setDashboardData({
          totalStudents,
          totalCourses,
          totalRegistrations,
          genderDistribution,
          popularCourses,
          recentRegistrations: registrations.slice(0, 5),
          registrationTrends,
          courseStudentData,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={styles.progressContainer}>
        <CircularProgress />
      </Box>
    );
  }

  const breadcrumbsLinks = [
    { path: '/dashboard', label: 'Home', icon: <FaHome /> },
    { path: '', label: 'Dashboard' },
  ];

  return (
    <div>
      <Header />
      <div className="container2">
        <Breadcrumb links={breadcrumbsLinks} />
        <Box sx={{ padding: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <a onClick={() => navigate('/students')} style={{ cursor: 'pointer' }}>
                <Paper sx={styles.paper}>
                  <Typography variant="h6">Total Students</Typography>
                  <Typography variant="h4">{dashboardData.totalStudents}</Typography>
                </Paper>
              </a>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <a onClick={() => navigate('/courses')} style={{ cursor: 'pointer' }}>
                <Paper sx={styles.paper}>
                  <Typography variant="h6">Total Courses</Typography>
                  <Typography variant="h4">{dashboardData.totalCourses}</Typography>
                </Paper>
              </a>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <a onClick={() => navigate('/registrations')} style={{ cursor: 'pointer' }}>
                <Paper sx={styles.paper}>
                  <Typography variant="h6">Total Registrations</Typography>
                  <Typography variant="h4">{dashboardData.totalRegistrations}</Typography>
                </Paper>
              </a>
            </Grid>
          </Grid>

          <Divider sx={{ marginY: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper sx={styles.paper}>
                <Typography variant="h6">Gender Distribution</Typography>
                <PieChart width={400} height={300}>
                  <Pie
                    data={dashboardData.genderDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                  >
                    {dashboardData.genderDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={styles.paper}>
                <Typography variant="h6">Popular Courses</Typography>
                <BarChart
                  width={500}
                  height={300}
                  data={dashboardData.popularCourses}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="registrations" fill="#8884d8" />
                </BarChart>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ marginY: 2 }} />

          {dashboardData.courseStudentData.map((courseData, index) => (
            <Box key={index} sx={styles.tableContainer}>
              <Accordion>
                <AccordionSummary expandIcon={<MdOutlineArrowDropDown />}>
                  <Typography variant="h6">
                    Students Registered for {courseData.courseName} (Total: {courseData.totalStudents})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Student Name</TableCell>
                          <TableCell>Admission Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {courseData.students.map((student, idx) => {
                          // Format the admissionDate or show N/A if it's invalid
                          const formattedDate = isNaN(new Date(student.admissionDate).getTime())
                            ? 'N/A'
                            : new Date(student.admissionDate).toISOString().split('T')[0];

                          return (
                            <TableRow key={idx}>
                              <TableCell>{student.fullName || 'N/A'}</TableCell>
                              <TableCell>{formattedDate}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>

                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            </Box>
          ))}
        </Box>
      </div>
    </div>
  );
};

export default Dashboard;
