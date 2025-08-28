

// import React, { useState, useRef } from "react";
// import Webcam from "react-webcam";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";

// function VideoInterview() {
//   const [topic, setTopic] = useState("");
//   const [question, setQuestion] = useState("");
//   const [questionId, setQuestionId] = useState(null); // 💡 store MongoDB _id
//   const [answer, setAnswer] = useState("");
//   const [transcript, setTranscript] = useState("");
//   const [isRecording, setIsRecording] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [feedback, setFeedback] = useState("");
//   const [questionHistory, setQuestionHistory] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasStarted, setHasStarted] = useState(false);


//   const webcamRef = useRef(null);
//   const recognition =
//     window.SpeechRecognition || window.webkitSpeechRecognition;
//   const speech = recognition ? new recognition() : null;

//   const token = localStorage.getItem("token");

//   const handleTopicSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       // Step 1: Get question from Flask (8000)
//       const flaskRes = await axios.post("http://localhost:8000/generate-question", {
//         topic,
        
//         previous_questions: [],
//       });

//       const generatedQuestion = flaskRes.data.question;

//       // Step 2: Save question to MongoDB (5001)
//       const nodeRes = await axios.post(
//         "http://localhost:5001/api/questions/generate",
//         { topic},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setQuestion(generatedQuestion);
//       setQuestionId(nodeRes.data.questionId); // Store the MongoDB _id
//       setQuestionHistory([generatedQuestion]);
//       setHasStarted(true);
//     } catch (err) {
//       console.error("Error generating question:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleNextQuestion = async () => {
//     setIsLoading(true);
//     try {
//       const flaskRes = await axios.post("http://localhost:8000/generate-question", {
//         topic,
//         previous_questions: questionHistory,
//       });

//       const newQuestion = flaskRes.data.question;

//       // Save new question to MongoDB
//       const nodeRes = await axios.post(
//         "http://localhost:5001/api/questions/generate",
//         { topic },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setQuestion(newQuestion);
//       setQuestionId(nodeRes.data.questionId);
//       setQuestionHistory((prev) => [...prev, newQuestion]);
//       setTranscript("");
//       setAnswer("");
//       setFeedback("");
//       setShowModal(false);
//     } catch (err) {
//       console.error("Error getting next question:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAnswerSubmit = async () => {
//     if (!questionId) return alert("No question to answer.");

//     setIsLoading(true);
//     try {
//       const res = await axios.post(
//         "http://localhost:5001/api/questions/submit",
//         {
//           answer: transcript || answer,
//           questionId,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setFeedback(res.data.feedback);
//       setShowModal(true);
//     } catch (err) {
//       console.error("Error submitting answer:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const startRecording = () => {
//     if (!speech) return alert("Speech Recognition not supported.");
//     setTranscript("");
//     setIsRecording(true);
//     speech.continuous = false;
//     speech.lang = "en-US";
//     speech.start();

//     speech.onresult = (e) => {
//       const t = e.results[0][0].transcript;
//       setTranscript(t);
//       setIsRecording(false);
//     };

//     speech.onerror = () => {
//       setIsRecording(false);
//     };
//   };

//   const handleEndInterview = () => {
//     setQuestion("");
//     setAnswer("");
//     setTranscript("");
//     setFeedback("");
//     setQuestionHistory([]);
//     setQuestionId(null);
//     setHasStarted(false);
//     setShowModal(false);
//     setIsRecording(false);
//   };

//   return (
//     <div className="container py-4" style={{ maxWidth: "960px" }}>
//       <header className="text-center mb-5">
//         <h1 className="display-5 fw-bold text-primary mb-2">
//           🎥 AI Video Interview
//         </h1>
//         <p className="lead text-muted">Practice with real-time AI feedback</p>
//       </header>

//       {!hasStarted && (
//         <div className="card shadow-sm p-4 mb-5">
//           <form onSubmit={handleTopicSubmit}>
//             <label className="form-label fs-5 mb-3">
//               Enter a topic to begin:
//             </label>
//             <div className="input-group">
//               <input
//                 className="form-control form-control-lg"
//                 placeholder="e.g., DBMS, React, System Design..."
//                 value={topic}
//                 onChange={(e) => setTopic(e.target.value)}
//                 required
//               />
              
//               <button
//                 className="btn btn-primary btn-lg px-4"
//                 type="submit"
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2"></span>
//                     Starting...
//                   </>
//                 ) : (
//                   "Start Interview →"
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {hasStarted && (
//         <div className="row g-4">
//           <div className="col-md-6 text-center">
//             <Webcam
//               audio={false}
//               ref={webcamRef}
//               className="rounded-3 shadow"
//               style={{ width: "100%", border: "3px solid #eee" }}
//             />
//           </div>

//           <div className="col-md-6">
//             <div className="card border-primary shadow mb-3">
//               <div className="card-header bg-primary text-white d-flex justify-content-between">
//                 <h5 className="mb-0">Question {questionHistory.length}</h5>
//                 <span className="badge bg-light text-primary">
//                   Topic: {topic}
//                 </span>
//               </div>
//               <div className="card-body">
//                 <p className="fs-5 mb-0">{question}</p>
//               </div>
//             </div>

//             <div className="card shadow p-3 mb-3">
//               <div className="d-flex gap-2 mb-2 align-items-center">
//                 <button
//                   className={`btn ${
//                     isRecording ? "btn-danger" : "btn-warning"
//                   } d-flex align-items-center gap-2`}
//                   onClick={startRecording}
//                   disabled={isRecording}
//                 >
//                   🎙️ {isRecording ? "Listening..." : "Speak Answer"}
//                 </button>
//                 {transcript && (
//                   <small className="text-success">
//                     <i className="bi bi-check-circle-fill me-1"></i>
//                     Transcript ready!
//                   </small>
//                 )}
//               </div>

//               <textarea
//                 className="form-control mb-3"
//                 rows="4"
//                 placeholder="Or type your answer here..."
//                 value={transcript || answer}
//                 onChange={(e) => setAnswer(e.target.value)}
//               />

//               <div className="d-flex gap-2">
//                 <button
//                   className="btn btn-success flex-grow-1"
//                   onClick={handleAnswerSubmit}
//                   disabled={isLoading}
//                 >
//                   {isLoading ? (
//                     <span className="spinner-border spinner-border-sm me-2"></span>
//                   ) : null}
//                   Submit Answer
//                 </button>
//                 <button
//                   className="btn btn-outline-secondary"
//                   onClick={() => {
//                     setAnswer("");
//                     setTranscript("");
//                   }}
//                 >
//                   Clear
//                 </button>
//               </div>
//             </div>

//             <div className="d-flex justify-content-between">
//               <button
//                 className="btn btn-danger"
//                 onClick={handleEndInterview}
//                 disabled={isLoading}
//               >
//                 🛑 End Interview
//               </button>

//               <button
//                 className="btn btn-outline-primary px-4"
//                 onClick={handleNextQuestion}
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <span className="spinner-border spinner-border-sm me-2"></span>
//                 ) : (
//                   "🔄"
//                 )}{" "}
//                 Next Question
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showModal && (
//         <div
//           className="modal fade show d-block"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//         >
//           <div className="modal-dialog modal-lg modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header bg-primary text-white">
//                 <h5 className="modal-title">
//                   <i className="bi bi-stars me-2"></i> AI Feedback
//                 </h5>
//                 <button
//                   type="button"
//                   className="btn-close btn-close-white"
//                   onClick={() => setShowModal(false)}
//                 ></button>
//               </div>
//               <div className="modal-body" style={{ maxHeight: "60vh", overflowY: "auto" }}>
//                 <div className="alert alert-info">
//                   <strong>Question:</strong> {question}
//                 </div>
//                 <div className="p-3 bg-light rounded mb-3">
//                   <strong>Your Answer:</strong>
//                   <p className="mb-0">{transcript || answer}</p>
//                 </div>
//                 <div className="p-3 bg-white border rounded">
//                   <h6 className="text-primary mb-3">Feedback:</h6>
//                   <p style={{ whiteSpace: "pre-wrap" }}>{feedback}</p>
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   className="btn btn-primary"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Continue Interview
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default VideoInterview;

// import React, { useState, useRef } from "react";
// import Webcam from "react-webcam";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";

// function VideoInterview() {
//   const [topic, setTopic] = useState("");
//   const [difficulty, setDifficulty] = useState("medium");
//   const [question, setQuestion] = useState("");
//   const [questionId, setQuestionId] = useState(null);
//   const [sessionId, setSessionId] = useState(null); // ✅ added state
//   const [answer, setAnswer] = useState("");
//   const [transcript, setTranscript] = useState("");
//   const [isRecording, setIsRecording] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [feedback, setFeedback] = useState("");
//   const [questionHistory, setQuestionHistory] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasStarted, setHasStarted] = useState(false);

//   const webcamRef = useRef(null);
//   const recognition =
//     window.SpeechRecognition || window.webkitSpeechRecognition;
//   const speech = recognition ? new recognition() : null;

//   const token = localStorage.getItem("token");

//   const handleTopicSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       const flaskRes = await axios.post("http://localhost:8000/generate-question", {
//         topic,
//         difficulty,
//         previous_questions: [],
//       });

//       const generatedQuestion = flaskRes.data.question;

//       const nodeRes = await axios.post(
//         "http://localhost:5001/api/questions/generate",
//         { topic, sessionId }, // ✅ first question, no sessionId
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setSessionId(nodeRes.data.sessionId); // ✅ store new sessionId
//       setQuestion(generatedQuestion);
//       setQuestionId(nodeRes.data.questionId);
//       setQuestionHistory([generatedQuestion]);
//       setHasStarted(true);
//     } catch (err) {
//       console.error("Error generating question:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleNextQuestion = async () => {
//     setIsLoading(true);
//     try {
//       const flaskRes = await axios.post("http://localhost:8000/generate-question", {
//         topic,
//         difficulty,
//         previous_questions: questionHistory,
//       });

//       const newQuestion = flaskRes.data.question;

//       const nodeRes = await axios.post(
//         "http://localhost:5001/api/questions/generate",
//         { topic, sessionId }, // ✅ reuse existing sessionId
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setQuestion(newQuestion);
//       setQuestionId(nodeRes.data.questionId);
//       setQuestionHistory((prev) => [...prev, newQuestion]);
//       setTranscript("");
//       setAnswer("");
//       setFeedback("");
//       setShowModal(false);
//     } catch (err) {
//       console.error("Error getting next question:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAnswerSubmit = async () => {
//     if (!questionId) return alert("No question to answer.");
//     setIsLoading(true);
//     try {
//       const res = await axios.post(
//         "http://localhost:5001/api/questions/submit",
//         {
//           answer: transcript || answer,
//           questionId,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setFeedback(res.data.feedback);
//       setShowModal(true);
//     } catch (err) {
//       console.error("Error submitting answer:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const startRecording = () => {
//     if (!speech) return alert("Speech Recognition not supported.");
//     setTranscript("");
//     setIsRecording(true);
//     speech.continuous = false;
//     speech.lang = "en-US";
//     speech.start();

//     speech.onresult = (e) => {
//       const t = e.results[0][0].transcript;
//       setTranscript(t);
//       setIsRecording(false);
//     };

//     speech.onerror = () => {
//       setIsRecording(false);
//     };
//   };

//   const handleEndInterview = () => {
//     setQuestion("");
//     setAnswer("");
//     setTranscript("");
//     setFeedback("");
//     setQuestionHistory([]);
//     setQuestionId(null);
//     setSessionId(null); // ✅ reset session
//     setHasStarted(false);
//     setShowModal(false);
//     setIsRecording(false);
//   };

//   return (
//     <div className="container py-4" style={{ maxWidth: "960px" }}>
//       <header className="text-center mb-5">
//         <h1 className="display-5 fw-bold text-primary mb-2">🎥 AI Video Interview</h1>
//         <p className="lead text-muted">Practice with real-time AI feedback</p>
//       </header>

//       {!hasStarted && (
//         <div className="card shadow-sm p-4 mb-5">
//           <form onSubmit={handleTopicSubmit}>
//             <label className="form-label fs-5 mb-3">Enter a topic to begin:</label>
//             <div className="input-group mb-3">
//               <input
//                 className="form-control form-control-lg"
//                 placeholder="e.g., DBMS, React, System Design..."
//                 value={topic}
//                 onChange={(e) => setTopic(e.target.value)}
//                 required
//               />
//             </div>
//             <label className="form-label">Select Difficulty:</label>
//             <select
//               className="form-select mb-3"
//               value={difficulty}
//               onChange={(e) => setDifficulty(e.target.value)}
//             >
//               <option value="easy">Easy</option>
//               <option value="medium">Medium</option>
//               <option value="hard">Hard</option>
//             </select>
//             <button
//               className="btn btn-primary btn-lg px-4"
//               type="submit"
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2"></span>
//                   Starting...
//                 </>
//               ) : (
//                 "Start Interview →"
//               )}
//             </button>
//           </form>
//         </div>
//       )}

//       {hasStarted && (
//         <div className="row g-4">
//           <div className="col-md-6 text-center">
//             <Webcam
//               audio={false}
//               ref={webcamRef}
//               className="rounded-3 shadow"
//               style={{ width: "100%", border: "3px solid #eee" }}
//             />
//           </div>
//           <div className="col-md-6">
//             <div className="card border-primary shadow mb-3">
//               <div className="card-header bg-primary text-white d-flex justify-content-between">
//                 <h5 className="mb-0">Question {questionHistory.length}</h5>
//                 <span className="badge bg-light text-primary">Topic: {topic}</span>
//               </div>
//               <div className="card-body">
//                 <p className="fs-5 mb-0">{question}</p>
//               </div>
//             </div>
//             <div className="card shadow p-3 mb-3">
//               <div className="d-flex gap-2 mb-2 align-items-center">
//                 <button
//                   className={`btn ${isRecording ? "btn-danger" : "btn-warning"} d-flex align-items-center gap-2`}
//                   onClick={startRecording}
//                   disabled={isRecording}
//                 >
//                   🎙️ {isRecording ? "Listening..." : "Speak Answer"}
//                 </button>
//                 {transcript && (
//                   <small className="text-success">
//                     <i className="bi bi-check-circle-fill me-1"></i>Transcript ready!
//                   </small>
//                 )}
//               </div>
//               <textarea
//                 className="form-control mb-3"
//                 rows="4"
//                 placeholder="Or type your answer here..."
//                 value={transcript || answer}
//                 onChange={(e) => setAnswer(e.target.value)}
//               />
//               <div className="d-flex gap-2">
//                 <button
//                   className="btn btn-success flex-grow-1"
//                   onClick={handleAnswerSubmit}
//                   disabled={isLoading}
//                 >
//                   {isLoading && <span className="spinner-border spinner-border-sm me-2"></span>}
//                   Submit Answer
//                 </button>
//                 <button
//                   className="btn btn-outline-secondary"
//                   onClick={() => {
//                     setAnswer("");
//                     setTranscript("");
//                   }}
//                 >
//                   Clear
//                 </button>
//               </div>
//             </div>
//             <div className="d-flex justify-content-between">
//               <button className="btn btn-danger" onClick={handleEndInterview} disabled={isLoading}>
//                 🛑 End Interview
//               </button>
//               <button
//                 className="btn btn-outline-primary px-4"
//                 onClick={handleNextQuestion}
//                 disabled={isLoading}
//               >
//                 {isLoading && <span className="spinner-border spinner-border-sm me-2"></span>} 🔄 Next Question
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showModal && (
//         <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
//           <div className="modal-dialog modal-lg modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header bg-primary text-white">
//                 <h5 className="modal-title">
//                   <i className="bi bi-stars me-2"></i> AI Feedback
//                 </h5>
//                 <button
//                   type="button"
//                   className="btn-close btn-close-white"
//                   onClick={() => setShowModal(false)}
//                 ></button>
//               </div>
//               <div className="modal-body" style={{ maxHeight: "60vh", overflowY: "auto" }}>
//                 <div className="alert alert-info">
//                   <strong>Question:</strong> {question}
//                 </div>
//                 <div className="p-3 bg-light rounded mb-3">
//                   <strong>Your Answer:</strong>
//                   <p className="mb-0">{transcript || answer}</p>
//                 </div>
//                 <div className="p-3 bg-white border rounded">
//                   <h6 className="text-primary mb-3">Feedback:</h6>
//                   <p style={{ whiteSpace: "pre-wrap" }}>{feedback}</p>
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <button className="btn btn-primary" onClick={() => setShowModal(false)}>
//                   Continue Interview
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default VideoInterview;
//////////
// import React, { useState, useRef } from "react";
// import Webcam from "react-webcam";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";

// function VideoInterview() {
//   const [topic, setTopic] = useState("");
//   const [difficulty, setDifficulty] = useState("medium");
//   const [question, setQuestion] = useState("");
//   const [questionId, setQuestionId] = useState(null);
//   const [sessionId, setSessionId] = useState(null);
//   const [answer, setAnswer] = useState("");
//   const [transcript, setTranscript] = useState("");
//   const [isRecording, setIsRecording] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [feedback, setFeedback] = useState("");
//   const [questionHistory, setQuestionHistory] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasStarted, setHasStarted] = useState(false);

//   const webcamRef = useRef(null);
//   const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//   const speech = recognition ? new recognition() : null;

//   const token = localStorage.getItem("token");

//   const handleTopicSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       const nodeRes = await axios.post(
//         "http://localhost:5001/api/questions/generate",
//         { topic, sessionId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setSessionId(nodeRes.data.sessionId);
//       setQuestion(nodeRes.data.question);
//       setQuestionId(nodeRes.data.questionId);
//       setQuestionHistory([nodeRes.data.question]);
//       setHasStarted(true);
//     } catch (err) {
//       console.error("Error generating question:", err);
//       alert("Failed to start interview. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleNextQuestion = async () => {
//     setIsLoading(true);
//     try {
//       const nodeRes = await axios.post(
//         "http://localhost:5001/api/questions/generate",
//         { topic, sessionId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setQuestion(nodeRes.data.question);
//       setQuestionId(nodeRes.data.questionId);
//       setQuestionHistory((prev) => [...prev, nodeRes.data.question]);
//       setTranscript("");
//       setAnswer("");
//       setFeedback("");
//       setShowModal(false);
//     } catch (err) {
//       console.error("Error getting next question:", err);
//       alert("Could not fetch the next question.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAnswerSubmit = async () => {
//     if (!questionId) return alert("No question to answer.");
//     if (!answer && !transcript) return alert("Please provide an answer first.");

//     setIsLoading(true);
//     try {
//       const res = await axios.post(
//         "http://localhost:5001/api/questions/submit",
//         {
//           answer: transcript || answer,
//           questionId,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setFeedback(res.data.feedback);
//       setShowModal(true);
//     } catch (err) {
//       console.error("Error submitting answer:", err);
//       alert("Submission failed. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const startRecording = () => {
//     if (!speech) return alert("Speech Recognition not supported.");
//     setTranscript("");
//     setIsRecording(true);
//     speech.continuous = false;
//     speech.lang = "en-US";

//     speech.start();

//     speech.onresult = (e) => {
//       const t = e.results[0][0].transcript;
//       setTranscript(t);
//       setIsRecording(false);
//     };

//     speech.onerror = () => setIsRecording(false);
//     speech.onend = () => setIsRecording(false);
//   };

//   const handleEndInterview = () => {
//     setQuestion("");
//     setAnswer("");
//     setTranscript("");
//     setFeedback("");
//     setQuestionHistory([]);
//     setQuestionId(null);
//     setSessionId(null);
//     setHasStarted(false);
//     setShowModal(false);
//     setIsRecording(false);
//   };

//   return (
//     <div className="container py-4" style={{ maxWidth: "960px" }}>
//       <header className="text-center mb-5">
//         <h1 className="display-5 fw-bold text-primary mb-2">🎥 AI Video Interview</h1>
//         <p className="lead text-muted">Practice with real-time AI feedback</p>
//       </header>

//       {!hasStarted && (
//         <div className="card shadow-sm p-4 mb-5">
//           <form onSubmit={handleTopicSubmit}>
//             <label className="form-label fs-5 mb-3">Enter a topic to begin:</label>
//             <div className="input-group mb-3">
//               <input
//                 className="form-control form-control-lg"
//                 placeholder="e.g., DBMS, React, System Design..."
//                 value={topic}
//                 onChange={(e) => setTopic(e.target.value)}
//                 required
//               />
//             </div>
//             <label className="form-label">Select Difficulty:</label>
//             <select
//               className="form-select mb-3"
//               value={difficulty}
//               onChange={(e) => setDifficulty(e.target.value)}
//             >
//               <option value="easy">Easy</option>
//               <option value="medium">Medium</option>
//               <option value="hard">Hard</option>
//             </select>
//             <button className="btn btn-primary btn-lg px-4" type="submit" disabled={isLoading}>
//               {isLoading ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2"></span>
//                   Starting...
//                 </>
//               ) : (
//                 "Start Interview →"
//               )}
//             </button>
//           </form>
//         </div>
//       )}

//       {hasStarted && (
//         <div className="row g-4">
//           <div className="col-md-6 text-center">
//             <Webcam
//               audio={false}
//               ref={webcamRef}
//               className="rounded-3 shadow"
//               style={{ width: "100%", border: "3px solid #eee" }}
//             />
//           </div>
//           <div className="col-md-6">
//             <div className="card border-primary shadow mb-3">
//               <div className="card-header bg-primary text-white d-flex justify-content-between">
//                 <h5 className="mb-0">Question {questionHistory.length}</h5>
//                 <span className="badge bg-light text-primary">Topic: {topic}</span>
//               </div>
//               <div className="card-body">
//                 <p className="fs-5 mb-0">{question}</p>
//               </div>
//             </div>
//             <div className="card shadow p-3 mb-3">
//               <div className="d-flex gap-2 mb-2 align-items-center">
//                 <button
//                   className={`btn ${isRecording ? "btn-danger" : "btn-warning"} d-flex align-items-center gap-2`}
//                   onClick={startRecording}
//                   disabled={isRecording}
//                 >
//                   🎙️ {isRecording ? "Listening..." : "Speak Answer"}
//                 </button>
//                 {transcript && (
//                   <small className="text-success">
//                     <i className="bi bi-check-circle-fill me-1"></i>Transcript ready!
//                   </small>
//                 )}
//               </div>
//               <textarea
//                 className="form-control mb-3"
//                 rows="4"
//                 placeholder="Or type your answer here..."
//                 value={transcript || answer}
//                 onChange={(e) => setAnswer(e.target.value)}
//               />
//               <div className="d-flex gap-2">
//                 <button className="btn btn-success flex-grow-1" onClick={handleAnswerSubmit} disabled={isLoading}>
//                   {isLoading && <span className="spinner-border spinner-border-sm me-2"></span>}
//                   Submit Answer
//                 </button>
//                 <button className="btn btn-outline-secondary" onClick={() => { setAnswer(""); setTranscript(""); }}>
//                   Clear
//                 </button>
//               </div>
//             </div>
//             <div className="d-flex justify-content-between">
//               <button className="btn btn-danger" onClick={handleEndInterview} disabled={isLoading}>
//                 🛑 End Interview
//               </button>
//               <button className="btn btn-outline-primary px-4" onClick={handleNextQuestion} disabled={isLoading}>
//                 {isLoading && <span className="spinner-border spinner-border-sm me-2"></span>} 🔄 Next Question
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showModal && (
//         <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
//           <div className="modal-dialog modal-lg modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header bg-primary text-white">
//                 <h5 className="modal-title">
//                   <i className="bi bi-stars me-2"></i> AI Feedback
//                 </h5>
//                 <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
//               </div>
//               <div className="modal-body" style={{ maxHeight: "60vh", overflowY: "auto" }}>
//                 <div className="alert alert-info">
//                   <strong>Question:</strong> {question}
//                 </div>
//                 <div className="p-3 bg-light rounded mb-3">
//                   <strong>Your Answer:</strong>
//                   <p className="mb-0">{transcript || answer}</p>
//                 </div>
//                 <div className="p-3 bg-white border rounded">
//                   <h6 className="text-primary mb-3">Feedback:</h6>
//                   <p style={{ whiteSpace: "pre-wrap" }}>{feedback || "No feedback available."}</p>
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <button className="btn btn-primary" onClick={() => setShowModal(false)}>
//                   Continue Interview
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default VideoInterview;
///////////////////////////////////////////////
// import React, { useState, useRef } from "react";
// import Webcam from "react-webcam";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";

// function VideoInterview() {
//   const [topic, setTopic] = useState("");
//   const [difficulty, setDifficulty] = useState("medium");
//   const [question, setQuestion] = useState("");
//   const [questionId, setQuestionId] = useState(null);
//   const [sessionId, setSessionId] = useState(null);
//   const [answer, setAnswer] = useState("");
//   const [transcript, setTranscript] = useState("");
//   const [isRecording, setIsRecording] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [feedback, setFeedback] = useState("");
//   const [questionHistory, setQuestionHistory] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasStarted, setHasStarted] = useState(false);

//   const [maxQuestions, setMaxQuestions] = useState(5);
//   const [questionCount, setQuestionCount] = useState(0);

//   const webcamRef = useRef(null);
//   const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//   const speech = recognition ? new recognition() : null;

//   const token = localStorage.getItem("token");

//   const handleTopicSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       const nodeRes = await axios.post(
//         "http://localhost:5001/api/questions/generate",
//         { topic, sessionId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setSessionId(nodeRes.data.sessionId);
//       setQuestion(nodeRes.data.question);
//       setQuestionId(nodeRes.data.questionId);
//       setQuestionHistory([nodeRes.data.question]);
//       setHasStarted(true);
//       setQuestionCount(1);
//     } catch (err) {
//       console.error("Error generating question:", err);
//       alert("Failed to start interview.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleNextQuestion = async () => {
//     if (questionCount >= maxQuestions) {
//       alert("Interview completed!");
//       handleEndInterview();
//       window.location.href = "/interview"; // 🔁 Redirect
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const nodeRes = await axios.post(
//         "http://localhost:5001/api/questions/generate",
//         { topic, sessionId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setQuestion(nodeRes.data.question);
//       setQuestionId(nodeRes.data.questionId);
//       setQuestionHistory((prev) => [...prev, nodeRes.data.question]);
//       setTranscript("");
//       setAnswer("");
//       setFeedback("");
//       setShowModal(false);
//       setQuestionCount((prev) => prev + 1);
//     } catch (err) {
//       console.error("Error getting next question:", err);
//       alert("Could not fetch the next question.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAnswerSubmit = async () => {
//     if (!questionId) return alert("No question to answer.");
//     if (!answer && !transcript) return alert("Please provide an answer first.");

//     setIsLoading(true);
//     try {
//       const res = await axios.post(
//         "http://localhost:5001/api/questions/submit",
//         {
//           answer: transcript || answer,
//           questionId,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setFeedback(res.data.feedback);
//       setShowModal(true);
//     } catch (err) {
//       console.error("Error submitting answer:", err);
//       alert("Submission failed. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const startRecording = () => {
//     if (!speech) return alert("Speech Recognition not supported.");
//     setTranscript("");
//     setIsRecording(true);
//     speech.continuous = false;
//     speech.lang = "en-US";

//     speech.start();

//     speech.onresult = (e) => {
//       const t = e.results[0][0].transcript;
//       setTranscript(t);
//       setIsRecording(false);
//     };

//     speech.onerror = () => setIsRecording(false);
//     speech.onend = () => setIsRecording(false);
//   };

//   const handleEndInterview = () => {
//     setQuestion("");
//     setAnswer("");
//     setTranscript("");
//     setFeedback("");
//     setQuestionHistory([]);
//     setQuestionId(null);
//     setSessionId(null);
//     setHasStarted(false);
//     setShowModal(false);
//     setIsRecording(false);
//     setQuestionCount(0);
//   };

//   return (
//     <div className="container py-4" style={{ maxWidth: "960px" }}>
//       <header className="text-center mb-5">
//         <h1 className="display-5 fw-bold text-primary mb-2">🎥 AI Video Interview</h1>
//         <p className="lead text-muted">Practice with real-time AI feedback</p>
//       </header>

//       {!hasStarted && (
//         <div className="card shadow-sm p-4 mb-5">
//           <form onSubmit={handleTopicSubmit}>
//             <label className="form-label fs-5 mb-3">Enter a topic to begin:</label>
//             <div className="input-group mb-3">
//               <input
//                 className="form-control form-control-lg"
//                 placeholder="e.g., DBMS, React, System Design..."
//                 value={topic}
//                 onChange={(e) => setTopic(e.target.value)}
//                 required
//               />
//             </div>
//             <label className="form-label">Select Difficulty:</label>
//             <select
//               className="form-select mb-3"
//               value={difficulty}
//               onChange={(e) => setDifficulty(e.target.value)}
//             >
//               <option value="easy">Easy</option>
//               <option value="medium">Medium</option>
//               <option value="hard">Hard</option>
//             </select>
//             <label className="form-label">How many questions?</label>
//             <select
//               className="form-select mb-3"
//               value={maxQuestions}
//               onChange={(e) => setMaxQuestions(Number(e.target.value))}
//             >
//               <option value={3}>3</option>
//               <option value={5}>5</option>
//               <option value={10}>10</option>
//             </select>
//             <button className="btn btn-primary btn-lg px-4" type="submit" disabled={isLoading}>
//               {isLoading ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2"></span>
//                   Starting...
//                 </>
//               ) : (
//                 "Start Interview →"
//               )}
//             </button>
//           </form>
//         </div>
//       )}

//       {hasStarted && (
//         <div className="row g-4">
//           <div className="col-md-6 text-center">
//             <Webcam
//               audio={false}
//               ref={webcamRef}
//               className="rounded-3 shadow"
//               style={{ width: "100%", border: "3px solid #eee" }}
//             />
//           </div>
//           <div className="col-md-6">
//             <div className="card border-primary shadow mb-3">
//               <div className="card-header bg-primary text-white d-flex justify-content-between">
//                 <h5 className="mb-0">Question {questionCount} of {maxQuestions}</h5>
//                 <span className="badge bg-light text-primary">Topic: {topic}</span>
//               </div>
//               <div className="card-body">
//                 <p className="fs-5 mb-0">{question}</p>
//               </div>
//             </div>
//             <div className="card shadow p-3 mb-3">
//               <div className="d-flex gap-2 mb-2 align-items-center">
//                 <button
//                   className={`btn ${isRecording ? "btn-danger" : "btn-warning"} d-flex align-items-center gap-2`}
//                   onClick={startRecording}
//                   disabled={isRecording}
//                 >
//                   🎙️ {isRecording ? "Listening..." : "Speak Answer"}
//                 </button>
//                 {transcript && (
//                   <small className="text-success">
//                     <i className="bi bi-check-circle-fill me-1"></i>Transcript ready!
//                   </small>
//                 )}
//               </div>
//               <textarea
//                 className="form-control mb-3"
//                 rows="4"
//                 placeholder="Or type your answer here..."
//                 value={transcript || answer}
//                 onChange={(e) => setAnswer(e.target.value)}
//               />
//               <div className="d-flex gap-2">
//                 <button className="btn btn-success flex-grow-1" onClick={handleAnswerSubmit} disabled={isLoading}>
//                   {isLoading && <span className="spinner-border spinner-border-sm me-2"></span>}
//                   Submit Answer
//                 </button>
//                 <button className="btn btn-outline-secondary" onClick={() => { setAnswer(""); setTranscript(""); }}>
//                   Clear
//                 </button>
//               </div>
//             </div>
//             <div className="d-flex justify-content-between">
//               <button className="btn btn-danger" onClick={handleEndInterview} disabled={isLoading}>
//                 🛑 End Interview
//               </button>
//               <button className="btn btn-outline-primary px-4" onClick={handleNextQuestion} disabled={isLoading}>
//                 {isLoading && <span className="spinner-border spinner-border-sm me-2"></span>} 🔄 Next Question
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showModal && (
//         <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
//           <div className="modal-dialog modal-lg modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header bg-primary text-white">
//                 <h5 className="modal-title">
//                   <i className="bi bi-stars me-2"></i> AI Feedback
//                 </h5>
//                 <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
//               </div>
//               <div className="modal-body" style={{ maxHeight: "60vh", overflowY: "auto" }}>
//                 <div className="alert alert-info">
//                   <strong>Question:</strong> {question}
//                 </div>
//                 <div className="p-3 bg-light rounded mb-3">
//                   <strong>Your Answer:</strong>
//                   <p className="mb-0">{transcript || answer}</p>
//                 </div>
//                 <div className="p-3 bg-white border rounded">
//                   <h6 className="text-primary mb-3">Feedback:</h6>
//                   <p style={{ whiteSpace: "pre-wrap" }}>{feedback || "No feedback available."}</p>
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <button className="btn btn-primary" onClick={() => setShowModal(false)}>
//                   Continue Interview
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default VideoInterview;
/////////////////////////////////////////////////////////////////////
// import React, { useState, useRef } from "react";
// import Webcam from "react-webcam";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";

// function VideoInterview() {
//   const [topic, setTopic] = useState("");
//   const [difficulty, setDifficulty] = useState("medium");
//   const [question, setQuestion] = useState("");
//   const [questionId, setQuestionId] = useState(null);
//   const [sessionId, setSessionId] = useState(null);
//   const [answer, setAnswer] = useState("");
//   const [transcript, setTranscript] = useState("");
//   const [isRecording, setIsRecording] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [showSummary, setShowSummary] = useState(false);
//   const [feedback, setFeedback] = useState("");
//   const [questionHistory, setQuestionHistory] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasStarted, setHasStarted] = useState(false);
//   const [maxQuestions, setMaxQuestions] = useState(5);
//   const [questionCount, setQuestionCount] = useState(0);
//   const [scores, setScores] = useState([]);
//   const [finalScore, setFinalScore] = useState(null);

//   const webcamRef = useRef(null);
//   const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//   const speech = recognition ? new recognition() : null;

//   const token = localStorage.getItem("token");

//   const handleTopicSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       const nodeRes = await axios.post(
//         "http://localhost:5001/api/questions/generate",
//         { topic, sessionId, difficulty },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setSessionId(nodeRes.data.sessionId);
//       setQuestion(nodeRes.data.question);
//       setQuestionId(nodeRes.data.questionId);
//       setQuestionHistory([nodeRes.data.question]);
//       setHasStarted(true);
//       setQuestionCount(1);
//     } catch (err) {
//       console.error("Error generating question:", err);
//       alert("Failed to start interview.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleNextQuestion = async () => {
//     if (questionCount >= maxQuestions) {
//       const total = scores.reduce((sum, s) => sum + (s || 0), 0);
//       const average = (total / scores.length).toFixed(2);
//       setFinalScore(average);
//       setShowSummary(true);
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const nodeRes = await axios.post(
//         "http://localhost:5001/api/questions/generate",
//         { topic, sessionId, difficulty },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setQuestion(nodeRes.data.question);
//       setQuestionId(nodeRes.data.questionId);
//       setQuestionHistory((prev) => [...prev, nodeRes.data.question]);
//       setTranscript("");
//       setAnswer("");
//       setFeedback("");
//       setShowModal(false);
//       setQuestionCount((prev) => prev + 1);
//     } catch (err) {
//       console.error("Error getting next question:", err);
//       alert("Could not fetch the next question.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAnswerSubmit = async () => {
//     if (!questionId) return alert("No question to answer.");
//     if (!answer && !transcript) return alert("Please provide an answer first.");

//     setIsLoading(true);
//     try {
//       const res = await axios.post(
//         "http://localhost:5001/api/questions/submit",
//         {
//           answer: transcript || answer,
//           questionId,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setFeedback(res.data.feedback);
//       setScores((prev) => [...prev, res.data.score]);
//       setShowModal(true);
//     } catch (err) {
//       console.error("Error submitting answer:", err);
//       alert("Submission failed. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const startRecording = () => {
//     if (!speech) return alert("Speech Recognition not supported.");
//     setTranscript("");
//     setIsRecording(true);
//     speech.continuous = false;
//     speech.lang = "en-US";

//     speech.start();

//     speech.onresult = (e) => {
//       const t = e.results[0][0].transcript;
//       setTranscript(t);
//       setIsRecording(false);
//     };

//     speech.onerror = () => setIsRecording(false);
//     speech.onend = () => setIsRecording(false);
//   };

//   const resetInterview = () => {
//     setQuestion("");
//     setAnswer("");
//     setTranscript("");
//     setFeedback("");
//     setQuestionHistory([]);
//     setQuestionId(null);
//     setSessionId(null);
//     setHasStarted(false);
//     setShowModal(false);
//     setIsRecording(false);
//     setQuestionCount(0);
//     setScores([]);
//     setFinalScore(null);
//     setShowSummary(false);
//   };

//   return (
//     <div className="container py-4" style={{ maxWidth: "960px" }}>
//       <header className="text-center mb-5">
//         <h1 className="display-5 fw-bold text-primary mb-2">🎥 AI Video Interview</h1>
//         <p className="lead text-muted">Practice with real-time AI feedback</p>
//       </header>

//       {!hasStarted && (
//         <div className="card shadow-sm p-4 mb-5">
//           <form onSubmit={handleTopicSubmit}>
//             <label className="form-label fs-5 mb-3">Enter a topic to begin:</label>
//             <input
//               className="form-control form-control-lg mb-3"
//               placeholder="e.g., DBMS, React, System Design..."
//               value={topic}
//               onChange={(e) => setTopic(e.target.value)}
//               required
//             />
//             <label className="form-label">Select Difficulty:</label>
//             <select
//               className="form-select mb-3"
//               value={difficulty}
//               onChange={(e) => setDifficulty(e.target.value)}
//             >
//               <option value="easy">Easy</option>
//               <option value="medium">Medium</option>
//               <option value="hard">Hard</option>
//             </select>
//             <label className="form-label">How many questions?</label>
//             <select
//               className="form-select mb-3"
//               value={maxQuestions}
//               onChange={(e) => setMaxQuestions(Number(e.target.value))}
//             >
//               <option value={3}>3</option>
//               <option value={5}>5</option>
//               <option value={10}>10</option>
//             </select>
//             <button className="btn btn-primary btn-lg px-4" type="submit" disabled={isLoading}>
//               {isLoading ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2"></span>
//                   Starting...
//                 </>
//               ) : (
//                 "Start Interview →"
//               )}
//             </button>
//           </form>
//         </div>
//       )}

//       {hasStarted && (
//         <div className="row g-4">
//           <div className="col-md-6 text-center">
//             <Webcam
//               audio={false}
//               ref={webcamRef}
//               className="rounded-3 shadow"
//               style={{ width: "100%", border: "3px solid #eee" }}
//             />
//           </div>
//           <div className="col-md-6">
//             <div className="card border-primary shadow mb-3">
//               <div className="card-header bg-primary text-white d-flex justify-content-between">
//                 <h5 className="mb-0">Question {questionCount} of {maxQuestions}</h5>
//                 <span className="badge bg-light text-primary">Topic: {topic}</span>
//               </div>
//               <div className="card-body">
//                 <p className="fs-5 mb-0">{question}</p>
//               </div>
//             </div>
//             <div className="card shadow p-3 mb-3">
//               <div className="d-flex gap-2 mb-2 align-items-center">
//                 <button
//                   className={`btn ${isRecording ? "btn-danger" : "btn-warning"} d-flex align-items-center gap-2`}
//                   onClick={startRecording}
//                   disabled={isRecording}
//                 >
//                   🎙️ {isRecording ? "Listening..." : "Speak Answer"}
//                 </button>
//                 {transcript && (
//                   <small className="text-success">
//                     <i className="bi bi-check-circle-fill me-1"></i>Transcript ready!
//                   </small>
//                 )}
//               </div>
//               <textarea
//                 className="form-control mb-3"
//                 rows="4"
//                 placeholder="Or type your answer here..."
//                 value={transcript || answer}
//                 onChange={(e) => setAnswer(e.target.value)}
//               />
//               <div className="d-flex gap-2">
//                 <button className="btn btn-success flex-grow-1" onClick={handleAnswerSubmit} disabled={isLoading}>
//                   {isLoading && <span className="spinner-border spinner-border-sm me-2"></span>}
//                   Submit Answer
//                 </button>
//                 <button className="btn btn-outline-secondary" onClick={() => { setAnswer(""); setTranscript(""); }}>
//                   Clear
//                 </button>
//               </div>
//             </div>
//             <div className="d-flex justify-content-between">
//               <button className="btn btn-danger" onClick={() => {
//                 const total = scores.reduce((sum, s) => sum + (s || 0), 0);
//                 const avg = (total / scores.length).toFixed(2);
//                 setFinalScore(avg);
//                 setShowSummary(true);
//               }}>
//                 🛑 End Interview
//               </button>
//               <button
//                 className="btn btn-outline-primary px-4"
//                 onClick={handleNextQuestion}
//                 disabled={isLoading || questionCount >= maxQuestions}
//               >
//                 {isLoading && <span className="spinner-border spinner-border-sm me-2"></span>}
//                 🔄 Next Question
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showModal && (
//         <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
//           <div className="modal-dialog modal-lg modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header bg-primary text-white">
//                 <h5 className="modal-title"><i className="bi bi-stars me-2"></i> AI Feedback</h5>
//                 <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
//               </div>
//               <div className="modal-body" style={{ maxHeight: "60vh", overflowY: "auto" }}>
//                 <div className="alert alert-info">
//                   <strong>Question:</strong> {question}
//                 </div>
//                 <div className="p-3 bg-light rounded mb-3">
//                   <strong>Your Answer:</strong>
//                   <p className="mb-0">{transcript || answer}</p>
//                 </div>
//                 <div className="p-3 bg-white border rounded">
//                   <h6 className="text-primary mb-2">Feedback:</h6>
//                   <p style={{ whiteSpace: "pre-wrap" }}>{feedback}</p>
//                   <p className="text-muted mt-3 text-end">Score: {scores[scores.length - 1] ?? "-"} / 10</p>
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <button className="btn btn-primary" onClick={() => setShowModal(false)}>
//                   Continue Interview
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {showSummary && (
//         <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content text-center">
//               <div className="modal-header bg-success text-white">
//                 <h5 className="modal-title">🎯 Interview Summary</h5>
//               </div>
//               <div className="modal-body">
//                 <h3>Well done! 👏</h3>
//                 <p>You answered <strong>{questionCount}</strong> questions on <strong>{topic}</strong>.</p>
//                 <h4 className="text-primary my-3">Score: {finalScore} / 10</h4>
//               </div>
//               <div className="modal-footer justify-content-center">
//                 <button className="btn btn-outline-success" onClick={resetInterview}>
//                   Back to Home
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default VideoInterview;
import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { checkPlagiarism } from "../api/questionApi";

function VideoInterview() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [question, setQuestion] = useState("");
  const [questionId, setQuestionId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [answer, setAnswer] = useState("");
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [questionHistory, setQuestionHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [maxQuestions, setMaxQuestions] = useState(5);
  const [questionCount, setQuestionCount] = useState(0);
  const [scores, setScores] = useState([]);
  const [finalScore, setFinalScore] = useState(null);

  // Plagiarism states
  const [plagiarismScore, setPlagiarismScore] = useState(null); // 0-100
  const [plagiarismFeedback, setPlagiarismFeedback] = useState("");
  const [showPlagiarismModal, setShowPlagiarismModal] = useState(false);

  const webcamRef = useRef(null);
  const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const speech = recognition ? new recognition() : null;

  const token = localStorage.getItem("token");

  const handleTopicSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const nodeRes = await axios.post(
        "http://localhost:5001/api/questions/generate",
        { topic, sessionId, difficulty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSessionId(nodeRes.data.sessionId);
      setQuestion(nodeRes.data.question);
      setQuestionId(nodeRes.data.questionId);
      setQuestionHistory([nodeRes.data.question]);
      setHasStarted(true);
      setQuestionCount(1);
    } catch (err) {
      console.error("Error generating question:", err);
      alert("Failed to start interview.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = async () => {
    // If finished, compute final score and show summary
    if (questionCount >= maxQuestions) {
      const total = scores.reduce((sum, s) => sum + (s || 0), 0);
      const average = scores.length ? (total / scores.length).toFixed(2) : "0.00";
      setFinalScore(average);
      setShowSummary(true);
      return;
    }

    setIsLoading(true);
    try {
      const nodeRes = await axios.post(
        "http://localhost:5001/api/questions/generate",
        { topic, sessionId, difficulty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuestion(nodeRes.data.question);
      setQuestionId(nodeRes.data.questionId);
      setQuestionHistory((prev) => [...prev, nodeRes.data.question]);
      setTranscript("");
      setAnswer("");
      setFeedback("");
      setShowModal(false);
      setPlagiarismScore(null);
      setPlagiarismFeedback("");
      setShowPlagiarismModal(false);
      setQuestionCount((prev) => prev + 1);
    } catch (err) {
      console.error("Error getting next question:", err);
      alert("Could not fetch the next question.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!questionId) return alert("No question to answer.");
    const userAnswer = (transcript || answer || "").trim();
    if (!userAnswer) return alert("Please provide an answer first.");

    setIsLoading(true);
    try {
      // --- Step 1: Plagiarism check via Flask ---
      const plag = await checkPlagiarism(userAnswer);
      const pScore = plag?.plagiarism_score ?? null;
      const pFlag = Boolean(plag?.is_plagiarized);
      setPlagiarismScore(pScore);
      setPlagiarismFeedback(plag?.feedback || "");

      // If looks plagiarized, warn and stop here
      if (pFlag && pScore !== null && pScore >= 60) {
        setShowPlagiarismModal(true);
        setIsLoading(false);
        return;
      }

      // --- Step 2: Submit to Node for scoring/feedback ---
      const res = await axios.post(
        "http://localhost:5001/api/questions/submit",
        { answer: userAnswer, questionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFeedback(res.data.feedback);
      setScores((prev) => [...prev, res.data.score]);
      setShowModal(true);
    } catch (err) {
      console.error("Error submitting answer:", err);
      alert("Submission failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = () => {
    if (!speech) return alert("Speech Recognition not supported.");
    setTranscript("");
    setIsRecording(true);
    speech.continuous = false;
    speech.lang = "en-US";

    speech.start();

    speech.onresult = (e) => {
      const t = e.results[0][0].transcript;
      setTranscript(t);
      setIsRecording(false);
    };

    speech.onerror = () => setIsRecording(false);
    speech.onend = () => setIsRecording(false);
  };

  const computeAndShowSummary = () => {
    const total = scores.reduce((sum, s) => sum + (s || 0), 0);
    const average = scores.length ? (total / scores.length).toFixed(2) : "0.00";
    setFinalScore(average);
    setShowSummary(true);
  };

  const resetInterview = () => {
    setQuestion("");
    setAnswer("");
    setTranscript("");
    setFeedback("");
    setQuestionHistory([]);
    setQuestionId(null);
    setSessionId(null);
    setHasStarted(false);
    setShowModal(false);
    setIsRecording(false);
    setQuestionCount(0);
    setScores([]);
    setFinalScore(null);
    setShowSummary(false);
    setPlagiarismScore(null);
    setPlagiarismFeedback("");
    setShowPlagiarismModal(false);
  };

  return (
    <div className="container py-4" style={{ maxWidth: "960px" }}>
      <header className="text-center mb-5">
        <h1 className="display-5 fw-bold text-primary mb-2">🎥 AI Video Interview</h1>
        <p className="lead text-muted">Practice with real-time AI feedback</p>
      </header>

      {!hasStarted && (
        <div className="card shadow-sm p-4 mb-5">
          <form onSubmit={handleTopicSubmit}>
            <label className="form-label fs-5 mb-3">Enter a topic to begin:</label>
            <input
              className="form-control form-control-lg mb-3"
              placeholder="e.g., DBMS, React, System Design..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
            <label className="form-label">Select Difficulty:</label>
            <select
              className="form-select mb-3"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <label className="form-label">How many questions?</label>
            <select
              className="form-select mb-3"
              value={maxQuestions}
              onChange={(e) => setMaxQuestions(Number(e.target.value))}
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
            <button className="btn btn-primary btn-lg px-4" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Starting...
                </>
              ) : (
                "Start Interview →"
              )}
            </button>
          </form>
        </div>
      )}

      {hasStarted && (
        <div className="row g-4">
          <div className="col-md-6 text-center">
            <Webcam
              audio={false}
              ref={webcamRef}
              className="rounded-3 shadow"
              style={{ width: "100%", border: "3px solid #eee" }}
            />
          </div>
          <div className="col-md-6">
            <div className="card border-primary shadow mb-3">
              <div className="card-header bg-primary text-white d-flex justify-content-between">
                <h5 className="mb-0">Question {questionCount} of {maxQuestions}</h5>
                <span className="badge bg-light text-primary">Topic: {topic}</span>
              </div>
              <div className="card-body">
                <p className="fs-5 mb-0">{question}</p>
              </div>
            </div>

            <div className="card shadow p-3 mb-3">
              <div className="d-flex gap-2 mb-2 align-items-center">
                <button
                  className={`btn ${isRecording ? "btn-danger" : "btn-warning"} d-flex align-items-center gap-2`}
                  onClick={startRecording}
                  disabled={isRecording}
                >
                  🎙️ {isRecording ? "Listening..." : "Speak Answer"}
                </button>
                {transcript && (
                  <small className="text-success">
                    <i className="bi bi-check-circle-fill me-1"></i>Transcript ready!
                  </small>
                )}
              </div>

              <textarea
                className="form-control mb-3"
                rows="4"
                placeholder="Or type your answer here..."
                value={transcript || answer}
                onChange={(e) => setAnswer(e.target.value)}
              />

              <div className="d-flex gap-2">
                <button className="btn btn-success flex-grow-1" onClick={handleAnswerSubmit} disabled={isLoading}>
                  {isLoading && <span className="spinner-border spinner-border-sm me-2"></span>}
                  Submit Answer
                </button>
                <button className="btn btn-outline-secondary" onClick={() => { setAnswer(""); setTranscript(""); }}>
                  Clear
                </button>
              </div>

              {plagiarismScore !== null && (
                <div className={`alert mt-3 ${plagiarismScore >= 60 ? "alert-danger" : "alert-secondary"}`}>
                  <strong>Plagiarism Check:</strong> {plagiarismScore}% — {plagiarismFeedback}
                </div>
              )}
            </div>

            <div className="d-flex justify-content-between">
              <button className="btn btn-danger" onClick={computeAndShowSummary}>
                🛑 End Interview
              </button>
              <button
                className="btn btn-outline-primary px-4"
                onClick={handleNextQuestion}
                disabled={isLoading || questionCount >= maxQuestions}
              >
                {isLoading && <span className="spinner-border spinner-border-sm me-2"></span>}
                🔄 Next Question
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title"><i className="bi bi-stars me-2"></i> AI Feedback</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body" style={{ maxHeight: "60vh", overflowY: "auto" }}>
                <div className="alert alert-info">
                  <strong>Question:</strong> {question}
                </div>
                <div className="p-3 bg-light rounded mb-3">
                  <strong>Your Answer:</strong>
                  <p className="mb-0">{transcript || answer}</p>
                </div>
                <div className="p-3 bg-white border rounded">
                  <h6 className="text-primary mb-2">Feedback:</h6>
                  <p style={{ whiteSpace: "pre-wrap" }}>{feedback}</p>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <small className="text-muted">Plagiarism: {plagiarismScore ?? "-"}%</small>
                    <p className="text-muted mb-0">Score: {scores[scores.length - 1] ?? "-"} / 10</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => setShowModal(false)}>
                  Continue Interview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plagiarism warning modal */}
      {showPlagiarismModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">⚠️ Plagiarism Detected</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowPlagiarismModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Score:</strong> {plagiarismScore}%</p>
                <p className="mb-0">{plagiarismFeedback}</p>
                <small className="text-muted">Edit your answer and try again.</small>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowPlagiarismModal(false)}>Okay</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary modal – centered & aligned */}
      {showSummary && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">🎯 Interview Summary</h5>
              </div>
              <div className="modal-body text-center">
                <h3 className="mb-2">Well done! 👏</h3>
                <p className="mb-1">You answered <strong>{questionCount}</strong> questions on <strong>{topic}</strong>.</p>
                <h4 className="text-primary my-3">Average Score: {finalScore} / 10</h4>
                {scores.length > 0 && (
                  <div className="mt-3">
                    <h6 className="text-muted mb-2">Per-question scores</h6>
                    <div className="d-flex flex-wrap justify-content-center gap-2">
                      {scores.map((s, i) => (
                        <span key={i} className="badge bg-light text-dark border">{`Q${i + 1}: ${s ?? "-"}`}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer justify-content-center">
                <button className="btn btn-outline-success" onClick={resetInterview}>
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoInterview;


