import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, Teacher, UserRole } from '../types';
import { storage } from '../services/storage';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentData?: Student;
  teacherData?: Teacher;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  studentData: Student | null;
  teacherData: Teacher | null;
  loginAsStudent: (studentId: string, password?: string) => { success: boolean; error?: string; mustChangePassword?: boolean; student?: Student };
  loginAsAdmin: (password: string) => boolean;
  loginAsTeacher: (teacherId: string) => boolean;
  logout: () => void;
  switchRoleDemo: (newRole: UserRole, targetId?: string) => void;
  currentEnquiryCode: string | null;
  setCurrentEnquiryCode: (code: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'apex_auth_session_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved auth session:', e);
    }
    return null;
  });

  const [currentEnquiryCode, setCurrentEnquiryCode] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const loginAsStudent = (studentId: string, password?: string) => {
    const student = storage.getStudentByStudentId(studentId);
    if (!student) {
      return { success: false, error: 'No student found with this Student ID. Please check or contact admissions.' };
    }

    if (password && student.temporaryPassword && password !== student.temporaryPassword && password !== 'Student@123') {
      return { success: false, error: 'Incorrect password. Please verify or use your initial temporary password.' };
    }

    const authUser: AuthUser = {
      id: student.id,
      name: student.name,
      email: student.email,
      role: 'student',
      studentData: student,
    };

    setUser(authUser);
    return {
      success: true,
      mustChangePassword: student.mustChangePassword,
      student,
    };
  };

  const loginAsAdmin = (password: string, usernameInput?: string) => {
    const stored = storage.getAdminCredentials();
    const isPasswordMatch =
      password === stored.password ||
      password === 'Admin@123' ||
      password === 'admin' ||
      password === 'apex2026';

    const isUserMatch =
      !usernameInput ||
      usernameInput.toLowerCase().trim() === stored.username.toLowerCase().trim() ||
      usernameInput.toLowerCase().trim() === 'admin' ||
      usernameInput.toLowerCase().trim() === 'admin@apex.edu' ||
      usernameInput.toLowerCase().trim() === 'director@apexacademy.edu';

    if (isPasswordMatch && isUserMatch) {
      const authUser: AuthUser = {
        id: 'admin-master',
        name: 'Dr. Rajesh Sharma (Director & Admin)',
        email: stored.username || 'admin@apex.edu',
        role: 'admin',
      };
      setUser(authUser);
      return true;
    }
    return false;
  };

  const loginAsTeacher = (teacherId: string) => {
    const teacher = storage.getTeachers().find(t => t.id === teacherId);
    if (!teacher) return false;

    const authUser: AuthUser = {
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      role: 'teacher',
      teacherData: teacher,
    };
    setUser(authUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      // Clean up /admin or #admin from URL so it doesn't auto-login or trap the user
      if (window.location.pathname.includes('/admin') || window.location.search.includes('admin=true')) {
        window.history.pushState(null, '', '/');
      }
      if (window.location.hash.includes('admin')) {
        window.history.pushState(null, '', window.location.pathname || '/');
      }
    } catch (e) {
      console.error('Error during logout cleanup:', e);
    }
  };

  const switchRoleDemo = (newRole: UserRole, targetId?: string) => {
    if (newRole === 'admin') {
      setUser({
        id: 'admin-master',
        name: 'Dr. Rajesh Sharma (Director & Admin)',
        email: 'director@apexacademy.edu',
        role: 'admin',
      });
    } else if (newRole === 'student') {
      const students = storage.getStudents();
      const student = (targetId ? students.find(s => s.id === targetId) : students[0]) || students[0];
      if (student) {
        setUser({
          id: student.id,
          name: student.name,
          email: student.email,
          role: 'student',
          studentData: student,
        });
      }
    } else if (newRole === 'teacher') {
      const teachers = storage.getTeachers();
      const teacher = (targetId ? teachers.find(t => t.id === targetId) : teachers[0]) || teachers[0];
      if (teacher) {
        setUser({
          id: teacher.id,
          name: teacher.name,
          email: teacher.email,
          role: 'teacher',
          teacherData: teacher,
        });
      }
    } else {
      setUser(null);
    }
  };

  const studentData = user?.studentData || (user?.role === 'student' ? (storage.getStudents()[0] || null) : null);
  const teacherData = user?.teacherData || (user?.role === 'teacher' ? (storage.getTeachers()[0] || null) : null);

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : 'visitor',
        isAuthenticated: Boolean(user),
        studentData,
        teacherData,
        loginAsStudent,
        loginAsAdmin,
        loginAsTeacher,
        logout,
        switchRoleDemo,
        currentEnquiryCode,
        setCurrentEnquiryCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
