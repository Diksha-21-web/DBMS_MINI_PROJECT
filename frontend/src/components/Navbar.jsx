import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Utensils, CalendarCheck, CreditCard } from 'lucide-react';

const Navbar = () => {
  const sidebarStyle = {
    width: '250px',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    backgroundColor: 'var(--bg-card)',
    borderRight: '1px solid var(--border-color)',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  };

  const logoStyle = {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'var(--accent-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const navLinksStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  };

  const getLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    color: isActive ? 'white' : 'var(--text-secondary)',
    backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  });

  return (
    <nav style={sidebarStyle}>
      <div style={logoStyle}>
        <Utensils size={28} />
        Mess Attend
      </div>
      
      <div style={navLinksStyle}>
        <NavLink to="/" style={getLinkStyle}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        
        <NavLink to="/students" style={getLinkStyle}>
          <Users size={20} />
          Students
        </NavLink>

        <NavLink to="/meal-options" style={getLinkStyle}>
          <Utensils size={20} />
          Meal Options
        </NavLink>
        
        <NavLink to="/bookings" style={getLinkStyle}>
          <CalendarCheck size={20} />
          Bookings
        </NavLink>
        
        <NavLink to="/payments" style={getLinkStyle}>
          <CreditCard size={20} />
          Payments
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
