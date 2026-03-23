import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiTruck, FiUsers, FiMap, FiCalendar, FiDollarSign, FiBarChart2, FiMapPin, FiNavigation, FiPackage, FiTag, FiBell, FiFileText, FiSettings, FiLogOut, FiMenu, FiX, FiChevronDown } from 'react-icons/fi';

const navItems = [
  { path: '/', icon: FiHome, label: 'Dashboard', exact: true },
  { path: '/fleet', icon: FiTruck, label: 'Fleet Management' },
  { path: '/employees', icon: FiUsers, label: 'Employees' },
  { path: '/trips', icon: FiCalendar, label: 'Trips' },
  { path: '/bookings', icon: FiFileText, label: 'Bookings' },
  { path: '/routes', icon: FiNavigation, label: 'Routes' },
  { path: '/live-map', icon: FiMapPin, label: 'Live Tracking' },
  { path: '/payroll', icon: FiDollarSign, label: 'Payroll' },
  { path: '/reports', icon: FiBarChart2, label: 'Reports' },
  { path: '/maintenance', icon: FiMap, label: 'Maintenance' },
  { path: '/lost-found', icon: FiPackage, label: 'Lost & Found' },
  { path: '/promotions', icon: FiTag, label: 'Promotions' },
  { path: '/notifications', icon: FiBell, label: 'Notifications' },
  { path: '/audit-log', icon: FiFileText, label: 'Audit Log' },
  { path: '/settings', icon: FiSettings, label: 'Settings' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-3 px-4 py-5 border-b border-primary-700">
        <div className="w-10 h-10 bg-secondary-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">GV</div>
        {sidebarOpen && (
          <div className="overflow-hidden">
            <h1 className="text-white font-bold text-sm leading-tight">GV Florida</h1>
            <p className="text-primary-300 text-xs">Transport Admin</p>
          </div>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map(({ path, icon: Icon, label, exact }) => (
          <NavLink
            key={path}
            to={path}
            end={exact}
            className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'}
            onClick={() => setMobileOpen(false)}
          >
            <Icon size={18} />
            {sidebarOpen && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-primary-700 p-3">
        <button onClick={handleLogout} className="sidebar-link w-full hover:bg-red-600/20 hover:text-red-300">
          <FiLogOut size={18} />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-primary-800 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 h-full bg-primary-800 flex flex-col">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-white"><FiX size={20} /></button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => { if (window.innerWidth < 1024) setMobileOpen(true); else setSidebarOpen(!sidebarOpen); }} className="text-gray-500 hover:text-gray-700">
              <FiMenu size={22} />
            </button>
            <h2 className="text-lg font-semibold text-gray-700 hidden sm:block">GV Florida Transport Inc.</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-gray-500 hover:text-gray-700">
              <FiBell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">3</span>
            </button>
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-700">{user?.first_name} {user?.last_name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
                </div>
                <FiChevronDown size={16} className="text-gray-400" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button onClick={() => { navigate('/settings'); setProfileOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Settings</button>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
