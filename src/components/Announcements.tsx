import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle,
  Plus,
  Edit2,
  Trash2,
  Bot
} from 'lucide-react';
import { Announcement, UserRole } from '../types.ts';

interface AnnouncementsProps {
  announcements: Announcement[];
  userRole?: UserRole;
  onAskAi: (question: string) => void;
  onRefreshData: () => void;
}

export const Announcements: React.FC<AnnouncementsProps> = ({
  announcements,
  userRole = 'user',
  onAskAi,
  onRefreshData
}) => {
  const [editingAnn, setEditingAnn] = useState<Partial<Announcement> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = userRole === 'admin';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnn) return;
    setIsSubmitting(true);

    try {
      const isNew = !editingAnn.id;
      const url = isNew ? '/api/announcements' : `/api/announcements/${editingAnn.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingAnn)
      });

      if (res.ok) {
        setEditingAnn(null);
        onRefreshData();
      }
    } catch (err) {
      console.error('Save announcement error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
      onRefreshData();
    } catch (err) {
      console.error('Delete announcement error:', err);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            <AlertTriangle className="w-3 h-3" />
            Urgent Notice
          </span>
        );
      case 'info':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            <Info className="w-3 h-3" />
            Official Bulletin
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <CheckCircle className="w-3 h-3" />
            General Update
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Company Announcements & News</h2>
          <p className="text-xs text-slate-500 mt-1">
            Official executive updates, audit certifications, and operational bulletins
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() =>
              setEditingAnn({
                title: '',
                content: '',
                category: 'Corporate Update',
                priority: 'normal',
                published_date: new Date().toISOString().split('T')[0],
                is_active: true
              })
            }
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Publish Announcement</span>
          </button>
        )}
      </div>

      {/* Announcements Timeline */}
      <div className="space-y-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                {getPriorityBadge(ann.priority)}
                <span className="text-[11px] text-slate-400 font-medium">{ann.category}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {ann.published_date}
                </span>

                {isAdmin && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingAnn(ann)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(ann.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900">{ann.title}</h3>

            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
              {ann.content}
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => onAskAi(`Tell me more about the announcement: ${ann.title}`)}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Ask Assistant about this update</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editingAnn && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {editingAnn.id ? 'Edit Announcement' : 'Publish Announcement'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingAnn.title || ''}
                  onChange={(e) => setEditingAnn({ ...editingAnn, title: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={editingAnn.category || ''}
                    onChange={(e) => setEditingAnn({ ...editingAnn, category: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={editingAnn.priority || 'normal'}
                    onChange={(e) => setEditingAnn({ ...editingAnn, priority: e.target.value as any })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="info">Info / Official</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Content</label>
                <textarea
                  rows={4}
                  required
                  value={editingAnn.content || ''}
                  onChange={(e) => setEditingAnn({ ...editingAnn, content: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={editingAnn.published_date || ''}
                  onChange={(e) => setEditingAnn({ ...editingAnn, published_date: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAnn(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
