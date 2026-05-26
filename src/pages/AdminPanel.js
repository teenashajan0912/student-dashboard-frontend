import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";

function AdminPanel() {
  const [users, setUsers] = useState([]);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get(`${config.BASE_URL}${config.API.USERS}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUsers(res.data);
  };

  const updateRole = async (id, newRole) => {
    await axios.put(
      `${config.BASE_URL}${config.API.USERS}/${id}/role`,
      null,
      {
        params: { new_role: newRole },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchUsers();
  };

  const deleteUser = async (id) => {
    await axios.delete(`${config.BASE_URL}${config.API.USERS}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchUsers();
  };

  if (role !== "admin") {
    return <h2>Access Denied</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>👑 Admin Panel</h1>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Change Role</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>

              <td>
                <select
                  value={u.role}
                  onChange={(e) => updateRole(u.id, e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="professor">Professor</option>
                  <option value="admin">Admin</option>
                </select>
              </td>

              <td>
                <button onClick={() => deleteUser(u.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;