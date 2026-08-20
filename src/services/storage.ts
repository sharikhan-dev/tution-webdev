import {
  Enquiry,
  EnquiryMessage,
  Student,
  Teacher,
  Course,
  Batch,
  Subject,
  AttendanceRecord,
  FeePayment,
  StudyMaterial,
  Test,
  TestResult,
  StudentProgress,
  Notice,
  InAppNotification,
  WebsiteSettings,
  SEOSettings,
  EnquiryStatus,
} from '../types';

const STORAGE_KEYS = {
  ENQUIRIES: 'apex_enquiries_v1',
  ENQUIRY_MESSAGES: 'apex_enquiry_messages_v1',
  STUDENTS: 'apex_students_v1',
  TEACHERS: 'apex_teachers_v1',
  COURSES: 'apex_courses_v1',
  BATCHES: 'apex_batches_v1',
  SUBJECTS: 'apex_subjects_v1',
  ATTENDANCE: 'apex_attendance_v1',
  FEE_PAYMENTS: 'apex_fee_payments_v1',
  STUDY_MATERIALS: 'apex_study_materials_v1',
  TESTS: 'apex_tests_v1',
  TEST_RESULTS: 'apex_test_results_v1',
  STUDENT_PROGRESS: 'apex_student_progress_v1',
  NOTICES: 'apex_notices_v1',
  NOTIFICATIONS: 'apex_notifications_v1',
  WEBSITE_SETTINGS: 'apex_website_settings_v1',
  SEO_SETTINGS: 'apex_seo_settings_v1',
  PUSH_TOKEN: 'apex_push_token_v1',
};

// Initial Realistic Seed Data
const SEED_TEACHERS: Teacher[] = [
  {
    id: 't-1',
    name: 'Dr. Rajesh Sharma',
    email: 'rajesh.sharma@apexacademy.edu',
    phone: '+91 98234 56789',
    designation: 'Founder & Senior Physics Faculty',
    qualification: 'Ph.D. in Physics, Ex-HOD Kota Institute',
    experienceYears: 18,
    subjects: ['Physics (Class 11-12)', 'JEE/NEET Mechanics & Electrodynamics'],
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bio: 'Dedicated physical classroom educator with 18+ years mentoring over 4,500 students to top ranks in CBSE Boards, JEE Advanced, and NEET.',
    rating: 4.9,
    status: 'active',
  },
  {
    id: 't-2',
    name: 'Mrs. Ananya Sen',
    email: 'ananya.sen@apexacademy.edu',
    phone: '+91 98234 56790',
    designation: 'Senior Mathematics Mentor',
    qualification: 'M.Sc. Applied Mathematics (Gold Medalist)',
    experienceYears: 14,
    subjects: ['Mathematics (Class 10-12)', 'Calculus & Coordinate Geometry'],
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    bio: 'Known for simplifying complex calculus and vector 3D concepts through interactive physical chalkboard demonstrations and rigorous daily practice.',
    rating: 4.9,
    status: 'active',
  },
  {
    id: 't-3',
    name: 'Dr. Vikram Malhotra',
    email: 'vikram.malhotra@apexacademy.edu',
    phone: '+91 98234 56791',
    designation: 'Head of Chemistry Faculty',
    qualification: 'M.Sc., Ph.D. Organic Chemistry',
    experienceYears: 12,
    subjects: ['Chemistry (Class 11-12)', 'Organic Reaction Mechanisms'],
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    bio: 'Specialist in reaction mechanisms, chemical kinetics, and classroom laboratory demonstration techniques that boost retention.',
    rating: 4.8,
    status: 'active',
  },
  {
    id: 't-4',
    name: 'Dr. Priya Varma',
    email: 'priya.varma@apexacademy.edu',
    phone: '+91 98234 56792',
    designation: 'Senior Biology Specialist',
    qualification: 'M.B.B.S., M.Sc. Human Physiology',
    experienceYears: 10,
    subjects: ['Biology (Class 11-12)', 'Human Physiology & Genetics'],
    photoUrl: 'https://images.unsplash.com/photo-1594824813590-410a520e53a3?w=400&auto=format&fit=crop&q=80',
    bio: 'Passionate classroom mentor guiding medical aspirants through NCERT line-by-line breakdown and structural diagram training.',
    rating: 4.9,
    status: 'active',
  },
];

const SEED_COURSES: Course[] = [
  {
    id: 'c-1',
    name: 'Class 12 PCM Elite Coaching',
    code: 'PCM-12',
    classGrade: 'Class 12',
    stream: 'PCM',
    description: 'Intensive offline physical classroom batch covering Physics, Chemistry, and Mathematics for CBSE Boards + JEE Main foundation with weekly chapter tests.',
    monthlyFee: 4500,
    admissionFee: 1500,
    totalSubjects: 3,
    durationMonths: 10,
    bannerUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80',
    isActive: true,
    highlights: [
      'Small batch of 25 students strictly',
      'Daily 2-hour physical classroom sessions',
      'Dedicated Doubt Clearing Counter (4 PM - 7 PM)',
      'Printed Chapter Workbooks & Test Series',
      'Regular Parent-Teacher Performance Review Meetings',
    ],
  },
  {
    id: 'c-2',
    name: 'Class 12 PCB Medical Target',
    code: 'PCB-12',
    classGrade: 'Class 12',
    stream: 'PCB',
    description: 'Comprehensive offline classroom tuition covering Physics, Chemistry, and Biology with deep NCERT line-by-line focus and OMR-based test practice.',
    monthlyFee: 4500,
    admissionFee: 1500,
    totalSubjects: 3,
    durationMonths: 10,
    bannerUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
    isActive: true,
    highlights: [
      '30-student physical classroom cap',
      'NCERT diagram training & memory mapping',
      'Weekly Sunday 180-min full length mock tests',
      'Physical specimen and model demonstrations',
    ],
  },
  {
    id: 'c-3',
    name: 'Class 11 PCM Foundation Batch',
    code: 'PCM-11',
    classGrade: 'Class 11',
    stream: 'PCM',
    description: 'Bridging the Class 10 to 11 transition with deep conceptual clarity, rigorous derivation practice, and numerical problem solving.',
    monthlyFee: 4000,
    admissionFee: 1500,
    totalSubjects: 3,
    durationMonths: 11,
    bannerUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
    isActive: true,
    highlights: [
      'Concept fundamentals from grassroot level',
      'Vector & Calculus mathematical toolkits',
      'Daily homework tracking & parent SMS alerts',
    ],
  },
  {
    id: 'c-4',
    name: 'Class 10 Science & Maths Super 30',
    code: 'SM-10',
    classGrade: 'Class 10',
    stream: 'General',
    description: 'High-focus offline classroom batch designed to secure 95%+ in Class 10 Board Examinations for Mathematics and Integrated Science.',
    monthlyFee: 3200,
    admissionFee: 1000,
    totalSubjects: 2,
    durationMonths: 10,
    bannerUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&auto=format&fit=crop&q=80',
    isActive: true,
    highlights: [
      'Chapter-wise PYQ (Past 10 Years Questions) drills',
      'Answer writing presentation masterclasses',
      'Monthly scholarship tests',
    ],
  },
];

const SEED_BATCHES: Batch[] = [
  {
    id: 'b-1',
    name: 'Class 12 PCM - Morning Elite (Batch A)',
    courseId: 'c-1',
    teacherId: 't-1',
    roomNo: 'Classroom Hall 1 (Ground Floor)',
    daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    startTime: '06:45 AM',
    endTime: '08:45 AM',
    maxStudents: 28,
    currentEnrolled: 22,
    isActive: true,
  },
  {
    id: 'b-2',
    name: 'Class 12 PCM - Evening Focus (Batch B)',
    courseId: 'c-1',
    teacherId: 't-1',
    roomNo: 'Classroom Hall 1 (Ground Floor)',
    daysOfWeek: ['Mon', 'Wed', 'Fri', 'Sat'],
    startTime: '05:00 PM',
    endTime: '07:30 PM',
    maxStudents: 28,
    currentEnrolled: 25,
    isActive: true,
  },
  {
    id: 'b-3',
    name: 'Class 12 PCB - Medical Morning',
    courseId: 'c-2',
    teacherId: 't-4',
    roomNo: 'Classroom Hall 2 (First Floor)',
    daysOfWeek: ['Mon', 'Wed', 'Fri', 'Sat'],
    startTime: '07:00 AM',
    endTime: '09:00 AM',
    maxStudents: 25,
    currentEnrolled: 19,
    isActive: true,
  },
  {
    id: 'b-4',
    name: 'Class 11 PCM - Evening Prime',
    courseId: 'c-3',
    teacherId: 't-2',
    roomNo: 'Classroom Hall 3 (First Floor)',
    daysOfWeek: ['Tue', 'Thu', 'Sat', 'Sun'],
    startTime: '04:30 PM',
    endTime: '06:45 PM',
    maxStudents: 30,
    currentEnrolled: 24,
    isActive: true,
  },
  {
    id: 'b-5',
    name: 'Class 10 Science & Maths - Evening Super 30',
    courseId: 'c-4',
    teacherId: 't-2',
    roomNo: 'Classroom Hall 2 (First Floor)',
    daysOfWeek: ['Mon', 'Tue', 'Thu', 'Sat'],
    startTime: '05:30 PM',
    endTime: '07:15 PM',
    maxStudents: 30,
    currentEnrolled: 27,
    isActive: true,
  },
];

const SEED_SUBJECTS: Subject[] = [
  { id: 's-1', name: 'Physics', courseId: 'c-1', code: 'PHY-12', teacherId: 't-1' },
  { id: 's-2', name: 'Chemistry', courseId: 'c-1', code: 'CHEM-12', teacherId: 't-3' },
  { id: 's-3', name: 'Mathematics', courseId: 'c-1', code: 'MATH-12', teacherId: 't-2' },
  { id: 's-4', name: 'Biology', courseId: 'c-2', code: 'BIO-12', teacherId: 't-4' },
  { id: 's-5', name: 'Science', courseId: 'c-4', code: 'SCI-10', teacherId: 't-1' },
  { id: 's-6', name: 'Mathematics', courseId: 'c-4', code: 'MATH-10', teacherId: 't-2' },
];

const SEED_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq-1',
    enquiryCode: 'TUI-48291',
    studentName: 'Rahul Khan',
    parentName: 'Irfan Khan',
    phone: '+91 98765 43210',
    email: 'rahul.khan@example.com',
    studentClass: 'Class 12',
    stream: 'PCM',
    subjects: ['Physics', 'Chemistry', 'Mathematics'],
    preferredBatch: 'Evening 05:00 PM (Batch B)',
    message: 'Looking for disciplined offline tuition near Civil Lines. Need strong conceptual focus in Physics and Calculus for 12th Boards.',
    previousPercentage: 88.4,
    source: 'Friend / Word of Mouth',
    status: 'Discussion',
    assignedTeacherId: 't-1',
    internalNotes: 'Parent visited the center yesterday. Interested in trial class on Friday at 5 PM.',
    verificationCode: '4829',
    createdAt: '2026-08-12T10:30:00Z',
    updatedAt: '2026-08-13T14:20:00Z',
  },
  {
    id: 'enq-2',
    enquiryCode: 'TUI-79104',
    studentName: 'Sneha Patel',
    parentName: 'Mahesh Patel',
    phone: '+91 98111 22334',
    email: 'sneha.patel@example.com',
    studentClass: 'Class 12',
    stream: 'PCB',
    subjects: ['Biology', 'Physics', 'Chemistry'],
    preferredBatch: 'Morning 07:00 AM',
    message: 'Aspirant for NEET 2027. Need offline coaching with small batch size and daily doubts clearing.',
    previousPercentage: 92.6,
    source: 'Google Search',
    status: 'Trial/Visit Scheduled',
    assignedTeacherId: 't-4',
    internalNotes: 'Trial class scheduled for Saturday morning with Dr. Priya Varma.',
    verificationCode: '7910',
    createdAt: '2026-08-13T08:15:00Z',
    updatedAt: '2026-08-13T09:00:00Z',
  },
  {
    id: 'enq-3',
    enquiryCode: 'TUI-20384',
    studentName: 'Aarav Gupta',
    parentName: 'Sanjay Gupta',
    phone: '+91 99223 34455',
    email: 'aarav.g@example.com',
    studentClass: 'Class 10',
    stream: 'General',
    subjects: ['Science', 'Mathematics'],
    preferredBatch: 'Evening 05:30 PM Super 30',
    message: 'Want to join Super 30 batch for Class 10 Board preparation.',
    previousPercentage: 84.0,
    source: 'Flyer / Banner',
    status: 'New',
    verificationCode: '2038',
    createdAt: '2026-08-14T02:45:00Z',
    updatedAt: '2026-08-14T02:45:00Z',
  },
];

const SEED_ENQUIRY_MESSAGES: EnquiryMessage[] = [
  {
    id: 'msg-1',
    enquiryId: 'enq-1',
    senderRole: 'visitor',
    senderName: 'Rahul Khan (Student)',
    message: 'Hello Sir, I submitted an enquiry for Class 12 PCM Evening batch. Can I get details regarding batch timings and monthly fee structure?',
    isRead: true,
    createdAt: '2026-08-12T10:32:00Z',
  },
  {
    id: 'msg-2',
    enquiryId: 'enq-1',
    senderRole: 'admin',
    senderName: 'Admissions Office (Dr. Rajesh Sharma)',
    message: 'Welcome Rahul! The Class 12 PCM Evening Batch runs Mon/Wed/Fri/Sat from 5:00 PM to 7:30 PM in Classroom Hall 1. Monthly fee is ₹4,500 which includes all physical printed study materials, weekly tests, and 4 PM doubt counter access. Would you like to attend a free trial class this Friday?',
    isRead: true,
    createdAt: '2026-08-12T11:05:00Z',
  },
  {
    id: 'msg-3',
    enquiryId: 'enq-1',
    senderRole: 'visitor',
    senderName: 'Rahul Khan (Student)',
    message: 'Yes Sir! Friday 5:00 PM works perfectly for me and my father. Do I need to bring any books or notebooks for the trial session?',
    isRead: true,
    createdAt: '2026-08-12T11:40:00Z',
  },
  {
    id: 'msg-4',
    enquiryId: 'enq-1',
    senderRole: 'admin',
    senderName: 'Admissions Office',
    message: 'Just bring a rough notebook and a pen. We will provide our physical printed Chapter 1 Notes (Electrostatics) at the reception desk. Looking forward to meeting you at our center!',
    isRead: false,
    createdAt: '2026-08-12T12:00:00Z',
  },
];

const SEED_STUDENTS: Student[] = [
  {
    id: 'stu-1',
    studentId: 'APX-2026-101',
    name: 'Aditya Deshmukh',
    parentName: 'Suresh Deshmukh',
    phone: '+91 98450 11223',
    email: 'aditya.student@apexacademy.edu',
    studentClass: 'Class 12',
    stream: 'PCM',
    courseId: 'c-1',
    batchId: 'b-1',
    admissionDate: '2026-04-10',
    monthlyFee: 4500,
    status: 'active',
    rollNo: 'PCM-12-01',
    emergencyContact: '+91 98450 11224',
    address: 'Flat 402, Sai Residency, Civil Lines, Nagpur',
    temporaryPassword: 'Student@123',
    mustChangePassword: false,
    createdAt: '2026-04-10T10:00:00Z',
  },
  {
    id: 'stu-2',
    studentId: 'APX-2026-102',
    name: 'Riya Sengupta',
    parentName: 'Amit Sengupta',
    phone: '+91 98450 33445',
    email: 'riya.student@apexacademy.edu',
    studentClass: 'Class 12',
    stream: 'PCB',
    courseId: 'c-2',
    batchId: 'b-3',
    admissionDate: '2026-04-12',
    monthlyFee: 4500,
    status: 'active',
    rollNo: 'PCB-12-04',
    emergencyContact: '+91 98450 33446',
    address: 'Plot 18, Shankar Nagar, Nagpur',
    temporaryPassword: 'Student@123',
    mustChangePassword: false,
    createdAt: '2026-04-12T11:00:00Z',
  },
  {
    id: 'stu-3',
    studentId: 'APX-2026-103',
    name: 'Devansh Kulkarni',
    parentName: 'Vinod Kulkarni',
    phone: '+91 98450 55667',
    email: 'devansh.student@apexacademy.edu',
    studentClass: 'Class 10',
    stream: 'General',
    courseId: 'c-4',
    batchId: 'b-5',
    admissionDate: '2026-04-15',
    monthlyFee: 3200,
    status: 'active',
    rollNo: 'SM-10-09',
    emergencyContact: '+91 98450 55668',
    address: 'B-12, Laxmi Nagar, Nagpur',
    temporaryPassword: 'Student@123',
    mustChangePassword: false,
    createdAt: '2026-04-15T12:00:00Z',
  },
];

const SEED_ATTENDANCE: AttendanceRecord[] = [
  // Aditya Deshmukh attendance
  { id: 'att-1', batchId: 'b-1', studentId: 'stu-1', date: '2026-08-01', status: 'present', markedBy: 'Dr. Rajesh Sharma' },
  { id: 'att-2', batchId: 'b-1', studentId: 'stu-1', date: '2026-08-02', status: 'present', markedBy: 'Dr. Rajesh Sharma' },
  { id: 'att-3', batchId: 'b-1', studentId: 'stu-1', date: '2026-08-03', status: 'present', markedBy: 'Dr. Rajesh Sharma' },
  { id: 'att-4', batchId: 'b-1', studentId: 'stu-1', date: '2026-08-04', status: 'present', markedBy: 'Dr. Rajesh Sharma' },
  { id: 'att-5', batchId: 'b-1', studentId: 'stu-1', date: '2026-08-05', status: 'absent', remarks: 'Sick leave informed', markedBy: 'Dr. Rajesh Sharma' },
  { id: 'att-6', batchId: 'b-1', studentId: 'stu-1', date: '2026-08-08', status: 'present', markedBy: 'Dr. Rajesh Sharma' },
  { id: 'att-7', batchId: 'b-1', studentId: 'stu-1', date: '2026-08-09', status: 'present', markedBy: 'Dr. Rajesh Sharma' },
  { id: 'att-8', batchId: 'b-1', studentId: 'stu-1', date: '2026-08-10', status: 'present', markedBy: 'Dr. Rajesh Sharma' },
  { id: 'att-9', batchId: 'b-1', studentId: 'stu-1', date: '2026-08-11', status: 'present', markedBy: 'Dr. Rajesh Sharma' },
  { id: 'att-10', batchId: 'b-1', studentId: 'stu-1', date: '2026-08-12', status: 'present', markedBy: 'Dr. Rajesh Sharma' },
  { id: 'att-11', batchId: 'b-1', studentId: 'stu-1', date: '2026-08-13', status: 'present', markedBy: 'Dr. Rajesh Sharma' },
];

const SEED_FEE_PAYMENTS: FeePayment[] = [
  {
    id: 'fp-1',
    receiptNo: 'REC-2026-0401',
    studentId: 'stu-1',
    feeMonth: 'April 2026',
    amount: 6000, // 4500 fee + 1500 admission fee
    paymentDate: '2026-04-10',
    paymentMode: 'UPI',
    transactionRef: 'UPI/610293810234',
    previousDue: 0,
    remainingBalance: 0,
    notes: 'Admission fee + April tuition fee paid',
    collectedBy: 'Admissions Desk (Vikash Rao)',
    createdAt: '2026-04-10T10:30:00Z',
  },
  {
    id: 'fp-2',
    receiptNo: 'REC-2026-0515',
    studentId: 'stu-1',
    feeMonth: 'May 2026',
    amount: 4500,
    paymentDate: '2026-05-08',
    paymentMode: 'Bank Transfer',
    transactionRef: 'NEFT-HDFC-918237',
    previousDue: 0,
    remainingBalance: 0,
    notes: 'May tuition fee cleared',
    collectedBy: 'Accounts Office',
    createdAt: '2026-05-08T14:15:00Z',
  },
  {
    id: 'fp-3',
    receiptNo: 'REC-2026-0610',
    studentId: 'stu-1',
    feeMonth: 'June 2026',
    amount: 4500,
    paymentDate: '2026-06-05',
    paymentMode: 'UPI',
    transactionRef: 'UPI/661902847192',
    previousDue: 0,
    remainingBalance: 0,
    notes: 'June tuition fee cleared',
    collectedBy: 'Accounts Office',
    createdAt: '2026-06-05T09:40:00Z',
  },
  {
    id: 'fp-4',
    receiptNo: 'REC-2026-0708',
    studentId: 'stu-1',
    feeMonth: 'July 2026',
    amount: 4500,
    paymentDate: '2026-07-07',
    paymentMode: 'Cash',
    transactionRef: 'CASH-REC-0708',
    previousDue: 0,
    remainingBalance: 0,
    notes: 'Cash payment received at front desk',
    collectedBy: 'Admissions Desk (Vikash Rao)',
    createdAt: '2026-07-07T16:00:00Z',
  },
  {
    id: 'fp-5',
    receiptNo: 'REC-2026-0811',
    studentId: 'stu-1',
    feeMonth: 'August 2026',
    amount: 4500,
    paymentDate: '2026-08-08',
    paymentMode: 'UPI',
    transactionRef: 'UPI/688192039182',
    previousDue: 0,
    remainingBalance: 0,
    notes: 'August tuition fee confirmed',
    collectedBy: 'Accounts Office',
    createdAt: '2026-08-08T11:20:00Z',
  },
];

const SEED_STUDY_MATERIALS: StudyMaterial[] = [
  {
    id: 'mat-1',
    title: 'Chapter 1: Electric Charges & Fields - Complete Handwritten Notes',
    description: 'Detailed classroom derivation notes, Gauss law proofs, and solved board numericals with step-by-step breakdown.',
    materialType: 'PDF Notes',
    courseId: 'c-1',
    batchId: 'b-1',
    subjectId: 's-1',
    chapter: 'Ch 1 - Electrostatics',
    fileName: 'Apex_Phy12_Ch1_ElectricCharges_Notes.pdf',
    fileSize: '4.8 MB',
    fileUrl: 'https://example.com/materials/Apex_Phy12_Ch1_ElectricCharges_Notes.pdf',
    isPublished: true,
    publishedAt: '2026-08-02T10:00:00Z',
    downloadCount: 42,
  },
  {
    id: 'mat-2',
    title: 'Daily Practice Sheet (DPP 04) - Gauss Law Applications & Dipoles',
    description: '25 graded numericals for daily classroom homework drill. Mandatory submission by Thursday.',
    materialType: 'Practice Sheet',
    courseId: 'c-1',
    batchId: 'b-1',
    subjectId: 's-1',
    chapter: 'Ch 1 - Electrostatics',
    fileName: 'Apex_Phy12_DPP04_GaussLaw.pdf',
    fileSize: '1.2 MB',
    fileUrl: 'https://example.com/materials/Apex_Phy12_DPP04_GaussLaw.pdf',
    isPublished: true,
    publishedAt: '2026-08-05T14:30:00Z',
    downloadCount: 38,
  },
  {
    id: 'mat-3',
    title: 'Calculus: Continuity & Differentiability Master Formula Sheet',
    description: 'Summary of all standard limit formulas, chain rule shortcuts, and trigonometric substitution tricks.',
    materialType: 'Chapter Notes',
    courseId: 'c-1',
    batchId: 'b-1',
    subjectId: 's-3',
    chapter: 'Ch 5 - Continuity & Differentiability',
    fileName: 'Apex_Math12_Calculus_Formula_Cheatsheet.pdf',
    fileSize: '2.1 MB',
    fileUrl: 'https://example.com/materials/Apex_Math12_Calculus_Formula_Cheatsheet.pdf',
    isPublished: true,
    publishedAt: '2026-08-08T09:15:00Z',
    downloadCount: 51,
  },
  {
    id: 'mat-4',
    title: 'Organic Chemistry: Haloalkanes & Haloarenes Reaction Chart',
    description: 'High-yield electrophilic and nucleophilic substitution mechanisms chart for quick board revision.',
    materialType: 'Important Questions',
    courseId: 'c-1',
    batchId: 'b-1',
    subjectId: 's-2',
    chapter: 'Ch 10 - Haloalkanes & Haloarenes',
    fileName: 'Apex_Chem12_Reaction_Mechanisms_Chart.pdf',
    fileSize: '3.4 MB',
    fileUrl: 'https://example.com/materials/Apex_Chem12_Reaction_Mechanisms_Chart.pdf',
    isPublished: true,
    publishedAt: '2026-08-10T16:00:00Z',
    downloadCount: 35,
  },
  {
    id: 'mat-5',
    title: 'Class 12 Physics 2026-27 Official CBSE Board Syllabus & Weightage',
    description: 'Unit-wise marking scheme, deleted syllabus breakdown, and practical experiment guidelines.',
    materialType: 'Syllabus',
    courseId: 'c-1',
    subjectId: 's-1',
    chapter: 'General Academic',
    fileName: 'CBSE_Class12_Physics_Syllabus_2026.pdf',
    fileSize: '1.1 MB',
    fileUrl: 'https://example.com/materials/CBSE_Class12_Physics_Syllabus_2026.pdf',
    isPublished: true,
    publishedAt: '2026-04-10T08:00:00Z',
    downloadCount: 89,
  },
];

const SEED_TESTS: Test[] = [
  {
    id: 'test-1',
    title: 'Monthly Chapter Test 1: Electrostatics & Coulomb Force',
    batchId: 'b-1',
    subjectId: 's-1',
    testDate: '2026-07-28',
    maxMarks: 50,
    passMarks: 20,
    chapterTopics: 'Electric charges, Coulomb law, Electric field lines, Electric flux & Gauss Law theorem',
    isPublished: true,
  },
  {
    id: 'test-2',
    title: 'Mathematics Unit Test: Matrices & Determinants',
    batchId: 'b-1',
    subjectId: 's-3',
    testDate: '2026-08-06',
    maxMarks: 40,
    passMarks: 16,
    chapterTopics: 'Matrix operations, Inverses, Cramer rule, Properties of determinants',
    isPublished: true,
  },
  {
    id: 'test-3',
    title: 'Upcoming Grand Test: Electrostatic Potential & Capacitance',
    batchId: 'b-1',
    subjectId: 's-1',
    testDate: '2026-08-20',
    maxMarks: 70,
    passMarks: 28,
    chapterTopics: 'Full Unit 1 & Unit 2 Board standard subjective paper',
    isPublished: true,
  },
];

const SEED_TEST_RESULTS: TestResult[] = [
  {
    id: 'tr-1',
    testId: 'test-1',
    studentId: 'stu-1',
    marksObtained: 46,
    percentage: 92.0,
    rank: 2,
    teacherRemarks: 'Outstanding numerical presentation and clear derivation steps in Gauss Law theorem.',
    createdAt: '2026-07-30T10:00:00Z',
  },
  {
    id: 'tr-2',
    testId: 'test-2',
    studentId: 'stu-1',
    marksObtained: 38,
    percentage: 95.0,
    rank: 1,
    teacherRemarks: 'Top score in batch! Flawless matrix inverse calculations without any algebraic slips.',
    createdAt: '2026-08-08T12:00:00Z',
  },
];

const SEED_STUDENT_PROGRESS: StudentProgress[] = [
  {
    id: 'sp-1',
    studentId: 'stu-1',
    courseId: 'c-1',
    subjectId: 's-1',
    progressPercentage: 68,
    currentTopic: 'Current Electricity: Kirchhoff Laws & Wheatstone Bridge',
    completedTopics: [
      'Electric Charges & Conservation',
      'Coulomb Law in Vector Form',
      'Electric Field due to Dipole',
      'Gauss Law & Applications',
      'Electrostatic Potential & Equipotential Surfaces',
      'Parallel Plate Capacitors & Dielectrics',
    ],
    teacherRemarks: 'Consistent performance. Advised to practice more mixed circuit numericals with capacitors.',
    updatedAt: '2026-08-12T15:00:00Z',
  },
  {
    id: 'sp-2',
    studentId: 'stu-1',
    courseId: 'c-1',
    subjectId: 's-3',
    progressPercentage: 74,
    currentTopic: 'Applications of Derivatives: Tangents & Normals, Rate of Change',
    completedTopics: [
      'Relations & Functions',
      'Inverse Trigonometric Functions',
      'Matrices & Algebraic Operations',
      'Determinants & Inverses',
      'Continuity & Differentiability',
    ],
    teacherRemarks: 'Very strong algebraic foundation. Completing DPP sheets on time.',
    updatedAt: '2026-08-11T14:30:00Z',
  },
  {
    id: 'sp-3',
    studentId: 'stu-1',
    courseId: 'c-1',
    subjectId: 's-2',
    progressPercentage: 62,
    currentTopic: 'Solutions: Colligative Properties & Raoult Law',
    completedTopics: [
      'Solutions & Concentration Units',
      'Henry Law & Solubility',
      'Haloalkanes Preparation & Reactions',
      'Optical Isomerism in Alkyl Halides',
    ],
    teacherRemarks: 'Good grasp of organic reaction charts. Revision test scheduled next week.',
    updatedAt: '2026-08-10T16:00:00Z',
  },
];

const SEED_NOTICES: Notice[] = [
  {
    id: 'not-1',
    title: 'Independence Day Holiday & Special Doubt Clearance Timing',
    description: 'Regular physical classroom sessions will remain suspended on 15th August on account of Independence Day. Doubt clearing counters will remain open from 10:00 AM to 1:00 PM for all batches.',
    type: 'Holiday',
    priority: 'Medium',
    targetAudience: 'All',
    publishDate: '2026-08-13',
    expiryDate: '2026-08-16',
    isActive: true,
  },
  {
    id: 'not-2',
    title: 'Parent-Teacher Meeting (PTM) for Class 12 Batches',
    description: 'Mandatory physical PTM is scheduled for Sunday, 23rd August from 10:00 AM to 2:00 PM in Institute Auditorium. Parents can discuss student progress, attendance, and Unit Test 1 answer sheets directly with faculty.',
    type: 'PTM',
    priority: 'High',
    targetAudience: 'Students',
    publishDate: '2026-08-10',
    expiryDate: '2026-08-24',
    isActive: true,
  },
  {
    id: 'not-3',
    title: 'Admissions Open for Class 10 & 11 Offline Crash/Bridge Batches',
    description: 'Limited seats remaining (Max 28 students per physical batch). Walk-in admission test and faculty counseling available Monday to Saturday.',
    type: 'Announcement',
    priority: 'Medium',
    targetAudience: 'Public',
    publishDate: '2026-08-01',
    isActive: true,
  },
];

const SEED_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif-1',
    recipientType: 'admin',
    title: '🔔 New Admission Enquiry Received',
    message: 'Aarav Gupta submitted an enquiry for Class 10 Science & Maths Super 30 (Enquiry ID: TUI-20384).',
    link: '/admin/enquiries',
    isRead: false,
    type: 'enquiry',
    createdAt: '2026-08-14T02:45:00Z',
  },
  {
    id: 'notif-2',
    recipientType: 'admin',
    title: '💬 New Enquiry Message',
    message: 'Rahul Khan (TUI-48291) replied: "Yes Sir! Friday 5:00 PM works perfectly for me and my father."',
    link: '/admin/enquiries',
    isRead: false,
    type: 'message',
    createdAt: '2026-08-12T11:40:00Z',
  },
  {
    id: 'notif-3',
    recipientType: 'student',
    recipientId: 'stu-1',
    title: '📚 New Physics Study Material Uploaded',
    message: 'Dr. Rajesh Sharma uploaded "Chapter 1: Electric Charges & Fields Complete Notes".',
    link: '/student/study-material',
    isRead: false,
    type: 'material',
    createdAt: '2026-08-10T16:00:00Z',
  },
  {
    id: 'notif-4',
    recipientType: 'student',
    recipientId: 'stu-1',
    title: '🏆 Test Result Published',
    message: 'Your score for Mathematics Unit Test (Matrices & Determinants) is 38/40 (95%, Rank 1).',
    link: '/student/tests',
    isRead: true,
    type: 'test',
    createdAt: '2026-08-08T12:00:00Z',
  },
];

const SEED_WEBSITE_SETTINGS: WebsiteSettings = {
  instituteName: 'Apex Tuition & Science Academy',
  tagline: 'Premier Offline Classroom Coaching & Mentorship',
  foundedYear: '2012',
  phone: '+91 98234 56789',
  altPhone: '+91 712 2567890',
  email: 'admissions@apexacademy.edu',
  address: 'Plot 42, Knowledge Park, Opposite Central Mall, Civil Lines',
  city: 'Nagpur',
  state: 'Maharashtra',
  pincode: '440001',
  landmark: 'Near RBI Square, Civil Lines',
  officeHours: 'Monday - Saturday: 08:00 AM - 08:00 PM | Sunday: 09:00 AM - 02:00 PM',
  regNumber: 'MAH/EDU/2012/84920',
  lightLogo: '',
  darkLogo: '',
  favicon: '',
  heroTitle: 'Excellence in Offline Classroom Tuition & Personal Mentorship',
  heroSubtitle: 'Transforming potential into top board scores and competitive ranks through disciplined physical classroom batches, expert mentors, and small batch sizes of maximum 28 students.',
  heroBadge: 'Admissions Open for Academic Year 2026-27',
  primaryColor: '#1e3a8a',
  stats: {
    studentsTaught: '5,800+',
    successRate: '98.4%',
    expertFaculty: '18+',
    topRanks: '140+ in Top 1%',
    batchSizeLimit: 'Max 28 Students',
  },
  results: [
    {
      id: 'res-1',
      studentName: 'Tanvi Deshpande',
      exam: 'CBSE Class 12 Board',
      scoreRank: '98.8% Aggregate (100 in Physics, 99 in Maths)',
      college: 'Admitted to IIT Bombay (Computer Science)',
      year: '2026',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'res-2',
      studentName: 'Saurabh Joshi',
      exam: 'NEET Medical Entrance',
      scoreRank: 'AIR 412 (695/720 Score)',
      college: 'Admitted to AIIMS Nagpur',
      year: '2026',
      photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'res-3',
      studentName: 'Meera Kulkarni',
      exam: 'CBSE Class 10 Board',
      scoreRank: '99.2% Aggregate (State Rank 3)',
      college: 'Apex Super 30 Topper',
      year: '2026',
      photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'res-4',
      studentName: 'Rohan Agrawal',
      exam: 'JEE Advanced',
      scoreRank: 'AIR 680 (PCM Batch)',
      college: 'Admitted to IIT Madras (Electrical)',
      year: '2025',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    },
  ],
  testimonials: [
    {
      id: 'test-1',
      name: 'Dr. Ramesh Deshpande',
      role: 'Parent of Tanvi (Class 12 PCM Topper)',
      text: 'Apex Tuition is unlike crowded commercial coaching factories. Dr. Rajesh Sharma and the team maintain strict discipline, check homework daily, and hold offline doubt counters every single evening. Tanvi scored 98.8% in boards thanks to their personal guidance.',
      rating: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
      achievement: 'IIT Bombay CS Admit',
    },
    {
      id: 'test-2',
      name: 'Sunita Joshi',
      role: 'Parent of Saurabh (NEET 695/720)',
      text: 'The physical classroom environment, printed NCERT line-by-line question banks, and Sunday full syllabus mock tests gave Saurabh the confidence to crack NEET in his very first attempt.',
      rating: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      achievement: 'AIIMS Nagpur Admit',
    },
    {
      id: 'test-3',
      name: 'Kunal Verma',
      role: 'Student (Class 12 PCM Elite)',
      text: 'The offline doubt clearance desk is the biggest advantage. Whenever I got stuck in electrodynamics or integration, teachers sat with me physically until the concept clicked.',
      rating: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      achievement: 'Scored 97% in Pre-Boards',
    },
  ],
  gallery: [
    {
      id: 'g-1',
      title: 'Spacious & Air-Conditioned Classrooms with Smart Board & Chalkboard',
      category: 'Classrooms',
      imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'g-2',
      title: 'Dedicated Evening Doubt Clearance & Self-Study Library',
      category: 'Library & Doubt Hall',
      imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'g-3',
      title: 'Annual Felicitation Ceremony of Board & JEE/NEET Toppers',
      category: 'Felicitation',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'g-4',
      title: 'Interactive Physics Demonstration & Science Lab',
      category: 'Classrooms',
      imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
    },
  ],
  socialLinks: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    maps: 'https://maps.google.com',
    whatsapp: '+919823456789',
  },
};

const SEED_SEO_SETTINGS: SEOSettings = {
  metaTitle: 'Apex Tuition & Science Academy | Best Offline Coaching Institute for Class 9-12 PCM PCB',
  metaDescription: 'Top-rated offline tuition and coaching institute in Civil Lines. Small batches of 28 students, expert faculty, printed study materials, daily doubt clearance, and proven board & JEE/NEET results.',
  keywords: 'offline tuition, coaching institute, class 12 physics tuition, class 12 maths coaching, NEET offline classes, JEE coaching, best tuition center',
  canonicalUrl: 'https://apexacademy.edu',
  robots: 'index, follow',
  author: 'Apex Tuition Institute',
  ogTitle: 'Apex Tuition Institute - Real Offline Classroom Mentorship',
  ogDescription: 'Experience disciplined offline classroom teaching with high board scores and personal faculty attention. Admissions open for Class 9, 10, 11, and 12.',
  ogImageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&auto=format&fit=crop&q=80',
};

// Storage Service with reactive event handling
class StorageService {
  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
      }
      return JSON.parse(stored);
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      window.dispatchEvent(new CustomEvent('apex_data_changed', { detail: { key } }));
      
      // Auto-sync with backend database if it is not a temporary/local-only key
      if (key !== 'apex_push_token_v1' && key !== 'apex_notifications_v1') {
        import('./api').then(({ apiService }) => {
          apiService.syncWithBackend().catch(err => console.error('Background sync failed:', err));
        }).catch(err => console.error('Failed to import apiService for auto-sync:', err));
      }
    } catch (e) {
      console.error('Storage setItem error:', e);
    }
  }

  // Push notification helper
  async requestPushPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = `fcm_token_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
        localStorage.setItem(STORAGE_KEYS.PUSH_TOKEN, token);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  sendPushNotification(title: string, body: string, url?: string): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const notif = new Notification(title, {
          body,
          icon: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=128&auto=format&fit=crop&q=80',
          badge: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=64&auto=format&fit=crop&q=80',
        });
        if (url) {
          notif.onclick = () => {
            window.focus();
            window.location.hash = url;
          };
        }
      } catch (e) {
        console.log('Push notification display fallback:', e);
      }
    }
  }

  // ENQUIRIES
  getEnquiries(): Enquiry[] {
    return this.getItem<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, SEED_ENQUIRIES);
  }

  getEnquiryByCode(code: string): Enquiry | undefined {
    const enquiries = this.getEnquiries();
    return enquiries.find(e => e.enquiryCode.toUpperCase() === code.trim().toUpperCase());
  }

  getEnquiryById(id: string): Enquiry | undefined {
    const enquiries = this.getEnquiries();
    return enquiries.find(e => e.id === id);
  }

  createEnquiry(data: Omit<Enquiry, 'id' | 'enquiryCode' | 'status' | 'verificationCode' | 'createdAt' | 'updatedAt'>): Enquiry {
    const enquiries = this.getEnquiries();
    // Generate unique code like TUI-48291
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const enquiryCode = `TUI-${randomDigits}`;
    const verificationCode = String(Math.floor(1000 + Math.random() * 9000));
    
    const newEnquiry: Enquiry = {
      ...data,
      id: `enq-${Date.now()}`,
      enquiryCode,
      verificationCode,
      status: 'New',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    enquiries.unshift(newEnquiry);
    this.setItem(STORAGE_KEYS.ENQUIRIES, enquiries);

    // Initial Welcome Message from Admin in Enquiry Chat
    this.sendEnquiryMessage({
      enquiryId: newEnquiry.id,
      senderRole: 'admin',
      senderName: 'Apex Admissions Desk',
      message: `Hello ${newEnquiry.studentName}! We have received your admission enquiry for ${newEnquiry.studentClass} (${newEnquiry.subjects.join(', ')}). Our academic counselor will review your batch preference (${newEnquiry.preferredBatch}) and connect with you shortly. You can ask any questions regarding batches, faculty, or fee details right here!`,
      isRead: false,
    });

    // Create Admin In-App Notification
    this.createNotification({
      recipientType: 'admin',
      title: '🔔 New Admission Enquiry',
      message: `${newEnquiry.studentName} submitted an enquiry for ${newEnquiry.studentClass} ${newEnquiry.stream || ''} (Enquiry ID: ${enquiryCode}).`,
      link: `/admin/enquiries`,
      type: 'enquiry',
    });

    // Trigger Push Notification
    this.sendPushNotification(
      'New Admission Enquiry Received',
      `${newEnquiry.studentName} submitted an enquiry for ${newEnquiry.studentClass}.`
    );

    return newEnquiry;
  }

  updateEnquiryStatus(id: string, status: EnquiryStatus, internalNotes?: string, assignedTeacherId?: string): Enquiry | undefined {
    const enquiries = this.getEnquiries();
    const index = enquiries.findIndex(e => e.id === id);
    if (index === -1) return undefined;

    enquiries[index] = {
      ...enquiries[index],
      status,
      internalNotes: internalNotes !== undefined ? internalNotes : enquiries[index].internalNotes,
      assignedTeacherId: assignedTeacherId !== undefined ? assignedTeacherId : enquiries[index].assignedTeacherId,
      updatedAt: new Date().toISOString(),
    };

    this.setItem(STORAGE_KEYS.ENQUIRIES, enquiries);

    // Post status update system message in chat
    this.sendEnquiryMessage({
      enquiryId: id,
      senderRole: 'admin',
      senderName: 'System Update',
      message: `Enquiry status updated to: ${status}${internalNotes ? ` (${internalNotes})` : ''}.`,
      isRead: true,
    });

    return enquiries[index];
  }

  // ENQUIRY MESSAGES
  getEnquiryMessages(enquiryId: string): EnquiryMessage[] {
    const allMessages = this.getItem<EnquiryMessage[]>(STORAGE_KEYS.ENQUIRY_MESSAGES, SEED_ENQUIRY_MESSAGES);
    return allMessages
      .filter(m => m.enquiryId === enquiryId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  sendEnquiryMessage(data: Omit<EnquiryMessage, 'id' | 'createdAt'>): EnquiryMessage {
    const allMessages = this.getItem<EnquiryMessage[]>(STORAGE_KEYS.ENQUIRY_MESSAGES, SEED_ENQUIRY_MESSAGES);
    const newMessage: EnquiryMessage = {
      ...data,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };

    allMessages.push(newMessage);
    this.setItem(STORAGE_KEYS.ENQUIRY_MESSAGES, allMessages);

    // Notify other party
    if (data.senderRole === 'visitor') {
      const enquiry = this.getEnquiryById(data.enquiryId);
      this.createNotification({
        recipientType: 'admin',
        title: `💬 New Message from ${data.senderName}`,
        message: data.message.length > 80 ? data.message.substring(0, 77) + '...' : data.message,
        link: `/admin/enquiries`,
        type: 'message',
      });

      this.sendPushNotification(
        `New Message from Enquiry ${enquiry?.enquiryCode || ''}`,
        `${data.senderName}: ${data.message}`
      );
    } else {
      // Admin message to visitor
      this.sendPushNotification(
        'New message from Apex Tuition Admissions',
        data.message
      );
    }

    return newMessage;
  }

  markEnquiryMessagesAsRead(enquiryId: string, readerRole: 'admin' | 'visitor'): void {
    const allMessages = this.getItem<EnquiryMessage[]>(STORAGE_KEYS.ENQUIRY_MESSAGES, SEED_ENQUIRY_MESSAGES);
    let modified = false;

    const updated = allMessages.map(m => {
      if (m.enquiryId === enquiryId && !m.isRead) {
        if (readerRole === 'admin' && m.senderRole === 'visitor') {
          modified = true;
          return { ...m, isRead: true };
        }
        if (readerRole === 'visitor' && m.senderRole !== 'visitor') {
          modified = true;
          return { ...m, isRead: true };
        }
      }
      return m;
    });

    if (modified) {
      this.setItem(STORAGE_KEYS.ENQUIRY_MESSAGES, updated);
    }
  }

  // CONVERT ENQUIRY TO STUDENT
  convertEnquiryToStudent(
    enquiryId: string,
    courseId: string,
    batchId: string,
    monthlyFee: number,
    rollNo?: string
  ): { student: Student; tempPassword: string } {
    const enquiry = this.getEnquiryById(enquiryId);
    if (!enquiry) throw new Error('Enquiry not found');

    const students = this.getStudents();
    const studentCount = students.length + 1;
    const year = new Date().getFullYear();
    const studentId = `APX-${year}-${String(100 + studentCount).padStart(3, '0')}`;
    const tempPassword = `Apex@${Math.floor(1000 + Math.random() * 9000)}`;

    const newStudent: Student = {
      id: `stu-${Date.now()}`,
      studentId,
      name: enquiry.studentName,
      parentName: enquiry.parentName,
      phone: enquiry.phone,
      email: enquiry.email || `${enquiry.studentName.toLowerCase().replace(/\s+/g, '')}@apexacademy.edu`,
      studentClass: enquiry.studentClass,
      stream: enquiry.stream,
      courseId,
      batchId,
      admissionDate: new Date().toISOString().split('T')[0],
      monthlyFee,
      status: 'active',
      rollNo: rollNo || `${enquiry.stream || 'GEN'}-${enquiry.studentClass.replace(/\D/g, '')}-${String(studentCount).padStart(2, '0')}`,
      emergencyContact: enquiry.phone,
      temporaryPassword: tempPassword,
      mustChangePassword: true,
      createdAt: new Date().toISOString(),
    };

    students.push(newStudent);
    this.setItem(STORAGE_KEYS.STUDENTS, students);

    // Update batch enrolled count
    const batches = this.getBatches();
    const bIndex = batches.findIndex(b => b.id === batchId);
    if (bIndex !== -1) {
      batches[bIndex].currentEnrolled = (batches[bIndex].currentEnrolled || 0) + 1;
      this.setItem(STORAGE_KEYS.BATCHES, batches);
    }

    // Mark enquiry as Admitted
    this.updateEnquiryStatus(enquiryId, 'Admitted', `Converted to Student: ${studentId}`);
    
    // Link admitted student ID in enquiry
    const enquiries = this.getEnquiries();
    const enqIdx = enquiries.findIndex(e => e.id === enquiryId);
    if (enqIdx !== -1) {
      enquiries[enqIdx].admittedStudentId = newStudent.id;
      this.setItem(STORAGE_KEYS.ENQUIRIES, enquiries);
    }

    // Send chat confirmation to student
    this.sendEnquiryMessage({
      enquiryId,
      senderRole: 'admin',
      senderName: 'Apex Admissions Desk',
      message: `🎉 Congratulations! Your admission to Apex Tuition Institute has been confirmed.\n\nYour Student ID: ${studentId}\nTemporary Password: ${tempPassword}\n\nPlease visit the Student Portal to log in and access your course details, classroom timetable, and study material.`,
      isRead: false,
    });

    // Create Notification
    this.createNotification({
      recipientType: 'admin',
      title: '🎉 Admission Confirmed',
      message: `${newStudent.name} admitted to ${enquiry.studentClass} (Student ID: ${studentId}).`,
      link: '/admin/students',
      type: 'system',
    });

    return { student: newStudent, tempPassword };
  }

  // STUDENTS
  getStudents(): Student[] {
    return this.getItem<Student[]>(STORAGE_KEYS.STUDENTS, SEED_STUDENTS);
  }

  getStudentById(id: string): Student | undefined {
    return this.getStudents().find(s => s.id === id);
  }

  getStudentByStudentId(studentId: string): Student | undefined {
    return this.getStudents().find(s => s.studentId.toUpperCase() === studentId.trim().toUpperCase());
  }

  createStudent(data: Omit<Student, 'id' | 'createdAt'>): Student {
    const students = this.getStudents();
    const newStudent: Student = {
      ...data,
      id: `stu-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    students.unshift(newStudent);
    this.setItem(STORAGE_KEYS.STUDENTS, students);
    return newStudent;
  }

  updateStudent(id: string, data: Partial<Student>): Student | undefined {
    const students = this.getStudents();
    const idx = students.findIndex(s => s.id === id);
    if (idx === -1) return undefined;

    students[idx] = { ...students[idx], ...data };
    this.setItem(STORAGE_KEYS.STUDENTS, students);
    return students[idx];
  }

  changeStudentPassword(id: string, newPassword: string): boolean {
    const students = this.getStudents();
    const idx = students.findIndex(s => s.id === id);
    if (idx === -1) return false;

    students[idx].temporaryPassword = newPassword;
    students[idx].mustChangePassword = false;
    this.setItem(STORAGE_KEYS.STUDENTS, students);
    return true;
  }

  // COURSES & BATCHES & TEACHERS
  getCourses(): Course[] {
    return this.getItem<Course[]>(STORAGE_KEYS.COURSES, SEED_COURSES);
  }

  createCourse(data: Omit<Course, 'id'>): Course {
    const courses = this.getCourses();
    const newCourse: Course = { ...data, id: `c-${Date.now()}` };
    courses.push(newCourse);
    this.setItem(STORAGE_KEYS.COURSES, courses);
    return newCourse;
  }

  updateCourse(id: string, data: Partial<Course>): Course | undefined {
    const courses = this.getCourses();
    const idx = courses.findIndex(c => c.id === id);
    if (idx === -1) return undefined;
    courses[idx] = { ...courses[idx], ...data };
    this.setItem(STORAGE_KEYS.COURSES, courses);
    return courses[idx];
  }

  getBatches(): Batch[] {
    return this.getItem<Batch[]>(STORAGE_KEYS.BATCHES, SEED_BATCHES);
  }

  createBatch(data: Omit<Batch, 'id'>): Batch {
    const batches = this.getBatches();
    const newBatch: Batch = { ...data, id: `b-${Date.now()}` };
    batches.push(newBatch);
    this.setItem(STORAGE_KEYS.BATCHES, batches);
    return newBatch;
  }

  updateBatch(id: string, data: Partial<Batch>): Batch | undefined {
    const batches = this.getBatches();
    const idx = batches.findIndex(b => b.id === id);
    if (idx === -1) return undefined;
    batches[idx] = { ...batches[idx], ...data };
    this.setItem(STORAGE_KEYS.BATCHES, batches);
    return batches[idx];
  }

  deleteBatch(id: string): void {
    const batches = this.getBatches().filter(b => b.id !== id);
    this.setItem(STORAGE_KEYS.BATCHES, batches);
  }

  deleteCourse(id: string): void {
    const courses = this.getCourses().filter(c => c.id !== id);
    this.setItem(STORAGE_KEYS.COURSES, courses);
  }

  getTeachers(): Teacher[] {
    return this.getItem<Teacher[]>(STORAGE_KEYS.TEACHERS, SEED_TEACHERS);
  }

  createTeacher(data: Omit<Teacher, 'id'>): Teacher {
    const teachers = this.getTeachers();
    const newTeacher: Teacher = { ...data, id: `t-${Date.now()}` };
    teachers.push(newTeacher);
    this.setItem(STORAGE_KEYS.TEACHERS, teachers);
    return newTeacher;
  }

  updateTeacher(id: string, data: Partial<Teacher>): Teacher | undefined {
    const teachers = this.getTeachers();
    const idx = teachers.findIndex(t => t.id === id);
    if (idx === -1) return undefined;
    teachers[idx] = { ...teachers[idx], ...data };
    this.setItem(STORAGE_KEYS.TEACHERS, teachers);
    return teachers[idx];
  }

  getSubjects(): Subject[] {
    return this.getItem<Subject[]>(STORAGE_KEYS.SUBJECTS, SEED_SUBJECTS);
  }

  // ATTENDANCE
  getAttendance(): AttendanceRecord[] {
    return this.getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, SEED_ATTENDANCE);
  }

  getAttendanceByStudent(studentId: string): AttendanceRecord[] {
    return this.getAttendance().filter(a => a.studentId === studentId);
  }

  getAttendanceByBatchAndDate(batchId: string, date: string): AttendanceRecord[] {
    return this.getAttendance().filter(a => a.batchId === batchId && a.date === date);
  }

  markBatchAttendance(
    batchId: string,
    date: string,
    records: Array<{ studentId: string; status: 'present' | 'absent' | 'late' | 'excused'; remarks?: string }>,
    markedBy: string
  ): void {
    const allAttendance = this.getAttendance();
    // Remove existing records for this batch & date
    const filtered = allAttendance.filter(a => !(a.batchId === batchId && a.date === date));

    const newRecords: AttendanceRecord[] = records.map(r => ({
      id: `att-${Date.now()}-${r.studentId}`,
      batchId,
      studentId: r.studentId,
      date,
      status: r.status,
      remarks: r.remarks,
      markedBy,
    }));

    this.setItem(STORAGE_KEYS.ATTENDANCE, [...filtered, ...newRecords]);

    // Send Push Notification for absent students
    records.filter(r => r.status === 'absent').forEach(r => {
      const student = this.getStudentById(r.studentId);
      if (student) {
        this.createNotification({
          recipientType: 'student',
          recipientId: student.id,
          title: '⚠️ Attendance Notice',
          message: `You were marked Absent for physical class on ${date}. Please contact your batch mentor if this is an error.`,
          link: '/student/attendance',
          type: 'notice',
        });
      }
    });
  }

  // FEE PAYMENTS & RECEIPTS
  getFeePayments(): FeePayment[] {
    return this.getItem<FeePayment[]>(STORAGE_KEYS.FEE_PAYMENTS, SEED_FEE_PAYMENTS);
  }

  getFeePaymentsByStudent(studentId: string): FeePayment[] {
    return this.getFeePayments()
      .filter(f => f.studentId === studentId)
      .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
  }

  recordFeePayment(data: Omit<FeePayment, 'id' | 'receiptNo' | 'createdAt'>): FeePayment {
    const payments = this.getFeePayments();
    const count = payments.length + 1;
    const year = new Date().getFullYear();
    const receiptNo = `REC-${year}-${String(1000 + count).padStart(4, '0')}`;

    const newPayment: FeePayment = {
      ...data,
      id: `fp-${Date.now()}`,
      receiptNo,
      createdAt: new Date().toISOString(),
    };

    payments.unshift(newPayment);
    this.setItem(STORAGE_KEYS.FEE_PAYMENTS, payments);

    // Notify Student
    this.createNotification({
      recipientType: 'student',
      recipientId: data.studentId,
      title: '🧾 Fee Payment Acknowledged',
      message: `Fee of ₹${data.amount.toLocaleString('en-IN')} for ${data.feeMonth} received successfully (Receipt No: ${receiptNo}). You can download your official PDF receipt now.`,
      link: '/student/fees',
      type: 'fee',
    });

    return newPayment;
  }

  sendFeeReminder(studentId: string, pendingMonth: string, amount: number): void {
    const student = this.getStudentById(studentId);
    if (!student) return;

    this.createNotification({
      recipientType: 'student',
      recipientId: studentId,
      title: '⏰ Tuition Fee Reminder',
      message: `Dear ${student.name}, this is a gentle reminder that tuition fee of ₹${amount.toLocaleString('en-IN')} for ${pendingMonth} is pending. Please clear at the institute front desk.`,
      link: '/student/fees',
      type: 'fee',
    });

    this.sendPushNotification(
      'Tuition Fee Reminder',
      `Tuition fee for ${pendingMonth} is due for ${student.name}.`
    );
  }

  // STUDY MATERIALS
  getStudyMaterials(courseId?: string, batchId?: string): StudyMaterial[] {
    const all = this.getItem<StudyMaterial[]>(STORAGE_KEYS.STUDY_MATERIALS, SEED_STUDY_MATERIALS);
    if (courseId || batchId) {
      return all.filter(m => (!courseId || !m.courseId || m.courseId === courseId) && (!batchId || !m.batchId || m.batchId === batchId));
    }
    return all;
  }

  getStudyMaterialsForStudent(courseId: string, batchId: string): StudyMaterial[] {
    return this.getStudyMaterials().filter(
      m => m.isPublished && m.courseId === courseId && (!m.batchId || m.batchId === batchId)
    );
  }

  uploadStudyMaterial(data: Omit<StudyMaterial, 'id' | 'downloadCount' | 'publishedAt'>, notifyStudents: boolean = true): StudyMaterial {
    const materials = this.getStudyMaterials();
    const newMaterial: StudyMaterial = {
      ...data,
      id: `mat-${Date.now()}`,
      downloadCount: 0,
      publishedAt: new Date().toISOString(),
    };

    materials.unshift(newMaterial);
    this.setItem(STORAGE_KEYS.STUDY_MATERIALS, materials);

    if (notifyStudents) {
      // Find course and subject name
      const course = this.getCourses().find(c => c.id === data.courseId);
      const subject = this.getSubjects().find(s => s.id === data.subjectId);

      // Create notification for students in this course/batch
      const students = this.getStudents().filter(s => s.courseId === data.courseId && (!data.batchId || s.batchId === data.batchId));
      students.forEach(s => {
        this.createNotification({
          recipientType: 'student',
          recipientId: s.id,
          title: `📚 New ${subject?.name || 'Study'} Material Uploaded`,
          message: `"${data.title}" has been uploaded for ${data.chapter}. Download or view in your portal.`,
          link: '/student/study-material',
          type: 'material',
        });
      });

      this.sendPushNotification(
        `📚 New ${subject?.name || 'Study'} Material`,
        `"${data.title}" has been uploaded for ${course?.name || 'your batch'}.`
      );
    }

    return newMaterial;
  }

  // TESTS & RESULTS
  getTests(): Test[] {
    return this.getItem<Test[]>(STORAGE_KEYS.TESTS, SEED_TESTS);
  }

  getTestsByBatch(batchId: string): Test[] {
    return this.getTests().filter(t => t.batchId === batchId);
  }

  getTestResults(): TestResult[] {
    return this.getItem<TestResult[]>(STORAGE_KEYS.TEST_RESULTS, SEED_TEST_RESULTS);
  }

  getTestResultsByStudent(studentId: string): Array<TestResult & { test?: Test }> {
    const results = this.getTestResults().filter(r => r.studentId === studentId);
    const tests = this.getTests();
    return results.map(r => ({
      ...r,
      test: tests.find(t => t.id === r.testId),
    }));
  }

  createTest(data: Omit<Test, 'id'>, notifyBatch: boolean = true): Test {
    const tests = this.getTests();
    const newTest: Test = { ...data, id: `test-${Date.now()}` };
    tests.unshift(newTest);
    this.setItem(STORAGE_KEYS.TESTS, tests);

    if (notifyBatch) {
      const batchStudents = this.getStudents().filter(s => s.batchId === data.batchId);
      const subject = this.getSubjects().find(s => s.id === data.subjectId);
      batchStudents.forEach(s => {
        this.createNotification({
          recipientType: 'student',
          recipientId: s.id,
          title: `📝 Offline Test Announced: ${data.title}`,
          message: `${subject?.name || 'Subject'} Test scheduled on ${data.testDate} (Max Marks: ${data.maxMarks}). Topics: ${data.chapterTopics}`,
          link: '/student/tests',
          type: 'test',
        });
      });

      this.sendPushNotification(
        'Offline Test Announced',
        `${data.title} scheduled for ${data.testDate}.`
      );
    }

    return newTest;
  }

  submitTestResults(testId: string, results: Array<{ studentId: string; marksObtained: number; teacherRemarks?: string }>): void {
    const test = this.getTests().find(t => t.id === testId);
    if (!test) return;

    const allResults = this.getTestResults().filter(r => r.testId !== testId);
    
    // Sort results by marks descending to compute ranks
    const sorted = [...results].sort((a, b) => b.marksObtained - a.marksObtained);
    
    const newResults: TestResult[] = sorted.map((item, idx) => {
      const percentage = Number(((item.marksObtained / test.maxMarks) * 100).toFixed(1));
      return {
        id: `tr-${Date.now()}-${item.studentId}`,
        testId,
        studentId: item.studentId,
        marksObtained: item.marksObtained,
        percentage,
        rank: idx + 1,
        teacherRemarks: item.teacherRemarks,
        createdAt: new Date().toISOString(),
      };
    });

    this.setItem(STORAGE_KEYS.TEST_RESULTS, [...allResults, ...newResults]);

    // Notify students of published marks
    newResults.forEach(r => {
      this.createNotification({
        recipientType: 'student',
        recipientId: r.studentId,
        title: `🏆 Test Score Published: ${test.title}`,
        message: `You scored ${r.marksObtained}/${test.maxMarks} (${r.percentage}%, Rank ${r.rank}). Check full scorecard.`,
        link: '/student/tests',
        type: 'test',
      });
    });
  }

  // STUDENT PROGRESS
  getStudentProgress(studentId: string): StudentProgress[] {
    const all = this.getItem<StudentProgress[]>(STORAGE_KEYS.STUDENT_PROGRESS, SEED_STUDENT_PROGRESS);
    return all.filter(p => p.studentId === studentId);
  }

  updateStudentProgress(data: Omit<StudentProgress, 'id' | 'updatedAt'>): StudentProgress {
    const all = this.getItem<StudentProgress[]>(STORAGE_KEYS.STUDENT_PROGRESS, SEED_STUDENT_PROGRESS);
    const index = all.findIndex(p => p.studentId === data.studentId && p.subjectId === data.subjectId);

    const updated: StudentProgress = {
      ...data,
      id: index !== -1 ? all[index].id : `sp-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };

    if (index !== -1) {
      all[index] = updated;
    } else {
      all.push(updated);
    }

    this.setItem(STORAGE_KEYS.STUDENT_PROGRESS, all);
    return updated;
  }

  // NOTICES
  getNotices(targetAudience?: string): Notice[] {
    const all = this.getItem<Notice[]>(STORAGE_KEYS.NOTICES, SEED_NOTICES);
    if (!targetAudience || targetAudience === 'All') return all;
    return all.filter(n => n.targetAudience === 'All' || n.targetAudience === targetAudience);
  }

  createNotice(data: Omit<Notice, 'id' | 'createdAt'>): Notice {
    const notices = this.getNotices();
    const newNotice: Notice = {
      ...data,
      id: `not-${Date.now()}`,
    };
    notices.unshift(newNotice);
    this.setItem(STORAGE_KEYS.NOTICES, notices);

    // Broadcast in-app notifications
    if (data.targetAudience === 'All' || data.targetAudience === 'Students') {
      const students = this.getStudents().filter(s => !data.batchId || s.batchId === data.batchId);
      students.forEach(s => {
        this.createNotification({
          recipientType: 'student',
          recipientId: s.id,
          title: `📢 Notice: ${data.title}`,
          message: data.description.length > 100 ? data.description.substring(0, 97) + '...' : data.description,
          link: '/student/notices',
          type: 'notice',
        });
      });

      this.sendPushNotification(`📢 Notice: ${data.title}`, data.description);
    }

    return newNotice;
  }

  // NOTIFICATIONS
  getNotifications(recipientType: 'admin' | 'student' | 'enquiry', recipientId?: string): InAppNotification[] {
    const all = this.getItem<InAppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
    return all
      .filter(n => {
        if (n.recipientType !== recipientType) return false;
        if (recipientType === 'admin') return true;
        return n.recipientId === recipientId;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createNotification(data: Omit<InAppNotification, 'id' | 'isRead' | 'createdAt'>): InAppNotification {
    const all = this.getItem<InAppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
    const newNotif: InAppNotification = {
      ...data,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    all.unshift(newNotif);
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, all);
    return newNotif;
  }

  markNotificationAsRead(id: string): void {
    const all = this.getItem<InAppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
    const index = all.findIndex(n => n.id === id);
    if (index !== -1) {
      all[index].isRead = true;
      this.setItem(STORAGE_KEYS.NOTIFICATIONS, all);
    }
  }

  markAllNotificationsAsRead(recipientType: 'admin' | 'student' | 'enquiry', recipientId?: string): void {
    const all = this.getItem<InAppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
    const updated = all.map(n => {
      if (n.recipientType === recipientType && (recipientType === 'admin' || n.recipientId === recipientId)) {
        return { ...n, isRead: true };
      }
      return n;
    });
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, updated);
  }

  // WEBSITE SETTINGS
  getWebsiteSettings(): WebsiteSettings {
    return this.getItem<WebsiteSettings>(STORAGE_KEYS.WEBSITE_SETTINGS, SEED_WEBSITE_SETTINGS);
  }

  getSettings(): WebsiteSettings {
    return this.getWebsiteSettings();
  }

  updateWebsiteSettings(data: Partial<WebsiteSettings>): WebsiteSettings {
    const current = this.getWebsiteSettings();
    const updated = { ...current, ...data };
    this.setItem(STORAGE_KEYS.WEBSITE_SETTINGS, updated);
    return updated;
  }

  updateSettings(data: Partial<WebsiteSettings>): WebsiteSettings {
    return this.updateWebsiteSettings(data);
  }

  // ALIAS & COMPATIBILITY HELPERS
  getFees(): FeePayment[] {
    return this.getFeePayments();
  }

  getStudentFees(studentId: string): FeePayment[] {
    return this.getFeePaymentsByStudent(studentId);
  }

  getStudentAttendance(studentId: string): AttendanceRecord[] {
    return this.getAttendanceByStudent(studentId);
  }

  getStudentTests(studentId: string): any[] {
    return this.getTestResultsByStudent(studentId);
  }

  recordTestScore(
    testIdOrData: string | {
      testTitle?: string;
      courseId?: string;
      batchId?: string;
      subject?: string;
      testDate?: string;
      totalMarks?: number;
      studentId: string;
      marksObtained: number;
      rank?: number;
      remarks?: string;
    },
    studentId?: string,
    marks?: number,
    remarks?: string
  ): void {
    if (typeof testIdOrData === 'object') {
      const data = testIdOrData;
      const testId = `test-${Date.now()}`;
      this.submitTestResults(testId, [{
        studentId: data.studentId,
        marksObtained: data.marksObtained,
        teacherRemarks: data.remarks
      }]);
    } else {
      this.submitTestResults(testIdOrData, [{ studentId: studentId!, marksObtained: marks || 0, teacherRemarks: remarks }]);
    }
  }

  recordAttendance(
    batchIdOrRecord: string | {
      studentId: string;
      courseId?: string;
      batchId: string;
      subject?: string;
      date: string;
      status: string;
      remarks?: string;
    },
    date?: string,
    records?: Array<{ studentId: string; status: 'present' | 'absent' | 'late' | 'excused'; remarks?: string }>,
    markedBy: string = 'Admin Desk'
  ): void {
    if (typeof batchIdOrRecord === 'object') {
      const rec = batchIdOrRecord;
      const normalizedStatus = (rec.status.toLowerCase() === 'absent' ? 'absent' : rec.status.toLowerCase() === 'late' ? 'late' : 'present') as 'present' | 'absent' | 'late';
      this.markBatchAttendance(rec.batchId, rec.date, [{
        studentId: rec.studentId,
        status: normalizedStatus,
        remarks: rec.remarks
      }], 'Admin Desk');
    } else {
      this.markBatchAttendance(batchIdOrRecord, date!, records || [], markedBy);
    }
  }

  addNotice(data: Omit<Notice, 'id' | 'createdAt'>): Notice {
    return this.createNotice(data);
  }

  updateEnquiry(id: string, data: Partial<Enquiry>): Enquiry | undefined {
    return this.updateEnquiryStatus(
      id,
      (data.status || 'Contacted') as EnquiryStatus,
      data.internalNotes,
      data.assignedTeacherId
    );
  }

  // ADMIN CREDENTIALS MANAGEMENT
  getAdminCredentials(): { username: string; password: string } {
    return this.getItem<{ username: string; password: string }>('apex_admin_creds_v1', {
      username: 'admin@apex.edu',
      password: 'Admin@123',
    });
  }

  updateAdminCredentials(username: string, password: string): { username: string; password: string } {
    const creds = { username, password };
    this.setItem('apex_admin_creds_v1', creds);
    return creds;
  }

  // SEO SETTINGS
  getSEOSettings(): SEOSettings {
    return this.getItem<SEOSettings>(STORAGE_KEYS.SEO_SETTINGS, SEED_SEO_SETTINGS);
  }

  updateSEOSettings(data: Partial<SEOSettings>): SEOSettings {
    const current = this.getSEOSettings();
    const updated = { ...current, ...data };
    this.setItem(STORAGE_KEYS.SEO_SETTINGS, updated);
    return updated;
  }

  // Bulk save sync methods
  saveCourses(courses: Course[]): void {
    this.setItem(STORAGE_KEYS.COURSES, courses);
  }

  saveBatches(batches: Batch[]): void {
    this.setItem(STORAGE_KEYS.BATCHES, batches);
  }

  saveTeachers(teachers: Teacher[]): void {
    this.setItem(STORAGE_KEYS.TEACHERS, teachers);
  }

  saveStudents(students: Student[]): void {
    this.setItem(STORAGE_KEYS.STUDENTS, students);
  }

  saveEnquiries(enquiries: Enquiry[]): void {
    this.setItem(STORAGE_KEYS.ENQUIRIES, enquiries);
  }

  saveStudyMaterials(materials: StudyMaterial[]): void {
    this.setItem(STORAGE_KEYS.STUDY_MATERIALS, materials);
  }

  saveTests(tests: Test[]): void {
    this.setItem(STORAGE_KEYS.TESTS, tests);
  }

  saveNotices(notices: Notice[]): void {
    this.setItem(STORAGE_KEYS.NOTICES, notices);
  }

  saveSettings(settings: WebsiteSettings): void {
    this.setItem(STORAGE_KEYS.WEBSITE_SETTINGS, settings);
  }

  // Reset to seed data
  resetAllData(): void {
    localStorage.clear();
    this.setItem(STORAGE_KEYS.TEACHERS, SEED_TEACHERS);
    this.setItem(STORAGE_KEYS.COURSES, SEED_COURSES);
    this.setItem(STORAGE_KEYS.BATCHES, SEED_BATCHES);
    this.setItem(STORAGE_KEYS.SUBJECTS, SEED_SUBJECTS);
    this.setItem(STORAGE_KEYS.ENQUIRIES, SEED_ENQUIRIES);
    this.setItem(STORAGE_KEYS.ENQUIRY_MESSAGES, SEED_ENQUIRY_MESSAGES);
    this.setItem(STORAGE_KEYS.STUDENTS, SEED_STUDENTS);
    this.setItem(STORAGE_KEYS.ATTENDANCE, SEED_ATTENDANCE);
    this.setItem(STORAGE_KEYS.FEE_PAYMENTS, SEED_FEE_PAYMENTS);
    this.setItem(STORAGE_KEYS.STUDY_MATERIALS, SEED_STUDY_MATERIALS);
    this.setItem(STORAGE_KEYS.TESTS, SEED_TESTS);
    this.setItem(STORAGE_KEYS.TEST_RESULTS, SEED_TEST_RESULTS);
    this.setItem(STORAGE_KEYS.STUDENT_PROGRESS, SEED_STUDENT_PROGRESS);
    this.setItem(STORAGE_KEYS.NOTICES, SEED_NOTICES);
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
    this.setItem(STORAGE_KEYS.WEBSITE_SETTINGS, SEED_WEBSITE_SETTINGS);
    this.setItem(STORAGE_KEYS.SEO_SETTINGS, SEED_SEO_SETTINGS);
  }
}

export const storage = new StorageService();
