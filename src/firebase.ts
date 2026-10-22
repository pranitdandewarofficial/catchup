import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCBmBwMwPhjV09eptE0vQUDrImg0M0ID1Y",
  authDomain: "jeesyllabus.firebaseapp.com",
  databaseURL: "https://jeesyllabus-default-rtdb.firebaseio.com",
  projectId: "jeesyllabus",
  storageBucket: "jeesyllabus.firebasestorage.app",
  messagingSenderId: "73665786095",
  appId: "1:73665786095:web:73470e653981aae2abeb1a",
  measurementId: "G-B4HY0GW9CQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const onAuthChange = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const saveProgress = async (userId: string, progress: Record<string, boolean>) => {
  try {
    await setDoc(doc(db, 'users', userId), { progress }, { merge: true });
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

export const loadProgress = (userId: string, callback: (progress: Record<string, boolean>) => void) => {
  return onSnapshot(doc(db, 'users', userId), (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data().progress || {});
    } else {
      callback({});
    }
  });
};

export const saveUserProfile = async (userId: string, profile: any) => {
  try {
    await setDoc(doc(db, 'profiles', userId), profile, { merge: true });
  } catch (error) {
    console.error('Error saving profile:', error);
  }
};

export const loadUserProfile = (userId: string, callback: (profile: any) => void) => {
  return onSnapshot(doc(db, 'profiles', userId), (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    } else {
      callback(null);
    }
  });
};

export const saveChatHistory = async (userId: string, messages: any[]) => {
  try {
    await setDoc(doc(db, 'chats', userId), { messages }, { merge: true });
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
};

export const loadChatHistory = (userId: string, callback: (messages: any[]) => void) => {
  return onSnapshot(doc(db, 'chats', userId), (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data().messages || []);
    } else {
      callback([]);
    }
  });
};

export const exportUserData = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    const profileDoc = await getDoc(doc(db, 'profiles', userId));
    const chatDoc = await getDoc(doc(db, 'chats', userId));
    
    return {
      progress: userDoc.exists() ? userDoc.data() : {},
      profile: profileDoc.exists() ? profileDoc.data() : {},
      chats: chatDoc.exists() ? chatDoc.data() : {}
    };
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
};

export const deleteAccount = async (userId: string) => {
  try {
    // Delete user data from Firestore
    await setDoc(doc(db, 'users', userId), {}, { merge: true });
    await setDoc(doc(db, 'profiles', userId), {}, { merge: true });
    await setDoc(doc(db, 'chats', userId), {}, { merge: true });
    
    // Delete Firebase Auth account
    const user = auth.currentUser;
    if (user) {
      await user.delete();
    }
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
};

export const resetQuizHistory = async (userId: string) => {
  try {
    await setDoc(doc(db, 'chats', userId), { messages: [] }, { merge: true });
  } catch (error) {
    console.error('Error resetting quiz history:', error);
  }
};

export const resetFlashcardProgress = async (userId: string) => {
  try {
    await setDoc(doc(db, 'users', userId), { flashcardProgress: {} }, { merge: true });
  } catch (error) {
    console.error('Error resetting flashcard progress:', error);
  }
};

export const resetChapterCompletion = async (userId: string) => {
  try {
    await setDoc(doc(db, 'users', userId), { progress: {} }, { merge: true });
  } catch (error) {
    console.error('Error resetting chapter completion:', error);
  }
};

export const resetStudyStats = async (userId: string) => {
  try {
    await setDoc(doc(db, 'users', userId), { stats: {} }, { merge: true });
  } catch (error) {
    console.error('Error resetting study stats:', error);
  }
};

export const resetAllProgress = async (userId: string) => {
  try {
    await setDoc(doc(db, 'users', userId), { progress: {}, flashcardProgress: {}, stats: {} }, { merge: true });
    await setDoc(doc(db, 'chats', userId), { messages: [] }, { merge: true });
  } catch (error) {
    console.error('Error resetting all progress:', error);
  }
};
