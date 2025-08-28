import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCog, Check, ArrowRight, Github as GitHub, UserPlus } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';

const Landing = () => {
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
    <div className="min-vh-100 bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Header */}
      <header className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-3">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <BrainCog className="me-2 text-primary" />
            <span className="h5 fw-bold mb-0">InterviewAI</span>
          </div>
          <div>
            {isAuthenticated ? (
              <>
                <Link to="/chat" className="btn btn-outline-primary me-2">Chat</Link>
                <Link to="/dashboard" className="btn btn-outline-primary me-2">Dashboard</Link>
                <Link to="/history" className="btn btn-outline-primary me-2">📜 History</Link>
                <button 
                  className="btn btn-outline-primary me-2" 
                  onClick={handleLogout} 
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary me-2">Sign In</Link>
                <Link to="/register" className="btn btn-primary">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <main>
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-md-6">
              <motion.h1 
                className="display-4 font-weight-bold text-dark"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="d-block">Ace your next</span>
                <span className="d-block text-primary">tech interview</span>
              </motion.h1>
              <motion.p 
                className="mt-4 text-lg text-muted"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Practice with our AI-powered interview simulator. Get real-time feedback, track your progress, and build confidence for your next job opportunity.
              </motion.p>
              <motion.div 
                className="mt-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link
                  to={isAuthenticated ? "/interview" : "/register"}
                  className="btn btn-primary btn-lg me-3"
                >
                  Start practicing
                  <ArrowRight className="ms-2" />
                </Link>
                <a
                  href="#features"
                  className="btn btn-outline-primary btn-lg"
                >
                  Learn more
                </a>
              </motion.div>
            </div>
            <div className="col-md-6 mt-5 mt-md-0">
              <motion.div 
                className="bg-light p-4 rounded-3 shadow-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <img 
                  src="https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Interview preparation" 
                  className="img-fluid rounded-lg" 
                />
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div id="features" className="py-5 bg-white">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="h3 fw-bold text-dark">Prepare smarter, not harder</h2>
              <p className="mt-4 text-muted">
                Our AI-powered platform helps you prepare for technical and behavioral interviews with personalized feedback.
              </p>
            </div>
            
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  className="col"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="card shadow-sm h-100">
                    <div className="card-body position-relative">
                      <div className="position-absolute top-0 end-0 p-3 bg-primary rounded-circle">
                        <feature.icon className="text-white" />
                      </div>
                      <h5 className="card-title">{feature.title}</h5>
                      <p className="card-text text-muted">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Testimonials Section */}
        <div className="py-5 bg-light">
          <div className="container">
            <h2 className="h3 text-center text-dark mb-5">What our users are saying</h2>
            <div className="row g-4">
              {testimonials.map((testimonial, index) => (
                <motion.div 
                  key={index}
                  className="col-md-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-4">
                        <div className="rounded-circle bg-primary p-2">
                          <UserPlus className="text-white" />
                        </div>
                        <div className="ms-3">
                          <h5 className="mb-0">{testimonial.name}</h5>
                          <p className="text-muted">{testimonial.role}</p>
                        </div>
                      </div>
                      <p className="text-muted">{testimonial.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Call to Action Section */}
        <div className="py-5 bg-primary text-white">
          <div className="container text-center">
            <h2 className="h3 fw-bold">Ready to ace your next interview?</h2>
            <p className="mt-3">Join thousands of job seekers who've improved their interview skills with InterviewAI.</p>
            <div className="mt-4">
              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="btn btn-light btn-lg"
              >
                Get started for free
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <BrainCog className="me-2 text-white" />
            <span className="h5 fw-bold mb-0">InterviewAI</span>
          </div>
          <div>
            <a href="#" className="text-white me-3">
              <GitHub className="h5" />
            </a>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="mb-0 text-muted">© 2025 InterviewAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Features Data
const features = [
  {
    title: 'AI-Powered Mock Interviews',
    description: 'Practice with our realistic AI interviewer that adapts to your responses and provides personalized feedback.',
    icon: BrainCog,
  },
  {
    title: 'Technical & Behavioral',
    description: 'Prepare for both technical coding interviews and behavioral questions with customizable difficulty levels.',
    icon: Check,
  },
  {
    title: 'Detailed Feedback',
    description: 'Get actionable insights on your strengths and areas for improvement after each interview session.',
    icon: Check,
  },
];

// Testimonials Data
const testimonials = [
  {
    name: 'Alex Johnson',
    role: 'Software Engineer at Google',
    text: 'InterviewAI helped me prepare for my Google interview. The AI feedback was surprisingly accurate and helped me identify areas I needed to improve.',
  },
  {
    name: 'Sarah Chen',
    role: 'Frontend Developer',
    text: 'After practicing with InterviewAI for just two weeks, I felt so much more confident in my real interview. I got the job!',
  },
  {
    name: 'Michael Rodriguez',
    role: 'CS Student',
    text: 'As a student, InterviewAI has been invaluable in helping me prepare for internship interviews. The technical feedback is spot-on.',
  },
];

export default Landing;


