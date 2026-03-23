import React, { useState } from 'react';
import { FiSettings, FiSave, FiUser, FiLock, FiBell, FiGlobe } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({ first_name: user?.first_name || '', last_name: user?.last_name || '', email: user?.email || '', phone: user?.phone || '' });
  const [passwords, setPasswords] = useState({ current: '', new_password: '', confirm: '' });
  const [notifSettings, setNotifSettings] = useState({ email_alerts: true, sms_alerts: false, sos_alerts: true, booking_alerts: true, maintenance_alerts: true });
  const [company, setCompany] = useState({ name: 'GV Florida Transport Inc.', address: '832 AH Lacson Ave. Cor. Earnshaw St. Sampaloc, Manila', phone: '02-493-7956', email: 'gvfloridatrans@gmail.com' });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'security', label: 'Security', icon: FiLock },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'company', label: 'Company', icon: FiGlobe },
  ];

  const handleSave = () => toast.success('Settings saved successfully');

  return (
    <div className="space-y-6">
      <div><h1 className="page-title flex items-center gap-2"><FiSettings /> Settings</h1></div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Tabs */}
        <div className="lg:w-56 shrink-0">
          <div className="card space-y-1">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-left transition-all ${activeTab === tab.id ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="card space-y-6">
              <h2 className="section-title">Profile Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">First Name</label><input value={profile.first_name} onChange={e => setProfile({ ...profile, first_name: e.target.value })} className="input-field" /></div>
                <div><label className="block text-sm font-medium mb-1">Last Name</label><input value={profile.last_name} onChange={e => setProfile({ ...profile, last_name: e.target.value })} className="input-field" /></div>
                <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} className="input-field" /></div>
                <div><label className="block text-sm font-medium mb-1">Phone</label><input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} className="input-field" /></div>
              </div>
              <div className="flex justify-end"><button onClick={handleSave} className="btn-primary flex items-center gap-2"><FiSave size={14} /> Save Changes</button></div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card space-y-6">
              <h2 className="section-title">Change Password</h2>
              <div className="max-w-md space-y-4">
                <div><label className="block text-sm font-medium mb-1">Current Password</label><input type="password" value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })} className="input-field" /></div>
                <div><label className="block text-sm font-medium mb-1">New Password</label><input type="password" value={passwords.new_password} onChange={e => setPasswords({ ...passwords, new_password: e.target.value })} className="input-field" /></div>
                <div><label className="block text-sm font-medium mb-1">Confirm New Password</label><input type="password" value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} className="input-field" /></div>
              </div>
              <div className="flex justify-end"><button onClick={handleSave} className="btn-primary flex items-center gap-2"><FiSave size={14} /> Update Password</button></div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card space-y-6">
              <h2 className="section-title">Notification Preferences</h2>
              <div className="space-y-4">
                {Object.entries(notifSettings).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={val} onChange={() => setNotifSettings({ ...notifSettings, [key]: !val })} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                ))}
              </div>
              <div className="flex justify-end"><button onClick={handleSave} className="btn-primary flex items-center gap-2"><FiSave size={14} /> Save Preferences</button></div>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="card space-y-6">
              <h2 className="section-title">Company Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2"><label className="block text-sm font-medium mb-1">Company Name</label><input value={company.name} onChange={e => setCompany({ ...company, name: e.target.value })} className="input-field" /></div>
                <div className="sm:col-span-2"><label className="block text-sm font-medium mb-1">Address</label><input value={company.address} onChange={e => setCompany({ ...company, address: e.target.value })} className="input-field" /></div>
                <div><label className="block text-sm font-medium mb-1">Phone</label><input value={company.phone} onChange={e => setCompany({ ...company, phone: e.target.value })} className="input-field" /></div>
                <div><label className="block text-sm font-medium mb-1">Email</label><input value={company.email} onChange={e => setCompany({ ...company, email: e.target.value })} className="input-field" /></div>
              </div>
              <div className="flex justify-end"><button onClick={handleSave} className="btn-primary flex items-center gap-2"><FiSave size={14} /> Save Company Info</button></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
