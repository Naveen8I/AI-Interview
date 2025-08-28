// import { useState } from "react";
// import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

// function App() {
//   const [notes, setNotes] = useState("");
//   const [question, setQuestion] = useState("");
//   const [answer, setAnswer] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setAnswer(""); // clear old answer
//     try {
//       console.log("R");
//       const res = await axios.post("http://localhost:8000/ask", {
//         notes,
//         question,
//       });
//       console.log("Response:", res.data);
//       setAnswer(res.data.answer);
//     } catch (err) {
//       console.error("Error:", err);
//       setAnswer("Something went wrong. Check the server.");
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="container mt-5">
//       <h2 className="mb-4 text-center">💬 Chat with Your Notes</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label className="form-label">Paste Your Notes / Syllabus</label>
//           <textarea
//             className="form-control"
//             rows="6"
//             value={notes}
//             onChange={(e) => setNotes(e.target.value)}
//             required
//           ></textarea>
//         </div>
//         <div className="mb-3">
//           <label className="form-label">Ask a Question</label>
//           <input
//             type="text"
//             className="form-control"
//             value={question}
//             onChange={(e) => setQuestion(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit" className="btn btn-primary">
//           {loading ? "Thinking..." : "Ask Panda"}
//         </button>
//       </form>

//       {answer && (
//         <div
//           className="alert alert-success mt-4"
//           dangerouslySetInnerHTML={{
//             __html:
//               `<strong>Answer:</strong><br>` + answer.replace(/\*\*/g, "<br>"),
//           }}
//         />
//       )}
//     </div>
//   );
// }

// export default App;

// App.jsx




// import "bootstrap/dist/css/bootstrap.min.css";
// import ChatForm from "./components/ChatForm";

// function App() {
//   return <ChatForm />;
// }

// export default App;



import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

import ChatForm from "./components/ChatForm";
import VideoInterview from "./pages/VideoInterview"
import QuestionHistory from "./pages/QuestionHistory";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard"; // ✅ Import the Dashboard

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth(); // checks token and sets auth state
  }, []);

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/chat"
            element={
                <ChatForm />
            }
          />
          <Route
            path="/interview"
            element={
                <VideoInterview />
            }
          />
          <Route path="/history" element={<QuestionHistory />} />
          <Route
            path="/dashboard"
            element={
              
                <Dashboard />
            
            }
          />
        </Route>
        

        {/* Protected Routes */}
        
      </Routes>
    </Router>
  );
}

export default App;
