import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import LogOutBtn from './LogoutBtn';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/homepage" className="navbar-logo">Chao-DoI</Link>
        <ul className="navbar-menu">
          <li><Link to="/homepage">หน้าหลัก</Link></li>
          <li><Link to="/alldatatrade">ประวัติการซื้อขาย</Link></li>
          <li><Link to="/profile">โปรไฟล์</Link></li>
        </ul>
        <div className="logout">
          <LogOutBtn />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
