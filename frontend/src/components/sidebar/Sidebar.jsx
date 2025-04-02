import React, { useState } from 'react';
import './Sidebar.css'
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { IoPeople } from "react-icons/io5";
import { BsListStars } from "react-icons/bs";
import { FiPackage } from "react-icons/fi";
import { RxActivityLog } from "react-icons/rx";
import { MdAppRegistration, MdLogout } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { FaBars, FaUsers } from "react-icons/fa";
import logo from '../../assets/jordanLogo.png';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'

const Sidebar = ({ children }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/');
  }

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const goTo = [
    {
        path: '/dashboard',
        name: 'Dashboard',
        icon: <RiDashboardHorizontalFill />
    },
    {
        path: '/clients',
        name: 'Clients',
        icon: <IoPeople />
    }
  ];
  const academics = [
    {
        path: '/students',
        name: 'Students',
        icon: <PiStudent />
    },
    {
        path: '/registrations',
        name: 'Registrations',
        icon: <MdAppRegistration />
    },
    {
        path: '/courses',
        name: 'Courses',
        icon: <BsListStars />
    },
    // {
    //     path: '/packages',
    //     name: 'Packages',
    //     icon: <FiPackage />
    // },
    // {
    //     path: '/performances',
    //     name: 'Performances',
    //     icon: <RxActivityLog />
    // },
    
  ];
  const users = [
    // {
    //     path: '/users',
    //     name: 'Users',
    //     icon: <FaUsers />
    // }
  ];

  return (
    <div className='container1'>
        <div className="sidebar" style={{width: isOpen ? '200px' : '50px', paddingLeft: isOpen ? '10px' : '0px'}}>
            <div className="top-section">
                <h1 className="logo" style={{display: isOpen ? 'block' : 'none', margin: isOpen ? '-30px -30px -10px' : '0px' }}><img src={logo} alt="jordan beauty academy" /></h1>
                <div className="bars" style={{marginLeft: isOpen ? '60px' : '-8px', marginTop: isOpen ? '15px' : '20px', marginBottom: isOpen ? '0' : '100px'}} ><FaBars onClick={toggle} /></div>
            </div>
            <div>
                <p style={{display: isOpen ? 'block' : 'none'}}>Go to</p>
                {
                    goTo.map((item, index) => (
                        <NavLink to={item.path} key={index} className='link' activeclassName='active'>
                            <div className="icon" style={{fontSize: isOpen ? '20px' : '25px', marginLeft: isOpen ? '0px' : '-3px', paddingTop: '5px'}}>{item.icon}</div>
                            <div className="link-text" style={{display: isOpen ? 'block' : 'none'}}>{item.name}</div>
                        </NavLink>
                    ))
                }
            </div>
            <div>
                <p style={{display: isOpen ? 'block' : 'none'}}>Academics</p>
                {
                    academics.map((item, index) => (
                        <NavLink to={item.path} key={index} className='link' activeclassName='active'>
                            <div className="icon" style={{fontSize: isOpen ? '20px' : '25px', marginLeft: isOpen ? '0px' : '-3px', paddingTop: '5px'}}>{item.icon}</div>
                            <div className="link-text" style={{display: isOpen ? 'block' : 'none'}}>{item.name}</div>
                        </NavLink>
                    ))
                }
            </div>
            {/* <div>
                <p style={{display: isOpen ? 'block' : 'none'}}>Users</p>
                {
                    users.map((item, index) => (
                        <NavLink to={item.path} key={index} className='link' activeclassName='active'>
                            <div className="icon" style={{fontSize: isOpen ? '20px' : '25px', marginLeft: isOpen ? '0px' : '-3px', paddingTop: '5px'}}>{item.icon}</div>
                            <div className="link-text" style={{display: isOpen ? 'block' : 'none'}}>{item.name}</div>
                        </NavLink>
                    ))
                }
            </div> */}
            <div style={{display: isOpen ? 'block' : 'none'}}>
                <p>Action</p>
                <button onClick={handleSignOut} style={{ background: '#f00'}}>Signout <MdLogout  /></button>
            </div>
        </div>
        <main className='main-content' style={{ marginLeft: isOpen ? '200px' : '50px' }}>{children}</main>
    </div>
  )
}

export default Sidebar