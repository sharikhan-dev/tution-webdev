import { storage } from './storage';

export interface BackendStatus {
  isConnected: boolean;
  serverName: string | null;
  lastPingTime: string | null;
  mode: 'express' | 'firebase' | 'local';
  apiBaseUrl: string;
}

const API_BASE_URL = typeof window !== 'undefined' && window.location.origin.includes('localhost:3000')
  ? 'http://localhost:5000'
  : ((import.meta as any).env?.VITE_API_URL || 'http://localhost:5000');

let currentStatus: BackendStatus = {
  isConnected: false,
  serverName: null,
  lastPingTime: null,
  mode: 'local',
  apiBaseUrl: API_BASE_URL,
};

/**
  Check backend health status
 */
export const checkBackendHealth = async (): Promise<BackendStatus> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      currentStatus = {
        isConnected: true,
        serverName: data.server || 'Express API Server',
        lastPingTime: new Date().toLocaleTimeString(),
        mode: 'express',
        apiBaseUrl: API_BASE_URL,
      };
    } else {
      currentStatus = {
        isConnected: false,
        serverName: null,
        lastPingTime: new Date().toLocaleTimeString(),
        mode: 'local',
        apiBaseUrl: API_BASE_URL,
      };
    }
  } catch (e) {
    currentStatus = {
      isConnected: false,
      serverName: null,
      lastPingTime: new Date().toLocaleTimeString(),
      mode: 'local',
      apiBaseUrl: API_BASE_URL,
    };
  }

  // Dispatch status event
  window.dispatchEvent(new CustomEvent('backend_status_changed', { detail: currentStatus }));
  return currentStatus;
};

/**
  Get current cached status
 */
export const getBackendStatus = (): BackendStatus => currentStatus;

/**
  Sync local data with backend Express API
 */
export const syncWithBackend = async (): Promise<boolean> => {
  try {
    const status = await checkBackendHealth();
    if (!status.isConnected) {
      console.log('Backend server not reachable; using LocalStorage persistence fallback.');
      return false;
    }

    const payload = {
      settings: storage.getSettings(),
      courses: storage.getCourses(),
      batches: storage.getBatches(),
      teachers: storage.getTeachers(),
      students: storage.getStudents(),
      enquiries: storage.getEnquiries(),
      study_materials: storage.getStudyMaterials(),
      tests: storage.getTests(),
      test_results: storage.getTestResults(),
      notices: storage.getNotices('Public'),
    };

    const res = await fetch(`${API_BASE_URL}/api/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      console.log('Successfully synced data with Express backend API.');
      return true;
    }
  } catch (err) {
    console.warn('Backend sync failed:', err);
  }
  return false;
};

/**
  Fetch full snapshot from backend Express API and populate local storage
 */
export const loadDataFromBackend = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/all`);
    if (res.ok) {
      const data = await res.json();
      if (data.courses) storage.saveCourses(data.courses);
      if (data.batches) storage.saveBatches(data.batches);
      if (data.teachers) storage.saveTeachers(data.teachers);
      if (data.students) storage.saveStudents(data.students);
      if (data.enquiries) storage.saveEnquiries(data.enquiries);
      if (data.study_materials) storage.saveStudyMaterials(data.study_materials);
      if (data.tests) storage.saveTests(data.tests);
      if (data.notices) storage.saveNotices(data.notices);
      if (data.settings) storage.saveSettings(data.settings);
      
      window.dispatchEvent(new Event('apex_data_changed'));
      return true;
    }
  } catch (err) {
    console.warn('Could not load data from Express backend:', err);
  }
  return false;
};

export const apiService = {
  checkBackendHealth,
  getBackendStatus,
  syncWithBackend,
  loadDataFromBackend,
};
