
// import React, { useState } from "react";

// const SessionDetails = ({ sessionQuestions, onBack, onRetrySubmit }) => {
//   const [selectedQuestionId, setSelectedQuestionId] = useState(null);
//   const [retryAnswer, setRetryAnswer] = useState("");
//   const [feedback, setFeedback] = useState("");

//   const handleRetry = (id) => {
//     setSelectedQuestionId(id);
//     setRetryAnswer("");
//     setFeedback("");
//   };

//   const handleSubmit = async () => {
//     try {
//       const fb = await onRetrySubmit(selectedQuestionId, retryAnswer);
//       setFeedback(fb);
//     } catch (err) {
//       console.error("❌ Retry submission failed:", err);
//     }
//   };

//   return (
//     <div>
//       <button className="mb-4 btn btn-secondary" onClick={onBack}>← Back to Sessions</button>
//       <h3 className="text-xl font-bold mb-4">Session Details</h3>

//       {sessionQuestions?.map((q) => (
//         <div key={q._id} className="border p-4 mb-4 rounded shadow-sm bg-light">
//           <p><strong>Question:</strong> {q.question}</p>
//           <p><strong>Your Answer:</strong> {q.answer || "Not answered"}</p>
//           <p><strong>Feedback:</strong> {q.feedback || "No feedback yet"}</p>

//           {selectedQuestionId === q._id && (
//             <>
//               <textarea
//                 className="form-control mt-2"
//                 rows="3"
//                 value={retryAnswer}
//                 onChange={(e) => setRetryAnswer(e.target.value)}
//                 placeholder="Retry your answer..."
//               />
//               <button
//                 className="btn btn-outline-primary mt-2"
//                 onClick={handleSubmit}
//               >
//                 Submit Retry
//               </button>
//               {feedback && (
//                 <p className="mt-2 text-success">
//                   <strong>New Feedback:</strong> {feedback}
//                 </p>
//               )}
//             </>
//           )}

//           <button
//             className="btn btn-outline-secondary btn-sm mt-2"
//             onClick={() => handleRetry(q._id)}
//           >
//             🔁 Retry
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default SessionDetails;
import React, { useState } from "react";

const SessionDetails = ({ topic, sessionId, sessionQuestions, onBack, onRetrySubmit }) => {
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [retryAnswer, setRetryAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleRetry = (id) => {
    setSelectedQuestionId(id);
    setRetryAnswer("");
    setFeedback("");
  };

  const handleSubmit = async () => {
    try {
      const fb = await onRetrySubmit({
        _id: selectedQuestionId,
        answer: retryAnswer,
        topic,
        sessionId,
      });
      setFeedback(fb);
    } catch (err) {
      console.error("❌ Retry submission failed:", err);
    }
  };

  return (
    <div>
      <button className="mb-4 btn btn-secondary" onClick={onBack}>
        ← Back to Sessions
      </button>
      <h3 className="text-xl font-bold mb-4">Session Details</h3>

      {sessionQuestions?.map((q) => (
        <div key={q._id} className="border p-4 mb-4 rounded shadow-sm bg-light">
          <p><strong>Question:</strong> {q.question}</p>
          <p><strong>Your Answer:</strong> {q.answer || "Not answered"}</p>
          <p><strong>Feedback:</strong> {q.feedback || "No feedback yet"}</p>

          {selectedQuestionId === q._id && (
            <>
              <textarea
                className="form-control mt-2"
                rows="3"
                value={retryAnswer}
                onChange={(e) => setRetryAnswer(e.target.value)}
                placeholder="Retry your answer..."
              />
              <button
                className="btn btn-outline-primary mt-2"
                onClick={handleSubmit}
              >
                Submit Retry
              </button>
              {feedback && (
                <p className="mt-2 text-success">
                  <strong>New Feedback:</strong> {feedback}
                </p>
              )}
            </>
          )}

          <button
            className="btn btn-outline-secondary btn-sm mt-2"
            onClick={() => handleRetry(q._id)}
          >
            🔁 Retry
          </button>
        </div>
      ))}
    </div>
  );
};

export default SessionDetails;
