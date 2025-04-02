import React from 'react'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

const Breadcrumb = ({ links }) => {
  const navigate = useNavigate();

  return (
    <div className='breadcrumbs'>
        <Breadcrumbs aria-label='breadcrumbs'>
        {links.map((link, index) => {
          if (index === links.length - 1) {
            return (
              <Typography key={index} color='#f18'>
                {link.label}
              </Typography>
            );
          }
          return (
            <Link
              key={index}
              underline='hover'
              color='inherit'
              onClick={() => navigate(link.path)}
              style={{ cursor: 'pointer' }}
            >
              {link.icon} {link.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </div>
  )
}

export default Breadcrumb