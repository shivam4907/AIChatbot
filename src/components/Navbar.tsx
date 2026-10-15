import React, { useState } from 'react';
import {
  Building2,
  Bot,
  Search,
  Users,
  Package,
  HelpCircle,
  Bell,
  Shield,
  Database,
  ChevronDown,
  UserCheck,
  LogIn,
  LogOut,
  Mic
} from 'lucide-react';
import { User, UserRole, CompanyProfile } from '../types.ts';

interface NavbarProps {
  profile: CompanyProfile | null;
  currentUser: User | null;
  onSelectRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenChat: () => void;
  onOpenVoiceChat?: () => void;
  onOpenSqlModal: () => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  currentUser,
  onSelectRole,
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenChat,
  onOpenVoiceChat,
  onOpenSqlModal,
  onOpenAuthModal,
  onLogout
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Company Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-600 transition-colors">
                <Building2 className="w-5 h-5 text-indigo-400 group-hover:text-white" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-lg tracking-tight block leading-tight">
                  {profile?.company_name || 'Apex Dynamics'}
                </span>
                <span className="text-[11px] text-slate-500 font-medium block">
                  Enterprise Information System
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'overview'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'products'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Products & Services
            </button>
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'directory'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Directory
            </button>
            <button
              onClick={() => setActiveTab('faqs')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'faqs'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              FAQs & Policies
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'announcements'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Announcements
            </button>
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-indigo-600 hover:bg-indigo-50/70'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin Console
              </button>
            )}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 bg-slate-50 text-xs font-medium transition-all"
              title="Search company information (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search records...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-white border border-slate-200 rounded text-slate-400 font-mono">
                /
              </kbd>
            </button>

            {/* AI Assistant Button */}
            <button
              onClick={onOpenChat}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>AI Assistant</span>
            </button>

            {/* Voice Mic Button */}
            <button
              onClick={onOpenVoiceChat || onOpenChat}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-lg transition-all"
              title="Voice Speech Assistant (Microphone)"
            >
              <Mic className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Voice Mic</span>
            </button>

            {/* SQL Schema Viewer Button */}
            <button
              onClick={onOpenSqlModal}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium"
              title="View MySQL Schema & Python Backend"
            >
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span>SQL & Python</span>
            </button>

            {/* Role / Auth Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    currentUser?.role === 'admin'
                      ? 'bg-rose-500'
                      : currentUser?.role === 'employee'
                      ? 'bg-emerald-500'
                      : 'bg-blue-500'
                  }`}
                />
                <span className="capitalize">
                  {currentUser?.role === 'admin'
                    ? 'Admin'
                    : currentUser?.role === 'employee'
                    ? 'Employee'
                    : 'Public User'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95"
                  onClick={() => setRoleMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100 text-xs">
                    <p className="font-semibold text-slate-800">
                      {currentUser?.full_name || 'Guest Visitor'}
                    </p>
                    <p className="text-slate-400 truncate">{currentUser?.email || 'visitor@demo.com'}</p>
                  </div>

                  <div className="py-1">
                    <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Switch Role (Fast Demo)
                    </p>
                    <button
                      onClick={() => onSelectRole('admin')}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 ${
                        currentUser?.role === 'admin' ? 'font-semibold text-indigo-600 bg-indigo-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>Administrator (Full Access)</span>
                      {currentUser?.role === 'admin' && <UserCheck className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => onSelectRole('employee')}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 ${
                        currentUser?.role === 'employee' ? 'font-semibold text-indigo-600 bg-indigo-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>Staff / Employee (Internal)</span>
                      {currentUser?.role === 'employee' && <UserCheck className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => onSelectRole('user')}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 ${
                        currentUser?.role === 'user' ? 'font-semibold text-indigo-600 bg-indigo-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>Public Visitor (Restricted)</span>
                      {currentUser?.role === 'user' && <UserCheck className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1 mt-1">
                    <button
                      onClick={onOpenAuthModal}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                    >
                      <LogIn className="w-3.5 h-3.5 text-slate-400" />
                      <span>Custom Sign In / Register</span>
                    </button>
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Reset Session</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
