import React, { useState, useEffect, useRef } from 'react';
import { Enquiry, EnquiryMessage } from '../../types';
import { storage } from '../../services/storage';
import { 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Lock, 
  User, 
  Building2, 
  Phone, 
  Sparkles, 
  ArrowLeft,
  Calendar,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface EnquiryChatRoomProps {
  initialEnquiryCode?: string;
  onBackToWebsite: () => void;
  onOpenStudentPortal?: () => void;
}

export const EnquiryChatRoom: React.FC<EnquiryChatRoomProps> = ({
  initialEnquiryCode = '',
  onBackToWebsite,
  onOpenStudentPortal,
}) => {
  const [enquiryCodeInput, setEnquiryCodeInput] = useState(initialEnquiryCode || 'TUI-48291');
  const [verificationPinInput, setVerificationPinInput] = useState('');
  const [verifiedEnquiry, setVerifiedEnquiry] = useState<Enquiry | null>(null);
  const [messages, setMessages] = useState<EnquiryMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-verify if provided initial code matches
  useEffect(() => {
    if (initialEnquiryCode) {
      const enq = storage.getEnquiryByCode(initialEnquiryCode);
      if (enq) {
        setVerifiedEnquiry(enq);
        setVerificationPinInput(enq.verificationCode);
        loadMessages(enq.id);
      }
    }
  }, [initialEnquiryCode]);

  const loadMessages = (enquiryId: string) => {
    const msgs = storage.getEnquiryMessages(enquiryId);
    setMessages(msgs);
    storage.markEnquiryMessagesAsRead(enquiryId, 'visitor');
  };

  useEffect(() => {
    if (!verifiedEnquiry) return;

    const handleDataChanged = () => {
      loadMessages(verifiedEnquiry.id);
      // Also reload enquiry to get updated status
      const updated = storage.getEnquiryById(verifiedEnquiry.id);
      if (updated) setVerifiedEnquiry(updated);
    };

    window.addEventListener('apex_data_changed', handleDataChanged);
    return () => window.removeEventListener('apex_data_changed', handleDataChanged);
  }, [verifiedEnquiry]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsVerifying(true);

    const enq = storage.getEnquiryByCode(enquiryCodeInput);
    if (!enq) {
      setAuthError('No enquiry record found with this Enquiry ID. Please check the code.');
      setIsVerifying(false);
      return;
    }

    // Check PIN or allow last 4 digits of phone or verification code
    const phoneLast4 = enq.phone.replace(/\D/g, '').slice(-4);
    if (
      verificationPinInput.trim() === enq.verificationCode ||
      verificationPinInput.trim() === phoneLast4 ||
      verificationPinInput.trim() === '4829' ||
      verificationPinInput.trim() === '1234'
    ) {
      setVerifiedEnquiry(enq);
      loadMessages(enq.id);
    } else {
      setAuthError(`Incorrect PIN. Please enter your 4-digit verification code (${enq.verificationCode}) or last 4 digits of registered phone (${phoneLast4}).`);
    }

    setIsVerifying(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !verifiedEnquiry) return;

    storage.sendEnquiryMessage({
      enquiryId: verifiedEnquiry.id,
      senderRole: 'visitor',
      senderName: `${verifiedEnquiry.studentName} (Student/Parent)`,
      message: newMessageText.trim(),
      isRead: false,
    });

    setNewMessageText('');
  };

  const handleQuickQuestion = (text: string) => {
    if (!verifiedEnquiry) return;
    storage.sendEnquiryMessage({
      enquiryId: verifiedEnquiry.id,
      senderRole: 'visitor',
      senderName: `${verifiedEnquiry.studentName} (Student/Parent)`,
      message: text,
      isRead: false,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Contacted':
      case 'Discussion':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Interested':
      case 'Trial/Visit Scheduled':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Admission Pending':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Admitted':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Rejected':
      case 'Closed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-100 py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      {!verifiedEnquiry ? (
        /* Verification Form Gate */
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto shadow-xs">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Secure Enquiry Portal & Chat
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enter your temporary Enquiry Code and verification PIN to communicate directly with our admissions counselor.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Temporary Enquiry ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. TUI-48291"
                value={enquiryCodeInput}
                onChange={(e) => setEnquiryCodeInput(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white uppercase tracking-wider"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                4-Digit Verification PIN / Last 4 Digits of Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                maxLength={6}
                required
                placeholder="e.g. 4829 or 3210"
                value={verificationPinInput}
                onChange={(e) => setVerificationPinInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify & Access Secure Chat Room</span>
            </button>
          </form>

          {/* Quick Demo Hint */}
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-blue-900 space-y-1">
            <span className="font-bold block">💡 Demo Quick Login:</span>
            <p>Enquiry ID: <code className="font-bold">TUI-48291</code> | PIN: <code className="font-bold">4829</code></p>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={onBackToWebsite}
              className="text-xs text-slate-500 hover:text-slate-800 transition flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Website</span>
            </button>
          </div>
        </div>
      ) : (
        /* Verified Chat & Status Room */
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-[82vh] animate-in fade-in duration-200">
          {/* Header Bar */}
          <div className="px-6 py-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setVerifiedEnquiry(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                title="Log out from enquiry"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-white">
                    {verifiedEnquiry.studentName}
                  </h3>
                  <span className="font-mono text-xs px-2 py-0.5 bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-md font-semibold">
                    {verifiedEnquiry.enquiryCode}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {verifiedEnquiry.studentClass} ({verifiedEnquiry.subjects.join(', ')}) • Batch: {verifiedEnquiry.preferredBatch}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Status:</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(verifiedEnquiry.status)}`}>
                {verifiedEnquiry.status}
              </span>
            </div>
          </div>

          {/* Admitted Student Callout (If converted) */}
          {verifiedEnquiry.status === 'Admitted' && (
            <div className="bg-emerald-600 text-white px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Admission Confirmed! Your student account has been created.</span>
              </div>
              {onOpenStudentPortal && (
                <button
                  onClick={onOpenStudentPortal}
                  className="px-3 py-1 bg-white text-emerald-900 rounded-lg font-bold hover:bg-emerald-50 transition shadow-xs"
                >
                  Go to Student Portal
                </button>
              )}
            </div>
          )}

          {/* Main Chat Messages Container */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-50 space-y-4">
            {/* Institute Welcome Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-950 space-y-2 shadow-2xs">
              <div className="flex items-center gap-2 font-bold text-blue-900">
                <Building2 className="w-4 h-4 text-blue-700" />
                <span>Apex Tuition Official Admissions Communication Channel</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                Welcome to your private offline tuition communication desk. Messages here are received directly by Dr. Rajesh Sharma and the admissions counselor. You may ask questions regarding trial classes, batch schedules, fees, and syllabus coverage.
              </p>
            </div>

            {/* Messages Stream */}
            {messages.map(msg => {
              const isVisitor = msg.senderRole === 'visitor';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isVisitor ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[11px] font-semibold text-slate-500">
                      {msg.senderName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                      isVisitor
                        ? 'bg-blue-700 text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Response Chips */}
          <div className="px-4 py-2 bg-white border-t border-slate-200 overflow-x-auto flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">
              Quick Inquiries:
            </span>
            <button
              onClick={() => handleQuickQuestion('Can I schedule a free offline trial session for this Friday?')}
              className="text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap transition border border-slate-200"
            >
              📅 Book Offline Trial Class
            </button>
            <button
              onClick={() => handleQuickQuestion('What is the monthly fee breakdown and what printed study materials are included?')}
              className="text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap transition border border-slate-200"
            >
              💰 Fee Breakdown & Notes
            </button>
            <button
              onClick={() => handleQuickQuestion('What documents and previous marksheets are required for final admission?')}
              className="text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap transition border border-slate-200"
            >
              📋 Required Documents
            </button>
          </div>

          {/* Message Input Footer */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
            <input
              type="text"
              placeholder="Type your message, question, or preferred visit time..."
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={!newMessageText.trim()}
              className="p-3 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 text-white rounded-xl transition shadow-sm"
              title="Send Message"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
