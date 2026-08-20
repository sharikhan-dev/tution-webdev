import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';
import { generateFeeReceiptPdf } from '../../utils/pdfGenerator';
import { NotificationDropdown } from '../common/NotificationDropdown';
import { firebaseStudyMaterialService, firebaseCloudStorage, initFCM, db, auth, firebaseConfig } from '../../services/firebase';
import confetti from 'canvas-confetti';
import { 
  Enquiry, 
  Student, 
  Course, 
  Batch, 
  Teacher, 
  StudyMaterial, 
  AttendanceRecord, 
  FeePayment, 
  TestRecord, 
  Notice, 
  WebsiteSettings,
  SEOSettings 
} from '../../types';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  CalendarCheck2, 
  Receipt, 
  FileText, 
  Award, 
  BarChart3, 
  Bell, 
  Globe, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  Filter, 
  Check, 
  X, 
  MessageSquare, 
  UserPlus, 
  Send, 
  Download, 
  Trash2, 
  Edit3, 
  Copy, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  RefreshCw,
  Sparkles,
  Phone,
  Clock,
  MapPin,
  ShieldCheck,
  Building,
  ExternalLink,
  Link2,
  Flame,
  Upload
} from 'lucide-react';

interface AdminPortalProps {
  onBackToWebsite: () => void;
  onOpenEnquiryRoomDirect: (enquiryCode: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onBackToWebsite,
  onOpenEnquiryRoomDirect,
}) => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'enquiries' | 'students' | 'batches' | 'fees' | 'materials' | 'notices' | 'cms' | 'firebase'
  >('overview');

  // Master State
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [fees, setFees] = useState<FeePayment[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings>(storage.getSettings());
  const [seoSettings, setSeoSettings] = useState<SEOSettings>(storage.getSEOSettings());
  const [adminUser, setAdminUser] = useState(() => storage.getAdminCredentials().username);
  const [adminPass, setAdminPass] = useState(() => storage.getAdminCredentials().password);

  // Search & Filter States
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('All');
  const [studentSearch, setStudentSearch] = useState('');

  // Convert Enquiry Modal
  const [convertModalEnquiry, setConvertModalEnquiry] = useState<Enquiry | null>(null);
  const [convertCourseId, setConvertCourseId] = useState('');
  const [convertBatchId, setConvertBatchId] = useState('');
  const [convertRollNo, setConvertRollNo] = useState('103');
  const [convertInitialFee, setConvertInitialFee] = useState('4500');

  // Record Fee Modal
  const [recordFeeModal, setRecordFeeModal] = useState(false);
  const [feeStudentId, setFeeStudentId] = useState('');
  const [feeAmount, setFeeAmount] = useState('4500');
  const [feeInstallment, setFeeInstallment] = useState('August 2026 Monthly Tuition Fee');
  const [feeMethod, setFeeMethod] = useState<'Cash' | 'UPI' | 'Bank Transfer' | 'Card'>('UPI');

  // Batch Management Modal & State
  const [createBatchModal, setCreateBatchModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [batchName, setBatchName] = useState('');
  const [batchCourseId, setBatchCourseId] = useState('');
  const [batchTeacherId, setBatchTeacherId] = useState('');
  const [batchRoomNo, setBatchRoomNo] = useState('Hall 1');
  const [batchDays, setBatchDays] = useState('Mon, Wed, Fri');
  const [batchStartTime, setBatchStartTime] = useState('17:00');
  const [batchEndTime, setBatchEndTime] = useState('19:00');
  const [batchMaxStudents, setBatchMaxStudents] = useState('35');
  const [batchMonthlyFee, setBatchMonthlyFee] = useState('4500');

  // Study Material Management States (Firebase Firestore Backend)
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(true);
  const [firebaseConnected, setFirebaseConnected] = useState(true);
  const [materialSearch, setMaterialSearch] = useState('');
  const [materialClassFilter, setMaterialClassFilter] = useState('All');
  const [materialSubjectFilter, setMaterialSubjectFilter] = useState('All');
  const [materialCategoryFilter, setMaterialCategoryFilter] = useState('All');

  // Study Material Modals
  const [uploadMaterialModal, setUploadMaterialModal] = useState(false);
  const [editMaterialModal, setEditMaterialModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<StudyMaterial | null>(null);
  const [updateDriveUrlModal, setUpdateDriveUrlModal] = useState(false);
  const [quickDriveMaterial, setQuickDriveMaterial] = useState<StudyMaterial | null>(null);
  const [quickDriveUrl, setQuickDriveUrl] = useState('');
  const [deleteMaterialModal, setDeleteMaterialModal] = useState(false);
  const [deletingMaterial, setDeletingMaterial] = useState<StudyMaterial | null>(null);
  const [isSubmittingMaterial, setIsSubmittingMaterial] = useState(false);

  // Form Fields for Add/Edit
  const [matTitle, setMatTitle] = useState('');
  const [matSubject, setMatSubject] = useState('Physics');
  const [matDescription, setMatDescription] = useState('');
  const [matClassSemester, setMatClassSemester] = useState('Class 12');
  const [matCategory, setMatCategory] = useState('PDF Notes');
  const [matDriveUrl, setMatDriveUrl] = useState('');
  const [matDate, setMatDate] = useState(new Date().toISOString().split('T')[0]);

  // Create Test Modal
  const [createTestModal, setCreateTestModal] = useState(false);
  const [testBatchId, setTestBatchId] = useState('');
  const [testSubject, setTestSubject] = useState('Physics');
  const [testTitle, setTestTitle] = useState('Electrostatics & Gauss Law Mock Test');
  const [testMaxMarks, setTestMaxMarks] = useState('50');

  // Broadcast Notice Modal
  const [newNoticeModal, setNewNoticeModal] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeDesc, setNoticeDesc] = useState('');
  const [noticeAudience, setNoticeAudience] = useState<'All' | 'Student' | 'Parent' | 'Public'>('All');
  const [noticePriority, setNoticePriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

  // Attendance Marking State
  const [attendBatchId, setAttendBatchId] = useState<string>('batch-1');
  const [attendDate, setAttendDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendSubject, setAttendSubject] = useState('Physics');
  const [attendStatuses, setAttendStatuses] = useState<{ [studentId: string]: 'Present' | 'Absent' | 'Late' }>({});

  // Firebase Copy & Test state
  const [rulesCopied, setRulesCopied] = useState(false);
  const [blueprintCopied, setBlueprintCopied] = useState(false);
  const [isTestingFirestore, setIsTestingFirestore] = useState(false);
  const [firestoreTestResult, setFirestoreTestResult] = useState<string | null>(null);

  const handleTestFirestoreConnection = async () => {
    try {
      setIsTestingFirestore(true);
      setFirestoreTestResult(null);
      const testItems = await firebaseStudyMaterialService.getAllMaterials();
      setFirestoreTestResult(`Success! Firestore online: ${testItems.length} documents fetched from database '${(firebaseConfig as any).firestoreDatabaseId || 'default'}'.`);
    } catch (err: any) {
      setFirestoreTestResult(`Firestore error: ${err?.message || err}`);
    } finally {
      setIsTestingFirestore(false);
    }
  };

  const handleCopyRules = () => {
    const rules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /study_materials/{materialId} {
      allow read, write: if true;
    }
  }
}`;
    navigator.clipboard.writeText(rules);
    setRulesCopied(true);
    setTimeout(() => setRulesCopied(false), 2500);
  };

  const handleCopyBlueprint = () => {
    const blueprint = JSON.stringify({
      entities: {
        StudyMaterial: {
          title: "StudyMaterial",
          description: "Educational study materials, lecture notes, DPPs, and assignments hosted on Google Drive",
          type: "object",
          properties: {
            title: { type: "string" },
            subject: { type: "string" },
            description: { type: "string" },
            classSemester: { type: "string" },
            category: { type: "string" },
            driveUrl: { type: "string" },
            date: { type: "string" }
          },
          required: ["title", "subject", "classSemester", "category", "driveUrl", "date"]
        }
      },
      firestore: {
        study_materials: {
          entity: "StudyMaterial",
          description: "Collection of all study materials hosted on Google Drive"
        }
      }
    }, null, 2);
    navigator.clipboard.writeText(blueprint);
    setBlueprintCopied(true);
    setTimeout(() => setBlueprintCopied(false), 2500);
  };

  const loadAllData = () => {
    setEnquiries(storage.getEnquiries());
    setStudents(storage.getStudents());
    const c = storage.getCourses();
    setCourses(c);
    if (c.length > 0 && !convertCourseId) setConvertCourseId(c[0].id);

    const b = storage.getBatches();
    setBatches(b);
    if (b.length > 0 && !convertBatchId) setConvertBatchId(b[0].id);

    setTeachers(storage.getTeachers());
    setFees(storage.getFees());
    setNotices(storage.getNotices('All'));
    setSettings(storage.getSettings());
  };

  useEffect(() => {
    loadAllData();
    const handleDataChanged = () => loadAllData();
    window.addEventListener('apex_data_changed', handleDataChanged);

    // Initialize Firebase FCM and subscribe to Firebase Firestore study_materials collection
    initFCM();
    const unsubMaterials = firebaseStudyMaterialService.subscribeMaterials((items) => {
      setMaterials(items);
      setIsLoadingMaterials(false);
      setFirebaseConnected(true);
    });

    return () => {
      window.removeEventListener('apex_data_changed', handleDataChanged);
      unsubMaterials();
    };
  }, []);

  // Initialize attendance for selected batch
  useEffect(() => {
    if (!attendBatchId) return;
    const batchStudents = students.filter(s => s.batchId === attendBatchId);
    const initial: { [key: string]: 'Present' | 'Absent' | 'Late' } = {};
    batchStudents.forEach(s => {
      initial[s.id] = 'Present';
    });
    setAttendStatuses(initial);
  }, [attendBatchId, students]);

  // Handle Enquiry Status Change
  const handleUpdateEnquiryStatus = (id: string, newStatus: Enquiry['status']) => {
    storage.updateEnquiry(id, { status: newStatus });
  };

  // Convert Enquiry to Student
  const handleConvertEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertModalEnquiry) return;

    const initialFeeNum = parseFloat(convertInitialFee) || 4500;
    const conversionResult = storage.convertEnquiryToStudent(
      convertModalEnquiry.id,
      convertCourseId,
      convertBatchId,
      initialFeeNum,
      convertRollNo
    );
    const student = conversionResult.student;

    // Also record initial fee if entered
    if (initialFeeNum > 0) {
      storage.recordFeePayment({
        studentId: student.id,
        amount: initialFeeNum,
        feeMonth: 'August 2026',
        installmentName: 'Admission & 1st Month Tuition Fee',
        paymentMode: 'UPI',
        previousDue: 0,
        remainingBalance: 0,
        paymentDate: new Date().toISOString().split('T')[0],
        notes: 'Initial fee recorded upon admission conversion',
      });
    }

    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (e) {
      console.log(e);
    }

    setConvertModalEnquiry(null);
    alert(`Success! ${student.name} is now admitted with Student ID: ${student.studentId} and Password: ${student.temporaryPassword || conversionResult.tempPassword}`);
  };

  // Record Fee Form
  const handleRecordFee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeStudentId) {
      alert('Please select a student.');
      return;
    }

    const fee = storage.recordFeePayment({
      studentId: feeStudentId,
      amount: parseFloat(feeAmount) || 0,
      feeMonth: feeInstallment || 'August 2026',
      installmentName: feeInstallment,
      paymentMode: feeMethod,
      previousDue: 0,
      remainingBalance: 0,
      paymentDate: new Date().toISOString().split('T')[0],
    });

    setRecordFeeModal(false);
    alert(`Fee payment recorded successfully. Receipt #${fee.receiptNo || fee.receiptNumber} generated.`);
  };

  // Batch Management Handlers
  const handleSaveBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchName.trim() || !batchCourseId) {
      alert('Please enter a batch name and select a course.');
      return;
    }
    const daysArr = batchDays.split(',').map(d => d.trim()).filter(Boolean);

    if (editingBatch) {
      const updated = storage.updateBatch(editingBatch.id, {
        name: batchName,
        courseId: batchCourseId,
        teacherId: batchTeacherId,
        roomNo: batchRoomNo,
        daysOfWeek: daysArr.length > 0 ? daysArr : ['Mon', 'Wed', 'Fri'],
        startTime: batchStartTime,
        endTime: batchEndTime,
        maxStudents: parseInt(batchMaxStudents) || 35,
      });
      if (updated) {
        setBatches(batches.map(b => b.id === updated.id ? updated : b));
      }
      if (batchMonthlyFee && batchCourseId) {
        const updatedFee = parseFloat(batchMonthlyFee);
        if (!isNaN(updatedFee)) {
          const updatedCourses = courses.map(cr => cr.id === batchCourseId ? { ...cr, monthlyFee: updatedFee } : cr);
          storage.saveCourses(updatedCourses);
          setCourses(updatedCourses);
        }
      }
      alert(`Batch "${batchName}" updated successfully!`);
    } else {
      const newB = storage.createBatch({
        name: batchName,
        courseId: batchCourseId,
        teacherId: batchTeacherId || (teachers[0]?.id || 't1'),
        roomNo: batchRoomNo || 'Hall 1',
        daysOfWeek: daysArr.length > 0 ? daysArr : ['Mon', 'Wed', 'Fri'],
        startTime: batchStartTime || '17:00',
        endTime: batchEndTime || '19:00',
        maxStudents: parseInt(batchMaxStudents) || 35,
        currentEnrolled: 0,
        isActive: true,
      });
      setBatches([...batches, newB]);

      if (batchMonthlyFee && batchCourseId) {
        const updatedFee = parseFloat(batchMonthlyFee);
        if (!isNaN(updatedFee)) {
          const updatedCourses = courses.map(cr => cr.id === batchCourseId ? { ...cr, monthlyFee: updatedFee } : cr);
          storage.saveCourses(updatedCourses);
          setCourses(updatedCourses);
        }
      }
      alert(`New batch "${batchName}" created successfully!`);
    }
    setCreateBatchModal(false);
    setEditingBatch(null);
  };

  const handleDeleteBatch = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete batch "${name}"? This action cannot be undone.`)) {
      storage.deleteBatch(id);
      setBatches(batches.filter(b => b.id !== id));
    }
  };

  const handleOpenEditBatch = (b: Batch) => {
    const bCourse = courses.find(c => c.id === b.courseId);
    setEditingBatch(b);
    setBatchName(b.name);
    setBatchCourseId(b.courseId);
    setBatchTeacherId(b.teacherId || '');
    setBatchRoomNo(b.roomNo);
    setBatchDays(b.daysOfWeek.join(', '));
    setBatchStartTime(b.startTime);
    setBatchEndTime(b.endTime);
    setBatchMaxStudents(b.maxStudents.toString());
    setBatchMonthlyFee(bCourse?.monthlyFee?.toString() || '4500');
    setCreateBatchModal(true);
  };

  const handleOpenCreateBatch = () => {
    setEditingBatch(null);
    setBatchName('');
    setBatchCourseId(courses[0]?.id || '');
    setBatchTeacherId(teachers[0]?.id || '');
    setBatchRoomNo('Hall 1');
    setBatchDays('Mon, Wed, Fri');
    setBatchStartTime('17:00');
    setBatchEndTime('19:00');
    setBatchMaxStudents('35');
    setBatchMonthlyFee('4500');
    setCreateBatchModal(true);
  };

  // Open Add Material Modal
  const handleOpenAddMaterial = () => {
    setMatTitle('');
    setMatSubject('Physics');
    setMatDescription('');
    setMatClassSemester('Class 12');
    setMatCategory('PDF Notes');
    setMatDriveUrl('');
    setMatDate(new Date().toISOString().split('T')[0]);
    setUploadMaterialModal(true);
  };

  // Open Edit Material Modal
  const handleOpenEditMaterial = (material: StudyMaterial) => {
    setEditingMaterial(material);
    setMatTitle(material.title);
    setMatSubject(material.subject || 'Physics');
    setMatDescription(material.description || '');
    setMatClassSemester(material.classSemester || 'Class 12');
    setMatCategory(material.category || 'PDF Notes');
    setMatDriveUrl(material.driveUrl || material.fileUrl || '');
    setMatDate(material.date || new Date().toISOString().split('T')[0]);
    setEditMaterialModal(true);
  };

  // Open Quick Update Google Drive Link Modal
  const handleOpenQuickDriveUrl = (material: StudyMaterial) => {
    setQuickDriveMaterial(material);
    setQuickDriveUrl(material.driveUrl || material.fileUrl || '');
    setUpdateDriveUrlModal(true);
  };

  // Open Delete Material Modal
  const handleOpenDeleteMaterial = (material: StudyMaterial) => {
    setDeletingMaterial(material);
    setDeleteMaterialModal(true);
  };

  // Save New Study Material to Firebase Firestore
  const handleSaveNewMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matTitle.trim()) {
      alert('Please enter a material title.');
      return;
    }
    if (!matDriveUrl.trim()) {
      alert('Please provide a Google Drive URL for the study material.');
      return;
    }

    try {
      setIsSubmittingMaterial(true);
      await firebaseStudyMaterialService.addMaterial({
        title: matTitle.trim(),
        subject: matSubject.trim(),
        description: matDescription.trim(),
        classSemester: matClassSemester.trim(),
        category: matCategory.trim(),
        driveUrl: matDriveUrl.trim(),
        date: matDate || new Date().toISOString().split('T')[0],
      });

      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      } catch (err) {
        console.log(err);
      }

      setUploadMaterialModal(false);
      alert('Study material stored in Firebase Firestore and notification dispatched.');
    } catch (error: any) {
      console.error('Error adding study material:', error);
      alert(`Failed to save study material to Firestore: ${error.message || error}`);
    } finally {
      setIsSubmittingMaterial(false);
    }
  };

  // Save Edited Study Material to Firebase Firestore
  const handleSaveEditMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMaterial) return;
    if (!matTitle.trim()) {
      alert('Please enter a material title.');
      return;
    }
    if (!matDriveUrl.trim()) {
      alert('Please enter a Google Drive URL.');
      return;
    }

    try {
      setIsSubmittingMaterial(true);
      await firebaseStudyMaterialService.updateMaterial(editingMaterial.id, {
        title: matTitle.trim(),
        subject: matSubject.trim(),
        description: matDescription.trim(),
        classSemester: matClassSemester.trim(),
        category: matCategory.trim(),
        driveUrl: matDriveUrl.trim(),
        date: matDate,
      });

      setEditMaterialModal(false);
      setEditingMaterial(null);
      alert('Study material updated successfully in Firebase Firestore.');
    } catch (error: any) {
      console.error('Error updating study material:', error);
      alert(`Failed to update study material: ${error.message || error}`);
    } finally {
      setIsSubmittingMaterial(false);
    }
  };

  // Quick Update Google Drive URL in Firestore
  const handleSaveQuickDriveUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickDriveMaterial) return;
    if (!quickDriveUrl.trim()) {
      alert('Please enter a valid Google Drive URL.');
      return;
    }

    try {
      setIsSubmittingMaterial(true);
      await firebaseStudyMaterialService.updateMaterial(quickDriveMaterial.id, {
        driveUrl: quickDriveUrl.trim(),
      });
      setUpdateDriveUrlModal(false);
      setQuickDriveMaterial(null);
      alert('Google Drive link updated successfully in Firebase Firestore.');
    } catch (error: any) {
      console.error('Error updating Google Drive link:', error);
      alert(`Failed to update link: ${error.message || error}`);
    } finally {
      setIsSubmittingMaterial(false);
    }
  };

  // Delete Study Material from Firebase Firestore
  const handleConfirmDeleteMaterial = async () => {
    if (!deletingMaterial) return;
    try {
      setIsSubmittingMaterial(true);
      await firebaseStudyMaterialService.deleteMaterial(deletingMaterial.id);
      setDeleteMaterialModal(false);
      setDeletingMaterial(null);
      alert('Study material deleted from Firebase Firestore.');
    } catch (error: any) {
      console.error('Error deleting study material:', error);
      alert(`Failed to delete material: ${error.message || error}`);
    } finally {
      setIsSubmittingMaterial(false);
    }
  };

  // Create Mock Test & Enter Marks
  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    const batchStudents = students.filter(s => s.batchId === testBatchId);

    batchStudents.forEach((st, idx) => {
      const marks = Math.max(25, Math.min(50, 48 - idx * 4));
      storage.recordTestScore({
        testTitle: testTitle.trim(),
        courseId: st.courseId,
        batchId: st.batchId,
        subject: testSubject,
        testDate: new Date().toISOString().split('T')[0],
        totalMarks: parseFloat(testMaxMarks),
        studentId: st.id,
        marksObtained: marks,
        rank: idx + 1,
        remarks: idx === 0 ? 'Outstanding score in problem solving!' : 'Good effort, revise numerical formulas.',
      });
    });

    setCreateTestModal(false);
    alert(`Mock test created and scorecards recorded for ${batchStudents.length} students in batch.`);
  };

  // Submit Attendance
  const handleSaveAttendance = () => {
    const batchStudents = students.filter(s => s.batchId === attendBatchId);
    let count = 0;

    batchStudents.forEach(st => {
      const status = attendStatuses[st.id] || 'Present';
      storage.recordAttendance({
        studentId: st.id,
        courseId: st.courseId,
        batchId: st.batchId,
        subject: attendSubject,
        date: attendDate,
        status,
        remarks: status === 'Absent' ? 'Parent alerted via SMS/App notification' : 'Present in classroom lecture',
      });
      count++;
    });

    alert(`Attendance for ${count} students saved successfully for ${attendDate}.`);
  };

  // Post Notice
  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim()) return;

    storage.addNotice({
      title: noticeTitle.trim(),
      description: noticeDesc.trim(),
      type: 'Circular',
      publishDate: new Date().toISOString().split('T')[0],
      targetAudience: noticeAudience,
      priority: noticePriority,
      isActive: true,
    });

    setNewNoticeModal(false);
    setNoticeTitle('');
    setNoticeDesc('');
    alert('Notice broadcasted to notice boards and user portals.');
  };

  // Quick Stats
  const totalRevenue = fees.reduce((acc, f) => acc + (f.status === 'Paid' ? f.amount : 0), 0);
  const pendingEnquiries = enquiries.filter(e => e.status === 'New' || e.status === 'Contacted').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 text-slate-300 shrink-0 flex flex-col justify-between border-r border-slate-800">
        <div>
          {/* Brand */}
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center font-bold text-white shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm text-white tracking-tight">
                Apex Institute CRM
              </h1>
              <p className="text-[10px] text-amber-400 font-mono">Offline Campus Admin</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-3 text-xs font-medium overflow-x-auto md:overflow-x-visible flex md:flex-col gap-1 md:gap-1 scrollbar-none border-b md:border-b-0 border-slate-800">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition shrink-0 whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('enquiries')}
              className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl transition shrink-0 whitespace-nowrap ${
                activeTab === 'enquiries'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>Enquiries & CRM</span>
              </div>
              {pendingEnquiries > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 bg-red-500 text-white font-bold rounded-full animate-pulse ml-1">
                  {pendingEnquiries}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl transition shrink-0 whitespace-nowrap ${
                activeTab === 'students'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Admitted Students</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-mono ml-1">
                {students.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('batches')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition shrink-0 whitespace-nowrap ${
                activeTab === 'batches'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Courses & Batches</span>
            </button>

            <button
              onClick={() => setActiveTab('fees')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition shrink-0 whitespace-nowrap ${
                activeTab === 'fees'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>Fee Collection</span>
            </button>

            <button
              onClick={() => setActiveTab('materials')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition shrink-0 whitespace-nowrap ${
                activeTab === 'materials'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Study Notes & DPPs</span>
            </button>

            <button
              onClick={() => setActiveTab('notices')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition shrink-0 whitespace-nowrap ${
                activeTab === 'notices'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Notices & Circulars</span>
            </button>

            <button
              onClick={() => setActiveTab('cms')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition shrink-0 whitespace-nowrap ${
                activeTab === 'cms'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Website CMS & SEO</span>
            </button>

            <button
              onClick={() => setActiveTab('firebase')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition shrink-0 whitespace-nowrap ${
                activeTab === 'firebase'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Firebase Cloud</span>
            </button>
          </nav>
        </div>

        {/* Footer */}
        <div className="p-3 md:p-4 border-t border-slate-800 flex md:flex-col gap-2 shrink-0">
          <button
            onClick={onBackToWebsite}
            className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition text-center whitespace-nowrap"
          >
            Public Website
          </button>
          <button
            onClick={() => {
              logout();
              onBackToWebsite();
            }}
            className="flex-1 py-2 px-3 bg-red-950/40 hover:bg-red-900/60 text-red-300 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Institute Administration Desk
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              {activeTab === 'overview' && 'Director Executive Dashboard'}
              {activeTab === 'enquiries' && 'Admission Enquiries & CRM Funnel'}
              {activeTab === 'students' && 'Enrolled Students & Roll Register'}
              {activeTab === 'batches' && 'Classroom Batches & Timetables'}
              {activeTab === 'attendance' && 'Daily Physical Attendance Register'}
              {activeTab === 'fees' && 'Tuition Fee Management & Invoicing'}
              {activeTab === 'materials' && 'Classroom PDF Notes & DPP Worksheets'}
              {activeTab === 'tests' && 'Mock Tests & Scorecards Management'}
              {activeTab === 'notices' && 'Broadcast Official Circulars'}
              {activeTab === 'cms' && 'Public Website Content Management'}
              {activeTab === 'supabase' && 'Database Schema & Cloud Sync'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <NotificationDropdown />
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Dr. Rajesh Sharma (Director)</span>
            </div>
            <button
              onClick={() => {
                logout();
                onBackToWebsite();
              }}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-red-200"
              title="Sign Out of Admin Desk"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Top Stats Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-xs text-slate-500 font-semibold">Total Admission Enquiries</span>
                  <p className="text-2xl font-extrabold text-slate-900">{enquiries.length}</p>
                  <span className="text-[11px] text-emerald-700 font-semibold">{pendingEnquiries} New/Pending</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-xs text-slate-500 font-semibold">Active Enrolled Students</span>
                  <p className="text-2xl font-extrabold text-blue-900">{students.length}</p>
                  <span className="text-[11px] text-slate-500">Across {batches.length} Physical Batches</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-xs text-slate-500 font-semibold">Tuition Fee Revenue</span>
                  <p className="text-2xl font-extrabold text-emerald-700">₹{totalRevenue.toLocaleString('en-IN')}</p>
                  <span className="text-[11px] text-emerald-700 font-semibold">Verified Receipts</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-xs text-slate-500 font-semibold">Study Notes & DPPs</span>
                  <p className="text-2xl font-extrabold text-purple-900">{materials.length}</p>
                  <span className="text-[11px] text-purple-700 font-semibold">Published to Portal</span>
                </div>
              </div>

              {/* Quick CRM Action Bar */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <h3 className="font-bold text-sm text-slate-900">Institute Fast Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => setActiveTab('enquiries')}
                    className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border border-blue-200"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Review Enquiries ({enquiries.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('attendance')}
                    className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border border-emerald-200"
                  >
                    <CalendarCheck2 className="w-4 h-4" />
                    <span>Mark Daily Attendance</span>
                  </button>

                  <button
                    onClick={() => { setRecordFeeModal(true); if (students.length > 0) setFeeStudentId(students[0].id); }}
                    className="p-3 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border border-amber-200"
                  >
                    <Receipt className="w-4 h-4" />
                    <span>Record Fee Payment</span>
                  </button>

                  <button
                    onClick={() => setUploadMaterialModal(true)}
                    className="p-3 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border border-purple-200"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload Study PDF</span>
                  </button>
                </div>
              </div>

              {/* Recent Enquiries Preview */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">Latest Admission Enquiries</h3>
                  <button onClick={() => setActiveTab('enquiries')} className="text-xs text-blue-700 font-bold hover:underline">
                    View Full CRM
                  </button>
                </div>

                <div className="space-y-3">
                  {enquiries.slice(0, 3).map(enq => (
                    <div key={enq.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-xs text-slate-900">{enq.studentName}</strong>
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded">
                            {enq.enquiryCode}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{enq.studentClass} ({enq.stream}) • Phone: {enq.phone}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {enq.status}
                        </span>
                        <button
                          onClick={() => onOpenEnquiryRoomDirect(enq.enquiryCode)}
                          className="px-3 py-1 bg-white hover:bg-blue-50 text-blue-700 border border-slate-200 rounded-lg text-xs font-bold transition"
                        >
                          Chat
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: ENQUIRIES CRM */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6">
              {/* Filter and Search */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by student name, code, phone..."
                    value={enquirySearch}
                    onChange={(e) => setEnquirySearch(e.target.value)}
                    className="w-full text-xs text-slate-900 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={enquiryStatusFilter}
                    onChange={(e) => setEnquiryStatusFilter(e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-800"
                  >
                    <option value="All">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Discussion">Discussion</option>
                    <option value="Interested">Interested</option>
                    <option value="Trial/Visit Scheduled">Trial/Visit Scheduled</option>
                    <option value="Admission Pending">Admission Pending</option>
                    <option value="Admitted">Admitted</option>
                  </select>
                </div>
              </div>

              {/* Enquiries CRM Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                        <th className="p-4">Enquiry ID</th>
                        <th className="p-4">Student & Parent</th>
                        <th className="p-4">Class & Stream</th>
                        <th className="p-4">Phone / Email</th>
                        <th className="p-4">Source</th>
                        <th className="p-4">Status Pipeline</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {enquiries
                        .filter(e => {
                          const matchesStatus = enquiryStatusFilter === 'All' || e.status === enquiryStatusFilter;
                          const matchesSearch = !enquirySearch.trim() ||
                            e.studentName.toLowerCase().includes(enquirySearch.toLowerCase()) ||
                            e.enquiryCode.toLowerCase().includes(enquirySearch.toLowerCase()) ||
                            e.phone.includes(enquirySearch);
                          return matchesStatus && matchesSearch;
                        })
                        .map(enq => (
                          <tr key={enq.id} className="hover:bg-slate-50/80">
                            <td className="p-4 font-mono font-bold text-blue-900">
                              {enq.enquiryCode}
                            </td>
                            <td className="p-4">
                              <strong className="text-slate-900 block">{enq.studentName}</strong>
                              <span className="text-[11px] text-slate-500">Parent: {enq.parentName}</span>
                            </td>
                            <td className="p-4">
                              <span className="font-semibold text-slate-800">{enq.studentClass} ({enq.stream})</span>
                              <span className="block text-[11px] text-slate-500">{enq.preferredBatch}</span>
                            </td>
                            <td className="p-4">
                              <a href={`tel:${enq.phone}`} className="text-blue-700 font-semibold hover:underline block">
                                {enq.phone}
                              </a>
                              <span className="text-[11px] text-slate-400">{enq.email}</span>
                            </td>
                            <td className="p-4 text-slate-600">
                              {enq.source}
                            </td>
                            <td className="p-4">
                              <select
                                value={enq.status}
                                onChange={(e) => handleUpdateEnquiryStatus(enq.id, e.target.value as any)}
                                className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:ring-2 focus:ring-amber-500 ${
                                  enq.status === 'Admitted'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : enq.status === 'New'
                                    ? 'bg-blue-50 text-blue-800 border-blue-300'
                                    : 'bg-amber-50 text-amber-800 border-amber-300'
                                }`}
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Discussion">Discussion</option>
                                <option value="Interested">Interested</option>
                                <option value="Trial/Visit Scheduled">Trial Scheduled</option>
                                <option value="Admission Pending">Admission Pending</option>
                                <option value="Admitted">Admitted</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => onOpenEnquiryRoomDirect(enq.enquiryCode)}
                                className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition inline-flex items-center gap-1 border border-blue-200"
                                title="Open Live Chat Room"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Chat</span>
                              </button>

                              {enq.status !== 'Admitted' && (
                                <button
                                  onClick={() => setConvertModalEnquiry(enq)}
                                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition inline-flex items-center gap-1 shadow-xs"
                                >
                                  <UserPlus className="w-3.5 h-3.5" />
                                  <span>Admit</span>
                                </button>
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

          {/* TAB: STUDENTS DIRECTORY */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-2 max-w-md w-full">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by student name or roll number..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full text-xs text-slate-900 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>

                <span className="text-xs font-bold text-slate-500">
                  Total Admitted Students: {students.length}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students
                  .filter(s => !studentSearch || s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.rollNumber.includes(studentSearch))
                  .map(st => {
                    const stBatch = batches.find(b => b.id === st.batchId);
                    return (
                      <div key={st.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={st.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                            alt={st.name}
                            className="w-12 h-12 rounded-full object-cover border border-slate-200"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="font-bold text-sm text-slate-900">{st.name}</h4>
                            <p className="text-xs text-blue-700 font-semibold">{st.studentClass} ({st.stream})</p>
                            <span className="text-[10px] font-mono text-slate-500 font-bold">ID: {st.studentId} • Roll #{st.rollNumber}</span>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
                          <p><strong>Batch:</strong> {stBatch?.name || 'Class 12 PCM Elite'}</p>
                          <p><strong>Parent:</strong> {st.parentName} ({st.parentPhone})</p>
                          <p><strong>Admission Date:</strong> {st.admissionDate}</p>
                          <p className="text-[11px] text-amber-800">
                            <strong>Portal Pass:</strong> <code className="font-mono">{st.temporaryPassword}</code>
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* TAB: BATCHES & COURSES */}
          {activeTab === 'batches' && (
            <div className="space-y-6">
              {/* Header & Add Batch Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Physical Batches & Fee Structure Management</h3>
                  <p className="text-xs text-slate-500">Create new offline campus batches, set monthly tuition fees, assign mentors & classrooms.</p>
                </div>
                <button
                  onClick={handleOpenCreateBatch}
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Batch</span>
                </button>
              </div>

              {/* Batches Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {batches.map(b => {
                  const bCourse = courses.find(c => c.id === b.courseId);
                  const bTeacher = teachers.find(t => t.id === b.teacherId);
                  return (
                    <div key={b.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4 relative flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono font-bold px-2.5 py-1 bg-blue-50 text-blue-800 rounded-lg border border-blue-200">
                            {bCourse?.classGrade || 'Class Batch'}
                          </span>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                            ₹{bCourse?.monthlyFee?.toLocaleString('en-IN') || '4,500'} / month
                          </span>
                        </div>

                        <h4 className="font-bold text-base text-slate-900">{b.name}</h4>

                        <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <p className="flex justify-between">
                            <span className="text-slate-400 font-semibold">Classroom:</span>
                            <span className="font-bold text-slate-800">{b.roomNo}</span>
                          </p>
                          <p className="flex justify-between">
                            <span className="text-slate-400 font-semibold">Timings:</span>
                            <span className="font-bold text-slate-800">{b.startTime} - {b.endTime}</span>
                          </p>
                          <p className="flex justify-between">
                            <span className="text-slate-400 font-semibold">Days:</span>
                            <span className="font-bold text-slate-800">{b.daysOfWeek.join(', ')}</span>
                          </p>
                          <p className="flex justify-between">
                            <span className="text-slate-400 font-semibold">Faculty Mentor:</span>
                            <span className="font-bold text-blue-900">{bTeacher?.name || 'Dr. Rajesh Sharma'}</span>
                          </p>
                          <p className="flex justify-between border-t border-slate-200 pt-1.5 mt-1.5">
                            <span className="text-slate-400 font-semibold">Enrolled Capacity:</span>
                            <span className="font-bold text-slate-900">{b.currentEnrolled} / {b.maxStudents} Seats</span>
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                        <button
                          onClick={() => handleOpenEditBatch(b)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Batch & Fee</span>
                        </button>
                        <button
                          onClick={() => handleDeleteBatch(b.id, b.name)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border border-red-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: FEE MANAGEMENT */}
          {activeTab === 'fees' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Fee Ledger & Payment Receipts</h3>
                  <p className="text-xs text-slate-500">Record cash, UPI, and bank transfer tuition payments.</p>
                </div>

                <button
                  onClick={() => { setRecordFeeModal(true); if (students.length > 0) setFeeStudentId(students[0].id); }}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Record New Fee Payment</span>
                </button>
              </div>

              {/* Fees Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                        <th className="p-4">Receipt #</th>
                        <th className="p-4">Student</th>
                        <th className="p-4">Installment</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Mode</th>
                        <th className="p-4">Date</th>
                        <th className="p-4 text-right">Receipt PDF</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {fees.map(f => {
                        const st = students.find(s => s.id === f.studentId);
                        return (
                          <tr key={f.id} className="hover:bg-slate-50">
                            <td className="p-4 font-mono font-bold text-blue-900">{f.receiptNumber}</td>
                            <td className="p-4 font-bold text-slate-900">{st?.name || 'Student'}</td>
                            <td className="p-4 text-slate-700">{f.installmentName}</td>
                            <td className="p-4 font-extrabold text-slate-900">₹{f.amount.toLocaleString('en-IN')}</td>
                            <td className="p-4 text-slate-600">{f.paymentMethod}</td>
                            <td className="p-4 text-slate-500">{f.paymentDate}</td>
                            <td className="p-4 text-right">
                              {st && (
                                <button
                                  onClick={() => generateFeeReceiptPdf(f, st, settings)}
                                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold text-xs inline-flex items-center gap-1 border border-blue-200"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>PDF Receipt</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: STUDY MATERIALS (FIREBASE FIRESTORE BACKEND) */}
          {activeTab === 'materials' && (
            <div className="space-y-6">
              {/* Header & Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900">Study Materials & Notes Repository</h3>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      <Flame className="w-3 h-3 text-amber-600 fill-amber-500" />
                      <span>Firebase Firestore</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Store and manage lecture PDFs, DPPs, and assignments hosted securely on Google Drive.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenAddMaterial}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Study Material</span>
                  </button>
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-[240px] max-w-md">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search by title, subject, or description..."
                    value={materialSearch}
                    onChange={(e) => setMaterialSearch(e.target.value)}
                    className="w-full text-xs text-slate-900 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Filter className="w-3.5 h-3.5" />
                    <span className="font-semibold">Filters:</span>
                  </div>

                  <select
                    value={materialClassFilter}
                    onChange={(e) => setMaterialClassFilter(e.target.value)}
                    className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
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

                  <select
                    value={materialSubjectFilter}
                    onChange={(e) => setMaterialSubjectFilter(e.target.value)}
                    className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                  >
                    <option value="All">All Subjects</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                    <option value="Science">Science</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="English">English</option>
                  </select>

                  <select
                    value={materialCategoryFilter}
                    onChange={(e) => setMaterialCategoryFilter(e.target.value)}
                    className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                  >
                    <option value="All">All Categories</option>
                    <option value="PDF Notes">PDF Notes</option>
                    <option value="DPP">DPP Worksheet</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Question Paper">Question Paper</option>
                    <option value="Formula Sheet">Formula Sheet</option>
                    <option value="Syllabus">Syllabus</option>
                    <option value="Sample Paper">Sample Paper</option>
                  </select>
                </div>
              </div>

              {/* Status Banner */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>
                    Firestore Realtime Sync active • <strong>{materials.length}</strong> total study materials stored in Firebase
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                  Collection: study_materials
                </span>
              </div>

              {/* Material Cards Grid */}
              {isLoadingMaterials ? (
                <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                  <p className="text-xs font-semibold">Loading study materials from Firebase Firestore...</p>
                </div>
              ) : materials.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
                  <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                  <h4 className="font-bold text-sm text-slate-800">No Study Materials Found</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Start by uploading your first lecture notes, DPP worksheet, or Google Drive link.
                  </p>
                  <button
                    onClick={handleOpenAddMaterial}
                    className="px-4 py-2 bg-blue-700 text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition"
                  >
                    Add Study Material
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {materials
                    .filter(m => {
                      const q = materialSearch.toLowerCase();
                      const matchSearch =
                        !materialSearch ||
                        m.title.toLowerCase().includes(q) ||
                        (m.subject && m.subject.toLowerCase().includes(q)) ||
                        (m.description && m.description.toLowerCase().includes(q)) ||
                        (m.classSemester && m.classSemester.toLowerCase().includes(q)) ||
                        (m.category && m.category.toLowerCase().includes(q));

                      const matchClass =
                        materialClassFilter === 'All' ||
                        m.classSemester === materialClassFilter ||
                        (!m.classSemester && materialClassFilter === 'Class 12');

                      const matchSubject =
                        materialSubjectFilter === 'All' || m.subject === materialSubjectFilter;

                      const matchCategory =
                        materialCategoryFilter === 'All' ||
                        m.category === materialCategoryFilter ||
                        m.type === materialCategoryFilter;

                      return matchSearch && matchClass && matchSubject && matchCategory;
                    })
                    .map(m => {
                      const effectiveUrl = m.driveUrl || m.fileUrl || '#';
                      const effectiveCategory = m.category || m.type || 'PDF Notes';
                      const effectiveClass = m.classSemester || 'Class 12';
                      const effectiveDate = m.date || m.uploadDate || '2026-08-14';

                      return (
                        <div
                          key={m.id}
                          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4"
                        >
                          <div className="space-y-3">
                            {/* Badges */}
                            <div className="flex flex-wrap items-center justify-between gap-1.5">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-mono">
                                  {m.subject || 'Physics'}
                                </span>
                                <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                                  {effectiveClass}
                                </span>
                              </div>
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md">
                                {effectiveCategory}
                              </span>
                            </div>

                            {/* Title & Description */}
                            <div>
                              <h4 className="font-bold text-sm text-slate-900 leading-snug">
                                {m.title}
                              </h4>
                              {m.description && (
                                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                  {m.description}
                                </p>
                              )}
                            </div>

                            {/* Date & Drive info */}
                            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-50">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {effectiveDate}
                              </span>
                              <span className="flex items-center gap-1 text-slate-600 font-mono text-[10px]">
                                <Link2 className="w-3 h-3 text-blue-600" />
                                Google Drive
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                            <a
                              href={effectiveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition shadow-2xs shrink-0"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Open Material</span>
                            </a>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleOpenQuickDriveUrl(m)}
                                title="Update Google Drive link"
                                className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                              >
                                <Link2 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleOpenEditMaterial(m)}
                                title="Edit Material details"
                                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleOpenDeleteMaterial(m)}
                                title="Delete Material"
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* TAB: NOTICES */}
          {activeTab === 'notices' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Institute Notice Board Broadcasts</h3>
                  <p className="text-xs text-slate-500">Announce exam dates, holidays, and admissions updates.</p>
                </div>

                <button
                  onClick={() => setNewNoticeModal(true)}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Broadcast New Notice</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notices.map(n => (
                  <div key={n.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{n.publishDate}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-800 rounded">
                        Audience: {n.targetAudience}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900">{n.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{n.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: WEBSITE CMS & SEO SETTINGS */}
          {activeTab === 'cms' && (
            <div className="space-y-6 max-w-4xl">
              {/* Header */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Website CMS & SEO Control Panel</h3>
                  <p className="text-xs text-slate-500">Manage institute branding, logo details, campus info, and search engine SEO metadata.</p>
                </div>
                <button
                  onClick={() => {
                    storage.updateSettings(settings);
                    storage.updateSEOSettings(seoSettings);
                    alert('All Website CMS Branding & SEO settings updated successfully!');
                  }}
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Save All CMS & SEO Changes</span>
                </button>
              </div>

              {/* Section 1: Logo & Brand Settings */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span>Institute Branding & Logo Name</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">Configure Institute full name, tagline, and logo URLs.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Institute Full Name</label>
                    <input
                      type="text"
                      value={settings.instituteName}
                      onChange={(e) => {
                        const updated = { ...settings, instituteName: e.target.value };
                        setSettings(updated);
                        storage.updateSettings(updated);
                      }}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Institute Tagline / Subtitle</label>
                    <input
                      type="text"
                      value={settings.heroSubtitle}
                      onChange={(e) => {
                        const updated = { ...settings, heroSubtitle: e.target.value };
                        setSettings(updated);
                        storage.updateSettings(updated);
                      }}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Light Theme Logo URL / Path</label>
                    <input
                      type="text"
                      value={settings.lightLogo}
                      onChange={(e) => {
                        const updated = { ...settings, lightLogo: e.target.value };
                        setSettings(updated);
                        storage.updateSettings(updated);
                      }}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Dark Theme Logo URL / Path</label>
                    <input
                      type="text"
                      value={settings.darkLogo}
                      onChange={(e) => {
                        const updated = { ...settings, darkLogo: e.target.value };
                        setSettings(updated);
                        storage.updateSettings(updated);
                      }}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Admin Security & Password Change */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <span>Admin Security & Login Credentials</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">Update your Admin Username / Email and Master Security Password.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Admin Username / Email
                    </label>
                    <input
                      type="text"
                      value={adminUser}
                      onChange={(e) => setAdminUser(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Admin Master Password
                    </label>
                    <input
                      type="text"
                      value={adminPass}
                      onChange={(e) => setAdminPass(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (!adminUser.trim() || !adminPass.trim()) {
                        alert('Username and password cannot be empty.');
                        return;
                      }
                      storage.updateAdminCredentials(adminUser.trim(), adminPass.trim());
                      alert(`Admin credentials updated! New Username: "${adminUser.trim()}", Password: "${adminPass.trim()}"`);
                    }}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save New Admin ID & Password</span>
                  </button>
                </div>
              </div>

              {/* Section 2: Contact Info & Address */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span>Campus Location & Contact Info</span>
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Primary Phone</label>
                    <input
                      type="text"
                      value={settings.phone}
                      onChange={(e) => {
                        const updated = { ...settings, phone: e.target.value };
                        setSettings(updated);
                        storage.updateSettings(updated);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => {
                        const updated = { ...settings, email: e.target.value };
                        setSettings(updated);
                        storage.updateSettings(updated);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Office Hours</label>
                    <input
                      type="text"
                      value={settings.officeHours}
                      onChange={(e) => {
                        const updated = { ...settings, officeHours: e.target.value };
                        setSettings(updated);
                        storage.updateSettings(updated);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Physical Campus Address</label>
                    <input
                      type="text"
                      value={settings.address}
                      onChange={(e) => {
                        const updated = { ...settings, address: e.target.value };
                        setSettings(updated);
                        storage.updateSettings(updated);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Govt Reg Number</label>
                    <input
                      type="text"
                      value={settings.regNumber}
                      onChange={(e) => {
                        const updated = { ...settings, regNumber: e.target.value };
                        setSettings(updated);
                        storage.updateSettings(updated);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Full Search Engine SEO Settings */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Search className="w-4 h-4 text-amber-600" />
                    <span>Search Engine SEO Metadata</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">Configure Meta Title, Description, Search Keywords, Canonical URL & Social Cards.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      SEO Meta Title <span className="text-slate-400 font-normal">(Appears on Google Search results)</span>
                    </label>
                    <input
                      type="text"
                      value={seoSettings.metaTitle}
                      onChange={(e) => {
                        const updated = { ...seoSettings, metaTitle: e.target.value };
                        setSeoSettings(updated);
                        storage.updateSEOSettings(updated);
                      }}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      SEO Meta Description
                    </label>
                    <textarea
                      rows={2}
                      value={seoSettings.metaDescription}
                      onChange={(e) => {
                        const updated = { ...seoSettings, metaDescription: e.target.value };
                        setSeoSettings(updated);
                        storage.updateSEOSettings(updated);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      Target Search Keywords <span className="text-slate-400 font-normal">(Comma separated)</span>
                    </label>
                    <input
                      type="text"
                      value={seoSettings.keywords}
                      onChange={(e) => {
                        const updated = { ...seoSettings, keywords: e.target.value };
                        setSeoSettings(updated);
                        storage.updateSEOSettings(updated);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Canonical Web URL</label>
                    <input
                      type="text"
                      value={seoSettings.canonicalUrl}
                      onChange={(e) => {
                        const updated = { ...seoSettings, canonicalUrl: e.target.value };
                        setSeoSettings(updated);
                        storage.updateSEOSettings(updated);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Robots Indexing Directive</label>
                    <input
                      type="text"
                      value={seoSettings.robots}
                      onChange={(e) => {
                        const updated = { ...seoSettings, robots: e.target.value };
                        setSeoSettings(updated);
                        storage.updateSEOSettings(updated);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Social Share OG Title</label>
                    <input
                      type="text"
                      value={seoSettings.ogTitle}
                      onChange={(e) => {
                        const updated = { ...seoSettings, ogTitle: e.target.value };
                        setSeoSettings(updated);
                        storage.updateSEOSettings(updated);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Social Share OG Image URL</label>
                    <input
                      type="text"
                      value={seoSettings.ogImageUrl}
                      onChange={(e) => {
                        const updated = { ...seoSettings, ogImageUrl: e.target.value };
                        setSeoSettings(updated);
                        storage.updateSEOSettings(updated);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: FIREBASE CLOUD BACKEND & FIRESTORE */}
          {activeTab === 'firebase' && (
            <div className="space-y-6">
              {/* Header & Status Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shadow-2xs">
                      <Flame className="w-6 h-6 fill-amber-500 text-amber-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-slate-900">Firebase Firestore & Cloud Backend</h3>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Connected Live</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Persistent cloud database, document security rules, real-time snapshot listeners & FCM notifications.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleTestFirestoreConnection}
                      disabled={isTestingFirestore}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isTestingFirestore ? 'animate-spin' : ''}`} />
                      <span>{isTestingFirestore ? 'Testing Ping...' : 'Test Firestore Ping'}</span>
                    </button>

                    <button
                      onClick={async () => {
                        const token = await initFCM();
                        if (token) {
                          alert(`Firebase Cloud Messaging initialized! Device token ready for push broadcasts.`);
                        } else {
                          alert('Push notifications permission requested / verified.');
                        }
                      }}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Bell className="w-3.5 h-3.5 text-blue-600" />
                      <span>Test Push Notification</span>
                    </button>
                  </div>
                </div>

                {firestoreTestResult && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium">{firestoreTestResult}</span>
                  </div>
                )}

                {/* Cloud Config Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Firebase Project ID</span>
                    <p className="text-xs font-mono font-bold text-slate-800 truncate">{firebaseConfig.projectId}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Firestore Database ID</span>
                    <p className="text-xs font-mono font-bold text-slate-800 truncate">{(firebaseConfig as any).firestoreDatabaseId || '(default)'}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Auth & Rules</span>
                    <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Anonymous & Admin Rules</span>
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Live Materials Stored</span>
                    <p className="text-xs font-bold text-blue-700">{materials.length} Documents Synced</p>
                  </div>
                </div>
              </div>

              {/* Blueprint & Security Rules Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Security Rules */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Firestore Security Rules</h4>
                      <p className="text-[11px] text-slate-500">Document access rules (firestore.rules)</p>
                    </div>
                    <button
                      onClick={handleCopyRules}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
                    >
                      {rulesCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{rulesCopied ? 'Copied' : 'Copy Rules'}</span>
                    </button>
                  </div>

                  <pre className="p-3.5 bg-slate-950 text-amber-300 font-mono text-xs rounded-xl overflow-x-auto max-h-72 border border-slate-800">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /study_materials/{materialId} {
      allow read, write: if true;
    }
  }
}`}
                  </pre>
                </div>

                {/* Blueprint Schema */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Firebase Blueprint Schema (IR)</h4>
                      <p className="text-[11px] text-slate-500">Declarative entity mapping (firebase-blueprint.json)</p>
                    </div>
                    <button
                      onClick={handleCopyBlueprint}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
                    >
                      {blueprintCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{blueprintCopied ? 'Copied' : 'Copy Schema'}</span>
                    </button>
                  </div>

                  <pre className="p-3.5 bg-slate-950 text-cyan-300 font-mono text-[11px] rounded-xl overflow-x-auto max-h-72 border border-slate-800">
{`{
  "entities": {
    "StudyMaterial": {
      "title": "StudyMaterial",
      "description": "Educational study materials, lecture notes, DPPs, and assignments hosted on Google Drive",
      "type": "object",
      "properties": {
        "title": { "type": "string" },
        "subject": { "type": "string" },
        "description": { "type": "string" },
        "classSemester": { "type": "string" },
        "category": { "type": "string" },
        "driveUrl": { "type": "string" },
        "date": { "type": "string" }
      },
      "required": ["title", "subject", "classSemester", "category", "driveUrl", "date"]
    }
  },
  "firestore": {
    "study_materials": {
      "entity": "StudyMaterial",
      "description": "Collection of all study materials hosted on Google Drive"
    }
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* CONVERT TO STUDENT MODAL */}
      {convertModalEnquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                Confirm Admission: {convertModalEnquiry.studentName}
              </h3>
              <button onClick={() => setConvertModalEnquiry(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConvertEnquiry} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Assign Course</label>
                <select
                  value={convertCourseId}
                  onChange={(e) => setConvertCourseId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.classGrade})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assign Physical Batch</label>
                <select
                  value={convertBatchId}
                  onChange={(e) => setConvertBatchId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>{b.name} ({b.roomNo})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class Roll Number</label>
                  <input
                    type="text"
                    required
                    value={convertRollNo}
                    onChange={(e) => setConvertRollNo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Fee Paid (₹)</label>
                  <input
                    type="number"
                    value={convertInitialFee}
                    onChange={(e) => setConvertInitialFee(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition"
              >
                Complete Admission & Generate Student Credentials
              </button>
            </form>
          </div>
        </div>
      )}

      {/* RECORD FEE MODAL */}
      {recordFeeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Record Fee Payment</h3>
              <button onClick={() => setRecordFeeModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordFee} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Student</label>
                <select
                  value={feeStudentId}
                  onChange={(e) => setFeeStudentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.rollNumber})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Fee Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={feeAmount}
                  onChange={(e) => setFeeAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Installment Description</label>
                <input
                  type="text"
                  required
                  value={feeInstallment}
                  onChange={(e) => setFeeInstallment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={feeMethod}
                  onChange={(e) => setFeeMethod(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="UPI">UPI / QR Code</option>
                  <option value="Cash">Cash at Campus Desk</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                  <option value="Card">Debit / Credit Card</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold shadow-xs transition"
              >
                Record Payment & Issue Receipt
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD STUDY MATERIAL MODAL (FIREBASE FIRESTORE) */}
      {uploadMaterialModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Add Study Material</h3>
                  <p className="text-[11px] text-slate-500">Stored directly in Firebase Firestore</p>
                </div>
              </div>
              <button
                onClick={() => setUploadMaterialModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewMaterial} className="space-y-4 text-xs">
              {/* Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Material Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 01: Electrostatics & Gauss Theorem Comprehensive Notes"
                  value={matTitle}
                  onChange={(e) => setMatTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none text-slate-900"
                />
              </div>

              {/* Subject & Class / Semester */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={matSubject}
                    onChange={(e) => setMatSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                    <option value="Science">Science (General)</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="English">English</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Class / Semester <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={matClassSemester}
                    onChange={(e) => setMatClassSemester(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
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

              {/* Category & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={matCategory}
                    onChange={(e) => setMatCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    <option value="PDF Notes">PDF Notes</option>
                    <option value="DPP">DPP Worksheet</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Question Paper">Question Paper</option>
                    <option value="Formula Sheet">Formula Sheet</option>
                    <option value="Syllabus">Syllabus</option>
                    <option value="Sample Paper">Sample Paper</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={matDate}
                    onChange={(e) => setMatDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Google Drive URL */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Google Drive URL <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    required
                    placeholder="https://drive.google.com/file/d/... or uploaded cloud URL"
                    value={matDriveUrl}
                    onChange={(e) => setMatDriveUrl(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono text-[11px]"
                  />
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <label className="cursor-pointer px-3 py-1.5 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload PDF / File to Firebase Cloud</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="application/pdf,image/*,.doc,.docx,.ppt,.pptx"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            setIsSubmittingMaterial(true);
                            const url = await firebaseCloudStorage.uploadFile(file, 'study_materials');
                            setMatDriveUrl(url);
                            alert(`File "${file.name}" uploaded successfully to Firebase Cloud Storage!`);
                          } catch (err: any) {
                            alert(`Cloud Upload Note: ${err.message || err}`);
                          } finally {
                            setIsSubmittingMaterial(false);
                          }
                        }
                      }}
                    />
                  </label>
                  <p className="text-[10px] text-slate-400">
                    Paste Google Drive link or upload direct file.
                  </p>
                </div>
              </div>

              {/* Description (Optional) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Description <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Key topics covered, homework instructions, or submission deadline..."
                  value={matDescription}
                  onChange={(e) => setMatDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUploadMaterialModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingMaterial}
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-xl font-bold shadow-xs transition flex items-center gap-2"
                >
                  {isSubmittingMaterial ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to Firestore...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Publish & Save to Firestore</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STUDY MATERIAL MODAL (FIREBASE FIRESTORE) */}
      {editMaterialModal && editingMaterial && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Edit Study Material</h3>
                  <p className="text-[11px] text-slate-500">Update metadata & Google Drive link in Firestore</p>
                </div>
              </div>
              <button
                onClick={() => setEditMaterialModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditMaterial} className="space-y-4 text-xs">
              {/* Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Material Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={matTitle}
                  onChange={(e) => setMatTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none text-slate-900"
                />
              </div>

              {/* Subject & Class / Semester */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={matSubject}
                    onChange={(e) => setMatSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                    <option value="Science">Science (General)</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="English">English</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Class / Semester <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={matClassSemester}
                    onChange={(e) => setMatClassSemester(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
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

              {/* Category & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={matCategory}
                    onChange={(e) => setMatCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    <option value="PDF Notes">PDF Notes</option>
                    <option value="DPP">DPP Worksheet</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Question Paper">Question Paper</option>
                    <option value="Formula Sheet">Formula Sheet</option>
                    <option value="Syllabus">Syllabus</option>
                    <option value="Sample Paper">Sample Paper</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={matDate}
                    onChange={(e) => setMatDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Google Drive URL */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Google Drive URL <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    required
                    value={matDriveUrl}
                    onChange={(e) => setMatDriveUrl(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Description (Optional) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Description <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={matDescription}
                  onChange={(e) => setMatDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditMaterialModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingMaterial}
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-xl font-bold shadow-xs transition flex items-center gap-2"
                >
                  {isSubmittingMaterial ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating Firestore...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK UPDATE GOOGLE DRIVE LINK MODAL */}
      {updateDriveUrlModal && quickDriveMaterial && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
                  <Link2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Update Google Drive URL</h3>
                  <p className="text-[11px] text-slate-500">{quickDriveMaterial.title}</p>
                </div>
              </div>
              <button
                onClick={() => setUpdateDriveUrlModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickDriveUrl} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Google Drive Link <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/file/d/..."
                  value={quickDriveUrl}
                  onChange={(e) => setQuickDriveUrl(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono text-[11px]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUpdateDriveUrlModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingMaterial}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-xl font-bold shadow-xs transition flex items-center gap-2"
                >
                  {isSubmittingMaterial ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Update Link in Firestore</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteMaterialModal && deletingMaterial && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2.5 bg-red-50 rounded-2xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Delete Study Material?</h3>
                <p className="text-xs text-slate-500">This will remove it from Firebase Firestore.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 font-medium">
              <p className="font-bold text-slate-900">{deletingMaterial.title}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {deletingMaterial.subject} • {deletingMaterial.classSemester || 'Class 12'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => setDeleteMaterialModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmittingMaterial}
                onClick={handleConfirmDeleteMaterial}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-xs transition flex items-center gap-1.5"
              >
                {isSubmittingMaterial ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT BATCH MODAL */}
      {createBatchModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {editingBatch ? `Edit Batch: ${editingBatch.name}` : 'Create New Physical Batch'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Configure classroom, timings, mentor & tuition fees</p>
                </div>
              </div>
              <button onClick={() => setCreateBatchModal(false)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBatch} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Batch Title / Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 12 Physics - Target Morning Batch"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Associated Course <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={batchCourseId}
                    onChange={(e) => setBatchCourseId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.classGrade})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Faculty Mentor
                  </label>
                  <select
                    value={batchTeacherId}
                    onChange={(e) => setBatchTeacherId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.subject})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Classroom / Room No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hall 2 (Physical Classroom)"
                    value={batchRoomNo}
                    onChange={(e) => setBatchRoomNo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Monthly Tuition Fee (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={batchMonthlyFee}
                    onChange={(e) => setBatchMonthlyFee(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Days of Week</label>
                  <input
                    type="text"
                    required
                    placeholder="Mon, Wed, Fri"
                    value={batchDays}
                    onChange={(e) => setBatchDays(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={batchStartTime}
                    onChange={(e) => setBatchStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={batchEndTime}
                    onChange={(e) => setBatchEndTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Max Student Seat Capacity</label>
                <input
                  type="number"
                  required
                  value={batchMaxStudents}
                  onChange={(e) => setBatchMaxStudents(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateBatchModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-xs transition flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingBatch ? 'Update Batch & Fees' : 'Create Physical Batch'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BROADCAST NOTICE MODAL */}
      {newNoticeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Broadcast Notice / Circular</h3>
              <button onClick={() => setNewNoticeModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostNotice} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Independence Day Holiday Schedule"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description / Content</label>
                <textarea
                  rows={3}
                  required
                  value={noticeDesc}
                  onChange={(e) => setNoticeDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Audience</label>
                  <select
                    value={noticeAudience}
                    onChange={(e) => setNoticeAudience(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="All">All Portals</option>
                    <option value="Student">Students Only</option>
                    <option value="Public">Public Only</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={noticePriority}
                    onChange={(e) => setNoticePriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Medium">Medium</option>
                    <option value="High">High (Red Alert)</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold shadow-xs transition"
              >
                Broadcast Notice
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
