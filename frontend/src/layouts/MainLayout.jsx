import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />

      <main className="flex-grow-1 container py-4">
        {children}
      </main>

      <footer className="bg-white border-top py-3 text-center text-muted">
        <small>© 2025 InterviewAI. All rights reserved.</small>
      </footer>
    </div>
  );
};

export default MainLayout;
