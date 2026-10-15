import {
  CompanyProfile,
  Department,
  Employee,
  Product,
  Service,
  FAQ,
  Announcement,
  User,
  SearchResultItem,
  AdminStats
} from '../types.ts';

// In-Memory Relational Database Simulation with exact MySQL Schema parity
export class EnterpriseDatabase {
  private companyProfile: CompanyProfile;
  private departments: Department[];
  private users: User[];
  private employees: Employee[];
  private products: Product[];
  private services: Service[];
  private faqs: FAQ[];
  private announcements: Announcement[];
  private chatHistory: Array<{
    id: number;
    userId?: number;
    sessionId: string;
    query: string;
    response: string;
    sources: string[];
    isDemoFallback: boolean;
    timestamp: string;
  }>;

  constructor() {
    this.companyProfile = {
      id: 1,
      company_name: 'Apex Dynamics Inc.',
      legal_name: 'Apex Dynamics Technologies Corporation',
      tagline: 'Intelligent Cloud Infrastructure & Enterprise AI Solutions',
      founding_year: 2018,
      industry: 'Enterprise Software & Cloud AI Systems',
      headquarters_address: '500 Howard Street, Suite 1400, San Francisco, CA 94105, United States',
      secondary_office_address: 'One World Trade Center, Floor 48, New York, NY 10007, United States',
      official_email: 'contact@apexdynamics.com',
      official_phone: '+1 (415) 555-0190',
      support_phone: '+1 (800) 555-0144 (Toll-Free 24/7/365)',
      working_hours: 'Monday to Friday: 08:30 AM - 06:00 PM PST (Support operates 24/7/365)',
      timezone: 'Pacific Standard Time (PST / UTC-8)',
      website: 'https://www.apexdynamics.com',
      mission: 'To empower global enterprises with resilient cloud architectures, autonomous AI pipelines, and zero-trust cybersecurity that accelerate human ingenuity.',
      vision: 'To become the world standard for dependable, ethical, and self-optimizing digital enterprise infrastructure.',
      overview: 'Apex Dynamics Inc. was founded in 2018 in San Francisco by veteran distributed systems engineers. We build enterprise-grade cloud management platforms, autonomous telemetry pipelines, and AI integration middleware trusted by over 450 Fortune-2000 organizations. With over 620 global team members across North America and Europe, Apex Dynamics maintains a 99.995% service uptime record and ISO 27001, SOC 2 Type II, and HIPAA compliance certifications.',
      social_links: {
        linkedin: 'https://linkedin.com/company/apex-dynamics',
        github: 'https://github.com/apex-dynamics',
        twitter: 'https://x.com/apexdynamics',
        youtube: 'https://youtube.com/@apexdynamics'
      }
    };

    this.departments = [
      {
        id: 1,
        name: 'Engineering & Architecture',
        code: 'ENG',
        description: 'Oversees core cloud platform engineering, distributed database clusters, AI research, and CI/CD pipelines.',
        head_of_department: 'Dr. Marcus Vance (VP of Engineering)',
        contact_email: 'engineering@apexdynamics.com',
        contact_phone: '+1 (415) 555-0191',
        floor_location: 'Building A, 14th Floor',
        operating_hours: 'Mon-Fri 09:00 - 18:00 PST'
      },
      {
        id: 2,
        name: 'Human Resources & Talent',
        code: 'HR',
        description: 'Responsible for employee onboarding, talent acquisition, healthcare benefits, workplace culture, and company policies.',
        head_of_department: 'Elena Rostova (Chief People Officer)',
        contact_email: 'hr@apexdynamics.com',
        contact_phone: '+1 (415) 555-0192',
        floor_location: 'Building A, 12th Floor',
        operating_hours: 'Mon-Fri 08:30 - 17:30 PST'
      },
      {
        id: 3,
        name: 'Enterprise Solutions & Sales',
        code: 'SALES',
        description: 'Handles enterprise software licensing, proof-of-concept deployments, partner relations, and commercial bids.',
        head_of_department: 'David K. Chen (Chief Commercial Officer)',
        contact_email: 'sales@apexdynamics.com',
        contact_phone: '+1 (415) 555-0193',
        floor_location: 'Building B, 8th Floor',
        operating_hours: 'Mon-Fri 08:00 - 18:00 PST / EST'
      },
      {
        id: 4,
        name: 'Customer Success & Support',
        code: 'SUPP',
        description: 'Provides round-the-clock technical troubleshooting, SLA adherence, onboarding training, and enterprise incident response.',
        head_of_department: 'Sarah Jenkins (Head of Customer Success)',
        contact_email: 'support@apexdynamics.com',
        contact_phone: '+1 (800) 555-0144',
        floor_location: 'Building A, 11th Floor',
        operating_hours: '24/7/365 Continuous Coverage'
      },
      {
        id: 5,
        name: 'Information Security & Compliance',
        code: 'SEC',
        description: 'Maintains zero-trust network boundaries, conducts automated vulnerability audits, and oversees SOC 2 & GDPR compliance.',
        head_of_department: 'Tariq Al-Mansoor (Chief Information Security Officer)',
        contact_email: 'security@apexdynamics.com',
        contact_phone: '+1 (415) 555-0195',
        floor_location: 'Building A, 15th Floor (Secure Wing)',
        operating_hours: 'Mon-Fri 09:00 - 18:00 PST (On-Call 24/7)'
      },
      {
        id: 6,
        name: 'Finance & Corporate Operations',
        code: 'FIN',
        description: 'Manages vendor billing, investor relations, payroll execution, equity management, and regulatory filings.',
        head_of_department: 'Rachel Greenburg (VP of Finance)',
        contact_email: 'finance@apexdynamics.com',
        contact_phone: '+1 (415) 555-0196',
        floor_location: 'Building B, 9th Floor',
        operating_hours: 'Mon-Fri 09:00 - 17:00 PST'
      }
    ];

    this.users = [
      {
        id: 1,
        full_name: 'Administrator Account',
        email: 'admin@apexdynamics.com',
        role: 'admin',
        department_id: 1,
        department_name: 'Engineering & Architecture',
        is_active: true
      },
      {
        id: 2,
        full_name: 'Dr. Marcus Vance',
        email: 'marcus.vance@apexdynamics.com',
        role: 'employee',
        department_id: 1,
        department_name: 'Engineering & Architecture',
        is_active: true
      },
      {
        id: 3,
        full_name: 'Elena Rostova',
        email: 'elena.rostova@apexdynamics.com',
        role: 'employee',
        department_id: 2,
        department_name: 'Human Resources & Talent',
        is_active: true
      },
      {
        id: 4,
        full_name: 'General User / Guest',
        email: 'demo.user@apexdynamics.com',
        role: 'user',
        is_active: true
      }
    ];

    this.employees = [
      {
        id: 1,
        department_id: 1,
        full_name: 'Julian Sterling',
        role_title: 'Chief Executive Officer & Co-Founder',
        official_email: 'julian.sterling@apexdynamics.com',
        public_phone: '+1 (415) 555-0190',
        internal_extension: 'x1001',
        office_location: 'San Francisco HQ - Exec Suite',
        bio: 'Co-founded Apex Dynamics in 2018. Former principal architect at HyperScale Labs with 18+ years in distributed systems.',
        is_leadership: true,
        is_confidential: false,
        joined_date: '2018-03-01',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80'
      },
      {
        id: 2,
        department_id: 1,
        full_name: 'Dr. Marcus Vance',
        role_title: 'VP of Engineering',
        official_email: 'marcus.vance@apexdynamics.com',
        public_phone: '+1 (415) 555-0191',
        internal_extension: 'x1042',
        office_location: 'San Francisco HQ - 14th Fl',
        bio: 'PhD in Computer Science from MIT. Directs our 120-person distributed engineering division and core cloud orchestration engine.',
        is_leadership: true,
        is_confidential: false,
        joined_date: '2018-05-15',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'
      },
      {
        id: 3,
        department_id: 2,
        full_name: 'Elena Rostova',
        role_title: 'Chief People Officer',
        official_email: 'elena.rostova@apexdynamics.com',
        public_phone: '+1 (415) 555-0192',
        internal_extension: 'x1024',
        office_location: 'San Francisco HQ - 12th Fl',
        bio: 'Heads worldwide human capital, talent strategy, comprehensive health benefits, and workplace inclusion programs.',
        is_leadership: true,
        is_confidential: false,
        joined_date: '2019-01-10',
        avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80'
      },
      {
        id: 4,
        department_id: 3,
        full_name: 'David K. Chen',
        role_title: 'Chief Commercial Officer',
        official_email: 'david.chen@apexdynamics.com',
        public_phone: '+1 (415) 555-0193',
        internal_extension: 'x1060',
        office_location: 'New York Financial Hub - 48th Fl',
        bio: 'Directs global enterprise sales, strategic software reseller partnerships, and executive client renewals across 40 countries.',
        is_leadership: true,
        is_confidential: false,
        joined_date: '2019-08-20',
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80'
      },
      {
        id: 5,
        department_id: 5,
        full_name: 'Tariq Al-Mansoor',
        role_title: 'Chief Information Security Officer',
        official_email: 'tariq.mansoor@apexdynamics.com',
        public_phone: '+1 (415) 555-0195',
        internal_extension: 'x1099',
        office_location: 'San Francisco HQ - 15th Fl',
        bio: 'Certified CISSP and ex-defense cybersecurity specialist leading Zero-Trust defense, penetration audits, and threat intel.',
        is_leadership: true,
        is_confidential: false,
        joined_date: '2020-02-01',
        avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80'
      },
      {
        id: 6,
        department_id: 4,
        full_name: 'Sarah Jenkins',
        role_title: 'Head of Customer Success',
        official_email: 'sarah.jenkins@apexdynamics.com',
        public_phone: '+1 (800) 555-0144',
        internal_extension: 'x1080',
        office_location: 'San Francisco HQ - 11th Fl',
        bio: 'Oversees 24/7 technical support engineers, SLA response time compliance, and enterprise migration onboarding.',
        is_leadership: false,
        is_confidential: false,
        joined_date: '2020-11-12',
        avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80'
      },
      {
        id: 7,
        department_id: 1,
        full_name: 'Maya Lin-Patel',
        role_title: 'Principal Cloud AI Architect',
        official_email: 'maya.patel@apexdynamics.com',
        public_phone: null,
        internal_extension: 'x1402',
        office_location: 'San Francisco HQ - 14th Fl',
        bio: 'Leads generative AI retrieval pipelines, model context compression, and vector embeddings acceleration.',
        is_leadership: false,
        is_confidential: false,
        joined_date: '2021-04-18',
        avatar_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80'
      },
      {
        id: 8,
        department_id: 2,
        full_name: 'Carlos Mendoza',
        role_title: 'Senior HR Business Partner',
        official_email: 'carlos.mendoza@apexdynamics.com',
        public_phone: null,
        internal_extension: 'x1028',
        office_location: 'San Francisco HQ - 12th Fl',
        bio: 'First contact for employee onboarding, confidential conflict resolution, parental leave administration, and 401(k) inquiries.',
        is_leadership: false,
        is_confidential: false,
        joined_date: '2021-09-01',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80'
      },
      {
        id: 9,
        department_id: 6,
        full_name: 'Rachel Greenburg',
        role_title: 'VP of Finance & Operations',
        official_email: 'rachel.greenburg@apexdynamics.com',
        public_phone: '+1 (415) 555-0196',
        internal_extension: 'x1015',
        office_location: 'New York Financial Hub - 48th Fl',
        bio: 'Oversees treasury, SEC compliance, audit committees, enterprise contract approvals, and investor reporting.',
        is_leadership: true,
        is_confidential: false,
        joined_date: '2020-06-15',
        avatar_url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&q=80'
      },
      {
        id: 10,
        department_id: 5,
        full_name: 'Classified Operations Lead',
        role_title: 'Red Team Lead (Confidential)',
        official_email: 'sec-intel@apexdynamics.com',
        public_phone: null,
        internal_extension: 'x9999',
        office_location: 'Restricted Facility',
        bio: 'Restricted personnel record.',
        is_leadership: false,
        is_confidential: true,
        joined_date: '2022-01-01',
        avatar_url: null
      }
    ];

    this.products = [
      {
        id: 1,
        name: 'ApexCloud Orchestrator',
        slug: 'apexcloud-orchestrator',
        category: 'Cloud Infrastructure',
        summary: 'Autonomous multi-cloud Kubernetes orchestration and dynamic workload auto-scaling.',
        description: 'ApexCloud Orchestrator is an intelligent multi-cloud control plane that automatically optimizes containerized workloads across AWS, Google Cloud, and Azure. It lowers cloud infrastructure spend by up to 38% through real-time spot instance harvesting and predictive telemetry balancing.',
        features: [
          'Multi-Cloud Kubernetes Management',
          'Autonomous Cost Optimization Engine',
          'Zero-Downtime Live Workload Migration',
          'Telemetry Anomaly Detection',
          'GitOps Native Syncing'
        ],
        pricing_tier: '$1,200 / month base + $0.015/node-hr',
        target_audience: 'DevOps leads, Site Reliability Engineers, and infrastructure teams',
        status: 'active',
        documentation_url: 'https://docs.apexdynamics.com/products/apexcloud'
      },
      {
        id: 2,
        name: 'ApexShield Zero-Trust Suite',
        slug: 'apexshield-zero-trust',
        category: 'Cybersecurity',
        summary: 'Continuous behavioral identity verification, micro-segmentation, and threat prevention.',
        description: 'ApexShield eliminates legacy perimeter VPNs by enforcing real-time identity context and hardware security keys on every microservice request. Features automated lateral movement blocking and instantaneous credential quarantine.',
        features: [
          'Hardware-backed MFA & FIDO2 Enforcement',
          'Micro-Segmentation Policy Engine',
          'Automated Lateral Movement Quarantine',
          'Real-time Ephemeral Credentials',
          'SOC 2 & HIPAA Audit Reporting'
        ],
        pricing_tier: '$18 / user / month (Enterprise tier available)',
        target_audience: 'Chief Information Security Officers, SecOps engineers, and Compliance auditors',
        status: 'active',
        documentation_url: 'https://docs.apexdynamics.com/products/apexshield'
      },
      {
        id: 3,
        name: 'DataPulse AI Telemetry Engine',
        slug: 'datapulse-ai-engine',
        category: 'AI & Observability',
        summary: 'Real-time observability platform with automated root-cause analysis powered by LLMs.',
        description: 'DataPulse ingests trillions of distributed logs, metrics, and traces, synthesizing them into actionable root-cause incident diagnoses in under 4 seconds. Integrates natively with Slack, PagerDuty, and ServiceNow.',
        features: [
          'Automated Incident Postmortem Drafting',
          'Distributed Trace Graph Reconstruction',
          'P99 Latency Anomaly Alerts',
          'Predictive Memory Exhaustion Warnings',
          'High-Throughput Vector Log Indexer'
        ],
        pricing_tier: '$2,400 / month (Includes 5TB ingestion/mo)',
        target_audience: 'Enterprise software engineering teams and Network Operations Centers',
        status: 'active',
        documentation_url: 'https://docs.apexdynamics.com/products/datapulse'
      },
      {
        id: 4,
        name: 'ApexEdge Smart Gateway',
        slug: 'apexedge-gateway',
        category: 'Edge Computing',
        summary: 'Ultra-low-latency API gateway with WebAssembly edge compute and global caching.',
        description: 'ApexEdge routes and processes API requests within 5 milliseconds globally across 280 edge points of presence. Supports serverless WebAssembly filters, DDoS mitigation, and dynamic TLS 1.3 termination.',
        features: [
          'Global Sub-5ms Routing Latency',
          'WebAssembly Serverless Plugins',
          'Automated Layer 7 DDoS Shield',
          'Global Geo-DNS Routing',
          'Real-time Traffic Shaping'
        ],
        pricing_tier: '$450 / month + bandwidth tiers',
        target_audience: 'API Platform architects, mobile app backends, and global e-commerce systems',
        status: 'active',
        documentation_url: 'https://docs.apexdynamics.com/products/apexedge'
      }
    ];

    this.services = [
      {
        id: 1,
        name: 'Enterprise Cloud Migration & Modernization',
        slug: 'cloud-migration-modernization',
        category: 'Professional Services',
        description: 'Turnkey migration of legacy monolithic architectures to cloud-native microservices with zero downtime guarantees.',
        deliverables: [
          'Full Architectural Readiness Assessment',
          'Terraform & OpenTofu Infrastructure As Code Blueprints',
          'Database Zero-Downtime Data Re-platforming',
          'Staff SRE Enablement Workshops',
          '30-Day Post-Cutover Hypercare Support'
        ],
        sla_details: '99.99% Availability Guarantee during cutover window',
        contact_email: 'migration-services@apexdynamics.com',
        pricing_model: 'Custom Statement of Work ($45k - $250k typical project)',
        is_active: true
      },
      {
        id: 2,
        name: 'Autonomous AI Systems Integration',
        slug: 'ai-systems-integration',
        category: 'Consulting & Engineering',
        description: 'Custom fine-tuning, RAG architecture buildouts, and private enterprise vector database deployments with strict data boundary protection.',
        deliverables: [
          'Domain Data Pipeline & Vector Cleansing',
          'Private Retrieval-Augmented Generation (RAG) Architecture',
          'Role-Based Data Redaction Middleware',
          'Custom LLM Evaluation Benchmark Suite',
          'SOC 2 Type II AI Compliance Package'
        ],
        sla_details: 'Guaranteed response latency under 600ms for internal RAG queries',
        contact_email: 'ai-consulting@apexdynamics.com',
        pricing_model: 'Fixed-Scope Engagement or Monthly Retainer ($15k/mo)',
        is_active: true
      },
      {
        id: 3,
        name: '24/7/365 Mission-Critical Managed SRE',
        slug: 'managed-sre-support',
        category: 'Managed Operations',
        description: 'Dedicated site reliability engineering team monitoring your distributed infrastructure around the clock.',
        deliverables: [
          'Sub-5 minute P1 Incident Response SLA',
          'Automated Chaos Engineering Runs',
          'Weekly Capacity Planning Briefings',
          'Quarterly Disaster Recovery Simulation Drills',
          'Dedicated Senior Technical Account Manager'
        ],
        sla_details: 'P1 Incident Response: < 5 minutes; P2 Response: < 15 minutes',
        contact_email: 'support-plans@apexdynamics.com',
        pricing_model: 'Starting at $6,500 / month',
        is_active: true
      }
    ];

    this.faqs = [
      {
        id: 1,
        category: 'Company & General',
        question: 'What does Apex Dynamics Inc. do?',
        answer: 'Apex Dynamics Inc. is a leading enterprise software provider founded in 2018 in San Francisco. We develop intelligent multi-cloud infrastructure management tools (ApexCloud), zero-trust cybersecurity suites (ApexShield), and real-time AI telemetry analytics (DataPulse) for Fortune-2000 organizations.',
        department_id: 1,
        department_name: 'Engineering & Architecture',
        is_public: true,
        display_order: 1
      },
      {
        id: 2,
        category: 'Company & General',
        question: 'When was Apex Dynamics established?',
        answer: 'The company was established on March 1, 2018, by a team of veteran distributed systems architects in San Francisco, California.',
        department_id: 1,
        department_name: 'Engineering & Architecture',
        is_public: true,
        display_order: 2
      },
      {
        id: 3,
        category: 'Company & General',
        question: 'Where is the head office located and what are the office locations?',
        answer: 'Our global headquarters is located at 500 Howard Street, Suite 1400, San Francisco, CA 94105. We also operate our East Coast Financial Hub at One World Trade Center, Floor 48, New York, NY 10007, and maintain engineering branches in Austin and London.',
        department_id: 1,
        department_name: 'Engineering & Architecture',
        is_public: true,
        display_order: 3
      },
      {
        id: 4,
        category: 'Operations & Hours',
        question: 'What are the company working hours?',
        answer: 'Our corporate offices are open Monday through Friday from 08:30 AM to 06:00 PM Pacific Standard Time (PST). Our technical customer support and cybersecurity incident teams operate continuously 24 hours a day, 7 days a week, 365 days a year.',
        department_id: 4,
        department_name: 'Customer Success & Support',
        is_public: true,
        display_order: 4
      },
      {
        id: 5,
        category: 'Human Resources',
        question: 'How can I contact the HR department?',
        answer: 'You can contact the Human Resources & Talent department by emailing hr@apexdynamics.com or calling +1 (415) 555-0192 during standard office hours (Mon-Fri 08:30 - 17:30 PST). For recruitment inquiries, visit our careers portal or reach out to talent@apexdynamics.com.',
        department_id: 2,
        department_name: 'Human Resources & Talent',
        is_public: true,
        display_order: 5
      },
      {
        id: 6,
        category: 'Company Policies',
        question: 'What is the company remote and hybrid work policy?',
        answer: 'Apex Dynamics operates on a flexible hybrid model. Teams have core collaboration hours between 10:00 AM and 03:00 PM local time. Employees may work remotely up to 3 days per week with manager coordination, and fully remote contracts are supported for engineering and support personnel with an annual $1,500 home-office wellness stipend.',
        department_id: 2,
        department_name: 'Human Resources & Talent',
        is_public: true,
        display_order: 6
      },
      {
        id: 7,
        category: 'Security & Compliance',
        question: 'What compliance standards and certifications does the company hold?',
        answer: 'Apex Dynamics maintains active SOC 2 Type II certification, ISO/IEC 27001:2022, HIPAA compliance for healthcare data transit, and full alignment with GDPR and CCPA data privacy frameworks. Independent audits are conducted bi-annually.',
        department_id: 5,
        department_name: 'Information Security & Compliance',
        is_public: true,
        display_order: 7
      },
      {
        id: 8,
        category: 'Products & Pricing',
        question: 'What products does Apex Dynamics offer and how are they priced?',
        answer: 'We offer three flagship products: 1) ApexCloud Orchestrator ($1,200/mo base), 2) ApexShield Zero-Trust Suite ($18/user/mo), and 3) DataPulse AI Telemetry Engine ($2,400/mo). We also provide custom enterprise volume licensing with dedicated account discounts.',
        department_id: 3,
        department_name: 'Enterprise Solutions & Sales',
        is_public: true,
        display_order: 8
      },
      {
        id: 9,
        category: 'Sales & Procurement',
        question: 'How do I schedule an enterprise demo or request a custom quotation?',
        answer: 'You can contact Enterprise Solutions at sales@apexdynamics.com, call +1 (415) 555-0193, or submit an inquiry through our online assistant. Our solution architects typically provide a scheduled demo within 24 business hours.',
        department_id: 3,
        department_name: 'Enterprise Solutions & Sales',
        is_public: true,
        display_order: 9
      },
      {
        id: 10,
        category: 'Vision & Mission',
        question: 'What is the mission and vision of Apex Dynamics?',
        answer: 'Mission: To empower global enterprises with resilient cloud architectures, autonomous AI pipelines, and zero-trust cybersecurity that accelerate human ingenuity. Vision: To become the world standard for dependable, ethical, and self-optimizing digital enterprise infrastructure.',
        department_id: 1,
        department_name: 'Engineering & Architecture',
        is_public: true,
        display_order: 10
      }
    ];

    this.announcements = [
      {
        id: 1,
        title: 'Apex Dynamics Completes Annual SOC 2 Type II and ISO 27001 Re-Certification',
        content: 'We are pleased to announce that Apex Dynamics has successfully renewed our SOC 2 Type II and ISO/IEC 27001 security compliance audits with zero deficiencies noted. The full audit report is available for enterprise clients upon NDA execution.',
        category: 'Compliance & Trust',
        priority: 'info',
        published_date: '2026-09-15',
        is_active: true
      },
      {
        id: 2,
        title: 'Launch of DataPulse 4.2 with Sub-4-Second Root Cause Diagnosis',
        content: 'Our engineering team has deployed DataPulse 4.2 featuring enhanced generative LLM postmortems and real-time distributed trace graph reconstruction. Existing customers receive this update automatically at no additional license charge.',
        category: 'Product Release',
        priority: 'normal',
        published_date: '2026-10-01',
        is_active: true
      },
      {
        id: 3,
        title: 'Corporate Holiday Schedule & Support Coverage Notice',
        content: 'All regional offices will observe the upcoming holiday closures. Our 24/7 Mission-Critical Support and SecOps threat monitoring will remain fully staffed and active around the clock with normal SLA guarantees.',
        category: 'Operations',
        priority: 'normal',
        published_date: '2026-10-08',
        is_active: true
      }
    ];

    this.chatHistory = [
      {
        id: 1,
        userId: 4,
        sessionId: 'sess_init_1',
        query: 'What does this company do and when was it established?',
        response: 'Apex Dynamics Inc. was founded on March 1, 2018, in San Francisco, California. The company provides intelligent cloud infrastructure management tools (ApexCloud), zero-trust cybersecurity (ApexShield), and real-time AI telemetry analytics (DataPulse).',
        sources: ['Company Profile', 'FAQ #1', 'FAQ #2'],
        isDemoFallback: false,
        timestamp: '2026-10-09T14:22:10Z'
      },
      {
        id: 2,
        userId: 4,
        sessionId: 'sess_init_1',
        query: 'What are the company working hours and how do I contact HR?',
        response: 'Apex Dynamics corporate offices operate Monday through Friday from 08:30 AM to 06:00 PM PST. Customer support operates 24/7/365. You can contact Human Resources by emailing hr@apexdynamics.com or calling +1 (415) 555-0192 (Mon-Fri 08:30 - 17:30 PST).',
        sources: ['Company Profile', 'Departments: HR', 'FAQ #4', 'FAQ #5'],
        isDemoFallback: false,
        timestamp: '2026-10-09T14:23:45Z'
      }
    ];
  }

  // --- Company Profile ---
  getCompanyProfile(): CompanyProfile {
    return { ...this.companyProfile };
  }

  updateCompanyProfile(updates: Partial<CompanyProfile>): CompanyProfile {
    this.companyProfile = { ...this.companyProfile, ...updates };
    return this.companyProfile;
  }

  // --- Departments ---
  getDepartments(): Department[] {
    return [...this.departments];
  }

  createDepartment(dept: Omit<Department, 'id'>): Department {
    const id = this.departments.length ? Math.max(...this.departments.map(d => d.id)) + 1 : 1;
    const newDept = { ...dept, id };
    this.departments.push(newDept);
    return newDept;
  }

  updateDepartment(id: number, updates: Partial<Department>): Department | null {
    const index = this.departments.findIndex(d => d.id === id);
    if (index === -1) return null;
    this.departments[index] = { ...this.departments[index], ...updates };
    return this.departments[index];
  }

  deleteDepartment(id: number): boolean {
    const initialLen = this.departments.length;
    this.departments = this.departments.filter(d => d.id !== id);
    return this.departments.length < initialLen;
  }

  // --- Employees (with authorization masking) ---
  getEmployees(authorized = false): Employee[] {
    return this.employees
      .filter(emp => authorized || !emp.is_confidential)
      .map(emp => {
        const dept = this.departments.find(d => d.id === emp.department_id);
        const mapped = { ...emp, department_name: dept?.name || 'General' };
        if (!authorized) {
          // Mask sensitive internal extension for public/unauthorized users
          mapped.internal_extension = null;
        }
        return mapped;
      });
  }

  createEmployee(emp: Omit<Employee, 'id'>): Employee {
    const id = this.employees.length ? Math.max(...this.employees.map(e => e.id)) + 1 : 1;
    const newEmp = { ...emp, id };
    this.employees.push(newEmp);
    return newEmp;
  }

  updateEmployee(id: number, updates: Partial<Employee>): Employee | null {
    const index = this.employees.findIndex(e => e.id === id);
    if (index === -1) return null;
    this.employees[index] = { ...this.employees[index], ...updates };
    return this.employees[index];
  }

  deleteEmployee(id: number): boolean {
    const initialLen = this.employees.length;
    this.employees = this.employees.filter(e => e.id !== id);
    return this.employees.length < initialLen;
  }

  // --- Products ---
  getProducts(): Product[] {
    return [...this.products];
  }

  createProduct(prod: Omit<Product, 'id'>): Product {
    const id = this.products.length ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
    const newProd = { ...prod, id };
    this.products.push(newProd);
    return newProd;
  }

  updateProduct(id: number, updates: Partial<Product>): Product | null {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.products[index] = { ...this.products[index], ...updates };
    return this.products[index];
  }

  deleteProduct(id: number): boolean {
    const initialLen = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    return this.products.length < initialLen;
  }

  // --- Services ---
  getServices(): Service[] {
    return [...this.services];
  }

  createService(srv: Omit<Service, 'id'>): Service {
    const id = this.services.length ? Math.max(...this.services.map(s => s.id)) + 1 : 1;
    const newSrv = { ...srv, id };
    this.services.push(newSrv);
    return newSrv;
  }

  updateService(id: number, updates: Partial<Service>): Service | null {
    const index = this.services.findIndex(s => s.id === id);
    if (index === -1) return null;
    this.services[index] = { ...this.services[index], ...updates };
    return this.services[index];
  }

  deleteService(id: number): boolean {
    const initialLen = this.services.length;
    this.services = this.services.filter(s => s.id !== id);
    return this.services.length < initialLen;
  }

  // --- FAQs ---
  getFaqs(authorized = false): FAQ[] {
    return this.faqs
      .filter(f => authorized || f.is_public)
      .map(f => {
        const dept = this.departments.find(d => d.id === f.department_id);
        return { ...f, department_name: dept?.name || 'Company Wide' };
      });
  }

  createFaq(faq: Omit<FAQ, 'id'>): FAQ {
    const id = this.faqs.length ? Math.max(...this.faqs.map(f => f.id)) + 1 : 1;
    const newFaq = { ...faq, id };
    this.faqs.push(newFaq);
    return newFaq;
  }

  updateFaq(id: number, updates: Partial<FAQ>): FAQ | null {
    const index = this.faqs.findIndex(f => f.id === id);
    if (index === -1) return null;
    this.faqs[index] = { ...this.faqs[index], ...updates };
    return this.faqs[index];
  }

  deleteFaq(id: number): boolean {
    const initialLen = this.faqs.length;
    this.faqs = this.faqs.filter(f => f.id !== id);
    return this.faqs.length < initialLen;
  }

  // --- Announcements ---
  getAnnouncements(): Announcement[] {
    return [...this.announcements];
  }

  createAnnouncement(ann: Omit<Announcement, 'id'>): Announcement {
    const id = this.announcements.length ? Math.max(...this.announcements.map(a => a.id)) + 1 : 1;
    const newAnn = { ...ann, id };
    this.announcements.unshift(newAnn);
    return newAnn;
  }

  updateAnnouncement(id: number, updates: Partial<Announcement>): Announcement | null {
    const index = this.announcements.findIndex(a => a.id === id);
    if (index === -1) return null;
    this.announcements[index] = { ...this.announcements[index], ...updates };
    return this.announcements[index];
  }

  deleteAnnouncement(id: number): boolean {
    const initialLen = this.announcements.length;
    this.announcements = this.announcements.filter(a => a.id !== id);
    return this.announcements.length < initialLen;
  }

  // --- Search Engine ---
  search(query: string, category = 'all', authorized = false): SearchResultItem[] {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    const results: SearchResultItem[] = [];

    // Products
    if (category === 'all' || category === 'products') {
      this.products.forEach(p => {
        if (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.features.some(f => f.toLowerCase().includes(q))
        ) {
          results.push({
            id: p.id,
            name: p.name,
            category: p.category,
            description: p.summary,
            item_type: 'product'
          });
        }
      });
    }

    // Services
    if (category === 'all' || category === 'services') {
      this.services.forEach(s => {
        if (
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
        ) {
          results.push({
            id: s.id,
            name: s.name,
            category: s.category,
            description: s.description,
            item_type: 'service'
          });
        }
      });
    }

    // Departments
    if (category === 'all' || category === 'departments') {
      this.departments.forEach(d => {
        if (
          d.name.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.head_of_department.toLowerCase().includes(q)
        ) {
          results.push({
            id: d.id,
            name: d.name,
            category: 'Department',
            description: d.description,
            item_type: 'department'
          });
        }
      });
    }

    // Employees
    if (category === 'all' || category === 'employees') {
      this.getEmployees(authorized).forEach(e => {
        if (
          e.full_name.toLowerCase().includes(q) ||
          e.role_title.toLowerCase().includes(q) ||
          (e.bio && e.bio.toLowerCase().includes(q))
        ) {
          results.push({
            id: e.id,
            name: `${e.full_name} (${e.role_title})`,
            category: e.department_name || 'Staff',
            description: e.bio || `Official contact: ${e.official_email}`,
            item_type: 'employee'
          });
        }
      });
    }

    // FAQs / Policies
    if (category === 'all' || category === 'faqs') {
      this.getFaqs(authorized).forEach(f => {
        if (
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q)
        ) {
          results.push({
            id: f.id,
            name: f.question,
            category: f.category,
            description: f.answer,
            item_type: 'faq'
          });
        }
      });
    }

    return results;
  }

  // --- Users & Auth ---
  findUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(name: string, email: string, role: 'admin' | 'employee' | 'user'): User {
    const id = this.users.length ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
    const user: User = {
      id,
      full_name: name,
      email,
      role,
      is_active: true
    };
    this.users.push(user);
    return user;
  }

  getUsers(): User[] {
    return [...this.users];
  }

  updateUserRole(id: number, role: 'admin' | 'employee' | 'user'): User | null {
    const user = this.users.find(u => u.id === id);
    if (!user) return null;
    user.role = role;
    return user;
  }

  // --- Chat History & Analytics ---
  addChatLog(entry: {
    userId?: number;
    sessionId: string;
    query: string;
    response: string;
    sources: string[];
    isDemoFallback: boolean;
  }) {
    const id = this.chatHistory.length ? Math.max(...this.chatHistory.map(c => c.id)) + 1 : 1;
    this.chatHistory.unshift({
      ...entry,
      id,
      timestamp: new Date().toISOString()
    });
  }

  getChatHistory(limit = 50) {
    return this.chatHistory.slice(0, limit);
  }

  getAdminStats(): AdminStats {
    const queryCounts: Record<string, number> = {};
    this.chatHistory.forEach(item => {
      const q = item.query.trim().toLowerCase();
      queryCounts[q] = (queryCounts[q] || 0) + 1;
    });

    const popularQueries = Object.entries(queryCounts)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const groundedCount = this.chatHistory.filter(c => !c.isDemoFallback).length;
    const groundedRatio = this.chatHistory.length > 0 ? (groundedCount / this.chatHistory.length) * 100 : 96;

    return {
      totalEmployees: this.employees.length,
      totalDepartments: this.departments.length,
      totalProducts: this.products.length,
      totalServices: this.services.length,
      totalFaqs: this.faqs.length,
      totalAnnouncements: this.announcements.length,
      totalChatInquiries: this.chatHistory.length,
      groundedRatio: Math.round(groundedRatio),
      popularQueries
    };
  }

  // Build the complete verified grounding context prompt for Gemini
  buildGroundingContext(authorized = false): string {
    const profile = this.companyProfile;
    const depts = this.departments.map(d => ({
      name: d.name,
      code: d.code,
      description: d.description,
      head: d.head_of_department,
      email: d.contact_email,
      phone: d.contact_phone,
      hours: d.operating_hours,
      location: d.floor_location
    }));

    const products = this.products.map(p => ({
      name: p.name,
      category: p.category,
      summary: p.summary,
      features: p.features,
      pricing: p.pricing_tier,
      audience: p.target_audience
    }));

    const services = this.services.map(s => ({
      name: s.name,
      category: s.category,
      description: s.description,
      deliverables: s.deliverables,
      pricing: s.pricing_model,
      sla: s.sla_details,
      contact: s.contact_email
    }));

    const leadership = this.employees
      .filter(e => e.is_leadership)
      .map(e => ({
        name: e.full_name,
        role: e.role_title,
        email: e.official_email,
        bio: e.bio
      }));

    const faqs = this.getFaqs(authorized).map(f => ({
      category: f.category,
      question: f.question,
      answer: f.answer
    }));

    return `
VERIFIED COMPANY PROFILE:
- Company Name: ${profile.company_name} (Legal: ${profile.legal_name})
- Founded: ${profile.founding_year} (March 1, 2018)
- Industry: ${profile.industry}
- Tagline: ${profile.tagline}
- Global Headquarters: ${profile.headquarters_address}
- East Coast Financial Hub: ${profile.secondary_office_address}
- Official Contact: ${profile.official_email} | Phone: ${profile.official_phone}
- 24/7 Priority Support Phone: ${profile.support_phone}
- Corporate Working Hours: ${profile.working_hours}
- Timezone: ${profile.timezone}
- Official Website: ${profile.website}
- Mission: ${profile.mission}
- Vision: ${profile.vision}
- Overview & History: ${profile.overview}

DEPARTMENTS:
${JSON.stringify(depts, null, 2)}

LEADERSHIP & KEY EXECUTIVES:
${JSON.stringify(leadership, null, 2)}

PRODUCTS CATALOG:
${JSON.stringify(products, null, 2)}

SERVICES CATALOG:
${JSON.stringify(services, null, 2)}

FREQUENTLY ASKED QUESTIONS & OFFICIAL POLICIES:
${JSON.stringify(faqs, null, 2)}
`;
  }
}

export const db = new EnterpriseDatabase();
