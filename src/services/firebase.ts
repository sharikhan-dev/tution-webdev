import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  setDoc,
  Firestore,
} from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged, Auth } from 'firebase/auth';
import { getMessaging, getToken, onMessage, isSupported, Messaging } from 'firebase/messaging';
import { getStorage, ref, uploadBytes, getDownloadURL, uploadString, FirebaseStorage } from 'firebase/storage';
import localFirebaseConfig from '../../firebase-applet-config.json';
import { StudyMaterial, Course, Batch, Teacher, Student, Enquiry, Notice, Test } from '../types';

const env = (import.meta as any).env || {};
export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || localFirebaseConfig.apiKey,
  authDomain: env.VITE_FIREBASE_PROJECT_ID ? `${env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com` : localFirebaseConfig.authDomain,
  projectId: env.VITE_FIREBASE_PROJECT_ID || localFirebaseConfig.projectId,
  storageBucket: env.VITE_FIREBASE_PROJECT_ID ? `${env.VITE_FIREBASE_PROJECT_ID}.appspot.com` : localFirebaseConfig.storageBucket,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || localFirebaseConfig.messagingSenderId,
  appId: env.VITE_FIREBASE_APP_ID || localFirebaseConfig.appId,
  firestoreDatabaseId: env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || (localFirebaseConfig as any).firestoreDatabaseId,
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore Database
export const db: Firestore = (firebaseConfig as any).firestoreDatabaseId
  ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId)
  : getFirestore(app);

// Initialize Firebase Storage for Cloud Files & Images
export const storageInstance: FirebaseStorage = getStorage(app);

// Initialize Firebase Auth
export const auth: Auth = getAuth(app);

// Sign in anonymously on startup for secure rules validation
signInAnonymously(auth).catch((err) => {
  console.warn('Firebase anonymous auth warning:', err.message);
});

// Firebase Cloud Messaging instance
let messagingInstance: Messaging | null = null;

export const initFCM = async (): Promise<string | null> => {
  try {
    const supported = await isSupported();
    if (!supported) {
      console.log('Firebase Cloud Messaging is not supported in this browser/environment.');
      return null;
    }
    if (!messagingInstance) {
      messagingInstance = getMessaging(app);
    }
    
    // Request notification permission
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(messagingInstance, {
          vapidKey: 'BEl62vp95WdFcSoSDbgDUTrgxSTkjxvd2IVW96AHnPbWAETcou136UZeIbgyw4050UVF',
        }).catch((tokenErr) => {
          console.log('FCM VAPID token retrieval note (using fallback token):', tokenErr);
          return `fcm_token_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;
        });

        // Listen for foreground FCM messages
        onMessage(messagingInstance, (payload) => {
          if (payload.notification) {
            new Notification(payload.notification.title || 'Apex Study Material Update', {
              body: payload.notification.body,
              icon: '/favicon.ico',
            });
          }
        });

        return token;
      }
    }
    return null;
  } catch (error) {
    console.log('FCM setup note:', error);
    return null;
  }
};

// ============================================================================
// FIREBASE CLOUD STORAGE SERVICE FOR FILES & IMAGES
// ============================================================================
export const firebaseCloudStorage = {
  /**
   * Upload an image or file to Firebase Storage (or Base64 Data URL fallback)
   */
  async uploadFile(file: File, folderName: string = 'uploads'): Promise<string> {
    try {
      const fileRef = ref(storageInstance, `${folderName}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`);
      const snapshot = await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      console.log(`Cloud file uploaded successfully to Firebase Storage: ${downloadUrl}`);
      return downloadUrl;
    } catch (error) {
      console.warn('Firebase Storage direct upload note (using fallback Base64 data URI):', error);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });
    }
  },

  /**
   * Upload Base64 image string to Firebase Storage
   */
  async uploadBase64(base64Data: string, fileName: string, folderName: string = 'images'): Promise<string> {
    try {
      const storageRef = ref(storageInstance, `${folderName}/${Date.now()}_${fileName}`);
      await uploadString(storageRef, base64Data, 'data_url');
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.warn('Base64 cloud upload fallback used:', error);
      return base64Data;
    }
  }
};

// Initial Seed Materials
export const INITIAL_FIREBASE_STUDY_MATERIALS: Omit<StudyMaterial, 'id'>[] = [
  {
    title: 'Class 12 Physics: Electrostatics & Gauss Law Handwritten Derivations',
    subject: 'Physics',
    description: 'Comprehensive physical classroom theory derivations, electric flux proofs, Coulomb law in vector form, and solved board numericals.',
    classSemester: 'Class 12',
    category: 'PDF Notes',
    driveUrl: 'https://drive.google.com/file/d/1B7B5w93bA9c_m8k7HqL9x_SamplePhysicsNotes/view?usp=sharing',
    date: '2026-08-10',
    chapter: 'Electrostatics',
    isPublished: true,
    fileSize: '4.8 MB',
    createdAt: new Date('2026-08-10T10:00:00Z').toISOString(),
    updatedAt: new Date('2026-08-10T10:00:00Z').toISOString(),
  },
  {
    title: 'Class 12 Mathematics: Calculus Continuity & Differentiability DPP 05',
    subject: 'Mathematics',
    description: 'Daily Practice Problem sheet containing 30 graded problems on chain rule, parametric differentiation, and logarithmic derivatives.',
    classSemester: 'Class 12',
    category: 'DPP',
    driveUrl: 'https://drive.google.com/file/d/1C8C6x94cB0d_n9l8IrM0y_SampleMathsDPP/view?usp=sharing',
    date: '2026-08-12',
    chapter: 'Calculus',
    isPublished: true,
    fileSize: '2.1 MB',
    createdAt: new Date('2026-08-12T14:30:00Z').toISOString(),
    updatedAt: new Date('2026-08-12T14:30:00Z').toISOString(),
  },
  {
    title: 'Class 12 Chemistry: Organic Reaction Mechanisms & Reagents Cheat Sheet',
    subject: 'Chemistry',
    description: 'High-yield roadmap covering SN1, SN2 mechanisms, Grignard reagents, Markovnikov additions, and named board reactions.',
    classSemester: 'Class 12',
    category: 'Formula Sheet',
    driveUrl: 'https://drive.google.com/file/d/1D9D7y95dC1e_o0m9JsN1z_SampleChemistrySheet/view?usp=sharing',
    date: '2026-08-13',
    chapter: 'Organic Chemistry',
    isPublished: true,
    fileSize: '3.4 MB',
    createdAt: new Date('2026-08-13T09:15:00Z').toISOString(),
    updatedAt: new Date('2026-08-13T09:15:00Z').toISOString(),
  },
];

// Seed Firestore collection if empty
export const seedFirestoreIfEmpty = async (): Promise<void> => {
  try {
    const materialsRef = collection(db, 'study_materials');
    const snapshot = await getDocs(materialsRef);
    if (snapshot.empty) {
      for (const item of INITIAL_FIREBASE_STUDY_MATERIALS) {
        await addDoc(materialsRef, item);
      }
      console.log('Firebase Firestore study_materials seeded successfully.');
    }
  } catch (error) {
    console.warn('Firestore seeding check:', error);
  }
};

// ============================================================================
// FIREBASE FIRESTORE DATA SERVICE FOR ALL ENTITIES
// ============================================================================
export const firestoreDataService = {
  /**
   * Save or update document in Firestore
   */
  async setDocument(collectionName: string, docId: string, data: any): Promise<void> {
    try {
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (err) {
      console.warn(`Firestore setDoc error for ${collectionName}/${docId}:`, err);
    }
  },

  /**
   * Get collection data snapshot from Firestore
   */
  async getCollectionData<T>(collectionName: string): Promise<T[]> {
    try {
      const collRef = collection(db, collectionName);
      const snapshot = await getDocs(collRef);
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as any),
      }));
    } catch (err) {
      console.warn(`Firestore getCollectionData error for ${collectionName}:`, err);
      return [];
    }
  },

  /**
   * Subscribe to real-time updates in Firestore
   */
  subscribeCollection<T>(collectionName: string, callback: (items: T[]) => void): () => void {
    const collRef = collection(db, collectionName);
    const unsubscribe = onSnapshot(
      collRef,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as any),
        }));
        callback(items);
      },
      (err) => console.warn(`Firestore subscription note for ${collectionName}:`, err)
    );
    return unsubscribe;
  },

  /**
   * Delete document from Firestore
   */
  async deleteDocument(collectionName: string, docId: string): Promise<void> {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn(`Firestore deleteDoc error for ${collectionName}/${docId}:`, err);
    }
  }
};

// Legacy material service export
export const firebaseStudyMaterialService = {
  async getAllMaterials(): Promise<StudyMaterial[]> {
    return firestoreDataService.getCollectionData<StudyMaterial>('study_materials');
  },

  subscribeMaterials(callback: (materials: StudyMaterial[]) => void): () => void {
    return firestoreDataService.subscribeCollection<StudyMaterial>('study_materials', callback);
  },

  async addMaterial(data: any): Promise<StudyMaterial> {
    const newDocRef = doc(collection(db, 'study_materials'));
    const payload = {
      id: newDocRef.id,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(newDocRef, payload);
    return payload as StudyMaterial;
  },

  async updateMaterial(id: string, data: any): Promise<void> {
    await firestoreDataService.setDocument('study_materials', id, data);
  },

  async deleteMaterial(id: string): Promise<void> {
    await firestoreDataService.deleteDocument('study_materials', id);
  },
};
