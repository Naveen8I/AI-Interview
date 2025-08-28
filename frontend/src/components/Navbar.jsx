import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <Link className="navbar-brand" to={isAuthenticated ? "/chat" : "/"}>
        ChatNotes
      </Link>
      <div className="ms-auto">
        {isAuthenticated ? (
          <button 
            className="btn btn-danger" 
            onClick={handleLogout}
            disabled={isLoggingOut}
            aria-label="Logout"
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        ) : (
          <>
            <Link className="btn btn-outline-primary me-2" to="/login">
              Login
            </Link>
            <Link className="btn btn-primary" to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;