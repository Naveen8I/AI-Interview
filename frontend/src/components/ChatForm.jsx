// ChatForm.jsx
import { useState } from "react";
import axios from "axios";

function ChatForm() {
  const [notes, setNotes] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAnswer("");
    try {
      const res = await axios.post("http://localhost:8000/ask", {
        notes,
        question,
      });
      setAnswer(res.data.answer);
    } catch (err) {
      console.error("Error:", err);
      setAnswer("Something went wrong. Check the server.");
    }
    setLoading(false);
  };

  return (
    
    <div className="container mt-5">
      <h2 className="mb-4 text-center">💬 Chat with Your Notes</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Paste Your Notes / Syllabus</label>
          <textarea
            className="form-control"
            rows="6"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Ask a Question</label>
          <input
            type="text"
            className="form-control"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {loading ? "Thinking..." : "Ask Panda"}
        </button>
      </form>

      {answer && (
        <div
          className="alert alert-success mt-4"
          dangerouslySetInnerHTML={{
            __html:
              `<strong>Answer:</strong><br>` + answer.replace(/\*\*/g, "<br>"),
          }}
        />
      )}
    </div>
  );
}

export default ChatForm;
