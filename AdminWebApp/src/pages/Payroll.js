import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiCheck, FiDownload, FiSearch, FiCalendar } from 'react-icons/fi';
import { payrollAPI } from '../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

export default function Payroll() {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');

  useEffect(() => { loadPayroll(); }, []);

  const loadPayroll = async () => {
    try {
      const { data } = await payrollAPI.getAll();
      setPayrolls(data.payroll || data || []);
    } catch (err) { toast.error('Failed to load payroll'); }
    finally { setLoading(false); }
  };

  const handleGenerate = async () => {
    if (!periodStart || !periodEnd) { toast.error('Select period dates'); return; }
    setGenerating(true);
    try {
      await payrollAPI.generate({ period_start: periodStart, period_end: periodEnd });
      toast.success('Payroll generated');
      loadPayroll();
    } catch (err) { toast.error(err.response?.data?.error || 'Generation failed'); }
    finally { setGenerating(false); }
  };

  const handleApprove = async (id) => {
    try { await payrollAPI.approve(id); toast.success('Approved'); loadPayroll(); }
    catch (err) { toast.error('Approval failed'); }
  };

  const handlePay = async (id) => {
    if (!window.confirm('Mark as paid?')) return;
    try { await payrollAPI.pay(id); toast.success('Marked as paid'); loadPayroll(); }
    catch (err) { toast.error('Payment failed'); }
  };

  const statusColor = (s) => ({ pending: 'badge-warning', approved: 'badge-info', paid: 'badge-success' }[s] || 'badge-info');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2"><FiDollarSign /> Payroll Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage employee compensation</p>
        </div>
      </div>

      {/* Generate Payroll */}
      <div className="card">
        <h3 className="section-title mb-4 flex items-center gap-2"><FiCalendar size={16} /> Generate Payroll</h3>
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Period Start</label>
            <input type="date" value={periodStart} onChange={e => setPeriodStart(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Period End</label>
            <input type="date" value={periodEnd} onChange={e => setPeriodEnd(e.target.value)} className="input-field" />
          </div>
          <button onClick={handleGenerate} disabled={generating} className="btn-primary">
            {generating ? 'Generating...' : 'Generate Payroll'}
          </button>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="card overflow-hidden p-0">
        {loading ? (
          <div className="flex items-center justify-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50"><tr>
                <th className="table-header">Employee</th><th className="table-header">Role</th><th className="table-header">Period</th><th className="table-header">Base Pay</th><th className="table-header">Overtime</th><th className="table-header">Deductions</th><th className="table-header">Net Pay</th><th className="table-header">Status</th><th className="table-header">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {payrolls.length === 0 ? (
                  <tr><td colSpan="9" className="text-center py-8 text-gray-400">No payroll records</td></tr>
                ) : payrolls.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="table-cell font-medium">{p.employee_name}</td>
                    <td className="table-cell capitalize">{p.role}</td>
                    <td className="table-cell text-xs">{p.period_start && format(new Date(p.period_start), 'MMM d')} - {p.period_end && format(new Date(p.period_end), 'MMM d, yyyy')}</td>
                    <td className="table-cell">₱{(p.base_pay || 0).toLocaleString()}</td>
                    <td className="table-cell">₱{(p.overtime_pay || 0).toLocaleString()}</td>
                    <td className="table-cell text-red-500">-₱{(p.deductions || 0).toLocaleString()}</td>
                    <td className="table-cell font-bold text-green-600">₱{(p.net_pay || 0).toLocaleString()}</td>
                    <td className="table-cell"><span className={statusColor(p.status)}>{p.status}</span></td>
                    <td className="table-cell">
                      <div className="flex gap-1">
                        {p.status === 'pending' && <button onClick={() => handleApprove(p.id)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded" title="Approve"><FiCheck size={14} /></button>}
                        {p.status === 'approved' && <button onClick={() => handlePay(p.id)} className="p-1.5 text-green-500 hover:bg-green-50 rounded" title="Mark Paid"><FiDollarSign size={14} /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
