-- =====================================================================
-- Sample Seed Data for AI-Powered Company Information Assistant
-- Fictional Company: Apex Dynamics Inc.
-- =====================================================================

USE company_assistant_db;

-- 1. COMPANY PROFILE
INSERT INTO company_profile (
    id,
    company_name,
    legal_name,
    tagline,
    founding_year,
    industry,
    headquarters_address,
    secondary_office_address,
    official_email,
    official_phone,
    support_phone,
    working_hours,
    timezone,
    website,
    mission,
    vision,
    overview,
    social_links_json
) VALUES (
    1,
    'Apex Dynamics Inc.',
    'Apex Dynamics Technologies Corporation',
    'Intelligent Cloud Infrastructure & Enterprise AI Solutions',
    2018,
    'Enterprise Software & Cloud AI Systems',
    '500 Howard Street, Suite 1400, San Francisco, CA 94105, United States',
    'One World Trade Center, Floor 48, New York, NY 10007, United States',
    'contact@apexdynamics.com',
    '+1 (415) 555-0190',
    '+1 (800) 555-0144 (Toll-Free 24/7 Priority Support)',
    'Monday to Friday: 08:30 AM - 06:00 PM PST (Support operates 24/7/365)',
    'Pacific Standard Time (PST / UTC-8)',
    'https://www.apexdynamics.com',
    'To empower global enterprises with resilient cloud architectures, autonomous AI pipelines, and zero-trust cybersecurity that accelerate human ingenuity.',
    'To become the world standard for dependable, ethical, and self-optimizing digital enterprise infrastructure.',
    'Apex Dynamics Inc. was founded in 2018 in San Francisco by veteran distributed systems engineers. We build enterprise-grade cloud management platforms, autonomous telemetry pipelines, and AI integration middleware trusted by over 450 Fortune-2000 organizations. With over 620 global team members across North America and Europe, Apex Dynamics maintains a 99.995% service uptime record and ISO 27001, SOC 2 Type II, and HIPAA compliance certifications.',
    '{"linkedin": "https://linkedin.com/company/apex-dynamics", "github": "https://github.com/apex-dynamics", "twitter": "https://x.com/apexdynamics", "youtube": "https://youtube.com/@apexdynamics"}'
) ON DUPLICATE KEY UPDATE company_name=VALUES(company_name);

-- 2. DEPARTMENTS
INSERT INTO departments (id, name, code, description, head_of_department, contact_email, contact_phone, floor_location, operating_hours) VALUES
(1, 'Engineering & Architecture', 'ENG', 'Oversees core cloud platform engineering, distributed database clusters, AI research, and CI/CD pipelines.', 'Dr. Marcus Vance (VP of Engineering)', 'engineering@apexdynamics.com', '+1 (415) 555-0191', 'Building A, 14th Floor', 'Mon-Fri 09:00 - 18:00 PST'),
(2, 'Human Resources & Talent', 'HR', 'Responsible for employee onboarding, talent acquisition, healthcare benefits, workplace culture, and company policies.', 'Elena Rostova (Chief People Officer)', 'hr@apexdynamics.com', '+1 (415) 555-0192', 'Building A, 12th Floor', 'Mon-Fri 08:30 - 17:30 PST'),
(3, 'Enterprise Solutions & Sales', 'SALES', 'Handles enterprise software licensing, proof-of-concept deployments, partner relations, and commercial bids.', 'David K. Chen (Chief Commercial Officer)', 'sales@apexdynamics.com', '+1 (415) 555-0193', 'Building B, 8th Floor', 'Mon-Fri 08:00 - 18:00 PST / EST'),
(4, 'Customer Success & Support', 'SUPP', 'Provides round-the-clock technical troubleshooting, SLA adherence, onboarding training, and enterprise incident response.', 'Sarah Jenkins (Head of Customer Success)', 'support@apexdynamics.com', '+1 (800) 555-0144', 'Building A, 11th Floor', '24/7/365 Continuous Coverage'),
(5, 'Information Security & Compliance', 'SEC', 'Maintains zero-trust network boundaries, conducts automated vulnerability audits, and oversees SOC 2 & GDPR compliance.', 'Tariq Al-Mansoor (Chief Information Security Officer)', 'security@apexdynamics.com', '+1 (415) 555-0195', 'Building A, 15th Floor (Secure Wing)', 'Mon-Fri 09:00 - 18:00 PST (On-Call 24/7)'),
(6, 'Finance & Corporate Operations', 'FIN', 'Manages vendor billing, investor relations, payroll execution, equity management, and regulatory filings.', 'Rachel Greenburg (VP of Finance)', 'finance@apexdynamics.com', '+1 (415) 555-0196', 'Building B, 9th Floor', 'Mon-Fri 09:00 - 17:00 PST');

-- 3. USERS (passwords hashed using standard sha256 or bcrypt)
-- demo hash for 'admin123', 'user123', 'staff123'
INSERT INTO users (id, full_name, email, password_hash, role, department_id, is_active) VALUES
(1, 'Administrator Account', 'admin@apexdynamics.com', '$2b$12$e68YmP.8G8hLd3n4K/8G8uEaDqLzR4f8yXk9XG1h9O7vJ8yA6bVea', 'admin', 1, TRUE),
(2, 'Dr. Marcus Vance', 'marcus.vance@apexdynamics.com', '$2b$12$e68YmP.8G8hLd3n4K/8G8uEaDqLzR4f8yXk9XG1h9O7vJ8yA6bVea', 'employee', 1, TRUE),
(3, 'Elena Rostova', 'elena.rostova@apexdynamics.com', '$2b$12$e68YmP.8G8hLd3n4K/8G8uEaDqLzR4f8yXk9XG1h9O7vJ8yA6bVea', 'employee', 2, TRUE),
(4, 'General User / Guest', 'demo.user@apexdynamics.com', '$2b$12$e68YmP.8G8hLd3n4K/8G8uEaDqLzR4f8yXk9XG1h9O7vJ8yA6bVea', 'user', NULL, TRUE);

-- 4. EMPLOYEES DIRECTORY
INSERT INTO employees (id, department_id, full_name, role_title, official_email, public_phone, internal_extension, office_location, bio, is_leadership, is_confidential, joined_date, avatar_url) VALUES
(1, 1, 'Julian Sterling', 'Chief Executive Officer & Co-Founder', 'julian.sterling@apexdynamics.com', '+1 (415) 555-0190', 'x1001', 'San Francisco HQ - Exec Suite', 'Co-founded Apex Dynamics in 2018. Former principal architect at HyperScale Labs with 18+ years in distributed systems.', TRUE, FALSE, '2018-03-01', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80'),
(2, 1, 'Dr. Marcus Vance', 'VP of Engineering', 'marcus.vance@apexdynamics.com', '+1 (415) 555-0191', 'x1042', 'San Francisco HQ - 14th Fl', 'PhD in Computer Science from MIT. Directs our 120-person distributed engineering division and core cloud orchestration engine.', TRUE, FALSE, '2018-05-15', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'),
(3, 2, 'Elena Rostova', 'Chief People Officer', 'elena.rostova@apexdynamics.com', '+1 (415) 555-0192', 'x1024', 'San Francisco HQ - 12th Fl', 'Heads worldwide human capital, talent strategy, comprehensive health benefits, and workplace inclusion programs.', TRUE, FALSE, '2019-01-10', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80'),
(4, 3, 'David K. Chen', 'Chief Commercial Officer', 'david.chen@apexdynamics.com', '+1 (415) 555-0193', 'x1060', 'New York Financial Hub - 48th Fl', 'Directs global enterprise sales, strategic software reseller partnerships, and executive client renewals across 40 countries.', TRUE, FALSE, '2019-08-20', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80'),
(5, 5, 'Tariq Al-Mansoor', 'Chief Information Security Officer', 'tariq.mansoor@apexdynamics.com', '+1 (415) 555-0195', 'x1099', 'San Francisco HQ - 15th Fl', 'Certified CISSP and ex-defense cybersecurity specialist leading Zero-Trust defense, penetration audits, and threat intel.', TRUE, FALSE, '2020-02-01', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80'),
(6, 4, 'Sarah Jenkins', 'Head of Customer Success', 'sarah.jenkins@apexdynamics.com', '+1 (800) 555-0144', 'x1080', 'San Francisco HQ - 11th Fl', 'Oversees 24/7 technical support engineers, SLA response time compliance, and enterprise migration onboarding.', FALSE, FALSE, '2020-11-12', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80'),
(7, 1, 'Maya Lin-Patel', 'Principal Cloud AI Architect', 'maya.patel@apexdynamics.com', NULL, 'x1402', 'San Francisco HQ - 14th Fl', 'Leads generative AI retrieval pipelines, model context compression, and vector embeddings acceleration.', FALSE, FALSE, '2021-04-18', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80'),
(8, 2, 'Carlos Mendoza', 'Senior HR Business Partner', 'carlos.mendoza@apexdynamics.com', NULL, 'x1028', 'San Francisco HQ - 12th Fl', 'First contact for employee onboarding, confidential conflict resolution, parental leave administration, and 401(k) inquiries.', FALSE, FALSE, '2021-09-01', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80'),
(9, 6, 'Rachel Greenburg', 'VP of Finance & Corporate Operations', 'rachel.greenburg@apexdynamics.com', '+1 (415) 555-0196', 'x1015', 'New York Financial Hub - 48th Fl', 'Oversees treasury, SEC compliance, audit committees, enterprise contract approvals, and investor reporting.', TRUE, FALSE, '2020-06-15', 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&q=80'),
(10, 5, 'Special Investigations Unit (Redacted)', 'Classified Security Personnel', 'internal-sec-ops@apexdynamics.com', NULL, 'x9999', 'Restricted Facility', 'Confidential vulnerability response team operating with restricted clearance.', FALSE, TRUE, '2022-01-01', NULL);

-- 5. PRODUCTS
INSERT INTO products (id, name, slug, category, summary, description, features_json, pricing_tier, target_audience, status, documentation_url) VALUES
(1, 'ApexCloud Orchestrator', 'apexcloud-orchestrator', 'Cloud Infrastructure', 'Autonomous multi-cloud Kubernetes orchestration and dynamic workload auto-scaling.', 'ApexCloud Orchestrator is an intelligent multi-cloud control plane that automatically optimizes containerized workloads across AWS, Google Cloud, and Azure. It lowers cloud infrastructure spend by up to 38% through real-time spot instance harvesting and predictive telemetry balancing.', '["Multi-Cloud Kubernetes Management", "Autonomous Cost Optimization Engine", "Zero-Downtime Live Migration", "Telemetry Anomaly Detection", "GitOps Native Syncing"]', '$1,200 / month base + $0.015/node-hr', 'DevOps leads, Site Reliability Engineers, and enterprise infrastructure teams', 'active', 'https://docs.apexdynamics.com/products/apexcloud'),
(2, 'ApexShield Zero-Trust Suite', 'apexshield-zero-trust', 'Cybersecurity', 'Continuous behavioral identity verification, micro-segmentation, and threat prevention.', 'ApexShield eliminates legacy perimeter VPNs by enforcing real-time identity context and hardware security keys on every microservice request. Features automated lateral movement blocking and instantaneous credential quarantine.', '["Hardware-backed MFA & FIDO2 Enforcement", "Micro-Segmentation Policy Engine", "Automated Lateral Movement Quarantine", "Real-time Ephemeral Credentials", "SOC 2 & HIPAA Audit Reporting"]', '$18 / user / month (Enterprise tier available)', 'Chief Information Security Officers, SecOps engineers, and Compliance auditors', 'active', 'https://docs.apexdynamics.com/products/apexshield'),
(3, 'DataPulse AI Telemetry Engine', 'datapulse-ai-engine', 'AI & Analytics', 'Real-time observability platform with automated root-cause analysis powered by LLMs.', 'DataPulse ingests trillions of distributed logs, metrics, and distributed traces, synthesizing them into actionable root-cause incident diagnoses in under 4 seconds. Integrates natively with Slack, PagerDuty, and ServiceNow.', '["Automated Incident Postmortem Drafting", "Distributed Trace Graph Reconstruction", "P99 Latency Anomaly Alerts", "Predictive Disk & Memory Exhaustion Warnings", "High-Throughput Vector Log Indexer"]', '$2,400 / month (Includes 5TB ingestion/mo)', 'Enterprise software engineering teams and Network Operations Centers', 'active', 'https://docs.apexdynamics.com/products/datapulse'),
(4, 'ApexEdge Smart Gateway', 'apexedge-gateway', 'Edge Computing', 'Ultra-low-latency API gateway with WebAssembly edge compute and global caching.', 'ApexEdge routes and processes API requests within 5 milliseconds globally across 280 edge points of presence. Supports serverless WebAssembly filters, DDoS mitigation, and dynamic TLS 1.3 termination.', '["Global Sub-5ms Routing Latency", "WebAssembly Serverless Plugins", "Automated Layer 7 DDoS Shield", "Global Geo-DNS Routing", "Real-time Traffic Shaping"]', '$450 / month + bandwidth tiers', 'API Platform architects, mobile app backends, and global e-commerce systems', 'active', 'https://docs.apexdynamics.com/products/apexedge');

-- 6. SERVICES
INSERT INTO services (id, name, slug, category, description, deliverables_json, sla_details, contact_email, pricing_model, is_active) VALUES
(1, 'Enterprise Cloud Migration & Modernization', 'cloud-migration-modernization', 'Professional Services', 'Turnkey migration of legacy monolithic architectures to cloud-native microservices with zero downtime guarantees.', '["Full Architectural Readiness Assessment", "Terraform & OpenTofu Infrastructure As Code Blueprints", "Database Zero-Downtime Data Re-platforming", "Staff SRE Enablement Workshops", "30-Day Post-Cutover Hypercare Support"]', '99.99% Availability Guarantee during cutover window', 'migration-services@apexdynamics.com', 'Custom Statement of Work ($45k - $250k typical project)', TRUE),
(2, 'Autonomous AI Systems Integration', 'ai-systems-integration', 'Consulting & Engineering', 'Custom fine-tuning, RAG architecture buildouts, and private enterprise vector database deployments with strict data boundary protection.', '["Domain Data Pipeline & Vector Cleansing", "Private Retrieval-Augmented Generation (RAG) Architecture", "Role-Based Data Redaction Middleware", "Custom LLM Evaluation Benchmark Suite", "SOC 2 Type II AI Compliance Package"]', 'Guaranteed response latency under 600ms for internal RAG queries', 'ai-consulting@apexdynamics.com', 'Fixed-Scope Engagement or Monthly Retainer ($15k/mo)', TRUE),
(3, '24/7/365 Mission-Critical Managed SRE', 'managed-sre-support', 'Managed Operations', 'Dedicated site reliability engineering team monitoring your distributed infrastructure around the clock.', '["Sub-5 minute P1 Incident Response SLA", "Automated Chaos Engineering Runs", "Weekly Capacity Planning Briefings", "Quarterly Disaster Recovery Simulation Drills", "Dedicated Senior Technical Account Manager"]', 'P1 Incident Response: < 5 minutes; P2 Response: < 15 minutes', 'support-plans@apexdynamics.com', 'Starting at $6,500 / month', TRUE);

-- 7. FAQS & POLICIES
INSERT INTO faqs (id, category, question, answer, department_id, is_public, display_order) VALUES
(1, 'Company & General', 'What does Apex Dynamics Inc. do?', 'Apex Dynamics Inc. is a leading enterprise software provider founded in 2018 in San Francisco. We develop intelligent multi-cloud infrastructure management tools (ApexCloud), zero-trust cybersecurity suites (ApexShield), and real-time AI telemetry analytics (DataPulse) for Fortune-2000 organizations.', 1, TRUE, 1),
(2, 'Company & General', 'When was Apex Dynamics established?', 'The company was established on March 1, 2018, by a team of veteran distributed systems architects in San Francisco, California.', 1, TRUE, 2),
(3, 'Company & General', 'Where is the head office located and what are the office locations?', 'Our global headquarters is located at 500 Howard Street, Suite 1400, San Francisco, CA 94105. We also operate our East Coast Financial Hub at One World Trade Center, Floor 48, New York, NY 10007, and maintain engineering branches in Austin and London.', 1, TRUE, 3),
(4, 'Operations & Hours', 'What are the company working hours?', 'Our corporate offices are open Monday through Friday from 08:30 AM to 06:00 PM Pacific Standard Time (PST). Our technical customer support and cybersecurity incident teams operate continuously 24 hours a day, 7 days a week, 365 days a year.', 4, TRUE, 4),
(5, 'Human Resources', 'How can I contact the HR department?', 'You can contact the Human Resources & Talent department by emailing hr@apexdynamics.com or calling +1 (415) 555-0192 during standard office hours (Mon-Fri 08:30 - 17:30 PST). For recruitment inquiries, visit our careers portal or reach out to talent@apexdynamics.com.', 2, TRUE, 5),
(6, 'Company Policies', 'What is the company remote and hybrid work policy?', 'Apex Dynamics operates on a flexible hybrid model. Teams have core collaboration hours between 10:00 AM and 03:00 PM local time. Employees may work remotely up to 3 days per week with manager coordination, and fully remote contracts are supported for engineering and support personnel with an annual $1,500 home-office wellness stipend.', 2, TRUE, 6),
(7, 'Security & Compliance', 'What compliance standards and certifications does the company hold?', 'Apex Dynamics maintains active SOC 2 Type II certification, ISO/IEC 27001:2022, HIPAA compliance for healthcare data transit, and full alignment with GDPR and CCPA data privacy frameworks. Independent audits are conducted bi-annually.', 5, TRUE, 7),
(8, 'Products & Pricing', 'What products does Apex Dynamics offer and how are they priced?', 'We offer three flagship products: 1) ApexCloud Orchestrator ($1,200/mo base), 2) ApexShield Zero-Trust Suite ($18/user/mo), and 3) DataPulse AI Telemetry Engine ($2,400/mo). We also provide custom enterprise volume licensing with dedicated account discounts.', 3, TRUE, 8),
(9, 'Sales & Procurement', 'How do I schedule an enterprise demo or request a custom quotation?', 'You can contact Enterprise Solutions at sales@apexdynamics.com, call +1 (415) 555-0193, or submit an inquiry through our online assistant. Our solution architects typically provide a scheduled demo within 24 business hours.', 3, TRUE, 9),
(10, 'Vision & Mission', 'What is the mission and vision of Apex Dynamics?', 'Mission: To empower global enterprises with resilient cloud architectures, autonomous AI pipelines, and zero-trust cybersecurity that accelerate human ingenuity. Vision: To become the world standard for dependable, ethical, and self-optimizing digital enterprise infrastructure.', 1, TRUE, 10);

-- 8. ANNOUNCEMENTS
INSERT INTO announcements (id, title, content, category, priority, published_date, is_active) VALUES
(1, 'Apex Dynamics Completes Annual SOC 2 Type II and ISO 27001 Re-Certification', 'We are pleased to announce that Apex Dynamics has successfully renewed our SOC 2 Type II and ISO/IEC 27001 security compliance audits with zero deficiencies noted. The full audit report is available for enterprise clients upon NDA execution.', 'Compliance & Trust', 'info', '2026-09-15', TRUE),
(2, 'Launch of DataPulse 4.2 with Sub-4-Second Root Cause Diagnosis', 'Our engineering team has deployed DataPulse 4.2 featuring enhanced generative LLM postmortems and real-time distributed trace graph reconstruction. Existing customers receive this update automatically at no additional license charge.', 'Product Release', 'normal', '2026-10-01', TRUE),
(3, 'Corporate Holiday Schedule & Support Coverage Notice', 'All regional offices will observe the upcoming holiday closures. Our 24/7 Mission-Critical Support and SecOps threat monitoring will remain fully staffed and active around the clock with normal SLA guarantees.', 'Operations', 'normal', '2026-10-08', TRUE);

-- 9. INITIAL CHAT HISTORY SEED (Examples of grounded answers)
INSERT INTO chat_history (id, user_id, session_id, user_query, bot_response, retrieved_sources_json, is_demo_fallback, response_time_ms) VALUES
(1, 4, 'sess_demo_001', 'What does this company do and when was it founded?', 'Apex Dynamics Inc. is an enterprise software and cloud AI company founded on March 1, 2018, in San Francisco, California. The company specializes in intelligent multi-cloud infrastructure orchestration (ApexCloud), zero-trust cybersecurity (ApexShield), and real-time AI telemetry analytics (DataPulse).', '["Company Profile", "FAQ #1", "FAQ #2"]', FALSE, 280),
(2, 4, 'sess_demo_001', 'What are the company working hours and how can I reach HR?', 'Apex Dynamics corporate offices operate Monday through Friday from 08:30 AM to 06:00 PM PST (Support operates 24/7/365). You can reach the Human Resources & Talent department by email at hr@apexdynamics.com or by phone at +1 (415) 555-0192 (Mon-Fri 08:30 - 17:30 PST).', '["Company Profile", "Departments: HR", "FAQ #4", "FAQ #5"]', FALSE, 310);
