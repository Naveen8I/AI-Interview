// import React from 'react';
// import { useAuthStore } from '../store/authStore';

// const Dashboard = () => {
//   const { user } = useAuthStore();

//   return (
//     <div className="container mt-5">
//       <div className="card shadow-sm">
//         <div className="card-body">
//           <h2 className="card-title text-center mb-4">Welcome to the Dashboard</h2>

//           {user ? (
//             <div className="text-center">
//               <p><strong>Name:</strong> {user.name}</p>
//               <p><strong>Email:</strong> {user.email}</p>
//             </div>
//           ) : (
//             <p className="text-center text-muted">User information not available.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [performanceData, setPerformanceData] = useState([]);
  const [sectionData, setSectionData] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/questions/performance-chart', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Prepare performance over time (session-wise)
      const data = res.data.map((s, i) => ({
        session: `#${i + 1}`,
        score: Number(s.averageScore),
        topic: s.topic,
        date: new Date(s.createdAt).toLocaleDateString(),
      }));
      setPerformanceData(data);

      // Prepare section-wise avg scores
      const sectionMap = {};
      for (const s of res.data) {
        if (!sectionMap[s.topic]) sectionMap[s.topic] = { topic: s.topic, total: 0, count: 0 };
        sectionMap[s.topic].total += s.averageScore;
        sectionMap[s.topic].count += 1;
      }
      const sectionBarData = Object.values(sectionMap).map((t) => ({
        topic: t.topic,
        average: (t.total / t.count).toFixed(2),
      }));

      setSectionData(sectionBarData);
    } catch (err) {
      console.error('❌ Failed to load performance chart:', err.message);
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow-sm mb-4">
        <div className="card-body text-center">
          <h2 className="mb-3">🎯 Dashboard</h2>
          {user ? (
            <>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </>
          ) : (
            <p className="text-muted">User not logged in.</p>
          )}
        </div>
      </div>

      <div className="row g-4">
        {/* Line Chart */}
        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <h5 className="mb-3 text-primary">📈 Performance Over Sessions</h5>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="session" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section-wise Bar Chart */}
        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <h5 className="mb-3 text-success">📊 Section-wise Performance</h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="topic" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="average" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
