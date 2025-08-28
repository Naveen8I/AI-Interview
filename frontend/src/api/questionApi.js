// import axios from "axios";

// const API = import.meta.env.VITE_API_BASE_URL;

// export const fetchHistory = async (token) => {
//   const res = await axios.get(`${API}/api/questions/history`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return res.data.history;
// };

// export const submitAnswer = async (token, questionId, answer) => {
//   const res = await axios.post(
//     `${API}/api/questions/submit`,
//     { questionId, answer },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
//   return res.data;
// };
// ✅ Corrected questionApi.js
//////////////////////////////////////////////
// import axios from "axios";

// const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001"; // fallback for dev


// export const fetchHistory = async (token) => {
//   try {
//     const res = await axios.get(`${API}/api/questions/history`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     console.log("✅ Raw response:", res.data);

//     // ✅ Accept grouped object as valid
//     if (res.data && typeof res.data === "object") {
//       return res.data;
//     } else {
//       console.error("❌ Unexpected history format:", res.data);
//       return {};
//     }
//   } catch (error) {
//     console.error("❌ Failed to fetch history:", error);
//     return {};
//   }
// };

// export const submitAnswer = async (token, questionId, answer) => {
//   try {
//     const res = await axios.post(
//       `${API}/api/questions/submit`,
//       { questionId, answer },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     return res.data;
//   } catch (error) {
//     console.error("❌ Failed to submit answer:", error);
//     throw error;
//   }
// };
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001"; // Node
const FLASK = import.meta.env.VITE_FLASK_BASE_URL || "http://localhost:8000"; // Flask

export const fetchHistory = async (token) => {
  try {
    const res = await axios.get(`${API}/api/questions/history`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.data && typeof res.data === "object") return res.data;
    return {};
  } catch (error) {
    console.error("❌ Failed to fetch history:", error);
    return {};
  }
};

export const submitAnswer = async (token, questionId, answer) => {
  const res = await axios.post(
    `${API}/api/questions/submit`,
    { questionId, answer },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const checkPlagiarism = async (answer) => {
  const res = await axios.post(`${FLASK}/check-plagiarism`, { answer });
  return res.data; // { plagiarism_score, is_plagiarized, feedback }
};

