import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mt-5 card-body shadow-sm p-4 bg-white rounded"
      style={{ maxWidth: '400px', margin: 'auto' }} 
      // className="container mt-5"
    >
      <h2 className="text-center mb-4">Sign in to your account</h2>

      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
          <span>{error}</span>
          <button 
            type="button" 
            className="btn btn-sm btn-outline-light ms-3"
            onClick={clearError}
          >
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="mb-3 d-flex justify-content-between align-items-center">
          <div className="form-check">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="form-check-input"
            />
            <label htmlFor="remember-me" className="form-check-label">
              Remember me
            </label>
          </div>

          <div className="text-end">
            <a href="#" className="text-decoration-none">
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-100"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default Login;
