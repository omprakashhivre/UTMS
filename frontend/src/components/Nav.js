import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navigation() {
  const navigate = useNavigate();

//   const navigate = (path) => {
//     history.push(path);
//   };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <header>
      <nav>
        <div className="topnav">
          <a onClick={() => navigate('/tasks')}>Tasks</a>
          <a onClick={() => navigate('/users')}>USERS</a>
          <a style={{float:"right"}} onClick={handleLogout}>LOGOUT</a>
        </div>
      </nav>
    </header>
  );
}

export default Navigation;
