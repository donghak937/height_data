import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy, getDocs, writeBatch } from 'firebase/firestore';
import { sampleCharacters } from './sampleCharacters';

const COLLECTION_NAME = 'characters';

export const subscribeCharacters = (callback) => {
    // createdAt으로 정렬
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'asc'));
    return onSnapshot(q, (snapshot) => {
        const chars = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id // Firestore Document ID를 React key/id로 사용
        }));
        callback(chars);
    });
};

export const initializeDataIfNeeded = async () => {
    const colRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
        console.log("DB가 비어있어 데이터를 초기화합니다...");
        const batch = writeBatch(db);
        // 약 20개 미만이므로 batch 하나로 충분 (limit 500)
        sampleCharacters.forEach((char, index) => {
            const docRef = doc(colRef);
            // 기존 id(숫자)는 버리고, 순서 유지를 위해 index 기반 createdAt 흉내
            const { id, ...data } = char;
            batch.set(docRef, { ...data, createdAt: Date.now() + index });
        });
        await batch.commit();
        console.log("데이터 초기화 완료!");
    }
};

export const addCharacterDB = async (character) => {
    await addDoc(collection(db, COLLECTION_NAME), {
        ...character,
        createdAt: Date.now()
    });
};

export const updateCharacterDB = async (id, updates) => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, updates);
};

export const deleteCharacterDB = async (id) => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
};
