import React from 'react';
import logo from '../assets/jordanLogo.png';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate(); 

  return (
    <div className='home'>
      <div className='container'>
        <img src={logo} alt="Jordan logo" style={{ width: '300px' }} />
        <h1>Welcome to JORDAN BEAUTY ACADEMY</h1>
        <p>We are the #1 training center for Makeup, Eyelash, Nail, etc in Ethiopia. The trainings are offered by professionals with highly trained and having long time experience in the beautification industry. Jordan Beauty Academy is a member of the American Professional Beauty Association (PBA)</p>
        <div style={{ display: 'flex' }}>
          <button onClick={() => navigate('/login')}>Sign in</button>
          <button onClick={() => navigate('/signup')}>Create an account</button>
        </div>
      </div>
    </div>
  );
};

export default Home;