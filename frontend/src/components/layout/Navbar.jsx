import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LogOut, Flame, Menu, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { logoutUser } from '../../api';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';

const NavItem = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `block md:inline-block py-2 px-3 rounded-md text-lg md:text-sm font-semibold transition-colors duration-300 ${
        isActive ? 'text-secondar bg-secondary/10' : 'text-dark/70 hover:text-dark hover:bg-gray/20'
      }`
    }
  >
    {children}
  </NavLink>
);

const UserNavLinks = ({ onLinkClick }) => (
    <>
        <NavItem to="/dashboard" onClick={onLinkClick}>Today</NavItem>
        <NavItem to="/logger" onClick={onLinkClick}>Logger</NavItem>
        <NavItem to="/planner" onClick={onLinkClick}>Planner</NavItem>
        <NavItem to="/profile" onClick={onLinkClick}>Profile</NavItem>
    </>
);

const AdminNavLinks = ({ onLinkClick }) => (
    <>
        <NavItem to="/admin" onClick={onLinkClick}>Dashboard</NavItem>
        <NavItem to="/admin/users" onClick={onLinkClick}>Users</NavItem>
    </>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      navigate('/');
    } catch (error) { console.error('Logout failed:', error); }
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="w-full h-20 fixed top-0 left-0 bg-white/80 backdrop-blur-lg shadow-md z-50"
    >
      <div className="h-full container mx-auto px-4 flex justify-between items-center">
        <Link to={isAuthenticated ? (user?.isAdmin ? "/admin" : "/dashboard") : "/"} onClick={closeMenu} className="flex items-center gap-2">
            <Flame className="w-8 h-8 text-danger" />
            <h1 className="text-2xl font-bold text-primary">FitTrack</h1>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
            {isAuthenticated && (user?.isAdmin ? <AdminNavLinks /> : <UserNavLinks />)}
        </nav>
        
        <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated ? <Link to="/login"><Button>Get Started</Button></Link> : (
                 <button onClick={handleLogout} title="Logout" className="flex items-center gap-2 p-2 rounded-full text-sm font-semibold text-danger hover:bg-danger/80 hover:text-gray/80 transition-colors">
                    <LogOut size={18} /> Logout
                 </button>
            )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
      {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-20 left-0 w-full bg-white shadow-lg"
          >
              <nav className="flex flex-col p-4 space-y-2">
                {isAuthenticated ? (
                    user?.isAdmin ? <AdminNavLinks onLinkClick={closeMenu} /> : <UserNavLinks onLinkClick={closeMenu} />
                ) : (
                    <Link to="/login" onClick={closeMenu}><Button className="w-full">Get Started</Button></Link>
                )}
                
                {isAuthenticated && (
                     <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full p-3 rounded-md text-lg font-semibold text-danger bg-danger/10 mt-4">
                        <LogOut size={20} /> Logout
                    </button>
                )}
              </nav>
          </motion.div>
      )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;