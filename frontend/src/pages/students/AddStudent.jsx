import React, { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/header/Header'
import Breadcrumb from '../../components/breadcrumbs/Breadcrumbs'
import { FaHome } from 'react-icons/fa'
import { CircularProgress } from '@mui/material'
import { IoIosSend } from 'react-icons/io'
import { useSnackbar } from 'notistack'
import { Cloudinary } from 'cloudinary-core';

const AddStudent = () => {
    useAuth();
    const [file, setFile] = useState(null);
    const [studentId, setStudentId] = useState('');
    const [fullName, setFullName] = useState('');
    const [gender, setGender] = useState('Female');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [age, setAge] = useState('');
    const [education, setEducation] = useState('8th complete');
    const [admissionDate, setAdmissionDate] = useState('');
    const [guardianPhoneNumber, setGuardianPhoneNumber] = useState('');
    const [nationality, setNationality] = useState('Ethiopian');
    const [maritalStatus, setMaritalStatus] = useState('Unmarried');
    const [disability, setDisability] = useState('No');
    const [employment, setEmployment] = useState('Unemployed');
    const [city, setCity] = useState('Addis Ababa');
    const [subCity, setSubCity] = useState('Bole');
    const [wereda, setWereda] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [studentIdError, setStudentIdError] = useState('');
    const [fullNameError, setFullNameError] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [ageError, setAgeError] = useState('');
    const [guardianPhoneNumberError, setGuardianPhoneNumberError] = useState('');
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const cloudinary = new Cloudinary({ cloud_name: 'dnmr0997v', secure: true });

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'student_uploads');
    
        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/dnmr0997v/image/upload`,
                formData
            );
            console.log('Upload response:', response.data);
            return response.data.secure_url;
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    };

    const validate = () => {
        let isValid = true;

        if (!studentId) {
            setStudentIdError('Student ID is required');
            isValid = false;
        } else {
            setStudentIdError('');
        }

        if (!fullName) {
            setFullNameError('Full name is required');
            isValid = false;
        } else {
            setFullNameError('');
        }

        if (!phoneNumber) {
            setPhoneNumberError('Phone number is required');
            isValid = false;
        } else if (!/^(09|07)\d{8}$/.test(phoneNumber)) {
            setPhoneNumberError('Enter a valid phone number (start with 09- or 07-)');
            isValid = false;
        } else {
            setPhoneNumberError('');
        }

        if (!age) {
            setAgeError('Age is required');
            isValid = false;
        } else if (age <= 0) {
            setAgeError('Enter a number greater than 0');
            isValid = false;
        } else {
            setAgeError('');
        }

        if (!guardianPhoneNumber) {
            setGuardianPhoneNumberError('Guardian phone number is required');
            isValid = false;
        } else if (!/^(09|07)\d{8}$/.test(guardianPhoneNumber)) {
            setGuardianPhoneNumberError('Enter a valid phone number (start with 09- or 07-)');
            isValid = false;
        } else {
            setGuardianPhoneNumberError('');
        }

        return isValid;
    }

    const handleAddStudent = async (e) => {
        e.preventDefault();
        setError('');
    
        if (!validate()) return;
        setIsSaving(true);

        try {
            const encodedStudentId = encodeURIComponent(studentId);
            const response = await axios.get(`http://localhost:5555/students/check/${encodedStudentId}`);
            if (response.status === 200) {
                setIsSaving(false);
                enqueueSnackbar('Student with this ID already exists', { variant: 'error' });
                return;
            }
        } catch (error) {
            if (error.response && error.response.status !== 404) {
                setIsSaving(false);
                enqueueSnackbar('An error occurred while checking the student ID', { variant: 'error' });
                console.log(error);
                return;
            } 
        }
    
        let imageURL = '';
    
        if (file) {
            imageURL = await uploadImage(file);
            console.log('Image URL:', imageURL);
            if (!imageURL) {
                setIsSaving(false);
                enqueueSnackbar('Failed to upload image', { variant: 'error' });
                return;
            }
        }
    
        const data = {
            imageURL,
            studentId,
            fullName,
            gender,
            phoneNumber,
            age,
            education,
            admissionDate,
            guardianPhoneNumber,
            nationality,
            maritalStatus,
            disability,
            employment,
            city,
            subCity,
            wereda
        };
    
        axios
            .post('http://localhost:5555/students', data)
            .then(() => {
                setIsSaving(false);
                enqueueSnackbar('New student added successfully', { variant: 'success' });
                navigate('/students');
            })
            .catch((error) => {
                setIsSaving(false);
                enqueueSnackbar('An error occurred while adding new student', { variant: 'error' });
                console.log(error);
            });
    };
    


    const breadcrumbLinks = [
        { path: '/dashboard', label: 'Home', icon: <FaHome /> },
        { path: '/students', label: 'Students' },
        { path: '', label: 'Add Student' }
    ];

    return (
        <div>
            <Header />
            <div className="container2">
                <Breadcrumb links={breadcrumbLinks} />
                <div className="form-container">
                    <div className="cont">
                        <h3>Student Details</h3>
                        <hr />
                        <form onSubmit={handleAddStudent}>
                            <div className="form-row">
                                <img
                                    src={
                                        file ? URL.createObjectURL(file) : 'https://cdn0.iconfinder.com/data/icons/multimedia-solid-30px/30/user_account_profile-512.png'
                                    }
                                    alt=""
                                    style={{ width: '100px', height: '100px', border: '2px double', marginRight: '50px' }}
                                />
                                <label className='input-label'>
                                    Upload Image
                                    <input
                                        className='input-field'
                                        type='file'
                                        name='file'
                                        accept='image/*'
                                        onChange={(e) => {
                                            setFile(e.target.files[0]);
                                            console.log('Selected file:', e.target.files[0]);
                                        }}
                                    />

                                </label>
                            </div>
                            <div className="form-row">
                                <label className='input-label'>
                                    Student ID
                                    <input
                                        className='input-field'
                                        type='text'
                                        name='studentId'
                                        placeholder='Student ID'
                                        value={studentId}
                                        onChange={(e) => setStudentId(e.target.value)}
                                    />
                                    {studentIdError && <p style={{ color: '#f00', fontSize: '13px', marginLeft: '10px', fontWeight: '400' }}>{studentIdError}</p>}
                                </label>
                                <label className='input-label'>
                                    Full Name
                                    <input
                                        className='input-field'
                                        type='text'
                                        name='fullName'
                                        placeholder='Name Father GrandFather'
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                    {fullNameError && <p style={{ color: '#f00', fontSize: '13px', marginLeft: '10px', fontWeight: '400' }}>{fullNameError}</p>}
                                </label>
                                <label className='input-label'>
                                    Gender
                                    <select
                                        className='input-field'
                                        name='gender'
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                    >
                                        <option value='Female'>Female</option>
                                        <option value='Male'>Male</option>
                                    </select>
                                </label>
                            </div>
                            <div className="form-row">
                                <label className='input-label'>
                                    Phone Number
                                    <input
                                        className='input-field'
                                        type='text'
                                        name='phoneNumber'
                                        placeholder='Phone Number (start with 09- or 07-)'
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                    {phoneNumberError && <p style={{ color: '#f00', fontSize: '13px', marginLeft: '10px', fontWeight: '400' }}>{phoneNumberError}</p>}
                                </label>
                                <label className='input-label'>
                                    Age
                                    <input
                                        className='input-field'
                                        type='number'
                                        name='age'
                                        placeholder='Age'
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                    />
                                    {ageError && <p style={{ color: '#f00', fontSize: '13px', marginLeft: '10px', fontWeight: '400' }}>{ageError}</p>}
                                </label>
                                <label className='input-label'>
                                    Education
                                    <select
                                        className='input-field'
                                        name='education'
                                        value={education}
                                        onChange={(e) => setEducation(e.target.value)}
                                    >
                                        <option value='8th complete'>8th complete</option>
                                        <option value='10th complete'>10th complete</option>
                                        <option value='12th complete'>12th complete</option>
                                        <option value='Diploma'>Diploma</option>
                                        <option value='Degree'>Degree</option>
                                        <option value='Masters'>Master's Degree</option>
                                    </select>
                                </label>
                                <label className='input-label'>
                                    Guardian Phone Number
                                    <input
                                        className='input-field'
                                        type='text'
                                        name='phoneNumber'
                                        placeholder='Guardian Phone Number (start with 09- or 07-)'
                                        value={guardianPhoneNumber}
                                        onChange={(e) => setGuardianPhoneNumber(e.target.value)}
                                    />
                                    {guardianPhoneNumberError && <p style={{ color: '#f00', fontSize: '13px', marginLeft: '10px', fontWeight: '400' }}>{guardianPhoneNumberError}</p>}
                                </label>
                            </div>
                            <div className="form-row">
                                <label className='input-label'>
                                    Admission Date
                                    <input
                                        className='input-field'
                                        type='date'
                                        name='admissionDate'
                                        placeholder='Admitted on'
                                        value={admissionDate}
                                        onChange={(e) => setAdmissionDate(e.target.value)}
                                    />
                                </label>
                                <label className='input-label'>
                                    Nationality
                                    <select
                                        className='input-field'
                                        name='nationality'
                                        value={nationality}
                                        onChange={(e) => setNationality(e.target.value)}
                                    >
                                        <option value='Ethiopian'>Ethiopian</option>
                                        <option value='Foreigner'>Foreigner</option>
                                    </select>
                                </label>
                                <label className='input-label'>
                                    Marital Status
                                    <select
                                        className='input-field'
                                        name='maritalStatus'
                                        value={maritalStatus}
                                        onChange={(e) => setMaritalStatus(e.target.value)}
                                    >
                                        <option value='Unmarried'>Unmarried</option>
                                        <option value='Married'>Married</option>
                                    </select>
                                </label>
                                <label className='input-label'>
                                    Disability
                                    <select
                                        className='input-field'
                                        name='disability'
                                        value={disability}
                                        onChange={(e) => setDisability(e.target.value)}
                                    >
                                        <option value='No'>No</option>
                                        <option value='Yes'>Yes</option>
                                    </select>
                                </label>
                            </div>
                            <div className="form-row">
                                <label className='input-label'>
                                    Employment
                                    <select
                                        className='input-field'
                                        name='employed'
                                        value={employment}
                                        onChange={(e) => setEmployment(e.target.value)}
                                    >
                                        <option value='Unemployed'>Unemployed</option>
                                        <option value='Employed'>Employed</option>
                                    </select>
                                </label>
                                <label className='input-label'>
                                    City
                                    <select
                                        className='input-field'
                                        name='city'
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    >
                                        <option value='Addis Ababa'>Addis Ababa</option>
                                        <option value='Other'>Other</option>
                                    </select>
                                </label>
                                <label className='input-label'>
                                    Sub City
                                    <select
                                        className='input-field'
                                        name='subCity'
                                        value={subCity}
                                        onChange={(e) => { setSubCity(e.target.value) }}
                                    >
                                        <option value='Bole'>Bole</option>
                                        <option value='Lemi Kura'>Lemi Kura</option>
                                        <option value='Koye'>Koye</option>
                                        <option value='Yeka'>Yeka</option>
                                        <option value='Gelan'>Gelan</option>
                                        <option value='Akaki Kality'>Akaki Kality</option>
                                        <option value='Kotebe'>Kotebe</option>
                                        <option value='Nefas Silk'>Nefas Silk</option>
                                        <option value='Kirkos'>Kirkos</option>
                                        <option value='Arada'>Arada</option>
                                        <option value='Adis Ketema'>Adis Ketema</option>
                                        <option value='Tafo'>Tafo</option>
                                        <option value='Gulele'>Gulele</option>
                                        <option value='Kolfe'>Kolfe</option>
                                        <option value='Asco'>Asco</option>
                                        <option value='Burayu'>Burayu</option>
                                        <option value='Gofa'>Gofa</option>
                                        <option value='Lideta'>Lideta</option>
                                        <option value='Sheger City'>Sheger City</option>
                                        <option value='Sebeta'>Sebeta</option>
                                        <option value='Kara'>Kara</option>
                                        <option value='Other'>Other</option>
                                    </select>
                                </label>
                                <label className='input-label'>
                                    Wereda
                                    <input
                                        className='input-field'
                                        type='text'
                                        name='woreda'
                                        placeholder='Woreda'
                                        value={wereda}
                                        onChange={(e) => setWereda(e.target.value)}
                                    />
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

export default AddStudent