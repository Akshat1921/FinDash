import React, { useState, useEffect } from 'react';
import { AdminAPI } from '../../api/AdminAPI';
import type { AdminUser } from '../../api/AdminAPI';

interface AdminUsersProps {
  onRefresh: () => void;
}

export const AdminUsers: React.FC<AdminUsersProps> = ({ onRefresh }) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [stats, setStats] = useState({
    totalCount: 0,
    usersWithPortfolios: 0,
    adminUsers: 0,
    regularUsers: 0
  });
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'ROLE_USER'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await AdminAPI.getAllUsers();
      setUsers(response.users);
      setStats({
        totalCount: response.totalCount,
        usersWithPortfolios: response.usersWithPortfolios,
        adminUsers: response.adminUsers,
        regularUsers: response.regularUsers
      });
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // This would call admin endpoint to create user
      console.log('Creating user:', newUser);
      // await AdminAPI.createUser(newUser);
      setShowCreateUser(false);
      setNewUser({ fullName: '', email: '', password: '', role: 'ROLE_USER' });
      loadUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  React.useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
        <div className="flex gap-3">
          <button 
            className="bg-green-500/20 hover:bg-green-500/30 text-green-300 px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-green-500/30 backdrop-blur-sm flex items-center gap-2" 
            onClick={() => setShowCreateUser(true)}
          >
            ➕ Create User
          </button>
          <button 
            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-blue-500/30 backdrop-blur-sm flex items-center gap-2" 
            onClick={() => { loadUsers(); onRefresh(); }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
          <h3 className="text-sm font-medium text-white/70 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-white">{stats.totalCount}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
          <h3 className="text-sm font-medium text-white/70 mb-2">With Portfolios</h3>
          <p className="text-3xl font-bold text-blue-300">{stats.usersWithPortfolios}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
          <h3 className="text-sm font-medium text-white/70 mb-2">Admin Users</h3>
          <p className="text-3xl font-bold text-purple-300">{stats.adminUsers}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
          <h3 className="text-sm font-medium text-white/70 mb-2">Regular Users</h3>
          <p className="text-3xl font-bold text-green-300">{stats.regularUsers}</p>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-white mb-6">Create New User</h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Full Name:</label>
                <input
                  type="text"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Email:</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Password:</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Role:</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ROLE_USER" className="bg-gray-800 text-white">User</option>
                  <option value="ROLE_ADMIN" className="bg-gray-800 text-white">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-green-500/30"
                >
                  Create
                </button>
                <button 
                  type="button" 
                  className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-red-500/30" 
                  onClick={() => setShowCreateUser(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/10 border-b border-white/20">
                <th className="text-left py-4 px-6 text-sm font-semibold text-white/70">ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-white/70">Full Name</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-white/70">Email</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-white/70">Role</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-white/70">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-white/60">
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white/60"></div>
                        Loading users...
                      </div>
                    ) : (
                      'No users found. User management endpoint needs to be implemented.'
                    )}
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
                    <td className="py-4 px-6 text-white font-mono">{user.id}</td>
                    <td className="py-4 px-6 text-white font-medium">{user.fullName}</td>
                    <td className="py-4 px-6 text-white/80">{user.email}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        user.role.toLowerCase() === 'role_admin' 
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {user.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 border border-blue-500/30 flex items-center gap-1">
                          ✏️ Edit
                        </button>
                        <button className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 border border-red-500/30 flex items-center gap-1">
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
