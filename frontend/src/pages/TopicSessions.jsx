// TopicSessions.jsx
import React from "react";

const TopicSessions = ({ topic, sessions, onBack, onSessionClick }) => {
  return (
    <div className="p-4">
      <button className="mb-4 btn btn-secondary" onClick={onBack}>← Back</button>
      <h3 className="text-xl font-bold mb-4">Sessions for {topic}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(sessions).map(([sessionId, questions]) => (
          <div
            key={sessionId}
            className="p-4 border rounded shadow cursor-pointer hover:bg-gray-100"
            onClick={() => onSessionClick(sessionId)}
          >
            <h4 className="font-semibold">Session ID: {sessionId}</h4>
            <p className="text-sm text-muted">
              {questions[0]?.createdAt
                ? new Date(questions[0].createdAt).toLocaleString()
                : "Unknown Date"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicSessions;