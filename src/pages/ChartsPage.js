import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

function ChartsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { filteredStudents = [] } = location.state || {};

  const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28"];

  const [activeKey, setActiveKey] = useState(null);

  // ===============================
  // BAR LEGEND CLICK ONLY
  // ===============================

  const handleLegendClick = (data) => {
    const key = data.dataKey;

    if (activeKey === key) {
      setActiveKey(null); // reset
    } else {
      setActiveKey(key);
    }
  };

  const resetCharts = () => {
    setActiveKey(null);
  };

  // ===============================
  // BAR DATA
  // ===============================

  const barData = useMemo(() => {
    const categories = {
      Low: {
        Level: "Low",
        Male: 0,
        Female: 0,
        Avg_Attendance: 0,
        Avg_Hours_Studied: 0,
        count: 0,
      },
      Medium: {
        Level: "Medium",
        Male: 0,
        Female: 0,
        Avg_Attendance: 0,
        Avg_Hours_Studied: 0,
        count: 0,
      },
      High: {
        Level: "High",
        Male: 0,
        Female: 0,
        Avg_Attendance: 0,
        Avg_Hours_Studied: 0,
        count: 0,
      },
    };

    filteredStudents.forEach((s) => {
      const score = Number(s.Exam_Score) || 0;

      let key = "Low";

      if (score > 50 && score <= 75)
        key = "Medium";
      else if (score > 75)
        key = "High";

      const cat = categories[key];

      if (s.Gender === "Male") cat.Male++;
      if (s.Gender === "Female") cat.Female++;

      cat.Avg_Attendance += Number(s.Attendance) || 0;
      cat.Avg_Hours_Studied += Number(s.Hours_Studied) || 0;

      cat.count++;
    });

    return Object.values(categories).map((cat) => ({
      Level: cat.Level,
      Male: cat.Male,
      Female: cat.Female,
      Avg_Attendance: cat.count
        ? cat.Avg_Attendance / cat.count
        : 0,
      Avg_Hours_Studied: cat.count
        ? cat.Avg_Hours_Studied / cat.count
        : 0,
    }));
  }, [filteredStudents]);

  // ===============================
  // PIE DATA (Gender-aware)
  // ===============================

  const pieData = useMemo(() => {
    let filtered = filteredStudents;

    if (activeKey === "Male") {
      filtered = filteredStudents.filter(
        (s) => s.Gender === "Male"
      );
    }

    if (activeKey === "Female") {
      filtered = filteredStudents.filter(
        (s) => s.Gender === "Female"
      );
    }

    const activityMap = {};

    filtered.forEach((s) => {
      const activity =
        s.Physical_Activity || "Unknown";

      activityMap[activity] =
        (activityMap[activity] || 0) + 1;
    });

    return Object.entries(activityMap).map(
      ([key, value]) => ({
        name: key,
        value: value,
      })
    );
  }, [filteredStudents, activeKey]);

  // ===============================
  // LINE DATA (Gender-aware)
  // ===============================

  const lineData = useMemo(() => {
    let filtered = filteredStudents;

    if (activeKey === "Male") {
      filtered = filteredStudents.filter(
        (s) => s.Gender === "Male"
      );
    }

    if (activeKey === "Female") {
      filtered = filteredStudents.filter(
        (s) => s.Gender === "Female"
      );
    }

    return filtered.map((s, idx) => ({
      name: `S${idx + 1}`,
      Hours_Studied:
        Number(s.Hours_Studied) || 0,
      Attendance:
        Number(s.Attendance) || 0,
    }));
  }, [filteredStudents, activeKey]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>📊 Charts Dashboard</h1>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => navigate(-1)}
          style={{ marginRight: "10px" }}
        >
          Back to Table
        </button>

        <button onClick={resetCharts}>
          Reset / Show All
        </button>
      </div>

      {/* ================= BAR ================= */}

      <h2>📈 Performance Overview</h2>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={barData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="Level" />
          <YAxis />
          <Tooltip />

          {/* ONLY THIS LEGEND IS CLICKABLE */}

          <Legend
            verticalAlign="bottom"
            onClick={handleLegendClick}
          />

          <Bar
            dataKey="Male"
            fill="#3498db"
            hide={
              activeKey &&
              activeKey !== "Male"
            }
          />

          <Bar
            dataKey="Female"
            fill="#e91e63"
            hide={
              activeKey &&
              activeKey !== "Female"
            }
          />

          <Bar
            dataKey="Avg_Attendance"
            fill="#2ecc71"
            hide={
              activeKey &&
              activeKey !== "Avg_Attendance"
            }
          />

          <Bar
            dataKey="Avg_Hours_Studied"
            fill="#f39c12"
            hide={
              activeKey &&
              activeKey !== "Avg_Hours_Studied"
            }
          />
        </BarChart>
      </ResponsiveContainer>

      {/* ================= PIE ================= */}

      <h2>🥧 Physical Activity Distribution</h2>

      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={120}
            dataKey="value"
            label
          >
            {pieData.map((_, index) => (
              <Cell
                key={index}
                fill={
                  COLORS[index % COLORS.length]
                }
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* ================= LINE ================= */}

      <h2>📉 Study vs Attendance</h2>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />

          {/* NOT CLICKABLE */}

          <Legend verticalAlign="bottom" />

          <Line
            type="monotone"
            dataKey="Hours_Studied"
            stroke="#8884d8"
            hide={
              activeKey === "Avg_Attendance"
            }
          />

          <Line
            type="monotone"
            dataKey="Attendance"
            stroke="#ff7300"
            hide={
              activeKey === "Avg_Hours_Studied"
            }
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChartsPage;