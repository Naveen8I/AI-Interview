import { Outlet, Link, useLocation } from 'react-router-dom';
import { BrainCog } from 'lucide-react';

const AuthLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center bg-gradient">
      
          <div className="col-sm-8 col-md-6 col-lg-5 w-100 mx-auto text-center">
            <div className="p-4 bg-white bg-opacity-25 rounded shadow" >
              <Outlet />
            </div>

            <div className="text-center mt-3">
              <p className="text-white">
                {isLoginPage ? (
                  <>
                    Don't have an account?{' '}
                    <Link to="/register" className="text-white text-decoration-underline fw-medium">
                      Sign up
                    </Link>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <Link to="/login" className="text-white text-decoration-underline fw-medium">
                      Sign in
                    </Link>
                  </>
                )}
              </p>
            </div>
          </div>
        
      

      {/* Custom style override */}
      <style>{`
        .bg-gradient {
          background: linear-gradient(to bottom right, #0d6efd, #6610f2);
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
