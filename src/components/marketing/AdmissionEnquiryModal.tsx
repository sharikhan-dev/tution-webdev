import React, { useState } from 'react';
import { Course, Batch } from '../../types';
import { storage } from '../../services/storage';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle2, 
  Copy, 
  Check, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  FileText,
  Clock,
  Phone,
  User,
  BookOpen
} from 'lucide-react';

interface AdmissionEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  batches: Batch[];
  initialCourse?: string;
  initialClass?: string;
  initialBatch?: string;
  onOpenEnquiryRoom: (enquiryCode: string) => void;
}

export const AdmissionEnquiryModal: React.FC<AdmissionEnquiryModalProps> = ({
  isOpen,
  onClose,
  courses,
  batches,
  initialCourse = '',
  initialClass = 'Class 12',
  initialBatch = '',
  onOpenEnquiryRoom,
}) => {
  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [studentClass, setStudentClass] = useState(initialClass || 'Class 12');
  const [stream, setStream] = useState('PCM');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Physics', 'Mathematics', 'Chemistry']);
  const [preferredBatch, setPreferredBatch] = useState(initialBatch || 'Morning 06:45 AM (Batch A)');
  const [previousPercentage, setPreviousPercentage] = useState<string>('88.5');
  const [source, setSource] = useState('Google Search');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdEnquiry, setCreatedEnquiry] = useState<{
    code: string;
    pin: string;
    studentName: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const subjectOptions = [
    'Physics',
    'Chemistry',
    'Mathematics',
    'Biology',
    'General Science',
  ];

  const handleToggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !parentName.trim() || !phone.trim()) {
      alert('Please fill in required fields (Student Name, Parent Name, and Phone number).');
      return;
    }

    setIsSubmitting(true);

    try {
      const enquiry = storage.createEnquiry({
        studentName: studentName.trim(),
        parentName: parentName.trim(),
        phone: phone.trim(),
        email: email.trim() || `${studentName.toLowerCase().replace(/\s+/g, '')}@example.com`,
        studentClass,
        stream,
        subjects: selectedSubjects.length > 0 ? selectedSubjects : ['All Core Subjects'],
        preferredBatch,
        message: message.trim() || 'Interested in physical classroom offline coaching & trial class.',
        previousPercentage: previousPercentage ? parseFloat(previousPercentage) : undefined,
        source,
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.log(e);
      }

      setCreatedEnquiry({
        code: enquiry.enquiryCode,
        pin: enquiry.verificationCode,
        studentName: enquiry.studentName,
      });
    } catch (err) {
      console.error('Failed to submit enquiry:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (createdEnquiry) {
      navigator.clipboard.writeText(createdEnquiry.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleGoToChat = () => {
    if (createdEnquiry) {
      onClose();
      onOpenEnquiryRoom(createdEnquiry.code);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-blue-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {createdEnquiry ? 'Enquiry Received Successfully!' : 'Offline Admission & Trial Enquiry'}
              </h3>
              <p className="text-[11px] text-blue-200">
                {createdEnquiry ? 'Temporary Enquiry ID Generated' : 'Reserve physical classroom seat & book faculty consultation'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View */}
        {createdEnquiry ? (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-extrabold text-slate-900">
                Thank You, {createdEnquiry.studentName}!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Your admission enquiry has been submitted. An admissions counselor and Dr. Rajesh Sharma have been notified.
              </p>
            </div>

            {/* Generated Code Highlight Box */}
            <div className="p-5 bg-blue-50/80 rounded-2xl border-2 border-blue-200 max-w-md mx-auto space-y-3">
              <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
                Your Unique Enquiry ID
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-wider">
                  {createdEnquiry.code}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="p-2 bg-white hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition shadow-2xs"
                  title="Copy Enquiry Code"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="text-[11px] text-slate-600 pt-1 border-t border-blue-200/60 flex items-center justify-center gap-2">
                <span>Security PIN: <strong className="font-mono text-slate-900">{createdEnquiry.pin}</strong></span>
                <span>•</span>
                <span>Status: <strong className="text-emerald-700">New (Under Review)</strong></span>
              </div>
            </div>

            <p className="text-xs text-amber-800 bg-amber-50 py-2 px-4 rounded-xl border border-amber-200 max-w-md mx-auto">
              ⚠️ <strong>Please keep this Enquiry ID safe.</strong> You will need it to track your application and communicate directly with the tuition counselor.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <button
                onClick={handleGoToChat}
                className="flex-1 py-3 px-5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-md shadow-blue-700/20"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Secure Enquiry Chat Room</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
              >
                Back to Website
              </button>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Row 1: Student & Parent Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Student Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Khan"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Parent / Guardian Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Irfan Khan"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Row 2: Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="e.g. rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Row 3: Class & Stream */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Class / Grade <span className="text-red-500">*</span>
                </label>
                <select
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                >
                  <option value="Class 12">Class 12 (Sr. Secondary)</option>
                  <option value="Class 11">Class 11 (Foundation)</option>
                  <option value="Class 10">Class 10 (Board Target)</option>
                  <option value="Class 9">Class 9 (Early Foundation)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Stream / Course Focus
                </label>
                <select
                  value={stream}
                  onChange={(e) => setStream(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                >
                  <option value="PCM">PCM (Physics, Chemistry, Maths)</option>
                  <option value="PCB">PCB (Physics, Chemistry, Biology)</option>
                  <option value="General Science">General Science & Maths (Class 9-10)</option>
                  <option value="Single Subject">Single Subject Guidance</option>
                </select>
              </div>
            </div>

            {/* Subjects Interested In */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Subjects Interested In
              </label>
              <div className="flex flex-wrap gap-2">
                {subjectOptions.map(subj => {
                  const isSelected = selectedSubjects.includes(subj);
                  return (
                    <button
                      type="button"
                      key={subj}
                      onClick={() => handleToggleSubject(subj)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {subj}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 4: Preferred Batch Timing & Previous Percentage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Preferred Physical Batch Timing
                </label>
                <select
                  value={preferredBatch}
                  onChange={(e) => setPreferredBatch(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                >
                  <option value="Morning 06:45 AM (Batch A)">Morning 06:45 AM (Batch A)</option>
                  <option value="Morning 07:00 AM (Medical Batch)">Morning 07:00 AM (Medical Batch)</option>
                  <option value="Evening 05:00 PM (Batch B)">Evening 05:00 PM (Batch B)</option>
                  <option value="Evening 05:30 PM (Super 30)">Evening 05:30 PM (Super 30)</option>
                  <option value="Flexible / Counselor Choice">Flexible / Need Recommendation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Previous Class Percentage (Optional)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="e.g. 88.5"
                  value={previousPercentage}
                  onChange={(e) => setPreviousPercentage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Row 5: Source & Message */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                How did you hear about Apex Tuition?
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              >
                <option value="Google Search">Google Search</option>
                <option value="Friend / Word of Mouth">Friend / Word of Mouth / Existing Student</option>
                <option value="Flyer / Banner / Newspaper">Flyer / Banner / Hoarding</option>
                <option value="School Teacher Recommendation">School Teacher Recommendation</option>
                <option value="Social Media">Social Media</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Specific Learning Needs or Questions for Mentor
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Need special focus in Physics derivations and weekend doubt sessions..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition resize-none"
              />
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-md shadow-blue-700/20"
              >
                {isSubmitting ? (
                  <span>Generating Enquiry Code...</span>
                ) : (
                  <>
                    <span>Submit Enquiry & Get Temporary Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-[11px] text-slate-500 text-center mt-2">
                🔒 Your details are kept private. A temporary code will be generated immediately.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
