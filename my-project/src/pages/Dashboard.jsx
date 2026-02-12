import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AskAI from './AskAI';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
    } else {
      setUser({ email: 'admin@company.com', name: 'Admin User' });
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear user-specific chat history before removing email
    const userEmail = localStorage.getItem('user_email');
    if (userEmail) {
      localStorage.removeItem(`ai_chats_${userEmail}`);
      localStorage.removeItem(`ai_active_chat_${userEmail}`);
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('user_email');
    navigate('/login');
  };

  const stats = [
    { label: 'Total Users', value: '8,249', change: '+12.5%', up: true, icon: '👥', color: 'from-blue-500 to-blue-600' },
    { label: 'Revenue', value: '$45,231', change: '+8.2%', up: true, icon: '💰', color: 'from-emerald-500 to-emerald-600' },
    { label: 'Active Sessions', value: '1,284', change: '-3.1%', up: false, icon: '📊', color: 'from-violet-500 to-violet-600' },
    { label: 'Conversion Rate', value: '3.24%', change: '+2.4%', up: true, icon: '🎯', color: 'from-amber-500 to-amber-600' },
  ];

  const recentActivity = [
    { user: 'Sarah Johnson', action: 'Completed purchase', time: '2 min ago', avatar: 'SJ', status: 'success' },
    { user: 'Mike Chen', action: 'Updated profile settings', time: '15 min ago', avatar: 'MC', status: 'info' },
    { user: 'Emily Davis', action: 'Submitted support ticket', time: '1 hour ago', avatar: 'ED', status: 'warning' },
    { user: 'James Wilson', action: 'Uploaded new document', time: '2 hours ago', avatar: 'JW', status: 'info' },
    { user: 'Anna Lee', action: 'Made a payment of $299', time: '3 hours ago', avatar: 'AL', status: 'success' },
  ];

  const projects = [
    { name: 'Website Redesign', progress: 75, status: 'In Progress', team: 4 },
    { name: 'Mobile App v2.0', progress: 45, status: 'In Progress', team: 6 },
    { name: 'API Integration', progress: 90, status: 'Review', team: 3 },
    { name: 'Database Migration', progress: 100, status: 'Completed', team: 2 },
  ];

  const sidebarLinks = [
    {
      id: 'dashboard', label: 'Dashboard', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    {
      id: 'ask-ai', label: 'Ask AI', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      id: 'analytics', label: 'Analytics', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'projects', label: 'Projects', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      )
    },
    {
      id: 'messages', label: 'Messages', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      )
    },
    {
      id: 'settings', label: 'Settings', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-500/30 rounded-full animate-spin border-t-indigo-500"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-indigo-400 opacity-20"></div>
          </div>
          <p className="text-indigo-300 font-medium tracking-wide animate-pulse">Verifying Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-indigo-50 flex">

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950
        text-white flex flex-col shadow-2xl
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        {/* Logo */}
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Dash<span className="text-indigo-400">Board</span></h1>
            <p className="text-xs text-slate-400">Admin Panel v2.0</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <p className="text-xs uppercase text-slate-500 font-semibold tracking-wider px-3 mb-3">Main Menu</p>
          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                if (link.route) { navigate(link.route); }
                setActiveTab(link.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-200
                ${activeTab === link.id
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              {link.icon}
              {link.label}
              {link.id === 'ask-ai' && (
                <span className="ml-auto bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">NEW</span>
              )}
              {link.id === 'messages' && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">3</span>
              )}
            </button>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm font-bold shadow-lg">
              {user?.name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 border border-red-500/20 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/25"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-xl shadow-sm py-4 px-6 md:px-8 flex justify-between items-center border-b border-gray-200/50 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Welcome back, {user?.name} 👋</h1>
              <p className="text-sm text-gray-500">Here's what's happening with your projects today.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden lg:flex items-center bg-gray-100 rounded-xl px-4 py-2 gap-2 border border-transparent focus-within:border-indigo-300 focus-within:bg-white transition-all">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search..." className="bg-transparent text-sm outline-none w-48 placeholder-gray-400" />
            </div>

            {/* Notification Bell */}
            <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl">{stat.icon}</span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${stat.up
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-red-50 text-red-600'
                        }`}>
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{stat.value}</h3>
                    <p className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</p>
                    <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${stat.color} transition-all duration-1000 group-hover:w-full`}
                        style={{ width: `${60 + index * 10}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 rounded-2xl shadow-xl p-8 text-white mb-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoLTZWMzRoNnptMC0xMHY2aC02VjI0aDZ6bTAtMTB2Nkg4VjE0aDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">Your Session is Active 🚀</h3>
                  <p className="text-indigo-100 max-w-lg text-sm md:text-base leading-relaxed">
                    You're authenticated and ready to go. Access all your protected resources, manage your projects, and track your performance metrics from this dashboard.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all duration-200 shadow-lg shadow-black/10 hover:shadow-xl">
                      View Reports
                    </button>
                    <button className="bg-white/10 backdrop-blur border border-white/20 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-white/20 transition-all duration-200">
                      Quick Actions
                    </button>
                  </div>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
                      <p className="text-sm text-gray-500">Latest actions from your team</p>
                    </div>
                    <button className="text-sm text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">View All</button>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {recentActivity.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-5 hover:bg-gray-50/50 transition-colors">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md ${item.status === 'success' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' :
                          item.status === 'warning' ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                            'bg-gradient-to-br from-blue-400 to-blue-600'
                          }`}>
                          {item.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800">{item.user}</p>
                          <p className="text-xs text-gray-500 truncate">{item.action}</p>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap font-medium">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">Active Projects</h3>
                    <p className="text-sm text-gray-500">Track project progress</p>
                  </div>
                  <div className="p-4 space-y-4">
                    {projects.map((project, index) => (
                      <div key={index} className="p-4 rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-sm transition-all duration-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-bold text-gray-800">{project.name}</h4>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${project.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                            project.status === 'Review' ? 'bg-amber-50 text-amber-600' :
                              'bg-blue-50 text-blue-600'
                            }`}>
                            {project.status}
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${project.progress === 100 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
                              project.progress >= 75 ? 'bg-gradient-to-r from-indigo-400 to-indigo-500' :
                                'bg-gradient-to-r from-blue-400 to-blue-500'
                              }`}
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 font-medium">{project.progress}% complete</span>
                          <span className="text-xs text-gray-400">{project.team} members</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'ask-ai' && <AskAI />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
