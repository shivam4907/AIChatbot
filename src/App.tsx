import React, { useState, useEffect } from 'react';
import {
  Building2,
  Bot,
  Search,
  Package,
  Layers,
  Users,
  HelpCircle,
  Bell,
  Shield,
  Database,
  ArrowRight,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  Mic
} from 'lucide-react';
import { Navbar } from './components/Navbar.tsx';
import { ChatAssistant } from './components/ChatAssistant.tsx';
import { GlobalSearch } from './components/GlobalSearch.tsx';
import { CompanyOverview } from './components/CompanyOverview.tsx';
import { ProductsServices } from './components/ProductsServices.tsx';
import { Directory } from './components/Directory.tsx';
import { FaqPolicies } from './components/FaqPolicies.tsx';
import { Announcements } from './components/Announcements.tsx';
import { AdminConsole } from './components/AdminConsole.tsx';
import { SqlViewerModal } from './components/SqlViewerModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import {
  CompanyProfile,
  Department,
  Employee,
  Product,
  Service,
  FAQ,
  Announcement,
  User,
  UserRole
} from './types.ts';

export default function App() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 1,
    full_name: 'Administrator (Demo)',
    email: 'admin@apexdynamics.com',
    role: 'admin',
    department_name: 'Executive Management'
  });

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isChatAssistantDrawerOpen, setIsChatAssistantDrawerOpen] = useState(false);
  const [chatInitialQuestion, setChatInitialQuestion] = useState<string | undefined>(undefined);
  const [autoStartVoice, setAutoStartVoice] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadAllData = async () => {
    try {
      const roleQuery = currentUser?.role || 'user';
      const [pRes, dRes, eRes, prodRes, sRes, fRes, aRes] = await Promise.all([
        fetch('/api/company/profile'),
        fetch('/api/departments'),
        fetch(`/api/employees?role=${roleQuery}`),
        fetch('/api/products'),
        fetch('/api/services'),
        fetch(`/api/faqs?role=${roleQuery}`),
        fetch('/api/announcements')
      ]);

      if (pRes.ok) setProfile(await pRes.json());
      if (dRes.ok) setDepartments(await dRes.json());
      if (eRes.ok) setEmployees(await eRes.json());
      if (prodRes.ok) setProducts(await prodRes.json());
      if (sRes.ok) setServices(await sRes.json());
      if (fRes.ok) setFaqs(await fRes.json());
      if (aRes.ok) setAnnouncements(await aRes.json());
    } catch (err) {
      console.error('Failed to load enterprise records:', err);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [currentUser?.role]);

  // Keyboard shortcut for search (Cmd+K / Ctrl+K / '/')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === '/' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRoleChange = (role: UserRole) => {
    if (role === 'admin') {
      setCurrentUser({
        id: 1,
        full_name: 'Administrator Account',
        email: 'admin@apexdynamics.com',
        role: 'admin',
        department_name: 'Executive Leadership'
      });
      showToast('Switched to Administrator Role (Full CRUD & telemetry access enabled)');
    } else if (role === 'employee') {
      setCurrentUser({
        id: 2,
        full_name: 'Dr. Marcus Vance (Staff)',
        email: 'marcus.vance@apexdynamics.com',
        role: 'employee',
        department_name: 'Engineering & Architecture'
      });
      showToast('Switched to Staff Member Role (Internal phone extensions unmasked)');
    } else {
      setCurrentUser({
        id: 4,
        full_name: 'Guest Visitor',
        email: 'visitor@apexdynamics.com',
        role: 'user'
      });
      showToast('Switched to Public Visitor Role (Confidential details masked)');
    }
  };

  const handleOpenAiQuestion = (question: string) => {
    setAutoStartVoice(false);
    setChatInitialQuestion(question);
    setActiveTab('assistant');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenVoiceChat = () => {
    setChatInitialQuestion(undefined);
    setAutoStartVoice(true);
    setActiveTab('assistant');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        profile={profile}
        currentUser={currentUser}
        onSelectRole={handleRoleChange}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenChat={() => {
          setAutoStartVoice(false);
          setActiveTab('assistant');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenVoiceChat={handleOpenVoiceChat}
        onOpenSqlModal={() => setIsSqlModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={() => {
          handleRoleChange('user');
          showToast('Session reset to Public Visitor');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <CompanyOverview
            profile={profile}
            departments={departments}
            onAskAi={handleOpenAiQuestion}
            onOpenVoiceChat={handleOpenVoiceChat}
            onExploreProducts={() => setActiveTab('products')}
            onExploreDirectory={() => setActiveTab('directory')}
          />
        )}

        {/* TAB 2: AI ASSISTANT (Dedicated Full-Page Mode) */}
        {activeTab === 'assistant' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Interactive AI Company Assistant</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Ask natural language questions about Apex Dynamics records, leadership, hours, and policies.
                </p>
              </div>
              <button
                onClick={() => setIsSqlModalOpen(true)}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
              >
                <Database className="w-3.5 h-3.5 text-indigo-500" />
                <span>View MySQL Grounding Schema</span>
              </button>
            </div>
            <ChatAssistant
              currentUser={currentUser}
              initialQuestion={chatInitialQuestion}
              autoStartVoice={autoStartVoice}
              onNavigateToTab={setActiveTab}
            />
          </div>
        )}

        {/* TAB 3: PRODUCTS & SERVICES */}
        {activeTab === 'products' && (
          <ProductsServices
            products={products}
            services={services}
            userRole={currentUser?.role}
            onAskAi={handleOpenAiQuestion}
            onRefreshData={loadAllData}
          />
        )}

        {/* TAB 4: DIRECTORY & DEPARTMENTS */}
        {activeTab === 'directory' && (
          <Directory
            departments={departments}
            employees={employees}
            userRole={currentUser?.role}
            onAskAi={handleOpenAiQuestion}
            onRefreshData={loadAllData}
          />
        )}

        {/* TAB 5: FAQS & POLICIES */}
        {activeTab === 'faqs' && (
          <FaqPolicies
            faqs={faqs}
            departments={departments}
            userRole={currentUser?.role}
            onAskAi={handleOpenAiQuestion}
            onRefreshData={loadAllData}
          />
        )}

        {/* TAB 6: ANNOUNCEMENTS */}
        {activeTab === 'announcements' && (
          <Announcements
            announcements={announcements}
            userRole={currentUser?.role}
            onAskAi={handleOpenAiQuestion}
            onRefreshData={loadAllData}
          />
        )}

        {/* TAB 7: ADMIN CONSOLE */}
        {activeTab === 'admin' && currentUser?.role === 'admin' && (
          <AdminConsole
            profile={profile}
            departments={departments}
            employees={employees}
            products={products}
            services={services}
            faqs={faqs}
            announcements={announcements}
            onRefreshData={loadAllData}
            onOpenSqlModal={() => setIsSqlModalOpen(true)}
          />
        )}
      </main>

      {/* Global Modals */}
      <GlobalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        userRole={currentUser?.role}
        onSelectResultItem={(type) => {
          if (type === 'product' || type === 'service') setActiveTab('products');
          else if (type === 'department' || type === 'employee') setActiveTab('directory');
          else if (type === 'faq') setActiveTab('faqs');
          else if (type === 'announcement') setActiveTab('announcements');
        }}
        onAskAi={handleOpenAiQuestion}
      />

      <SqlViewerModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Signed in successfully as ${user.full_name} (${user.role})`);
        }}
      />

      {/* Floating AI & Voice Buttons (Visible on all tabs except when on Assistant tab) */}
      {activeTab !== 'assistant' && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5">
          <button
            onClick={handleOpenVoiceChat}
            className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-3 rounded-2xl shadow-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 border border-rose-500"
            title="Speak with Voice Microphone"
          >
            <Mic className="w-5 h-5 animate-pulse" />
            <span className="text-xs font-bold hidden sm:inline">Voice Mic</span>
          </button>
          <button
            onClick={() => {
              setAutoStartVoice(false);
              setActiveTab('assistant');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 transition-all hover:scale-105 group"
          >
            <div className="relative">
              <Bot className="w-5 h-5" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5" />
            </div>
            <span className="text-xs font-bold">Ask AI Assistant</span>
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="font-bold text-slate-900 text-sm">
                  {profile?.company_name || 'Apex Dynamics Inc.'}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Enterprise Cloud Infrastructure, Zero-Trust Cybersecurity, and Grounded AI Systems.
              </p>
              <div className="text-[11px] text-slate-400">
                Established March 2018 · San Francisco HQ
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Quick Navigation
              </h4>
              <ul className="space-y-1.5 text-slate-600">
                <li>
                  <button onClick={() => setActiveTab('overview')} className="hover:text-indigo-600">
                    Company Overview
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('products')} className="hover:text-indigo-600">
                    Products & Solutions
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('directory')} className="hover:text-indigo-600">
                    Department Directory
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('faqs')} className="hover:text-indigo-600">
                    Policies & FAQ
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Official Inquiries
              </h4>
              <div className="space-y-1 text-slate-600">
                <div>Corporate: {profile?.official_email}</div>
                <div>Support (24/7): {profile?.support_phone}</div>
                <div>Hours: {profile?.working_hours}</div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Academic & Technical Deliverables
              </h4>
              <p className="text-slate-500 text-[11px]">
                Includes full MySQL 8.0 DDL schema, seed data script, and Python Flask REST API.
              </p>
              <button
                onClick={() => setIsSqlModalOpen(true)}
                className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Download MySQL & Flask Code</span>
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <div>© 2018–2026 {profile?.legal_name || 'Apex Dynamics Technologies Corporation'}. All rights reserved.</div>
            <div className="flex items-center gap-3">
              <span>SOC 2 Type II Certified</span>
              <span>·</span>
              <span>ISO 27001</span>
              <span>·</span>
              <span>HIPAA Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
