import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get the token from localStorage
    const token = localStorage.getItem('access_token');

    if (!token) {
      // If no token is found, redirect to login
      console.log("No token found, redirecting...");
      window.location.href = '/login';
    } else {
      // 2. Token found! Set user data and stop loading
      // In a real app, you'd fetch the user profile here using the token
      setUser({ email: 'Logged In User' }); 
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_type');
    window.location.href = '/login';
  };

  // While checking for the token, show a loader
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Verifying Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white hidden md:flex flex-col shadow-xl">
        <div className="p-6 text-2xl font-bold border-b border-indigo-800 tracking-tight">
          Admin<span className="text-indigo-400">Panel</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 text-sm font-medium">
          <a href="#" className="block py-3 px-4 rounded-lg bg-indigo-800 shadow-inner">Dashboard</a>
          <a href="#" className="block py-3 px-4 rounded-lg hover:bg-indigo-800 transition-all">Profile</a>
          <a href="#" className="block py-3 px-4 rounded-lg hover:bg-indigo-800 transition-all">Analytics</a>
          <a href="#" className="block py-3 px-4 rounded-lg hover:bg-indigo-800 transition-all">Settings</a>
        </nav>
        <div className="p-4 border-t border-indigo-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 py-2.5 rounded-lg font-semibold transition-colors shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm py-4 px-8 flex justify-between items-center border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">System Overview</h1>
          <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
            <div className="h-7 w-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700">{user?.email}</span>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <p className="text-xs text-gray-400 uppercase font-black tracking-wider">Storage Usage</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">82%</h3>
              <div className="w-full bg-gray-100 h-2 mt-4 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[82%]"></div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <p className="text-xs text-gray-400 uppercase font-black tracking-wider">Security Status</p>
              <h3 className="text-3xl font-bold text-green-500 mt-1">Protected</h3>
              <p className="text-xs text-green-600 mt-2 font-medium">SSL Active • Firewall ON</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <p className="text-xs text-gray-400 uppercase font-black tracking-wider">API Requests</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">1,284</h3>
              <p className="text-xs text-gray-500 mt-2">Last 24 hours</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-2xl shadow-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-2">Welcome Back!</h3>
            <p className="text-indigo-100 max-w-md">
              Your session is active. You can now access protected resources using the token stored in your browser.
            </p>
            <div className="mt-6 flex gap-4">
              <button className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors">
                View Reports
              </button>
              <button className="bg-indigo-500/30 border border-indigo-400 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-indigo-500/50 transition-colors">
                Support
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;