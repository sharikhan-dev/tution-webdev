import React from 'react';
import { WebsiteSettings } from '../../types';
import { 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  Award, 
  BookOpen, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  MessageSquare
} from 'lucide-react';

interface HeroSectionProps {
  settings: WebsiteSettings;
  onOpenEnquiryModal: () => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenEnquiryRoom: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  onOpenEnquiryModal,
  onNavigateSection,
  onOpenEnquiryRoom,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 text-white pt-12 pb-20 lg:pt-18 lg:pb-28">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-600/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-20 right-0 w-80 h-80 bg-indigo-500/10 blur-2xl pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{settings.heroBadge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Real Physical Classrooms. <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                Personalized Offline Mentorship.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              {settings.heroSubtitle}
            </p>

            {/* Key USPs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-slate-200">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Strictly Max 28 Students per Physical Batch</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Daily Offline Doubt Clearance Desks</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Printed Theory Workbooks & Daily DPPs</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Bi-Weekly Subjective & OMR Mock Tests</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-4">
              <button
                id="hero-enquiry-cta-btn"
                onClick={onOpenEnquiryModal}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 rounded-xl transition shadow-lg shadow-cyan-500/20 active:scale-95"
              >
                <span>Submit Admission Enquiry</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-explore-batches-btn"
                onClick={() => onNavigateSection('batches')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl transition"
              >
                <Clock className="w-4 h-4 text-blue-400" />
                <span>View Batches & Timings</span>
              </button>
            </div>

            {/* Micro reassurance */}
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Zero obligation free trial session</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>Physical Campus: Civil Lines, {settings.city}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Offline Institute Card */}
          <div className="lg:col-span-5">
            <div className="relative bg-slate-800/70 backdrop-blur-md rounded-2xl border border-slate-700/80 p-6 sm:p-7 shadow-2xl space-y-6">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                    Offline Academic Dashboard
                  </span>
                  <h3 className="text-base font-bold text-white">
                    2026-27 Offline Classroom Batches
                  </h3>
                </div>
                <div className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold">
                  Seats Filling Fast
                </div>
              </div>

              {/* Batches Quick List */}
              <div className="space-y-2.5">
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">Class 12 PCM Elite Batch</p>
                    <p className="text-[11px] text-slate-400">Hall 1 (Ground Floor) • 06:45 AM - 08:45 AM</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                    6 seats left
                  </span>
                </div>

                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">Class 12 PCB Medical Target</p>
                    <p className="text-[11px] text-slate-400">Hall 2 (First Floor) • 07:00 AM - 09:00 AM</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                    9 seats left
                  </span>
                </div>

                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">Class 10 Super 30 (Sci & Maths)</p>
                    <p className="text-[11px] text-slate-400">Hall 2 • 05:30 PM - 07:15 PM</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                    3 seats left
                  </span>
                </div>
              </div>

              {/* Direct Enquiry Quick Box */}
              <div className="pt-1">
                <button
                  onClick={onOpenEnquiryModal}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-blue-600/30"
                >
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>Reserve Seat & Get Instant Enquiry ID</span>
                </button>
              </div>

              {/* Already have an enquiry code footer */}
              <div className="pt-2 text-center border-t border-slate-700/60">
                <p className="text-xs text-slate-400">
                  Already submitted an enquiry?{' '}
                  <button
                    onClick={onOpenEnquiryRoom}
                    className="text-blue-400 hover:text-cyan-300 font-semibold underline underline-offset-2 ml-1"
                  >
                    Open Live Enquiry Chat
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Statistics Ribbon */}
        <div className="mt-16 pt-10 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {settings.stats.studentsTaught}
            </p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Classroom Students Mentored</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 tracking-tight">
              {settings.stats.successRate}
            </p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Board Exam Pass Rate</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight">
              {settings.stats.batchSizeLimit}
            </p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Personal Attention Guaranteed</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">
              {settings.stats.topRanks}
            </p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Top 1% Percentile Scorers</p>
          </div>
        </div>
      </div>
    </section>
  );
};
