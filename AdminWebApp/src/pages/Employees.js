import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiSearch, FiPhone, FiMail } from 'react-icons/fi';
import { employeeAPI } from '../services/api';
import { toast } from 'react-toastify';

const ROLES = ['driver', 'conductor', 'inspector', 'mechanic', 'dispatcher', 'hr', 'admin'];

function EmployeeModal({ employee, onClose, onSave }) {
  const generateUserId = (role) => {
    const prefixes = { driver: 'GVF-D', conductor: 'GVF-C', inspector: 'GVF-I', mechanic: 'GVF-M', dispatcher: 'GVF-X', hr: 'GVF-H', admin: 'GVF-A' };
    const prefix = prefixes[role] || 'GVF-S';
    const num = String(Math.floor(Math.random() * 9000) + 1000);
    return prefix + num;
  };
  const [form, setForm] = useState(employee || { first_name: '', last_name: '', email: '', phone: '', role: 'driver', license_number: '', status: 'active', user_id: '' });
  const [saving, setSaving] = useState(false);
  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    if (e.target.name === 'role' && !employee?.id && !form.user_id) {
      updated.user_id = generateUserId(e.target.value);
    }
    setForm(updated);
  };
  const handleGenerateId = () => setForm({ ...form, user_id: generateUserId(form.role) });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = { ...form, user_id: form.user_id || generateUserId(form.role) };
    setSaving(true);
    try {
      if (employee?.id) await employeeAPI.update(employee.id, submitData);
      else await employeeAPI.create(submitData);
      toast.success(employee?.id ? 'Employee updated' : 'Employee added');
      onSave();
    } catch (err) { toast.error(err.response?.data?.error || 'Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">{employee?.id ? 'Edit Employee' : 'Add Employee'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">User ID</label>
              <div className="flex gap-2">
                <input name="user_id" value={form.user_id} onChange={handleChange} className="input-field flex-1 font-mono font-bold tracking-wider" placeholder="Auto-generated" readOnly={!!employee?.id} />
                {!employee?.id && <button type="button" onClick={handleGenerateId} className="px-3 py-2 bg-primary-100 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-200 transition-colors whitespace-nowrap">Generate ID</button>}
              </div>
              <p className="text-xs text-gray-400 mt-1">Unique login ID for the Staff App (e.g. GVF-D1234)</p>
            </div>
            <div><label className="block text-sm font-medium mb-1">First Name</label><input name="first_name" value={form.first_name} onChange={handleChange} className="input-field" required /></div>
            <div><label className="block text-sm font-medium mb-1">Last Name</label><input name="last_name" value={form.last_name} onChange={handleChange} className="input-field" required /></div>
            <div><label className="block text-sm font-medium mb-1">Email</label><input name="email" type="email" value={form.email} onChange={handleChange} className="input-field" required /></div>
            <div><label className="block text-sm font-medium mb-1">Phone</label><input name="phone" value={form.phone} onChange={handleChange} className="input-field" /></div>
            <div><label className="block text-sm font-medium mb-1">Role</label><select name="role" value={form.role} onChange={handleChange} className="input-field">{ROLES.map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}</select></div>
            <div><label className="block text-sm font-medium mb-1">License #</label><input name="license_number" value={form.license_number} onChange={handleChange} className="input-field" /></div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');

  useEffect(() => { loadEmployees(); }, []);

  const loadEmployees = async () => {
    try {
      const { data } = await employeeAPI.getAll();
      setEmployees(data.employees || data || []);
    } catch (err) { toast.error('Failed to load employees'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this employee?')) return;
    try { await employeeAPI.delete(id); toast.success('Employee removed'); loadEmployees(); }
    catch (err) { toast.error('Delete failed'); }
  };

  const filtered = employees.filter(e => {
    const name = `${e.first_name} ${e.last_name}`.toLowerCase();
    const matchSearch = !search || name.includes(search.toLowerCase()) || e.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = !filterRole || e.role === filterRole;
    return matchSearch && matchRole;
  });

  const roleColor = (r) => ({ driver: 'badge-info', conductor: 'badge-success', inspector: 'badge-warning', admin: 'badge-danger' }[r] || 'badge-info');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2"><FiUsers /> Employee Management</h1>
          <p className="text-sm text-gray-500 mt-1">{employees.length} employees</p>
        </div>
        <button onClick={() => setModal({})} className="btn-primary flex items-center gap-2"><FiPlus size={16} /> Add Employee</button>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees..." className="input-field pl-10" />
          </div>
          <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="input-field w-auto"><option value="">All Roles</option>{ROLES.map(r => <option key={r} value={r}>{r}</option>)}</select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full flex items-center justify-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-400">No employees found</div>
        ) : filtered.map(emp => (
          <div key={emp.id} className="card-hover">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                  {emp.first_name?.[0]}{emp.last_name?.[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{emp.first_name} {emp.last_name}</h3>
                  <span className={roleColor(emp.role)}>{emp.role}</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setModal(emp)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><FiEdit2 size={14} /></button>
                <button onClick={() => handleDelete(emp.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><FiTrash2 size={14} /></button>
              </div>
            </div>
            {emp.user_id && <div className="mt-2"><span className="inline-block bg-gray-100 text-gray-700 font-mono text-xs font-bold px-2 py-1 rounded">ID: {emp.user_id}</span></div>}
            <div className="mt-2 space-y-1 text-sm text-gray-500">
              <p className="flex items-center gap-2"><FiMail size={13} /> {emp.email}</p>
              {emp.phone && <p className="flex items-center gap-2"><FiPhone size={13} /> {emp.phone}</p>}
            </div>
          </div>
        ))}
      </div>
      {modal !== null && <EmployeeModal employee={modal.id ? modal : null} onClose={() => setModal(null)} onSave={() => { setModal(null); loadEmployees(); }} />}
    </div>
  );
}
