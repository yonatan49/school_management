import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import { useSnackbar } from 'notistack'

const Signup = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('user');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [fullNameError, setFullNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const validate = () => {
        let isValid = true;

        if (!fullName) {
            setFullNameError('Full Name is required');
            isValid = false;
        } else {
            setFullNameError('');
        }

        if (!email) {
            setEmailError('Email is required');
            isValid = false;
        } else {
            setEmailError('');
        }

        if (!password) {
            setPasswordError('Password is required');
            isValid = false;
        } else if (password.length < 8 || password.length > 20 || /\s/.test(password)) {
            setPasswordError('Password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.');
            isValid = false;
        } else {
            setPasswordError('');
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            isValid = false;
        } else {
            setConfirmPasswordError('');
        }

        return isValid;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validate()) return;
        setIsSubmitting(true);

        try {
            await axios.post('http://localhost:5555/auth/signup', {
                username: fullName,
                email,
                role,
                password,
              });
            enqueueSnackbar('User created successfully. Awaiting admin approval.', { variant: 'success' });
            navigate('/login');
        } catch (error) {
            setError(error.response?.data?.error || 'Signup failed. Please try again.');
            enqueueSnackbar('An error occured. Please try again.', { variant: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className='container'>
            <div className="signup-container">
                <div className="top">
                    <h1>Create an account</h1>
                    <h3>Note: Registrations only for authorized members will be approved.</h3>
                </div>
                <hr />
                <form onSubmit={onSubmit}>
                    <div className='form-row'>
                        <label className='input-label'>
                            Full Name
                            <input
                                className='input-field'
                                type='text'
                                name='fullName'
                                placeholder='Full Name'
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                            {fullNameError && <p style={{ color: '#f00', fontSize: '13px', marginLeft: '10px' }}>{fullNameError}</p>}
                        </label>
                        <label className='input-label'>
                            Email Address
                            <input
                                className='input-field'
                                type='email'
                                name='email'
                                placeholder='Personal Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {emailError && <p style={{ color: '#f00', fontSize: '13px', marginLeft: '10px' }}>{emailError}</p>}
                        </label>
                    </div>
                    <div className='form-row'>
                        <label className='input-label'>
                            Role
                            <select
                                className='input-field'
                                name='role'
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value='user'>User</option>
                                <option value='admin'>Admin</option>
                            </select>
                        </label>
                        <label className='input-label'>
                            Password
                            <input
                                className='input-field'
                                type='password'
                                name='password'
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {passwordError && <p style={{ color: '#f00', fontSize: '13px', marginLeft: '10px' }}>{passwordError}</p>}
                        </label>
                        <label className='input-label'>
                            Confirm Password
                            <input
                                className='input-field'
                                type='password'
                                name='confirmPassword'
                                placeholder='Confirm Password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {confirmPasswordError && <p style={{ color: '#f00', fontSize: '13px', marginLeft: '10px' }}>{confirmPasswordError}</p>}
                        </label>
                    </div>
                    <p>Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.</p>
                    {error && <p className='error'>{error}</p>}
                    <button type='submit' disabled={isSubmitting}>
                        {isSubmitting ? <CircularProgress size={24} /> : 'Sign up'}
                    </button>
                </form>
                <p><a onClick={() => navigate('/login')}>Log in to your account</a></p>
            </div>
        </div>
    )
}

export default Signup