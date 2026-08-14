import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';
import { 
  X, 
  User, 
  ShieldCheck, 
  MessageSquare, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2,
  GraduationCap
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'student' | 'admin' | 'enquiry';
  onOpenEnquiryRoom: (enquiryCode: string) => void;
  onLoginSuccess: (role: 'student' | 'admin') => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'student',
  onOpenEnquiryRoom,
  onLoginSuccess,
}) => {
  const { loginAsStudent, loginAsAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'student' | 'admin' | 'enquiry'>(defaultTab);

  // Student form state
  const [studentId, setStudentId] = useState('APX-2026-101');
  const [studentPassword, setStudentPassword] = useState('Student@123');

  // Admin form state
  const [adminUsername, setAdminUsername] = useState(() => storage.getAdminCredentials().username);
  const [adminPassword, setAdminPassword] = useState('Admin@123');

  // Enquiry form state
  const [enquiryCode, setEnquiryCode] = useState('TUI-48291');
  const [enquiryPin, setEnquiryPin] = useState('4829');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      setAdminUsername(storage.getAdminCredentials().username);
      setErrorMessage(null);
    }
  }, [isOpen, defaultTab]);

  if (!isOpen) return null;

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const res = loginAsStudent(studentId.trim(), studentPassword.trim());
    if (res.success) {
      onClose();
      onLoginSuccess('student');
    } else {
      setErrorMessage(res.error || 'Invalid credentials. Please verify your Student ID and password.');
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const success = loginAsAdmin(adminPassword.trim(), adminUsername.trim());
    if (success) {
      onClose();
      onLoginSuccess('admin');
    } else {
      const stored = storage.getAdminCredentials();
      setErrorMessage(`Incorrect administrator login. Default ID: ${stored.username} / Password: ${stored.password}`);
    }
  };

  const handleEnquiryLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryCode.trim()) {
      setErrorMessage('Please enter your Enquiry ID (e.g. TUI-48291).');
      return;
    }
    onClose();
    onOpenEnquiryRoom(enquiryCode.trim().toUpperCase());
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Institute Authentication Portal</h3>
              <p className="text-[11px] text-slate-400">Select your access role to proceed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 gap-1">
          <button
            id="tab-login-student"
            onClick={() => { setActiveTab('student'); setErrorMessage(null); }}
            className={`flex-1 py-2 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 ${
              activeTab === 'student'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Student</span>
          </button>

          <button
            id="tab-login-admin"
            onClick={() => { setActiveTab('admin'); setErrorMessage(null); }}
            className={`flex-1 py-2 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 ${
              activeTab === 'admin'
                ? 'bg-white text-amber-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Desk</span>
          </button>

          <button
            id="tab-login-enquiry"
            onClick={() => { setActiveTab('enquiry'); setErrorMessage(null); }}
            className={`flex-1 py-2 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 ${
              activeTab === 'enquiry'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Enquiry ID</span>
          </button>
        </div>

        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Student Login Form */}
          {activeTab === 'student' && (
            <form onSubmit={handleStudentLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Student ID Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. APX-2026-101"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Account Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-lg text-[11px] text-blue-900">
                <span>💡 <strong>Demo Student:</strong> ID: <code>APX-2026-101</code> / Pass: <code>Student@123</code></span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Login to Student Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Enquiry Tracking Form */}
          {activeTab === 'enquiry' && (
            <form onSubmit={handleEnquiryLookup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Temporary Enquiry ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TUI-48291"
                  value={enquiryCode}
                  onChange={(e) => setEnquiryCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white uppercase tracking-wider"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Verification PIN (Optional in quick mode)
                </label>
                <input
                  type="password"
                  placeholder="e.g. 4829"
                  value={enquiryPin}
                  onChange={(e) => setEnquiryPin(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-lg text-[11px] text-emerald-900">
                <span>💡 <strong>Demo Enquiry:</strong> <code>TUI-48291</code> (Rahul Khan - Class 12 PCM)</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Track Application & Open Chat</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Admin Login Form */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Admin Username / Email
                </label>
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Security Master Passcode
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              <div className="p-2.5 bg-amber-50/70 border border-amber-100 rounded-lg text-[11px] text-amber-900 font-medium">
                <span>💡 <strong>Default Admin ID:</strong> <code>{adminUsername}</code> • <strong>Passcode:</strong> <code>{adminPassword}</code></span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Access Institute Admin CRM</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
