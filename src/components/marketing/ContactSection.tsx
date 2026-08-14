import React from 'react';
import { WebsiteSettings } from '../../types';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Building2, 
  ShieldCheck, 
  Navigation, 
  ArrowRight,
  MessageSquare
} from 'lucide-react';

interface ContactSectionProps {
  settings: WebsiteSettings;
  onOpenEnquiryModal: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  settings,
  onOpenEnquiryModal,
}) => {
  return (
    <section id="contact" className="py-12 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>Visit Our Physical Institute</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Campus Location & Front Office
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Parents and prospective students are welcome to visit our counseling desk for syllabus discussions, faculty meetings, and classroom tours during working hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: Institute Contact Details */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-700" />
                <span>Admissions & Counseling Center</span>
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Physical Campus Address</strong>
                    <span className="text-slate-600 leading-relaxed">
                      {settings.address}, {settings.landmark}, {settings.city}, {settings.state} - {settings.pincode}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Office & Counseling Hours</strong>
                    <span className="text-slate-600">{settings.officeHours}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Admissions Helpline</strong>
                    <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="text-blue-700 font-semibold hover:underline">
                      {settings.phone}
                    </a>
                    <span className="text-slate-500"> / {settings.altPhone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Official Email</strong>
                    <a href={`mailto:${settings.email}`} className="text-blue-700 hover:underline">
                      {settings.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Banner inside card */}
              <div className="pt-4 border-t border-slate-200">
                <button
                  onClick={onOpenEnquiryModal}
                  className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Submit Online Admission Enquiry Form</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Map & Landmark Guide */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 text-white space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">
                    How to Reach
                  </span>
                  <h4 className="text-lg font-bold text-white mt-0.5">
                    Landmarks & Transportation
                  </h4>
                </div>
                <Navigation className="w-6 h-6 text-blue-400" />
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                  <strong className="text-white block mb-0.5">🚇 By Metro / City Bus:</strong>
                  <span>200 meters from Civil Lines Metro Station (Gate 2). Direct feeder buses available every 10 minutes.</span>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                  <strong className="text-white block mb-0.5">🚗 Parking Facility:</strong>
                  <span>Dedicated, guarded two-wheeler and four-wheeler basement parking available for parents and students.</span>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                  <strong className="text-white block mb-0.5">🏢 Prominent Landmark:</strong>
                  <span>Opposite Central Mall & 2 buildings down from RBI Staff Quarters.</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>24x7 CCTV Monitored Gated Campus</span>
                </div>
                <span className="text-slate-500">WiFi Doubt Hall Enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
