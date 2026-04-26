import React from "react";

function Sidebar() {
  const role = localStorage.getItem("role");

  return (
    <div>
      <a href="/dashboard">Dashboard</a>

      {role !== "student" && (
        <a href="/students">Students</a>
      )}

      {role === "admin" && (
        <>
          <a href="/users">User Management</a>
          <a href="/admin">Admin Panel</a>
        </>
      )}
    </div>
  );
}

export default Sidebar;