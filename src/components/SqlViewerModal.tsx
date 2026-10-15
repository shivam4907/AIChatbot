import React, { useState } from 'react';
import {
  X,
  Database,
  FileCode,
  Copy,
  Check,
  Terminal,
  BookOpen,
  CheckCircle2,
  Server
} from 'lucide-react';

interface SqlViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SqlViewerModal: React.FC<SqlViewerModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'schema' | 'sample_data' | 'flask' | 'guide'>('schema');
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2500);
  };

  const schemaSql = `-- =====================================================================
-- Database Schema for AI-Powered Company Information Assistant
-- Engine: MySQL 8.0+ / MariaDB 10.5+
-- =====================================================================

CREATE DATABASE IF NOT EXISTS company_assistant_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE company_assistant_db;

-- 1. COMPANY PROFILE
CREATE TABLE company_profile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(150) NOT NULL,
    legal_name VARCHAR(200) NOT NULL,
    tagline VARCHAR(255) DEFAULT NULL,
    founding_year INT NOT NULL,
    industry VARCHAR(100) NOT NULL,
    headquarters_address TEXT NOT NULL,
    secondary_office_address TEXT DEFAULT NULL,
    official_email VARCHAR(150) NOT NULL,
    official_phone VARCHAR(50) NOT NULL,
    support_phone VARCHAR(50) DEFAULT NULL,
    working_hours VARCHAR(255) NOT NULL,
    timezone VARCHAR(50) DEFAULT 'PST (UTC-8)',
    website VARCHAR(255) NOT NULL,
    mission TEXT NOT NULL,
    vision TEXT NOT NULL,
    overview TEXT NOT NULL,
    social_links_json JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. DEPARTMENTS
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    head_of_department VARCHAR(100) NOT NULL,
    contact_email VARCHAR(150) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    floor_location VARCHAR(100) NOT NULL,
    operating_hours VARCHAR(150) DEFAULT 'Mon-Fri 09:00 - 18:00 PST',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_dept_code (code)
) ENGINE=InnoDB;

-- 3. USERS (Role-Based Access Control: admin, employee, user)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'employee', 'user') NOT NULL DEFAULT 'user',
    department_id INT DEFAULT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
    INDEX idx_user_email (email)
) ENGINE=InnoDB;

-- 4. EMPLOYEES (Directory with Public vs Confidential Fields)
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department_id INT NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    role_title VARCHAR(120) NOT NULL,
    official_email VARCHAR(150) NOT NULL UNIQUE,
    public_phone VARCHAR(50) DEFAULT NULL,
    internal_extension VARCHAR(20) DEFAULT NULL, -- Sensitive: masked for public
    office_location VARCHAR(100) NOT NULL,
    bio TEXT DEFAULT NULL,
    is_leadership BOOLEAN NOT NULL DEFAULT FALSE,
    is_confidential BOOLEAN NOT NULL DEFAULT FALSE,
    joined_date DATE NOT NULL,
    avatar_url VARCHAR(255) DEFAULT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
    INDEX idx_emp_dept (department_id)
) ENGINE=InnoDB;

-- 5. PRODUCTS
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    slug VARCHAR(150) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    summary VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    features_json JSON NOT NULL,
    pricing_tier VARCHAR(100) NOT NULL,
    target_audience VARCHAR(200) NOT NULL,
    status ENUM('active', 'upcoming', 'deprecated') NOT NULL DEFAULT 'active'
) ENGINE=InnoDB;

-- 6. SERVICES
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    slug VARCHAR(150) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    deliverables_json JSON NOT NULL,
    sla_details VARCHAR(255) NOT NULL,
    contact_email VARCHAR(150) NOT NULL,
    pricing_model VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

-- 7. FAQS & POLICIES
CREATE TABLE faqs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    question VARCHAR(255) NOT NULL,
    answer TEXT NOT NULL,
    department_id INT DEFAULT NULL,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT DEFAULT 0
) ENGINE=InnoDB;

-- 8. ANNOUNCEMENTS
CREATE TABLE announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    priority ENUM('info', 'normal', 'urgent') NOT NULL DEFAULT 'normal',
    published_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

-- 9. CHAT HISTORY
CREATE TABLE chat_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT NULL,
    session_id VARCHAR(100) NOT NULL,
    user_query TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    retrieved_sources_json JSON DEFAULT NULL,
    is_demo_fallback BOOLEAN NOT NULL DEFAULT FALSE,
    response_time_ms INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;`;

  const runCommands = `# 1. Clone or extract project files
cd company-assistant

# 2. Python Backend & MySQL Setup
cd backend
pip install -r requirements.txt

# 3. Configure environment variables (.env)
cat << 'EOF' > .env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=company_assistant_db
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
EOF

# 4. Initialize Database with Schema and Sample Data
python db_setup.py

# 5. Start Flask Backend
python app.py
# Server runs on http://localhost:5000

# 6. Run React / Web Frontend
npm install
npm run dev
# Web application opens on http://localhost:3000`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center animate-in fade-in">
      <div className="bg-slate-900 text-slate-100 rounded-2xl max-w-4xl w-full border border-slate-700 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">MySQL Database & Python Flask Deliverables</h3>
              <p className="text-xs text-slate-400">
                Ready-to-deploy schema, sample data, and Python execution package for college demonstration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'schema'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>MySQL Schema (schema.sql)</span>
          </button>
          <button
            onClick={() => setActiveTab('sample_data')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'sample_data'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Sample Records (sample_data.sql)</span>
          </button>
          <button
            onClick={() => setActiveTab('flask')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'flask'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Python Flask API (backend/app.py)</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Local Setup & Run Commands</span>
          </button>
        </div>

        {/* Content Pane */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/60 font-mono text-xs">
          {activeTab === 'schema' && (
            <div className="relative">
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => copyToClipboard('schema', schemaSql)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1.5 transition-colors"
                >
                  {copied === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === 'schema' ? 'Copied' : 'Copy SQL'}</span>
                </button>
              </div>
              <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed select-all">
                {schemaSql}
              </pre>
            </div>
          )}

          {activeTab === 'sample_data' && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-indigo-950/50 border border-indigo-800/60 text-indigo-200 text-xs flex items-center justify-between">
                <span>The file <code>/backend/sample_data.sql</code> contains full realistic seed data for fictional company <strong>Apex Dynamics Inc.</strong></span>
                <span className="text-[11px] text-indigo-300">File size: ~8 KB</span>
              </div>
              <p className="text-slate-400 text-xs">
                Includes Company Profile (founded 2018 in SF), 6 specialized departments, 10 employee directory records with RBAC extensions, 4 products (ApexCloud, ApexShield, DataPulse), 3 enterprise consulting services, 10 categorized FAQs, announcements, and seed chat history.
              </p>
            </div>
          )}

          {activeTab === 'flask' && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-indigo-950/50 border border-indigo-800/60 text-indigo-200 text-xs flex items-center justify-between">
                <span>Full Python Flask application is generated at <code>/backend/app.py</code> with <code>requirements.txt</code> and <code>db_setup.py</code>.</span>
              </div>
              <p className="text-slate-400 text-xs">
                Features MySQL connection pooling, JWT session authentication, <code>@admin_required</code> / <code>@token_required</code> middlewares, REST API endpoints, and Google GenAI SDK integration with database-grounded prompt engineering.
              </p>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4">
              <div className="flex justify-end mb-1">
                <button
                  onClick={() => copyToClipboard('guide', runCommands)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1.5 transition-colors"
                >
                  {copied === 'guide' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === 'guide' ? 'Copied' : 'Copy Commands'}</span>
                </button>
              </div>
              <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed select-all">
                {runCommands}
              </pre>

              {/* Sample Demonstration Questions */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <h4 className="text-white font-bold text-xs uppercase tracking-wider">
                  Recommended Demonstration Test Scenarios for Evaluators
                </h4>
                <ul className="space-y-1.5 text-slate-300 text-xs">
                  <li>1. <strong>Company History:</strong> &quot;What does this company do and when was it established?&quot;</li>
                  <li>2. <strong>Operating Hours:</strong> &quot;What are the corporate working hours and office locations?&quot;</li>
                  <li>3. <strong>Department Inquiry:</strong> &quot;How can I reach the HR department or who is the Head of HR?&quot;</li>
                  <li>4. <strong>Catalog Query:</strong> &quot;What products are offered and what is the price for ApexShield?&quot;</li>
                  <li>5. <strong>Hallucination Defense Test:</strong> &quot;What is the company private jet tail number?&quot; (Assistant states record could not be found rather than inventing facts).</li>
                  <li>6. <strong>Role-Based Access:</strong> Switch between Visitor and Staff in top navigation to demonstrate confidential extension masking.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Dual Runtime: Live Express Server + Standalone Python Flask & MySQL</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
