import React, { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Trash2,
  Search,
  RefreshCw,
  Shield,
  Mail,
  Calendar,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import {
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  User,
} from "../../apis/user";

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    if (
      !window.confirm(
        `Are you sure you want to ${currentStatus ? "deactivate" : "activate"} this user?`,
      )
    ) {
      return;
    }

    try {
      await toggleUserStatus(userId);
      fetchUsers();
    } catch (error: any) {
      console.error("Error toggling user status:", error);
      alert(error.message || "Failed to toggle user status. Please try again.");
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${userName}? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await deleteUser(userId);
      fetchUsers();
    } catch (error: any) {
      console.error("Error deleting user:", error);
      alert(error.message || "Failed to delete user. Please try again.");
    }
  };

  // Filter to only show user role accounts (exclude admins)
  const userRoleAccounts = users.filter((user) => user.role === "user");

  const filteredUsers = userRoleAccounts.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && user.isActive) ||
      (filterStatus === "inactive" && !user.isActive);
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: userRoleAccounts.length,
    active: userRoleAccounts.filter((u) => u.isActive).length,
    inactive: userRoleAccounts.filter((u) => !u.isActive).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                <Users className="text-blue-600" size={32} />
                User Management
              </h1>
              <p className="text-gray-500 mt-1">
                Manage registered users and their access
              </p>
            </div>
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.total}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users size={24} className="text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Active</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {stats.active}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <UserCheck size={24} className="text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Inactive</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">
                    {stats.inactive}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <UserX size={24} className="text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <RefreshCw
                size={32}
                className="animate-spin text-blue-600 mx-auto mb-4"
              />
              <p className="text-gray-500">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <Users size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">
                No users found
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="font-medium text-gray-900">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={14} />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {user.role === "admin" ? (
                            <span className="flex items-center gap-1">
                              <Shield size={12} /> Admin
                            </span>
                          ) : (
                            "User"
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${
                            user.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.isActive ? (
                            <>
                              <CheckCircle2 size={12} /> Active
                            </>
                          ) : (
                            <>
                              <AlertTriangle size={12} /> Inactive
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Calendar size={14} />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              handleToggleStatus(user._id, user.isActive)
                            }
                            className={`p-2 rounded-lg transition-colors ${
                              user.isActive
                                ? "text-orange-600 hover:bg-orange-50"
                                : "text-green-600 hover:bg-green-50"
                            }`}
                            title={user.isActive ? "Deactivate" : "Activate"}
                          >
                            {user.isActive ? (
                              <UserX size={18} />
                            ) : (
                              <UserCheck size={18} />
                            )}
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteUser(user._id, user.name)
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Results Summary */}
        {!loading && filteredUsers.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Showing {filteredUsers.length} of {userRoleAccounts.length} users
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
