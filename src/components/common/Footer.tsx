import React from 'react';
import { WebsiteSettings } from '../../types';
import { 
  GraduationCap, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight, 
  CheckCircle2,
  Calendar,
  Building
} from 'lucide-react';

interface FooterProps {
  settings: WebsiteSettings;
  onNavigateSection: (sectionId: string) => void;
  onOpenEnquiryModal: () => void;
  onOpenLoginModal: (defaultTab?: 'student' | 'admin' | 'enquiry') => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigateSection,
  onOpenEnquiryModal,
  onOpenLoginModal,
}) => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-10 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pb-8 border-b border-slate-800">
          {/* Col 1: Institute Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg tracking-tight">
                  {settings.instituteName}
                </h3>
                <p className="text-xs text-blue-400 font-medium">Est. {settings.foundedYear} | Offline Coaching</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Dedicated physical classroom tuition academy focusing on personalized mentorship, maximum 28 students per batch, daily doubt clearance counters, and proven board & competitive results.
            </p>

            <div className="pt-2 text-xs space-y-1.5 text-slate-400">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Physical Study Centers: <strong>Civil Lines & Shankar Nagar</strong></span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Institute Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigateSection('courses')} className="hover:text-white transition flex items-center gap-2 text-left">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span>Courses & Streams</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('batches')} className="hover:text-white transition flex items-center gap-2 text-left">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span>Batch Timings</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('about')} className="hover:text-white transition flex items-center gap-2 text-left">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span>About Faculty</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('results')} className="hover:text-white transition flex items-center gap-2 text-left">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span>Toppers & Results</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('gallery')} className="hover:text-white transition flex items-center gap-2 text-left">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span>Infrastructure & Labs</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('notices')} className="hover:text-white transition flex items-center gap-2 text-left">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span>Public Notices</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Student & Parent Portals */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Portals & Access
            </h4>
            <div className="space-y-2 text-xs">
              <button
                onClick={onOpenEnquiryModal}
                className="w-full py-2.5 px-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold transition flex items-center justify-between shadow-xs group"
              >
                <span>Admission Enquiry</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </button>

              <button
                onClick={() => onOpenLoginModal('student')}
                className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 text-blue-300 rounded-xl transition flex items-center justify-between font-medium group"
              >
                <span>Student Portal Login</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </button>

              <button
                onClick={() => onOpenLoginModal('enquiry')}
                className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 text-emerald-300 rounded-xl transition flex items-center justify-between font-medium group"
              >
                <span>Track Enquiry & Chat</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </button>
            </div>
          </div>

          {/* Col 4: Physical Address & Office Hours */}
          <div className="space-y-3.5">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Physical Location & Hours
            </h4>

            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                {settings.address}, {settings.landmark}, {settings.city}, {settings.state} - {settings.pincode}
              </span>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>{settings.officeHours}</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <Phone className="w-4 h-4 text-blue-400 shrink-0" />
              <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="hover:text-white font-medium transition">
                {settings.phone} / {settings.altPhone}
              </a>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <Mail className="w-4 h-4 text-blue-400 shrink-0" />
              <a href={`mailto:${settings.email}`} className="hover:text-white transition">
                {settings.email}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} {settings.instituteName}. All rights reserved.</p>
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center sm:justify-end">
            <span className="text-slate-400">Strictly Offline Classroom Mentorship</span>
            <span className="hidden sm:inline">•</span>
            <button 
              onClick={() => onOpenLoginModal('admin')} 
              className="text-slate-400 hover:text-amber-400 font-medium transition flex items-center gap-1.5 text-xs hover:underline cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Staff Login</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
