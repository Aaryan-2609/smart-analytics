"use client";

import React, { useState, useEffect } from "react";
import {
  IconUsers,
  IconArrowLeft,
  IconServer,
  IconUpload,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import axios from "../api/config";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({
    totalUsers: 0,
    totalFiles: 0,
    storageUsed: "0 MB",
    users: [],
    summary: {
      sharedFiles: 0,
      deletedFiles: 0,
      activeUsers: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await axios.get('/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAdminData(response.data.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      if (error.response?.status === 401) {
        alert('Access denied. Admin privileges required.');
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearStorage = async () => {
    if (!window.confirm('Are you sure you want to clear ALL storage? This action cannot be undone!')) {
      return;
    }

    try {
      setClearing(true);
      await axios.delete('/admin/clear-storage', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      alert('Storage cleared successfully!');
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error('Error clearing storage:', error);
      alert('Failed to clear storage');
    } finally {
      setClearing(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This will also delete all their files and charts.')) {
      return;
    }

    try {
      await axios.delete(`/admin/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      alert('User deleted successfully!');
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleEditUser = async (userId) => {
    const newRole = prompt('Enter new role (Admin/User):');
    if (!newRole || !['Admin', 'User'].includes(newRole)) {
      alert('Invalid role. Please enter "Admin" or "User"');
      return;
    }

    try {
      await axios.patch(`/admin/users/${userId}/role`, 
        { role: newRole },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      alert('User role updated successfully!');
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user role');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-purple-400 hover:text-purple-300 flex items-center gap-2"
          >
            <IconArrowLeft size={18} />
            Dashboard
          </button>
          <h1 className="text-3xl font-bold mt-2">🛡️ Admin Dashboard</h1>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard 
          title="Total Users" 
          value={adminData.totalUsers.toString()} 
          icon={<IconUsers />} 
        />
        <StatCard 
          title="Files Uploaded" 
          value={adminData.totalFiles.toString()} 
          icon={<IconUpload />} 
        />
        <StatCard 
          title="Charts Created" 
          value={(adminData.totalCharts || 0).toString()} 
          icon={<IconUpload />} 
        />
        <StatCard 
          title="Storage Used" 
          value={adminData.storageUsed} 
          icon={<IconServer />} 
        />
      </div>

      {/* Data Usage Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-neutral-800">
          <h2 className="text-lg font-semibold text-purple-300 mb-4">
            Data Usage Summary
          </h2>
          <ul className="text-sm space-y-2">
            <li className="flex justify-between">
              <span>Total Users</span>
              <span>{adminData.totalUsers}</span>
            </li>
            <li className="flex justify-between">
              <span>Shared Files</span>
              <span>{adminData.summary.sharedFiles}</span>
            </li>
            <li className="flex justify-between">
              <span>Deleted Files</span>
              <span>{adminData.summary.deletedFiles}%</span>
            </li>
          </ul>
        </div>

        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-neutral-800">
          <h2 className="text-lg font-semibold text-purple-300 mb-4">
            Monitor Excel Usage
          </h2>
          <div className="text-sm space-y-3">
            <div className="flex justify-between">
              <span>Current Uploads</span>
              <span>{adminData.totalFiles} files</span>
            </div>
            <div className="flex justify-between">
              <span>Active Users</span>
              <span>{adminData.summary.activeUsers}</span>
            </div>
            <button
              onClick={handleClearStorage}
              disabled={clearing}
              className={`mt-4 px-4 py-2 rounded-md text-sm transition ${
                clearing 
                  ? 'bg-neutral-600 text-neutral-400 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-500'
              }`}
            >
              {clearing ? '🔄 Clearing...' : '🗑️ Clear Storage'}
            </button>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-[#1a1a1a] rounded-lg p-6 border border-neutral-800">
        <h2 className="text-lg font-semibold text-purple-300 mb-4">
          👥 User Management
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-purple-400 border-b border-neutral-700">
                <th className="py-2">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Uploads</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminData.users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-neutral-800 hover:bg-neutral-800 transition"
                >
                  <td className="py-3">{user.name}</td>
                  <td className="text-neutral-400">{user.email}</td>
                  <td>
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.role === 'Admin' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-neutral-600 text-neutral-300'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.uploads}</td>
                  <td className="text-right space-x-3">
                    <button
                      onClick={() => handleEditUser(user._id)}
                      className="text-yellow-400 hover:text-yellow-300"
                      title="Edit Role"
                    >
                      <IconEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-500 hover:text-red-400"
                      title="Delete User"
                    >
                      <IconTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Card component
const StatCard = ({ title, value, icon }) => (
  <div className="bg-[#1a1a1a] border border-neutral-800 rounded-lg p-5 shadow hover:shadow-md transition flex justify-between items-center">
    <div>
      <p className="text-sm text-neutral-400">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
    <div className="text-purple-400">{icon}</div>
  </div>
);
