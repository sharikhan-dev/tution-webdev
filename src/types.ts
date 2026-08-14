export type UserRole = 'admin' | 'teacher' | 'student' | 'visitor';

export type EnquiryStatus = 
  | 'New'
  | 'Contacted'
  | 'Discussion'
  | 'Interested'
  | 'Trial/Visit Scheduled'
  | 'Admission Pending'
  | 'Admitted'
  | 'Rejected'
  | 'Closed';

export interface Enquiry {
  id: string;
  enquiryCode: string; // e.g. TUI-48291
  studentName: string;
  parentName: string;
  phone: string;
  email: string;
  studentClass: string; // e.g. "Class 10", "Class 12"
  stream?: string; // "PCM", "PCB", "Commerce", "General"
  subjects: string[]; // ["Physics", "Mathematics"]
  preferredBatch: string; // "Morning 07:00 AM", "Evening 05:00 PM"
  message?: string;
  previousPercentage?: number;
  source: string; // "Google Search", "Friend / Word of Mouth", "Flyer / Banner", "Social Media"
  status: EnquiryStatus;
  assignedTeacherId?: string;
  internalNotes?: string;
  verificationCode: string; // 4-6 digit pin/code for secure chat room access
  admittedStudentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnquiryMessage {
  id: string;
  enquiryId: string;
  senderRole: 'admin' | 'teacher' | 'visitor';
  senderName: string;
  message: string;
  attachmentName?: string;
  attachmentUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Student {
  id: string;
  studentId: string; // e.g. APX-2026-104
  name: string;
  parentName: string;
  phone: string;
  email: string;
  avatarUrl?: string;
  studentClass: string;
  stream?: string;
  courseId: string;
  batchId: string;
  admissionDate: string;
  monthlyFee: number;
  status: 'active' | 'suspended' | 'alumni';
  rollNo: string;
  rollNumber?: string;
  emergencyContact: string;
  address?: string;
  temporaryPassword?: string;
  mustChangePassword?: boolean;
  isTemporaryPassword?: boolean;
  subjects?: string[];
  totalFee?: number;
  paidFee?: number;
  admissionFee?: number;
  createdAt: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  qualification: string;
  experienceYears: number;
  subjects: string[];
  photoUrl: string;
  bio: string;
  rating?: number;
  status: 'active' | 'inactive';
}

export interface Course {
  id: string;
  name: string;
  code: string;
  classGrade: string;
  stream: string;
  description: string;
  monthlyFee: number;
  admissionFee: number;
  totalSubjects: number;
  durationMonths: number;
  bannerUrl?: string;
  isActive: boolean;
  highlights: string[];
}

export interface Subject {
  id: string;
  name: string;
  courseId: string;
  code: string;
  icon?: string;
  teacherId?: string;
}

export interface Batch {
  id: string;
  name: string; // e.g. "Class 12 PCM - Elite Morning"
  courseId: string;
  teacherId?: string;
  roomNo: string; // "Hall 2 (Physical Classroom)"
  daysOfWeek: string[]; // ["Mon", "Wed", "Fri"]
  startTime: string; // "17:00"
  endTime: string; // "19:00"
  maxStudents: number;
  currentEnrolled: number;
  isActive: boolean;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  batchId: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  remarks?: string;
  markedBy: string;
}

export type PaymentMode = 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque' | 'Card';

export interface FeePayment {
  id: string;
  receiptNo: string; // e.g. REC-2026-0812
  receiptNumber?: string;
  studentId: string;
  feeMonth?: string; // "August 2026"
  installmentName?: string;
  amount: number;
  paymentDate: string;
  paymentMode: PaymentMode | string;
  method?: string;
  transactionRef?: string;
  previousDue?: number;
  remainingBalance?: number;
  notes?: string;
  status?: 'Paid' | 'Pending' | 'Overdue';
  receiptUrl?: string;
  collectedBy?: string;
  createdAt: string;
}

export type MaterialType = 
  | 'PDF Notes'
  | 'Chapter Notes'
  | 'Assignment'
  | 'Homework'
  | 'Question Paper'
  | 'Practice Sheet'
  | 'Sample Paper'
  | 'Syllabus'
  | 'Important Questions'
  | 'DPP'
  | 'Formula Sheet'
  | string;

export interface StudyMaterial {
  id: string;
  title: string;
  subject?: string;
  description?: string;
  classSemester?: string; // e.g. "Class 12", "Class 11", "Class 10", "Semester 1"
  category?: string; // e.g. "PDF Notes", "Assignment", "DPP", "Question Paper", "Formula Sheet"
  driveUrl?: string; // Google Drive link
  date?: string; // YYYY-MM-DD
  courseId?: string;
  batchId?: string;
  subjectId?: string;
  chapter?: string;
  type?: string;
  materialType?: MaterialType;
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  uploadDate?: string;
  isPublished?: boolean;
  publishedAt?: string;
  downloadCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Test {
  id: string;
  title: string; // e.g. "Electrostatics & Gauss Law Test 1"
  batchId: string;
  subjectId: string;
  testDate: string;
  maxMarks: number;
  passMarks: number;
  chapterTopics: string;
  isPublished: boolean;
}

export interface TestResult {
  id: string;
  testId: string;
  studentId: string;
  marksObtained: number;
  percentage: number;
  rank?: number;
  teacherRemarks?: string;
  createdAt: string;
}

export type TestRecord = TestResult & {
  testTitle?: string;
  title?: string;
  maxMarks?: number;
  totalMarks?: number;
  score?: number;
  testDate?: string;
  date?: string;
  subject?: string;
  topic?: string;
  highestMarks?: number;
  averageMarks?: number;
};

export interface StudentProgress {
  id: string;
  studentId: string;
  courseId: string;
  subjectId: string;
  progressPercentage: number;
  currentTopic: string;
  completedTopics: string[];
  teacherRemarks: string;
  updatedAt: string;
}

export type ProgressReport = StudentProgress & {
  overallPercentage?: number;
  attendanceRate?: number;
  averageTestScore?: number;
  ranking?: string;
  strengths?: string[];
  improvements?: string[];
  mentorNotes?: string;
};

export type NoticeType = 'Holiday' | 'Test' | 'PTM' | 'Fee Reminder' | 'Announcement' | 'Material' | 'Circular' | string;
export type NoticePriority = 'High' | 'Medium' | 'Low';

export interface Notice {
  id: string;
  title: string;
  description: string;
  type: NoticeType;
  priority: NoticePriority;
  targetAudience: 'All' | 'Public' | 'Students' | 'Specific Batch';
  batchId?: string;
  publishDate: string;
  expiryDate?: string;
  isActive: boolean;
}

export interface InAppNotification {
  id: string;
  recipientType: 'admin' | 'student' | 'enquiry';
  recipientId?: string; // studentId or enquiryCode or 'admin'
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  type: 'enquiry' | 'message' | 'material' | 'fee' | 'test' | 'notice' | 'system';
  createdAt: string;
}

export interface WebsiteSettings {
  instituteName: string;
  tagline: string;
  foundedYear: string;
  phone: string;
  altPhone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  officeHours: string;
  regNumber: string;
  lightLogo: string;
  darkLogo: string;
  favicon: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  primaryColor: string;
  stats: {
    studentsTaught: string;
    successRate: string;
    expertFaculty: string;
    topRanks: string;
    batchSizeLimit: string;
  };
  results: Array<{
    id: string;
    studentName: string;
    exam: string;
    scoreRank: string;
    college: string;
    year: string;
    photoUrl: string;
  }>;
  testimonials: Array<{
    id: string;
    name: string;
    role: string; // e.g. "Parent of Rohan (Class 12 PCM)"
    text: string;
    rating: number;
    avatarUrl: string;
    achievement: string;
  }>;
  gallery: Array<{
    id: string;
    title: string;
    category: 'Classrooms' | 'Library & Doubt Hall' | 'Felicitation' | 'Faculty';
    imageUrl: string;
  }>;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    maps?: string;
    whatsapp?: string;
  };
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalUrl: string;
  robots: string;
  author: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
}
