import React from "react";

const TopicHistory = ({ groupedHistory, onTopicClick }) => {
  if (!groupedHistory || typeof groupedHistory !== "object") {
    return <p className="text-center text-muted">No history available.</p>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📚 Your Question Topics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Object.keys(groupedHistory).map((topic) => (
          <div
            key={topic}
            className="p-4 border rounded shadow cursor-pointer hover:bg-gray-100"
            onClick={() => onTopicClick(topic)}
          >
            <h3 className="text-lg font-semibold capitalize">{topic}</h3>
            <p className="text-sm text-muted">
              Sessions: {Object.keys(groupedHistory[topic]).length}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicHistory;
