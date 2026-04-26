import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [scoreFilter, setScoreFilter] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState("");
  const [recordsToShow, setRecordsToShow] = useState(50);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const role = (localStorage.getItem("role") || "")
    .trim()
    .toLowerCase();

  const displayedColumns = [
    "Gender",
    "Exam_Score",
    "Attendance",
    "Hours_Studied",
    "Physical_Activity",
  ];

  // ---------------- AUTH CHECK ----------------

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  // ---------------- DEBOUNCE FILTER ----------------

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilter(scoreFilter);
    }, 400);

    return () => clearTimeout(timer);
  }, [scoreFilter]);

  // ---------------- FETCH DATA ----------------

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://127.0.0.1:8000/students", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) =>
        setStudents(res.data.students || res.data)
      )
      .catch((err) => console.error(err));

    axios
      .get("http://127.0.0.1:8000/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setChartData(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  // ---------------- FILTER BY SCORE ----------------

  const filteredStudents = useMemo(() => {
    return students.filter((s) =>
      debouncedFilter === ""
        ? true
        : s.Exam_Score >= Number(debouncedFilter)
    );
  }, [students, debouncedFilter]);

  // ---------------- LIMIT TOP N ----------------

  const displayedStudents = useMemo(() => {
    return filteredStudents.slice(0, recordsToShow);
  }, [filteredStudents, recordsToShow]);

  // ---------------- NAVIGATE TO CHARTS ----------------

  const handleViewCharts = () => {
    navigate("/charts", {
      state: {
        // ✅ THIS IS THE KEY FIX
        filteredStudents: displayedStudents,

        // Optional extras (useful for showing filters in charts page)
        scoreFilter,
        recordsToShow,
      },
    });
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      <h1>📊 Student Dashboard</h1>

      <p>
        Logged in as:{" "}
        <b>{role || "unknown"}</b>
      </p>

      {/* ---------------- FILTERS ---------------- */}

      <div style={{ margin: "20px 0" }}>
        <label>
          Show students with score ≥{" "}
        </label>

        <input
          type="number"
          value={scoreFilter}
          onChange={(e) =>
            setScoreFilter(e.target.value)
          }
        />
      </div>

      <div style={{ margin: "20px 0" }}>
        <label>Show top </label>

        <input
          type="number"
          min="1"
          value={recordsToShow}
          onChange={(e) =>
            setRecordsToShow(
              Number(e.target.value)
            )
          }
        />

        <span> records</span>
      </div>

      {/* ---------------- VIEW CHART BUTTON ---------------- */}

      <button
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          cursor: "pointer",
        }}
        onClick={handleViewCharts}
      >
        📈 View Charts
      </button>

      {/* ---------------- TABLE ---------------- */}

      <h2>
        Students (Showing{" "}
        {displayedStudents.length} of{" "}
        {filteredStudents.length})
      </h2>

      <table
        border="1"
        cellPadding="8"
        style={{ width: "100%" }}
      >
        <thead>
          <tr>
            {displayedColumns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {displayedStudents.map((s, idx) => (
            <tr key={idx}>
              {displayedColumns.map((col) => (
                <td key={col}>
                  {s[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;