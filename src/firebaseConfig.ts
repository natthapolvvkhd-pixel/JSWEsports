/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  setDoc,
  doc, 
  getDocs,
  updateDoc
} from 'firebase/firestore';

/**
 * 🟠 ข้อมูลการเชื่อมต่อ Firebase (Firebase Configuration)
 * ให้นำเครื่องหมายคำพูดและแก้ไขค่าคอนฟิกเหล่านี้ที่ได้มาจาก Firebase Console
 * ของคุณมาวางตรงนี้
 */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// ตรวจสอบความพร้อมและป้องกันการ Initial ซ้ำซ้อนในสภาวะ Hot Module Replacement (HMR)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// เชื่อมต่อบริการ Cloud Firestore Database
export const db = getFirestore(app);

/**
 * ==========================================
 * ตัวอย่างฟังก์ชันสำหรับเชื่อมต่อและดึงข้อมูลแบบ Realtime (onSnapshot)
 * และการบันทึกข้อมูล (addDoc) ด้วย Firebase Firestore (v9 Modular)
 * ==========================================
 */

/**
 * 1. ฟังก์ชันสำหรับการเพิ่มข้อมูลทีมใหม่ (addDoc)
 * จะบันทึกข้อมูลลงในคอลเลกชัน "teams"
 */
export async function registerTeamFirebase(teamData: any) {
  try {
    const teamsCollectionRef = collection(db, 'teams');
    const docRef = await addDoc(teamsCollectionRef, {
      ...teamData,
      registeredAt: new Date().toISOString()
    });
    console.log("Team registered with ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding team to Firebase: ", error);
    return { success: false, error };
  }
}

/**
 * 2. ฟังก์ชันสำหรับการดึงข้อมูลทีมทั้งหมดแบบ Realtime (onSnapshot)
 * จะคอยอัปเดตข้อมูลอัตโนมัติเมื่อคอลเลกชัน "teams" บนคลาวด์มีการเปลี่ยนแปลง
 */
export function listenToTeamsFirebase(onUpdate: (teams: any[]) => void) {
  const teamsCollectionRef = collection(db, 'teams');
  const q = query(teamsCollectionRef, orderBy('registeredAt', 'desc'));

  // ฟังก์ชัน onSnapshot จะทำตัวเป็นผู้ฟังเหตุการณ์แบบเรียลไทม์
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const teams: any[] = [];
    querySnapshot.forEach((doc) => {
      teams.push({ id: doc.id, ...doc.data() });
    });
    console.log("Realtime teams updated from Firebase! count: ", teams.length);
    onUpdate(teams);
  }, (error) => {
    console.error("Error listening to teams: ", error);
  });

  // คืนค่า unsubscribe เพื่อให้นำไปล้าง Listener ใน useEffect Cleanup ของ React
  return unsubscribe;
}

/**
 * 3. ฟังก์ชันบันทึกผลการแข่งขัน (addDoc / setDoc)
 * สำหรับเกม ROV หรือ Free Fire
 */
export async function saveMatchResultFirebase(matchId: string, resultData: any) {
  try {
    const matchDocRef = doc(db, 'matches', matchId);
    await setDoc(matchDocRef, resultData, { merge: true });
    console.log(`Match ${matchId} successfully saved to Firebase.`);
    return { success: true };
  } catch (error) {
    console.error("Error saving match result to Firebase: ", error);
    return { success: false, error };
  }
}

/**
 * 4. ฟังก์ชันดึงข่าวสารประกาศ (onSnapshot)
 */
export function listenToAnnouncementsFirebase(onUpdate: (announcements: any[]) => void) {
  const announcementsRef = collection(db, 'announcements');
  const q = query(announcementsRef, orderBy('date', 'desc'));

  return onSnapshot(q, (querySnapshot) => {
    const list: any[] = [];
    querySnapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
    });
    onUpdate(list);
  }, (error) => {
    console.error("Error listening to announcements: ", error);
  });
}
