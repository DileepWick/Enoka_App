import React, { useState, useEffect } from "react";
// import { getUsers, toggleUserStatus } from "../services/api";
import axiosInstance from "@/config/axiosInstance";

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const handleToggleStatus = async (id) => {
    await toggleUserStatus(id);
    fetchUsers();
  };

  const getUsers = async () => {
    const response = await axiosInstance.get('/api/users');
    return response.data.users;
  };
  
  const toggleUserStatus = async (id) => {
    await axiosInstance.put(`/api/users/status/${id}`);
  };

  return (
    <div>
      <h1>User Management</h1>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{`${user.firstName} ${user.lastName}`}</td>
              <td>{user.email}</td>
              <td>{user.active === "1" ? "Active" : "Inactive"}</td>
              <td>
                <button
                  onClick={() => handleToggleStatus(user._id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Toggle Status
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
