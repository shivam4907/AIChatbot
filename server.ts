import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { db } from './src/server/database.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ----------------------------------------------------
// REST APIs
// ----------------------------------------------------

// 1. Auth routes
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Pre-configured demo accounts
  const user = db.findUserByEmail(email);
  if (!user) {
    // If not found, create a demo guest session
    const guestUser = db.createUser(email.split('@')[0], email, 'user');
    return res.json({
      token: 'demo-token-' + Date.now(),
      user: guestUser,
      message: 'Logged in as guest user'
    });
  }

  return res.json({
    token: 'demo-token-' + Date.now(),
    user,
    message: 'Login successful'
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { full_name, email, role } = req.body;
  if (!full_name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const existing = db.findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'User already exists with this email' });
  }

  const assignedRole = role === 'admin' ? 'admin' : role === 'employee' ? 'employee' : 'user';
  const newUser = db.createUser(full_name, email, assignedRole);
  return res.status(201).json({
    token: 'demo-token-' + Date.now(),
    user: newUser,
    message: 'Registered successfully'
  });
});

app.get('/api/auth/users', (_req: Request, res: Response) => {
  res.json(db.getUsers());
});

app.put('/api/auth/users/:id/role', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { role } = req.body;
  const updated = db.updateUserRole(id, role);
  if (!updated) return res.status(404).json({ error: 'User not found' });
  res.json(updated);
});

// 2. Company Profile
app.get('/api/company/profile', (_req: Request, res: Response) => {
  res.json(db.getCompanyProfile());
});

app.put('/api/company/profile', (req: Request, res: Response) => {
  const updated = db.updateCompanyProfile(req.body);
  res.json(updated);
});

// 3. Departments
app.get('/api/departments', (_req: Request, res: Response) => {
  res.json(db.getDepartments());
});

app.post('/api/departments', (req: Request, res: Response) => {
  const newDept = db.createDepartment(req.body);
  res.status(201).json(newDept);
});

app.put('/api/departments/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const updated = db.updateDepartment(id, req.body);
  if (!updated) return res.status(404).json({ error: 'Department not found' });
  res.json(updated);
});

app.delete('/api/departments/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const success = db.deleteDepartment(id);
  res.json({ success });
});

// 4. Employees (supports role-based masking)
app.get('/api/employees', (req: Request, res: Response) => {
  const role = req.query.role as string;
  const isAuthorized = role === 'admin' || role === 'employee';
  res.json(db.getEmployees(isAuthorized));
});

app.post('/api/employees', (req: Request, res: Response) => {
  const newEmp = db.createEmployee(req.body);
  res.status(201).json(newEmp);
});

app.put('/api/employees/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const updated = db.updateEmployee(id, req.body);
  if (!updated) return res.status(404).json({ error: 'Employee not found' });
  res.json(updated);
});

app.delete('/api/employees/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const success = db.deleteEmployee(id);
  res.json({ success });
});

// 5. Products
app.get('/api/products', (_req: Request, res: Response) => {
  res.json(db.getProducts());
});

app.post('/api/products', (req: Request, res: Response) => {
  const newProd = db.createProduct(req.body);
  res.status(201).json(newProd);
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const updated = db.updateProduct(id, req.body);
  if (!updated) return res.status(404).json({ error: 'Product not found' });
  res.json(updated);
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const success = db.deleteProduct(id);
  res.json({ success });
});

// 6. Services
app.get('/api/services', (_req: Request, res: Response) => {
  res.json(db.getServices());
});

app.post('/api/services', (req: Request, res: Response) => {
  const newSrv = db.createService(req.body);
  res.status(201).json(newSrv);
});

app.put('/api/services/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const updated = db.updateService(id, req.body);
  if (!updated) return res.status(404).json({ error: 'Service not found' });
  res.json(updated);
});

app.delete('/api/services/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const success = db.deleteService(id);
  res.json({ success });
});

// 7. FAQs
app.get('/api/faqs', (req: Request, res: Response) => {
  const role = req.query.role as string;
  const isAuthorized = role === 'admin' || role === 'employee';
  res.json(db.getFaqs(isAuthorized));
});

app.post('/api/faqs', (req: Request, res: Response) => {
  const newFaq = db.createFaq(req.body);
  res.status(201).json(newFaq);
});

app.put('/api/faqs/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const updated = db.updateFaq(id, req.body);
  if (!updated) return res.status(404).json({ error: 'FAQ not found' });
  res.json(updated);
});

app.delete('/api/faqs/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const success = db.deleteFaq(id);
  res.json({ success });
});

// 8. Announcements
app.get('/api/announcements', (_req: Request, res: Response) => {
  res.json(db.getAnnouncements());
});

app.post('/api/announcements', (req: Request, res: Response) => {
  const newAnn = db.createAnnouncement(req.body);
  res.status(201).json(newAnn);
});

app.put('/api/announcements/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const updated = db.updateAnnouncement(id, req.body);
  if (!updated) return res.status(404).json({ error: 'Announcement not found' });
  res.json(updated);
});

app.delete('/api/announcements/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const success = db.deleteAnnouncement(id);
  res.json({ success });
});

// 9. Search
app.get('/api/search', (req: Request, res: Response) => {
  const query = (req.query.q as string) || '';
  const category = (req.query.category as string) || 'all';
  const role = (req.query.role as string) || 'user';
  const isAuthorized = role === 'admin' || role === 'employee';

  const results = db.search(query, category, isAuthorized);
  res.json({
    query,
    count: results.length,
    results
  });
});

// 10. AI Chatbot with Grounding and Fallback
app.post('/api/chat', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const { query, sessionId = 'web-session', role = 'user' } = req.body;

  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ error: 'Question query is required' });
  }

  const isAuthorized = role === 'admin' || role === 'employee';
  const groundingContext = db.buildGroundingContext(isAuthorized);
  const profile = db.getCompanyProfile();

  let answer: string | null = null;
  let sources: string[] = ['Company Profile', 'Verified Database'];
  let isDemoFallback = false;

  // Try live Gemini AI if configured
  if (ai) {
    try {
      const systemInstruction = `You are the official AI Company Information Assistant for Apex Dynamics Inc.
Your job is to answer questions from users, customers, and employees accurately.

STRICT GROUNDING RULES:
1. Base your answer EXCLUSIVELY on the verified company records provided in the context.
2. If the user's question asks for information that is NOT present in the verified context, you MUST state clearly:
   "I could not find verified records for that in the company database. Please contact our main desk at contact@apexdynamics.com or call +1 (415) 555-0190 for assistance."
3. NEVER invent or assume company facts, employee personal contact numbers, pricing, addresses, or policies.
4. Keep answers professional, concise, polite, and well-structured using markdown bullets when listing items.
5. If confidential personnel or sensitive information is requested by unauthorized viewers, do not disclose it.`;

      const prompt = `VERIFIED COMPANY DATABASE RECORDS:
${groundingContext}

USER INQUIRY:
"${query.trim()}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
        },
      });

      if (response && response.text) {
        answer = response.text;
        // Determine citation sources based on content
        const lowerQ = query.toLowerCase();
        if (lowerQ.includes('product') || lowerQ.includes('orchestrator') || lowerQ.includes('shield')) {
          sources.push('Products Catalog');
        }
        if (lowerQ.includes('hour') || lowerQ.includes('time') || lowerQ.includes('support')) {
          sources.push('Working Hours & SLA');
        }
        if (lowerQ.includes('hr') || lowerQ.includes('department') || lowerQ.includes('contact')) {
          sources.push('Department Directory');
        }
        if (lowerQ.includes('policy') || lowerQ.includes('remote') || lowerQ.includes('compliance')) {
          sources.push('Policies & FAQs');
        }
      }
    } catch (geminiError: any) {
      console.warn('Gemini API call failed or rate-limited, switching to verified demo fallback:', geminiError?.message);
      isDemoFallback = true;
    }
  } else {
    isDemoFallback = true;
  }

  // Grounded Deterministic Fallback Engine if AI is not configured or throws
  if (!answer) {
    isDemoFallback = true;
    const qLower = query.toLowerCase().trim();

    if (qLower.includes('what does this company do') || qLower.includes('what does') || qLower.includes('about')) {
      answer = `**${profile.company_name}** is an enterprise software and cloud AI engineering company founded in ${profile.founding_year} in San Francisco. We build intelligent multi-cloud infrastructure orchestration (**ApexCloud**), zero-trust cybersecurity suites (**ApexShield**), and real-time AI telemetry diagnostics (**DataPulse**) trusted by over 450 Fortune-2000 organizations.`;
      sources = ['Company Profile', 'Overview', 'FAQ #1'];
    } else if (qLower.includes('when') && (qLower.includes('established') || qLower.includes('founded') || qLower.includes('start'))) {
      answer = `**${profile.company_name}** was established on **March 1, ${profile.founding_year}**, by a team of veteran distributed systems architects in San Francisco, California.`;
      sources = ['Company Profile: Founding Year', 'FAQ #2'];
    } else if (qLower.includes('product') || qLower.includes('service') || qLower.includes('offer')) {
      answer = `Apex Dynamics offers three flagship products:\n\n1. **ApexCloud Orchestrator**: Multi-cloud Kubernetes auto-scaler ($1,200/mo base).\n2. **ApexShield Zero-Trust Suite**: Continuous behavioral identity verification ($18/user/mo).\n3. **DataPulse AI Telemetry Engine**: Automated incident postmortems & trace analysis ($2,400/mo).\n\nWe also provide enterprise services including **Cloud Migration & Modernization**, **Autonomous AI Systems Integration**, and **24/7 Mission-Critical Managed SRE**.`;
      sources = ['Products Catalog', 'Services Catalog', 'FAQ #8'];
    } else if (qLower.includes('head office') || qLower.includes('headquarter') || qLower.includes('address') || qLower.includes('where')) {
      answer = `Our global headquarters is located at:\n\n📍 **San Francisco HQ**: ${profile.headquarters_address}\n📍 **East Coast Financial Hub**: ${profile.secondary_office_address}\n\nWe also maintain regional engineering hubs in Austin, TX, and London, UK.`;
      sources = ['Company Profile: Addresses', 'FAQ #3'];
    } else if (qLower.includes('working hour') || qLower.includes('office hour') || qLower.includes('hours') || qLower.includes('time')) {
      answer = `Our corporate office working hours are:\n\n🕒 **Monday to Friday: 08:30 AM – 06:00 PM PST**\n\nOur technical support and SecOps threat monitoring operate **24/7/365** continuously for mission-critical client operations.`;
      sources = ['Company Profile: Operating Hours', 'FAQ #4'];
    } else if (qLower.includes('hr') || qLower.includes('human resource')) {
      answer = `You can reach the **Human Resources & Talent** department directly:\n\n📧 **Email**: hr@apexdynamics.com\n📞 **Phone**: +1 (415) 555-0192\n🏢 **Office**: Building A, 12th Floor (San Francisco HQ)\n⏰ **Hours**: Mon-Fri 08:30 – 17:30 PST\n\nDepartment Head: **Elena Rostova** (Chief People Officer).`;
      sources = ['Departments: Human Resources', 'Employee Directory', 'FAQ #5'];
    } else if (qLower.includes('department')) {
      const deptList = db.getDepartments().map(d => `• **${d.name}** (${d.code}) – Head: ${d.head_of_department} (${d.contact_email})`).join('\n');
      answer = `Apex Dynamics has 6 core departments:\n\n${deptList}`;
      sources = ['Departments Directory'];
    } else if (qLower.includes('mission') || qLower.includes('vision')) {
      answer = `**Mission**:\n"${profile.mission}"\n\n**Vision**:\n"${profile.vision}"`;
      sources = ['Company Profile: Mission & Vision', 'FAQ #10'];
    } else if (qLower.includes('remote') || qLower.includes('hybrid') || qLower.includes('policy')) {
      answer = `Apex Dynamics operates on a flexible hybrid work model with core collaboration hours between 10:00 AM and 03:00 PM local time. Team members may work remotely up to 3 days per week, and fully remote roles receive an annual $1,500 home-office wellness stipend.`;
      sources = ['HR Policies', 'FAQ #6'];
    } else if (qLower.includes('ceo') || qLower.includes('julian') || qLower.includes('founder') || qLower.includes('leadership')) {
      answer = `Apex Dynamics is led by **Julian Sterling** (Chief Executive Officer & Co-Founder), **Dr. Marcus Vance** (VP of Engineering), **Elena Rostova** (Chief People Officer), **David K. Chen** (Chief Commercial Officer), and **Tariq Al-Mansoor** (CISO).`;
      sources = ['Executive Leadership Records'];
    } else {
      answer = `I could not find verified records for that in the company database. Please contact our corporate reception desk at **${profile.official_email}** or call **${profile.official_phone}** for direct assistance.`;
      sources = ['Database Verification Check'];
    }
  }

  const responseTimeMs = Date.now() - startTime;

  // Log into chat audit history
  db.addChatLog({
    sessionId,
    query,
    response: answer,
    sources,
    isDemoFallback
  });

  return res.json({
    answer,
    sources,
    is_demo_fallback: isDemoFallback,
    response_time_ms: responseTimeMs,
    has_live_ai: !!ai
  });
});

// 11. Chat History & Admin Analytics
app.get('/api/chat/history', (_req: Request, res: Response) => {
  res.json(db.getChatHistory());
});

app.get('/api/admin/stats', (_req: Request, res: Response) => {
  res.json(db.getAdminStats());
});

// 12. Export SQL & Raw database files
app.get('/api/database/export-sql', (_req: Request, res: Response) => {
  res.json({
    status: 'success',
    dialect: 'MySQL 8.0+',
    tables: [
      'company_profile',
      'departments',
      'users',
      'employees',
      'products',
      'services',
      'faqs',
      'announcements',
      'chat_history'
    ],
    schemaPath: '/backend/schema.sql',
    sampleDataPath: '/backend/sample_data.sql'
  });
});

// ----------------------------------------------------
// Frontend Serving & Vite Integration
// ----------------------------------------------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Enterprise Assistant] Server is live on http://0.0.0.0:${PORT}`);
    console.log(`[Enterprise Assistant] AI Mode: ${apiKey ? 'Gemini 3.8 Flash Active' : 'Verified Deterministic Demo Mode'}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
