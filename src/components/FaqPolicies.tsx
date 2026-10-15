import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Plus,
  Edit2,
  Trash2,
  Bot,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { FAQ, Department, UserRole } from '../types.ts';

interface FaqPoliciesProps {
  faqs: FAQ[];
  departments: Department[];
  userRole?: UserRole;
  onAskAi: (question: string) => void;
  onRefreshData: () => void;
}

export const FaqPolicies: React.FC<FaqPoliciesProps> = ({
  faqs,
  departments,
  userRole = 'user',
  onAskAi,
  onRefreshData
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<number[]>([1, 2, 4]); // first few open by default
  const [editingFaq, setEditingFaq] = useState<Partial<FAQ> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = userRole === 'admin';

  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = faqs.filter((f) => {
    const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;
    const matchesSearch =
      !searchTerm ||
      f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;
    setIsSubmitting(true);

    try {
      const isNew = !editingFaq.id;
      const url = isNew ? '/api/faqs' : `/api/faqs/${editingFaq.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingFaq)
      });

      if (res.ok) {
        setEditingFaq(null);
        onRefreshData();
      }
    } catch (err) {
      console.error('Save FAQ error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFaq = async (id: number) => {
    if (!confirm('Are you sure you want to delete this FAQ record?')) return;
    try {
      await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
      onRefreshData();
    } catch (err) {
      console.error('Delete FAQ error:', err);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions & Policies</h2>
          <p className="text-xs text-slate-500 mt-1">
            Verified corporate operating standards, compliance policies, and procedures
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() =>
              setEditingFaq({
                category: 'Company & General',
                question: '',
                answer: '',
                is_public: true,
                display_order: faqs.length + 1
              })
            }
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add FAQ</span>
          </button>
        )}
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search within company questions and policy answers..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Questions ({faqs.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-2xl border border-slate-200 p-8">
            <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No questions found</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search terms or asking our AI Assistant directly.
            </p>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition-all"
              >
                <div
                  onClick={() => toggleExpand(faq.id)}
                  className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 select-none gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[11px] font-semibold text-indigo-600 shrink-0">
                      {faq.category}
                    </span>
                    <span className="text-slate-300">·</span>
                    <h4 className="font-semibold text-sm text-slate-900 truncate">
                      {faq.question}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isAdmin && (
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setEditingFaq(faq)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteFaq(faq.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-100 text-xs text-slate-700 leading-relaxed space-y-3 bg-slate-50/40">
                    <p className="whitespace-pre-wrap">{faq.answer}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                      <span>Department: {faq.department_name || 'General Enterprise'}</span>
                      <button
                        onClick={() => onAskAi(faq.question)}
                        className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
                      >
                        <Bot className="w-3 h-3" />
                        <span>Query Assistant</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* EDIT / CREATE MODAL */}
      {editingFaq && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {editingFaq.id ? 'Edit FAQ Record' : 'Create FAQ Record'}
            </h3>
            <form onSubmit={handleSaveFaq} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={editingFaq.category || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  placeholder="e.g. Operations & Hours, Human Resources, Products"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Question</label>
                <input
                  type="text"
                  required
                  value={editingFaq.question || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Answer</label>
                <textarea
                  rows={4}
                  required
                  value={editingFaq.answer || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Related Department</label>
                  <select
                    value={editingFaq.department_id || ''}
                    onChange={(e) =>
                      setEditingFaq({
                        ...editingFaq,
                        department_id: e.target.value ? parseInt(e.target.value, 10) : null
                      })
                    }
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="">None / All Departments</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={editingFaq.is_public !== false}
                      onChange={(e) => setEditingFaq({ ...editingFaq, is_public: e.target.checked })}
                      className="rounded text-indigo-600"
                    />
                    <span>Public FAQ</span>
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingFaq(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
                >
                  {isSubmitting ? 'Saving...' : 'Save FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
