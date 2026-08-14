import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';
import { generateFeeReceiptPdf } from '../../utils/pdfGenerator';
import { NotificationDropdown } from '../common/NotificationDropdown';
import { firebaseStudyMaterialService } from '../../services/firebase';
import { 
  Student, 
  Course, 
  Batch, 
  StudyMaterial, 
  AttendanceRecord, 
  FeePayment, 
  TestRecord, 
  ProgressReport, 
  Notice, 
  Teacher 
} from '../../types';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  CalendarCheck2, 
  Receipt, 
  Award, 
  BarChart3, 
  Bell, 
  User, 
  LogOut, 
  Download, 
  Eye, 
  CheckCircle, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  ShieldCheck, 
  FileCheck, 
  Sparkles,
  Search,
  Filter,
  Check,
  ChevronRight,
  ExternalLink,
  Link2,
  Flame
} from 'lucide-react';

interface StudentPortalProps {
  onBackToWebsite: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({ onBackToWebsite }) => {
  const { studentData, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'course' | 'materials' | 'attendance' | 'fees' | 'tests' | 'progress' | 'notices' | 'profile'
  >('dashboard');

  // Local state
  const [student, setStudent] = useState<Student | null>(studentData);
  const [course, setCourse] = useState<Course | undefined>();
  const [batch, setBatch] = useState<Batch | undefined>();
  const [teacher, setTeacher] = useState<Teacher | undefined>();
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(true);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [fees, setFees] = useState<FeePayment[]>([]);
  const [tests, setTests] = useState<TestRecord[]>([]);
  const [progress, setProgress] = useState<ProgressReport | undefined>();
  const [notices, setNotices] = useState<Notice[]>([]);

  // Material filters
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('All');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All');
  const [selectedClassFilter, setSelectedClassFilter] = useState('All');
  const [searchMaterial, setSearchMaterial] = useState('');

  // PDF download loading state
  const [downloadingFeeId, setDownloadingFeeId] = useState<string | null>(null);

  // Profile password state
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const loadData = () => {
    if (!studentData) return;
    const currentStudent = storage.getStudentById(studentData.id) || studentData;
    setStudent(currentStudent);

    const c = storage.getCourses().find(x => x.id === currentStudent.courseId);
    const b = storage.getBatches().find(x => x.id === currentStudent.batchId);
    setCourse(c);
    setBatch(b);

    if (b) {
      const t = storage.getTeachers().find(x => x.id === b.teacherId);
      setTeacher(t);
    }

    setAttendance(storage.getStudentAttendance(currentStudent.id));
    setFees(storage.getStudentFees(currentStudent.id));
    setTests(storage.getStudentTests(currentStudent.id));
    setProgress(storage.getStudentProgress(currentStudent.id));
    setNotices(storage.getNotices('Student'));
  };

  useEffect(() => {
    loadData();

    const handleDataChanged = () => {
      loadData();
    };

    window.addEventListener('apex_data_changed', handleDataChanged);

    // Subscribe to Firebase Firestore study materials collection
    const unsubMaterials = firebaseStudyMaterialService.subscribeMaterials((items) => {
      setMaterials(items);
      setIsLoadingMaterials(false);
    });

    return () => {
      window.removeEventListener('apex_data_changed', handleDataChanged);
      unsubMaterials();
    };
  }, [studentData]);

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md">
          <p className="text-slate-700 font-semibold mb-4">No student session active.</p>
          <button
            onClick={onBackToWebsite}
            className="px-4 py-2 bg-blue-700 text-white rounded-xl text-xs font-bold"
          >
            Return to Public Website
          </button>
        </div>
      </div>
    );
  }

  // Derived metrics
  const totalClasses = attendance.length;
  const presentClasses = attendance.filter(a => a.status === 'Present').length;
  const attendanceRate = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 100;

  const totalFeePaid = fees.reduce((acc, f) => acc + (f.status === 'Paid' ? f.amount : 0), 0);
  const pendingFee = fees.filter(f => f.status === 'Pending' || f.status === 'Overdue');
  const totalPendingAmount = pendingFee.reduce((acc, f) => acc + f.amount, 0);

  const handleDownloadReceipt = (feeRecord: FeePayment) => {
    setDownloadingFeeId(feeRecord.id);
    const settings = storage.getSettings();
    generateFeeReceiptPdf(feeRecord, student, settings);
    setTimeout(() => setDownloadingFeeId(null), 1000);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    storage.updateStudent(student.id, {
      temporaryPassword: newPassword.trim(),
      isTemporaryPassword: false,
    });
    setPasswordSuccess(true);
    setNewPassword('');
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  // Filtered materials from Firebase Firestore
  const filteredMaterials = materials.filter(m => {
    const matchesSubj = selectedSubjectFilter === 'All' || m.subject === selectedSubjectFilter;
    const matchesType =
      selectedTypeFilter === 'All' ||
      m.category === selectedTypeFilter ||
      m.type === selectedTypeFilter;
    const matchesClass =
      selectedClassFilter === 'All' ||
      m.classSemester === selectedClassFilter ||
      (!m.classSemester && selectedClassFilter === 'Class 12');
    const q = searchMaterial.toLowerCase().trim();
    const matchesSearch =
      !q ||
      m.title.toLowerCase().includes(q) ||
      (m.description && m.description.toLowerCase().includes(q)) ||
      (m.subject && m.subject.toLowerCase().includes(q)) ||
      (m.category && m.category.toLowerCase().includes(q)) ||
      (m.chapter && m.chapter.toLowerCase().includes(q));
    return matchesSubj && matchesType && matchesClass && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-white shrink-0 flex flex-col justify-between border-r border-slate-800">
        <div>
          {/* Brand & Student Snapshot */}
          <div className="p-5 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">
                🎓
              </div>
              <div>
                <h1 className="font-extrabold text-sm tracking-tight text-white">
                  Apex Student Portal
                </h1>
                <p className="text-[10px] text-blue-400 font-mono">Offline LMS • Roll #{student.rollNumber}</p>
              </div>
            </div>

            {/* Student mini card */}
            <div className="mt-4 p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center gap-3">
              <img
                src={student.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                alt={student.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-600"
                referrerPolicy="no-referrer"
              />
              <div className="overflow-hidden">
                <p className="font-bold text-xs text-white truncate">{student.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{student.studentClass} ({student.stream})</p>
                <span className="inline-block mt-0.5 text-[9px] font-mono font-bold px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded">
                  {student.studentId}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 flex md:flex-col overflow-x-auto space-x-1.5 md:space-x-0 md:space-y-1 text-xs font-semibold whitespace-nowrap">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('course')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${
                activeTab === 'course'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>My Course & Timetable</span>
            </button>

            <button
              onClick={() => setActiveTab('materials')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                activeTab === 'materials'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4" />
                <span>PDF Notes & DPPs</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded font-mono">
                {materials.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                activeTab === 'attendance'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CalendarCheck2 className="w-4 h-4" />
                <span>Attendance Log</span>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                attendanceRate >= 80 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
              }`}>
                {attendanceRate}%
              </span>
            </button>

            <button
              onClick={() => setActiveTab('fees')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                activeTab === 'fees'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Receipt className="w-4 h-4" />
                <span>Fees & PDF Receipts</span>
              </div>
              {totalPendingAmount > 0 ? (
                <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                  Due
                </span>
              ) : (
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                  Paid
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('tests')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${
                activeTab === 'tests'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Test Scorecards</span>
            </button>

            <button
              onClick={() => setActiveTab('progress')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${
                activeTab === 'progress'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Syllabus Progress</span>
            </button>

            <button
              onClick={() => setActiveTab('notices')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                activeTab === 'notices'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4" />
                <span>Notices & Circulars</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 bg-slate-700 text-slate-300 rounded font-mono">
                {notices.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile & Password</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={onBackToWebsite}
            className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2"
          >
            <span>Public Website</span>
          </button>

          <button
            onClick={() => {
              logout();
              onBackToWebsite();
            }}
            className="w-full py-2 px-3 bg-red-950/40 hover:bg-red-900/60 text-red-300 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              Offline Classroom Student Portal
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              {activeTab === 'dashboard' && `Welcome Back, ${student.name}`}
              {activeTab === 'course' && 'My Course, Classroom & Timetable'}
              {activeTab === 'materials' && 'Study Materials, Lecture PDFs & DPPs'}
              {activeTab === 'attendance' && 'Physical Classroom Attendance Log'}
              {activeTab === 'fees' && 'Tuition Fee Ledger & PDF Receipts'}
              {activeTab === 'tests' && 'Offline Test Scorecards & Rankings'}
              {activeTab === 'progress' && 'Academic Syllabus Tracker'}
              {activeTab === 'notices' && 'Institute Official Circulars'}
              {activeTab === 'profile' && 'Student Profile & Security'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <NotificationDropdown />
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg font-mono">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>{batch ? `${batch.startTime} - ${batch.endTime}` : '06:45 AM Batch'}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Temporary password banner */}
              {student.isTemporaryPassword && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4 text-xs text-amber-900">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <span>
                      You are currently using a temporary password. Please set a personalized password in your settings.
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="px-3 py-1.5 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition shrink-0"
                  >
                    Change Password
                  </button>
                </div>
              )}

              {/* Metric Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Attendance Metric */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                    <span>Physical Attendance</span>
                    <CalendarCheck2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-slate-900">{attendanceRate}%</span>
                    <span className="text-xs text-slate-500">({presentClasses}/{totalClasses} Days)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${attendanceRate >= 75 ? 'bg-emerald-500' : 'bg-red-500'}`}
                      style={{ width: `${attendanceRate}%` }}
                    />
                  </div>
                </div>

                {/* Fees Status Metric */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                    <span>Fee Balance Due</span>
                    <Receipt className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-extrabold ${totalPendingAmount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      ₹{totalPendingAmount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {totalPendingAmount > 0 ? 'Pending Dues' : 'Up to Date'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Total Paid: <strong>₹{totalFeePaid.toLocaleString('en-IN')}</strong>
                  </p>
                </div>

                {/* Syllabus Completion Metric */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                    <span>Syllabus Covered</span>
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-purple-950">
                      {progress ? `${progress.overallPercentage}%` : '62%'}
                    </span>
                    <span className="text-xs text-slate-500">Board Target</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-purple-600 rounded-full"
                      style={{ width: `${progress ? progress.overallPercentage : 62}%` }}
                    />
                  </div>
                </div>

                {/* Available Study Materials */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                    <span>Study Notes & DPPs</span>
                    <FileText className="w-4 h-4 text-cyan-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-slate-900">{materials.length}</span>
                    <span className="text-xs text-slate-500">PDF Files</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('materials')}
                    className="text-[11px] font-bold text-blue-700 hover:underline flex items-center gap-1"
                  >
                    <span>Browse materials</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* 2-Column Split: Batch & Recent Tests */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Active Batch Card */}
                <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <span>Enrolled Physical Batch</span>
                    </h3>
                    <span className="text-xs font-bold px-2 py-0.5 bg-blue-50 text-blue-800 rounded-md">
                      Active
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3 text-xs text-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Batch Name:</span>
                      <strong className="text-slate-900">{batch?.name || 'Class 12 PCM Elite Batch'}</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Physical Classroom:</span>
                      <strong className="text-slate-900">{batch?.roomNo || 'Lecture Hall 1 (Ground Floor)'}</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Class Timings:</span>
                      <strong className="text-blue-700">{batch?.startTime} - {batch?.endTime} ({batch?.daysOfWeek.join(', ')})</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Batch Mentor:</span>
                      <strong className="text-slate-900">{teacher?.name || 'Dr. Rajesh Sharma'}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('course')}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition text-center"
                  >
                    View Full Syllabus & Timetable
                  </button>
                </div>

                {/* Right: Recent Test Scorecards */}
                <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>Recent Test Performance</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('tests')}
                      className="text-xs font-bold text-blue-700 hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {tests.slice(0, 3).map(t => (
                      <div
                        key={t.id}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-xs text-slate-900">{t.testTitle}</p>
                          <p className="text-[11px] text-slate-500">{t.subject} • {t.testDate}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-900 block">
                            {t.marksObtained} / {t.totalMarks}
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Rank #{t.rank}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MY COURSE */}
          {activeTab === 'course' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider font-mono">
                      {course?.code}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">
                      {course?.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Class: <strong>{student.studentClass}</strong> • Stream: <strong>{student.stream}</strong> • Roll: <strong>{student.rollNumber}</strong>
                    </p>
                  </div>

                  <div className="px-3.5 py-2 bg-blue-50 border border-blue-200 rounded-xl text-xs font-semibold text-blue-900">
                    Physical Campus: Civil Lines Center
                  </div>
                </div>

                {/* Batch Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-slate-500">Assigned Hall</span>
                    <p className="text-sm font-bold text-slate-900">{batch?.roomNo || 'Lecture Hall 1'}</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-slate-500">Class Schedule</span>
                    <p className="text-sm font-bold text-blue-700">{batch?.startTime} - {batch?.endTime}</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-slate-500">Days of Week</span>
                    <p className="text-sm font-bold text-slate-900">{batch?.daysOfWeek.join(', ')}</p>
                  </div>
                </div>

                {/* Subjects enrolled */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                    Enrolled Subjects & Mentors
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {student.subjects.map((subj, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <strong className="text-sm text-slate-900">{subj}</strong>
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        </div>
                        <p className="text-[11px] text-slate-600">Daily Physical Class + DPP</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: STUDY MATERIAL (FIREBASE FIRESTORE BACKEND) */}
          {activeTab === 'materials' && (
            <div className="space-y-6">
              {/* Header & Connectivity Banner */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900">
                      Study Materials & Lecture Resources
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <Flame className="w-3 h-3 text-amber-600 fill-amber-500" />
                      <span>Firestore Live</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Access high-yield classroom notes, DPP problem sheets, assignments, and revision resources stored securely via Google Drive.
                  </p>
                </div>

                <div className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  Showing <span className="font-bold text-blue-700">{filteredMaterials.length}</span> of {materials.length} Materials
                </div>
              </div>

              {/* Filter controls */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search by title, subject, category or chapter..."
                    value={searchMaterial}
                    onChange={(e) => setSearchMaterial(e.target.value)}
                    className="w-full text-xs text-slate-900 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  {searchMaterial && (
                    <button
                      onClick={() => setSearchMaterial('')}
                      className="text-xs text-slate-400 hover:text-slate-600 font-bold px-1"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={selectedSubjectFilter}
                    onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                    className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    <option value="All">All Subjects</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                    <option value="Science">Science (General)</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="English">English</option>
                  </select>

                  <select
                    value={selectedTypeFilter}
                    onChange={(e) => setSelectedTypeFilter(e.target.value)}
                    className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    <option value="All">All Categories</option>
                    <option value="PDF Notes">PDF Notes</option>
                    <option value="DPP">DPP Worksheets</option>
                    <option value="Assignment">Assignments</option>
                    <option value="Question Paper">Question Papers</option>
                    <option value="Formula Sheet">Formula Sheets</option>
                    <option value="Syllabus">Syllabus</option>
                    <option value="Sample Paper">Sample Papers</option>
                  </select>

                  <select
                    value={selectedClassFilter}
                    onChange={(e) => setSelectedClassFilter(e.target.value)}
                    className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    <option value="All">All Classes / Semesters</option>
                    <option value="Class 12">Class 12</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                    <option value="Foundation">Foundation</option>
                  </select>
                </div>
              </div>

              {/* Loading State */}
              {isLoadingMaterials && materials.length === 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                  <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-slate-500">Connecting to Firebase Firestore...</p>
                </div>
              )}

              {/* Empty State */}
              {!isLoadingMaterials && filteredMaterials.length === 0 && (
                <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">No Study Materials Found</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {searchMaterial || selectedSubjectFilter !== 'All' || selectedTypeFilter !== 'All'
                      ? 'No items matched your search filter. Try clearing filters.'
                      : 'Your instructors have not published materials yet. Please check back soon.'}
                  </p>
                  {(searchMaterial || selectedSubjectFilter !== 'All' || selectedTypeFilter !== 'All' || selectedClassFilter !== 'All') && (
                    <button
                      onClick={() => {
                        setSearchMaterial('');
                        setSelectedSubjectFilter('All');
                        setSelectedTypeFilter('All');
                        setSelectedClassFilter('All');
                      }}
                      className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              )}

              {/* Material Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMaterials.map(item => {
                  const targetUrl = item.driveUrl || item.fileUrl || '#';
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4 group"
                    >
                      <div className="space-y-3">
                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-mono">
                            {item.subject}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                            {item.category || item.type}
                          </span>
                          <span className="text-[10px] font-medium px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md">
                            {item.classSemester || 'Class 12'}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="font-bold text-sm text-slate-900 leading-snug group-hover:text-blue-700 transition">
                          {item.title}
                        </h4>

                        {/* Description */}
                        {item.description && (
                          <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-3">
                            {item.description}
                          </p>
                        )}

                        {/* Google Drive Link Indicator */}
                        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 text-[10px] text-slate-500 font-mono overflow-hidden">
                          <Link2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate">{targetUrl}</span>
                        </div>
                      </div>

                      {/* Card Footer with Date & Open Button */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>{item.date || item.uploadDate || 'Recent'}</span>
                        </div>
                        <a
                          href={targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition shadow-xs hover:shadow group-hover:scale-[1.02]"
                        >
                          <span>Open Study Material</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      Physical Attendance Records
                    </h3>
                    <p className="text-xs text-slate-500">
                      Recorded daily at classroom entry gate. Minimum 75% attendance mandatory for board mock exams.
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-xs font-bold ${
                    attendanceRate >= 75 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    Current Attendance: {attendanceRate}%
                  </div>
                </div>

                {/* Log Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Batch</th>
                        <th className="pb-3">Subject / Topic</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {attendance.map(a => (
                        <tr key={a.id} className="hover:bg-slate-50">
                          <td className="py-3 font-semibold text-slate-800">{a.date}</td>
                          <td className="py-3 text-slate-600">{batch?.name || 'Class 12 PCM'}</td>
                          <td className="py-3 text-slate-600">{a.subject}</td>
                          <td className="py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              a.status === 'Present'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {a.status === 'Present' ? <Check className="w-3 h-3" /> : '✗'}
                              <span>{a.status}</span>
                            </span>
                          </td>
                          <td className="py-3 text-slate-500">{a.remarks || 'Regular offline session'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: FEES & PDF RECEIPT */}
          {activeTab === 'fees' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      Tuition Fee Ledger & Official Receipts
                    </h3>
                    <p className="text-xs text-slate-500">
                      Generate and download verifiable PDF fee receipts with official registration stamps and breakdown.
                    </p>
                  </div>
                </div>

                {/* Fee Records Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                        <th className="pb-3">Receipt #</th>
                        <th className="pb-3">Installment / Period</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Payment Mode</th>
                        <th className="pb-3">Payment Date</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Official Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {fees.map(f => (
                        <tr key={f.id} className="hover:bg-slate-50">
                          <td className="py-3 font-mono font-bold text-blue-900">{f.receiptNumber}</td>
                          <td className="py-3 font-medium text-slate-800">{f.installmentName}</td>
                          <td className="py-3 font-bold text-slate-900">₹{f.amount.toLocaleString('en-IN')}</td>
                          <td className="py-3 text-slate-600">{f.paymentMethod}</td>
                          <td className="py-3 text-slate-600">{f.paymentDate}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              f.status === 'Paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {f.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            {f.status === 'Paid' ? (
                              <button
                                onClick={() => handleDownloadReceipt(f)}
                                disabled={downloadingFeeId === f.id}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg font-bold text-xs transition"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>{downloadingFeeId === f.id ? 'Generating...' : 'Download PDF'}</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-amber-700 font-semibold">Pay at Campus Desk</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: TESTS & SCORECARDS */}
          {activeTab === 'tests' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Offline Mock Tests & Evaluation Scorecards
                  </h3>
                  <p className="text-xs text-slate-500">
                    Detailed performance scorecards with class ranks and personalized teacher feedback.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tests.map(t => {
                    const percentage = Math.round((t.marksObtained / t.totalMarks) * 100);
                    return (
                      <div key={t.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-mono">
                            {t.subject}
                          </span>
                          <span className="text-xs text-slate-500">{t.testDate}</span>
                        </div>

                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{t.testTitle}</h4>
                          <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-2xl font-extrabold text-blue-900">
                              {t.marksObtained} / {t.totalMarks}
                            </span>
                            <span className="text-xs font-bold text-emerald-700">({percentage}%)</span>
                            <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full ml-auto">
                              Batch Rank #{t.rank}
                            </span>
                          </div>
                        </div>

                        {t.remarks && (
                          <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600">
                            <strong>Mentor Remarks:</strong> {t.remarks}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB: PROGRESS */}
          {activeTab === 'progress' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Academic Syllabus Coverage Tracker
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real-time status of completed topics and scheduled revisions for upcoming board examinations.
                  </p>
                </div>

                {progress?.subjectBreakdown && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {progress.subjectBreakdown.map((sb, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <strong className="text-sm text-slate-900">{sb.subject}</strong>
                          <span className="text-xs font-bold text-blue-700">{sb.percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${sb.percentage}%` }} />
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {sb.completedTopics} of {sb.totalTopics} Topics Completed
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: NOTICES */}
          {activeTab === 'notices' && (
            <div className="space-y-4">
              {notices.map(n => (
                <div key={n.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Published: <strong>{n.publishDate}</strong></span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-800 rounded">
                      {n.type}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{n.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB: PROFILE & SECURITY */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Student Account & Security Settings
                </h3>
                <p className="text-xs text-slate-500">
                  Update your account password and review registered contact information.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs text-slate-700">
                <p><strong>Student ID:</strong> {student.studentId}</p>
                <p><strong>Registered Phone:</strong> {student.phone}</p>
                <p><strong>Parent / Guardian:</strong> {student.parentName} ({student.parentPhone})</p>
                <p><strong>Physical Batch:</strong> {batch?.name || 'Class 12 PCM Elite'}</p>
              </div>

              {/* Password update form */}
              <form onSubmit={handleSavePassword} className="space-y-4 pt-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600">
                  Set New Password
                </h4>
                <div>
                  <input
                    type="password"
                    required
                    placeholder="Enter new password..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {passwordSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Password updated successfully!</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  Save New Password
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
