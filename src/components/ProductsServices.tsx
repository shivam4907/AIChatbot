import React, { useState } from 'react';
import {
  Package,
  Layers,
  Plus,
  Edit2,
  Trash2,
  Check,
  ExternalLink,
  Bot,
  DollarSign,
  Users,
  Shield,
  ArrowRight
} from 'lucide-react';
import { Product, Service, UserRole } from '../types.ts';

interface ProductsServicesProps {
  products: Product[];
  services: Service[];
  userRole?: UserRole;
  onAskAi: (question: string) => void;
  onRefreshData: () => void;
}

export const ProductsServices: React.FC<ProductsServicesProps> = ({
  products,
  services,
  userRole = 'user',
  onAskAi,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'services'>('products');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = userRole === 'admin';

  // Product Save Handler
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsSubmitting(true);

    try {
      const isNew = !editingProduct.id;
      const url = isNew ? '/api/products' : `/api/products/${editingProduct.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const payload = {
        ...editingProduct,
        features: Array.isArray(editingProduct.features)
          ? editingProduct.features
          : (editingProduct.features as any || '').split('\n').filter(Boolean)
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setEditingProduct(null);
        onRefreshData();
      }
    } catch (err) {
      console.error('Save product error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Product Delete Handler
  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product record?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      onRefreshData();
    } catch (err) {
      console.error('Delete product error:', err);
    }
  };

  // Service Save Handler
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    setIsSubmitting(true);

    try {
      const isNew = !editingService.id;
      const url = isNew ? '/api/services' : `/api/services/${editingService.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const payload = {
        ...editingService,
        deliverables: Array.isArray(editingService.deliverables)
          ? editingService.deliverables
          : (editingService.deliverables as any || '').split('\n').filter(Boolean)
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setEditingService(null);
        onRefreshData();
      }
    } catch (err) {
      console.error('Save service error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Service Delete Handler
  const handleDeleteService = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service record?')) return;
    try {
      await fetch(`/api/services/${id}`, { method: 'DELETE' });
      onRefreshData();
    } catch (err) {
      console.error('Delete service error:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Segmented Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Products & Services Catalog</h2>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise cloud solutions, zero-trust cybersecurity, and specialized consulting
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'products' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Products ({products.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'services' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Services ({services.length})</span>
            </button>
          </div>

          {isAdmin && (
            <button
              onClick={() => {
                if (activeTab === 'products') {
                  setEditingProduct({
                    name: '',
                    slug: '',
                    category: 'Cloud Infrastructure',
                    summary: '',
                    description: '',
                    features: [],
                    pricing_tier: '$1,000 / month',
                    target_audience: 'DevOps & Engineering teams',
                    status: 'active'
                  });
                } else {
                  setEditingService({
                    name: '',
                    slug: '',
                    category: 'Professional Services',
                    description: '',
                    deliverables: [],
                    sla_details: '99.9% availability SLA',
                    contact_email: 'services@apexdynamics.com',
                    pricing_model: 'Statement of Work',
                    is_active: true
                  });
                }
              }}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add {activeTab === 'products' ? 'Product' : 'Service'}</span>
            </button>
          )}
        </div>
      </div>

      {/* PRODUCTS VIEW */}
      {activeTab === 'products' && (
        <div className="grid md:grid-cols-2 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-indigo-600 tracking-wide uppercase">
                      {product.category}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-0.5">{product.name}</h3>
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-sm font-medium text-slate-700">{product.summary}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{product.description}</p>

                {/* Features List */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Core Capabilities
                  </span>
                  <ul className="space-y-1">
                    {product.features?.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer: Pricing & Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Pricing Model</div>
                  <div className="text-xs font-bold text-slate-900">{product.pricing_tier}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAskAi(`Tell me about ${product.name} features and pricing`)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Ask AI</span>
                  </button>
                  {product.documentation_url && (
                    <a
                      href={product.documentation_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                      title="Documentation Link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SERVICES VIEW */}
      {activeTab === 'services' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-purple-600 tracking-wide uppercase">
                      {service.category}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">{service.name}</h3>
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingService(service)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                        title="Edit Service"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{service.description}</p>

                {/* Deliverables */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Scope of Work
                  </span>
                  <ul className="space-y-1">
                    {service.deliverables?.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">SLA:</span> {service.sla_details}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-900">{service.pricing_model}</div>
                  <button
                    onClick={() => onAskAi(`How can we engage ${service.name}?`)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Inquire</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {editingProduct.id ? 'Edit Product Record' : 'Create New Product Record'}
            </h3>
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.category || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pricing Tier</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.pricing_tier || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, pricing_tier: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Short Summary</label>
                <input
                  type="text"
                  required
                  value={editingProduct.summary || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, summary: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Features (One per line)
                </label>
                <textarea
                  rows={3}
                  value={
                    Array.isArray(editingProduct.features)
                      ? editingProduct.features.join('\n')
                      : (editingProduct.features as any || '')
                  }
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      features: e.target.value.split('\n')
                    })
                  }
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg font-mono text-[11px]"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
                >
                  {isSubmitting ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SERVICE MODAL */}
      {editingService && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {editingService.id ? 'Edit Service Record' : 'Create New Service Record'}
            </h3>
            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  value={editingService.name || ''}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={editingService.category || ''}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pricing Model</label>
                  <input
                    type="text"
                    required
                    value={editingService.pricing_model || ''}
                    onChange={(e) => setEditingService({ ...editingService, pricing_model: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingService.description || ''}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deliverables (One per line)
                </label>
                <textarea
                  rows={3}
                  value={
                    Array.isArray(editingService.deliverables)
                      ? editingService.deliverables.join('\n')
                      : (editingService.deliverables as any || '')
                  }
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      deliverables: e.target.value.split('\n')
                    })
                  }
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg font-mono text-[11px]"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
                >
                  {isSubmitting ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
