import React, { useState } from 'react';
import { WebsiteSettings } from '../../types';
import { NotificationDropdown } from './NotificationDropdown';
import { 
  GraduationCap, 
  Menu, 
  X, 
  Phone, 
  Clock, 
  MapPin, 
  User, 
  ShieldCheck, 
  MessageSquare,
  FileText,
  ChevronRight
} from 'lucide-react';

interface NavbarProps {
  settings: WebsiteSettings;
  onOpenEnquiryModal: () => void;
  onOpenLoginModal: (defaultTab?: 'student' | 'admin' | 'enquiry') => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenStudentPortal: () => void;
  onOpenAdminPortal: () => void;
  onOpenEnquiryRoom: (code?: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onOpenEnquiryModal,
  onOpenLoginModal,
  onNavigateSection,
  onOpenStudentPortal,
  onOpenAdminPortal,
  onOpenEnquiryRoom,
  activeSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'courses', label: 'Explore' },
    { id: 'batches', label: 'Batches' },
    { id: 'testimonials', label: 'Reviews' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Info Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>{settings.landmark}, {settings.city} (Physical Campus)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Daily Batches: 06:45 AM - 08:00 PM</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 text-blue-300 hover:text-white font-medium transition"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>Direct Admissions: {settings.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2">
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none shrink-0"
            onClick={() => onNavigateSection('home')}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center text-white shadow-md shadow-blue-900/20 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight leading-none">
                {settings.instituteName.split(' ')[0]}
              </span>
              <span className="font-semibold text-[9px] sm:text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded font-mono">
                OFFLINE
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-2 text-xs xl:text-sm font-semibold text-slate-600 shrink-0">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigateSection(item.id)}
                className={`px-2.5 xl:px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  activeSection === item.id
                    ? 'text-blue-700 bg-blue-50 font-bold'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Notification Bell */}
            <NotificationDropdown />

            {/* Check Enquiry Status / Chat (Desktop) */}
            <button
              id="nav-check-enquiry-btn"
              onClick={() => onOpenLoginModal('enquiry')}
              className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 rounded-lg transition border border-slate-200 whitespace-nowrap"
              title="Track enquiry code or open chat"
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
              <span>Track Enquiry</span>
            </button>

            {/* Student Portal Login (Desktop/Tablet) */}
            <button
              id="nav-student-login-btn"
              onClick={() => onOpenLoginModal('student')}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 xl:px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition border border-blue-200 whitespace-nowrap"
            >
              <User className="w-3.5 h-3.5 text-blue-700" />
              <span>Student Portal</span>
            </button>

            {/* Admission Enquiry CTA */}
            <button
              id="nav-admission-enquiry-cta-btn"
              onClick={onOpenEnquiryModal}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition shadow-xs shadow-blue-700/30 active:scale-95 whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Admission Enquiry</span>
              <span className="xs:hidden">Enquire</span>
            </button>

            {/* Mobile/Tablet Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-none shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-5 space-y-3 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigateSection(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-md text-xs font-medium ${
                  activeSection === item.id
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                onOpenEnquiryModal();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 bg-blue-700 text-white rounded-lg text-xs font-bold text-center flex items-center justify-center gap-2 shadow-xs"
            >
              <FileText className="w-4 h-4" />
              <span>Submit Admission Enquiry</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onOpenLoginModal('enquiry');
                  setMobileMenuOpen(false);
                }}
                className="py-2 px-3 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-200"
              >
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                <span>Track Enquiry</span>
              </button>

              <button
                onClick={() => {
                  onOpenLoginModal('student');
                  setMobileMenuOpen(false);
                }}
                className="py-2 px-3 bg-blue-50 text-blue-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border border-blue-200"
              >
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Student Login</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
