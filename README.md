# AI-Powered Company Information Assistant

A complete, full-stack, enterprise-grade AI Company Information Management System and Grounded Assistant for **Apex Dynamics Inc.**, built to streamline corporate information retrieval, enforce role-based access control (RBAC), and eliminate manual customer/employee inquiries through a database-grounded LLM chatbot.

---

## 🌟 Key Features

1. **Intelligent Grounded AI Chatbot with Voice Microphone Input**
   - **Voice Mic Dictation:** Real-time speech-to-text recognition via the browser Web Speech API. Click the microphone button to dictate questions hands-free.
   - **Live Transcription & Audio Playback:** Shows live speech feedback and includes a **Read Aloud** button to hear answers via Text-to-Speech (TTS).
   - Answers natural language questions on company profile, products, pricing, working hours, departments, and policies.
   - **Strict Grounding:** Every response is retrieved and verified against active database records.
   - **Hallucination Defense:** If a requested fact is not present in the verified database, the assistant explicitly states it cannot be found rather than inventing details.
   - **Dual Execution Modes:** Live Gemini 3.8 Flash mode via `@google/genai` (with server-side telemetry) + Deterministic Verified Demo Fallback mode.

2. **Universal Company Search Engine**
   - Live multi-table search indexing across Products, Services, Departments, Employee Directories, and Policies.
   - Segmented filter controls with keyboard shortcuts (`Cmd+K` or `/`).

3. **Company Profile & Leadership**
   - Overview, history (founded March 2018 in San Francisco), mission, vision, dual headquarters (SF and NY), official operating hours, and certifications (SOC 2 Type II, ISO 27001, HIPAA).

4. **Products & Services Catalog**
   - Interactive showcases for ApexCloud Orchestrator, ApexShield Zero-Trust Suite, DataPulse AI Telemetry, and Edge Gateway.
   - Full Administrator CRUD modals (Add, Edit, Delete).

5. **Department & Employee Directory with RBAC**
   - 6 functional departments (Engineering, HR, Sales, Support, InfoSec, Finance).
   - **Confidential Field Protection:** Sensitive internal phone extensions and classified staff records are masked for public visitors and only visible to authorized staff and administrators.

6. **Frequently Asked Questions & Announcements**
   - Filterable accordion knowledge base covering remote work, HR contacts, pricing, and SLAs.
   - Company announcement bulletins with priority alerts.

7. **Administrator Management Console**
   - Live KPI metrics: Active staff, catalog count, chatbot inquiry volume, and grounded answer rates.
   - In-app Company Profile editor that immediately updates database records and AI prompt context.
   - Role permission manager and Chatbot audit telemetry logs.

---

## 📁 Project Structure

```
├── backend/
│   ├── app.py                # Standalone Python Flask REST API
│   ├── requirements.txt      # Python dependencies
│   ├── schema.sql            # MySQL 8.0+ DDL table definitions
│   ├── sample_data.sql       # Realistic sample enterprise seed data
│   └── db_setup.py           # Automated MySQL initialization script
├── src/
│   ├── components/
│   │   ├── Navbar.tsx        # Top navigation with role switcher
│   │   ├── ChatAssistant.tsx # Interactive AI Chatbot interface
│   │   ├── GlobalSearch.tsx  # Universal search modal
│   │   ├── CompanyOverview.tsx # Mission, vision, offices, history
│   │   ├── ProductsServices.tsx# Catalog and admin CRUD
│   │   ├── Directory.tsx     # Department & employee directory with RBAC
│   │   ├── FaqPolicies.tsx   # Accordion knowledge base
│   │   ├── Announcements.tsx # News bulletin
│   │   ├── AdminConsole.tsx  # KPI analytics, profile editor, user roles
│   │   ├── SqlViewerModal.tsx# In-app SQL & Python code inspector
│   │   └── AuthModal.tsx     # User login & registration modal
│   ├── server/
│   │   └── database.ts       # Database store with MySQL parity
│   ├── types.ts              # TypeScript interface definitions
│   ├── App.tsx               # Main application controller
│   └── main.tsx              # React DOM entrypoint
├── server.ts                 # Full-stack Express server with Vite middleware
├── package.json              # Node dependencies & fullstack scripts
└── .env.example              # Environment variables template
```

---

## 🗄️ MySQL Database Schema

The relational schema is configured in `backend/schema.sql` with primary keys, foreign keys, indexes, and constraints:

- `company_profile`: Headquarters, secondary offices, emails, phones, working hours, mission, vision, overview.
- `departments`: Department code, name, description, floor location, head of department, email.
- `users`: Authentication records, email, bcrypt/sha256 hash, and role (`admin`, `employee`, `user`).
- `employees`: Department ID foreign key, name, title, official email, public phone, internal extension (confidential), joined date.
- `products`: Product name, slug, category, summary, features JSON, pricing tier, status.
- `services`: Service name, deliverables JSON, SLA details, contact email, pricing model.
- `faqs`: Question, answer, category, department ID, public visibility flag.
- `announcements`: Title, content, priority (`urgent`, `normal`, `info`), published date.
- `chat_history`: Session ID, user query, bot response, retrieved sources JSON, response latency.

---

## 🚀 Execution & Setup Instructions

### Option A: Running in Current AI Studio Environment
The application is pre-configured with a full-stack Express server mounting Vite on port 3000:

```bash
# Start the full-stack server
npm run dev
```

Visit `http://localhost:3000` to interact with the application live.

### Option B: Running Standalone Python Flask + MySQL

#### 1. Setup MySQL Database
Ensure MySQL Server 8.0+ is running:
```bash
mysql -u root -p
CREATE DATABASE company_assistant_db CHARACTER SET utf8mb4;
exit;
```

#### 2. Configure Environment Variables
Inside `backend/.env`:
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=company_assistant_db
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

#### 3. Install Python Dependencies & Seed Database
```bash
cd backend
pip install -r requirements.txt
python db_setup.py
```

#### 4. Start Flask Server
```bash
python app.py
```
The Flask backend will start on `http://localhost:5000`.

---

## 🧪 Demonstration Test Questions for Evaluators

Test the chatbot with these questions to verify database grounding:

| Question | Expected Grounded Fact |
|---|---|
| *"What does this company do?"* | Explains Apex Dynamics founded in 2018 in SF; details ApexCloud, ApexShield, and DataPulse. |
| *"When was the company established?"* | March 1, 2018, in San Francisco, CA. |
| *"What are the company working hours?"* | Mon–Fri 08:30 AM – 06:00 PM PST; 24/7/365 customer support. |
| *"How can I contact the HR department?"* | Cites `hr@apexdynamics.com`, +1 (415) 555-0192, and Chief People Officer Elena Rostova. |
| *"Where is the head office located?"* | 500 Howard Street, Suite 1400, San Francisco, CA. |
| *"What products are offered and what is the pricing?"* | Lists ApexCloud ($1,200/mo), ApexShield ($18/user/mo), and DataPulse ($2,400/mo). |
| *"Who is the CEO?"* | Julian Sterling (Chief Executive Officer & Co-Founder). |
| *"What is the private aircraft registration code?"* | Hallucination defense test: Assistant states that this information cannot be found in verified company records. |
| **Role-Based Access Test** | In the top right, switch between **Public Visitor** and **Staff / Employee**. In the Directory, observe internal phone extensions get revealed only for authorized users. |
