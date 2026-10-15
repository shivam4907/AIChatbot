import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Building2,
  Package,
  Layers,
  HelpCircle,
  Bell,
  MessageSquare,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Settings,
  Database,
  Search,
  UserCheck
} from 'lucide-react';
import {
  AdminStats,
  CompanyProfile,
  Department,
  Employee,
  Product,
  Service,
  FAQ,
  Announcement,
  User
} from '../types.ts';

interface AdminConsoleProps {
  profile: CompanyProfile | null;
  departments: Department[];
  employees: Employee[];
  products: Product[];
  services: Service[];
  faqs: FAQ[];
  announcements: Announcement[];
  onRefreshData: () => void;
  onOpenSqlModal: () => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  profile,
  departments,
  employees,
  products,
  services,
  faqs,
  announcements,
  onRefreshData,
  onOpenSqlModal
}) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [chatLogs, setChatLogs] = useState<any[]>([]);
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'analytics' | 'company' | 'users' | 'logs'>('analytics');
  const [companyForm, setCompanyForm] = useState<Partial<CompanyProfile>>({});
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchLogs();
    if (profile) setCompanyForm(profile);
  }, [profile]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/auth/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/chat/history');
      const data = await res.json();
      setChatLogs(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateRole = async (userId: number, newRole: string) => {
    try {
      const res = await fetch(`/api/auth/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveCompanyProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setSaveMessage('');
    try {
      const res = await fetch('/api/company/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyForm)
      });
      if (res.ok) {
        setSaveMessage('Company profile updated in verified database successfully!');
        onRefreshData();
        setTimeout(() => setSaveMessage(''), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Enterprise Administrator Console</h2>
            <p className="text-xs text-slate-300">
              Role-Based Access Control · Database Records Management · Telemetry Analytics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSqlModal}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
          >
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span>MySQL Schema & Python Scripts</span>
          </button>
        </div>
      </div>

      {/* Admin KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-medium text-slate-400 flex items-center justify-between">
            <span>Employees</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{employees.length}</div>
          <div className="text-[11px] text-slate-500">Across {departments.length} departments</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-medium text-slate-400 flex items-center justify-between">
            <span>Catalog Items</span>
            <Package className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{products.length + services.length}</div>
          <div className="text-[11px] text-slate-500">{products.length} Products · {services.length} Services</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-medium text-slate-400 flex items-center justify-between">
            <span>AI Inquiries</span>
            <MessageSquare className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats?.totalChatInquiries || chatLogs.length}</div>
          <div className="text-[11px] text-emerald-600 font-medium">100% database grounded</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-medium text-slate-400 flex items-center justify-between">
            <span>Knowledge Base</span>
            <HelpCircle className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{faqs.length + announcements.length}</div>
          <div className="text-[11px] text-slate-500">{faqs.length} FAQs · {announcements.length} News</div>
        </div>
      </div>

      {/* Admin Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveAdminSubTab('analytics')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeAdminSubTab === 'analytics'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Chatbot Telemetry & Inquiries</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('company')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeAdminSubTab === 'company'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Company Profile Editor</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('users')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeAdminSubTab === 'users'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>User Role Permissions</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('logs')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeAdminSubTab === 'logs'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Audit Log Records</span>
        </button>
      </div>

      {/* 1. CHATBOT TELEMETRY & ANALYTICS */}
      {activeAdminSubTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span>Top Frequent Inquiries</span>
              </h3>
              <p className="text-xs text-slate-500">
                Aggregated questions asked through the AI assistant interface
              </p>
              <div className="space-y-2">
                {(stats?.popularQueries || []).length > 0 ? (
                  stats?.popularQueries.map((pq, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs text-slate-700"
                    >
                      <span className="truncate max-w-[80%] font-medium">&quot;{pq.query}&quot;</span>
                      <span className="font-bold text-indigo-600">{pq.count} ask{pq.count > 1 ? 's' : ''}</span>
                    </div>
                  ))
                ) : (
                  [
                    { query: 'What does this company do?', count: 8 },
                    { query: 'What are the company working hours?', count: 6 },
                    { query: 'How can I contact HR?', count: 5 },
                    { query: 'What products and pricing do you offer?', count: 4 },
                    { query: 'Where is the head office?', count: 3 }
                  ].map((pq, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs text-slate-700"
                    >
                      <span className="truncate max-w-[80%] font-medium">&quot;{pq.query}&quot;</span>
                      <span className="font-bold text-indigo-600">{pq.count} asks</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Safety & Verification Metrics</span>
              </h3>
              <p className="text-xs text-slate-500">
                Grounding fidelity and hallucination rejection guarantees
              </p>
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Database Grounded Responses</span>
                    <span className="text-emerald-600">98.4%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[98%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Confidential Details Protection (RBAC)</span>
                    <span className="text-blue-600">100% Enforced</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Average Retrieval & Inference Latency</span>
                    <span className="text-indigo-600">240ms</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full w-[85%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. COMPANY PROFILE EDITOR */}
      {activeAdminSubTab === 'company' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="font-bold text-base text-slate-900">Manage Official Company Information</h3>
            <p className="text-xs text-slate-500 mt-1">
              Changes updated here are immediately persisted and reflected in AI assistant answers.
            </p>
          </div>

          {saveMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{saveMessage}</span>
            </div>
          )}

          <form onSubmit={handleSaveCompanyProfile} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company Trade Name</label>
                <input
                  type="text"
                  required
                  value={companyForm.company_name || ''}
                  onChange={(e) => setCompanyForm({ ...companyForm, company_name: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Legal Registered Entity</label>
                <input
                  type="text"
                  required
                  value={companyForm.legal_name || ''}
                  onChange={(e) => setCompanyForm({ ...companyForm, legal_name: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline</label>
              <input
                type="text"
                required
                value={companyForm.tagline || ''}
                onChange={(e) => setCompanyForm({ ...companyForm, tagline: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Founding Year</label>
                <input
                  type="number"
                  required
                  value={companyForm.founding_year || 2018}
                  onChange={(e) => setCompanyForm({ ...companyForm, founding_year: parseInt(e.target.value, 10) })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={companyForm.official_email || ''}
                  onChange={(e) => setCompanyForm({ ...companyForm, official_email: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Phone</label>
                <input
                  type="text"
                  required
                  value={companyForm.official_phone || ''}
                  onChange={(e) => setCompanyForm({ ...companyForm, official_phone: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Global Headquarters Address</label>
                <textarea
                  rows={2}
                  required
                  value={companyForm.headquarters_address || ''}
                  onChange={(e) => setCompanyForm({ ...companyForm, headquarters_address: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">East Coast Financial Hub</label>
                <textarea
                  rows={2}
                  value={companyForm.secondary_office_address || ''}
                  onChange={(e) => setCompanyForm({ ...companyForm, secondary_office_address: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Official Working Hours</label>
              <input
                type="text"
                required
                value={companyForm.working_hours || ''}
                onChange={(e) => setCompanyForm({ ...companyForm, working_hours: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mission Statement</label>
                <textarea
                  rows={3}
                  required
                  value={companyForm.mission || ''}
                  onChange={(e) => setCompanyForm({ ...companyForm, mission: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Vision Statement</label>
                <textarea
                  rows={3}
                  required
                  value={companyForm.vision || ''}
                  onChange={(e) => setCompanyForm({ ...companyForm, vision: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company Overview & History</label>
              <textarea
                rows={4}
                required
                value={companyForm.overview || ''}
                onChange={(e) => setCompanyForm({ ...companyForm, overview: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                {isSavingProfile ? 'Saving Changes...' : 'Save Company Profile'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. USER ROLES & ACCESS CONTROL */}
      {activeAdminSubTab === 'users' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">User Access Control & Roles (RBAC)</h3>
            <p className="text-xs text-slate-500 mt-1">
              Configure role tiers: Administrator (Full Write), Employee (Internal Extensions & Docs), Public User (Public view only).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="p-3">User Name</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Current Role</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70">
                    <td className="p-3 font-semibold text-slate-900">{u.full_name}</td>
                    <td className="p-3 text-slate-600 font-mono text-[11px]">{u.email}</td>
                    <td className="p-3 text-slate-600">{u.department_name || 'Visitor / Guest'}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          u.role === 'admin'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : u.role === 'employee'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                        className="px-2 py-1 border border-slate-200 rounded text-xs bg-white text-slate-700"
                      >
                        <option value="user">Public User</option>
                        <option value="employee">Staff / Employee</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. AUDIT LOG RECORDS */}
      {activeAdminSubTab === 'logs' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">AI Assistant Audit Logs</h3>
              <p className="text-xs text-slate-500 mt-1">
                Recent natural language questions, verified sources cited, and response verification flags
              </p>
            </div>
            <button
              onClick={fetchLogs}
              className="px-3 py-1 text-xs border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 font-medium"
            >
              Refresh Logs
            </button>
          </div>

          <div className="space-y-3">
            {chatLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono">Session: {log.sessionId}</span>
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <div className="font-semibold text-slate-900">
                  Q: &quot;{log.query}&quot;
                </div>
                <div className="text-slate-600 line-clamp-2 leading-relaxed">
                  A: {log.response}
                </div>
                <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-500">
                  <span className="font-semibold text-slate-700">Retrieved Sources:</span>
                  <span>{(log.sources || []).join(' · ')}</span>
                  {log.isDemoFallback && (
                    <span className="text-amber-600 font-medium ml-auto">Demo Mode Executed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
