
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // ✅ Password Strength Checker
  const validatePassword = (pwd) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!strongPasswordRegex.test(pwd)) {
      setPasswordError(
        'Password must be at least 8 characters long, include uppercase, lowercase, number & special character'
      );
      return false;
    }

    setPasswordError('');
    return true;
  };

  const validateForm = () => {
    if (!validatePassword(password)) return false;

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }

    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    await register(name, email, password);
    navigate('/login');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mt-5 card-body shadow-sm p-4 bg-white rounded"
      style={{ maxWidth: '400px', margin: 'auto' }}
    >
      <h2 className="text-center text-2xl font-bold text-dark mb-4">
        Create your account
      </h2>

      {error && (
        <div className="alert alert-danger mb-4">
          <p>{error}</p>
          <button className="btn btn-link p-0" onClick={clearError}>
            Dismiss
          </button>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control"
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
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

        {/* Password */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword(e.target.value);
            }}
            className={`form-control ${passwordError ? 'is-invalid' : ''}`}
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-3">
          <label htmlFor="confirm-password" className="form-label">
            Confirm password
          </label>
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`form-control ${passwordError ? 'is-invalid' : ''}`}
          />
          {passwordError && (
            <div className="invalid-feedback">{passwordError}</div>
          )}
        </div>

        {/* Terms */}
        <div className="form-check mb-3">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="form-check-input"
          />
          <label htmlFor="terms" className="form-check-label">
            I agree to the{' '}
            <a href="#" className="text-primary">
              terms and conditions
            </a>
          </label>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-100"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </div>
      </form>

      {/* Sign-in Option */}
      <div className="text-center mt-3">
        <p className="mb-0">
          Already registered?{' '}
          <button
            onClick={() => navigate('/login')}
            className="btn btn-link p-0 text-primary fw-bold"
          >
            Sign in
          </button>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;

