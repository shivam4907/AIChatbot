import React from 'react';
import {
  Building2,
  Calendar,
  MapPin,
  Clock,
  Mail,
  Phone,
  Globe,
  Award,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Bot,
  Sparkles,
  Mic
} from 'lucide-react';
import { CompanyProfile, Department } from '../types.ts';

interface CompanyOverviewProps {
  profile: CompanyProfile | null;
  departments: Department[];
  onAskAi: (question: string) => void;
  onExploreProducts: () => void;
  onExploreDirectory: () => void;
  onOpenVoiceChat?: () => void;
}

export const CompanyOverview: React.FC<CompanyOverviewProps> = ({
  profile,
  departments,
  onAskAi,
  onExploreProducts,
  onExploreDirectory,
  onOpenVoiceChat
}) => {
  if (!profile) return null;

  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 sm:p-12 border border-slate-800 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/70 via-slate-900/90 to-slate-900 pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>Founded {profile.founding_year} · San Francisco, CA</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            {profile.company_name}
          </h1>

          <p className="text-lg text-slate-300 font-light leading-relaxed">
            {profile.tagline}
          </p>

          <p className="text-sm text-slate-400 leading-relaxed">
            {profile.overview}
          </p>

          {/* Quick AI Trigger Row */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onAskAi('What does this company do and what are its key offerings?')}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm flex items-center gap-2 transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>Ask AI About Apex Dynamics</span>
            </button>
            <button
              onClick={onOpenVoiceChat || (() => onAskAi('What does this company do?'))}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-sm flex items-center gap-2 transition-all"
              title="Speak question using microphone"
            >
              <Mic className="w-4 h-4" />
              <span>Voice Question (Mic)</span>
            </button>
            <button
              onClick={onExploreProducts}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl border border-white/10 flex items-center gap-2 transition-all"
            >
              <span>Explore Products & Services</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
            </button>
          </div>
        </div>

        {/* Floating Quick Facts */}
        <div className="mt-8 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
          <div>
            <div className="text-2xl font-bold text-white">450+</div>
            <div className="text-xs text-slate-400 mt-0.5">Enterprise Customers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">99.995%</div>
            <div className="text-xs text-slate-400 mt-0.5">Historical Cloud Uptime</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">620+</div>
            <div className="text-xs text-slate-400 mt-0.5">Global Team Members</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">24/7/365</div>
            <div className="text-xs text-slate-400 mt-0.5">Mission Support Coverage</div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Our Mission</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {profile.mission}
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Our Vision</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {profile.vision}
          </p>
        </div>
      </section>

      {/* Office Locations & Operational Hours */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Global Offices & Working Hours</h2>
            <p className="text-xs text-slate-500 mt-1">
              Verified corporate facilities and operating schedules
            </p>
          </div>
          <button
            onClick={() => onAskAi('What are the company working hours and where is the head office?')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>Ask AI about locations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Headquarters */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Global Headquarters
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">San Francisco, CA</h3>
              </div>
              <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                <Building2 className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{profile.headquarters_address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{profile.working_hours}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{profile.official_phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{profile.official_email}</span>
              </div>
            </div>
          </div>

          {/* East Coast Financial Hub */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                  East Coast Financial Hub
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">New York, NY</h3>
              </div>
              <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                <Building2 className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{profile.secondary_office_address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Monday to Friday: 08:00 AM - 05:30 PM EST</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{profile.support_phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{profile.website}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Departments Snapshot */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Organizational Departments</h2>
            <p className="text-xs text-slate-500 mt-1">
              {departments.length} specialized business divisions coordinating global operations
            </p>
          </div>
          <button
            onClick={onExploreDirectory}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View Full Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 tracking-wider">
                  {dept.code}
                </span>
                <span className="text-[11px] text-slate-500">{dept.floor_location}</span>
              </div>
              <h3 className="font-bold text-sm text-slate-900">{dept.name}</h3>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {dept.description}
              </p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                <div>Lead: <span className="font-medium text-slate-700">{dept.head_of_department}</span></div>
                <div>Contact: <span className="text-indigo-600">{dept.contact_email}</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
