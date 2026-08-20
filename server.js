import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads folder for uploaded cloud files & images
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Cloud Upload API Endpoint for Images and Files
app.post('/api/upload', (req, res) => {
  try {
    const { base64Data, fileName, folder } = req.body;
    if (!base64Data) {
      return res.status(400).json({ error: 'No file data provided' });
    }

    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid Base64 format' });
    }

    const mimeType = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const safeName = `${Date.now()}_${(fileName || 'file').replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const targetSubfolder = path.join(UPLOADS_DIR, folder || 'general');
    
    if (!fs.existsSync(targetSubfolder)) {
      fs.mkdirSync(targetSubfolder, { recursive: true });
    }

    const filePath = path.join(targetSubfolder, safeName);
    fs.writeFileSync(filePath, buffer);

    const fileUrl = `http://localhost:${PORT}/uploads/${folder || 'general'}/${safeName}`;
    res.json({
      success: true,
      url: fileUrl,
      fileName: safeName,
      mimeType,
      sizeBytes: buffer.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// File storage path for backend persistence
const DATA_FILE = path.join(__dirname, 'backend_db.json');

// Default initial backend dataset
const initialDatabase = {
  settings: {
    instituteName: "Apex Coaching Academy",
    tagline: "Premier Physical Classroom & Board-Targeted Tuition",
    founderName: "Dr. Rajesh Sharma",
    founderTitle: "Founder & Senior Physics Mentor (Ph.D., Ex-HOD)",
    phone: "+91 98234 56789",
    whatsappPhone: "+91 98234 56789",
    email: "admissions@apexacademy.edu",
    address: "Civil Lines, Near University Gate, Main Road, City",
    googleMapsEmbedUrl: "https://maps.google.com/?q=Civil+Lines",
    openingHours: "Mon - Sat: 06:30 AM - 08:30 PM | Sun: 08:00 AM - 01:00 PM",
    heroTitle: "Master Concepts, Excel in Board Exams & Competitive Tests",
    heroSubtitle: "Dedicated physical classroom coaching for Class 9, 10, 11 & 12 (PCM / PCB) with expert faculty, disciplined routine, and small batch focus.",
    heroBannerUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80",
    noticeBoardText: "🚀 Admissions Open for 2026-27 Batches! Limited seats per batch (25-30 students max). Register now for scholarship test.",
    isAcceptingEnquiries: true,
    results: [
      { id: 'res-1', studentName: 'Aarav Gupta', examName: 'CBSE Class 12 Science', score: '98.6%', rank: 'City Topper', year: '2025', subjectHighlights: 'Physics 100/100, Maths 99/100', photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80' },
      { id: 'res-2', studentName: 'Riya Verma', examName: 'NEET UG Medical', score: '685 / 720', rank: 'AIR 1,420', year: '2025', subjectHighlights: 'Biology 355/360, Chemistry 170/180', photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80' },
      { id: 'res-3', studentName: 'Karan Sharma', examName: 'JEE Main Engineering', score: '99.4 Percentile', rank: 'AIR 3,890', year: '2025', subjectHighlights: 'Maths 99.8%ile, Physics 99.5%ile', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
    ],
    testimonials: [
      { id: 'tst-1', parentOrStudentName: 'Sanjay Sharma (Parent of Karan)', role: 'Parent', studentClass: 'Class 12 PCM', message: 'Dr. Rajesh Sharma sir’s physical classroom guidance in Physics changed everything for Karan. The regular tests and discipline were unmatched.', rating: 5, date: '2025-06-15' },
      { id: 'tst-2', parentOrStudentName: 'Riya Verma', role: 'Student (Batch of 2025)', studentClass: 'Class 12 PCB', message: 'The faculty members here care about every single student. Doubt counters helped me clear my weak topics before the board exams.', rating: 5, date: '2025-06-20' },
    ],
    gallery: [
      { id: 'g-1', title: 'Classroom Lecture Hall 1', category: 'Classroom', imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80', description: 'Air-conditioned digital classroom with comfortable individual seating' },
      { id: 'g-2', title: 'Physics Laboratory Demonstration', category: 'Lab', imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80', description: 'Hands-on practical experiments and concept visualizer setups' },
    ]
  },
  courses: [
    { id: 'c-1', name: 'Class 12 PCM Elite Coaching', code: 'PCM-12', classGrade: 'Class 12', stream: 'PCM', description: 'Intensive offline physical classroom batch covering Physics, Chemistry, and Mathematics for CBSE Boards + JEE Main foundation.', monthlyFee: 4500, admissionFee: 1500, totalSubjects: 3, durationMonths: 10, bannerUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80', isActive: true },
    { id: 'c-2', name: 'Class 12 PCB Medical Target', code: 'PCB-12', classGrade: 'Class 12', stream: 'PCB', description: 'Comprehensive offline classroom tuition covering Physics, Chemistry, and Biology with deep NCERT line-by-line focus.', monthlyFee: 4500, admissionFee: 1500, totalSubjects: 3, durationMonths: 10, bannerUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80', isActive: true },
    { id: 'c-3', name: 'Class 11 PCM Foundation Batch', code: 'PCM-11', classGrade: 'Class 11', stream: 'PCM', description: 'Bridging the Class 10 to 11 transition with deep conceptual clarity and derivation practice.', monthlyFee: 4000, admissionFee: 1500, totalSubjects: 3, durationMonths: 11, bannerUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80', isActive: true },
    { id: 'c-4', name: 'Class 10 Science & Maths Super 30', code: 'SM-10', classGrade: 'Class 10', stream: 'General', description: 'High-focus offline classroom batch designed to secure 95%+ in Class 10 Board Examinations.', monthlyFee: 3200, admissionFee: 1000, totalSubjects: 2, durationMonths: 10, bannerUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&auto=format&fit=crop&q=80', isActive: true },
  ],
  teachers: [
    { id: 't-1', name: 'Dr. Rajesh Sharma', email: 'rajesh.sharma@apexacademy.edu', phone: '+91 98234 56789', designation: 'Founder & Senior Physics Faculty', qualification: 'Ph.D. in Physics, Ex-HOD Kota Institute', experienceYears: 18, subjects: ['Physics (Class 11-12)', 'JEE/NEET Mechanics & Electrodynamics'], photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', bio: 'Dedicated physical classroom educator with 18+ years mentoring students to top ranks.', rating: 4.9, status: 'active' },
    { id: 't-2', name: 'Mrs. Ananya Sen', email: 'ananya.sen@apexacademy.edu', phone: '+91 98234 56790', designation: 'Senior Mathematics Mentor', qualification: 'M.Sc. Applied Mathematics (Gold Medalist)', experienceYears: 14, subjects: ['Mathematics (Class 10-12)', 'Calculus & Coordinate Geometry'], photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80', bio: 'Known for simplifying complex calculus and vector 3D concepts through interactive demonstrations.', rating: 4.9, status: 'active' },
  ],
  batches: [
    { id: 'b-1', name: 'Class 12 PCM - Morning Elite (Batch A)', courseId: 'c-1', teacherId: 't-1', roomNo: 'Classroom Hall 1 (Ground Floor)', daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], startTime: '06:45 AM', endTime: '08:45 AM', maxStudents: 28, currentEnrolled: 22, isActive: true },
    { id: 'b-2', name: 'Class 12 PCM - Evening Focus (Batch B)', courseId: 'c-1', teacherId: 't-1', roomNo: 'Classroom Hall 1 (Ground Floor)', daysOfWeek: ['Mon', 'Wed', 'Fri', 'Sat'], startTime: '05:00 PM', endTime: '07:30 PM', maxStudents: 28, currentEnrolled: 25, isActive: true },
  ],
  students: [
    { id: 'std-1', rollNumber: 'APEX-2026-001', name: 'Rahul Khan', parentName: 'Irfan Khan', phone: '+91 98765 43210', parentPhone: '+91 98765 43211', email: 'rahul.khan@example.com', studentClass: 'Class 12', stream: 'PCM', courseId: 'c-1', batchId: 'b-2', joinDate: '2026-04-10', monthlyFee: 4500, feeStatus: 'Paid', totalFeesDue: 0, photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80', status: 'Active', attendancePercentage: 94.5, averageTestScore: 89.2 },
    { id: 'std-2', rollNumber: 'APEX-2026-002', name: 'Sneha Patel', parentName: 'Mahesh Patel', phone: '+91 98111 22334', parentPhone: '+91 98111 22335', email: 'sneha.patel@example.com', studentClass: 'Class 12', stream: 'PCB', courseId: 'c-2', batchId: 'b-3', joinDate: '2026-04-12', monthlyFee: 4500, feeStatus: 'Pending', totalFeesDue: 4500, photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80', status: 'Active', attendancePercentage: 96.0, averageTestScore: 91.8 },
  ],
  enquiries: [
    { id: 'enq-1', enquiryCode: 'TUI-48291', studentName: 'Rahul Khan', parentName: 'Irfan Khan', phone: '+91 98765 43210', email: 'rahul.khan@example.com', studentClass: 'Class 12', stream: 'PCM', subjects: ['Physics', 'Chemistry', 'Mathematics'], preferredBatch: 'Evening 05:00 PM (Batch B)', message: 'Looking for disciplined offline tuition near Civil Lines.', previousPercentage: 88.4, source: 'Friend / Word of Mouth', status: 'Discussion', assignedTeacherId: 't-1', verificationCode: '4829', createdAt: '2026-08-12T10:30:00Z', updatedAt: '2026-08-13T14:20:00Z' },
  ],
  enquiry_messages: [
    { id: 'msg-1', enquiryId: 'enq-1', senderRole: 'student', senderName: 'Rahul Khan', message: 'Hello Sir, is evening batch 5 PM open for Class 12 PCM?', timestamp: '2026-08-12T10:32:00Z' },
    { id: 'msg-2', enquiryId: 'enq-1', senderRole: 'teacher', senderName: 'Dr. Rajesh Sharma', message: 'Welcome Rahul! Yes, Batch B has 3 vacant seats remaining. You can visit tomorrow at 4 PM.', timestamp: '2026-08-12T11:05:00Z' }
  ],
  study_materials: [
    { id: 'mat-1', title: 'Class 12 Physics: Electrostatics Handwritten Derivations', subject: 'Physics', description: 'Comprehensive theory derivations, electric flux proofs, and solved board numericals.', classSemester: 'Class 12', category: 'PDF Notes', driveUrl: 'https://drive.google.com/file/d/1B7B5w93bA9c_m8k7HqL9x_SamplePhysicsNotes/view?usp=sharing', date: '2026-08-10', chapter: 'Electrostatics', isPublished: true, fileSize: '4.8 MB', createdAt: '2026-08-10T10:00:00Z', updatedAt: '2026-08-10T10:00:00Z' },
    { id: 'mat-2', title: 'Class 12 Mathematics: Calculus DPP 05', subject: 'Mathematics', description: 'Daily Practice Problem sheet containing 30 graded problems on chain rule and derivatives.', classSemester: 'Class 12', category: 'DPP', driveUrl: 'https://drive.google.com/file/d/1C8C6x94cB0d_n9l8IrM0y_SampleMathsDPP/view?usp=sharing', date: '2026-08-12', chapter: 'Calculus', isPublished: true, fileSize: '2.1 MB', createdAt: '2026-08-12T14:30:00Z', updatedAt: '2026-08-12T14:30:00Z' }
  ],
  tests: [
    { id: 'tst-101', title: 'Class 12 Physics Chapter Test: Electrostatics & Potential', subject: 'Physics', classGrade: 'Class 12', batchId: 'b-1', testDate: '2026-08-08', totalMarks: 50, durationMinutes: 90, syllabus: 'Electric Charge, Coulomb Law, Electric Field Lines, Gauss Law', status: 'Completed', highestScore: 49, averageScore: 41.2 },
  ],
  test_results: [
    { id: 'tr-1', testId: 'tst-101', studentId: 'std-1', marksObtained: 47, totalMarks: 50, percentage: 94.0, rank: 2, remarks: 'Excellent derivation steps. Minor arithmetic slip in final calculation.', evaluatedAt: '2026-08-09' }
  ],
  notices: [
    { id: 'not-1', title: 'Weekly Physics & Chemistry Unit Tests Scheduled for Sunday', content: 'All Class 12 PCM & PCB students are hereby informed that the weekly Sunday unit test will take place at 09:00 AM.', date: '2026-08-13', category: 'Exam Schedule', targetAudience: 'Public', isPinned: true, author: 'Dr. Rajesh Sharma' }
  ],
  attendance: [],
  fee_payments: []
};

const firebaseConfigPath = path.join(__dirname, 'firebase-applet-config.json');
let firebaseConfig = {};
try {
  if (fs.existsSync(firebaseConfigPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));
  }
} catch (err) {
  console.error('Error reading firebase-applet-config.json:', err);
}

let dbInstance = null;
if (firebaseConfig.projectId) {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    dbInstance = getFirestore(firebaseApp);
    console.log(`🔥 Firebase Firestore backend initialized for project: ${firebaseConfig.projectId}`);
    
    // Authenticate backend client anonymously to satisfy security rules
    const authInstance = getAuth(firebaseApp);
    signInAnonymously(authInstance)
      .then(() => console.log('👤 Backend authenticated anonymously with Firebase'))
      .catch(err => console.warn('Backend anonymous auth failed (continuing as unauthenticated):', err.message));
  } catch (err) {
    console.error('Failed to initialize Firebase Firestore in server.js:', err);
  }
} else {
  console.log('⚠️ Firebase Config is missing or incomplete; backend operating in local-only mode.');
}

// Helper: load DB
const loadDB = async () => {
  if (dbInstance) {
    try {
      const docRef = doc(dbInstance, 'apex_coaching', 'db');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('Successfully loaded database from Firestore');
        return data;
      } else {
        console.log('No database document in Firestore. Seeding with initial database.');
        await setDoc(docRef, initialDatabase);
        return initialDatabase;
      }
    } catch (err) {
      console.error('Error reading from Firestore, falling back to local file:', err);
    }
  }

  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialDatabase, null, 2));
      return initialDatabase;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading backend database file:', err);
    return initialDatabase;
  }
};

// Helper: save DB
const saveDB = async (data) => {
  if (dbInstance) {
    try {
      const docRef = doc(dbInstance, 'apex_coaching', 'db');
      await setDoc(docRef, data);
      console.log('Successfully saved database to Firestore');
      return;
    } catch (err) {
      console.error('Error writing to Firestore, falling back to local file:', err);
    }
  }

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing backend database file:', err);
  }
};

// ----------------------------------------------------------------------------
// REST API ROUTES
// ----------------------------------------------------------------------------

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    server: 'Apex Coaching Academy Express Backend API',
    timestamp: new Date().toISOString(),
    dbPath: DATA_FILE,
    firebaseConnected: !!dbInstance,
  });
});

// Get Snapshot of All Data
app.get('/api/all', async (req, res) => {
  try {
    const db = await loadDB();
    res.json(db);
  } catch (err) {
    console.error('GET /api/all failed:', err);
    res.status(500).json({ error: err.message });
  }
});

// Full Sync Endpoint
app.post('/api/sync', async (req, res) => {
  try {
    const payload = req.body;
    const db = await loadDB();
    const updated = { ...db, ...payload, updatedAt: new Date().toISOString() };
    await saveDB(updated);
    res.json({ success: true, message: 'Backend data successfully synchronized.', timestamp: new Date().toISOString() });
  } catch (err) {
    console.error("Database save failed:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Settings Endpoints
app.get('/api/settings', async (req, res) => {
  try {
    const db = await loadDB();
    res.json(db.settings || {});
  } catch (err) {
    console.error('GET /api/settings failed:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const db = await loadDB();
    db.settings = { ...db.settings, ...req.body };
    await saveDB(db);
    res.json(db.settings);
  } catch (err) {
    console.error('PUT /api/settings failed:', err);
    res.status(500).json({ error: err.message });
  }
});

// Generic Collection CRUD Handlers
const createCrudRoutes = (collectionName) => {
  app.get(`/api/${collectionName}`, async (req, res) => {
    try {
      const db = await loadDB();
      res.json(db[collectionName] || []);
    } catch (err) {
      console.error(`GET /api/${collectionName} failed:`, err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post(`/api/${collectionName}`, async (req, res) => {
    try {
      const db = await loadDB();
      const items = db[collectionName] || [];
      const newItem = { id: req.body.id || `${collectionName.slice(0, 3)}-${Date.now()}`, ...req.body, createdAt: new Date().toISOString() };
      items.unshift(newItem);
      db[collectionName] = items;
      await saveDB(db);
      res.status(201).json(newItem);
    } catch (err) {
      console.error(`POST /api/${collectionName} failed:`, err);
      res.status(500).json({ error: err.message });
    }
  });

  app.put(`/api/${collectionName}/:id`, async (req, res) => {
    try {
      const db = await loadDB();
      const items = db[collectionName] || [];
      const index = items.findIndex((i) => i.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ error: 'Item not found' });
      }
      items[index] = { ...items[index], ...req.body, updatedAt: new Date().toISOString() };
      db[collectionName] = items;
      await saveDB(db);
      res.json(items[index]);
    } catch (err) {
      console.error(`PUT /api/${collectionName}/${req.params.id} failed:`, err);
      res.status(500).json({ error: err.message });
    }
  });

  app.delete(`/api/${collectionName}/:id`, async (req, res) => {
    try {
      const db = await loadDB();
      let items = db[collectionName] || [];
      items = items.filter((i) => i.id !== req.params.id);
      db[collectionName] = items;
      await saveDB(db);
      res.json({ success: true, id: req.params.id });
    } catch (err) {
      console.error(`DELETE /api/${collectionName}/${req.params.id} failed:`, err);
      res.status(500).json({ error: err.message });
    }
  });
};

// Register collections
['courses', 'teachers', 'batches', 'students', 'enquiries', 'study_materials', 'tests', 'test_results', 'notices', 'attendance', 'fee_payments'].forEach(createCrudRoutes);

// Enquiry Messages Specific Endpoint
app.get('/api/enquiry-messages/:enquiryId', async (req, res) => {
  try {
    const db = await loadDB();
    const messages = (db.enquiry_messages || []).filter(m => m.enquiryId === req.params.enquiryId);
    res.json(messages);
  } catch (err) {
    console.error(`GET /api/enquiry-messages/${req.params.enquiryId} failed:`, err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/enquiry-messages', async (req, res) => {
  try {
    const db = await loadDB();
    const messages = db.enquiry_messages || [];
    const newMsg = { id: `msg-${Date.now()}`, ...req.body, timestamp: new Date().toISOString() };
    messages.push(newMsg);
    db.enquiry_messages = messages;
    await saveDB(db);
    res.status(201).json(newMsg);
  } catch (err) {
    console.error('POST /api/enquiry-messages failed:', err);
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend static files if built
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`⚡ Apex Coaching Express Backend API Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`⚠️ Port ${PORT} is already in use. The backend API server is already running!`);
  } else {
    console.error('Server listener error:', err);
  }
});
