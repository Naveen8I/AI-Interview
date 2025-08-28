# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import google.generativeai as genai

# app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes

# # Configure Gemini API
# genai.configure(api_key="AIzaSyD4byU51vZr1l0s-Kf-yihViZrcS3ij7ck")
# model = genai.GenerativeModel("gemini-1.5-flash")

# @app.route('/generate-question', methods=['POST'])
# def generate_question():
#     data = request.json
#     topic = data.get("topic", "")
#     difficulty = data.get("difficulty", "medium")
#     previous_questions = data.get("previous_questions", [])

#     avoid_text = ""
#     if previous_questions:
#         avoid_text = "Avoid repeating these questions:\n" + "\n".join(previous_questions)

#     prompt = f"""
#     You are an AI interviewer. Ask a new **{difficulty.upper()} level** technical interview question on the topic: {topic}.
#     Make sure it's clear, concise, and suitable for a job interview.

#     {avoid_text}
#     """

#     try:
#         response = model.generate_content(prompt)
#         question = response.text.strip()
#         return jsonify({"question": question})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


# @app.route('/submit-answer', methods=['POST'])
# def submit_answer():
#     import json

#     data = request.json
#     question = data.get("question", "")
#     answer = data.get("answer", "")

#     prompt = f"""
#     You are an AI interviewer evaluating a candidate's response to a technical interview question.

#     Question: {question}
#     Answer: {answer}

#     First, assign a score between 0 to 10 (only integer) based on accuracy, clarity, and relevance.
#     Then, give short constructive feedback.

#     Respond in the following JSON format:
#     {{
#       "score": <score>,
#       "feedback": "<feedback>"
#     }}
#     """

#     try:
#         response = model.generate_content(prompt)
#         text = response.text.strip()

#         print("Gemini raw output:", text)

#         # Strip markdown backticks if present
#         if text.startswith("```"):
#             text = text.strip("`")
#             if text.startswith("json"):
#                 text = text[4:].strip()

#         parsed = json.loads(text)

#         # ✅ Log parsed parts
#         print("✅ Parsed Score:", parsed.get("score"))
#         print("✅ Parsed Feedback:", parsed.get("feedback"))

#         # Ensure score is a number
#         score = parsed.get("score", 0)
#         try:
#             score = int(score)
#         except:
#             score = 0

#         return jsonify({
#             "score": score,
#             "feedback": parsed.get("feedback", "No feedback available.")
#         })

#     except Exception as e:
#         print("❌ Error in Gemini scoring:", str(e))
#         return jsonify({"error": str(e)}), 500

# @app.route('/ask', methods=['POST'])
# def ask_question():
#     data = request.json
#     notes = data.get("notes", "")
#     question = data.get("question", "")
#     print(notes)
#     print(question)
#     prompt = f"""You are an assistant. Use the following syllabus/notes to answer the question.
#     Notes:{notes}
#     Question: {question}
#     """
#     print(prompt)
#     try:
#         print("Generating response...")
#         response = model.generate_content(prompt)
#         print(response.text.strip())
#         return jsonify({"answer": response.text.strip()})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# if __name__ == '__main__':
#     app.run(port=8000,debug =True)
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import json
import re

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure Gemini API
genai.configure(api_key="AIzaSyD4byU51vZr1l0s-Kf-yihViZrcS3ij7ck")
model = genai.GenerativeModel("gemini-1.5-flash")

def _extract_loose_json(text: str):
    """
    Gemini sometimes wraps JSON in code fences or adds prose.
    This attempts to pull the first {...} JSON object from text.
    """
    # Strip code fences if present
    t = text.strip()
    if t.startswith("```"):
        t = t.strip("`")
        if t.lower().startswith("json"):
            t = t[4:].strip()

    # Try strict parse
    try:
        return json.loads(t)
    except Exception:
        pass

    # Fallback: find first {...} block
    m = re.search(r"\{[\s\S]*\}", t)
    if not m:
        return None
    try:
        return json.loads(m.group(0))
    except Exception:
        return None


@app.route('/generate-question', methods=['POST'])
def generate_question():
    data = request.json or {}
    topic = data.get("topic", "")
    difficulty = data.get("difficulty", "medium")
    previous_questions = data.get("previous_questions", [])

    avoid_text = ""
    if previous_questions:
        avoid_text = "Avoid repeating these questions:\n" + "\n".join(previous_questions)

    prompt = f"""
    You are an AI interviewer. Ask a new {difficulty.upper()} level technical interview question
    on the topic: {topic}. Make sure it's clear, concise, and suitable for a job interview.

    {avoid_text}
    """

    try:
        response = model.generate_content(prompt)
        question = (response.text or "").strip()
        return jsonify({"question": question})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/submit-answer', methods=['POST'])
def submit_answer():
    data = request.json or {}
    question = data.get("question", "")
    answer = data.get("answer", "")

    prompt = f"""
    You are an AI interviewer evaluating a candidate's response to a technical interview question.

    Question: {question}
    Answer: {answer}

    First, assign a score between 0 to 10 (integer only) based on accuracy, clarity, and relevance.
    Then, give short constructive feedback.

    Respond ONLY in JSON with exactly this structure:
    {{
      "score": <integer 0-10>,
      "feedback": "<short feedback>"
    }}
    """

    try:
        response = model.generate_content(prompt)
        raw = (response.text or "").strip()
        print("Gemini raw output:", raw)

        parsed = _extract_loose_json(raw) or {"score": 0, "feedback": "No feedback available."}

        # normalize score
        score = parsed.get("score", 0)
        try:
            score = int(score)
        except Exception:
            score = 0

        return jsonify({
            "score": max(0, min(10, score)),
            "feedback": parsed.get("feedback", "No feedback available.")
        })

    except Exception as e:
        print("❌ Error in Gemini scoring:", str(e))
        return jsonify({"error": str(e)}), 500


@app.route("/check-plagiarism", methods=["POST"])
def check_plagiarism():
    """
    Returns:
      {
        "plagiarism_score": 0-100 (0=unique, 100=fully plagiarized),
        "is_plagiarized": true/false,
        "feedback": "short explanation"
      }
    """
    try:
        data = request.json or {}
        answer = (data.get("answer") or "").strip()

        if not answer:
            return jsonify({"error": "Answer is empty"}), 400

        prompt = f"""
        You are a plagiarism detection AI.
        Analyze the following answer for originality, potential copying from common online sources,
        and whether it looks AI-generated boilerplate.

        Answer:
        {answer}

        Respond ONLY in JSON (no extra text) with exactly these fields:
        {{
          "plagiarism_score": <integer 0-100>,
          "is_plagiarized": <true or false>,
          "feedback": "<short explanation>"
        }}
        """

        response = model.generate_content(prompt)
        raw = (response.text or "").strip()
        parsed = _extract_loose_json(raw) or {
            "plagiarism_score": 50,
            "is_plagiarized": False,
            "feedback": "Unable to conclusively analyze. Defaulting to neutral."
        }

        # normalize
        try:
            parsed["plagiarism_score"] = max(0, min(100, int(parsed.get("plagiarism_score", 50))))
        except Exception:
            parsed["plagiarism_score"] = 50
        parsed["is_plagiarized"] = bool(parsed.get("is_plagiarized", False))
        parsed["feedback"] = parsed.get("feedback", "No feedback")

        return jsonify(parsed)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/ask', methods=['POST'])
def ask_question():
    data = request.json or {}
    notes = data.get("notes", "")
    question = data.get("question", "")

    prompt = f"""You are an assistant. Use the following syllabus/notes to answer the question.
    Notes:
    {notes}

    Question:
    {question}
    """

    try:
        response = model.generate_content(prompt)
        return jsonify({"answer": (response.text or "").strip()})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(port=8000, debug=True)

