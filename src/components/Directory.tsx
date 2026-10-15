import React, { useState } from 'react';
import {
  Users,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lock,
  Shield,
  Plus,
  Edit2,
  Trash2,
  Bot,
  UserCheck
} from 'lucide-react';
import { Department, Employee, UserRole } from '../types.ts';

interface DirectoryProps {
  departments: Department[];
  employees: Employee[];
  userRole?: UserRole;
  onAskAi: (question: string) => void;
  onRefreshData: () => void;
}

export const Directory: React.FC<DirectoryProps> = ({
  departments,
  employees,
  userRole = 'user',
  onAskAi,
  onRefreshData
}) => {
  const [selectedDeptId, setSelectedDeptId] = useState<number | 'all'>('all');
  const [editingEmployee, setEditingEmployee] = useState<Partial<Employee> | null>(null);
  const [editingDept, setEditingDept] = useState<Partial<Department> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAuthorized = userRole === 'admin' || userRole === 'employee';
  const isAdmin = userRole === 'admin';

  const filteredEmployees = employees.filter(
    (e) => selectedDeptId === 'all' || e.department_id === selectedDeptId
  );

  // Employee Save
  const handleSaveEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;
    setIsSubmitting(true);

    try {
      const isNew = !editingEmployee.id;
      const url = isNew ? '/api/employees' : `/api/employees/${editingEmployee.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingEmployee)
      });

      if (res.ok) {
        setEditingEmployee(null);
        onRefreshData();
      }
    } catch (err) {
      console.error('Save employee error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Employee Delete
  const handleDeleteEmployee = async (id: number) => {
    if (!confirm('Are you sure you want to delete this employee record?')) return;
    try {
      await fetch(`/api/employees/${id}`, { method: 'DELETE' });
      onRefreshData();
    } catch (err) {
      console.error('Delete employee error:', err);
    }
  };

  // Department Save
  const handleSaveDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept) return;
    setIsSubmitting(true);

    try {
      const isNew = !editingDept.id;
      const url = isNew ? '/api/departments' : `/api/departments/${editingDept.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingDept)
      });

      if (res.ok) {
        setEditingDept(null);
        onRefreshData();
      }
    } catch (err) {
      console.error('Save dept error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Department Delete
  const handleDeleteDept = async (id: number) => {
    if (!confirm('Are you sure you want to delete this department?')) return;
    try {
      await fetch(`/api/departments/${id}`, { method: 'DELETE' });
      onRefreshData();
    } catch (err) {
      console.error('Delete dept error:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Department & Employee Directory</h2>
          <p className="text-xs text-slate-500 mt-1">
            Official organizational chart and employee professional profiles
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isAuthorized && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200/60 rounded-lg text-xs text-amber-800">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Confidential extensions masked for public visitors</span>
            </div>
          )}

          {isAdmin && (
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setEditingDept({
                    name: '',
                    code: '',
                    description: '',
                    head_of_department: '',
                    contact_email: '',
                    contact_phone: '',
                    floor_location: 'Building A',
                    operating_hours: 'Mon-Fri 09:00 - 18:00 PST'
                  })
                }
                className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Department</span>
              </button>
              <button
                onClick={() =>
                  setEditingEmployee({
                    department_id: departments[0]?.id || 1,
                    full_name: '',
                    role_title: '',
                    official_email: '',
                    public_phone: '',
                    internal_extension: 'x1000',
                    office_location: 'San Francisco HQ',
                    bio: '',
                    is_leadership: false,
                    is_confidential: false,
                    joined_date: new Date().toISOString().split('T')[0]
                  })
                }
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Employee</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Department Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setSelectedDeptId('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
            selectedDeptId === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Departments ({employees.length})
        </button>
        {departments.map((dept) => {
          const count = employees.filter((e) => e.department_id === dept.id).length;
          return (
            <button
              key={dept.id}
              onClick={() => setSelectedDeptId(dept.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
                selectedDeptId === dept.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{dept.name}</span>
              <span className="opacity-60 text-[10px]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Selected Department Overview Card (if specific department chosen) */}
      {selectedDeptId !== 'all' && (
        (() => {
          const activeDept = departments.find((d) => d.id === selectedDeptId);
          if (!activeDept) return null;
          return (
            <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/30 text-indigo-300">
                    {activeDept.code}
                  </span>
                  <h3 className="text-xl font-bold">{activeDept.name}</h3>
                </div>
                <p className="text-xs text-slate-300 max-w-2xl">{activeDept.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                  <div>Lead: <span className="text-white font-medium">{activeDept.head_of_department}</span></div>
                  <div>Email: <span className="text-indigo-400">{activeDept.contact_email}</span></div>
                  <div>Location: <span>{activeDept.floor_location}</span></div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onAskAi(`How do I contact ${activeDept.name} and what are their duties?`)}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Ask AI about {activeDept.code}</span>
                </button>
                {isAdmin && (
                  <button
                    onClick={() => setEditingDept(activeDept)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs text-slate-200"
                    title="Edit Department"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })()
      )}

      {/* Employee Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                {emp.avatar_url ? (
                  <img
                    src={emp.avatar_url}
                    alt={emp.full_name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-100"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm shrink-0">
                    {emp.full_name.charAt(0)}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900 truncate">{emp.full_name}</h4>
                    {isAdmin && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setEditingEmployee(emp)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded"
                          title="Edit Employee"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(emp.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Delete Employee"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-xs font-medium text-indigo-600 truncate">{emp.role_title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">{emp.department_name}</p>
                </div>
              </div>

              {emp.bio && (
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{emp.bio}</p>
              )}

              {/* Contact Information */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a href={`mailto:${emp.official_email}`} className="text-slate-700 hover:text-indigo-600 truncate">
                    {emp.official_email}
                  </a>
                </div>

                {emp.public_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{emp.public_phone}</span>
                  </div>
                )}

                {/* Internal Extension (Role-protected) */}
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {isAuthorized ? (
                    <span className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                      Ext: {emp.internal_extension || 'None'}
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">Internal Ext: Restricted</span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{emp.office_location}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                Joined {new Date(emp.joined_date).toLocaleDateString([], { month: 'short', year: 'numeric' })}
              </span>
              <button
                onClick={() => onAskAi(`Who is ${emp.full_name} and what is their role?`)}
                className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-md font-medium flex items-center gap-1 transition-colors"
              >
                <Bot className="w-3 h-3" />
                <span>Ask AI</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EMPLOYEE MODAL */}
      {editingEmployee && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {editingEmployee.id ? 'Edit Employee Record' : 'Add Employee Record'}
            </h3>
            <form onSubmit={handleSaveEmployee} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingEmployee.full_name || ''}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, full_name: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    value={editingEmployee.role_title || ''}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, role_title: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={editingEmployee.department_id || 1}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, department_id: parseInt(e.target.value, 10) })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    required
                    value={editingEmployee.official_email || ''}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, official_email: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Internal Extension</label>
                  <input
                    type="text"
                    value={editingEmployee.internal_extension || ''}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, internal_extension: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg font-mono"
                    placeholder="x1040"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Office Location</label>
                <input
                  type="text"
                  required
                  value={editingEmployee.office_location || ''}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, office_location: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={editingEmployee.bio || ''}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, bio: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div className="flex items-center gap-4 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingEmployee.is_leadership || false}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, is_leadership: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                  <span>Executive Leadership</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingEmployee.is_confidential || false}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, is_confidential: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                  <span>Confidential Record</span>
                </label>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingEmployee(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
                >
                  {isSubmitting ? 'Saving...' : 'Save Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEPARTMENT MODAL */}
      {editingDept && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {editingDept.id ? 'Edit Department Record' : 'Create Department'}
            </h3>
            <form onSubmit={handleSaveDept} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department Name</label>
                  <input
                    type="text"
                    required
                    value={editingDept.name || ''}
                    onChange={(e) => setEditingDept({ ...editingDept, name: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Code</label>
                  <input
                    type="text"
                    required
                    value={editingDept.code || ''}
                    onChange={(e) => setEditingDept({ ...editingDept, code: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg font-mono uppercase"
                    placeholder="ENG"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Head of Department</label>
                <input
                  type="text"
                  required
                  value={editingDept.head_of_department || ''}
                  onChange={(e) => setEditingDept({ ...editingDept, head_of_department: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={editingDept.contact_email || ''}
                    onChange={(e) => setEditingDept({ ...editingDept, contact_email: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Floor Location</label>
                  <input
                    type="text"
                    required
                    value={editingDept.floor_location || ''}
                    onChange={(e) => setEditingDept({ ...editingDept, floor_location: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingDept.description || ''}
                  onChange={(e) => setEditingDept({ ...editingDept, description: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingDept(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
                >
                  {isSubmitting ? 'Saving...' : 'Save Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
