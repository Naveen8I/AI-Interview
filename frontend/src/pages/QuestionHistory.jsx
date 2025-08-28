
// import React, { useEffect, useState } from "react";
// import { fetchHistory, submitAnswer } from "../api/questionApi";
// import { useAuthStore } from "../store/authStore";

// const QuestionHistory = () => {
//   const [groupedHistory, setGroupedHistory] = useState({});
//   const [retryAnswer, setRetryAnswer] = useState("");
//   const [feedback, setFeedback] = useState("");
//   const [selectedQuestionId, setSelectedQuestionId] = useState(null);
//   const token = useAuthStore((state) => state.token);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const data = await fetchHistory(token);

//         if (data && typeof data === "object" && !Array.isArray(data)) {
//           setGroupedHistory(data); // ✅ fixed setter
//         } else {
//           console.error("❌ Invalid history format, expected object:", data);
//           setGroupedHistory({});
//         }
//       } catch (err) {
//         console.error("❌ Failed to load history:", err);
//       }
//     };
//     load();
//   }, [token]);

//   const handleRetry = (id) => {
//     setSelectedQuestionId(id);
//     setRetryAnswer("");
//     setFeedback("");
//   };

//   const handleSubmit = async () => {
//     try {
//       const data = await submitAnswer(token, selectedQuestionId, retryAnswer);
//       setFeedback(data.feedback);

//       // Update the grouped history locally
//       const newGrouped = { ...groupedHistory };
//       for (const topic in newGrouped) {
//         for (const session in newGrouped[topic]) {
//           newGrouped[topic][session] = newGrouped[topic][session].map((q) =>
//             q._id === selectedQuestionId
//               ? { ...q, answer: retryAnswer, feedback: data.feedback }
//               : q
//           );
//         }
//       }
//       setGroupedHistory(newGrouped);
//     } catch (err) {
//       console.error("❌ Failed to submit retry answer:", err);
//     }
//   };

//   return (
//     <div className="p-4 max-w-4xl mx-auto">
//       <h2 className="text-xl font-bold mb-4">📚 Question History (Grouped by Topic & Session)</h2>

//       {Object.entries(groupedHistory).map(([topic, sessions]) => (
//         <div key={topic} className="mb-6">
//           <h3 className="text-lg font-semibold text-primary mb-2">{topic.toUpperCase()}</h3>

//           {Object.entries(sessions).map(([sessionId, questions]) => (
//             <div key={sessionId} className="border border-gray-300 rounded-lg p-3 mb-4 shadow-sm">
//               <h4 className="font-semibold mb-2 text-secondary">Session: {sessionId}</h4>

//               {questions.map((item) => (
//                 <div key={item._id} className="border p-3 mb-3 rounded bg-light">
//                   <p><strong>Question:</strong> {item.question}</p>
//                   <p><strong>Your Answer:</strong> {item.answer}</p>
//                   <p><strong>Feedback:</strong> {item.feedback}</p>

//                   {item._id === selectedQuestionId && (
//                     <>
//                       <textarea
//                         className="w-full p-2 mt-2 border"
//                         rows="3"
//                         value={retryAnswer}
//                         onChange={(e) => setRetryAnswer(e.target.value)}
//                         placeholder="Retry your answer..."
//                       />
//                       <button
//                         className="btn btn-outline-primary mt-2"
//                         onClick={handleSubmit}
//                       >
//                         Submit Retry
//                       </button>
//                       {feedback && (
//                         <p className="mt-2 text-success">
//                           <strong>New Feedback:</strong> {feedback}
//                         </p>
//                       )}
//                     </>
//                   )}

//                   <button
//                     className="btn btn-outline-secondary btn-sm mt-2"
//                     onClick={() => handleRetry(item._id)}
//                   >
//                     🔁 Retry
//                   </button>
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// };


// import React, { useEffect, useState } from "react";
// import { fetchHistory } from "../api/questionApi";
// import { useAuthStore } from "../store/authStore";
// import TopicHistory from "./TopicHistory";
// import TopicSessions from "./TopicSessions";
// import SessionDetails from "./SessionDetails";

// const QuestionHistory = () => {
//   const [groupedHistory, setGroupedHistory] = useState({});
//   const [expandedTopic, setExpandedTopic] = useState(null);
//   const [expandedSession, setExpandedSession] = useState(null);
//   const token = useAuthStore((state) => state.token);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const data = await fetchHistory(token);
//         console.log("✅ Raw response: ", data);

//         if (data && typeof data === "object" && !Array.isArray(data)) {
//           setGroupedHistory(data);
//         } else {
//           console.error("❌ Invalid format:", data);
//         }
//       } catch (err) {
//         console.error("❌ Failed to load history:", err);
//       }
//     };
//     load();
//   }, [token]);

//   const handleTopicClick = (topic) => {
//     setExpandedTopic(topic);
//     setExpandedSession(null);
//   };

//   const handleSessionClick = (sessionId) => {
//     setExpandedSession(sessionId);
//   };

//   if (!expandedTopic) {
//     return (
//       <TopicHistory
//         groupedHistory={groupedHistory}
//         onTopicClick={handleTopicClick}
//       />
//     );
//   }

//   if (!expandedSession) {
//     return (
//       <TopicSessions
//         topic={expandedTopic}
//         sessions={groupedHistory[expandedTopic]}
//         onBack={() => setExpandedTopic(null)}
//         onSessionClick={handleSessionClick}
//       />
//     );
//   }

//   return (
//     <SessionDetails
//       topic={expandedTopic}
//       sessionId={expandedSession}
//       sessionQuestions={
//         groupedHistory?.[expandedTopic]?.[expandedSession] || []
//       }
//       onBack={() => setExpandedSession(null)}
//     />
//   );
// };

// export default QuestionHistory;
import React, { useEffect, useState } from "react";
import { fetchHistory } from "../api/questionApi";
import { useAuthStore } from "../store/authStore";
import TopicHistory from "./TopicHistory";
import TopicSessions from "./TopicSessions";
import SessionDetails from "./SessionDetails";
import { submitAnswer } from "../api/questionApi";

const QuestionHistory = () => {
  const [groupedHistory, setGroupedHistory] = useState({});
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [expandedSession, setExpandedSession] = useState(null);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchHistory(token);
        console.log("✅ Raw response: ", data);

        if (data && typeof data === "object" && !Array.isArray(data)) {
          setGroupedHistory(data);
        } else {
          console.error("❌ Invalid format:", data);
        }
      } catch (err) {
        console.error("❌ Failed to load history:", err);
      }
    };
    load();
  }, [token]);

  const handleTopicClick = (topic) => {
    setExpandedTopic(topic);
    setExpandedSession(null);
  };

  const handleSessionClick = (sessionId) => {
    setExpandedSession(sessionId);
  };

  

const handleRetrySubmit = async ({ _id, answer, sessionId, topic }) => {
  const data = await submitAnswer(token, _id, answer);
  const feedback = data.feedback;

  const updated = { ...groupedHistory };
  updated[topic][sessionId] = updated[topic][sessionId].map((q) =>
    q._id === _id ? { ...q, answer, feedback } : q
  );

  setGroupedHistory(updated);
  return feedback;
};


  if (!expandedTopic) {
    return (
      <TopicHistory
        groupedHistory={groupedHistory}
        onTopicClick={handleTopicClick}
      />
    );
  }

  if (!expandedSession) {
    return (
      <TopicSessions
        topic={expandedTopic}
        sessions={groupedHistory[expandedTopic]}
        onBack={() => setExpandedTopic(null)}
        onSessionClick={handleSessionClick}
      />
    );
  }

  return (
    <SessionDetails
  topic={expandedTopic}
  sessionId={expandedSession}
  sessionQuestions={groupedHistory?.[expandedTopic]?.[expandedSession] || []}
  onBack={() => setExpandedSession(null)}
  onRetrySubmit={handleRetrySubmit}
/>
  );
};

export default QuestionHistory;
