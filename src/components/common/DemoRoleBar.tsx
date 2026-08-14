import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, MessageSquare, Globe, Sparkles, RefreshCw, Server } from 'lucide-react';
import { storage } from '../../services/storage';

interface DemoRoleBarProps {
  currentView: 'marketing' | 'student' | 'admin' | 'enquiry';
  onSelectView: (view: 'marketing' | 'student' | 'admin' | 'enquiry', enquiryCode?: string) => void;
  onOpenBackendModal?: () => void;
}

export const DemoRoleBar: React.FC<DemoRoleBarProps> = ({ currentView, onSelectView, onOpenBackendModal }) => {
  const { switchRoleDemo } = useAuth();

  const handleResetData = () => {
    if (window.confirm('Reset demo data (enquiries, attendance, test marks) to initial state?')) {
      storage.resetAllData();
      window.location.reload();
    }
  };

  return (
    <aside aria-label="Demo role switcher" className="bg-slate-900 text-white text-xs border-b border-slate-800 py-1.5 px-3 sm:px-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-full font-medium text-[11px]">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span className="hidden xs:inline">Apex Institute Explorer</span>
            <span className="xs:hidden">Apex Hub</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Public Website */}
          <button
            id="role-switch-marketing-btn"
            onClick={() => onSelectView('marketing')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition font-medium text-[11px] ${
              currentView === 'marketing'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Public Website</span>
          </button>

          {/* Enquiry Chat Room */}
          <button
            id="role-switch-enquiry-btn"
            onClick={() => onSelectView('enquiry', 'TUI-48291')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition font-medium text-[11px] ${
              currentView === 'enquiry'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Enquiry Chat</span>
          </button>

          {/* Student Portal */}
          <button
            id="role-switch-student-btn"
            onClick={() => {
              switchRoleDemo('student');
              onSelectView('student');
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition font-medium text-[11px] ${
              currentView === 'student'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Student Portal</span>
          </button>

          {/* Backend & DB Modal */}
          {onOpenBackendModal && (
            <button
              onClick={onOpenBackendModal}
              title="View backend status & database hub"
              className="flex items-center gap-1 px-2 py-1 bg-indigo-900/80 border border-indigo-700/60 hover:bg-indigo-800 text-indigo-200 rounded-md transition font-medium text-[11px]"
            >
              <Server className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">Backend Hub</span>
            </button>
          )}

          {/* Reset Demo Data */}
          <button
            onClick={handleResetData}
            title="Reset to initial dataset"
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
