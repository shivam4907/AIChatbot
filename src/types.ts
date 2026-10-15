export type UserRole = 'admin' | 'employee' | 'user';

export interface User {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
  department_id?: number | null;
  department_name?: string;
  is_active?: boolean;
}

export interface CompanyProfile {
  id: number;
  company_name: string;
  legal_name: string;
  tagline: string;
  founding_year: number;
  industry: string;
  headquarters_address: string;
  secondary_office_address: string;
  official_email: string;
  official_phone: string;
  support_phone: string;
  working_hours: string;
  timezone: string;
  website: string;
  mission: string;
  vision: string;
  overview: string;
  social_links: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    youtube?: string;
  };
}

export interface Department {
  id: number;
  name: string;
  code: string;
  description: string;
  head_of_department: string;
  contact_email: string;
  contact_phone: string;
  floor_location: string;
  operating_hours: string;
}

export interface Employee {
  id: number;
  department_id: number;
  department_name?: string;
  full_name: string;
  role_title: string;
  official_email: string;
  public_phone?: string | null;
  internal_extension?: string | null; // Sensitive: only staff/admin
  office_location: string;
  bio?: string | null;
  is_leadership: boolean;
  is_confidential: boolean;
  joined_date: string;
  avatar_url?: string | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  category: string;
  summary: string;
  description: string;
  features: string[];
  pricing_tier: string;
  target_audience: string;
  status: 'active' | 'upcoming' | 'deprecated';
  documentation_url?: string;
}

export interface Service {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string;
  deliverables: string[];
  sla_details: string;
  contact_email: string;
  pricing_model: string;
  is_active: boolean;
}

export interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
  department_id?: number | null;
  department_name?: string;
  is_public: boolean;
  display_order: number;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  category: string;
  priority: 'info' | 'normal' | 'urgent';
  published_date: string;
  is_active: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: string[];
  is_demo_fallback?: boolean;
  response_time_ms?: number;
}

export interface SearchResultItem {
  id: number;
  name: string;
  category: string;
  description: string;
  item_type: 'product' | 'service' | 'department' | 'employee' | 'faq' | 'announcement';
  detail_link?: string;
}

export interface AdminStats {
  totalEmployees: number;
  totalDepartments: number;
  totalProducts: number;
  totalServices: number;
  totalFaqs: number;
  totalAnnouncements: number;
  totalChatInquiries: number;
  groundedRatio: number;
  popularQueries: { query: string; count: number }[];
}
