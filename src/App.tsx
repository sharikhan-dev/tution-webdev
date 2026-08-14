import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { storage } from './services/storage';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroSection } from './components/marketing/HeroSection';
import { AboutTeacherSection } from './components/marketing/AboutTeacherSection';
import { CoursesSection } from './components/marketing/CoursesSection';
import { BatchesSection } from './components/marketing/BatchesSection';
import { ResultsSection } from './components/marketing/ResultsSection';
import { TestimonialsSection } from './components/marketing/TestimonialsSection';
import { NoticesSection } from './components/marketing/NoticesSection';
import { GallerySection } from './components/marketing/GallerySection';
import { ContactSection } from './components/marketing/ContactSection';
import { AdmissionEnquiryModal } from './components/marketing/AdmissionEnquiryModal';
import { LoginModal } from './components/auth/LoginModal';
import { EnquiryChatRoom } from './components/enquiry/EnquiryChatRoom';
import { StudentPortal } from './components/student/StudentPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { BackendModal } from './components/common/BackendModal';
import { WebsiteSettings, Course, Batch, Teacher, Notice } from './types';

const MainApp: React.FC = () => {
  const { role, switchRoleDemo, logout } = useAuth();

  // Primary view mode
  const [currentView, setCurrentView] = useState<'marketing' | 'student' | 'admin' | 'enquiry'>('marketing');
  const [activeEnquiryCode, setActiveEnquiryCode] = useState<string>('TUI-48291');

  // Modals state
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalTab, setLoginModalTab] = useState<'student' | 'admin' | 'enquiry'>('student');
  const [backendModalOpen, setBackendModalOpen] = useState(false);

  // Pre-filled enquiry state
  const [initialEnquiryCourse, setInitialEnquiryCourse] = useState('');
  const [initialEnquiryClass, setInitialEnquiryClass] = useState('Class 12');
  const [initialEnquiryBatch, setInitialEnquiryBatch] = useState('');

  // Active section for navbar highlight
  const [activeSection, setActiveSection] = useState('home');

  // Dynamic Data
  const [settings, setSettings] = useState<WebsiteSettings>(storage.getSettings());
  const [courses, setCourses] = useState<Course[]>(storage.getCourses());
  const [batches, setBatches] = useState<Batch[]>(storage.getBatches());
  const [teachers, setTeachers] = useState<Teacher[]>(storage.getTeachers());
  const [notices, setNotices] = useState<Notice[]>(storage.getNotices('Public'));

  const refreshData = () => {
    setSettings(storage.getSettings());
    setCourses(storage.getCourses());
    setBatches(storage.getBatches());
    setTeachers(storage.getTeachers());
    setNotices(storage.getNotices('Public'));
  };

  const handleSignOut = () => {
    logout();
    setCurrentView('marketing');
    try {
      if (window.location.pathname.includes('/admin') || window.location.search.includes('admin=true')) {
        window.history.pushState(null, '', '/');
      }
      if (window.location.hash.includes('admin')) {
        window.history.pushState(null, '', window.location.pathname || '/');
      }
    } catch (e) {
      console.error('Sign out error:', e);
    }
  };

  useEffect(() => {
    refreshData();
    const handleDataChanged = () => refreshData();
    window.addEventListener('apex_data_changed', handleDataChanged);
    return () => window.removeEventListener('apex_data_changed', handleDataChanged);
  }, []);

  // Secret URL route & secret hotkey trigger for Admin Access
  useEffect(() => {
    const checkSecretRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();

      if (
        pathname.includes('/admin') ||
        pathname === '/admin' ||
        hash === '#admin' ||
        hash === '#admin-login' ||
        search.includes('admin=true')
      ) {
        if (role !== 'admin') {
          switchRoleDemo('admin');
        }
        setCurrentView('admin');
      }
    };

    checkSecretRoute();
    window.addEventListener('hashchange', checkSecretRoute);
    window.addEventListener('popstate', checkSecretRoute);

    // Secret hotkey shortcut: Ctrl + Shift + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        switchRoleDemo('admin');
        setCurrentView('admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkSecretRoute);
      window.removeEventListener('popstate', checkSecretRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [switchRoleDemo, role]);

  // Synchronize view when Auth role changes
  useEffect(() => {
    if (role === 'admin' && currentView !== 'admin') {
      setCurrentView('admin');
    } else if (role === 'student' && currentView !== 'student') {
      setCurrentView('student');
    } else if (role === 'visitor' && (currentView === 'admin' || currentView === 'student')) {
      setCurrentView('marketing');
    }
  }, [role, currentView]);

  const handleNavigateSection = (sectionId: string) => {
    if (currentView !== 'marketing') {
      setCurrentView('marketing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveSection(sectionId);
  };

  const handleOpenCourseEnquiry = (courseName: string, classGrade: string) => {
    setInitialEnquiryCourse(courseName);
    setInitialEnquiryClass(classGrade);
    setEnquiryModalOpen(true);
  };

  const handleOpenBatchEnquiry = (batchName: string) => {
    setInitialEnquiryBatch(batchName);
    setEnquiryModalOpen(true);
  };

  const handleOpenLogin = (defaultTab: 'student' | 'admin' | 'enquiry' = 'student') => {
    setLoginModalTab(defaultTab);
    setLoginModalOpen(true);
  };

  const handleOpenEnquiryRoom = (code: string = 'TUI-48291') => {
    setActiveEnquiryCode(code);
    setCurrentView('enquiry');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      {/* VIEW: MARKETING WEBSITE */}
      {currentView === 'marketing' && (
        <>
          <Navbar
            settings={settings}
            onOpenEnquiryModal={() => setEnquiryModalOpen(true)}
            onOpenLoginModal={handleOpenLogin}
            onNavigateSection={handleNavigateSection}
            onOpenStudentPortal={() => {
              switchRoleDemo('student');
              setCurrentView('student');
            }}
            onOpenAdminPortal={() => {
              switchRoleDemo('admin');
              setCurrentView('admin');
            }}
            onOpenEnquiryRoom={handleOpenEnquiryRoom}
            activeSection={activeSection}
          />

          <main id="home">
            <HeroSection
              settings={settings}
              onOpenEnquiryModal={() => setEnquiryModalOpen(true)}
              onNavigateSection={handleNavigateSection}
              onOpenEnquiryRoom={() => handleOpenEnquiryRoom('TUI-48291')}
            />

            <AboutTeacherSection
              teachers={teachers}
              onOpenEnquiryModal={() => setEnquiryModalOpen(true)}
            />

            <CoursesSection
              courses={courses}
              onSelectCourseForEnquiry={handleOpenCourseEnquiry}
            />

            <BatchesSection
              batches={batches}
              courses={courses}
              teachers={teachers}
              onSelectBatchForEnquiry={handleOpenBatchEnquiry}
            />

            <ResultsSection
              results={settings.results}
              onOpenEnquiryModal={() => setEnquiryModalOpen(true)}
            />

            <TestimonialsSection
              testimonials={settings.testimonials}
            />

            <NoticesSection
              notices={notices}
            />

            <GallerySection
              gallery={settings.gallery}
            />

            <ContactSection
              settings={settings}
              onOpenEnquiryModal={() => setEnquiryModalOpen(true)}
            />
          </main>

          <Footer
            settings={settings}
            onNavigateSection={handleNavigateSection}
            onOpenEnquiryModal={() => setEnquiryModalOpen(true)}
            onOpenLoginModal={handleOpenLogin}
          />
        </>
      )}

      {/* VIEW: ENQUIRY SECURE CHAT ROOM */}
      {currentView === 'enquiry' && (
        <div className="flex-1 flex flex-col">
          <EnquiryChatRoom
            initialEnquiryCode={activeEnquiryCode}
            onBackToWebsite={() => setCurrentView('marketing')}
            onOpenStudentPortal={() => {
              switchRoleDemo('student');
              setCurrentView('student');
            }}
          />
        </div>
      )}

      {/* VIEW: STUDENT LMS PORTAL */}
      {currentView === 'student' && (
        <StudentPortal
          onBackToWebsite={handleSignOut}
        />
      )}

      {/* VIEW: ADMIN CRM PORTAL */}
      {currentView === 'admin' && (
        <AdminPortal
          onBackToWebsite={handleSignOut}
          onOpenEnquiryRoomDirect={(code) => {
            setActiveEnquiryCode(code);
            setCurrentView('enquiry');
          }}
        />
      )}

      {/* MODAL: ADMISSION ENQUIRY */}
      <AdmissionEnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        courses={courses}
        batches={batches}
        initialCourse={initialEnquiryCourse}
        initialClass={initialEnquiryClass}
        initialBatch={initialEnquiryBatch}
        onOpenEnquiryRoom={(code) => {
          setActiveEnquiryCode(code);
          setCurrentView('enquiry');
        }}
      />

      {/* MODAL: LOGIN / ENQUIRY TRACKER */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        defaultTab={loginModalTab}
        onOpenEnquiryRoom={(code) => {
          setActiveEnquiryCode(code);
          setCurrentView('enquiry');
        }}
        onLoginSuccess={(targetRole) => {
          if (targetRole === 'admin') {
            setCurrentView('admin');
          } else {
            setCurrentView('student');
          }
        }}
      />

      {/* MODAL: BACKEND & DATABASE CONNECTION */}
      <BackendModal
        isOpen={backendModalOpen}
        onClose={() => setBackendModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
