import React, { useState, useEffect, useRef } from 'react';
import logo from '../../assets/J.png';
import { TbUserSquareRounded } from "react-icons/tb";
import { getEmailFromToken } from '../../utils/authUtils';
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const email = getEmailFromToken();
  const dropdownRef = useRef(null);
  const iconRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/');
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        iconRef.current &&
        !iconRef.current.contains(event.target)
      ) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <header style={{
        display: 'flex', 
        background: '#000', 
        justifyContent: 'space-between', 
        color: '#fff', 
        boxShadow: '0 5px 4px 0 rgba(0,0,0,.2)',
        alignItems: 'center'
      }}>
        <div></div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="jba" style={{ width: '40px', height: '40px', marginRight: '20px' }} />
          <p style={{ fontSize: '20px' }}>
            <span style={{ color: '#ff0' }}>JORDAN </span>Beauty Academy
          </p>
        </div>
        <div 
          ref={iconRef} 
          onClick={toggleDropdown} 
          style={{ display: 'flex', fontSize: '40px', margin: '10px', cursor: 'pointer' }}
        >
          <TbUserSquareRounded />
        </div>
      </header>

      {isDropdownVisible && (
        <div 
          ref={dropdownRef}
          style={{
            position: 'absolute',
            right: '10px',
            background: '#fff', 
            color: '#000',
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
          }}
        >
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              {email ? <p>Logged in as: {email}</p> : <p>Not logged in</p>}
            </li>
            <li>
              <a onClick={handleSignOut} style={{ color: '#007BFF', textDecoration: 'none' }}>Log out</a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Header;
