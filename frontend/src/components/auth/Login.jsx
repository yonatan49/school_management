import React, { useState } from 'react'
import axios from 'axios';
import { IoIosLock } from 'react-icons/io'
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { useSnackbar } from 'notistack'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const validate = () => {
        let isValid = true;
        if (!email) {
            setEmailError('Email is required');
            isValid = false;
        } else {
            setEmailError('');
        }

        if (!password) {
            setPasswordError('Password is required');
            isValid = false;
        } else {
            setPasswordError('');
        }
        return isValid;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validate()) return;

        setIsSigningIn(true);

        try {
            const response = await axios.post('http://localhost:5555/auth/login', {
                email,
                password,
            });

            const { token } = response.data;

            localStorage.setItem('token', token);
            enqueueSnackbar('Successful login.', { variant: 'success' });
            navigate('/dashboard');

        } catch (error) {
            console.error(error)
            setError(error.response?.data?.error || 'Login failed. Please try again.');
            enqueueSnackbar('An error occured. Please try again.', { variant: 'error' });
        } finally {
            setIsSigningIn(false);
        }
    };

    return (
        <div>
            <div className="container">
                <div className="login-container">
                    <div className="top">
                        <IoIosLock className='lock-icon' />
                        <div>
                            <h1>Sign in to JORDAN ACADEMY</h1>
                            <h3>Please enter your credentials</h3>
                        </div>
                    </div>
                    <form onSubmit={onSubmit}>
                        <div style={{ margin: '10px 0', width: '100%' }}>
                            <input
                                type='email'
                                placeholder='Enter Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {emailError && <p style={{ color: '#f00', marginTop: '-8px', fontSize: '13px', marginLeft: '10px' }}>{emailError}</p>}
                        </div>
                        <div style={{ margin: '10px 0', width: '100%' }}>
                            <input
                                type='password'
                                placeholder='Enter Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {passwordError && <p style={{ color: '#f00', marginTop: '-8px', fontSize: '13px', marginLeft: '10px' }}>{passwordError}</p>}
                        </div>
                        {error && <p className='error'>{error}</p>}
                        <button type='submit' disabled={isSigningIn}>
                            {isSigningIn ? <CircularProgress size={24} /> : 'Login'}
                        </button>
                    </form>
                    <p><a onClick={() => navigate('/signup')}>Create an account</a></p>
                </div>
            </div>
        </div>
    )
}

export default Login