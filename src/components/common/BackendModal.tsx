import React, { useState, useEffect } from 'react';
import { Server, Database, Activity, RefreshCw, Download, CheckCircle2, XCircle, Zap, Shield, FileJson, Layers } from 'lucide-react';
import { apiService, BackendStatus } from '../../services/api';
import { storage } from '../../services/storage';
import { seedFirestoreIfEmpty } from '../../services/firebase';

interface BackendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendModal: React.FC<BackendModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<BackendStatus>(apiService.getBackendStatus());
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSeedingFirebase, setIsSeedingFirebase] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [activeTab, setActiveTab] = useState<'status' | 'explorer'>('status');

  // Snapshot counts
  const [counts, setCounts] = useState({
    courses: 0,
    batches: 0,
    students: 0,
    teachers: 0,
    enquiries: 0,
    studyMaterials: 0,
    tests: 0,
    notices: 0,
  });

  const refreshCounts = () => {
    setCounts({
      courses: storage.getCourses().length,
      batches: storage.getBatches().length,
      students: storage.getStudents().length,
      teachers: storage.getTeachers().length,
      enquiries: storage.getEnquiries().length,
      studyMaterials: storage.getStudyMaterials().length,
      tests: storage.getTests().length,
      notices: storage.getNotices('Public').length,
    });
  };

  useEffect(() => {
    if (isOpen) {
      refreshCounts();
      handleTestConnection();
    }
  }, [isOpen]);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setMessage(null);
    try {
      const res = await apiService.checkBackendHealth();
      setStatus(res);
      if (res.isConnected) {
        setMessage({ text: `Connected to Express API Server at ${res.apiBaseUrl}`, type: 'success' });
      } else {
        setMessage({ text: `Express API server offline at ${res.apiBaseUrl}. Running in LocalStorage Engine mode.`, type: 'info' });
      }
    } catch {
      setMessage({ text: 'Error testing connection.', type: 'error' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSyncToBackend = async () => {
    setIsSyncing(true);
    setMessage(null);
    try {
      const success = await apiService.syncWithBackend();
      if (success) {
        setMessage({ text: 'All local data successfully synchronized to Express Backend Server!', type: 'success' });
        handleTestConnection();
      } else {
        setMessage({ text: 'Sync failed. Make sure Express server is running (npm run dev / node server.js).', type: 'error' });
      }
    } catch (err: any) {
      setMessage({ text: `Sync error: ${err?.message || 'Failed to sync'}`, type: 'error' });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSeedFirebase = async () => {
    setIsSeedingFirebase(true);
    setMessage(null);
    try {
      await seedFirestoreIfEmpty();
      setMessage({ text: 'Firebase Firestore study_materials collection seeded successfully.', type: 'success' });
    } catch (err: any) {
      setMessage({ text: `Firebase seed error: ${err?.message || 'Check firebase configuration'}`, type: 'error' });
    } finally {
      setIsSeedingFirebase(false);
    }
  };

  const handleDownloadExport = () => {
    const data = {
      settings: storage.getSettings(),
      courses: storage.getCourses(),
      batches: storage.getBatches(),
      teachers: storage.getTeachers(),
      students: storage.getStudents(),
      enquiries: storage.getEnquiries(),
      studyMaterials: storage.getStudyMaterials(),
      tests: storage.getTests(),
      testResults: storage.getTestResults(),
      notices: storage.getNotices('Public'),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apex_coaching_db_export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Backend & Database Hub</h3>
              <p className="text-xs text-slate-400">Manage Express Server REST API, Firebase Firestore & LocalStorage Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('status')}
            className={`pb-2.5 px-4 font-semibold text-xs border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'status'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Connection Status</span>
          </button>

          <button
            onClick={() => setActiveTab('explorer')}
            className={`pb-2.5 px-4 font-semibold text-xs border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'explorer'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>See All Data Snapshot</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {message && (
            <div
              className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2.5 ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : message.type === 'error'
                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                  : 'bg-blue-50 text-blue-800 border border-blue-200'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : message.type === 'error' ? (
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              ) : (
                <Zap className="w-4 h-4 text-blue-600 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {activeTab === 'status' && (
            <>
              {/* Active Connection Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Express API Card */}
                <div
                  className={`p-4 rounded-xl border flex flex-col justify-between transition ${
                    status.isConnected
                      ? 'bg-emerald-50/50 border-emerald-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <Server className="w-3.5 h-3.5 text-blue-600" /> Express REST API
                      </span>
                      {status.isConnected ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200 text-slate-600">
                          Standby
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Endpoint: <code className="bg-slate-200/60 px-1 py-0.5 rounded">{status.apiBaseUrl}</code>
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500">
                    {status.isConnected ? `Last Ping: ${status.lastPingTime}` : 'Offline fallback active'}
                  </div>
                </div>

                {/* Firebase Firestore Card */}
                <div className="p-4 rounded-xl border bg-amber-50/40 border-amber-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-amber-600" /> Firebase Firestore
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                        Configured
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Collection: <code className="bg-amber-100/60 px-1 py-0.5 rounded">study_materials</code>
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-amber-200/60 text-[10px] text-amber-700">
                    Real-time listener initialized
                  </div>
                </div>

                {/* LocalStorage Engine Card */}
                <div className="p-4 rounded-xl border bg-blue-50/50 border-blue-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-blue-600" /> Client Engine
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800">
                        Ready
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Storage: <code className="bg-blue-100/60 px-1 py-0.5 rounded">LocalStorage Persistence</code>
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-blue-200/60 text-[10px] text-blue-700">
                    Instant offline fallback ready
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Backend Operations & Sync</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 text-white font-medium text-xs hover:bg-slate-800 transition disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                    <span>Ping Express Server</span>
                  </button>

                  <button
                    onClick={handleSyncToBackend}
                    disabled={isSyncing}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 text-white font-medium text-xs hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    <Zap className={`w-3.5 h-3.5 ${isSyncing ? 'animate-pulse' : ''}`} />
                    <span>Sync Local Data to Express API</span>
                  </button>

                  <button
                    onClick={handleSeedFirebase}
                    disabled={isSeedingFirebase}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-600 text-white font-medium text-xs hover:bg-amber-700 transition disabled:opacity-50"
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Seed Firebase Firestore</span>
                  </button>

                  <button
                    onClick={handleDownloadExport}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-medium text-xs hover:bg-emerald-700 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JSON DB Export</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'explorer' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Live Database Snapshot</h4>
                <button
                  onClick={refreshCounts}
                  className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Refresh Counts
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-2xl font-black text-slate-900">{counts.courses}</div>
                  <div className="text-xs font-medium text-slate-500">Courses</div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-2xl font-black text-slate-900">{counts.batches}</div>
                  <div className="text-xs font-medium text-slate-500">Batches</div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-2xl font-black text-purple-700">{counts.students}</div>
                  <div className="text-xs font-medium text-slate-500">Enrolled Students</div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-2xl font-black text-blue-700">{counts.teachers}</div>
                  <div className="text-xs font-medium text-slate-500">Faculty Members</div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-2xl font-black text-emerald-700">{counts.studyMaterials}</div>
                  <div className="text-xs font-medium text-slate-500">Study Materials</div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-2xl font-black text-amber-700">{counts.enquiries}</div>
                  <div className="text-xs font-medium text-slate-500">Enquiries</div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-2xl font-black text-indigo-700">{counts.tests}</div>
                  <div className="text-xs font-medium text-slate-500">Online Tests</div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-2xl font-black text-rose-700">{counts.notices}</div>
                  <div className="text-xs font-medium text-slate-500">Public Notices</div>
                </div>
              </div>

              <div className="p-4 bg-slate-900 text-slate-200 rounded-xl text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileJson className="w-4 h-4 text-blue-400" />
                  <span>Full JSON Schema & State Export Available</span>
                </div>
                <button
                  onClick={handleDownloadExport}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition"
                >
                  Export Data
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 font-semibold text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
